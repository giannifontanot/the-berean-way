/* lesson-builder-state: eyJzaXRlVGl0bGUiOiJMb3MgZXN0dWRpb3MgZGUgTk9NQlJFIiwic3R1ZGVudCI6Ik5PTUJSRSIsImxlc3NvbnMiOlt7InRpdGxlIjoiTGVjY2nDs24gMTogwr9RdWnDqW4gZXMgSmVzw7pzPyIsInNyYyI6IkNvbm9jZXIgYSBKZXPDunMgdGFsIGNvbW8gbG8gcHJlc2VudGEgbGEgRXNjcml0dXJhLCBhbnRlcyBkZSBzZWd1aXJsby5cblxuPVxuIyMjIEp1YW4gMToxLTE0XG5FbCBWZXJibyBlcmEgRGlvcyB5IHNlIGhpem8gY2FybmUuIEVzY3JpYmUgYXF1w60gdHVzIG5vdGFzLlxuPT1cblxuPVxuIyMjIENvbG9zZW5zZXMgMToxNS0yMFxuSW1hZ2VuIGRlbCBEaW9zIGludmlzaWJsZTsgZW4gw6lsIHRvZG8gc3Vic2lzdGUuXG49PVxuXG49XG4jIyMgUGFyYSByZWZsZXhpb25hclxuwr9RdcOpIGNhbWJpYSBlbiBtaSB2aWRhIHNpIEplc8O6cyBlcyByZWFsbWVudGUgcXVpZW4gZGljZSBzZXI/XG49PVxuIiwiaGVhZGVySW1hZ2UiOiIiLCJmb290ZXJJbWFnZSI6IiJ9LHsidGl0bGUiOiJMZWNjacOzbiAyOiBMYSBQYWxhYnJhIGRlIERpb3MiLCJzcmMiOiJFbnRlbmRlciBwb3IgcXXDqSBsYSBCaWJsaWEgZXMgbGEgYmFzZSBmaXJtZSBwYXJhIGNvbm9jZXIgYSBEaW9zLlxuXG49XG4jIyMgMiBUaW1vdGVvIDM6MTYtMTdcblRvZGEgbGEgRXNjcml0dXJhIGVzIGluc3BpcmFkYSBwb3IgRGlvcy4gTm90YXMgYXF1w60uXG49PVxuXG49XG4jIyMgSGVjaG9zIDE3OjExXG5Mb3MgZGUgQmVyZWEgZXhhbWluYWJhbiBjYWRhIGTDrWEgbGFzIEVzY3JpdHVyYXMuXG49PVxuIiwiaGVhZGVySW1hZ2UiOiIiLCJmb290ZXJJbWFnZSI6IiJ9LHsidGl0bGUiOiJMZWNjacOzbiAzOiBFbCBhcnJlcGVudGltaWVudG8iLCJzcmMiOiJDb21wcmVuZGVyIHF1w6kgZXMgdm9sdmVyc2UgYSBEaW9zIGRlIHRvZG8gY29yYXrDs24uXG5cbj1cbiMjIyBIZWNob3MgMzoxOVxuwqtBcnJlcGVudMOtb3MgeSBjb252ZXJ0w61vcywgcGFyYSBxdWUgc2VhbiBib3JyYWRvcyB2dWVzdHJvcyBwZWNhZG9zLsK7XG49PVxuXG49XG4jIyMgTHVjYXMgMTU6MTEtMjRcbkVsIGhpam8gcHLDs2RpZ286IGVsIHJlZ3Jlc28gYWwgUGFkcmUuXG49PVxuIiwiaGVhZGVySW1hZ2UiOiIiLCJmb290ZXJJbWFnZSI6IiJ9LHsidGl0bGUiOiJMZWNjacOzbiA0OiBMYSBmZSB5IGxhIHNhbHZhY2nDs24iLCJzcmMiOiJWZXIgcXVlIGxhIHNhbHZhY2nDs24gZXMgdW4gcmVnYWxvIGRlIERpb3MgcmVjaWJpZG8gcG9yIGZlLlxuXG49XG4jIyMgRWZlc2lvcyAyOjgtOVxuUG9yIGdyYWNpYSBzb2lzIHNhbHZvcyBwb3IgbWVkaW8gZGUgbGEgZmUuXG49PVxuXG49XG4jIyMgUm9tYW5vcyAxMDo5LTEwXG5Db25mZXNhciB5IGNyZWVyIHBhcmEgc2VyIHNhbHZvLlxuPT1cbiIsImhlYWRlckltYWdlIjoiIiwiZm9vdGVySW1hZ2UiOiIifSx7InRpdGxlIjoiTGVjY2nDs24gNTogRWwgYmF1dGlzbW8iLCJzcmMiOiJDb25vY2VyIGVsIHNpZ25pZmljYWRvIGRlbCBiYXV0aXNtbyBjb21vIHBhc28gZGUgb2JlZGllbmNpYS5cblxuPVxuIyMjIFJvbWFub3MgNjozLTRcblNlcHVsdGFkb3MgY29uIMOpbCBlbiBlbCBiYXV0aXNtbyBwYXJhIGFuZGFyIGVuIHZpZGEgbnVldmEuXG49PVxuXG49XG4jIyMgTWF0ZW8gMjg6MTktMjBcbkVsIG1hbmRhdG8gZGUgaGFjZXIgZGlzY8OtcHVsb3MgeSBiYXV0aXphcmxvcy5cbj09XG4iLCJoZWFkZXJJbWFnZSI6IiIsImZvb3RlckltYWdlIjoiIn0seyJ0aXRsZSI6IkxlY2Npw7NuIDY6IExhIG9yYWNpw7NuIiwic3JjIjoiQXByZW5kZXIgYSBoYWJsYXIgY29uIERpb3MgY29tbyBjb24gdW4gUGFkcmUuXG5cbj1cbiMjIyBNYXRlbyA2OjktMTNcbkVsIG1vZGVsbyBkZSBvcmFjacOzbiBxdWUgSmVzw7pzIGVuc2XDscOzLlxuPT1cblxuPVxuIyMjIEZpbGlwZW5zZXMgNDo2LTdcblBvciBuYWRhIGVzdMOpaXMgYWZhbm9zb3M7IHByZXNlbnRhZCB2dWVzdHJhcyBwZXRpY2lvbmVzLlxuPT1cbiIsImhlYWRlckltYWdlIjoiIiwiZm9vdGVySW1hZ2UiOiIifSx7InRpdGxlIjoiTGVjY2nDs24gNzogRWwgRXNww61yaXR1IFNhbnRvIiwic3JjIjoiUmVjb25vY2VyIGxhIG9icmEgZGVsIEVzcMOtcml0dSBlbiBsYSB2aWRhIGRlbCBjcmV5ZW50ZS5cblxuPVxuIyMjIEp1YW4gMTQ6MTYtMTdcbkVsIENvbnNvbGFkb3IgcXVlIGVzdGFyw6EgY29uIG5vc290cm9zIHBhcmEgc2llbXByZS5cbj09XG5cbj1cbiMjIyBHw6FsYXRhcyA1OjIyLTIzXG5FbCBmcnV0byBkZWwgRXNww61yaXR1LlxuPT1cbiIsImhlYWRlckltYWdlIjoiIiwiZm9vdGVySW1hZ2UiOiIifSx7InRpdGxlIjoiTGVjY2nDs24gODogTGEgaWdsZXNpYSB5IGxhIGNvbXVuacOzbiIsInNyYyI6IkVudGVuZGVyIGVsIHZhbG9yIGRlIGNhbWluYXIganVudG8gYSBvdHJvcyBjcmV5ZW50ZXMuXG5cbj1cbiMjIyBIZWNob3MgMjo0Mi00N1xuUGVyc2V2ZXJhYmFuIGVuIGxhIGRvY3RyaW5hLCBsYSBjb211bmnDs24geSBsYSBvcmFjacOzbi5cbj09XG5cbj1cbiMjIyBIZWJyZW9zIDEwOjI0LTI1XG5ObyBkZWphciBkZSBjb25ncmVnYXJub3MuXG49PVxuIiwiaGVhZGVySW1hZ2UiOiIiLCJmb290ZXJJbWFnZSI6IiJ9LHsidGl0bGUiOiJMZWNjacOzbiA5OiBFbCBjYXLDoWN0ZXIgY3Jpc3RpYW5vIiwic3JjIjoiQ3JlY2VyIGVuIGVsIGNhcsOhY3RlciBkZSBDcmlzdG8gZW4gbG8gY290aWRpYW5vLlxuXG49XG4jIyMgMSBKdWFuIDI6NlxuRWwgcXVlIHBlcm1hbmVjZSBlbiDDqWwsIGRlYmUgYW5kYXIgY29tbyDDqWwgYW5kdXZvLlxuPT1cblxuPVxuIyMjIE1hdGVvIDU6MS0xMlxuTGFzIGJpZW5hdmVudHVyYW56YXM6IGVsIGNvcmF6w7NuIGRlbCByZWluby5cbj09XG4iLCJoZWFkZXJJbWFnZSI6IiIsImZvb3RlckltYWdlIjoiIn0seyJ0aXRsZSI6IkxlY2Npw7NuIDEwOiBMYSBlc3BlcmFuemEg4oCUIGVsIHJlZ3Jlc28gZGUgQ3Jpc3RvIiwic3JjIjoiVml2aXIgY29uIGxhIGVzcGVyYW56YSBkZWwgcmVncmVzbyBkZSBKZXPDunMuXG5cbj1cbiMjIyBKdWFuIDE0OjEtM1xuwqtWZW5kcsOpIG90cmEgdmV6IHkgb3MgdG9tYXLDqSBhIG3DrSBtaXNtby7Cu1xuPT1cblxuPVxuIyMjIDEgVGVzYWxvbmljZW5zZXMgNDoxNi0xN1xuRWwgU2XDsW9yIGRlc2NlbmRlcsOhIGRlbCBjaWVsby5cbj09XG4iLCJoZWFkZXJJbWFnZSI6IiIsImZvb3RlckltYWdlIjoiIn1dfQ== */
/* Generado con tools/lesson-builder.html — no edites la línea de arriba. */
/* published:true muestra la lección; published:false la oculta. */
window.STUDENT_SITE = {
  title: "Los estudios de NOMBRE",
  student: "NOMBRE",
  pages: [
    {
      slug: "leccion-1",
      title: "Lección 1: ¿Quién es Jesús?",
      published: true,
      type: "accordion",
      purposeHtml: "<p>Conocer a Jesús tal como lo presenta la Escritura, antes de seguirlo.</p>",
      items: [
        { heading: "Juan 1:1-14", body: "<p>El Verbo era Dios y se hizo carne. Escribe aquí tus notas.</p>" },
        { heading: "Colosenses 1:15-20", body: "<p>Imagen del Dios invisible; en él todo subsiste.</p>" },
        { heading: "Para reflexionar", body: "<p>¿Qué cambia en mi vida si Jesús es realmente quien dice ser?</p>" },
      ]
    },
    {
      slug: "leccion-2",
      title: "Lección 2: La Palabra de Dios",
      published: false,
      type: "accordion",
      purposeHtml: "<p>Entender por qué la Biblia es la base firme para conocer a Dios.</p>",
      items: [
        { heading: "2 Timoteo 3:16-17", body: "<p>Toda la Escritura es inspirada por Dios. Notas aquí.</p>" },
        { heading: "Hechos 17:11", body: "<p>Los de Berea examinaban cada día las Escrituras.</p>" },
      ]
    },
    {
      slug: "leccion-3",
      title: "Lección 3: El arrepentimiento",
      published: false,
      type: "accordion",
      purposeHtml: "<p>Comprender qué es volverse a Dios de todo corazón.</p>",
      items: [
        { heading: "Hechos 3:19", body: "<p>«Arrepentíos y convertíos, para que sean borrados vuestros pecados.»</p>" },
        { heading: "Lucas 15:11-24", body: "<p>El hijo pródigo: el regreso al Padre.</p>" },
      ]
    },
    {
      slug: "leccion-4",
      title: "Lección 4: La fe y la salvación",
      published: false,
      type: "accordion",
      purposeHtml: "<p>Ver que la salvación es un regalo de Dios recibido por fe.</p>",
      items: [
        { heading: "Efesios 2:8-9", body: "<p>Por gracia sois salvos por medio de la fe.</p>" },
        { heading: "Romanos 10:9-10", body: "<p>Confesar y creer para ser salvo.</p>" },
      ]
    },
    {
      slug: "leccion-5",
      title: "Lección 5: El bautismo",
      published: false,
      type: "accordion",
      purposeHtml: "<p>Conocer el significado del bautismo como paso de obediencia.</p>",
      items: [
        { heading: "Romanos 6:3-4", body: "<p>Sepultados con él en el bautismo para andar en vida nueva.</p>" },
        { heading: "Mateo 28:19-20", body: "<p>El mandato de hacer discípulos y bautizarlos.</p>" },
      ]
    },
    {
      slug: "leccion-6",
      title: "Lección 6: La oración",
      published: false,
      type: "accordion",
      purposeHtml: "<p>Aprender a hablar con Dios como con un Padre.</p>",
      items: [
        { heading: "Mateo 6:9-13", body: "<p>El modelo de oración que Jesús enseñó.</p>" },
        { heading: "Filipenses 4:6-7", body: "<p>Por nada estéis afanosos; presentad vuestras peticiones.</p>" },
      ]
    },
    {
      slug: "leccion-7",
      title: "Lección 7: El Espíritu Santo",
      published: false,
      type: "accordion",
      purposeHtml: "<p>Reconocer la obra del Espíritu en la vida del creyente.</p>",
      items: [
        { heading: "Juan 14:16-17", body: "<p>El Consolador que estará con nosotros para siempre.</p>" },
        { heading: "Gálatas 5:22-23", body: "<p>El fruto del Espíritu.</p>" },
      ]
    },
    {
      slug: "leccion-8",
      title: "Lección 8: La iglesia y la comunión",
      published: false,
      type: "accordion",
      purposeHtml: "<p>Entender el valor de caminar junto a otros creyentes.</p>",
      items: [
        { heading: "Hechos 2:42-47", body: "<p>Perseveraban en la doctrina, la comunión y la oración.</p>" },
        { heading: "Hebreos 10:24-25", body: "<p>No dejar de congregarnos.</p>" },
      ]
    },
    {
      slug: "leccion-9",
      title: "Lección 9: El carácter cristiano",
      published: false,
      type: "accordion",
      purposeHtml: "<p>Crecer en el carácter de Cristo en lo cotidiano.</p>",
      items: [
        { heading: "1 Juan 2:6", body: "<p>El que permanece en él, debe andar como él anduvo.</p>" },
        { heading: "Mateo 5:1-12", body: "<p>Las bienaventuranzas: el corazón del reino.</p>" },
      ]
    },
    {
      slug: "leccion-10",
      title: "Lección 10: La esperanza — el regreso de Cristo",
      published: false,
      type: "accordion",
      purposeHtml: "<p>Vivir con la esperanza del regreso de Jesús.</p>",
      items: [
        { heading: "Juan 14:1-3", body: "<p>«Vendré otra vez y os tomaré a mí mismo.»</p>" },
        { heading: "1 Tesalonicenses 4:16-17", body: "<p>El Señor descenderá del cielo.</p>" },
      ]
    }
  ]
};
