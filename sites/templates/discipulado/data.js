/* PLANTILLA: Serie Discipulado */
/* CONTROL DE PUBLICACIÓN: published:true muestra la lección en el menú;
   published:false la oculta. Cambia false → true para revelar la siguiente. */
window.STUDENT_SITE = {
  title: "Discipulado con NOMBRE",
  student: "NOMBRE",
  footer: {
    title: "Como los de Berea, escudriñaban cada día las Escrituras.",
    text: "Hechos 17:11"
  },
  pages: [
    {
      slug: "leccion-1",
      title: "Lección 1: Mi identidad en Cristo",
      published: true,
      type: "accordion",
      purpose: "Descubrir quién soy ahora que estoy en Cristo.",
      items: [
        { heading: "2 Corintios 5:17", body: "<p>«Si alguno está en Cristo, nueva criatura es.» ¿Qué ha cambiado en ti?</p>" },
        { heading: "Efesios 1:3-8", body: "<p>Bendecidos con toda bendición espiritual en Cristo.</p>" },
        { heading: "Para reflexionar", body: "<p>¿Qué mentiras sobre tu identidad debes reemplazar con la verdad de quién eres en Cristo?</p>" }
      ]
    },
    {
      slug: "leccion-2",
      title: "Lección 2: La obediencia como amor",
      published: false,
      type: "accordion",
      purpose: "Entender que obedecer a Dios no es religión sino amor.",
      items: [
        { heading: "Juan 14:15", body: "<p>«Si me amáis, guardad mis mandamientos.»</p>" },
        { heading: "1 Juan 5:3", body: "<p>Sus mandamientos no son gravosos.</p>" }
      ]
    },
    {
      slug: "leccion-3",
      title: "Lección 3: La Palabra diaria",
      published: false,
      type: "accordion",
      purpose: "Cultivar el hábito de leer y meditar la Biblia cada día.",
      items: [
        { heading: "Salmo 119:105", body: "<p>«Lámpara es a mis pies tu palabra.»</p>" },
        { heading: "Josué 1:8", body: "<p>Meditar de día y de noche; el camino próspero.</p>" }
      ]
    },
    {
      slug: "leccion-4",
      title: "Lección 4: La tentación y la victoria",
      published: false,
      type: "accordion",
      purpose: "Conocer cómo Dios provee salida en cada tentación.",
      items: [
        { heading: "1 Corintios 10:13", body: "<p>No os ha sobrevenido ninguna tentación que no sea humana.</p>" },
        { heading: "Santiago 4:7", body: "<p>Resistid al diablo y huirá de vosotros.</p>" }
      ]
    },
    {
      slug: "leccion-5",
      title: "Lección 5: El perdón — dar y recibir",
      published: false,
      type: "accordion",
      purpose: "Experimentar la libertad del perdón en ambas direcciones.",
      items: [
        { heading: "Efesios 4:32", body: "<p>Perdonándoos unos a otros, como Dios también os perdonó en Cristo.</p>" },
        { heading: "Mateo 18:21-35", body: "<p>La parábola del siervo que no perdonó.</p>" }
      ]
    },
    {
      slug: "leccion-6",
      title: "Lección 6: Servir como Jesús",
      published: false,
      type: "accordion",
      purpose: "Aprender que el liderazgo cristiano es servicio.",
      items: [
        { heading: "Marcos 10:43-45", body: "<p>«El que quiera ser grande entre vosotros será vuestro servidor.»</p>" },
        { heading: "Juan 13:12-17", body: "<p>Jesús lava los pies de sus discípulos.</p>" }
      ]
    },
    {
      slug: "leccion-7",
      title: "Lección 7: La mayordomía y el dar",
      published: false,
      type: "accordion",
      purpose: "Ver que todo lo que tenemos es de Dios y estamos llamados a ser generosos.",
      items: [
        { heading: "2 Corintios 9:6-8", body: "<p>El que siembra generosamente, generosamente también segará.</p>" },
        { heading: "Lucas 21:1-4", body: "<p>La ofrenda de la viuda: dar de lo que se tiene.</p>" }
      ]
    },
    {
      slug: "leccion-8",
      title: "Lección 8: Las relaciones que edifican",
      published: false,
      type: "accordion",
      purpose: "Cultivar relaciones sanas dentro y fuera del cuerpo de Cristo.",
      items: [
        { heading: "Proverbios 27:17", body: "<p>«El hierro con hierro se aguza; y así el hombre aguza el rostro de su amigo.»</p>" },
        { heading: "Romanos 12:9-13", body: "<p>El amor sincero y la vida en comunidad cristiana.</p>" }
      ]
    },
    {
      slug: "leccion-9",
      title: "Lección 9: Mi testimonio",
      published: false,
      type: "accordion",
      purpose: "Aprender a contar mi historia de fe de manera clara y natural.",
      items: [
        { heading: "1 Pedro 3:15", body: "<p>Estad siempre preparados para presentar defensa ante todo el que os demande razón de la esperanza que hay en vosotros.</p>" },
        { heading: "Hechos 26:1-23", body: "<p>Pablo comparte su testimonio: antes, el encuentro, el después.</p>" }
      ]
    },
    {
      slug: "leccion-10",
      title: "Lección 10: Perseverar hasta el final",
      published: false,
      type: "accordion",
      purpose: "Mantener la fe firme hasta ver a Cristo.",
      items: [
        { heading: "Hebreos 12:1-3", body: "<p>Corramos con paciencia la carrera que nos es propuesta, puestos los ojos en Jesús.</p>" },
        { heading: "Apocalipsis 2:10", body: "<p>«Sé fiel hasta la muerte, y yo te daré la corona de la vida.»</p>" }
      ]
    }
  ]
};
