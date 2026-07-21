# Configuración de Pagos con Mercado Pago

Requisito previo: tener la API funcionando según [SETUP.md](SETUP.md).

No hay que crear nada a mano: el acceso pagado se guarda en el propio
documento del usuario en MongoDB, y lo escribe solo el webhook.

---

## Paso 1 · Obtener las credenciales de Mercado Pago

1. Entra a <https://www.mercadopago.com.mx/developers> → **Tus integraciones**.
2. Abre tu aplicación → **Credenciales de producción**.
3. Copia el **Access Token**.

> El Access Token es **secreto**. Nunca lo pegues en un archivo del repositorio
> ni en el código del navegador: con él se pueden cobrar y reembolsar pagos.

---

## Paso 2 · Guardar el Access Token en Render

**Render → tu servicio → Settings → Environment → Add Environment Variable:**

```
MERCADO_PAGO_ACCESS_TOKEN = APP_USR-...
```

Render lo guarda cifrado y nunca aparece en el repositorio.

Comprueba también que `SITE_URL` apunte a tu dominio de Vercel: es la
dirección a la que Mercado Pago devuelve al usuario después de pagar.

---

## Paso 3 · Reiniciar el servicio

Al guardar una variable, Render redespliega solo. Espera a que quede **Live**.

La URL de la API ya está en `frontend/js/config/api.js`, así que no hay que
copiar nada más aquí.

---

## Paso 5 · Configurar el webhook

1. Mercado Pago Developers → tu aplicación → **Webhooks** → **Configurar notificaciones**.
2. URL de producción:
   ```
   https://TU-SERVICIO.onrender.com/api/pagos/webhook
   ```
3. Evento: **Pagos** (`payment`).
4. Al guardar, Mercado Pago te muestra una **clave secreta**. Cópiala y guárdala:

Guárdala en Render como `MERCADO_PAGO_WEBHOOK_SECRET`.

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
| Responde 401 al comprar | Sin sesión iniciada o token expirado. Vuelve a entrar. |
| Pagó pero sigue bloqueado | Revisa los logs: `Render → tu servicio → Logs`. |
| El webhook responde 401 | La clave `MERCADO_PAGO_WEBHOOK_SECRET` no coincide con la del panel de Mercado Pago. |
| Sigue bloqueado tras un minuto | Mira el usuario en Atlas: debe tener `accessGranted: true`. |

> Nota: el desbloqueo del contenido en pantalla es solo visual. Quien decide
> de verdad si alguien pagó es el servidor.
