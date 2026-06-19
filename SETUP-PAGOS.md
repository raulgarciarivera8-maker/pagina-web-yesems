# Configuración de Pagos con Mercado Pago

## Paso 1 · Crear la tabla de accesos

Entra a https://supabase.com → tu proyecto → **SQL Editor** → **New query** y pega:

```sql
-- Tabla que registra quién ha pagado y tiene acceso
create table if not exists public.user_access (
  id          uuid primary key default gen_random_uuid(),
  email       text not null,
  plan        text not null default 'acredita-bach',
  access_granted boolean not null default true,
  payment_id  text,
  payment_status text not null default 'approved',
  created_at  timestamptz not null default now(),
  expires_at  timestamptz
);

-- Permitir lectura anónima solo con el email
drop policy if exists "user_access_read_own" on public.user_access;
create policy "user_access_read_own"
  on public.user_access for select
  using (true);

-- Solo service_role puede insertar/actualizar (webhook)
alter table public.user_access enable row level security;

drop policy if exists "user_access_service_insert" on public.user_access;
create policy "user_access_service_insert"
  on public.user_access for insert
  with check (true);

drop policy if exists "user_access_service_update" on public.user_access;
create policy "user_access_service_update"
  on public.user_access for update
  using (true);
```

## Paso 2 · Configurar Edge Functions en Supabase

### Crear función `create-preference`

1. En Supabase Dashboard → **Edge Functions** → **New function**
2. Nómbrala: `create-preference`
3. Pega el contenido del archivo `supabase/functions/create-preference/index.ts`
4. Ve a **Settings** de la función y agrega estas variables de entorno:
   - `MERCADO_PAGO_ACCESS_TOKEN` = tu Access Token de Mercado Pago
   - `SUPABASE_URL` = la URL de tu proyecto Supabase
   - `SUPABASE_SERVICE_ROLE_KEY` = la Service Role Key de tu proyecto
   - `SITE_URL` = `https://pagina-web-yesems.vercel.app`

### Crear función `mercadopago-webhook`

1. En Supabase Dashboard → **Edge Functions** → **New function**
2. Nómbrala: `mercadopago-webhook`
3. Pega el contenido del archivo `supabase/functions/mercadopago-webhook/index.ts`
4. Mismas variables de entorno que la función anterior

## Paso 3 · Obtener Access Token de Mercado Pago

1. Entra a https://mercadopago.com.ar/developers → **Credentials**
2. Copia el **Access Token** de producción (NUNCA compartas esta llave)
3. Pégalo en las variables de entorno de las Edge Functions

## Paso 4 · Configurar Webhook en Mercado Pago

1. En Mercado Pago Developers → **Webhooks** → **+ Crear webhook**
2. URL: `https://zwqreojkgobvhdffbowi.supabase.co/functions/v1/mercadopago-webhook`
3. Eventos: `payment` (creado, actualizado)
4. Guarda

## Paso 5 · Verificar que funciona

1. Abre `https://pagina-web-yesems.vercel.app/acredita-bach.html`
2. El plan debe mostrar **$50 MXN único pago**
3. Haz clic en **Comenzar ahora** → debe redirigir a Mercado Pago
4. Después del pago, regresa al sitio → el contenido se desbloquea

## Solución de problemas

- Si el botón no redirige: verifica que la Edge Function `create-preference` esté
  desplegada y que el Access Token sea correcto.
- Si el webhook no registra: revisa los logs de la Edge Function en Supabase.
- Si el contenido sigue bloqueado tras pagar: limpia localStorage y recarga.
