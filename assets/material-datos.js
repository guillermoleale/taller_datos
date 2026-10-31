// Datos de los gráficos de material.html. Cada bloque dice de dónde sale.
window.MATERIAL = {
  // Mes aproximado en que empezó cada serie de patentes Mercosur (XX000AA).
  // Wikipedia, «Matrículas automovilísticas de Argentina»; Infobae (8/7/2026); El Litoral (dic. 2025).
  patentes: [
    ["AA", 2016, 4], ["AB", 2017, 2], ["AC", 2017, 11], ["AD", 2018, 7], ["AE", 2019, 10],
    ["AF", 2021, 8], ["AG", 2023, 4], ["AH", 2024, 11], ["AI", 2025, 12]
  ],

  // Soja en el departamento de Pergamino: rendimiento (kg/ha), MAGyP, datos.gob.ar.
  // Lluvia de diciembre a marzo (mm): NASA POWER, PRECTOTCORR mensual en -33,89 / -60,57, consultado el 31/10/2026.
  soja: [
    ["2000/01", 787, 3055], ["2001/02", 558, 2970], ["2002/03", 540, 3404], ["2003/04", 300, 3272],
    ["2004/05", 613, 3397], ["2005/06", 416, 3603], ["2006/07", 842, 3536], ["2007/08", 438, 3701],
    ["2008/09", 323, 2122], ["2009/10", 894, 3873], ["2010/11", 504, 3794], ["2011/12", 462, 3363],
    ["2012/13", 542, 3710], ["2013/14", 573, 4010], ["2014/15", 481, 4569], ["2015/16", 405, 4081],
    ["2016/17", 575, 4020], ["2017/18", 265, 3063], ["2018/19", 618, 4297], ["2019/20", 538, 3756],
    ["2020/21", 279, 3178], ["2021/22", 366, 3438], ["2022/23", 224, 1857], ["2023/24", 545, 4035],
    ["2024/25", 523, 3288]
  ],

  // Ataques fatales de cólera por día, del 19 de agosto al 30 de septiembre de 1854 (más 45 sin fecha; 616 en total).
  // John Snow, On the Mode of Communication of Cholera, 2.ª ed., 1855, tabla del brote de Broad Street.
  snow: {
    agosto: [1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 8, 56],
    septiembre: [143, 116, 54, 46, 36, 20, 28, 12, 11, 5, 5, 1, 3, 0, 1, 4, 2, 3, 0, 0, 2, 1, 1, 1, 1, 1, 1, 0, 0, 0]
  },

  // Cebada en Minnesota, promedio de 10 variedades (bushels por acre). Immer, Hayes y Powers (1934),
  // tal como circula en lattice::barley y vega-datasets (barley.json).
  cebada: [
    ["Waseca", 54.35, 41.87], ["Crookston", 43.66, 31.18], ["University Farm", 35.83, 29.51],
    ["Duluth", 30.29, 25.70], ["Grand Rapids", 29.05, 20.81], ["Morris", 29.29, 41.51]
  ],

  // China: desempleo urbano de 16 a 24 años (%), mensual. NBS, vía Wikipedia «Unemployment in China»,
  // Straits Times y Trading Economics. Serie vieja con estudiantes; la nueva (desde dic. 2023) los excluye.
  china: {
    vieja: { desde: [2021, 1], valores: [
      12.7, 13.1, 13.6, 13.6, 13.8, 15.4, 16.2, 15.3, 14.6, 14.2, 14.3, 14.3,
      15.3, 15.3, 16.0, 18.2, 18.4, 19.3, 19.9, 18.7, 17.9, 17.9, 17.1, 16.7,
      17.3, 18.1, 19.6, 20.4, 20.8, 21.3] },
    nueva: { desde: [2023, 12], valores: [
      14.9,
      14.6, 15.3, 15.3, 14.7, 14.2, 13.2, 17.1, 18.8, 17.6, 17.1, 16.1, 15.7,
      16.1, 16.9, 16.5, 15.8, 14.9, 14.5, 17.8, 18.9, 17.7, 17.3, 16.9, 16.5,
      16.3, 16.1, 16.9, 16.3, 15.6, 14.9, 17.9, 18.9, 18.0] }
  },

  // EEUU: variación interanual del CPI-U (%), sin desestacionalizar. BLS, serie CUUR0000SA0, consultada el 31/10/2026.
  // Octubre de 2025 no se publicó (null).
  eeuu: { desde: [2025, 1], valores: [
    3.0, 2.8, 2.4, 2.3, 2.4, 2.7, 2.7, 2.9, 3.0, null, 2.7, 2.7,
    2.4, 2.4, 3.3, 3.8, 4.2, 3.5, 3.4, 3.4, 3.7] },

  // Challenger: los 23 vuelos previos con datos. Misión, fecha, temperatura de la junta (°F) y juntas de campo
  // con erosión o fuga en el aro primario (de 6). Dalal, Fowlkes y Hoadley (1989), JASA 84(408), tabla 1.
  challenger: [
    ["STS-1", "1981-04-12", 66, 0], ["STS-2", "1981-11-12", 70, 1], ["STS-3", "1982-03-22", 69, 0],
    ["STS-5", "1982-11-11", 68, 0], ["STS-6", "1983-04-04", 67, 0], ["STS-7", "1983-06-18", 72, 0],
    ["STS-8", "1983-08-30", 73, 0], ["STS-9", "1983-11-28", 70, 0], ["STS-41-B", "1984-02-03", 57, 1],
    ["STS-41-C", "1984-04-06", 63, 1], ["STS-41-D", "1984-08-30", 70, 1], ["STS-41-G", "1984-10-05", 78, 0],
    ["STS-51-A", "1984-11-08", 67, 0], ["STS-51-C", "1985-01-24", 53, 2], ["STS-51-D", "1985-04-12", 67, 0],
    ["STS-51-B", "1985-04-29", 75, 0], ["STS-51-G", "1985-06-17", 70, 0], ["STS-51-F", "1985-07-29", 81, 0],
    ["STS-51-I", "1985-08-27", 76, 0], ["STS-51-J", "1985-10-03", 79, 0], ["STS-61-A", "1985-10-30", 75, 2],
    ["STS-61-B", "1985-11-26", 76, 0], ["STS-61-C", "1986-01-12", 58, 1]
  ],

  // Pobreza INDEC, % de personas, por semestre. Metodología anterior: serie histórica EPH continua
  // (sh_pobrezaeindigencia_continua.xls); 2007-II no se publicó. Metodología actual: cuadros_informe_pobreza_09_26.xls.
  // 2.º trimestre de 2016: dato trimestral único (eph_pobreza_01_16.pdf). UCA-ODSA: EDSA-Bicentenario, anual.
  pobreza: {
    anterior: { desde: [2003, 1], valores: [54.0, 47.8, 44.3, 40.2, 38.9, 33.8, 31.4, 26.9, 23.4, null,
      17.8, 15.3, 13.9, 13.2, 12.0, 9.9, 8.3, 6.5, 6.5, 5.4, 4.7] },
    actual: { desde: [2016, 2], valores: [30.3, 28.6, 25.7, 27.3, 32.0, 35.4, 35.5, 40.9, 42.0, 40.6, 37.3,
      36.5, 39.2, 40.1, 41.7, 52.9, 38.1, 31.6, 28.2, 32.3] },
    trimestre2016: 32.2,
    uca: [[2010, 28.2], [2011, 24.7], [2012, 26.2], [2013, 27.4], [2014, 28.7], [2015, 29.0]]
  },

  // Femicidios por año. La Casa del Encuentro (femicidios y vinculados de mujeres y niñas; 2008 cubre enero a octubre;
  // 2022 sin cifra anual encontrada). Corte Suprema, Registro Nacional de Femicidios (víctimas directas):
  // 2014-2016 según cada informe, 2017-2025 serie revisada del resumen ejecutivo 2025.
  femicidios: {
    casa: [[2008, 208], [2009, 231], [2010, 260], [2011, 282], [2012, 255], [2013, 295], [2014, 277], [2015, 286],
      [2016, 290], [2017, 295], [2018, 273], [2019, 299], [2020, 287], [2021, 295], [2022, null], [2023, 307],
      [2024, 283], [2025, 238]],
    corte: [[2014, 225], [2015, 235], [2016, 254], [2017, 252], [2018, 257], [2019, 260], [2020, 254], [2021, 231],
      [2022, 226], [2023, 250], [2024, 228], [2025, 200]]
  },

  // Mortalidad infantil en la URSS, por 1000 nacidos vivos. Publicados en su momento: Gran Enciclopedia Soviética
  // (1960, 1965, 1970, 1974) y Ryan, BMJ 1988 (1971). Conocidos después: Vaganov, Детская больница, 2013, n.º 1
  // (serie consolidada del anuario demográfico de 1990). Estimación de Davis y Feshbach (1980) para 1976.
  urss: {
    publicados: [[1960, 35.3], [1965, 27.2], [1970, 24.7], [1971, 22.9], [1974, 27.9]],
    despues: [[1975, 30.7], [1976, 31.4], [1977, 30.5], [1978, 29.7], [1979, 27.4], [1980, 27.3], [1981, 26.9],
      [1982, 25.7], [1983, 25.3], [1984, 25.9], [1985, 26.0], [1986, 25.4], [1987, 25.4], [1988, 24.7],
      [1989, 22.7], [1990, 21.8]],
    estimacion1976: 31.1
  },

  // Expreso VGG, tarifa normal con SUBE desde el 8/5/2026 (pesos). Transcripción del cuadro pegado en el colectivo
  // (foto publicada por La Capital). Fila: origen; columna: destino; solo la mitad superior.
  vgg: {
    paradas: ["Andino", "La Ribera", "Timbúes", "P. S. Martín", "S. Lorenzo", "F. L. Beltrán", "C. Bermúdez", "Baigorria", "Rosario", "V. G. Gálvez"],
    tarifas: [
      [2603, 3329, 4745, 5384, 6213, 6766, 7561, 10446, 13296],
      [2100, 3242, 3881, 4711, 5263, 6058, 8943, 11793],
      [2517, 3156, 3985, 4538, 5332, 8217, 11067],
      [2100, 2569, 3079, 3777, 6313, 8819],
      [2100, 2100, 2638, 5174, 7680],
      [2100, 2100, 4445, 6951],
      [2100, 3960, 6465],
      [3231, 5767],
      [3231]
    ]
  }
};
