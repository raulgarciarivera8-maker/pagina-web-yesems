// ============ ACREDITA-BACH page logic ============
// Reuses window.modulesData + window.topicPDFs + window.topicQuizzes.

(function () {
  // ---------- PDFs protegidos ----------
  // Los archivos ya no tienen dirección pública: se pide al servidor un
  // enlace firmado y temporal, que solo entrega a quien tiene suscripción.
  // Antes el href apuntaba a /assets/pdfs/nombre.pdf, adivinable por
  // cualquiera aunque el enlace no se mostrara.
  function escAttrPdf(v) {
    return String(v == null ? '' : v).replace(/&/g, '&amp;').replace(/"/g, '&quot;')
      .replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  document.addEventListener('click', async function (e) {
    const a = e.target.closest && e.target.closest('.pdf-btn[data-pdf]');
    if (!a) return;
    e.preventDefault();
    if (a.dataset.cargando === '1') return;

    const ref = a.dataset.pdf || '';
    const original = a.innerHTML;
    a.dataset.cargando = '1';
    a.style.opacity = '0.65';
    try {
      // Si el admin pegó un enlace externo (http...), se abre directo. Si es
      // un identificador de Cloudinary (yesems/pdfs/...), se pide el enlace
      // firmado. Antes todo pasaba por abrirPDF, que destrozaba las URLs.
      const url = /^https?:\/\//i.test(ref)
        ? ref
        : await window.YESEMS_CONTENT.abrirPDF(ref);
      window.open(url, '_blank', 'noopener');
    } catch (err) {
      const aviso = document.createElement('span');
      aviso.style.cssText = 'display:block;margin-top:6px;font-size:13px;color:#b03030';
      aviso.textContent = err && err.status === 403
        ? 'Necesitas una suscripción activa para abrir este material.'
        : (err.message || 'No se pudo abrir el archivo.');
      a.parentNode.appendChild(aviso);
      setTimeout(function () { aviso.remove(); }, 6000);
    } finally {
      a.dataset.cargando = '0';
      a.style.opacity = '';
      a.innerHTML = original;
    }
  });

  const $  = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));

  let AREAS = (window.YESEMS_AREAS_DEFAULT && window.YESEMS_AREAS_DEFAULT.slice()) || [
    { key: 'matematico',  label: 'Pensamiento Matemático', num: '01', color: '#ea580c' },
    { key: 'digital',     label: 'Cultura Digital',        num: '02', color: '#0891b2' },
    { key: 'historica',   label: 'Conciencia Histórica',   num: '03', color: '#b45309' },
    { key: 'humanidades', label: 'Humanidades',            num: '04', color: '#7c3aed' },
    { key: 'naturales',   label: 'Ciencias Naturales',     num: '05', color: '#16a34a' },
    { key: 'lengua',      label: 'Lengua y Comunicación',  num: '06', color: '#2563eb' },
    { key: 'sociales',    label: 'Ciencias Sociales',      num: '07', color: '#db2777' }
  ];

  // Ícono genérico para áreas nuevas creadas desde el panel admin.
  const GENERIC_ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>';

  const AREA_ICONS = {
    matematico:  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M4 4h16v4l-6 4 6 4v4H4v-4l6-4-6-4z"/></svg>',
    digital:     '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><rect x="3" y="4" width="18" height="12" rx="2"/><path d="M8 20h8M12 16v4"/></svg>',
    historica:   '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
    humanidades: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>',
    naturales:   '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M11 20A7 7 0 0 1 9.8 6.1C16 5 18 9 18 9s-2 11-7 11z"/><path d="M11 20c0-5 2-9 6-11"/></svg>',
    lengua:      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>',
    sociales:    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/></svg>'
  };

  // ---------- subscription state (prototype: stored locally) ----------
  const SUB_KEY = 'yesems_acredita_sub';
  const PLAN_LABELS = { esencial: 'Esencial', plus: 'Plus', premium: 'Premium', 'acredita-bach': 'Acredita-Bach' };

  // El cobro lo maneja js/pages/checkout.js (Mercado Pago + Cloud Functions).
  // Aquí ya no hay enlaces de pago: los restos de Stripe se eliminaron.


  function getSub()   { try { return localStorage.getItem(SUB_KEY); } catch (e) { return null; } }
  function setSub(p)  { try { localStorage.setItem(SUB_KEY, p); } catch (e) {} }
  function clearSub() { try { localStorage.removeItem(SUB_KEY); } catch (e) {} }

  // El acceso real lo decide la sesión (accessGranted del perfil) o el registro
  // que deja checkout.js tras confirmar el pago. Antes esta función solo miraba
  // yesems_acredita_sub (un resto del sistema viejo), asi que aunque el usuario
  // tuviera acceso pagado, el curso seguia mostrando el candado.
  function tieneAccesoReal() {
    // 1. perfil de la sesión
    try {
      const u = window.YESEMS_AUTH && window.YESEMS_AUTH.getUser();
      if (u && u.accessGranted === true) {
        if (!u.expiresAt || new Date(u.expiresAt) > new Date()) return true;
      }
    } catch (e) {}
    // 2. registro local que guarda checkout.js
    try {
      const a = JSON.parse(localStorage.getItem('yesems_access') || '{}');
      if (a.granted === true && (!a.expires || Date.now() < a.expires)) return true;
    } catch (e) {}
    return false;
  }

  function isUnlocked() { return tieneAccesoReal() || !!getSub(); }
  let activeAreaKey = 'matematico';

  // ---------- helpers ----------
  function escapeHTML(s) {
    return String(s).replace(/[&<>"']/g, (c) => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c]));
  }

  // ---------- render area selector ----------
  const grid = document.getElementById('areaGrid');
  function renderAreaSelector() {
    if (!grid) return;
    grid.innerHTML = AREAS.map((a) => {
      const data = window.modulesData[a.key] || { subsections: [] };
      const total = data.subsections ? data.subsections.reduce((s, x) => s + x.topics.length, 0) : 0;
      const ready = areaHasMaterials(data);
      const badge = ready
        ? `<span class="area-status ready">PDF + examen</span>`
        : `<span class="area-status prep">Próximamente</span>`;
      return `
        <button class="area-btn" data-key="${a.key}" style="--area-c:${a.color}">
          <span class="area-num">Área ${a.num}</span>
          <span class="area-icon">${AREA_ICONS[a.key] || GENERIC_ICON}</span>
          <h3>${a.label}</h3>
          <div class="meta">${total} temas · ${data.reactivos || '30 reactivos'}</div>
          ${badge}
        </button>`;
    }).join('');
  }

  // ---------- render module ----------
  const panel = document.getElementById('areaPanel');

  function renderTopic(t) {
    // Sin suscripción, el servidor manda solo el título del tema. Se avisa en
    // lugar de pintar "undefined", que es lo que saldría al faltar los campos.
    if (t.bloqueado || (!t.def && !t.concepts && !t.example)) {
      return `
        <div class="topic-locked" style="padding:16px 18px;background:#f7f9fc;border:1px dashed #d8dfe8;border-radius:12px;color:#64748b;line-height:1.7">
          <strong style="color:#1a1a2e">Contenido de la suscripción</strong><br>
          La teoría, el material en PDF y el examen de este tema se desbloquean
          al activar tu acceso.
        </div>`;
    }

    let body = `<div class="block def"><span class="lbl">Definición</span>${t.def}</div>`;
    if (t.concepts && t.concepts.length) {
      body += `<div class="concepts"><span class="lbl">Conceptos clave</span><ul>` +
        t.concepts.map((c) => `<li>${c}</li>`).join('') + `</ul></div>`;
    }
    if (t.formula) body += `<div class="block formula"><span class="lbl">Fórmula</span>${t.formula.replace(/\n/g,'<br>')}</div>`;
    if (t.example) body += `<div class="block example"><span class="lbl">Ejemplo</span>${t.example}</div>`;

    const pdfPath = (window.topicPDFs && window.topicPDFs[t.n]) || null;
    if (pdfPath) {
      const fileName = pdfPath.split('/').pop();
      body += `
        <div class="topic-pdf">
          <a class="pdf-btn" href="#" data-pdf="${escAttrPdf(pdfPath)}" data-nombre="${escAttrPdf(fileName)}">
            <span class="pdf-ico">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                <path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/>
                <path d="M14 3v6h6"/>
                <path d="M12 13v6m0 0l-3-3m3 3l3-3"/>
              </svg>
            </span>
            <span class="pdf-label">
              <span class="pdf-eyebrow">Material de estudio</span>
              <span class="pdf-name">Descargar PDF · Tema ${String(t.n).padStart(2,'0')}</span>
            </span>
            <span class="pdf-arrow">↓</span>
          </a>
        </div>`;
    }

    const tQuiz = (window.topicQuizzes && window.topicQuizzes[t.n]) || null;
    if (tQuiz && tQuiz.length) body += renderTopicExam(t.n, tQuiz);

    // Si el tema aún no tiene teoría, PDF ni examen, avisamos en lugar de dejarlo "a medias"
    if (!pdfPath && !(tQuiz && tQuiz.length) && !t.def) {
      body += `
        <div class="topic-prep">
          <span class="topic-prep-ico">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>
          </span>
          <div class="topic-prep-txt">
            <strong>Material en preparación</strong>
            <span>El PDF de estudio y el examen de práctica de este tema estarán disponibles muy pronto.</span>
          </div>
        </div>`;
    }

    return `
      <div class="topic" data-n="${t.n}">
        <div class="topic-head">
          <span class="topic-num">${String(t.n).padStart(2,'0')}</span>
          <span class="topic-title">${t.title}</span>
          <svg class="topic-chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M6 9l6 6 6-6"/></svg>
        </div>
        <div class="topic-body"><div class="topic-content">${body}</div></div>
      </div>`;
  }

  function renderTopicExam(n, quiz) {
    const examId = `exam-t${n}`;
    let html = `
      <div class="topic-exam" data-total="${quiz.length}">
        <div class="exam-header">
          <div>
            <div class="exam-eyebrow">Examen del tema</div>
            <div class="exam-title">Pon a prueba lo aprendido</div>
          </div>
          <div class="exam-meta">${quiz.length} preguntas</div>
        </div>
        <div class="exam-questions">`;
    quiz.forEach((q, qi) => {
      const qId = `${examId}-q${qi}`;
      const opts = q.options.map((o) => `
        <label class="option-item" data-letter="${o[0]}">
          <input type="radio" name="${qId}" value="${o[0]}">
          <span class="letter">${o[0]}</span>
          <span>${o[1]}</span>
        </label>`).join('');
      html += `
        <div class="exam-q" data-correct="${q.correct}" data-just="${escapeHTML(q.just)}">
          <p class="question-title">${qi + 1}. ${q.q}</p>
          <div class="options-list">${opts}</div>
          <div class="exam-just" hidden></div>
        </div>`;
    });
    html += `
        </div>
        <div class="exam-actions">
          <button class="btn-check exam-grade">Calificar examen</button>
          <button class="btn-reset exam-reset" hidden>Volver a intentar</button>
        </div>
        <div class="exam-result" hidden>
          <div class="exam-score-ring">
            <svg viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="44" stroke="rgba(15,26,53,.08)" stroke-width="8" fill="none"/>
              <circle class="ring-progress" cx="50" cy="50" r="44" stroke="#16a34a" stroke-width="8" fill="none"
                stroke-dasharray="276.46" stroke-dashoffset="276.46" stroke-linecap="round"
                transform="rotate(-90 50 50)"/>
            </svg>
            <div class="score-text"><span class="score-num">0</span><span class="score-tot">/${quiz.length}</span></div>
          </div>
          <div class="exam-result-body">
            <div class="exam-grade-label">—</div>
            <div class="exam-grade-msg">—</div>
          </div>
        </div>
      </div>`;
    return html;
  }

  // ---------- subscription status banner ----------
  function renderSubStatus() {
    const slot = document.getElementById('subStatus');
    if (!slot) return;
    const plan = getSub();
    if (plan) {
      slot.innerHTML = `
        <div class="sub-banner active">
          <span class="sub-banner-ico">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 12l2 2 4-4"/><circle cx="12" cy="12" r="10"/></svg>
          </span>
          <div class="sub-banner-txt">
            <strong>Suscripción activa · Plan ${PLAN_LABELS[plan] || plan}</strong>
            <span>Tienes acceso completo al material de estudio y a los exámenes de las 7 áreas.</span>
          </div>
          <button type="button" class="sub-banner-manage" id="subCancel">Cancelar acceso</button>
        </div>`;
      const c = document.getElementById('subCancel');
      if (c) c.addEventListener('click', () => {
        clearSub();
        renderSubStatus();
        renderAreaOrPaywall(activeAreaKey);
      });
    } else {
      slot.innerHTML = `
        <div class="sub-banner locked">
          <span class="sub-banner-ico">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
          </span>
          <div class="sub-banner-txt">
            <strong>Material de estudio premium</strong>
            <span>Los PDFs y exámenes de práctica se desbloquean al contratar un plan. Abajo puedes ver una vista previa de los temas.</span>
          </div>
          <a class="sub-banner-manage cta" href="#suscripciones">Ver planes</a>
        </div>`;
    }
  }

  // ---------- locked (preview) render ----------
  function renderAreaLocked(key) {
    const data = window.modulesData[key];
    if (!data) { panel.innerHTML = '<p style="text-align:center;color:var(--ink-mute);padding:40px">Próximamente disponible.</p>'; return; }
    const area = AREAS.find((a) => a.key === key) || AREAS[0];
    const total = data.subsections.reduce((s, x) => s + x.topics.length, 0);
    const prepBanner = areaHasMaterials(data) ? '' : `
      <div class="area-prep-banner">
        <span class="area-prep-ico">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>
        </span>
        <div>
          <strong>Estamos preparando esta área</strong>
          <span>El temario ya está disponible. Los PDFs descargables y los exámenes de práctica de esta área se publicarán muy pronto.</span>
        </div>
      </div>`;

    const lockedTopic = (t) => `
      <div class="topic locked">
        <div class="topic-head">
          <span class="topic-num">${String(t.n).padStart(2,'0')}</span>
          <span class="topic-title">${t.title}</span>
          <svg class="topic-lock" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
        </div>
      </div>`;

    panel.innerHTML = `
      <div class="area-panel-head">
        <div>
          <div class="num">Área ${area.num}</div>
          <h2>${data.title}</h2>
          <p class="intro">${data.intro}</p>
        </div>
        <div style="margin-left:auto;text-align:right;color:var(--ink-mute);font-size:13px;flex-shrink:0">
          <div style="font-size:36px;font-weight:700;color:${area.color};line-height:1">${total}</div>
          <div>temas</div>
        </div>
      </div>

      <div class="locked-wrap">
        <div class="locked-list">
          ${prepBanner}
          ${data.subsections.map((sub) => `
            <div class="subsection">
              <h3 class="subsection-title">${sub.title}<span class="tag">${sub.topics.length} temas</span></h3>
              <div class="topics">${sub.topics.map(lockedTopic).join('')}</div>
            </div>`).join('')}
        </div>
        <div class="paywall">
          <div class="paywall-card">
            <span class="paywall-ico">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
            </span>
            <h3>Contenido bloqueado</h3>
            <p>Desbloquea el material de estudio en PDF y los exámenes de práctica con calificación inmediata de las <strong>7 áreas</strong> del examen.</p>
            <ul class="paywall-feats">
              <li><svg class="ck" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><polyline points="20 6 9 17 4 12"/></svg>PDFs descargables por tema</li>
              <li><svg class="ck" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><polyline points="20 6 9 17 4 12"/></svg>Exámenes con calificación al instante</li>
              <li><svg class="ck" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><polyline points="20 6 9 17 4 12"/></svg>Acceso 24/7 desde cualquier dispositivo</li>
            </ul>
            <a class="btn btn-primary paywall-cta" href="#suscripciones">
              Ver planes y desbloquear
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
            </a>
            <span class="paywall-note">¿Ya tienes un plan? Selecciónalo abajo para activar tu acceso.</span>
          </div>
        </div>
      </div>`;
  }

  function renderAreaOrPaywall(key) {
    activeAreaKey = key;
    if (isUnlocked()) renderArea(key);
    else { renderAreaLocked(key); panel.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
  }

  function areaHasMaterials(data) {
    if (data.guide) return true;
    return data.subsections.some((sub) => sub.topics.some((t) => {
      const hasPdf = window.topicPDFs && window.topicPDFs[t.n];
      const q = window.topicQuizzes && window.topicQuizzes[t.n];
      return hasPdf || (q && q.length);
    }));
  }

  function renderAreaGuide(data) {
    if (!data.guide) return '';
    const fileName = data.guide.split('/').pop();
    return `
      <div class="area-guide">
        <a class="pdf-btn" href="#" data-pdf="${escAttrPdf(data.guide)}" data-nombre="${escAttrPdf(fileName)}">
          <span class="pdf-ico">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
              <path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/>
              <path d="M14 3v6h6"/>
              <path d="M12 13v6m0 0l-3-3m3 3l3-3"/>
            </svg>
          </span>
          <span class="pdf-label">
            <span class="pdf-eyebrow">Guía de estudio completa</span>
            <span class="pdf-name">Descargar guía en PDF · ${data.title}</span>
          </span>
          <span class="pdf-arrow">↓</span>
        </a>
      </div>`;
  }

  function renderArea(key) {
    const data = window.modulesData[key];
    if (!data) { panel.innerHTML = '<p style="text-align:center;color:var(--ink-mute);padding:40px">Próximamente disponible.</p>'; return; }
    const area = AREAS.find((a) => a.key === key) || AREAS[0];
    const total = data.subsections.reduce((s, x) => s + x.topics.length, 0);
    const prepBanner = areaHasMaterials(data) ? '' : `
      <div class="area-prep-banner">
        <span class="area-prep-ico">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>
        </span>
        <div>
          <strong>Estamos preparando esta área</strong>
          <span>Ya puedes consultar el temario y los conceptos clave. Los PDFs descargables y los exámenes de práctica con calificación estarán disponibles muy pronto.</span>
        </div>
      </div>`;
    panel.innerHTML = `
      <div class="area-panel-head">
        <div>
          <div class="num">Área ${area.num}</div>
          <h2>${data.title}</h2>
          <p class="intro">${data.intro}</p>
        </div>
        <div style="margin-left:auto;text-align:right;color:var(--ink-mute);font-size:13px;flex-shrink:0">
          <div style="font-size:36px;font-weight:700;color:${area.color};line-height:1">${total}</div>
          <div>temas</div>
        </div>
      </div>
      ${prepBanner}
      ${renderAreaGuide(data)}
      ${data.subsections.map((sub) => `
        <div class="subsection">
          <h3 class="subsection-title">${sub.title}<span class="tag">${sub.topics.length} temas</span></h3>
          <div class="topics">${sub.topics.map(renderTopic).join('')}</div>
        </div>`).join('')}
    `;
    $$('.topic', panel).forEach((t) => {
      t.querySelector('.topic-head').addEventListener('click', () => t.classList.toggle('open'));
    });
    $$('.topic-exam', panel).forEach(bindTopicExam);
    panel.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  // ---------- exam grading ----------
  function bindTopicExam(examEl) {
    const total  = parseInt(examEl.dataset.total, 10) || 0;
    const qs     = $$('.exam-q', examEl);
    const grade  = examEl.querySelector('.exam-grade');
    const reset  = examEl.querySelector('.exam-reset');
    const result = examEl.querySelector('.exam-result');
    const ringEl = examEl.querySelector('.ring-progress');
    const numEl  = examEl.querySelector('.score-num');
    const lblEl  = examEl.querySelector('.exam-grade-label');
    const msgEl  = examEl.querySelector('.exam-grade-msg');

    qs.forEach((qEl) => {
      $$('.option-item', qEl).forEach((it) => {
        it.addEventListener('click', () => {
          if (examEl.classList.contains('graded')) return;
          $$('.option-item', qEl).forEach((x) => x.querySelector('input').checked = false);
          it.querySelector('input').checked = true;
        });
      });
    });

    grade.addEventListener('click', () => {
      const missing = qs.filter((qEl) => !qEl.querySelector('input[type=radio]:checked'));
      if (missing.length) {
        missing[0].classList.add('shake');
        setTimeout(() => missing[0].classList.remove('shake'), 500);
        missing[0].scrollIntoView({ behavior: 'smooth', block: 'center' });
        grade.textContent = `Responde las ${missing.length} restantes`;
        setTimeout(() => grade.textContent = 'Calificar examen', 1600);
        return;
      }

      let ok = 0;
      qs.forEach((qEl) => {
        const correct = qEl.dataset.correct;
        const chosen  = qEl.querySelector('input[type=radio]:checked').value;
        const items   = $$('.option-item', qEl);
        const just    = qEl.querySelector('.exam-just');
        items.forEach((it) => {
          it.classList.remove('correct', 'wrong');
          if (it.dataset.letter === correct) it.classList.add('correct');
          if (it.dataset.letter === chosen && chosen !== correct) it.classList.add('wrong');
        });
        if (chosen === correct) ok++;
        just.hidden = false;
        just.innerHTML = `<span class="just-lbl">${chosen === correct ? '✓ Correcto' : '✕ Respuesta correcta: ' + correct}</span><span class="just-msg">${qEl.dataset.just}</span>`;
        just.classList.toggle('good', chosen === correct);
        just.classList.toggle('bad',  chosen !== correct);
      });

      examEl.classList.add('graded');
      grade.hidden = true; reset.hidden = false; result.hidden = false;

      const pct = total ? ok / total : 0;
      const CIRC = 2 * Math.PI * 44;
      ringEl.style.strokeDashoffset = (CIRC * (1 - pct)).toFixed(2);
      const color = pct >= 0.8 ? '#16a34a' : pct >= 0.6 ? '#f59e0b' : '#dc2626';
      ringEl.style.stroke = color;

      const dur = 800, t0 = performance.now();
      (function step(t) {
        const k = Math.min(1, (t - t0) / dur);
        const eased = 1 - Math.pow(1 - k, 3);
        numEl.textContent = Math.round(eased * ok);
        if (k < 1) requestAnimationFrame(step);
      })(performance.now());

      const tenths = Math.round((ok / total) * 100) / 10;
      let label, msg;
      if (pct >= 0.9)      { label = `Excelente · ${tenths.toFixed(1)}/10`; msg = '¡Dominio del tema! Sigue así.'; }
      else if (pct >= 0.7) { label = `Bien · ${tenths.toFixed(1)}/10`;       msg = 'Buen trabajo. Repasa los errores marcados.'; }
      else if (pct >= 0.5) { label = `Aprobado · ${tenths.toFixed(1)}/10`;   msg = 'Vas bien, pero conviene repasar el PDF del tema.'; }
      else                  { label = `Insuficiente · ${tenths.toFixed(1)}/10`; msg = 'Repasa el material y vuelve a intentarlo.'; }
      lblEl.textContent = label;
      msgEl.textContent = msg;
      result.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });

    reset.addEventListener('click', () => {
      examEl.classList.remove('graded');
      qs.forEach((qEl) => {
        $$('.option-item', qEl).forEach((it) => {
          it.classList.remove('correct', 'wrong');
          it.querySelector('input').checked = false;
        });
        const just = qEl.querySelector('.exam-just');
        just.hidden = true; just.innerHTML = '';
        just.classList.remove('good', 'bad');
      });
      result.hidden = true; grade.hidden = false; reset.hidden = true;
      ringEl.style.strokeDashoffset = 276.46;
      numEl.textContent = '0';
    });
  }

  // ---------- bind area selector ----------
  function bindAreaButtons() {
    $$('.area-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        $$('.area-btn').forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        renderAreaOrPaywall(btn.dataset.key);
      });
    });
  }

  // Los botones .sub-buy los maneja js/pages/checkout.js, que crea la
  // preferencia real de Mercado Pago. Antes se registraba aquí un segundo
  // manejador que navegaba a "[object Object]" y rompía el pago.

  // Si el usuario inició sesión con un plan pendiente, continúa el flujo
  if (window.YESEMS_AUTH && window.YESEMS_AUTH.onChange) {
    window.YESEMS_AUTH.onChange((user) => {
      if (user) {
        const pending = sessionStorage.getItem('yesems_pending_plan');
        if (pending) {
          sessionStorage.removeItem('yesems_pending_plan');
          // Ya hay sesión: reactivamos el botón que el usuario había pulsado
          // para que checkout.js siga el cobro donde se quedó.
          const btn = document.querySelector('.sub-buy[data-plan="' + pending + '"]')
                   || document.querySelector('.sub-buy');
          if (btn) btn.click();
        }
      }
    });
  }

  function activatePlan(plan) {
    setSub(plan);
    renderSubStatus();
    renderAreaOrPaywall(activeAreaKey);
    const temas = document.getElementById('temas');
    if (temas) temas.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  // NOTA: aquí vivían dos restos de la etapa de Stripe que ya se eliminaron:
  //
  //   - handleStripeReturn(): desbloqueaba el curso con solo leer "?paid=" de
  //     la URL, así que cualquiera podía escribirla a mano y entrar gratis.
  //   - checkSupaMeta(): leía el plan de un campo de Supabase que ya no
  //     existe en el modelo actual.
  //
  // Hoy el acceso lo resuelve js/pages/checkout.js, que siempre lo confirma
  // contra la API (el acceso solo lo marca el webhook de pagos, desde el
  // servidor).

  // ---------- aplicar suscripción editable desde el panel admin ----------
  function applySubscription() {
    const s = window.YESEMS_CONTENT && window.YESEMS_CONTENT.data && window.YESEMS_CONTENT.data.subscription;
    if (!s) return;
    const set = (sel, val) => { const el = document.querySelector(sel); if (el && val != null) el.textContent = val; };
    set('.sub-ribbon', s.ribbon);
    set('.sub-eyebrow', s.eyebrow);
    set('.sub-head h3', s.title);
    set('.sub-tag', s.tag);
    set('.sub-currency', s.currency);
    set('.sub-amount', s.price);
    const per = document.querySelector('.sub-period'); if (per && s.period != null) per.innerHTML = s.period;
    const ul = document.querySelector('.sub-features');
    if (ul && Array.isArray(s.features)) {
      ul.innerHTML = s.features.map((f) =>
        `<li><svg class="ck" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><polyline points="20 6 9 17 4 12"/></svg>${f}</li>`).join('');
    }
    const buy = document.querySelector('.sub-buy'); if (buy && s.planId) buy.dataset.plan = s.planId;
  }

  // ---------- arranque (espera el contenido publicado en Supabase) ----------
  function boot() {
    const content = window.YESEMS_CONTENT && window.YESEMS_CONTENT.data;
    if (content && content.areasOrder && content.areasOrder.length) AREAS = content.areasOrder;
    renderAreaSelector();
    bindAreaButtons();
    applySubscription();
    renderSubStatus();
    // El acceso pagado lo confirma js/pages/checkout.js contra la API.
    const firstKey = AREAS[0] ? AREAS[0].key : 'matematico';
    const firstBtn = document.querySelector('.area-btn[data-key="' + firstKey + '"]');
    if (firstBtn) { firstBtn.classList.add('active'); renderAreaOrPaywall(firstKey); }
  }

  // Vuelve a dibujar el área activa. El acceso y el contenido completo llegan
  // de forma asíncrona (tras confirmar la sesión contra el servidor); sin este
  // repintado, la primera pintura muestra el candado y ya no se actualiza
  // aunque el acceso se conceda.
  function rerenderPorAcceso() {
    if (window.YESEMS_CONTENT && window.YESEMS_CONTENT.data) {
      const c = window.YESEMS_CONTENT.data;
      if (c.areasOrder && c.areasOrder.length) AREAS = c.areasOrder;
    }
    renderSubStatus();
    if (activeAreaKey) renderAreaOrPaywall(activeAreaKey);
  }

  if (window.YESEMS_CONTENT && window.YESEMS_CONTENT.ready) window.YESEMS_CONTENT.ready.then(boot);
  else boot();

  // Al confirmarse la sesión (y con ella el acceso pagado) o al recargar el
  // contenido, se repinta para quitar el candado si corresponde.
  if (window.YESEMS_AUTH && window.YESEMS_AUTH.onChange) {
    window.YESEMS_AUTH.onChange(rerenderPorAcceso);
  }
  document.addEventListener('yesems:contenido', rerenderPorAcceso);
})();
