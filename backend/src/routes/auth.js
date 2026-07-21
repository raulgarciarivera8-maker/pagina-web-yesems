// ============================================================
//  RUTAS DE AUTENTICACIÓN  ·  YES EMS
//  ------------------------------------------------------------
//  POST /api/auth/registro        crear cuenta
//  POST /api/auth/login           iniciar sesión
//  GET  /api/auth/yo              perfil del usuario en sesión
//  POST /api/auth/verificar       confirmar correo con el token
//  POST /api/auth/reenviar        reenviar la verificación
//  POST /api/auth/recuperar       pedir enlace de recuperación
//  POST /api/auth/restablecer     fijar contraseña nueva con el token
// ============================================================
const express = require('express');
const rateLimit = require('express-rate-limit');
const { collections } = require('../db');
const {
  hashPassword, verifyPasswordConstantTime, signSession,
  requireAuth, issueToken, consumeToken,
} = require('../security');
const { enviarVerificacion, enviarRecuperacion } = require('../mailer');

const router = express.Router();

// Frena los ataques de fuerza bruta: 10 intentos por IP cada 15 minutos
// en las rutas que prueban credenciales.
const limiteEstricto = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Demasiados intentos. Espera 15 minutos e inténtalo de nuevo.' },
});

// Y uno más suelto para el envío de correos, que cuesta dinero y puede
// usarse para molestar a terceros.
const limiteCorreo = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Demasiadas solicitudes. Inténtalo dentro de una hora.' },
});

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i;

function limpiarEmail(v) {
  return String(v || '').trim().toLowerCase();
}

// Lo que el frontend puede ver de un usuario. Nunca sale passwordHash.
function perfilPublico(u) {
  return {
    id: String(u._id),
    email: u.email,
    name: u.name || u.email.split('@')[0],
    emailVerified: !!u.emailVerified,
    plan: u.plan || null,
    accessGranted: !!u.accessGranted,
    expiresAt: u.expiresAt || null,
  };
}

// ---------- registro ----------
router.post('/registro', limiteEstricto, async (req, res, next) => {
  try {
    const email = limpiarEmail(req.body.email);
    const password = String(req.body.password || '');
    const name = String(req.body.name || '').trim().slice(0, 80);

    if (!EMAIL_RE.test(email)) {
      return res.status(400).json({ error: 'Escribe un correo válido.' });
    }
    if (password.length < 8) {
      return res.status(400).json({ error: 'La contraseña debe tener al menos 8 caracteres.' });
    }

    const passwordHash = await hashPassword(password);
    const ahora = new Date();

    let user;
    try {
      const r = await collections.users().insertOne({
        email, name, passwordHash,
        emailVerified: false,
        accessGranted: false,
        plan: null,
        createdAt: ahora,
        updatedAt: ahora,
      });
      user = { _id: r.insertedId, email, name };
    } catch (e) {
      // 11000 = índice único violado: el correo ya existe.
      // No lo decimos: eso permitiría averiguar quién tiene cuenta.
      // En su lugar respondemos igual que en el caso bueno.
      if (e.code === 11000) {
        return res.status(201).json({ ok: true, needsVerification: true });
      }
      throw e;
    }

    const token = await issueToken(user._id, 'verify', 24 * 60);
    try {
      await enviarVerificacion(email, name, token);
    } catch {
      // La cuenta ya está creada; puede pedir el reenvío desde la web.
    }

    res.status(201).json({ ok: true, needsVerification: true });
  } catch (err) { next(err); }
});

// ---------- login ----------
router.post('/login', limiteEstricto, async (req, res, next) => {
  try {
    const email = limpiarEmail(req.body.email);
    const password = String(req.body.password || '');

    const user = await collections.users().findOne({ email });
    const ok = await verifyPasswordConstantTime(password, user && user.passwordHash);

    // Mismo mensaje si el correo no existe o si la contraseña está mal.
    if (!ok || !user || user.disabled) {
      return res.status(401).json({ error: 'Correo o contraseña incorrectos.' });
    }

    if (!user.emailVerified) {
      return res.status(403).json({
        error: 'Confirma tu correo antes de entrar. Revisa tu bandeja de entrada.',
        needsVerification: true,
      });
    }

    await collections.users().updateOne(
      { _id: user._id },
      { $set: { lastLoginAt: new Date() } },
    );

    res.json({ token: signSession(user), user: perfilPublico(user) });
  } catch (err) { next(err); }
});

// ---------- perfil ----------
router.get('/yo', requireAuth, (req, res) => {
  res.json({ user: perfilPublico(req.user) });
});

// ---------- confirmar correo ----------
router.post('/verificar', async (req, res, next) => {
  try {
    const userId = await consumeToken(req.body.token, 'verify');
    if (!userId) {
      return res.status(400).json({ error: 'El enlace no es válido o ya venció. Pide uno nuevo.' });
    }
    await collections.users().updateOne(
      { _id: userId },
      { $set: { emailVerified: true, updatedAt: new Date() } },
    );
    const user = await collections.users().findOne({ _id: userId });
    res.json({ token: signSession(user), user: perfilPublico(user) });
  } catch (err) { next(err); }
});

// ---------- reenviar verificación ----------
router.post('/reenviar', limiteCorreo, async (req, res, next) => {
  try {
    const email = limpiarEmail(req.body.email);
    const user = await collections.users().findOne({ email });
    if (user && !user.emailVerified) {
      const token = await issueToken(user._id, 'verify', 24 * 60);
      try { await enviarVerificacion(email, user.name, token); } catch {}
    }
    // Respuesta idéntica exista o no la cuenta.
    res.json({ ok: true });
  } catch (err) { next(err); }
});

// ---------- pedir recuperación ----------
router.post('/recuperar', limiteCorreo, async (req, res, next) => {
  try {
    const email = limpiarEmail(req.body.email);
    const user = await collections.users().findOne({ email });
    if (user && !user.disabled) {
      const token = await issueToken(user._id, 'reset', 60);
      try { await enviarRecuperacion(email, user.name, token); } catch {}
    }
    res.json({ ok: true });
  } catch (err) { next(err); }
});

// ---------- fijar contraseña nueva ----------
router.post('/restablecer', limiteEstricto, async (req, res, next) => {
  try {
    const password = String(req.body.password || '');
    if (password.length < 8) {
      return res.status(400).json({ error: 'La contraseña debe tener al menos 8 caracteres.' });
    }

    const userId = await consumeToken(req.body.token, 'reset');
    if (!userId) {
      return res.status(400).json({ error: 'El enlace no es válido o ya venció. Pide uno nuevo.' });
    }

    await collections.users().updateOne(
      { _id: userId },
      { $set: {
          passwordHash: await hashPassword(password),
          // Quien recupera por correo demuestra que la dirección es suya.
          emailVerified: true,
          updatedAt: new Date(),
        } },
    );

    // Invalida cualquier otro enlace de recuperación pendiente.
    await collections.tokens().deleteMany({ userId, type: 'reset' });

    const user = await collections.users().findOne({ _id: userId });
    res.json({ token: signSession(user), user: perfilPublico(user) });
  } catch (err) { next(err); }
});

module.exports = { router, perfilPublico };
