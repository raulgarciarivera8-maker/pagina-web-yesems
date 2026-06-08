// ============================================================
//  CONTENT STORE  ·  YES EMS
//  ------------------------------------------------------------
//  Puente entre la página y Supabase para el CONTENIDO del curso
//  (áreas, temas, exámenes, PDFs y suscripción).
//
//  - load()        carga el contenido desde Supabase (o usa los
//                  valores por defecto si aún no hay nada guardado).
//  - save(doc)     guarda TODO el contenido (solo administradores).
//  - uploadPDF()   sube un archivo PDF al almacenamiento de Supabase.
//  - ready         promesa que se resuelve cuando el contenido cargó.
//  - data          el documento de contenido ya combinado y listo.
//  - defaults      copia de los valores de fábrica.
//
//  Debe cargarse DESPUÉS de: data/modules.js, data/topic-quizzes.js,
//  data/site-defaults.js y supabase-config.js.
// ============================================================
(function () {
  const cfg  = window.YESEMS_SUPABASE || {};
  const REAL = !!(cfg.SUPABASE_URL && cfg.SUPABASE_ANON_KEY);
  const CONTENT_ID = 'acredita-bach';
  const BUCKET     = 'pdfs';

  const clone = (o) => (o == null ? o : JSON.parse(JSON.stringify(o)));

  // Cliente Supabase: reusa el de auth.js si existe; si no, crea uno.
  let supa = window.YESEMS_SUPA_CLIENT || null;
  if (!supa && REAL && window.supabase) {
    supa = window.supabase.createClient(cfg.SUPABASE_URL, cfg.SUPABASE_ANON_KEY, {
      auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true, flowType: 'pkce' }
    });
    window.YESEMS_SUPA_CLIENT = supa;
  }

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

  async function fetchDoc() {
    if (!supa) return null;
    try {
      const { data, error } = await supa
        .from('site_content').select('data').eq('id', CONTENT_ID).maybeSingle();
      if (error) { console.warn('[content] lectura:', error.message); return null; }
      return data ? data.data : null;
    } catch (e) {
      console.warn('[content] lectura falló:', e.message);
      return null;
    }
  }

  async function load() {
    const remote = await fetchDoc();
    const hasRemote = remote && Object.keys(remote).length > 0;
    const doc = mergeDefaults(remote);
    apply(doc);
    api.data   = doc;
    api.source = hasRemote ? 'supabase' : 'defaults';
    return doc;
  }

  async function save(doc, email) {
    if (!supa) throw new Error('Supabase no está configurado.');
    const payload = {
      id: CONTENT_ID,
      data: doc,
      updated_at: new Date().toISOString(),
      updated_by: email || null
    };
    const { error } = await supa.from('site_content').upsert(payload);
    if (error) throw error;
    api.data = clone(doc);
    api.source = 'supabase';
  }

  async function uploadPDF(file, email) {
    if (!supa) throw new Error('Supabase no está configurado.');
    const safe = (file.name || 'documento.pdf').replace(/[^a-zA-Z0-9._-]/g, '_');
    const path = Date.now() + '_' + safe;
    const { error } = await supa.storage.from(BUCKET)
      .upload(path, file, { upsert: true, contentType: file.type || 'application/pdf' });
    if (error) throw error;
    const { data } = supa.storage.from(BUCKET).getPublicUrl(path);
    return data.publicUrl;
  }

  const api = {
    load, save, uploadPDF,
    data: null,
    source: null,
    defaults: DEFAULTS,
    isReal: () => REAL,
    hasClient: () => !!supa,
    client: () => supa,
    CONTENT_ID, BUCKET
  };
  api.ready = load();

  window.YESEMS_CONTENT = api;
})();
