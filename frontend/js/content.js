// ============================================================
//  CONTENT STORE  ·  YES EMS
//  ------------------------------------------------------------
//  Puente entre la página y Firebase para el CONTENIDO del curso
//  (áreas, temas, exámenes, PDFs y suscripción).
//
//  - load()        carga el contenido desde Firestore (o usa los
//                  valores por defecto si aún no hay nada guardado).
//  - save(doc)     guarda TODO el contenido (solo administradores).
//  - uploadPDF()   sube un archivo PDF a Cloud Storage.
//  - ready         promesa que se resuelve cuando el contenido cargó.
//  - data          el documento de contenido ya combinado y listo.
//  - defaults      copia de los valores de fábrica.
//
//  Debe cargarse DESPUÉS de: data/modules.js, data/quizzes.js,
//  data/defaults.js, config/firebase.js y auth.js.
// ============================================================
(function () {
  const cfg  = window.YESEMS_FIREBASE || {};
  const REAL = !!(cfg.apiKey && cfg.projectId);
  const CONTENT_ID = 'acredita-bach';
  const COLLECTION = 'site_content';
  const BUCKET_DIR = 'pdfs';

  const clone = (o) => (o == null ? o : JSON.parse(JSON.stringify(o)));

  // App de Firebase: reusa la que inicializó auth.js; si no existe, la crea.
  let app = window.YESEMS_FB_APP || null;
  if (!app && REAL && window.firebase) {
    app = firebase.apps.length ? firebase.app() : firebase.initializeApp(cfg);
    window.YESEMS_FB_APP = app;
  }
  const db = app ? firebase.firestore() : null;
  const storage = app ? firebase.storage() : null;

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
    if (!db) return null;
    try {
      const snap = await db.collection(COLLECTION).doc(CONTENT_ID).get();
      if (!snap.exists) return null;
      // El contenido vive bajo el campo "data", igual que antes.
      return snap.data().data || null;
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
    api.source = hasRemote ? 'firebase' : 'defaults';
    return doc;
  }

  async function save(doc, email) {
    if (!db) throw new Error('Firebase no está configurado.');
    await db.collection(COLLECTION).doc(CONTENT_ID).set({
      data: doc,
      updated_at: new Date().toISOString(),
      updated_by: email || null
    });
    api.data = clone(doc);
    api.source = 'firebase';
  }

  async function uploadPDF(file, email) {
    if (!storage) throw new Error('Firebase no está configurado.');
    const safe = (file.name || 'documento.pdf').replace(/[^a-zA-Z0-9._-]/g, '_');
    const path = BUCKET_DIR + '/' + Date.now() + '_' + safe;
    const ref  = storage.ref().child(path);
    await ref.put(file, { contentType: file.type || 'application/pdf' });
    return await ref.getDownloadURL();
  }

  const api = {
    load, save, uploadPDF,
    data: null,
    source: null,
    defaults: DEFAULTS,
    isReal: () => REAL,
    hasClient: () => !!db,
    client: () => db,
    CONTENT_ID, COLLECTION, BUCKET_DIR
  };
  api.ready = load();

  window.YESEMS_CONTENT = api;
})();
