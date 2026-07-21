# Configuración de Firebase · YES EMS

Esto se hace **una sola vez**. Al terminar, lo que edites en el panel de
administrador lo verán los alumnos en la página.

> **Antes de empezar, algo que debes saber:** Firebase **exige activar el plan
> Blaze (pago por uso) con una tarjeta** para poder usar Cloud Storage (los
> PDFs) y Cloud Functions (los pagos). Desde el 3 de febrero de 2026 el plan
> gratuito Spark ya no da acceso a Storage.
>
> Con el tráfico de este sitio el consumo real casi con seguridad será **$0**,
> porque la cuota gratuita sigue existiendo dentro de Blaze. Aun así, **pon un
> presupuesto de alerta** (Paso 6) para que nunca te llegue un cobro sorpresa.

---

## Paso 1 · Crear el proyecto

1. Entra a <https://console.firebase.google.com> → **Agregar proyecto**.
2. Ponle un nombre (ej. `yesems`). Google Analytics es opcional.
3. Ya dentro, ícono `</>` (**Web**) → registra la app → copia el bloque
   `firebaseConfig` que te muestra.
4. Pega esos valores en **`frontend/js/config/firebase.js`**.

> Ya está hecho para el proyecto **`acreditabach`**: la configuración está
> puesta y `backend/.firebaserc` apunta a él. Estos pasos solo hacen falta si
> algún día creas un proyecto distinto.

---

## Paso 2 · Activar el inicio de sesión

1. Menú lateral → **Compilación** → **Authentication** → **Comenzar**.
2. Pestaña **Sign-in method**, habilita:
   - **Correo electrónico/contraseña**
   - **Google**
3. Pestaña **Settings** → **Authorized domains** → agrega tu dominio de Vercel
   (ej. `pagina-web-yesems.vercel.app`). Sin esto, el login con Google falla.

---

## Paso 3 · Crear la base de datos

1. **Compilación** → **Firestore Database** → **Crear base de datos**.
2. Elige **modo de producción** (las reglas correctas las subimos en el Paso 5).
3. Ubicación: `nam5 (us-central)`.

No hace falta crear colecciones a mano: `site_content` y `user_access` se crean
solas la primera vez que se guarda contenido o entra un pago.

---

## Paso 4 · Activar el almacén de PDFs

1. **Compilación** → **Storage** → **Comenzar**.
2. Aquí te pedirá activar el plan **Blaze**. Es el paso obligatorio del aviso
   de arriba.

---

## Paso 5 · Subir las reglas de seguridad

Las reglas son el candado real de tus datos. Desde la carpeta `backend/`:

```bash
npm install -g firebase-tools
firebase login
firebase deploy --only firestore:rules,storage:rules
```

> Si cambias la lista de administradores, edítala en **tres** lugares:
> `backend/firestore.rules`, `backend/storage.rules` y
> `frontend/js/config/firebase.js`.

Los administradores autorizados hoy son:

- `raulyeyo12@gmail.com`
- `raulgarciarivera08@gmail.com`

**Importante:** las reglas exigen `email_verified`. Al crear tu cuenta de
administrador, abre el correo de verificación que te manda Firebase antes de
intentar guardar contenido.

---

## Paso 6 · Poner un límite de gasto

Para dormir tranquilo con el plan Blaze:

1. <https://console.cloud.google.com/billing> → tu cuenta → **Presupuestos y alertas**.
2. **Crear presupuesto** → monto: por ejemplo **$5 USD** al mes.
3. Marca las alertas al 50 %, 90 % y 100 %.

Te llega un correo si algo se dispara. (Es una alerta, no un corte automático.)

---

## Paso 7 · Crear tu cuenta de administrador

1. Abre `admin.html` en el sitio publicado.
2. **Iniciar sesión** → **Crea una cuenta**, usa uno de los correos autorizados.
3. Verifica el correo desde tu bandeja de entrada.
4. Vuelve a entrar y empieza a editar.

---

## Listo

Al presionar **Guardar cambios** en el panel, el contenido se publica en
Firestore y aparece automáticamente en `acredita-bach.html` para todos.

Mientras no completes estos pasos, la página **sigue funcionando** con el
contenido de fábrica (los archivos de `frontend/js/data/`). El panel solo podrá
**guardar** cuando el proyecto exista y las reglas estén subidas.

Para configurar los pagos, sigue [SETUP-PAGOS.md](SETUP-PAGOS.md).
