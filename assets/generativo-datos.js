// Corridas reales de un modelo de lenguaje (Claude Haiku), grabadas el 28 de octubre de 2026.
// Cada corrida fue independiente y sin acceso a internet. Los comentarios son inventados.
window.GENERATIVO = {
  categorias: ["memoria personal", "valor estético", "crítica a la muestra", "lectura política", "otra"],
  categoriasReordenadas: ["lectura política", "crítica a la muestra", "otra", "valor estético", "memoria personal"],
  comentarios: [
    "Se me hizo un nudo en la garganta al ver la foto de la esquina de Mitre y Corrientes: ahí estaba la panadería de mi abuelo.",
    "Las copias están mal iluminadas y algunas fotos no tienen fecha ni autor. Así no se puede.",
    "Qué contraste tienen esas tomas en blanco y negro, parecen pinturas.",
    "Ninguna foto muestra a las mujeres que trabajaban en las fábricas del barrio. ¿Quién eligió qué recordar?",
    "Volví con mi hija para mostrarle dónde jugaba de chica.",
    "La muestra cuenta un barrio sin conflictos, como si las huelgas del 19 no hubieran pasado.",
    "Lindo para pasar la tarde, el café de la entrada es muy bueno.",
    "La composición de la foto del puerto, con las grúas en diagonal, es impresionante.",
    "Faltan carteles en braille y la sala no tiene rampa.",
    "Mi bisabuelo aparece en la foto de la huelga del ferrocarril, con la gorra en la mano."
  ],
  corridas: [
    { nombre: "Corrida 1", orden: "original", respuestas: [
      { categoria: "memoria personal", motivo: "Recuerda la panadería de su abuelo en una esquina concreta de la ciudad." },
      { categoria: "crítica a la muestra", motivo: "Cuestiona la iluminación de las copias y la falta de fecha y autor en las fotos." },
      { categoria: "valor estético", motivo: "Destaca el contraste de las tomas en blanco y negro y su parecido con pinturas." },
      { categoria: "lectura política", motivo: "Interpreta la ausencia de mujeres trabajadoras como una decisión sobre qué memoria se transmite." },
      { categoria: "memoria personal", motivo: "Relata una visita con su hija a un lugar ligado a su infancia." },
      { categoria: "lectura política", motivo: "Señala que el relato omite las huelgas de 1919 y presenta un barrio sin conflictos." },
      { categoria: "otra", motivo: "Comenta la experiencia del lugar y el café, sin referirse a las fotografías." },
      { categoria: "valor estético", motivo: "Elogia la composición de la fotografía del puerto con las grúas en diagonal." },
      { categoria: "crítica a la muestra", motivo: "Señala falta de accesibilidad por ausencia de braille y de rampa." },
      { categoria: "memoria personal", motivo: "Identifica a un familiar propio en la foto de la huelga ferroviaria." }
    ]},
    { nombre: "Corrida 2", orden: "original", respuestas: [
      { categoria: "memoria personal", motivo: "Recuerda la panadería de su abuelo en la esquina de Mitre y Corrientes que aparece en la foto." },
      { categoria: "crítica a la muestra", motivo: "Cuestiona la iluminación de las copias y la falta de fecha y autor en varias fotos." },
      { categoria: "valor estético", motivo: "Elogia el contraste de las tomas en blanco y negro y su aspecto pictórico." },
      { categoria: "lectura política", motivo: "Señala la ausencia de mujeres trabajadoras y pregunta quién decide qué se recuerda." },
      { categoria: "memoria personal", motivo: "Vuelve al lugar con su hija para mostrarle dónde jugaba de chica." },
      { categoria: "lectura política", motivo: "Lee el relato de la muestra como una omisión de los conflictos sociales de las huelgas del 19." },
      { categoria: "otra", motivo: "Valora el café de la entrada y la tarde en el lugar, sin referirse a las fotos." },
      { categoria: "valor estético", motivo: "Destaca la composición de la foto del puerto con las grúas en diagonal." },
      { categoria: "crítica a la muestra", motivo: "Señala la falta de accesibilidad con carteles en braille y rampa." },
      { categoria: "memoria personal", motivo: "Reconoce a su bisabuelo en la foto de la huelga del ferrocarril." }
    ]},
    { nombre: "Corrida 3", orden: "reordenado", respuestas: [
      { categoria: "memoria personal", motivo: "Recuerda la panadería de su abuelo en una esquina concreta de la foto." },
      { categoria: "crítica a la muestra", motivo: "Cuestiona la iluminación de las copias y la falta de fecha y autoría de las fotos." },
      { categoria: "valor estético", motivo: "Elogia el contraste de las tomas en blanco y negro y su parecido con pinturas." },
      { categoria: "lectura política", motivo: "Señala la ausencia de mujeres obreras e interroga quién decidió qué memoria se muestra." },
      { categoria: "memoria personal", motivo: "Relata una visita con su hija al lugar donde ella jugaba de chica." },
      { categoria: "lectura política", motivo: "Denuncia que el relato del barrio omite los conflictos sociales de las huelgas del 19." },
      { categoria: "otra", motivo: "Comenta el café de la entrada y el valor de pasar la tarde allí, sin referirse a las fotos." },
      { categoria: "valor estético", motivo: "Destaca la composición visual de la foto del puerto con las grúas en diagonal." },
      { categoria: "crítica a la muestra", motivo: "Reclama accesibilidad física y sensorial por falta de braille y de rampa." },
      { categoria: "memoria personal", motivo: "Identifica a su bisabuelo en la foto de la huelga ferroviaria." }
    ]},
    { nombre: "Corrida 4", orden: "reordenado", respuestas: [
      { categoria: "memoria personal", motivo: "El visitante recuerda la panadería de su abuelo en una esquina concreta." },
      { categoria: "crítica a la muestra", motivo: "Cuestiona la calidad de las copias y la falta de datos de fecha y autoría." },
      { categoria: "valor estético", motivo: "Destaca el contraste de las tomas en blanco y negro y su parecido con pinturas." },
      { categoria: "lectura política", motivo: "Señala la ausencia de mujeres obreras y pregunta quién decidió qué memoria se exhibe." },
      { categoria: "memoria personal", motivo: "Relata una visita con su hija al lugar donde ella jugaba de chica." },
      { categoria: "lectura política", motivo: "Interpreta la omisión de las huelgas de 1919 como una mirada que borra el conflicto social." },
      { categoria: "otra", motivo: "Comenta el café de la entrada y el uso del lugar para pasar la tarde, sin referirse a las fotos." },
      { categoria: "valor estético", motivo: "Valora la composición de la foto del puerto con las grúas en diagonal." },
      { categoria: "crítica a la muestra", motivo: "Señala la falta de accesibilidad con braille y rampa en la sala." },
      { categoria: "memoria personal", motivo: "Reconoce a su bisabuelo en la foto de la huelga del ferrocarril." }
    ]}
  ],
  pedidoCita: "Necesito una cita textual de Johanna Drucker sobre el concepto de \"capta\", con el número de página exacto del libro donde aparece. Dámela en una línea con este formato: «cita» (Autora, Libro, año, p. X).",
  respuestaCita: [
    "No puedo darte el número de página exacto de memoria, y prefiero no inventarlo. Tampoco puedo garantizar la cita palabra por palabra, así que no la uses sin verificarla.",
    "La idea sí la tengo clara: Drucker distingue los datos, que se presentan como \"dados\", de la capta, que se \"toma\" de forma activa en la interpretación. La formulación que recuerdo, sin garantizar que sea literal, es «Data are given, while capta are taken», del artículo \"Humanities Approaches to Graphical Display\" (Digital Humanities Quarterly, vol. 5, n.º 1, 2011). Ese artículo no tiene paginación de libro. El desarrollo más extenso del concepto está en Graphesis: Visual Forms of Knowledge Production (Harvard University Press, 2014), pero no tengo la página.",
    "Para completar el formato «cita» (Autora, Libro, año, p. X), buscá \"capta\" en el PDF o en la edición impresa de Graphesis y tomá la página y la frase exactas de ahí."
  ]
};

window.GENERATIVO.consigna = function (categorias) {
  var G = window.GENERATIVO;
  return "Clasificá cada uno de estos 10 comentarios de visitantes de una muestra de fotografía de archivo en UNA de estas categorías: " +
    categorias.join(", ") + ".\n\nRespondé únicamente con JSON válido, sin texto adicional, con este formato: [{\"id\": 1, \"categoria\": \"...\", \"motivo\": \"una frase breve\"}]\n\nComentarios:\n" +
    G.comentarios.map(function (c, i) { return (i + 1) + ". " + c; }).join("\n");
};
