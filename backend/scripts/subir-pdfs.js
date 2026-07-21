// ============================================================
//  SUBIR LOS PDFs A CLOUDINARY  ·  YES EMS
//  ------------------------------------------------------------
//  Script de un solo uso. Sube los PDFs de frontend/assets/pdfs/ a
//  Cloudinary en modo "authenticated": no tienen URL pública, solo
//  se pueden abrir con un enlace firmado y temporal que genera la
//  API tras comprobar que el alumno pagó.
//
//  Hasta ahora estaban en Vercel con direcciones adivinables
//  (/assets/pdfs/guia_humanidades.pdf), asi que ocultar el enlace en
//  la pagina no servia de nada.
//
//  Ejecutar desde backend/:
//     node scripts/subir-pdfs.js
//
//  Necesita en backend/.env:
//     CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET
//     MONGODB_URI   (para dejar apuntados los nuevos identificadores)
// ============================================================
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const cloudinary = require('cloudinary').v2;

const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } = process.env;
if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
  console.error('\nFaltan las credenciales de Cloudinary en backend/.env\n');
  process.exit(1);
}

cloudinary.config({
  cloud_name: CLOUDINARY_CLOUD_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET,
  secure: true,
});

const ORIGEN = path.join(__dirname, '..', '..', 'frontend', 'assets', 'pdfs');
const CARPETA = 'yesems/pdfs';

(async () => {
  if (!fs.existsSync(ORIGEN)) {
    console.error('\nNo se encontró', ORIGEN, '\n');
    process.exit(1);
  }
  const archivos = fs.readdirSync(ORIGEN).filter((f) => f.toLowerCase().endsWith('.pdf'));
  if (!archivos.length) {
    console.error('\nNo hay PDFs que subir.\n');
    process.exit(1);
  }

  console.log(`\nSubiendo ${archivos.length} PDFs a Cloudinary (modo privado)…\n`);
  const mapa = {};
  let ok = 0;

  for (const nombre of archivos) {
    const base = nombre.replace(/\.pdf$/i, '');
    try {
      const r = await cloudinary.uploader.upload(path.join(ORIGEN, nombre), {
        resource_type: 'raw',
        // "authenticated" es la clave: sin firma, Cloudinary no lo entrega.
        type: 'authenticated',
        folder: CARPETA,
        public_id: base,
        overwrite: true,
      });
      mapa[nombre] = r.public_id;
      ok++;
      console.log(`  ✔ ${nombre}`);
    } catch (e) {
      console.error(`  ✘ ${nombre} — ${e.message}`);
    }
  }

  const salida = path.join(__dirname, 'pdfs-subidos.json');
  fs.writeFileSync(salida, JSON.stringify(mapa, null, 1));

  console.log(`\n${ok}/${archivos.length} subidos.`);
  console.log(`Identificadores guardados en ${salida}`);

  if (ok === archivos.length) {
    console.log('\nComprobación: ninguno debe ser accesible sin firma.');
    const ejemplo = Object.values(mapa)[0];
    const publica = cloudinary.url(ejemplo, { resource_type: 'raw', type: 'authenticated' });
    console.log('  URL sin firmar (debe dar 401):', publica);
    console.log('\nYa puedes borrar frontend/assets/pdfs/ del repositorio.\n');
  } else {
    console.log('\nHubo fallos: revísalos antes de borrar nada.\n');
    process.exit(1);
  }
  process.exit(0);
})();
