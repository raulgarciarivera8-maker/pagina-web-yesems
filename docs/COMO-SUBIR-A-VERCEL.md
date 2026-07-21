# Subir este sitio a Vercel

El frontend es **estático** (HTML, CSS y JavaScript). No necesita "build".

> **Importante:** el sitio vive en la carpeta `frontend/`, no en la raíz del
> repositorio. De eso se encarga el `vercel.json` de la raíz, con
> `"outputDirectory": "frontend"`.
>
> Por eso el campo **Root Directory** de Vercel debe quedarse **VACÍO**. Si le
> pones `frontend`, Vercel buscaría `frontend/frontend/` y el sitio saldría en
> 404. La carpeta se configura en un sitio solamente: el `vercel.json`.

## Desde GitHub (recomendado)

1. En Vercel: **Add New… → Project → Import** este repositorio.
2. **Root Directory:** déjalo vacío.
3. **Framework Preset:** **Other** (sin framework).
   Deja vacíos *Build Command* y *Output Directory*.
4. Clic en **Deploy**.

A partir de ahí, cada `git push` a `main` republica el sitio solo.

### Si el sitio da 404 en todas las rutas

Señal de que Vercel está sirviendo desde la carpeta equivocada. Comprueba que
**Settings → General → Root Directory** esté **vacío** y que el `vercel.json`
de la raíz siga teniendo `"outputDirectory": "frontend"`.

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
