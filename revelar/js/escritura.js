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

// ---------- Fondo de las láminas ----------
// fondo = nombre de un color de la paleta (o "#rrggbb" para «otro color»). Sin fondo = papel.
// Solo fondos que da gusto leer: claros (papel, sepia, grises suaves) y oscuros (marino, pino…).
// Fondos claros por familia, cada una en tres tonos: ligero, medio y brillante (siempre una hoja clara).
// Degradados muy suaves; todos con contraste AAA (7:1 o más) con la letra oscura.
export const FAMILIAS = [
  { clave: "famSepia", tonos: { marfil: "linear-gradient(160deg, #fff4dc, #fbe2b4)", sepia: "linear-gradient(160deg, #fde4bc, #f5c98e)", canela: "linear-gradient(160deg, #fbd5a6, #efb470)" } },
  { clave: "famRose", tonos: { petalo: "linear-gradient(160deg, #fff0f0, #ffd9d9)", rosa: "linear-gradient(160deg, #ffdcdc, #ffbcbc)", coral: "linear-gradient(160deg, #ffc9bd, #ffa48f)" } },
  { clave: "famLilac", tonos: { nube: "linear-gradient(160deg, #f1ebff, #dccfff)", lila: "linear-gradient(160deg, #dfd2ff, #c4aeff)", violeta: "linear-gradient(160deg, #d3c1ff, #bea4ff)" } },
  { clave: "famBlue", tonos: { hielo: "linear-gradient(160deg, #eaf5ff, #cde6ff)", niebla: "linear-gradient(160deg, #cfe8ff, #a6d3ff)", celeste: "linear-gradient(160deg, #b0dbff, #7cc0ff)" } },
  { clave: "famTeal", tonos: { brisa: "linear-gradient(160deg, #e6fbf9, #c4f1ec)", agua: "linear-gradient(160deg, #c6f2ec, #97e3da)", turquesa: "linear-gradient(160deg, #a3ebe2, #6dd8cc)" } },
  { clave: "famGreen", tonos: { rocio: "linear-gradient(160deg, #e6faef, #c6f0d8)", salvia: "linear-gradient(160deg, #c8f2da, #9de4bd)", jade: "linear-gradient(160deg, #a9ebc8, #72d9a4)" } },
];
export const FONDOS_CLAROS = Object.assign({ papel: "#fdfcf9" }, ...FAMILIAS.map((f) => f.tonos));
export const FONDOS_OSCUROS = {
  cafe: "linear-gradient(160deg, #54402e, #2f241a)",
  oceano: "linear-gradient(135deg, #1e3c72, #2a5298)",
  noche: "linear-gradient(160deg, #1c2747, #0f1529)",
  pino: "linear-gradient(160deg, #2a5444, #16302a)",
  uva: "linear-gradient(160deg, #443163, #251b3b)",
  carbon: "linear-gradient(160deg, #34373d, #1f2125)",
};
export const FONDOS = { ...FONDOS_CLAROS, ...FONDOS_OSCUROS };
// Colores que ya no se ofrecen: las láminas que los usan se siguen viendo bien
const VIEJOS = { lino: "linear-gradient(160deg, #f7ebd2, #e9d5ad)", perla: "#eef0f2", vino: "#4a2329", blanco: "#ffffff", crema: "#f6ecd9", cielo: "#dbeafe", menta: "#d1fae5", rosa: "#fde2e4", oro: "#e8c170",
  azul: "#1e3a8a", verde: "#14532d", negro: "#000000", amanecer: "linear-gradient(135deg, #f6d365, #fda085)",
  lavanda: "linear-gradient(135deg, #e0c3fc, #8ec5fc)", bosque: "linear-gradient(135deg, #134e5e, #71b280)",
  aurora: "linear-gradient(160deg, #0f2027, #203a43, #2c5364)", fuego: "linear-gradient(135deg, #8e2de2, #c2185b)" };
const OSCUROS = new Set([...Object.keys(FONDOS_OSCUROS), "vino", "azul", "verde", "negro", "bosque", "aurora", "fuego"]);
/** { css, oscuro } del fondo de una lámina, o null si es papel (el de siempre). */
export const TEXTURAS = ["arrugado", "viejo"];
/** Las mismas reglas de textura que hay en revelar.css, para el resumen que se imprime. */
export const TEXTURAS_CSS = "/* Texturas de papel (encima del color de fondo de la l\u00e1mina) */\n.lam-tex-arrugado { --lam-tex: url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='480' height='480'%3E%3Cfilter id='a' x='0' y='0' width='100%25' height='100%25'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.007 0.011' numOctaves='5' seed='7' stitchTiles='stitch'/%3E%3CfeDiffuseLighting surfaceScale='9' lighting-color='white' diffuseConstant='1'%3E%3CfeDistantLight azimuth='225' elevation='40'/%3E%3C/feDiffuseLighting%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3CfeComponentTransfer%3E%3CfeFuncR type='linear' slope='0.85' intercept='0.32'/%3E%3CfeFuncG type='linear' slope='0.85' intercept='0.32'/%3E%3CfeFuncB type='linear' slope='0.85' intercept='0.32'/%3E%3C/feComponentTransfer%3E%3C/filter%3E%3Crect width='480' height='480' filter='url(%23a)'/%3E%3C/svg%3E\"); --lam-tex-tam: 480px 480px; }\n.lam-tex-viejo { --lam-tex: url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='520' height='520'%3E%3Cfilter id='v' x='0' y='0' width='100%25' height='100%25'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.005' numOctaves='4' seed='11' stitchTiles='stitch' result='m'/%3E%3CfeColorMatrix in='m' values='0 0 0 0 0.62  0 0 0 0 0.45  0 0 0 0 0.22  -1.9 0 0 0 1.05' result='manchas'/%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' seed='3' stitchTiles='stitch' result='g'/%3E%3CfeColorMatrix in='g' values='0 0 0 0 0.45  0 0 0 0 0.33  0 0 0 0 0.2  0 0 0 0.22 0' result='grano'/%3E%3CfeMerge%3E%3CfeMergeNode in='manchas'/%3E%3CfeMergeNode in='grano'/%3E%3C/feMerge%3E%3C/filter%3E%3Crect width='520' height='520' fill='white'/%3E%3Crect width='520' height='520' filter='url(%23v)'/%3E%3C/svg%3E\"), radial-gradient(ellipse at center, rgba(255,250,235,0) 52%, rgba(120,78,30,.32) 100%); --lam-tex-tam: 520px 520px, 100% 100%; }\n.lam-fondo.lam-tex-arrugado, .lam-fondo.lam-tex-viejo,\n.foto.escritura.es-lamina.lam-fondo.lam-tex-arrugado, .foto.escritura.es-lamina.lam-fondo.lam-tex-viejo,\n.sala .foto.escritura.es-lamina.lam-fondo.lam-tex-arrugado, .sala .foto.escritura.es-lamina.lam-fondo.lam-tex-viejo,\n.verso-mini.lam-mini.lam-fondo.lam-tex-arrugado, .verso-mini.lam-mini.lam-fondo.lam-tex-viejo,\n.lam-hoja-wrap.lam-fondo.lam-tex-arrugado, .lam-hoja-wrap.lam-fondo.lam-tex-viejo,\n.papel.es-lamina.lam-fondo.lam-tex-arrugado, .papel.es-lamina.lam-fondo.lam-tex-viejo {\n  background: var(--lam-tex), var(--lam-bg) !important; background-size: var(--lam-tex-tam), 100% 100% !important;\n  background-blend-mode: multiply !important; -webkit-print-color-adjust: exact; print-color-adjust: exact;\n}\n";
export function fondoDe(e) {
  const f = e?.lamina ? String(e.fondo || "") : "";
  const tex = e?.lamina && TEXTURAS.includes(e.textura) ? e.textura : null;   // papel arrugado / papel viejo
  // Un color sólido se escribe como degradado de un solo color, para poder ponerle textura encima
  const capa = (c) => (/^#/.test(c) ? `linear-gradient(${c}, ${c})` : c);
  if (!f || f === "papel") return tex ? { css: capa(FONDOS.papel), oscuro: false, tex } : null;
  if (/^#[0-9a-f]{6}$/i.test(f)) {
    const [r, g, b] = [1, 3, 5].map((i) => parseInt(f.slice(i, i + 2), 16) / 255)
      .map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
    return { css: capa(f), oscuro: 0.2126 * r + 0.7152 * g + 0.0722 * b < 0.3, tex };
  }
  const css = FONDOS[f] || VIEJOS[f];
  return css ? { css: capa(css), oscuro: OSCUROS.has(f), tex } : (tex ? { css: capa(FONDOS.papel), oscuro: false, tex } : null);
}
/** Pinta el fondo en el contenedor de la lámina (tarjeta, miniatura, visor, editor). */
export function ponerFondo(el, e) {
  if (!el) return;
  const f = fondoDe(e);
  el.classList.toggle("lam-fondo", !!f);
  el.classList.toggle("lam-oscuro", !!f?.oscuro);
  TEXTURAS.forEach((x) => el.classList.toggle("lam-tex-" + x, f?.tex === x));
  if (f) el.style.setProperty("--lam-bg", f.css); else el.style.removeProperty("--lam-bg");
}
/** Lo mismo, como texto para meter en un HTML: { clase, estilo }. */
export function fondoAttr(e) {
  const f = fondoDe(e);
  if (!f) return { clase: "", estilo: "" };
  return { clase: " lam-fondo" + (f.oscuro ? " lam-oscuro" : "") + (f.tex ? " lam-tex-" + f.tex : ""), estilo: ` style="--lam-bg: ${f.css.replace(/"/g, "")}"` };
}

/** Cuerpo de una escritura o lámina para incrustar en HTML (cite aparte). */
export function cuerpoHtml(e) {
  return e?.lamina ? `<div class="lam">${laminaAHtml(e.texto)}</div>` : `<p>${textoAHtml(e?.texto, e?.todoRojo)}</p>`;
}
