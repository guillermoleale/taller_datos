# Taller de Datos: encuentro propedéutico

Materiales y actividades en vivo del encuentro previo al Taller de Datos de la Maestría en Humanidades Aumentadas. Es un sitio estático: no necesita servidor propio y funciona en el celular. Las respuestas en vivo se guardan en una planilla de Google del equipo docente.

## Páginas

| Archivo | Para qué |
|---|---|
| `index.html` | Portada con acceso a todo y recursos para seguir. |
| `respuestas.html` | Qué respondieron en el formulario previo, una idea por pantalla. |
| `palabras.html` | Nube de palabras y agrupamiento a mano (también recibe la nube en vivo). |
| `tipos.html` | Tipos de datos, el formulario como ejemplo y una tabla para armar en vivo. |
| `generativo.html` | Un modelo de lenguaje clasificando comentarios: corridas grabadas y corrida en vivo con API key. |
| `en-vivo.html` | Consola docente: abre actividades, muestra el QR y los resultados en vivo. |
| `participar.html` | Lo que ven los alumnos en el celular. El enlace corto es `/p`. |
| `temporizador.html` | Solo el temporizador, grande en una página en blanco, para proyectar sin ninguna actividad. |
| `material.html` | Material de apoyo docente: ejemplos con gráficos, tablas e imágenes, un texto breve y las fuentes. Se abre desde la consola. Los datos de los gráficos están en `assets/material-datos.js`. |

En computadora, el botón **Presentar** de las páginas de contenido muestra una pantalla por vez (flechas para avanzar, Escape para salir).

## Actividades en vivo

Están en `assets/actividades.js` y se editan ahí:

- **Nube:** cada persona manda hasta tres palabras y la nube crece en la consola. Con **Llevar a agrupar** las palabras pasan a `palabras.html`.
- **Votación:** cuenta el último voto de cada persona. Los comentarios ambiguos muestran, a pedido, qué respondió el modelo.
- **Notas:** cada nota aparece en un tablero donde se arrastra y se agrupa con títulos.
- **Etiquetar:** cuatro imágenes de dominio público con etiquetas fijas y la opción de proponer otra. Muestra cuánto acuerdo hubo y permite preguntarle a un modelo de imágenes (CLIP) que corre en el navegador de la consola (la primera vez descarga unos 150 MB).

Las respuestas son anónimas: cada celular genera un identificador al azar, sin nombre ni correo.

La consola tiene un **Temporizador** (arriba, junto al QR) para regular las intervenciones: una cuenta regresiva grande que se ve en la pantalla de la consola y en pantalla completa, no en los celulares. Puede sonar al terminar y, si se marca, cerrar las respuestas de la actividad abierta. También está solo, sin actividades, en `temporizador.html`; si esa página y la consola están abiertas en el mismo navegador, muestran el mismo temporizador.

## Ensayar sin conectar nada

Mientras `urlScript` esté vacío en `assets/config.js`, todo funciona en **modo de prueba**: abrí `en-vivo.html` en una pestaña y `participar.html` en otra del mismo navegador. El botón **Simular respuestas** de la consola agrega respuestas ficticias.

## Conectar la planilla para la clase

La guía completa, con chequeos y problemas frecuentes, está en [GUIA-PUESTA-EN-MARCHA.md](GUIA-PUESTA-EN-MARCHA.md). Resumen:

La planilla ya existe en el Drive del equipo: **Taller de Datos: respuestas en vivo**.

1. Abrir la planilla y entrar a **Extensiones > Apps Script**.
2. Borrar lo que haya en `Código.gs` y pegar el contenido de `apps-script/Codigo.gs` de este repositorio.
3. Cambiar `SECRETO` por una contraseña docente y guardar.
4. Elegir la función `prepararPlanilla` y tocar **Ejecutar**. Google pide permisos; si avisa que la app no está verificada, ir a **Configuración avanzada** y seguir.
5. **Implementar > Nueva implementación**, tipo **Aplicación web**. Ejecutar como: **Yo**. Quién tiene acceso: **Cualquier usuario**. Copiar la URL que termina en `/exec`.
6. Pegar esa URL en `urlScript` dentro de `assets/config.js` y subir el cambio.
7. Abrir `en-vivo.html`: arriba tiene que decir **Conectado a la planilla**. En **Ajustes**, escribir la contraseña docente.

Si después se cambia el código del script, usar **Implementar > Administrar implementaciones > Editar > Nueva versión** para conservar la misma URL.

Para separar un ensayo de la clase real, cambiar `sala` en `assets/config.js`.

## Antes de la clase

- Abrir la consola con internet y revisar que carguen el QR y las cuatro imágenes.
- Probar una vez **Preguntarle a un modelo de imágenes** para que el modelo quede descargado.
- Para la corrida en vivo de `generativo.html` hace falta una API key de Anthropic. Queda solo en el navegador de quien la usa.

## Datos y privacidad

`assets/datos.js` tiene solo conteos y frases cortas sin atribución del formulario previo. Las respuestas completas no están en el repositorio. Lo que se carga en la nube local, el tablero o la tabla en vivo queda en el navegador de quien lo usa; lo que mandan los alumnos queda en la planilla del equipo.

## Imágenes

Las de las actividades son todas de Wikimedia Commons, de dominio público:

- Cartero en la provincia de Buenos Aires, hacia 1920. Archivo General de la Nación.
- Ernesto de la Cárcova, *Sin pan y sin trabajo*, 1894. Museo Nacional de Bellas Artes.
- José María Cao, alegoría del invierno, *Caras y Caretas* n.º 13.
- Diagonal Norte, Buenos Aires, hacia 1936. Archivo General de la Nación.

Las de `material.html` están en `assets/img/` y cada una lleva su crédito en la página:

- Mapa del cólera de John Snow (1854), versión de Wikimedia Commons. Dominio público.
- Avión con impactos (sesgo de supervivencia), McGeddon, Wikimedia Commons. CC BY-SA 4.0.
- Exvoto de Lévis (1754), Musée national des beaux-arts du Québec, Wikimedia Commons. Dominio público.
- Figuras 6 y 7 del informe de la Comisión Rogers (1986). Dominio público (gobierno de EE. UU.).
- Cuadro tarifario del colectivo de Miyake-jima (2014), publicado por el municipio de Miyake.
- **Con derechos de autor**, usadas con fines educativos: la infografía de Alabama de Starkey Comics (2021) y la foto del cuadro tarifario del Expreso VGG publicada por La Capital (2026). Si el sitio va a ser público, conviene pedir permiso o reemplazarlas por un enlace.

Los mapas de las tablas de tarifas se incrustan desde OpenStreetMap y necesitan internet.

## Publicar con GitHub Pages

En **Settings > Pages**, elegir **Deploy from a branch**, rama `main`, carpeta `/ (root)`. El sitio queda en `https://guillermoleale.github.io/taller_datos/` y el enlace para alumnos en `https://guillermoleale.github.io/taller_datos/p`.

Con una cuenta gratuita, Pages solo publica desde repositorios públicos. Con GitHub Pro también publica desde uno privado, pero el sitio igual queda visible para cualquiera que tenga el enlace.
