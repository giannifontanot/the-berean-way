// compartido.js — Imágenes y ligas que el maestro le comparte al app desde internet (Android).
// El service worker las deja en la caché «revelar-compartido»; aquí se acomodan en la lección
// «Desde internet» (se crea sola la primera vez):
//   imagen + liga → una foto con la liga en sus notas
//   solo liga     → una lámina en blanco con la liga en sus notas (después le pones la foto)
//   solo imagen   → la foto, y se pregunta «¿De dónde viene?» para pegar la liga
// Si la imagen y la liga llegan por separado con menos de 3 minutos de diferencia, se juntan en la misma lámina.
import { crearStore, nuevoIdLeccion } from "./store.js?v=202611140555";
import { t } from "./i18n.js?v=202611140555";

const CACHE = "revelar-compartido";
const ULTIMO = "revelar:ultimoCompartido";
const LECCION = "revelar:desdeInternet";
const JUNTAR_MS = 3 * 60 * 1000;

/** Lee y borra de la caché lo compartido. */
async function sacarDeCache() {
  if (!("caches" in window)) return [];
  const c = await caches.open(CACHE);
  const claves = await c.keys();
  const porTs = {};
  for (const req of claves) {
    const m = new URL(req.url).pathname.match(/\/compartido\/(\d+)\/(meta|\d+)$/);
    if (m) (porTs[m[1]] ||= []).push([m[2], req]);
  }
  const lista = [];
  for (const ts of Object.keys(porTs).sort()) {
    const partes = porTs[ts];
    const meta = partes.find(([k]) => k === "meta");
    let info = { ts: +ts, title: "", text: "", url: "" };
    if (meta) { try { info = { ...info, ...(await (await c.match(meta[1])).json()) }; } catch {} }
    const archivos = [];
    for (const [k, req] of partes.filter(([k]) => k !== "meta").sort((a, b) => a[0] - b[0])) {
      const r = await c.match(req);
      if (r) archivos.push(await r.blob());
    }
    for (const [, req] of partes) await c.delete(req);
    lista.push({ ...info, archivos });
  }
  return lista;
}

/** La liga que vino (Chrome a veces la manda dentro del texto). */
function ligaDe(info) {
  const m = `${info.url || ""} ${info.text || ""}`.match(/https?:\/\/[^\s<>"]+/i);
  return m ? m[0].replace(/[),.;!?]+$/, "") : "";
}
// Chrome a veces no manda el archivo sino una liga de Google Imágenes (google.com/imgres?imgurl=…&imgrefurl=…)
// o la liga directa a la imagen. De ahí se sacan la imagen real y la página de donde viene.
function desenredar(liga) {
  try {
    const u = new URL(liga);
    const p = u.searchParams;
    if (/(^|\.)google\./.test(u.hostname) && (p.get("imgurl") || p.get("imgrefurl"))) {
      return { imagen: p.get("imgurl") || "", pagina: p.get("imgrefurl") || "" };
    }
    if (/\.(jpe?g|png|gif|webp|avif|bmp)(\?|#|$)/i.test(u.pathname) || /(^|\.)gstatic\.com$/.test(u.hostname) || /(^|\.)googleusercontent\.com$/.test(u.hostname)) {
      return { imagen: liga, pagina: "" };
    }
  } catch {}
  return { imagen: "", pagina: liga };
}
// Intenta bajar la imagen desde su liga (solo funciona si ese sitio lo permite: CORS).
async function bajarImagen(url) {
  if (!url) return null;
  try {
    const r = await fetch(url, { mode: "cors", credentials: "omit", referrerPolicy: "no-referrer" });
    if (!r.ok) return null;
    const b = await r.blob();
    return b.type.startsWith("image/") && b.size ? b : null;
  } catch { return null; }
}

function notaDe(info, liga) {
  const titulo = String(info.title || "").trim();
  return [titulo && titulo !== liga ? titulo : "", liga].filter(Boolean).join("\n");
}

// Foto para teléfono: vertical 1280 px, horizontal 1920 px, WebP si se puede (igual que en el presentador).
async function comprimir(blob) {
  let fuente;
  try { fuente = await createImageBitmap(blob, { imageOrientation: "from-image" }); }
  catch {
    fuente = await new Promise((ok, no) => { const i = new Image(); i.onload = () => ok(i); i.onerror = () => no(new Error(t("photoFormat"))); i.src = URL.createObjectURL(blob); });
  }
  const w0 = fuente.width, h0 = fuente.height;
  if (!w0 || !h0) throw new Error(t("photoReadFail"));
  const k = Math.min(1, (h0 > w0 ? 1280 : 1920) / Math.max(w0, h0));
  const c = document.createElement("canvas");
  c.width = Math.round(w0 * k); c.height = Math.round(h0 * k);
  c.getContext("2d").drawImage(fuente, 0, 0, c.width, c.height);
  const webp = c.toDataURL("image/webp", 0.8).startsWith("data:image/webp");
  const tipo = webp ? "image/webp" : "image/jpeg";
  for (const q of webp ? [0.8, 0.7, 0.6, 0.5] : [0.82, 0.72, 0.62, 0.5]) {
    const url = c.toDataURL(tipo, q);
    if (url.length < 1500000) return url;
  }
  throw new Error(t("photoTooBig"));
}

const leerUna = (sus) => new Promise((ok) => { let fin; fin = sus((v) => { ok(v); setTimeout(() => fin?.(), 0); }); });

/**
 * Acomoda lo compartido. `lecciones` = tu lista ({id: ficha}); `cat` = catálogo.
 * `preguntarFuente(guardar)` abre la ventanita «¿De dónde viene?»; guardar(liga) la agrega a la nota.
 * Devuelve el id de la lección «Desde internet» si se guardó algo.
 */
export async function procesarCompartidos({ cat, lecciones, aviso, preguntarFuente }) {
  const lista = await sacarDeCache();
  if (!lista.length) return null;

  // La lección «Desde internet»: la que ya usamos, o una con ese nombre, o una nueva.
  let id = null;
  try { id = localStorage.getItem(LECCION); } catch {}
  if (!id || !lecciones[id] || lecciones[id].archivada) {
    id = Object.keys(lecciones).find((k) => !lecciones[k].archivada && !lecciones[k].borrador && lecciones[k].titulo === t("fromInternet")) || null;
  }
  if (!id) {
    id = nuevoIdLeccion();
    const ahora = Date.now();
    await cat.crearLeccion(id, { titulo: t("fromInternet"), creada: ahora, editada: ahora, laminas: 0 });
  }
  try { localStorage.setItem(LECCION, id); } catch {}

  const store = await crearStore(id);
  let orden = (await leerUna((cb) => store.onOrden(cb))) || [];
  orden = orden.map(String);
  let agregadas = 0;
  let ultimo = null;
  try { ultimo = JSON.parse(localStorage.getItem(ULTIMO)); } catch {}
  const reciente = (tipo) => ultimo && ultimo.sesion === id && ultimo.tipo === tipo && Date.now() - ultimo.t < JUNTAR_MS;

  for (const info of lista) {
    let liga = ligaDe(info);
    // Llegó una liga sin archivo: ¿es una imagen (o una liga de Google Imágenes)? Entonces se intenta bajar.
    let sinBajar = "";
    if (!info.archivos.length && liga) {
      const { imagen, pagina } = desenredar(liga);
      if (imagen) {
        const b = await bajarImagen(imagen);
        if (b) { info.archivos = [b]; liga = pagina || ""; }
        else sinBajar = imagen;
      }
      if (pagina) liga = pagina;
      else if (imagen) liga = sinBajar ? "" : liga;       // la liga era de la imagen: no repetirla en la nota
    }
    const ligaEnNota = liga || sinBajar;                  // para el «else if» de abajo: hay algo que guardar
    const nota = notaDe(info, liga) + (sinBajar ? `${liga ? "\n" : ""}🖼 ${sinBajar}` : "");
    if (info.archivos.length) {
      // ¿Llegó antes una liga sola (lámina en blanco)? → la foto toma su lugar y se queda con la nota.
      const junta = !liga && reciente("url") ? ultimo : null;
      for (let i = 0; i < info.archivos.length; i++) {
        const src = await comprimir(info.archivos[i]);
        if (junta && i === 0) {
          const nuevo = await store.guardarSubida({ src, creado: junta.creado || Date.now() });
          if (junta.nota) await store.guardarNota(nuevo, junta.nota);
          orden = orden.map((x) => (x === junta.id ? nuevo : x));
          if (!orden.includes(nuevo)) orden.push(nuevo);
          await store.borrarEscritura(junta.id);
          aviso(t("sharedJoined"));
          ultimo = null;
          continue;
        }
        const nuevo = await store.guardarSubida({ src, creado: Date.now() + i });
        const n = nota || t("sharedNoUrl", { d: new Date().toLocaleString(t("locale"), { dateStyle: "medium", timeStyle: "short" }) });
        await store.guardarNota(nuevo, n);
        orden.push(nuevo); agregadas++;
        ultimo = { t: Date.now(), sesion: id, tipo: "foto", id: nuevo, sinLiga: !liga, nota: n };
        if (!liga) {
          const fotoId = nuevo, notaBase = n;
          preguntarFuente?.(async (l) => {
            const limpia = ligaDe({ url: l });
            if (!limpia) return;
            await store.guardarNota(fotoId, limpia);
            aviso(t("sourceSaved"));
            try { localStorage.removeItem(ULTIMO); } catch {}
          }, notaBase);
        }
      }
      if (!junta || info.archivos.length > 1) aviso(t("sharedSaved"));
    } else if (ligaEnNota) {
      if (reciente("foto") && ultimo.sinLiga) {
        // Llegó antes la imagen sola → se le agrega la liga a su nota.
        await store.guardarNota(ultimo.id, nota);
        aviso(t("sharedJoined"));
        document.dispatchEvent(new Event("fuente-recibida"));
        ultimo = null;
      } else {
        const creado = Date.now();
        const nuevo = await store.guardarEscritura(null, { cita: "", texto: "", todoRojo: false, creado });
        await store.guardarNota(nuevo, nota);
        orden.push(nuevo); agregadas++;
        ultimo = { t: Date.now(), sesion: id, tipo: "url", id: nuevo, creado, nota };
        aviso(t(sinBajar ? "sharedNoImage" : "sharedLinkSaved"));
      }
    }
  }
  await store.guardarOrden(orden);
  try { ultimo ? localStorage.setItem(ULTIMO, JSON.stringify(ultimo)) : localStorage.removeItem(ULTIMO); } catch {}
  if (agregadas) {
    const f = lecciones[id] || {};
    try { await cat.guardarLeccion(id, { laminas: (f.laminas || 0) + agregadas, editada: Date.now() }); } catch {}
  }
  return id;
}
