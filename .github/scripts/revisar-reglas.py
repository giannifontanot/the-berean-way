#!/usr/bin/env python3
"""Revisa revelar/database.rules.json antes de publicarlo en Firebase.

Varios maestros: cada lección tiene dueño (revelar_duenos) y cada maestro
solo lee y escribe lo suyo. Bloquea la publicación si:
  - el archivo no es JSON válido o no tiene "rules";
  - hay .read o .write en la raíz (abriría todo);
  - alguna regla .write no exige una cuenta (auth != null y auth.uid),
    salvo la presencia de participantes;
  - alguna regla .read es pública fuera de los lugares permitidos;
  - lo privado (notas, listas de lecciones, perfiles, buzón) no exige al dueño;
  - lo que escribe en una lección no comprueba al dueño de esa lección.
"""
import json
import sys

ARCHIVO = sys.argv[1] if len(sys.argv) > 1 else "revelar/database.rules.json"

ESCRITURA_PUBLICA = {"rules/revelar/$sesion/presencia/$conexion"}
LECTURA_PUBLICA = {"rules/revelar/$sesion", "rules/revelar_vivo/$codigo", "rules/revelar_actual"}
DUENO = "root.child('revelar_duenos/' + $sesion).val() === auth.uid"
YO = "auth.uid === $uid"

# Ruta → (clave, texto que debe contener)
OBLIGATORIAS = [
    ("rules/revelar/$sesion/reveladas", ".write", DUENO),
    ("rules/revelar/$sesion/orden", ".write", DUENO),
    ("rules/revelar/$sesion/escrituras", ".write", DUENO),
    ("rules/revelar/$sesion/subidas", ".write", DUENO),
    ("rules/revelar_privado/$sesion", ".read", DUENO),
    ("rules/revelar_privado/$sesion", ".write", DUENO),
    ("rules/revelar_lecciones/$uid", ".read", YO),
    ("rules/revelar_lecciones/$uid", ".write", YO),
    ("rules/revelar_maestros/$uid", ".read", YO),
    ("rules/revelar_maestros/$uid", ".write", YO),
    ("rules/revelar_buzon/$uid", ".read", YO),
    ("rules/revelar_vivo/$codigo", ".write", "root.child('revelar_codigos/' + $codigo).val() === auth.uid"),
    ("rules/revelar_duenos/$sesion", ".write", "!data.exists() && newData.val() === auth.uid"),
    ("rules/revelar_codigos/$codigo", ".write", "!data.exists() && newData.val() === auth.uid"),
]

errores = []


def error(msg):
    errores.append(msg)


try:
    with open(ARCHIVO, encoding="utf-8") as f:
        datos = json.load(f)
except Exception as e:  # noqa: BLE001
    print(f"::error::Reglas: {ARCHIVO} no es JSON válido ({e})")
    sys.exit(1)

if not isinstance(datos, dict) or not isinstance(datos.get("rules"), dict):
    print('::error::Reglas: falta el objeto "rules"')
    sys.exit(1)


def con_cuenta(valor):
    return isinstance(valor, str) and "auth != null" in valor and "auth.uid" in valor


def recorrer(nodo, ruta):
    if not isinstance(nodo, dict):
        return
    for clave, valor in nodo.items():
        if clave == ".write":
            if ruta in ESCRITURA_PUBLICA:
                if valor is not True:
                    error(f"{ruta}: .write inesperado ({valor!r})")
            elif not con_cuenta(valor):
                error(f"{ruta}: .write no exige una cuenta ({valor!r})")
        elif clave == ".read":
            if ruta in LECTURA_PUBLICA:
                continue
            if valor is True or not (isinstance(valor, str) and "auth != null" in valor):
                error(f"{ruta}: .read es público ({valor!r})")
        elif not clave.startswith("."):
            recorrer(valor, f"{ruta}/{clave}")


for k in (".read", ".write"):
    if k in datos["rules"]:
        error(f"rules: no se permite {k} en la raíz")

recorrer(datos["rules"], "rules")

for ruta, clave, texto in OBLIGATORIAS:
    nodo = datos
    for parte in ruta.split("/"):
        nodo = nodo.get(parte) if isinstance(nodo, dict) else None
    valor = nodo.get(clave) if isinstance(nodo, dict) else None
    if not (isinstance(valor, str) and texto in valor and "auth != null" in valor):
        error(f"{ruta}: {clave} debe exigir «{texto}»")

if errores:
    for e in errores:
        print(f"::error::Reglas: {e}")
    print(f"Reglas NO publicadas: {len(errores)} problema(s).")
    sys.exit(1)

print("Reglas revisadas: todo bien.")
