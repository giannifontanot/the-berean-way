# Cómo agregar un nuevo usuario

Guía paso a paso para crear la carpeta de un nuevo alumno en The Berean Way.

---

## Requisitos previos

- Un servidor local para abrir `tools/new-user.html` (por ejemplo VS Code Live Server)
- Acceso de escritura al repositorio `giannifontanot/the-berean-way`
- Git instalado y configurado en tu computadora

> **¿Por qué servidor local?**  
> La herramienta lee el original de la serie por `fetch()`. Eso no funciona si abres el archivo directamente desde el Explorador (protocolo `file://`). Con Live Server o cualquier servidor local sí funciona.

---

## Cómo funciona el sistema (visión general)

| Herramienta | Qué hace |
|---|---|
| `tools/lesson-builder.html` | **Crea o edita los originales.** Escribe lecciones en formato sencillo → genera `data.js` completo (contenido, header, footer). |
| `sites/templates/<serie>/data.js` | **Los originales.** Cada serie (Fundamentos, Discipulado, Evangelismo) tiene su propio archivo con el contenido definitivo. |
| `tools/new-user.html` | **Crea alumnos.** Copia un original tal cual y solo cambia el nombre. |

---

## Paso 1 — Abrir la herramienta

Abre `tools/new-user.html` desde tu servidor local (Live Server, etc.).  
No la abras con doble clic: necesita fetch para leer el original.

---

## Paso 2 — Llenar los datos del alumno

| Campo | Descripción |
|---|---|
| **Nombre** | Nombre del alumno (ej. "Paquito") |
| **Título del sitio** | Opcional. Si lo dejas vacío se usa «Los estudios de NOMBRE». |
| **Serie** | El original a copiar: Fundamentos, Discipulado o Evangelismo. |

La herramienta lee `sites/templates/<serie>/data.js`, sustituye `NOMBRE` por el nombre del alumno, y genera la carpeta lista.

---

## Paso 3 — Generar la carpeta del alumno

### Opción A — Descargar como ZIP _(cualquier navegador)_

1. Haz clic en **⬇ Descargar carpeta (.zip)**.
2. Se descarga `s-XXXXXXXX.zip` con código aleatorio único.
3. Descomprímelo dentro de `sites/` del repositorio.  
   Resultado: `sites/s-XXXXXXXX/` con `index.html` y `data.js`.

### Opción B — Guardar directo en el repo _(Chrome/Edge)_

1. Haz clic en **Guardar directo en el repo…**
2. Selecciona la carpeta `sites/` del repositorio.
3. La herramienta escribe `s-XXXXXXXX/` directamente ahí.

---

## Paso 4 — Subir al repositorio

```bash
# 1. Trae los últimos cambios de main
git pull origin main

# 2. Crea una rama para el nuevo alumno
git checkout -b agregar-usuario-NOMBRE

# 3. Agrega la carpeta del alumno
git add sites/s-XXXXXXXX/

# 4. Confirma
git commit -m "Agrega sitio para NOMBRE (s-XXXXXXXX)"

# 5. Sube la rama
git push -u origin agregar-usuario-NOMBRE
```

Abre un **Pull Request** en GitHub y mézclalo a `main`.

---

## Paso 5 — Registrar al alumno en ROSTER.md

Agrega una fila:

```
| `s-XXXXXXXX` | NOMBRE | https://giannifontanot.github.io/the-berean-way/sites/s-XXXXXXXX/ |
```

---

## Paso 6 — Compartir la URL

```
https://giannifontanot.github.io/the-berean-way/sites/s-XXXXXXXX/
```

No hay login; la URL larga es la "contraseña".

---

## Ajustes especiales por alumno

Si necesitas algo distinto al original (lecciones diferentes, otra imagen, texto del footer), edita `sites/s-XXXXXXXX/data.js` directamente en GitHub y haz commit.

---

## Controlar qué lecciones ve el alumno

En `sites/s-XXXXXXXX/data.js` cada lección tiene `published: true` o `published: false`.

```js
{ slug: "leccion-1", title: "Lección 1: ¿Quién es Jesús?", published: true,  ... },
{ slug: "leccion-2", title: "Lección 2: La Palabra de Dios", published: false, ... },
```

Cambia `false → true` para revelar una lección, haz commit y push.

---

## Cómo actualizar o crear un original (serie)

Usa `tools/lesson-builder.html`. Cada lección es una **tarjeta** con su propio contenido y sus imágenes.

1. **Datos del sitio** (una sola vez): título del sitio y nombre (`NOMBRE`).
2. **Por cada lección** (una tarjeta):
   - Escribe el **título de la lección** (es el texto que se ve en el encabezado de esa página).
   - Escribe el contenido en el formato sencillo.
   - Sube su **imagen de header** y su **imagen de footer** (arrastra o selecciona el archivo). El footer no lleva texto.
   - Usa **➕ Agregar lección** para añadir más, y los botones ↑ ↓ 🗑 para ordenar o borrar.
3. Haz clic en **⚙ Generar data.js**.
4. Elige cómo guardar:
   - **⬇ Descargar .zip** — descarga un ZIP con `data.js` y la carpeta `img/` (las imágenes ya van con nombre único por lección, p.ej. `img/leccion-1-header.png`). Descomprímelo dentro de `sites/templates/<serie>/` (reemplaza los archivos existentes).
   - **💾 Guardar en carpeta…** _(Chrome/Edge)_ — selecciona la carpeta `sites/templates/<serie>/` y la herramienta escribe `data.js` + las imágenes directamente. Luego: `git add · commit · push`.
5. Los próximos alumnos que crees con esa serie recibirán el contenido actualizado.

> **Editar un original existente:** abre el lesson-builder y haz clic en **📂 Cargar data.js…**. Selecciona el `data.js` de la serie (`sites/templates/<serie>/data.js`) y la herramienta rellena todas las tarjetas para que edites solo lo que necesites. (Las imágenes ya guardadas conservan su ruta; solo vuelve a subirlas si quieres cambiarlas.)

---

## Solución de problemas

| Problema | Causa probable | Solución |
|---|---|---|
| "No se pudo leer el original" | new-user.html abierto como `file://` | Ábrelo desde un servidor local (Live Server, etc.) |
| `git push` rechazado | Hay cambios en `main` que no tienes | Corre `git pull origin main` primero |
| Las imágenes no se ven | No se subieron a `img/` | Verifica que `sites/s-XXXXXXXX/img/` tenga los archivos |
| La lección no aparece | `published: false` | Cambia a `published: true` y haz push |
