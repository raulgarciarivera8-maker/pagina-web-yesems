// ============================================================
//  AUTENTICACIÓN  ·  YES EMS
//  ------------------------------------------------------------
//  - Registro y login con correo y contraseña
//  - Verificación de correo obligatoria antes de entrar
//  - Recuperación de contraseña
//  - Sesión persistente + estado en el header
//  - Modo DEMO si aún no hay API configurada
//
//  Habla con la API de Render. La sesión es un JWT guardado en
//  localStorage y enviado en la cabecera Authorization.
//
//  Expone:  window.YESEMS_AUTH = {
//     getUser(), getToken(), onChange(cb), openModal(), logout(),
//     isReal(), recoverPassword(), refresh()
//  }
// ============================================================
(function () {
  const API = (window.YESEMS_API_URL || '').replace(/\/$/, '');
  const REAL = !!API;
  const TOKEN_KEY = 'yesems_token';
  let currentUser = null;
  let token = null;
  // Hay un token guardado y aún estamos recuperando el perfil. Sirve para no
  // enseñar "inicia sesión" a alguien que ya tiene la sesión abierta.
  let booting = false;
  let intentoActual = 1;          // se muestra en la pantalla de carga
  const listeners = [];

  function notify() { listeners.forEach((cb) => { try { cb(currentUser); } catch (e) {} }); }
  function onChange(cb) { listeners.push(cb); if (currentUser !== undefined) cb(currentUser); }
  function getUser() { return currentUser; }
  function getToken() { return token; }
  function isBooting() { return booting; }
  function getIntento() { return intentoActual; }

  // ---------- almacenamiento de la sesión ----------
  //
  // Se guarda el token Y el perfil. El perfil cacheado es lo que permite
  // que la página abra al instante al recargar, sin esperar al servidor:
  // en el plan gratuito de Render la primera petición tarda hasta 50 s, y
  // hacer depender el arranque de ella dejaba la pantalla bloqueada.
  //
  // Es solo para la interfaz. Cada escritura viaja con el token y el
  // servidor vuelve a comprobar los permisos, así que falsear este perfil
  // a mano no da acceso a nada: enseñaría el panel y fallaría al guardar.
  const USER_KEY = 'yesems_user';

  function saveSession(t, u) {
    token = t;
    currentUser = u || null;
    try {
      if (t) localStorage.setItem(TOKEN_KEY, t);
      else localStorage.removeItem(TOKEN_KEY);
      if (u) localStorage.setItem(USER_KEY, JSON.stringify(u));
      else localStorage.removeItem(USER_KEY);
    } catch (e) {}
  }
  function saveToken(t) { saveSession(t, t ? currentUser : null); }
  function loadToken() {
    try { return localStorage.getItem(TOKEN_KEY); } catch (e) { return null; }
  }
  function loadUser() {
    try { return JSON.parse(localStorage.getItem(USER_KEY) || 'null'); } catch (e) { return null; }
  }

  // ---------- llamadas a la API ----------
  // Lanza un error con .status y .data para que quien llame decida
  // qué mensaje mostrar.
  async function call(path, { method = 'GET', body, auth: withAuth } = {}) {
    const headers = {};
    if (body) headers['Content-Type'] = 'application/json';
    if (withAuth && token) headers.Authorization = 'Bearer ' + token;

    // fetch no tiene tiempo límite propio: si algo intercepta la petición
    // (un antivirus, una extensión, un proxy) se queda colgada para siempre
    // y la pantalla se queda cargando sin explicar nada. Con AbortController
    // el fallo se hace visible en 20 segundos.
    const ctrl = new AbortController();
    const corte = setTimeout(() => ctrl.abort(), 20000);

    let r;
    try {
      r = await fetch(API + path, {
        method, headers,
        body: body ? JSON.stringify(body) : undefined,
        signal: ctrl.signal,
      });
    } catch (e) {
      const expiro = e.name === 'AbortError';
      const err = new Error(expiro
        ? 'El servidor no respondió a tiempo. Revisa tu conexión, o si un antivirus o una extensión del navegador están bloqueando la página.'
        : 'No se pudo conectar con el servidor. Inténtalo de nuevo en unos segundos.');
      err.status = 0;
      window.__YESEMS_LAST_AUTH_ERROR = expiro ? 'la petición expiró (20s)' : 'sin conexión con la API';
      throw err;
    } finally {
      clearTimeout(corte);
    }

    const data = await r.json().catch(() => ({}));
    if (!r.ok) {
      const err = new Error(data.error || 'Ocurrió un error. Inténtalo de nuevo.');
      err.status = r.status;
      err.data = data;
      // Se guarda para poder mostrarlo en pantalla si algo falla después.
      window.__YESEMS_LAST_AUTH_ERROR = r.status + ' ' + err.message;
      throw err;
    }
    return data;
  }

  // ---------- MODO DEMO (sin API configurada) ----------
  const DEMO_KEY = 'yesems_demo_user';
  function demoLoad() { try { return JSON.parse(localStorage.getItem(DEMO_KEY) || 'null'); } catch (e) { return null; } }
  function demoSave(u) { try { localStorage.setItem(DEMO_KEY, JSON.stringify(u)); } catch (e) {} }
  function demoClear() { try { localStorage.removeItem(DEMO_KEY); } catch (e) {} }

  // ======================================================
  //  ACCIONES
  // ======================================================
  async function signUp(email, password, name) {
    if (REAL) {
      const d = await call('/api/auth/registro', { method: 'POST', body: { email, password, name } });
      // La cuenta queda creada pero inactiva: hay que confirmar el correo.
      return { needsConfirm: true, emailSent: d.emailSent !== false };
    }
    const u = { email, name: name || email.split('@')[0], demo: true };
    demoSave(u); currentUser = u; notify();
    return { needsConfirm: false };
  }

  async function signIn(email, password) {
    if (REAL) {
      const d = await call('/api/auth/login', { method: 'POST', body: { email, password } });
      saveSession(d.token, d.user);
      notify();
      return;
    }
    const u = { email, name: email.split('@')[0], demo: true };
    demoSave(u); currentUser = u; notify();
  }

  async function recoverPassword(email) {
    if (!REAL) return false;
    await call('/api/auth/recuperar', { method: 'POST', body: { email } });
    return true;
  }

  async function resendVerification(email) {
    if (!REAL) return false;
    await call('/api/auth/reenviar', { method: 'POST', body: { email } });
    return true;
  }

  async function logout() {
    // La sesión es un JWT: basta con olvidarlo en este navegador.
    saveSession(null, null);
    demoClear();
    notify();
    const menu = document.getElementById('acctMenu');
    if (menu) menu.hidden = true;
  }

  // ======================================================
  //  SESIÓN INICIAL
  // ======================================================
  // Vuelve a preguntar por el perfil: así el acceso pagado y el nombre
  // se refrescan aunque el token siga siendo el mismo.
  async function refresh() {
    if (!REAL || !token) return null;
    try {
      const d = await call('/api/auth/yo', { auth: true });
      saveSession(token, d.user);
      booting = false;
      notify();
      return d.user;
    } catch (e) {
      console.warn('[auth] no se pudo recuperar el perfil:', e.status, e.message);
      // 401 = token vencido o cuenta borrada: se cierra la sesión.
      if (e.status === 401) saveSession(null, null);
      // Cualquier otro fallo (servidor dormido, sin red) conserva el token,
      // pero HAY que avisar igualmente: antes se salía en silencio y la
      // pantalla se quedaba congelada pidiendo iniciar sesión, con una
      // sesión perfectamente válida y sin ningún reintento.
      booting = false;
      notify();
      return null;
    }
  }

  // Reintenta mientras el servicio despierta. Render tarda hasta ~50 s en
  // arrancar en el plan gratuito, mucho más que el primer intento.
  async function bootWithRetry() {
    for (let intento = 1; intento <= 4; intento++) {
      const u = await refresh();
      if (u) return u;
      // Si el token dejó de ser válido, no tiene sentido reintentar.
      if (!token) return null;
      // Reintentamos ante fallos que puedan venir del servidor dormido:
      // sin conexión, 5xx, o una petición que expiró esperándolo. Este
      // último faltaba, y era justo el caso del arranque en frío: se
      // agotaba el tiempo, no coincidía con el patrón y se rendía sin
      // reintentar ni una vez.
      const err = window.__YESEMS_LAST_AUTH_ERROR || '';
      if (!/sin conexión|expiró|^0 |50\d /.test(err)) return null;
      if (intento === 4) break;
      booting = true;
      intentoActual = intento + 1;
      notify();
      await new Promise((r) => setTimeout(r, 2000));
    }
    booting = false;
    notify();
    return null;
  }

  async function boot() {
    if (!REAL) {
      currentUser = demoLoad();
      booting = false;
      notify();
      return;
    }

    token = loadToken();
    if (!token) { booting = false; notify(); return; }

    // Con sesión guardada, la página abre YA con el perfil cacheado. Nada
    // de esperar al servidor para decidir qué enseñar.
    const cacheado = loadUser();
    if (cacheado) {
      currentUser = cacheado;
      booting = false;
      notify();
      // Y en segundo plano se confirma contra el servidor, por si el
      // permiso cambió o la cuenta se deshabilitó.
      bootWithRetry();
      return;
    }

    // Sin perfil cacheado (sesión de una versión anterior) sí toca esperar.
    booting = true;
    await bootWithRetry();
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
        <p class="auth-demo-note" id="authDemoNote" hidden>Modo demostración: aún no se ha conectado la API.</p>
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
            if (r.emailSent) {
              ok.textContent = 'Te enviamos un correo para confirmar tu cuenta. Revísalo (mira también en spam) y luego inicia sesión.';
              ok.hidden = false;
            } else {
              // El servicio de correo falló: decirlo es mejor que dejar a la
              // persona esperando un mensaje que nunca va a llegar.
              err.textContent = 'Tu cuenta se creó, pero no pudimos enviarte el correo de confirmación. Escríbenos por WhatsApp para activarla.';
              err.hidden = false;
            }
            setMode('login');
          } else {
            closeModal(); // demo signup o proyecto sin confirmación
          }
        } else {
          await signIn(email, pass);
          closeModal();
        }
      } catch (ex) {
        err.textContent = friendly(ex);
        err.hidden = false;
        // Cuenta sin confirmar: le ofrecemos reenviar el correo en lugar
        // de dejarlo atascado sin saber qué hacer.
        if (ex.data && ex.data.needsVerification) {
          const b = document.createElement('button');
          b.type = 'button';
          b.className = 'auth-link';
          b.style.cssText = 'display:block;margin:8px auto 0';
          b.textContent = 'Reenviar el correo de confirmación';
          b.onclick = async () => {
            b.disabled = true;
            try {
              await resendVerification(email);
              err.hidden = true;
              ok.textContent = 'Te reenviamos el correo. Revisa tu bandeja y la carpeta de spam.';
              ok.hidden = false;
            } catch (e2) { err.textContent = friendly(e2); }
          };
          err.appendChild(b);
        }
      } finally {
        submit.disabled = false;
        submit.textContent = mode === 'login' ? 'Entrar' : 'Crear cuenta';
      }
    });

    wrap._setMode = setMode;
    $('#authDemoNote').hidden = REAL;
    return wrap;
  }

  // La API responde con los mensajes ya redactados en español, así que se
  // muestran tal cual. Esto solo cubre el caso de que no llegue ninguno.
  function friendly(e) {
    return (e && e.message) || 'Ocurrió un error. Inténtalo de nuevo.';
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


  // ---------- export ----------
  window.YESEMS_AUTH = {
    getUser, getToken, isBooting, getIntento, onChange, openModal, logout, refresh,
    recoverPassword, resendVerification,
    isReal: () => REAL,
  };

  boot();
})();
