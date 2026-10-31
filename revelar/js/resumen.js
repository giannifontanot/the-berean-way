// resumen.js — Arma un archivo HTML con el resumen de la clase:
// cada lámina en orden (foto o escritura) seguida de tus notas.
// Las fotos se incrustan en el archivo, así que se abre sin internet.
import { t, idioma } from "./i18n.js?v=202610310832";
import { textoAHtml, notasAHtml } from "./escritura.js?v=202610310832";

/**
 * Arma la lista en el orden del presentador a partir de lo guardado en la lección.
 * Las láminas con "~" al inicio del id están saltadas (no se muestran en el resumen).
 */
export function armarLista({ orden, escrituras, subidas }) {
  const items = new Map();
  [
    ...Object.entries(subidas || {}).filter(([id]) => id.startsWith("sub_"))
      .map(([id, f]) => ({ id, tipo: "foto", src: f.src, creado: f.creado })),
    ...Object.entries(escrituras || {}).map(([id, e]) => ({ id, tipo: "escritura", ...e })),
  ].sort((a, b) => (a.creado || 0) - (b.creado || 0)).forEach((it) => items.set(it.id, it));
  const lista = [], saltadas = new Set(), vistos = new Set();
  for (const crudo of Object.values(orden || {})) {
    const oculta = String(crudo).startsWith("~");
    const id = oculta ? String(crudo).slice(1) : String(crudo);
    if (!items.has(id) || vistos.has(id)) continue;
    vistos.add(id); lista.push(items.get(id));
    if (oculta) saltadas.add(id);
  }
  for (const it of items.values()) if (!vistos.has(it.id)) lista.push(it);
  return { lista, saltadas };
}

const ESC = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };
const escapar = (t) => String(t ?? "").replace(/[&<>"']/g, (c) => ESC[c]);

/** Foto → data URL JPEG (lado mayor 1400 px) para que el archivo viaje solo. */
function incrustar(src, lado = 1400) {
  return new Promise((ok) => {
    const img = new Image();
    img.onload = () => {
      const k = Math.min(1, lado / Math.max(img.naturalWidth, img.naturalHeight));
      const c = document.createElement("canvas");
      c.width = Math.round(img.naturalWidth * k);
      c.height = Math.round(img.naturalHeight * k);
      c.getContext("2d").drawImage(img, 0, 0, c.width, c.height);
      try { ok(c.toDataURL("image/jpeg", 0.84)); } catch { ok(src); }
    };
    img.onerror = () => ok(src);
    img.src = src;
  });
}

const CSS = `
:root { --tinta:#1d1a16; --suave:#6b645a; --linea:#e6e1d8; --fondo:#faf8f4; --rojo:#a5161b; --oro:#a77a1c; }
* { box-sizing: border-box; }
html { -webkit-text-size-adjust: 100%; }
body { margin: 0; background: var(--fondo); color: var(--tinta);
  font-family: "Atkinson Hyperlegible", system-ui, -apple-system, "Segoe UI", sans-serif; line-height: 1.55; }
main { max-width: 720px; margin: 0 auto; padding: 40px 16px 64px; }
header { margin-bottom: 36px; }
.eti { font-size: 12px; letter-spacing: .12em; text-transform: uppercase; color: var(--oro); font-weight: 700; margin: 0 0 6px; }
h1 { font-family: "Lora", Georgia, serif; font-weight: 600; font-size: clamp(28px, 6vw, 40px); line-height: 1.15; margin: 0 0 8px; }
.fecha { color: var(--suave); margin: 0; }
.lamina { margin: 0 0 40px; break-inside: avoid; page-break-inside: avoid; }
.num { display: flex; align-items: center; gap: 10px; font-size: 13px; font-weight: 700; color: var(--suave);
  letter-spacing: .06em; text-transform: uppercase; margin-bottom: 10px; }
.num::after { content: ""; flex: 1; height: 1px; background: var(--linea); }
.foto img { display: block; width: 100%; height: auto; border-radius: 10px; background: #111; }
.papel { border-radius: 10px; padding: 26px 22px 18px; border: 1px solid #dcc9a3;
  background-color: #f1e4c8;
  background-image: radial-gradient(ellipse at center, rgba(255,248,230,.55) 0%, rgba(255,248,230,0) 60%, rgba(150,105,50,.22) 100%);
  color: #2a1f14; }
.papel p { font-family: "Lora", Georgia, serif; font-size: 20px; line-height: 1.6; margin: 0 0 12px; }
.papel cite { font-style: normal; font-weight: 700; font-size: 13px; letter-spacing: .08em; text-transform: uppercase; color: #7a6343; }
.papel .rojo { color: var(--rojo); }
.papel mark { background: rgba(247,214,92,.6); color: inherit; padding: 0 1px; }
.papel .vnum { color: #b9a37f; font-size: 1em; vertical-align: baseline; margin-right: .3em; }
.notas { margin-top: 12px; background: #efede8; border-radius: 10px; padding: 14px 16px; font-size: 16px; }
.notas .tit { font-size: 12px; letter-spacing: .1em; text-transform: uppercase; color: var(--suave); font-weight: 700; margin: 0 0 6px; }
.notas p { margin: 0 0 6px; }
.notas ul { margin: 0 0 6px; padding-left: 20px; }
.notas .rojo { color: var(--rojo); }
.notas mark { background: #fff07a; color: inherit; }
footer { color: var(--suave); font-size: 13px; text-align: center; margin-top: 48px; }
@media print { body { background: #fff; } main { padding-top: 0; } .notas { background: #f3f3f3; } }
`;

/**
 * @param {{ lista: object[], saltadas: Set<string>, notas: Record<string,string>, titulo?: string }} datos
 * @returns {Promise<string>} HTML completo
 */
export async function crearResumen({ lista, saltadas, notas, titulo }) {
  const nombre = titulo || t("classSummary");
  const visibles = lista.filter((it) => !saltadas.has(it.id));
  const fecha = new Date().toLocaleDateString(t("locale"), { weekday: "long", day: "numeric", month: "long", year: "numeric" });
  const partes = [];
  for (let i = 0; i < visibles.length; i++) {
    const it = visibles[i];
    let cuerpo, tipo;
    if (it.tipo === "escritura" && !String(it.texto || "").trim()) {
      tipo = t("pendingSlide");          // lámina en blanco: solo sus notas
      cuerpo = "";
    } else if (it.tipo === "foto") {
      tipo = t("photo");
      cuerpo = `<div class="foto"><img alt="" src="${escapar(await incrustar(it.src))}"></div>`;
    } else {
      tipo = it.cita ? escapar(it.cita) : t("scripture");
      cuerpo = `<div class="papel"><p>${textoAHtml(it.texto, it.todoRojo)}</p>${it.cita ? `<cite>${escapar(it.cita)}</cite>` : ""}</div>`;
    }
    const n = notas[it.id];
    const nota = n ? `<div class="notas"><p class="tit">${t("notes")}</p>${notasAHtml(n)}</div>` : "";
    partes.push(`<section class="lamina"><div class="num">#${i + 1} · ${tipo}</div>${cuerpo}${nota}</section>`);
  }
  return `<!doctype html>
<html lang="${idioma()}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${escapar(nombre)}</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Atkinson+Hyperlegible:wght@400;700&family=Lora:wght@400;600&display=swap" rel="stylesheet">
<style>${CSS}</style>
</head>
<body>
<main>
<header>
  <p class="eti">Berean Reveal · ${t("classSummary")}</p>
  <h1>${escapar(nombre)}</h1>
  <p class="fecha">${escapar(fecha)} · ${visibles.length} ${visibles.length === 1 ? t("slide") : t("slides")}</p>
</header>
${partes.join("\n")}
<footer>${t("madeWith")}</footer>
</main>
</body>
</html>`;
}
