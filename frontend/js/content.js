// ============================================================
//  CONTENT STORE  ·  YES EMS
//  ------------------------------------------------------------
//  Puente entre la página y la API para el CONTENIDO del curso
//  (áreas, temas, exámenes, PDFs y suscripción).
//
//  - load()        carga el contenido publicado (o los valores de
//                  fábrica si aún no hay nada guardado).
//  - save(doc)     guarda TODO el contenido (solo administradores).
//  - uploadPDF()   sube un PDF a Cloudinary y devuelve su URL.
//  - ready         promesa que se resuelve cuando el contenido cargó.
//  - data          el documento de contenido ya combinado y listo.
//
//  Debe cargarse DESPUÉS de: data/modules.js, data/quizzes.js,
//  data/defaults.js, config/api.js y auth.js.
// ============================================================
(function () {
  const API = (window.YESEMS_API_URL || '').replace(/\/$/, '');
  const REAL = !!API;

  const clone = (o) => (o == null ? o : JSON.parse(JSON.stringify(o)));

  // ---- Captura de los valores de fábrica (ANTES de aplicar remoto) ----
  const DEFAULTS = {
    areasOrder:   clone(window.YESEMS_AREAS_DEFAULT || null),
    modules:      clone(window.modulesData || {}),
    quizzes:      clone(window.topicQuizzes || {}),
    pdfs:         clone(window.topicPDFs || {}),
    subscription: clone(window.YESEMS_SUB_DEFAULT || null)
  };

  function mergeDefaults(remote) {
    const r = remote || {};
    return {
      areasOrder:   r.areasOrder   || clone(DEFAULTS.areasOrder),
      modules:      r.modules      || clone(DEFAULTS.modules),
      quizzes:      r.quizzes      || clone(DEFAULTS.quizzes),
      pdfs:         r.pdfs         || clone(DEFAULTS.pdfs),
      subscription: r.subscription || clone(DEFAULTS.subscription)
    };
  }

  // Aplica un documento a las variables globales que usa la página.
  function apply(doc) {
    if (!doc) return;
    if (doc.modules) window.modulesData = doc.modules;
    if (doc.quizzes) window.topicQuizzes = doc.quizzes;
    if (doc.pdfs)    window.topicPDFs = doc.pdfs;
  }

  // Igual que en auth.js: sin tiempo límite, una petición interceptada deja
  // la página cargando para siempre.
  function conCorte(ms) {
    const c = new AbortController();
    setTimeout(() => c.abort(), ms);
    return c.signal;
  }

  // Pide primero el material completo, que el servidor solo entrega a quien
  // tiene la suscripción activa (o al administrador). Si no hay acceso, cae
  // a la vitrina pública: títulos y estructura, sin el material.
  //
  // Antes todo el temario y los 98 exámenes con sus respuestas viajaban en
  // archivos .js a cualquier visitante, así que el candado era decorativo.
  async function fetchDoc() {
    if (!REAL) return null;
    const token = window.YESEMS_AUTH && window.YESEMS_AUTH.getToken();

    if (token) {
      try {
        const r = await fetch(API + '/api/contenido/completo', {
          headers: { Authorization: 'Bearer ' + token },
          signal: conCorte(20000),
        });
        if (r.ok) {
          const j = await r.json();
          api.conAcceso = true;
          return j.data || null;
        }
        // 403 = sin suscripción: es lo normal, seguimos con la vitrina.
      } catch (e) {
        console.warn('[content] no se pudo pedir el material completo:', e.message);
      }
    }

    try {
      const r = await fetch(API + '/api/contenido', { signal: conCorte(20000) });
      if (!r.ok) return null;
      const j = await r.json();
      api.conAcceso = false;
      return j.data || null;
    } catch (e) {
      // El plan free de Render duerme el servicio: la primera petición
      // puede tardar o fallar. La página sigue con los valores de fábrica.
      console.warn('[content] no se pudo cargar el contenido:', e.message);
      return null;
    }
  }

  async function load() {
    const remote = await fetchDoc();
    const hasRemote = remote && Object.keys(remote).length > 0;
    const doc = mergeDefaults(remote);
    apply(doc);
    api.data   = doc;
    api.source = hasRemote ? 'api' : 'defaults';
    return doc;
  }

  async function save(doc) {
    if (!REAL) throw new Error('La API no está configurada.');
    const token = window.YESEMS_AUTH && window.YESEMS_AUTH.getToken();
    if (!token) throw new Error('Inicia sesión para guardar.');

    const r = await fetch(API + '/api/contenido', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token,
      },
      body: JSON.stringify({ data: doc }),
    });
    if (!r.ok) {
      const j = await r.json().catch(() => ({}));
      const err = new Error(j.error || 'No se pudo guardar.');
      err.status = r.status;
      throw err;
    }
    api.data = clone(doc);
    api.source = 'api';
  }

  // Sube el PDF DIRECTO a Cloudinary. El servidor solo entrega una firma
  // temporal: la llave secreta nunca llega al navegador, y el archivo no
  // pasa por Render (que en el plan free tarda en despertar).
  async function uploadPDF(file) {
    if (!REAL) throw new Error('La API no está configurada.');
    const token = window.YESEMS_AUTH && window.YESEMS_AUTH.getToken();
    if (!token) throw new Error('Inicia sesión para subir archivos.');

    const rf = await fetch(API + '/api/archivos/firma', {
      method: 'POST',
      headers: { Authorization: 'Bearer ' + token },
    });
    if (!rf.ok) {
      const j = await rf.json().catch(() => ({}));
      throw new Error(j.error || 'No se pudo preparar la subida.');
    }
    const f = await rf.json();

    const fd = new FormData();
    fd.append('file', file);
    fd.append('api_key', f.apiKey);
    fd.append('timestamp', f.timestamp);
    fd.append('signature', f.signature);
    fd.append('folder', f.folder);

    const ru = await fetch(f.uploadUrl, { method: 'POST', body: fd });
    if (!ru.ok) {
      const j = await ru.json().catch(() => ({}));
      throw new Error((j.error && j.error.message) || 'Cloudinary rechazó el archivo.');
    }
    const up = await ru.json();
    return up.secure_url;
  }

  const api = {
    load, save, uploadPDF,
    data: null,
    source: null,
    conAcceso: false,
    defaults: DEFAULTS,
    isReal: () => REAL,
  };
  api.ready = load();

  // Al iniciar sesión (o al confirmarse un pago) hay que volver a pedirlo:
  // la primera carga pudo ser la vitrina y ahora ya toca el material completo.
  if (window.YESEMS_AUTH && window.YESEMS_AUTH.onChange) {
    let ultimoToken = null;
    window.YESEMS_AUTH.onChange(function () {
      const t = window.YESEMS_AUTH.getToken();
      if (t === ultimoToken) return;
      ultimoToken = t;
      api.ready = load().then(function (doc) {
        document.dispatchEvent(new CustomEvent('yesems:contenido', { detail: doc }));
        return doc;
      });
    });
  }

  window.YESEMS_CONTENT = api;
})();
