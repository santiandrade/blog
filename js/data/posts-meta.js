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
