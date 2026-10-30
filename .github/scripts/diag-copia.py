#!/usr/bin/env python3
"""Solo lectura: revisa por qué falla enviar copia a un código."""
import json, subprocess, sys
PROYECTO = "berean-revelar"
CLI = ["npx", "--yes", "firebase-tools@15"]
YO = "xWkkWXXR0jcHMnOGEwYjrxzxGtX2"
COD = sys.argv[1]
LINEAS = []
def nota(*a):
    LINEAS.append(" ".join(str(x) for x in a).replace("\n", " "))
def obtener(ruta, sup=False):
    cmd = CLI + ["database:get", ruta, "--project", PROYECTO] + (["--shallow"] if sup else [])
    return json.loads(subprocess.run(cmd, check=True, capture_output=True, text=True).stdout or "null")
destino = obtener(f"/revelar_codigos/{COD}")
nota("codigo", COD, "->", destino)
if destino:
    m = obtener(f"/revelar_maestros/{destino}") or {}
    nota("maestro:", {k: m.get(k) for k in ("codigo", "nombre", "creado", "lecciones")})
    nota("bloqueado:", obtener(f"/revelar_bloqueados/{destino}"))
    nota("buzon (claves):", list((obtener(f"/revelar_buzon/{destino}", True) or {}).keys()))
# códigos parecidos
cods = obtener("/revelar_codigos", True) or {}
nota("codigos totales:", len(cods), "parecidos:", [c for c in cods if c[:3] == COD[:3] or c[-3:] == COD[-3:]])
yo = obtener(f"/revelar_maestros/{YO}") or {}
nota("mis contactos:", yo.get("contactos"))
nota("yo bloqueado:", obtener(f"/revelar_bloqueados/{YO}"))
lecs = obtener(f"/revelar_lecciones/{YO}") or {}
for lid, l in lecs.items():
    if not isinstance(l, dict) or l.get("archivada"): continue
    notas = obtener(f"/revelar_privado/{lid}/notas") or {}
    malas = {k: (type(v).__name__, len(v) if isinstance(v, str) else None) for k, v in notas.items() if not isinstance(v, str) or len(v) > 4000}
    largo = max([len(v) for v in notas.values() if isinstance(v, str)] or [0])
    tit = l.get("titulo") or ""
    nota(f"leccion {lid}: titulo={len(tit)} chars, notas={len(notas)}, nota mas larga={largo}, malas={malas}, claves raras={[k for k in notas if not k.replace('_','').replace('-','').isalnum()]}")
# Contenido de la lección «clase» que se copia: campos y tamaños
for parte in ("escrituras", "subidas"):
    v = obtener(f"/revelar/clase/{parte}") or {}
    for k, x in v.items():
        if isinstance(x, dict):
            info = {c: (len(y) if isinstance(y, str) else type(y).__name__) for c, y in x.items()}
            if "src" in x: info["src_ini"] = str(x["src"])[:15]
            nota(parte, k, info)
        else:
            nota(parte, k, "NO-DICT", type(x).__name__)
orden = obtener("/revelar/clase/orden")
nota("orden tipo", type(orden).__name__, "len", len(orden or []), "no-str", [o for o in (orden.values() if isinstance(orden, dict) else orden or []) if not isinstance(o, str)])
for e, x in (obtener(f"/revelar_buzon/{destino}") or {}).items():
    nota("envio", e, {c: (y if c in ("origen", "titulo", "deNombre", "creado") else "…") for c, y in x.items()})
nota("duenos de clase:", obtener("/revelar_duenos/clase"))
nota("lecciones de Carlet:", obtener(f"/revelar_lecciones/{destino}", True))

print("::notice::" + " || ".join(LINEAS[:20]))
print("::notice::" + " || ".join(LINEAS[20:]))
