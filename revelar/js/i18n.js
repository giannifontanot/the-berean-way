// i18n.js — Textos de la app en español e inglés.
//
// El idioma se elige con el interruptor de "Mis lecciones" y se recuerda en
// ese teléfono (localStorage). Los participantes usan el idioma de su teléfono,
// salvo que en ese teléfono se haya elegido uno.
//
// En el HTML:
//   data-i18n="clave"        → textContent
//   data-i18n-html="clave"   → innerHTML (solo textos nuestros, nunca del usuario)
//   data-i18n-title="clave"  → title y aria-label
//   data-i18n-aria="clave"   → aria-label
//   data-i18n-ph="clave"     → placeholder
//   data-i18n-dph="clave"    → data-placeholder (editor de escrituras)
// En JS: t("clave", { n: 3 }) → reemplaza {n}.

const CLAVE = "revelar:idioma";
export const IDIOMAS = ["es", "en"];

const TEXTOS = {
  es: {
    // Comunes
    cancel: "Cancelar", save: "Guardar", delete: "Borrar", close: "Cerrar", done: "Listo",
    copy: "Copiar", copied: "Copiado", create: "Crear", gotIt: "Entendido",
    signInGoogle: "Entrar con Google", signInFail: "No se pudo entrar: {e}",
    rulesMissing: "Falta pegar las reglas nuevas en Firebase",
    untitled: "Lección sin nombre", slide: "lámina", slides: "láminas",
    photo: "Foto", scripture: "Escritura", notes: "Notas",
    locale: "es-MX",

    // Mis lecciones
    myLessons: "Mis lecciones", newBtn: "Nueva", language: "Idioma",
    signInLessons: "Entra para ver tus lecciones",
    signInLessonsText: "Solo tu cuenta puede ver y editar tus lecciones.",
    loading: "Cargando…", loadFail: "No se pudo cargar: {e}",
    rulesMissingReadme: "Falta pegar las reglas nuevas en Firebase (ver README).",
    noLessons: "Aún no tienes lecciones. Toca + Nueva.",
    lastLive: "Última en vivo", archivedN: "Archivadas ({n})",
    options: "Opciones",
    rename: "✎ Cambiar nombre", duplicate: "⧉ Duplicar", archive: "🗄 Archivar", restore: "↩ Restaurar",
    archivedToast: "Archivada", restoredToast: "Restaurada",
    renameTitle: "Cambiar nombre", duplicateTitle: "Duplicar lección", duplicateBtn: "Duplicar",
    newLesson: "Nueva lección", name: "Nombre", namePh: "p. ej. La tienda de Dios",
    copyOf: "Copia de {t}", lessonWord: "lección",
    nameSaved: "Nombre guardado", duplicating: "Duplicando…", duplicated: "Duplicada",
    failed: "No se pudo: {e}",
    yourLink: "Enlace para tus participantes", yourCode: "Tu código",
    received: "Recibidas", sendCopy: "📤 Enviar copia a otro maestro",
    sendCopyTitle: "Enviar una copia",
    sendCopyText: "Se envían las fotos, las escrituras y, si quieres, tus notas. El otro maestro la acepta en su lista.", includeNotes: "Incluir mis notas",
    teacherCode: "Código del otro maestro", sendBtn: "Enviar",
    copySent: "Copia enviada", codeNotFound: "No existe un maestro con ese código",
    fromName: "De {n}", accept: "Aceptar", discard: "Descartar",
    accepting: "Copiando la lección…", accepted: "Lección agregada", discarded: "Descartada",

    // Presentador: barra
    connecting: "Conectando…", participants1: "1 participante", participantsN: "{n} participantes",
    offline: "Sin conexión",
    goLive: "Ir en vivo", liveTitle: "En vivo · toca para volver a ensayo", rehearsalTitle: "Ensayo · toca para ir en vivo",
    add: "Agregar", edit: "Editar", share: "Compartir", print: "Imprimir", reset: "Reiniciar",
    lessons: "Lecciones", presenter: "Presentador",
    demoPresenter: 'Modo demo: Firebase aún no está configurado. Abre <a href="{url}" target="_blank" style="color:inherit">la página de participantes</a> en otra pestaña para probar.',

    // Entrar
    signInToPresent: "Entra para presentar",
    signInText: "Solo tu cuenta puede revelar fotos y escrituras. Los participantes no necesitan cuenta.",

    // Tira y notas
    slidesAria: "Láminas", slideOptions: "Opciones de esta lámina", showWithNext: "Sale con Siguiente",
    onScreen: "En pantalla", rehearsal: "Ensayo", next: "Siguiente", live: "En vivo",
    editingHeader: "Editando · arrastra · ✓ sale con Siguiente",
    notesOf: "Notas · {n}", toStart: "Para empezar · {n}",
    editNotes: "Editar notas", noSlides: "Agrega láminas con el botón +.",
    noNotes: "Sin notas para esta lámina.", noNotesEdit: "Sin notas para esta lámina. Toca ✎ para agregar.",
    back: "Atrás", backBtn: "◀ Atrás", nextBtn: "Siguiente ▶",
    removeShownNext: "Quita la mostrada · sigue {c}", removeShown: "Quita la mostrada",
    nextC: "Sigue {c}", backToLast: "Volver a la última", allRevealed: "Todo revelado ✓",
    alreadyFirst: "Ya estás en la primera",
    revealedOf: "{n} de {total} reveladas", hiddenN1: " · 1 oculta", hiddenN: " · {n} ocultas",
    show: "Mostrar", hide: "Ocultar", exit: "Salir",

    // Avisos
    readFail: "No se pudo leer la sesión: {e}",
    rulesMissingNotes: "Falta pegar las reglas nuevas para las notas",
    liveSwitchFail: "No se pudo cambiar la lección en vivo",
    saveFail: "No se pudo guardar: {e}",
    dragFail: "No se pudo cargar la herramienta para arrastrar. Revisa tu conexión.",
    orderSaved: "Orden guardado", hiddenToast: "Oculta · la recuperas en Editar",
    sessionReset: "Sesión reiniciada", rehearsalReset: "Ensayo reiniciado",
    linkCopied: "Enlace copiado", classPhotos: "Fotos de la clase",
    buildingDoc: "Armando el documento…", docFail: "No se pudo armar el documento: {e}", downloaded: "Descargado",
    docReadyText1: "1 lámina, con sus notas abajo. ¿Lo descargas?",
    docReadyTextN: "{n} láminas, cada una con sus notas abajo. ¿Lo descargas?",

    // Escrituras
    newScripture: "Nueva escritura", editScripture: "Editar escritura",
    typeTextFirst: "Escribe el texto de la escritura",
    scriptureRevealed: "Escritura revelada", scriptureSaved: "Escritura guardada", scriptureDeleted: "Escritura borrada",
    sureAgain: "¿Seguro? Toca otra vez", selectFirst: "Primero selecciona las palabras",
    reference: "Cita", refPh: "Juan 2:19", selectWords: "Selecciona palabras en la hoja y toca:",
    red: "Rojo", highlight: "Resaltar", scriptureText: "Texto de la escritura",
    typeScripture: "Escribe o pega aquí la escritura…", allRed: "Todo en letra roja",
    markHelpHtml: "Toca <b>Rojo</b> o <b>Resaltar</b> otra vez sobre lo mismo para quitarlo. Si la escritura ya está revelada, al guardar el cambio se ve al instante en los teléfonos.",
    notesForMeIcon: "📝 Notas para mí", notesForMe: "Notas para mí", notSeen: "(no las ven los participantes)",
    escNotesPh: "- Preguntar: …\n- Conectar con …", saveReveal: "Guardar y revelar",

    // Fotos
    uploadingN: "Subiendo foto {i} de {n}…", uploading: "Subiendo foto…",
    photosAdded: "{n} fotos agregadas · usa 📝 para sus notas", photoAdded: "Foto agregada",
    notesForPhoto: "Notas para esta foto", photoReadFail: "No se pudo leer la foto",
    photoTooBig: "La foto es demasiado grande", photoFormat: "No se pudo leer la foto (¿formato no compatible?)",
    changingPhoto: "Cambiando foto…", photoChanged: "Foto cambiada", photoDeleted: "Foto borrada",
    deleteQ: "¿Borrar {x}?", thisScripture: "esta escritura", deletePhotoQ: "¿Borrar esta foto?",
    notesSaved: "Notas guardadas",

    // Diálogos
    docReady: "Documento listo", download: "Descargar",
    inviteTitle: "Invita a los participantes", inviteText: "Que escaneen este código o abran el enlace.",
    copyLink: "Copiar enlace", send: "Enviar…",
    resetLiveQ: "¿Reiniciar la sesión?", resetRehearsalQ: "¿Reiniciar el ensayo?",
    resetLiveText: "Se ocultarán todas las fotos y escrituras en los teléfonos de los participantes. Ellos se quedan conectados, listos para empezar de nuevo.",
    resetRehearsalText: "Tu ensayo vuelve al principio. Los participantes no ven ningún cambio.",
    missingStep: "Falta un paso",
    missingStepHtml: "Firebase rechazó el cambio. Casi siempre es porque faltan las <b>reglas más recientes</b>: en Firebase abre <b>Realtime Database → Rules</b>, pega las reglas nuevas (están en <code>revelar/database.rules.json</code>) y toca <b>Publish</b>.",
    uidText: "Si es la primera vez, este es tu identificador para las reglas:",
    addText: "Se agrega justo después de la lámina que tienes al frente, oculto hasta que lo reveles.",
    deleteText: "Se quita de tu lista y de los teléfonos de los participantes.",
    notShown: "No se muestra a los participantes.",
    menuNotes: "📝 Notas", menuEditScripture: "✎ Editar escritura", menuChangePhoto: "🖼 Cambiar foto",
    menuHide: "🙈 Ocultar (Siguiente la salta)", menuDelete: "🗑 Borrar",
    notesFont: "Letra de las notas", size: "Tamaño", spacing: "Espacio entre letras", resetDefaults: "Restablecer",
    fontPreviewHtml: "<p>Mostrar el tamaño del templo.</p><ul><li>Preguntar: ¿qué sentían los peregrinos?</li><li>Leer <mark>Salmo 122:1</mark></li></ul>",
    fontSizeAria: "Tamaño de letra de las notas", normal: "normal",
    notesPh: "- Preguntar: ¿qué es un templo para ustedes?\n- Leer Juan 2:19-21",
    notesHelpHtml: 'Empieza una línea con <b>-</b> para hacer viñetas. <b>*así*</b> en <span class="rojo">rojo</span> y <b>==así==</b> <mark>resaltado</mark>.',

    // Participantes
    waiting: "Esperando", reconnecting: "Sin conexión… reconectando",
    demoParticipant: "Modo demo: Firebase aún no está configurado. Solo se sincroniza con otras pestañas de este navegador.",
    participantReadFail: "No se pudo leer la sesión. Revisa las reglas de Firebase.",
    myTeachers: "Mis maestros", followHint: "Toca un maestro para seguir su clase.",
    addTeacher: "Agregar maestro", editTeacher: "Cambiar nombre", codeLabel: "Código del maestro",
    nameLabel: "Nombre (para ti)", namePhStudent: "Pastor Juan", saveFollow: "Guardar y seguir",
    now: "ahora", teacherWith: "Maestro {c}", mainClass: "The Berean Way", removeTeacher: "Quitar",
    codeTooShort: "El código tiene 4 letras o números.",
    teachersAdmin: "Maestros", adminOnly: "Solo el administrador puede ver esta pantalla.",
    noTeachers: "Aún no hay maestros.", teachersN: "maestros", blockedN: "pausados",
    noName: "Sin nombre", you: "tú", lastActive: "activo", blockedBadge: "Pausado",
    block: "Pausar", unblock: "Reactivar", blockQ: "¿Pausar a {n}?", unblockQ: "¿Reactivar a {n}?",
    blockText: "No podrá crear ni cambiar lecciones, ni presentar. Sus alumnos dejan de ver su clase en vivo. Sus lecciones no se borran.",
    unblockText: "Podrá volver a crear lecciones y presentar.",
    blockedToast: "Maestro pausado", unblockedToast: "Maestro reactivado",
    youAreBlocked: "Tu cuenta está pausada. Habla con el administrador.",
    shareCityQ: "📍 ¿Quieres que el administrador vea en un mapa desde qué ciudad das tus clases?",
    yesShare: "Sí, compartir", notNow: "Ahora no", myLocation: "📍 Mi ubicación",
    locationTitle: "Tu ubicación",
    locationText: "Opcional. Los maestros de Revelar verán en el mapa tu nombre y tu ciudad aproximada (unos 10 km). Puedes quitarla cuando quieras.",
    shareMyLocation: "📍 Compartir mi ubicación", teachersOnMap: "{n} maestros en el mapa", teachersMap: "Mapa de maestros",
    cityLabel: "Ciudad", useMyLocation: "📍 Usar mi ubicación", stopSharing: "Dejar de compartir",
    sharingNow: "Ahora compartes: {c}", locationSaved: "Ubicación compartida", locationRemoved: "Ya no compartes tu ubicación",
    locationFail: "No se pudo obtener tu ubicación",
    map: "🗺 Mapa", list: "☰ Lista", noLocations: "Ningún maestro ha compartido su ubicación todavía.",
    mapFail: "No se pudo cargar el mapa", locShared: "📍 {c}",
    mapNote: "Solo aparecen los maestros que eligieron compartir su ciudad (aproximada).", myLocationShort: "📍 Mi ubicación", classCode: "Código de la clase", codeShort: "Código", nameShort: "Nombre",

    // Documento para imprimir
    classSummary: "Resumen de la clase", madeWith: "Hecho con Revelar · The Berean Way",
  },

  en: {
    cancel: "Cancel", save: "Save", delete: "Delete", close: "Close", done: "Done",
    copy: "Copy", copied: "Copied", create: "Create", gotIt: "Got it",
    signInGoogle: "Sign in with Google", signInFail: "Couldn't sign in: {e}",
    rulesMissing: "The new rules still need to be pasted into Firebase",
    untitled: "Untitled lesson", slide: "slide", slides: "slides",
    photo: "Photo", scripture: "Scripture", notes: "Notes",
    locale: "en-US",

    myLessons: "My lessons", newBtn: "New", language: "Language",
    signInLessons: "Sign in to see your lessons",
    signInLessonsText: "Only your account can see and edit your lessons.",
    loading: "Loading…", loadFail: "Couldn't load: {e}",
    rulesMissingReadme: "The new rules still need to be pasted into Firebase (see README).",
    noLessons: "No lessons yet. Tap + New.",
    lastLive: "Last live", archivedN: "Archived ({n})",
    options: "Options",
    rename: "✎ Rename", duplicate: "⧉ Duplicate", archive: "🗄 Archive", restore: "↩ Restore",
    archivedToast: "Archived", restoredToast: "Restored",
    renameTitle: "Rename", duplicateTitle: "Duplicate lesson", duplicateBtn: "Duplicate",
    newLesson: "New lesson", name: "Name", namePh: "e.g. God's Tent",
    copyOf: "Copy of {t}", lessonWord: "lesson",
    nameSaved: "Name saved", duplicating: "Duplicating…", duplicated: "Duplicated",
    failed: "Couldn't do it: {e}",
    yourLink: "Link for your participants", yourCode: "Your code",
    received: "Received", sendCopy: "📤 Send a copy to another teacher",
    sendCopyTitle: "Send a copy",
    sendCopyText: "The photos, the scriptures and, if you like, your notes are sent. The other teacher accepts it in their list.", includeNotes: "Include my notes",
    teacherCode: "The other teacher's code", sendBtn: "Send",
    copySent: "Copy sent", codeNotFound: "No teacher has that code",
    fromName: "From {n}", accept: "Accept", discard: "Discard",
    accepting: "Copying the lesson…", accepted: "Lesson added", discarded: "Discarded",

    connecting: "Connecting…", participants1: "1 participant", participantsN: "{n} participants",
    offline: "Offline",
    goLive: "Go live", liveTitle: "Live · tap to go back to rehearsal", rehearsalTitle: "Rehearsal · tap to go live",
    add: "Add", edit: "Edit", share: "Share", print: "Print", reset: "Reset",
    lessons: "Lessons", presenter: "Presenter",
    demoPresenter: 'Demo mode: Firebase isn\'t set up yet. Open <a href="{url}" target="_blank" style="color:inherit">the participant page</a> in another tab to try it.',

    signInToPresent: "Sign in to present",
    signInText: "Only your account can reveal photos and scriptures. Participants don't need an account.",

    slidesAria: "Slides", slideOptions: "Options for this slide", showWithNext: "Shown with Next",
    onScreen: "On screen", rehearsal: "Rehearsal", next: "Next", live: "Live",
    editingHeader: "Editing · drag · ✓ shown with Next",
    notesOf: "Notes · {n}", toStart: "To start · {n}",
    editNotes: "Edit notes", noSlides: "Add slides with the + button.",
    noNotes: "No notes for this slide.", noNotesEdit: "No notes for this slide. Tap ✎ to add some.",
    back: "Back", backBtn: "◀ Back", nextBtn: "Next ▶",
    removeShownNext: "Remove the shown one · then {c}", removeShown: "Remove the shown one",
    nextC: "Then {c}", backToLast: "Back to the last one", allRevealed: "All revealed ✓",
    alreadyFirst: "You're already at the first one",
    revealedOf: "{n} of {total} revealed", hiddenN1: " · 1 hidden", hiddenN: " · {n} hidden",
    show: "Show", hide: "Hide", exit: "Exit",

    readFail: "Couldn't read the session: {e}",
    rulesMissingNotes: "The new rules for notes still need to be pasted",
    liveSwitchFail: "Couldn't switch the live lesson",
    saveFail: "Couldn't save: {e}",
    dragFail: "Couldn't load the drag tool. Check your connection.",
    orderSaved: "Order saved", hiddenToast: "Hidden · bring it back in Edit",
    sessionReset: "Session reset", rehearsalReset: "Rehearsal reset",
    linkCopied: "Link copied", classPhotos: "Class photos",
    buildingDoc: "Building the document…", docFail: "Couldn't build the document: {e}", downloaded: "Downloaded",
    docReadyText1: "1 slide, with its notes below. Download it?",
    docReadyTextN: "{n} slides, each with its notes below. Download it?",

    newScripture: "New scripture", editScripture: "Edit scripture",
    typeTextFirst: "Type the scripture text",
    scriptureRevealed: "Scripture revealed", scriptureSaved: "Scripture saved", scriptureDeleted: "Scripture deleted",
    sureAgain: "Sure? Tap again", selectFirst: "Select the words first",
    reference: "Reference", refPh: "John 2:19", selectWords: "Select words on the page and tap:",
    red: "Red", highlight: "Highlight", scriptureText: "Scripture text",
    typeScripture: "Type or paste the scripture here…", allRed: "All in red letters",
    markHelpHtml: "Tap <b>Red</b> or <b>Highlight</b> again on the same words to remove it. If the scripture is already revealed, the change shows on the phones as soon as you save.",
    notesForMeIcon: "📝 Notes for me", notesForMe: "Notes for me", notSeen: "(participants don't see them)",
    escNotesPh: "- Ask: …\n- Connect with …", saveReveal: "Save and reveal",

    uploadingN: "Uploading photo {i} of {n}…", uploading: "Uploading photo…",
    photosAdded: "{n} photos added · use 📝 for their notes", photoAdded: "Photo added",
    notesForPhoto: "Notes for this photo", photoReadFail: "Couldn't read the photo",
    photoTooBig: "The photo is too large", photoFormat: "Couldn't read the photo (unsupported format?)",
    changingPhoto: "Changing photo…", photoChanged: "Photo changed", photoDeleted: "Photo deleted",
    deleteQ: "Delete {x}?", thisScripture: "this scripture", deletePhotoQ: "Delete this photo?",
    notesSaved: "Notes saved",

    docReady: "Document ready", download: "Download",
    inviteTitle: "Invite the participants", inviteText: "Have them scan this code or open the link.",
    copyLink: "Copy link", send: "Send…",
    resetLiveQ: "Reset the session?", resetRehearsalQ: "Reset the rehearsal?",
    resetLiveText: "All photos and scriptures will be hidden on the participants' phones. They stay connected, ready to start again.",
    resetRehearsalText: "Your rehearsal goes back to the start. Participants see no change.",
    missingStep: "One step left",
    missingStepHtml: "Firebase rejected the change. This is almost always because the <b>latest rules</b> are missing: in Firebase open <b>Realtime Database → Rules</b>, paste the new rules (in <code>revelar/database.rules.json</code>) and tap <b>Publish</b>.",
    uidText: "If this is the first time, this is your ID for the rules:",
    addText: "It's added right after the slide in front of you, hidden until you reveal it.",
    deleteText: "It's removed from your list and from the participants' phones.",
    notShown: "Not shown to participants.",
    menuNotes: "📝 Notes", menuEditScripture: "✎ Edit scripture", menuChangePhoto: "🖼 Change photo",
    menuHide: "🙈 Hide (Next skips it)", menuDelete: "🗑 Delete",
    notesFont: "Notes font", size: "Size", spacing: "Letter spacing", resetDefaults: "Reset",
    fontPreviewHtml: "<p>Show the size of the temple.</p><ul><li>Ask: how did the pilgrims feel?</li><li>Read <mark>Psalm 122:1</mark></li></ul>",
    fontSizeAria: "Notes font size", normal: "normal",
    notesPh: "- Ask: what is a temple to you?\n- Read John 2:19-21",
    notesHelpHtml: 'Start a line with <b>-</b> for bullets. <b>*like this*</b> in <span class="rojo">red</span> and <b>==like this==</b> <mark>highlighted</mark>.',

    waiting: "Waiting", reconnecting: "Offline… reconnecting",
    demoParticipant: "Demo mode: Firebase isn't set up yet. It only syncs with other tabs in this browser.",
    participantReadFail: "Couldn't read the session. Check the Firebase rules.",
    myTeachers: "My teachers", followHint: "Tap a teacher to follow their class.",
    addTeacher: "Add a teacher", editTeacher: "Rename", codeLabel: "Teacher's code",
    nameLabel: "Name (just for you)", namePhStudent: "Pastor John", saveFollow: "Save and follow",
    now: "now", teacherWith: "Teacher {c}", mainClass: "The Berean Way", removeTeacher: "Remove",
    codeTooShort: "The code has 4 letters or numbers.",
    teachersAdmin: "Teachers", adminOnly: "Only the administrator can see this screen.",
    noTeachers: "No teachers yet.", teachersN: "teachers", blockedN: "paused",
    noName: "No name", you: "you", lastActive: "active", blockedBadge: "Paused",
    block: "Pause", unblock: "Reactivate", blockQ: "Pause {n}?", unblockQ: "Reactivate {n}?",
    blockText: "They won't be able to create or change lessons, or present. Their students stop seeing their live class. Their lessons aren't deleted.",
    unblockText: "They'll be able to create lessons and present again.",
    blockedToast: "Teacher paused", unblockedToast: "Teacher reactivated",
    youAreBlocked: "Your account is paused. Talk to the administrator.",
    shareCityQ: "📍 Would you like the administrator to see on a map which city you teach from?",
    yesShare: "Yes, share", notNow: "Not now", myLocation: "📍 My location",
    locationTitle: "Your location",
    locationText: "Optional. Revelar teachers will see your name and approximate city (about 10 km) on the map. You can remove it anytime.",
    shareMyLocation: "📍 Share my location", teachersOnMap: "{n} teachers on the map", teachersMap: "Teachers map",
    cityLabel: "City", useMyLocation: "📍 Use my location", stopSharing: "Stop sharing",
    sharingNow: "You're sharing: {c}", locationSaved: "Location shared", locationRemoved: "You're no longer sharing your location",
    locationFail: "Couldn't get your location",
    map: "🗺 Map", list: "☰ List", noLocations: "No teacher has shared their location yet.",
    mapFail: "Couldn't load the map", locShared: "📍 {c}",
    mapNote: "Only teachers who chose to share their (approximate) city appear.", classCode: "Class code", codeShort: "Code", nameShort: "Name",

    classSummary: "Class summary", madeWith: "Made with Revelar · The Berean Way",
  },
};

let actual = null;

/** Idioma elegido en este teléfono; si no hay, `defecto` (o el del teléfono). */
export function idioma(defecto) {
  if (actual) return actual;
  let v = null;
  try { v = localStorage.getItem(CLAVE); } catch {}
  if (!IDIOMAS.includes(v)) v = defecto || (/^es\b/i.test(navigator.language || "") ? "es" : "en");
  actual = v;
  document.documentElement.lang = v;
  return v;
}

export function ponerIdioma(v) {
  if (!IDIOMAS.includes(v)) return;
  actual = v;
  try { localStorage.setItem(CLAVE, v); } catch {}
  document.documentElement.lang = v;
}

export function t(clave, vars) {
  const l = actual || idioma();
  let s = TEXTOS[l][clave] ?? TEXTOS.es[clave] ?? clave;
  if (vars) s = s.replace(/\{(\w+)\}/g, (m, k) => (k in vars ? String(vars[k]) : m));
  return s;
}

/** Aplica los textos a los elementos marcados con data-i18n*. */
export function traducir(raiz = document) {
  raiz.querySelectorAll("[data-i18n]").forEach((el) => { el.textContent = t(el.dataset.i18n); });
  raiz.querySelectorAll("[data-i18n-html]").forEach((el) => { el.innerHTML = t(el.dataset.i18nHtml); });
  raiz.querySelectorAll("[data-i18n-title]").forEach((el) => {
    const s = t(el.dataset.i18nTitle);
    el.title = s; el.setAttribute("aria-label", s);
  });
  raiz.querySelectorAll("[data-i18n-aria]").forEach((el) => el.setAttribute("aria-label", t(el.dataset.i18nAria)));
  raiz.querySelectorAll("[data-i18n-ph]").forEach((el) => { el.placeholder = t(el.dataset.i18nPh); });
  raiz.querySelectorAll("[data-i18n-dph]").forEach((el) => { el.dataset.placeholder = t(el.dataset.i18nDph); });
}
