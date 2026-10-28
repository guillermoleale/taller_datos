// Actividad "Una palabra para dato": nube de palabras en vivo y agrupamiento a mano.
// Todo queda en el navegador de quien la usa. No se envía nada a ningún lado.
(function () {
  var ALMACEN = "taller-datos-palabras-v1";

  var VACIAS = ("a al algo algun alguna algunas alguno algunos ante antes aqui asi aun bajo bien cada casi como con contra cual cuales cuando de del desde donde dos el ella ellas ello ellos en entre era eran es esa esas ese eso esos esta estaba estan estar estas este esto estos fue fueron ha han hasta hay la las le les lo los mas me mi mis mucho muchos muy nada ni no nos nosotros o os otra otras otro otros para pero poco por porque pues que quien se sea segun ser si sin sino sobre solo son su sus tal tambien te tiene tienen todo todos tu tus un una unas uno unos usted ustedes y ya yo hola gracias jaja jajaja bueno buen dia buenas tardes noches").split(" ");
  var vacias = {};
  VACIAS.forEach(function (w) { vacias[w] = true; });

  function normalizar(w) {
    return w.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
  }

  function tokenizar(texto) {
    var limpio = texto
      .replace(/https?:\/\/\S+/g, " ")
      .replace(/\b\d{1,2}:\d{2}(:\d{2})?\s*([ap]\.?\s?m\.?)?/gi, " ");
    var palabras = limpio.match(/[A-Za-zÁÉÍÓÚÜÑáéíóúüñ]+/g) || [];
    return palabras.filter(function (w) {
      var k = normalizar(w);
      return k.length >= 3 && !vacias[k];
    });
  }

  function estadoVacio() { return { conteo: {}, quitadas: [], grupos: [], sigId: 1 }; }

  function estadoFormulario() {
    var e = estadoVacio();
    window.DATOS.palabrasFormulario.forEach(function (p) {
      e.conteo[normalizar(p[0])] = { palabra: p[0], n: p[1] };
    });
    return e;
  }

  var datos = { modo: "chat", estados: { chat: estadoVacio(), formulario: estadoFormulario() } };
  try {
    var guardado = JSON.parse(localStorage.getItem(ALMACEN));
    if (guardado && guardado.estados) datos = guardado;
  } catch (e) { /* sin almacenamiento: se trabaja en memoria */ }

  var seleccion = null;

  function guardar() {
    try { localStorage.setItem(ALMACEN, JSON.stringify(datos)); } catch (e) { /* nada */ }
  }

  function est() { return datos.estados[datos.modo]; }

  function agregarTexto(texto) {
    var e = est();
    tokenizar(texto).forEach(function (w) {
      var k = normalizar(w);
      if (!e.conteo[k]) e.conteo[k] = { palabra: w.toLowerCase(), n: 0 };
      e.conteo[k].n += 1;
      var i = e.quitadas.indexOf(k);
      if (i >= 0) e.quitadas.splice(i, 1);
    });
    guardar(); dibujar();
  }

  function visibles() {
    var e = est();
    return Object.keys(e.conteo).filter(function (k) { return e.quitadas.indexOf(k) < 0; });
  }

  function hash(s) {
    var h = 2166136261;
    for (var i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); }
    return h >>> 0;
  }

  var $ = function (id) { return document.getElementById(id); };

  function boton(texto, clase) {
    var b = document.createElement("button");
    b.type = "button";
    b.className = clase;
    b.textContent = texto;
    return b;
  }

  function dibujarNube() {
    var e = est(), nube = $("nube");
    nube.innerHTML = "";
    var claves = visibles();
    if (!claves.length) {
      var p = document.createElement("p");
      p.className = "nube-vacia";
      p.textContent = "Todavía no hay palabras. Escribí las que lleguen al chat y tocá Agregar.";
      nube.appendChild(p);
      $("resumen").textContent = "";
      return;
    }
    var max = 0, total = 0;
    claves.forEach(function (k) { max = Math.max(max, e.conteo[k].n); total += e.conteo[k].n; });
    claves.sort(function (a, b) { return hash(a) - hash(b); });
    claves.forEach(function (k) {
      var c = e.conteo[k];
      var t = max > 1 ? Math.sqrt((c.n - 1) / (max - 1)) : 0.35;
      var b = boton(c.palabra, "palabra");
      b.style.fontSize = (1.05 + t * 2.4).toFixed(2) + "rem";
      if (max > 1 && c.n === max) b.classList.add("mas");
      else if (c.n > 1) b.classList.add("repetida");
      b.title = c.palabra + ": " + c.n + (c.n === 1 ? " vez" : " veces") + ". Tocá para sacarla.";
      b.setAttribute("aria-label", b.title);
      b.addEventListener("click", function () { e.quitadas.push(k); guardar(); dibujar(); });
      nube.appendChild(b);
    });
    var top = claves.slice().sort(function (a, b) { return e.conteo[b].n - e.conteo[a].n; })[0];
    var frase = total + " palabras, " + claves.length + " distintas.";
    if (e.conteo[top].n > 1) frase += " La que más se repite: " + e.conteo[top].palabra + " (" + e.conteo[top].n + " veces).";
    else frase += " Ninguna se repite.";
    $("resumen").textContent = frase;
  }

  function dibujarQuitadas() {
    var e = est(), caja = $("quitadas");
    caja.innerHTML = "";
    if (!e.quitadas.length) { caja.hidden = true; return; }
    caja.hidden = false;
    var etiqueta = document.createElement("span");
    etiqueta.textContent = "Sacaste: ";
    caja.appendChild(etiqueta);
    e.quitadas.forEach(function (k) {
      var b = boton(e.conteo[k].palabra, "chip");
      b.title = "Volver a poner en la nube";
      b.addEventListener("click", function () { e.quitadas.splice(e.quitadas.indexOf(k), 1); guardar(); dibujar(); });
      caja.appendChild(b);
    });
  }

  function chip(k) {
    var e = est(), c = e.conteo[k];
    var b = boton("", "chip");
    b.innerHTML = "<span></span> <small></small>";
    b.firstChild.textContent = c.palabra;
    b.lastChild.textContent = c.n;
    b.setAttribute("aria-pressed", String(seleccion === k));
    b.addEventListener("click", function (ev) {
      ev.stopPropagation();
      seleccion = seleccion === k ? null : k;
      dibujarGrupos();
    });
    return b;
  }

  function mover(k, idDestino) {
    var e = est();
    e.grupos.forEach(function (g) {
      var i = g.claves.indexOf(k);
      if (i >= 0) g.claves.splice(i, 1);
    });
    if (idDestino !== null) {
      e.grupos.forEach(function (g) { if (g.id === idDestino) g.claves.push(k); });
    }
    seleccion = null;
    guardar(); dibujarGrupos();
  }

  function dibujarGrupos() {
    var e = est();
    var enGrupo = {};
    e.grupos.forEach(function (g) {
      g.claves = g.claves.filter(function (k) { return e.conteo[k] && e.quitadas.indexOf(k) < 0; });
      g.claves.forEach(function (k) { enGrupo[k] = true; });
    });
    var libres = visibles().filter(function (k) { return !enGrupo[k]; })
      .sort(function (a, b) { return e.conteo[b].n - e.conteo[a].n || a.localeCompare(b); });

    var pool = $("sin-grupo");
    pool.innerHTML = "";
    libres.forEach(function (k) { pool.appendChild(chip(k)); });
    if (!libres.length) {
      var p = document.createElement("p");
      p.className = "nota";
      p.textContent = visibles().length ? "Todas las palabras tienen grupo." : "Primero cargá palabras en la nube.";
      pool.appendChild(p);
    }

    var cont = $("grupos");
    cont.innerHTML = "";
    e.grupos.forEach(function (g) {
      var caja = document.createElement("div");
      caja.className = "grupo" + (seleccion ? " esperando" : "");
      var total = g.claves.reduce(function (s, k) { return s + e.conteo[k].n; }, 0);
      caja.innerHTML = '<div class="grupo-cabeza"><input type="text" aria-label="Nombre del grupo"><span class="grupo-total"></span></div><div class="grupo-palabras"></div><div class="grupo-acciones"></div>';
      var input = caja.querySelector("input");
      input.value = g.nombre;
      input.addEventListener("change", function () { g.nombre = input.value.trim() || "Sin nombre"; guardar(); });
      caja.querySelector(".grupo-total").textContent = total + (total === 1 ? " mención" : " menciones");
      var lugar = caja.querySelector(".grupo-palabras");
      g.claves.forEach(function (k) { lugar.appendChild(chip(k)); });
      var acciones = caja.querySelector(".grupo-acciones");
      if (seleccion) {
        var poner = boton("Poner acá " + e.conteo[seleccion].palabra, "boton principal");
        poner.addEventListener("click", function () { mover(seleccion, g.id); });
        acciones.appendChild(poner);
      }
      var borrar = boton("Borrar grupo", "boton discreto");
      borrar.addEventListener("click", function () {
        e.grupos = e.grupos.filter(function (x) { return x.id !== g.id; });
        guardar(); dibujarGrupos();
      });
      acciones.appendChild(borrar);
      cont.appendChild(caja);
    });

    var soltar = $("dejar-sin-grupo");
    soltar.hidden = !(seleccion && enGrupo[seleccion]);
  }

  function dibujarModo() {
    var esChat = datos.modo === "chat";
    $("modo-chat").setAttribute("aria-pressed", String(esChat));
    $("modo-form").setAttribute("aria-pressed", String(!esChat));
    $("carga").hidden = !esChat;
    $("nota-formulario").hidden = esChat;
  }

  function dibujar() { dibujarModo(); dibujarNube(); dibujarQuitadas(); dibujarGrupos(); }

  // Eventos
  $("form-palabras").addEventListener("submit", function (ev) {
    ev.preventDefault();
    var input = $("entrada");
    if (input.value.trim()) agregarTexto(input.value);
    input.value = "";
    input.focus();
  });
  $("cargar-chat").addEventListener("click", function () {
    var area = $("texto-chat");
    if (area.value.trim()) agregarTexto(area.value);
    area.value = "";
  });
  $("vaciar").addEventListener("click", function () {
    var pregunta = datos.modo === "chat" ? "¿Borrar todas las palabras del chat y los grupos?" : "¿Volver a la nube original del formulario y borrar los grupos?";
    if (!window.confirm(pregunta)) return;
    datos.estados[datos.modo] = datos.modo === "chat" ? estadoVacio() : estadoFormulario();
    seleccion = null; guardar(); dibujar();
  });
  $("modo-chat").addEventListener("click", function () { datos.modo = "chat"; seleccion = null; guardar(); dibujar(); });
  $("modo-form").addEventListener("click", function () { datos.modo = "formulario"; seleccion = null; guardar(); dibujar(); });
  $("form-grupo").addEventListener("submit", function (ev) {
    ev.preventDefault();
    var input = $("nombre-grupo"), e = est();
    var nombre = input.value.trim();
    if (!nombre) return;
    e.grupos.push({ id: e.sigId++, nombre: nombre, claves: [] });
    input.value = "";
    guardar(); dibujarGrupos();
  });
  $("dejar-sin-grupo").addEventListener("click", function () { if (seleccion) mover(seleccion, null); });

  dibujar();
})();
