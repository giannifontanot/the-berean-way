# Roadmap — Sticky Shapes

> Responde a **¿hacia dónde va el proyecto?** No describe lo que ya existe
> (eso es `SPECIFICATION.md`), sino lo que vendrá. Sirve para que el LLM tome
> decisiones de arquitectura que no cierren estas puertas.

## Versión 1.0 — Base (alcance actual)

- Crear nodos.
- Mover nodos (arrastre con dedo o mouse).
- Cambiar la forma con un clic (cuadrado → círculo → triángulo).
- Editar el texto con doble clic.
- Archivar nodos (ocultar sin borrar).
- Persistencia completa con Local Storage.
- Despliegue en GitHub Pages, funcionamiento offline.

## Versión 1.1 — Archivados y colores

- **Pantalla / vista de archivados:** listar los nodos con `archived = true`,
  con opción de **restaurarlos** al lienzo.
- **Colores:** permitir asignar un color a cada nodo desde la paleta de
  `config.js`.

## Versión 1.2 — Etiquetas y categorías

- Añadir una o varias **etiquetas** por nodo.
- Filtrar el lienzo por etiqueta.

## Versión 1.3 — Búsqueda

- Campo de búsqueda que filtra nodos por texto y/o etiqueta en tiempo real.

## Versión 2.0 — Conexiones entre nodos

- Dibujar **conexiones** (líneas/flechas) entre nodos: el lienzo se vuelve un
  mapa mental / lienzo infinito.
- Requiere que cada nodo tenga `id` estable (ya previsto en el modelo de datos).

## Versión 3.0 — Sincronización en la nube

- Guardado opcional en un servicio externo para sincronizar entre dispositivos.
- Local Storage sigue siendo el modo por defecto y offline.

## Versión 4.0 — Colaboración en tiempo real

- Varios usuarios editando el mismo lienzo simultáneamente.

## Implicaciones para la arquitectura de la 1.0

Para que estas versiones no exijan reescribir la base, la 1.0 debe:

- Usar un **`id` único e inmutable** por nodo (habilita conexiones y sync).
- Guardar el estado como una **colección de nodos** con un `schemaVersion`, para
  permitir **migraciones** futuras.
- Tratar `archived` como un simple filtro de visualización, no como borrado
  (habilita la vista de archivados sin cambios en el almacenamiento).
- Mantener el **renderizado de formas genérico** (guiado por el valor `shape`),
  para poder añadir formas sin tocar la lógica.
- Separar **datos**, **lógica**, **estilo** y **configuración** en sus archivos
  respectivos, de modo que cada nueva función se sume sin reescribir lo anterior.
