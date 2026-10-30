#!/usr/bin/env python3
"""Revisa revelar/database.rules.json antes de publicarlo en Firebase.

Bloquea la publicación si:
  - el archivo no es JSON válido o no tiene "rules";
  - no aparece el UID del presentador;
  - alguna regla .write no exige el UID (salvo la presencia de participantes);
  - alguna regla .read es pública fuera de los lugares permitidos;
  - faltan reglas en las rutas que deben estar protegidas.
"""
import json
import sys

UID = "xWkkWXXR0jcHMnOGEwYjrxzxGtX2"
ARCHIVO = sys.argv[1] if len(sys.argv) > 1 else "revelar/database.rules.json"

# Únicos lugares donde se permite algo público (ruta con comodines tal cual)
ESCRITURA_PUBLICA = {"rules/revelar/$sesion/presencia/$conexion"}
LECTURA_PUBLICA = {"rules/revelar/$sesion", "rules/revelar_actual"}
# Rutas que deben existir y exigir el UID para leer
LECTURA_PRIVADA = {"rules/revelar_privado/$sesion", "rules/revelar_lecciones"}

errores = []


def error(msg):
    errores.append(msg)


try:
    with open(ARCHIVO, encoding="utf-8") as f:
        texto = f.read()
    datos = json.loads(texto)
except Exception as e:  # noqa: BLE001
    print(f"::error::Reglas: {ARCHIVO} no es JSON válido ({e})")
    sys.exit(1)

if not isinstance(datos, dict) or not isinstance(datos.get("rules"), dict):
    print('::error::Reglas: falta el objeto "rules"')
    sys.exit(1)

if UID not in texto:
    error("no aparece el UID del presentador")


def exige_uid(valor):
    return isinstance(valor, str) and f"auth.uid === '{UID}'" in valor and "auth != null" in valor


def recorrer(nodo, ruta):
    if not isinstance(nodo, dict):
        return
    for clave, valor in nodo.items():
        aqui = f"{ruta}/{clave}"
        if clave == ".write":
            if ruta in ESCRITURA_PUBLICA:
                if valor is not True:
                    error(f"{ruta}: .write inesperado ({valor!r})")
            elif not exige_uid(valor):
                error(f"{ruta}: .write no exige el UID del presentador ({valor!r})")
        elif clave == ".read":
            if ruta in LECTURA_PUBLICA:
                pass
            elif not exige_uid(valor):
                error(f"{ruta}: .read es público o no exige el UID ({valor!r})")
        elif not clave.startswith("."):
            recorrer(valor, aqui)


recorrer(datos["rules"], "rules")

# Rutas privadas: deben existir y exigir el UID para leer
for ruta in LECTURA_PRIVADA:
    nodo = datos
    for parte in ruta.split("/"):
        nodo = nodo.get(parte) if isinstance(nodo, dict) else None
    if not isinstance(nodo, dict) or not exige_uid(nodo.get(".read")):
        error(f"{ruta}: debe existir y exigir el UID para leer")

# Ninguna regla en la raíz (abriría todo)
for k in (".read", ".write"):
    if k in datos["rules"]:
        error(f"rules: no se permite {k} en la raíz")

if errores:
    for e in errores:
        print(f"::error::Reglas: {e}")
    print(f"Reglas NO publicadas: {len(errores)} problema(s).")
    sys.exit(1)

print("Reglas revisadas: todo bien.")
