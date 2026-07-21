// ============================================================
//  CLOUD FUNCTIONS  ·  YES EMS
//  ------------------------------------------------------------
//  createPreference     — crea el checkout de Mercado Pago
//  mercadopagoWebhook   — recibe el aviso de pago y otorga el acceso
//
//  Secretos (NO van en el código, se configuran una sola vez):
//    firebase functions:secrets:set MERCADO_PAGO_ACCESS_TOKEN
//    firebase functions:secrets:set MERCADO_PAGO_WEBHOOK_SECRET
//
//  Variable de entorno (backend/functions/.env):
//    SITE_URL=https://pagina-web-yesems.vercel.app
// ============================================================
const { onRequest } = require('firebase-functions/v2/https');
const { defineSecret, defineString } = require('firebase-functions/params');
const admin = require('firebase-admin');
const crypto = require('crypto');

admin.initializeApp();
const db = admin.firestore();

const MP_TOKEN = defineSecret('MERCADO_PAGO_ACCESS_TOKEN');
const MP_WEBHOOK_SECRET = defineSecret('MERCADO_PAGO_WEBHOOK_SECRET');
const SITE_URL = defineString('SITE_URL', {
  default: 'https://pagina-web-yesems.vercel.app',
});

const PLAN = {
  'acredita-bach': {
    title: 'Acredita-Bach · YES EMS',
    description: 'Curso completo de preparación para el examen CENEVAL Acredita-Bach',
    price: 50,
  },
};

// Solo nuestro sitio puede llamar a estas funciones.
function applyCors(req, res) {
  const allowed = [SITE_URL.value(), 'http://localhost:3000', 'http://localhost:5173'];
  const origin = req.get('origin');
  if (origin && allowed.includes(origin)) {
    res.set('Access-Control-Allow-Origin', origin);
  }
  res.set('Vary', 'Origin');
  res.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
}

// ============================================================
//  createPreference
// ============================================================
exports.createPreference = onRequest(
  { secrets: [MP_TOKEN], region: 'us-central1', cors: false },
  async (req, res) => {
    applyCors(req, res);
    if (req.method === 'OPTIONS') return res.status(204).send('');
    if (req.method !== 'POST') return res.status(405).json({ error: 'Método no permitido' });

    try {
      // El comprador se toma del token de Firebase, NO del cuerpo del
      // request: así nadie puede generar un pago a nombre de otra persona.
      const authHeader = req.get('authorization') || '';
      const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
      if (!token) {
        return res.status(401).json({ error: 'Inicia sesión para continuar' });
      }

      let decoded;
      try {
        decoded = await admin.auth().verifyIdToken(token);
      } catch (e) {
        return res.status(401).json({ error: 'Sesión inválida o expirada' });
      }

      const email = decoded.email;
      if (!email) return res.status(400).json({ error: 'Tu cuenta no tiene correo asociado' });

      const planId = req.body && req.body.plan;
      const plan = PLAN[planId] || PLAN['acredita-bach'];
      const planKey = PLAN[planId] ? planId : 'acredita-bach';

      const site = SITE_URL.value().replace(/\/$/, '');
      const preference = {
        items: [{
          id: planKey,
          title: plan.title,
          description: plan.description,
          quantity: 1,
          currency_id: 'MXN',
          unit_price: plan.price,
        }],
        payer: { email },
        back_urls: {
          success: `${site}/acredita-bach.html?payment=success`,
          failure: `${site}/acredita-bach.html?payment=failure`,
          pending: `${site}/acredita-bach.html?payment=pending`,
        },
        auto_return: 'approved',
        // El uid es la referencia de confianza: el webhook la usa para saber
        // a qué cuenta darle el acceso, sin fiarse de nada del navegador.
        external_reference: JSON.stringify({ uid: decoded.uid, email, plan: planKey }),
        notification_url: `https://us-central1-${process.env.GCLOUD_PROJECT}.cloudfunctions.net/mercadopagoWebhook`,
        payment_methods: { excluded_payment_types: [], installments: 1 },
      };

      const mp = await fetch('https://api.mercadopago.com/checkout/preferences', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${MP_TOKEN.value()}`,
        },
        body: JSON.stringify(preference),
      });

      if (!mp.ok) {
        console.error('Mercado Pago error:', mp.status, await mp.text());
        return res.status(502).json({ error: 'No se pudo iniciar el pago' });
      }

      const data = await mp.json();
      return res.status(200).json({
        preference_id: data.id,
        init_point: data.init_point,
      });
    } catch (err) {
      console.error('createPreference:', err);
      return res.status(500).json({ error: 'Error interno del servidor' });
    }
  },
);

// ============================================================
//  mercadopagoWebhook
// ============================================================
// Verifica la firma que envía Mercado Pago en la cabecera x-signature.
// Sin esto, cualquiera podría llamar a esta URL y regalarse el acceso.
function validSignature(req, secret) {
  if (!secret) return true; // sin secreto configurado no podemos validar
  const sig = req.get('x-signature') || '';
  const requestId = req.get('x-request-id') || '';
  const parts = Object.fromEntries(
    sig.split(',').map((p) => p.split('=').map((s) => s.trim())),
  );
  const ts = parts.ts;
  const hash = parts.v1;
  if (!ts || !hash) return false;

  const dataId = (req.query['data.id'] || (req.body && req.body.data && req.body.data.id) || '')
    .toString().toLowerCase();
  const manifest = `id:${dataId};request-id:${requestId};ts:${ts};`;
  const expected = crypto.createHmac('sha256', secret).update(manifest).digest('hex');
  try {
    return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(hash));
  } catch { return false; }
}

exports.mercadopagoWebhook = onRequest(
  { secrets: [MP_TOKEN, MP_WEBHOOK_SECRET], region: 'us-central1', cors: false },
  async (req, res) => {
    try {
      if (!validSignature(req, MP_WEBHOOK_SECRET.value())) {
        console.warn('Webhook con firma inválida — descartado');
        return res.status(401).json({ error: 'Firma inválida' });
      }

      const { type, data } = req.body || {};
      if (type !== 'payment' || !data || !data.id) {
        return res.status(200).json({ ok: true, ignored: true });
      }

      // Consultamos el pago a Mercado Pago: nunca confiamos en el cuerpo
      // del webhook para saber si el pago fue aprobado.
      const mp = await fetch(`https://api.mercadopago.com/v1/payments/${data.id}`, {
        headers: { Authorization: `Bearer ${MP_TOKEN.value()}` },
      });
      if (!mp.ok) {
        console.error('No se pudo verificar el pago:', mp.status);
        return res.status(502).json({ error: 'Error al verificar el pago' });
      }

      const payment = await mp.json();
      if (payment.status !== 'approved') {
        return res.status(200).json({ ok: true, status: payment.status });
      }

      let uid = null;
      let email = payment.payer && payment.payer.email;
      let plan = 'acredita-bach';
      try {
        const ref = JSON.parse(payment.external_reference || '{}');
        uid = ref.uid || null;
        email = ref.email || email;
        plan = ref.plan || plan;
      } catch { /* referencia no estructurada: usamos el email del pagador */ }

      if (!email) {
        console.error('Pago sin email identificable:', payment.id);
        return res.status(400).json({ error: 'Email no encontrado' });
      }

      const expiresAt = new Date();
      expiresAt.setFullYear(expiresAt.getFullYear() + 1);

      const key = email.toLowerCase();
      await db.collection('user_access').doc(key).set({
        uid,
        email: key,
        plan,
        access_granted: true,
        payment_id: String(payment.id),
        payment_status: payment.status,
        expires_at: expiresAt.toISOString(),
        updated_at: new Date().toISOString(),
      }, { merge: true });

      console.log(`Acceso otorgado a ${key} (pago ${payment.id})`);
      return res.status(200).json({ ok: true });
    } catch (err) {
      console.error('mercadopagoWebhook:', err);
      return res.status(500).json({ error: 'Error interno' });
    }
  },
);
