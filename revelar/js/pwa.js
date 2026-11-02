// pwa.js — Registra el service worker y muestra el botón «Instalar»
// (si la página tiene #btnInstalar) cuando el navegador lo permite.
if ("serviceWorker" in navigator) {
  addEventListener("load", () => navigator.serviceWorker.register("sw.js").catch(() => {}));
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
