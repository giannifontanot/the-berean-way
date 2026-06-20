/* lesson-builder-state: eyJzaXRlVGl0bGUiOiJFdmFuZ2VsaXNtbyBjb24gTk9NQlJFIiwic3R1ZGVudCI6Ik5PTUJSRSIsImxlc3NvbnMiOlt7InRpdGxlIjoiTGVjY2nDs24gMTogRWwgZXZhbmdlbGlvIGVuIHVuYSBmcmFzZSIsInNyYyI6IlNlciBjYXBheiBkZSBleHBsaWNhciBlbCBldmFuZ2VsaW8gZGUgZm9ybWEgY2xhcmEgeSBicmV2ZS5cblxuPVxuIyMjIDEgQ29yaW50aW9zIDE1OjMtNFxuQ3Jpc3RvIG11cmnDsyBwb3IgbnVlc3Ryb3MgcGVjYWRvcywgZnVlIHNlcHVsdGFkbyB5IHJlc3VjaXTDsyBhbCB0ZXJjZXIgZMOtYS4gUHJhY3RpY2EgZGVjaXJsbyBjb24gdHVzIHByb3BpYXMgcGFsYWJyYXMuXG49PVxuXG49XG4jIyMgUm9tYW5vcyAxOjE2XG5FbCBldmFuZ2VsaW8gZXMgcG9kZXIgZGUgRGlvcyBwYXJhIHNhbHZhY2nDs24uXG49PVxuXG49XG4jIyMgUGFyYSBwcmFjdGljYXJcbkVzY3JpYmUgZWwgZXZhbmdlbGlvIGVuIDItMyBvcmFjaW9uZXMgY29tbyBzaSBzZSBsbyBleHBsaWNhcmFzIGEgdW4gYW1pZ28uXG49PVxuIiwiaGVhZGVySW1hZ2UiOiIiLCJmb290ZXJJbWFnZSI6IiJ9LHsidGl0bGUiOiJMZWNjacOzbiAyOiBFbCBwcm9ibGVtYSBkZWwgcGVjYWRvIiwic3JjIjoiRW50ZW5kZXIgcG9yIHF1w6kgdG9kb3MgbmVjZXNpdGFtb3MgZWwgZXZhbmdlbGlvLlxuXG49XG4jIyMgUm9tYW5vcyAzOjIzXG7Cq1RvZG9zIHBlY2Fyb24geSBlc3TDoW4gZGVzdGl0dWlkb3MgZGUgbGEgZ2xvcmlhIGRlIERpb3Muwrtcbj09XG5cbj1cbiMjIyBSb21hbm9zIDY6MjNcbsKrTGEgcGFnYSBkZWwgcGVjYWRvIGVzIG11ZXJ0ZS7Cu1xuPT1cbiIsImhlYWRlckltYWdlIjoiIiwiZm9vdGVySW1hZ2UiOiIifSx7InRpdGxlIjoiTGVjY2nDs24gMzogTGEgb2JyYSBkZSBDcmlzdG8gZW4gbGEgY3J1eiIsInNyYyI6IkNvbXByZW5kZXIgbG8gcXVlIEplc8O6cyBsb2dyw7MgZW4gbGEgY3J1eiBwb3Igbm9zb3Ryb3MuXG5cbj1cbiMjIyBJc2HDrWFzIDUzOjQtNlxuw4lsIGxsZXbDsyBudWVzdHJvcyBwZWNhZG9zOyBwb3Igc3UgbGxhZ2EgZnVpbW9zIG5vc290cm9zIGN1cmFkb3MuXG49PVxuXG49XG4jIyMgMiBDb3JpbnRpb3MgNToyMVxuQWwgcXVlIG5vIGNvbm9jacOzIHBlY2FkbywgcG9yIG5vc290cm9zIGxvIGhpem8gcGVjYWRvLlxuPT1cbiIsImhlYWRlckltYWdlIjoiIiwiZm9vdGVySW1hZ2UiOiIifSx7InRpdGxlIjoiTGVjY2nDs24gNDogQ8OzbW8gY29tcGFydGlyIHR1IGZlIiwic3JjIjoiQXByZW5kZXIgYSBpbmljaWFyIGNvbnZlcnNhY2lvbmVzIGVzcGlyaXR1YWxlcyBkZSBtYW5lcmEgbmF0dXJhbC5cblxuPVxuIyMjIENvbG9zZW5zZXMgNDo1LTZcbkFuZGFkIHNhYmlhbWVudGUgcGFyYSBjb24gbG9zIGRlIGFmdWVyYTsgcXVlIHZ1ZXN0cmEgY29udmVyc2FjacOzbiBzZWEgc2llbXByZSBjb24gZ3JhY2lhLlxuPT1cblxuPVxuIyMjIEp1YW4gNDo3LTI2XG5KZXPDunMgeSBsYSBtdWplciBzYW1hcml0YW5hOiBlbCBhcnRlIGRlIGxsZWdhciBhbCBjb3JhesOzbi5cbj09XG4iLCJoZWFkZXJJbWFnZSI6IiIsImZvb3RlckltYWdlIjoiIn0seyJ0aXRsZSI6IkxlY2Npw7NuIDU6IFJlc3BvbmRlciBvYmplY2lvbmVzIGNvbXVuZXMiLCJzcmMiOiJFc3RhciBwcmVwYXJhZG8gcGFyYSByZXNwb25kZXIgcHJlZ3VudGFzIGRpZsOtY2lsZXMgY29uIGdyYWNpYSB5IHZlcmRhZC5cblxuPVxuIyMjIDEgUGVkcm8gMzoxNVxuRXN0YWQgc2llbXByZSBwcmVwYXJhZG9zIHBhcmEgZGFyIHJhesOzbiBkZSB2dWVzdHJhIGVzcGVyYW56YSwgcGVybyBjb24gbWFuc2VkdW1icmUuXG49PVxuXG49XG4jIyMgT2JqZWNpb25lcyBmcmVjdWVudGVzXG7Cv0PDs21vIHB1ZWRlIERpb3MgcGVybWl0aXIgZWwgc3VmcmltaWVudG8/IMK/SGF5IHVuIHNvbG8gY2FtaW5vPyDCv0xhIEJpYmxpYSBlcyBjb25maWFibGU/XG49PVxuIiwiaGVhZGVySW1hZ2UiOiIiLCJmb290ZXJJbWFnZSI6IiJ9LHsidGl0bGUiOiJMZWNjacOzbiA2OiBMYSB1cmdlbmNpYSDigJQgZWwgdGllbXBvIGVzIGNvcnRvIiwic3JjIjoiU2VudGlyIGVsIHBlc28gZXRlcm5vIGRlIGNvbXBhcnRpciBlbCBldmFuZ2VsaW8gYWhvcmEuXG5cbj1cbiMjIyAyIENvcmludGlvcyA2OjJcbsKrQWhvcmEgZXMgZWwgdGllbXBvIGFjZXB0YWJsZTsgYWhvcmEgZXMgZWwgZMOtYSBkZSBzYWx2YWNpw7NuLsK7XG49PVxuXG49XG4jIyMgRXplcXVpZWwgMzM6OFxuTGEgcmVzcG9uc2FiaWxpZGFkIGRlbCBxdWUgY29ub2NlIGxhIHZlcmRhZC5cbj09XG4iLCJoZWFkZXJJbWFnZSI6IiIsImZvb3RlckltYWdlIjoiIn0seyJ0aXRsZSI6IkxlY2Npw7NuIDc6IE9yYXIgcG9yIGxvcyBwZXJkaWRvcyIsInNyYyI6IkhhY2VyIGRlIGxhIGludGVyY2VzacOzbiBlbCBmdW5kYW1lbnRvIGRlIG51ZXN0cm8gZXZhbmdlbGlzbW8uXG5cbj1cbiMjIyAxIFRpbW90ZW8gMjoxLTRcblF1ZSBzZSBoYWdhbiByb2dhdGl2YXMsIG9yYWNpb25lcywgcGV0aWNpb25lcyB5IGFjY2lvbmVzIGRlIGdyYWNpYXMgcG9yIHRvZG9zIGxvcyBob21icmVzLlxuPT1cblxuPVxuIyMjIFBhcmEgcHJhY3RpY2FyXG5Fc2NyaWJlIDMgbm9tYnJlcyBkZSBwZXJzb25hcyBwZXJkaWRhcyBwb3IgcXVpZW5lcyBvcmFyw6FzIGVzdGEgc2VtYW5hLlxuPT1cbiIsImhlYWRlckltYWdlIjoiIiwiZm9vdGVySW1hZ2UiOiIifSx7InRpdGxlIjoiTGVjY2nDs24gODogRWwgZGlzY2lwdWxhZG8gZGVsIG51ZXZvIGNyZXllbnRlIiwic3JjIjoiU2FiZXIgcXXDqSBoYWNlciBkZXNwdcOpcyBkZSBxdWUgYWxndWllbiBjcmVlLlxuXG49XG4jIyMgTWF0ZW8gMjg6MTktMjBcbsKrSWQgeSBoYWNlZCBkaXNjw61wdWxvc+KApiBlbnNlw7HDoW5kb2xlcyBxdWUgZ3VhcmRlbiB0b2RhcyBsYXMgY29zYXMgcXVlIG9zIGhlIG1hbmRhZG8uwrtcbj09XG5cbj1cbiMjIyAxIFRlc2Fsb25pY2Vuc2VzIDI6Ny04XG5Db21vIGxhIG5vZHJpemEgcXVlIGN1aWRhIGEgc3VzIHByb3Bpb3MgaGlqb3MsIGNvbXBhcnRpbW9zIG5vIHNvbG8gZWwgZXZhbmdlbGlvIHNpbm8gdGFtYmnDqW4gbnVlc3RyYXMgcHJvcGlhcyB2aWRhcy5cbj09XG4iLCJoZWFkZXJJbWFnZSI6IiIsImZvb3RlckltYWdlIjoiIn0seyJ0aXRsZSI6IkxlY2Npw7NuIDk6IEhpc3RvcmlhcyBiw61ibGljYXMgZGUgZXZhbmdlbGlzbW8iLCJzcmMiOiJBcHJlbmRlciBkZSBsb3MgZXZhbmdlbGlzdGFzIGRlIGxhIEJpYmxpYS5cblxuPVxuIyMjIEhlY2hvcyA4OjI2LTM4XG5GZWxpcGUgeSBlbCBldMOtb3BlOiBzZWd1aXIgbGEgZ3XDrWEgZGVsIEVzcMOtcml0dSB5IGV4cGxpY2FyIGxhcyBFc2NyaXR1cmFzLlxuPT1cblxuPVxuIyMjIEhlY2hvcyAxNzoxNi0zNFxuUGFibG8gZW4gQXRlbmFzOiBoYWJsYXIgYWwgY29udGV4dG8gY3VsdHVyYWwgc2luIGNvbXByb21ldGVyIGVsIG1lbnNhamUuXG49PVxuIiwiaGVhZGVySW1hZ2UiOiIiLCJmb290ZXJJbWFnZSI6IiJ9LHsidGl0bGUiOiJMZWNjacOzbiAxMDogVml2aXIgY29tbyB0ZXN0aWdvIGNhZGEgZMOtYSIsInNyYyI6IkludGVncmFyIGVsIGV2YW5nZWxpc21vIGVuIGxhIHZpZGEgZGlhcmlhLCBubyBjb21vIGV2ZW50byBzaW5vIGNvbW8gZXN0aWxvIGRlIHZpZGEuXG5cbj1cbiMjIyBIZWNob3MgMTo4XG7Cq01lIHNlcsOpaXMgdGVzdGlnb3MgZW4gSmVydXNhbMOpbiwgZW4gSnVkZWEsIGVuIFNhbWFyaWEgeSBoYXN0YSBsbyDDumx0aW1vIGRlIGxhIHRpZXJyYS7Cu1xuPT1cblxuPVxuIyMjIE1hdGVvIDU6MTMtMTZcblNhbCBkZSBsYSB0aWVycmEgeSBsdXogZGVsIG11bmRvOiB2aXNpYmlsaWRhZCBzaW4gYXJyb2dhbmNpYS5cbj09XG4iLCJoZWFkZXJJbWFnZSI6IiIsImZvb3RlckltYWdlIjoiIn1dfQ== */
/* Generado con tools/lesson-builder.html — no edites la línea de arriba. */
/* published:true muestra la lección; published:false la oculta. */
window.SITE_DATA = window.SITE_DATA || {};
window.SITE_DATA["evangelismo"] = {
  title: "Evangelismo con NOMBRE",
  student: "NOMBRE",
  pages: [
    {
      slug: "leccion-1",
      title: "Lección 1: El evangelio en una frase",
      published: true,
      type: "accordion",
      purposeHtml: "<p>Ser capaz de explicar el evangelio de forma clara y breve.</p>",
      items: [
        { heading: "1 Corintios 15:3-4", body: "<p>Cristo murió por nuestros pecados, fue sepultado y resucitó al tercer día. Practica decirlo con tus propias palabras.</p>" },
        { heading: "Romanos 1:16", body: "<p>El evangelio es poder de Dios para salvación.</p>" },
        { heading: "Para practicar", body: "<p>Escribe el evangelio en 2-3 oraciones como si se lo explicaras a un amigo.</p>" },
      ]
    },
    {
      slug: "leccion-2",
      title: "Lección 2: El problema del pecado",
      published: false,
      type: "accordion",
      purposeHtml: "<p>Entender por qué todos necesitamos el evangelio.</p>",
      items: [
        { heading: "Romanos 3:23", body: "<p>«Todos pecaron y están destituidos de la gloria de Dios.»</p>" },
        { heading: "Romanos 6:23", body: "<p>«La paga del pecado es muerte.»</p>" },
      ]
    },
    {
      slug: "leccion-3",
      title: "Lección 3: La obra de Cristo en la cruz",
      published: false,
      type: "accordion",
      purposeHtml: "<p>Comprender lo que Jesús logró en la cruz por nosotros.</p>",
      items: [
        { heading: "Isaías 53:4-6", body: "<p>Él llevó nuestros pecados; por su llaga fuimos nosotros curados.</p>" },
        { heading: "2 Corintios 5:21", body: "<p>Al que no conoció pecado, por nosotros lo hizo pecado.</p>" },
      ]
    },
    {
      slug: "leccion-4",
      title: "Lección 4: Cómo compartir tu fe",
      published: false,
      type: "accordion",
      purposeHtml: "<p>Aprender a iniciar conversaciones espirituales de manera natural.</p>",
      items: [
        { heading: "Colosenses 4:5-6", body: "<p>Andad sabiamente para con los de afuera; que vuestra conversación sea siempre con gracia.</p>" },
        { heading: "Juan 4:7-26", body: "<p>Jesús y la mujer samaritana: el arte de llegar al corazón.</p>" },
      ]
    },
    {
      slug: "leccion-5",
      title: "Lección 5: Responder objeciones comunes",
      published: false,
      type: "accordion",
      purposeHtml: "<p>Estar preparado para responder preguntas difíciles con gracia y verdad.</p>",
      items: [
        { heading: "1 Pedro 3:15", body: "<p>Estad siempre preparados para dar razón de vuestra esperanza, pero con mansedumbre.</p>" },
        { heading: "Objeciones frecuentes", body: "<p>¿Cómo puede Dios permitir el sufrimiento? ¿Hay un solo camino? ¿La Biblia es confiable?</p>" },
      ]
    },
    {
      slug: "leccion-6",
      title: "Lección 6: La urgencia — el tiempo es corto",
      published: false,
      type: "accordion",
      purposeHtml: "<p>Sentir el peso eterno de compartir el evangelio ahora.</p>",
      items: [
        { heading: "2 Corintios 6:2", body: "<p>«Ahora es el tiempo aceptable; ahora es el día de salvación.»</p>" },
        { heading: "Ezequiel 33:8", body: "<p>La responsabilidad del que conoce la verdad.</p>" },
      ]
    },
    {
      slug: "leccion-7",
      title: "Lección 7: Orar por los perdidos",
      published: false,
      type: "accordion",
      purposeHtml: "<p>Hacer de la intercesión el fundamento de nuestro evangelismo.</p>",
      items: [
        { heading: "1 Timoteo 2:1-4", body: "<p>Que se hagan rogativas, oraciones, peticiones y acciones de gracias por todos los hombres.</p>" },
        { heading: "Para practicar", body: "<p>Escribe 3 nombres de personas perdidas por quienes orarás esta semana.</p>" },
      ]
    },
    {
      slug: "leccion-8",
      title: "Lección 8: El discipulado del nuevo creyente",
      published: false,
      type: "accordion",
      purposeHtml: "<p>Saber qué hacer después de que alguien cree.</p>",
      items: [
        { heading: "Mateo 28:19-20", body: "<p>«Id y haced discípulos… enseñándoles que guarden todas las cosas que os he mandado.»</p>" },
        { heading: "1 Tesalonicenses 2:7-8", body: "<p>Como la nodriza que cuida a sus propios hijos, compartimos no solo el evangelio sino también nuestras propias vidas.</p>" },
      ]
    },
    {
      slug: "leccion-9",
      title: "Lección 9: Historias bíblicas de evangelismo",
      published: false,
      type: "accordion",
      purposeHtml: "<p>Aprender de los evangelistas de la Biblia.</p>",
      items: [
        { heading: "Hechos 8:26-38", body: "<p>Felipe y el etíope: seguir la guía del Espíritu y explicar las Escrituras.</p>" },
        { heading: "Hechos 17:16-34", body: "<p>Pablo en Atenas: hablar al contexto cultural sin comprometer el mensaje.</p>" },
      ]
    },
    {
      slug: "leccion-10",
      title: "Lección 10: Vivir como testigo cada día",
      published: false,
      type: "accordion",
      purposeHtml: "<p>Integrar el evangelismo en la vida diaria, no como evento sino como estilo de vida.</p>",
      items: [
        { heading: "Hechos 1:8", body: "<p>«Me seréis testigos en Jerusalén, en Judea, en Samaria y hasta lo último de la tierra.»</p>" },
        { heading: "Mateo 5:13-16", body: "<p>Sal de la tierra y luz del mundo: visibilidad sin arrogancia.</p>" },
      ]
    }
  ]
};
