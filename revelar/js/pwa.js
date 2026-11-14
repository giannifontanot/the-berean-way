// pwa.js — Registra el service worker y muestra el botón «Instalar»
// (si la página tiene #btnInstalar) cuando el navegador lo permite.
import { t } from "./i18n.js?v=202611140553";

if ("serviceWorker" in navigator) {
  addEventListener("load", () => navigator.serviceWorker.register("sw.js").then((reg) => {
    // Un app que se queda abierto también se entera de versiones nuevas
    setInterval(() => reg.update().catch(() => {}), 30 * 60_000);
    document.addEventListener("visibilitychange", () => { if (!document.hidden) reg.update().catch(() => {}); });
  }).catch(() => {}));
  // Llegó una versión nueva (el service worker nuevo tomó el control): pedir que se actualice con un botón grande.
  // La primera instalación no cuenta (antes no había ninguno).
  const habia = !!navigator.serviceWorker.controller;
  navigator.serviceWorker.addEventListener("controllerchange", () => { if (habia) avisarVersionNueva(); });
}

/**
 * Ventana sobre todo lo demás con un solo botón grande que brilla (como en Go Epic), para que se presione.
 * Espera mientras haya otra ventana abierta (un editor puede tener texto sin guardar).
 */
let avisoListo = false;
function avisarVersionNueva() {
  if (avisoListo) return;
  avisoListo = true;
  const otraAbierta = () => !!document.querySelector("dialog[open]:not(.version-nueva)");
  const mostrar = () => {
    const d = document.createElement("dialog");
    d.className = "version-nueva";
    d.setAttribute("aria-labelledby", "versionNuevaTxt");
    d.innerHTML = `<div class="vn-tarjeta"><p id="versionNuevaTxt"></p><button type="button" class="vn-boton"></button></div>`;
    d.querySelector("p").textContent = t("newVersion");
    d.querySelector("button").textContent = t("tapToUpdate");
    // Al tocar: la ventana regresa suave al lugar de donde salió (arriba) y luego se recarga con la versión nueva
    d.querySelector("button").addEventListener("click", () => { d.close(); setTimeout(() => location.reload(), 420); });
    d.addEventListener("cancel", (e) => e.preventDefault());       // no se cierra con Atrás / Esc: hay que actualizar
    d._origenFijo = { x: innerWidth / 2, y: 28 };   // sale desde arriba, el borde del app, y regresa ahí
    document.body.append(d);
    if (typeof d.showModal === "function") d.showModal(); else d.setAttribute("open", "");
  };
  if (!otraAbierta()) { mostrar(); return; }
  const espera = setInterval(() => { if (!otraAbierta()) { clearInterval(espera); mostrar(); } }, 1000);
}
const MARCA = "revelar:instalada";
let pedido = null;
const boton = () => document.getElementById("btnInstalar");
addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault();
  pedido = e;
  // Chrome solo ofrece instalar si el app NO está en el teléfono: si la desinstalaron, se vuelve a mostrar el botón
  try { if (localStorage.getItem(MARCA)) { localStorage.removeItem(MARCA); document.dispatchEvent(new Event("app-desinstalada")); } } catch {}
  const b = boton();
  if (b) b.hidden = false;
});
addEventListener("appinstalled", () => { pedido = null; const b = boton(); if (b) b.hidden = true; document.dispatchEvent(new Event("app-instalada")); });
/** ¿Ya se abre como app instalada (desde el ícono de la pantalla de inicio)? */
window.appInstalada = () => matchMedia("(display-mode: standalone)").matches || matchMedia("(display-mode: fullscreen)").matches || navigator.standalone === true;
// Si alguna vez se abrió como app instalada, lo recordamos (en Android el app y Chrome comparten este almacenamiento).
try { if (window.appInstalada()) localStorage.setItem(MARCA, "1"); } catch {}
/** ¿Este teléfono ya tiene el app, aunque ahora estés en el navegador? */
window.yaTieneApp = async () => {
  if (window.appInstalada()) return true;
  try {
    if (navigator.getInstalledRelatedApps) {
      const apps = await navigator.getInstalledRelatedApps();
      if (apps.length) { localStorage.setItem(MARCA, "1"); return true; }
    }
    return localStorage.getItem(MARCA) === "1";
  } catch { return false; }
};
/** Muestra la ventana de instalar de Chrome si la permite. Devuelve false si no la permitió. */
window.pedirInstalar = async () => {
  if (!pedido) return false;
  const p = pedido; pedido = null;
  const b = boton(); if (b) b.hidden = true;
  await p.prompt();
  return true;
};
document.addEventListener("click", async (e) => {
  if (!e.target.closest?.("#btnInstalar") || !pedido) return;
  const p = pedido;
  pedido = null;
  boton().hidden = true;
  await p.prompt();
});
