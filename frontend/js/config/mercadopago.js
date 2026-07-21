// ============================================================
//  CONFIGURACIÓN DE MERCADO PAGO  ·  YES EMS  (lado navegador)
//  ------------------------------------------------------------
//  ⚠️  NUNCA pegues aquí el ACCESS TOKEN de Mercado Pago.
//
//  Todo lo de este archivo se descarga en el navegador de cada
//  visitante y se puede leer con clic derecho → "Ver código".
//  Con el Access Token cualquiera podría cobrar y reembolsar
//  pagos en tu cuenta.
//
//  El Access Token va en el backend, guardado como secreto:
//      cd backend
//      firebase functions:secrets:set MERCADO_PAGO_ACCESS_TOKEN
//
//  Aquí solo va la PUBLIC KEY, que sí es pública por diseño.
//  La obtienes en:
//      https://www.mercadopago.com.mx/developers → Tus integraciones
//      → tu aplicación → Credenciales de producción
//
//  Guía completa: docs/SETUP-PAGOS.md
// ============================================================

window.YESEMS_MP = {
  'acredita-bach': {
    publicKey: ''   // 👈 solo la Public Key (empieza con APP_USR-)
  }
};
