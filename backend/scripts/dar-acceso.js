// ============================================================
//  DAR / QUITAR ACCESO AL CURSO  ·  YES EMS
//  ------------------------------------------------------------
//  Desbloquea (o bloquea) el curso para un correo, a mano. Sirve
//  para regalar acceso, para cortesías, o para reparar un pago que
//  no se registró solo.
//
//  Ejecutar desde backend/:
//     node scripts/dar-acceso.js correo@ejemplo.com            (1 año)
//     node scripts/dar-acceso.js correo@ejemplo.com --meses 6
//     node scripts/dar-acceso.js correo@ejemplo.com --quitar
//
//  Necesita MONGODB_URI en backend/.env
// ============================================================
require('dotenv').config();
const dns = require('dns');
try { dns.setServers(['8.8.8.8', '1.1.1.1', ...dns.getServers()]); } catch (e) {}
const { MongoClient } = require('mongodb');

const args = process.argv.slice(2);
const email = (args.find((a) => a.includes('@')) || '').trim().toLowerCase();
const quitar = args.includes('--quitar');
const mi = args.indexOf('--meses');
const meses = mi >= 0 ? parseInt(args[mi + 1], 10) : 12;

if (!email) {
  console.error('\nUso: node scripts/dar-acceso.js correo@ejemplo.com [--meses N] [--quitar]\n');
  process.exit(1);
}
if (!process.env.MONGODB_URI) {
  console.error('\nFalta MONGODB_URI en backend/.env\n');
  process.exit(1);
}

(async () => {
  const cli = await new MongoClient(process.env.MONGODB_URI).connect();
  const users = cli.db(process.env.MONGODB_DB || 'yesems').collection('users');

  const user = await users.findOne({ email });
  if (!user) {
    console.error(`\nNo existe ninguna cuenta con el correo "${email}".`);
    console.error('El usuario debe registrarse primero en la página.\n');
    await cli.close();
    process.exit(1);
  }

  if (quitar) {
    await users.updateOne({ email }, { $set: {
      accessGranted: false, plan: null, expiresAt: null, updatedAt: new Date(),
    } });
    console.log(`\nAcceso RETIRADO a ${email}.\n`);
  } else {
    const expiresAt = new Date();
    expiresAt.setMonth(expiresAt.getMonth() + meses);
    await users.updateOne({ email }, { $set: {
      accessGranted: true,
      plan: 'acredita-bach',
      paymentStatus: 'manual',
      expiresAt,
      updatedAt: new Date(),
    } });
    console.log(`\nAcceso CONCEDIDO a ${email} por ${meses} meses ` +
                `(hasta ${expiresAt.toLocaleDateString('es-MX')}).`);
    console.log('El usuario verá el curso al recargar la página.\n');
  }

  await cli.close();
  process.exit(0);
})().catch((e) => { console.error('\nError:', e.message, '\n'); process.exit(1); });
