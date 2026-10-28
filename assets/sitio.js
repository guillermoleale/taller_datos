// Comportamiento compartido: modo presentación y gráficos de barras.
(function () {
  // Modo presentación: una pantalla por vez, con teclado
  var pantallas = Array.prototype.slice.call(document.querySelectorAll(".pantalla"));
  var boton = document.querySelector(".control-presentar");

  function enPresentacion() { return document.documentElement.classList.contains("presentar"); }

  function alternar(forzar) {
    var activo = typeof forzar === "boolean" ? forzar : !enPresentacion();
    document.documentElement.classList.toggle("presentar", activo);
    if (boton) {
      boton.setAttribute("aria-pressed", String(activo));
      boton.textContent = activo ? "Salir de la presentación" : "Presentar";
    }
  }

  function actual() {
    var y = window.scrollY + window.innerHeight * 0.35;
    var i = 0;
    pantallas.forEach(function (p, j) { if (p.offsetTop <= y) i = j; });
    return i;
  }

  function ir(delta) {
    var destino = pantallas[Math.max(0, Math.min(pantallas.length - 1, actual() + delta))];
    if (destino) destino.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  if (boton && pantallas.length) {
    boton.addEventListener("click", function () { alternar(); });
    document.addEventListener("keydown", function (e) {
      var t = e.target;
      if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable)) return;
      if (e.key === "Escape" && enPresentacion()) { alternar(false); return; }
      if (!enPresentacion()) return;
      if (e.key === "ArrowDown" || e.key === "PageDown" || e.key === " ") { e.preventDefault(); ir(1); }
      if (e.key === "ArrowUp" || e.key === "PageUp") { e.preventDefault(); ir(-1); }
    });
  }

  // Barras horizontales: la etiqueta y el número siempre a la vista
  window.dibujarBarras = function (contenedor, items, total) {
    var lista = document.createElement("ol");
    lista.className = "barras";
    items.forEach(function (it) {
      var li = document.createElement("li");
      if (it.destacar) li.className = "destacada";
      li.title = it.etiqueta + ": " + it.valor + " de " + total;
      li.innerHTML =
        '<span class="barra-etiqueta"></span>' +
        '<span class="barra-pista" aria-hidden="true"><span class="barra-relleno"></span></span>' +
        '<span class="barra-valor"></span>';
      li.querySelector(".barra-etiqueta").textContent = it.etiqueta;
      li.querySelector(".barra-valor").textContent = it.valor;
      var relleno = li.querySelector(".barra-relleno");
      relleno.style.setProperty("--v", it.valor / total);
      if (it.color) relleno.style.background = it.color;
      lista.appendChild(li);
    });
    contenedor.appendChild(lista);
  };
})();
