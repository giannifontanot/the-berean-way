# Reglas de interacción — Sticky Shapes

> Responde a **¿qué ocurre cuando el usuario toca la pantalla?** Este documento
> es la autoridad sobre el **comportamiento de los gestos**. Si algo aquí
> contradice a otro documento respecto a *cómo se comporta* un gesto, gana este.

## Gestos soportados

| Gesto | Objetivo | Resultado |
|---|---|---|
| Clic / toque simple | Nodo | Cambia la forma (avanza en `shapeSequence`). |
| Doble clic / doble toque | Nodo | Entra en modo edición de texto. |
| Arrastrar (*drag*) | Nodo | Mueve el nodo; al soltar, guarda la posición. |
| Clic / toque | Botón `+` | Crea un nodo nuevo. |
| Clic / toque | Acción archivar del nodo | Archiva el nodo. |

## Prioridad y desambiguación de gestos

Este es el punto más delicado de la app, porque **clic simple** (cambiar forma) y
**doble clic** (editar) comparten el mismo elemento y el doble clic empieza
siempre con clics simples. Regla obligatoria:

1. **Arrastre gana sobre clic.** Si el puntero se mueve más que `dragThreshold`
   px (de `config.js`) entre `pointerdown` y `pointerup`, el gesto es un
   **arrastre**, no un clic. No cambies la forma ni edites.
2. **Distinguir clic simple de doble clic con retardo.** Al detectar un clic que
   no fue arrastre, **espera** `doubleClickDelay` ms (de `config.js`):
   - Si llega un segundo clic dentro de esa ventana → es **doble clic** →
     entrar en edición. **No** se cambia la forma.
   - Si no llega → es **clic simple** → cambiar la forma.

   Con esto, un doble clic **nunca** dispara cambios de forma antes de editar.
3. **La acción de archivar es independiente.** El control de archivar (icono o
   botón) captura su propio evento y **no** debe propagarlo al nodo (usar
   `stopPropagation`), para no cambiar la forma sin querer.

> Alternativa aceptable: si se prefiere evitar el retardo del punto 2, el LLM
> puede implementar el cambio de forma en clic simple y la edición mediante un
> control explícito (p. ej. botón "editar" o toque prolongado), **siempre que**
> se documente y se respete la regla de que ningún gesto dispare dos acciones a
> la vez. La opción por defecto es la del retardo.

## Detalle por gesto

### Crear (botón `+`)

- Un solo toque crea el nodo con los valores por defecto de `config.js`.
- El nodo aparece en el centro visible y queda seleccionado/listo.
- Se persiste de inmediato.

### Mover (arrastrar)

- Funciona con **Pointer Events** para unificar mouse y táctil (recomendado), o
  con `mouse*` + `touch*` como alternativa.
- Durante el arrastre el nodo sigue al puntero con movimiento **fluido**.
- El nodo arrastrado se muestra por encima de los demás (mayor `z-index`).
- Evitar el desplazamiento/scroll de la página durante el arrastre táctil
  (p. ej. `touch-action: none` sobre el nodo).
- **Guardado:** durante el movimiento se puede aplicar *debounce*; la posición
  **final** (al `pointerup`) se guarda siempre e inmediatamente.

### Cambiar forma (clic simple)

- Avanza a la siguiente forma de `shapeSequence`; tras la última, vuelve a la
  primera (cíclico).
- Se persiste de inmediato.

### Editar texto (doble clic)

- Muestra un campo editable (input/textarea o `contenteditable`) con el texto
  actual y el foco puesto.
- **Terminar edición y guardar** cuando:
  - el campo pierde el foco (*blur*), o
  - se presiona **Enter** (en campo de una línea).
- **Cancelar** (revertir al texto previo) al presionar **Escape**.
- Al terminar, salir del modo edición y persistir el texto (si no se canceló).
- Un nodo con texto vacío es válido; no obliga a escribir nada.

### Archivar

- Un toque en la acción de archivar pone `archived = true` y retira el nodo del
  lienzo.
- No pide confirmación (principio: guardado sin fricción), pero **no elimina**
  el dato, de modo que la acción es recuperable en el futuro.

## Accesibilidad de la interacción

- Todas las zonas interactivas miden al menos **44 × 44 px**.
- No depender del *hover*: toda acción disponible con clic/hover debe estarlo
  también al tacto.
- Objetivos de toque suficientemente separados para evitar toques erróneos.

## Resumen de valores que provienen de `config.js`

- `dragThreshold` — px para considerar el gesto un arrastre.
- `doubleClickDelay` — ms de la ventana para detectar doble clic.
- `shapeSequence` — orden de las formas.

Ver [`CONFIGURATION.md`](CONFIGURATION.md) para la lista completa.
