// escritura.js — Convierte el texto de una escritura en HTML seguro.
//   *así*   → letra roja
//   ==así== → resaltado
// Con todoRojo, todo el texto va en rojo (el resaltado se mantiene).
const ESC = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };
const escapar = (t) => String(t || "").replace(/[&<>"']/g, (c) => ESC[c]);

export function textoAHtml(texto, todoRojo) {
  let h = escapar(texto).trim();
  h = h.replace(/==([\s\S]+?)==/g, "<mark>$1</mark>").replace(/==/g, "");
  if (todoRojo) h = `<span class="rojo">${h.replace(/\*/g, "")}</span>`;
  else h = h.replace(/\*([^*]+)\*/g, '<span class="rojo">$1</span>').replace(/\*/g, "");
  return h.replace(/\r?\n/g, "<br>");
}

export const esEscritura = (id) => String(id).startsWith("esc_");
