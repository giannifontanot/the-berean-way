// script.js — Sticky Shapes (Árbol de Ideas)
// Toda la lógica de la aplicación. No contiene valores fijos:
// todo lo configurable proviene de window.CONFIG (config.js).

(function () {
  "use strict";

  const CONFIG = window.CONFIG;
  const canvas = document.getElementById("canvas");
  const addBtn = document.getElementById("add-btn");
  const zoneLabels = document.getElementById("zone-labels");
  const treasure = document.getElementById("treasure");

  // ---------------------------------------------------------------
  // Formas de hoja (SVG). Registro genérico: para añadir una variante,
  // agrégala aquí y en CONFIG.leafShapes — la lógica no cambia.
  // Cada entrada dibuja dentro de un viewBox 0 0 100 100.
  // ---------------------------------------------------------------
  const LEAF_PATHS = {
    "leaf-oak": {
      body: "M50 4 C60 16 76 18 74 32 C88 34 84 48 76 54 C88 62 78 76 66 74 C64 88 54 92 50 96 C46 92 36 88 34 74 C22 76 12 62 24 54 C16 48 12 34 26 32 C24 18 40 16 50 4 Z",
      vein: "M50 12 L50 88 M50 40 L32 30 M50 40 L68 30 M50 62 L32 56 M50 62 L68 56",
    },
    "leaf-maple": {
      body: "M50 4 L58 22 L74 12 L70 32 L92 30 L76 46 L94 58 L72 60 L80 80 L58 68 L50 96 L42 68 L20 80 L28 60 L6 58 L24 46 L8 30 L30 32 L26 12 L42 22 Z",
      vein: "M50 14 L50 86 M50 50 L26 34 M50 50 L74 34 M50 58 L30 68 M50 58 L70 68",
    },
    "leaf-simple": {
      body: "M50 4 C82 24 88 60 50 96 C12 60 18 24 50 4 Z",
      vein: "M50 10 L50 90 M50 34 L34 26 M50 34 L66 26 M50 56 L32 46 M50 56 L68 46 M50 76 L38 68 M50 76 L62 68",
    },
  };

  // ---------------------------------------------------------------
  // Tema: escribe la paleta de CONFIG.theme como variables CSS en :root
  // para que style.css la consuma (una sola fuente de verdad).
  // ---------------------------------------------------------------
  function applyTheme() {
    const t = CONFIG.theme;
    const root = document.documentElement.style;
    root.setProperty("--bg", t.background);
    root.setProperty("--tree", t.treeStroke);
    root.setProperty("--tree-fill", t.treeFill);
    root.setProperty("--bark-dark", t.barkDark);
    root.setProperty("--canopy", t.canopy);
    root.setProperty("--canopy-fill", t.canopyFill);
    root.setProperty("--grass", t.grass);
    root.setProperty("--leaf-fill", t.leafFill);
    root.setProperty("--leaf-glow", t.leafGlow);
    root.setProperty("--text", t.text);
    root.setProperty("--accent", t.accent);
    root.setProperty("--treasure", t.treasure);
    root.setProperty("--leaf-text-size", t.leafTextSize + "px");
    root.setProperty("--zone-label-size", t.zoneLabelSize + "px");
    root.setProperty("--glow", t.glowBlur + "px");
    root.setProperty("--font", t.fontFamily);
    root.setProperty(
      "--anim-ms",
      (CONFIG.animations.enabled ? CONFIG.animations.durationMs : 0) + "ms"
    );
  }

  // ---------------------------------------------------------------
  // Persistencia en Local Storage (guardado automático, sin botón).
  // ---------------------------------------------------------------
  let state = { version: CONFIG.schemaVersion, nodes: [] };

  function loadState() {
    try {
      const raw = localStorage.getItem(CONFIG.storageKey);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (parsed && Array.isArray(parsed.nodes)) {
        state = parsed;
      }
    } catch (_) {
      // Dato corrupto: fallo elegante, se arranca con lienzo vacío.
    }
  }

  function saveState() {
    try {
      localStorage.setItem(CONFIG.storageKey, JSON.stringify(state));
    } catch (_) {
      // Almacenamiento lleno o no disponible: la app sigue funcionando.
    }
  }

  // ---------------------------------------------------------------
  // Modelo: crear y actualizar hojas.
  // ---------------------------------------------------------------
  function makeId() {
    return "n_" + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
  }

  function findNode(id) {
    return state.nodes.find((n) => n.id === id);
  }

  function touchNode(node) {
    node.updatedAt = Date.now();
    saveState();
  }

  // Centro (px) de la región de un estado, para posicionar hojas nuevas.
  function regionCenter(statusId) {
    const status = CONFIG.statuses.find((s) => s.id === statusId);
    const r = status ? status.region : { x: 0, y: 0, w: 1, h: 1 };
    return {
      x: (r.x + r.w / 2) * window.innerWidth - CONFIG.defaultWidth / 2,
      y: (r.y + r.h / 2) * window.innerHeight - CONFIG.defaultHeight / 2,
    };
  }

  // Estado cuya región contiene el punto (px). Se usa al soltar una hoja.
  function statusAtPoint(px, py) {
    const nx = px / window.innerWidth;
    const ny = py / window.innerHeight;
    for (const s of CONFIG.statuses) {
      const r = s.region;
      if (nx >= r.x && nx < r.x + r.w && ny >= r.y && ny < r.y + r.h) return s.id;
    }
    return CONFIG.defaultStatus;
  }

  function createNode() {
    const pos =
      CONFIG.defaultPosition === "center"
        ? regionCenter(CONFIG.defaultStatus)
        : CONFIG.defaultPosition;
    const node = {
      id: makeId(),
      text: CONFIG.defaultText,
      x: pos.x,
      y: pos.y,
      shape: CONFIG.defaultShape,
      status: CONFIG.defaultStatus,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    state.nodes.push(node);
    saveState();
    renderLeaf(node);
  }

  // ---------------------------------------------------------------
  // Render: etiquetas de zona y hojas.
  // ---------------------------------------------------------------
  function renderZoneLabels() {
    zoneLabels.innerHTML = "";
    for (const s of CONFIG.statuses) {
      const el = document.createElement("span");
      el.className = "zone-label";
      el.dataset.status = s.id;
      el.textContent = s.label;
      const r = s.region;
      el.style.left = (r.x + r.w / 2) * 100 + "%";
      el.style.top = (r.y * 100 + 2) + "%";
      zoneLabels.appendChild(el);
    }
  }

  function leafSvg(shape) {
    const def = LEAF_PATHS[shape] || LEAF_PATHS[CONFIG.leafShapes[0]];
    const ns = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(ns, "svg");
    svg.setAttribute("viewBox", "0 0 100 100");
    const body = document.createElementNS(ns, "path");
    body.setAttribute("class", "leaf-body");
    body.setAttribute("d", def.body);
    const vein = document.createElementNS(ns, "path");
    vein.setAttribute("class", "leaf-vein");
    vein.setAttribute("d", def.vein);
    svg.appendChild(body);
    svg.appendChild(vein);
    return svg;
  }

  // Tono de verde propio de cada variante (desde CONFIG.leafStyles).
  function applyLeafStyle(el, shape) {
    const style = (CONFIG.leafStyles || {})[shape] || {};
    el.style.setProperty("--leaf-fill", style.fill || CONFIG.theme.leafFill);
    el.style.setProperty("--leaf-glow", style.glow || CONFIG.theme.leafGlow);
  }

  function renderLeaf(node) {
    const el = document.createElement("div");
    el.className = "leaf";
    el.dataset.id = node.id;
    el.style.width = CONFIG.defaultWidth + "px";
    el.style.height = CONFIG.defaultHeight + "px";
    // Posicionar con transform (acelerado por GPU): el arrastre no fuerza
    // relayout de la página, solo composición — clave para la fluidez.
    el.style.transform = `translate(${node.x}px, ${node.y}px)`;
    applyLeafStyle(el, node.shape);

    el.appendChild(leafSvg(node.shape));

    const text = document.createElement("span");
    text.className = "leaf-text";
    text.textContent = node.text;
    el.appendChild(text);

    attachGestures(el);
    canvas.appendChild(el);
  }

  function updateLeafShape(el, node) {
    el.querySelector("svg").replaceWith(leafSvg(node.shape));
  }

  function renderAll() {
    for (const node of state.nodes) renderLeaf(node);
  }

  // ---------------------------------------------------------------
  // Gestos: arrastre, clic simple (variante) y doble clic (editar).
  // Desambiguación por retardo — ver INTERACTION_RULES.md.
  // ---------------------------------------------------------------
  function attachGestures(el) {
    let startX = 0, startY = 0;       // posición del puntero al iniciar
    let originX = 0, originY = 0;     // posición de la hoja al iniciar
    let lastX = 0, lastY = 0;         // última posición durante el arrastre
    let dragging = false;
    let pointerDown = false;
    let clickTimer = null;            // temporizador de desambiguación

    el.addEventListener("pointerdown", (e) => {
      if (el.querySelector(".leaf-editor")) return; // en edición: no arrastrar
      pointerDown = true;
      dragging = false;
      startX = e.clientX;
      startY = e.clientY;
      const node = findNode(el.dataset.id);
      originX = node ? node.x : 0;
      originY = node ? node.y : 0;
      el.setPointerCapture(e.pointerId);
    });

    el.addEventListener("pointermove", (e) => {
      if (!pointerDown) return;
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      // Arrastre gana sobre clic: se activa al superar el umbral.
      if (!dragging && Math.hypot(dx, dy) > CONFIG.dragThreshold) {
        dragging = true;
        el.classList.add("dragging");
        document.body.classList.add("leaf-dragging"); // muestra el cofre
      }
      if (dragging) {
        el.style.transform = `translate(${originX + dx}px, ${originY + dy}px)`;
        lastX = originX + dx;
        lastY = originY + dy;
        highlightZone(e.clientX, e.clientY);
        treasure.classList.toggle("active", overTreasure(e.clientX, e.clientY));
      }
    });

    el.addEventListener("pointerup", (e) => {
      if (!pointerDown) return;
      pointerDown = false;

      if (dragging) {
        finishDrag(el, e.clientX, e.clientY, lastX, lastY);
        return;
      }

      // Clic sin arrastre: distinguir simple de doble con retardo.
      if (clickTimer) {
        // Segundo clic dentro de la ventana → doble clic → editar.
        clearTimeout(clickTimer);
        clickTimer = null;
        startEditing(el);
      } else {
        clickTimer = setTimeout(() => {
          clickTimer = null;
          cycleShape(el); // No llegó segundo clic → clic simple → variante.
        }, CONFIG.doubleClickDelay);
      }
    });

    el.addEventListener("pointercancel", () => {
      pointerDown = false;
      if (dragging) {
        dragging = false;
        el.classList.remove("dragging");
        document.body.classList.remove("leaf-dragging");
        treasure.classList.remove("active");
      }
    });
  }

  // ¿El punto (px, py) está sobre el cofre del tesoro?
  function overTreasure(px, py) {
    const r = treasure.getBoundingClientRect();
    return px >= r.left && px <= r.right && py >= r.top && py <= r.bottom;
  }

  function finishDrag(el, px, py, fx, fy) {
    el.classList.remove("dragging");
    document.body.classList.remove("leaf-dragging");
    treasure.classList.remove("active");
    highlightZone(-1, -1); // apaga el resaltado
    const node = findNode(el.dataset.id);
    if (!node) return;

    // Soltar sobre el cofre = borrar la hoja.
    if (overTreasure(px, py)) {
      deleteNode(node, el);
      return;
    }

    node.x = fx;
    node.y = fy;
    node.status = statusAtPoint(px, py); // mover = reclasificar
    touchNode(node);
  }

  function deleteNode(node, el) {
    state.nodes = state.nodes.filter((n) => n.id !== node.id);
    saveState();
    el.remove();
  }

  function cycleShape(el) {
    const node = findNode(el.dataset.id);
    if (!node) return;
    const seq = CONFIG.leafShapes;
    const next = (seq.indexOf(node.shape) + 1) % seq.length;
    node.shape = seq[next];
    updateLeafShape(el, node);
    applyLeafStyle(el, node.shape);
    touchNode(node);
  }

  // Resalta la etiqueta de la zona bajo el puntero durante el arrastre.
  function highlightZone(px, py) {
    const active = px >= 0 ? statusAtPoint(px, py) : null;
    for (const label of zoneLabels.children) {
      label.classList.toggle("active", label.dataset.status === active);
    }
  }

  // ---------------------------------------------------------------
  // Edición de texto (doble clic). Blur/Enter guarda; Escape cancela.
  // ---------------------------------------------------------------
  function startEditing(el) {
    const node = findNode(el.dataset.id);
    if (!node || el.querySelector(".leaf-editor")) return;

    const textEl = el.querySelector(".leaf-text");
    textEl.style.display = "none";

    const editor = document.createElement("textarea");
    editor.className = "leaf-editor";
    editor.value = node.text;
    editor.rows = 2;
    el.appendChild(editor);
    editor.focus();
    editor.select();

    let cancelled = false;

    function finish() {
      if (!cancelled) {
        node.text = editor.value;
        touchNode(node);
      }
      textEl.textContent = node.text;
      textEl.style.display = "";
      editor.remove();
    }

    editor.addEventListener("blur", finish);
    editor.addEventListener("keydown", (e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        editor.blur();
      } else if (e.key === "Escape") {
        cancelled = true;
        editor.blur();
      }
    });
    // Que los gestos de la hoja no interfieran mientras se edita.
    editor.addEventListener("pointerdown", (e) => e.stopPropagation());
  }

  // ---------------------------------------------------------------
  // Arranque.
  // ---------------------------------------------------------------
  applyTheme();
  loadState();
  renderZoneLabels();
  renderAll();
  addBtn.addEventListener("click", createNode);
})();
