# Especificación — Sticky Shapes (Árbol de Ideas)

> Documento principal del proyecto. Responde a **¿qué debe hacer?**
>
> Nivel: documento de requisitos de software (SRS) ligero. Cualquier LLM debe
> poder generar la aplicación completa a partir de este documento junto con
> `INTERACTION_RULES.md`, `CONFIGURATION.md` y `DESIGN_PRINCIPLES.md`.

## 1. Objetivo

Crear una aplicación web de **una sola página** (SPA) que se pueda hospedar
completamente en **GitHub Pages**.

El usuario captura ideas como **hojas** con texto que cuelgan de un **árbol de
dos ramas**. Arrastrar una hoja de una rama a otra (o al piso) **cambia su
estado**, agrupando las ideas en tres categorías.

- No utiliza servidor.
- No utiliza base de datos.
- Toda la información se almacena en **Local Storage** del navegador.
- Debe funcionar **offline** después de cargarse por primera vez.

## 2. Alcance (versión 1.0)

- Crear hojas con texto.
- Arrastrarlas libremente por el lienzo con dedo o mouse.
- **Cambiar su estado** soltándolas en una de las tres zonas (Rama izquierda,
  Rama derecha, Piso).
- Cambiar la **variante de hoja** con un clic simple.
- Editar el texto con doble clic.
- Persistir todo automáticamente.
- Estética **arcade Donkey Kong de los 80** con contornos de neón sobre fondo
  oscuro (ver [`DESIGN_PRINCIPLES.md`](DESIGN_PRINCIPLES.md)).

Todo lo demás pertenece al [ROADMAP](ROADMAP.md).

## 3. Tecnologías

- HTML5
- CSS3
- JavaScript moderno (ES6+)
- Gráficos vectoriales **SVG** para el árbol y las hojas (nítidos a cualquier
  tamaño y fáciles de estilizar con neón).
- Sin frameworks, sin dependencias externas, sin proceso de *build*.

## 4. Terminología

- **Hoja (Leaf):** el elemento fundamental. Contiene texto y representa una idea.
  Internamente sigue siendo un "nodo": el nombre técnico del objeto es `node`,
  pero visualmente es una hoja. No usar la palabra "Nota".
- **Árbol (Tree):** el fondo del lienzo. Tiene **dos ramas** y un **piso**.
- **Zona / Estado (Status):** región del lienzo que define el estado de una hoja.
  Hay tres: `rama-izquierda`, `rama-derecha`, `piso`. Los nombres e IDs vienen de
  `config.js`.
- **Variante de hoja (Leaf shape):** el estilo visual de la hoja (p. ej. hoja de
  roble, de arce, simple). Cicla con un clic simple.
- **Lienzo (Canvas):** el área de trabajo donde vive el árbol y las hojas. *No*
  es el elemento `<canvas>` de HTML; es un contenedor DOM/SVG.

## 5. Modelo de datos

Cada hoja es un objeto con estas propiedades:

| Propiedad | Tipo | Descripción |
|---|---|---|
| `id` | string | Identificador único e inmutable. |
| `text` | string | Contenido textual de la hoja. |
| `x` | number | Posición horizontal (px) respecto al lienzo. |
| `y` | number | Posición vertical (px) respecto al lienzo. |
| `shape` | string | Variante de hoja. Uno de los valores de `leafShapes` en `config.js`. |
| `status` | string | Estado/zona actual. Uno de los IDs de `statuses` en `config.js`. |
| `createdAt` | number | Timestamp de creación. |
| `updatedAt` | number | Timestamp de la última modificación. |

> **Nota sobre `x/y` y `status`:** son **independientes**. `x/y` guarda la
> posición exacta (para restaurarla tal cual). `status` guarda a qué zona
> pertenece la hoja. Al soltar una hoja, se recalcula `status` según la zona que
> contiene el punto de soltado, y se guarda también la posición exacta.

### Ejemplo de estado serializado

```json
{
  "version": 2,
  "nodes": [
    {
      "id": "n_8f3a",
      "text": "Escribir el prólogo",
      "x": 220,
      "y": 140,
      "shape": "leaf-oak",
      "status": "rama-izquierda",
      "createdAt": 1731000000000,
      "updatedAt": 1731000000000
    }
  ]
}
```

## 6. Persistencia

- Toda la información se guarda **automáticamente** en Local Storage. **No existe
  botón de "Guardar".**
- Cada modificación (crear, mover, editar, cambiar variante, cambiar estado) se
  guarda de inmediato. Durante el arrastre puede usarse *debounce*; la posición y
  el estado **finales** siempre se persisten.
- Al abrir la app deben recuperarse exactamente: texto, posición, variante y
  **estado** de cada hoja.
- La clave de almacenamiento proviene de `config.js` (`storageKey`).
- Si el dato guardado es inválido o corrupto, la app inicia con un lienzo vacío
  sin romperse (fallo elegante).
- El estado incluye una **versión de esquema** (`version` / `schemaVersion`) para
  permitir migraciones futuras.

## 7. Pantalla principal

La pantalla contiene únicamente:

- El **árbol de dos ramas** dibujado como fondo (SVG), con sus tres zonas
  (rama izquierda, rama derecha, piso).
- Las **hojas** del usuario, posicionadas sobre el árbol.
- Un **botón flotante `+`** para crear nuevas hojas.

No hay menús, barras ni paneles. Interfaz minimalista y con estética arcade.

### Zonas

- Las tres zonas cubren el lienzo (por defecto: rama izquierda arriba-izquierda,
  rama derecha arriba-derecha, piso en la franja inferior).
- La geometría de cada zona proviene de `config.js` (`statuses[].region`,
  coordenadas normalizadas 0..1) para que se adapte a cualquier tamaño de
  pantalla.
- Una hoja pertenece a la zona que **contiene su posición**. Puede darse una
  señal visual sutil de la zona activa mientras se arrastra (opcional).

## 8. Funcionalidades

### 8.1 Crear hoja

Al presionar `+` se crea una hoja con valores de `config.js`:

- `text`: `defaultText`.
- `shape`: `defaultShape` (una variante de hoja).
- `status`: `defaultStatus` (por defecto `piso`, como "bandeja de entrada").
- Posición: dentro de la zona de `defaultStatus` (o `defaultPosition`).

Aparece de inmediato y queda persistida.

### 8.2 Mover hoja y cambiar de estado

Cada hoja se arrastra con dedo o mouse (ver [`INTERACTION_RULES.md`](INTERACTION_RULES.md)).
Al **soltar**:

1. Se guarda la nueva posición `x/y`.
2. Se recalcula `status` según la zona que contiene el punto de soltado.
3. Se persiste todo de inmediato.

Así, **pasar una hoja de una rama a otra = cambiar su estado**.

### 8.3 Cambiar variante de hoja (clic simple)

Un clic simple avanza la variante según `leafShapes` de `config.js` (cíclico).
Se persiste de inmediato. **No** cambia el estado ni la posición.

### 8.4 Editar texto (doble clic)

Un doble clic entra en modo edición con un campo editable. Al terminar (blur o
Enter) se guarda; con Escape se cancela. Ver reglas de interacción.

### 8.5 Estados (en lugar de "archivar")

En esta versión, el antiguo "archivar" se sustituye por el **modelo de tres
estados**. El "Piso" puede usarse como bandeja de entrada o como "hecho/en
reposo", según prefiera el usuario. Ninguna hoja se oculta ni se borra: cambiar
de estado es siempre reversible arrastrando de vuelta.

### 8.6 Borrar hoja (cofre del tesoro)

En una esquina de la pantalla hay un **cofre del tesoro** discreto. Mientras se arrastra
una hoja, el cofre del tesoro se hace visible; al **soltar la hoja sobre él**, la hoja se
**elimina** definitivamente (del lienzo y de Local Storage).

- El cofre del tesoro permanece semitransparente cuando no se arrastra nada.
- Se **enciende** (resplandor dorado neón) cuando la hoja arrastrada está encima,
  para avisar que soltarla ahí la borrará.
- No se pide confirmación: llevar la hoja hasta el cofre del tesoro ya es una acción
  deliberada.

> Una **vista de archivados oculta** queda para el ROADMAP.

## 9. Compatibilidad

- Escritorio, tableta y teléfono.
- Funciona con **mouse** y con **pantallas táctiles**.
- Área mínima de interacción táctil: **44 × 44 px** (`minTouchTarget` en config).

## 10. Organización del código

Solo cuatro archivos, sin generar ninguno adicional:

- `index.html` — únicamente estructura (incluye o referencia el SVG del árbol).
- `style.css` — únicamente diseño (tema neón; colores desde variables CSS
  alineadas con `config.js`).
- `script.js` — únicamente lógica; lee todos sus valores desde `config.js`.
- `config.js` — todos los valores configurables (ver [`CONFIGURATION.md`](CONFIGURATION.md)).

## 11. Calidad del código

- Legible, modular y comentado; funciones pequeñas de una sola responsabilidad.
- No duplicar lógica.
- **Ningún valor configurable escrito directamente en `script.js`**; todo viene
  de `config.js`.
- El dibujo de hojas debe ser **genérico**, guiado por el valor `shape`, para
  poder añadir variantes sin tocar la lógica.

## 12. Criterios de aceptación

- [ ] Crear nuevas hojas con el botón `+`.
- [ ] Arrastrar hojas libremente con dedo o mouse.
- [ ] Soltar una hoja en otra zona **cambia su estado** y lo recuerda.
- [ ] Recordar posición, variante y estado tras cerrar y reabrir el navegador.
- [ ] Editar el texto con doble clic.
- [ ] Cambiar la variante de hoja con un clic simple.
- [ ] El fondo es un **bonsái de dos ramas** con tres zonas (rama izq., rama
      der., piso) y ramitas secundarias para acomodar muchas hojas.
- [ ] Arrastrar una hoja al **cofre del tesoro** la elimina, y el borrado persiste.
- [ ] Estética **arcade Donkey Kong 80s** con contornos de neón sobre fondo
      oscuro.
- [ ] Persistencia completa con Local Storage, sin botón de guardar.
- [ ] Funcionar desde GitHub Pages, sin servidor, offline tras la primera carga.
- [ ] Un clic no dispara la edición, y un doble clic no cicla dos veces la
      variante (desambiguación por retardo — ver reglas de interacción).
