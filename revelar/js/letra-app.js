// letra-app.js — La letra de TODO el app sigue al AAA (letra de las notas).
// Si el maestro sube la letra de sus notas es porque necesita ver más grande: todo crece en proporción.
//   --notas-fs / --notas-ls → las notas (tal cual las eligió)
//   --esc                   → multiplica cada tamaño de letra del resto del app (20 px de notas = 1×)
//   --app-ls                → el mismo espacio entre letras, en todo el app
// Para que la pantalla no se rompa en un teléfono, el resto del app crece entre 0.9× y 1.6×,
// y la barra de arriba (código, logo, botones) solo hasta 1.2×.
(function () {
  const DEF = { tam: 20, esp: 0 };
  function leer() {
    const l = { ...DEF };
    try { Object.assign(l, JSON.parse(localStorage.getItem("revelar:letra")) || {}); } catch {}
    l.tam = +l.tam || 20; l.esp = +l.esp || 0;
    return l;
  }
  function aplicarLetraApp(l) {
    l = l || leer();
    const r = document.documentElement.style;
    // 14 px → 0.9×, 20 px → 1×, 44 px → 1.6× (crece en proporción, pero más suave que las notas)
    const esc = l.tam >= 20 ? 1 + (Math.min(l.tam, 44) - 20) / 24 * 0.6 : 1 - (20 - Math.max(l.tam, 14)) / 6 * 0.1;
    r.setProperty("--notas-fs", l.tam + "px");
    r.setProperty("--notas-ls", l.esp + "em");
    r.setProperty("--esc", esc.toFixed(3));
    // Espacio entre letras: la mitad del de las notas (máx. 0.06 em) para que botones y títulos no se desborden
    r.setProperty("--app-ls", l.esp ? Math.min(0.06, l.esp / 2).toFixed(3) + "em" : "normal");
  }
  window.aplicarLetraApp = aplicarLetraApp;
  aplicarLetraApp();
  // Si se cambia en otra pestaña (presentador ↔ lecciones), se aplica aquí también
  window.addEventListener("storage", (e) => { if (e.key === "revelar:letra") aplicarLetraApp(); });
})();
