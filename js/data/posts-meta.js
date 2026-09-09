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
    id: "city-generator-unity-ia-spec-driven-development",
    number: "06",
    date: "2026.09.10",
    readMin: 10,
    tags: ["agentes", "gamedev", "spec-driven-development", "herramientas"],
    terms: "city generator unity ia ai spec driven development especificación specification desarrollo development procedural procedimental ciudad city gamedev herramientas tools ecs dots runtime editor prefabs tráfico traffic peatones pedestrians",
    title: {
      es: "De una ciudad procedural a una herramienta portable: cómo uso IA y specs en City Generator",
      en: "From a procedural city to a portable tool: how I use AI and specs in City Generator"
    },
    excerpt: {
      es: "City Generator convierte una escena de Unity en una ciudad recorrible y configurable. Este es el proceso con el que uso IA y specs para evitar que una idea procedural termine siendo una demo frágil y convertirla en una herramienta portable y verificable.",
      en: "City Generator turns a Unity scene into a walkable, configurable city. This is the process I use with AI and specs to keep a procedural idea from ending as a fragile demo, and turn it into a portable, verifiable tool."
    },
    cardImage: {
      src: "assets/posts/city-generator-unity-ia-spec-driven-development.png",
      alt: {
        es: "Ilustración editorial de una ciudad procedural generada a partir de una especificación y una configuración.",
        en: "Editorial illustration of a procedural city generated from a specification and configuration."
      }
    },
    kicker: {
      es: "Post 06 · Gamedev con IA",
      en: "Post 06 · AI-assisted gamedev"
    },
    toc: [
      { id: "s1", es: "El problema real no era crear edificios", en: "The real problem was not creating buildings" },
      { id: "s2", es: "Una spec antes que un prompt", en: "A spec before a prompt" },
      { id: "s3", es: "De una configuración a una escena recorrible", en: "From configuration to a walkable scene" },
      { id: "s4", es: "Portabilidad no es una nota al pie", en: "Portability is not a footnote" },
      { id: "s5", es: "Qué aporta la IA —y qué no le delego", en: "What AI contributes—and what I do not delegate to it" },
      { id: "s6", es: "Verificar es parte de construir", en: "Verification is part of building" },
      { id: "s7", es: "De la herramienta a las demos jugables", en: "From the tool to playable demos" },
      { id: "s8", es: "La pregunta que me queda", en: "The question I am left with" }
    ]
  },
  {
    id: "spec-driven-development",
    number: "05",
    date: "2026.08.25",
    readMin: 9,
    tags: ["agentes"],
    terms: "spec driven development spec-driven design especificación specification ia ai desarrollo software development programación coding claude code codex unity web arquitectura architecture decisiones decisions",
    title: {
      es: "Spec Driven Development con IA: cómo dejar de improvisar antes de programar",
      en: "Spec Driven Development with AI: how to stop improvising before you code"
    },
    excerpt: {
      es: "Antes de pedir código a una IA, defino el contrato: objetivos, límites, decisiones y pruebas. Así uso /spec y /spec-impl para reducir improvisación y convertir el código generado en una implementación verificable.",
      en: "Before asking AI for code, I define the contract: goals, boundaries, decisions and tests. This is how I use /spec and /spec-impl to reduce improvisation and turn generated code into a verifiable implementation."
    },
    cardImage: {
      src: "assets/posts/spec-driven-development.png",
      alt: {
        es: "Ilustración editorial de una persona definiendo una especificación con una IA antes de programar.",
        en: "Editorial illustration of a person defining a specification with AI before coding."
      }
    },
    kicker: {
      es: "Post 05 · Desarrollo con IA",
      en: "Post 05 · AI-assisted development"
    },
    toc: [
      { id: "s1", es: "La velocidad también oculta decisiones", en: "Speed also hides decisions" },
      { id: "s2", es: "La spec es el artefacto principal", en: "The spec is the main artefact" },
      { id: "s3", es: "Primero una entrevista, después una orden", en: "First an interview, then an instruction" },
      { id: "s4", es: "La aprobación humana es deliberada", en: "Human approval is deliberate" },
      { id: "s5", es: "Qué hace cada una de las dos skills", en: "What each of the two skills does" },
      { id: "s6", es: "El patrón no depende de la tecnología", en: "The pattern does not depend on technology" },
      { id: "s7", es: "También hay casos en los que no la usaría", en: "There are also cases where I would not use it" },
      { id: "s8", es: "Delega la ejecución, no el criterio", en: "Delegate execution, not judgement" }
    ]
  },
  {
    id: "pdf-mensual-aviso-diario-automatizacion-familiar",
    number: "04",
    date: "2026.08.10",
    readMin: 9,
    tags: ["automatizacion", "hermes"],
    terms: "pdf mensual aviso diario automatización automation ia ai hermes tabla table extracción extraction validación validation datos data script silencio silence documento document",
    title: {
      es: "De un PDF mensual a un aviso diario: automatizar una tarea familiar sin crear otra app",
      en: "From a monthly PDF to a daily notification: automating a family task without another app"
    },
    excerpt: {
      es: "Cada mes recibo un PDF con una tabla y cada día necesito una sola respuesta. Así lo convertí en avisos útiles mediante IA, validación visual y un pequeño script, sin construir otra app doméstica que mantener.",
      en: "Every month I receive a PDF with a table, and every day I need one answer. Here is how I turned it into useful notifications with AI, visual validation and a small script, without building another household app to maintain."
    },
    cardImage: {
      src: "assets/posts/pdf-mensual-aviso-diario-automatizacion-familiar.png",
      alt: {
        es: "Ilustración editorial de un PDF mensual convertido en datos por fecha y un aviso diario.",
        en: "Editorial illustration of a monthly PDF converted into date-based data and a daily notification."
      }
    },
    kicker: {
      es: "Post 04 · Automatización",
      en: "Post 04 · Automation"
    },
    toc: [
      { id: "s1", es: "La pregunta diaria, no otra app", en: "The daily question, not another app" },
      { id: "s2", es: "Un PDF no es una base de datos", en: "A PDF is not a database" },
      { id: "s3", es: "Procesar una vez, consultar muchas", en: "Process once, consult many times" },
      { id: "s4", es: "La revisión visual es obligatoria", en: "Visual review is mandatory" },
      { id: "s5", es: "Los huecos también informan", en: "Gaps carry information too" },
      { id: "s6", es: "Fuente, versiones e idempotencia", en: "Source, versions and idempotency" },
      { id: "s7", es: "El contrato de silencio", en: "The silence contract" },
      { id: "s8", es: "Mantenimiento y límites", en: "Maintenance and limits" },
      { id: "s9", es: "Automatizar una fricción", en: "Automate a friction" }
    ]
  },
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
      src: "assets/posts/automatizaciones-ia-que-saben-cuando-callarse.png",
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
    cardImage: {
      src: "assets/posts/segundo-cerebro-obsidian-hermes.png",
      alt: {
        es: "Ilustración editorial de un agente de IA organizando fuentes y conocimiento con revisión humana.",
        en: "Editorial illustration of an AI agent organising sources and knowledge with human review."
      }
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
    cardImage: {
      src: "assets/posts/hermes-agent.png",
      alt: {
        es: "Ilustración editorial de una persona y un agente de IA colaborando en un flujo de trabajo con controles de seguridad.",
        en: "Editorial illustration of a person and an AI agent collaborating in a workflow with security controls."
      }
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
