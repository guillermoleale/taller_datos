// Datos agregados del formulario previo al encuentro (12 respuestas, octubre de 2026).
// Solo conteos y frases cortas sin atribución: ningún dato permite identificar a quien respondió.
window.DATOS = {
  respuestas: 12,
  materiales: [
    { etiqueta: "Documentos de distinto tipo", valor: 10, tipo: "no" },
    { etiqueta: "Imágenes fijas o en movimiento", valor: 8, tipo: "no" },
    { etiqueta: "Entrevistas", valor: 7, tipo: "no" },
    { etiqueta: "Publicaciones en redes sociales", valor: 4, tipo: "semi" },
    { etiqueta: "Registros estadísticos", valor: 3, tipo: "si" }
  ],
  dificultades: [
    { etiqueta: "Usar software o herramientas", valor: 10, destacar: true },
    { etiqueta: "Construir los datos", valor: 9, destacar: true },
    { etiqueta: "Analizar grandes cantidades de material", valor: 6 },
    { etiqueta: "Decidir qué observar", valor: 5 },
    { etiqueta: "Organizar un corpus", valor: 5 },
    { etiqueta: "Interpretar los datos", valor: 5 },
    { etiqueta: "Otra: no reducir el material", valor: 2 }
  ],
  corpus: [
    { etiqueta: "ya tienen un corpus", valor: 5 },
    { etiqueta: "lo están armando", valor: 4 },
    { etiqueta: "todavía no lo empezaron", valor: 2 },
    { etiqueta: "no lo dejaron claro", valor: 1 }
  ],
  // Palabras de la pregunta "¿qué sería para vos un dato?", sin palabras vacías.
  palabrasFormulario: [
    ["información", 3], ["cuerpos", 2], ["relación", 2], ["decisión", 2], ["imagen", 2],
    ["fragmento", 2], ["cuidado", 2], ["prácticas", 2], ["formas", 2], ["categorías", 2],
    ["variables", 2], ["conciencia", 2], ["procedimientos", 2], ["transformación", 2],
    ["fotos", 1], ["cicatrices", 1], ["citas", 1], ["hitos", 1], ["división", 1], ["espera", 1],
    ["gesto", 1], ["documento", 1], ["expresión", 1], ["narrativo", 1], ["trayectoria", 1],
    ["unidad", 1], ["construye", 1], ["observación", 1], ["selección", 1], ["registro", 1],
    ["interpretación", 1], ["poética", 1], ["libro", 1], ["entrevista", 1], ["testimonio", 1],
    ["experiencia", 1], ["conceptos", 1], ["metáforas", 1], ["patrones", 1], ["diccionario", 1],
    ["vocabulario", 1], ["rasgo", 1], ["repetición", 1], ["frecuencia", 1], ["patrón", 1],
    ["huella", 1], ["recurrencia", 1], ["discontinuidad", 1], ["roles", 1], ["tendencias", 1],
    ["textualidad", 1], ["fuentes", 1], ["primarias", 1], ["porcentajes", 1], ["hipótesis", 1],
    ["materialización", 1]
  ]
};
