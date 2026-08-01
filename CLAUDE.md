# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Estado del proyecto

Este repositorio es el blog personal de Santi Andrade, publicado como sitio estático en GitHub Pages (`santiandrade.github.io/blog`). La base visual y el primer post real están implementados en el repositorio: no hay build, tests ni linter configurados — tampoco `package.json` ni pipeline. El contenido se mantiene directamente en HTML/CSS/JS estándar.

## Estructura

- `index.html` — punto de entrada real del sitio; contiene el esqueleto de las tres pantallas (home, post, about). Las tres están vacías de contenido: ese contenido lo inyecta `js/main.js` en tiempo de carga a partir de los ficheros de `js/data/` (ver "Arquitectura de datos: tags, posts y about").
- `js/main.js` — toda la lógica de la SPA: routing por `data-route` y History API, tema, idioma, buscador/filtro por tag, carga bajo demanda del contenido de posts, botón de compartir con Web Share API y fallback al portapapeles, y el renderizado de tags/posts/about a partir de `js/data/`.
- `js/data/tags.js` — catálogo de tags (`window.SITE_TAGS`).
- `js/data/about.js` — contenido de la pantalla "Sobre mí" (`window.SITE_ABOUT`): bio, portrait, herramientas, contacto.
- `js/data/posts-meta.js` — metadata de todos los posts (`window.SITE_POSTS_META`): fecha, tags, título, extracto, TOC. Debe mantenerse ligero — nunca meter aquí el HTML del artículo.
- `js/data/posts/<id>.js` — un fichero por post con su contenido (`window.SITE_POST_BODIES["<id>"]`): párrafo introductorio y cuerpo completo en HTML.
- `<id>/index.html` — entrada estática de GitHub Pages para la URL permanente de cada post. Reutiliza la SPA mediante `<base href="../">` y contiene los metadatos sociales propios del artículo.
- `.gitignore` — solo ignora `/.idea/` (el proyecto se abre desde Rider/JetBrains).
- `references/Blog Design/` — material de referencia de diseño, no código de producción:
  - `Blog Santi Andrade.dc.html` — el mockup funcional de la maqueta objetivo del blog. Ver "La maqueta de referencia" más abajo.
  - `support.js` — runtime generado (`GENERATED from dc-runtime/src/*.ts — do not edit`) que permite previsualizar `Blog Santi Andrade.dc.html` en el navegador: compila su sintaxis `{{ }}`/`sc-if`/`sc-for`/etc. a React y monta React/ReactDOM/Babel desde CDN. Es el único `<script src>` del `.dc.html`, así que hace falta para abrir esa referencia y ver el mockup renderizado, pero no forma parte del blog real ni se usa al reconstruirlo en HTML/CSS/JS estándar.
  - Estos archivos son solo referencia/inspiración para reconstruir el blog real; no se sirven ni se importan desde `index.html`.

## La maqueta de referencia

`Blog Santi Andrade.dc.html` es una SPA de una sola página con tres pantallas conmutadas por atributos en `<html>`, sin router ni framework.

**Estado global (todo en `document.documentElement`, sin URL ni history):**

- `data-route="home|post|about"` — el CSS muestra el `<main data-screen="...">` correspondiente y oculta el resto (`[data-screen]{display:none}` + reglas de `display:block`). Navegar = asignar `dataset.route` y `scrollTo(0,0)`.
- `data-lang="es|en"` — bilingüismo. **Ojo:** el atributo del `<html>` es `data-lang`; los fragmentos de texto se marcan con `data-l="es"` / `data-l="en"` y el CSS oculta el que no toca. Persistido en `localStorage` bajo `sa-lang`. El `placeholder` del buscador se traduce por JS aparte (no es texto en el DOM).
- `data-theme="dark"` para modo oscuro (ausente = claro), persistido en `localStorage` bajo `sa-theme`.

**Diseño:** tipografía Archivo (títulos/UI, pesos 400/500/600/800) + IBM Plex Mono (metadatos, tags, código, footer). Todo el color va por custom properties en `:root` y `html[data-theme="dark"]`: `--bg`, `--surface`, `--ink`, `--muted`, `--line`, `--hair`, `--accent` (`#ec3013` claro / `#ff563c` oscuro), `--accent-deep`, `--code-bg`. Estética editorial: reglas gruesas de 2px (`var(--line)`) separando secciones, grids asimétricos (7fr/5fr), mayúsculas con `letter-spacing` en mono.

**Layout responsive:** el contenedor y los bloques llevan un atributo `data-r="..."` (`page`, `head`, `cols`, `search`, `card`, `banner`, `three`, `pair`, `doc`) que las media queries de 820px y 520px usan para colapsar a una columna. Es el único gancho de responsive — al portar el diseño, conservar esos ganchos o sustituirlos por clases equivalentes.

**Pantallas:**

- `home` — hero a dos columnas, buscador, lista de `article[data-post-card]` (generada por JS a partir de `SITE_POSTS_META`) y un banner de acento al pie. El filtrado es JS vanilla: cada card lleva `data-terms` (sinónimos de búsqueda en ambos idiomas); se cruza con el texto de búsqueda y se muestra/oculta, con un `[data-empty]` para el estado sin coincidencias.
- `post` — artículo real + grid `data-r="doc"` con un `<aside>` sticky de índice y el cuerpo del artículo (tablas, comparativas, callouts, listas y navegación), todo generado por JS a partir de `SITE_POSTS_META` + `SITE_POST_BODIES`. Al hacer clic en una card se llama a `renderPost(postId)` antes de navegar, así que soporta cualquier número de posts sin duplicar pantallas.
- `about` — biografía a dos columnas y secciones etiquetadas con un lateral de 200px, generada por JS a partir de `SITE_ABOUT`.

**Importante:** el archivo está escrito con la sintaxis propia de una herramienta de diseño visual (`{{ }}`, `sc-if`, `sc-for`, `onClick="{{ goHome }}"`, `style-hover`, `style-focus`, `<helmet>`, `<x-dc>`, el bloque `<script type="text/x-dc">` con una `class Component extends DCLogic`), no HTML/JS estándar. Además todo el estilo va inline en atributos `style`. No se puede ejecutar tal cual fuera de su herramienta de origen.

## Arquitectura de datos: tags, posts y about

El contenido de tags, posts y la pantalla "Sobre mí" vive fuera de `index.html`, en `js/data/`, para que añadir o editar contenido no implique tocar el HTML de la SPA. `index.html` solo tiene contenedores vacíos con atributos `data-*` que `js/main.js` rellena en el arranque (`initState()`).

No hay build ni bundler: cada fichero de `js/data/` es un `<script>` normal cargado con `<script src="..." defer>` en `index.html`, que registra sus datos en `window.*`. Por eso no se puede usar `fetch()` de JSON/HTML (falla bajo `file://`, y el propio `CLAUDE.md` pide poder verificar abriendo el HTML directamente) — el patrón es siempre "script que se auto-registra en `window`".

**`js/data/tags.js` → `window.SITE_TAGS`**
Array de `{ id, es, en }`. `id` es el valor usado en `data-tag` y en el array `tags` de cada post en `posts-meta.js`.

**`js/data/posts-meta.js` → `window.SITE_POSTS_META`**
Array de objetos, uno por post, ordenado del más reciente al más antiguo. Contiene solo metadata — nunca el HTML del artículo, porque este fichero se carga siempre (home, buscador, tags) y debe mantenerse ligero. Campos de cada post:

| Campo     | Tipo                       | Uso                                                              |
|-----------|----------------------------|-------------------------------------------------------------------|
| `id`      | string (slug único)        | Enlaza con `window.SITE_POST_BODIES[id]` en `js/data/posts/<id>.js` |
| `number`  | string, `"01"`, `"02"`...  | Número de post mostrado en la card y en el kicker del artículo   |
| `date`    | string `"AAAA.MM.DD"`      | Fecha mostrada en card y artículo                                |
| `readMin` | number                     | Minutos de lectura                                               |
| `tags`    | array de ids de `tags.js`  | Debe existir cada id en `SITE_TAGS`                              |
| `terms`   | string                     | Sinónimos de búsqueda en ambos idiomas, separados por espacios   |
| `title`   | `{ es, en }`               | Título del post                                                  |
| `excerpt` | `{ es, en }`               | Párrafo corto de la card en la home                              |
| `kicker`  | `{ es, en }`               | Texto sobre el título en la pantalla del artículo (p. ej. `"Post 02 · ..."`) |
| `toc`     | `[{ id, es, en }]`         | Entradas del índice lateral; `id` debe coincidir con el `id` del `<h2>` correspondiente en el `bodyHtml` |

**`js/data/posts/<id>.js` → `window.SITE_POST_BODIES["<id>"]`**
Un fichero por post. Cada uno hace `window.SITE_POST_BODIES = window.SITE_POST_BODIES || {};` y luego `window.SITE_POST_BODIES["<id>"] = { introHtml, bodyHtml };`:

- `introHtml` — el párrafo introductorio del artículo (el que va antes del primer `<h2>`).
- `bodyHtml` — el resto del artículo, desde el primer `<h2 id="s1">` en adelante (secciones, callouts, tablas, listas...). **No** incluye el `<nav class="post-pair">` final ni el párrafo intro: esos los añade `renderPost()` en `js/main.js` automáticamente.

En ambos campos, todo el texto va bilingüe con el mismo patrón que el resto del sitio: cada fragmento envuelto en `<span data-l="es">...</span><span data-l="en">...</span>` pegados (sin espacio entre ellos), nunca como texto suelto. El CSS oculta el idioma que no toca según `data-lang` en `<html>`.

**`js/data/about.js` → `window.SITE_ABOUT`**
Objeto único (no array, solo hay una pantalla "Sobre mí") con esta forma:

```js
window.SITE_ABOUT = {
  portrait: { src, alt },        // imagen de la pantalla about
  hero: {
    title: { es, en },
    lede:  { es, en },           // primer párrafo, más destacado
    muted: { es, en }            // segundo párrafo, tono secundario
  },
  toolsLabel: { es, en },        // título de la sección "Con qué trabajo"
  tools: [{ name, es, en }],     // name es texto plano (no bilingüe); es/en es la descripción
  contactLabel: { es, en },      // título de la sección "Escríbeme"
  contactLinks: [{ href, label }] // label es texto plano (p. ej. un email), no bilingüe
};
```

**Renderizado (`js/main.js`)**
- `renderTags()` — pinta los botones de `[data-tagbar]` a partir de `SITE_TAGS` (más el botón fijo "Todo/All").
- `renderPostList()` — pinta las cards de `[data-postlist]` a partir de `SITE_POSTS_META`.
- `renderPost(postId)` — busca la metadata en `SITE_POSTS_META` y el contenido en `SITE_POST_BODIES`, y rellena `[data-post-header]`, `[data-post-toc]` y `[data-post-body]`. Se llama al entrar directamente en la URL permanente de un post y cada vez que se hace clic en una card o enlace con `data-go="post" data-post-id="..."`. Si el script de contenido no estaba ya en la página, `ensurePostLoaded()` lo carga bajo demanda.
- `renderAbout()` — pinta `[data-about-hero-text]`, `[data-about-portrait]`, `[data-about-tools-label]`, `[data-about-tools]`, `[data-about-contact-label]` y `[data-about-contact]` a partir de `SITE_ABOUT`. Se llama una vez en el arranque.

## Cómo añadir un post nuevo

Sigue estos pasos en orden. Esta guía está pensada para que cualquier agente de IA pueda crear un post completo sin necesitar más contexto que este fichero.

1. **Elige un `id` (slug) único**, en minúsculas y con guiones (p. ej. `"segundo-post"`). Debe ser distinto de todos los `id` ya existentes en `js/data/posts-meta.js`.

2. **Añade el objeto de metadata** en `js/data/posts-meta.js`, dentro del array `window.SITE_POSTS_META`. Insértalo en la posición correcta según fecha (el array va del más reciente al más antiguo, y `number` es correlativo, p. ej. `"02"` para el segundo post). Rellena todos los campos de la tabla de la sección anterior. Si el post usa un tag que no existe todavía, añádelo primero a `js/data/tags.js`.

3. **Crea el fichero de contenido** en `js/data/posts/<id>.js` (usa el mismo `id` elegido en el paso 1) con esta forma exacta:

   ```js
   window.SITE_POST_BODIES = window.SITE_POST_BODIES || {};
   window.SITE_POST_BODIES["<id>"] = {
     introHtml: `<span data-l="es">...</span><span data-l="en">...</span>`,
     bodyHtml: `
       <h2 id="s1">01 · <span data-l="es">...</span><span data-l="en">...</span></h2>
       <p><span data-l="es">...</span><span data-l="en">...</span></p>
       <!-- más secciones -->
     `
   };
   ```

   - Cada `id` de `<h2 id="s1">`, `<h2 id="s2">`... debe tener una entrada correspondiente en el `toc` de la metadata del paso 2, en el mismo orden.
   - Usa las clases ya existentes en `css/styles.css` para bloques especiales: `post-callout` (destacado), `post-three` con `post-three-col` (tres columnas), `post-table` (tabla comparativa), `post-bullets` (lista). Mira `js/data/posts/hermes-agent.js` como ejemplo real de cada uno.
   - No incluyas el párrafo introductorio dentro de `bodyHtml` (va en `introHtml`) ni el nav de "volver a todos los posts" al final (lo añade `renderPost()` automáticamente).
   - Todo el texto, sin excepción, en pares `<span data-l="es">` / `<span data-l="en">` pegados — nunca texto plano sin envolver, o se mostrará en ambos idiomas a la vez.

4. **Registra el script en `index.html`**, añadiendo una línea junto a las de los demás posts, antes de `<script src="js/main.js" defer>`:

   ```html
   <script src="js/data/posts/<id>.js" defer></script>
   ```

5. **Crea `<id>/index.html` para la URL permanente.** Copia el `index.html` raíz, añade `<meta name="initial-post" content="<id>">` y `<base href="../">`, y sustituye `title`, descripción, canonical, Open Graph y Twitter por los del artículo. GitHub Pages podrá servir así `/blog/<id>/` con estado HTTP 200 y los robots sociales recibirán metadatos propios sin depender de ejecutar JavaScript.

6. **Verifica con un servidor estático local**: la card nueva debe apuntar a `/blog/<id>/`, el filtro por tag y el buscador deben encontrarla, la URL directa debe responder y abrir el artículo, y atrás/adelante debe mantener ruta, TOC, contenido y ambos idiomas correctos. Abrir `index.html` por `file://` sigue siendo útil para la home, pero no reproduce las rutas HTTP de GitHub Pages.

## Cómo trabajar aquí

- No hay comandos de build/lint/test que ejecutar — es HTML/CSS/JS estático. Verificar cambios abriendo el HTML directamente en el navegador.
- Al implementar el blog real a partir de las referencias, traducir el mockup a HTML/CSS/JS estándar: los `onClick="{{ ... }}"` pasan a `addEventListener`, los `style-hover`/`style-focus` a reglas `:hover`/`:focus-visible` en una hoja de estilos, y los estilos inline a clases. La lógica del `<script type="text/x-dc">` (rutas, toggles de tema/idioma, filtrado, copiar código) sí es JS normal y se puede portar casi literalmente.
- El contenido del blog es bilingüe por defecto (español primero, inglés como alternativa vía toggle) — mantener esa convención si se añade contenido nuevo.
- El sitio se sirve desde una subruta (`/blog`). Los assets deben ser relativos (las entradas de posts usan `<base href="../">`); las URLs de navegación las construye `js/main.js` a partir de `meta[name="site-base"]`, nunca desde la raíz del dominio a mano.
