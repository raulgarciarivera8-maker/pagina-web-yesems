// ============================================================
//  SUBIDA DE PDFs A CLOUD STORAGE  ·  YES EMS
//  ------------------------------------------------------------
//  Script de un solo uso: sube los PDFs de frontend/assets/pdfs/
//  al bucket de Firebase, en la carpeta pdfs/.
//
//  Cómo ejecutarlo (desde backend/):
//    1. Descarga la llave de servicio:
//         Firebase Console → engrane → Configuración del proyecto
//         → Cuentas de servicio → "Generar nueva clave privada"
//       Guárdala como  backend/serviceAccount.json
//       (ya está en .gitignore: NUNCA la subas al repositorio)
//
//    2. npm install --prefix functions
//       node scripts/upload-pdfs.js
//
//  Al terminar imprime el mapa nombre → URL pública.
// ============================================================
const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

const BUCKET = 'acreditabach.firebasestorage.app';
const SRC = path.join(__dirname, '..', '..', 'frontend', 'assets', 'pdfs');
const KEY = path.join(__dirname, '..', 'serviceAccount.json');

if (!fs.existsSync(KEY)) {
  console.error('\nFalta backend/serviceAccount.json. Lee las instrucciones al inicio de este archivo.\n');
  process.exit(1);
}

admin.initializeApp({
  credential: admin.credential.cert(require(KEY)),
  storageBucket: BUCKET,
});

const bucket = admin.storage().bucket();

// URL pública estable. Funciona porque storage.rules permite lectura
// abierta en pdfs/{archivo}; no lleva token, así que no caduca.
function publicUrl(name) {
  return `https://firebasestorage.googleapis.com/v0/b/${BUCKET}/o/${encodeURIComponent('pdfs/' + name)}?alt=media`;
}

(async () => {
  const files = fs.readdirSync(SRC).filter((f) => f.toLowerCase().endsWith('.pdf'));
  if (!files.length) {
    console.error('No se encontraron PDFs en', SRC);
    process.exit(1);
  }

  console.log(`Subiendo ${files.length} PDFs a gs://${BUCKET}/pdfs/ …\n`);
  const map = {};
  let subidos = 0;

  for (const name of files) {
    const local = path.join(SRC, name);
    try {
      await bucket.upload(local, {
        destination: 'pdfs/' + name,
        metadata: {
          contentType: 'application/pdf',
          // Un año de caché: son archivos que no cambian de contenido.
          cacheControl: 'public, max-age=31536000',
        },
      });
      map[name] = publicUrl(name);
      subidos++;
      console.log(`  ✔ ${name}`);
    } catch (e) {
      console.error(`  ✘ ${name} — ${e.message}`);
    }
  }

  const out = path.join(__dirname, 'pdf-urls.json');
  fs.writeFileSync(out, JSON.stringify(map, null, 2));

  console.log(`\n${subidos}/${files.length} subidos.`);
  console.log(`Mapa de URLs escrito en ${out}`);
  if (subidos < files.length) {
    console.log('\nHubo fallos: revísalos antes de borrar los PDFs del repositorio.');
    process.exit(1);
  }
  process.exit(0);
})();
