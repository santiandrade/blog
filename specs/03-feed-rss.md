# Spec 03 — Feed RSS resumido y bilingüe

**Estado:** Implementado
**Dependencias:** Arquitectura de datos de posts y permalinks estáticos actuales
**Fecha:** 2026-08-01

## Objetivo

Permitir que cualquier lector se suscriba al blog desde una aplicación RSS y reciba, por cada nuevo artículo, su título, fecha, extracto y enlace permanente. El feed no incluirá el cuerpo completo: reutilizará el resumen bilingüe que ya aparece debajo de cada título en la portada y llevará al lector al artículo original.

La solución debe mantener el blog como sitio estático en GitHub Pages, sin CMS, servidor, dependencias de terceros ni proceso de build obligatorio.

## Experiencia de usuario

El blog ofrecerá dos feeds independientes:

- `https://santiandrade.github.io/blog/feed.xml` — español.
- `https://santiandrade.github.io/blog/feed-en.xml` — inglés.

El pie de todas las páginas de producción mostrará enlaces visibles y comprensibles para ambos feeds. La propuesta de texto es:

- Español: `Suscribirse: RSS ES · RSS EN`
- Inglés: `Subscribe: RSS ES · RSS EN`

Los enlaces serán URLs HTTPS normales, no enlaces con el esquema `feed:`, para que funcionen en cualquier navegador y puedan copiarse o pegarse en Feedly, Inoreader, NetNewsWire, Reeder, FreshRSS u otro lector.

Además, todos los documentos HTML de producción declararán ambos feeds mediante `<link rel="alternate" type="application/rss+xml">` dentro de `<head>`. Esto permitirá que lectores y extensiones compatibles detecten los feeds al recibir únicamente la URL del blog.

## Fuente canónica de los datos

`js/data/posts-meta.js` continuará siendo la única fuente de verdad para los datos publicados en el feed:

- `id` → slug y permalink.
- `date` → fecha de publicación.
- `title.es` / `title.en` → título localizado.
- `excerpt.es` / `excerpt.en` → resumen localizado.

No se copiarán manualmente títulos o resúmenes dentro de los XML. Tampoco se leerán `introHtml` ni `bodyHtml`: este feed está diseñado expresamente para ser resumido y dirigir la lectura completa al blog.

## Formato de los feeds

Los dos archivos usarán RSS 2.0 y declararán el namespace Atom para el enlace propio del feed.

Cada canal incluirá como mínimo:

- título `Santi Andrade / Blog`;
- URL pública del blog;
- descripción localizada, reutilizando la descripción pública actual de la portada;
- idioma (`es-ES` o `en`);
- enlace `atom:link` al propio feed con `rel="self"`.

Cada elemento `<item>` incluirá:

- `<title>` localizado;
- `<description>` con el `excerpt` localizado;
- `<pubDate>` en formato RFC 822, interpretando la fecha `AAAA.MM.DD` de la metadata como las `00:00:00 GMT` del día indicado;
- `<guid isPermaLink="true">` con el permalink canónico limpio;
- `<link>` al artículo original con parámetros UTM para reconocer las visitas procedentes del RSS.

La URL de seguimiento propuesta será:

```text
https://santiandrade.github.io/blog/<slug>/?utm_source=rss&utm_medium=rss&utm_campaign=blog_feed
```

El `guid` seguirá usando la URL sin parámetros para que un lector no interprete una modificación de analítica como un artículo nuevo. Los feeds contendrán todos los posts y conservarán el orden de `SITE_POSTS_META`, del más reciente al más antiguo.

Dentro del XML, los separadores `&` de los parámetros UTM se serializarán como `&amp;`. El parser devolverá la URL normal al consumidor; escribir los ampersands sin escapar produciría XML inválido.

## Generación

Se añadirá `scripts/generate-rss.js`, ejecutable con Node.js y únicamente APIs estándar. El script:

1. cargará `js/data/posts-meta.js` en un contexto aislado;
2. validará que cada entrada tenga `id`, fecha, títulos y extractos para ambos idiomas;
3. comprobará que los slugs sean únicos y que las fechas tengan el formato esperado;
4. escapará correctamente los caracteres reservados de XML;
5. generará de forma determinista `feed.xml` y `feed-en.xml`;
6. admitirá `--check` para comparar el resultado esperado con los archivos versionados y terminar con error si están desactualizados.

Comandos previstos:

```bash
node scripts/generate-rss.js
node scripts/generate-rss.js --check
```

Los XML generados se versionarán en el repositorio para que GitHub Pages pueda servirlos directamente. No se añadirá `package.json`, una librería RSS ni un generador de sitio: para este modelo de datos serían complejidad ornamental con corbata.

La guía de creación de posts en `CLAUDE.md` indicará que, después de modificar `posts-meta.js`, debe ejecutarse el generador y verificarse el resultado con `--check`.

## Integración visual y autodetección

Se actualizarán todos los puntos de entrada HTML de producción existentes:

- `index.html`
- `hermes-agent/index.html`
- `segundo-cerebro-obsidian-hermes/index.html`

Cada uno incluirá:

- las dos declaraciones de autodetección RSS en `<head>`, con URLs absolutas para que `<base href="../">` no introduzca diferencias entre puntos de entrada;
- los enlaces visibles `RSS ES` y `RSS EN` dentro de `.site-footer`;
- exactamente una copia de cada enlace, sin modificar los HTML de referencia bajo `references/`.

Los enlaces del pie respetarán el sistema visual existente, el contraste de ambos temas, el responsive y la navegación por teclado. No se añadirá un modal ni JavaScript específico para suscribirse: el enlace normal ya permite abrir, copiar o entregar el feed a una aplicación compatible.

## Archivos previstos para la implementación

**Crear:**

- `feed.xml`
- `feed-en.xml`
- `scripts/generate-rss.js`
- `scripts/generate-rss.test.js`

**Modificar:**

- `index.html`
- `hermes-agent/index.html`
- `segundo-cerebro-obsidian-hermes/index.html`
- `css/styles.css`, solo si los enlaces RSS necesitan estilos adicionales que no cubra `.site-footer`
- `CLAUDE.md`

No se modificarán los cuerpos de los artículos ni la estructura de `SITE_POSTS_META` salvo que la implementación descubra un dato estrictamente necesario y se documente antes de incorporarlo.

## Plan de implementación

1. Crear `scripts/generate-rss.test.js` con `node:test` y pruebas inicialmente fallidas para validación de metadata, escape XML, fechas, localización, GUID, UTM y modo `--check`.
2. Implementar la carga y validación de `SITE_POSTS_META` en `scripts/generate-rss.js`.
3. Implementar el escape XML, la conversión de fecha y la serialización RSS 2.0.
4. Generar `feed.xml` y `feed-en.xml` con los posts actuales.
5. Añadir el modo `--check` y verificar que detecta tanto archivos ausentes como contenido obsoleto.
6. Añadir las declaraciones de autodetección a todos los HTML de producción.
7. Añadir los enlaces bilingües de suscripción al pie de todos los HTML de producción.
8. Documentar en `CLAUDE.md` la generación y validación del RSS dentro del flujo para publicar nuevos posts.
9. Ejecutar las validaciones estructurales, funcionales y visuales descritas en este spec.

## Validación prevista

### XML y contenido

- Ejecutar `node --test scripts/generate-rss.test.js` y exigir que todas las pruebas pasen.
- Ejecutar `node scripts/generate-rss.js --check` y exigir salida correcta sin modificar archivos.
- Parsear ambos XML con un parser XML independiente para demostrar que están bien formados.
- Verificar RSS 2.0, `atom:link`, idioma, URL del canal y campos obligatorios de cada elemento.
- Comprobar que el número y el orden de elementos coinciden con `SITE_POSTS_META`.
- Comprobar que cada título y extracto coincide exactamente con el idioma correspondiente.
- Comprobar que ningún feed contiene `introHtml`, `bodyHtml` ni texto del idioma contrario.
- Comprobar que cada `guid` es canónico y que cada `<link>` conserva el permalink y añade los UTM previstos.
- Ejecutar el feed contra un validador RSS reconocido cuando la conectividad lo permita.

### HTML y experiencia

- Confirmar que los tres HTML de producción contienen exactamente dos declaraciones RSS y dos enlaces visibles, y que `references/` permanece intacto.
- Servir el repositorio mediante un servidor HTTP estático y comprobar que `/blog/feed.xml` y `/blog/feed-en.xml` responden con HTTP 200 y contenido XML.
- Verificar que las URLs de feed se resuelven correctamente desde la portada y desde cada permalink.
- Probar los enlaces con navegación por teclado y en ambos idiomas, temas y anchos de escritorio/móvil.
- Confirmar que añadir los enlaces no provoca overflow ni altera la navegación existente.

### Regresión y mantenimiento

- Ejecutar `node --check scripts/generate-rss.js` y `node --check js/main.js`.
- Ejecutar `node --check scripts/generate-rss.test.js`.
- Ejecutar `git diff --check`.
- Añadir temporalmente un post de prueba en una copia o fixture, demostrar que `--check` falla antes de regenerar y vuelve a pasar después, y retirar el dato de prueba.
- Verificar que una segunda ejecución del generador no produce cambios, garantizando salida determinista.

## Criterios de aceptación

- [ ] `feed.xml` es un feed RSS 2.0 válido en español y `feed-en.xml` su equivalente en inglés.
- [ ] Ambos feeds se generan exclusivamente desde `js/data/posts-meta.js` mediante un script sin dependencias externas.
- [ ] Las pruebas basadas en `node:test` cubren validación, serialización, localización y detección de feeds obsoletos sin requerir `package.json`.
- [ ] Cada entrada contiene título, fecha, extracto y enlace al artículo, pero no el contenido completo.
- [ ] Los títulos y extractos coinciden con los que aparecen en las tarjetas de la portada.
- [ ] Los enlaces llevan UTM para identificar tráfico RSS y los GUID conservan los permalinks canónicos limpios.
- [ ] Los feeds pueden descubrirse automáticamente desde todos los HTML de producción.
- [ ] El pie ofrece enlaces visibles, bilingües, accesibles y copiables para RSS ES y RSS EN.
- [ ] `node scripts/generate-rss.js --check` detecta feeds ausentes u obsoletos y pasa tras regenerarlos.
- [ ] GitHub Pages sirve ambos feeds con HTTP 200 después del despliegue.
- [ ] La implementación no introduce CMS, backend, dependencias de ejecución ni contenido duplicado mantenido a mano.
- [ ] La navegación, idiomas, temas, permalinks, responsive, compartición y Cloudflare Web Analytics siguen funcionando sin regresiones.

## Fuera de alcance

- Publicar el contenido completo de los artículos dentro del RSS.
- Medir aperturas o lecturas realizadas dentro de aplicaciones RSS.
- Usar servicios intermediarios como FeedBurner o plataformas de newsletter.
- Enviar artículos por correo electrónico.
- Crear feeds por tag, autor o categoría.
- Adoptar un CMS, un generador de sitio estático o un backend.
- Redirigir automáticamente desde el navegador a una aplicación RSS concreta.

## Decisiones tomadas y descartadas

- **Feed resumido en vez de completo.** Se reutiliza el extracto de la portada y se dirige al artículo original para mantener la experiencia visual del blog y contabilizar la visita web cuando el lector decide continuar.
- **Dos feeds en vez de mezclar idiomas.** Cada suscriptor elige un idioma y no recibe entradas duplicadas ni contenido híbrido.
- **Generación desde metadata en vez de XML manual.** Evita que los títulos, resúmenes o URLs diverjan entre la portada y el RSS.
- **XML versionado en vez de generación durante el despliegue.** GitHub Pages puede servirlo sin incorporar una nueva infraestructura de build.
- **Script Node sin dependencias.** El repositorio ya usa JavaScript y el volumen de datos no justifica una librería ni un `package.json`.
- **Enlaces HTTPS normales en vez de `feed:`.** Son copiables y compatibles con navegadores y lectores sin depender de asociaciones de protocolo del sistema.
- **Enlaces visibles en el pie en vez de ampliar la cabecera.** La cabecera ya concentra navegación, idioma y tema; el pie ofrece una ubicación persistente sin saturarla, especialmente en móvil.
- **UTM solo en `<link>`, no en `<guid>`.** Permite atribuir las visitas al RSS sin comprometer la identidad estable de cada entrada.
