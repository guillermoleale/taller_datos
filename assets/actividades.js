// Actividades en vivo del encuentro. Para agregar o cambiar una, editá esta lista.
// Tipos: "nube" (palabras), "votacion" (opciones), "notas" (tablero de notas), "etiquetar" (imagen con etiquetas).
(function () {
  var ETIQUETAS = ["Trabajo", "Vida cotidiana", "Conflicto social", "Fiesta o celebración", "Retrato"];
  // Cómo se le pregunta al modelo de imágenes (CLIP se entrenó sobre todo con textos en inglés).
  var ETIQUETAS_MODELO = ["people working", "everyday life", "social conflict or poverty", "a celebration or a party", "a portrait of a person"];
  var CATEGORIAS = ["memoria personal", "valor estético", "crítica a la muestra", "lectura política", "otra"];

  function commons(archivo, ruta) {
    var nombre = encodeURIComponent(archivo.replace(/ /g, "_"));
    return {
      src: "https://upload.wikimedia.org/wikipedia/commons/thumb/" + ruta + "/" + nombre + "/960px-" + nombre,
      fuente: "https://commons.wikimedia.org/wiki/File:" + nombre
    };
  }

  function imagen(id, titulo, archivo, ruta, credito) {
    var c = commons(archivo, ruta);
    return {
      id: id, tipo: "etiquetar", grupo: "Etiquetar imágenes", titulo: titulo,
      consigna: "Elegí la etiqueta que mejor describe esta imagen.",
      imagen: c.src, fuente: c.fuente, credito: credito,
      etiquetas: ETIQUETAS, etiquetasModelo: ETIQUETAS_MODELO
    };
  }

  function comentario(n, texto, respuestaModelo) {
    return {
      id: "comentario-" + n, tipo: "votacion", grupo: "Un modelo clasificando", titulo: "Comentario " + n,
      consigna: "¿En qué categoría pondrías este comentario de un visitante?",
      texto: texto, opciones: CATEGORIAS,
      modelo: "En las cuatro corridas grabadas, el modelo lo clasificó como «" + respuestaModelo + "»."
    };
  }

  window.ACTIVIDADES = [
    { id: "palabra-dato", tipo: "nube", grupo: "Arranque", titulo: "Una palabra para dato",
      consigna: "Escribí una o dos palabras que asocies con la palabra dato.", maximo: 3 },
    { id: "recoge-fabrica", tipo: "votacion", grupo: "Arranque", titulo: "¿El dato se recoge o se fabrica?",
      consigna: "Elegí una opción. Podés cambiarla mientras la votación esté abierta.",
      opciones: ["Se recoge", "Se fabrica", "Las dos cosas", "Todavía no lo sé"] },

    { id: "fila", tipo: "notas", grupo: "Tipos de datos", titulo: "Si tu material fuera una fila",
      consigna: "Escribí en una nota qué sería una fila en tu investigación: una foto, un fragmento, una persona, un documento… Podés mandar más de una." },
    { id: "poema-dato", tipo: "votacion", grupo: "Tipos de datos", titulo: "Un poema, ¿puede ser un dato?",
      consigna: "Elegí una opción.", opciones: ["Sí", "No", "Depende de para qué"] },

    imagen("imagen-1", "Imagen 1", "Provincia de Buenos Aires - Cartero en 1920.jpg", "e/e9",
      "Cartero en la provincia de Buenos Aires, hacia 1920. Archivo General de la Nación. Dominio público."),
    imagen("imagen-2", "Imagen 2", "Ernesto de la CÁRcova - Sin pan y sin trabajo - Google Art Project.jpg", "2/2a",
      "Ernesto de la Cárcova, Sin pan y sin trabajo, 1894. Museo Nacional de Bellas Artes. Dominio público."),
    imagen("imagen-3", "Imagen 3", "Invierno caras y caretas.jpg", "7/7e",
      "José María Cao, alegoría del invierno, Caras y Caretas n.º 13. Dominio público."),
    imagen("imagen-4", "Imagen 4", "Diagonal Norte (ca 1936, AGN).jpg", "4/4f",
      "Diagonal Norte, Buenos Aires, hacia 1936. Archivo General de la Nación. Dominio público."),

    comentario(4, "Ninguna foto muestra a las mujeres que trabajaban en las fábricas del barrio. ¿Quién eligió qué recordar?", "lectura política"),
    comentario(9, "Faltan carteles en braille y la sala no tiene rampa.", "crítica a la muestra"),
    comentario(10, "Mi bisabuelo aparece en la foto de la huelga del ferrocarril, con la gorra en la mano.", "memoria personal"),

    { id: "pregunta-material", tipo: "notas", grupo: "Cierre", titulo: "Una pregunta para tu material",
      consigna: "¿Qué le preguntarías a tu material si pudieras mirarlo entero de una vez?" },
    { id: "cierre", tipo: "nube", grupo: "Cierre", titulo: "Una palabra para cómo te vas",
      consigna: "Escribí una palabra para cómo te vas de este encuentro.", maximo: 1 }
  ];
})();
