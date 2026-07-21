# Subir este sitio a Vercel

El frontend es **estático** (HTML, CSS y JavaScript). No necesita "build".

> **Lo más importante:** ahora el sitio vive en la carpeta `frontend/`, no en la
> raíz del repositorio. Hay que decírselo a Vercel con **Root Directory**, o
> publicará una página en blanco.

## Desde GitHub (recomendado)

1. En Vercel: **Add New… → Project → Import** este repositorio.
2. **Root Directory:** clic en *Edit* y elige **`frontend`**. ← el paso clave
3. **Framework Preset:** **Other** (sin framework).
   Deja vacíos *Build Command* y *Output Directory*.
4. Clic en **Deploy**.

A partir de ahí, cada `git push` a `main` republica el sitio solo.

### Si el proyecto ya existe en Vercel

Solo hay que corregir la carpeta raíz:

**Settings → General → Root Directory → `frontend` → Save**, y después
**Deployments → … → Redeploy**.

## Después de publicar

1. Abre tu sitio: `https://tu-proyecto.vercel.app`
2. Abre el panel: `https://tu-proyecto.vercel.app/admin.html`
3. Para que funcione el **login con Google**, agrega tu dominio de Vercel en
   Firebase → **Authentication → Settings → Authorized domains**
   (ver [SETUP-FIREBASE.md](SETUP-FIREBASE.md), Paso 2).
4. Pon la URL del sitio en `backend/functions/.env` (variable `SITE_URL`), para
   que Mercado Pago sepa a dónde regresar al usuario después de pagar.
5. Pega la URL de tus Cloud Functions en `window.YESEMS_FUNCTIONS_URL`, dentro
   de `frontend/index.html` y `frontend/acredita-bach.html`. La obtienes al
   correr `firebase deploy --only functions`.

> La configuración de Firebase que está en `frontend/js/config/firebase.js` es
> **pública** y es seguro que viaje al navegador. Lo que protege tu información
> son las reglas de `backend/firestore.rules` y `backend/storage.rules`.
