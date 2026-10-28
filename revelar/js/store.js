// store.js — El "mensajero" en tiempo real.
// Con Firebase configurado usa Realtime Database; si no, un MODO DEMO que
// sincroniza pestañas del mismo navegador (localStorage), para probar.
//
// Datos en Firebase:
//   revelar/<sesion>/reveladas/<fotoId> = marca de tiempo (orden de revelado)
//   revelar/<sesion>/presencia/<conexion> = true (un participante conectado)
//   revelar/<sesion>/orden = [ids] (orden de TU cuadrícula; solo lo usa el presentador)
//   revelar/<sesion>/escrituras/<id> = { cita, texto, todoRojo, creado }
//   revelar_privado/<sesion>/notas/<id> = "texto" (notas del presentador: solo tu cuenta
//     puede leerlas; fuera de "revelar/" porque ahí todo es de lectura pública)
//   revelar/<sesion>/subidas/<id> = { src: "data:image/jpeg;base64,…", creado }
//     Fotos que subes desde el presentador con "+". Guardadas en la misma base de
//     datos (comprimidas), así no hace falta activar otro servicio de Firebase.
//     Escrituras y subidas comparten "reveladas" y "orden" con las fotos del repo.
import { CONFIG } from "../config.js?v=202610281523";

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

// Desvío: una foto/escritura que tocaste fuera del orden. Se guarda en "reveladas"
// con este prefijo (así no cambian las reglas) y "Siguiente" la quita.
export const TEMP = "tmp__";
export const esTemporal = (k) => String(k).startsWith(TEMP);
export const idReal = (k) => (esTemporal(k) ? String(k).slice(TEMP.length) : String(k));

// Regresar: al tocar una lámina que ya pasó, los teléfonos vuelven a ella.
// También vive en "reveladas" con su prefijo; "Siguiente" lo limpia.
export const FOCO = "ir__";
export const esFoco = (k) => String(k).startsWith(FOCO);

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
  const refSubidas = db.ref(d, `${base}/subidas`);
  const basePrivada = `revelar_privado/${sesion}`;
  const refNotas = db.ref(d, `${basePrivada}/notas`);

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
    // Quita los desvíos y revela el siguiente del orden, en un solo cambio.
    avanzar(quitar, siguienteId) {
      const cambios = {};
      quitar.forEach((k) => { cambios[k] = null; });
      if (siguienteId) cambios[siguienteId] = db.serverTimestamp();
      return db.update(refReveladas, cambios);
    },
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
    borrarEscritura: (id) => db.update(db.ref(d), {
      [`${base}/escrituras/${id}`]: null,
      [`${base}/reveladas/${id}`]: null,
      [`${base}/reveladas/${TEMP}${id}`]: null,
      [`${basePrivada}/notas/${id}`]: null,
    }),
    // Las notas son privadas: solo se pueden leer con tu cuenta ya dentro.
    onNotas(cb, onError) {
      return db.onValue(refNotas, (s) => cb(s.val() || {}), (e) => { cb({}); onError?.(e); });
    },
    guardarNota: (id, texto) => db.set(db.ref(d, `${basePrivada}/notas/${id}`), String(texto || "").trim() || null),
    onSubidas(cb) {
      return db.onValue(refSubidas, (s) => cb(s.val() || {}), () => cb({}));
    },
    onSubida(id, cb) {
      return db.onValue(db.ref(d, `${base}/subidas/${id}`), (s) => cb(s.val()), () => cb(null));
    },
    async guardarSubida(datos) {
      const clave = "sub_" + db.push(refSubidas).key.replace(/^-/, "");
      await db.set(db.ref(d, `${base}/subidas/${clave}`), datos);
      return clave;
    },
    // Cambiar la imagen de una foto (subida o del repo). Para las del repo se guarda
    // en subidas/<id> con el mismo id y reemplaza a la original.
    reemplazarFoto: (id, src, creado) => db.set(db.ref(d, `${base}/subidas/${id}`), { src, creado: creado || Date.now() }),
    borrarSubida: (id) => db.update(db.ref(d), {
      [`${base}/subidas/${id}`]: null,
      [`${base}/reveladas/${id}`]: null,
      [`${base}/reveladas/${TEMP}${id}`]: null,
      [`${basePrivada}/notas/${id}`]: null,
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
  const claveNotas = clave + ":notas";
  const oyentesNotas = new Set();
  const leerNotas = () => { try { return JSON.parse(localStorage.getItem(claveNotas)) || {}; } catch { return {}; } };
  const escribirNotas = (v) => {
    try { localStorage.setItem(claveNotas, JSON.stringify(v)); } catch {}
    oyentesNotas.forEach((cb) => cb(v));
  };
  const claveSub = clave + ":subidas";
  const oyentesSub = new Set();
  const leerSub = () => { try { return JSON.parse(localStorage.getItem(claveSub)) || {}; } catch { return {}; } };
  const escribirSub = (v) => {
    try { localStorage.setItem(claveSub, JSON.stringify(v)); }
    catch { throw new Error("En modo demo no caben más fotos en este navegador."); }
    oyentesSub.forEach((cb) => cb(v));
  };
  window.addEventListener("storage", (e) => {
    if (e.key === clave) oyentes.forEach((cb) => cb(leer()));
    if (e.key === claveEsc) oyentesEsc.forEach((cb) => cb(leerEsc()));
    if (e.key === claveSub) oyentesSub.forEach((cb) => cb(leerSub()));
    if (e.key === claveNotas) oyentesNotas.forEach((cb) => cb(leerNotas()));
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
    async avanzar(quitar, siguienteId) {
      const v = leer();
      quitar.forEach((k) => delete v[k]);
      if (siguienteId) v[siguienteId] = Date.now();
      escribir(v);
    },
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
      const r = leer(); delete r[id]; delete r[TEMP + id]; escribir(r);
    },
    onNotas(cb) { oyentesNotas.add(cb); cb(leerNotas()); return () => oyentesNotas.delete(cb); },
    async guardarNota(id, texto) {
      const v = leerNotas();
      const t = String(texto || "").trim();
      if (t) v[id] = t; else delete v[id];
      escribirNotas(v);
    },
    onSubidas(cb) { oyentesSub.add(cb); cb(leerSub()); return () => oyentesSub.delete(cb); },
    onSubida(id, cb) {
      const f = (v) => cb(v[id] || null);
      oyentesSub.add(f); f(leerSub());
      return () => oyentesSub.delete(f);
    },
    async guardarSubida(datos) {
      const id = "sub_" + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
      const v = leerSub(); v[id] = datos; escribirSub(v);
      return id;
    },
    async reemplazarFoto(id, src, creado) {
      const v = leerSub(); v[id] = { src, creado: creado || Date.now() }; escribirSub(v);
    },
    async borrarSubida(id) {
      const v = leerSub(); delete v[id]; escribirSub(v);
      const r = leer(); delete r[id]; delete r[TEMP + id]; escribir(r);
    },
    async onUsuario(cb) { cb({ uid: "demo", displayName: "Modo demo" }); return () => {}; },
    async entrar() {},
    async salir() {},
  };
}
