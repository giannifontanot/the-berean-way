// papel.js — Editor de escrituras directamente sobre el papel sepia.
//
// Escribes o pegas el texto en la hoja; seleccionas palabras y tocas Rojo o
// Resaltar. Por dentro el texto se guarda igual que siempre:
//   *así*   → letra roja        ==así== → resaltado
// así que las escrituras guardadas antes siguen funcionando.
//
// El contenido se maneja como una lista de letras con dos marcas (rojo,
// resaltado). Al tocar un botón se cambia la marca de las letras
// seleccionadas y se vuelve a dibujar la hoja, conservando la selección.
import { t } from "./i18n.js?v=202610310957";
import { indicesVersiculos } from "./escritura.js?v=202610310957";

const ESC = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };
const escapar = (t) => String(t).replace(/[&<>"']/g, (c) => ESC[c]);

/** Texto guardado (*rojo*, ==resaltado==) → letras con marcas. */
export function desdeMarcado(texto) {
  const s = String(texto || "");
  const out = [];
  let r = false, h = false;
  for (let i = 0; i < s.length; i++) {
    if (s.startsWith("==", i)) { h = !h; i++; continue; }
    if (s[i] === "*") { r = !r; continue; }
    out.push({ c: s[i], r, h });
  }
  return out;
}

/** Letras con marcas → texto guardado. */
export function aMarcado(letras) {
  let s = "", i = 0;
  while (i < letras.length) {
    const { r, h } = letras[i];
    let t = "";
    while (i < letras.length && letras[i].r === r && letras[i].h === h) t += letras[i++].c;
    if (r) t = "*" + t + "*";
    if (h) t = "==" + t + "==";
    s += t;
  }
  return s;
}

/** Lee la hoja (DOM) → letras con marcas. */
function leer(raiz) {
  const out = [];
  const recorrer = (nodo, r, h) => {
    for (const hijo of nodo.childNodes) {
      if (hijo.nodeType === 3) {
        for (const c of hijo.nodeValue.replace(/​/g, "")) out.push({ c: c === " " ? " " : c, r, h });
      } else if (hijo.nodeName === "BR") {
        out.push({ c: "\n", r, h });
      } else if (hijo.nodeType === 1) {
        const bloque = /^(DIV|P)$/.test(hijo.nodeName);
        if (bloque && out.length && out[out.length - 1].c !== "\n") out.push({ c: "\n", r, h });
        recorrer(hijo, r || hijo.classList.contains("rojo"), h || hijo.nodeName === "MARK");
      }
    }
  };
  recorrer(raiz, false, false);
  return out;
}

/** Dibuja las letras en la hoja. Los números de versículo se ven grises (si aplica). */
function dibujar(raiz, letras, versiculos = true) {
  const vn = versiculos ? indicesVersiculos(letras.map((x) => x.c).join("")) : new Set();
  let html = "", i = 0;
  while (i < letras.length) {
    const { r, h } = letras[i];
    const v = vn.has(i);
    let t = "";
    while (i < letras.length && letras[i].r === r && letras[i].h === h && vn.has(i) === v) t += letras[i++].c;
    let seg = escapar(t);
    if (v) seg = `<span class="vnum-ed">${seg}</span>`;
    if (h) seg = `<mark>${seg}</mark>`;
    if (r) seg = `<span class="rojo">${seg}</span>`;
    html += seg;
  }
  // Un salto final necesita un <br> para verse
  if (letras.length && letras[letras.length - 1].c === "\n") html += "<br>";
  raiz.innerHTML = html;
}

/** Posición (nodo, desplazamiento) → índice de letra. */
function aIndice(raiz, nodo, desp) {
  const rango = document.createRange();
  rango.setStart(raiz, 0);
  try { rango.setEnd(nodo, desp); } catch { return 0; }
  const caja = document.createElement("div");
  caja.append(rango.cloneContents());
  return leer(caja).length;
}

/** Índice de letra → posición en la hoja (después de dibujar). */
function aPunto(raiz, indice) {
  const w = document.createTreeWalker(raiz, NodeFilter.SHOW_TEXT);
  let n, cuenta = 0, ultimo = null;
  while ((n = w.nextNode())) {
    const largo = n.nodeValue.length;
    if (indice <= cuenta + largo) return [n, indice - cuenta];
    cuenta += largo;
    ultimo = n;
  }
  return ultimo ? [ultimo, ultimo.nodeValue.length] : [raiz, 0];
}

// versiculos: false para las notas (sin números de versículo en gris).
export function crearPapel(raiz, { alCambiar, avisar, versiculos = true } = {}) {
  const dib = (r, l) => dibujar(r, l, versiculos);
  // Pegar siempre como texto simple
  raiz.addEventListener("paste", (e) => {
    e.preventDefault();
    const t = (e.clipboardData || window.clipboardData).getData("text/plain");
    document.execCommand("insertText", false, t);
  });
  raiz.addEventListener("input", () => alCambiar?.());
  // Al salir de la hoja, se vuelve a dibujar (números de versículo en gris)
  raiz.addEventListener("blur", () => dib(raiz, leer(raiz)));

  function seleccion() {
    const sel = getSelection();
    if (!sel.rangeCount) return null;
    const rg = sel.getRangeAt(0);
    if (!raiz.contains(rg.startContainer) || !raiz.contains(rg.endContainer)) return null;
    return [aIndice(raiz, rg.startContainer, rg.startOffset), aIndice(raiz, rg.endContainer, rg.endOffset)];
  }

  function seleccionar(a, z) {
    const [n1, o1] = aPunto(raiz, a);
    const [n2, o2] = aPunto(raiz, z);
    const rg = document.createRange();
    rg.setStart(n1, o1);
    rg.setEnd(n2, o2);
    const sel = getSelection();
    sel.removeAllRanges();
    sel.addRange(rg);
  }

  return {
    poner(texto) { dib(raiz, desdeMarcado(texto)); },
    texto() {
      const letras = leer(raiz);
      while (letras.length && /\s/.test(letras[letras.length - 1].c)) letras.pop();
      while (letras.length && /\s/.test(letras[0].c)) letras.shift();
      return aMarcado(letras);
    },
    // Marca o quita "r" (rojo) o "h" (resaltado) en lo seleccionado.
    marcar(marca) {
      const s = seleccion();
      if (!s || s[0] === s[1]) { avisar?.(t("selectFirst")); raiz.focus(); return; }
      let [a, z] = s;
      const letras = leer(raiz);
      while (a < z && /\s/.test(letras[a]?.c)) a++;
      while (z > a && /\s/.test(letras[z - 1]?.c)) z--;
      if (a === z) return;
      const todas = letras.slice(a, z).every((x) => x[marca]);
      for (let i = a; i < z; i++) letras[i][marca] = !todas;
      dib(raiz, letras);
      raiz.focus();
      seleccionar(a, z);
      alCambiar?.();
    },
  };
}
