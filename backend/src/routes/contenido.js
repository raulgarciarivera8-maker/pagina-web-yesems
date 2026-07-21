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

router.get('/', async (_req, res, next) => {
  try {
    const doc = await collections.content().findOne({ id: CONTENT_ID });
    // Sin contenido publicado, el frontend usa sus valores de fábrica.
    res.json({ data: doc ? doc.data : null, updatedAt: doc ? doc.updatedAt : null });
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
      { $set: { data, updatedAt, updatedBy: req.user.email } },
      { upsert: true },
    );
    res.json({ ok: true, updatedAt });
  } catch (err) { next(err); }
});

module.exports = router;
