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
//   excerpt   { es, en } — párrafo corto usado en la card de la home
//   kicker    { es, en } — categoría mostrada encima del título del artículo
//   toc       [{ id, es, en }] — índice lateral del artículo
window.SITE_POSTS_META = [
  {
    id: "pdf-mensual-aviso-diario-automatizacion-familiar",
    number: "04",
    date: "2026.08.13",
    readMin: 9,
    tags: ["automatizacion", "hermes"],
    terms:
      "pdf mensual monthly aviso diario daily notification automatización automation familia family guardería nursery menú menu tabla table extracción extraction ocr revisión visual visual review datos estructurados structured data idempotencia hermes cron scripts",
    title: {
      es: "De un PDF mensual a un aviso diario: automatizar una tarea familiar sin crear otra app",
      en: "From a monthly PDF to a daily notification: automating a family task without building another app"
    },
    excerpt: {
      es: "Cada mes recibo un PDF con una tabla y cada día necesito una sola respuesta. Así lo convertí en avisos útiles mediante IA, validación visual y un pequeño script, sin construir otra app doméstica que mantener.",
      en: "Every month I receive a PDF containing a table, and every day I need one answer. Here is how I turned it into useful notifications with AI, visual validation and a small script, without building another household app to maintain."
    },
    kicker: {
      es: "Post 04 · Automatización familiar",
      en: "Post 04 · Family automation"
    },
    toc: [
      { id: "s1", es: "La pregunta, no la app", en: "The question, not the app" },
      { id: "s2", es: "Un PDF no es una base de datos", en: "A PDF is not a database" },
      { id: "s3", es: "Procesar una vez", en: "Process once" },
      { id: "s4", es: "Revisión visual", en: "Visual review" },
      { id: "s5", es: "Los huecos importan", en: "Gaps matter" },
      { id: "s6", es: "Fuente y correcciones", en: "Source and corrections" },
      { id: "s7", es: "El aviso diario", en: "The daily notification" },
      { id: "s8", es: "El mantenimiento real", en: "The real maintenance" },
      { id: "s9", es: "Un patrón reutilizable", en: "A reusable pattern" },
      { id: "s10", es: "Automatizar la fricción", en: "Automate the friction" }
    ]
  },
  {
    id: "automatizaciones-ia-que-saben-cuando-callarse",
    number: "03",
    date: "2026.08.06",
    readMin: 8,
    tags: ["automatizacion", "agentes", "hermes"],
    terms:
      "automatizaciones automation inteligencia artificial ia ai agentes agents hermes tars cron scripts watchdog silencio silent notificaciones notifications alertas alerts observabilidad observability idempotencia no-agent no_agent productividad attention atención",
    title: {
      es: "Automatizaciones de IA que saben cuándo callarse",
      en: "AI automations that know when to stay quiet"
    },
    excerpt: {
      es: "Una automatización útil no necesita anunciar cada éxito. Así diseño tareas que guardan silencio cuando todo funciona, avisan cuando algo cambia y nunca confunden un error con la ausencia de novedades.",
      en: "A useful automation does not need to announce every success. Here is how I design tasks that stay quiet when everything works, speak up when something changes and never mistake an error for no news."
    },
    kicker: {
      es: "Post 03 · Automatización",
      en: "Post 03 · Automation"
    },
    toc: [
      { id: "s1", es: "Otra obligación", en: "Another obligation" },
      { id: "s2", es: "Tres salidas", en: "Three outcomes" },
      { id: "s3", es: "IA cuando aporta", en: "AI when it adds value" },
      { id: "s4", es: "Cuatro casos reales", en: "Four real examples" },
      { id: "s5", es: "Cuándo hablar", en: "When to speak up" },
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
