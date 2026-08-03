# Probar el sistema de pagos sin gastar dinero

Mercado Pago tiene un modo de PRUEBA: pagos completos con tarjetas falsas,
sin mover dinero real. Al terminar, se vuelve al modo producción.

---

## Paso 1 · Credenciales de prueba

<https://www.mercadopago.com.mx/developers> → **Tus integraciones** → tu
aplicación → **Credenciales de prueba** (NO las de producción).

- El **Access Token de prueba** empieza con `TEST-...`
  (el de producción empieza con `APP_USR-...`).

---

## Paso 2 · Poner el token de prueba en Render (temporal)

Render → tu servicio → **Settings → Environment**:

```
MERCADO_PAGO_ACCESS_TOKEN = TEST-...
```

Guarda. Render redespliega solo (~2 min).

> Mientras esté el token de prueba, los pagos REALES no funcionan. Es solo
> para probar. Al terminar, vuelve a poner el de producción (`APP_USR-...`).

---

## Paso 3 · Crear un comprador de prueba

Mercado Pago no te deja pagarte a ti mismo. En **Tus integraciones → tu app
→ Cuentas de prueba → Crear cuenta de prueba**, crea un **comprador**.
Guarda su usuario y contraseña (son de Mercado Pago, falsos).

---

## Paso 4 · Hacer el pago de prueba

1. En el sitio, **regístrate con un correo nuevo** y confírmalo.
2. Acredita-Bach → **Comenzar ahora**.
3. En el checkout de Mercado Pago, inicia sesión con la **cuenta de prueba
   comprador** del paso 3.
4. Paga con una **tarjeta de prueba**:

| Tarjeta      | Número               | Venc. | CVV | Titular |
|--------------|----------------------|-------|-----|---------|
| Mastercard   | 5474 9254 3267 0366  | 11/30 | 123 | APRO    |
| Visa         | 4075 5957 1648 3764  | 11/30 | 123 | APRO    |

El **nombre del titular** controla el resultado:
- `APRO` → el pago se **aprueba**
- `OTHE` → el pago se **rechaza** (útil para probar el fallo)
- `CONT` → queda **pendiente**

---

## Paso 5 · Verificar el desbloqueo

Al volver al curso deberías ver **"⏳ Confirmando tu pago…"** y en unos
segundos el curso abierto con la banda verde **"Suscripción activa"**.

Si tarda, es el webhook (con Render dormido llega a ~40 s). El aviso espera
hasta 60 s. Si aun así no abre, revisa:

- **Render → Logs**: busca `Acceso otorgado (pago ...)`.
- **Atlas → users → tu comprador**: debe tener `accessGranted: true`.

---

## Paso 6 · Volver a producción

Cuando la prueba pase:

1. Render → Environment → `MERCADO_PAGO_ACCESS_TOKEN` = el de **producción**
   (`APP_USR-...`).
2. Añade `MERCADO_PAGO_WEBHOOK_SECRET` (seguridad, ver
   [SETUP-PAGOS.md](SETUP-PAGOS.md)).
3. Borra desde Atlas el acceso del comprador de prueba, o deja la cuenta de
   prueba como está (no estorba).

---

## Notas

- La `notification_url` del webhook se deriva sola del servidor, así que NO
  hace falta configurar `API_URL`.
- El webhook es idempotente: aunque Mercado Pago reenvíe el aviso, el acceso
  no se duplica ni se reinicia la expiración.
- Si el pago no desbloquea nunca, siempre puedes darlo a mano:
  `node scripts/dar-acceso.js correo@ejemplo.com`
