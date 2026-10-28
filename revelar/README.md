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
