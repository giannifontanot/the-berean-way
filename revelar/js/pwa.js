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
addEventListener("appinstalled", () => { pedido = null; const b = boton(); if (b) b.hidden = true; });
document.addEventListener("click", async (e) => {
  if (!e.target.closest?.("#btnInstalar") || !pedido) return;
  const p = pedido;
  pedido = null;
  boton().hidden = true;
  await p.prompt();
});
