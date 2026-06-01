// ============ ACREDITA-BACH page logic ============
// Reuses window.modulesData + window.topicPDFs + window.topicQuizzes.

(function () {
  const $  = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));

  const AREAS = [
    { key: 'cientifico', label: 'Pensamiento Científico',  num: '01', color: '#16a34a' },
    { key: 'lectora',    label: 'Comprensión Lectora',     num: '02', color: '#2563eb' },
    { key: 'redaccion',  label: 'Redacción Indirecta',     num: '03', color: '#7c3aed' },
    { key: 'matematico', label: 'Pensamiento Matemático',  num: '04', color: '#ea580c' },
    { key: 'ingles',     label: 'Inglés como L. Extranjera', num:'05', color: '#0891b2' }
  ];

  const AREA_ICONS = {
    cientifico: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M10 2v8L4 22h16L14 10V2"/></svg>',
    lectora:    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>',
    redaccion:  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 19l7-7 3 3-7 7-3-3z"/><path d="M18 13L13 8"/><path d="M2 2l7 7L2 16z"/></svg>',
    matematico: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M4 4h16v4l-6 4 6 4v4H4v-4l6-4-6-4z"/></svg>',
    ingles:     '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2c3 3.5 4 7.5 4 10s-1 7-4 10c-3-3-4-7-4-10s1-7 4-10z"/></svg>'
  };

  // ---------- subscription state (prototype: stored locally) ----------
  const SUB_KEY = 'yesems_acredita_sub';
  const PLAN_LABELS = { esencial: 'Esencial', plus: 'Plus', premium: 'Premium' };

  // =====================================================================
  //  STRIPE — Enlaces de pago (Payment Links)
  //  --------------------------------------------------------------------
  //  Cómo conectar el cobro real (sin programar y sin backend):
  //   1. Entra a https://dashboard.stripe.com/payment-links
  //   2. Crea 3 enlaces de pago, uno por plan (Esencial / Plus / Premium),
  //      con su precio en MXN.
  //   3. En cada enlace, en "Después del pago" → "Redirigir a tu sitio web",
  //      pega la URL de esta página agregando el parámetro del plan, ej:
  //        https://TUSITIO.com/acredita-bach.html?paid=esencial
  //        https://TUSITIO.com/acredita-bach.html?paid=plus
  //        https://TUSITIO.com/acredita-bach.html?paid=premium
  //   4. Copia la URL de cada Payment Link de Stripe y pégala abajo.
  //  Mientras estén vacíos, los botones usan el modo demo (desbloqueo local).
  // =====================================================================
  const STRIPE_LINKS = {
    esencial: '', // p.ej. 'https://buy.stripe.com/xxxxxxxxxxxx'
    plus:     '',
    premium:  ''
  };

  function getSub()   { try { return localStorage.getItem(SUB_KEY); } catch (e) { return null; } }
  function setSub(p)  { try { localStorage.setItem(SUB_KEY, p); } catch (e) {} }
  function clearSub() { try { localStorage.removeItem(SUB_KEY); } catch (e) {} }
  function isUnlocked() { return !!getSub(); }
  let activeAreaKey = 'cientifico';

  // ---------- helpers ----------
  function escapeHTML(s) {
    return String(s).replace(/[&<>"']/g, (c) => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c]));
  }

  // ---------- render area selector ----------
  const grid = document.getElementById('areaGrid');
  if (grid) {
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
          <span class="area-icon">${AREA_ICONS[a.key]}</span>
          <h3>${a.label}</h3>
          <div class="meta">${total} temas · ${data.reactivos || '30 reactivos'}</div>
          ${badge}
        </button>`;
    }).join('');
  }

  // ---------- render module ----------
  const panel = document.getElementById('areaPanel');

  function renderTopic(t) {
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
          <a class="pdf-btn" href="${pdfPath}" download="${fileName}" target="_blank" rel="noopener">
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

    // Si el tema aún no tiene PDF ni examen, avisamos en lugar de dejarlo "a medias"
    if (!pdfPath && !(tQuiz && tQuiz.length)) {
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
            <span>Tienes acceso completo al material de estudio y a los exámenes de las 5 áreas.</span>
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
            <p>Desbloquea el material de estudio en PDF y los exámenes de práctica con calificación inmediata de las <strong>5 áreas</strong> del examen.</p>
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
    return data.subsections.some((sub) => sub.topics.some((t) => {
      const hasPdf = window.topicPDFs && window.topicPDFs[t.n];
      const q = window.topicQuizzes && window.topicQuizzes[t.n];
      return hasPdf || (q && q.length);
    }));
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
  $$('.area-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      $$('.area-btn').forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      renderAreaOrPaywall(btn.dataset.key);
    });
  });

  // ---------- bind subscription buy buttons ----------
  $$('.sub-buy').forEach((btn) => {
    btn.addEventListener('click', () => {
      const plan = btn.dataset.plan;
      // Requiere cuenta antes de pagar/activar
      const auth = window.YESEMS_AUTH;
      if (auth && !auth.getUser()) {
        sessionStorage.setItem('yesems_pending_plan', plan);
        auth.openModal('signup');
        return;
      }
      proceedToPlan(plan);
    });
  });

  function proceedToPlan(plan) {
    const link = STRIPE_LINKS[plan];
    if (link) {
      window.location.href = link;
      return;
    }
    activatePlan(plan); // modo demo
  }

  // Si el usuario inició sesión con un plan pendiente, continúa el flujo
  if (window.YESEMS_AUTH && window.YESEMS_AUTH.onChange) {
    window.YESEMS_AUTH.onChange((user) => {
      if (user) {
        const pending = sessionStorage.getItem('yesems_pending_plan');
        if (pending) {
          sessionStorage.removeItem('yesems_pending_plan');
          proceedToPlan(pending);
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

  // ---------- detect successful return from Stripe ----------
  (function handleStripeReturn() {
    const params = new URLSearchParams(window.location.search);
    const paid = params.get('paid');
    if (paid && PLAN_LABELS[paid]) {
      setSub(paid);
      // limpia la URL para que no quede el parámetro
      params.delete('paid');
      params.delete('session_id');
      const clean = window.location.pathname + (params.toString() ? '?' + params.toString() : '') + '#temas';
      window.history.replaceState({}, '', clean);
    }
  })();

  // open first by default
  renderSubStatus();
  const firstBtn = document.querySelector('.area-btn[data-key="cientifico"]');
  if (firstBtn) { firstBtn.classList.add('active'); renderAreaOrPaywall('cientifico'); }
})();
