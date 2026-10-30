// confirmar.js — Quitar con calma: primero pregunta; si confirma, cuenta 10 segundos
// con un botón Cancelar por si se arrepiente. Devuelve true solo si llega a 0.
// Recibe t() de la página (así usa el mismo idioma).
export function confirmarQuitar(nombre, t, segundos = 10) {
  return new Promise((listo) => {
    const d = document.createElement("dialog");
    d.className = "dlg-quitar";
    d.innerHTML = `
      <h2></h2>
      <p class="q-txt"></p>
      <div class="q-cuenta" hidden><b></b><span class="q-barra"><i></i></span></div>
      <div class="acciones">
        <button class="btn" type="button" data-no></button>
        <button class="btn peligro lleno" type="button" data-si></button>
      </div>`;
    const $ = (s) => d.querySelector(s);
    $("h2").textContent = t("removeQ", { n: nombre });
    $(".q-txt").textContent = t("removeText");
    $("[data-no]").textContent = t("cancel");
    $("[data-si]").textContent = t("removeTeacher");
    let reloj = 0, hecho = false;
    const fin = (v) => {
      if (hecho) return;
      hecho = true; clearInterval(reloj);
      d.close(); d.remove(); listo(v);
    };
    $("[data-no]").addEventListener("click", () => fin(false));
    d.addEventListener("cancel", (e) => { e.preventDefault(); fin(false); });
    $("[data-si]").addEventListener("click", () => {
      let quedan = segundos;
      $("[data-si]").hidden = true;
      $(".q-cuenta").hidden = false;
      const pintar = () => {
        $("h2").textContent = t("removingIn", { n: nombre });
        $(".q-cuenta b").textContent = quedan;
        $(".q-txt").textContent = t("removeUndo");
      };
      pintar();
      $(".q-barra i").style.animationDuration = segundos + "s";
      reloj = setInterval(() => {
        quedan--;
        if (quedan <= 0) fin(true); else pintar();
      }, 1000);
    });
    document.body.append(d);
    d.showModal();
  });
}
