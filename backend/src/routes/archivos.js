// ============================================================
//  ARCHIVOS  ·  YES EMS  (Cloudinary)
//  ------------------------------------------------------------
//  POST /api/archivos/firma    firma para subir     (solo admin)
//  POST /api/archivos/abrir    enlace temporal      (requiere pago)
//
//  Variables de entorno:
//    CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET
// ============================================================
const express = require('express');
const crypto = require('crypto');
const cloudinary = require('cloudinary').v2;
const { requireAuth, requireAdmin } = require('../security');

const router = express.Router();

const CLOUD = process.env.CLOUDINARY_CLOUD_NAME;
const KEY = process.env.CLOUDINARY_API_KEY;
const SECRET = process.env.CLOUDINARY_API_SECRET;
const FOLDER = 'yesems/pdfs';

// Cuánto vive el enlace de descarga. Suficiente para abrir el PDF, poco
// para que sirva de mucho si alguien lo comparte por ahí.
const MINUTOS_VALIDO = 15;

if (CLOUD && KEY && SECRET) {
  cloudinary.config({ cloud_name: CLOUD, api_key: KEY, api_secret: SECRET, secure: true });
}

function configurado() {
  return !!(CLOUD && KEY && SECRET);
}

// Repetimos aquí la comprobación de acceso: quien no pagó no debe poder
// pedir el enlace de un PDF, aunque conozca su nombre.
function tieneAcceso(user) {
  if (!user) return false;
  const admins = (process.env.ADMIN_EMAILS || '')
    .split(',').map((e) => e.trim().toLowerCase()).filter(Boolean);
  if (admins.includes(String(user.email || '').toLowerCase())) return true;
  if (user.accessGranted !== true) return false;
  if (user.expiresAt && new Date(user.expiresAt) <= new Date()) return false;
  return true;
}

// ------------------------------------------------------------
//  Subir (panel de administración)
// ------------------------------------------------------------
router.post('/firma', requireAuth, requireAdmin, (req, res) => {
  if (!configurado()) {
    return res.status(503).json({ error: 'La subida de archivos aún no está configurada.' });
  }

  const timestamp = Math.floor(Date.now() / 1000);

  // Los archivos nuevos se suben también como "authenticated", igual que los
  // que ya están: si se subieran públicos, volveríamos al problema de tener
  // material de pago con una URL abierta.
  const aFirmar = `folder=${FOLDER}&timestamp=${timestamp}&type=authenticated`;
  const signature = crypto.createHash('sha1').update(aFirmar + SECRET).digest('hex');

  res.json({
    signature,
    timestamp,
    apiKey: KEY,
    cloudName: CLOUD,
    folder: FOLDER,
    type: 'authenticated',
    uploadUrl: `https://api.cloudinary.com/v1_1/${CLOUD}/raw/upload`,
  });
});

// ------------------------------------------------------------
//  Abrir (alumnos con suscripción)
// ------------------------------------------------------------
// Devuelve una URL firmada y caducable. El PDF no tiene dirección pública:
// antes vivía en /assets/pdfs/ con un nombre adivinable, así que ocultar el
// enlace en la página no protegía nada.
router.post('/abrir', requireAuth, (req, res, next) => {
  try {
    if (!configurado()) {
      return res.status(503).json({ error: 'Los archivos aún no están configurados.' });
    }
    if (!tieneAcceso(req.user)) {
      return res.status(403).json({
        error: 'Necesitas una suscripción activa para abrir el material.',
        requierePago: true,
      });
    }

    const id = String((req.body && req.body.id) || '').trim();
    if (!id) return res.status(400).json({ error: 'Falta indicar el archivo.' });

    // Solo se sirven archivos de nuestra carpeta: sin esto, alguien podría
    // pedir cualquier cosa de la cuenta de Cloudinary.
    const publicId = id.startsWith(FOLDER + '/') ? id : `${FOLDER}/${id.replace(/^\/+/, '')}`;
    if (publicId.includes('..')) {
      return res.status(400).json({ error: 'Archivo no válido.' });
    }

    const url = cloudinary.utils.private_download_url(publicId, '', {
      resource_type: 'raw',
      type: 'authenticated',
      expires_at: Math.floor(Date.now() / 1000) + MINUTOS_VALIDO * 60,
    });

    res.json({ url, expiraEn: MINUTOS_VALIDO * 60 });
  } catch (err) { next(err); }
});

module.exports = router;
