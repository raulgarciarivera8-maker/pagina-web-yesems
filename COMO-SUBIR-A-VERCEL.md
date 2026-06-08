# Subir este sitio a Vercel

Este sitio es **estático** (HTML, CSS y JavaScript). No necesita "build" ni
configuración. Tienes dos formas de subirlo:

## Opción A — Arrastrar y soltar (la más fácil)

1. Entra a <https://vercel.com> e inicia sesión (puedes usar tu cuenta de Google).
2. Clic en **Add New…** → **Project**.
3. Busca la opción **Deploy** arrastrando una carpeta, o usa
   <https://vercel.com/new> y arrastra **toda esta carpeta** (`deploy`) a la
   ventana.
4. Vercel detecta que es un sitio estático y lo publica en segundos.
5. Te dará una dirección tipo `https://tu-proyecto.vercel.app`.

## Opción B — Desde GitHub (recomendada para actualizar fácil)

1. Sube el contenido de esta carpeta a un repositorio de GitHub.
2. En Vercel: **Add New… → Project → Import** ese repositorio.
3. **Framework Preset:** elige **Other** (sin framework).
   Deja vacíos *Build Command* y *Output Directory*.
4. Clic en **Deploy**.

## Después de publicar

1. Abre tu sitio: `https://tu-proyecto.vercel.app`
2. Abre el panel: `https://tu-proyecto.vercel.app/admin.html`
3. Si usas **login con Google**, agrega esas dos direcciones en
   Supabase → **Authentication → URL Configuration → Redirect URLs**
   (mira el archivo `SETUP-SUPABASE.md`, Paso 4).

> Las llaves de Supabase ya vienen incluidas en `supabase-config.js` y son
> **públicas** (seguras para el navegador). Lo que protege tu información son las
> políticas que creaste en Supabase, no estas llaves.
