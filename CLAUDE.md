# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Estado del proyecto

Este repositorio es el blog personal de Santi Andrade, pensado para publicarse en GitHub Pages (`santiandrade.github.io/blog`). Está en una fase muy temprana: `index.html` es todavía un placeholder ("Work in progress"). No hay build, ni tests, ni linter configurados — no existen `package.json` ni pipeline alguno todavía. El repositorio aún no tiene ningún commit (rama actual: `master`; la rama principal prevista es `main`).

## Estructura

- `index.html` — punto de entrada real del sitio (actualmente placeholder).
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

- `home` — hero a dos columnas, buscador + barra de tags, lista de `article[data-post-card]` y un banner de acento al pie. El filtrado es JS vanilla: cada card lleva `data-tags` (lista separada por espacios) y `data-terms` (sinónimos de búsqueda en ambos idiomas); se cruza texto de búsqueda con tag activo y se muestra/oculta, con un `[data-empty]` para el estado vacío.
- `post` — cabecera del artículo + grid `data-r="doc"` con un `<aside>` sticky de índice y el cuerpo del artículo (bloques de código con botón de copiar, tablas, comparativa de tres columnas `data-r="three"`, navegación anterior/siguiente `data-r="pair"`).
- `about` — biografía a dos columnas y secciones etiquetadas con un lateral de 200px.

**Importante:** el archivo está escrito con la sintaxis propia de una herramienta de diseño visual (`{{ }}`, `sc-if`, `sc-for`, `onClick="{{ goHome }}"`, `style-hover`, `style-focus`, `<helmet>`, `<x-dc>`, el bloque `<script type="text/x-dc">` con una `class Component extends DCLogic`), no HTML/JS estándar. Además todo el estilo va inline en atributos `style`. No se puede ejecutar tal cual fuera de su herramienta de origen.

## Cómo trabajar aquí

- No hay comandos de build/lint/test que ejecutar — es HTML/CSS/JS estático. Verificar cambios abriendo el HTML directamente en el navegador.
- Al implementar el blog real a partir de las referencias, traducir el mockup a HTML/CSS/JS estándar: los `onClick="{{ ... }}"` pasan a `addEventListener`, los `style-hover`/`style-focus` a reglas `:hover`/`:focus-visible` en una hoja de estilos, y los estilos inline a clases. La lógica del `<script type="text/x-dc">` (rutas, toggles de tema/idioma, filtrado, copiar código) sí es JS normal y se puede portar casi literalmente.
- El contenido del blog es bilingüe por defecto (español primero, inglés como alternativa vía toggle) — mantener esa convención si se añade contenido nuevo.
- El sitio se sirve desde una subruta (`/blog`), así que usar siempre rutas relativas para assets y enlaces; nada de rutas absolutas que empiecen por `/`.
