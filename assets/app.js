/* ============================================================
   The Berean Way — motor compartido (igual para todos los alumnos)
   ------------------------------------------------------------
   NO se edita por alumno. Lee el contenido desde window.STUDENT_SITE
   (definido en el data.js de cada carpeta) y lo dibuja.

   Cada página puede ser de tipo:
     - "accordion": lista de bloques que se expanden (con buscador)
     - "gallery":   cuadrícula de imágenes con visor a pantalla completa
   ============================================================ */

(function () {
  "use strict";

  const SITE = window.STUDENT_SITE || { title: "Estudios", student: "", pages: [] };
  const PAGES = Array.isArray(SITE.pages) ? SITE.pages : [];

  document.addEventListener("DOMContentLoaded", () => {
    renderChrome();
    renderPage();
    window.addEventListener("hashchange", () => { closeDrawer(); renderPage(); });
  });

  /* ---------- Barra superior + cajón de navegación (una vez) ---------- */
  function renderChrome() {
    const topbar = document.createElement("header");
    topbar.className = "topbar";
    topbar.innerHTML = `
      <button class="icon-btn" id="menuBtn" aria-label="Abrir menú">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
             stroke-linecap="round"><line x1="3" y1="6" x2="21" y2="6"/>
          <line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
      </button>
      <span class="topbar__title">${esc(SITE.title)}</span>
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
    const links = PAGES.map(p =>
      `<li><a href="#${encodeURIComponent(p.slug)}" data-slug="${esc(p.slug)}">${esc(p.title)}</a></li>`
    ).join("");
    const sub = SITE.student ? `<small>Para: ${esc(SITE.student)}</small>` : "";
    drawer.innerHTML = `
      <div class="nav-drawer__head">${esc(SITE.title)}${sub}</div>
      <ul class="nav-drawer__list">${links}</ul>`;

    document.body.prepend(overlay);
    document.body.prepend(drawer);
    document.body.prepend(topbar);

    document.getElementById("menuBtn").addEventListener("click", openDrawer);
    overlay.addEventListener("click", closeDrawer);
    document.addEventListener("keydown", e => { if (e.key === "Escape") closeDrawer(); });

    // contenedor donde se dibuja cada página
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

  /* ---------- Render de la página actual ---------- */
  function currentPage() {
    const slug = decodeURIComponent((location.hash || "").replace(/^#/, ""));
    return PAGES.find(p => p.slug === slug) || PAGES[0] || null;
  }

  function renderPage() {
    const app = document.getElementById("app");
    const page = currentPage();
    if (!app) return;
    if (!page) { app.innerHTML = `<section class="content"><p>No hay contenido todavía.</p></section>`; return; }

    document.title = `${page.title} · ${SITE.title}`;

    // Imagen del header: la de la página manda; si no, la del alumno (SITE);
    // si ninguna, queda el default compartido definido en el CSS.
    const headerImg = page.headerImage || SITE.headerImage;
    // Ruta absoluta: una url() dentro de una variable CSS se resuelve relativa a
    // assets/styles.css, no a la carpeta del usuario; resolverla aquí lo evita.
    const headerUrl = headerImg ? new URL(headerImg, location.href).href : "";
    const headerStyle = headerUrl ? ` style="--header-image:url('${esc(headerUrl)}')"` : "";

    let body = "";
    if (page.type === "gallery") {
      body = renderGallery(page);
    } else {
      body = renderAccordion(page);
    }

    // Pie de página: el de la página manda; si no, el del alumno (SITE).
    const footer = page.footer || SITE.footer;

    app.innerHTML = `
      <section class="hero"${headerStyle}>
        <h1 class="hero__title">${esc(page.title)}</h1>
      </section>
      ${page.type === "gallery" ? "" : searchBoxHtml()}
      ${body}
      ${footer ? renderFooter(footer) : ""}`;

    markActiveLink(page.slug);
    wireAccordions();
    wireSearch();
    wireGallery();
    wireTopbarScroll();
    try { window.scrollTo(0, 0); } catch (e) { /* entorno sin scroll */ }
  }

  function searchBoxHtml() {
    return `<div class="search">
      <input type="search" placeholder="Buscar en este estudio…" aria-label="Buscar">
    </div>`;
  }

  function renderAccordion(page) {
    const purpose = page.purpose
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

  function renderGallery(page) {
    const lead = page.lead ? `<p class="lead">${esc(page.lead)}</p>` : "";
    const figs = (page.images || []).map(img => `
      <figure>
        <img src="${esc(img.src)}" alt="${esc(img.caption || "")}">
        ${img.caption ? `<figcaption>${esc(img.caption)}</figcaption>` : ""}
      </figure>`).join("");
    return `<section class="content">${lead}<div class="gallery">${figs}</div></section>`;
  }

  function renderFooter(footer) {
    // footer.image se resuelve relativo a la carpeta del alumno; si falta,
    // el CSS usa el footer-bg.svg compartido.
    const footerUrl = footer.image ? new URL(footer.image, location.href).href : "";
    const style = footerUrl ? ` style="--footer-image:url('${esc(footerUrl)}')"` : "";
    const title = footer.title ? `<h2 class="site-footer__title">${esc(footer.title)}</h2>` : "";
    const text = footer.text ? `<p class="site-footer__text">${esc(footer.text)}</p>` : "";
    return `<footer class="site-footer"${style}>${title}${text}</footer>`;
  }

  function markActiveLink(slug) {
    document.querySelectorAll(".nav-drawer__list a").forEach(a => {
      a.classList.toggle("active", a.getAttribute("data-slug") === slug);
    });
  }

  /* ---------- Interacciones ---------- */
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

  function wireTopbarScroll() {
    const topbar = document.querySelector(".topbar");
    const hero = document.querySelector(".hero");
    if (!topbar) return;
    if (!hero) { topbar.classList.add("solid"); return; }
    const onScroll = () => topbar.classList.toggle("solid", window.scrollY > hero.offsetHeight - 80);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* ---------- util ---------- */
  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }
})();
