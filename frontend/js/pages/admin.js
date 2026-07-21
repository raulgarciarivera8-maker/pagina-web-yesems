// ============================================================
//  PANEL DE ADMINISTRADOR · YES EMS
//  Edita áreas, temas, PDFs, exámenes y suscripción, y los guarda
//  en la base de datos para que los alumnos los vean en la página principal.
// ============================================================
(function () {
  'use strict';

  // Correos autorizados como administradores (compara en minúsculas).
  // Debe coincidir con las reglas de seguridad de docs/SETUP.md
  // Quién es administrador lo decide el servidor (variable ADMIN_EMAILS de
  // Render) y llega en el perfil. Antes había aquí una lista escrita a mano
  // que se desincronizó de la del servidor: el panel dejaba entrar a correos
  // que luego no podían guardar nada.
  const ADMIN_VERSION = 'v7'; // etiqueta visible para confirmar qué versión está en línea

  const $  = (s, r = document) => r.querySelector(s);
  const clone = (o) => (o == null ? o : JSON.parse(JSON.stringify(o)));
  const isAdmin = (u) => !!(u && u.isAdmin);

  // ---------- escape ----------
  const esc = (s) => String(s == null ? '' : s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const escAttr = (s) => esc(s).replace(/"/g, '&quot;');

  // ---------- path helpers ----------
  function getPath(o, p) { return p.split('.').reduce((a, k) => (a == null ? undefined : a[k]), o); }
  function setPath(o, p, v) {
    const ks = p.split('.'); let a = o;
    for (let i = 0; i < ks.length - 1; i++) { if (a[ks[i]] == null) a[ks[i]] = {}; a = a[ks[i]]; }
    a[ks[ks.length - 1]] = v;
  }

  // ---------- estado ----------
  const state = { doc: null, tab: 'content', areaKey: null, expanded: new Set(), dirty: false, ready: false };
  let currentUser = null;

  // ---------- DOM refs ----------
  const gate     = $('#adminGate');
  const gateBody = $('#gateBody');
  const bar      = $('#adminBar');
  const shell    = $('#adminShell');
  const main     = $('#adminMain');
  const sideAreaList = $('#sideAreaList');
  const sideAreas    = $('#sideAreas');

  // =========================================================
  //  GATE (acceso)
  // =========================================================
  // Resumen del estado real, visible en la propia pantalla. Sin esto, cuando
  // la puerta rechaza el acceso no hay forma de saber por qué sin abrir las
  // herramientas de desarrollo.
  function diagnostico() {
    const A = window.YESEMS_AUTH;
    const partes = [
      'API: ' + (window.YESEMS_API_URL ? 'configurada' : 'FALTA'),
      'sesión: ' + (A && A.getToken && A.getToken() ? 'sí' : 'no'),
      ...(A && A.isBooting && A.isBooting() && A.getIntento
          ? ['intento ' + A.getIntento() + ' de 4'] : []),
    ];
    const u = A && A.getUser && A.getUser();
    if (u) {
      partes.push('correo: ' + esc(u.email));
      partes.push('verificado: ' + (u.emailVerified ? 'sí' : 'NO'));
      partes.push('admin: ' + (u.isAdmin ? 'sí' : 'NO'));
    }
    if (window.__YESEMS_LAST_AUTH_ERROR) {
      partes.push('último error: ' + esc(window.__YESEMS_LAST_AUTH_ERROR));
    }
    return `<p style="margin-top:14px;font-size:11px;color:#9aa3b2;line-height:1.7">
      ${partes.join(' · ')}<br>Versión ${ADMIN_VERSION}</p>`;
  }

  // Una sola función decide qué se ve, a partir del usuario actual y nada más.
  //
  // La versión anterior repartía esa decisión entre showGate, hideGate, una
  // bandera "booted" y un temporizador de 3 segundos que podía contradecir a
  // los otros tres. Bastaba con que uno se desincronizara para dejar la
  // pantalla en "Cargando" con la sesión perfectamente válida, que es
  // justo lo que pasaba. Sin estados intermedios, eso ya no puede ocurrir.
  // El panel SIEMPRE se ve. El estado de la sesión se comunica con una banda
  // de aviso arriba, no ocultando la pantalla.
  //
  // Antes esto era una "puerta" que tapaba todo hasta tener el perfil
  // confirmado. Esa pantalla dependía de que varias señales coincidieran, y
  // cuando una fallaba dejaba al administrador mirando "Cargando" con la
  // sesión válida, sin forma de entrar ni de saber por qué.
  //
  // El candado de verdad nunca estuvo aquí: está en el servidor, que
  // revalida el permiso en cada guardado.
  function mostrarAviso(texto, textoBoton, alPulsar) {
    window.__ADMIN_JS_OK = true;
    const caja = $('#adminAviso');
    const txt  = $('#adminAvisoTexto');
    const btn  = $('#adminAvisoBtn');
    if (!caja || !txt || !btn) return;
    if (!texto) { caja.hidden = true; return; }
    txt.innerHTML = texto;
    caja.hidden = false;
    btn.hidden = !textoBoton;
    if (textoBoton) {
      btn.textContent = textoBoton;
      btn.onclick = alPulsar;
    }
  }

  function showGate() { /* sustituido por mostrarAviso */ }
  function hideGate() { window.__ADMIN_JS_OK = true; mostrarAviso(null); }

  // =========================================================
  //  INIT del panel (una sola vez, tras autorizar)
  // =========================================================
  let booted = false;
  async function bootPanel(user) {
    // Marcamos ANTES de tocar el DOM: si algo falla a mitad, el temporizador
    // de la puerta no debe devolvernos a la pantalla de login.
    if (booted) {
      const e1 = $('#adminEmail'); if (e1) e1.textContent = user.email;
      hideGate();
      return;
    }
    booted = true;

    try {
      hideGate();
      const elEmail = $('#adminEmail');
      const elAvatar = $('#adminAvatar');
      if (elEmail) elEmail.textContent = user.email;
      if (elAvatar) elAvatar.textContent = (user.name || user.email || 'A').trim().charAt(0).toUpperCase();
    } catch (e) {
      console.error('[admin] fallo preparando la barra:', e);
    }

    // El contenido puede tardar si el servidor está dormido, pero el panel
    // ya está abierto: no se espera a que llegue para dejar de mostrar la
    // puerta. Si falla, se trabaja con los valores de fábrica.
    try {
      await window.YESEMS_CONTENT.ready;
    } catch (e) {
      console.error('[admin] no se pudo cargar el contenido:', e);
    }
    // Si el contenido no llegó, se parte de un documento vacío en lugar de
    // reventar aquí: un fallo cargando el temario no debe impedir abrir el
    // panel, que es justo lo que hacía que pareciera un problema de login.
    const C = window.YESEMS_CONTENT || {};
    const defs = C.defaults || {};
    state.doc = clone(C.data) || {};
    if (!state.doc.areasOrder) state.doc.areasOrder = clone(defs.areasOrder) || [];
    if (!state.doc.modules)    state.doc.modules = clone(defs.modules) || {};
    if (!state.doc.quizzes)    state.doc.quizzes = clone(defs.quizzes) || {};
    if (!state.doc.pdfs)       state.doc.pdfs = clone(defs.pdfs) || {};
    if (!state.doc.subscription) state.doc.subscription = clone(defs.subscription) || {};
    state.areaKey = state.doc.areasOrder[0] ? state.doc.areasOrder[0].key : null;
    state.ready = true;

    updateSourcePill();
    bindChrome();
    renderSideAreas();
    renderMain();
  }

  function updateSourcePill() {
    const pill = $('#adminSource');
    if (!window.YESEMS_CONTENT.isReal()) {
      pill.textContent = 'API no configurada'; pill.className = 'admin-source local'; return;
    }
    if (window.YESEMS_CONTENT.source === 'api') {
      pill.textContent = '● Publicado en línea'; pill.className = 'admin-source live';
    } else {
      pill.textContent = 'Contenido de fábrica'; pill.className = 'admin-source local';
    }
  }

  // =========================================================
  //  CHROME (barra, tabs)
  // =========================================================
  function bindChrome() {
    $('#btnSave').addEventListener('click', save);
    $('#btnLogout').addEventListener('click', () => {
      if (state.dirty && !confirm('Tienes cambios sin guardar. ¿Salir de todos modos?')) return;
      window.YESEMS_AUTH.logout();
    });
    $('#btnAddArea').addEventListener('click', addArea);

    $('#sideTabs').addEventListener('click', (e) => {
      const t = e.target.closest('.side-tab'); if (!t) return;
      state.tab = t.dataset.tab;
      $$all('.side-tab').forEach((b) => b.classList.toggle('active', b === t));
      sideAreas.style.display = state.tab === 'content' ? '' : 'none';
      renderMain();
    });

    // delegación de eventos del editor
    main.addEventListener('input', onInput);
    main.addEventListener('change', onChange);
    main.addEventListener('click', onClick);

    window.addEventListener('beforeunload', (e) => {
      if (state.dirty) { e.preventDefault(); e.returnValue = ''; }
    });
  }
  const $$all = (s, r = document) => Array.from(r.querySelectorAll(s));

  function markDirty(v) {
    state.dirty = v;
    $('#adminDirty').hidden = !v;
  }

  // =========================================================
  //  GUARDAR
  // =========================================================
  async function save() {
    const btn = $('#btnSave');
    if (!window.YESEMS_CONTENT.isReal()) {
      toast('La API no está configurada. Revisa docs/SETUP.md', 'err'); return;
    }
    btn.disabled = true; btn.textContent = 'Guardando…';
    try {
      await window.YESEMS_CONTENT.save(state.doc);
      markDirty(false);
      updateSourcePill();
      toast('Cambios guardados y publicados ✓', 'ok');
    } catch (err) {
      console.error(err);
      // La API responde con el mensaje ya redactado; err.status dice qué pasó.
      let msg = err.message || 'No se pudo guardar.';
      if (err.status === 401) {
        msg = 'Tu sesión expiró. Vuelve a iniciar sesión e inténtalo de nuevo.';
      } else if (err.status === 403) {
        msg = 'Tu cuenta no tiene permiso para publicar. Revisa que tu correo esté en ADMIN_EMAILS del servidor.';
      } else if (err.status === 0) {
        msg = 'No se pudo conectar con el servidor. Si lleva rato sin uso, tarda unos segundos en despertar: inténtalo otra vez.';
      }
      toast(msg, 'err');
    } finally {
      btn.disabled = false; btn.textContent = 'Guardar cambios';
    }
  }

  // =========================================================
  //  SIDEBAR de áreas
  // =========================================================
  function renderSideAreas() {
    sideAreaList.innerHTML = state.doc.areasOrder.map((a) => {
      const data = state.doc.modules[a.key] || { subsections: [] };
      const total = (data.subsections || []).reduce((s, x) => s + (x.topics ? x.topics.length : 0), 0);
      return `
        <div class="side-area ${a.key === state.areaKey ? 'active' : ''}" data-area="${escAttr(a.key)}">
          <span class="dot" style="background:${escAttr(a.color || '#888')}"></span>
          <span class="sa-label">${esc(a.label)}</span>
          <span class="sa-num">${total}</span>
        </div>`;
    }).join('');
    sideAreaList.querySelectorAll('.side-area').forEach((el) => {
      el.addEventListener('click', () => {
        state.areaKey = el.dataset.area;
        state.tab = 'content';
        $$all('.side-tab').forEach((b) => b.classList.toggle('active', b.dataset.tab === 'content'));
        sideAreas.style.display = '';
        renderSideAreas();
        renderMain();
      });
    });
  }

  // =========================================================
  //  RENDER principal
  // =========================================================
  function renderMain() {
    const y = window.scrollY;
    if (state.tab === 'content') renderAreaEditor();
    else if (state.tab === 'subscription') renderSubEditor();
    else renderStatus();
    window.scrollTo(0, y);
  }
  function rerender() { renderSideAreas(); renderMain(); }

  function computeMaxN() {
    let max = 0;
    Object.values(state.doc.modules).forEach((m) => (m.subsections || []).forEach((s) =>
      (s.topics || []).forEach((t) => { if (typeof t.n === 'number' && t.n > max) max = t.n; })));
    Object.keys(state.doc.quizzes).forEach((k) => { const n = parseInt(k, 10); if (n > max) max = n; });
    Object.keys(state.doc.pdfs).forEach((k) => { const n = parseInt(k, 10); if (n > max) max = n; });
    return max;
  }

  // ---------- PDF box ----------
  function pdfBox(path) {
    const val = getPath(state.doc, path) || '';
    const file = val ? val.split('/').pop().split('?')[0] : '';
    return `
      <div class="pdf-box">
        <div class="pdf-current">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><path d="M14 3v6h6"/></svg>
          ${val
            ? `Actual: <a href="${escAttr(val)}" target="_blank" rel="noopener">${esc(decodeURIComponent(file))}</a>`
            : `<span class="none">Sin PDF asignado</span>`}
        </div>
        <div class="pdf-tools">
          <label class="file-label">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="M12 3v13M7 8l5-5 5 5"/></svg>
            Subir PDF
            <input type="file" accept="application/pdf" data-pdf="${escAttr(path)}">
          </label>
          <span class="pdf-or">o pega un enlace:</span>
          <input class="inp pdf-url" type="text" placeholder="https://… enlace al PDF (Drive, etc.)" data-path="${escAttr(path)}" value="${escAttr(val)}">
        </div>
      </div>`;
  }

  // ---------- editor de área ----------
  function renderAreaEditor() {
    const key = state.areaKey;
    const ai  = state.doc.areasOrder.findIndex((a) => a.key === key);
    const area = state.doc.areasOrder[ai];
    if (!area) { main.innerHTML = `<div class="main-head"><h2>Sin áreas</h2><p>Agrega una área con el botón “+”.</p></div>`; return; }
    const data = state.doc.modules[key] || (state.doc.modules[key] = { title: area.label, reactivos: '', guide: '', intro: '', subsections: [] });
    if (!data.subsections) data.subsections = [];

    const subsHTML = data.subsections.map((sub, si) => {
      const tcount = (sub.topics || []).length;
      const topicsHTML = (sub.topics || []).map((t, ti) => renderTopic(key, si, ti, t)).join('');
      return `
        <div class="subsec" data-si="${si}">
          <div class="subsec-head">
            <input class="inp" data-path="modules.${key}.subsections.${si}.title" value="${escAttr(sub.title)}" placeholder="Nombre de la subsección">
            <span class="count">${tcount} tema${tcount === 1 ? '' : 's'}</span>
            <button class="icon-btn danger" data-act="del-sub" data-si="${si}" title="Eliminar subsección">✕</button>
          </div>
          <div class="subsec-body">
            ${topicsHTML || '<p class="card-sub" style="margin:0 0 12px">Aún no hay temas en esta subsección.</p>'}
            <button class="add-row" data-act="add-topic" data-si="${si}">＋ Agregar tema</button>
          </div>
        </div>`;
    }).join('');

    main.innerHTML = `
      <div class="main-head">
        <h2 id="areaTitle">${esc(area.label)}</h2>
        <p>Edita el área, sus temas, los PDFs y los exámenes. Recuerda <strong>Guardar cambios</strong> al terminar.</p>
      </div>

      <div class="card">
        <h3>Datos del área
          <span class="head-actions"><button class="mini-danger" data-act="del-area">Eliminar área</button></span>
        </h3>
        <div class="field">
          <label>Nombre del área</label>
          <input class="inp" data-bind="area-name" data-key="${escAttr(key)}" value="${escAttr(area.label)}">
        </div>
        <div class="field-row thirds">
          <div class="field"><label>Número (etiqueta)</label>
            <input class="inp" data-path="areasOrder.${ai}.num" value="${escAttr(area.num)}" placeholder="01"></div>
          <div class="field"><label>Color</label>
            <input class="inp" type="color" data-path="areasOrder.${ai}.color" value="${escAttr(area.color || '#2563eb')}" style="height:38px;padding:4px"></div>
          <div class="field"><label>Reactivos</label>
            <input class="inp" data-path="modules.${key}.reactivos" value="${escAttr(data.reactivos)}" placeholder="30 reactivos"></div>
        </div>
        <div class="field">
          <label>Introducción del área</label>
          <textarea class="ta tall" data-path="modules.${key}.intro" placeholder="Breve descripción del área…">${esc(data.intro)}</textarea>
        </div>
        <div class="field">
          <label>Guía de estudio completa (PDF del área)</label>
          ${pdfBox(`modules.${key}.guide`)}
        </div>
      </div>

      ${subsHTML}
      <button class="add-row" data-act="add-sub">＋ Agregar subsección</button>
    `;
  }

  function renderTopic(key, si, ti, t) {
    const n = t.n;
    const open = state.expanded.has(n);
    const hasPdf  = !!state.doc.pdfs[n];
    const quiz = state.doc.quizzes[n] || [];
    const hasQuiz = quiz.length > 0;
    const P = `modules.${key}.subsections.${si}.topics.${ti}`;

    const conceptsHTML = (t.concepts || []).map((c, ci) => `
      <div class="dyn-item">
        <textarea class="ta" data-path="${P}.concepts.${ci}" rows="2" placeholder="Concepto clave (puedes usar &lt;b&gt;negritas&lt;/b&gt;)">${esc(c)}</textarea>
        <button class="icon-btn danger" data-act="del-concept" data-p="${P}" data-i="${ci}" title="Quitar">✕</button>
      </div>`).join('');

    return `
      <div class="topic ${open ? 'open' : ''}" data-n="${n}">
        <div class="topic-bar" data-act="toggle-topic" data-n="${n}">
          <span class="tn">${String(n).padStart(2, '0')}</span>
          <span class="tt">${esc(t.title) || '<em>Sin título</em>'}</span>
          ${hasPdf ? '<span class="badge-mini pdf">PDF</span>' : ''}
          ${hasQuiz ? `<span class="badge-mini quiz">${quiz.length} preg.</span>` : ''}
          <svg class="chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M6 9l6 6 6-6"/></svg>
        </div>
        <div class="topic-edit">
          <div class="field" style="margin-top:14px">
            <label>Título del tema</label>
            <input class="inp t-title" data-path="${P}.title" value="${escAttr(t.title)}">
          </div>
          <div class="field">
            <label>Definición</label>
            <textarea class="ta" data-path="${P}.def" placeholder="Definición del tema…">${esc(t.def)}</textarea>
          </div>

          <div class="block-lbl">Conceptos clave</div>
          <div class="dyn-list">${conceptsHTML || ''}</div>
          <button class="add-row" data-act="add-concept" data-p="${P}">＋ Agregar concepto</button>

          <div class="block-lbl">Fórmula <span style="font-weight:400;text-transform:none;letter-spacing:0">(opcional · usa saltos de línea para varias)</span></div>
          <textarea class="ta" data-path="${P}.formula" placeholder="Ej. A = b × h">${esc(t.formula)}</textarea>

          <div class="block-lbl">Ejemplo <span style="font-weight:400;text-transform:none;letter-spacing:0">(opcional)</span></div>
          <textarea class="ta" data-path="${P}.example" placeholder="Ejemplo resuelto…">${esc(t.example)}</textarea>

          <div class="block-lbl">PDF del tema</div>
          ${pdfBox(`pdfs.${n}`)}

          <div class="block-lbl">Examen del tema</div>
          ${renderQuiz(n, quiz)}

          <div style="margin-top:20px;text-align:right">
            <button class="mini-danger" data-act="del-topic" data-si="${si}" data-ti="${ti}" data-n="${n}">Eliminar tema</button>
          </div>
        </div>
      </div>`;
  }

  function renderQuiz(n, quiz) {
    const qsHTML = quiz.map((q, qi) => {
      const optsHTML = (q.options || []).map((o, oi) => `
        <div class="quiz-opt ${o[0] === q.correct ? 'correct' : ''}">
          <span class="letter">${esc(o[0])}</span>
          <input class="inp" data-path="quizzes.${n}.${qi}.options.${oi}.1" value="${escAttr(o[1])}" placeholder="Texto de la opción">
          <label class="mark"><input type="radio" name="correct-${n}-${qi}" value="${esc(o[0])}" ${o[0] === q.correct ? 'checked' : ''} data-correct="quizzes.${n}.${qi}.correct"> correcta</label>
          <button class="icon-btn danger" data-act="del-opt" data-n="${n}" data-qi="${qi}" data-oi="${oi}" title="Quitar opción">✕</button>
        </div>`).join('');
      return `
        <div class="quiz-q">
          <div class="quiz-q-head">
            <span class="qn">Pregunta ${qi + 1}</span>
            <span class="spacer"></span>
            <button class="icon-btn danger" data-act="del-q" data-n="${n}" data-qi="${qi}" title="Eliminar pregunta">✕</button>
          </div>
          <div class="field">
            <textarea class="ta" data-path="quizzes.${n}.${qi}.q" placeholder="Escribe la pregunta…">${esc(q.q)}</textarea>
          </div>
          ${optsHTML}
          <button class="add-row" data-act="add-opt" data-n="${n}" data-qi="${qi}" style="margin-top:8px">＋ Opción</button>
          <div class="field" style="margin-top:12px">
            <label>Explicación (justificación de la respuesta)</label>
            <textarea class="ta" data-path="quizzes.${n}.${qi}.just" placeholder="¿Por qué esa es la respuesta correcta?">${esc(q.just)}</textarea>
          </div>
        </div>`;
    }).join('');
    return `
      <div class="quiz-wrap">
        ${qsHTML || '<p class="card-sub" style="margin:0 0 10px">Este tema todavía no tiene examen.</p>'}
        <button class="add-row" data-act="add-q" data-n="${n}">＋ Agregar pregunta</button>
      </div>`;
  }

  // =========================================================
  //  EDITOR de suscripción
  // =========================================================
  function renderSubEditor() {
    const s = state.doc.subscription || (state.doc.subscription = {});
    if (!s.features) s.features = [];
    const featHTML = s.features.map((f, fi) => `
      <div class="dyn-item">
        <input class="inp" data-path="subscription.features.${fi}" value="${escAttr(f)}" placeholder="Característica incluida">
        <button class="icon-btn danger" data-act="del-feature" data-i="${fi}" title="Quitar">✕</button>
      </div>`).join('');

    main.innerHTML = `
      <div class="main-head">
        <h2>Plan de suscripción</h2>
        <p>Edita el precio, el nombre y lo que incluye el plan que se muestra en la página.</p>
      </div>
      <div class="card">
        <h3>Encabezado del plan</h3>
        <div class="field-row">
          <div class="field"><label>Etiqueta superior</label><input class="inp" data-path="subscription.eyebrow" value="${escAttr(s.eyebrow)}" placeholder="Plan"></div>
          <div class="field"><label>Listón (esquina)</label><input class="inp" data-path="subscription.ribbon" value="${escAttr(s.ribbon)}" placeholder="Acceso completo"></div>
        </div>
        <div class="field"><label>Nombre del plan</label><input class="inp" data-path="subscription.title" value="${escAttr(s.title)}" placeholder="Acredita-Bach"></div>
        <div class="field"><label>Descripción corta</label><input class="inp" data-path="subscription.tag" value="${escAttr(s.tag)}" placeholder="Todo lo que necesitas para aprobar tu examen"></div>
      </div>

      <div class="card">
        <h3>Precio</h3>
        <div class="field-row thirds">
          <div class="field"><label>Símbolo</label><input class="inp" data-path="subscription.currency" value="${escAttr(s.currency)}" placeholder="$"></div>
          <div class="field"><label>Monto</label><input class="inp" data-path="subscription.price" value="${escAttr(s.price)}" placeholder="150"></div>
          <div class="field"><label>Periodo</label><input class="inp" data-path="subscription.period" value="${escAttr(s.period)}" placeholder="MXN / mensual"></div>
        </div>
        <p class="card-sub" style="margin:6px 0 0">Vista previa: <strong>${esc(s.currency)}${esc(s.price)}</strong> <span style="color:var(--ink-mute)">${esc((s.period || '').replace(/<br>/g, ' '))}</span></p>
      </div>

      <div class="card">
        <h3>Qué incluye</h3>
        <div class="dyn-list">${featHTML}</div>
        <button class="add-row" data-act="add-feature">＋ Agregar característica</button>
      </div>

            <div class="card mp-card">
        <h3><span class="mp-badge">MP</span> Mercado Pago</h3>
        <p class="card-sub">Configura tu integración con Mercado Pago. El Access Token se usa para crear preferencias de pago. La Public Key va en el frontend. Si están vacíos, el botón “Comenzar ahora” enviará al WhatsApp.</p>
        <div class="field"><label>Access Token (producción)</label>
          <div class="mp-token-field">
            <input class="inp" data-path="subscription.mpAccessToken" value="${escAttr(s.mpAccessToken)}" placeholder="APP_USR-123456789-..." style="font-family:monospace;font-size:12px">
            <button class="icon-btn mp-eye" data-act="toggle-mp-token" title="Mostrar/ocultar">👁</button>
          </div>
        </div>
        <div class="field"><label>Public Key</label><input class="inp" data-path="subscription.mpPublicKey" value="${escAttr(s.mpPublicKey)}" placeholder="APP_USR-xxxx-xxxx-..." style="font-family:monospace;font-size:12px"></div>
        <div class="field"><label>Identificador del plan</label><input class="inp" data-path="subscription.planId" value="${escAttr(s.planId || 'acredita-bach')}" placeholder="acredita-bach"></div>
        <div class="mp-help">
          <p>🔑 <strong>¿Dónde obtengo estos valores?</strong></p>
          <ol>
            <li>Ve a <a href="https://www.mercadopago.com.ar/developers/panel" target="_blank">developers.mercadopago.com</a></li>
            <li>Crea una aplicación o selecciona la existente</li>
            <li>Copia el <strong>Access Token</strong> (producción) y la <strong>Public Key</strong></li>
            <li>Pégalos aquí y guarda los cambios</li>
          </ol>
        </div>
      </div>
    `;
  }

  // =========================================================
  //  ESTADO / AYUDA
  // =========================================================
  function renderStatus() {
    const real = window.YESEMS_CONTENT.isReal();
    const src = window.YESEMS_CONTENT.source;
    main.innerHTML = `
      <div class="main-head"><h2>Estado y ayuda</h2><p>Comprueba la conexión y consulta cómo dejar todo listo.</p></div>
      <div class="card">
        <h3>Conexión</h3>
        <div class="status-row"><span class="k">API configurada</span><span class="v ${real ? 'pill-ok' : 'pill-warn'}">${real ? 'Sí' : 'No — falta pegar las llaves'}</span></div>
        <div class="status-row"><span class="k">Origen del contenido</span><span class="v">${src === 'api' ? '<span class="pill-ok">Publicado</span>' : 'Contenido de fábrica (aún no publicado)'}</span></div>
        <div class="status-row"><span class="k">Tu sesión</span><span class="v">${esc(currentUser && currentUser.email)}</span></div>
        <div class="status-row"><span class="k">Permiso de administrador</span><span class="v ${currentUser && currentUser.isAdmin ? 'pill-ok' : 'pill-warn'}">${currentUser && currentUser.isAdmin ? 'Sí' : 'No'}</span></div>
        <div class="status-row"><span class="k">Cambiar administradores</span><span class="v">Variable <code>ADMIN_EMAILS</code> en Render</span></div>
      </div>
      <div class="card">
        <h3>¿Primera vez? Deja el servidor listo</h3>
        <div class="help-steps">
          Para que <strong>lo que editas lo vean los alumnos</strong>, hay que crear una tabla y un almacén de archivos
          en tu servidor (una sola vez, sin programar). El paso a paso con el código exacto para copiar y
          pegar está en el archivo <code>docs/SETUP.md</code> del proyecto.
          <br><br>
          Mientras tanto, la página principal sigue funcionando con el contenido de fábrica. El botón
          <strong>Guardar cambios</strong> solo podrá publicar cuando la tabla y las políticas existan.
        </div>
        <div style="margin-top:16px;display:flex;gap:10px;flex-wrap:wrap">
          <a class="admin-btn ghost" style="color:var(--ink);border-color:var(--line-strong)" href="../docs/SETUP.md" target="_blank" rel="noopener">Abrir guía de configuración</a>
          <a class="admin-btn ghost" style="color:var(--ink);border-color:var(--line-strong)" href="https://dashboard.render.com" target="_blank" rel="noopener">Ir a Render ↗</a>
        </div>
      </div>
    `;
  }

  // =========================================================
  //  Manejadores de eventos
  // =========================================================
  function onInput(e) {
    const el = e.target;
    if (el.dataset.path !== undefined) {
      setPath(state.doc, el.dataset.path, el.value);
      markDirty(true);
      // sincronizaciones en vivo
      if (el.dataset.path.endsWith('.title')) {
        const topic = el.closest('.topic');
        if (topic) { const tt = topic.querySelector('.tt'); if (tt) tt.textContent = el.value || 'Sin título'; }
      }
      return;
    }
    if (el.dataset.bind === 'area-name') {
      const key = el.dataset.key;
      const i = state.doc.areasOrder.findIndex((a) => a.key === key);
      if (i >= 0) state.doc.areasOrder[i].label = el.value;
      if (state.doc.modules[key]) state.doc.modules[key].title = el.value;
      const at = $('#areaTitle'); if (at) at.textContent = el.value;
      const sa = sideAreaList.querySelector(`.side-area[data-area="${cssEsc(key)}"] .sa-label`);
      if (sa) sa.textContent = el.value;
      markDirty(true);
    }
  }
  function cssEsc(s){ return String(s).replace(/"/g,'\\"'); }

  function onChange(e) {
    const el = e.target;
    if (el.matches('input[type=file][data-pdf]')) { handlePdfFile(el); return; }
    if (el.dataset.correct !== undefined && el.checked) {
      setPath(state.doc, el.dataset.correct, el.value);
      markDirty(true);
      renderMain();
    }
  }

  async function handlePdfFile(el) {
    const path = el.dataset.pdf;
    const file = el.files && el.files[0];
    if (!file) return;
    if (file.type && file.type !== 'application/pdf') { toast('El archivo debe ser un PDF.', 'err'); el.value = ''; return; }
    if (!window.YESEMS_CONTENT.isReal()) { toast('Configura la API para subir archivos (docs/SETUP.md).', 'err'); el.value = ''; return; }
    toast('Subiendo PDF…', '');
    try {
      const url = await window.YESEMS_CONTENT.uploadPDF(file);
      setPath(state.doc, path, url);
      markDirty(true);
      toast('PDF subido ✓ — recuerda Guardar cambios', 'ok');
      renderMain();
    } catch (err) {
      console.error(err);
      let msg = err.message || 'No se pudo subir el archivo.';
      if (err.status === 401) {
        msg = 'Tu sesión expiró. Vuelve a iniciar sesión e inténtalo de nuevo.';
      } else if (err.status === 403) {
        msg = 'Tu cuenta no tiene permiso para subir archivos.';
      }
      toast(msg, 'err');
      el.value = '';
    }
  }

  function onClick(e) {
    const btn = e.target.closest('[data-act]');
    if (!btn) return;
    const act = btn.dataset.act;
    const key = state.areaKey;
    const d = btn.dataset;

    switch (act) {
      case 'toggle-topic': {
        const n = +d.n;
        if (state.expanded.has(n)) state.expanded.delete(n); else state.expanded.add(n);
        const topic = btn.closest('.topic'); if (topic) topic.classList.toggle('open');
        return; // sin re-render
      }
      case 'add-sub':
        state.doc.modules[key].subsections.push({ title: 'Nueva subsección', topics: [] });
        break;
      case 'del-sub':
        if (!confirm('¿Eliminar esta subsección y todos sus temas?')) return;
        removeSubsection(key, +d.si);
        break;
      case 'add-topic': {
        const n = computeMaxN() + 1;
        state.doc.modules[key].subsections[+d.si].topics.push(
          { n, title: 'Nuevo tema', def: '', concepts: [], formula: '', example: '' });
        state.expanded.add(n);
        break;
      }
      case 'del-topic':
        if (!confirm('¿Eliminar este tema (incluye su PDF y examen)?')) return;
        removeTopic(key, +d.si, +d.ti, +d.n);
        break;
      case 'add-concept':
        ensureArr(d.p, 'concepts').push('');
        break;
      case 'del-concept':
        getPath(state.doc, d.p).concepts.splice(+d.i, 1);
        break;
      case 'add-q':
        ensureQuiz(+d.n).push({ q: '', options: [['A', ''], ['B', ''], ['C', '']], correct: 'A', just: '' });
        break;
      case 'del-q':
        if (!confirm('¿Eliminar esta pregunta?')) return;
        state.doc.quizzes[+d.n].splice(+d.qi, 1);
        if (!state.doc.quizzes[+d.n].length) delete state.doc.quizzes[+d.n];
        break;
      case 'add-opt': {
        const q = state.doc.quizzes[+d.n][+d.qi];
        q.options.push([String.fromCharCode(65 + q.options.length), '']);
        break;
      }
      case 'del-opt':
        removeOption(+d.n, +d.qi, +d.oi);
        break;
      case 'add-feature':
        state.doc.subscription.features.push('');
        break;
      case 'del-feature':
        state.doc.subscription.features.splice(+d.i, 1);
        break;
      case 'toggle-mp-token':
        const inp = btn.parentElement.querySelector('.inp');
        if (inp) inp.type = inp.type === 'password' ? 'text' : 'password';
        btn.textContent = inp.type === 'password' ? '👁' : '👁‍🗨';
        return;
      case 'del-area':
        if (!confirm('¿Eliminar toda esta área con sus temas, PDFs y exámenes? No se puede deshacer.')) return;
        removeArea(key);
        break;
      default: return;
    }
    markDirty(true);
    if (state.tab === 'subscription') renderMain();
    else rerender();
  }

  function ensureArr(p, field) {
    const o = getPath(state.doc, p);
    if (!o[field]) o[field] = [];
    return o[field];
  }
  function ensureQuiz(n) {
    if (!state.doc.quizzes[n]) state.doc.quizzes[n] = [];
    return state.doc.quizzes[n];
  }
  function removeOption(n, qi, oi) {
    const q = state.doc.quizzes[n][qi];
    const correctIdx = q.options.findIndex((o) => o[0] === q.correct);
    q.options.splice(oi, 1);
    q.options.forEach((o, i) => (o[0] = String.fromCharCode(65 + i)));
    let ci = correctIdx;
    if (oi === correctIdx) ci = 0;
    else if (oi < correctIdx) ci = correctIdx - 1;
    q.correct = q.options.length ? q.options[Math.max(0, Math.min(ci, q.options.length - 1))][0] : 'A';
  }
  function removeSubsection(key, si) {
    const sub = state.doc.modules[key].subsections[si];
    (sub.topics || []).forEach((t) => { delete state.doc.quizzes[t.n]; delete state.doc.pdfs[t.n]; });
    state.doc.modules[key].subsections.splice(si, 1);
  }
  function removeTopic(key, si, ti, n) {
    state.doc.modules[key].subsections[si].topics.splice(ti, 1);
    delete state.doc.quizzes[n];
    delete state.doc.pdfs[n];
    state.expanded.delete(n);
  }
  function removeArea(key) {
    const data = state.doc.modules[key];
    if (data) (data.subsections || []).forEach((s) => (s.topics || []).forEach((t) => {
      delete state.doc.quizzes[t.n]; delete state.doc.pdfs[t.n];
    }));
    delete state.doc.modules[key];
    state.doc.areasOrder = state.doc.areasOrder.filter((a) => a.key !== key);
    state.areaKey = state.doc.areasOrder[0] ? state.doc.areasOrder[0].key : null;
  }
  function addArea() {
    const key = 'area_' + Date.now().toString(36);
    const num = String(state.doc.areasOrder.length + 1).padStart(2, '0');
    const palette = ['#2563eb', '#16a34a', '#ea580c', '#7c3aed', '#db2777', '#0891b2', '#b45309'];
    const color = palette[state.doc.areasOrder.length % palette.length];
    state.doc.areasOrder.push({ key, label: 'Nueva área', num, color });
    state.doc.modules[key] = { title: 'Nueva área', reactivos: '', guide: '', intro: '', subsections: [] };
    state.areaKey = key;
    state.tab = 'content';
    $$all('.side-tab').forEach((b) => b.classList.toggle('active', b.dataset.tab === 'content'));
    sideAreas.style.display = '';
    markDirty(true);
    rerender();
  }

  // =========================================================
  //  TOAST
  // =========================================================
  let toastT;
  function toast(msg, kind) {
    const el = $('#adminToast');
    el.textContent = msg;
    el.className = 'admin-toast show' + (kind ? ' ' + kind : '');
    el.hidden = false;
    clearTimeout(toastT);
    if (kind !== '') toastT = setTimeout(() => { el.classList.remove('show'); }, 3200);
  }

  // =========================================================
  //  ARRANQUE
  // =========================================================
  if (!window.YESEMS_AUTH) {
    gateBody.innerHTML = `<h1>Error</h1><p>No se pudo cargar la autenticación. Revisa que auth.js esté incluido.</p>`;
  } else {
    // El panel se monta de entrada, haya sesión o no. Nunca queda una
    // pantalla intermedia que pueda atascarse.
    bootPanel({ email: '—', name: 'A' });

    function aplicarEstado() {
      const A = window.YESEMS_AUTH;
      const user = A.getUser();
      currentUser = user;

      const elEmail = $('#adminEmail');
      if (elEmail) elEmail.textContent = user ? user.email : '—';

      if (user && isAdmin(user)) {
        mostrarAviso(null);                       // todo en orden
      } else if (user) {
        mostrarAviso(
          'La cuenta <strong>' + esc(user.email) + '</strong> no está autorizada como ' +
          'administrador, así que los cambios no se podrán publicar.',
          'Cambiar de cuenta', () => A.logout());
      } else if (A.getToken()) {
        mostrarAviso('Comprobando tu sesión con el servidor…', null, null);
      } else {
        mostrarAviso('Inicia sesión con un correo autorizado para poder publicar cambios.',
          'Iniciar sesión', () => A.openModal('login'));
      }
    }

    aplicarEstado();
    window.YESEMS_AUTH.onChange(aplicarEstado);
    // Repaso periódico: si el perfil llega tarde, la banda se actualiza sola.
    setInterval(aplicarEstado, 1500);
  }
})();
