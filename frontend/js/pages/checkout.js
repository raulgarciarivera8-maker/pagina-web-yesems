// ============================================================
//  CHECKOUT  ·  YES EMS  (Mercado Pago + Firebase)
//  ------------------------------------------------------------
//  - Consulta si el usuario tiene acceso pagado (Firestore).
//  - Crea la preferencia de pago llamando a la Cloud Function.
//  - Desbloquea el contenido cuando el acceso está confirmado.
//
//  NOTA DE SEGURIDAD: este archivo solo controla lo que se VE.
//  El candado real vive en firestore.rules / storage.rules; nunca
//  confíes en el navegador para decidir quién pagó.
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

  // URL base de las Cloud Functions, p.ej.
  // https://us-central1-TU-PROYECTO.cloudfunctions.net
  function functionsBase() {
    return (window.YESEMS_FUNCTIONS_URL || '').replace(/\/$/, '');
  }

  function db() {
    return (window.YESEMS_FB_APP && window.firebase) ? firebase.firestore() : null;
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

  // ─── VERIFICAR ACCESO EN FIRESTORE ────────────
  // El documento user_access/{email} lo escribe SOLO el webhook de pago,
  // con credenciales de servidor. El navegador nunca puede crearlo.
  async function checkAccess(email) {
    if (!email) return false;
    const store = db();
    if (!store) return false;
    try {
      const snap = await store.collection('user_access').doc(email.toLowerCase()).get();
      if (!snap.exists) return false;
      const d = snap.data();
      if (d.access_granted !== true) return false;
      if (d.expires_at && new Date(d.expires_at) <= new Date()) return false;
      saveAccess(email, d.expires_at);
      unlockContent();
      return true;
    } catch (e) {
      console.warn('[checkout] no se pudo verificar el acceso:', e.message);
      return false;
    }
  }

  // ─── PREFERENCIA DE MERCADO PAGO ──────────────
  async function createPreference(email) {
    const base = functionsBase();
    if (!base) {
      console.warn('[checkout] falta window.YESEMS_FUNCTIONS_URL');
      return null;
    }
    try {
      // Enviamos el token de Firebase para que el backend sepa quién compra
      // y nadie pueda generar pagos a nombre de otra persona.
      const session = window.YESEMS_AUTH && await window.YESEMS_AUTH.getSession();
      const headers = { 'Content-Type': 'application/json' };
      if (session && session.access_token) {
        headers.Authorization = 'Bearer ' + session.access_token;
      }
      const r = await fetch(base + '/createPreference', {
        method: 'POST',
        headers,
        body: JSON.stringify({ email: email || '', plan: CONFIG.plan }),
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
  // contra Firestore: si el webhook no registró el pago, no se abre nada.
  async function handlePaymentReturn() {
    const p = new URLSearchParams(window.location.search);
    if (p.get('payment') !== 'success') return false;

    if (window.history.replaceState) {
      window.history.replaceState({}, '', window.location.pathname + window.location.hash);
    }

    const user = window.YESEMS_AUTH && window.YESEMS_AUTH.getUser();
    const email = user && user.email;
    if (!email) return false;

    // El webhook de Mercado Pago puede tardar unos segundos en llegar:
    // reintentamos un poco antes de darnos por vencidos.
    for (let i = 0; i < 5; i++) {
      if (await checkAccess(email)) return true;
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
        var url = await createPreference(email);
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
        if (user && user.email) {
          await checkAccess(user.email);
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
