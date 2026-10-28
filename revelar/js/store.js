// store.js — El "mensajero" en tiempo real.
// Con Firebase configurado usa Realtime Database; si no, un MODO DEMO que
// sincroniza pestañas del mismo navegador (localStorage), para probar.
//
// Datos en Firebase:
//   revelar/<sesion>/reveladas/<fotoId> = marca de tiempo (orden de revelado)
//   revelar/<sesion>/presencia/<conexion> = true (un participante conectado)
//   revelar/<sesion>/orden = [ids] (orden de TU cuadrícula; solo lo usa el presentador)
//   revelar/<sesion>/escrituras/<id> = { cita, texto, todoRojo, creado }
//     Las escrituras comparten "reveladas" y "orden" con las fotos.
import { CONFIG } from "../config.js";

const FB = "https://www.gstatic.com/firebasejs/12.17.0/";

export const configurado = !String(CONFIG.firebase?.apiKey || "").startsWith("PEGA");

export function limpiarSesion(s) {
  return String(s || "").toLowerCase().replace(/[^a-z0-9_-]/g, "").slice(0, 40);
}

export function sesionActual() {
  const s = new URLSearchParams(location.search).get("s");
  return limpiarSesion(s) || limpiarSesion(CONFIG.sesionPorDefecto) || "clase";
}

/** Convierte { id: ts } en una lista de ids ordenada por momento de revelado. */
export function ordenar(reveladas) {
  return Object.entries(reveladas || {})
    .sort((a, b) => (a[1] - b[1]) || a[0].localeCompare(b[0]))
    .map(([id]) => id);
}

export function esPermisoDenegado(err) {
  return /PERMISSION_DENIED|permission/i.test(String(err?.code || "") + " " + String(err?.message || ""));
}

export async function crearStore(sesion) {
  return configurado ? storeFirebase(sesion) : storeDemo(sesion);
}

/* ----------------------------- Firebase ----------------------------- */
async function storeFirebase(sesion) {
  const [{ initializeApp }, db] = await Promise.all([
    import(FB + "firebase-app.js"),
    import(FB + "firebase-database.js"),
  ]);
  const app = initializeApp(CONFIG.firebase);
  const d = db.getDatabase(app);
  const base = `revelar/${sesion}`;
  const refReveladas = db.ref(d, `${base}/reveladas`);
  const refPresencia = db.ref(d, `${base}/presencia`);
  const refConectado = db.ref(d, ".info/connected");
  const refOrden = db.ref(d, `${base}/orden`);
  const refEscrituras = db.ref(d, `${base}/escrituras`);

  let authMod = null, auth = null;
  async function getAuth() {
    if (!auth) {
      authMod = await import(FB + "firebase-auth.js");
      auth = authMod.getAuth(app);
    }
    return auth;
  }

  return {
    modo: "firebase",
    onReveladas(cb, onError) {
      return db.onValue(refReveladas, (s) => cb(s.val() || {}), onError);
    },
    onConexion(cb) {
      return db.onValue(refConectado, (s) => cb(s.val() === true));
    },
    onPresencia(cb) {
      return db.onValue(refPresencia, (s) => cb(s.size), () => cb(null));
    },
    registrarPresencia() {
      const yo = db.push(refPresencia);
      db.onValue(refConectado, (s) => {
        if (s.val() !== true) return;
        db.onDisconnect(yo).remove()
          .then(() => db.set(yo, true))
          .catch(() => {});
      });
    },
    revelar: (id) => db.set(db.ref(d, `${base}/reveladas/${id}`), db.serverTimestamp()),
    ocultar: (id) => db.remove(db.ref(d, `${base}/reveladas/${id}`)),
    reiniciar: () => db.remove(refReveladas),
    onOrden(cb) {
      return db.onValue(refOrden, (s) => cb(Array.isArray(s.val()) ? s.val() : null), () => cb(null));
    },
    guardarOrden: (ids) => db.set(refOrden, ids),
    onEscrituras(cb) {
      return db.onValue(refEscrituras, (s) => cb(s.val() || {}), () => cb({}));
    },
    onEscritura(id, cb) {
      return db.onValue(db.ref(d, `${base}/escrituras/${id}`), (s) => cb(s.val()), () => cb(null));
    },
    async guardarEscritura(id, datos) {
      const clave = id || "esc_" + db.push(refEscrituras).key.replace(/^-/, "");
      await db.set(db.ref(d, `${base}/escrituras/${clave}`), datos);
      return clave;
    },
    borrarEscritura: (id) => db.update(db.ref(d, base), {
      [`escrituras/${id}`]: null,
      [`reveladas/${id}`]: null,
    }),
    async onUsuario(cb) {
      const a = await getAuth();
      return authMod.onAuthStateChanged(a, cb);
    },
    async entrar() {
      const a = await getAuth();
      return authMod.signInWithPopup(a, new authMod.GoogleAuthProvider());
    },
    async salir() {
      const a = await getAuth();
      return authMod.signOut(a);
    },
  };
}

/* ------------------------------ Demo ------------------------------- */
function storeDemo(sesion) {
  const clave = `revelar-demo:${sesion}`;
  const oyentes = new Set();
  const leer = () => { try { return JSON.parse(localStorage.getItem(clave)) || {}; } catch { return {}; } };
  const escribir = (v) => {
    try { localStorage.setItem(clave, JSON.stringify(v)); } catch {}
    oyentes.forEach((cb) => cb(v));
  };
  const claveEsc = clave + ":escrituras";
  const oyentesEsc = new Set();
  const leerEsc = () => { try { return JSON.parse(localStorage.getItem(claveEsc)) || {}; } catch { return {}; } };
  const escribirEsc = (v) => {
    try { localStorage.setItem(claveEsc, JSON.stringify(v)); } catch {}
    oyentesEsc.forEach((cb) => cb(v));
  };
  window.addEventListener("storage", (e) => {
    if (e.key === clave) oyentes.forEach((cb) => cb(leer()));
    if (e.key === claveEsc) oyentesEsc.forEach((cb) => cb(leerEsc()));
  });

  return {
    modo: "demo",
    onReveladas(cb) { oyentes.add(cb); cb(leer()); return () => oyentes.delete(cb); },
    onConexion(cb) { cb(true); return () => {}; },
    onPresencia(cb) { cb(null); return () => {}; },
    registrarPresencia() {},
    async revelar(id) { const v = leer(); v[id] = Date.now(); escribir(v); },
    async ocultar(id) { const v = leer(); delete v[id]; escribir(v); },
    async reiniciar() { escribir({}); },
    onOrden(cb) {
      try { cb(JSON.parse(localStorage.getItem(clave + ":orden"))); } catch { cb(null); }
      return () => {};
    },
    async guardarOrden(ids) { try { localStorage.setItem(clave + ":orden", JSON.stringify(ids)); } catch {} },
    onEscrituras(cb) { oyentesEsc.add(cb); cb(leerEsc()); return () => oyentesEsc.delete(cb); },
    onEscritura(id, cb) {
      const f = (v) => cb(v[id] || null);
      oyentesEsc.add(f); f(leerEsc());
      return () => oyentesEsc.delete(f);
    },
    async guardarEscritura(id, datos) {
      const clave2 = id || "esc_" + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
      const v = leerEsc(); v[clave2] = datos; escribirEsc(v);
      return clave2;
    },
    async borrarEscritura(id) {
      const v = leerEsc(); delete v[id]; escribirEsc(v);
      const r = leer(); delete r[id]; escribir(r);
    },
    async onUsuario(cb) { cb({ uid: "demo", displayName: "Modo demo" }); return () => {}; },
    async entrar() {},
    async salir() {},
  };
}
