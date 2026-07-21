// ============================================================
//  ENVÍO DE CORREOS  ·  YES EMS  (SendGrid)
//  ------------------------------------------------------------
//  Variables de entorno:
//    SENDGRID_API_KEY   — llave con permiso "Mail Send"
//    MAIL_FROM          — remitente verificado en SendGrid
//    SITE_URL           — para construir los enlaces
// ============================================================
const sg = require('@sendgrid/mail');

const KEY = process.env.SENDGRID_API_KEY;
const FROM = process.env.MAIL_FROM || 'contacto@yesems.mx';
const SITE = (process.env.SITE_URL || 'https://pagina-web-yesems.vercel.app').replace(/\/$/, '');

if (KEY) sg.setApiKey(KEY);

// Escapa el texto que va dentro del HTML: un nombre con "<" no debe
// poder inyectar etiquetas en el correo.
function esc(s) {
  return String(s || '').replace(/[&<>"']/g, (c) => (
    { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
  ));
}

function layout(titulo, cuerpo, boton) {
  return `<!doctype html><html lang="es"><body style="margin:0;background:#f4f6fa;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="padding:32px 12px">
    <tr><td align="center">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;background:#fff;border-radius:14px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,.08)">
        <tr><td style="background:#0a1e3f;padding:20px 28px">
          <span style="color:#fff;font-size:19px;font-weight:700;letter-spacing:.3px">YES<span style="color:#5cb85c">EMS</span></span>
        </td></tr>
        <tr><td style="padding:32px 28px;color:#1a1a2e">
          <h1 style="margin:0 0 14px;font-size:21px;line-height:1.3">${esc(titulo)}</h1>
          <div style="font-size:15px;line-height:1.65;color:#41506b">${cuerpo}</div>
          ${boton}
        </td></tr>
        <tr><td style="padding:18px 28px;background:#f8fafc;color:#8a93a6;font-size:12px;line-height:1.6">
          Si no esperabas este correo, puedes ignorarlo sin hacer nada.
        </td></tr>
      </table>
    </td></tr>
  </table></body></html>`;
}

function boton(url, texto) {
  return `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:26px 0 8px">
    <tr><td style="background:#009EE3;border-radius:9px">
      <a href="${url}" style="display:inline-block;padding:13px 26px;color:#fff;text-decoration:none;font-weight:600;font-size:15px">${esc(texto)}</a>
    </td></tr></table>
    <p style="font-size:12.5px;color:#8a93a6;margin:14px 0 0;line-height:1.6">
      Si el botón no funciona, copia y pega esta dirección en tu navegador:<br>
      <span style="color:#41506b;word-break:break-all">${url}</span>
    </p>`;
}

async function send(to, subject, html) {
  if (!KEY) {
    // En desarrollo, sin llave configurada, el enlace sale por consola
    // en lugar de fallar. Así se puede probar el flujo completo.
    console.log(`\n[correo simulado] para: ${to}\n asunto: ${subject}\n`);
    const m = html.match(/https?:\/\/[^\s"<]+(verificar|restablecer)[^\s"<]*/);
    if (m) console.log(` enlace: ${m[0]}\n`);
    return;
  }
  try {
    await sg.send({ to, from: FROM, subject, html });
  } catch (e) {
    // Un fallo de correo no debe romper el registro: la cuenta ya existe
    // y el usuario puede pedir el reenvío.
    const detail = e.response && e.response.body ? JSON.stringify(e.response.body) : e.message;
    console.error(`SendGrid falló al enviar a ${to}:`, detail);
    throw new Error('No se pudo enviar el correo');
  }
}

function enviarVerificacion(to, nombre, token) {
  const url = `${SITE}/verificar.html?token=${token}`;
  return send(to, 'Confirma tu correo · YES EMS', layout(
    `¡Hola${nombre ? ', ' + esc(nombre) : ''}!`,
    `<p style="margin:0">Gracias por registrarte en YES EMS. Confirma tu correo para activar tu cuenta y acceder al material de estudio.</p>
     <p style="margin:12px 0 0">El enlace vence en 24 horas.</p>`,
    boton(url, 'Confirmar mi correo'),
  ));
}

function enviarRecuperacion(to, nombre, token) {
  const url = `${SITE}/restablecer.html?token=${token}`;
  return send(to, 'Restablece tu contraseña · YES EMS', layout(
    'Restablece tu contraseña',
    `<p style="margin:0">Recibimos una solicitud para cambiar la contraseña de tu cuenta.</p>
     <p style="margin:12px 0 0">El enlace vence en 1 hora y solo se puede usar una vez.</p>`,
    boton(url, 'Crear nueva contraseña'),
  ));
}

module.exports = { enviarVerificacion, enviarRecuperacion };
