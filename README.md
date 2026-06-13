# The Berean Way — sitios de estudio por alumno

Sitio estático (HTML + CSS + JS, sin build) para GitHub Pages. Un **diseño y
lógica compartidos** (`assets/`) y **un sitio por alumno** (`sites/<código>/`),
donde cada alumno solo personaliza su contenido.

## Estructura

```
.
├── index.html                  # Página raíz neutra (no lista alumnos)
├── assets/                     # COMPARTIDO por todos los alumnos — editar una vez
│   ├── styles.css              # Diseño
│   ├── app.js                  # Lógica: menú, acordeones, galería, búsqueda
│   └── img/header-bg.svg       # Imagen de fondo del header (compartida)
├── sites/
│   ├── original/               # PLANTILLA: copia esta carpeta para un alumno nuevo
│   │   ├── index.html          # Cáscara (idéntica para todos; no se edita)
│   │   ├── data.js             # CONTENIDO — lo único que editas
│   │   └── img/                # Imágenes propias de esta carpeta
│   └── s-7f3a9c2e/             # Alumno de ejemplo (Samuel) con código no adivinable
│       ├── index.html
│       ├── data.js
│       └── img/
├── ROSTER.md                   # Mapa privado código → nombre (solo para ti)
└── .github/workflows/deploy-pages.yml
```

## Cómo funciona

Cada carpeta de alumno tiene un `index.html` idéntico que carga su `data.js` y el
`assets/app.js` compartido. `app.js` lee `window.STUDENT_SITE` (definido en `data.js`)
y dibuja el header, el menú de hamburguesa (a partir de las páginas) y el contenido.
**Cambiar el diseño = editar `assets/` una sola vez; afecta a todos los alumnos.**

## Agregar un alumno con la herramienta (recomendado)

Abre **`tools/new-student.html`** en tu navegador (doble clic, o sírvelo en local).
Escribe el nombre, elige la imagen de **header** y la de **footer** (y un texto de footer
si quieres), y pulsa un botón:

- **Descargar carpeta (.zip)** — funciona en cualquier navegador, incluso sin internet.
  Descomprime el `.zip` dentro de `sites/` (queda `sites/s-XXXXXXXX/`), commit y push.
- **Guardar directo en el repo…** — en Chrome/Edge (servido en `localhost`): elige tu carpeta
  `sites/` y la herramienta escribe ahí la carpeta del alumno directamente.

La herramienta genera el código aleatorio, el `data.js`, el `index.html` y copia tus imágenes.
Luego solo agregas la fila a `ROSTER.md` (la herramienta te la muestra lista para copiar).

> Nota: GitHub Pages es estático, por eso la creación de carpetas ocurre **en tu equipo**
> con esta herramienta; el sitio publicado no puede crear archivos por sí mismo.

## Agregar un alumno a mano

1. **Copia** `sites/original/` a `sites/s-XXXXXXXX/`, usando un **código no
   adivinable** (no el nombre real). Genera uno, por ejemplo, así:
   ```bash
   echo "s-$(openssl rand -hex 4)"
   ```
2. **Edita solo** `sites/s-XXXXXXXX/data.js`:
   - `student`: el nombre (para el saludo interno; **no** aparece en la URL).
   - `headerImage` (opcional): background del header **propio de ese alumno**,
     p. ej. `"img/header.svg"`. Si lo omites, se usa el header compartido.
   - `footer` (opcional): pie de página con background. `{ image, title, text }`.
     Si omites `image`, usa el footer compartido (`assets/img/footer-bg.svg`).
   - `pages`: las páginas. Cada una es `type: "accordion"` (con `purpose` + `items`)
     o `type: "gallery"` (con `lead` + `images`). Una página puede sobreescribir
     `headerImage` o `footer` solo para ella.
   - El campo `body` de un acordeón admite HTML (`<p>`, `<strong>`, etc.).
3. Pon las imágenes de ese alumno (incluidos su `header.svg`/`footer.svg`) en su carpeta `img/`.
4. Apunta a `ROSTER.md` qué código corresponde a qué alumno.
5. Comparte con el alumno **solo su URL**: `https://giannifontanot.github.io/the-berean-way/sites/s-XXXXXXXX/`

No edites el `index.html` del alumno ni la carpeta `assets/`.

## Privacidad (léelo)

En GitHub Pages **gratis/Pro el sitio publicado siempre es público**; las Pages con
inicio de sesión solo existen en GitHub Enterprise. El esquema de privacidad aquí es:

- **Repo privado** → el código fuente y la lista de carpetas/alumnos quedan ocultos.
- **URLs por alumno con código aleatorio** → no se pueden adivinar ni enumerar.
- `index.html` raíz **no** enlaza a ningún alumno.

Esto es privacidad por enlace no adivinable (no autenticación). Sirve para material
no sensible compartido por invitación. Para control de acceso real, haría falta
otro hosting (o GitHub Enterprise).

## Ver en local

```bash
python3 -m http.server 8000
# Alumno de ejemplo: http://localhost:8000/sites/s-7f3a9c2e/
```

## Despliegue en GitHub Pages

1. Repo → **Settings → Pages → Build and deployment → Source = "GitHub Actions"**.
2. Push a `main` (el workflow corre solo) o ejecútalo desde **Actions → Run workflow**.
