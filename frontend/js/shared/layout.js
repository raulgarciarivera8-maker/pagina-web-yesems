// ============ Shared header & footer injection ============
// Each page sets:  window.YESEMS_PAGE = "inicio" | "acredita-bach" | ...
// And calls renderHeader()/renderFooter() — or this script auto-runs.

(function () {
  const PAGE = window.YESEMS_PAGE || '';

  // Logo SVG: Y mark, navy left half + green right half
  const LOGO = `
    <a class="logo" href="index.html" aria-label="YES EMS — Inicio">
      <svg viewBox="0 0 64 64" aria-hidden="true">
        <defs>
          <linearGradient id="ylogo" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stop-color="#0a1e3f"/>
            <stop offset="49.9%" stop-color="#0a1e3f"/>
            <stop offset="50%" stop-color="#5cb85c"/>
            <stop offset="100%" stop-color="#5cb85c"/>
          </linearGradient>
        </defs>
        <path d="M8 6 L28 6 L32 22 L36 6 L56 6 L40 36 L40 58 L24 58 L24 36 Z"
              fill="url(#ylogo)"/>
      </svg>
      <span class="logo-text">
        <div class="logo-name">YES EMS</div>
        <div class="logo-tag">Servicios Educativos</div>
      </span>
    </a>`;

  const NAV_ITEMS = [
    { key: 'inicio',                   label: 'Inicio',                  href: 'index.html' },
    { key: 'nosotros',                 label: 'Nosotros',                href: 'nosotros.html' },
    { key: 'acredita-bach',            label: 'Acredita-Bach',           href: 'acredita-bach.html' },
    { key: 'tecnologia-educativa',     label: 'Tecnología Educativa',    href: 'tecnologia-educativa.html', caret: true },
    { key: 'plataforma',               label: 'Plataforma',              href: 'plataforma.html' },
    { key: 'contacto',                 label: 'Contacto',                href: 'contacto.html' }
  ];

  const WHATSAPP_URL = 'https://api.whatsapp.com/send/?phone=5215648666596&text=%21Hola%21+Vengo+de+la+web+y+requiero+mas+informaci%C3%B3n+de+sus+productos&type=phone_number&app_absent=0';

  const SOCIAL_LINKS = [
    {
      label: 'Facebook',
      href: 'https://www.facebook.com/people/Servicios-educativos-YES-EMS/100089649237869/?rdid=LHrjrrSG8RHkYBts&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2F19SyRsxak9%2F',
      icon: `<svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20" aria-hidden="true"><path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.97h-1.513c-1.491 0-1.956.93-1.956 1.874v2.25h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z"/></svg>`
    },
    {
      label: 'Instagram',
      href: 'https://www.instagram.com/yesems02?igsh=MWI0ZnRpenQxMWwwYg%3D%3D',
      icon: `<svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20" aria-hidden="true"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>`
    },
    {
      label: 'YouTube',
      href: 'https://www.youtube.com/@servicioseducativosyesems',
      icon: `<svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20" aria-hidden="true"><path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>`
    }
  ];

  const SOCIAL_HTML = `
    <div class="footer-social">
      ${SOCIAL_LINKS.map(s => `
        <a href="${s.href}" target="_blank" rel="noopener" aria-label="${s.label}" title="${s.label}">
          ${s.icon}
        </a>
      `).join('')}
    </div>`;

  const NAV = `
    <nav class="nav" id="ysNav" aria-label="Principal">
      <ul class="nav-list">
        ${NAV_ITEMS.map((n) => `
          <li><a href="${n.href}" class="${n.key === PAGE ? 'active' : ''} ${n.caret ? 'has-caret-static' : ''}">${n.label}</a></li>
        `).join('')}
      </ul>
    </nav>`;

  const WA_ICON = `
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
    </svg>`;

  const HEADER_HTML = `
    <header class="header">
      <div class="header-inner">
        ${LOGO}
        ${NAV}
        <button class="hamburger" id="ysHamburger" aria-label="Menú">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="24" height="24"><path d="M3 6h18M3 12h18M3 18h18"/></svg>
        </button>
        <div id="ys-auth" class="ys-auth-slot"></div>
        <a class="btn-whatsapp" href="${WHATSAPP_URL}" target="_blank" rel="noopener">
          ${WA_ICON}<span>WhatsApp</span>
        </a>
      </div>
    </header>`;

  const FOOTER_HTML = `
    <footer class="footer">
      <div class="footer-inner">
        <div class="footer-grid">
          <div>
            <div style="display:flex;align-items:center;gap:10px;margin-bottom:14px">
              <svg viewBox="0 0 64 64" width="36" height="36" aria-hidden="true">
                <defs>
                  <linearGradient id="ylogo2" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stop-color="#ffffff"/><stop offset="49.9%" stop-color="#ffffff"/>
                    <stop offset="50%" stop-color="#5cb85c"/><stop offset="100%" stop-color="#5cb85c"/>
                  </linearGradient>
                </defs>
                <path d="M8 6 L28 6 L32 22 L36 6 L56 6 L40 36 L40 58 L24 58 L24 36 Z" fill="url(#ylogo2)"/>
              </svg>
              <div>
                <div style="font-weight:700;color:#fff;font-size:18px">YES EMS</div>
                <div style="font-size:10px;letter-spacing:.18em;text-transform:uppercase;color:rgba(255,255,255,.6)">Servicios Educativos</div>
              </div>
            </div>
            <p style="font-size:13.5px;line-height:1.6;color:rgba(255,255,255,.6);margin:0 0 18px;max-width:300px">
              Capacitación, certificación y tecnología para transformar tu futuro.
            </p>
            ${SOCIAL_HTML}
          </div>
          <div>
            <h4>Oferta</h4>
            <ul>
              <li><a href="acredita-bach.html">Acredita-Bach</a></li>
              <li><a href="tecnologia-educativa.html">Tecnología Educativa</a></li>
              <li><a href="plataforma.html">Plataforma Digital</a></li>
            </ul>
          </div>
          <div>
            <h4>Institución</h4>
            <ul>
              <li><a href="nosotros.html">Sobre nosotros</a></li>
              <li><a href="contacto.html">Contacto</a></li>
              <li><a href="#">Aviso de privacidad</a></li>
              <li><a href="#">Términos y condiciones</a></li>
            </ul>
          </div>
          <div>
            <h4>Contáctanos</h4>
            <ul>
              <li><a href="${WHATSAPP_URL}" target="_blank" rel="noopener">WhatsApp</a></li>
              <li><a href="mailto:contacto@yesems.mx">contacto@yesems.mx</a></li>
              <li>Lun – Vie · 9:00 – 18:00</li>
            </ul>
          </div>
        </div>
        <div class="footer-bottom">
          <span>© ${new Date().getFullYear()} YES EMS · Servicios Educativos. Todos los derechos reservados.</span>
          <span>Hecho con dedicación para tu desarrollo.</span>
        </div>
      </div>
    </footer>`;

  // ---------- inject ----------
  function mount() {
    const headSlot = document.getElementById('ys-header');
    const footSlot = document.getElementById('ys-footer');
    if (headSlot) headSlot.outerHTML = HEADER_HTML;
    if (footSlot) footSlot.outerHTML = FOOTER_HTML;

    // hamburger toggle
    const hb = document.getElementById('ysHamburger');
    if (hb) hb.addEventListener('click', () => {
      const nav = document.getElementById('ysNav');
      if (nav) nav.classList.toggle('open');
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mount);
  } else {
    mount();
  }
})();
