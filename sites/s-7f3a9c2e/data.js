/* ============================================================
   ALUMNO: Samuel  (carpeta: s-7f3a9c2e)
   Copia de la plantilla original con contenido personalizado.
   Edita libremente este archivo; no toques index.html ni assets/.
   ============================================================ */

window.STUDENT_SITE = {
  title: "Los estudios de Samuel",
  student: "Samuel",

  // Encabezado propio de Samuel (imagen en su carpeta img/).
  headerImage: "img/header.svg",

  // Pie de página propio de Samuel.
  footer: {
    image: "img/footer.svg",
    title: "Sigue adelante, Samuel",
    text: "«El que comenzó en ti la buena obra, la perfeccionará.» (Filipenses 1:6)"
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
                "<p><strong>Nota para Samuel:</strong> esta semana, anota un momento en que seguiste el ejemplo de Cristo.</p>"
        },
        { heading: "Lucas 4:1-13", body: "<p>Jesús vence la tentación en el desierto respondiendo con la Escritura.</p>" },
        { heading: "Lucas 4:33-37", body: "<p>La autoridad de su palabra: libera al hombre del espíritu inmundo.</p>" }
      ]
    },

    {
      slug: "galeria",
      title: "Galería",
      type: "gallery",
      lead: "Imágenes del estudio de esta semana.",
      images: [
        { src: "img/foto-1.svg", caption: "Versículo de la semana" },
        { src: "img/foto-2.svg", caption: "Mapa de Galilea" }
      ]
    }
  ]
};
