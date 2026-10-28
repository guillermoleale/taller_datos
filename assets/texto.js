// Utilidades de texto compartidas: normalizar, quitar palabras vacías y contar.
(function () {
  var VACIAS = ("a al algo algun alguna algunas alguno algunos ante antes aqui asi aun bajo bien cada casi como con contra cual cuales cuando de del desde donde dos el ella ellas ello ellos en entre era eran es esa esas ese eso esos esta estaba estan estar estas este esto estos fue fueron ha han hasta hay la las le les lo los mas me mi mis mucho muchos muy nada ni no nos nosotros o os otra otras otro otros para pero poco por porque pues que quien se sea segun ser si sin sino sobre solo son su sus tal tambien te tiene tienen todo todos tu tus un una unas uno unos usted ustedes y ya yo hola gracias jaja jajaja bueno buen dia buenas tardes noches").split(" ");
  var vacias = {};
  VACIAS.forEach(function (w) { vacias[w] = true; });

  function normalizar(w) {
    return String(w).toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
  }

  function tokenizar(texto) {
    var limpio = String(texto)
      .replace(/https?:\/\/\S+/g, " ")
      .replace(/\b\d{1,2}:\d{2}(:\d{2})?\s*([ap]\.?\s?m\.?)?/gi, " ");
    var palabras = limpio.match(/[A-Za-zÁÉÍÓÚÜÑáéíóúüñ]+/g) || [];
    return palabras.filter(function (w) {
      var k = normalizar(w);
      return k.length >= 3 && !vacias[k];
    });
  }

  // Devuelve { palabraNormalizada: { palabra, n } } a partir de una lista de textos.
  function contar(textos) {
    var conteo = {};
    textos.forEach(function (t) {
      tokenizar(t).forEach(function (w) {
        var k = normalizar(w);
        if (!conteo[k]) conteo[k] = { palabra: w.toLowerCase(), n: 0 };
        conteo[k].n += 1;
      });
    });
    return conteo;
  }

  function hash(s) {
    var h = 2166136261;
    for (var i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); }
    return h >>> 0;
  }

  window.Texto = { normalizar: normalizar, tokenizar: tokenizar, contar: contar, hash: hash };
})();
