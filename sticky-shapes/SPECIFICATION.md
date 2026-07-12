# Especificación — Sticky Shapes

> Documento principal del proyecto. Responde a **¿qué debe hacer?**
>
> Nivel: documento de requisitos de software (SRS) ligero. Cualquier LLM debe
> poder generar la aplicación completa a partir de este documento junto con
> `INTERACTION_RULES.md`, `CONFIGURATION.md` y `DESIGN_PRINCIPLES.md`.

## 1. Objetivo

Crear una aplicación web de **una sola página** (SPA) que se pueda hospedar
completamente en **GitHub Pages**.

- No utiliza servidor.
- No utiliza base de datos.
- Toda la información se almacena en **Local Storage** del navegador.
- Debe funcionar **offline** después de cargarse por primera vez.

## 2. Alcance

La versión 1.0 permite crear pequeños **nodos** que contienen texto, moverlos por
un lienzo, cambiar su forma, editar su texto y archivarlos. Nada más. Todo lo
demás pertenece al [ROADMAP](ROADMAP.md).

## 3. Tecnologías

- HTML5
- CSS3
- JavaScript moderno (ES6+)
- Sin frameworks
- Sin dependencias externas
- Sin proceso de *build*

## 4. Terminología

- **Nodo (Node):** el elemento fundamental. Hoy contiene texto; en el futuro
  podría contener imágenes, enlaces, tareas, etc. Por eso se llama "nodo" y no
  "nota". No usar la palabra "Nota" en el código.
- **Lienzo (Canvas):** el área de trabajo donde viven los nodos. *No* se refiere
  al elemento `<canvas>` de HTML; es un contenedor DOM.
- **Archivar:** ocultar un nodo del lienzo sin eliminarlo del almacenamiento.

## 5. Modelo de datos

Cada nodo es un objeto con las siguientes propiedades:

| Propiedad | Tipo | Descripción |
|---|---|---|
| `id` | string | Identificador único e inmutable (p. ej. UUID o timestamp + aleatorio). |
| `text` | string | Contenido textual del nodo. |
| `x` | number | Posición horizontal (px) respecto al lienzo. |
| `y` | number | Posición vertical (px) respecto al lienzo. |
| `shape` | string | Forma actual. Uno de los valores de `shapeSequence` en `config.js`. |
| `archived` | boolean | `true` si está archivado; `false` si está visible. |
| `createdAt` | number | Timestamp de creación (para orden y depuración). |
| `updatedAt` | number | Timestamp de la última modificación. |

El estado completo de la aplicación es una **colección de nodos** más, si hace
falta, metadatos mínimos (p. ej. versión del esquema para futuras migraciones).

### Ejemplo de estado serializado

```json
{
  "version": 1,
  "nodes": [
    {
      "id": "n_8f3a",
      "text": "Llamar a Ana",
      "x": 240,
      "y": 130,
      "shape": "square",
      "archived": false,
      "createdAt": 1731000000000,
      "updatedAt": 1731000000000
    }
  ]
}
```

## 6. Persistencia

- Toda la información se guarda **automáticamente** en Local Storage.
- **No existe** botón de "Guardar".
- Cada modificación se guarda **inmediatamente** (crear, mover, editar, cambiar
  forma, archivar).
- Se recomienda guardar en `updatedAt` cada cambio.
- Al abrir la aplicación deben recuperarse **exactamente**: posición, texto,
  forma y estado de archivado de cada nodo.
- La clave de almacenamiento proviene de `config.js` (`storageKey`).
- Si el dato guardado es inválido o está corrupto, la app debe iniciar con un
  lienzo vacío sin romperse (fallo elegante).
- Los guardados frecuentes (por ejemplo, durante el arrastre) pueden usar
  *debounce* para no escribir en cada píxel; la posición **final** siempre se
  persiste.

## 7. Pantalla principal

La pantalla contiene únicamente:

- Un **lienzo** de trabajo que ocupa toda la ventana.
- Un **botón flotante `+`** para crear nuevos nodos.

No hay menús, barras ni paneles. La interfaz es minimalista (ver
[`DESIGN_PRINCIPLES.md`](DESIGN_PRINCIPLES.md)).

## 8. Funcionalidades

### 8.1 Crear nodo

Al presionar el botón `+` se crea un nodo nuevo con valores iniciales tomados de
`config.js`:

- `text`: valor de `defaultText`.
- `shape`: valor de `defaultShape`.
- Posición: **centro de la ventana visible** (o según `defaultPosition`).
- `archived`: `false`.

El nodo aparece de inmediato y queda persistido.

### 8.2 Mover nodo

Cada nodo se puede arrastrar con el dedo o el mouse. El detalle del gesto vive en
[`INTERACTION_RULES.md`](INTERACTION_RULES.md). Al soltar, la nueva posición se
guarda de inmediato.

### 8.3 Cambiar forma

Un clic simple sobre el nodo avanza su forma según `shapeSequence` de `config.js`
(por defecto: `square → circle → triangle → square …`). El cambio se persiste.

### 8.4 Editar texto

Un doble clic entra en modo edición mostrando un campo editable. Al terminar
(perder el foco o presionar Enter/Escape según reglas de interacción), el texto
se guarda y se sale del modo edición.

### 8.5 Archivar

Cada nodo ofrece una acción para archivarse (botón discreto, icono o menú
contextual). Al archivar:

- El nodo **desaparece** del lienzo principal.
- **Permanece** almacenado (no se elimina).
- `archived` pasa a `true`.

En la versión 1.0 no existe pantalla de archivados (ver ROADMAP); basta con que
el dato se conserve para poder mostrarse en el futuro.

## 9. Diseño para el futuro

El código debe permitir añadir después, sin reescribir la arquitectura:

- Pantalla de archivados.
- Búsqueda.
- Colores.
- Categorías o etiquetas.
- Conexiones entre nodos.

Ver [`ROADMAP.md`](ROADMAP.md).

## 10. Compatibilidad

- Escritorio, tableta y teléfono.
- Funciona con **mouse** y con **pantallas táctiles**.
- El área mínima de interacción táctil es **44 × 44 px** (accesibilidad).

## 11. Organización del código

Solo cuatro archivos, sin generar ninguno adicional:

- `index.html` — únicamente estructura.
- `style.css` — únicamente diseño.
- `script.js` — únicamente lógica; lee todos sus valores desde `config.js`.
- `config.js` — todos los valores configurables (ver [`CONFIGURATION.md`](CONFIGURATION.md)).

## 12. Calidad del código

- Legible, modular y comentado.
- Funciones pequeñas y con una sola responsabilidad.
- No duplicar lógica.
- **Ningún valor configurable escrito directamente en `script.js`**; todos
  provienen de `config.js`.

## 13. Criterios de aceptación

- [ ] Crear nuevos nodos con el botón `+`.
- [ ] Arrastrar nodos libremente con dedo o mouse.
- [ ] Recordar la posición después de cerrar y reabrir el navegador.
- [ ] Editar el texto con doble clic.
- [ ] Cambiar la forma con un clic simple (secuencia de `config.js`).
- [ ] Archivar nodos sin eliminarlos.
- [ ] Persistencia completa con Local Storage, sin botón de guardar.
- [ ] Funcionar desde GitHub Pages, sin servidor, y offline tras la primera carga.
- [ ] Área táctil mínima de 44 × 44 px.
- [ ] Un solo clic no dispara accidentalmente la edición, y un doble clic no
      dispara accidentalmente dos cambios de forma (ver reglas de interacción).
