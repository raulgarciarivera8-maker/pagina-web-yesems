// ============================================================
//  PAGOS  ·  YES EMS  (Mercado Pago)
//  ------------------------------------------------------------
//  POST /api/pagos/preferencia   crea el checkout (requiere sesión)
//  POST /api/pagos/webhook       aviso de pago de Mercado Pago
//
//  Sustituye a las Cloud Functions createPreference y
//  mercadopagoWebhook.
// ============================================================
const express = require('express');
const crypto = require('crypto');
const { ObjectId } = require('mongodb');
const { collections } = require('../db');
const { requireAuth } = require('../security');

const router = express.Router();

const MP_TOKEN = process.env.MERCADO_PAGO_ACCESS_TOKEN;
const MP_SECRET = process.env.MERCADO_PAGO_WEBHOOK_SECRET;
const SITE = (process.env.SITE_URL || 'https://pagina-web-yesems.vercel.app').replace(/\/$/, '');
const API = (process.env.API_URL || '').replace(/\/$/, '');

// Valores de respaldo, por si aún no se ha publicado contenido.
const PLANES = {
  'acredita-bach': {
    title: 'Acredita-Bach · YES EMS',
    description: 'Curso completo de preparación para el examen CENEVAL Acredita-Bach',
    price: 50,
  },
};

// El precio SIEMPRE se lee de la base de datos, nunca de lo que mande el
// navegador: si el importe viniera en la petición, cualquiera podría
// editarlo y pagar un peso.
//
// Antes estaba escrito a mano aquí, mientras que el panel editaba otro
// campo distinto: la página anunciaba un precio y Mercado Pago cobraba otro.
async function precioDelPlan(planKey) {
  const respaldo = (PLANES[planKey] || PLANES['acredita-bach']).price;
  try {
    const doc = await collections.content().findOne({ id: 'acredita-bach' });
    const sub = doc && doc.data && doc.data.subscription;
    if (!sub) return respaldo;

    // El panel guarda el precio como texto ("150", "1,200", "$150").
    const bruto = String(sub.price == null ? '' : sub.price).replace(/[^0-9.]/g, '');
    const num = parseFloat(bruto);

    // Un precio inválido o cero cobraría de menos sin avisar: mejor el respaldo.
    if (!isFinite(num) || num <= 0) {
      console.warn(`Precio no válido en el contenido ("${sub.price}"); se usa ${respaldo}`);
      return respaldo;
    }
    return num;
  } catch (e) {
    console.error('No se pudo leer el precio del contenido:', e.message);
    return respaldo;
  }
}

// ---------- crear preferencia ----------
router.post('/preferencia', requireAuth, async (req, res, next) => {
  try {
    if (!MP_TOKEN) {
      return res.status(503).json({ error: 'Los pagos aún no están configurados.' });
    }

    const planKey = PLANES[req.body && req.body.plan] ? req.body.plan : 'acredita-bach';
    const plan = PLANES[planKey];
    const precio = await precioDelPlan(planKey);

    // El comprador sale de la sesión, nunca del cuerpo de la petición:
    // así nadie puede generar un pago a nombre de otra persona.
    const { email, _id } = req.user;

    const preferencia = {
      items: [{
        id: planKey,
        title: plan.title,
        description: plan.description,
        quantity: 1,
        currency_id: 'MXN',
        unit_price: precio,
      }],
      payer: { email },
      back_urls: {
        success: `${SITE}/acredita-bach.html?payment=success`,
        failure: `${SITE}/acredita-bach.html?payment=failure`,
        pending: `${SITE}/acredita-bach.html?payment=pending`,
      },
      auto_return: 'approved',
      external_reference: JSON.stringify({ uid: String(_id), email, plan: planKey }),
      notification_url: `${API}/api/pagos/webhook`,
      payment_methods: { excluded_payment_types: [], installments: 1 },
    };

    const r = await fetch('https://api.mercadopago.com/checkout/preferences', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${MP_TOKEN}` },
      body: JSON.stringify(preferencia),
    });

    if (!r.ok) {
      console.error('Mercado Pago:', r.status, await r.text());
      return res.status(502).json({ error: 'No se pudo iniciar el pago' });
    }

    const data = await r.json();
    res.json({ preference_id: data.id, init_point: data.init_point });
  } catch (err) { next(err); }
});

// ---------- webhook ----------
// Verifica la firma x-signature. Sin esto, cualquiera que descubra la URL
// podría avisar de un pago falso y regalarse el acceso.
function firmaValida(req) {
  if (!MP_SECRET) return true;   // sin secreto configurado no podemos validar
  const partes = Object.fromEntries(
    (req.get('x-signature') || '').split(',').map((p) => p.split('=').map((s) => s.trim())),
  );
  const ts = partes.ts;
  const v1 = partes.v1;
  if (!ts || !v1) return false;

  const dataId = String(
    req.query['data.id'] || (req.body && req.body.data && req.body.data.id) || '',
  ).toLowerCase();
  const manifest = `id:${dataId};request-id:${req.get('x-request-id') || ''};ts:${ts};`;
  const esperado = crypto.createHmac('sha256', MP_SECRET).update(manifest).digest('hex');
  try {
    return crypto.timingSafeEqual(Buffer.from(esperado), Buffer.from(v1));
  } catch { return false; }
}

router.post('/webhook', async (req, res) => {
  try {
    if (!firmaValida(req)) {
      console.warn('Webhook con firma inválida — descartado');
      return res.status(401).json({ error: 'Firma inválida' });
    }

    const { type, data } = req.body || {};
    if (type !== 'payment' || !data || !data.id) {
      return res.status(200).json({ ok: true, ignored: true });
    }

    // Consultamos el pago a Mercado Pago: no confiamos en el cuerpo del
    // aviso para decidir si el pago fue aprobado.
    const r = await fetch(`https://api.mercadopago.com/v1/payments/${data.id}`, {
      headers: { Authorization: `Bearer ${MP_TOKEN}` },
    });
    if (!r.ok) {
      console.error('No se pudo verificar el pago:', r.status);
      return res.status(502).json({ error: 'Error al verificar el pago' });
    }

    const pago = await r.json();
    if (pago.status !== 'approved') {
      return res.status(200).json({ ok: true, status: pago.status });
    }

    let uid = null;
    let email = pago.payer && pago.payer.email;
    let plan = 'acredita-bach';
    try {
      const ref = JSON.parse(pago.external_reference || '{}');
      uid = ref.uid || null;
      email = ref.email || email;
      plan = ref.plan || plan;
    } catch { /* referencia sin estructura: usamos el email del pagador */ }

    const expiresAt = new Date();
    expiresAt.setFullYear(expiresAt.getFullYear() + 1);

    const cambios = {
      plan,
      accessGranted: true,
      paymentId: String(pago.id),
      paymentStatus: pago.status,
      expiresAt,
      updatedAt: new Date(),
    };

    // Preferimos el id de usuario; el correo es el respaldo.
    let filtro = null;
    if (uid) { try { filtro = { _id: new ObjectId(uid) }; } catch {} }
    if (!filtro && email) filtro = { email: String(email).toLowerCase() };

    if (!filtro) {
      console.error('Pago sin usuario identificable:', pago.id);
      return res.status(400).json({ error: 'Usuario no encontrado' });
    }

    const r2 = await collections.users().updateOne(filtro, { $set: cambios });
    if (r2.matchedCount === 0) {
      // Pagó con un correo distinto al de su cuenta: hay que revisarlo a mano.
      console.error('Pago aprobado sin cuenta asociada:', pago.id, email);
      return res.status(200).json({ ok: true, orphan: true });
    }

    console.log(`Acceso otorgado (pago ${pago.id})`);
    res.status(200).json({ ok: true });
  } catch (err) {
    console.error('webhook:', err);
    res.status(500).json({ error: 'Error interno' });
  }
});

module.exports = router;
