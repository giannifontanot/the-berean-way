# Cómo agregar un nuevo usuario

Guía paso a paso para crear la carpeta de un nuevo alumno en The Berean Way.

---

## Requisitos previos

- Google Chrome o Microsoft Edge (para la opción "Guardar directo en el repo")  
- Acceso de escritura al repositorio `giannifontanot/the-berean-way`  
- Git instalado y configurado en tu computadora

---

## Paso 1 — Abrir la herramienta

Abre el archivo `tools/new-user.html` en tu navegador.  
Puedes hacerlo con doble clic desde el Explorador de archivos, o con File → Open en el navegador.

---

## Paso 2 — Llenar los datos del alumno

| Campo | Descripción |
|---|---|
| **Nombre del usuario** | Nombre del alumno (ej. "Paquito") |
| **Imagen de encabezado** | JPG/PNG que aparece en la parte superior de cada lección |
| **Imagen de pie de página** | JPG/PNG decorativa en el footer |

Arrastra las imágenes a las zonas de carga o haz clic en ellas para seleccionarlas.

---

## Paso 3 — Generar la carpeta del alumno

Tienes dos opciones:

### Opción A — Descargar como ZIP _(cualquier navegador)_

1. Haz clic en **⬇ Descargar carpeta (.zip)**.
2. Se descarga un archivo `s-XXXXXXXX.zip` con código aleatorio único.
3. Descomprímelo dentro de la carpeta `sites/` del repositorio.  
   Resultado: `sites/s-XXXXXXXX/` con `index.html`, `data.js`, e `img/`.

### Opción B — Guardar directo en el repo _(Chrome/Edge, desde carpeta local)_

1. Haz clic en **Guardar directo en el repo…**
2. En el selector que aparece, navega hasta la carpeta `sites/` del repositorio y selecciónala.
3. La herramienta escribe la carpeta `s-XXXXXXXX/` directamente ahí.

---

## Paso 4 — Personalizar las lecciones

Abre `sites/s-XXXXXXXX/data.js` en cualquier editor de texto.

- Cada lección tiene un campo `published: true` o `published: false`.
- Cambia a `published: true` solo las lecciones que quieres que el alumno vea ya.
- El resto queda oculto hasta que lo actives.

```js
{ slug: "leccion-1", title: "Lección 1: ¿Quién es Jesús?", published: true,  ... },
{ slug: "leccion-2", title: "Lección 2: La Palabra de Dios", published: false, ... },
```

---

## Paso 5 — Subir al repositorio

Desde la terminal, dentro de la carpeta del repositorio:

```bash
# 1. Asegúrate de tener la versión más reciente de main
git pull origin main

# 2. Crea una rama para el nuevo alumno
git checkout -b agregar-usuario-NOMBRE

# 3. Agrega solo la carpeta del alumno nuevo
git add sites/s-XXXXXXXX/

# 4. Confirma los cambios
git commit -m "Agrega sitio para NOMBRE (s-XXXXXXXX)"

# 5. Sube la rama
git push -u origin agregar-usuario-NOMBRE
```

Luego abre un **Pull Request** en GitHub y mézclalo a `main`.

---

## Paso 6 — Registrar al alumno en ROSTER.md

Abre `ROSTER.md` y agrega una fila a la tabla:

```
| `s-XXXXXXXX` | NOMBRE | https://giannifontanot.github.io/the-berean-way/sites/s-XXXXXXXX/ |
```

Incluye este cambio en el mismo commit o en el PR del paso anterior.

---

## Paso 7 — Compartir la URL

Una vez que el PR esté mezclado, el sitio del alumno estará disponible en:

```
https://giannifontanot.github.io/the-berean-way/sites/s-XXXXXXXX/
```

Comparte esa URL directamente con el alumno. No hay login; la URL larga es la "contraseña".

---

## Activar lecciones adicionales más adelante

1. Abre `sites/s-XXXXXXXX/data.js`.
2. Cambia `published: false` → `published: true` en las lecciones que quieres publicar.
3. Haz commit y push de ese cambio (mismo flujo de rama → PR → merge).

---

## Solución de problemas comunes

| Problema | Causa probable | Solución |
|---|---|---|
| `git push` rechazado | Hay cambios en `main` que no tienes localmente | Corre `git pull origin main` primero |
| Las imágenes no se ven en el sitio | Las imágenes no se subieron a `img/` | Verifica que `sites/s-XXXXXXXX/img/` contenga los archivos |
| La lección no aparece en el menú | `published: false` | Cambia a `published: true` y haz push |
| "Guardar directo" no funciona | Navegador no es Chrome/Edge, o se abrió el HTML desde un servidor remoto | Usa la opción de descarga ZIP |
