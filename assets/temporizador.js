// Temporizador de la consola: cuenta regresiva para regular las intervenciones.
// Solo se ve en la consola, no en los celulares. Queda guardado en este navegador.
(function () {
  var $ = function (id) { return document.getElementById(id); };
  var CLAVE = "taller-temporizador", CLAVE_OPCIONES = "taller-temporizador-opciones";

  function cargar(k, def) { try { var v = JSON.parse(localStorage.getItem(k)); return v == null ? def : v; } catch (e) { return def; } }
  function guardar(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }

  // { duracion, fin, restante } en milisegundos. Con fin en null está en pausa (o terminado, si restante es 0).
  var crono = cargar(CLAVE, null);
  var opciones = cargar(CLAVE_OPCIONES, { sonido: true, cerrar: false });
  var audio = null;

  function restante() {
    if (!crono) return 0;
    return crono.fin ? Math.max(0, crono.fin - Date.now()) : crono.restante;
  }
  function formato(ms) {
    var s = Math.ceil(ms / 1000);
    return Math.floor(s / 60) + ":" + String(s % 60).padStart(2, "0");
  }

  function dibujar() {
    var caja = $("temporizador");
    caja.hidden = !crono;
    if (!crono) return;
    if (crono.fin && crono.fin <= Date.now()) terminar();
    var r = restante(), fin = r <= 0;
    $("temporizador-tiempo").textContent = fin ? "Tiempo" : formato(r);
    $("temporizador-total").textContent = fin ? "Terminó el tiempo de " + formato(crono.duracion) : (crono.fin ? "de " + formato(crono.duracion) : "En pausa, de " + formato(crono.duracion));
    $("temporizador-relleno").style.setProperty("--v", crono.duracion ? r / crono.duracion : 0);
    caja.classList.toggle("poco", !fin && r <= Math.min(30000, crono.duracion * 0.2));
    caja.classList.toggle("terminado", fin);
    $("temporizador-pausa").hidden = fin;
    $("temporizador-pausa").textContent = crono.fin ? "Pausar" : "Seguir";
  }

  function terminar() {
    crono.fin = null;
    crono.restante = 0;
    guardar(CLAVE, crono);
    $("temporizador-aviso").textContent = "Terminó el tiempo.";
    if (opciones.sonido) sonar();
    window.dispatchEvent(new CustomEvent("temporizador:fin", { detail: { cerrar: opciones.cerrar } }));
  }

  function empezar(ms) {
    if (!(ms > 0)) return;
    crono = { duracion: ms, fin: Date.now() + ms, restante: ms };
    guardar(CLAVE, crono);
    $("temporizador-aviso").textContent = "";
    prepararAudio();
    $("temporizador-ajustes").open = false;
    dibujar();
  }

  // El navegador solo deja sonar el audio después de un clic en la página.
  function prepararAudio() {
    var C = window.AudioContext || window.webkitAudioContext;
    if (!audio && C) audio = new C();
    if (audio && audio.state === "suspended") audio.resume();
  }
  function sonar() {
    if (!audio) return;
    var t0 = audio.currentTime;
    [0, 0.3, 0.6].forEach(function (d) {
      var o = audio.createOscillator(), g = audio.createGain();
      o.frequency.value = 880;
      g.gain.setValueAtTime(0.0001, t0 + d);
      g.gain.exponentialRampToValueAtTime(0.3, t0 + d + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, t0 + d + 0.22);
      o.connect(g).connect(audio.destination);
      o.start(t0 + d);
      o.stop(t0 + d + 0.25);
    });
  }
  document.addEventListener("pointerdown", prepararAudio, { once: true });

  // Duraciones rápidas y una a elección
  document.querySelectorAll("[data-segundos]").forEach(function (b) {
    b.addEventListener("click", function () { empezar(Number(b.dataset.segundos) * 1000); });
  });
  $("temporizador-otro").addEventListener("submit", function (e) {
    e.preventDefault();
    var m = Math.min(99, Math.max(0, Math.floor(Number($("temporizador-min").value) || 0)));
    var s = Math.min(59, Math.max(0, Math.floor(Number($("temporizador-seg").value) || 0)));
    empezar((m * 60 + s) * 1000);
  });

  $("temporizador-pausa").addEventListener("click", function () {
    if (crono.fin) { crono.restante = restante(); crono.fin = null; }
    else { crono.fin = Date.now() + crono.restante; prepararAudio(); }
    guardar(CLAVE, crono);
    dibujar();
  });
  $("temporizador-reiniciar").addEventListener("click", function () { empezar(crono.duracion); });
  $("temporizador-quitar").addEventListener("click", function () {
    crono = null;
    try { localStorage.removeItem(CLAVE); } catch (e) {}
    dibujar();
  });

  $("temporizador-sonido").checked = opciones.sonido;
  $("temporizador-cerrar").checked = opciones.cerrar;
  ["sonido", "cerrar"].forEach(function (k) {
    $("temporizador-" + k).addEventListener("change", function () {
      opciones[k] = this.checked;
      guardar(CLAVE_OPCIONES, opciones);
    });
  });

  // Si terminó con la página cerrada, queda terminado sin sonar.
  if (crono && crono.fin && crono.fin <= Date.now()) { crono.fin = null; crono.restante = 0; guardar(CLAVE, crono); }
  dibujar();
  setInterval(dibujar, 250);
})();
