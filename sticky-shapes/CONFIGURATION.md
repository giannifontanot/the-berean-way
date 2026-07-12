# Configuración — Sticky Shapes

> Responde a **¿qué debe ser configurable?** Este documento define **las reglas**
> de configuración, no los valores. Los **valores** viven en `config.js`.

## Principio central

**Ningún valor ajustable debe estar escrito directamente en `script.js`.** Toda
constante que un humano pudiera querer cambiar (formas disponibles, texto
inicial, tamaños, colores, tiempos, clave de almacenamiento) proviene de
`config.js`. `config.js` es el **panel de control** de la aplicación.

Esto cumple el principio de **una sola fuente de verdad**: cada valor existe en
un único lugar.

## Reglas de configuración

- Todas las **formas** provienen de `config.js` (`shapeSequence`). El orden del
  ciclo de formas es el orden de ese arreglo.
- La **forma inicial** de un nodo nuevo proviene de `config.js` (`defaultShape`)
  y debe ser un elemento de `shapeSequence`.
- El **texto inicial** proviene de `config.js` (`defaultText`).
- El **tamaño inicial** del nodo proviene de `config.js` (`defaultWidth`,
  `defaultHeight`).
- El **color inicial** proviene de `config.js` (`colors`).
- La **clave de Local Storage** proviene de `config.js` (`storageKey`).
- Los **tiempos de interacción** (retardo de doble clic, umbral de arrastre,
  duración de animaciones) provienen de `config.js`.
- Si se añade una forma nueva a `shapeSequence`, la aplicación debe manejarla sin
  cambios en la lógica (el renderizado de formas debe ser genérico, guiado por el
  valor de `shape`).

## Claves esperadas en `config.js`

`config.js` debe exportar (o exponer globalmente) un objeto de configuración con,
al menos, estas claves:

| Clave | Tipo | Descripción |
|---|---|---|
| `storageKey` | string | Clave usada en Local Storage. |
| `shapeSequence` | string[] | Formas en orden de ciclo. Por defecto: `["square", "circle", "triangle"]`. |
| `defaultShape` | string | Forma inicial de un nodo nuevo (∈ `shapeSequence`). |
| `defaultText` | string | Texto inicial de un nodo nuevo (p. ej. `"Nueva nota"`). |
| `defaultWidth` | number | Ancho inicial del nodo en px. |
| `defaultHeight` | number | Alto inicial del nodo en px. |
| `defaultPosition` | string \| object | Posición inicial (p. ej. `"center"` o `{x, y}`). |
| `colors` | object | Paleta: p. ej. `{ node, text, accent, background }`. |
| `doubleClickDelay` | number | ms para distinguir clic simple de doble clic. |
| `dragThreshold` | number | px de movimiento para considerar arrastre. |
| `animations` | object | Duraciones/curvas de transición (o `{ enabled: false }`). |
| `minTouchTarget` | number | Tamaño mínimo de área táctil (px). Por defecto `44`. |
| `schemaVersion` | number | Versión del esquema de datos para migraciones. |

> La tabla es la referencia mínima. Se pueden añadir claves siempre que sigan la
> misma regla: valor en `config.js`, uso en `script.js`.

## Ejemplo de `config.js` (referencia, no normativo)

```js
// config.js — Panel de control de Sticky Shapes.
// Cambia estos valores para ajustar la app sin tocar la lógica.
const CONFIG = {
  storageKey: "sticky-shapes:v1",
  schemaVersion: 1,

  shapeSequence: ["square", "circle", "triangle"],
  defaultShape: "square",

  defaultText: "Nueva nota",
  defaultWidth: 120,
  defaultHeight: 120,
  defaultPosition: "center", // o { x: 100, y: 100 }

  colors: {
    background: "#ffffff",
    node: "#fef3c7",
    text: "#1f2937",
    accent: "#3b82f6",
  },

  doubleClickDelay: 250, // ms
  dragThreshold: 5,      // px
  minTouchTarget: 44,    // px
  animations: { enabled: true, durationMs: 120 },
};

// Exposición global (sin módulos) para una app estática simple:
window.CONFIG = CONFIG;
```

## Qué NO va en `config.js`

- Datos del usuario (los nodos): eso vive en Local Storage.
- Lógica o funciones: `config.js` solo contiene valores.
- Estructura o estilos: eso es `index.html` y `style.css`.
