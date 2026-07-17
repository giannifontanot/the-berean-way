// script.js — Sticky Shapes (Árbol de Oración)
// Toda la lógica de la aplicación. No contiene valores fijos:
// todo lo configurable proviene de window.CONFIG (config.js).

(function () {
  "use strict";

  const CONFIG = window.CONFIG;
  const canvas = document.getElementById("canvas");
  const leafLayer = document.getElementById("leaf-layer");
  const addBtn = document.getElementById("add-btn");
  const newWsBtn = document.getElementById("new-ws-btn");
  const wsDots = document.getElementById("ws-dots");
  const zoneLabels = document.getElementById("zone-labels");
  const treasure = document.getElementById("treasure");

  // Apilamiento: cada toque trae la hoja al frente. El orden se restaura al
  // recargar usando updatedAt (la última tocada queda hasta arriba).
  let zTop = 10;

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
    // Hoja de maple clásica: 5 lóbulos con muescas profundas y tallo.
    // Menos picos, silueta tipo bandera de Canadá. Roja vía leafStyles.
    "leaf-maple-red": {
      body: "M50 4 L57 20 L71 13 L66 30 L89 34 L74 47 L82 62 L63 58 L60 75 L53 66 L52 70 L53 92 L47 92 L48 70 L47 66 L40 75 L37 58 L18 62 L26 47 L11 34 L34 30 L29 13 L43 20 Z",
      vein: "M50 12 L50 70 M50 45 L30 30 M50 45 L70 30 M50 58 L36 52 M50 58 L64 52",
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
    root.setProperty(
      "--swallow-ms",
      (CONFIG.animations.enabled ? CONFIG.animations.swallowMs : 0) + "ms"
    );
    root.setProperty(
      "--ws-fade-ms",
      (CONFIG.animations.enabled ? CONFIG.animations.workspaceFadeMs : 0) + "ms"
    );
  }

  // ---------------------------------------------------------------
  // Persistencia en Local Storage (guardado automático, sin botón).
  // Modelo v3: múltiples escritorios (workspaces). Cada workspace tiene su
  // propia lista de hojas y su propio árbol. La estructura de cada hoja no
  // cambia respecto a versiones anteriores.
  // ---------------------------------------------------------------
  let state = {
    version: CONFIG.schemaVersion,
    workspaces: [],
    activeWorkspaceId: null,
  };

  function makeWorkspace() {
    return {
      id: "ws_" + Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
      nodes: [],
      tree: CONFIG.defaultTree,
    };
  }

  // Escritorio activo (siempre existe uno tras loadState).
  function activeWorkspace() {
    return (
      state.workspaces.find((w) => w.id === state.activeWorkspaceId) ||
      state.workspaces[0]
    );
  }

  function loadState() {
    try {
      const raw = localStorage.getItem(CONFIG.storageKey);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && Array.isArray(parsed.workspaces)) {
          // Ya está en el formato nuevo (v3).
          state = parsed;
        } else if (parsed && Array.isArray(parsed.nodes)) {
          // MIGRACIÓN del formato viejo (una sola lista de hojas) → un
          // escritorio único que conserva todas las hojas existentes.
          const ws = makeWorkspace();
          ws.nodes = parsed.nodes;
          ws.tree = parsed.tree || CONFIG.defaultTree;
          state = {
            version: CONFIG.schemaVersion,
            workspaces: [ws],
            activeWorkspaceId: ws.id,
          };
        }
      }
    } catch (_) {
      // Dato corrupto: fallo elegante, se arranca vacío.
    }
    // Garantizar siempre al menos un escritorio y un activo válido.
    if (!state.workspaces || state.workspaces.length === 0) {
      state = {
        version: CONFIG.schemaVersion,
        workspaces: [makeWorkspace()],
        activeWorkspaceId: null,
      };
    }
    // activeWorkspaceId debe ser SIEMPRE un id real (no null); si no, el primero.
    if (!state.workspaces.find((w) => w.id === state.activeWorkspaceId)) {
      state.activeWorkspaceId = state.workspaces[0].id;
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
    return activeWorkspace().nodes.find((n) => n.id === id);
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
    // Centro de la hoja a 2/3 de la pantalla (config newLeafPos); de ahí se
    // deriva la posición de la esquina (x/y) y el estado según la zona.
    const w = CONFIG.defaultWidth;
    const h = CONFIG.defaultHeight;
    const cx = CONFIG.newLeafPos.x * window.innerWidth;
    const cy = CONFIG.newLeafPos.y * window.innerHeight;
    const node = {
      id: makeId(),
      text: CONFIG.defaultText,
      x: cx - w / 2,
      y: cy - h / 2,
      shape: CONFIG.defaultShape,
      status: statusAtPoint(cx, cy),
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    activeWorkspace().nodes.push(node);
    saveState();
    renderLeaf(node); // aparece en modo display; se edita con doble clic
  }

  // ---------------------------------------------------------------
  // Render: etiquetas de zona y hojas.
  // ---------------------------------------------------------------
  function renderZoneLabels() {
    zoneLabels.innerHTML = "";
    if (!CONFIG.showZoneLabels) return; // etiquetas desactivadas
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

  // Tono propio de cada variante (desde CONFIG.leafStyles). Si la hoja
  // tiene un borde personalizado (node.border), ese color manda en el contorno.
  function applyLeafStyle(el, node) {
    const style = (CONFIG.leafStyles || {})[node.shape] || {};
    const custom = (CONFIG.borderColors || []).find((b) => b.id === node.border);
    el.style.setProperty("--leaf-fill", style.fill || CONFIG.theme.leafFill);
    el.style.setProperty(
      "--leaf-glow",
      custom ? custom.color : style.glow || CONFIG.theme.leafGlow
    );
  }

  function renderLeaf(node) {
    const el = document.createElement("div");
    el.className = "leaf";
    el.dataset.id = node.id;
    el.style.width = (node.w || CONFIG.defaultWidth) + "px";
    el.style.height = (node.h || CONFIG.defaultHeight) + "px";
    // Posicionar con transform (acelerado por GPU): el arrastre no fuerza
    // relayout de la página, solo composición — clave para la fluidez.
    el.style.transform = `translate(${node.x}px, ${node.y}px)`;
    el.style.zIndex = ++zTop;
    applyLeafStyle(el, node);

    el.appendChild(leafSvg(node.shape));

    const text = document.createElement("span");
    text.className = "leaf-text";
    text.textContent = node.text;
    el.appendChild(text);

    attachGestures(el);
    leafLayer.appendChild(el);
    return el;
  }

  function updateLeafShape(el, node) {
    el.querySelector("svg").replaceWith(leafSvg(node.shape));
  }

  function renderAll() {
    const byLastTouch = [...activeWorkspace().nodes].sort(
      (a, b) => (a.updatedAt || 0) - (b.updatedAt || 0)
    );
    for (const node of byLastTouch) renderLeaf(node);
  }

  // Quita del DOM solo las hojas (no toca árbol ni cofre).
  function clearLeaves() {
    leafLayer.querySelectorAll(".leaf").forEach((el) => el.remove());
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
      el.style.zIndex = ++zTop; // la última tocada queda al frente
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
        highlightDotUnderPointer(e.clientX, e.clientY);
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
        clearDotHighlight();
      }
    });
  }

  // ¿El punto (px, py) está sobre el cofre del tesoro?
  function overTreasure(px, py) {
    const r = treasure.getBoundingClientRect();
    return px >= r.left && px <= r.right && py >= r.top && py <= r.bottom;
  }

  // Punto (dot) de escritorio bajo el puntero. El botón es un área táctil
  // amplia, así que basta con detectar si el punto cae dentro de su rectángulo.
  function dotAtPoint(px, py) {
    for (const dot of wsDots.querySelectorAll(".ws-dot")) {
      const r = dot.getBoundingClientRect();
      if (px >= r.left && px <= r.right && py >= r.top && py <= r.bottom) return dot;
    }
    return null;
  }

  // Durante el arrastre: resalta el punto destino (si no es el actual).
  function highlightDotUnderPointer(px, py) {
    const dot = dotAtPoint(px, py);
    wsDots.querySelectorAll(".ws-dot").forEach((d) => {
      d.classList.toggle(
        "drop-target",
        d === dot && d.dataset.wsId !== state.activeWorkspaceId
      );
    });
  }

  function clearDotHighlight() {
    wsDots.querySelectorAll(".ws-dot").forEach((d) => d.classList.remove("drop-target"));
  }

  function finishDrag(el, px, py, fx, fy) {
    el.classList.remove("dragging");
    document.body.classList.remove("leaf-dragging");
    treasure.classList.remove("active");
    highlightZone(-1, -1); // apaga el resaltado
    clearDotHighlight();
    const node = findNode(el.dataset.id);
    if (!node) return;

    // Soltar sobre el cofre = borrar la hoja.
    if (overTreasure(px, py)) {
      deleteNode(node, el);
      return;
    }

    // Soltar sobre el punto de OTRO escritorio = mover la hoja allá. Conserva
    // su posición (node.x/y aún tienen la posición previa al arrastre).
    const dot = dotAtPoint(px, py);
    if (dot && dot.dataset.wsId !== state.activeWorkspaceId) {
      moveNodeToWorkspace(node, el, dot);
      return;
    }

    node.x = fx;
    node.y = fy;
    node.status = statusAtPoint(px, py); // mover = reclasificar
    touchNode(node);
  }

  // Mueve una hoja al escritorio destino, conservando su posición y props.
  // La hoja "vuela" hacia el punto y se encoge; el punto destino da un pulso.
  function moveNodeToWorkspace(node, el, dot) {
    const from = activeWorkspace();
    const target = state.workspaces.find((w) => w.id === dot.dataset.wsId);
    if (!target) { touchNode(node); return; }

    from.nodes = from.nodes.filter((n) => n.id !== node.id);
    node.updatedAt = Date.now();
    target.nodes.push(node); // x/y intactos = misma posición en el destino
    saveState();

    // Pulso de confirmación en el punto destino.
    dot.classList.add("received");
    setTimeout(() => dot.classList.remove("received"), 450);

    const ms = CONFIG.animations.enabled ? CONFIG.animations.swallowMs : 0;
    if (!ms) { el.remove(); return; }

    const r = dot.getBoundingClientRect();
    const w = node.w || CONFIG.defaultWidth;
    const h = node.h || CONFIG.defaultHeight;
    el.classList.add("swallowed");
    void el.offsetWidth; // reflow para arrancar la transición
    el.style.transform =
      `translate(${r.left + r.width / 2 - w / 2}px, ${r.top + r.height / 2 - h / 2}px) scale(0.05)`;
    setTimeout(() => el.remove(), ms);
  }

  function deleteNode(node, el) {
    // El dato se elimina de inmediato; el DOM se queda solo para la animación.
    const ws = activeWorkspace();
    ws.nodes = ws.nodes.filter((n) => n.id !== node.id);
    saveState();

    const ms = CONFIG.animations.enabled ? CONFIG.animations.swallowMs : 0;
    if (!ms) {
      el.remove();
      return;
    }

    // El cofre se abre y la hoja "cae" adentro, encogiéndose.
    treasure.classList.add("open");
    const r = treasure.getBoundingClientRect();
    const w = node.w || CONFIG.defaultWidth;
    const h = node.h || CONFIG.defaultHeight;
    el.classList.add("swallowed");
    // Forzar reflow para que la transición arranque desde la posición actual.
    void el.offsetWidth;
    el.style.transform =
      `translate(${r.left + r.width / 2 - w / 2}px, ${r.top + r.height / 2 - h / 2}px) scale(0.05)`;

    setTimeout(() => {
      el.remove();
      treasure.classList.add("burst");   // chispas doradas
      treasure.classList.remove("open"); // la tapa se cierra
      // Quitar "burst" solo cuando chispas y destello ya terminaron en
      // opacidad 0: el resplandor regresa con transición (final suave).
      setTimeout(() => treasure.classList.remove("burst"), 900);
    }, ms);
  }

  function cycleShape(el) {
    const node = findNode(el.dataset.id);
    if (!node) return;
    const seq = CONFIG.leafShapes;
    const next = (seq.indexOf(node.shape) + 1) % seq.length;
    node.shape = seq[next];
    updateLeafShape(el, node);
    applyLeafStyle(el, node);
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

    // Botones de tamaño: + arriba de la hoja, − abajo. Solo en modo edición.
    function makeSizeBtn(label, cls, delta) {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "size-btn " + cls;
      btn.textContent = label;
      // pointerdown con preventDefault: cambia el tamaño SIN robarle el foco
      // al editor (así la edición sigue abierta mientras se ajusta).
      btn.addEventListener("pointerdown", (e) => {
        e.preventDefault();
        e.stopPropagation();
        const size = (node.w || CONFIG.defaultWidth) + delta;
        const clamped = Math.max(CONFIG.minLeafSize, Math.min(CONFIG.maxLeafSize, size));
        node.w = clamped;
        node.h = clamped;
        el.style.width = clamped + "px";
        el.style.height = clamped + "px";
        touchNode(node);
      });
      el.appendChild(btn);
      return btn;
    }
    const plusBtn = makeSizeBtn("+", "plus", CONFIG.resizeStep);
    const minusBtn = makeSizeBtn("\u2212", "minus", -CONFIG.resizeStep);

    // Botón de color (derecha): cicla el borde normal → dorado → plateado → normal.
    const colorBtn = document.createElement("button");
    colorBtn.type = "button";
    colorBtn.className = "size-btn color";
    colorBtn.textContent = "\u25D1";
    colorBtn.addEventListener("pointerdown", (e) => {
      e.preventDefault();
      e.stopPropagation();
      const ids = (CONFIG.borderColors || []).map((b) => b.id);
      const cycle = [undefined, ...ids];
      const next = cycle[(cycle.indexOf(node.border) + 1) % cycle.length];
      if (next === undefined) delete node.border;
      else node.border = next;
      applyLeafStyle(el, node);
      touchNode(node);
    });
    el.appendChild(colorBtn);

    let cancelled = false;

    function finish() {
      if (!cancelled) {
        node.text = editor.value;
        touchNode(node);
      }
      textEl.textContent = node.text;
      textEl.style.display = "";
      editor.remove();
      plusBtn.remove();
      minusBtn.remove();
      colorBtn.remove();
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
  // EASTER EGG: cuatro árboles (roble, acacia, bonsái, eucalipto).
  // Tocar la base del tronco cambia al siguiente; se guarda en el estado.
  // ---------------------------------------------------------------
  const treeSvg = document.getElementById("tree");

  function applyTree(id) {
    const theme = CONFIG.treeThemes[id] || CONFIG.treeThemes[CONFIG.defaultTree];
    treeSvg.querySelectorAll(".tree-variant").forEach((g) => {
      g.classList.toggle("active", g.dataset.variant === id);
    });
    // Colores del árbol activo (pisan a los del tema global solo aquí)
    treeSvg.style.setProperty("--canopy", theme.canopy);
    treeSvg.style.setProperty("--canopy-fill", theme.canopyFill);
    treeSvg.style.setProperty("--tree", theme.trunk);
  }

  function cycleTree() {
    const ws = activeWorkspace();
    const cycle = CONFIG.treeCycle;
    const current = ws.tree || CONFIG.defaultTree;
    ws.tree = cycle[(cycle.indexOf(current) + 1) % cycle.length];
    saveState();
    applyTree(ws.tree);
  }

  // Toque en la base del tronco = cambiar árbol (easter egg). Desactivado por
  // ahora vía CONFIG.treeEasterEgg; se reactivará en una versión futura.
  if (CONFIG.treeEasterEgg) {
    canvas.addEventListener("click", (e) => {
      if (e.target !== canvas) return; // solo el fondo, no hojas ni botones
      const r = CONFIG.treeBaseRegion;
      const nx = e.clientX / window.innerWidth;
      const ny = e.clientY / window.innerHeight;
      if (nx >= r.x && nx <= r.x + r.w && ny >= r.y && ny <= r.y + r.h) {
        cycleTree();
      }
    });
  }

  // ---------------------------------------------------------------
  // Navegación entre escritorios (separada de la lógica de las hojas).
  // Diseñada para extenderse: renombrar, eliminar, reordenar, import/export.
  // ---------------------------------------------------------------

  // Indicador de puntos: uno por escritorio, el activo resaltado. El botón es
  // un área táctil amplia; el círculo visible va en un span interno pequeño.
  function renderDots() {
    wsDots.innerHTML = "";
    for (const ws of state.workspaces) {
      const dot = document.createElement("button");
      dot.type = "button";
      dot.className = "ws-dot" + (ws.id === state.activeWorkspaceId ? " active" : "");
      dot.dataset.wsId = ws.id; // usado como blanco al arrastrar hojas
      dot.setAttribute("aria-label", "Ir al escritorio");
      const visual = document.createElement("span");
      visual.className = "dot-visual";
      dot.appendChild(visual);
      dot.addEventListener("click", () => switchWorkspace(ws.id));
      wsDots.appendChild(dot);
    }
    updateNewWsBtn();
  }

  // El botón "+" de escritorio nuevo solo aparece en el último escritorio.
  function updateNewWsBtn() {
    const last = state.workspaces[state.workspaces.length - 1];
    const onLast = last && last.id === state.activeWorkspaceId;
    newWsBtn.style.display = onLast ? "" : "none";
  }

  // Dibuja el escritorio activo (hojas + árbol) sin animación.
  function renderActiveWorkspace() {
    clearLeaves();
    renderAll();
    applyTree(activeWorkspace().tree || CONFIG.defaultTree);
    renderDots();
  }

  // Cambia de escritorio con cross-fade: fade-out → cambiar contenido →
  // fade-in. Solo la capa de hojas hace fade; árbol y cofre quedan fijos.
  let switching = false;
  function switchWorkspace(id) {
    if (switching || id === state.activeWorkspaceId) return;
    if (!state.workspaces.find((w) => w.id === id)) return;

    const fadeMs = CONFIG.animations.enabled ? CONFIG.animations.workspaceFadeMs : 0;
    if (!fadeMs) {
      state.activeWorkspaceId = id;
      saveState();
      renderActiveWorkspace();
      return;
    }

    switching = true;
    leafLayer.classList.add("fading"); // fade-out
    setTimeout(() => {
      state.activeWorkspaceId = id;
      saveState();
      renderActiveWorkspace(); // cambiar contenido (invisible)
      void leafLayer.offsetWidth; // reflow para reiniciar la transición
      leafLayer.classList.remove("fading"); // fade-in
      switching = false;
    }, fadeMs);
  }

  // Crea un escritorio nuevo, vacío, y navega hacia él. Los demás quedan
  // exactamente igual.
  function createWorkspace() {
    const ws = makeWorkspace();
    state.workspaces.push(ws);
    saveState();
    renderDots();          // el nuevo punto aparece de inmediato
    switchWorkspace(ws.id); // navega con animación
  }

  // ---------------------------------------------------------------
  // Arranque.
  // ---------------------------------------------------------------
  applyTheme();
  loadState();
  saveState(); // deja el almacenamiento en el formato canónico (v3) tras migrar
  applyTree(activeWorkspace().tree || CONFIG.defaultTree);
  renderZoneLabels();
  renderDots();
  renderAll();
  addBtn.addEventListener("click", createNode);
  newWsBtn.addEventListener("click", createWorkspace);
})();
