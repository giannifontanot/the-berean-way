# Revelar fotos — presentación en vivo a los teléfonos

Tú ves **todas** las fotos en tu teléfono. Cada vez que tocas una, aparece en el
teléfono de los participantes y se **agrega a su lista**, en el orden en que la
revelaste. Puedes **ocultar** una foto o **reiniciar** la sesión.

| Página | Quién la abre | URL |
|---|---|---|
| `presentador.html` | Tú | `https://giannifontanot.github.io/the-berean-way/revelar/presentador.html` |
| `index.html` | Participantes (por QR) | `https://giannifontanot.github.io/the-berean-way/revelar/` |

GitHub Pages sirve las páginas y las fotos. **Firebase Realtime Database** (plan
gratuito Spark) es el mensajero: guarda solo la lista de fotos reveladas y la
envía al instante a todos. El plan gratuito admite 100 conexiones simultáneas.

```
revelar/
├── index.html            # Participantes: lista que crece sola
├── presentador.html      # Tú: cuadrícula con todas las fotos
├── config.js             # Título, sesión y llaves de Firebase  ← editas
├── fotos.js              # Lista de fotos                       ← editas
├── fotos/                # Tus imágenes                         ← editas
├── database.rules.json   # Reglas de seguridad para Firebase
├── revelar.css
└── js/store.js           # Conexión en tiempo real (no se edita)
```

## Probar ya (modo demo, sin Firebase)

Mientras `config.js` tenga `PEGA_AQUI…`, todo funciona en **modo demo**: se
sincroniza solo entre pestañas del **mismo navegador**.

```bash
python3 -m http.server 8000
# Pestaña 1: http://localhost:8000/revelar/presentador.html
# Pestaña 2: http://localhost:8000/revelar/
```

## Configurar Firebase (una sola vez, ~10 minutos)

1. **Crea el proyecto.** Entra a <https://console.firebase.google.com> → *Crear
   proyecto* (p. ej. `berean-revelar`). Google Analytics no hace falta.
2. **Registra la app web.** En la portada del proyecto toca el ícono `</>` →
   ponle un nombre → *Registrar*. Copia los valores de `firebaseConfig`
   (`apiKey`, `authDomain`, `databaseURL`, `projectId`, `appId`) a
   `revelar/config.js`. Si no aparece `databaseURL`, vuelve a copiarlo después
   del paso 3.
   *Estas llaves no son secretas:* son públicas por diseño; la seguridad la dan
   las reglas del paso 4.
3. **Crea la base de datos.** Menú *Build → Realtime Database → Crear base de
   datos* → ubicación `us-central1` → *Comenzar en modo bloqueado*.
4. **Activa el inicio de sesión.** *Build → Authentication → Comenzar →
   Google → Habilitar*. Luego en *Settings → Authorized domains* agrega
   `giannifontanot.github.io`.
5. **Publica y obtén tu UID.** Haz commit + push. Abre `presentador.html`,
   entra con Google y toca una foto. Saldrá el aviso **"Falta un paso"** con
   tu identificador (UID): cópialo.
6. **Pega las reglas.** *Realtime Database → Reglas*: pega el contenido de
   `database.rules.json`, cambia `PEGA_AQUI_TU_UID` por tu UID y *Publicar*.

Listo: desde ahora **solo tu cuenta** puede revelar, ocultar o reiniciar. Los
participantes solo leen y no necesitan cuenta.

## Varios maestros

Cualquier persona con cuenta de Google puede entrar al presentador y tener
**su propio espacio**: sus lecciones, fotos, escrituras y notas. Nadie ve ni
cambia lo de otro (lo garantizan las reglas de Firebase; ver
`.github/scripts/probar-reglas.py`, 38 casos que se prueban en cada cambio).

- Cada maestro tiene un **código** (p. ej. `k7m2`) y su **enlace para
  participantes**: `berean-revelar.web.app/?p=k7m2`. El código aparece grande
  arriba en **Mis lecciones**; el enlace y su QR, en **Compartir**. Sus participantes solo siguen sus clases.
- El presentador original conserva su enlace sin código.
- **Alumnos con varios maestros:** en la pantalla de participantes, el botón
  discreto 👥 (arriba a la derecha) abre **Mis maestros**: escriben el código del
  maestro y un nombre para recordarlo (p. ej. «Pastor Juan»), y tocan uno para
  seguir su clase. Se guarda en su teléfono. Quien entra por un QR queda guardado
  solo. `berean-revelar.web.app/?unirse` abre esa lista directamente.
- **Compartir** muestra el código de la clase en grande, para quien no pueda escanear.
- **Administrador (presentador original):** en **Mis lecciones** aparece
  **👥 Maestros**: cada maestro con nombre, correo, código, número de lecciones y
  última actividad. **Pausar** le impide crear, cambiar o presentar (y sus alumnos
  dejan de ver su clase en vivo); **Reactivar** lo devuelve. Sus lecciones no se
  borran. El maestro pausado ve un aviso en su lista.
- **Mapa de maestros:** en **Mis lecciones**, arriba de las lecciones, un mapa
  cuadrado con la Tierra completa muestra a los maestros que **eligieron** compartir
  su ciudad (tú en verde). **📍 Compartir mi ubicación** pide permiso al teléfono,
  la guarda aproximada (~10 km), con el nombre y la ciudad que escribas; se puede
  quitar cuando quieras. Doble toque = pantalla completa (✕ o Atrás para salir).
  El administrador ve el mismo mapa en **Maestros → 🗺 Mapa** (pausados en rojo).
- **Encima del mapa, en una fila:** **Uso** (⛪ iglesia · 👥 otro, lo elige cada
  maestro), **Mostrar** (⛪ · 👥 · 🌐 todos; se recuerda en ese teléfono) y
  **Ubicación** (📍: azul = compartir; con borde verde = ya compartes, toca para
  cambiar o quitar). Puntos: dorado = iglesia, azul = otro, verde = tú.
- **Enviar copia:** en **⋯** de una lección, **📤 Enviar copia a otro maestro**
  con su código. Se envían fotos, escrituras y, si se marca «Incluir mis notas», las notas. El otro
  maestro la ve en **Recibidas** y toca **Aceptar** o **Descartar**.

Datos: `revelar_duenos/<lección>` (dueño), `revelar_lecciones/<uid>/…`,
`revelar_maestros/<uid>`, `revelar_codigos/<código>`, `revelar_vivo/<código>`,
`revelar_buzon/<uid>/…`.

## Lecciones

Cada clase es una **lección** con sus propias láminas, escrituras, fotos y notas.

- Abre `presentador.html`: primero aparece **Mis lecciones** (`lecciones.html`).
  Cada tarjeta muestra la primera foto, el número de láminas y la fecha en que la
  editaste. Tócala para abrirla.
- **+ Nueva** crea una lección vacía (solo pide el nombre).
- **⋯** en cada tarjeta: **Cambiar nombre**, **Duplicar** (copia láminas,
  escrituras, fotos y notas; no lo revelado) y **Archivar**. Las archivadas
  quedan abajo en **Archivadas**, de donde se pueden **Restaurar**.
- Dentro de una lección, el primer botón de arriba (☰ **Lecciones**) o la barra
  **‹ Lecciones · nombre** te regresan a la lista para trabajar en otra.
- Si cierras el presentador en plena clase (en vivo), al abrirlo vuelves directo
  a esa lección.

**Idioma (ES / EN).** Arriba en **Mis lecciones** hay un interruptor **ES | EN**.
Cambia todos los textos del presentador, de la lista y del documento de
🖨 Imprimir, y se recuerda en ese teléfono. Los participantes ven los textos en
el idioma de su propio teléfono. Tus escrituras, notas y nombres de lecciones no
se traducen: se quedan como los escribiste. Los textos están en `js/i18n.js`.

**Un solo enlace para los participantes.** El QR de **Compartir** ya no cambia:
los participantes abren siempre `revelar/` y ven la lección que pusiste **en vivo
(▶)**. Si pones en vivo otra lección, sus teléfonos se recargan solos y pasan a
ella. Editar o ensayar otra lección no les cambia nada.

Necesita las reglas nuevas de `database.rules.json` (`revelar_lecciones` y
`revelar_actual`): pégalas en *Realtime Database → Reglas* y *Publicar*.

## Usar en clase

1. Abre `presentador.html` en tu teléfono.
2. Toca **Compartir**: muestra un **código QR** y el enlace para los participantes.
3. Arriba verás cuántos participantes están conectados.
4. Toca una foto para **revelarla** (aparece su número de orden en dorado).
   Toca **Ocultar** para retirarla de sus pantallas.
5. **Reiniciar** borra la lista para empezar de nuevo; los participantes siguen
   conectados.

Si alguien llega tarde o recarga la página, ve todas las fotos ya reveladas.

### Ensayo y En vivo (▶)

Junto al **+** hay un botón **▶**:

- **▶ sin círculo = ensayo** (al abrir): tocas láminas, Siguiente y Atrás para
  practicar; todo se mueve solo en tu pantalla. Los participantes ven “Esperando…”.
- Toca **▶** → **▶ con círculo verde = en vivo**: la clase empieza desde cero y
  cada toque llega a los teléfonos.
- Toca otra vez → vuelves a ensayo; los participantes se quedan con lo que vieron.
- Si cierras el presentador a mitad de la clase, al abrirlo regresas en vivo
  (mismo teléfono, dentro de 8 horas).

### La pantalla del presentador

Una sola pantalla:

- **Arriba**, de izquierda a derecha: **☰ Lecciones**, el punto verde (conectado) con 👥 y el número de
  participantes, luego **+** (agregar foto o escritura),
  **✎ Editar**, **🖨 Imprimir**, **↺ Reiniciar** y, al final, **Compartir** (QR) y **▶**.
- **La tira** con todas las láminas visibles. La que está en los teléfonos
  tiene marco dorado y dice **En pantalla**; la que sigue, **Siguiente**.
  Desliza para ver más; a los 4 segundos vuelve sola a la actual.
  - **Tocar** una lámina la muestra (desvío) o regresa a ella si ya pasó.
  - **Doble toque** la abre al 100 % solo en tu teléfono (no se envía). Toca
    la imagen o usa Atrás para cerrarla.
  - **⋯** o **mantenerla presionada** abre su menú **sin mostrarla**: Notas,
    Editar (escrituras), Ocultar y Borrar.
- **Las notas** de la lámina en pantalla (antes de empezar, las de la primera).
  Durante la clase solo se leen; el **✎** para corregirlas aparece en **Editar**.
- **Abajo**, **◀ Atrás** y **Siguiente ▶** (más ancho).
  - **◀ Atrás**: si hay un desvío, lo quita; si estás repasando una lámina
    pasada, retrocede una más; si no, quita la última y los teléfonos vuelven a
    la anterior.
  - **Siguiente**: quita el desvío o termina el repaso y sigue con la próxima
    (si ya no hay más, vuelve a la última).

**AAA** (dentro del editor de notas): tamaño y espacio entre letras de las notas,
siempre con la fuente Atkinson Hyperlegible. Aplica al editor y al cuadro de
notas, y se recuerda en ese teléfono.

**Cambiar una foto**: **⋯ → 🖼 Cambiar foto** (o toca la foto en ese menú), o
**✎** sobre la foto en **Ordenar**. Sirve también para las fotos del repo: la
nueva se guarda en Firebase y reemplaza a la original en todos los teléfonos.

**✎ Editar** (antes Ordenar) se hace en la misma tira: arrastra las láminas para moverlas,
desmarca la casilla ✓ para ocultarlas (Siguiente las salta) y usa 📝 notas,
✎ editar (o cambiar foto) y 🗑 borrar en cada una. Las ocultas aparecen
atenuadas solo mientras ordenas. **Listo** guarda.

### Imprimir

El botón **🖨 Imprimir** (arriba, junto a Compartir) arma un documento con cada
lámina visible en orden (foto o escritura en papel sepia) y sus notas abajo.
Cuando está listo pregunta si lo descargas: toca **Descargar**. Es un archivo
HTML con las fotos adentro, así que se abre sin internet y se puede imprimir o
enviar. Las láminas ocultas no se incluyen.

### Notas

Cada lámina puede tener notas: viñetas con `-`, `*rojo*` y `==resaltado==`.
Al crear una escritura o subir **una** foto se te piden; si no, usa **⋯ → Notas**
en la tira, **✎** en el cuadro de notas o **📝** en Ordenar. Se guardan en `revelar_privado/<sesión>/notas`,
que **solo tu cuenta** puede leer: nunca llegan a los participantes.

### Agregar fotos desde el teléfono

Toca **+** (abajo a la derecha) → **📷 Foto** y elige una o varias fotos de tu
galería. Se reducen solas (lado mayor 1600 px) y se agregan después de la lámina que tienes al frente en la tira,
ocultas hasta que las reveles. En **Ordenar**, toca **🗑** en la tarjeta para borrarla.
Se guardan en la misma Realtime Database, por sesión.

### Ocultar una lámina para "Siguiente"

En **Ordenar**, cada tarjeta tiene una casilla ✓. Desmárcala y **Siguiente** se
salta esa lámina, como ocultar una diapositiva en PowerPoint. Fuera de
**Ordenar** desaparece de tu lista (y no cuenta en la numeración); para usarla
otra vez, vuelve a **Ordenar** y márcala. Se guarda al tocar **Listo**, junto
con el orden.

### Tocar una lámina

- **Una que aún no sale:** aparece de inmediato en los teléfonos, sin número
  (es un desvío). Tócala otra vez para quitarla. **Siguiente** la quita y
  continúa con la que tocaba en tu orden.
- **Una que ya pasó:** los teléfonos simplemente regresan a ella. **Siguiente**
  continúa desde donde ibas.

### Escrituras en letra roja

La escritura se escribe **directamente sobre el papel sepia**, tal como la verán
los participantes: selecciona palabras en la hoja y toca **Rojo** o **Resaltar**
(otra vez para quitarlo).

Toca **+** → **📖 Escritura** para escribir una escritura:

- **Cita** (p. ej. `Juan 2:19`) y **Texto**.
- Selecciona palabras y toca **Rojo** o **Resaltar**. También puedes escribir
  `*así*` (rojo) y `==así==` (resaltado). O marca **Todo en letra roja**.
- **Guardar** la deja oculta en tu cuadrícula (para preparar la clase);
  **Guardar y revelar** la muestra al instante.
- Usa **Ordenar** para ponerla entre las fotos; **Siguiente ▶** la revela en su turno.
- Toca **✎** en la tarjeta para editarla (o borrarla). En **Ordenar** también tiene **🗑**. Si ya está revelada, los
  cambios (por ejemplo, un resaltado nuevo en plena clase) se ven al instante.

Las escrituras y las fotos se guardan en Firebase, en cada lección.

## Fotos fijas en el repo (opcional)

Las fotos de cada lección se suben desde el presentador con **+**. `fotos.js`
queda vacío; úsalo solo si quieres fotos que aparezcan en **todas** las lecciones:

1. Pon tus imágenes en `revelar/fotos/` (JPG o WebP de ~1600 px de ancho y
   menos de 500 KB cargan rápido en el teléfono).
2. Edita `revelar/fotos.js`: un renglón por foto con `id`, `src` y `titulo`.
3. Commit + push.

> Las fotos viven en GitHub Pages, que es público. Usa nombres de archivo no
> adivinables (p. ej. `fotos/a7k2-jerusalen.jpg`) para que nadie las encuentre
> antes de que las reveles.

## Publicación: GitHub Pages y Firebase Hosting

Cada push a `main` publica la carpeta `revelar/` en dos lugares:

| Dónde | Participantes | Presentador |
|---|---|---|
| **Firebase Hosting** (recomendado) | `https://berean-revelar.web.app/` | `https://berean-revelar.web.app/presentador.html` |
| GitHub Pages | `https://giannifontanot.github.io/the-berean-way/revelar/` | `…/revelar/presentador.html` |

En Firebase los archivos se sirven con `Cache-Control: no-cache`: los cambios se
ven al recargar, sin esperar. La configuración está en `firebase.json` y
`.firebaserc` (raíz del repo) y el flujo en `.github/workflows/deploy-firebase.yml`.

**Una sola vez:** el flujo necesita el secreto `FIREBASE_SERVICE_ACCOUNT` en
GitHub (*Settings → Secrets and variables → Actions*), con la llave JSON de una
cuenta de servicio de Google Cloud con estos roles: Firebase Hosting Admin,
Firebase Authentication Admin, Cloud Run Viewer, API Keys Viewer, Service Usage
Consumer y Firebase Realtime Database Admin. Mientras no exista, el flujo se salta
sin fallar.

**Reglas de la base de datos.** El mismo flujo publica `database.rules.json`, pero
antes lo revisa `.github/scripts/revisar-reglas.py`. Si las reglas no son JSON
válido, no tienen tu UID, dejan escribir sin tu cuenta (salvo la presencia de
participantes) o dejan leer en público algo privado, **no se publican** y la
ejecución lo marca con un error. Las páginas se publican de todos modos.
El archivo del repo manda: un cambio hecho a mano en la consola de Firebase se
reemplaza en el siguiente push.

## Al publicar cambios

GitHub Pages deja que los teléfonos guarden los archivos hasta 10 minutos.
Las páginas piden `revelar.css` y los `.js` con `?v=…`; al cambiar esos
archivos, sube ese número (en `index.html`, `presentador.html` y
`js/store.js`) para que todos reciban la versión nueva al recargar.
