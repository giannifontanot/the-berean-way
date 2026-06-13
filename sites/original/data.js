/* ============================================================
   PLANTILLA (original) — contenido base
   ------------------------------------------------------------
   ESTE es el único archivo que editas para personalizar a un alumno.
   Para crear un alumno nuevo:
     1. Copia toda la carpeta sites/original  →  sites/s-XXXXXXXX
        (usa un código no adivinable, no el nombre real — ver ROSTER.md)
     2. Edita SOLO este data.js dentro de la carpeta nueva.
   No toques index.html ni la carpeta assets/.

   Tipos de página:
     type: "accordion"  → usa "purpose" + "items" (heading/body)
     type: "gallery"    → usa "lead" + "images" (src/caption)
   El campo "body" admite HTML (puedes usar <p>, <strong>, etc.).
   ============================================================ */

window.STUDENT_SITE = {
  title: "Los estudios de Samuel",
  student: "",   // nombre para el saludo interno (no aparece en la URL). Ej: "Samuel"

  // Encabezado propio de este alumno (background del header). Opcional.
  // Si lo omites, se usa el header compartido (assets/img/header-bg.svg).
  // Pon la imagen en la carpeta img/ del alumno y referénciala así:
  // headerImage: "img/header.svg",

  // Pie de página con background (igual que el header). Opcional.
  // Si omites "image", se usa el footer compartido (assets/img/footer-bg.svg).
  footer: {
    // image: "img/footer.svg",
    title: "El que permanece en él, anda como él anduvo.",
    text: "Los estudios de Samuel · 1 Juan 2:6"
  },

  pages: [
    {
      slug: "restaurando",
      title: "Restaurando el carácter de Jesús",
      type: "accordion",
      purpose: "Ayudar a formar el carácter de la persona tomando como base el ejemplo de Cristo.",
      items: [
        {
          heading: "1 Juan 2:6",
          body: "<p>«El que dice que permanece en él, debe andar como él anduvo.»</p>" +
                "<p>Seguir el ejemplo de Cristo es la medida del carácter cristiano.</p>"
        },
        {
          heading: "Lucas 4:1-13",
          body: "<p>Jesús vence la tentación en el desierto respondiendo con la Escritura.</p>"
        },
        {
          heading: "Lucas 4:33-37",
          body: "<p>La autoridad de su palabra: libera al hombre del espíritu inmundo.</p>"
        },
        {
          heading: "Lucas 4:42-44",
          body: "<p>Su propósito: anunciar el reino de Dios en otras ciudades también.</p>"
        },
        {
          heading: "Lucas 7:46-48",
          body: "<p>El perdón y el amor: «sus muchos pecados le son perdonados, porque amó mucho.»</p>"
        }
      ]
    },

    {
      slug: "tentaciones",
      title: "Las tentaciones en el desierto",
      type: "accordion",
      purpose: "Aprender de cómo Jesús respondió a la tentación para enfrentar las nuestras.",
      items: [
        { heading: "Primera tentación — el pan", body: "<p>«No solo de pan vivirá el hombre.» (Lucas 4:4)</p>" },
        { heading: "Segunda tentación — los reinos", body: "<p>«Al Señor tu Dios adorarás, y a él solo servirás.» (Lucas 4:8)</p>" },
        { heading: "Tercera tentación — el templo", body: "<p>«No tentarás al Señor tu Dios.» (Lucas 4:12)</p>" }
      ]
    },

    {
      slug: "galeria",
      title: "Galería",
      type: "gallery",
      lead: "Toca una imagen para verla en grande.",
      images: [
        { src: "img/foto-1.svg", caption: "Descripción 1" },
        { src: "img/foto-2.svg", caption: "Descripción 2" },
        { src: "img/foto-3.svg", caption: "Descripción 3" },
        { src: "img/foto-4.svg", caption: "Descripción 4" }
      ]
    }
  ]
};
