// mapa.js — Mapa de maestros (Leaflet + OpenStreetMap), cargado solo cuando se usa.
//   const m = crearMapa(elemento);
//   await m.pintar([{ lat, lng, titulo, detalle, color }]);
// Muestra la Tierra completa. Doble toque (o doble clic) = pantalla completa;
// ✕, Atrás o Escape la cierran.
const CSS = "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css";
const JS = "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js";
const TIERRA = [[-58, -170], [78, 180]];   // casi todo el mundo habitado, sin los polos

let cargando = null;
export function cargarLeaflet() {
  if (window.L) return Promise.resolve();
  cargando ??= new Promise((ok, no) => {
    const css = document.createElement("link");
    css.rel = "stylesheet";
    css.href = CSS;
    document.head.append(css);
    const js = document.createElement("script");
    js.src = JS;
    js.onload = ok;
    js.onerror = () => { cargando = null; no(new Error("leaflet")); };
    document.head.append(js);
  });
  return cargando;
}

const ESC = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };
const escapar = (t) => String(t ?? "").replace(/[&<>"']/g, (c) => ESC[c]);

export function crearMapa(elemento) {
  let mapa = null, capa = null, completo = false;
  const cerrar = document.createElement("button");
  cerrar.type = "button";
  cerrar.className = "mapa-cerrar";
  cerrar.textContent = "✕";
  cerrar.setAttribute("aria-label", "Cerrar");

  function verTierra() { mapa.fitBounds(TIERRA, { animate: false }); }
  function pantallaCompleta(si, desdeHistoria) {
    if (si === completo) return;
    completo = si;
    elemento.classList.toggle("mapa-completo", si);
    document.body.classList.toggle("con-mapa-completo", si);
    if (si) { elemento.append(cerrar); history.pushState({ mapa: true }, ""); }
    else { cerrar.remove(); if (!desdeHistoria && history.state?.mapa) history.back(); }
    setTimeout(() => { mapa.invalidateSize(); verTierra(); }, 60);
  }
  cerrar.addEventListener("click", (e) => { e.stopPropagation(); pantallaCompleta(false); });
  addEventListener("popstate", () => pantallaCompleta(false, true));
  addEventListener("keydown", (e) => { if (e.key === "Escape") pantallaCompleta(false); });

  return {
    async pintar(puntos) {
      await cargarLeaflet();
      const L = window.L;
      if (!mapa) {
        mapa = L.map(elemento, {
          worldCopyJump: true, scrollWheelZoom: false, doubleClickZoom: false,
          zoomSnap: 0.25, minZoom: 0,
        });
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          maxZoom: 12, attribution: "© OpenStreetMap",
        }).addTo(mapa);
        capa = L.layerGroup().addTo(mapa);
        verTierra();
        mapa.on("dblclick", () => pantallaCompleta(!completo));
      }
      capa.clearLayers();
      for (const p of puntos) {
        const color = p.color || "#e8c170";
        L.circleMarker([p.lat, p.lng], { radius: 8, color, weight: 2, fillColor: color, fillOpacity: 0.8, className: p.clase || "" })
          .bindPopup(`<b>${escapar(p.titulo)}</b>${p.detalle ? "<br>" + escapar(p.detalle) : ""}`)
          .addTo(capa);
      }
      setTimeout(() => { mapa.invalidateSize(); verTierra(); }, 60);
      return puntos.length;
    },
  };
}
