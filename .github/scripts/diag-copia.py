#!/usr/bin/env python3
import json, subprocess
CLI = ["npx", "--yes", "firebase-tools@15"]
def obtener(r, sup=False):
    return json.loads(subprocess.run(CLI + ["database:get", r, "--project", "berean-revelar"] + (["--shallow"] if sup else []), check=True, capture_output=True, text=True).stdout or "null")
C = "E8x4DPuqrEgeMVAp3JajLanA4uC3"
L = []
duenos = obtener("/revelar_duenos") or {}
mios = [k for k, v in duenos.items() if v == C]
L.append("duenos de Carlet: " + str(mios))
for k in mios:
    L.append(f"{k}: revelar={obtener(f'/revelar/{k}', True)} subidas={list((obtener(f'/revelar/{k}/subidas', True) or {}).keys())}")
L.append("buzon: " + str(list((obtener(f"/revelar_buzon/{C}", True) or {}).keys())))
L.append("lecciones: " + str(obtener(f"/revelar_lecciones/{C}")))
L.append("perfil: " + str({k: v for k, v in (obtener(f"/revelar_maestros/{C}") or {}).items() if k != 'correo'}))
L.append("bloqueado: " + str(obtener(f"/revelar_bloqueados/{C}")))
print("::notice::" + " || ".join(L)[:60000])
