// ============================================================
//  VALORES POR DEFECTO  ·  YES EMS  (Acredita-Bach)
//  ------------------------------------------------------------
//  Estos son los datos "de fábrica". Si Supabase tiene contenido
//  guardado por el administrador, ese tiene prioridad; si no,
//  el sitio usa estos valores. NO borres este archivo: es el
//  respaldo que mantiene la página funcionando siempre.
// ============================================================

// Orden, color y numeración de las 7 áreas del examen.
window.YESEMS_AREAS_DEFAULT = [
  { key: 'matematico',  label: 'Pensamiento Matemático', num: '01', color: '#ea580c' },
  { key: 'digital',     label: 'Cultura Digital',        num: '02', color: '#0891b2' },
  { key: 'historica',   label: 'Conciencia Histórica',   num: '03', color: '#b45309' },
  { key: 'humanidades', label: 'Humanidades',            num: '04', color: '#7c3aed' },
  { key: 'naturales',   label: 'Ciencias Naturales',     num: '05', color: '#16a34a' },
  { key: 'lengua',      label: 'Lengua y Comunicación',  num: '06', color: '#2563eb' },
  { key: 'sociales',    label: 'Ciencias Sociales',      num: '07', color: '#db2777' }
];

// Plan de suscripción (lo que se muestra en la sección "Planes").
window.YESEMS_SUB_DEFAULT = {
  ribbon:   'Acceso completo',
  eyebrow:  'Plan',
  title:    'Acredita-Bach',
  tag:      'Todo lo que necesitas para aprobar tu examen',
  currency: '$',
  price:    '150',
  period:   'MXN<br>/ mensual',
  planId:   'acredita-bach',
  features: [
    'Acceso al curso completo Acredita-Bach',
    'Material de estudio en PDF de las 7 áreas',
    'Exámenes de práctica con calificación inmediata',
    'Plataforma disponible 24/7',
    'Asesorías grupales en vivo cada semana',
    'Simulacro completo tipo CENEVAL',
    'Constancia de preparación YES EMS',
    'Acompañamiento y soporte por WhatsApp'
  ]
};

// PDFs por tema (n.º de tema → ruta/URL del PDF).
// Por defecto vacío: cada área usa su "guía completa" (campo guide).
window.topicPDFs = window.topicPDFs || {};
