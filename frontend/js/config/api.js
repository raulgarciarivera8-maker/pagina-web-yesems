// ============================================================
//  CONFIGURACIÓN DE LA API  ·  YES EMS
//  ------------------------------------------------------------
//  Dirección del servidor de Render. La obtienes al desplegar:
//  Render → tu servicio → la URL que aparece arriba, algo como
//  https://yesems-api.onrender.com
//
//  Mientras esté vacía, el sitio funciona en MODO DEMO: se ve el
//  contenido de fábrica y el login no es real.
// ============================================================
window.YESEMS_API_URL = 'https://pagina-web-yesems.onrender.com';

// ------------------------------------------------------------
//  Aviso sobre el plan gratuito de Render
//  El servicio se duerme tras 15 minutos sin tráfico y la primera
//  petición tarda ~50 segundos en despertarlo. Para que el alumno
//  no se encuentre con esa espera al iniciar sesión, hacemos una
//  llamada al arrancar la página: mientras lee, el servidor
//  despierta en segundo plano.
// ------------------------------------------------------------
(function () {
  if (!window.YESEMS_API_URL) return;
  try {
    fetch(window.YESEMS_API_URL.replace(/\/$/, '') + '/api/salud', {
      method: 'GET',
      keepalive: true,
    }).catch(() => {});
  } catch (e) {}
})();
