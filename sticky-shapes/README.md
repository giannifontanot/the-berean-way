# Sticky Shapes

Aplicación web de **una sola página** para capturar ideas rápidas como pequeños
**nodos** que puedes mover libremente por un lienzo. Cada nodo recuerda su
posición, su texto y su forma incluso después de cerrar el navegador.

Pensada para funcionar **completamente en el navegador**, sin servidor ni base de
datos, y hospedarse gratis en **GitHub Pages**.

---

## Qué es

Un lienzo minimalista donde:

- Creas nodos con un botón `+`.
- Los arrastras con el dedo o el mouse a donde quieras.
- Cambias su forma con un clic (cuadrado → círculo → triángulo → cuadrado…).
- Editas su texto con doble clic.
- Los archivas cuando ya no los necesitas a la vista (sin borrarlos).

Todo se guarda **automáticamente**. No existe botón de "Guardar".

## Qué problema resuelve

Capturar ideas sueltas sin fricción: sin cuentas, sin instalar nada, sin
sincronización, sin esperar. Abres la página y tus ideas están donde las dejaste.

## Tecnologías

- HTML5
- CSS3
- JavaScript moderno (ES6+)
- **Local Storage** del navegador para persistencia

## Qué NO utiliza

- Sin servidor (backend).
- Sin base de datos.
- Sin frameworks (React, Vue, etc.).
- Sin dependencias externas ni CDN.
- Sin proceso de *build* (no hay `npm`, `webpack`, etc.).

Debe funcionar **offline** después de la primera carga.

## Cómo ejecutarla localmente

No requiere compilación. Basta con abrir `index.html` en el navegador. Para
evitar restricciones de algunos navegadores con `file://`, es preferible servirla
por HTTP:

```bash
# Con Python 3
python3 -m http.server 8000
# Luego abre http://localhost:8000
```

## Cómo desplegar en GitHub Pages

1. Sube estos archivos a un repositorio de GitHub.
2. Ve a **Settings → Pages**.
3. En **Source**, elige la rama (`main`) y la carpeta raíz (`/`).
4. Guarda. En unos minutos tendrás la URL pública.

La aplicación es 100% estática, así que no requiere ninguna configuración
adicional.

## Documentación del proyecto

Este repositorio es también un **paquete de especificación** listo para entregar
a un LLM y generar la aplicación. Los documentos son:

| Archivo | Responde a la pregunta |
|---|---|
| [`SPECIFICATION.md`](SPECIFICATION.md) | ¿Qué debe hacer? |
| [`DESIGN_PRINCIPLES.md`](DESIGN_PRINCIPLES.md) | ¿Cómo debe sentirse? |
| [`INTERACTION_RULES.md`](INTERACTION_RULES.md) | ¿Qué ocurre al tocar la pantalla? |
| [`CONFIGURATION.md`](CONFIGURATION.md) | ¿Qué debe ser configurable? |
| [`ROADMAP.md`](ROADMAP.md) | ¿Hacia dónde va el proyecto? |

> **Regla de oro:** cada dato tiene **una sola fuente de verdad**. Los valores
> concretos viven en `config.js`. Si un documento y el código se contradicen,
> gana `SPECIFICATION.md` para el *qué*, e `INTERACTION_RULES.md` para el
> *comportamiento*.

## Estructura de archivos de la aplicación

```
index.html    # Solo estructura
style.css     # Solo diseño
script.js     # Solo lógica (lee sus valores desde config.js)
config.js     # Panel de control: todos los valores configurables
```

## Licencia

Uso libre. Adáptalo a tus necesidades.
