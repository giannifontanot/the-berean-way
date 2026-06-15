/* lesson-builder-state: eyJzaXRlVGl0bGUiOiJEaXNjaXB1bGFkbyBjb24gTk9NQlJFIiwic3R1ZGVudCI6Ik5PTUJSRSIsImxlc3NvbnMiOlt7InRpdGxlIjoiTGVjY2nDs24gMTogTWkgaWRlbnRpZGFkIGVuIENyaXN0byIsInNyYyI6IkRlc2N1YnJpciBxdWnDqW4gc295IGFob3JhIHF1ZSBlc3RveSBlbiBDcmlzdG8uXG5cbj1cbiMjIyAyIENvcmludGlvcyA1OjE3XG7Cq1NpIGFsZ3VubyBlc3TDoSBlbiBDcmlzdG8sIG51ZXZhIGNyaWF0dXJhIGVzLsK7IMK/UXXDqSBoYSBjYW1iaWFkbyBlbiB0aT9cbj09XG5cbj1cbiMjIyBFZmVzaW9zIDE6My04XG5CZW5kZWNpZG9zIGNvbiB0b2RhIGJlbmRpY2nDs24gZXNwaXJpdHVhbCBlbiBDcmlzdG8uXG49PVxuXG49XG4jIyMgUGFyYSByZWZsZXhpb25hclxuwr9RdcOpIG1lbnRpcmFzIHNvYnJlIHR1IGlkZW50aWRhZCBkZWJlcyByZWVtcGxhemFyIGNvbiBsYSB2ZXJkYWQgZGUgcXVpw6luIGVyZXMgZW4gQ3Jpc3RvP1xuPT1cbiIsImhlYWRlckltYWdlIjoiIiwiZm9vdGVySW1hZ2UiOiIifSx7InRpdGxlIjoiTGVjY2nDs24gMjogTGEgb2JlZGllbmNpYSBjb21vIGFtb3IiLCJzcmMiOiJFbnRlbmRlciBxdWUgb2JlZGVjZXIgYSBEaW9zIG5vIGVzIHJlbGlnacOzbiBzaW5vIGFtb3IuXG5cbj1cbiMjIyBKdWFuIDE0OjE1XG7Cq1NpIG1lIGFtw6FpcywgZ3VhcmRhZCBtaXMgbWFuZGFtaWVudG9zLsK7XG49PVxuXG49XG4jIyMgMSBKdWFuIDU6M1xuU3VzIG1hbmRhbWllbnRvcyBubyBzb24gZ3Jhdm9zb3MuXG49PVxuIiwiaGVhZGVySW1hZ2UiOiIiLCJmb290ZXJJbWFnZSI6IiJ9LHsidGl0bGUiOiJMZWNjacOzbiAzOiBMYSBQYWxhYnJhIGRpYXJpYSIsInNyYyI6IkN1bHRpdmFyIGVsIGjDoWJpdG8gZGUgbGVlciB5IG1lZGl0YXIgbGEgQmlibGlhIGNhZGEgZMOtYS5cblxuPVxuIyMjIFNhbG1vIDExOToxMDVcbsKrTMOhbXBhcmEgZXMgYSBtaXMgcGllcyB0dSBwYWxhYnJhLsK7XG49PVxuXG49XG4jIyMgSm9zdcOpIDE6OFxuTWVkaXRhciBkZSBkw61hIHkgZGUgbm9jaGU7IGVsIGNhbWlubyBwcsOzc3Blcm8uXG49PVxuIiwiaGVhZGVySW1hZ2UiOiIiLCJmb290ZXJJbWFnZSI6IiJ9LHsidGl0bGUiOiJMZWNjacOzbiA0OiBMYSB0ZW50YWNpw7NuIHkgbGEgdmljdG9yaWEiLCJzcmMiOiJDb25vY2VyIGPDs21vIERpb3MgcHJvdmVlIHNhbGlkYSBlbiBjYWRhIHRlbnRhY2nDs24uXG5cbj1cbiMjIyAxIENvcmludGlvcyAxMDoxM1xuTm8gb3MgaGEgc29icmV2ZW5pZG8gbmluZ3VuYSB0ZW50YWNpw7NuIHF1ZSBubyBzZWEgaHVtYW5hLlxuPT1cblxuPVxuIyMjIFNhbnRpYWdvIDQ6N1xuUmVzaXN0aWQgYWwgZGlhYmxvIHkgaHVpcsOhIGRlIHZvc290cm9zLlxuPT1cbiIsImhlYWRlckltYWdlIjoiIiwiZm9vdGVySW1hZ2UiOiIifSx7InRpdGxlIjoiTGVjY2nDs24gNTogRWwgcGVyZMOzbiDigJQgZGFyIHkgcmVjaWJpciIsInNyYyI6IkV4cGVyaW1lbnRhciBsYSBsaWJlcnRhZCBkZWwgcGVyZMOzbiBlbiBhbWJhcyBkaXJlY2Npb25lcy5cblxuPVxuIyMjIEVmZXNpb3MgNDozMlxuUGVyZG9uw6FuZG9vcyB1bm9zIGEgb3Ryb3MsIGNvbW8gRGlvcyB0YW1iacOpbiBvcyBwZXJkb27DsyBlbiBDcmlzdG8uXG49PVxuXG49XG4jIyMgTWF0ZW8gMTg6MjEtMzVcbkxhIHBhcsOhYm9sYSBkZWwgc2llcnZvIHF1ZSBubyBwZXJkb27Dsy5cbj09XG4iLCJoZWFkZXJJbWFnZSI6IiIsImZvb3RlckltYWdlIjoiIn0seyJ0aXRsZSI6IkxlY2Npw7NuIDY6IFNlcnZpciBjb21vIEplc8O6cyIsInNyYyI6IkFwcmVuZGVyIHF1ZSBlbCBsaWRlcmF6Z28gY3Jpc3RpYW5vIGVzIHNlcnZpY2lvLlxuXG49XG4jIyMgTWFyY29zIDEwOjQzLTQ1XG7Cq0VsIHF1ZSBxdWllcmEgc2VyIGdyYW5kZSBlbnRyZSB2b3NvdHJvcyBzZXLDoSB2dWVzdHJvIHNlcnZpZG9yLsK7XG49PVxuXG49XG4jIyMgSnVhbiAxMzoxMi0xN1xuSmVzw7pzIGxhdmEgbG9zIHBpZXMgZGUgc3VzIGRpc2PDrXB1bG9zLlxuPT1cbiIsImhlYWRlckltYWdlIjoiIiwiZm9vdGVySW1hZ2UiOiIifSx7InRpdGxlIjoiTGVjY2nDs24gNzogTGEgbWF5b3Jkb23DrWEgeSBlbCBkYXIiLCJzcmMiOiJWZXIgcXVlIHRvZG8gbG8gcXVlIHRlbmVtb3MgZXMgZGUgRGlvcyB5IGVzdGFtb3MgbGxhbWFkb3MgYSBzZXIgZ2VuZXJvc29zLlxuXG49XG4jIyMgMiBDb3JpbnRpb3MgOTo2LThcbkVsIHF1ZSBzaWVtYnJhIGdlbmVyb3NhbWVudGUsIGdlbmVyb3NhbWVudGUgdGFtYmnDqW4gc2VnYXLDoS5cbj09XG5cbj1cbiMjIyBMdWNhcyAyMToxLTRcbkxhIG9mcmVuZGEgZGUgbGEgdml1ZGE6IGRhciBkZSBsbyBxdWUgc2UgdGllbmUuXG49PVxuIiwiaGVhZGVySW1hZ2UiOiIiLCJmb290ZXJJbWFnZSI6IiJ9LHsidGl0bGUiOiJMZWNjacOzbiA4OiBMYXMgcmVsYWNpb25lcyBxdWUgZWRpZmljYW4iLCJzcmMiOiJDdWx0aXZhciByZWxhY2lvbmVzIHNhbmFzIGRlbnRybyB5IGZ1ZXJhIGRlbCBjdWVycG8gZGUgQ3Jpc3RvLlxuXG49XG4jIyMgUHJvdmVyYmlvcyAyNzoxN1xuwqtFbCBoaWVycm8gY29uIGhpZXJybyBzZSBhZ3V6YTsgeSBhc8OtIGVsIGhvbWJyZSBhZ3V6YSBlbCByb3N0cm8gZGUgc3UgYW1pZ28uwrtcbj09XG5cbj1cbiMjIyBSb21hbm9zIDEyOjktMTNcbkVsIGFtb3Igc2luY2VybyB5IGxhIHZpZGEgZW4gY29tdW5pZGFkIGNyaXN0aWFuYS5cbj09XG4iLCJoZWFkZXJJbWFnZSI6IiIsImZvb3RlckltYWdlIjoiIn0seyJ0aXRsZSI6IkxlY2Npw7NuIDk6IE1pIHRlc3RpbW9uaW8iLCJzcmMiOiJBcHJlbmRlciBhIGNvbnRhciBtaSBoaXN0b3JpYSBkZSBmZSBkZSBtYW5lcmEgY2xhcmEgeSBuYXR1cmFsLlxuXG49XG4jIyMgMSBQZWRybyAzOjE1XG5Fc3RhZCBzaWVtcHJlIHByZXBhcmFkb3MgcGFyYSBwcmVzZW50YXIgZGVmZW5zYSBhbnRlIHRvZG8gZWwgcXVlIG9zIGRlbWFuZGUgcmF6w7NuIGRlIGxhIGVzcGVyYW56YSBxdWUgaGF5IGVuIHZvc290cm9zLlxuPT1cblxuPVxuIyMjIEhlY2hvcyAyNjoxLTIzXG5QYWJsbyBjb21wYXJ0ZSBzdSB0ZXN0aW1vbmlvOiBhbnRlcywgZWwgZW5jdWVudHJvLCBlbCBkZXNwdcOpcy5cbj09XG4iLCJoZWFkZXJJbWFnZSI6IiIsImZvb3RlckltYWdlIjoiIn0seyJ0aXRsZSI6IkxlY2Npw7NuIDEwOiBQZXJzZXZlcmFyIGhhc3RhIGVsIGZpbmFsIiwic3JjIjoiTWFudGVuZXIgbGEgZmUgZmlybWUgaGFzdGEgdmVyIGEgQ3Jpc3RvLlxuXG49XG4jIyMgSGVicmVvcyAxMjoxLTNcbkNvcnJhbW9zIGNvbiBwYWNpZW5jaWEgbGEgY2FycmVyYSBxdWUgbm9zIGVzIHByb3B1ZXN0YSwgcHVlc3RvcyBsb3Mgb2pvcyBlbiBKZXPDunMuXG49PVxuXG49XG4jIyMgQXBvY2FsaXBzaXMgMjoxMFxuwqtTw6kgZmllbCBoYXN0YSBsYSBtdWVydGUsIHkgeW8gdGUgZGFyw6kgbGEgY29yb25hIGRlIGxhIHZpZGEuwrtcbj09XG4iLCJoZWFkZXJJbWFnZSI6IiIsImZvb3RlckltYWdlIjoiIn1dfQ== */
/* Generado con tools/lesson-builder.html — no edites la línea de arriba. */
/* published:true muestra la lección; published:false la oculta. */
window.STUDENT_SITE = {
  title: "Discipulado con NOMBRE",
  student: "NOMBRE",
  pages: [
    {
      slug: "leccion-1",
      title: "Lección 1: Mi identidad en Cristo",
      published: true,
      type: "accordion",
      purposeHtml: "<p>Descubrir quién soy ahora que estoy en Cristo.</p>",
      items: [
        { heading: "2 Corintios 5:17", body: "<p>«Si alguno está en Cristo, nueva criatura es.» ¿Qué ha cambiado en ti?</p>" },
        { heading: "Efesios 1:3-8", body: "<p>Bendecidos con toda bendición espiritual en Cristo.</p>" },
        { heading: "Para reflexionar", body: "<p>¿Qué mentiras sobre tu identidad debes reemplazar con la verdad de quién eres en Cristo?</p>" },
      ]
    },
    {
      slug: "leccion-2",
      title: "Lección 2: La obediencia como amor",
      published: false,
      type: "accordion",
      purposeHtml: "<p>Entender que obedecer a Dios no es religión sino amor.</p>",
      items: [
        { heading: "Juan 14:15", body: "<p>«Si me amáis, guardad mis mandamientos.»</p>" },
        { heading: "1 Juan 5:3", body: "<p>Sus mandamientos no son gravosos.</p>" },
      ]
    },
    {
      slug: "leccion-3",
      title: "Lección 3: La Palabra diaria",
      published: false,
      type: "accordion",
      purposeHtml: "<p>Cultivar el hábito de leer y meditar la Biblia cada día.</p>",
      items: [
        { heading: "Salmo 119:105", body: "<p>«Lámpara es a mis pies tu palabra.»</p>" },
        { heading: "Josué 1:8", body: "<p>Meditar de día y de noche; el camino próspero.</p>" },
      ]
    },
    {
      slug: "leccion-4",
      title: "Lección 4: La tentación y la victoria",
      published: false,
      type: "accordion",
      purposeHtml: "<p>Conocer cómo Dios provee salida en cada tentación.</p>",
      items: [
        { heading: "1 Corintios 10:13", body: "<p>No os ha sobrevenido ninguna tentación que no sea humana.</p>" },
        { heading: "Santiago 4:7", body: "<p>Resistid al diablo y huirá de vosotros.</p>" },
      ]
    },
    {
      slug: "leccion-5",
      title: "Lección 5: El perdón — dar y recibir",
      published: false,
      type: "accordion",
      purposeHtml: "<p>Experimentar la libertad del perdón en ambas direcciones.</p>",
      items: [
        { heading: "Efesios 4:32", body: "<p>Perdonándoos unos a otros, como Dios también os perdonó en Cristo.</p>" },
        { heading: "Mateo 18:21-35", body: "<p>La parábola del siervo que no perdonó.</p>" },
      ]
    },
    {
      slug: "leccion-6",
      title: "Lección 6: Servir como Jesús",
      published: false,
      type: "accordion",
      purposeHtml: "<p>Aprender que el liderazgo cristiano es servicio.</p>",
      items: [
        { heading: "Marcos 10:43-45", body: "<p>«El que quiera ser grande entre vosotros será vuestro servidor.»</p>" },
        { heading: "Juan 13:12-17", body: "<p>Jesús lava los pies de sus discípulos.</p>" },
      ]
    },
    {
      slug: "leccion-7",
      title: "Lección 7: La mayordomía y el dar",
      published: false,
      type: "accordion",
      purposeHtml: "<p>Ver que todo lo que tenemos es de Dios y estamos llamados a ser generosos.</p>",
      items: [
        { heading: "2 Corintios 9:6-8", body: "<p>El que siembra generosamente, generosamente también segará.</p>" },
        { heading: "Lucas 21:1-4", body: "<p>La ofrenda de la viuda: dar de lo que se tiene.</p>" },
      ]
    },
    {
      slug: "leccion-8",
      title: "Lección 8: Las relaciones que edifican",
      published: false,
      type: "accordion",
      purposeHtml: "<p>Cultivar relaciones sanas dentro y fuera del cuerpo de Cristo.</p>",
      items: [
        { heading: "Proverbios 27:17", body: "<p>«El hierro con hierro se aguza; y así el hombre aguza el rostro de su amigo.»</p>" },
        { heading: "Romanos 12:9-13", body: "<p>El amor sincero y la vida en comunidad cristiana.</p>" },
      ]
    },
    {
      slug: "leccion-9",
      title: "Lección 9: Mi testimonio",
      published: false,
      type: "accordion",
      purposeHtml: "<p>Aprender a contar mi historia de fe de manera clara y natural.</p>",
      items: [
        { heading: "1 Pedro 3:15", body: "<p>Estad siempre preparados para presentar defensa ante todo el que os demande razón de la esperanza que hay en vosotros.</p>" },
        { heading: "Hechos 26:1-23", body: "<p>Pablo comparte su testimonio: antes, el encuentro, el después.</p>" },
      ]
    },
    {
      slug: "leccion-10",
      title: "Lección 10: Perseverar hasta el final",
      published: false,
      type: "accordion",
      purposeHtml: "<p>Mantener la fe firme hasta ver a Cristo.</p>",
      items: [
        { heading: "Hebreos 12:1-3", body: "<p>Corramos con paciencia la carrera que nos es propuesta, puestos los ojos en Jesús.</p>" },
        { heading: "Apocalipsis 2:10", body: "<p>«Sé fiel hasta la muerte, y yo te daré la corona de la vida.»</p>" },
      ]
    }
  ]
};
