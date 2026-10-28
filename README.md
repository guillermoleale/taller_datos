# Taller de Datos: encuentro propedéutico

Materiales del encuentro previo al Taller de Datos de la Maestría en Humanidades Aumentadas. Es un sitio estático: no necesita instalación ni servidor y funciona en el celular.

## Páginas

| Archivo | Para qué |
|---|---|
| `index.html` | Portada con acceso a los materiales y recursos para seguir. |
| `respuestas.html` | Punto 2: qué respondieron en el formulario, una idea por pantalla. |
| `palabras.html` | Punto 3: actividad "una palabra para dato". Nube en vivo y agrupamiento a mano. |
| `tipos.html` | Punto 4: tipos de datos, el formulario como ejemplo y una tabla para armar en vivo. |

En computadora, el botón **Presentar** muestra una pantalla por vez. Se avanza con las flechas o la barra espaciadora y se sale con Escape.

## Datos

`assets/datos.js` tiene solo conteos y frases cortas sin atribución. Las respuestas completas del formulario no están en el repositorio. Si llegan respuestas nuevas, se actualizan los números en ese archivo y el resto del sitio se ajusta solo (salvo la cifra grande de `respuestas.html` y el "sobre 12" de `tipos.html`, que están escritos a mano).

Lo que se carga en la nube de palabras o en la tabla en vivo queda guardado solo en el navegador de quien lo usa. No se envía a ningún lado.

## Publicar con GitHub Pages

1. En el repositorio, ir a **Settings > Pages**.
2. En **Source**, elegir **Deploy from a branch**, rama `main`, carpeta `/ (root)`.
3. El sitio queda en `https://guillermoleale.github.io/taller_datos/`.

Con una cuenta gratuita, Pages solo publica desde repositorios públicos. Con GitHub Pro también publica desde uno privado, pero el sitio igual queda visible para cualquiera que tenga el enlace.
