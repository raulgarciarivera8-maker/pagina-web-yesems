// ============================================================
//  PRUEBAS DE LA API  ·  YES EMS
//  ------------------------------------------------------------
//  Levanta una MongoDB en memoria y la API real, y comprueba el
//  flujo completo de cuentas y permisos.
//
//  Ejecutar desde backend/:
//    npm install --no-save mongodb-memory-server
//    node test/api.test.js
//
//  La primera vez descarga un binario de MongoDB (~100 MB).
// ============================================================
const { MongoMemoryServer } = require('mongodb-memory-server');
(async () => {
  const mongo = await MongoMemoryServer.create();
  process.env.MONGODB_URI = mongo.getUri();
  process.env.JWT_SECRET = require('crypto').randomBytes(48).toString('hex');
  process.env.ADMIN_EMAILS = 'admin@yesems.mx';
  process.env.SITE_URL = 'http://localhost:3000';
  process.env.PORT = '4599';

  require('../src/server.js');
  await new Promise(r => setTimeout(r, 2500));

  const B = 'http://127.0.0.1:4599';
  const call = async (path, opts = {}) => {
    const r = await fetch(B + path, {
      method: opts.method || 'GET',
      headers: { 'Content-Type': 'application/json', Origin: 'http://localhost:3000', ...(opts.token ? { Authorization: 'Bearer ' + opts.token } : {}) },
      body: opts.body ? JSON.stringify(opts.body) : undefined,
    });
    return { status: r.status, body: await r.json().catch(() => ({})) };
  };
  const ok = (c, msg) => console.log(`  ${c ? 'PASA' : '>>> FALLA'}  ${msg}`);

  console.log('\n--- REGISTRO ---');
  let r = await call('/api/auth/registro', { method: 'POST', body: { email: 'Ana@Test.MX', password: 'ClaveSegura1', name: 'Ana' } });
  ok(r.status === 201, `registro devuelve 201 (${r.status})`);

  r = await call('/api/auth/registro', { method: 'POST', body: { email: 'ana@test.mx', password: 'Otra12345' } });
  ok(r.status === 201, 'correo repetido responde IGUAL que uno nuevo (no revela cuentas)');

  r = await call('/api/auth/registro', { method: 'POST', body: { email: 'x@y.mx', password: 'corta' } });
  ok(r.status === 400, 'rechaza contraseña de menos de 8 caracteres');

  r = await call('/api/auth/registro', { method: 'POST', body: { email: 'no-es-correo', password: 'ClaveSegura1' } });
  ok(r.status === 400, 'rechaza correo mal formado');

  console.log('\n--- LOGIN ---');
  r = await call('/api/auth/login', { method: 'POST', body: { email: 'ana@test.mx', password: 'ClaveSegura1' } });
  ok(r.status === 403 && r.body.needsVerification, 'bloquea el login sin confirmar el correo');

  r = await call('/api/auth/login', { method: 'POST', body: { email: 'ana@test.mx', password: 'MALA' } });
  ok(r.status === 401, 'rechaza contraseña incorrecta');
  const msgMala = r.body.error;
  r = await call('/api/auth/login', { method: 'POST', body: { email: 'nadie@test.mx', password: 'MALA' } });
  ok(r.body.error === msgMala, 'mismo mensaje si el correo no existe (no revela cuentas)');

  console.log('\n--- VERIFICACION ---');
  const { MongoClient } = require('mongodb');
  const cli = await new MongoClient(process.env.MONGODB_URI).connect();
  const db = cli.db('yesems');
  const tks = await db.collection('tokens').find({}).toArray();
  ok(tks.length === 1, `se creo 1 token de verificacion (${tks.length})`);
  ok(!!tks[0].lookup && tks[0].lookup.length === 64 && !tks[0].raw, 'el token se guarda HASHEADO, no en claro');

  r = await call('/api/auth/verificar', { method: 'POST', body: { token: 'inventado' } });
  ok(r.status === 400, 'rechaza un token inventado');

  // recuperamos el token real regenerando el flujo
  await db.collection('tokens').deleteMany({});
  const crypto = require('crypto');
  const raw = crypto.randomBytes(32).toString('hex');
  const u = await db.collection('users').findOne({ email: 'ana@test.mx' });
  await db.collection('tokens').insertOne({ lookup: crypto.createHash('sha256').update(raw).digest('hex'), userId: u._id, type: 'verify', expiresAt: new Date(Date.now() + 3600e3) });

  r = await call('/api/auth/verificar', { method: 'POST', body: { token: raw } });
  ok(r.status === 200 && !!r.body.token, 'verifica y devuelve sesion iniciada');
  const token = r.body.token;

  r = await call('/api/auth/verificar', { method: 'POST', body: { token: raw } });
  ok(r.status === 400, 'el mismo token NO sirve dos veces');

  console.log('\n--- SESION Y PERMISOS ---');
  r = await call('/api/auth/yo', { token });
  ok(r.status === 200 && r.body.user.email === 'ana@test.mx', 'devuelve el perfil');
  ok(r.body.user.passwordHash === undefined, 'el perfil NO expone el hash de la contraseña');
  ok(r.body.user.email === 'ana@test.mx', 'el correo se normalizo a minusculas');

  r = await call('/api/auth/yo');
  ok(r.status === 401, 'sin token responde 401');

  r = await call('/api/contenido', { method: 'PUT', token, body: { data: { hola: 1 } } });
  ok(r.status === 403, 'un usuario normal NO puede publicar contenido');

  r = await call('/api/archivos/firma', { method: 'POST', token });
  ok(r.status === 403, 'un usuario normal NO puede subir archivos');

  r = await call('/api/contenido');
  ok(r.status === 200, 'el contenido se lee sin sesion');

  console.log('\n--- LOGIN CORRECTO ---');
  r = await call('/api/auth/login', { method: 'POST', body: { email: 'ana@test.mx', password: 'ClaveSegura1' } });
  ok(r.status === 200 && !!r.body.token, 'entra con la contraseña correcta');


  console.log('\n--- CONTENIDO DE PAGO ---');
  // sembramos contenido como si fuera el curso real
  await db.collection('site_content').updateOne({ id:'acredita-bach' }, { $set: { data: {
    areasOrder: [{key:'mat',title:'Matematico'}],
    modules: { mat: { title:'Matematico', guide:'guia.pdf', intro:'intro',
      subsections:[{ title:'Sub', topics:[{ n:1, title:'Tema uno',
        def:'DEFINICION SECRETA', concepts:['concepto'], example:'ejemplo' }] }] } },
    quizzes: { 1: [{ q:'pregunta', options:[['A','a'],['B','b']], correct:'B', just:'porque si' }] },
    pdfs: { 1: 'https://ejemplo/secreto.pdf' },
    subscription: { price:'150' }
  } } }, { upsert:true });

  r = await call('/api/contenido');
  const pub = r.body.data || {};
  ok(JSON.stringify(pub).indexOf('DEFINICION SECRETA') === -1, 'la vitrina NO trae las definiciones');
  ok(Object.keys(pub.quizzes||{}).length === 0, 'la vitrina NO trae examenes');
  ok(Object.keys(pub.pdfs||{}).length === 0, 'la vitrina NO trae enlaces a PDFs');
  ok(JSON.stringify(pub).indexOf('Tema uno') !== -1, 'la vitrina SI trae los titulos');
  ok(JSON.stringify(pub).indexOf('correct') === -1, 'la vitrina NO trae respuestas');

  r = await call('/api/contenido/completo', { token });
  ok(r.status === 403 && r.body.requierePago, 'sin pagar, el material completo da 403');

  // le damos acceso pagado al usuario
  await db.collection('users').updateOne({ email:'ana@test.mx' }, { $set: { accessGranted:true } });
  r = await call('/api/contenido/completo', { token });
  ok(r.status === 200, 'con suscripcion activa, el material se entrega');
  ok(JSON.stringify(r.body.data).indexOf('DEFINICION SECRETA') !== -1, 'y SI trae el contenido');

  r = await call('/api/contenido/completo');
  ok(r.status === 401, 'sin sesion, el material completo da 401');

  await cli.close(); await mongo.stop(); process.exit(0);
})();
