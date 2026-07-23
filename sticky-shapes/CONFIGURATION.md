# Configuración — Sticky Shapes (Árbol de Oración)

> Responde a **¿qué debe ser configurable?** Define **las reglas** de
> configuración, no los valores. Los **valores** viven en `config.js`.

## Principio central

**Ningún valor ajustable debe estar escrito directamente en `script.js`.** Toda
constante que un humano pudiera querer cambiar (variantes de hoja, texto inicial,
tamaños, colores del tema neón, tiempos, zonas/estados, clave de almacenamiento)
proviene de `config.js`. `config.js` es el **panel de control** de la aplicación
y cumple el principio de **una sola fuente de verdad**.

## Reglas de configuración

- Todas las **variantes de hoja** provienen de `config.js` (`leafShapes`). El
  orden del ciclo es el orden de ese arreglo.
- La **variante inicial** de una hoja nueva proviene de `defaultShape` (∈
  `leafShapes`).
- El **texto inicial** proviene de `defaultText`.
- El **tamaño inicial** de la hoja proviene de `defaultWidth`, `defaultHeight`.
- Los **estados/zonas** provienen de `statuses`. Cada estado define su `id`,
  `label` y su `region` (rectángulo normalizado 0..1). Cambiar `statuses` cambia
  cuántas zonas hay y dónde están, sin tocar la lógica.
- El **estado inicial** de una hoja nueva proviene de `defaultStatus` (∈ los
  `id` de `statuses`).
- Los **colores del tema** (paleta neón Donkey Kong) provienen de `theme`.
- Los **tiempos de interacción** (`doubleClickDelay`, `dragThreshold`,
  duración de animaciones) provienen de `config.js`.
- Si se añade una variante a `leafShapes` o un estado a `statuses`, la app debe
  manejarlos sin cambios en la lógica (renderizado genérico guiado por datos).

## Claves esperadas en `config.js`

| Clave | Tipo | Descripción |
|---|---|---|
| `storageKey` | string | Clave usada en Local Storage. |
| `schemaVersion` | number | Versión del esquema de datos para migraciones. |
| `leafShapes` | string[] | Variantes de hoja en orden de ciclo. Incluye `leaf-scroll` (pergamino horizontal). |
| `defaultShape` | string | Variante inicial de una hoja nueva (∈ `leafShapes`). |
| `rotationStep` | number | Grados que gira la hoja por cada clic del botón de rotar (p. ej. `30`). |
| `dotArmDelayMs` | number | Retardo (ms) antes de que los puntos se "enciendan" al arrastrar una hoja cerca — evita transferencias accidentales. |
| `theme.editControl` | color | Color de los controles de edición (rotar, tamaño +/−); distinto del naranja (páginas). |
| `statuses` | object[] | Zonas/estados: `{ id, label, region }`. `region` es `{x,y,w,h}` normalizado 0..1. |
| `defaultStatus` | string | Estado inicial de una hoja nueva (∈ ids de `statuses`). |
| `defaultText` | string | Texto inicial de una hoja nueva. |
| `defaultWidth` | number | Ancho inicial de la hoja en px. |
| `defaultHeight` | number | Alto inicial de la hoja en px. |
| `theme` | object | Paleta neón y estilo (ver abajo). |
| `leafStyles` | object | Tono de verde propio de cada variante: `{ "<shape>": { fill, glow } }`. |
| `animations.workspaceFadeMs` | number | ms de cada mitad del cross-fade al cambiar de escritorio (~2× = transición total). |
| `dotFit` | object | Encogimiento dinámico de la barra de puntos: `{ maxDotPx, minDotPx, screenMarginPx }`. |
| `swipeNav` | object | Navegación por deslizamiento sobre el fondo: `{ minDx, maxDyRatio }`. |
| `leafFont` | object | Letra global de las hojas: `{ sizeMin, sizeMax, sizeStep, fonts[5], colors[5] }`. |
| `lowerDeck` | object | Extensión inferior (QR): `{ deadZonePx, snapRatio, snapMs }`. |
| `doubleClickDelay` | number | ms para distinguir clic simple de doble clic. |
| `dragThreshold` | number | px de movimiento para considerar arrastre. |
| `minTouchTarget` | number | Tamaño mínimo de área táctil (px). Por defecto `44`. |
| `animations` | object | Duraciones/curvas de transición (o `{ enabled: false }`). |

## Ejemplo de `config.js` (referencia, no normativo)

```js
// config.js — Panel de control de Sticky Shapes (Árbol de Oración).
// Cambia estos valores para ajustar la app sin tocar la lógica.
const CONFIG = {
  storageKey: "sticky-shapes:v2",
  schemaVersion: 2,

  // Variantes de hoja (ciclan con un clic simple).
  leafShapes: ["leaf-oak", "leaf-maple", "leaf-simple"],
  defaultShape: "leaf-oak",

  // Cuatro estados = tres copas + piso. region: rectángulo normalizado (0..1).
  statuses: [
    { id: "rama-centro",    label: "Centro",    region: { x: 0.0, y: 0.0,  w: 1.0, h: 0.35 } },
    { id: "rama-izquierda", label: "Izquierda", region: { x: 0.0, y: 0.35, w: 0.5, h: 0.35 } },
    { id: "rama-derecha",   label: "Derecha",   region: { x: 0.5, y: 0.35, w: 0.5, h: 0.35 } },
    { id: "piso",           label: "Piso",      region: { x: 0.0, y: 0.7,  w: 1.0, h: 0.3 } },
  ],
  defaultStatus: "piso",

  defaultText: "Nueva",
  defaultWidth: 96,
  defaultHeight: 96,

  // Paleta arcade Donkey Kong 80s: fondo oscuro + contornos de neón.
  theme: {
    background: "#0a0018",     // casi negro/violeta profundo
    treeStroke: "#ff2d95",     // neón magenta para el árbol
    leafFill: "#12203a",       // relleno oscuro de la hoja
    leafGlow: "#00f0ff",       // contorno neón cian de la hoja
    text: "#f7ff00",           // amarillo arcade
    accent: "#ff7a00",         // naranja Donkey Kong
    glowBlur: 8,               // intensidad del resplandor neón (px)
    fontFamily: "'Press Start 2P', monospace", // usar fuente del sistema si no hay pixel-font
  },

  doubleClickDelay: 250, // ms
  dragThreshold: 5,      // px
  minTouchTarget: 44,    // px
  animations: { enabled: true, durationMs: 120 },
};

window.CONFIG = CONFIG;
```

## Notas sobre el tema neón

- El resplandor de neón se logra con `filter: drop-shadow(...)` o
  `box-shadow`/`text-shadow` en CSS, usando los colores de `theme`.
- No cargar fuentes externas por red (la app es offline y sin dependencias). Si
  se desea una tipografía tipo pixel, incrustarla como `@font-face` con datos
  embebidos **o** caer a `monospace` del sistema. El `fontFamily` de `theme`
  debe incluir siempre un *fallback* seguro.
- Los colores del CSS deben derivarse de `theme` (por ejemplo, escribiéndolos en
  variables CSS `:root { --bg: ...; }` al iniciar) para mantener una sola fuente
  de verdad.

## Qué NO va en `config.js`

- Datos del usuario (las hojas): eso vive en Local Storage.
- Lógica o funciones: `config.js` solo contiene valores.
- Estructura o estilos: eso es `index.html` y `style.css`.
