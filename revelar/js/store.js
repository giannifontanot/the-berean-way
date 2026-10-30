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
//   Varios maestros (cualquiera con cuenta de Google):
//   revelar_duenos/<sesion> = "<uid>"   Dueño de cada lección; solo él escribe en ella.
//   revelar_lecciones/<uid>/<sesion> = { titulo, creada, editada, archivada, laminas, portada }
//     La lista de lecciones de cada maestro (solo él la lee).
//   revelar_maestros/<uid> = { codigo, nombre, creado }   Perfil de cada maestro.
//   revelar_codigos/<codigo> = "<uid>"  Código corto de cada maestro (único).
//   revelar_vivo/<codigo> = "<sesion>"  La lección en vivo de ese maestro. Sus
//     participantes abren ?p=<codigo> y la siguen.
//   revelar_actual = "<sesion>"  Igual, para el enlace original sin ?p= (presentador original).
//   revelar_buzon/<uid>/<envio> = { deUid, deNombre, origen, titulo, creado }
//     Copias de lecciones que otro maestro te envió.
//   revelar_bloqueados/<uid> = true   Maestro pausado por el administrador: no puede
//     escribir nada. Solo el administrador (presentador original) ve y cambia esto.
import { CONFIG } from "../config.js?v=202610301255";

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
// Una sola app de Firebase para la página, aunque se pidan store y catálogo.
let fbListo = null;
function firebase() {
  fbListo ??= Promise.all([
    import(FB + "firebase-app.js"),
    import(FB + "firebase-database.js"),
  ]).then(([appMod, db]) => {
    const app = appMod.getApps().length ? appMod.getApp() : appMod.initializeApp(CONFIG.firebase);
    return { app, db, d: db.getDatabase(app) };
  });
  return fbListo;
}
let authListo = null;
function firebaseAuth() {
  authListo ??= firebase().then(async ({ app }) => {
    const authMod = await import(FB + "firebase-auth.js");
    return { authMod, auth: authMod.getAuth(app) };
  });
  return authListo;
}

/** Id nuevo para una lección: letras y números, compatible con ?s= */
export function nuevoIdLeccion() {
  return "l" + Date.now().toString(36) + Math.random().toString(36).slice(2, 5);
}

/** Presentador original: su enlace sin ?p= sigue funcionando. */
export const PRESENTADOR_ORIGINAL = "xWkkWXXR0jcHMnOGEwYjrxzxGtX2";

/** Código corto para el enlace de participantes (sin letras que se confunden). */
function nuevoCodigo() {
  const L = "23456789abcdefghjkmnpqrstuvwxyz";
  let c = "";
  for (let i = 0; i < 4; i++) c += L[Math.floor(Math.random() * L.length)];
  return c;
}
export function limpiarCodigo(c) {
  return String(c || "").toLowerCase().replace(/[^a-z0-9]/g, "").slice(0, 8);
}

/** Lecciones del maestro, su código y la lección en vivo (no depende de una sesión). */
export async function crearCatalogo() {
  return configurado ? catalogoFirebase() : catalogoDemo();
}

async function catalogoFirebase() {
  const { db, d } = await firebase();
  const { authMod, auth } = await firebaseAuth();
  const uid = () => auth.currentUser?.uid;
  const ref = (ruta) => db.ref(d, ruta);
  const val = async (ruta) => (await db.get(ref(ruta))).val();
  // Copia lo público de una lección (orden, escrituras, fotos) a otra.
  async function copiarContenido(origen, destino, extra) {
    const [orden, esc, sub] = await Promise.all([
      val(`revelar/${origen}/orden`), val(`revelar/${origen}/escrituras`), val(`revelar/${origen}/subidas`),
    ]);
    await db.update(ref(""), {
      [`revelar/${destino}/orden`]: orden,
      [`revelar/${destino}/escrituras`]: esc,
      [`revelar/${destino}/subidas`]: sub,
      ...extra,
    });
  }
  return {
    modo: "firebase",
    uid,
    onUsuario: (cb) => authMod.onAuthStateChanged(auth, cb),
    entrar: () => authMod.signInWithPopup(auth, new authMod.GoogleAuthProvider()),
    // Perfil del maestro; la primera vez se le asigna un código único.
    async miPerfil() {
      const u = auth.currentUser;
      const p = await val(`revelar_maestros/${u.uid}`);
      if (p?.codigo) return p;
      for (let intento = 0; intento < 8; intento++) {
        const codigo = nuevoCodigo();
        try { await db.set(ref(`revelar_codigos/${codigo}`), u.uid); }
        catch { continue; }                      // ya existe: probar otro
        const perfil = { codigo, nombre: String(u.displayName || u.email || "").slice(0, 80), creado: Date.now() };
        await db.set(ref(`revelar_maestros/${u.uid}`), perfil);
        return perfil;
      }
      throw new Error("No se pudo crear tu código");
    },
    // Datos que ve el administrador: cuántas lecciones y última actividad.
    actualizarPerfil(datos) {
      const u = auth.currentUser;
      return db.update(ref(`revelar_maestros/${u.uid}`), {
        nombre: String(u.displayName || u.email || "").slice(0, 80),
        correo: String(u.email || "").slice(0, 120),
        activo: Date.now(), ...datos,
      });
    },
    onBloqueado(cb) {
      return db.onValue(ref(`revelar_bloqueados/${uid()}`), (s) => cb(s.val() === true), () => cb(false));
    },
    // Ubicación aproximada que el maestro decide compartir con el administrador.
    // Mapa de maestros: cada uno decide compartir su ciudad (aprox.); lo ven los maestros.
    guardarUbicacion: (u) => db.set(ref(`revelar_mapa/${uid()}`), {
      ...u, nombre: String(auth.currentUser?.displayName || "").slice(0, 80),
    }),
    quitarUbicacion: () => db.remove(ref(`revelar_mapa/${uid()}`)),
    // Uso principal de la app (iglesia u otro): en el perfil y, si compartes, en el mapa.
    async guardarUso(uso) {
      await db.set(ref(`revelar_maestros/${uid()}/uso`), uso);
      const enMapa = await val(`revelar_mapa/${uid()}`);
      if (enMapa) await db.set(ref(`revelar_mapa/${uid()}/uso`), uso);
    },
    onMapa(cb) { return db.onValue(ref("revelar_mapa"), (s) => cb(s.val() || {}), () => cb({})); },
    esAdmin: () => uid() === PRESENTADOR_ORIGINAL,
    // Administrador: todos los maestros y quién está bloqueado
    onMaestros(cb, onError) {
      return db.onValue(ref("revelar_maestros"), (s) => cb(s.val() || {}), onError);
    },
    onBloqueados(cb) {
      return db.onValue(ref("revelar_bloqueados"), (s) => cb(s.val() || {}), () => cb({}));
    },
    async bloquear(otro, codigo, si) {
      if (si) {
        await db.set(ref(`revelar_bloqueados/${otro}`), true);
        if (codigo) await db.remove(ref(`revelar_vivo/${codigo}`));   // sus alumnos dejan de ver su clase
      } else {
        await db.remove(ref(`revelar_bloqueados/${otro}`));
      }
    },
    onLecciones(cb, onError) {
      return db.onValue(ref(`revelar_lecciones/${uid()}`), (s) => cb(s.val() || {}), onError);
    },
    onLeccion(id, cb, onError) {
      return db.onValue(ref(`revelar_lecciones/${uid()}/${id}`), (s) => cb(s.val()), onError);
    },
    guardarLeccion: (id, datos) => db.update(ref(`revelar_lecciones/${uid()}/${id}`), datos),
    async crearLeccion(id, ficha) {
      await db.set(ref(`revelar_duenos/${id}`), uid());
      await db.set(ref(`revelar_lecciones/${uid()}/${id}`), ficha);
    },
    // Lección en vivo: del maestro (?p=código) o la original (sin código).
    async leerActual(codigo) { return (await val(codigo ? `revelar_vivo/${codigo}` : "revelar_actual")) || null; },
    onActual(codigo, cb) {
      return db.onValue(ref(codigo ? `revelar_vivo/${codigo}` : "revelar_actual"), (s) => cb(s.val() || null), () => cb(null));
    },
    async ponerActual(sesion, codigo) {
      if (codigo) await db.set(ref(`revelar_vivo/${codigo}`), sesion);
      if (uid() === PRESENTADOR_ORIGINAL) await db.set(ref("revelar_actual"), sesion);
    },
    // Copia orden, escrituras, fotos subidas y notas a una lección nueva (sin lo revelado).
    async duplicar(origen, destino, ficha) {
      await db.set(ref(`revelar_duenos/${destino}`), uid());
      const notas = await val(`revelar_privado/${origen}/notas`);
      await copiarContenido(origen, destino, {
        [`revelar_privado/${destino}/notas`]: notas,
        [`revelar_lecciones/${uid()}/${destino}`]: ficha,
      });
    },
    // Enviar una copia (sin notas) a otro maestro, por su código.
    // Las notas son privadas: si las incluyes, viajan dentro del envío
    // (solo el maestro que lo recibe puede leer su buzón).
    async enviarCopia(codigo, origen, titulo, conNotas) {
      const destino = await val(`revelar_codigos/${limpiarCodigo(codigo)}`);
      if (!destino) { const e = new Error("codigo"); e.code = "codigo"; throw e; }
      const u = auth.currentUser;
      const notas = conNotas ? await val(`revelar_privado/${origen}/notas`) : null;
      await db.push(ref(`revelar_buzon/${destino}`), {
        deUid: u.uid, deNombre: String(u.displayName || u.email || "").slice(0, 80),
        origen, titulo: String(titulo || "").slice(0, 80), creado: Date.now(),
        ...(notas ? { notas } : {}),
      });
    },
    onBuzon(cb) {
      return db.onValue(ref(`revelar_buzon/${uid()}`), (s) => cb(s.val() || {}), () => cb({}));
    },
    async aceptarCopia(envio, datos, destino) {
      await db.set(ref(`revelar_duenos/${destino}`), uid());
      const ahora = Date.now();
      await copiarContenido(datos.origen, destino, {
        [`revelar_lecciones/${uid()}/${destino}`]: { titulo: datos.titulo || "", creada: ahora, editada: ahora },
        [`revelar_privado/${destino}/notas`]: datos.notas || null,
        [`revelar_buzon/${uid()}/${envio}`]: null,
      });
    },
    descartarCopia: (envio) => db.remove(ref(`revelar_buzon/${uid()}/${envio}`)),
  };
}

async function storeFirebase(sesion) {
  const { db, d } = await firebase();
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
    if (!auth) ({ authMod, auth } = await firebaseAuth());
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
function catalogoDemo() {
  const CL = "revelar-demo:lecciones", CA = "revelar-demo:actual", CB = "revelar-demo:buzon";
  const oyentes = new Set(), oyentesActual = new Set(), oyentesBuzon = new Set(), oyentesBloq = new Set(), oyentesMapa = new Set();
  const leerJ = (k) => { try { return JSON.parse(localStorage.getItem(k)) || {}; } catch { return {}; } };
  const leer = () => leerJ(CL);
  const escribir = (v) => { try { localStorage.setItem(CL, JSON.stringify(v)); } catch {} oyentes.forEach((cb) => cb(v)); };
  const buzon = () => leerJ(CB);
  const escribirBuzon = (v) => { try { localStorage.setItem(CB, JSON.stringify(v)); } catch {} oyentesBuzon.forEach((cb) => cb(v)); };
  const actual = () => { try { return localStorage.getItem(CA) || null; } catch { return null; } };
  window.addEventListener("storage", (e) => {
    if (e.key === CL) oyentes.forEach((cb) => cb(leer()));
    if (e.key === CA) oyentesActual.forEach((cb) => cb(actual()));
    if (e.key === CB) oyentesBuzon.forEach((cb) => cb(buzon()));
  });
  const copiar = (origen, destino, conNotas) => {
    for (const k of ["orden", "escrituras", "subidas", ...(conNotas ? ["notas"] : [])]) {
      const val = localStorage.getItem(`revelar-demo:${origen}:${k}`);
      if (val != null) localStorage.setItem(`revelar-demo:${destino}:${k}`, val);
    }
  };
  return {
    modo: "demo",
    uid: () => "demo",
    onUsuario(cb) { cb({ uid: "demo", displayName: "Demo" }); return () => {}; },
    async entrar() {},
    async miPerfil() { let uso = null; try { uso = localStorage.getItem("revelar-demo:uso"); } catch {} return { codigo: "demo", nombre: "Demo", ...(uso ? { uso } : {}) }; },
    async actualizarPerfil() {},
    async guardarUbicacion(u) { try { localStorage.setItem("revelar-demo:ubicacion", JSON.stringify({ ...u, nombre: "Demo" })); } catch {} oyentesMapa.forEach((f) => f()); },
    async quitarUbicacion() { try { localStorage.removeItem("revelar-demo:ubicacion"); } catch {} oyentesMapa.forEach((f) => f()); },
    async guardarUso(uso) {
      try { localStorage.setItem("revelar-demo:uso", uso); } catch {}
      const yo = leerJ("revelar-demo:ubicacion");
      if (yo.lat != null) { yo.uso = uso; try { localStorage.setItem("revelar-demo:ubicacion", JSON.stringify(yo)); } catch {} }
      oyentesMapa.forEach((f) => f());
    },
    onMapa(cb) {
      const f = () => {
        const yo = leerJ("revelar-demo:ubicacion");
        cb({
          m2: { lat: 25.7, lng: -100.3, ciudad: "Monterrey", nombre: "Ana López", uso: "otro" },
          m3: { lat: 4.7, lng: -74.1, ciudad: "Bogotá", nombre: "Pastor Juan", uso: "iglesia" },
          ...(yo.lat != null ? { demo: yo } : {}),
        });
      };
      oyentesMapa.add(f); f();
      return () => oyentesMapa.delete(f);
    },
    onBloqueado(cb) { cb(false); return () => {}; },
    esAdmin: () => true,
    onMaestros(cb) {
      const ahora = Date.now();
      cb({
        demo: { codigo: "demo", nombre: "Demo (tú)", correo: "demo@ejemplo.com", lecciones: Object.keys(leer()).length, activo: ahora, creado: ahora },
        m2: { codigo: "k7m2", nombre: "Ana López", correo: "ana@ejemplo.com", lecciones: 4, activo: ahora - 86400000 * 2, creado: ahora - 86400000 * 9 },
        m3: { codigo: "p4qx", nombre: "Pastor Juan", correo: "juan@ejemplo.com", lecciones: 1, activo: ahora - 86400000 * 30, creado: ahora - 86400000 * 40 },
      });
      return () => {};
    },
    onBloqueados(cb) { const f = () => cb(leerJ("revelar-demo:bloqueados")); oyentesBloq.add(f); f(); return () => oyentesBloq.delete(f); },
    async bloquear(otro, codigo, si) {
      const v = leerJ("revelar-demo:bloqueados");
      if (si) v[otro] = true; else delete v[otro];
      try { localStorage.setItem("revelar-demo:bloqueados", JSON.stringify(v)); } catch {}
      oyentesBloq.forEach((f) => f());
    },
    onLecciones(cb) { oyentes.add(cb); cb(leer()); return () => oyentes.delete(cb); },
    onLeccion(id, cb) { const f = (v) => cb(v[id] || null); oyentes.add(f); f(leer()); return () => oyentes.delete(f); },
    async guardarLeccion(id, datos) {
      const v = leer(); v[id] = { ...(v[id] || {}), ...datos };
      Object.keys(v[id]).forEach((k) => v[id][k] == null && delete v[id][k]);
      escribir(v);
    },
    async crearLeccion(id, ficha) { const v = leer(); v[id] = ficha; escribir(v); },
    async leerActual() { return actual(); },
    onActual(codigo, cb) { oyentesActual.add(cb); cb(actual()); return () => oyentesActual.delete(cb); },
    async ponerActual(sesion) { try { localStorage.setItem(CA, sesion); } catch {} oyentesActual.forEach((cb) => cb(sesion)); },
    async duplicar(origen, destino, ficha) { copiar(origen, destino, true); const v = leer(); v[destino] = ficha; escribir(v); },
    async enviarCopia(codigo, origen, titulo, conNotas) {
      if (limpiarCodigo(codigo) !== "demo") { const e = new Error("codigo"); e.code = "codigo"; throw e; }
      const notas = conNotas ? leerJ(`revelar-demo:${origen}:notas`) : null;
      const b = buzon(); b["env" + Date.now().toString(36)] = { deUid: "demo", deNombre: "Demo", origen, titulo, creado: Date.now(), ...(notas && Object.keys(notas).length ? { notas } : {}) };
      escribirBuzon(b);
    },
    onBuzon(cb) { oyentesBuzon.add(cb); cb(buzon()); return () => oyentesBuzon.delete(cb); },
    async aceptarCopia(envio, datos, destino) {
      copiar(datos.origen, destino, false);
      if (datos.notas) try { localStorage.setItem(`revelar-demo:${destino}:notas`, JSON.stringify(datos.notas)); } catch {}
      const v = leer(); v[destino] = { titulo: datos.titulo, creada: Date.now(), editada: Date.now() }; escribir(v);
      const b = buzon(); delete b[envio]; escribirBuzon(b);
    },
    async descartarCopia(envio) { const b = buzon(); delete b[envio]; escribirBuzon(b); },
  };
}

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
