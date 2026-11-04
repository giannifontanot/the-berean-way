// sinfoco.js — Ninguna ventana pone el cursor (foco) sola en algún campo al abrirse:
// así no salta el teclado ni se mueve la pantalla. El cursor aparece cuando tú tocas el campo.
for (const metodo of ["showModal", "show"]) {
  const original = HTMLDialogElement.prototype[metodo];
  HTMLDialogElement.prototype[metodo] = function (...args) {
    const r = original.apply(this, args);
    const quitar = () => { const a = document.activeElement; if (a && a !== document.body && this.contains(a)) a.blur(); };
    quitar();
    requestAnimationFrame(quitar);
    return r;
  };
}
