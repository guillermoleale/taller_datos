/**
 * Taller de Datos: respuestas en vivo.
 *
 * Este script vive dentro de una planilla de Google. Recibe lo que mandan
 * los alumnos desde participar.html y se lo entrega a la consola docente.
 *
 * Antes de publicarlo, cambiá SECRETO por una contraseña tuya. Solo quien la
 * sepa puede abrir, cerrar o cambiar la actividad que ven los alumnos.
 */
const SECRETO = 'cambiar-esta-contrasena';

const HOJA = 'respuestas';
const ENCABEZADOS = ['fecha', 'sala', 'actividad', 'ronda', 'valor', 'participante'];
const LARGO_MAXIMO = 280;

function doGet(e) {
  const p = (e && e.parameter) || {};
  try {
    if (p.accion === 'estado') return json({ ok: true, estado: leerEstado(p.sala) });
    if (p.accion === 'leer') return json(leerDesde(Number(p.desde) || 1, p.sala));
    if (p.accion === 'ping') return json({ ok: true, hora: new Date().toISOString() });
    return json({ ok: false, error: 'Acción desconocida' });
  } catch (err) {
    return json({ ok: false, error: String(err) });
  }
}

function doPost(e) {
  let d;
  try {
    d = JSON.parse(e.postData.contents);
  } catch (err) {
    return json({ ok: false, error: 'Datos ilegibles' });
  }

  if (d.accion === 'estado') {
    if (d.secreto !== SECRETO) return json({ ok: false, error: 'Contraseña docente incorrecta' });
    guardarEstado(d.sala, d.estado || null);
    return json({ ok: true });
  }

  if (d.accion === 'responder') {
    const valor = limpiar(d.valor, LARGO_MAXIMO);
    if (!valor) return json({ ok: false, error: 'Respuesta vacía' });
    const lock = LockService.getScriptLock();
    lock.waitLock(5000);
    try {
      hoja().appendRow([
        new Date(),
        limpiar(d.sala, 60),
        limpiar(d.actividad, 60),
        limpiar(d.ronda, 40),
        valor,
        limpiar(d.participante, 40)
      ]);
    } finally {
      lock.releaseLock();
    }
    return json({ ok: true });
  }

  return json({ ok: false, error: 'Acción desconocida' });
}

function leerDesde(desde, sala) {
  const sh = hoja();
  const ultima = sh.getLastRow();
  if (ultima <= desde) return { ok: true, ultima: ultima, filas: [] };
  const valores = sh.getRange(desde + 1, 1, ultima - desde, ENCABEZADOS.length).getValues();
  const filas = [];
  valores.forEach(function (r, i) {
    if (sala && String(r[1]) !== String(sala)) return;
    filas.push({
      fila: desde + 1 + i,
      t: r[0] instanceof Date ? r[0].getTime() : null,
      actividad: String(r[2]),
      ronda: String(r[3]),
      valor: String(r[4]),
      p: String(r[5])
    });
  });
  return { ok: true, ultima: ultima, filas: filas };
}

function leerEstado(sala) {
  const llave = 'estado:' + (sala || '');
  const cache = CacheService.getScriptCache();
  const enCache = cache.get(llave);
  if (enCache) return JSON.parse(enCache);
  const guardado = PropertiesService.getScriptProperties().getProperty(llave);
  if (guardado) cache.put(llave, guardado, 600);
  return guardado ? JSON.parse(guardado) : null;
}

function guardarEstado(sala, estado) {
  const llave = 'estado:' + (sala || '');
  const texto = JSON.stringify(estado);
  PropertiesService.getScriptProperties().setProperty(llave, texto);
  CacheService.getScriptCache().put(llave, texto, 600);
}

function hoja() {
  const libro = SpreadsheetApp.getActiveSpreadsheet();
  let sh = libro.getSheetByName(HOJA);
  if (!sh) {
    sh = libro.insertSheet(HOJA);
    sh.appendRow(ENCABEZADOS);
    sh.setFrozenRows(1);
  }
  return sh;
}

// Evita que un texto que empieza con = + - @ se interprete como fórmula.
function limpiar(valor, largo) {
  let s = String(valor == null ? '' : valor).replace(/[\u0000-\u001f]/g, ' ').trim().slice(0, largo);
  if (/^[=+\-@]/.test(s)) s = "'" + s;
  return s;
}

function json(objeto) {
  return ContentService.createTextOutput(JSON.stringify(objeto)).setMimeType(ContentService.MimeType.JSON);
}

// Ejecutá esta función una vez desde el editor para crear la hoja y dar permisos.
function prepararPlanilla() {
  hoja();
}
