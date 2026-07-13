# Reglas de interacción — Sticky Shapes (Árbol de Oración)

> Responde a **¿qué ocurre cuando el usuario toca la pantalla?** Este documento
> es la autoridad sobre el **comportamiento de los gestos**. Si algo aquí
> contradice a otro documento respecto a *cómo se comporta* un gesto, gana este.

## Gestos soportados

| Gesto | Objetivo | Resultado |
|---|---|---|
| Clic / toque simple | Hoja | Cambia la **variante de hoja** (avanza en `leafShapes`). |
| Doble clic / doble toque | Hoja | Entra en modo **edición de texto**. |
| Arrastrar (*drag*) | Hoja | Mueve la hoja; al soltar, guarda posición y **recalcula el estado** según la zona. |
| Clic / toque | Botón `+` | Crea una hoja nueva. |
| Arrastrar y soltar sobre el cofre del tesoro | Hoja | **Borra** la hoja definitivamente. |

## Prioridad y desambiguación de gestos (por retardo)

Clic simple (cambiar variante) y doble clic (editar) comparten el mismo elemento,
y todo doble clic empieza con clics simples. Se usa **desambiguación por
retardo**, que es la regla obligatoria de esta app:

1. **Arrastre gana sobre clic.** Si el puntero se mueve más que `dragThreshold`
   px (de `config.js`) entre `pointerdown` y `pointerup`, el gesto es un
   **arrastre**, no un clic. No cambia variante ni edita.
2. **Distinguir clic simple de doble clic con retardo.** Al detectar un clic que
   no fue arrastre, **espera** `doubleClickDelay` ms (de `config.js`):
   - Si llega un segundo clic dentro de esa ventana → **doble clic** →
     entrar en edición. **No** se cambia la variante.
   - Si no llega → **clic simple** → cambiar la variante de hoja.

   Implementación típica: al primer clic, arranca un temporizador de
   `doubleClickDelay` ms; si un segundo clic llega antes, cancela el temporizador
   y edita; si expira, cicla la variante. Con esto, un doble clic **nunca**
   dispara cambios de variante antes de editar.

## Detalle por gesto

### Crear (botón `+`)

- Un solo toque crea la hoja con los valores por defecto de `config.js`
  (`defaultText`, `defaultShape`, `defaultStatus`).
- Aparece dentro de la zona de `defaultStatus` (por defecto, el **piso**).
- Se persiste de inmediato.

### Mover (arrastrar) y cambiar de estado

- Usar **Pointer Events** para unificar mouse y táctil (recomendado).
- Durante el arrastre la hoja sigue al puntero con movimiento **fluido** y se
  muestra por encima de las demás (mayor `z-index`).
- Evitar el scroll de la página durante el arrastre táctil
  (`touch-action: none` sobre la hoja).
- Se puede resaltar sutilmente la **zona bajo el puntero** para indicar a qué
  estado caería la hoja (opcional, discreto).
- **Al soltar (`pointerup`):**
  1. Guardar la posición final `x/y`.
  2. Determinar la zona que contiene el punto de soltado (usando
     `statuses[].region` de `config.js`) y asignar ese `status`.
  3. Persistir de inmediato.
- Durante el movimiento se puede aplicar *debounce* al guardado; el estado final
  siempre se persiste.

### Borrar (arrastrar al cofre del tesoro)

- El cofre del tesoro vive en una esquina, semitransparente cuando no se usa.
- Al iniciar un arrastre se hace visible; cuando la hoja está encima, se
  enciende con dorado neón (`theme.treasure`).
- Soltar la hoja sobre él la **elimina** del lienzo y de Local Storage.
- No pide confirmación: el gesto es deliberado (hay que llevar la hoja hasta la
  esquina). El resaltado dorado es el aviso.

### Cambiar variante de hoja (clic simple)

- Avanza a la siguiente variante de `leafShapes`; tras la última, vuelve a la
  primera (cíclico).
- Se persiste de inmediato. No cambia estado ni posición.

### Editar texto (doble clic)

- Muestra un campo editable con el texto actual y el foco puesto.
- **Terminar y guardar** cuando: el campo pierde el foco (*blur*), o se presiona
  **Enter**.
- **Cancelar** (revertir) con **Escape**.
- Al terminar, salir del modo edición y persistir (si no se canceló).
- Una hoja con texto vacío es válida.

## Accesibilidad de la interacción

- Todas las zonas interactivas miden al menos **44 × 44 px** (`minTouchTarget`).
- No depender del *hover*: toda acción con clic debe estar disponible al tacto.
- Objetivos de toque suficientemente separados para evitar toques erróneos.

## Valores que provienen de `config.js`

- `dragThreshold` — px para considerar el gesto un arrastre.
- `doubleClickDelay` — ms de la ventana para detectar doble clic.
- `leafShapes` — variantes de hoja y su orden de ciclo.
- `statuses[].region` — geometría de cada zona/estado.

Ver [`CONFIGURATION.md`](CONFIGURATION.md) para la lista completa.
