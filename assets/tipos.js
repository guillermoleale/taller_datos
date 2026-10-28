// Página "Tipos de datos": gráficos y tabla en vivo.
(function () {
  var D = window.DATOS;
  var $ = function (id) { return document.getElementById(id); };

  // Pregunta con opciones: se cuenta enseguida
  dibujarBarras($("g-cerrada"), D.materiales, D.respuestas);

  // Lo que trajeron: qué viene en filas y qué no
  var etiquetas = { no: "", semi: " (en parte)", si: "" };
  dibujarBarras($("g-tipos"), D.materiales.map(function (m) {
    return {
      etiqueta: m.etiqueta + etiquetas[m.tipo],
      valor: m.valor,
      color: m.tipo === "si" ? "var(--barra)" : "var(--barra-destacada)"
    };
  }), D.respuestas);

  // Imagen del objeto: se muestra solo en esta pantalla
  var CLAVE_IMG = "taller-datos-objeto-v1";
  var figura = $("objeto-imagen"), vacio = $("objeto-vacio");
  function mostrarImagen(src) {
    figura.src = src; figura.hidden = false; vacio.hidden = true;
    $("quitar-imagen").hidden = false;
  }
  try { var guardada = localStorage.getItem(CLAVE_IMG); if (guardada) mostrarImagen(guardada); } catch (e) {}
  $("archivo").addEventListener("change", function () {
    var f = this.files && this.files[0];
    if (!f) return;
    var lector = new FileReader();
    lector.onload = function () {
      mostrarImagen(lector.result);
      try { localStorage.setItem(CLAVE_IMG, lector.result); } catch (e) { /* imagen grande: queda solo en pantalla */ }
    };
    lector.readAsDataURL(f);
  });
  $("quitar-imagen").addEventListener("click", function () {
    figura.hidden = true; figura.removeAttribute("src"); vacio.hidden = false; this.hidden = true;
    try { localStorage.removeItem(CLAVE_IMG); } catch (e) {}
  });

  // Tabla en vivo
  var ALMACEN = "taller-datos-tabla-v1";
  var tabla = { columnas: [], filas: [{}], actual: 0 };
  try { var t = JSON.parse(localStorage.getItem(ALMACEN)); if (t && t.filas) tabla = t; } catch (e) {}
  function guardar() { try { localStorage.setItem(ALMACEN, JSON.stringify(tabla)); } catch (e) {} }

  function dibujarTabla() {
    var cab = $("tabla-cabeza"), cuerpo = $("tabla-cuerpo");
    cab.innerHTML = ""; cuerpo.innerHTML = "";
    var tr = document.createElement("tr");
    var th0 = document.createElement("th"); th0.textContent = "Objeto"; th0.scope = "col"; tr.appendChild(th0);
    tabla.columnas.forEach(function (c) {
      var th = document.createElement("th"); th.scope = "col"; th.textContent = c; tr.appendChild(th);
    });
    cab.appendChild(tr);
    tabla.filas.forEach(function (fila, i) {
      var r = document.createElement("tr");
      if (i === tabla.actual) r.className = "actual";
      var th = document.createElement("th"); th.scope = "row";
      var b = document.createElement("button"); b.type = "button"; b.className = "elegir-fila";
      b.textContent = "Objeto " + (i + 1);
      b.title = "Cargar los próximos datos en esta fila";
      b.setAttribute("aria-pressed", String(i === tabla.actual));
      b.addEventListener("click", function () { tabla.actual = i; guardar(); dibujarTabla(); });
      th.appendChild(b); r.appendChild(th);
      tabla.columnas.forEach(function (c) {
        var td = document.createElement("td");
        td.contentEditable = "true";
        td.textContent = fila[c] || "";
        td.setAttribute("aria-label", c + ", objeto " + (i + 1));
        td.addEventListener("blur", function () { fila[c] = td.textContent.trim(); guardar(); });
        r.appendChild(td);
      });
      cuerpo.appendChild(r);
    });
    $("tabla-vacia").hidden = tabla.columnas.length > 0;
    $("conteo-columnas").textContent = tabla.columnas.length
      ? tabla.columnas.length + (tabla.columnas.length === 1 ? " columna" : " columnas") + ", " + tabla.filas.length + (tabla.filas.length === 1 ? " fila" : " filas")
      : "";
  }

  $("form-dato").addEventListener("submit", function (ev) {
    ev.preventDefault();
    var col = $("columna").value.trim(), val = $("valor").value.trim();
    if (!col) { $("columna").focus(); return; }
    var existente = tabla.columnas.filter(function (c) { return c.toLowerCase() === col.toLowerCase(); })[0];
    if (!existente) { tabla.columnas.push(col); existente = col; }
    tabla.filas[tabla.actual][existente] = val || "sí";
    $("columna").value = ""; $("valor").value = "";
    $("columna").focus();
    guardar(); dibujarTabla();
  });
  $("nueva-fila").addEventListener("click", function () {
    tabla.filas.push({}); tabla.actual = tabla.filas.length - 1; guardar(); dibujarTabla();
  });
  $("vaciar-tabla").addEventListener("click", function () {
    if (!window.confirm("¿Borrar todas las columnas y filas de la tabla?")) return;
    tabla = { columnas: [], filas: [{}], actual: 0 }; guardar(); dibujarTabla();
  });

  dibujarTabla();
})();
