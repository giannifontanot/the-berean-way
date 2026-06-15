/* Usuario: Pedro  (carpeta: s-122aef50) */
/* CONTROL DE PUBLICACIÓN: published:true muestra la lección en el menú;
   published:false la oculta. Cambia false → true para revelar la siguiente. */
window.STUDENT_SITE = {
  title: "Los estudios de Pedro",
  student: "Pedro",
  /* Sin headerImage ni footer.image → usa las imágenes por defecto del sitio */
  footer: {
    title: "Como los de Berea, escudriñaban cada día las Escrituras.",
    text: "Hechos 17:11"
  },
  pages: [
    {
      slug: "leccion-1",
      title: "Lección 1: ¿Quién es Jesús?",
      published: true,
      type: "accordion",
      purpose: "Conocer a Jesús tal como lo presenta la Escritura, antes de seguirlo.",
      items: [
        { heading: "Juan 1:1-14", body: "<p>El Verbo era Dios y se hizo carne. Escribe aquí tus notas.</p>" },
        { heading: "Colosenses 1:15-20", body: "<p>Imagen del Dios invisible; en él todo subsiste.</p>" },
        { heading: "Para reflexionar", body: "<p>¿Qué cambia en mi vida si Jesús es realmente quien dice ser?</p>" }
      ]
    },

    {
      slug: "leccion-2",
      title: "Lección 2: La Palabra de Dios",
      published: false,
      type: "accordion",
      purpose: "Entender por qué la Biblia es la base firme para conocer a Dios.",
      items: [
        { heading: "2 Timoteo 3:16-17", body: "<p>Toda la Escritura es inspirada por Dios. Notas aquí.</p>" },
        { heading: "Hechos 17:11", body: "<p>Los de Berea examinaban cada día las Escrituras.</p>" }
      ]
    },

    {
      slug: "leccion-3",
      title: "Lección 3: El arrepentimiento",
      published: false,
      type: "accordion",
      purpose: "Comprender qué es volverse a Dios de todo corazón.",
      items: [
        { heading: "Hechos 3:19", body: "<p>«Arrepentíos y convertíos, para que sean borrados vuestros pecados.»</p>" },
        { heading: "Lucas 15:11-24", body: "<p>El hijo pródigo: el regreso al Padre.</p>" }
      ]
    },

    {
      slug: "leccion-4",
      title: "Lección 4: La fe y la salvación",
      published: false,
      type: "accordion",
      purpose: "Ver que la salvación es un regalo de Dios recibido por fe.",
      items: [
        { heading: "Efesios 2:8-9", body: "<p>Por gracia sois salvos por medio de la fe.</p>" },
        { heading: "Romanos 10:9-10", body: "<p>Confesar y creer para ser salvo.</p>" }
      ]
    },

    {
      slug: "leccion-5",
      title: "Lección 5: El bautismo",
      published: false,
      type: "accordion",
      purpose: "Conocer el significado del bautismo como paso de obediencia.",
      items: [
        { heading: "Romanos 6:3-4", body: "<p>Sepultados con él en el bautismo para andar en vida nueva.</p>" },
        { heading: "Mateo 28:19-20", body: "<p>El mandato de hacer discípulos y bautizarlos.</p>" }
      ]
    },

    {
      slug: "leccion-6",
      title: "Lección 6: La oración",
      published: false,
      type: "accordion",
      purpose: "Aprender a hablar con Dios como con un Padre.",
      items: [
        { heading: "Mateo 6:9-13", body: "<p>El modelo de oración que Jesús enseñó.</p>" },
        { heading: "Filipenses 4:6-7", body: "<p>Por nada estéis afanosos; presentad vuestras peticiones.</p>" }
      ]
    },

    {
      slug: "leccion-7",
      title: "Lección 7: El Espíritu Santo",
      published: false,
      type: "accordion",
      purpose: "Reconocer la obra del Espíritu en la vida del creyente.",
      items: [
        { heading: "Juan 14:16-17", body: "<p>El Consolador que estará con nosotros para siempre.</p>" },
        { heading: "Gálatas 5:22-23", body: "<p>El fruto del Espíritu.</p>" }
      ]
    },

    {
      slug: "leccion-8",
      title: "Lección 8: La iglesia y la comunión",
      published: false,
      type: "accordion",
      purpose: "Entender el valor de caminar junto a otros creyentes.",
      items: [
        { heading: "Hechos 2:42-47", body: "<p>Perseveraban en la doctrina, la comunión y la oración.</p>" },
        { heading: "Hebreos 10:24-25", body: "<p>No dejar de congregarnos.</p>" }
      ]
    },

    {
      slug: "leccion-9",
      title: "Lección 9: El carácter cristiano",
      published: false,
      type: "accordion",
      purpose: "Crecer en el carácter de Cristo en lo cotidiano.",
      items: [
        { heading: "1 Juan 2:6", body: "<p>El que permanece en él, debe andar como él anduvo.</p>" },
        { heading: "Mateo 5:1-12", body: "<p>Las bienaventuranzas: el corazón del reino.</p>" }
      ]
    },

    {
      slug: "leccion-10",
      title: "Lección 10: La esperanza — el regreso de Cristo",
      published: false,
      type: "accordion",
      purpose: "Vivir con la esperanza del regreso de Jesús.",
      items: [
        { heading: "Juan 14:1-3", body: "<p>«Vendré otra vez y os tomaré a mí mismo.»</p>" },
        { heading: "1 Tesalonicenses 4:16-17", body: "<p>El Señor descenderá del cielo.</p>" }
      ]
    }
  ]
};
