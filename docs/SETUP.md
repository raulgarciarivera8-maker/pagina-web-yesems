# Puesta en marcha · YES EMS

Tres cuentas gratuitas, **ninguna pide tarjeta**. Calcula unos 30 minutos.

| Servicio | Para qué | Plan |
|---|---|---|
| [MongoDB Atlas](https://cloud.mongodb.com) | usuarios y contenido | M0 gratis |
| [Render](https://render.com) | la API | Free |
| [Cloudinary](https://cloudinary.com) | los PDFs del curso | Free (25 GB) |
| [SendGrid](https://sendgrid.com) | correos de verificación | Free |

---

## Paso 1 · MongoDB Atlas

1. Crea una cuenta y un clúster **M0 (Free)**.
2. **Database Access → Add New Database User.** Usa **Autogenerate Secure Password** y guárdala.
3. **Network Access → Add IP Address → Allow access from anywhere (`0.0.0.0/0`).**

   > Render no tiene IP fija, así que no hay alternativa. Por eso la contraseña del usuario debe ser larga y única: es lo único que protege la base.

4. **Connect → Drivers** y copia la cadena. Se ve así:
   ```
   mongodb+srv://usuario:CONTRASEÑA@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
   Sustituye `CONTRASEÑA` por la real.

No hay que crear colecciones ni índices: el servidor los crea solo al arrancar.

---

## Paso 2 · Cloudinary

1. Crea la cuenta (no pide tarjeta).
2. En el **Dashboard**, apunta **Cloud Name**, **API Key** y **API Secret**.

> La **API Secret** solo va en Render. Nunca en el navegador: con ella se puede subir y borrar cualquier archivo de tu cuenta.

---

## Paso 3 · SendGrid

1. Crea la cuenta.
2. **Settings → Sender Authentication** → verifica un remitente (Single Sender basta).
3. **Settings → API Keys → Create API Key**, permiso **Mail Send**. Empieza con `SG.`

> Sin remitente verificado, SendGrid acepta la llave pero no envía nada.

Si el plan gratuito ya no está disponible, [Resend](https://resend.com) da 3.000 correos al mes; solo habría que cambiar `backend/src/mailer.js`.

---

## Paso 4 · Render

1. **New → Blueprint** y conecta este repositorio. Render lee `backend/render.yaml` solo.
2. Al crear el servicio, en **Environment**, pega:

| Variable | Valor |
|---|---|
| `MONGODB_URI` | la cadena del Paso 1 |
| `CLOUDINARY_CLOUD_NAME` | del Paso 2 |
| `CLOUDINARY_API_KEY` | del Paso 2 |
| `CLOUDINARY_API_SECRET` | del Paso 2 |
| `SENDGRID_API_KEY` | del Paso 3 |
| `API_URL` | la URL del propio servicio, p. ej. `https://yesems-api.onrender.com` |

`JWT_SECRET` lo genera Render solo. Los pagos se configuran aparte, en [SETUP-PAGOS.md](SETUP-PAGOS.md).

3. Espera a que el despliegue quede **Live** y comprueba que responde:
   ```
   https://TU-SERVICIO.onrender.com/api/salud
   ```
   Debe devolver `{"ok":true,...}`.

---

## Paso 5 · Conectar el frontend

Edita `frontend/js/config/api.js` y pon la URL de Render:

```js
window.YESEMS_API_URL = 'https://yesems-api.onrender.com';
```

Haz `git push`. Vercel republica solo y el sitio deja el modo demo.

---

## Paso 6 · Tu cuenta de administrador

1. Entra a `/admin.html` → **Crea una cuenta** con uno de los correos de `ADMIN_EMAILS`.
2. Abre el correo de confirmación y pulsa el enlace.
3. Vuelve a `/admin.html`: ya puedes editar y publicar.

Para cambiar quién es administrador, edita `ADMIN_EMAILS` en Render (separados por coma) y reinicia el servicio.

---

## Sobre el plan gratuito de Render

El servicio **se duerme tras 15 minutos sin tráfico** y la primera petición tarda ~50 segundos en despertarlo.

Para que el alumno no lo note, `js/config/api.js` llama a `/api/salud` en cuanto carga la página: mientras lee, el servidor despierta en segundo plano. Aun así, si entras al panel después de un rato, el primer guardado puede tardar. Es normal, no es un error.

---

## Problemas frecuentes

| Síntoma | Causa |
|---|---|
| El sitio dice "Modo demostración" | Falta `YESEMS_API_URL` en `js/config/api.js` |
| El login no responde y luego falla | Render dormido; reintenta a los 30 segundos |
| "No tienes permiso para esta acción" | Tu correo no está en `ADMIN_EMAILS` |
| No llega el correo de confirmación | Remitente sin verificar en SendGrid, o está en spam |
| La API arranca y se cae | Revisa los logs: casi siempre es `MONGODB_URI` mal escrita o falta el `0.0.0.0/0` |
