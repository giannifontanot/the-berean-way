// sw.js — Permite instalar el app y abrirla aunque falle la red.
// Siempre intenta la red primero (así cada publicación se ve enseguida);
// si no hay conexión, usa la última copia guardada. Solo archivos de este sitio:
// Firebase (lecciones en vivo) nunca pasa por aquí.
const CACHE = "berean-reveal-v29";
const BASICOS = ["./", "index.html", "lecciones.html", "presentador.html", "revelar.css"];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(BASICOS)).catch(() => {}));
  self.skipWaiting();
});

self.addEventListener("activate", (e) => {
  e.waitUntil((async () => {
    for (const k of await caches.keys()) if (k !== CACHE) await caches.delete(k);
    await self.clients.claim();
  })());
});

self.addEventListener("fetch", (e) => {
  const req = e.request;
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
