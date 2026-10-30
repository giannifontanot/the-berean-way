#!/usr/bin/env python3
"""Una sola vez: pasa los datos de un maestro a la estructura de varios maestros.

- revelar_duenos/<sesion> = UID del presentador original, para cada lección que ya existe.
- revelar_lecciones/<id> (lista vieja, sin dueño) → revelar_lecciones/<UID>/<id>.
Se puede correr varias veces: lo que ya está migrado no se toca.
Uso: migrar-maestros.py [--aplicar]   (sin --aplicar solo muestra el plan)
"""
import json
import subprocess
import sys
import tempfile

UID = "xWkkWXXR0jcHMnOGEwYjrxzxGtX2"
PROYECTO = "berean-revelar"
CLI = ["npx", "--yes", "firebase-tools@15"]


def obtener(ruta, superficial=False):
    cmd = CLI + ["database:get", ruta, "--project", PROYECTO] + (["--shallow"] if superficial else [])
    salida = subprocess.run(cmd, check=True, capture_output=True, text=True).stdout
    return json.loads(salida or "null")


aplicar = "--aplicar" in sys.argv
sesiones = obtener("/revelar", superficial=True) or {}
duenos = obtener("/revelar_duenos") or {}
lecciones = obtener("/revelar_lecciones") or {}

cambios = {}
# 1) Dueño de cada lección que ya existe
for s in sesiones:
    if s.startswith("sin-leccion-"):
        continue
    if s not in duenos:
        cambios[f"revelar_duenos/{s}"] = UID
# 2) Lista vieja (revelar_lecciones/<id> con título) → revelar_lecciones/<UID>/<id>
for clave, valor in lecciones.items():
    if clave == UID or not isinstance(valor, dict) or "titulo" not in valor:
        continue
    cambios[f"revelar_lecciones/{UID}/{clave}"] = valor
    cambios[f"revelar_lecciones/{clave}"] = None
    if clave not in duenos and f"revelar_duenos/{clave}" not in cambios:
        cambios[f"revelar_duenos/{clave}"] = UID

lecc = sum(1 for k, v in cambios.items() if k.startswith(f"revelar_lecciones/{UID}/"))
dues = sum(1 for k in cambios if k.startswith("revelar_duenos/"))
print(f"Plan: {lecc} lecciones a mover, {dues} dueños a registrar, {len(sesiones)} sesiones en revelar/")
for k, v in cambios.items():
    if k.startswith(f"revelar_lecciones/{UID}/"):
        print(f"  lección {k.split('/')[-1]}: {v.get('titulo')!r}")
print(f"::notice::Migración ({'aplicada' if aplicar else 'solo plan'}): {lecc} lecciones movidas, {dues} dueños registrados")

if aplicar and cambios:
    with tempfile.NamedTemporaryFile("w", suffix=".json", delete=False) as f:
        json.dump(cambios, f)
    subprocess.run(CLI + ["database:update", "/", f.name, "--project", PROYECTO, "--force"], check=True)
    # Comprobación
    nuevas = obtener(f"/revelar_lecciones/{UID}") or {}
    print(f"::notice::Comprobación: {len(nuevas)} lecciones en la lista del presentador original")
