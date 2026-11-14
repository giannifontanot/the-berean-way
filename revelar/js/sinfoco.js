// sinfoco.js — Cómo se abren y se cierran las ventanas en todo el app del maestro:
//  1. Ninguna pone el cursor (foco) sola en un campo: no salta el teclado ni se mueve la pantalla.
//  2. Al abrir, la ventana «sale» del botón que tocaste (por ejemplo, el ✎) y crece hasta el centro.
//  3. Al cerrar, hace el camino de regreso: se encoge y vuelve a ese mismo botón.
// La ventana se cierra de verdad al instante (el resto del app sigue igual); lo que regresa al botón
// es una copia de cómo se veía, que desaparece al terminar.
let toque = null;   // último lugar que tocaste
addEventListener("pointerdown", (e) => { toque = { x: e.clientX, y: e.clientY, t: Date.now() }; }, true);
const sinMovimiento = () => matchMedia("(prefers-reduced-motion: reduce)").matches;
const ABRIR = 480, CERRAR = 440;

function desplazamiento(r, o) {
  return `translate(${Math.round(o.x - (r.left + r.width / 2))}px, ${Math.round(o.y - (r.top + r.height / 2))}px) scale(0.06)`;
}

function aparecer(dlg) {
  if (sinMovimiento() || !dlg.animate) return;
  const r = dlg.getBoundingClientRect();
  if (!r.width) return;
  // Una ventana que no abrió nadie con un toque puede traer su propio origen (p. ej. el aviso de versión nueva)
  const o = dlg._origenFijo || (toque && Date.now() - toque.t < 1500 ? { x: toque.x, y: toque.y } : null);
  dlg._origen = o;
  dlg.animate(o
    ? [{ transform: desplazamiento(r, o), opacity: 0, borderRadius: "50%" }, { opacity: 1, offset: 0.35 }, { transform: "none", opacity: 1 }]
    : [{ transform: "translateY(40px) scale(0.85)", opacity: 0 }, { transform: "none", opacity: 1 }],
    { duration: ABRIR, easing: "cubic-bezier(.2, 1.12, .35, 1)" });
  try { dlg.animate([{ opacity: 0 }, { opacity: 1 }], { duration: ABRIR * 0.7, easing: "ease-out", pseudoElement: "::backdrop" }); } catch {}
}

function desaparecer(dlg) {
  if (sinMovimiento() || !dlg.open || dlg.classList.contains("cerrando")) return;
  const r = dlg.getBoundingClientRect();
  if (!r.width) return;
  // Copia de la ventana tal como se ve, en el mismo lugar
  const copia = dlg.cloneNode(true);
  copia.removeAttribute("id");
  copia.querySelectorAll("[id]").forEach((el) => el.removeAttribute("id"));
  copia.setAttribute("open", "");
  copia.setAttribute("aria-hidden", "true");
  copia.inert = true;
  Object.assign(copia.style, { position: "fixed", left: r.left + "px", top: r.top + "px", width: r.width + "px", height: r.height + "px",
    margin: "0", maxHeight: "none", maxWidth: "none", zIndex: "2147483646", pointerEvents: "none", overflow: "hidden", boxSizing: "border-box" });
  const sombra = document.createElement("div");
  Object.assign(sombra.style, { position: "fixed", inset: "0", background: "rgba(5, 7, 18, 0.7)", zIndex: "2147483645", pointerEvents: "none" });
  // La copia va en la «capa de arriba» (popover): si la ventana se abrió encima de otra (p. ej. los colores sobre el
  // editor de la lámina), una copia normal quedaría DETRÁS de la ventana de abajo y la vuelta no se vería.
  const capa = document.createElement("div");
  Object.assign(capa.style, { position: "fixed", inset: "0", width: "100vw", height: "100dvh", margin: "0", padding: "0",
    border: "0", background: "transparent", overflow: "visible", pointerEvents: "none" });
  capa.append(sombra, copia);
  document.body.append(capa);
  if (typeof capa.showPopover === "function") { capa.setAttribute("popover", "manual"); try { capa.showPopover(); } catch {} }
  copia.scrollTop = dlg.scrollTop;
  const o = dlg._origen;
  const a = copia.animate(o
    ? [{ transform: "none", opacity: 1 }, { opacity: 1, offset: 0.6 }, { transform: desplazamiento(r, o), opacity: 0, borderRadius: "50%" }]
    : [{ transform: "none", opacity: 1 }, { transform: "translateY(40px) scale(0.85)", opacity: 0 }],
    { duration: CERRAR, easing: "cubic-bezier(.45, 0, .55, 1)", fill: "forwards" });
  sombra.animate([{ opacity: 1 }, { opacity: 0 }], { duration: CERRAR, easing: "ease-in", fill: "forwards" });
  const quitar = () => { try { capa.hidePopover?.(); } catch {} capa.remove(); };
  a.onfinish = quitar; a.oncancel = quitar;
  setTimeout(quitar, CERRAR + 200);
}

const original = HTMLDialogElement.prototype.showModal;
HTMLDialogElement.prototype.showModal = function (...args) {
  const yaAbierto = this.open;
  const r = original.apply(this, args);
  const quitar = () => { const a = document.activeElement; if (a && a !== document.body && this.contains(a)) a.blur(); };
  quitar();
  requestAnimationFrame(quitar);
  if (!yaAbierto) aparecer(this);
  return r;
};
const originalShow = HTMLDialogElement.prototype.show;
HTMLDialogElement.prototype.show = function (...args) {
  const r = originalShow.apply(this, args);
  const a = document.activeElement; if (a && a !== document.body && this.contains(a)) a.blur();
  return r;
};
const originalClose = HTMLDialogElement.prototype.close;
HTMLDialogElement.prototype.close = function (...args) {
  try { desaparecer(this); } catch {}
  return originalClose.apply(this, args);
};
// Con la tecla Esc (o el botón Atrás del teléfono) también regresa
addEventListener("cancel", (e) => { if (e.target instanceof HTMLDialogElement) try { desaparecer(e.target); } catch {} }, true);
