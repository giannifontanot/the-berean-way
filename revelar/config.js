// config.js — Panel de control de "Revelar fotos".
// Cambia estos valores sin tocar la lógica.
export const CONFIG = {
  // Título que ven los participantes arriba de la lista.
  titulo: "Fotos de la clase",

  // Nombre de la sesión por defecto. Puedes abrir otra sesión con ?s=nombre
  // (por ejemplo presentador.html?s=martes). Solo letras, números, - y _.
  sesionPorDefecto: "clase",

  // Configuración de tu proyecto de Firebase (ver README.md, paso 2).
  // Mientras apiKey empiece con "PEGA", las páginas funcionan en MODO DEMO:
  // se sincronizan solo entre pestañas del mismo navegador, para probar.
  firebase: {
    apiKey: "AIzaSyD5niU5Ao5jtlvQZAxYgcYMRpvmfot_nMI",
    authDomain: "berean-revelar.firebaseapp.com",
    databaseURL: "https://berean-revelar-default-rtdb.firebaseio.com",
    projectId: "berean-revelar",
    appId: "1:920817188990:web:bdfd5116dfc71484fd582f",
  },
};
