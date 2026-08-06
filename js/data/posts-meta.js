// Metadata de todos los posts, ordenados del más reciente al más antiguo.
// Este fichero se carga siempre (home, buscador, tags) así que debe
// mantenerse ligero: NUNCA metas aquí el HTML del artículo.
//
// Para añadir un post nuevo:
//   1. Añade aquí un objeto con su metadata.
//   2. Crea js/data/posts/<id>.js con su contenido (ver ese directorio
//      para el formato) y regístralo en window.SITE_POST_BODIES.
//   3. Añade su <script src="js/data/posts/<id>.js" defer> en index.html,
//      antes de main.js.
//
// Campos:
//   id        identificador único del post (slug), enlaza con
//             window.SITE_POST_BODIES[id] en js/data/posts/<id>.js
//   number    número de post mostrado en la UI ("01", "02"...)
//   date      fecha en formato "AAAA.MM.DD"
//   readMin   minutos de lectura (número)
//   tags      ids de js/data/tags.js
//   terms     texto de sinónimos (ambos idiomas) usado por el buscador
//   title     { es, en }
//   excerpt   { es, en } — párrafo corto usado en la card de la home, antes de la imagen
//   cardImage { src, alt: { es, en } } — imagen editorial local, entre extracto y tags
//   kicker    { es, en } — categoría mostrada encima del título del artículo
//   toc       [{ id, es, en }] — índice lateral del artículo
window.SITE_POSTS_META = [
  {
    id: "automatizaciones-ia-que-saben-cuando-callarse",
    number: "03",
    date: "2026.08.06",
    readMin: 8,
    tags: ["automatizacion", "agentes", "hermes"],
    terms: "automatizaciones automatización automation ia ai agentes agents hermes tars cron scripts alertas alerts notificaciones notifications silencio silence no_agent",
    title: {
      es: "Automatizaciones de IA que saben cuándo callarse",
      en: "AI automations that know when to stay quiet"
    },
    excerpt: {
      es: "Una automatización útil no necesita anunciar cada éxito. Así diseño tareas que guardan silencio cuando todo funciona, avisan cuando algo cambia y nunca confunden un error con la ausencia de novedades.",
      en: "A useful automation does not need to announce every success. Here is how I design tasks that stay quiet when everything works, notify when something changes and never mistake an error for no news."
    },
    cardImage: {
      src: "assets/posts/automatizaciones-ia-que-saben-cuando-callarse.svg",
      alt: {
        es: "Ilustración editorial de una automatización que decide entre callar, avisar y fallar.",
        en: "Editorial illustration of an automation deciding whether to stay quiet, notify or fail."
      }
    },
    kicker: {
      es: "Post 03 · Automatización",
      en: "Post 03 · Automation"
    },
    toc: [
      { id: "s1", es: "Automatizar sin otra obligación", en: "Automation without another obligation" },
      { id: "s2", es: "El contrato de tres salidas", en: "The three-outcome contract" },
      { id: "s3", es: "Lógica primero; IA cuando haga falta", en: "Logic first; AI when needed" },
      { id: "s4", es: "Cuatro formas de callarse", en: "Four ways to stay quiet" },
      { id: "s5", es: "Idempotencia y umbral", en: "Idempotency and thresholds" },
      { id: "s6", es: "Observabilidad", en: "Observability" },
      { id: "s7", es: "Diseñar la atención", en: "Designing attention" }
    ]
  },
  {
    id: "segundo-cerebro-obsidian-hermes",
    number: "02",
    date: "2026.08.01",
    readMin: 8,
    tags: ["hermes", "obsidian"],
    terms:
      "segundo cerebro second brain obsidian hermes tars conocimiento knowledge llm wiki karpathy notas notes markdown memoria memory rag fuentes sources esquema schema casos de uso use cases",
    title: {
      es: "Cómo monté un segundo cerebro con Obsidian y Hermes",
      en: "How I built a second brain with Obsidian and Hermes"
    },
    excerpt: {
      es: "Por qué una colección de notas no basta y cómo un agente puede convertirla en conocimiento vivo, trazable y útil.",
      en: "Why a collection of notes is not enough, and how an agent can turn it into living, traceable and useful knowledge."
    },
    kicker: {
      es: "Post 02 · Segundo cerebro",
      en: "Post 02 · Second brain"
    },
    toc: [
      { id: "s1", es: "El problema", en: "The problem" },
      { id: "s2", es: "El método LLM Wiki", en: "The LLM Wiki method" },
      { id: "s3", es: "Obsidian y Hermes", en: "Obsidian and Hermes" },
      { id: "s4", es: "Flujo de conocimiento", en: "Knowledge flow" },
      { id: "s5", es: "Utilidad y casos de uso", en: "Value and use cases" },
      { id: "s6", es: "Confianza y control", en: "Trust and control" },
      { id: "s7", es: "Cómo empezar", en: "How to start" }
    ]
  },
  {
    id: "hermes-agent",
    number: "01",
    date: "2026.08.01",
    readMin: 8,
    tags: ["hermes", "agentes"],
    terms:
      "hermes agente agent inteligencia artificial ia ai tars automatización automation memoria memory casos de uso use cases asistente personal personal assistant",
    title: {
      es: "De chatbot a compañero: por qué monté mi propio agente de IA con Hermes",
      en: "From chatbot to companion: why I built my own AI agent with Hermes"
    },
    excerpt: {
      es: "Qué ocurre cuando la IA deja de vivir en una pestaña y empieza a recordar, usar herramientas y ayudarte en el día a día.",
      en: "What happens when AI stops living in a browser tab and starts remembering, using tools and helping in everyday life."
    },
    kicker: {
      es: "Post 01 · Agentes de IA",
      en: "Post 01 · AI agents"
    },
    toc: [
      { id: "s1", es: "Por qué crear un agente", en: "Why build an agent" },
      { id: "s2", es: "Qué es realmente", en: "What it really is" },
      { id: "s3", es: "Por qué Hermes", en: "Why Hermes" },
      { id: "s4", es: "Los desafíos", en: "The challenges" },
      { id: "s5", es: "Casos de uso", en: "Use cases" },
      { id: "s6", es: "Lo que he aprendido", en: "What I learned" }
    ]
  }
];
