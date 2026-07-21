// ============================================================
//  AUTENTICACIÓN  ·  YES EMS  (Etapa 1)
//  ------------------------------------------------------------
//  - Login / registro con correo y contraseña
//  - Login con Google
//  - Sesión persistente + estado en el header
//  - Modo DEMO si aún no hay llaves de Firebase configuradas
//
//  Expone:  window.YESEMS_AUTH = {
//     getUser(), onChange(cb), openModal(), logout(), isReal()
//  }
// ============================================================
(function () {
  const cfg = window.YESEMS_FIREBASE || {};
  const REAL = !!(cfg.apiKey && cfg.projectId);
  let auth = null;
  let currentUser = null;
  const listeners = [];

  // ---------- init Firebase (si hay configuración) ----------
  if (REAL && window.firebase) {
    const app = firebase.apps.length ? firebase.app() : firebase.initializeApp(cfg);
    // Compartir la app con content.js (evita inicializar dos veces).
    window.YESEMS_FB_APP = app;
    auth = firebase.auth();
    // Sesión persistente en localStorage: sobrevive al cierre del navegador.
    auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL)
      .catch((e) => console.warn('[YESEMS_AUTH] persistencia:', e.message));
  } else if (REAL && !window.firebase) {
    // La librería de Firebase no cargó (¿bloqueada por la red / orden de scripts?)
    console.error('[YESEMS_AUTH] La librería de Firebase no está disponible. ' +
      'Verifica que los <script> de firebase-*-compat.js carguen ANTES de auth.js.');
  }

  function notify() { listeners.forEach((cb) => { try { cb(currentUser); } catch (e) {} }); }
  function onChange(cb) { listeners.push(cb); if (currentUser !== undefined) cb(currentUser); }
  function getUser() { return currentUser; }

  // ---------- DEMO storage (sin Supabase) ----------
  const DEMO_KEY = 'yesems_demo_user';
  function demoLoad() { try { return JSON.parse(localStorage.getItem(DEMO_KEY) || 'null'); } catch (e) { return null; } }
  function demoSave(u) { try { localStorage.setItem(DEMO_KEY, JSON.stringify(u)); } catch (e) {} }
  function demoClear() { try { localStorage.removeItem(DEMO_KEY); } catch (e) {} }

  // ======================================================
  //  ACCIONES
  // ======================================================
  async function signUp(email, password, name) {
    if (REAL) {
      const cred = await auth.createUserWithEmailAndPassword(email, password);
      // Firebase no acepta metadata arbitraria: el nombre va en displayName.
      if (name) await cred.user.updateProfile({ displayName: name });
      // Firebase inicia sesión de inmediato; la verificación de correo es
      // opcional y no bloquea el acceso.
      return { needsConfirm: false };
    }
    // DEMO
    const u = { email, name: name || email.split('@')[0], demo: true };
    demoSave(u); currentUser = u; notify();
    return { needsConfirm: false };
  }

  async function signIn(email, password) {
    if (REAL) {
      await auth.signInWithEmailAndPassword(email, password);
      return;
    }
    // DEMO
    const u = { email, name: email.split('@')[0], demo: true };
    demoSave(u); currentUser = u; notify();
  }

  async function signInGoogle() {
    if (REAL) {
      const provider = new firebase.auth.GoogleAuthProvider();
      try {
        // Ventana emergente: no sale del sitio, así que no deja parámetros
        // de OAuth en la URL que haya que limpiar después.
        await auth.signInWithPopup(provider);
      } catch (e) {
        // Si el navegador bloquea la ventana emergente, caemos al flujo
        // de redirección, que siempre funciona.
        if (e.code === 'auth/popup-blocked' || e.code === 'auth/operation-not-supported-in-this-environment') {
          await auth.signInWithRedirect(provider);
          return;
        }
        throw e;
      }
      return;
    }
    // DEMO
    const u = { email: 'demo@google.com', name: 'Usuario Google', demo: true };
    demoSave(u); currentUser = u; notify();
    closeModal();
  }

  // Envía el correo de recuperación. A diferencia de Supabase, Firebase aloja
  // la pantalla de "escribe tu nueva contraseña", así que aquí no hace falta
  // construir ese formulario: el usuario la cambia y vuelve al sitio a entrar.
  async function recoverPassword(email) {
    if (REAL && auth) {
      await auth.sendPasswordResetEmail(email, {
        url: window.location.origin + window.location.pathname
      });
      return true;
    }
    return false;
  }

  async function logout() {
    if (REAL) {
      if (!auth) { currentUser = null; notify(); return; }
      try {
        await auth.signOut();
      } catch (e) {
        // signOut puede fallar si no hay conexión. Aun así forzamos el estado
        // deslogueado para que el usuario no quede atrapado en la sesión.
        console.warn('[YESEMS_AUTH] signOut falló, limpiando localmente:', e.message);
      }
      // GARANTÍA de UI: forzamos el estado deslogueado aunque el evento
      // onAuthStateChange tarde o no dispare.
      currentUser = null;
      notify();
    } else {
      demoClear(); currentUser = null; notify();
    }
    // cierra el menú de cuenta si quedó abierto
    const menu = document.getElementById('acctMenu');
    if (menu) menu.hidden = true;
  }

  // ======================================================
  //  SESIÓN INICIAL
  // ======================================================
  async function boot() {
    if (REAL) {
      if (!auth) { notify(); return; }
      // onAuthStateChanged dispara una primera vez con la sesión restaurada
      // (o con null si no hay), así que sirve de arranque y de suscripción.
      // Firebase resuelve la persistencia desde localStorage sin ir a la red,
      // por eso aquí no hace falta el timeout que necesitaba Supabase.
      auth.onAuthStateChanged((u) => {
        currentUser = u ? mapUser(u) : null;
        notify();
        if (u) closeModal();
      });
      // Si volvimos del flujo de redirección de Google, recogemos el error
      // (el éxito ya lo entrega onAuthStateChanged).
      auth.getRedirectResult().catch((e) => {
        console.warn('[YESEMS_AUTH] redirect de Google:', e.message);
      });
    } else {
      currentUser = demoLoad();
      notify();
    }
  }

  function mapUser(u) {
    return {
      id: u.uid,
      email: u.email,
      name: u.displayName || (u.email ? u.email.split('@')[0] : 'Usuario'),
      demo: false
    };
  }

  // ======================================================
  //  MODAL  (login / registro)
  // ======================================================
  let modalEl = null;
  function buildModal() {
    if (modalEl) return modalEl;
    const wrap = document.createElement('div');
    wrap.className = 'auth-modal';
    wrap.setAttribute('hidden', '');
    wrap.innerHTML = `
      <div class="auth-backdrop" data-close></div>
      <div class="auth-card" role="dialog" aria-modal="true" aria-label="Acceso">
        <button class="auth-x" data-close aria-label="Cerrar">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 6l12 12M18 6L6 18"/></svg>
        </button>

        <div class="auth-head">
          <div class="auth-logo">
            <svg viewBox="0 0 64 64" aria-hidden="true">
              <defs><linearGradient id="authy" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stop-color="#0a1e3f"/><stop offset="49.9%" stop-color="#0a1e3f"/>
                <stop offset="50%" stop-color="#5cb85c"/><stop offset="100%" stop-color="#5cb85c"/>
              </linearGradient></defs>
              <path d="M8 6 L28 6 L32 22 L36 6 L56 6 L40 36 L40 58 L24 58 L24 36 Z" fill="url(#authy)"/>
            </svg>
          </div>
          <h2 class="auth-title" id="authTitle">Inicia sesión</h2>
          <p class="auth-sub" id="authSub">Accede a tu material de estudio</p>
        </div>

        <button class="auth-google" id="authGoogle" type="button">
          <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.76h3.56c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.56-2.76c-.98.66-2.23 1.06-3.72 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.11a6.6 6.6 0 0 1 0-4.22V7.05H2.18a11 11 0 0 0 0 9.9l3.66-2.84z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.05l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z"/>
          </svg>
          Continuar con Google
        </button>

        <div class="auth-or"><span>o con tu correo</span></div>

        <form class="auth-form" id="authForm">
          <div class="auth-field auth-name-field" hidden>
            <label>Nombre completo</label>
            <input type="text" id="authName" autocomplete="name" placeholder="Tu nombre">
          </div>
          <div class="auth-field">
            <label>Correo electrónico</label>
            <input type="email" id="authEmail" autocomplete="email" placeholder="tucorreo@ejemplo.com" required>
          </div>
          <div class="auth-field">
            <label>Contraseña</label>
            <input type="password" id="authPass" autocomplete="current-password" placeholder="••••••••" minlength="6" required>
          </div>
          <p class="auth-error" id="authError" hidden></p>
          <p class="auth-ok" id="authOk" hidden></p>
          <button class="btn btn-primary auth-submit" id="authSubmit" type="submit">Entrar</button>
          <p class="auth-forgot" style="text-align:center;margin-top:8px">
            <button type="button" id="authRecover" class="auth-link">¿Olvidaste tu contraseña?</button>
          </p>
        </form>

        <p class="auth-switch">
          <span id="authSwitchTxt">¿No tienes cuenta?</span>
          <button type="button" id="authSwitch" class="auth-link">Crea una aquí</button>
        </p>
        <p class="auth-demo-note" id="authDemoNote" hidden>Modo demostración: aún no se ha conectado Firebase.</p>
      </div>`;
    document.body.appendChild(wrap);
    modalEl = wrap;

    // wiring
    let mode = 'login'; // 'login' | 'signup'
    const $ = (s) => wrap.querySelector(s);
    const nameField = $('.auth-name-field');
    const err = $('#authError'), ok = $('#authOk');

    function setMode(m) {
      mode = m;
      $('#authTitle').textContent = m === 'login' ? 'Inicia sesión' : 'Crea tu cuenta';
      $('#authSub').textContent   = m === 'login' ? 'Accede a tu material de estudio' : 'Regístrate para comenzar a estudiar';
      $('#authSubmit').textContent = m === 'login' ? 'Entrar' : 'Crear cuenta';
      $('#authSwitchTxt').textContent = m === 'login' ? '¿No tienes cuenta?' : '¿Ya tienes cuenta?';
      $('#authSwitch').textContent = m === 'login' ? 'Crea una aquí' : 'Inicia sesión';
      nameField.hidden = m === 'login';
      $('#authPass').setAttribute('autocomplete', m === 'login' ? 'current-password' : 'new-password');
      // Recuperar contraseña solo tiene sentido al iniciar sesión.
      $('.auth-forgot').hidden = m !== 'login';
      err.hidden = true; ok.hidden = true;
    }
    $('#authSwitch').addEventListener('click', () => setMode(mode === 'login' ? 'signup' : 'login'));

    $('#authRecover').addEventListener('click', async () => {
      err.hidden = true; ok.hidden = true;
      const email = $('#authEmail').value.trim();
      if (!email) { err.textContent = 'Escribe tu correo primero.'; err.hidden = false; return; }
      try {
        await recoverPassword(email);
        // No revelamos si el correo existe o no: mismo mensaje en ambos casos.
        ok.textContent = 'Si existe una cuenta con ese correo, te enviamos un enlace para restablecer tu contraseña.';
        ok.hidden = false;
      } catch (e) { err.textContent = friendly(e); err.hidden = false; }
    });
    wrap.querySelectorAll('[data-close]').forEach((b) => b.addEventListener('click', closeModal));
    wrap.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });

    $('#authGoogle').addEventListener('click', async () => {
      err.hidden = true;
      try { await signInGoogle(); }
      catch (e) { err.textContent = friendly(e); err.hidden = false; }
    });

    $('#authForm').addEventListener('submit', async (e) => {
      e.preventDefault();
      err.hidden = true; ok.hidden = true;
      const email = $('#authEmail').value.trim();
      const pass = $('#authPass').value;
      const name = $('#authName').value.trim();
      const submit = $('#authSubmit');
      submit.disabled = true; submit.textContent = 'Un momento…';
      try {
        if (mode === 'signup') {
          const r = await signUp(email, pass, name);
          if (r.needsConfirm) {
            ok.textContent = 'Te enviamos un correo para confirmar tu cuenta. Revísalo y luego inicia sesión.';
            ok.hidden = false;
            setMode('login');
          } else {
            closeModal(); // demo signup o proyecto sin confirmación
          }
        } else {
          await signIn(email, pass);
          closeModal(); // éxito de login (en modo real, onAuthStateChange ya cierra; cerrar de nuevo es inofensivo)
        }
      } catch (ex) {
        err.textContent = friendly(ex); err.hidden = false;
      } finally {
        submit.disabled = false;
        submit.textContent = mode === 'login' ? 'Entrar' : 'Crear cuenta';
      }
    });

    wrap._setMode = setMode;
    $('#authDemoNote').hidden = REAL;
    return wrap;
  }

  // Traduce los códigos de error de Firebase Auth a español.
  // Firebase entrega e.code (p.ej. 'auth/wrong-password'); el mensaje viene
  // siempre en inglés, así que nunca lo mostramos tal cual.
  const AUTH_ERRORS = {
    'auth/invalid-credential':      'Correo o contraseña incorrectos.',
    'auth/wrong-password':          'Correo o contraseña incorrectos.',
    'auth/user-not-found':          'No existe una cuenta con ese correo.',
    'auth/email-already-in-use':    'Ese correo ya tiene una cuenta. Inicia sesión.',
    'auth/weak-password':           'La contraseña debe tener al menos 6 caracteres.',
    'auth/invalid-email':           'Escribe un correo válido.',
    'auth/too-many-requests':       'Demasiados intentos. Espera unos minutos e inténtalo de nuevo.',
    'auth/network-request-failed':  'Sin conexión. Revisa tu internet e inténtalo de nuevo.',
    'auth/popup-closed-by-user':    'Cerraste la ventana de Google antes de terminar.',
    'auth/user-disabled':           'Esta cuenta está deshabilitada. Contáctanos por WhatsApp.'
  };

  function friendly(e) {
    if (e && e.code && AUTH_ERRORS[e.code]) return AUTH_ERRORS[e.code];
    return 'Ocurrió un error. Inténtalo de nuevo.';
  }

  function openModal(mode) {
    const m = buildModal();
    m.removeAttribute('hidden');
    if (m._setMode) m._setMode(mode || 'login');
    document.body.style.overflow = 'hidden';
    const f = m.querySelector('#authEmail'); if (f) setTimeout(() => f.focus(), 50);
  }
  function closeModal() {
    if (!modalEl) return;
    modalEl.setAttribute('hidden', '');
    document.body.style.overflow = '';
  }

  // ======================================================
  //  HEADER: botón de cuenta
  // ======================================================
  function renderHeaderAuth(user) {
    const slot = document.getElementById('ys-auth');
    if (!slot) return;
    if (user) {
      const initial = (user.name || user.email || '?').trim().charAt(0).toUpperCase();
      slot.innerHTML = `
        <div class="acct">
          <button class="acct-btn" id="acctBtn" aria-haspopup="true">
            <span class="acct-avatar">${initial}</span>
            <span class="acct-name">${user.name}</span>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><path d="M6 9l6 6 6-6"/></svg>
          </button>
          <div class="acct-menu" id="acctMenu" hidden>
            <div class="acct-menu-head">
              <strong>${user.name}</strong>
              <span>${user.email}</span>
            </div>
            <a href="acredita-bach.html#temas" class="acct-menu-item">Mi material de estudio</a>
            <button class="acct-menu-item danger" id="acctLogout" type="button">Cerrar sesión</button>
          </div>
        </div>`;
      const btn = slot.querySelector('#acctBtn');
      const menu = slot.querySelector('#acctMenu');
      btn.addEventListener('click', (e) => { e.stopPropagation(); menu.hidden = !menu.hidden; });
      slot.querySelector('#acctLogout').addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        menu.hidden = true;
        logout();
      });
    } else {
      slot.innerHTML = `<button class="acct-login" id="acctLogin" type="button">Iniciar sesión</button>`;
      slot.querySelector('#acctLogin').addEventListener('click', () => openModal('login'));
    }
  }

  // re-render header auth whenever header (re)mounts or user changes
  onChange((u) => renderHeaderAuth(u));

  // Cierre del menú de cuenta al hacer clic fuera o con Escape.
  // Se registra UNA sola vez (evita la fuga de listeners por repintado).
  document.addEventListener('click', () => {
    const menu = document.getElementById('acctMenu');
    if (menu && !menu.hidden) menu.hidden = true;
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const menu = document.getElementById('acctMenu');
      if (menu && !menu.hidden) menu.hidden = true;
    }
  });
  // header is injected by partials.js after DOMContentLoaded; observe for the slot
  function tryRender() { renderHeaderAuth(currentUser); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', tryRender);
  else tryRender();
  // also retry shortly after, in case partials.js mounts later
  setTimeout(tryRender, 0);
  setTimeout(tryRender, 300);

  // GARANTÍA: espera a que aparezca el slot #ys-auth (lo inyecta partials.js
  // de forma asíncrona) y entonces pinta el estado de sesión UNA vez.
  // IMPORTANTE: el observer se DESCONECTA en cuanto encuentra el slot. Si no,
  // como renderHeaderAuth modifica el DOM (slot.innerHTML), cada repintado
  // dispararía el observer otra vez → bucle infinito que congela la página.
  (function watchAuthSlot() {
    if (document.getElementById('ys-auth')) { tryRender(); return; }
    const obs = new MutationObserver(() => {
      if (document.getElementById('ys-auth')) {
        obs.disconnect();   // <-- corta el ciclo antes de tocar el DOM
        tryRender();
      }
    });
    const start = () => {
      // por si el slot apareció entre el chequeo inicial y aquí
      if (document.getElementById('ys-auth')) { tryRender(); return; }
      obs.observe(document.body, { childList: true, subtree: true });
    };
    if (document.body) start();
    else document.addEventListener('DOMContentLoaded', start);
  })();

  // ---------- actualizar el perfil del usuario ----------
  async function updateMeta(data) {
    if (!REAL || !auth || !auth.currentUser) return;
    try {
      // Firebase solo permite displayName y photoURL en el perfil.
      const patch = {};
      if (data.full_name || data.name) patch.displayName = data.full_name || data.name;
      if (data.avatar_url || data.photoURL) patch.photoURL = data.avatar_url || data.photoURL;
      if (Object.keys(patch).length) await auth.currentUser.updateProfile(patch);
    } catch (e) {
      console.warn('[YESEMS_AUTH] updateMeta error:', e.message);
    }
  }

  // ---------- sesión actual (con el token para llamar al backend) ----------
  async function getSession() {
    if (!REAL || !auth || !auth.currentUser) return null;
    try {
      const token = await auth.currentUser.getIdToken();
      return { user: auth.currentUser, access_token: token };
    } catch (e) { return null; }
  }

  // ---------- export ----------
  window.YESEMS_AUTH = { getUser, onChange, openModal, logout, isReal: () => REAL, updateMeta, getSession, recoverPassword };

  boot();
})();
