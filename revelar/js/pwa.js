// pwa.js — Registra el service worker y muestra el botón «Instalar»
// (si la página tiene #btnInstalar) cuando el navegador lo permite.
if ("serviceWorker" in navigator) {
  addEventListener("load", () => navigator.serviceWorker.register("sw.js").catch(() => {}));
}
let pedido = null;
const boton = () => document.getElementById("btnInstalar");
addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault();
  pedido = e;
  const b = boton();
  if (b) b.hidden = false;
});
addEventListener("appinstalled", () => { pedido = null; const b = boton(); if (b) b.hidden = true; document.dispatchEvent(new Event("app-instalada")); });
/** ¿Ya se abre como app instalada (desde el ícono de la pantalla de inicio)? */
window.appInstalada = () => matchMedia("(display-mode: standalone)").matches || matchMedia("(display-mode: fullscreen)").matches || navigator.standalone === true;
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
