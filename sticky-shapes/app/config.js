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
    { id: "rama-izquierda", label: "Rama izquierda", region: { x: 0.0, y: 0.0, w: 0.5, h: 0.7 } },
    { id: "rama-derecha",   label: "Rama derecha",   region: { x: 0.5, y: 0.0, w: 0.5, h: 0.7 } },
    { id: "piso",           label: "Piso",           region: { x: 0.0, y: 0.7, w: 1.0, h: 0.3 } },
  ],
  defaultStatus: "piso",

  defaultText: "Nueva idea",
  defaultWidth: 110,
  defaultHeight: 110,
  defaultPosition: "center", // "center" (de la zona defaultStatus) o { x, y }

  // Paleta arcade Donkey Kong 80s: fondo oscuro + contornos de neón.
  theme: {
    background: "#0a0018",   // casi negro / violeta profundo
    treeFill: "#7a4a22",     // café: madera del tronco
    treeStroke: "#9a6a3a",   // café claro: borde y halo cálido del tronco
    barkDark: "#4a2a10",     // café oscuro: vetas de la corteza
    canopy: "#3fff2b",       // verde neón: contorno de las copas de nube
    grass: "#2fe515",        // verde: pasto del piso
    leafFill: "#12203a",     // relleno oscuro de la hoja
    leafGlow: "#00f0ff",     // contorno neón cian de la hoja
    text: "#f7ff00",         // amarillo arcade
    accent: "#ff7a00",       // naranja Donkey Kong
    danger: "#ff3355",       // rojo neón: basurero / acciones destructivas
    glowBlur: 8,             // intensidad del resplandor neón (px)
    fontFamily: "'Press Start 2P', 'Courier New', monospace",
  },

  doubleClickDelay: 250, // ms para distinguir clic simple de doble clic
  dragThreshold: 5,      // px de movimiento para considerar arrastre
  minTouchTarget: 44,    // px — área táctil mínima
  animations: { enabled: true, durationMs: 120 },
};

// Exposición global (sin módulos) para una app estática simple.
window.CONFIG = CONFIG;
