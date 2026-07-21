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
  apiKey:            'AIzaSyD0kQPR7Z2ATIswkS7gHMe09W2k1rymDXw',
  authDomain:        'acreditabach.firebaseapp.com',
  projectId:         'acreditabach',
  storageBucket:     'acreditabach.firebasestorage.app',
  messagingSenderId: '564218916151',
  appId:             '1:564218916151:web:b5bfd40618b922137cbeb2',
  measurementId:     'G-GW5BEQ2T94'
};

// Correos con permiso de administrador.
// DEBEN coincidir con la lista de firestore.rules y storage.rules.
window.YESEMS_ADMINS = [
  'raulyeyo12@gmail.com',
  'raulgarciarivera08@gmail.com'
];
