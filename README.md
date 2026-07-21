# YES EMS · Acredita-Bach

Sitio de preparación para el examen CENEVAL Acredita-Bach.

## Estructura

El proyecto está dividido en dos partes que se despliegan por separado:

```
frontend/          → Vercel        (sitio estático)
├── index.html
├── acredita-bach.html
├── admin.html                     panel de administrador
├── css/
├── js/
│   ├── config/                    llaves públicas de Firebase y Mercado Pago
│   ├── data/                      temario, exámenes y valores de fábrica
│   ├── pages/                     lógica de cada página
│   ├── shared/                    header y footer compartidos
│   ├── auth.js                    login, registro y sesión
│   └── content.js                 puente con Firestore y Storage
└── assets/                        fuentes, imágenes y PDFs

backend/           → Firebase
├── functions/                     Cloud Functions (pagos con Mercado Pago)
├── firestore.rules                quién puede leer y escribir los datos
├── storage.rules                  quién puede subir PDFs
└── firebase.json

docs/                              guías de configuración
```

## Servicios

| Pieza | Dónde vive |
|---|---|
| Sitio web | Vercel — sirve `frontend/` vía `vercel.json` |
| Base de datos | Firestore (`site_content`, `user_access`) |
| Login | Firebase Auth (correo/contraseña y Google) |
| PDFs e imágenes | Cloud Storage (carpeta `pdfs/`) |
| Pagos | Cloud Functions + Mercado Pago |

## Puesta en marcha

1. **Firebase** — sigue [docs/SETUP-FIREBASE.md](docs/SETUP-FIREBASE.md) y pega
   la configuración en `frontend/js/config/firebase.js`.
2. **Pagos** — sigue [docs/SETUP-PAGOS.md](docs/SETUP-PAGOS.md).
3. **Vercel** — sigue [docs/COMO-SUBIR-A-VERCEL.md](docs/COMO-SUBIR-A-VERCEL.md).
   El `vercel.json` de la raíz ya apunta a `frontend/`; el campo *Root
   Directory* de Vercel debe quedarse vacío.

## Desarrollo local

El frontend son archivos estáticos, sin compilación:

```bash
cd frontend
python -m http.server 3000
```

Backend (requiere `npm install -g firebase-tools`):

```bash
cd backend
firebase emulators:start
```

## Dónde se edita cada cosa

| Quiero cambiar… | Archivo |
|---|---|
| Textos, temario o exámenes | Panel `admin.html` (se guarda en Firestore) |
| Contenido de fábrica | `frontend/js/data/` |
| Precio del curso | `frontend/js/pages/checkout.js` y `backend/functions/index.js` |
| Lista de administradores | `firestore.rules`, `storage.rules` y `js/config/firebase.js` |
| Header o footer | `frontend/js/shared/layout.js` |

> Las llaves que están en `frontend/js/config/` son **públicas** a propósito:
> viajan al navegador de todas formas. Lo que protege los datos son las reglas
> de `backend/`. Los secretos de verdad (token de Mercado Pago) viven en
> Firebase Secrets y nunca se suben al repositorio.
