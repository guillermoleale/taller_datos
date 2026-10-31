// Gráficos de material.html, a partir de assets/material-datos.js.
(function () {
  var D = window.MATERIAL, num = window.Graficos.numero;
  var MESES = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];
  var $ = function (id) { return document.getElementById(id); };
  function rango(a, b, paso) { var r = []; for (var v = a; v <= b + 1e-9; v += paso) r.push(+v.toFixed(6)); return r; }
  function anio(v) { return String(Math.round(v)); }
  function mes(a, m) { return a + (m - 0.5) / 12; }

  // Patentes: un punto por serie, 676.000 patentes entre una y otra
  (function () {
    var SERIE = 676000;
    var puntos = D.patentes.map(function (p, i) { return [mes(p[1], p[2]), i * SERIE, p[0] + "000AA, " + MESES[p[2] - 1] + " " + p[1]]; });
    var marcas = [];
    D.patentes.forEach(function (p, i) {
      marcas.push({ x: puntos[i][0], y: puntos[i][1], texto: p[0] + "000AA", sub: MESES[p[2] - 1] + " " + p[1], lado: "arriba-izq" });
      if (i === 0) return;
      var q = D.patentes[i - 1];
      var meses = (p[1] - q[1]) * 12 + (p[2] - q[2]);
      marcas.push({ x: (puntos[i][0] + puntos[i - 1][0]) / 2, y: (puntos[i][1] + puntos[i - 1][1]) / 2, texto: meses + " meses", lado: "abajo-der", clase: "g-marca-sub" });
    });
    dibujarLineas($("g-patentes"), {
      descripcion: "Vehículos patentados acumulados desde abril de 2016, con un punto en el inicio de cada serie de patentes, de AA a AI.",
      alto: 440, margenIzq: 64,
      x: { min: 2015.6, max: 2026.4, ticks: rango(2016, 2026, 1), ticksChico: rango(2016, 2026, 2), formato: anio },
      y: { min: 0, max: 5.75e6, ticks: puntos.map(function (p) { return p[1]; }),
        formato: function (v) { return v === 0 ? "0" : num(v / 1e6, 2) + " M"; } },
      series: [{ nombre: "Vehículos patentados", puntos: puntos }],
      marcas: marcas,
      tabla: { x: "Serie e inicio" }
    });
  })();

  // Soja en Pergamino: lluvia del verano contra rendimiento
  (function () {
    var destacar = { "2008/09": "arriba-der", "2017/18": "abajo-der", "2020/21": "arriba-der", "2022/23": "arriba-der", "2014/15": "arriba-der" };
    var puntos = D.soja.map(function (s) { return [s[1], s[2], s[0], s[0] + ": " + num(s[1]) + " mm, " + num(s[2]) + " kg/ha"]; });
    dibujarLineas($("g-soja"), {
      descripcion: "Lluvia de diciembre a marzo y rendimiento de la soja en Pergamino, una campaña por punto, de 2000/01 a 2024/25.",
      alto: 420, margenIzq: 70,
      x: { min: 150, max: 950, ticks: rango(200, 900, 100), ticksChico: rango(200, 900, 200), formato: function (v) { return num(v) + " mm"; } },
      y: { min: 1500, max: 5000, ticks: rango(1500, 5000, 500), titulo: "Rendimiento (kg/ha)", formato: function (v) { return num(v); } },
      series: [{ nombre: "Campaña", puntos: puntos, linea: false, radio: 5 }],
      marcas: D.soja.filter(function (s) { return destacar[s[0]]; }).map(function (s) {
        return { x: s[1], y: s[2], texto: s[0], lado: destacar[s[0]], clase: "g-marca-sub" };
      })
    });
  })();

  // Snow: ataques fatales por día; el día 0 es el 1 de septiembre
  (function () {
    var puntos = [];
    D.snow.agosto.forEach(function (v, i) { var d = 19 + i; puntos.push([d - 32, v, d + " ago", d + " de agosto: " + v]); });
    D.snow.septiembre.forEach(function (v, i) { puntos.push([i, v, (i + 1) + " sep", (i + 1) + " de septiembre: " + v]); });
    dibujarLineas($("g-snow"), {
      descripcion: "Ataques fatales de cólera por día en el brote de Broad Street, del 19 de agosto al 30 de septiembre de 1854. El máximo, 143, fue el 1 de septiembre; el 8, cuando se retiró la manija de la bomba, hubo 12.",
      alto: 250,
      x: { min: -13.5, max: 29.5, ticks: [-13, -1, 7, 14, 21, 29], formato: function (v) { return v < 0 ? (v + 32) + " ago" : (v + 1) + " sep"; } },
      y: { min: 0, max: 150, ticks: [0, 50, 100, 150] },
      series: [{ nombre: "Ataques fatales", puntos: puntos, marcadores: false }],
      verticales: [{ x: 7, texto: ["8 sep: se retira", "la manija"] }],
      marcas: [{ x: 0, y: 143, texto: "143", lado: "der" }],
      tabla: { x: "Día" }
    });
  })();

  // Cebada en Minnesota: promedio por localidad, 1931 y 1932
  (function () {
    var sitios = D.cebada.map(function (c) { return c[0]; });
    var series = D.cebada.map(function (c, i) {
      return { puntos: [[c[1], i], [c[2], i]], clase: "serie-gris", marcadores: false, enLeyenda: false, enTabla: false };
    });
    series.push({ nombre: "1931", clase: "serie-1", linea: false, radio: 6, puntos: D.cebada.map(function (c, i) { return [c[1], i, c[0], c[0] + ", 1931: " + num(c[1], 1) + " bu/ac"]; }) });
    series.push({ nombre: "1932", clase: "serie-2", linea: false, radio: 6, puntos: D.cebada.map(function (c, i) { return [c[2], i, c[0], c[0] + ", 1932: " + num(c[2], 1) + " bu/ac"]; }) });
    dibujarLineas($("g-cebada"), {
      descripcion: "Rendimiento promedio de cebada en seis localidades de Minnesota en 1931 y 1932. En Morris el de 1932 es mayor; en las otras cinco, menor.",
      alto: 330, margenIzq: 118,
      x: { min: 15, max: 60, ticks: rango(20, 60, 10), formato: function (v) { return num(v) + " bu/ac"; } },
      y: { min: -0.6, max: sitios.length - 0.4, ticks: sitios.map(function (s, i) { return i; }), formato: function (v) { return sitios[v] || ""; } },
      series: series
    });
  })();
  // Serie mensual { desde: [año, mes], valores } a puntos [x, y, etiqueta, tooltip]
  function mensual(serie, unidad) {
    return serie.valores.map(function (v, i) {
      var a = serie.desde[0] + Math.floor((serie.desde[1] - 1 + i) / 12), m = (serie.desde[1] - 1 + i) % 12 + 1;
      var etiqueta = MESES[m - 1] + " " + a;
      return [mes(a, m), v, etiqueta, etiqueta + ": " + (v == null ? "sin dato" : num(v, 1) + unidad)];
    });
  }

  // China: desempleo juvenil, dos series y el hueco de julio a noviembre de 2023
  dibujarLineas($("g-china"), {
    descripcion: "Desempleo urbano de 16 a 24 años en China. La serie con estudiantes llega a 21,3 % en junio de 2023 y se interrumpe; la serie sin estudiantes empieza en diciembre de 2023 con 14,9 %.",
    alto: 380,
    x: { min: 2020.95, max: 2026.85, ticks: rango(2021, 2026, 1), formato: anio },
    y: { min: 0, max: 25, ticks: rango(0, 25, 5), formato: function (v) { return v + " %"; } },
    huecos: [{ desde: 2023.5, hasta: 2023 + 11 / 12, texto: ["Sin", "publicar"] }],
    series: [
      { nombre: "Con estudiantes (hasta jun. 2023)", puntos: mensual(D.china.vieja, " %"), marcadores: false },
      { nombre: "Sin estudiantes (desde dic. 2023)", puntos: mensual(D.china.nueva, " %"), marcadores: false }
    ],
    marcas: [
      { x: mes(2023, 6), y: 21.3, texto: "21,3 %", sub: "jun. 2023", lado: "arriba-izq" },
      { x: mes(2023, 12), y: 14.9, texto: "14,9 %", sub: "dic. 2023", lado: "abajo-izq" }
    ],
    tabla: { x: "Mes", formato: function (v) { return num(v, 1); } }
  });

  // EEUU: inflación interanual con octubre de 2025 sin publicar
  dibujarLineas($("g-eeuu"), {
    descripcion: "Inflación interanual de Estados Unidos de enero de 2025 a septiembre de 2026. Octubre de 2025 no tiene dato.",
    alto: 340,
    x: { min: 2025, max: 2026 + 9 / 12, ticks: [mes(2025, 1), mes(2025, 4), mes(2025, 7), mes(2025, 10), mes(2026, 1), mes(2026, 4), mes(2026, 7)],
      formato: function (v) { var a = Math.floor(v), m = Math.round((v - a) * 12 + 0.5); return MESES[m - 1] + " " + String(a).slice(2); } },
    y: { min: 0, max: 5, ticks: rango(0, 5, 1), formato: function (v) { return v + " %"; } },
    huecos: [{ desde: 2025 + 9 / 12, hasta: 2025 + 10 / 12, texto: ["Sin dato:", "oct. 2025"] }],
    series: [{ nombre: "Inflación interanual", puntos: mensual(D.eeuu, " %") }],
    tabla: { x: "Mes", formato: function (v) { return num(v, 1); }, vacio: "sin dato" }
  });
  // Challenger: todos los vuelos previos, con y sin incidentes, en °C
  (function () {
    function c(f) { return (f - 32) * 5 / 9; }
    function punto(v) { return [c(v[2]), v[3], v[0], v[0] + " (" + v[1] + "): " + num(c(v[2]), 1) + " °C (" + v[2] + " °F), " + v[3] + (v[3] === 1 ? " junta con daño" : " juntas con daño")]; }
    dibujarLineas($("g-challenger"), {
      descripcion: "Los 23 vuelos previos al Challenger según la temperatura de la junta y la cantidad de juntas con daño. Todos los vuelos por debajo de 18 °C tuvieron daño. El pronóstico para el 28 de enero de 1986 era de −0,6 °C.",
      alto: 330,
      x: { min: -3, max: 30, ticks: rango(0, 30, 5), formato: function (v) { return v + " °C"; } },
      y: { min: 0, max: 3, ticks: [0, 1, 2, 3], titulo: "Juntas con daño" },
      series: [
        { nombre: "Vuelos sin daño (no estaban en el gráfico de la discusión)", clase: "serie-3", linea: false, radio: 5, puntos: D.challenger.filter(function (v) { return v[3] === 0; }).map(punto) },
        { nombre: "Vuelos con daño", clase: "serie-2", linea: false, radio: 5, puntos: D.challenger.filter(function (v) { return v[3] > 0; }).map(punto) }
      ],
      verticales: [{ x: c(31), texto: ["28 ene 1986:", "−0,6 °C (31 °F)", "previstos"] }]
    });
  })();
  // Pobreza INDEC: dos metodologías, el hueco de 2013-II a 2016-I y la estimación de la UCA
  (function () {
    function semestral(serie) {
      return serie.valores.map(function (v, i) {
        var k = serie.desde[1] - 1 + i, a = serie.desde[0] + Math.floor(k / 2), sem = k % 2 + 1;
        var etiqueta = a + (sem === 1 ? " I" : " II");
        return [a + (sem === 1 ? 0.25 : 0.75), v, etiqueta, etiqueta + ": " + (v == null ? "no se publicó" : num(v, 1) + " %")];
      });
    }
    var P = D.pobreza;
    dibujarLineas($("g-indec"), {
      descripcion: "Porcentaje de personas bajo la línea de pobreza según el INDEC, por semestre. La serie anterior termina en 4,7 % en el primer semestre de 2013; no hay datos oficiales hasta el segundo trimestre de 2016, con 32,2 % y otra metodología.",
      alto: 400,
      x: { min: 2002.8, max: 2026.8, ticks: rango(2004, 2026, 2), ticksChico: rango(2004, 2026, 4), formato: anio },
      y: { min: 0, max: 60, ticks: rango(0, 60, 10), formato: function (v) { return v + " %"; } },
      huecos: [{ desde: 2013.5, hasta: 2016.25, texto: ["Sin dato", "oficial"] }],
      series: [
        { nombre: "INDEC, metodología anterior", clase: "serie-1", puntos: semestral(P.anterior), marcadores: false },
        { nombre: "INDEC, metodología actual", clase: "serie-2", puntos: semestral(P.actual), marcadores: false },
        { nombre: "INDEC, 2.º trimestre 2016", clase: "serie-2", linea: false, enLeyenda: false, enTabla: false, puntos: [[2016.375, P.trimestre2016, "2016 2.º trim.", "2.º trimestre de 2016: 32,2 %"]] },
        { nombre: "UCA-ODSA (estimación privada, anual)", clase: "serie-3", radio: 3, puntos: P.uca.map(function (u) { return [u[0] + 0.5, u[1], String(u[0]), "UCA-ODSA " + u[0] + ": " + num(u[1], 1) + " %"]; }) }
      ],
      marcas: [
        { x: 2013.25, y: 4.7, texto: "4,7 %", sub: "1.er sem. 2013", lado: "arriba-der" },
        { x: 2016.375, y: 32.2, texto: "32,2 %", sub: "2.º trim. 2016", lado: "arriba-izq" }
      ],
      tabla: { x: "Período", formato: function (v) { return num(v, 1); }, vacio: "" }
    });
  })();

  // Femicidios: el conteo de la sociedad civil empieza antes que el oficial
  dibujarLineas($("g-femicidios"), {
    descripcion: "Femicidios por año en la Argentina según La Casa del Encuentro, desde 2008, y según el Registro Nacional de Femicidios de la Corte Suprema, desde 2014.",
    alto: 360,
    x: { min: 2007.5, max: 2025.5, ticks: rango(2008, 2025, 2), ticksChico: rango(2008, 2024, 4), formato: anio },
    y: { min: 0, max: 350, ticks: rango(0, 350, 50) },
    series: [
      { nombre: "La Casa del Encuentro (relevamiento de medios)", clase: "serie-1", marcadores: false,
        puntos: D.femicidios.casa.map(function (f) { return [f[0], f[1], String(f[0]), f[0] + ": " + (f[1] == null ? "sin cifra anual encontrada" : f[1])]; }) },
      { nombre: "Corte Suprema (causas judiciales)", clase: "serie-2", marcadores: false,
        puntos: D.femicidios.corte.map(function (f) { return [f[0], f[1], String(f[0]), f[0] + ": " + f[1]]; }) }
    ],
    verticales: [{ x: 2015.42, texto: ["3 jun 2015:", "Ni Una Menos"] }],
    tabla: { x: "Año", vacio: "s/d" }
  });
  // URSS: mortalidad infantil publicada, el apagón de 1975 a 1985 y lo que se supo después
  dibujarLineas($("g-urss"), {
    descripcion: "Mortalidad infantil en la URSS por cada 1000 nacidos vivos. El último dato publicado antes del apagón fue 27,9 en 1974. Los valores de 1975 en adelante se conocieron recién a fines de los años ochenta; el máximo fue 31,4 en 1976.",
    alto: 360,
    x: { min: 1959, max: 1991, ticks: rango(1960, 1990, 5), formato: anio },
    y: { min: 0, max: 40, ticks: rango(0, 40, 10) },
    huecos: [{ desde: 1974.5, hasta: 1985.5, texto: ["No se publicó"] }],
    series: [
      { nombre: "Publicado en su momento", clase: "serie-1", puntos: D.urss.publicados.map(function (u) { return [u[0], u[1], String(u[0]), u[0] + ": " + num(u[1], 1)]; }) },
      { nombre: "Conocido después", clase: "serie-2", marcadores: false, puntos: D.urss.despues.map(function (u) { return [u[0], u[1], String(u[0]), u[0] + ": " + num(u[1], 1)]; }) },
      { nombre: "Estimación externa (Davis y Feshbach, 1980)", clase: "serie-3", linea: false, radio: 6, puntos: [[1976, D.urss.estimacion1976, "1976 (estimación)", "Estimación de Davis y Feshbach para 1976: 31,1"]] }
    ],
    marcas: [
      { x: 1974, y: 27.9, texto: "27,9", sub: "último publicado", lado: "abajo-der" },
      { x: 1976, y: 31.4, texto: "31,4", lado: "arriba-der" }
    ],
    tabla: { x: "Año", formato: function (v) { return num(v, 1); } }
  });

  // Expreso VGG: la mitad superior del cuadro, con el fondo según el precio (los números, como en el original)
  (function () {
    if (!$("t-vgg")) return;
    var V = D.vgg, min = 2100, max = 13296;
    var html = "<thead><tr><th>De ↓ a →</th>";
    V.paradas.slice(1).forEach(function (p) { html += '<th class="num">' + p + "</th>"; });
    html += "</tr></thead><tbody>";
    V.tarifas.forEach(function (fila, i) {
      html += "<tr><th>" + V.paradas[i] + "</th>";
      for (var j = 0; j < i; j++) html += "<td></td>";
      fila.forEach(function (v) {
        var pct = Math.round(8 + 50 * (v - min) / (max - min));
        html += '<td class="num" style="background:color-mix(in srgb, var(--barra) ' + pct + '%, var(--ficha))">' + v + "</td>";
      });
      html += "</tr>";
    });
    $("t-vgg").innerHTML = html + "</tbody>";
  })();
})();
