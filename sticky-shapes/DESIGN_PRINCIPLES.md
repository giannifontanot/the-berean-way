# Principios de diseño — Sticky Shapes

> Responde a **¿cómo debe sentirse?** No describe funciones (eso es
> `SPECIFICATION.md`) ni gestos concretos (eso es `INTERACTION_RULES.md`). Aquí
> viven la filosofía y los criterios que guían decisiones cuando la
> especificación no cubre un detalle.

## Filosofía

Sticky Shapes es una herramienta para **pensar rápido**. El usuario tiene una
idea y quiere dejarla en la pantalla antes de que se le olvide. Cada obstáculo
entre "tengo una idea" y "la idea está en el lienzo" es un fracaso del diseño.

## Principios rectores

Cuando haya que elegir, estos principios deciden. Están ordenados: el de más
arriba gana.

1. **Nunca perder información.** El dato del usuario es sagrado. Ante la duda,
   conserva; no elimines. Guarda pronto y guarda siempre.
2. **La aplicación debe sentirse instantánea.** Sin esperas, sin *spinners*, sin
   latencia perceptible. Todo ocurre en el navegador y debe reflejarse de
   inmediato.
3. **Cada acción con el menor número posible de clics.** Crear, mover, cambiar y
   editar deben ser directos. Nada de asistentes ni pasos intermedios.
4. **Nunca pedir confirmación para guardar.** El guardado es automático e
   invisible. No hay diálogos de "¿Deseas guardar?".
5. **Priorizar la simplicidad sobre la cantidad de funciones.** Es mejor hacer
   pocas cosas de forma impecable que muchas a medias.
6. **El código debe poder ampliarse sin reescribir la arquitectura.** Cada
   decisión debe dejar la puerta abierta al [ROADMAP](ROADMAP.md).

## Minimalismo visual

- Diseño limpio, con **mucho espacio en blanco**.
- Botones **discretos**; nada compite con el contenido del usuario.
- El lienzo es el protagonista; el resto de la interfaz casi desaparece.
- Sin **animaciones exageradas**. Las transiciones, si existen, son sutiles y
  rápidas (guía en `config.js`), y nunca retrasan una acción.

## Rendimiento

- Todo sucede en el cliente; no hay red que esperar.
- El arrastre debe ser **fluido** (idealmente a 60 fps). Evitar recalcular o
  reescribir el almacenamiento en cada píxel del movimiento; persistir la
  posición al soltar (ver reglas de interacción).
- La app debe abrir y restaurar el estado casi al instante, incluso con muchos
  nodos.

## Experiencia del usuario

- **Perdón y recuperación:** si algo sale mal (dato corrupto), la app arranca
  vacía en vez de romperse.
- **Predecible:** la misma acción produce siempre el mismo resultado.
- **Sin sorpresas:** ningún gesto destruye datos de forma irreversible sin una
  vía de recuperación (por eso "archivar" no es "borrar").
- **Táctil de verdad:** pensada para el dedo, no solo adaptada. Áreas de toque
  cómodas (mínimo 44 × 44 px), sin depender de *hover*.

## Calidad del código como principio de diseño

La mantenibilidad es parte de la experiencia (la del próximo desarrollador o del
próximo LLM que amplíe la app):

- Funciones pequeñas, con una sola responsabilidad.
- Nombres claros; el código se lee como prosa.
- **Una sola fuente de verdad** por cada dato o valor.
- Sin duplicar lógica.
- Todos los valores ajustables viven en `config.js`, nunca incrustados en la
  lógica.

## Regla de desempate

Si dos principios entran en conflicto, gana el que esté más arriba en la lista de
**Principios rectores**. Si aun así hay duda, elige la opción que **conserve más
datos** y requiera **menos pasos** al usuario.
