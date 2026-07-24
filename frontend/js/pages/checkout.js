// ============================================================
//  CHECKOUT  ·  YES EMS  (Mercado Pago)
//  ------------------------------------------------------------
//  - Consulta si el usuario tiene acceso pagado (API).
//  - Crea la preferencia de pago llamando a la API.
//  - Desbloquea el contenido cuando el acceso está confirmado.
//
//  NOTA DE SEGURIDAD: este archivo solo controla lo que se VE.
//  Quien decide si alguien pagó es el servidor; nunca confíes en el
//  navegador para eso.
// ============================================================
(function() {
  'use strict';

  const CONFIG = {
    price: 50,
    currency: 'MXN',
    period: 'único',
    plan: 'acredita-bach',
    storageKey: 'yesems_access',
    whatsapp: 'https://api.whatsapp.com/send/?phone=5215648666596&text=Quiero%20acceder%20al%20curso%20Acredita-Bach%20de%20YES%20EMS',
  };

  function apiBase() {
    return (window.YESEMS_API_URL || '').replace(/\/$/, '');
  }

  // ─── CACHÉ LOCAL ──────────────────────────────
  // Solo evita parpadeos entre cargas; la verdad siempre viene del backend.
  function hasAccess() {
    try {
      const d = JSON.parse(localStorage.getItem(CONFIG.storageKey) || '{}');
      return d.granted === true && (!d.expires || Date.now() < d.expires);
    } catch { return false; }
  }

  function saveAccess(email, expiresAt) {
    localStorage.setItem(CONFIG.storageKey, JSON.stringify({
      granted: true,
      email: email || '',
      plan: CONFIG.plan,
      expires: expiresAt ? new Date(expiresAt).getTime()
                         : Date.now() + 365 * 24 * 60 * 60 * 1000,
    }));
  }

  function clearAccess() {
    try { localStorage.removeItem(CONFIG.storageKey); } catch {}
  }

  // ─── DESBLOQUEAR CONTENIDO ────────────────────
  function unlockContent() {
    document.querySelectorAll('.locked-wrap').forEach(function(w) {
      var pw = w.querySelector('.paywall');
      if (pw) pw.remove();
      var ll = w.querySelector('.locked-list');
      if (ll) ll.classList.remove('locked-list');
    });
    document.querySelectorAll('.topic.locked').forEach(function(t) {
      t.classList.remove('locked');
    });
    document.querySelectorAll('.sub-banner.locked').forEach(function(b) {
      b.classList.remove('locked');
      b.classList.add('active');
    });
    document.querySelectorAll('.sub-buy').forEach(function(btn) {
      btn.textContent = '✔ Acceso activo';
      btn.disabled = true;
      btn.style.opacity = '0.6';
    });
  }

  // ─── PRECIO ───────────────────────────────────
  // Se toma del contenido publicado, que es lo que edita el panel y lo mismo
  // que lee el servidor al cobrar. Antes estaba escrito a mano aquí, así que
  // la página podía anunciar un precio y Mercado Pago cobrar otro distinto.
  function precioPublicado() {
    var s = window.YESEMS_CONTENT
         && window.YESEMS_CONTENT.data
         && window.YESEMS_CONTENT.data.subscription;
    if (!s || s.price == null) return null;
    var n = parseFloat(String(s.price).replace(/[^0-9.]/g, ''));
    return (isFinite(n) && n > 0) ? { monto: n, sub: s } : null;
  }

  function updatePriceDisplay() {
    var p = precioPublicado();
    var monto = p ? p.monto : CONFIG.price;
    var price = document.querySelector('.sub-price .amount');
    if (price) price.textContent = '$' + monto;
    var period = document.querySelector('.sub-price .period');
    if (period) {
      period.innerHTML = (p && p.sub.period)
        ? p.sub.period
        : CONFIG.currency + '<br>' + CONFIG.period;
    }
  }

  // ─── VERIFICAR ACCESO CONTRA LA API ───────────
  // El acceso lo marca SOLO el webhook de pago, desde el servidor. El
  // navegador nunca puede otorgárselo a sí mismo.
  // Evita el bucle: refresh() dispara onChange, y onChange llamaba aquí de
  // nuevo, que volvía a llamar a refresh(). Un usuario con sesión iniciada
  // dejaba la página pidiendo el perfil sin parar.
  let verificando = false;

  async function checkAccess(user) {
    const auth = window.YESEMS_AUTH;
    if (!auth) return false;
    if (verificando) return false;
    verificando = true;
    try {
      // Si onChange ya nos entregó el perfil, no hace falta volver a pedirlo.
      if (!user && auth.refresh) user = await auth.refresh();
      if (!user || user.accessGranted !== true) return false;
      if (user.expiresAt && new Date(user.expiresAt) <= new Date()) return false;
      saveAccess(user.email, user.expiresAt);
      unlockContent();
      return true;
    } catch (e) {
      console.warn('[checkout] no se pudo verificar el acceso:', e.message);
      return false;
    } finally {
      verificando = false;
    }
  }

  // ─── PREFERENCIA DE MERCADO PAGO ──────────────
  async function createPreference() {
    const base = apiBase();
    if (!base) {
      console.warn('[checkout] falta window.YESEMS_API_URL');
      return null;
    }
    try {
      // El token identifica al comprador: el servidor toma de ahí el correo,
      // así nadie puede generar un pago a nombre de otra persona.
      const token = window.YESEMS_AUTH && window.YESEMS_AUTH.getToken();
      if (!token) return null;
      const r = await fetch(base + '/api/pagos/preferencia', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token },
        body: JSON.stringify({ plan: CONFIG.plan }),
      });
      if (r.ok) {
        const d = await r.json();
        if (d.init_point) return d.init_point;
      } else {
        console.warn('[checkout] createPreference respondió', r.status);
      }
    } catch (e) {
      console.warn('[checkout] error al crear la preferencia:', e);
    }
    return null;
  }

  // ─── REGRESO DESDE MERCADO PAGO ───────────────
  // Antes bastaba con escribir "?payment=success" a mano para desbloquear
  // todo el curso. Ahora ese parámetro solo dispara la verificación real
  // contra el servidor: si el webhook no registró el pago, no se abre nada.
  async function handlePaymentReturn() {
    const p = new URLSearchParams(window.location.search);
    const estado = p.get('payment');
    if (!estado) return false;

    // Limpia el parámetro de la URL para que al recargar no reintente.
    if (window.history.replaceState) {
      window.history.replaceState({}, '', window.location.pathname + window.location.hash);
    }

    if (estado === 'failure') {
      avisoPago('El pago no se completó. Puedes intentarlo de nuevo cuando quieras.', 'err');
      return false;
    }
    // 'pending' o 'success': en ambos hay que esperar la confirmación real.

    const user = window.YESEMS_AUTH && window.YESEMS_AUTH.getUser();
    if (!user) {
      avisoPago('Inicia sesión con la cuenta que usaste para pagar y tu acceso aparecerá.', 'err');
      return false;
    }

    // El webhook de Mercado Pago llega servidor-a-servidor y puede tardar:
    // con Render dormido, hasta ~40 s. Se espera con un aviso visible en vez
    // de dejar al alumno viendo el curso bloqueado sin explicación.
    avisoPago('Confirmando tu pago… esto puede tardar hasta un minuto.', 'wait');
    const inicio = Date.now();
    const LIMITE = 60000;   // 60 segundos
    let intento = 0;
    while (Date.now() - inicio < LIMITE) {
      if (await checkAccess()) {
        avisoPago('¡Listo! Tu acceso está activo. Ya puedes ver todo el material.', 'ok');
        return true;
      }
      intento++;
      // espera creciente: 2, 3, 4, 5, 5, 5… segundos
      await new Promise((r) => setTimeout(r, Math.min(2000 + intento * 1000, 5000)));
    }
    // No llegó a tiempo: no es necesariamente un fallo, el webhook puede
    // seguir en camino. Se le da una salida clara en vez de dejarlo colgado.
    avisoPago(
      'Tu pago se está procesando. Si en unos minutos no ves el material, ' +
      'recarga la página o escríbenos por WhatsApp.', 'wait', true);
    return false;
  }

  // Aviso flotante para el flujo de pago. Se crea una sola vez.
  function avisoPago(texto, tipo, conWhats) {
    var caja = document.getElementById('yesems-pago-aviso');
    if (!caja) {
      caja = document.createElement('div');
      caja.id = 'yesems-pago-aviso';
      caja.style.cssText = 'position:fixed;left:50%;bottom:24px;transform:translateX(-50%);' +
        'max-width:92%;z-index:9999;padding:14px 20px;border-radius:12px;font:15px/1.5 ' +
        '-apple-system,BlinkMacSystemFont,sans-serif;box-shadow:0 8px 30px rgba(0,0,0,.18);' +
        'display:flex;gap:12px;align-items:center;text-align:left';
      document.body.appendChild(caja);
    }
    var colores = {
      wait: 'background:#0a1e3f;color:#fff',
      ok:   'background:#e6f7ea;color:#1c6b3a;border:1px solid #b6e3c5',
      err:  'background:#fdeaea;color:#a33;border:1px solid #f2c2c2',
    };
    caja.style.cssText += ';' + (colores[tipo] || colores.wait);
    var wa = conWhats
      ? ' <a href="' + CONFIG.whatsapp + '" target="_blank" rel="noopener" style="color:inherit;text-decoration:underline;font-weight:600">WhatsApp</a>'
      : '';
    caja.innerHTML = (tipo === 'wait' ? '<span style="flex:0 0 auto">⏳</span>' : '') +
      '<span>' + texto + wa + '</span>';
    // Los mensajes finales (ok/err) se ocultan solos; el de espera se queda.
    if (tipo !== 'wait') setTimeout(function () { if (caja) caja.remove(); }, 9000);
  }

  // ─── BOTONES DE COMPRA ────────────────────────
  function setupBuyButtons() {
    document.querySelectorAll('.sub-buy').forEach(function(btn) {
      btn.addEventListener('click', async function(e) {
        e.preventDefault();
        var email = '';
        try {
          var u = window.YESEMS_AUTH && window.YESEMS_AUTH.getUser();
          if (u && u.email) email = u.email;
        } catch {}

        // Sin sesión no hay forma de saber a quién darle el acceso.
        // Dejamos anotado el plan para retomar el cobro tras el registro.
        if (!email) {
          try {
            sessionStorage.setItem('yesems_pending_plan', btn.dataset.plan || CONFIG.plan);
          } catch {}
          if (window.YESEMS_AUTH) window.YESEMS_AUTH.openModal('signup');
          return;
        }

        var original = btn.textContent;
        btn.textContent = 'Conectando con Mercado Pago…';
        btn.disabled = true;
        var url = await createPreference();
        if (url) {
          window.location.href = url;
        } else {
          btn.textContent = original;
          btn.disabled = false;
          window.open(CONFIG.whatsapp, '_blank', 'noopener');
        }
      });
    });
  }

  // ─── INICIO ───────────────────────────────────
  async function init() {
    updatePriceDisplay();
    // El contenido llega despues: se vuelve a pintar con el precio publicado.
    if (window.YESEMS_CONTENT && window.YESEMS_CONTENT.ready) {
      window.YESEMS_CONTENT.ready.then(updatePriceDisplay).catch(function(){});
    }

    // Optimista: si la caché dice que hay acceso, abrimos ya para evitar
    // el parpadeo, pero igual verificamos contra el backend enseguida.
    if (hasAccess()) unlockContent();

    if (await handlePaymentReturn()) { setupBuyButtons(); return; }

    // Verifica en cuanto sepamos quién es el usuario (y en cada cambio
    // de sesión, para que cerrar sesión vuelva a poner el candado).
    if (window.YESEMS_AUTH) {
      window.YESEMS_AUTH.onChange(async function(user) {
        if (user) {
          // Se le pasa el perfil recibido: pedirlo otra vez era lo que
          // realimentaba el bucle.
          await checkAccess(user);
        } else {
          clearAccess();
        }
      });
    }

    setupBuyButtons();
  }

  if (document.readyState === 'complete') setTimeout(init, 300);
  else window.addEventListener('load', function() { setTimeout(init, 300); });
})();
