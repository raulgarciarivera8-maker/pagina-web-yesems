// ============================================================
//  SEGURIDAD  ·  YES EMS
//  ------------------------------------------------------------
//  Contraseñas, tokens de sesión y tokens de un solo uso.
//  Todo lo delicado del login vive aquí, en un solo archivo.
// ============================================================
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { collections } = require('./db');

// Coste 12: ~250 ms por hash en el hardware de Render. Suficientemente
// lento para que probar contraseñas a fuerza bruta no sea práctico, y
// suficientemente rápido para no bloquear el servidor en cada login.
const BCRYPT_ROUNDS = 12;

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES = '7d';

if (!JWT_SECRET || JWT_SECRET.length < 32) {
  console.error('Falta JWT_SECRET, o es demasiado corto (mínimo 32 caracteres).');
  console.error('Genera uno con:  node -e "console.log(require(\'crypto\').randomBytes(48).toString(\'hex\'))"');
  process.exit(1);
}

// ---------- contraseñas ----------
function hashPassword(plain) {
  return bcrypt.hash(plain, BCRYPT_ROUNDS);
}

function verifyPassword(plain, hash) {
  return bcrypt.compare(plain, hash);
}

// Un hash de descarte con el que comparar cuando el correo NO existe.
// Sin esto, un login con correo inexistente responde al instante y uno con
// correo real tarda 250 ms: esa diferencia de tiempo permite averiguar qué
// correos están registrados. Comparando siempre, ambos tardan igual.
const DUMMY_HASH = bcrypt.hashSync('contraseña-que-nadie-usara', BCRYPT_ROUNDS);

async function verifyPasswordConstantTime(plain, hash) {
  if (!hash) {
    await bcrypt.compare(plain, DUMMY_HASH);
    return false;
  }
  return bcrypt.compare(plain, hash);
}

// ---------- sesión (JWT) ----------
function signSession(user) {
  return jwt.sign(
    { sub: String(user._id), email: user.email },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES },
  );
}

function verifySession(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch {
    return null;
  }
}

// Middleware: exige sesión válida y deja el usuario en req.user.
async function requireAuth(req, res, next) {
  const header = req.get('authorization') || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return res.status(401).json({ error: 'Inicia sesión para continuar' });

  const payload = verifySession(token);
  if (!payload) return res.status(401).json({ error: 'Tu sesión expiró. Vuelve a entrar.' });

  const { ObjectId } = require('mongodb');
  let user;
  try {
    user = await collections.users().findOne({ _id: new ObjectId(payload.sub) });
  } catch {
    return res.status(401).json({ error: 'Sesión inválida' });
  }
  // La cuenta pudo borrarse o deshabilitarse después de emitir el token.
  if (!user || user.disabled) {
    return res.status(401).json({ error: 'Sesión inválida' });
  }

  req.user = user;
  next();
}

// Solo administradores. La lista vive en una variable de entorno para
// poder cambiarla sin tocar el código.
function requireAdmin(req, res, next) {
  const admins = (process.env.ADMIN_EMAILS || '')
    .split(',').map((e) => e.trim().toLowerCase()).filter(Boolean);
  if (!req.user || !admins.includes(req.user.email)) {
    return res.status(403).json({ error: 'No tienes permiso para esta acción' });
  }
  next();
}

// ---------- tokens de un solo uso (verificar correo / recuperar contraseña) ----------
// En la base guardamos solo el HASH del token. Si alguien lograra leer la
// colección, no podría usar los tokens para entrar a ninguna cuenta.
function hashToken(raw) {
  return crypto.createHash('sha256').update(raw).digest('hex');
}

async function issueToken(userId, type, ttlMinutes) {
  const raw = crypto.randomBytes(32).toString('hex');
  await collections.tokens().insertOne({
    lookup: hashToken(raw),
    userId,
    type,                       // 'verify' | 'reset'
    createdAt: new Date(),
    expiresAt: new Date(Date.now() + ttlMinutes * 60 * 1000),
  });
  return raw;
}

// Canjea el token y lo borra: un token sirve exactamente una vez.
async function consumeToken(raw, type) {
  if (!raw || typeof raw !== 'string') return null;
  const doc = await collections.tokens().findOneAndDelete({
    lookup: hashToken(raw),
    type,
    expiresAt: { $gt: new Date() },
  });
  return doc ? doc.userId : null;
}

module.exports = {
  hashPassword,
  verifyPassword,
  verifyPasswordConstantTime,
  signSession,
  verifySession,
  requireAuth,
  requireAdmin,
  issueToken,
  consumeToken,
};
