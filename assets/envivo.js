// Conexión de las actividades en vivo.
// Con urlScript configurada usa la planilla de Google (Apps Script).
// Sin urlScript usa un modo de prueba que comparte datos entre pestañas del mismo navegador.
(function () {
  var C = window.TALLER_CONFIG || {};
  var URL = (C.urlScript || "").trim();
  var SALA = C.sala || "taller";
  var modo = URL ? "planilla" : "prueba";

  function almacenar(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
  function recuperar(k, def) { try { var v = JSON.parse(localStorage.getItem(k)); return v == null ? def : v; } catch (e) { return def; } }

  var memoriaId = null;
  function participante() {
    var id = recuperar("taller-participante", null) || memoriaId;
    if (!id) {
      id = Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4);
      memoriaId = id;
      almacenar("taller-participante", id);
    }
    return id;
  }

  // Planilla (Apps Script)
  function get(params) {
    var q = Object.keys(params).map(function (k) { return k + "=" + encodeURIComponent(params[k]); }).join("&");
    return fetch(URL + "?" + q + "&_=" + Date.now(), { cache: "no-store" }).then(function (r) {
      if (!r.ok) throw new Error("La planilla respondió " + r.status);
      return r.json();
    });
  }
  function post(cuerpo) {
    // Sin encabezados: el navegador lo manda como texto plano y no hace consulta previa (CORS).
    return fetch(URL, { method: "POST", body: JSON.stringify(cuerpo) }).then(function (r) {
      if (!r.ok) throw new Error("La planilla respondió " + r.status);
      return r.json();
    });
  }

  // Modo de prueba (mismo navegador)
  var KF = "taller-prueba-filas:" + SALA, KE = "taller-prueba-estado:" + SALA;
  var prueba = {
    estado: function () { return Promise.resolve({ ok: true, estado: recuperar(KE, null) }); },
    leer: function (desde) {
      var filas = recuperar(KF, []);
      var nuevas = filas.slice(Math.max(0, desde - 1)).map(function (f, i) {
        return Object.assign({ fila: desde + 1 + i }, f);
      });
      return Promise.resolve({ ok: true, ultima: filas.length + 1, filas: nuevas });
    },
    responder: function (d) {
      var filas = recuperar(KF, []);
      filas.push({ t: Date.now(), actividad: d.actividad, ronda: d.ronda, valor: String(d.valor).slice(0, 280), p: d.participante });
      almacenar(KF, filas);
      return Promise.resolve({ ok: true });
    },
    fijar: function (estado) { almacenar(KE, estado); return Promise.resolve({ ok: true }); }
  };

  window.EnVivo = {
    modo: modo,
    sala: SALA,
    participante: participante,
    estado: function () {
      return modo === "planilla" ? get({ accion: "estado", sala: SALA }) : prueba.estado();
    },
    leer: function (desde) {
      return modo === "planilla" ? get({ accion: "leer", sala: SALA, desde: desde }) : prueba.leer(desde);
    },
    responder: function (actividad, ronda, valor, simulado) {
      // "simulado" solo se usa en el modo de prueba para ensayar con alumnos ficticios.
      var quien = modo === "prueba" && simulado ? simulado : participante();
      var d = { accion: "responder", sala: SALA, actividad: actividad, ronda: ronda, valor: valor, participante: quien };
      return modo === "planilla" ? post(d) : prueba.responder(d);
    },
    fijarEstado: function (estado, secreto) {
      return modo === "planilla" ? post({ accion: "estado", sala: SALA, estado: estado, secreto: secreto }) : prueba.fijar(estado);
    },
    probar: function () {
      return modo === "planilla" ? get({ accion: "ping" }) : Promise.resolve({ ok: true });
    },
    borrarPrueba: function () { try { localStorage.removeItem(KF); localStorage.removeItem(KE); } catch (e) {} },
    intervalo: modo === "planilla" ? 3000 : 1000
  };
})();
