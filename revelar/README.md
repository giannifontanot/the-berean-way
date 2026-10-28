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

## Usar en clase

1. Abre `presentador.html` en tu teléfono.
2. Toca **Compartir**: muestra un **código QR** y el enlace para los participantes.
3. Arriba verás cuántos participantes están conectados.
4. Toca una foto para **revelarla** (aparece su número de orden en dorado).
   Toca **Ocultar** para retirarla de sus pantallas.
5. **Reiniciar** borra la lista para empezar de nuevo; los participantes siguen
   conectados.

Si alguien llega tarde o recarga la página, ve todas las fotos ya reveladas.

### La pantalla del presentador

Una sola pantalla:

- **Arriba**, el estado y cuatro botones: **+** (agregar foto o escritura),
  **⇅ Ordenar**, **Compartir** (QR) y **↺ Reiniciar**.
- **La tira** con todas las láminas visibles. La que está en los teléfonos
  tiene marco dorado y dice **En pantalla**; la que sigue, **Siguiente**.
  Desliza para ver más; a los 4 segundos vuelve sola a la actual.
  - **Tocar** una lámina la muestra (desvío) o regresa a ella si ya pasó.
  - **⋯** o **mantenerla presionada** abre su menú **sin mostrarla**: Notas,
    Editar (escrituras), Ocultar y Borrar.
- **Las notas** de la lámina en pantalla (antes de empezar, las de la primera),
  con **✎** para corregirlas.
- **Abajo**, **↶** y **Siguiente ▶**.

**⇅ Ordenar** cambia a la cuadrícula: arrastra para mover, casilla ✓ para
ocultar, y 📝 / ✎ / 🗑 en cada tarjeta. **Listo** guarda y regresa.

### Notas

Cada lámina puede tener notas: viñetas con `-`, `*rojo*` y `==resaltado==`.
Al crear una escritura o subir **una** foto se te piden; si no, usa **⋯ → Notas**
en la tira, **✎** en el cuadro de notas o **📝** en Ordenar. Se guardan en `revelar_privado/<sesión>/notas`,
que **solo tu cuenta** puede leer: nunca llegan a los participantes.

### Agregar fotos desde el teléfono

Toca **+** (abajo a la derecha) → **📷 Foto** y elige una o varias fotos de tu
galería. Se reducen solas (lado mayor 1600 px) y se agregan al final de tu
lista, ocultas hasta que las reveles. En **Ordenar**, toca **🗑** en la tarjeta para borrarla.
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

Toca **+** → **📖 Escritura** para escribir una escritura:

- **Cita** (p. ej. `Juan 2:19`) y **Texto**.
- Selecciona palabras y toca **Rojo** o **Resaltar**. También puedes escribir
  `*así*` (rojo) y `==así==` (resaltado). O marca **Todo en letra roja**.
- **Guardar** la deja oculta en tu cuadrícula (para preparar la clase);
  **Guardar y revelar** la muestra al instante.
- Usa **Ordenar** para ponerla entre las fotos; **Siguiente ▶** la revela en su turno.
- Toca **✎** en la tarjeta para editarla (o borrarla). En **Ordenar** también tiene **🗑**. Si ya está revelada, los
  cambios (por ejemplo, un resaltado nuevo en plena clase) se ven al instante.

Las escrituras se guardan en Firebase por sesión. Las fotos, en cambio, viven
en el repo.

### Varias sesiones

Agrega `?s=nombre` a la URL del presentador (p. ej.
`presentador.html?s=martes`). El botón **Compartir** genera el enlace de esa
sesión. Cada sesión tiene su propia lista.

## Cambiar las fotos

1. Pon tus imágenes en `revelar/fotos/` (JPG o WebP de ~1600 px de ancho y
   menos de 500 KB cargan rápido en el teléfono).
2. Edita `revelar/fotos.js`: un renglón por foto con `id`, `src` y `titulo`.
3. Commit + push.

> Las fotos viven en GitHub Pages, que es público. Usa nombres de archivo no
> adivinables (p. ej. `fotos/a7k2-jerusalen.jpg`) para que nadie las encuentre
> antes de que las reveles.

## Al publicar cambios

GitHub Pages deja que los teléfonos guarden los archivos hasta 10 minutos.
Las páginas piden `revelar.css` y los `.js` con `?v=…`; al cambiar esos
archivos, sube ese número (en `index.html`, `presentador.html` y
`js/store.js`) para que todos reciban la versión nueva al recargar.
