# Guía de puesta en marcha

Cómo dejar funcionando las actividades en vivo del encuentro propedéutico. Son tres etapas y llevan unos 10 minutos:

1. Publicar el sitio en GitHub Pages.
2. Poner el script en la planilla de Google y publicarlo.
3. Conectar el sitio con la planilla.

Cada etapa termina con un chequeo. Si el chequeo no da lo esperado, ver [Problemas frecuentes](#problemas-frecuentes).

## Datos que se usan en esta guía

| Qué | Dónde |
|---|---|
| Repositorio | https://github.com/guillermoleale/taller_datos |
| Planilla | [Taller de Datos: respuestas en vivo](https://docs.google.com/spreadsheets/d/1k1MriDezM_eyqf73Oq8UdYRBBHgm12rArJAMhBRK5q4/edit) |
| Script para pegar | [`apps-script/Codigo.gs`](apps-script/Codigo.gs) |
| Archivo de configuración | [`assets/config.js`](assets/config.js) |
| Sitio publicado | https://guillermoleale.github.io/taller_datos/ |
| Consola docente | https://guillermoleale.github.io/taller_datos/en-vivo.html |
| Enlace para alumnos | https://guillermoleale.github.io/taller_datos/p |

La contraseña docente la elige y la escribe la persona responsable del taller. No va en el repositorio.

## Etapa 1. Publicar el sitio en GitHub Pages

1. Entrar al [repositorio](https://github.com/guillermoleale/taller_datos) y abrir **Settings**.
2. Con una cuenta gratuita, Pages solo publica repositorios públicos. Al final de la sección **General**, en **Danger Zone**, tocar **Change visibility** y elegir **Public**. El repositorio no tiene respuestas completas ni nombres, solo conteos del formulario.
3. En el menú de la izquierda, abrir **Pages**.
4. En **Source**, elegir **Deploy from a branch**. En **Branch**, elegir **main** y la carpeta **/ (root)**. Tocar **Save**.
5. Esperar uno o dos minutos.

**Chequeo:** abrir https://guillermoleale.github.io/taller_datos/ y ver la portada con la ficha "Taller de Datos". Si muestra un error 404, esperar un par de minutos más y recargar.

## Etapa 2. Poner el script en la planilla

1. Abrir la [planilla](https://docs.google.com/spreadsheets/d/1k1MriDezM_eyqf73Oq8UdYRBBHgm12rArJAMhBRK5q4/edit).
2. En el menú, ir a **Extensiones > Apps Script**. Se abre un editor en otra pestaña con un archivo llamado `Código.gs`.
3. Borrar todo el contenido de `Código.gs`.
4. Abrir [`apps-script/Codigo.gs`](https://github.com/guillermoleale/taller_datos/blob/main/apps-script/Codigo.gs) en GitHub, copiar todo el código (botón de copiar, arriba a la derecha del código) y pegarlo en el editor.
5. Buscar esta línea, cerca del principio:

   ```js
   const SECRETO = 'cambiar-esta-contrasena';
   ```

   Reemplazar `cambiar-esta-contrasena` por la contraseña docente, sin borrar las comillas.
6. Guardar con Ctrl+S (Cmd+S en Mac) o con el ícono de guardar.
7. En la barra de arriba del editor, en el desplegable de funciones, elegir `prepararPlanilla` y tocar **Ejecutar**.
8. Google pide permisos la primera vez:
   - Tocar **Revisar permisos** y elegir la cuenta de Google.
   - Si aparece "Google no verificó esta app", tocar **Configuración avanzada** y después **Ir a … (no seguro)**. Es un script propio, no de terceros.
   - Tocar **Permitir**.

   **Chequeo:** en la planilla aparece una pestaña nueva llamada `respuestas`, con los encabezados `fecha, sala, actividad, ronda, valor, participante`.

9. Tocar el botón azul **Implementar** (arriba a la derecha) y elegir **Nueva implementación**.
10. En el engranaje de **Seleccionar tipo**, elegir **Aplicación web** y completar:
    - **Descripción:** Taller de Datos
    - **Ejecutar como:** Yo
    - **Quién tiene acceso:** Cualquier usuario
11. Tocar **Implementar**. Si vuelve a pedir permisos, aceptarlos como en el paso 8.
12. Copiar la **URL de la aplicación web**. Tiene esta forma y termina en `/exec`:

    ```
    https://script.google.com/macros/s/UN-CODIGO-LARGO/exec
    ```

**Chequeo:** pegar esa URL en el navegador agregando `?accion=ping` al final. Tiene que mostrar algo como:

```json
{"ok":true,"hora":"2026-10-28T19:00:00.000Z"}
```

## Etapa 3. Conectar el sitio con la planilla

1. En GitHub, abrir [`assets/config.js`](https://github.com/guillermoleale/taller_datos/blob/main/assets/config.js) y tocar el lápiz (**Edit this file**).
2. Pegar la URL de la etapa 2 entre las comillas de `urlScript`. Tiene que quedar así:

   ```js
   urlScript: "https://script.google.com/macros/s/UN-CODIGO-LARGO/exec",
   ```

3. Tocar **Commit changes** y confirmar.
4. Esperar uno o dos minutos a que GitHub Pages publique el cambio.

**Chequeo:** abrir la [consola docente](https://guillermoleale.github.io/taller_datos/en-vivo.html). Arriba, junto al nombre del sitio, tiene que decir **Conectado a la planilla**. Si dice **Modo de prueba**, GitHub todavía no publicó el cambio: esperar y recargar con Ctrl+Shift+R.

## Probar todo junto

1. En la consola docente, abrir **Ajustes** y escribir la contraseña docente. Queda guardada en ese navegador.
2. Tocar una actividad de la lista, por ejemplo **Una palabra para dato**.
3. Desde un celular, entrar a https://guillermoleale.github.io/taller_datos/p. Tiene que aparecer la actividad con un campo para escribir.
4. Mandar una palabra desde el celular.

**Chequeo:** en unos segundos la palabra aparece en la nube de la consola y en la pestaña `respuestas` de la planilla.

Cuando termine la prueba, en la consola tocar **Empezar de nuevo** para que esa respuesta no se mezcle con las de la clase. Otra opción es cambiar `sala` en `assets/config.js`, que separa por completo un ensayo de la clase real.

## Compartir la consola con otro docente

Mandarle por privado este enlace, con la contraseña docente al final:

```
https://guillermoleale.com/taller_datos/en-vivo.html#clave=CONTRASEÑA
```

Al abrirlo, la consola guarda la contraseña en ese navegador y la saca de la barra de direcciones. Quien tenga el enlace puede abrir y cerrar actividades, así que no va en grupos ni en el chat de la clase. Si dos docentes tienen la consola abierta, las dos muestran lo mismo.

## Antes de la clase

- [ ] La consola dice **Conectado a la planilla**.
- [ ] El botón **Mostrar QR para participar** muestra el código QR.
- [ ] Las cuatro imágenes de **Etiquetar imágenes** cargan en la consola.
- [ ] **Preguntarle a un modelo de imágenes** funcionó una vez (la primera descarga unos 150 MB).
- [ ] Si se va a usar la corrida en vivo de `generativo.html`, la API key de Anthropic está a mano.

## Problemas frecuentes

| Qué pasa | Qué hacer |
|---|---|
| La consola dice **Sin conexión con la planilla** | Revisar que la URL en `assets/config.js` termine en `/exec` y que la implementación tenga acceso para **Cualquier usuario**. |
| Al abrir una actividad aparece **Contraseña docente incorrecta** | La contraseña de **Ajustes** tiene que ser igual a la de `SECRETO` en el script, con mayúsculas y minúsculas. |
| Se cambió `SECRETO` o el código del script y no toma el cambio | En Apps Script, ir a **Implementar > Administrar implementaciones**, tocar el lápiz, elegir **Nueva versión** e **Implementar**. Así la URL no cambia. |
| Se hizo una implementación nueva y cambió la URL | Actualizar `urlScript` en `assets/config.js` con la URL nueva. |
| El celular no muestra la actividad | La página se actualiza sola cada pocos segundos. Si no, recargar. Revisar que la actividad esté abierta en la consola y no cerrada. |
| No aparece el QR | El QR se carga desde internet. Mientras tanto, se puede dictar o escribir en el chat el enlace corto que muestra la consola. |
| No cargan las imágenes | Se cargan desde Wikimedia Commons. Probar otra red o abrirlas desde el enlace **Fuente** de cada una. |
