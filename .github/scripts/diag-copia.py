#!/usr/bin/env python3
import json, subprocess
CLI = ["npx", "--yes", "firebase-tools@15"]
def obtener(r):
    return json.loads(subprocess.run(CLI + ["database:get", r, "--project", "berean-revelar"], check=True, capture_output=True, text=True).stdout or "null")
cods = obtener("/revelar_codigos") or {}
maes = obtener("/revelar_maestros") or {}
vivo = obtener("/revelar_vivo") or {}
L = [f"{c} -> {u[:6]} ({(maes.get(u) or {}).get('nombre','?')}, perfil={ (maes.get(u) or {}).get('codigo') }, creado={(maes.get(u) or {}).get('creado')}, vivo={vivo.get(c)})" for c, u in cods.items()]
print("::notice::" + " || ".join(L))
