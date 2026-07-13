// config.js — Panel de control de Sticky Shapes (Árbol de Ideas).
// Cambia estos valores para ajustar la app sin tocar la lógica.
const CONFIG = {
  storageKey: "sticky-shapes:v2",
  schemaVersion: 2,

  // Variantes de hoja (ciclan con un clic simple).
  leafShapes: ["leaf-oak", "leaf-maple", "leaf-simple"],
  defaultShape: "leaf-oak",

  // Tres estados = dos ramas + piso. region: rectángulo normalizado (0..1).
  statuses: [
    { id: "rama-izquierda", label: "Izquierda", region: { x: 0.0, y: 0.0, w: 0.5, h: 0.7 } },
    { id: "rama-derecha",   label: "Derecha",   region: { x: 0.5, y: 0.0, w: 0.5, h: 0.7 } },
    { id: "piso",           label: "Piso",           region: { x: 0.0, y: 0.7, w: 1.0, h: 0.3 } },
  ],
  defaultStatus: "piso",

  defaultText: "Nueva idea",
  defaultWidth: 150,
  defaultHeight: 150,
  defaultPosition: "center", // "center" (de la zona defaultStatus) o { x, y }

  // Paleta arcade Donkey Kong 80s: fondo oscuro + contornos de neón.
  theme: {
    background: "#0a0018",   // casi negro / violeta profundo
    treeFill: "#7a4a22",     // café: madera del tronco
    treeStroke: "#9a6a3a",   // café claro: borde y halo cálido del tronco
    barkDark: "#4a2a10",     // café oscuro: vetas de la corteza
    canopy: "#3fff2b",       // verde neón: contorno de las copas de nube
    grass: "#2fe515",        // verde: pasto del piso
    leafFill: "#0b2e12",     // relleno verde oscuro de la hoja
    leafGlow: "#7dff3a",     // contorno neón verde-lima de la hoja
    text: "#f7ff00",         // amarillo arcade
    accent: "#ff7a00",       // naranja Donkey Kong
    treasure: "#ffd24a",     // dorado neón: cofre del tesoro (borrar hojas)
    glowBlur: 8,             // intensidad del resplandor neón (px)
    fontFamily: "'Press Start 2P', 'Courier New', monospace",
    leafTextSize: 30,        // px — texto de las hojas (grande y legible)
    zoneLabelSize: 22,       // px — etiquetas de las zonas
  },

  doubleClickDelay: 250, // ms para distinguir clic simple de doble clic
  dragThreshold: 5,      // px de movimiento para considerar arrastre
  minTouchTarget: 44,    // px — área táctil mínima
  animations: { enabled: true, durationMs: 120 },
};

// Exposición global (sin módulos) para una app estática simple.
window.CONFIG = CONFIG;
