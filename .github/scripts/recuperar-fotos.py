#!/usr/bin/env python3
"""Una sola vez: recupera las 3 láminas de fotos que vivían en el repo (foto-01..03).

Para cada lección cuyo orden todavía las menciona:
  - sube la foto como foto propia de esa lección (subidas/sub_foto0N), usando la
    imagen que la lección ya tenía si la habías cambiado, o la del repo;
  - en el orden, cambia foto-0N por sub_foto0N (mismo lugar, oculta si estaba oculta);
  - copia sus notas a la nueva lámina (las originales no se borran).
Uso: recuperar-fotos.py [--aplicar]
"""
import base64
import json
import subprocess
import sys
import tempfile

PROYECTO = "berean-revelar"
CLI = ["npx", "--yes", "firebase-tools@15"]
COMMIT = "f190dfc^"   # antes de borrar las fotos del repo
FOTOS = {
    "foto-01": "revelar/fotos/8b70b8-jesus-ensena-templo.jpg",
    "foto-02": "revelar/fotos/9e2c5b-templo-jerusalen.jpg",
    "foto-03": "revelar/fotos/500093-tabernaculo.jpg",
}


def obtener(ruta, superficial=False):
    cmd = CLI + ["database:get", ruta, "--project", PROYECTO] + (["--shallow"] if superficial else [])
    salida = subprocess.run(cmd, check=True, capture_output=True, text=True).stdout
    return json.loads(salida or "null")


def imagen_repo(ruta):
    datos = subprocess.run(["git", "show", f"{COMMIT}:{ruta}"], check=True, capture_output=True).stdout
    return "data:image/jpeg;base64," + base64.b64encode(datos).decode()


aplicar = "--aplicar" in sys.argv
sesiones = obtener("/revelar", superficial=True) or {}
# Diagnóstico: qué hay en cada lección
for s_ in sesiones:
    o = obtener(f"/revelar/{s_}/orden")
    n = obtener(f"/revelar_privado/{s_}/notas", superficial=True) or {}
    sb = obtener(f"/revelar/{s_}/subidas", superficial=True) or {}
    fn = {k: (obtener(f"/revelar_privado/{s_}/notas/{k}") or "")[:60] for k in n if "foto" in k}
    print(f"::notice::{s_}: {len(o or [])} en orden · notas de fotos del repo={fn} · subidas foto={[k for k in sb if 'foto' in k]}")
cambios, resumen = {}, []
for s in sesiones:
    orden = obtener(f"/revelar/{s}/orden")
    if not isinstance(orden, list):
        continue
    usadas = [k for k in FOTOS if any(str(x).lstrip("~") == k for x in orden)]
    if not usadas:
        continue
    notas = obtener(f"/revelar_privado/{s}/notas") or {}
    subidas = obtener(f"/revelar/{s}/subidas", superficial=True) or {}
    nuevo = []
    for x in orden:
        k = str(x).lstrip("~")
        nuevo.append(("~" if str(x).startswith("~") else "") + ("sub_" + k.replace("-", "")) if k in FOTOS else x)
    cambios[f"revelar/{s}/orden"] = nuevo
    for i, k in enumerate(usadas):
        nid = "sub_" + k.replace("-", "")
        propia = obtener(f"/revelar/{s}/subidas/{k}/src") if k in subidas else None
        cambios[f"revelar/{s}/subidas/{nid}"] = {"src": propia or imagen_repo(FOTOS[k]), "creado": 1700000000000 + i}
        if notas.get(k):
            cambios[f"revelar_privado/{s}/notas/{nid}"] = notas[k]
    resumen.append(f"{s}: {', '.join(usadas)} (notas: {sum(1 for k in usadas if notas.get(k))}, imagen cambiada: {sum(1 for k in usadas if k in subidas)})")

print("Plan:", "; ".join(resumen) or "nada que recuperar")
print(f"::notice::Recuperar fotos ({'aplicado' if aplicar else 'solo plan'}): " + ("; ".join(resumen) or "nada"))
if aplicar and cambios:
    with tempfile.NamedTemporaryFile("w", suffix=".json", delete=False) as f:
        json.dump(cambios, f)
    subprocess.run(CLI + ["database:update", "/", f.name, "--project", PROYECTO, "--force"], check=True)
    print("::notice::Listo: láminas recuperadas")
