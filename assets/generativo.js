// Página "Un modelo clasificando": corridas grabadas y corrida en vivo opcional.
(function () {
  var G = window.GENERATIVO;
  var $ = function (id) { return document.getElementById(id); };
  function el(tag, clase, texto) {
    var n = document.createElement(tag);
    if (clase) n.className = clase;
    if (texto != null) n.textContent = texto;
    return n;
  }
  var enVivo = null;   // respuestas de la corrida en vivo, si hay

  // Consigna
  $("consigna").textContent = G.consigna(G.categorias);

  // Comentarios
  var lista = $("comentarios");
  G.comentarios.forEach(function (c) { lista.appendChild(el("li", null, c)); });

  // Tabla de corridas
  function dibujarTabla() {
    var corridas = G.corridas.slice();
    if (enVivo) corridas.push({ nombre: "En vivo", orden: enVivo.orden, respuestas: enVivo.respuestas });
    var cab = $("tabla-cabeza"), cuerpo = $("tabla-cuerpo");
    cab.innerHTML = ""; cuerpo.innerHTML = "";
    var tr = el("tr");
    var th = el("th", "num", "N.º"); th.scope = "col"; tr.appendChild(th);
    corridas.forEach(function (c) {
      var t = el("th", null, c.nombre + (c.orden === "reordenado" ? " *" : "")); t.scope = "col"; tr.appendChild(t);
    });
    cab.appendChild(tr);
    var difieren = 0;
    G.comentarios.forEach(function (_, i) {
      var fila = el("tr");
      var n = el("th", "num", String(i + 1)); n.scope = "row"; fila.appendChild(n);
      var base = corridas[0].respuestas[i].categoria;
      var distinta = false;
      corridas.forEach(function (c) {
        var r = c.respuestas[i] || { categoria: "(sin respuesta)" };
        var td = el("td", null, r.categoria);
        if (r.categoria !== base) { td.className = "distinta"; distinta = true; }
        if (r.motivo) td.title = r.motivo;
        fila.appendChild(td);
      });
      if (distinta) difieren += 1;
      cuerpo.appendChild(fila);
    });
    $("tabla-resumen").textContent = difieren
      ? "Las corridas no coinciden en " + difieren + (difieren === 1 ? " comentario" : " comentarios") + ". Las celdas marcadas son las que cambian."
      : "Las " + corridas.length + " corridas coincidieron en los 10 comentarios.";
  }
  dibujarTabla();

  // Motivos de un mismo comentario
  function dibujarMotivos(i) {
    var caja = $("motivos");
    caja.innerHTML = "";
    var corridas = G.corridas.concat(enVivo ? [{ nombre: "En vivo", respuestas: enVivo.respuestas }] : []);
    corridas.forEach(function (c) {
      var r = c.respuestas[i];
      if (!r) return;
      var f = el("div", "ficha motivo");
      f.appendChild(el("p", "quien", c.nombre + ": " + r.categoria));
      f.appendChild(el("p", null, r.motivo || ""));
      caja.appendChild(f);
    });
  }
  var selector = $("elegir-comentario");
  G.comentarios.forEach(function (c, i) {
    var o = el("option", null, (i + 1) + ". " + (c.length > 60 ? c.slice(0, 57) + "…" : c));
    o.value = i;
    selector.appendChild(o);
  });
  selector.value = 3;
  selector.addEventListener("change", function () { dibujarMotivos(Number(selector.value)); });
  dibujarMotivos(3);

  // Cita
  $("pedido-cita").textContent = G.pedidoCita;
  var rc = $("respuesta-cita");
  G.respuestaCita.forEach(function (p) { rc.appendChild(el("p", null, p)); });

  // En vivo con la API de Claude
  var CLAVE_API = "taller-api-anthropic";
  var campo = $("api-key"), recordar = $("recordar");
  try { var g = localStorage.getItem(CLAVE_API); if (g) { campo.value = g; recordar.checked = true; } } catch (e) {}

  function pedir(texto) {
    var key = campo.value.trim();
    if (!key) return Promise.reject(new Error("Falta la API key."));
    try { if (recordar.checked) localStorage.setItem(CLAVE_API, key); else localStorage.removeItem(CLAVE_API); } catch (e) {}
    return fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": key,
        "anthropic-version": "2023-06-01",
        "anthropic-dangerous-direct-browser-access": "true"
      },
      body: JSON.stringify({ model: $("modelo").value, max_tokens: 2000, messages: [{ role: "user", content: texto }] })
    }).then(function (r) {
      return r.json().then(function (d) {
        if (!r.ok) throw new Error((d && d.error && d.error.message) || ("Error " + r.status));
        return d.content.filter(function (b) { return b.type === "text"; }).map(function (b) { return b.text; }).join("\n");
      });
    });
  }

  function estadoVivo(t, error) {
    var n = $("estado-vivo");
    n.textContent = t || "";
    n.className = error ? "aviso-error" : "nota";
  }

  $("clasificar").addEventListener("click", function () {
    var reordenar = $("reordenar").checked;
    estadoVivo("Consultando al modelo…");
    pedir(G.consigna(reordenar ? G.categoriasReordenadas : G.categorias)).then(function (texto) {
      var ini = texto.indexOf("["), fin = texto.lastIndexOf("]");
      var lista = JSON.parse(texto.slice(ini, fin + 1));
      var respuestas = G.comentarios.map(function (_, i) {
        var r = lista.filter(function (x) { return Number(x.id) === i + 1; })[0];
        return r ? { categoria: String(r.categoria).toLowerCase().trim(), motivo: r.motivo } : { categoria: "(sin respuesta)" };
      });
      enVivo = { orden: reordenar ? "reordenado" : "original", respuestas: respuestas };
      dibujarTabla();
      dibujarMotivos(Number(selector.value));
      estadoVivo("Listo. La columna «En vivo» se sumó a la tabla.");
      $("tabla-corridas").scrollIntoView({ behavior: "smooth", block: "center" });
    }).catch(function (e) { estadoVivo("No se pudo: " + e.message, true); });
  });

  $("pedir-cita").addEventListener("click", function () {
    estadoVivo("Consultando al modelo…");
    pedir(G.pedidoCita).then(function (texto) {
      var caja = $("cita-vivo");
      caja.innerHTML = "";
      caja.hidden = false;
      caja.appendChild(el("p", "quien", "En vivo, " + $("modelo").value + ":"));
      texto.split(/\n+/).forEach(function (p) { if (p.trim()) caja.appendChild(el("p", null, p)); });
      estadoVivo("Listo.");
    }).catch(function (e) { estadoVivo("No se pudo: " + e.message, true); });
  });
})();
