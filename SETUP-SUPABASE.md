# Configuración de Supabase para el Panel de Administrador

Para que **lo que edita el administrador lo vean los alumnos**, hay que crear
una tabla y un almacén de archivos en tu proyecto de Supabase. Esto se hace
**una sola vez** y **no requiere programar**: solo copiar y pegar.

> Los correos de administrador autorizados son:
> - `raulyeyo12@gmail.com`
> - `raulgarciarivera08@gmail.com`
>
> Si quieres cambiar o agregar administradores, edita la lista en **dos lugares**:
> 1. La constante `ADMIN_EMAILS` en `admin.js`.
> 2. Las políticas SQL de abajo (donde aparecen los correos).

---

## Paso 1 · Crear la tabla de contenido y sus permisos

1. Entra a <https://supabase.com> → abre tu proyecto.
2. En el menú lateral abre **SQL Editor** → **New query**.
3. Pega TODO esto y presiona **Run**:

```sql
-- Tabla que guarda TODO el contenido del curso (un solo registro JSON)
create table if not exists public.site_content (
  id          text primary key,
  data        jsonb not null default '{}'::jsonb,
  updated_at  timestamptz not null default now(),
  updated_by  text
);

alter table public.site_content enable row level security;

-- Cualquiera (alumnos, visitantes) puede LEER el contenido
drop policy if exists "content_public_read" on public.site_content;
create policy "content_public_read"
  on public.site_content for select
  using (true);

-- Solo los administradores pueden ESCRIBIR
drop policy if exists "content_admin_write" on public.site_content;
create policy "content_admin_write"
  on public.site_content for all
  using ( (auth.jwt() ->> 'email') in ('raulyeyo12@gmail.com','raulgarciarivera08@gmail.com') )
  with check ( (auth.jwt() ->> 'email') in ('raulyeyo12@gmail.com','raulgarciarivera08@gmail.com') );
```

---

## Paso 2 · Crear el almacén de PDFs (Storage)

1. Igual que antes, en **SQL Editor** → **New query**, pega y ejecuta:

```sql
-- Crea el "bucket" público para los PDFs
insert into storage.buckets (id, name, public)
values ('pdfs', 'pdfs', true)
on conflict (id) do nothing;

-- Cualquiera puede DESCARGAR / VER los PDFs
drop policy if exists "pdfs_public_read" on storage.objects;
create policy "pdfs_public_read"
  on storage.objects for select
  using ( bucket_id = 'pdfs' );

-- Solo administradores pueden SUBIR archivos
drop policy if exists "pdfs_admin_insert" on storage.objects;
create policy "pdfs_admin_insert"
  on storage.objects for insert
  with check ( bucket_id = 'pdfs'
    and (auth.jwt() ->> 'email') in ('raulyeyo12@gmail.com','raulgarciarivera08@gmail.com') );

-- Y reemplazar / borrar los suyos
drop policy if exists "pdfs_admin_update" on storage.objects;
create policy "pdfs_admin_update"
  on storage.objects for update
  using ( bucket_id = 'pdfs'
    and (auth.jwt() ->> 'email') in ('raulyeyo12@gmail.com','raulgarciarivera08@gmail.com') );

drop policy if exists "pdfs_admin_delete" on storage.objects;
create policy "pdfs_admin_delete"
  on storage.objects for delete
  using ( bucket_id = 'pdfs'
    and (auth.jwt() ->> 'email') in ('raulyeyo12@gmail.com','raulgarciarivera08@gmail.com') );
```

---

## Paso 3 · Permitir el inicio de sesión desde la página admin

Si usas **login con Google**, agrega la URL de tu sitio (incluida `admin.html`)
a la lista de **Redirect URLs**:

1. Supabase → **Authentication** → **URL Configuration**.
2. En **Redirect URLs** agrega, por ejemplo:
   - `https://TU-DOMINIO/admin.html`
   - `https://TU-DOMINIO/acredita-bach.html`

El login con **correo y contraseña** funciona sin este paso.

---

## Paso 4 · Crear tu cuenta de administrador

El correo con el que inicies sesión debe ser uno de los autorizados.

- **Opción A (correo y contraseña):** abre `admin.html`, clic en *Iniciar sesión*
  → *Crea una cuenta*, regístrate con `raulyeyo12@gmail.com` (o el otro).
  Si tu proyecto exige confirmación por correo, confírmalo y vuelve a entrar.
- **Opción B (Google):** inicia sesión con la cuenta de Google de ese mismo correo.

---

## ¡Listo!

Abre **`admin.html`**, inicia sesión con un correo autorizado y empieza a editar.
Al presionar **Guardar cambios**, el contenido se publica en Supabase y aparece
automáticamente en **`acredita-bach.html`** para todos los alumnos.

> Mientras no completes estos pasos, la página principal sigue funcionando con el
> contenido de fábrica (los archivos en `data/`). El panel solo podrá **guardar**
> cuando la tabla y las políticas existan.
