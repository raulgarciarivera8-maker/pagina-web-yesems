// ============================================================
//  AUTENTICACIÓN  ·  YES EMS  (Etapa 1)
//  ------------------------------------------------------------
//  - Login / registro con correo y contraseña
//  - Login con Google
//  - Sesión persistente + estado en el header
//  - Modo DEMO si aún no hay llaves de Supabase configuradas
//
//  Expone:  window.YESEMS_AUTH = {
//     getUser(), onChange(cb), openModal(), logout(), isReal()
//  }
// ============================================================
(function () {
  const cfg = window.YESEMS_SUPABASE || {};
  const REAL = !!(cfg.SUPABASE_URL && cfg.SUPABASE_ANON_KEY);
  let supa = null;
  let currentUser = null;
  const listeners = [];

  // ---------- init Supabase client (si hay llaves) ----------
  if (REAL && window.supabase) {
    supa = window.supabase.createClient(cfg.SUPABASE_URL, cfg.SUPABASE_ANON_KEY, {
      auth: {
        persistSession: true,        // guarda la sesión en localStorage
        autoRefreshToken: true,      // renueva el token solo
        detectSessionInUrl: true,    // procesa el ?code= que regresa de Google
        flowType: 'pkce'             // flujo recomendado y estable para OAuth
      }
    });
    // Compartir el cliente con content-store.js (evita crear dos clientes).
    window.YESEMS_SUPA_CLIENT = supa;
  } else if (REAL && !window.supabase) {
    // La librería de Supabase no cargó (¿bloqueada por la red / orden de scripts?)
    console.error('[YESEMS_AUTH] La librería de Supabase no está disponible. ' +
      'Verifica que el <script> de @supabase/supabase-js cargue ANTES de auth.js.');
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
      const { data, error } = await supa.auth.signUp({
        email, password,
        options: { data: { full_name: name } }
      });
      if (error) throw error;
      // Si el proyecto exige confirmación por correo, no habrá sesión aún.
      if (!data.session) return { needsConfirm: true };
      return { needsConfirm: false };
    }
    // DEMO
    const u = { email, name: name || email.split('@')[0], demo: true };
    demoSave(u); currentUser = u; notify();
    return { needsConfirm: false };
  }

  async function signIn(email, password) {
    if (REAL) {
      const { error } = await supa.auth.signInWithPassword({ email, password });
      if (error) throw error;
      return;
    }
    // DEMO
    const u = { email, name: email.split('@')[0], demo: true };
    demoSave(u); currentUser = u; notify();
  }

  async function signInGoogle() {
    if (REAL) {
      const { error } = await supa.auth.signInWithOAuth({
        provider: 'google',
        options: {
          // Regresa a una URL limpia (sin #hash ni ?query) que debe estar
          // en la lista de "Redirect URLs" de Supabase.
          redirectTo: window.location.origin + window.location.pathname
        }
      });
      if (error) throw error;
      return; // redirige a Google
    }
    // DEMO
    const u = { email: 'demo@google.com', name: 'Usuario Google', demo: true };
    demoSave(u); currentUser = u; notify();
    closeModal();
  }

  async function logout() {
    if (REAL) {
      if (!supa) { currentUser = null; notify(); return; }
      try {
        // scope global: cierra sesión en el servidor (todos los dispositivos)
        const { error } = await supa.auth.signOut();
        if (error) throw error;
      } catch (e) {
        // signOut puede fallar si la sesión ya expiró/no existe en el servidor
        // o si no hay conexión. Aun así limpiamos la sesión LOCAL para que el
        // usuario quede deslogueado en este navegador.
        console.warn('[YESEMS_AUTH] signOut falló, limpiando localmente:', e.message);
        try { await supa.auth.signOut({ scope: 'local' }); } catch (_) {}
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
      if (!supa) { notify(); return; }
      try {
        const { data, error } = await supa.auth.getSession();
        if (error) console.warn('[YESEMS_AUTH] getSession:', error.message);
        currentUser = data && data.session ? mapUser(data.session.user) : null;
      } catch (e) {
        console.warn('[YESEMS_AUTH] No se pudo leer la sesión:', e.message);
        currentUser = null;
      }
      notify();
      supa.auth.onAuthStateChange((evt, session) => {
        currentUser = session ? mapUser(session.user) : null;
        notify();
        if (session) closeModal();
        // Al iniciar sesión vía Google, limpia el ?code=/#token de la URL
        if (evt === 'SIGNED_IN') cleanAuthParamsFromUrl();
      });
      // Si volvimos de Google, la lib procesa el code de forma asíncrona;
      // limpiamos la URL una vez resuelto.
      if (/[?#].*(code=|access_token=|error=)/.test(window.location.href)) {
        setTimeout(cleanAuthParamsFromUrl, 600);
      }
    } else {
      currentUser = demoLoad();
      notify();
    }
  }

  // Quita los parámetros de OAuth de la barra de direcciones sin recargar.
  function cleanAuthParamsFromUrl() {
    try {
      const clean = window.location.origin + window.location.pathname;
      if (window.location.href !== clean &&
          /[?#].*(code=|access_token=|refresh_token=|error=|provider_token=)/.test(window.location.href)) {
        window.history.replaceState({}, document.title, clean);
      }
    } catch (e) {}
  }
  function mapUser(u) {
    return {
      id: u.id,
      email: u.email,
      name: (u.user_metadata && (u.user_metadata.full_name || u.user_metadata.name)) || u.email.split('@')[0],
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
        </form>

        <p class="auth-switch">
          <span id="authSwitchTxt">¿No tienes cuenta?</span>
          <button type="button" id="authSwitch" class="auth-link">Crea una aquí</button>
        </p>
        <p class="auth-demo-note" id="authDemoNote" hidden>Modo demostración: aún no se ha conectado Supabase.</p>
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
      err.hidden = true; ok.hidden = true;
    }
    $('#authSwitch').addEventListener('click', () => setMode(mode === 'login' ? 'signup' : 'login'));
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

  function friendly(e) {
    const m = (e && e.message) || '';
    if (/invalid login/i.test(m)) return 'Correo o contraseña incorrectos.';
    if (/already registered|already exists/i.test(m)) return 'Ese correo ya tiene una cuenta. Inicia sesión.';
    if (/password should be at least/i.test(m)) return 'La contraseña debe tener al menos 6 caracteres.';
    if (/email/i.test(m) && /valid/i.test(m)) return 'Escribe un correo válido.';
    return m || 'Ocurrió un error. Inténtalo de nuevo.';
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

  // ---------- update user metadata in Supabase ----------
  async function updateMeta(data) {
    if (!REAL || !supa) return;
    try {
      const { error } = await supa.auth.updateUser({ data });
      if (error) console.warn('[YESEMS_AUTH] updateMeta:', error.message);
    } catch (e) {
      console.warn('[YESEMS_AUTH] updateMeta error:', e.message);
    }
  }

  // ---------- get raw session (includes user_metadata) ----------
  async function getSession() {
    if (!REAL || !supa) return null;
    try {
      const { data } = await supa.auth.getSession();
      return (data && data.session) ? data.session : null;
    } catch (e) { return null; }
  }

  // ---------- export ----------
  window.YESEMS_AUTH = { getUser, onChange, openModal, logout, isReal: () => REAL, updateMeta, getSession };

  boot();
})();
