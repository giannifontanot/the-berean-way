// presion.js — Botones que se ven presionados y acciones que esperan la animación.
// Al tocar un botón se hunde suavemente; la acción (abrir, cambiar de página…)
// ocurre al terminar la animación, para que se note qué pasó.
const SEL = "button, a[href], [role='button']";
const ESPERA = 150;                       // ms: lo que dura el "hundirse"
const ESPERA_BARRA = 280;                 // botones de arriba: cambian de color un momento y luego actúan
const espera = (el) => (el.closest(".barra .barra-acciones") ? ESPERA_BARRA : ESPERA);
// Estos necesitan el toque directo del dedo (ventanas de Google, cámara, compartir,
// portapapeles): se animan pero no esperan.
const DIRECTOS = "#btnEntrar, #btnInstalar, #btnCompartir, #btnAgregarFoto, #btnEnviar, #btnCopiar, #btnCopiarUid, #itemCambiarFoto, #itemPrev, .t-editar, .seg button, .idioma-switch button, [data-marca], [data-marca-notas]";
const IGNORAR = "input, label, textarea, select, [contenteditable='true'], .leaflet-container";

function animar(el) {
  el.classList.remove("presionado");
  void el.offsetWidth;
  el.classList.add("presionado");
  clearTimeout(el._tPres);
  el._tPres = setTimeout(() => el.classList.remove("presionado"), espera(el));
}

document.addEventListener("pointerdown", (e) => {
  if (e.target.closest(IGNORAR)) return;
  const el = e.target.closest(SEL);
  if (el && !el.disabled) animar(el);
}, { capture: true, passive: true });

document.addEventListener("click", (e) => {
  if (e.target.closest(IGNORAR)) return;
  const el = e.target.closest(SEL);
  if (!el || el.disabled) return;
  if (el._repite) { el._repite = false; return; }          // la segunda vez: dejar pasar
  if (el.matches(DIRECTOS) || el.closest("body.ordenando-activo #tira")) {
    if (!el.classList.contains("presionado")) animar(el);
    return;
  }
  e.preventDefault();
  e.stopImmediatePropagation();
  if (!el.classList.contains("presionado")) animar(el);
  setTimeout(() => { el._repite = true; el.click(); }, espera(el));
}, true);
