# YES EMS · Acredita-Bach

Sitio de preparación para el examen CENEVAL Acredita-Bach.

## Estructura

```
frontend/          → Vercel        (sitio estático, sin build)
├── index.html
├── acredita-bach.html
├── admin.html                     panel de administrador
├── verificar.html                 destino del correo de confirmación
├── restablecer.html               destino del correo de recuperación
├── css/
├── js/
│   ├── config/                    URL de la API y llaves públicas
│   ├── data/                      temario, exámenes y valores de fábrica
│   ├── pages/                     lógica de cada página
│   ├── shared/                    header y footer compartidos
│   ├── auth.js                    registro, login y sesión
│   └── content.js                 puente con la API
└── assets/                        fuentes, imágenes y PDFs

backend/           → Render        (API en Express)
├── src/
│   ├── server.js                  arranque, CORS, healthcheck
│   ├── db.js                      MongoDB e índices
│   ├── security.js                bcrypt, JWT y tokens de un solo uso
│   ├── mailer.js                  correos con SendGrid
│   └── routes/                    auth, contenido, archivos, pagos
└── render.yaml                    configuración de despliegue

docs/                              guías de configuración
```

## Servicios

| Pieza | Dónde | Plan |
|---|---|---|
| Sitio web | Vercel | gratis |
| API | Render | free (se duerme a los 15 min) |
| Usuarios y contenido | MongoDB Atlas | M0 gratis |
| PDFs del curso | Cloudinary | free, 25 GB |
| Correos | SendGrid | free |
| Pagos | Mercado Pago | — |

Ninguno pide tarjeta.

## Puesta en marcha

Sigue [docs/SETUP.md](docs/SETUP.md) — unos 30 minutos.
Los pagos van aparte, en [docs/SETUP-PAGOS.md](docs/SETUP-PAGOS.md).

## Desarrollo local

Frontend (archivos estáticos, sin compilación):

```bash
cd frontend
python -m http.server 3000
```

Backend:

```bash
cd backend
cp .env.example .env      # rellena los valores
npm install
npm run dev
```

## Dónde se edita cada cosa

| Quiero cambiar… | Dónde |
|---|---|
| Textos, temario, exámenes y PDFs | Panel `admin.html` |
| Contenido de fábrica | `frontend/js/data/` |
| Precio del curso | `frontend/js/pages/checkout.js` y `backend/src/routes/pagos.js` |
| Quién es administrador | Variable `ADMIN_EMAILS` en Render |
| Header o footer | `frontend/js/shared/layout.js` |
| Plantilla de los correos | `backend/src/mailer.js` |

## Seguridad

Lo que conviene saber para no romperlo:

- Las contraseñas se guardan con **bcrypt coste 12**, nunca en texto plano.
- La sesión es un **JWT de 7 días** en `localStorage`, enviado en la cabecera
  `Authorization`. Si cambias `JWT_SECRET`, todas las sesiones se cierran.
- Los enlaces de verificación y recuperación se guardan **hasheados**, son de
  **un solo uso** y caducan (24 h y 1 h).
- Lo que está en `frontend/js/config/` es **público**: viaja al navegador de
  cualquier visitante. Los secretos de verdad (MongoDB, Cloudinary, SendGrid,
  Mercado Pago) viven solo en las variables de entorno de Render.
- El desbloqueo del contenido en pantalla es **visual**. Quien decide si
  alguien pagó es el servidor, en `/api/pagos/webhook`.
