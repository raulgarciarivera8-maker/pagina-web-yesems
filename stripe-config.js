// ============================================================
//  CONFIGURACIÓN DE STRIPE  ·  YES EMS
//  ------------------------------------------------------------
//  Cómo conectar el cobro real (5 pasos, sin backend):
//
//  1. Entra a https://dashboard.stripe.com/payment-links
//  2. Clic en "+ Nuevo" → crea un producto:
//       Nombre:  Acredita-Bach · YES EMS
//       Precio:  $150.00 MXN / mes  (suscripción recurrente)
//  3. En la sección "Después del pago"  →  "Redirigir a tu sitio":
//       URL de éxito:
//         https://TU-DOMINIO/acredita-bach.html?paid=acredita-bach
//       (reemplaza TU-DOMINIO con tu dominio real)
//  4. Guarda y copia la URL del Payment Link
//       Ejemplo:  https://buy.stripe.com/test_xxxxxxxxxxxx
//  5. Pégala en el campo de abajo y guarda el archivo.
//
//  ¡Listo! El botón "Comenzar ahora" redirigirá al checkout de Stripe.
//  Al pagar, Stripe regresa al sitio y el acceso se activa automáticamente.
// ============================================================

window.YESEMS_STRIPE = {
  'acredita-bach': ''  // 👈 pega aquí tu Payment Link de Stripe
};
