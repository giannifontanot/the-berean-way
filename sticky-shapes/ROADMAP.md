# Roadmap — Sticky Shapes

> Responde a **¿hacia dónde va el proyecto?** No describe lo que ya existe
> (eso es `SPECIFICATION.md`), sino lo que vendrá. Sirve para que el LLM tome
> decisiones de arquitectura que no cierren estas puertas.

## Versión 1.0 — Base (alcance actual)

- Crear hojas.
- Mover hojas (arrastre con dedo o mouse).
- Cambiar de estado soltando la hoja en una zona (Rama izquierda · Rama derecha ·
  Piso).
- Cambiar la variante de hoja con un clic.
- Editar el texto con doble clic.
- Estética arcade Donkey Kong 80s (árbol de dos ramas, neón sobre fondo oscuro).
- Borrar hojas arrastrándolas al basurero.
- Persistencia completa con Local Storage.
- Despliegue en GitHub Pages, funcionamiento offline.

## Versión 1.1 — Más ramas y archivado

- **Más zonas/estados** configurables (p. ej. un tercer o cuarto grupo) sin
  tocar la lógica, solo `statuses` en `config.js`.
- **Archivar/ocultar** una hoja de verdad (fuera de las tres zonas) y una vista
  para restaurarla.

## Versión 1.2 — Etiquetas y categorías

- Añadir una o varias **etiquetas** por hoja.
- Filtrar el árbol por etiqueta.

## Versión 1.3 — Búsqueda

- Campo de búsqueda que filtra hojas por texto y/o etiqueta en tiempo real.

## Versión 2.0 — Conexiones entre hojas

- Dibujar **conexiones** (líneas/ramas) entre hojas: el árbol se vuelve un
  mapa mental / lienzo infinito.
- Requiere que cada hoja tenga `id` estable (ya previsto en el modelo de datos).

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
