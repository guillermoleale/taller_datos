// Gráficos de líneas y puntos en SVG, con los colores del sitio (claro y oscuro).
// Se redibujan cuando cambia el ancho del contenedor.
(function () {
  var NS = "http://www.w3.org/2000/svg";

  function nodo(tag, attrs, padre) {
    var n = document.createElementNS(NS, tag);
    for (var k in attrs) n.setAttribute(k, attrs[k]);
    if (padre) padre.appendChild(n);
    return n;
  }

  function texto(padre, x, y, contenido, clase, ancla) {
    var t = nodo("text", { x: x, y: y, "class": clase || "", "text-anchor": ancla || "start" }, padre);
    t.textContent = contenido;
    return t;
  }

  function numero(v, decimales) {
    return v.toLocaleString("es-AR", { minimumFractionDigits: decimales || 0, maximumFractionDigits: decimales || 0 });
  }

  // o: { series: [{ nombre, clase, puntos: [[x, y], ...], linea, etiquetas }],
  //      x: { min, max, ticks, formato }, y: { min, max, ticks, formato, titulo },
  //      huecos: [{ desde, hasta, texto }], verticales: [{ x, texto }],
  //      marcas: [{ x, y, texto, sub, lado, clase }], alto, margenIzq, descripcion, tabla: { x, formato, vacio } }
  // Cada punto es [x, y, etiqueta, texto del tooltip]; y = null corta la línea.
  function dibujar(svg, o, ancho) {
    while (svg.firstChild) svg.removeChild(svg.firstChild);
    var alto = o.alto || 360;
    var chico = ancho < 520;
    var m = { izq: o.margenIzq || (o.y.titulo ? 64 : 52), der: o.margenDer || 18, arr: 26, aba: 34 };
    if (chico) m.izq -= 6;
    var w = ancho - m.izq - m.der, h = alto - m.arr - m.aba;
    svg.setAttribute("viewBox", "0 0 " + ancho + " " + alto);
    svg.setAttribute("width", ancho);
    svg.setAttribute("height", alto);

    var sx = function (v) { return m.izq + (v - o.x.min) / (o.x.max - o.x.min) * w; };
    var sy = function (v) { return m.arr + h - (v - o.y.min) / (o.y.max - o.y.min) * h; };
    var fx = o.x.formato || function (v) { return String(v); };
    var fy = o.y.formato || function (v) { return numero(v); };

    (o.huecos || []).forEach(function (hu) {
      var x0 = sx(Math.max(hu.desde, o.x.min)), x1 = sx(Math.min(hu.hasta, o.x.max));
      nodo("rect", { x: x0, y: m.arr, width: Math.max(1, x1 - x0), height: h, "class": "g-hueco" }, svg);
      if (hu.texto) {
        var lineas = [].concat(hu.texto);
        lineas.forEach(function (l, i) { texto(svg, (x0 + x1) / 2, m.arr + 18 + i * 17, l, "g-hueco-texto", "middle"); });
      }
    });

    o.y.ticks.forEach(function (v) {
      var y = sy(v);
      nodo("line", { x1: m.izq, x2: m.izq + w, y1: y, y2: y, "class": v === o.y.min ? "g-base" : "g-grilla" }, svg);
      texto(svg, m.izq - 8, y + 4, fy(v), "g-eje", "end");
    });
    if (o.y.titulo) {
      var ty = texto(svg, 0, 0, o.y.titulo, "g-eje", "middle");
      ty.setAttribute("transform", "translate(14," + (m.arr + h / 2) + ") rotate(-90)");
    }
    var ticksX = chico && o.x.ticksChico ? o.x.ticksChico : o.x.ticks;
    ticksX.forEach(function (v) {
      texto(svg, sx(v), m.arr + h + 22, fx(v), "g-eje", "middle");
    });

    (o.verticales || []).forEach(function (ve) {
      var x = sx(ve.x);
      nodo("line", { x1: x, x2: x, y1: m.arr, y2: m.arr + h, "class": "g-vertical" }, svg);
      if (ve.texto) {
        var ancla = x > m.izq + w * 0.6 ? "end" : "start";
        [].concat(ve.texto).forEach(function (l, i) {
          texto(svg, x + (ancla === "end" ? -6 : 6), m.arr + 14 + i * 17, l, "g-marca-sub", ancla);
        });
      }
    });

    o.series.forEach(function (s, i) {
      var clase = s.clase || "serie-" + (i + 1);
      var g = nodo("g", { "class": "g-serie " + clase }, svg);
      if (s.linea !== false) {
        var d = "", abierto = false;
        s.puntos.forEach(function (p) {
          if (p[1] == null) { abierto = false; return; }
          d += (abierto ? "L" : "M") + sx(p[0]).toFixed(1) + "," + sy(p[1]).toFixed(1);
          abierto = true;
        });
        nodo("path", { d: d, "class": "g-linea" }, g);
      }
      var usados = {};
      s.puntos.forEach(function (p) {
        if (p[1] == null || s.marcadores === false) return;
        var cx = sx(p[0]), cy = sy(p[1]);
        var clave = Math.round(cx) + ":" + Math.round(cy);
        var apilados = usados[clave] || 0;
        usados[clave] = apilados + 1;
        var c = nodo("circle", { cx: cx, cy: cy - apilados * 10, r: s.radio || 4, "class": "g-punto" }, g);
        nodo("title", {}, c).textContent = p[3] || (s.nombre ? s.nombre + ": " : "") + (p[2] || fx(p[0])) + ", " + fy(p[1]);
      });
    });

    (o.marcas || []).forEach(function (mk) {
      var x = sx(mk.x), y = sy(mk.y);
      var lado = mk.lado || "arriba-izq";
      var dx = /izq/.test(lado) ? -10 : /der/.test(lado) ? 10 : 0;
      var ancla = dx < 0 ? "end" : dx > 0 ? "start" : "middle";
      var y0 = /abajo/.test(lado) ? y + 20 : mk.sub ? y - 26 : y - 10;
      if (/centro/.test(lado)) y0 = y + 5;
      texto(svg, x + dx, y0, mk.texto, mk.clase || "g-marca", ancla);
      if (mk.sub) texto(svg, x + dx, y0 + 16, mk.sub, "g-marca-sub", ancla);
    });
  }

  function tablaDatos(o) {
    var t = o.tabla;
    var det = document.createElement("details");
    det.className = "ver-datos";
    var sum = document.createElement("summary");
    sum.textContent = "Ver los datos";
    det.appendChild(sum);
    var caja = document.createElement("div");
    caja.className = "tabla-caja";
    var tabla = document.createElement("table");
    tabla.className = "datos";
    var cab = "<thead><tr><th>" + t.x + "</th>";
    var columnas = o.series.filter(function (s) { return s.enTabla !== false; });
    columnas.forEach(function (s) { cab += '<th class="num">' + (s.nombre || "Valor") + "</th>"; });
    cab += "</tr></thead>";
    var filas = {}, orden = [];
    columnas.forEach(function (s, i) {
      s.puntos.forEach(function (p) {
        var k = p[2] || (o.x.formato ? o.x.formato(p[0]) : String(p[0]));
        if (!filas[k]) { filas[k] = []; orden.push({ k: k, x: p[0] }); }
        filas[k][i] = p[1];
      });
    });
    orden.sort(function (a, b) { return a.x - b.x; });
    var cuerpo = "<tbody>";
    var fy = t.formato || o.y.formato || function (v) { return numero(v); };
    orden.forEach(function (f) {
      cuerpo += "<tr><td>" + f.k + "</td>";
      columnas.forEach(function (s, i) {
        var v = filas[f.k][i];
        cuerpo += '<td class="num">' + (v == null ? (t.vacio || "") : fy(v)) + "</td>";
      });
      cuerpo += "</tr>";
    });
    tabla.innerHTML = cab + cuerpo + "</tbody>";
    caja.appendChild(tabla);
    det.appendChild(caja);
    return det;
  }

  window.dibujarLineas = function (contenedor, o) {
    if (!contenedor) return;
    var svg = nodo("svg", { role: "img", "class": "g-svg" });
    if (o.descripcion) svg.setAttribute("aria-label", o.descripcion);
    contenedor.appendChild(svg);
    if (o.series.filter(function (s) { return s.enLeyenda !== false; }).length > 1 && o.leyenda !== false) {
      var ley = document.createElement("div");
      ley.className = "leyenda";
      o.series.forEach(function (s, i) {
        if (s.enLeyenda === false) return;
        var sp = document.createElement("span");
        sp.className = "g-ley " + (s.clase || "serie-" + (i + 1));
        sp.textContent = s.nombre;
        ley.appendChild(sp);
      });
      contenedor.appendChild(ley);
    }
    if (o.tabla) contenedor.appendChild(tablaDatos(o));

    var ultimo = 0;
    function ajustar() {
      var ancho = Math.round(contenedor.clientWidth);
      if (!ancho || ancho === ultimo) return;
      ultimo = ancho;
      dibujar(svg, o, ancho);
    }
    ajustar();
    if (window.ResizeObserver) new ResizeObserver(ajustar).observe(contenedor);
    else window.addEventListener("resize", ajustar);
  };

  window.Graficos = { numero: numero };
})();
