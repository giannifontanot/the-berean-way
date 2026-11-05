// sinfoco.js — Cómo se abren las ventanas en todo el app del maestro:
//  1. Ninguna pone el cursor (foco) sola en un campo: no salta el teclado ni se mueve la pantalla.
//  2. Aparecen suavemente, «saliendo» del botón que tocaste (por ejemplo, el ✎), para que se note de dónde vienen.
let toque = null;   // último lugar que tocaste
addEventListener("pointerdown", (e) => { toque = { x: e.clientX, y: e.clientY, t: Date.now() }; }, true);
const sinMovimiento = () => matchMedia("(prefers-reduced-motion: reduce)").matches;

function aparecer(dlg) {
  if (sinMovimiento() || !dlg.animate) return;
  const r = dlg.getBoundingClientRect();
  if (!r.width) return;
  const reciente = toque && Date.now() - toque.t < 1500;
  const desde = reciente
    ? `translate(${Math.round(toque.x - (r.left + r.width / 2))}px, ${Math.round(toque.y - (r.top + r.height / 2))}px) scale(0.12)`
    : "translateY(14px) scale(0.94)";
  dlg.animate([{ transform: desde, opacity: 0 }, { transform: "none", opacity: 1 }],
    { duration: reciente ? 340 : 240, easing: "cubic-bezier(.2, .9, .25, 1)" });
  try { dlg.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 260, easing: "ease-out", pseudoElement: "::backdrop" }); } catch {}
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
