#!/usr/bin/env python3
import json, subprocess
CLI = ["npx", "--yes", "firebase-tools@15"]
def obtener(r, sup=False):
    return json.loads(subprocess.run(CLI + ["database:get", r, "--project", "berean-revelar"] + (["--shallow"] if sup else []), check=True, capture_output=True, text=True).stdout or "null")
C = "E8x4DPuqrEgeMVAp3JajLanA4uC3"
L = []
buz = obtener(f"/revelar_buzon/{C}") or {}
for e, x in buz.items():
    notas = x.get("notas") or {}
    L.append(f"envio {e}: origen={x.get('origen')} titulo={x.get('titulo')!r} notas={len(notas)} maxnota={max([len(v) for v in notas.values() if isinstance(v,str)] or [0])} notastipos={set(type(v).__name__ for v in notas.values())} clavesnotas={list(notas)[:12]}")
    o = x.get("origen")
    for parte in ("escrituras", "subidas"):
        v = obtener(f"/revelar/{o}/{parte}") or {}
        for k, y in v.items():
            if isinstance(y, dict):
                L.append(f"{parte} {k}: " + str({c: (len(z) if isinstance(z, str) else type(z).__name__) for c, z in y.items()}))
            else:
                L.append(f"{parte} {k}: NO-DICT {type(y).__name__}")
    orden = obtener(f"/revelar/{o}/orden")
    L.append(f"orden {type(orden).__name__}: {orden}")
    L.append(f"otras claves en revelar/{o}: {list((obtener(f'/revelar/{o}', True) or {}).keys())}")
duenos = obtener("/revelar_duenos") or {}
L.append("duenos de Carlet: " + str([k for k, v in duenos.items() if v == C]))
L.append("lecciones de Carlet: " + str(obtener(f"/revelar_lecciones/{C}")))
L.append("privado de Carlet: " + str([k for k in duenos if duenos[k] == C and obtener(f'/revelar_privado/{k}', True)]))
for i in range(0, len(L), 15):
    print("::notice::" + " || ".join(L[i:i+15])[:60000])
