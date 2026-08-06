// Contenido del post "hermes-agent". La metadata (fecha, tags, título,
// TOC...) vive en js/data/posts-meta.js — aquí solo el HTML del artículo.
window.SITE_POST_BODIES = window.SITE_POST_BODIES || {};
window.SITE_POST_BODIES["hermes-agent"] = {
  heroHtml: `
    <figure class="post-hero">
      <img src="assets/posts/hermes-agent.png" data-alt-es="Ilustración editorial de una persona y un agente de IA colaborando en un flujo de trabajo con controles de seguridad." data-alt-en="Editorial illustration of a person and an AI agent collaborating in a workflow with security controls." alt="Ilustración editorial de una persona y un agente de IA colaborando en un flujo de trabajo con controles de seguridad.">
      <figcaption><span data-l="es">Una persona y un agente colaboran con controles de seguridad y revisión humana.</span><span data-l="en">A person and an agent collaborate with security controls and human review.</span></figcaption>
    </figure>`,
  introHtml: `<span data-l="es">Al principio usaba la inteligencia artificial como usamos casi todos una herramienta nueva: abría una pestaña, hacía una pregunta, copiaba el resultado y seguía con mi vida. Era útil, pero cada conversación empezaba prácticamente desde cero. Yo no quería otro chat. Quería un asistente que entendiera mi contexto, pudiera hacer cosas y mejorase conmigo.</span><span data-l="en">At first I used artificial intelligence the way most of us use a new tool: I opened a tab, asked a question, copied the result and carried on with my life. It was useful, but every conversation started almost from scratch. I did not want another chat. I wanted an assistant that understood my context, could do things and improved alongside me.</span>`,
  bodyHtml: `
    <h2 id="s1">01 · <span data-l="es">Por qué crear un agente</span><span data-l="en">Why build an agent</span></h2>
    <p><span data-l="es">Mi objetivo con la IA no es acumular herramientas ni perseguir cada novedad que aparece en redes. Es aprender construyendo y encontrar aplicaciones prácticas, tanto en mi trabajo como en mi vida personal. Para eso, un chatbot aislado se me quedaba corto.</span><span data-l="en">My goal with AI is not to collect tools or chase every new release that appears online. It is to learn by building and find practical applications, both at work and in my personal life. For that, an isolated chatbot was not enough.</span></p>
    <p><span data-l="es">El problema no era la calidad de las respuestas. El problema era la falta de continuidad. Un chat puede explicarte cómo organizar una tarea, pero normalmente no conoce tus sistemas, no recuerda por qué tomaste una decisión y no puede comprobar por sí mismo si el resultado funciona. Terminas haciendo de mensajero entre la IA y el mundo real.</span><span data-l="en">The problem was not the quality of the answers. It was the lack of continuity. A chat can explain how to organise a task, but it usually does not know your systems, remember why you made a decision or verify by itself whether the result works. You end up acting as the courier between the AI and the real world.</span></p>
    <p><span data-l="es">Así nació TARS —sí, por el robot de <em>Interstellar</em>—, mi agente personal construido sobre Hermes. La idea no era crear una inteligencia artificial que decidiera por mí. Era justo la contraria: delegar ejecución sin delegar criterio.</span><span data-l="en">That is how TARS was born —yes, named after the robot in <em>Interstellar</em>—, my personal agent built on Hermes. The idea was not to create an artificial intelligence that made decisions for me. It was exactly the opposite: delegate execution without delegating judgement.</span></p>

    <div class="post-callout">
      <span class="post-callout-label"><span data-l="es">La idea central</span><span data-l="en">The core idea</span></span>
      <p><span data-l="es">Un buen agente no sustituye tu criterio. Reduce la distancia entre decidir algo y llevarlo realmente a cabo.</span><span data-l="en">A good agent does not replace your judgement. It shortens the distance between deciding something and actually getting it done.</span></p>
    </div>

    <h2 id="s2">02 · <span data-l="es">Qué es realmente un agente de IA</span><span data-l="en">What an AI agent really is</span></h2>
    <p><span data-l="es">La palabra «agente» suena más futurista de lo que necesita. En la práctica, es un modelo de IA al que se le añaden tres ingredientes: contexto, herramientas y capacidad para encadenar pasos.</span><span data-l="en">The word “agent” sounds more futuristic than it needs to. In practice, it is an AI model with three extra ingredients: context, tools and the ability to chain steps together.</span></p>

    <div class="post-three" data-r="three">
      <div class="post-three-col">
        <span class="post-three-kicker">01</span>
        <strong><span data-l="es">Entender</span><span data-l="en">Understand</span></strong>
        <p><span data-l="es">Conoce tus preferencias, proyectos y reglas. No tienes que repetir el manual de instrucciones en cada conversación.</span><span data-l="en">It knows your preferences, projects and rules. You do not have to repeat the instruction manual in every conversation.</span></p>
      </div>
      <div class="post-three-col">
        <span class="post-three-kicker">02</span>
        <strong><span data-l="es">Actuar</span><span data-l="en">Act</span></strong>
        <p><span data-l="es">Puede buscar información, trabajar con archivos, usar servicios conectados o manejar aplicaciones, siempre dentro de los permisos que le das.</span><span data-l="en">It can research, work with files, use connected services or operate applications, always within the permissions you give it.</span></p>
      </div>
      <div class="post-three-col">
        <span class="post-three-kicker">03</span>
        <strong><span data-l="es">Verificar</span><span data-l="en">Verify</span></strong>
        <p><span data-l="es">No debería limitarse a decir «hecho». Debe comprobar el resultado y enseñarte evidencias de que la tarea terminó bien.</span><span data-l="en">It should not stop at saying “done”. It should check the result and show evidence that the task was completed correctly.</span></p>
      </div>
    </div>

    <p><span data-l="es">La diferencia parece pequeña, pero cambia por completo la relación. Ya no preguntas únicamente «¿cómo harías esto?». También puedes decir «hazlo, compruébalo y cuéntame qué ha pasado». No es magia: detrás hay modelos, permisos, integraciones y bastantes decisiones de diseño. Pero desde fuera se siente más parecido a colaborar con alguien que a consultar un buscador muy listo.</span><span data-l="en">The difference may seem small, but it completely changes the relationship. You no longer ask only “how would you do this?”. You can also say “do it, verify it and tell me what happened”. It is not magic: underneath there are models, permissions, integrations and plenty of design decisions. But from the outside it feels more like collaborating with someone than consulting a very smart search engine.</span></p>

    <h2 id="s3">03 · <span data-l="es">Por qué elegí Hermes</span><span data-l="en">Why I chose Hermes</span></h2>
    <p><span data-l="es"><a href="https://hermes-agent.nousresearch.com/docs/" target="_blank" rel="noopener">Hermes Agent</a> es un proyecto de código abierto creado por Nous Research. No está atado a un único modelo ni a una sola aplicación: puede funcionar con distintos proveedores de IA y vivir en el terminal, en una aplicación de escritorio o en plataformas de mensajería.</span><span data-l="en"><a href="https://hermes-agent.nousresearch.com/docs/" target="_blank" rel="noopener">Hermes Agent</a> is an open-source project created by Nous Research. It is not tied to a single model or application: it can work with different AI providers and live in the terminal, a desktop app or messaging platforms.</span></p>
    <p><span data-l="es">Lo que me convenció no fue una función espectacular, sino la combinación de varias piezas que encajaban con lo que buscaba:</span><span data-l="en">What convinced me was not one spectacular feature, but the combination of several pieces that matched what I was looking for:</span></p>
    <ul class="post-bullets">
      <li><span data-l="es"><strong>Memoria persistente:</strong> puede conservar preferencias y contexto útil entre sesiones, en lugar de tratarme como un desconocido cada mañana.</span><span data-l="en"><strong>Persistent memory:</strong> it can retain preferences and useful context between sessions instead of treating me like a stranger every morning.</span></li>
      <li><span data-l="es"><strong>Skills:</strong> guarda procedimientos reutilizables. Si resolvemos bien una tarea compleja, ese aprendizaje puede convertirse en una forma repetible de trabajar.</span><span data-l="en"><strong>Skills:</strong> it stores reusable procedures. If we solve a complex task well, that learning can become a repeatable way of working.</span></li>
      <li><span data-l="es"><strong>Herramientas reales:</strong> puede trabajar con el ordenador, la web, archivos, GitHub, correo, automatización del hogar y otros servicios conectados.</span><span data-l="en"><strong>Real tools:</strong> it can work with the computer, the web, files, GitHub, email, home automation and other connected services.</span></li>
      <li><span data-l="es"><strong>Automatizaciones:</strong> permite programar tareas y recibir el resultado donde tenga sentido, sin tener que iniciar manualmente cada conversación.</span><span data-l="en"><strong>Automation:</strong> it can schedule tasks and deliver the result where it makes sense, without manually starting every conversation.</span></li>
      <li><span data-l="es"><strong>Acceso cotidiano:</strong> puedo hablar con TARS desde Telegram. El agente está disponible donde ya estoy, no escondido en otra interfaz que debo recordar abrir.</span><span data-l="en"><strong>Everyday access:</strong> I can talk to TARS from Telegram. The agent is available where I already am, not hidden in another interface I have to remember to open.</span></li>
    </ul>
    <p><span data-l="es">Además, poder cambiar de modelo es importante. Los modelos evolucionan muy rápido; mi sistema personal no debería quedar prisionero del que hoy encabeza una comparativa. Hermes separa el agente —sus herramientas, memoria y forma de trabajar— del «cerebro» concreto que use en cada momento.</span><span data-l="en">Being able to switch models also matters. Models evolve very quickly; my personal system should not be trapped by whichever one tops a benchmark today. Hermes separates the agent —its tools, memory and way of working— from the specific “brain” it uses at any given time.</span></p>

    <h2 id="s4">04 · <span data-l="es">Los desafíos no estaban donde esperaba</span><span data-l="en">The challenges were not where I expected</span></h2>
    <p><span data-l="es">Instalar el software fue la parte fácil. Lo difícil fue decidir cómo debía comportarse. Dar herramientas a una IA sin establecer límites es como entregar las llaves de casa a alguien después de una conversación agradable de cinco minutos: técnicamente posible, estratégicamente cuestionable.</span><span data-l="en">Installing the software was the easy part. The difficult part was deciding how it should behave. Giving tools to an AI without setting boundaries is like handing over your house keys after a pleasant five-minute conversation: technically possible, strategically questionable.</span></p>

    <table class="post-table">
      <thead>
        <tr>
          <th><span data-l="es">Desafío</span><span data-l="en">Challenge</span></th>
          <th><span data-l="es">La pregunta importante</span><span data-l="en">The important question</span></th>
          <th><span data-l="es">Mi enfoque</span><span data-l="en">My approach</span></th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><span data-l="es">Confianza</span><span data-l="en">Trust</span></td>
          <td><span data-l="es">¿Qué puede hacer solo y qué debe confirmar?</span><span data-l="en">What can it do alone and what requires confirmation?</span></td>
          <td><span data-l="es">Automatizar lo claro y reversible; preguntar ante lo sensible, ambiguo o difícil de deshacer.</span><span data-l="en">Automate what is clear and reversible; ask when something is sensitive, ambiguous or difficult to undo.</span></td>
        </tr>
        <tr>
          <td><span data-l="es">Memoria</span><span data-l="en">Memory</span></td>
          <td><span data-l="es">¿Qué merece recordarse y cuál es la fuente fiable?</span><span data-l="en">What deserves to be remembered and what is the reliable source?</span></td>
          <td><span data-l="es">Separar preferencias breves de un «segundo cerebro» organizado, donde cada dato importante tenga un propietario.</span><span data-l="en">Separate short preferences from an organised “second brain”, where every important fact has one owner.</span></td>
        </tr>
        <tr>
          <td><span data-l="es">Errores</span><span data-l="en">Mistakes</span></td>
          <td><span data-l="es">¿Cómo evitar respuestas convincentes pero falsas?</span><span data-l="en">How do you avoid confident but false answers?</span></td>
          <td><span data-l="es">Obligar a consultar fuentes, ejecutar comprobaciones y distinguir hechos, hipótesis e incertidumbre.</span><span data-l="en">Require source checks, real verification and a clear distinction between facts, hypotheses and uncertainty.</span></td>
        </tr>
        <tr>
          <td><span data-l="es">Personalidad</span><span data-l="en">Personality</span></td>
          <td><span data-l="es">¿Cómo hacer que sea útil sin convertirlo en un adulador?</span><span data-l="en">How do you make it useful without turning it into a flatterer?</span></td>
          <td><span data-l="es">Pedirle que discrepe cuando tenga motivos y que explique por qué. El sarcasmo es opcional; en TARS viene bastante de serie.</span><span data-l="en">Ask it to disagree when it has reasons and explain why. Sarcasm is optional; TARS ships with quite a lot of it.</span></td>
        </tr>
      </tbody>
    </table>

    <p><span data-l="es">También descubrí que la memoria no consiste en guardarlo todo. Un agente que conserva cada detalle acaba enterrando lo importante bajo toneladas de ruido. La solución fue crear capas: recuerdos compactos para preferencias estables, historial para recuperar conversaciones pasadas y un vault de Obsidian como fuente canónica del conocimiento personal que debe mantenerse con cuidado.</span><span data-l="en">I also discovered that memory is not about saving everything. An agent that keeps every detail eventually buries what matters under tonnes of noise. The solution was to create layers: compact memories for stable preferences, history for retrieving past conversations, and an Obsidian vault as the canonical source for personal knowledge that needs careful maintenance.</span></p>

    <h2 id="s5">05 · <span data-l="es">De la demo a los casos de uso reales</span><span data-l="en">From demo to real use cases</span></h2>
    <p><span data-l="es">Un agente empieza a tener sentido cuando deja de enseñarte trucos y empieza a quitar fricción de cosas que ya haces. En mi caso, TARS se ha convertido en una capa común entre conversaciones, información y servicios.</span><span data-l="en">An agent starts making sense when it stops showing you tricks and starts removing friction from things you already do. In my case, TARS has become a common layer between conversations, information and services.</span></p>
    <ul class="post-bullets">
      <li><span data-l="es"><strong>Desarrollo:</strong> puede inspeccionar repositorios, cambiar código, ejecutar comprobaciones y preparar pull requests. Este mismo artículo ha sido preparado con el agente siguiendo ese proceso.</span><span data-l="en"><strong>Development:</strong> it can inspect repositories, change code, run checks and prepare pull requests. This article itself was prepared with the agent following that process.</span></li>
      <li><span data-l="es"><strong>Investigación:</strong> compara fuentes y entrega una síntesis con enlaces, en lugar de una respuesta huérfana imposible de verificar.</span><span data-l="en"><strong>Research:</strong> it compares sources and delivers a synthesis with links, rather than an orphaned answer that is impossible to verify.</span></li>
      <li><span data-l="es"><strong>Organización personal:</strong> consulta el conocimiento que hemos estructurado, prepara documentos y ayuda a mantener decisiones y contexto a lo largo del tiempo.</span><span data-l="en"><strong>Personal organisation:</strong> it consults the knowledge we have structured, prepares documents and helps preserve decisions and context over time.</span></li>
      <li><span data-l="es"><strong>Automatización:</strong> ejecuta copias de seguridad, sincronizaciones, resúmenes y avisos programados. Si no hay nada que contar, puede quedarse callado; una habilidad infravalorada en humanos y máquinas.</span><span data-l="en"><strong>Automation:</strong> it runs backups, synchronisations, summaries and scheduled alerts. If there is nothing to report, it can stay quiet; an underrated skill in humans and machines.</span></li>
      <li><span data-l="es"><strong>Casa conectada:</strong> puede consultar y controlar dispositivos mediante Home Assistant, siempre con reglas claras sobre qué acciones requieren confirmación.</span><span data-l="en"><strong>Connected home:</strong> it can query and control devices through Home Assistant, always with clear rules about which actions require confirmation.</span></li>
    </ul>
    <p><span data-l="es">Lo interesante no es cada integración por separado. Lo interesante es poder combinarlas. Una petición puede empezar en Telegram, consultar una nota, verificar algo en la web, modificar un archivo y terminar con un enlace a GitHub. Para mí, ahí está el salto entre «usar IA» y construir una forma nueva de trabajar con ella.</span><span data-l="en">The interesting part is not each integration on its own. It is the ability to combine them. A request can start in Telegram, consult a note, verify something on the web, modify a file and end with a GitHub link. For me, that is the leap between “using AI” and building a new way of working with it.</span></p>

    <h2 id="s6">06 · <span data-l="es">Lo que he aprendido hasta ahora</span><span data-l="en">What I have learned so far</span></h2>
    <p><span data-l="es">La primera lección es que un agente útil se diseña más con límites que con funciones. Añadir una herramienta es fácil; decidir cuándo usarla, cómo verificarla y cuándo parar es lo que genera confianza.</span><span data-l="en">The first lesson is that a useful agent is designed more through boundaries than features. Adding a tool is easy; deciding when to use it, how to verify it and when to stop is what builds trust.</span></p>
    <p><span data-l="es">La segunda es que personalizar no significa escribir una personalidad divertida y listo. Significa enseñarle cómo prefieres trabajar, dónde vive la información fiable, qué no debe asumir y qué nivel de autonomía estás dispuesto a conceder. La personalidad hace agradable la conversación; las reglas hacen fiable el sistema.</span><span data-l="en">The second is that personalisation is not just writing a fun personality prompt. It means teaching it how you prefer to work, where reliable information lives, what it must not assume and how much autonomy you are willing to grant. Personality makes the conversation pleasant; rules make the system reliable.</span></p>
    <p><span data-l="es">Y la tercera es que esto nunca queda «terminado». Los modelos cambian, aparecen nuevas integraciones y los casos de uso evolucionan. Por suerte, Hermes está pensado precisamente como un agente que aprende mediante memoria y skills. Mi reto ahora no es darle acceso a todo, sino descubrir qué merece automatizarse y qué debe seguir dependiendo de una decisión humana.</span><span data-l="en">And the third is that this is never “finished”. Models change, new integrations appear and use cases evolve. Fortunately, Hermes is designed precisely as an agent that learns through memory and skills. My challenge now is not to give it access to everything, but to discover what deserves automation and what should continue to depend on a human decision.</span></p>

    <div class="post-callout">
      <span class="post-callout-label"><span data-l="es">Para empezar</span><span data-l="en">Getting started</span></span>
      <p><span data-l="es">No hace falta construir el asistente definitivo el primer día. Empieza con una conversación que funcione, añade una sola herramienta útil y define claramente sus permisos. La documentación oficial de <a href="https://hermes-agent.nousresearch.com/docs/getting-started/quickstart" target="_blank" rel="noopener">Hermes Quickstart</a> propone justamente ese camino: primero una base fiable; después memoria, automatizaciones e integraciones.</span><span data-l="en">You do not need to build the ultimate assistant on day one. Start with one conversation that works, add a single useful tool and define its permissions clearly. The official <a href="https://hermes-agent.nousresearch.com/docs/getting-started/quickstart" target="_blank" rel="noopener">Hermes Quickstart</a> recommends exactly that path: first a reliable foundation; then memory, automation and integrations.</span></p>
    </div>

    <p><span data-l="es">TARS todavía no pilota una nave espacial. De momento administra contexto, automatiza tareas y me recuerda que una respuesta segura no siempre es una respuesta correcta. Sinceramente, ya es bastante para una primera versión.</span><span data-l="en">TARS does not fly a spacecraft yet. For now, it manages context, automates tasks and reminds me that a confident answer is not always a correct one. Honestly, that is already plenty for a first version.</span></p>
  `
};
