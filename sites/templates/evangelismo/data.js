/* PLANTILLA: Serie Evangelismo */
/* CONTROL DE PUBLICACIÓN: published:true muestra la lección en el menú;
   published:false la oculta. Cambia false → true para revelar la siguiente. */
window.STUDENT_SITE = {
  title: "Evangelismo con NOMBRE",
  student: "NOMBRE",
  footer: {
    title: "Como los de Berea, escudriñaban cada día las Escrituras.",
    text: "Hechos 17:11"
  },
  pages: [
    {
      slug: "leccion-1",
      title: "Lección 1: El evangelio en una frase",
      published: true,
      type: "accordion",
      purpose: "Ser capaz de explicar el evangelio de forma clara y breve.",
      items: [
        { heading: "1 Corintios 15:3-4", body: "<p>Cristo murió por nuestros pecados, fue sepultado y resucitó al tercer día. Practica decirlo con tus propias palabras.</p>" },
        { heading: "Romanos 1:16", body: "<p>El evangelio es poder de Dios para salvación.</p>" },
        { heading: "Para practicar", body: "<p>Escribe el evangelio en 2-3 oraciones como si se lo explicaras a un amigo.</p>" }
      ]
    },
    {
      slug: "leccion-2",
      title: "Lección 2: El problema del pecado",
      published: false,
      type: "accordion",
      purpose: "Entender por qué todos necesitamos el evangelio.",
      items: [
        { heading: "Romanos 3:23", body: "<p>«Todos pecaron y están destituidos de la gloria de Dios.»</p>" },
        { heading: "Romanos 6:23", body: "<p>«La paga del pecado es muerte.»</p>" }
      ]
    },
    {
      slug: "leccion-3",
      title: "Lección 3: La obra de Cristo en la cruz",
      published: false,
      type: "accordion",
      purpose: "Comprender lo que Jesús logró en la cruz por nosotros.",
      items: [
        { heading: "Isaías 53:4-6", body: "<p>Él llevó nuestros pecados; por su llaga fuimos nosotros curados.</p>" },
        { heading: "2 Corintios 5:21", body: "<p>Al que no conoció pecado, por nosotros lo hizo pecado.</p>" }
      ]
    },
    {
      slug: "leccion-4",
      title: "Lección 4: Cómo compartir tu fe",
      published: false,
      type: "accordion",
      purpose: "Aprender a iniciar conversaciones espirituales de manera natural.",
      items: [
        { heading: "Colosenses 4:5-6", body: "<p>Andad sabiamente para con los de afuera; que vuestra conversación sea siempre con gracia.</p>" },
        { heading: "Juan 4:7-26", body: "<p>Jesús y la mujer samaritana: el arte de llegar al corazón.</p>" }
      ]
    },
    {
      slug: "leccion-5",
      title: "Lección 5: Responder objeciones comunes",
      published: false,
      type: "accordion",
      purpose: "Estar preparado para responder preguntas difíciles con gracia y verdad.",
      items: [
        { heading: "1 Pedro 3:15", body: "<p>Estad siempre preparados para dar razón de vuestra esperanza, pero con mansedumbre.</p>" },
        { heading: "Objeciones frecuentes", body: "<p>¿Cómo puede Dios permitir el sufrimiento? ¿Hay un solo camino? ¿La Biblia es confiable?</p>" }
      ]
    },
    {
      slug: "leccion-6",
      title: "Lección 6: La urgencia — el tiempo es corto",
      published: false,
      type: "accordion",
      purpose: "Sentir el peso eterno de compartir el evangelio ahora.",
      items: [
        { heading: "2 Corintios 6:2", body: "<p>«Ahora es el tiempo aceptable; ahora es el día de salvación.»</p>" },
        { heading: "Ezequiel 33:8", body: "<p>La responsabilidad del que conoce la verdad.</p>" }
      ]
    },
    {
      slug: "leccion-7",
      title: "Lección 7: Orar por los perdidos",
      published: false,
      type: "accordion",
      purpose: "Hacer de la intercesión el fundamento de nuestro evangelismo.",
      items: [
        { heading: "1 Timoteo 2:1-4", body: "<p>Que se hagan rogativas, oraciones, peticiones y acciones de gracias por todos los hombres.</p>" },
        { heading: "Para practicar", body: "<p>Escribe 3 nombres de personas perdidas por quienes orarás esta semana.</p>" }
      ]
    },
    {
      slug: "leccion-8",
      title: "Lección 8: El discipulado del nuevo creyente",
      published: false,
      type: "accordion",
      purpose: "Saber qué hacer después de que alguien cree.",
      items: [
        { heading: "Mateo 28:19-20", body: "<p>«Id y haced discípulos… enseñándoles que guarden todas las cosas que os he mandado.»</p>" },
        { heading: "1 Tesalonicenses 2:7-8", body: "<p>Como la nodriza que cuida a sus propios hijos, compartimos no solo el evangelio sino también nuestras propias vidas.</p>" }
      ]
    },
    {
      slug: "leccion-9",
      title: "Lección 9: Historias bíblicas de evangelismo",
      published: false,
      type: "accordion",
      purpose: "Aprender de los evangelistas de la Biblia.",
      items: [
        { heading: "Hechos 8:26-38", body: "<p>Felipe y el etíope: seguir la guía del Espíritu y explicar las Escrituras.</p>" },
        { heading: "Hechos 17:16-34", body: "<p>Pablo en Atenas: hablar al contexto cultural sin comprometer el mensaje.</p>" }
      ]
    },
    {
      slug: "leccion-10",
      title: "Lección 10: Vivir como testigo cada día",
      published: false,
      type: "accordion",
      purpose: "Integrar el evangelismo en la vida diaria, no como evento sino como estilo de vida.",
      items: [
        { heading: "Hechos 1:8", body: "<p>«Me seréis testigos en Jerusalén, en Judea, en Samaria y hasta lo último de la tierra.»</p>" },
        { heading: "Mateo 5:13-16", body: "<p>Sal de la tierra y luz del mundo: visibilidad sin arrogancia.</p>" }
      ]
    }
  ]
};
