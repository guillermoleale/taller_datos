// Consola docente: abre actividades, junta respuestas y las muestra en vivo.
(function () {
  var A = window.ACTIVIDADES, EV = window.EnVivo, T = window.Texto;
  var porId = {};
  A.forEach(function (a) { porId[a.id] = a; });
  var $ = function (id) { return document.getElementById(id); };

  function cargar(k, def) { try { var v = JSON.parse(localStorage.getItem(k)); return v == null ? def : v; } catch (e) { return def; } }
  function guardar(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
  function el(tag, clase, texto) {
    var n = document.createElement(tag);
    if (clase) n.className = clase;
    if (texto != null) n.textContent = texto;
    return n;
  }
  function boton(texto, clase, accion) {
    var b = el("button", clase || "boton", texto);
    b.type = "button";
    if (accion) b.addEventListener("click", accion);
    return b;
  }

  var SALA = EV.sala;
  var estado = null;          // { actividad, ronda, abierta }
  var filas = [];             // todas las respuestas leídas
  var desde = 1;              // última fila leída
  var ocultas = cargar("taller-ocultas:" + SALA, {});
  var rondas = cargar("taller-rondas:" + SALA, {});
  var vista = {};             // estado de pantalla por actividad (revelados, resultados del modelo)
  var dibujado = "";          // firma de lo último dibujado, para no redibujar sin cambios

  var NOMBRES_TIPO = { nube: "Nube", votacion: "Votación", notas: "Notas", etiquetar: "Etiquetar" };

  // Enlace y QR para participar
  var enlace = new URL("p/", location.href).href;
  var enlaceCorto = enlace.replace(/^https?:\/\//, "").replace(/\/$/, "");
  document.querySelectorAll("[data-enlace]").forEach(function (n) { n.textContent = enlaceCorto; });
  function dibujarQR(contenedor, tam) {
    contenedor.innerHTML = "";
    if (typeof window.qrcode !== "function") return false;
    try {
      var qr = window.qrcode(0, "M");
      qr.addData(enlace);
      qr.make();
      contenedor.innerHTML = qr.createSvgTag({ cellSize: tam || 6, margin: 2, scalable: true });
      var svg = contenedor.querySelector("svg");
      if (svg) { svg.setAttribute("role", "img"); svg.setAttribute("aria-label", "Código QR para participar: " + enlaceCorto); }
      return true;
    } catch (e) { return false; }
  }

  // Conexión
  function conexion(ok, mensaje) {
    var n = $("conexion");
    if (EV.modo === "prueba") {
      n.textContent = "Modo de prueba: solo pestañas de este navegador";
      n.dataset.estado = "prueba";
    } else if (ok) {
      n.textContent = "Conectado a la planilla";
      n.dataset.estado = "ok";
    } else {
      n.textContent = "Sin conexión con la planilla. Reintentando…" + (mensaje ? " (" + mensaje + ")" : "");
      n.dataset.estado = "error";
    }
  }

  function secreto() { return $("secreto") ? $("secreto").value : ""; }

  function aviso(texto) {
    var n = $("aviso");
    n.textContent = texto || "";
    n.hidden = !texto;
  }

  function fijar(nuevo) {
    aviso("");
    return EV.fijarEstado(nuevo, secreto()).then(function (r) {
      if (!r || !r.ok) throw new Error((r && r.error) || "No se pudo cambiar la actividad");
      estado = nuevo;
      dibujarTodo();
    }).catch(function (e) { aviso(e.message); });
  }

  function lanzar(id, nueva) {
    var ronda = (!nueva && rondas[id]) || Date.now().toString(36);
    rondas[id] = ronda;
    guardar("taller-rondas:" + SALA, rondas);
    fijar({ actividad: id, ronda: ronda, abierta: true, t: Date.now() });
  }

  // Respuestas de la actividad activa
  function respuestas(id, ronda) {
    return filas.filter(function (f) {
      return f.actividad === id && f.ronda === ronda && !ocultas[f.fila];
    });
  }
  function ocultar(f) {
    ocultas[f.fila] = true;
    guardar("taller-ocultas:" + SALA, ocultas);
    dibujado = "";
    dibujarResultado();
  }
  function ultimoPorPersona(rs, validos) {
    var votos = {};
    rs.forEach(function (f) { if (!validos || validos(f.valor)) votos[f.p] = f.valor; });
    return votos;
  }

  // Lista de actividades
  function dibujarLista() {
    var lista = $("lista");
    lista.innerHTML = "";
    var grupo = null, ul = null;
    A.forEach(function (a) {
      if (a.grupo !== grupo) {
        grupo = a.grupo;
        lista.appendChild(el("h2", "grupo-titulo", grupo));
        ul = el("ul", "actividades");
        lista.appendChild(ul);
      }
      var li = el("li");
      var activa = estado && estado.actividad === a.id;
      var b = boton("", "item-actividad", function () { lanzar(a.id, false); });
      if (activa) b.setAttribute("aria-current", "true");
      b.appendChild(el("span", "item-titulo", a.titulo));
      var n = rondas[a.id] ? respuestas(a.id, rondas[a.id]).length : 0;
      b.appendChild(el("span", "item-meta", NOMBRES_TIPO[a.tipo] + (n ? ", " + n + (n === 1 ? " respuesta" : " respuestas") : "") + (activa ? (estado.abierta ? ", abierta" : ", cerrada") : "")));
      li.appendChild(b);
      ul.appendChild(li);
    });
  }

  // Panel principal
  function dibujarTodo() {
    dibujarLista();
    var a = estado && porId[estado.actividad];
    $("inicio").hidden = !!a;
    $("panel").hidden = !a;
    if (!a) { dibujarQR($("qr-inicio"), 8); return; }
    $("panel-grupo").textContent = a.grupo;
    $("panel-titulo").textContent = a.titulo;
    $("panel-consigna").textContent = a.consigna;
    $("alternar").textContent = estado.abierta ? "Cerrar respuestas" : "Abrir respuestas";
    $("simular").hidden = EV.modo !== "prueba";
    dibujado = "";
    dibujarResultado();
  }

  function resumen(rs) {
    var personas = {};
    rs.forEach(function (f) { personas[f.p] = true; });
    var np = Object.keys(personas).length;
    var txt = rs.length + (rs.length === 1 ? " respuesta" : " respuestas") + " de " + np + (np === 1 ? " persona" : " personas");
    txt += estado.abierta ? ". Respuestas abiertas." : ". Respuestas cerradas.";
    $("panel-estado").textContent = txt;
  }

  function dibujarResultado() {
    var a = estado && porId[estado.actividad];
    if (!a) return;
    var rs = respuestas(a.id, estado.ronda);
    var firma = a.id + "|" + estado.ronda + "|" + rs.length + "|" + JSON.stringify(vista[a.id] || {});
    resumen(rs);
    if (a.tipo === "notas") { tablero(a, rs); dibujado = firma; return; }
    if (firma === dibujado) return;
    dibujado = firma;
    var r = $("resultado");
    r.innerHTML = "";
    r.dataset.tipo = a.tipo;
    if (a.tipo === "nube") verNube(r, a, rs);
    if (a.tipo === "votacion") verVotacion(r, a, rs);
    if (a.tipo === "etiquetar") verEtiquetar(r, a, rs);
  }

  // Nube
  function verNube(r, a, rs) {
    var claveQuitadas = "taller-quitadas:" + SALA + ":" + a.id + ":" + estado.ronda;
    var quitadas = cargar(claveQuitadas, []);
    var conteo = T.contar(rs.map(function (f) { return f.valor; }));
    var claves = Object.keys(conteo).filter(function (k) { return quitadas.indexOf(k) < 0; });
    var nube = el("div", "nube");
    if (!claves.length) nube.appendChild(el("p", "vacio", "Esperando palabras…"));
    var max = 0;
    claves.forEach(function (k) { max = Math.max(max, conteo[k].n); });
    claves.sort(function (x, y) { return T.hash(x) - T.hash(y); });
    claves.forEach(function (k) {
      var c = conteo[k];
      var t = max > 1 ? Math.sqrt((c.n - 1) / (max - 1)) : 0.35;
      var b = boton(c.palabra, "palabra", function () {
        quitadas.push(k); guardar(claveQuitadas, quitadas); dibujado = ""; dibujarResultado();
      });
      b.style.fontSize = (1.1 + t * 3.2).toFixed(2) + "rem";
      if (max > 1 && c.n === max) b.classList.add("mas");
      else if (c.n > 1) b.classList.add("repetida");
      b.title = c.palabra + ": " + c.n + (c.n === 1 ? " vez" : " veces") + ". Tocá para sacarla.";
      nube.appendChild(b);
    });
    r.appendChild(nube);
    var pie = el("div", "acciones");
    if (quitadas.length) {
      pie.appendChild(boton("Volver a mostrar " + quitadas.length + (quitadas.length === 1 ? " palabra sacada" : " palabras sacadas"), "boton discreto", function () {
        guardar(claveQuitadas, []); dibujado = ""; dibujarResultado();
      }));
    }
    pie.appendChild(boton("Llevar a agrupar", "boton", function () {
      var datos = cargar("taller-datos-palabras-v1", null) || { estados: {} };
      var c2 = {};
      claves.forEach(function (k) { c2[k] = conteo[k]; });
      datos.modo = "chat";
      datos.estados.chat = { conteo: c2, quitadas: [], grupos: [], sigId: 1 };
      guardar("taller-datos-palabras-v1", datos);
      window.open("palabras.html", "_blank");
    }));
    pie.appendChild(el("span", "nota", "Tocá una palabra para sacarla de la pantalla."));
    r.appendChild(pie);
  }

  // Votación
  function verVotacion(r, a, rs) {
    if (a.texto) r.appendChild(fichaTexto(a.texto));
    var votos = ultimoPorPersona(rs, function (v) { return a.opciones.indexOf(v) >= 0; });
    var cuenta = {};
    a.opciones.forEach(function (o) { cuenta[o] = 0; });
    Object.keys(votos).forEach(function (p) { cuenta[votos[p]] += 1; });
    var total = Object.keys(votos).length;
    var g = el("div", "grafico");
    g.appendChild(el("p", "grafico-sub", total + (total === 1 ? " voto" : " votos") + ". Cuenta el último voto de cada persona."));
    r.appendChild(g);
    dibujarBarras(g, a.opciones.map(function (o) { return { etiqueta: o, valor: cuenta[o] }; }), Math.max(total, 1));
    if (a.modelo) {
      var v = vista[a.id] || {};
      var acc = el("div", "acciones");
      acc.appendChild(boton(v.revelado ? "Ocultar lo que dijo el modelo" : "Mostrar lo que dijo el modelo", "boton", function () {
        vista[a.id] = { revelado: !v.revelado }; dibujarResultado();
      }));
      r.appendChild(acc);
      if (v.revelado) r.appendChild(el("p", "revelado", a.modelo));
    }
  }

  function fichaTexto(texto) {
    var f = el("div", "ficha cita-grande");
    f.appendChild(el("p", null, "“" + texto + "”"));
    return f;
  }

  // Etiquetar
  function verEtiquetar(r, a, rs) {
    var cols = el("div", "etiquetar");
    var fig = el("figure", "imagen-actividad");
    var img = el("img");
    img.src = a.imagen; img.alt = a.titulo;
    img.addEventListener("error", function () {
      fig.insertBefore(el("p", "vacio", "No se pudo cargar la imagen. Revisá la conexión o abrila desde la fuente."), img);
      img.hidden = true;
    });
    fig.appendChild(img);
    var cap = el("figcaption", "nota");
    cap.appendChild(document.createTextNode(a.credito + " "));
    var ln = el("a", null, "Fuente");
    ln.href = a.fuente; ln.target = "_blank"; ln.rel = "noopener";
    cap.appendChild(ln);
    fig.appendChild(cap);
    cols.appendChild(fig);

    var lado = el("div");
    var votos = ultimoPorPersona(rs);
    var cuenta = {}, otras = [];
    a.etiquetas.concat(["Otra"]).forEach(function (e) { cuenta[e] = 0; });
    Object.keys(votos).forEach(function (p) {
      var v = votos[p];
      if (cuenta.hasOwnProperty(v)) cuenta[v] += 1;
      else { cuenta.Otra += 1; otras.push(v.replace(/^Otra:\s*/, "")); }
    });
    var total = Object.keys(votos).length;
    var g = el("div", "grafico");
    g.appendChild(el("p", "grafico-titulo", "Lo que eligieron ustedes"));
    g.appendChild(el("p", "grafico-sub", total + (total === 1 ? " persona" : " personas") + ". Cuenta la última elección de cada una."));
    lado.appendChild(g);
    dibujarBarras(g, a.etiquetas.concat(["Otra"]).map(function (e) { return { etiqueta: e, valor: cuenta[e] }; }), Math.max(total, 1));
    if (total) {
      var mayor = a.etiquetas.concat(["Otra"]).sort(function (x, y) { return cuenta[y] - cuenta[x]; })[0];
      lado.appendChild(el("p", "acuerdo", cuenta[mayor] + " de " + total + " eligieron «" + mayor + "». " + (cuenta[mayor] === total ? "Acuerdo total." : "El resto vio otra cosa.")));
    }
    if (otras.length) {
      var caja = el("div", "otras");
      caja.appendChild(el("span", "nota", "Otras etiquetas que propusieron: "));
      otras.forEach(function (o) { caja.appendChild(el("span", "chip", o)); });
      lado.appendChild(caja);
    }
    var v = vista[a.id] || {};
    var acc = el("div", "acciones");
    acc.appendChild(boton(v.cargando ? "Consultando al modelo…" : "Preguntarle a un modelo de imágenes", "boton", function () { consultarModelo(a, img); }));
    lado.appendChild(acc);
    if (v.error) lado.appendChild(el("p", "aviso-error", v.error));
    if (v.progreso) lado.appendChild(el("p", "nota", v.progreso));
    if (v.modelo) {
      var gm = el("div", "grafico");
      gm.appendChild(el("p", "grafico-titulo", "Lo que eligió el modelo (CLIP)"));
      gm.appendChild(el("p", "grafico-sub", "Probabilidad que le asigna a cada etiqueta, sobre 100. El modelo no tiene la opción «Otra»."));
      lado.appendChild(gm);
      dibujarBarras(gm, a.etiquetas.map(function (e, i) {
        return { etiqueta: e, valor: Math.round(v.modelo[i] * 100) };
      }), 100);
    }
    cols.appendChild(lado);
    r.appendChild(cols);
  }

  var clasificadorPromesa = null;
  function consultarModelo(a, img) {
    vista[a.id] = Object.assign({}, vista[a.id], { cargando: true, error: null, progreso: "Descargando el modelo la primera vez (unos 150 MB). Puede tardar un par de minutos." });
    dibujarResultado();
    if (!clasificadorPromesa) {
      clasificadorPromesa = import("https://cdn.jsdelivr.net/npm/@huggingface/transformers@3").then(function (tr) {
        return tr.pipeline("zero-shot-image-classification", "Xenova/clip-vit-base-patch32");
      });
    }
    clasificadorPromesa.then(function (clasificar) {
      vista[a.id].progreso = "Clasificando la imagen…";
      dibujarResultado();
      return clasificar(a.imagen, a.etiquetasModelo);
    }).then(function (salida) {
      var probs = a.etiquetasModelo.map(function (et) {
        var s = salida.filter(function (o) { return o.label === et; })[0];
        return s ? s.score : 0;
      });
      vista[a.id] = { modelo: probs };
      dibujarResultado();
    }).catch(function (e) {
      clasificadorPromesa = null;
      vista[a.id] = { error: "No se pudo usar el modelo: " + (e && e.message ? e.message : e) };
      dibujarResultado();
    });
  }

  // Tablero de notas
  var tab = { id: null, ronda: null, notas: {}, pos: {}, zonas: [] };
  function claveTablero() { return "taller-tablero:" + SALA + ":" + tab.id + ":" + tab.ronda; }
  function guardarTablero() { guardar(claveTablero(), { pos: tab.pos, zonas: tab.zonas }); }

  function arrastrable(nodo, alSoltar) {
    var inicio = null;
    nodo.addEventListener("pointerdown", function (e) {
      if (e.target.closest("button")) return;
      inicio = { x: e.clientX, y: e.clientY, l: nodo.offsetLeft, t: nodo.offsetTop };
      nodo.setPointerCapture(e.pointerId);
      nodo.classList.add("moviendo");
    });
    nodo.addEventListener("pointermove", function (e) {
      if (!inicio) return;
      nodo.style.left = Math.max(0, inicio.l + e.clientX - inicio.x) + "px";
      nodo.style.top = Math.max(0, inicio.t + e.clientY - inicio.y) + "px";
    });
    function fin() {
      if (!inicio) return;
      inicio = null;
      nodo.classList.remove("moviendo");
      alSoltar(nodo.offsetLeft, nodo.offsetTop);
    }
    nodo.addEventListener("pointerup", fin);
    nodo.addEventListener("pointercancel", fin);
  }

  function tablero(a, rs) {
    var r = $("resultado");
    if (tab.id !== a.id || tab.ronda !== estado.ronda || !$("tablero")) {
      tab = { id: a.id, ronda: estado.ronda, notas: {}, pos: {}, zonas: [] };
      var g = cargar(claveTablero(), null);
      if (g) { tab.pos = g.pos || {}; tab.zonas = g.zonas || []; }
      r.innerHTML = "";
      r.dataset.tipo = "notas";
      var barra = el("form", "barra-tablero");
      var input = el("input");
      input.type = "text"; input.placeholder = "Nombre de un grupo, por ejemplo: imágenes"; input.setAttribute("aria-label", "Nombre del grupo");
      barra.appendChild(input);
      var crear = el("button", "boton", "Agregar título de grupo"); crear.type = "submit";
      barra.appendChild(crear);
      barra.appendChild(boton("Ordenar en grilla", "boton discreto", function () {
        tab.pos = {}; guardarTablero(); Object.keys(tab.notas).forEach(function (k) { tab.notas[k].remove(); }); tab.notas = {}; tablero(a, respuestas(a.id, estado.ronda));
      }));
      barra.addEventListener("submit", function (e) {
        e.preventDefault();
        if (!input.value.trim()) return;
        tab.zonas.push({ id: Date.now(), texto: input.value.trim(), x: 16, y: 16 });
        input.value = "";
        guardarTablero(); dibujarZonas();
      });
      r.appendChild(barra);
      var t = el("div", "tablero"); t.id = "tablero";
      r.appendChild(t);
      r.appendChild(el("p", "nota", "Arrastrá las notas para agruparlas. La × saca una nota de la pantalla."));
      dibujarZonas();
    }
    var t2 = $("tablero");
    var vivas = {};
    rs.forEach(function (f, i) {
      vivas[f.fila] = true;
      if (tab.notas[f.fila]) return;
      var n = el("div", "nota-tablero");
      n.appendChild(el("p", null, f.valor));
      var x = boton("×", "quitar", function () { ocultar(f); });
      x.setAttribute("aria-label", "Sacar esta nota");
      n.appendChild(x);
      var p = tab.pos[f.fila];
      if (!p) {
        var ancho = Math.max(t2.clientWidth, 320), w = 190, gap = 14;
        var cols = Math.max(1, Math.floor((ancho - gap) / (w + gap)));
        var k = Object.keys(tab.notas).length;
        p = { x: gap + (k % cols) * (w + gap), y: 70 + Math.floor(k / cols) * 120 };
      }
      n.style.left = p.x + "px"; n.style.top = p.y + "px";
      arrastrable(n, function (x2, y2) { tab.pos[f.fila] = { x: x2, y: y2 }; guardarTablero(); });
      t2.appendChild(n);
      tab.notas[f.fila] = n;
    });
    Object.keys(tab.notas).forEach(function (k) {
      if (!vivas[k]) { tab.notas[k].remove(); delete tab.notas[k]; }
    });
    var alto = 360;
    Object.keys(tab.notas).forEach(function (k) { alto = Math.max(alto, tab.notas[k].offsetTop + tab.notas[k].offsetHeight + 24); });
    t2.style.minHeight = alto + "px";
  }

  function dibujarZonas() {
    var t = $("tablero");
    t.querySelectorAll(".zona-titulo").forEach(function (z) { z.remove(); });
    tab.zonas.forEach(function (z) {
      var n = el("div", "zona-titulo");
      n.appendChild(el("span", null, z.texto));
      var x = boton("×", "quitar", function () {
        tab.zonas = tab.zonas.filter(function (o) { return o.id !== z.id; }); guardarTablero(); dibujarZonas();
      });
      x.setAttribute("aria-label", "Borrar este título");
      n.appendChild(x);
      n.style.left = z.x + "px"; n.style.top = z.y + "px";
      arrastrable(n, function (x2, y2) { z.x = x2; z.y = y2; guardarTablero(); });
      t.appendChild(n);
    });
  }

  // Simulación (solo modo de prueba)
  var MUESTRAS = {
    nube: ["información", "verdad", "número", "archivo", "memoria", "evidencia", "control", "poder", "construcción", "registro", "fuente", "información", "prueba", "huella", "contexto", "información", "memoria"],
    notas: ["Una fotografía del archivo", "Cada entrevista", "Un fragmento de un libro", "Una tapa de revista", "Un posteo con sus comentarios", "Cada carta del epistolario", "Una escena de una película", "Una persona entrevistada", "Un fanzine completo", "Cada página del cuaderno"]
  };
  function azar(lista) { return lista[Math.floor(Math.random() * lista.length)]; }
  function simular() {
    var a = porId[estado.actividad];
    var promesas = [];
    for (var i = 0; i < 6; i++) {
      var quien = "sim" + Math.floor(Math.random() * 14);
      var valor;
      if (a.tipo === "nube") valor = azar(MUESTRAS.nube);
      else if (a.tipo === "notas") valor = azar(MUESTRAS.notas);
      else if (a.tipo === "votacion") valor = azar(a.opciones.concat([a.opciones[0]]));
      else valor = Math.random() < 0.15 ? "Otra: " + azar(["alegoría", "ciudad", "arquitectura", "pobreza"]) : azar(a.etiquetas.concat([a.etiquetas[0], a.etiquetas[1]]));
      promesas.push(EV.responder(a.id, estado.ronda, valor, quien));
    }
    Promise.all(promesas).then(leerAhora);
  }

  // Ciclo de lectura
  var leyendo = false;
  function leerAhora() {
    if (leyendo) return Promise.resolve();
    leyendo = true;
    return Promise.all([EV.leer(desde), EV.estado()]).then(function (res) {
      var r = res[0], e = res[1];
      if (r && r.ok) {
        if (r.filas.length) filas = filas.concat(r.filas);
        desde = r.ultima;
      }
      conexion(true);
      var nuevo = e && e.ok ? e.estado : estado;
      if (JSON.stringify(nuevo) !== JSON.stringify(estado)) {
        estado = nuevo;
        // Anota la ronda que abrió otra consola, para que tocar esa actividad no la reinicie.
        if (estado && rondas[estado.actividad] !== estado.ronda) {
          rondas[estado.actividad] = estado.ronda;
          guardar("taller-rondas:" + SALA, rondas);
        }
        dibujarTodo();
      }
      else if (r && r.filas.length) { dibujarResultado(); dibujarLista(); }
    }).catch(function (err) {
      conexion(false, err && err.message);
    }).then(function () { leyendo = false; });
  }
  function ciclo() { leerAhora().then(function () { setTimeout(ciclo, EV.intervalo); }); }

  // Controles
  $("alternar").addEventListener("click", function () {
    fijar(Object.assign({}, estado, { abierta: !estado.abierta }));
  });
  $("reiniciar").addEventListener("click", function () {
    if (window.confirm("¿Empezar esta actividad de nuevo? Las respuestas anteriores quedan guardadas en la planilla pero dejan de mostrarse.")) lanzar(estado.actividad, true);
  });
  $("terminar").addEventListener("click", function () { fijar(null); });
  $("simular").addEventListener("click", simular);
  // Pantalla completa de toda la zona principal, para que se vea también el temporizador.
  function pantallaCompleta() {
    var p = $("principal");
    if (document.fullscreenElement) document.exitFullscreen();
    else if (p.requestFullscreen) p.requestFullscreen();
  }
  $("completa").addEventListener("click", pantallaCompleta);
  $("completa-inicio").addEventListener("click", pantallaCompleta);
  window.addEventListener("temporizador:fin", function (e) {
    if (e.detail && e.detail.cerrar && estado && estado.abierta) fijar(Object.assign({}, estado, { abierta: false }));
  });
  $("ver-qr").addEventListener("click", function () {
    var d = $("dialogo-qr");
    dibujarQR($("qr-grande"), 10);
    if (d.showModal) d.showModal(); else d.setAttribute("open", "");
  });
  $("cerrar-qr").addEventListener("click", function () { $("dialogo-qr").close(); });

  if (EV.modo === "planilla") {
    var s = $("secreto");
    // Enlace docente (en-vivo.html#clave=...): guarda la contraseña y la saca de la barra de direcciones.
    var clave = /(?:^#|&)clave=([^&]*)/.exec(location.hash);
    if (clave) {
      guardar("taller-secreto", decodeURIComponent(clave[1]));
      history.replaceState(null, "", location.pathname + location.search);
    }
    s.value = cargar("taller-secreto", "") || "";
    s.addEventListener("change", function () { guardar("taller-secreto", s.value); });
    $("ajustes-planilla").hidden = false;
  } else {
    $("ajustes-prueba").hidden = false;
    $("borrar-prueba").addEventListener("click", function () {
      if (!window.confirm("¿Borrar todas las respuestas de prueba?")) return;
      EV.borrarPrueba(); filas = []; desde = 1; estado = null; dibujarTodo();
    });
  }

  conexion(true);
  dibujarTodo();
  ciclo();
  window.addEventListener("load", function () { if (!estado) dibujarQR($("qr-inicio"), 8); });
})();
