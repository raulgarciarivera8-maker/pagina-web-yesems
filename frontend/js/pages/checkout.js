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
  function updatePriceDisplay() {
    var price = document.querySelector('.sub-price .amount');
    if (price) price.textContent = '$' + CONFIG.price;
    var period = document.querySelector('.sub-price .period');
    if (period) period.innerHTML = CONFIG.currency + '<br>' + CONFIG.period;
  }

  // ─── VERIFICAR ACCESO CONTRA LA API ───────────
  // El acceso lo marca SOLO el webhook de pago, desde el servidor. El
  // navegador nunca puede otorgárselo a sí mismo.
  async function checkAccess() {
    const auth = window.YESEMS_AUTH;
    if (!auth || !auth.refresh) return false;
    try {
      const user = await auth.refresh();
      if (!user || user.accessGranted !== true) return false;
      if (user.expiresAt && new Date(user.expiresAt) <= new Date()) return false;
      saveAccess(user.email, user.expiresAt);
      unlockContent();
      return true;
    } catch (e) {
      console.warn('[checkout] no se pudo verificar el acceso:', e.message);
      return false;
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
    if (p.get('payment') !== 'success') return false;

    if (window.history.replaceState) {
      window.history.replaceState({}, '', window.location.pathname + window.location.hash);
    }

    const user = window.YESEMS_AUTH && window.YESEMS_AUTH.getUser();
    if (!user) return false;

    // El webhook de Mercado Pago puede tardar unos segundos en llegar:
    // reintentamos un poco antes de darnos por vencidos.
    for (let i = 0; i < 5; i++) {
      if (await checkAccess()) return true;
      await new Promise((r) => setTimeout(r, 2000));
    }
    console.warn('[checkout] el pago aún no se refleja; se reintentará al recargar.');
    return false;
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

    // Optimista: si la caché dice que hay acceso, abrimos ya para evitar
    // el parpadeo, pero igual verificamos contra el backend enseguida.
    if (hasAccess()) unlockContent();

    if (await handlePaymentReturn()) { setupBuyButtons(); return; }

    // Verifica en cuanto sepamos quién es el usuario (y en cada cambio
    // de sesión, para que cerrar sesión vuelva a poner el candado).
    if (window.YESEMS_AUTH) {
      window.YESEMS_AUTH.onChange(async function(user) {
        if (user) {
          await checkAccess();
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
