// ============================================================
//  SEMBRAR EL CONTENIDO DEL CURSO  ·  YES EMS
//  ------------------------------------------------------------
//  Script de un solo uso. Sube a MongoDB el temario completo, los
//  exámenes y los PDFs que hasta ahora vivían en archivos servidos
//  públicamente, donde cualquiera podía leerlos sin pagar.
//
//  Ejecutar desde backend/:
//     node scripts/seed-contenido.js
//
//  Necesita MONGODB_URI en el entorno o en backend/.env
//
//  No pisa el contenido existente salvo que se pase --forzar:
//     node scripts/seed-contenido.js --forzar
// ============================================================
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { MongoClient } = require('mongodb');

const URI = process.env.MONGODB_URI;
const DB = process.env.MONGODB_DB || 'yesems';
const CONTENT_ID = 'acredita-bach';
const forzar = process.argv.includes('--forzar');

if (!URI) {
  console.error('\nFalta MONGODB_URI. Ponlo en backend/.env o en el entorno.\n');
  process.exit(1);
}

const archivo = path.join(__dirname, '..', 'seed', 'contenido.json');
if (!fs.existsSync(archivo)) {
  console.error('\nNo se encontró', archivo, '\n');
  process.exit(1);
}

(async () => {
  const data = JSON.parse(fs.readFileSync(archivo, 'utf8'));

  const areas = Object.keys(data.modules || {}).length;
  let temas = 0;
  Object.values(data.modules || {}).forEach((m) =>
    (m.subsections || []).forEach((s) => { temas += (s.topics || []).length; }));

  const cliente = new MongoClient(URI);
  await cliente.connect();
  const col = cliente.db(DB).collection('site_content');

  const actual = await col.findOne({ id: CONTENT_ID });
  if (actual && actual.data && Object.keys(actual.data).length && !forzar) {
    console.log('\nYa hay contenido publicado. No se toca nada.');
    console.log('Si de verdad quieres reemplazarlo:  node scripts/seed-contenido.js --forzar\n');
    await cliente.close();
    process.exit(0);
  }

  await col.updateOne(
    { id: CONTENT_ID },
    { $set: { data, updatedAt: new Date(), updatedBy: 'seed' } },
    { upsert: true },
  );

  console.log(`\nContenido publicado: ${areas} áreas, ${temas} temas, ` +
              `${Object.keys(data.quizzes || {}).length} exámenes.\n`);
  await cliente.close();
  process.exit(0);
})().catch((e) => {
  console.error('\nFalló la siembra:', e.message, '\n');
  process.exit(1);
});
