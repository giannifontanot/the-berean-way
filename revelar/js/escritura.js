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

// Notas del presentador: *rojo*, ==resaltado== y líneas con "- " como viñetas.
export function notasAHtml(texto) {
  const lineas = escapar(texto).trim().split(/\r?\n/);
  let html = "", enLista = false;
  const marcar = (l) => l
    .replace(/==([^=]+?)==/g, "<mark>$1</mark>")
    .replace(/\*([^*]+)\*/g, '<span class="rojo">$1</span>');
  for (const l of lineas) {
    const m = l.match(/^\s*[-•*]\s+(.*)$/);
    if (m) {
      if (!enLista) { html += "<ul>"; enLista = true; }
      html += `<li>${marcar(m[1])}</li>`;
    } else {
      if (enLista) { html += "</ul>"; enLista = false; }
      html += l.trim() ? `<p>${marcar(l)}</p>` : "";
    }
  }
  if (enLista) html += "</ul>";
  return html;
}

/** Posiciones (índices de letra) de los números de versículo en un texto. */
export function indicesVersiculos(texto) {
  const s = new Set();
  for (const m of String(texto || "").matchAll(VERSICULO)) {
    const ini = m.index + m[1].length;
    for (let i = 0; i < m[2].length; i++) s.add(ini + i);
  }
  return s;
}

export const esEscritura = (id) => String(id).startsWith("esc_");
export const esSubida = (id) => String(id).startsWith("sub_");

// ---------- Lámina (texto libre, como una diapositiva) ----------
// Se guarda como HTML pequeño y se limpia SIEMPRE al mostrarla: solo pasan
//   <b> <i> <br> <ul> <ol> <li> <div class="c"> (centrado) <mark> <span class="rojo"> <span class="t1…t7"> (tamaño)
// Lo que venga del editor (execCommand: <font size/color>, estilos en línea) se traduce a eso.
const esRojo = (c) => {
  const m = String(c || "").match(/^#([0-9a-f]{6})$/i) ? String(c).match(/^#(..)(..)(..)$/).slice(1).map((h) => parseInt(h, 16))
    : (String(c || "").match(/\d+/g) || []).map(Number);
  return m.length >= 3 && m[0] > 140 && m[1] < 120 && m[2] < 120 && (m[3] === undefined || m[3] > 0);
};
const esFondo = (c) => {
  const s = String(c || "").replace(/\s/g, "").toLowerCase();
  if (!s || s === "transparent" || s === "inherit" || s === "initial" || /rgba\(\d+,\d+,\d+,0\)/.test(s)) return false;
  const m = (s.match(/\d+/g) || []).map(Number);
  if (s.startsWith("#")) return !/^#(fff|ffffff)$/.test(s);
  return !(m[0] > 245 && m[1] > 245 && m[2] > 245);
};
// Tamaños de la lámina: nivel 1…7 ↔ proporción de la letra normal (igual que en el CSS: .t1 … .t7)
const NIVEL_PROP = [0, 0.62, 0.8, 1, 1.2, 1.5, 2, 2.6];
const TAM_PALABRA = { "x-small": 1, small: 2, medium: 3, large: 4, "x-large": 5, "xx-large": 6, "xxx-large": 7, "-webkit-xxx-large": 7 };
function tamDeEstilo(fs) {
  const v = String(fs || "").trim();
  if (TAM_PALABRA[v]) return TAM_PALABRA[v];
  const n = parseFloat(v);
  if (!n) return 0;
  const prop = /em$/.test(v) ? n : /%$/.test(v) ? n / 100 : n / 16;   // px: relativo a 16 px
  let mejor = 3, d = 9;
  NIVEL_PROP.forEach((p, k) => { if (k && Math.abs(p - prop) < d) { d = Math.abs(p - prop); mejor = k; } });
  return mejor;
}

function limpiarNodo(n) {
  if (n.nodeType === 3) return escapar(n.nodeValue).replace(/ /g, "&nbsp;");
  if (n.nodeType !== 1) return "";
  const tag = n.tagName.toLowerCase();
  const dentro = () => [...n.childNodes].map(limpiarNodo).join("");
  if (tag === "br") return "<br>";
  if (/^(script|style|template|iframe|object|img|svg|video|audio|head|meta|link)$/.test(tag)) return "";
  const st = n.style || {};
  // Envolturas en línea (pueden acumularse varias en el mismo elemento)
  let h = dentro();
  const cls = n.classList || { contains: () => false };
  let tam = 0;
  if (tag === "font" && n.getAttribute("size")) tam = Math.min(7, Math.max(1, parseInt(n.getAttribute("size"), 10) || 3));
  const mT = [...(n.classList || [])].map((c) => c.match(/^t([1-7])$/)).find(Boolean);
  if (mT) tam = +mT[1];
  if (!tam && st.fontSize) tam = tamDeEstilo(st.fontSize);
  const rojo = cls.contains("rojo") || (tag === "font" && esRojo(n.getAttribute("color"))) || esRojo(st.color);
  const fondo = tag === "mark" || esFondo(st.backgroundColor);
  const negrita = tag === "b" || tag === "strong" || /^(bold|[6-9]00)$/.test(st.fontWeight || "");
  const cursiva = tag === "i" || tag === "em" || st.fontStyle === "italic";
  if (cursiva) h = `<i>${h}</i>`;
  if (negrita) h = `<b>${h}</b>`;
  if (rojo) h = `<span class="rojo">${h}</span>`;
  if (fondo) h = `<mark>${h}</mark>`;
  if (tam && tam !== 3) h = `<span class="t${tam}">${h}</span>`;
  // Bloques
  const centro = (st.textAlign || n.getAttribute("align") || "") === "center" || cls.contains("c");
  if (tag === "ul" || tag === "ol") return `<${tag}>${[...n.childNodes].map((c) => c.nodeType === 1 && c.tagName === "LI" ? limpiarNodo(c) : (c.textContent.trim() ? `<li>${limpiarNodo(c)}</li>` : "")).join("")}</${tag}>`;
  if (tag === "li") return `<li>${h}</li>`;
  if (/^(div|p|h[1-6]|blockquote|section|article|header|footer|center)$/.test(tag)) {
    return `<div${centro || tag === "center" ? ' class="c"' : ""}>${h || "<br>"}</div>`;
  }
  return h;
}

/** HTML seguro de una lámina (para mostrarla o guardarla). */
export function laminaAHtml(html) {
  const tpl = document.createElement("template");
  tpl.innerHTML = String(html || "");
  return [...tpl.content.childNodes].map(limpiarNodo).join("")
    .replace(/(<div><br><\/div>)+$/, "")                  // líneas vacías al final
    .trim();
}

/** Texto plano de una lámina (para etiquetas y para saber si está vacía). */
export function laminaTexto(html) {
  const tpl = document.createElement("template");
  tpl.innerHTML = String(html || "").replace(/<(br|\/div|\/li|\/p)>/gi, "\n$&");
  return tpl.content.textContent.replace(/ /g, " ").replace(/\n{2,}/g, "\n").trim();
}

/** Cuerpo de una escritura o lámina para incrustar en HTML (cite aparte). */
export function cuerpoHtml(e) {
  return e?.lamina ? `<div class="lam">${laminaAHtml(e.texto)}</div>` : `<p>${textoAHtml(e?.texto, e?.todoRojo)}</p>`;
}
