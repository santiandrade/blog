# Spec 01 — Blog base (sin posts)

**Estado:** Aprobado
**Dependencias:** Ninguna (primer spec del proyecto)
**Fecha:** 2026-07-31

## Objetivo

Reconstruir en HTML/CSS/JS estándar el diseño de `references/Blog Design/Blog Santi Andrade.dc.html` como el `index.html` real del blog, con sus tres pantallas (home, post, about) navegables mediante `data-route`, bilingüe (ES/EN) y con tema claro/oscuro, pero sin contenido de posts real todavía.

## Alcance

**Incluye:**

- Estructura de archivos estática: `index.html`, `css/styles.css`, `js/main.js`, `fonts/` (Archivo e IBM Plex Mono auto-alojadas en `.woff2`).
- Las tres pantallas de la maqueta (`home`, `post`, `about`) conmutadas mediante `data-route` en `<html>`, sin router ni URLs distintas, portando la lógica de `document.documentElement.dataset.route` del bloque `<script type="text/x-dc">` a JS estándar (`js/main.js`).
- Toggle de tema claro/oscuro (`data-theme`, persistido en `localStorage` bajo `sa-theme`) y toggle de idioma ES/EN (`data-lang` en `<html>` + `data-l="es"/"en"` en los fragmentos de texto, persistido bajo `sa-lang`), igual que en la maqueta.
- Todas las custom properties de color (`--bg`, `--surface`, `--ink`, `--muted`, `--line`, `--hair`, `--accent`, `--accent-deep`, `--code-bg`) y la tipografía (Archivo/IBM Plex Mono) portadas a `css/styles.css`, con los estilos inline de la maqueta convertidos a clases y los `style-hover`/`style-focus` a reglas `:hover`/`:focus-visible`.
- Los hooks de responsive (`data-r="page|head|cols|search|card|banner|three|pair|doc"`) y sus media queries a 820px/520px, conservados igual.
- Header fijo con navegación (Posts/Sobre mí/GitHub), enlace a `https://github.com/santiandrade`, y los dos botones de toggle (idioma y tema).
- **Home:** hero de dos columnas, buscador (visible, funcional aunque sin resultados), lista de posts vacía mostrando el estado `[data-empty]` ("Nada por aquí todavía"), y el banner de cita de Turing al pie, tal cual la maqueta.
- **Post:** plantilla de artículo con estructura genérica (cabecera, índice lateral sticky, bloques de tipo párrafo/tabla/code-block-con-botón-copiar/comparativa de tres columnas/navegación anterior-siguiente), con contenido placeholder genérico en vez del texto de ejemplo de la maqueta. Accesible solo navegando desde JS (sin post real que enlace a ella todavía).
- **About:** mismo layout de la maqueta (bio a dos columnas, sección "con qué trabajo", sección de contacto), con biografía y "con qué trabajo" en placeholder genérico, pero con el email de contacto real (`santiandrade@hotmail.com`) y el enlace a GitHub real.
- Footer con copyright.

**No incluye (fuera de alcance de este spec):**

- Barra de tags en home y su lógica de filtrado por tag (sin posts reales no hay tags que filtrar; la lógica de búsqueda por texto sí se porta, la de tags no).
- Contenido real de posts, índice de posts, generación o listado dinámico de artículos — se abordará en un spec futuro cuando exista el primer post.
- Texto final de la biografía/herramientas de "about" — queda placeholder, a completar más adelante.
- Cualquier build, generador de sitio estático, CMS o pipeline — sigue siendo HTML/CSS/JS estático a mano.
- SEO, sitemap, analytics, favicon o metadatos sociales (Open Graph, etc.).
- Despliegue/configuración de GitHub Pages en sí (workflow, dominio) — este spec solo entrega los archivos estáticos listos para servirse desde `/blog`.

## Modelo de datos

No se introduce ninguna base de datos, API ni estructura de contenido nueva. Lo único "persistente" son dos claves de `localStorage`, heredadas tal cual de la maqueta:

- `sa-theme` → `"light"` | `"dark"`. Ausente = `"light"`.
- `sa-lang` → `"es"` | `"en"`. Ausente = `"es"`.

Convenciones de atributos DOM que actúan como estado (sin backend, todo en memoria/DOM):

- `<html data-route="home|post|about">` — pantalla activa.
- `<html data-theme="dark">` (ausente = claro).
- `<html data-lang="es|en">`.
- `[data-l="es"]` / `[data-l="en"]` en fragmentos de texto bilingües.
- `[data-search]` en el input de búsqueda de home.
- `[data-postlist]` / `[data-post-card]` / `[data-empty]` en la lista de posts de home (sin `data-tags` por ahora, ya que no hay barra de tags en este spec).

No hay versionado de esquema porque no hay contenido serializado más allá de esas dos claves simples de `localStorage`.

## Plan de implementación

1. **Estructura de archivos.** Crear `css/`, `js/` y `fonts/` en la raíz del repo. Descargar los `.woff2` de Archivo (400/500/600/800) e IBM Plex Mono (400/500) y colocarlos en `fonts/`.
2. **Reset y estilos base.** Crear `css/styles.css` con las custom properties (`:root` y `html[data-theme="dark"]`), `@font-face` apuntando a `fonts/`, reset de caja, tipografía base y reglas globales (`a`, `button`, `::selection`, `:focus-visible`) portadas de la maqueta.
3. **Reglas de idioma/tema/ruta.** Portar a `css/styles.css` las reglas `html[data-lang="en"] [data-l="es"]`, `[data-icon]`, `[data-nav]` subrayado activo, y `[data-screen]` mostrando solo la pantalla activa según `data-route`.
4. **Responsive.** Portar las media queries de 820px y 520px con los hooks `data-r="..."` tal cual de la maqueta.
5. **Esqueleto HTML.** Escribir `index.html` con el header (branding, nav, toggles) y los tres `<main data-screen="...">` (home, post, about), convirtiendo los estilos inline de la maqueta en clases dentro de `css/styles.css`.
6. **Home.** Maquetar hero, buscador (sin tagbar), lista de posts vacía con `[data-empty]` visible, y banner de cita final.
7. **Post.** Maquetar la plantilla genérica: cabecera, aside con índice sticky, y bloques de ejemplo (párrafo, tabla, code block con botón copiar, comparativa de tres columnas, nav anterior/siguiente) con contenido placeholder.
8. **About.** Maquetar bio a dos columnas, sección "con qué trabajo" y sección de contacto, con placeholder en bio/herramientas y datos reales en contacto (email + GitHub).
9. **`js/main.js`.** Portar la lógica del bloque `<script type="text/x-dc">`: inicialización de `data-route`/`data-theme`/`data-lang` desde `localStorage`, `goHome`/`goPost`/`goAbout`, `toggleTheme`, `toggleLang` (+ sincronizar placeholder del buscador), `onSearch` (filtrado de `[data-post-card]` por texto, sin lógica de tags), y `copyCode`. Sustituir `onClick="{{ ... }}"` por `addEventListener`.
10. **Verificación manual en navegador.** Abrir `index.html` directamente, comprobar navegación entre las tres pantallas, persistencia de tema/idioma tras recargar, responsive en ~820px/520px, y que el botón de copiar código funciona en la plantilla de post.

## Criterios de aceptación

- [ ] Existen los archivos `index.html`, `css/styles.css`, `js/main.js` y las fuentes `.woff2` en `fonts/`, todos con rutas relativas (sin ninguna ruta absoluta que empiece por `/`).
- [ ] Al abrir `index.html` en el navegador se muestra la pantalla `home` por defecto.
- [ ] Los enlaces/botones "Posts" y "Sobre mí" del header cambian `data-route` y muestran/ocultan la pantalla correspondiente sin recargar la página.
- [ ] El botón de tema alterna entre claro y oscuro, actualiza los iconos sol/luna, y el valor persiste en `localStorage` (`sa-theme`) tras recargar la página.
- [ ] El botón de idioma alterna entre ES y EN, oculta/muestra los `[data-l]` correspondientes, actualiza el placeholder del buscador, y persiste en `localStorage` (`sa-lang`) tras recargar.
- [ ] En home, con la lista de posts vacía, se muestra el mensaje `[data-empty]` ("Nada por aquí todavía" / "Nothing here yet" según idioma) y el buscador es visible (sin barra de tags).
- [ ] La pantalla `post` muestra su plantilla completa (cabecera, índice lateral, bloques de párrafo/tabla/code-block/comparativa/nav anterior-siguiente) con contenido placeholder genérico, y el botón "Copy" del bloque de código copia su contenido al portapapeles y muestra confirmación temporal.
- [ ] La pantalla `about` muestra bio y "con qué trabajo" en placeholder, y un email de contacto real (`mailto:santiandrade@hotmail.com`) y un enlace a `https://github.com/santiandrade` funcionales.
- [ ] El enlace "GitHub" del header apunta a `https://github.com/santiandrade`.
- [ ] Los colores, tipografía (Archivo/IBM Plex Mono) y las reglas gruesas de 2px se ven visualmente equivalentes a la maqueta de referencia, en ambos temas.
- [ ] El layout colapsa correctamente por debajo de 820px y 520px (comprobado redimensionando la ventana del navegador), igual que en la maqueta.
- [ ] Ningún `<script src>` ni `<link>` depende de `references/Blog Design/support.js` ni de Google Fonts (CDN) — todo servido desde el propio repo.

## Decisiones tomadas y descartadas

- **Archivos separados (HTML/CSS/JS) en vez de todo-en-uno.** Se descartó meter `<style>`/`<script>` inline en `index.html` porque, aunque más parecido a la maqueta original, dificulta el mantenimiento a medida que crezca el blog. GitHub Pages sirve estáticos igual de bien en ambos casos, así que no hay razón técnica para no separar.
- **Fuentes auto-alojadas en vez de Google Fonts CDN.** Se eligió descargar los `.woff2` y servirlos desde `fonts/` para no depender de un servicio externo en cada carga de página, a costa de añadir los archivos de fuente al repo.
- **Construir ya la pantalla `post` con contenido placeholder, no con el texto de ejemplo de la maqueta.** Se decidió maquetar la estructura completa (para validar el diseño con las tres pantallas) pero sin reutilizar el contenido ficticio del mockup (segundo cerebro, etc.), para no confundirlo con un post real. El contenido real llegará en un spec futuro.
- **Ocultar la barra de tags en home, mantener el buscador.** Sin posts no hay tags reales que filtrar, así que se descarta portar `data-tagbar` y la lógica de `onTag`/`data-tags` en este spec; el buscador se deja visible porque no depende de que existan tags.
- **About con placeholder salvo el contacto.** La biografía y "con qué trabajo" quedan genéricas porque el usuario aún no ha decidido ese texto, pero el email y el enlace de GitHub sí son datos reales y estáticos, así que se usan desde ya en vez de dejarlos como placeholder también.
- **Enlace de GitHub del header apunta al perfil real (`github.com/santiandrade`)** en vez del genérico `https://github.com` de la maqueta, por ser un dato fijo de cabecera no ligado a contenido de posts.
- **Sin router ni URLs por pantalla.** Se mantiene el enfoque de la maqueta (un solo `data-route` en `<html>`, sin `history.pushState` ni hash routing) para no introducir complejidad de navegador que la maqueta no tenía y que no aporta valor sin contenido indexable todavía.
