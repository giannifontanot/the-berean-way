/* ============================================================
   The Berean Way — motor compartido
   ------------------------------------------------------------
   Lee la configuración del usuario desde window.ROSTER
   (definido en roster.js), carga dinámicamente los data.js
   de cada serie asignada, y renderiza el contenido.
   ============================================================ */

(function () {
  "use strict";

  /* ---- Detectar el código de usuario desde la URL ---- */
  function getUserCode() {
    const parts = location.pathname.split("/");
    // La carpeta del usuario es el segmento que empieza con "s-"
    return parts.find(p => /^s-[0-9a-f]+$/.test(p)) || null;
  }

  /* ---- Cargar un script dinámicamente (promesa) ---- */
  function loadScript(src) {
    return new Promise((resolve, reject) => {
      const s = document.createElement("script");
      s.src = src;
      s.onload = resolve;
      s.onerror = () => reject(new Error("No se pudo cargar: " + src));
      document.head.appendChild(s);
    });
  }

  /* ---- Raíz del sitio (para construir rutas absolutas) ---- */
  function siteRoot() {
    // Funciona tanto en GitHub Pages (/the-berean-way/) como en localhost (/)
    const parts = location.pathname.split("/");
    const idx = parts.indexOf("sites");
    return idx > 0 ? parts.slice(0, idx).join("/") : "";
  }

  /* ---- Nombres legibles de cada serie ---- */
  const SERIES_NAMES = {
    fundamentos:  "Fundamentos",
    discipulado:  "Discipulado",
    evangelismo:  "Evangelismo",
  };

  /* ---- Arranque ---- */
  const code = getUserCode();
  const roster = window.ROSTER || {};
  const userConfig = code ? roster[code] : null;

  if (!userConfig) {
    document.addEventListener("DOMContentLoaded", () => {
      document.body.innerHTML = `<section style="padding:40px 20px;font-family:sans-serif">
        <h1>Sitio no encontrado</h1>
        <p>No hay configuración para esta carpeta (<code>${code || "?"}</code>).</p></section>`;
    });
    return;
  }

  const root = siteRoot();
  const seriesKeys = Object.keys(userConfig.series || {});

  // Carga los data.js de todas las series asignadas en secuencia, luego arranca.
  window.SITE_DATA = {};
  const loads = seriesKeys.map(key =>
    loadScript(root + "/sites/templates/" + key + "/data.js")
  );

  Promise.all(loads).then(() => {
    // Construye la lista plana de páginas combinando todas las series.
    // Cada página lleva el campo _series para poder agrupar en el menú.
    const allPages = [];
    seriesKeys.forEach(key => {
      const data = (window.SITE_DATA || {})[key];
      if (!data || !Array.isArray(data.pages)) return;
      const published = userConfig.series[key] || [];
      const student = userConfig.student || "";
      data.pages.forEach((page, i) => {
        // Oculta si no está explícitamente true en el roster (gating estricto).
        if (published[i] !== true) return;
        // Prefija el slug con la serie para evitar colisiones entre series.
        const slug = key + "--" + page.slug;
        // Sustituye el marcador NOMBRE por el nombre real del alumno.
        const title = (page.title || "").replace(/NOMBRE/g, student);
        const purposeHtml = page.purposeHtml ? page.purposeHtml.replace(/NOMBRE/g, student) : page.purposeHtml;
        allPages.push(Object.assign({}, page, {
          slug,
          title,
          purposeHtml,
          _series: key,
          _seriesName: SERIES_NAMES[key] || key,
        }));
      });
    });

    const SITE = {
      title: userConfig.title || "Mis estudios",
      student: userConfig.student || "",
      pages: allPages,
    };

    document.addEventListener("DOMContentLoaded", () => {
      renderChrome(SITE);
      renderPage(SITE);
      window.addEventListener("hashchange", () => { closeDrawer(); renderPage(SITE); });
    });

    // Si el DOM ya cargó (scripts diferidos), ejecutar directamente.
    if (document.readyState !== "loading") {
      renderChrome(SITE);
      renderPage(SITE);
      window.addEventListener("hashchange", () => { closeDrawer(); renderPage(SITE); });
    }

  }).catch(err => {
    document.addEventListener("DOMContentLoaded", () => {
      document.body.innerHTML = `<section style="padding:40px 20px;font-family:sans-serif">
        <h1>Error al cargar</h1><p>${esc(err.message)}</p></section>`;
    });
  });

  /* ---- Carpeta (favoritos en localStorage) ---- */
  const CARPETA_KEY = "tbw-carpeta";

  function getCarpeta() {
    try { return JSON.parse(localStorage.getItem(CARPETA_KEY) || "[]"); } catch (e) { return []; }
  }
  function saveCarpetaArr(arr) {
    localStorage.setItem(CARPETA_KEY, JSON.stringify(arr));
  }
  function isInCarpeta(url) {
    return getCarpeta().some(item => item.url === url);
  }
  function toggleCarpeta(url, title) {
    const arr = getCarpeta();
    const idx = arr.findIndex(item => item.url === url);
    if (idx >= 0) arr.splice(idx, 1);
    else arr.push({ url, title, savedAt: Date.now() });
    saveCarpetaArr(arr);
    updateCarpetaBtn(url);
  }
  function updateCarpetaBtn(url) {
    const btn = document.getElementById("carpetaBtn");
    if (!btn) return;
    const saved = isInCarpeta(url);
    btn.classList.toggle("saved", saved);
    btn.setAttribute("aria-label", saved ? "Quitar de carpeta" : "Guardar en carpeta");
  }
  function carpetaHref() {
    return root + "/carpeta.html";
  }

  /* ---- Chrome: topbar + menú lateral agrupado por serie ---- */
  function renderChrome(SITE) {
    if (document.getElementById("navDrawer")) return; // ya renderizado

    const topbar = document.createElement("header");
    topbar.className = "topbar";
    topbar.innerHTML = `
      <button class="icon-btn" id="menuBtn" aria-label="Abrir menú">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
             stroke-linecap="round"><line x1="3" y1="6" x2="21" y2="6"/>
          <line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
      </button>
      <span class="topbar__title">${esc(SITE.title)}</span>
      <button class="icon-btn" id="carpetaBtn" aria-label="Guardar en carpeta">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
             stroke-linecap="round" stroke-linejoin="round">
          <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
        </svg>
      </button>
      <button class="icon-btn" id="searchBtn" aria-label="Buscar">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
             stroke-linecap="round"><circle cx="11" cy="11" r="7"/>
          <line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
      </button>`;

    const overlay = document.createElement("div");
    overlay.className = "nav-overlay";
    overlay.id = "navOverlay";

    const drawer = document.createElement("nav");
    drawer.className = "nav-drawer";
    drawer.id = "navDrawer";
    const sub = SITE.student ? `<small>Para: ${esc(SITE.student)}</small>` : "";

    // Agrupar páginas por serie para el menú.
    const groups = {};
    SITE.pages.forEach(p => {
      const s = p._series || "_";
      if (!groups[s]) groups[s] = { name: p._seriesName || s, pages: [] };
      groups[s].pages.push(p);
    });
    const seriesList = Object.keys(groups);
    const useSections = seriesList.length > 1;

    let linksHtml = "";
    seriesList.forEach(key => {
      const g = groups[key];
      if (useSections) {
        linksHtml += `<li class="nav-drawer__section">${esc(g.name)}</li>`;
      }
      g.pages.forEach(p => {
        linksHtml += `<li><a href="#${encodeURIComponent(p.slug)}" data-slug="${esc(p.slug)}">${esc(p.title)}</a></li>`;
      });
    });

    drawer.innerHTML = `
      <div class="nav-drawer__head">${esc(SITE.title)}${sub}</div>
      <ul class="nav-drawer__list">${linksHtml}</ul>
      <div class="nav-drawer__footer">
        <a href="${esc(carpetaHref())}" class="nav-drawer__carpeta-link">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
               stroke-linecap="round" stroke-linejoin="round" width="16" height="16">
            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
          </svg>
          Mi carpeta
        </a>
      </div>`;

    document.body.prepend(overlay);
    document.body.prepend(drawer);
    document.body.prepend(topbar);

    document.getElementById("menuBtn").addEventListener("click", openDrawer);
    document.getElementById("carpetaBtn").addEventListener("click", () => {
      toggleCarpeta(location.href, document.title.split(" · ")[0]);
    });
    overlay.addEventListener("click", closeDrawer);
    document.addEventListener("keydown", e => { if (e.key === "Escape") closeDrawer(); });

    if (!document.getElementById("app")) {
      const app = document.createElement("main");
      app.id = "app";
      document.body.appendChild(app);
    }
  }

  function openDrawer() {
    document.getElementById("navDrawer").classList.add("open");
    document.getElementById("navOverlay").classList.add("open");
  }
  function closeDrawer() {
    const d = document.getElementById("navDrawer");
    const o = document.getElementById("navOverlay");
    if (d) d.classList.remove("open");
    if (o) o.classList.remove("open");
  }

  /* ---- Render de la página actual ---- */
  function currentPage(SITE) {
    const slug = decodeURIComponent((location.hash || "").replace(/^#/, ""));
    return SITE.pages.find(p => p.slug === slug) || SITE.pages[0] || null;
  }

  function renderPage(SITE) {
    const app = document.getElementById("app");
    const page = currentPage(SITE);
    if (!app) return;
    if (!page) { app.innerHTML = `<section class="content"><p>No hay contenido todavía.</p></section>`; return; }

    document.title = `${page.title} · ${SITE.title}`;

    // Las imágenes del template usan rutas relativas (img/...).
    // Las resolvemos absolutas desde la carpeta del template correspondiente.
    const templateBase = root + "/sites/templates/" + (page._series || "") + "/";
    function resolveImg(img) {
      if (!img) return "";
      if (/^https?:\/\//.test(img)) return img;
      return new URL(img, location.origin + templateBase).href;
    }

    const headerImg = page.headerImage || "";
    const headerUrl = resolveImg(headerImg);
    const headerStyle = headerUrl ? ` style="--header-image:url('${esc(headerUrl)}')"` : "";

    let body = page.type === "gallery" ? renderGallery(page, resolveImg) : renderAccordion(page);

    const footer = page.footer || null;

    app.innerHTML = `
      <section class="hero">
        <div class="hero__bg"${headerStyle}></div>
        <h1 class="hero__title">${esc(page.title)}</h1>
      </section>
      ${page.type === "gallery" ? "" : searchBoxHtml()}
      ${body}
      ${footer ? renderFooter(footer, resolveImg) : ""}`;

    markActiveLink(page.slug);
    updateCarpetaBtn(location.href);
    wireAccordions();
    wireSearch();
    wireGallery();
    wireTopbarScroll();
    wireParallax();
    try { window.scrollTo(0, 0); } catch (e) {}
  }

  function searchBoxHtml() {
    return `<div class="search">
      <input type="search" placeholder="Buscar en este estudio…" aria-label="Buscar">
    </div>`;
  }

  function renderAccordion(page) {
    const purpose = page.purposeHtml
      ? `<div class="lead">${page.purposeHtml}</div>`
      : page.purpose
        ? `<h2>Propósito:</h2><p class="lead">${esc(page.purpose)}</p>`
        : "";
    const items = (page.items || []).map(it => `
      <div class="accordion__item">
        <button class="accordion__header">
          <span>${esc(it.heading)}</span>
          <svg class="accordion__chevron" viewBox="0 0 24 24" fill="none"
               stroke="currentColor" stroke-width="2" stroke-linecap="round"
               stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
        </button>
        <div class="accordion__panel">
          <div class="accordion__panel-inner">${it.body || ""}</div>
        </div>
      </div>`).join("");
    return `<section class="content">${purpose}<div class="accordion">${items}</div></section>`;
  }

  function renderGallery(page, resolveImg) {
    const lead = page.lead ? `<p class="lead">${esc(page.lead)}</p>` : "";
    const figs = (page.images || []).map(img => `
      <figure>
        <img src="${esc(resolveImg(img.src))}" alt="${esc(img.caption || "")}">
        ${img.caption ? `<figcaption>${esc(img.caption)}</figcaption>` : ""}
      </figure>`).join("");
    return `<section class="content">${lead}<div class="gallery">${figs}</div></section>`;
  }

  function renderFooter(footer, resolveImg) {
    const footerUrl = footer.image ? resolveImg(footer.image) : "";
    const style = footerUrl ? ` style="--footer-image:url('${esc(footerUrl)}')"` : "";
    const title = footer.title ? `<h2 class="site-footer__title">${esc(footer.title)}</h2>` : "";
    const text = footer.text ? `<p class="site-footer__text">${esc(footer.text)}</p>` : "";
    return `<footer class="site-footer"><div class="site-footer__bg"${style}></div>${title}${text}</footer>`;
  }

  function markActiveLink(slug) {
    document.querySelectorAll(".nav-drawer__list a").forEach(a => {
      a.classList.toggle("active", a.getAttribute("data-slug") === slug);
    });
  }

  /* ---- Interacciones ---- */
  function wireAccordions() {
    document.querySelectorAll(".accordion__header").forEach(header => {
      header.addEventListener("click", () => {
        const item = header.closest(".accordion__item");
        const panel = item.querySelector(".accordion__panel");
        const isOpen = item.classList.toggle("open");
        panel.style.maxHeight = isOpen ? panel.scrollHeight + "px" : null;
      });
    });
  }

  function wireSearch() {
    const btn = document.getElementById("searchBtn");
    const box = document.querySelector(".search");
    if (!btn) return;
    if (!box) { btn.style.visibility = "hidden"; return; }
    btn.style.visibility = "visible";
    const input = box.querySelector("input");
    btn.onclick = () => {
      box.classList.toggle("open");
      if (box.classList.contains("open")) input.focus();
    };
    input.oninput = () => {
      const term = input.value.trim().toLowerCase();
      document.querySelectorAll(".accordion__item").forEach(item => {
        item.classList.toggle("hidden", term !== "" && !item.textContent.toLowerCase().includes(term));
      });
    };
  }

  function wireGallery() {
    const imgs = document.querySelectorAll(".gallery img");
    if (!imgs.length) return;
    let box = document.querySelector(".lightbox");
    if (!box) {
      box = document.createElement("div");
      box.className = "lightbox";
      box.innerHTML = `<button class="lightbox__close" aria-label="Cerrar">&times;</button><img alt="">`;
      document.body.appendChild(box);
      box.addEventListener("click", e => { if (e.target.tagName !== "IMG") box.classList.remove("open"); });
      document.addEventListener("keydown", e => { if (e.key === "Escape") box.classList.remove("open"); });
    }
    const big = box.querySelector("img");
    imgs.forEach(img => img.addEventListener("click", () => {
      big.src = img.currentSrc || img.src;
      big.alt = img.alt;
      box.classList.add("open");
    }));
  }

  let topbarWired = false;
  function wireTopbarScroll() {
    if (!topbarWired) {
      topbarWired = true;
      window.addEventListener("scroll", updateTopbar, { passive: true });
    }
    updateTopbar();
  }
  function updateTopbar() {
    const topbar = document.querySelector(".topbar");
    if (!topbar) return;
    const y = window.scrollY || window.pageYOffset || 0;
    topbar.classList.toggle("solid", y > 50);
  }

  let parallaxWired = false;
  function wireParallax() {
    if (!parallaxWired) {
      parallaxWired = true;
      window.addEventListener("scroll", updateParallax, { passive: true });
      window.addEventListener("resize", updateParallax, { passive: true });
    }
    updateParallax();
  }
  function updateParallax() {
    const reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const y = window.scrollY || window.pageYOffset || 0;
    const heroBg = document.querySelector(".hero__bg");
    if (heroBg) {
      heroBg.style.transform = reduce ? "" : "translate3d(0," + (y * 0.35).toFixed(1) + "px,0)";
    }
  }

  /* ---- util ---- */
  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }

})();
