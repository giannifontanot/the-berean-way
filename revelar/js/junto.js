// junto.js — Los avisos (toasts) aparecen junto al lugar que tocaste, no abajo.
// Se recuerda el último toque; si fue hace poco, el aviso sale encima del dedo
// (o debajo si tocaste muy arriba). Si no hubo toque reciente, sale abajo como siempre.
let ultimo = null;
document.addEventListener("pointerdown", (e) => {
  ultimo = { x: e.clientX, y: e.clientY, t: Date.now() };
}, { capture: true, passive: true });

export function colocarAviso(el) {
  const reciente = ultimo && Date.now() - ultimo.t < 6000;
  if (!reciente) {
    el.classList.remove("junto");
    el.style.left = el.style.top = el.style.bottom = "";
    return;
  }
  const vw = innerWidth;
  // Mitad del ancho real del aviso (con letra grande es más ancho), para que no se salga de la pantalla
  el.classList.add("junto");
  const mitad = Math.min(vw / 2, (el.offsetWidth || 180) / 2 + 12);
  const x = Math.min(Math.max(ultimo.x, mitad), vw - mitad);
  const arriba = ultimo.y > 130;                        // hay espacio encima del dedo
  el.classList.add("junto");
  el.style.left = x + "px";
  el.style.bottom = "auto";
  el.style.top = (arriba ? ultimo.y - 64 : ultimo.y + 36) + "px";
}
