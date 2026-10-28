// escritura.js — Convierte el texto de una escritura en HTML seguro.
//   *así*   → letra roja
//   ==así== → resaltado
//   16 Pues Dios…  → el "16" se detecta como número de versículo y se ve pequeño y apagado
// Con todoRojo, todo el texto va en rojo (el resaltado se mantiene).
const ESC = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };
const escapar = (t) => String(t || "").replace(/[&<>"']/g, (c) => ESC[c]);

// Marcadores internos (caracteres de control que nadie escribe).
const A = "\u0001", Z = "\u0002";

const SUPER = { "⁰": "0", "¹": "1", "²": "2", "³": "3", "⁴": "4", "⁵": "5", "⁶": "6", "⁷": "7", "⁸": "8", "⁹": "9" };

// Un número de versículo es 1 a 3 dígitos:
//   - al inicio del texto o después de un espacio, salto de línea o signo de puntuación,
//   - seguido (con o sin espacio) de una letra mayúscula, un signo de apertura o una marca.
// Así "16 Pues…" y "17Porque…" se detectan, pero "40 años" o "en 3 días" no.
// Se excluyen los libros con número ("1 Corintios", "2 Reyes"…) para no confundirlos.
const VERSICULO = /(^|[\s.,;:!?»”"’')\]*=])(\d{1,3})(?!\s?(?:Samuel|Reyes|Crónicas|Cronicas|Corintios|Tesalonicenses|Timoteo|Pedro|Juan|Macabeos)\b)(?=\s?[A-ZÁÉÍÓÚÜÑ¿¡«“"‘'(\[—–*=])/g;

function marcarVersiculos(texto) {
  return String(texto || "")
    // números en superíndice que vienen al copiar de algunas Biblias: ¹⁶Pues…
    .replace(/[⁰¹²³⁴⁵⁶⁷⁸⁹]{1,3}/g, (m) => A + [...m].map((c) => SUPER[c]).join("") + Z + " ")
    .replace(VERSICULO, (_, antes, n) => antes + A + n + Z);
}

export function textoAHtml(texto, todoRojo) {
  let h = escapar(marcarVersiculos(texto)).trim();
  h = h.replace(/==([\s\S]+?)==/g, "<mark>$1</mark>").replace(/==/g, "");
  if (todoRojo) h = `<span class="rojo">${h.replace(/\*/g, "")}</span>`;
  else h = h.replace(/\*([^*]+)\*/g, '<span class="rojo">$1</span>').replace(/\*/g, "");
  h = h.replace(new RegExp(A + "(\\d{1,3})" + Z + "\\s?", "g"), '<sup class="vnum">$1</sup>');
  return h.replace(/\r?\n/g, "<br>");
}

export const esEscritura = (id) => String(id).startsWith("esc_");
export const esSubida = (id) => String(id).startsWith("sub_");
