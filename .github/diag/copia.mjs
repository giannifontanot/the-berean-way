// Reproduce «Aceptar copia» como un usuario de prueba (no Carlet) contra la base real, y limpia al final.
import fs from "node:fs";
import admin from "firebase-admin";
import { initializeApp } from "firebase/app";
import { getAuth, signInWithCustomToken } from "firebase/auth";
import { getDatabase, ref, get, set, update } from "firebase/database";
const llave = JSON.parse(fs.readFileSync(process.env.GOOGLE_APPLICATION_CREDENTIALS, "utf8"));
const URL_DB = "https://berean-revelar-default-rtdb.firebaseio.com";
admin.initializeApp({ credential: admin.credential.cert(llave), databaseURL: URL_DB });
const UID = "prueba-copia-claude", DEST = "rprueba-claude";
const L = [];
const t0 = Date.now();
const log = (m) => { const s = `${((Date.now() - t0) / 1000).toFixed(1)}s ${m}`; console.log(s); L.push(s); };
const conLimite = (p, ms, que) => Promise.race([p, new Promise((_, no) => setTimeout(() => no(new Error("TIMEOUT " + que)), ms))]);
try {
  const token = await admin.auth().createCustomToken(UID);
  const app = initializeApp({ apiKey: "AIzaSyD5niU5Ao5jtlvQZAxYgcYMRpvmfot_nMI", authDomain: "berean-revelar.firebaseapp.com", databaseURL: URL_DB, projectId: "berean-revelar" });
  await signInWithCustomToken(getAuth(app), token); log("sesión");
  const d = getDatabase(app);
  const val = async (r) => (await conLimite(get(ref(d, r)), 60000, "get " + r)).val();
  await conLimite(set(ref(d, `revelar_duenos/${DEST}`), UID), 30000, "dueño"); log("dueño ok");
  const orden = await val("revelar/clase/orden"); log("orden " + JSON.stringify(orden)?.length);
  const esc = await val("revelar/clase/escrituras"); log("escrituras " + Object.keys(esc || {}).length);
  const sub = await val("revelar/clase/subidas"); log("subidas " + Object.keys(sub || {}).length);
  await conLimite(update(ref(d), { [`revelar/${DEST}/orden`]: orden, [`revelar/${DEST}/escrituras`]: esc }), 60000, "update orden"); log("orden+escrituras escritas");
  for (const [k, f] of Object.entries(sub || {})) { await conLimite(set(ref(d, `revelar/${DEST}/subidas/${k}`), f), 60000, "foto " + k); log("foto " + k); }
  await conLimite(update(ref(d), { [`revelar_lecciones/${UID}/${DEST}`]: { titulo: "prueba", creada: 1, editada: 1 }, [`revelar_privado/${DEST}/notas`]: { "foto-01": "x" } }), 30000, "final"); log("final ok");
} catch (e) { log("ERROR " + (e.code || "") + " " + e.message); }
finally {
  const db = admin.database();
  await db.ref().update({ [`revelar/${DEST}`]: null, [`revelar_duenos/${DEST}`]: null, [`revelar_lecciones/${UID}`]: null, [`revelar_privado/${DEST}`]: null, [`revelar_maestros/${UID}`]: null });
  try { await admin.auth().deleteUser(UID); } catch {}
  log("limpio");
  console.log("::notice::" + L.join(" || "));
  process.exit(0);
}
