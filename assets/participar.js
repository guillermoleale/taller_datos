// Página de participación: sigue la actividad abierta y manda respuestas.
(function () {
  var A = window.ACTIVIDADES, EV = window.EnVivo;
  var porId = {};
  A.forEach(function (a) { porId[a.id] = a; });
  var $ = function (id) { return document.getElementById(id); };
  var estado = null, firma = null, fallas = 0;

  function cargar(k, def) { try { var v = JSON.parse(localStorage.getItem(k)); return v == null ? def : v; } catch (e) { return def; } }
  function guardar(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
  function el(tag, clase, texto) {
    var n = document.createElement(tag);
    if (clase) n.className = clase;
    if (texto != null) n.textContent = texto;
    return n;
  }
  function claveEnvios(a) { return "taller-enviados:" + EV.sala + ":" + a.id + ":" + estado.ronda; }

  function mensaje(texto, tipo) {
    var m = $("mensaje");
    m.textContent = texto || "";
    m.className = "mensaje" + (tipo ? " " + tipo : "");
  }

  function enviar(a, valor, alTerminar) {
    mensaje("Enviando…");
    return EV.responder(a.id, estado.ronda, valor).then(function (r) {
      if (!r || !r.ok) throw new Error(r && r.error);
      var envios = cargar(claveEnvios(a), { n: 0, ultimo: null });
      envios.n += 1; envios.ultimo = valor;
      guardar(claveEnvios(a), envios);
      alTerminar(envios);
    }).catch(function () {
      mensaje("No se pudo enviar. Probá de nuevo o escribilo en el chat de la reunión.", "error");
    });
  }

  function formularioTexto(a, opciones) {
    var f = el("form", "responder");
    var campo = el(opciones.largo ? "textarea" : "input");
    campo.id = "respuesta";
    if (!opciones.largo) campo.type = "text";
    campo.maxLength = opciones.maximo;
    campo.placeholder = opciones.ayuda;
    campo.setAttribute("aria-label", a.consigna);
    campo.autocomplete = "off";
    var b = el("button", "boton principal", "Enviar");
    b.type = "submit";
    f.appendChild(campo);
    f.appendChild(b);
    f.addEventListener("submit", function (e) {
      e.preventDefault();
      var v = campo.value.trim();
      if (!v) { campo.focus(); return; }
      b.disabled = true;
      enviar(a, v, function (envios) {
        campo.value = "";
        opciones.alEnviar(envios);
      }).then(function () { b.disabled = false; campo.focus(); });
    });
    return f;
  }

  function botones(a, opciones, valorDe) {
    var envios = cargar(claveEnvios(a), { n: 0, ultimo: null });
    var caja = el("div", "opciones");
    opciones.forEach(function (o) {
      var b = el("button", "opcion", o);
      b.type = "button";
      b.setAttribute("aria-pressed", String(envios.ultimo === (valorDe ? valorDe(o) : o)));
      b.addEventListener("click", function () {
        var valor = valorDe ? valorDe(o) : o;
        enviar(a, valor, function () {
          caja.querySelectorAll(".opcion").forEach(function (x) { x.setAttribute("aria-pressed", String(x === b)); });
          mensaje("Elegiste «" + o + "». Podés cambiarlo mientras esté abierto.", "ok");
        });
      });
      caja.appendChild(b);
    });
    if (envios.ultimo) setTimeout(function () { mensaje("Ya elegiste. Podés cambiarlo mientras esté abierto.", "ok"); });
    return caja;
  }

  function dibujar() {
    var c = $("contenido");
    c.innerHTML = "";
    mensaje("");
    var a = estado && porId[estado.actividad];
    if (!a) {
      c.appendChild(el("h1", null, "Esperando la próxima actividad"));
      c.appendChild(el("p", "bajada", "Cuando abramos una actividad, aparece acá sola. No hace falta recargar la página."));
      return;
    }
    c.appendChild(el("p", "grupo", a.grupo));
    c.appendChild(el("h1", null, a.titulo));
    if (!estado.abierta) {
      c.appendChild(el("p", "bajada", "Las respuestas están cerradas. Mirá la pantalla compartida."));
      return;
    }
    c.appendChild(el("p", "consigna", a.consigna));
    var envios = cargar(claveEnvios(a), { n: 0, ultimo: null });

    if (a.tipo === "nube") {
      var max = a.maximo || 3;
      var restan = function (n) { return max - n; };
      if (restan(envios.n) <= 0) { c.appendChild(el("p", "mensaje ok", "Ya mandaste tus palabras. Mirá cómo crece la nube en la pantalla compartida.")); return; }
      c.appendChild(formularioTexto(a, {
        maximo: 40, ayuda: "Una o dos palabras",
        alEnviar: function (e) {
          if (restan(e.n) <= 0) { dibujar(); return; }
          mensaje("Recibido. Podés mandar " + restan(e.n) + (restan(e.n) === 1 ? " palabra más." : " palabras más."), "ok");
        }
      }));
    }
    if (a.tipo === "notas") {
      c.appendChild(formularioTexto(a, {
        largo: true, maximo: 200, ayuda: "Escribí tu nota",
        alEnviar: function (e) { mensaje("Nota enviada (" + e.n + "). Podés mandar otra.", "ok"); }
      }));
      if (envios.n) setTimeout(function () { mensaje("Ya mandaste " + envios.n + (envios.n === 1 ? " nota" : " notas") + ". Podés mandar otra.", "ok"); });
    }
    if (a.tipo === "votacion") {
      if (a.texto) { var f = el("div", "ficha cita"); f.appendChild(el("p", null, "“" + a.texto + "”")); c.appendChild(f); }
      c.appendChild(botones(a, a.opciones));
    }
    if (a.tipo === "etiquetar") {
      var img = el("img", "imagen");
      img.src = a.imagen; img.alt = a.titulo;
      img.addEventListener("error", function () { img.replaceWith(el("p", "nota", "No se pudo cargar la imagen en tu dispositivo. Mirala en la pantalla compartida.")); });
      c.appendChild(img);
      c.appendChild(botones(a, a.etiquetas));
      var otra = el("details", "otra");
      otra.appendChild(el("summary", null, "Ninguna me sirve: propongo otra"));
      otra.appendChild(formularioTexto(a, {
        maximo: 40, ayuda: "Tu etiqueta",
        alEnviar: function () {
          c.querySelectorAll(".opcion").forEach(function (x) { x.setAttribute("aria-pressed", "false"); });
          mensaje("Recibido. Podés cambiarlo mientras esté abierto.", "ok");
        }
      }));
      var form = otra.querySelector("form");
      form.addEventListener("submit", function () {
        var campo = form.querySelector("input");
        if (campo.value.trim().indexOf("Otra:") !== 0) campo.value = "Otra: " + campo.value.trim();
      }, true);
      c.appendChild(otra);
    }
  }

  function ciclo() {
    EV.estado().then(function (r) {
      fallas = 0;
      $("conexion").hidden = true;
      var nuevo = r && r.ok ? r.estado : null;
      var f = nuevo ? [nuevo.actividad, nuevo.ronda, nuevo.abierta].join("|") : "";
      if (f !== firma) { estado = nuevo; firma = f; dibujar(); }
    }).catch(function () {
      fallas += 1;
      if (fallas >= 2) $("conexion").hidden = false;
    }).then(function () { setTimeout(ciclo, EV.modo === "planilla" ? 4000 : 1000); });
  }

  if (EV.modo === "prueba") $("prueba").hidden = false;
  ciclo();
})();
