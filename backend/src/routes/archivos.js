// ============================================================
//  SUBIDA DE ARCHIVOS  ·  YES EMS  (Cloudinary)
//  ------------------------------------------------------------
//  POST /api/archivos/firma   devuelve una firma temporal (solo admin)
//
//  El navegador NO recibe la API Secret: pide esta firma y con ella
//  sube el archivo directo a Cloudinary. Así el secreto se queda en
//  Render y el archivo no pasa por el servidor, que en el plan free
//  tarda en despertar.
//
//  Variables de entorno:
//    CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET
// ============================================================
const express = require('express');
const crypto = require('crypto');
const { requireAuth, requireAdmin } = require('../security');

const router = express.Router();

const CLOUD = process.env.CLOUDINARY_CLOUD_NAME;
const KEY = process.env.CLOUDINARY_API_KEY;
const SECRET = process.env.CLOUDINARY_API_SECRET;
const FOLDER = 'yesems/pdfs';

router.post('/firma', requireAuth, requireAdmin, (req, res) => {
  if (!CLOUD || !KEY || !SECRET) {
    return res.status(503).json({ error: 'La subida de archivos aún no está configurada.' });
  }

  const timestamp = Math.floor(Date.now() / 1000);

  // Cloudinary firma los parámetros ordenados alfabéticamente, unidos como
  // clave=valor con &, y con el secreto pegado al final (SHA-1).
  // resource_type NO se firma: viaja en la ruta de la URL, no como parámetro.
  //
  // La carpeta la fija el servidor, no el navegador: así el panel no puede
  // escribir en otras partes de la cuenta de Cloudinary.
  const aFirmar = `folder=${FOLDER}&timestamp=${timestamp}`;
  const signature = crypto.createHash('sha1').update(aFirmar + SECRET).digest('hex');

  res.json({
    signature,
    timestamp,
    apiKey: KEY,
    cloudName: CLOUD,
    folder: FOLDER,
    // La firma vale poco tiempo: Cloudinary rechaza timestamps viejos.
    uploadUrl: `https://api.cloudinary.com/v1_1/${CLOUD}/raw/upload`,
  });
});

module.exports = router;
