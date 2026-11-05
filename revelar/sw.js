// sw.js — Permite instalar el app y abrirla aunque falle la red.
// Siempre intenta la red primero (así cada publicación se ve enseguida);
// si no hay conexión, usa la última copia guardada. Solo archivos de este sitio:
// Firebase (lecciones en vivo) nunca pasa por aquí.
const CACHE = "berean-reveal-v71";
const BASICOS = ["./", "index.html", "lecciones.html", "presentador.html", "revelar.css"];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(BASICOS)).catch(() => {}));
  self.skipWaiting();
});

self.addEventListener("activate", (e) => {
  e.waitUntil((async () => {
    for (const k of await caches.keys()) if (k !== CACHE && k !== COMPARTIDO) await caches.delete(k);
    await self.clients.claim();
  })());
});

// Compartir al app (Android): Chrome manda aquí la imagen y/o la liga con un POST.
// Se guardan un momento en una caché aparte y se abre Mis lecciones para acomodarlas en «Desde internet».
const COMPARTIDO = "revelar-compartido";
async function recibirCompartido(req) {
  const ts = Date.now();
  try {
    const f = await req.formData();
    const c = await caches.open(COMPARTIDO);
    const archivos = f.getAll("imagen").filter((x) => x && typeof x === "object" && x.size);
    await Promise.all(archivos.map((a, i) => c.put(`./compartido/${ts}/${i}`, new Response(a, { headers: { "Content-Type": a.type || "image/*" } }))));
    const meta = { ts, n: archivos.length, title: String(f.get("title") || ""), text: String(f.get("text") || ""), url: String(f.get("url") || "") };
    await c.put(`./compartido/${ts}/meta`, new Response(JSON.stringify(meta), { headers: { "Content-Type": "application/json" } }));
  } catch {}
  return Response.redirect(`./lecciones.html?compartido=${ts}`, 303);
}

self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method === "POST" && new URL(req.url).pathname.endsWith("/compartir")) { e.respondWith(recibirCompartido(req)); return; }
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.origin !== location.origin) return;
  e.respondWith((async () => {
    const cache = await caches.open(CACHE);
    try {
      const resp = await fetch(req);
      if (resp.ok && resp.type === "basic") cache.put(req, resp.clone());
      return resp;
    } catch (err) {
      const guardada = await cache.match(req) || await cache.match(req, { ignoreSearch: true });
      if (guardada) return guardada;
      if (req.mode === "navigate") return (await cache.match("index.html")) || Response.error();
      throw err;
    }
  })());
});
