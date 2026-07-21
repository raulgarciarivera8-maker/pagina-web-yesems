// ============================================================
//  API DE YES EMS  ·  Express + MongoDB
//  ------------------------------------------------------------
//  Se despliega en Render. Variables de entorno necesarias:
//    MONGODB_URI, JWT_SECRET, SITE_URL, ADMIN_EMAILS
//    SENDGRID_API_KEY, MAIL_FROM
//    MERCADO_PAGO_ACCESS_TOKEN, MERCADO_PAGO_WEBHOOK_SECRET
// ============================================================
const express = require('express');
const cors = require('cors');
const { connect } = require('./db');
const { verifySession } = require('./security');

const app = express();
app.set('trust proxy', 1);          // Render va detrás de un proxy: sin esto
                                    // el límite por IP vería una sola IP.

// El webhook de Mercado Pago necesita el cuerpo crudo para validar la firma,
// así que se guarda una copia antes de convertirlo a JSON.
// El documento de contenido lleva el temario completo, los exámenes y los
// enlaces a PDFs: con 1 MB se queda corto en cuanto el curso crece.
app.use(express.json({
  limit: '25mb',
  verify: (req, _res, buf) => { req.rawBody = buf; },
}));

// Solo nuestro sitio puede llamar a la API desde el navegador.
const permitidos = [
  process.env.SITE_URL,
  'http://localhost:3000',
  'http://127.0.0.1:3000',
].filter(Boolean).map((o) => o.replace(/\/$/, ''));

const corsOptions = {
  origin(origin, cb) {
    // Sin cabecera Origin son peticiones servidor-a-servidor (el webhook).
    if (!origin || permitidos.includes(origin.replace(/\/$/, ''))) return cb(null, true);
    cb(new Error('Origen no permitido'));
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));
// Preflight explícito: algunos proxies y antivirus no dejan pasar el OPTIONS
// implícito del middleware, y la petición se queda colgada sin error.
app.options('*', cors(corsOptions));

// Render apaga el servicio tras 15 min sin tráfico. Este endpoint sirve
// para despertarlo y para comprobar que sigue vivo.
//
// Informa además QUÉ está configurado, nunca con qué valor: solo si la
// variable existe. Sin esto, diagnosticar un ajuste que falta obliga a
// adivinar a ciegas.
app.get('/api/salud', (req, res) => {
  const admins = (process.env.ADMIN_EMAILS || '')
    .split(',').map((e) => e.trim()).filter(Boolean);

  // Respuesta pública: lo mínimo para despertar el servicio y comprobar que
  // responde. El detalle de configuración se reserva a administradores.
  //
  // Publicarlo era un problema real: "webhookSecret: false" anunciaba a
  // cualquiera que el webhook de pagos aceptaba avisos sin firmar, y
  // adminsHint dejaba ver el principio de los correos de administrador,
  // que es justo por donde empieza quien quiere entrar a la fuerza.
  const cabecera = req.get('authorization') || '';
  const token = cabecera.startsWith('Bearer ') ? cabecera.slice(7) : null;
  const datos = token ? verifySession(token) : null;
  const esAdmin = !!(datos && admins
    .map((e) => e.toLowerCase())
    .includes(String(datos.email || '').toLowerCase()));

  if (!esAdmin) return res.json({ ok: true, ts: Date.now() });

  res.json({
    ok: true,
    ts: Date.now(),
    config: {
      mongo:      true,                            // si no, el proceso no habría arrancado
      sendgrid:   !!process.env.SENDGRID_API_KEY,
      mailFrom:   !!process.env.MAIL_FROM,
      cloudinary: !!(process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_SECRET),
      mercadoPago: !!process.env.MERCADO_PAGO_ACCESS_TOKEN,
      webhookSecret: !!process.env.MERCADO_PAGO_WEBHOOK_SECRET,
      siteUrl:    process.env.SITE_URL || null,    // pública: ya se ve en las cabeceras CORS
      apiUrl:     !!process.env.API_URL,
      admins:     admins.length,
      // Enmascarados dejando ver lo suficiente para distinguir entre
      // correos parecidos (raulyeyo12 y raulgarciarivera08 compartían
      // las tres primeras letras y salían idénticos).
      adminsHint: admins.map((e) => {
        const [u, d] = e.split('@');
        const visible = Math.min(6, Math.max(1, u.length - 2));
        return u.slice(0, visible) + '***' + '@' + (d || '');
      }),
    },
  });
});

app.use('/api/auth', require('./routes/auth').router);
app.use('/api/contenido', require('./routes/contenido'));
app.use('/api/archivos', require('./routes/archivos'));
app.use('/api/pagos', require('./routes/pagos'));

app.use((_req, res) => res.status(404).json({ error: 'Ruta no encontrada' }));

// Manejador de errores: al cliente le llega un mensaje genérico, el detalle
// va al log. Nunca devolvemos el stack, que revela rutas y dependencias.
app.use((err, _req, res, _next) => {
  console.error(err);
  if (err.message === 'Origen no permitido') {
    return res.status(403).json({ error: 'Origen no permitido' });
  }
  res.status(500).json({ error: 'Error interno del servidor' });
});

// Un fallo suelto no debe tumbar el servicio entero: en Render eso significa
// que la siguiente petición del usuario espera otro arranque en frío.
process.on('unhandledRejection', (e) => console.error('Promesa sin capturar:', e));
process.on('uncaughtException',  (e) => console.error('Excepción no capturada:', e));

const PORT = process.env.PORT || 3001;

connect()
  .then(() => {
    app.listen(PORT, () => console.log(`API escuchando en el puerto ${PORT}`));
  })
  .catch((e) => {
    console.error('No se pudo conectar a MongoDB:', e.message);
    process.exit(1);
  });
