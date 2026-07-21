// ============================================================
//  CONTENIDO DEL CURSO  ·  YES EMS
//  ------------------------------------------------------------
//  GET  /api/contenido           versión pública (vitrina)
//  GET  /api/contenido/completo  requiere haber pagado
//  PUT  /api/contenido           solo administradores
// ============================================================
const express = require('express');
const { collections } = require('../db');
const { requireAuth, requireAdmin } = require('../security');

const router = express.Router();
const CONTENT_ID = 'acredita-bach';

// El contenido se sirve a cualquiera sin sesión, así que NUNCA puede llevar
// credenciales. El panel tenía campos para pegar el Access Token de Mercado
// Pago y quedaban guardados aquí, es decir, publicados: bastaba con abrir
// /api/contenido para leerlos.
//
// Se limpian al guardar y también al leer, para que los documentos que ya
// tuvieran un token dejen de exponerlo sin tener que tocar la base a mano.
const CAMPOS_PROHIBIDOS = [
  'mpAccessToken', 'mpPublicKey', 'accessToken', 'apiKey', 'apiSecret',
  'secret', 'token', 'password', 'privateKey',
];

function limpiarCredenciales(valor) {
  if (Array.isArray(valor)) return valor.map(limpiarCredenciales);
  if (valor && typeof valor === 'object') {
    const salida = {};
    for (const [k, v] of Object.entries(valor)) {
      if (CAMPOS_PROHIBIDOS.includes(k)) continue;
      salida[k] = limpiarCredenciales(v);
    }
    return salida;
  }
  return valor;
}

// ------------------------------------------------------------
//  Vitrina: lo que ve quien no ha pagado
// ------------------------------------------------------------
// Se conservan los títulos y la estructura, que es lo que hace atractivo el
// curso, y se quita todo lo que constituye el material en sí.
//
// Antes esto no existía: el temario completo, los 98 exámenes CON sus
// respuestas correctas y los enlaces a los PDFs viajaban a cualquier
// visitante dentro de los archivos .js del sitio. El candado era solo
// visual, así que bastaba abrir el código fuente para tener el curso entero
// sin pagar.
function versionPublica(data) {
  if (!data) return null;

  const modules = {};
  for (const [clave, area] of Object.entries(data.modules || {})) {
    modules[clave] = {
      title: area.title,
      guide: undefined,               // el PDF de la guía es material de pago
      intro: area.intro,
      subsections: (area.subsections || []).map((sub) => ({
        title: sub.title,
        topics: (sub.topics || []).map((t) => ({
          n: t.n,
          title: t.title,
          // def, concepts y example se omiten: son el contenido del curso.
          bloqueado: true,
        })),
      })),
    };
  }

  return {
    areasOrder: data.areasOrder || null,
    modules,
    quizzes: {},                      // ni preguntas ni respuestas
    pdfs: {},                         // ni enlaces a los PDFs
    subscription: data.subscription || null,
    esVitrina: true,
  };
}

// Quien ya pagó (o el administrador) recibe el documento completo.
function tieneAcceso(user) {
  if (!user) return false;
  const admins = (process.env.ADMIN_EMAILS || '')
    .split(',').map((e) => e.trim().toLowerCase()).filter(Boolean);
  if (admins.includes(String(user.email || '').toLowerCase())) return true;
  if (user.accessGranted !== true) return false;
  if (user.expiresAt && new Date(user.expiresAt) <= new Date()) return false;
  return true;
}

async function leerDoc() {
  const doc = await collections.content().findOne({ id: CONTENT_ID });
  return doc ? { data: limpiarCredenciales(doc.data), updatedAt: doc.updatedAt } : null;
}

// ---------- vitrina (pública) ----------
router.get('/', async (_req, res, next) => {
  try {
    const doc = await leerDoc();
    res.json({
      data: doc ? versionPublica(doc.data) : null,
      updatedAt: doc ? doc.updatedAt : null,
    });
  } catch (err) { next(err); }
});

// ---------- contenido completo (solo con acceso) ----------
router.get('/completo', requireAuth, async (req, res, next) => {
  try {
    if (!tieneAcceso(req.user)) {
      return res.status(403).json({
        error: 'Necesitas una suscripción activa para ver el material del curso.',
        requierePago: true,
      });
    }
    const doc = await leerDoc();
    res.json({
      data: doc ? doc.data : null,
      updatedAt: doc ? doc.updatedAt : null,
    });
  } catch (err) { next(err); }
});

// ---------- publicar (solo administradores) ----------
router.put('/', requireAuth, requireAdmin, async (req, res, next) => {
  try {
    const data = req.body && req.body.data;
    if (!data || typeof data !== 'object') {
      return res.status(400).json({ error: 'Falta el contenido a guardar.' });
    }
    const updatedAt = new Date();
    await collections.content().updateOne(
      { id: CONTENT_ID },
      { $set: { data: limpiarCredenciales(data), updatedAt, updatedBy: req.user.email } },
      { upsert: true },
    );
    res.json({ ok: true, updatedAt });
  } catch (err) { next(err); }
});

module.exports = router;
