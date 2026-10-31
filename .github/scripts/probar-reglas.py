#!/usr/bin/env python3
"""Prueba las reglas de revelar/database.rules.json contra el emulador de
Realtime Database (firebase emulators:exec). Cada caso dice si debe permitirse."""
import base64
import json
import sys
import time
import urllib.error
import urllib.request

NS = "demo-revelar-default-rtdb"
PROYECTO = "demo-revelar"
BASE = "http://127.0.0.1:9000"
G = "xWkkWXXR0jcHMnOGEwYjrxzxGtX2"   # presentador original
A, B = "maestraA", "maestroB"


def token(uid):
    if uid is None:
        return None
    b = lambda d: base64.urlsafe_b64encode(json.dumps(d).encode()).decode().rstrip("=")
    ahora = int(time.time())
    carga = {"sub": uid, "user_id": uid, "iat": ahora, "exp": ahora + 3600, "auth_time": ahora,
             "aud": PROYECTO, "iss": f"https://securetoken.google.com/{PROYECTO}",
             "firebase": {"sign_in_provider": "google.com", "identities": {}}}
    return b({"alg": "none", "type": "JWT"}) + "." + b(carga) + "."


def pedir(metodo, ruta, uid=None, datos=None):
    # Como un usuario con sesión: el ID token va en ?auth= (Bearer sería acceso de administrador)
    t = token(uid)
    url = f"{BASE}/{ruta}.json?ns={NS}" + (f"&auth={t}" if t else "")
    cuerpo = None if datos is None else json.dumps(datos).encode()
    req = urllib.request.Request(url, data=cuerpo, method=metodo)
    try:
        with urllib.request.urlopen(req) as r:
            return r.status
    except urllib.error.HTTPError as e:
        return e.code


fallas = []
total = 0


def caso(nombre, debe, metodo, ruta, uid=None, datos=None):
    global total
    total += 1
    st = pedir(metodo, ruta, uid, datos)
    ok = (st == 200) == debe
    print(("OK   " if ok else "FALLA") + f" {nombre}: {metodo} {ruta} como {uid} → {st} (debía {'permitir' if debe else 'negar'})")
    if not ok:
        fallas.append(nombre)


SI, NO = True, False
caso("A reclama su lección", SI, "PUT", "revelar_duenos/s1", A, A)
caso("B no roba la lección de A", NO, "PUT", "revelar_duenos/s1", B, B)
caso("B no reclama a nombre de A", NO, "PUT", "revelar_duenos/s9", B, A)
caso("A escribe el orden", SI, "PUT", "revelar/s1/orden", A, ["esc_1"])
caso("B no escribe el orden de A", NO, "PUT", "revelar/s1/orden", B, ["x"])
caso("Anónimo no escribe", NO, "PUT", "revelar/s1/orden", None, ["x"])
caso("A revela", SI, "PUT", "revelar/s1/reveladas/esc_1", A, 123)
caso("B no revela en la de A", NO, "PUT", "revelar/s1/reveladas/esc_1", B, 456)
caso("A guarda escritura", SI, "PUT", "revelar/s1/escrituras/esc_1", A, {"texto": "Juan 1:14", "cita": "Juan 1:14"})
caso("B no cambia la escritura de A", NO, "PUT", "revelar/s1/escrituras/esc_1", B, {"texto": "x"})
caso("A sube foto", SI, "PUT", "revelar/s1/subidas/sub_1", A, {"src": "data:image/jpeg;base64,AAAA", "creado": 1})
caso("Participante lee la lección", SI, "GET", "revelar/s1", None)
caso("Participante marca presencia", SI, "PUT", "revelar/s1/presencia/c1", None, True)
caso("A escribe sus notas", SI, "PUT", "revelar_privado/s1/notas/esc_1", A, "nota")
caso("A lee sus notas", SI, "GET", "revelar_privado/s1", A)
caso("B no lee las notas de A", NO, "GET", "revelar_privado/s1", B)
caso("Anónimo no lee notas", NO, "GET", "revelar_privado/s1", None)
caso("Anónimo no lee notas sin compartir", NO, "GET", "revelar_privado/s1/notas", None)
caso("B no comparte la lección de A", NO, "PUT", "revelar_compartidas/s1", B, {"titulo": "x", "desde": 1})
caso("Compartida con campo extra", NO, "PUT", "revelar_compartidas/s1", A, {"titulo": "x", "otro": 1})
caso("A comparte su lección", SI, "PUT", "revelar_compartidas/s1", A, {"titulo": "La tienda", "desde": 1})
caso("Cualquiera ve que está compartida", SI, "GET", "revelar_compartidas/s1", None)
caso("Con el enlace se leen las notas", SI, "GET", "revelar_privado/s1/notas", None)
caso("Con el enlace no se lee todo lo privado", NO, "GET", "revelar_privado/s1", None)
caso("Con el enlace nadie escribe notas", NO, "PUT", "revelar_privado/s1/notas/esc_1", B, "x")
caso("B no deja de compartir la de A", NO, "DELETE", "revelar_compartidas/s1", B)
caso("A deja de compartir", SI, "DELETE", "revelar_compartidas/s1", A)
caso("Ya sin compartir no se leen las notas", NO, "GET", "revelar_privado/s1/notas", None)
caso("A guarda su lista", SI, "PUT", "revelar_lecciones/" + A + "/s1", A, {"titulo": "La tienda", "creada": 1})
caso("A guarda un borrador con ideas", SI, "PUT", "revelar_lecciones/" + A + "/b1", A, {"titulo": "Borrador", "creada": 1, "editada": 1, "borrador": True, "ideas": ["Idea uno", "Idea dos"]})
caso("A ordena su lista", SI, "PATCH", "revelar_lecciones/" + A, A, {"s1/pos": 1, "b1/pos": 0})
caso("Posición no numérica", NO, "PATCH", "revelar_lecciones/" + A, A, {"s1/pos": "arriba"})
caso("Idea demasiado larga", NO, "PUT", "revelar_lecciones/" + A + "/b2", A, {"titulo": "x", "borrador": True, "ideas": ["a" * 501]})
caso("Borrador no booleano", NO, "PUT", "revelar_lecciones/" + A + "/b3", A, {"titulo": "x", "borrador": "si"})
caso("B no lee la lista de A", NO, "GET", "revelar_lecciones/" + A, B)
caso("B no escribe en la lista de A", NO, "PUT", "revelar_lecciones/" + A + "/x", B, {"titulo": "x"})
caso("A guarda su perfil", SI, "PUT", "revelar_maestros/" + A, A, {"codigo": "abcd", "nombre": "A", "creado": 1})
caso("B no lee el perfil de A", NO, "GET", "revelar_maestros/" + A, B)
caso("A guarda un contacto", SI, "PUT", "revelar_maestros/" + A + "/contactos/bbbb", A, "Pastor B")
caso("Contacto con código inválido", NO, "PUT", "revelar_maestros/" + A + "/contactos/XX", A, "x")
caso("B no cambia los contactos de A", NO, "PUT", "revelar_maestros/" + A + "/contactos/cccc", B, "x")
caso("A reclama código", SI, "PUT", "revelar_codigos/abcd", A, A)
caso("B no roba el código", NO, "PUT", "revelar_codigos/abcd", B, B)
caso("Código inválido", NO, "PUT", "revelar_codigos/AB", B, B)
caso("A pone su lección en vivo", SI, "PUT", "revelar_vivo/abcd", A, "s1")
caso("B no cambia el en vivo de A", NO, "PUT", "revelar_vivo/abcd", B, "s2")
caso("Participante lee el en vivo", SI, "GET", "revelar_vivo/abcd", None)
caso("B envía copia a A", SI, "PUT", "revelar_buzon/" + A + "/e1", B, {"deUid": B, "deNombre": "B", "origen": "s1", "titulo": "T", "creado": 1})
caso("B envía copia con notas", SI, "PUT", "revelar_buzon/" + A + "/e3", B, {"deUid": B, "deNombre": "B", "origen": "s1", "titulo": "T", "creado": 1, "notas": {"esc_1": "nota de B"}})
caso("A guarda las notas recibidas en su lección", SI, "PUT", "revelar_privado/s1/notas/esc_9", A, "nota de B")
caso("Nota recibida demasiado larga", NO, "PUT", "revelar_buzon/" + A + "/e4", B, {"deUid": B, "origen": "s1", "titulo": "T", "notas": {"x": "a" * 4001}})
caso("B envía un borrador con ideas", SI, "PUT", "revelar_buzon/" + A + "/e5", B, {"deUid": B, "deNombre": "B", "origen": "b9", "titulo": "Borrador", "creado": 1, "borrador": True, "ideas": ["Idea uno", "Idea dos"]})
caso("Borrador con idea demasiado larga", NO, "PUT", "revelar_buzon/" + A + "/e6", B, {"deUid": B, "origen": "b9", "titulo": "T", "borrador": True, "ideas": ["a" * 501]})
caso("B no envía a nombre de otro", NO, "PUT", "revelar_buzon/" + A + "/e2", B, {"deUid": G, "origen": "s1", "titulo": "T"})
caso("B no lee el buzón de A", NO, "GET", "revelar_buzon/" + A, B)
caso("A lee su buzón", SI, "GET", "revelar_buzon/" + A, A)
caso("B no borra del buzón de A", NO, "DELETE", "revelar_buzon/" + A + "/e1", B)
caso("A borra de su buzón", SI, "DELETE", "revelar_buzon/" + A + "/e1", A)
caso("A no cambia el enlace original", NO, "PUT", "revelar_actual", A, "s1")
caso("El presentador original sí", SI, "PUT", "revelar_actual", G, "s1")
caso("Nadie escribe en la raíz", NO, "PATCH", "", A, {"x": 1})
caso("A no escribe en lección sin reclamar", NO, "PATCH", "", A, {"revelar/s2/orden": ["x"]})

# Administración de maestros
caso("B guarda su perfil", SI, "PUT", "revelar_maestros/" + B, B, {"codigo": "bbbb", "nombre": "B", "creado": 1, "lecciones": 0, "activo": 1, "correo": "b@x.com"})
caso("B reclama su código", SI, "PUT", "revelar_codigos/bbbb", B, B)
caso("B reclama su lección", SI, "PUT", "revelar_duenos/sb", B, B)
caso("B pone su clase en vivo", SI, "PUT", "revelar_vivo/bbbb", B, "sb")
caso("El administrador ve a todos los maestros", SI, "GET", "revelar_maestros", G)
caso("A no ve a todos los maestros", NO, "GET", "revelar_maestros", A)
caso("A no bloquea a B", NO, "PUT", "revelar_bloqueados/" + B, A, True)
caso("B no se bloquea solo... ni nada", NO, "PUT", "revelar_bloqueados/" + A, B, True)
caso("El administrador bloquea a B", SI, "PUT", "revelar_bloqueados/" + B, G, True)
caso("B ve que está bloqueado", SI, "GET", "revelar_bloqueados/" + B, B)
caso("A no ve los bloqueos de B", NO, "GET", "revelar_bloqueados/" + B, A)
caso("B bloqueado no se desbloquea", NO, "DELETE", "revelar_bloqueados/" + B, B)
caso("B bloqueado no revela", NO, "PUT", "revelar/sb/reveladas/x", B, 1)
caso("B bloqueado no crea lecciones", NO, "PUT", "revelar_duenos/sc", B, B)
caso("B bloqueado no cambia su lista", NO, "PUT", "revelar_lecciones/" + B + "/sb", B, {"titulo": "x"})
caso("B bloqueado no pone en vivo", NO, "PUT", "revelar_vivo/bbbb", B, "sb")
caso("B bloqueado no envía copias", NO, "PUT", "revelar_buzon/" + A + "/e9", B, {"deUid": B, "origen": "sb", "titulo": "T"})
caso("El administrador quita el en vivo de B", SI, "DELETE", "revelar_vivo/bbbb", G)
caso("El administrador desbloquea a B", SI, "DELETE", "revelar_bloqueados/" + B, G)
caso("B desbloqueado revela otra vez", SI, "PUT", "revelar/sb/reveladas/x", B, 1)

# Mapa de maestros (cada uno decide compartir su ciudad; lo ven los maestros con sesión)
caso("B comparte su ciudad", SI, "PUT", "revelar_mapa/" + B, B, {"lat": 29.8, "lng": -95.4, "ciudad": "Houston", "nombre": "B", "fecha": 1})
caso("A ve el mapa", SI, "GET", "revelar_mapa", A)
caso("Anónimo no ve el mapa", NO, "GET", "revelar_mapa", None)
caso("Latitud imposible", NO, "PUT", "revelar_mapa/" + B, B, {"lat": 120, "lng": 0})
caso("Campo extra no permitido", NO, "PUT", "revelar_mapa/" + B, B, {"lat": 1, "lng": 1, "correo": "x@y.z"})
caso("A no cambia la ubicación de B", NO, "PUT", "revelar_mapa/" + B, A, {"lat": 1, "lng": 1})
caso("B marca su uso: iglesia", SI, "PUT", "revelar_maestros/" + B + "/uso", B, "iglesia")
caso("Uso inválido", NO, "PUT", "revelar_maestros/" + B + "/uso", B, "fiesta")
caso("B aparece en el mapa como 'otro'", SI, "PUT", "revelar_mapa/" + B, B, {"lat": 1, "lng": 1, "uso": "otro"})
caso("B deja de compartir", SI, "DELETE", "revelar_mapa/" + B, B)

# Aceptar una copia con datos reales (la lección pública «clase»), igual que el app:
# (1) reclama la lección nueva, (2) copia todo en una sola escritura.
try:
    real = json.load(urllib.request.urlopen("https://berean-revelar-default-rtdb.firebaseio.com/revelar/clase.json"))
except Exception as e:  # noqa: BLE001
    real = None
    print("Sin datos reales:", e)
if real:
    caso("B reclama la copia", SI, "PUT", "revelar_duenos/c1", B, B)
    claves = ["esc_P51pW1_HtQizptLF4Ur", "foto-01", "foto-02", "sub_foto01"]
    paquete = {
        "revelar/c1/orden": real.get("orden"),
        "revelar/c1/escrituras": real.get("escrituras"),
        "revelar/c1/subidas": real.get("subidas"),
        "revelar_lecciones/" + B + "/c1": {"titulo": "El tabernáculo de Juan", "creada": 1, "editada": 1},
        "revelar_privado/c1/notas": {k: "nota" for k in claves},
        "revelar_buzon/" + B + "/e9": None,
    }
    for k, v in paquete.items():
        caso("parte " + k, SI, "PATCH", "", B, {k: v})
    caso("B reclama otra copia", SI, "PUT", "revelar_duenos/c2", B, B)
    caso("B acepta la copia (todo junto)", SI, "PATCH", "", B, {k.replace("/c1", "/c2"): v for k, v in paquete.items()})

print(f"\n{total - len(fallas)} de {total} casos correctos")
if fallas:
    print("::error::Reglas que fallaron (" + str(len(fallas)) + "): " + " | ".join(fallas))
if not fallas:
    print(f"::notice::Reglas probadas: {total} de {total} casos correctos")
sys.exit(1 if fallas else 0)
