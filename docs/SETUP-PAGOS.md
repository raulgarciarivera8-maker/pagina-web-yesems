# Configuración de Pagos con Mercado Pago

Requisito previo: tener Firebase listo según [SETUP-FIREBASE.md](SETUP-FIREBASE.md).

No hay que crear tablas a mano. La colección `user_access` de Firestore se crea
sola con el primer pago, y sus permisos ya están en `backend/firestore.rules`.

---

## Paso 1 · Obtener las credenciales de Mercado Pago

1. Entra a <https://www.mercadopago.com.mx/developers> → **Tus integraciones**.
2. Abre tu aplicación → **Credenciales de producción**.
3. Copia el **Access Token**.

> El Access Token es **secreto**. Nunca lo pegues en un archivo del repositorio
> ni en el código del navegador: con él se pueden cobrar y reembolsar pagos.

---

## Paso 2 · Guardar el Access Token como secreto

Desde la carpeta `backend/`:

```bash
firebase functions:secrets:set MERCADO_PAGO_ACCESS_TOKEN
```

Te lo pedirá por teclado y lo guarda cifrado en Google Cloud. Nunca aparece en
el repositorio.

---

## Paso 3 · Configurar la URL del sitio

Crea el archivo `backend/functions/.env` (copiando `.env.example`):

```
SITE_URL=https://pagina-web-yesems.vercel.app
```

Es la dirección a la que Mercado Pago devuelve al usuario después de pagar.

---

## Paso 4 · Desplegar las funciones

```bash
cd backend
firebase deploy --only functions
```

Al terminar te imprime las URLs. Copia la base, que se ve así:

```
https://us-central1-TU-PROYECTO.cloudfunctions.net
```

Pégala en `window.YESEMS_FUNCTIONS_URL`, dentro de `frontend/index.html` y
`frontend/acredita-bach.html`.

---

## Paso 5 · Configurar el webhook

1. Mercado Pago Developers → tu aplicación → **Webhooks** → **Configurar notificaciones**.
2. URL de producción:
   ```
   https://us-central1-TU-PROYECTO.cloudfunctions.net/mercadopagoWebhook
   ```
3. Evento: **Pagos** (`payment`).
4. Al guardar, Mercado Pago te muestra una **clave secreta**. Cópiala y guárdala:

```bash
firebase functions:secrets:set MERCADO_PAGO_WEBHOOK_SECRET
firebase deploy --only functions      # vuelve a desplegar para que la tome
```

> Este paso **no es opcional**. Sin esa clave, cualquiera que descubra la URL
> del webhook podría enviar un aviso de pago falso y regalarse el curso. Con
> ella, la función verifica la firma y descarta lo que no venga de Mercado Pago.

---

## Paso 6 · Probar

1. Abre `https://tu-sitio.vercel.app/acredita-bach.html`.
2. Inicia sesión (sin cuenta, el botón de compra abre el registro: es a propósito,
   el pago tiene que quedar ligado a un usuario).
3. El plan debe mostrar **$50 MXN, pago único**.
4. Clic en **Comenzar ahora** → te lleva a Mercado Pago.
5. Al volver, el contenido se desbloquea en unos segundos, cuando llega el webhook.

Para probar sin gastar dinero, usa las **credenciales de prueba** y las
[tarjetas de prueba](https://www.mercadopago.com.mx/developers/es/docs/checkout-pro/additional-content/test-cards)
de Mercado Pago.

---

## Solución de problemas

| Síntoma | Qué revisar |
|---|---|
| El botón no redirige | ¿Está puesto `window.YESEMS_FUNCTIONS_URL`? Mira la consola del navegador. |
| Responde 401 al comprar | El usuario no tiene sesión iniciada, o el token expiró. Vuelve a entrar. |
| Pagó pero sigue bloqueado | Revisa los logs: `firebase functions:log --only mercadopagoWebhook`. |
| El webhook responde 401 | La clave `MERCADO_PAGO_WEBHOOK_SECRET` no coincide con la del panel de Mercado Pago. |
| Sigue bloqueado tras un minuto | Mira si existe el documento en Firestore → `user_access` → tu correo. |

> Nota: el desbloqueo del contenido en pantalla es solo visual. Quien de verdad
> decide quién ve qué son las reglas de `backend/firestore.rules` y
> `backend/storage.rules`.
