// ============================================================
//  CONFIGURACIÓN DE FIREBASE  ·  YES EMS
//  ------------------------------------------------------------
//  Aquí pegas la configuración PÚBLICA de tu proyecto Firebase.
//  (Es segura para el navegador — NO es una llave secreta. Quien
//   protege los datos son las reglas de firestore.rules /
//   storage.rules, no el ocultar estos valores.)
//
//  Cómo obtenerla:
//   1. Entra a https://console.firebase.google.com → tu proyecto.
//   2. Icono de engrane → "Configuración del proyecto".
//   3. Baja a "Tus apps" → app web (</>) → "Configuración del SDK".
//   4. Copia los valores de firebaseConfig y pégalos abajo.
//
//  Mientras estén vacíos, el sitio funciona en MODO DEMO
//  (sin login real). Al pegarlos, se activa la autenticación real.
// ============================================================
window.YESEMS_FIREBASE = {
  apiKey:            '',
  authDomain:        '',   // ej: yesems.firebaseapp.com
  projectId:         '',
  storageBucket:     '',   // ej: yesems.firebasestorage.app
  messagingSenderId: '',
  appId:             ''
};

// Correos con permiso de administrador.
// DEBEN coincidir con la lista de firestore.rules y storage.rules.
window.YESEMS_ADMINS = [
  'raulyeyo12@gmail.com',
  'raulgarciarivera08@gmail.com'
];
