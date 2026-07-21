// ============================================================
//  CONTENIDO DEL CURSO  ·  YES EMS
//  ------------------------------------------------------------
//  GET  /api/contenido    lo lee cualquiera (alumnos y visitantes)
//  PUT  /api/contenido    solo administradores
//
//  Sustituye a la tabla site_content de Firestore.
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

router.get('/', async (_req, res, next) => {
  try {
    const doc = await collections.content().findOne({ id: CONTENT_ID });
    // Sin contenido publicado, el frontend usa sus valores de fábrica.
    res.json({
      data: doc ? limpiarCredenciales(doc.data) : null,
      updatedAt: doc ? doc.updatedAt : null,
    });
  } catch (err) { next(err); }
});

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
