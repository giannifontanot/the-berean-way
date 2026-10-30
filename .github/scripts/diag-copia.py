#!/usr/bin/env python3
"""Solo lectura: revisa por qué falla enviar copia a un código."""
import json, subprocess, sys
PROYECTO = "berean-revelar"
CLI = ["npx", "--yes", "firebase-tools@15"]
YO = "xWkkWXXR0jcHMnOGEwYjrxzxGtX2"
COD = sys.argv[1]
def obtener(ruta, sup=False):
    cmd = CLI + ["database:get", ruta, "--project", PROYECTO] + (["--shallow"] if sup else [])
    return json.loads(subprocess.run(cmd, check=True, capture_output=True, text=True).stdout or "null")
destino = obtener(f"/revelar_codigos/{COD}")
print("codigo", COD, "->", destino)
if destino:
    m = obtener(f"/revelar_maestros/{destino}") or {}
    print("maestro:", {k: m.get(k) for k in ("codigo", "nombre", "creado", "lecciones")})
    print("bloqueado:", obtener(f"/revelar_bloqueados/{destino}"))
    print("buzon (claves):", list((obtener(f"/revelar_buzon/{destino}", True) or {}).keys()))
# códigos parecidos
cods = obtener("/revelar_codigos", True) or {}
print("codigos totales:", len(cods), "parecidos:", [c for c in cods if c[:3] == COD[:3] or c[-3:] == COD[-3:]])
yo = obtener(f"/revelar_maestros/{YO}") or {}
print("mis contactos:", yo.get("contactos"))
print("yo bloqueado:", obtener(f"/revelar_bloqueados/{YO}"))
lecs = obtener(f"/revelar_lecciones/{YO}") or {}
for lid, l in lecs.items():
    if not isinstance(l, dict) or l.get("archivada"): continue
    notas = obtener(f"/revelar_privado/{lid}/notas") or {}
    malas = {k: (type(v).__name__, len(v) if isinstance(v, str) else None) for k, v in notas.items() if not isinstance(v, str) or len(v) > 4000}
    largo = max([len(v) for v in notas.values() if isinstance(v, str)] or [0])
    tit = l.get("titulo") or ""
    print(f"leccion {lid}: titulo={len(tit)} chars, notas={len(notas)}, nota mas larga={largo}, malas={malas}, claves raras={[k for k in notas if not k.replace('_','').replace('-','').isalnum()]}")
