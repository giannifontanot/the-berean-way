Quiero extender una aplicación web ya existente. NO debes reescribir la aplicación desde cero. Debes respetar la arquitectura actual y únicamente agregar la funcionalidad descrita a continuación.

## Contexto actual

La aplicación consiste en un único escritorio (workspace) donde el usuario puede colocar hojas de árbol.

Actualmente existe:

- Un botón circular color naranja en la esquina inferior derecha.
- Al presionarlo aparece una nueva hoja.
- Cada hoja puede moverse libremente.
- Cada hoja contiene un pequeño texto editable.
- Toda la información se guarda en localStorage.
- Al volver a abrir la aplicación, todas las hojas permanecen exactamente donde estaban.

Todo esto YA FUNCIONA y NO debe romperse.

------------------------------------------------------------

## Nueva funcionalidad

Quiero convertir el escritorio único en un sistema de múltiples escritorios independientes.

Cada escritorio representa un espacio diferente para organizar oraciones.

Ejemplos:

- Familia
- Trabajo
- Iglesia
- Amigos
- Salud

Aunque inicialmente no tendrán nombre; únicamente existirán como escritorios independientes.

------------------------------------------------------------

## Crear un nuevo escritorio

Agregar un nuevo botón.

Características:

- Color gris.
- Posición:
  esquina superior derecha.
- Ícono:
  "+" o cualquier símbolo sencillo para crear un escritorio nuevo.

Al hacer clic:

- se crea un nuevo escritorio vacío
- automáticamente se navega a ese escritorio
- conserva el escritorio anterior exactamente igual

No existe límite de escritorios.

------------------------------------------------------------

## Navegación entre escritorios

En la parte superior, centrado horizontalmente, debe existir un indicador de escritorios.

Debe parecer similar al indicador de páginas de un teléfono móvil.

Ejemplo:

● ○ ○ ○ ○

Cada punto representa un escritorio.

El escritorio activo debe verse diferente.

Por ejemplo:

- más grande
- más brillante
- mayor opacidad

Los demás puntos permanecen pequeños.

------------------------------------------------------------

## Comportamiento

Cuando el usuario toca uno de los puntos:

NO debe recargarse la página.

Debe cambiar únicamente el escritorio visible.

Cada escritorio contiene únicamente sus propias hojas.

Las hojas de un escritorio nunca aparecen en otro.

------------------------------------------------------------

## Animación

Al cambiar entre escritorios debe existir una transición suave.

La transición deseada es:

1. Fade Out del escritorio actual.
2. Cambiar el contenido.
3. Fade In del nuevo escritorio.

Duración aproximada:

250–350 ms.

Debe sentirse fluida y elegante.

No utilizar animaciones exageradas.

------------------------------------------------------------

## Persistencia

Toda la información debe almacenarse en localStorage.

Debe persistirse:

- cantidad de escritorios
- escritorio activo
- hojas de cada escritorio
- posición de cada hoja
- texto de cada hoja
- cualquier propiedad existente

Si el navegador se cierra:

al volver a abrir la aplicación todo debe restaurarse exactamente igual.

------------------------------------------------------------

## Modelo de datos sugerido

En lugar de almacenar una sola lista de hojas, ahora debe existir algo equivalente a:

workspaces

Cada workspace contiene:

- id
- lista de hojas

Cada hoja mantiene exactamente la misma estructura que actualmente utiliza la aplicación.

No cambiar el modelo interno de cada hoja si no es necesario.

------------------------------------------------------------

## Compatibilidad

Debe mantenerse el comportamiento actual.

Crear hojas sigue funcionando exactamente igual.

Mover hojas sigue funcionando exactamente igual.

Editar texto sigue funcionando exactamente igual.

La única diferencia es que ahora cada hoja pertenece al escritorio activo.

------------------------------------------------------------

## Requisitos técnicos

- Mantener el estilo visual existente.
- No romper funcionalidades actuales.
- No duplicar código innecesariamente.
- Reutilizar componentes existentes cuando sea posible.
- Mantener una arquitectura limpia y modular.
- Separar claramente la lógica de navegación de escritorios de la lógica de las hojas.
- El código debe ser fácilmente extensible para futuras funciones como:
    - renombrar escritorios
    - eliminar escritorios
    - reordenar escritorios
    - exportar un escritorio
    - importar un escritorio

------------------------------------------------------------

## Objetivo de diseño

El usuario debe sentir que tiene un escritorio infinito dividido en pequeños espacios independientes.

Cada escritorio es un pequeño "jardín de oración".

La navegación debe ser extremadamente sencilla, casi invisible, para que la atención permanezca en las hojas y no en la interfaz.
