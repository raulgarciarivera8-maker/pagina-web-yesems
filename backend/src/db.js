// ============================================================
//  CONEXIÓN A MONGODB  ·  YES EMS
//  ------------------------------------------------------------
//  Una sola conexión reutilizada por todo el proceso. Render
//  mantiene el servidor vivo, así que no hace falta reconectar
//  en cada petición (eso agotaría el pool de Atlas M0).
// ============================================================
const { MongoClient } = require('mongodb');

const URI = process.env.MONGODB_URI;
const DB_NAME = process.env.MONGODB_DB || 'yesems';

if (!URI) {
  console.error('Falta la variable de entorno MONGODB_URI.');
  process.exit(1);
}

const client = new MongoClient(URI, {
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 10000,
});

let db = null;

async function connect() {
  if (db) return db;
  await client.connect();
  db = client.db(DB_NAME);
  await ensureIndexes(db);
  console.log(`MongoDB conectado — base "${DB_NAME}"`);
  return db;
}

// Los índices se crean solos al arrancar: no hay que tocar Atlas a mano.
async function ensureIndexes(db) {
  // Un correo, una cuenta. El índice único es la garantía de verdad:
  // sin él, dos registros simultáneos podrían crear la misma cuenta dos veces.
  await db.collection('users').createIndex({ email: 1 }, { unique: true });

  // Los tokens de verificación y recuperación se limpian solos al caducar.
  await db.collection('tokens').createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 });
  await db.collection('tokens').createIndex({ lookup: 1 }, { unique: true });

  // Contenido del curso: un solo documento, buscado por su id.
  await db.collection('site_content').createIndex({ id: 1 }, { unique: true });
}

function getDb() {
  if (!db) throw new Error('La base de datos aún no está conectada.');
  return db;
}

const collections = {
  users:   () => getDb().collection('users'),
  tokens:  () => getDb().collection('tokens'),
  content: () => getDb().collection('site_content'),
};

async function close() {
  await client.close();
  db = null;
}

module.exports = { connect, getDb, collections, close };
