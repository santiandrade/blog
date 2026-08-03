// Contenido del post "pdf-mensual-aviso-diario-automatizacion-familiar". La metadata
// (fecha, tags, título, TOC...) vive en js/data/posts-meta.js.
window.SITE_POST_BODIES = window.SITE_POST_BODIES || {};
window.SITE_POST_BODIES["pdf-mensual-aviso-diario-automatizacion-familiar"] = {
  introHtml: `<span data-l="es">Cada mes llega un PDF. Dentro hay una tabla. Y dentro de esa tabla está la respuesta a una pregunta que volverá todos los días: «¿Qué come hoy mi hijo en la guardería?».</span><span data-l="en">Every month, a PDF arrives. Inside it is a table. And inside that table is the answer to a question that will come back every day: “What is my son having for lunch at nursery today?”</span>`,
  bodyHtml: `
    <p><span data-l="es">Abrir el archivo, ampliar la imagen y buscar la fecha funciona, por supuesto. También funciona dejarlo descargado en el móvil, mandarlo al grupo familiar o confiar en que uno de los dos se acuerde. El problema no es que sea difícil. Es que es una fricción minúscula que se repite suficientes veces como para resultar molesta.</span><span data-l="en">Opening the file, zooming in and finding the date works, of course. So does keeping it on a phone, sending it to the family chat or trusting that one of us will remember. The problem is not that it is difficult. It is a tiny inconvenience repeated often enough to become annoying.</span></p>
    <p><span data-l="es">La tentación técnica fue la habitual: crear algo. Una pequeña web, quizá una app, una interfaz donde subir el PDF y consultar el menú. Un proyecto doméstico con nombre, icono, despliegue, autenticación y, en unos meses, una dependencia rota que nadie había invitado a la familia.</span><span data-l="en">The technical temptation was the usual one: build something. A small website, perhaps an app, an interface where I could upload the PDF and browse the menu. A household project with a name, an icon, deployment, authentication and, a few months later, a broken dependency nobody had invited into the family.</span></p>
    <p><span data-l="es">Hice lo contrario. No construí una nueva aplicación. Convertí el documento una vez al mes en datos sencillos y dejé que una tarea programada respondiera cada mañana únicamente cuando había algo que contar.</span><span data-l="en">I did the opposite. I did not build a new application. I converted the document into simple data once a month and let a scheduled task answer each morning only when there was something worth saying.</span></p>
    <div class="post-callout">
      <span class="post-callout-label"><span data-l="es">El flujo</span><span data-l="en">The workflow</span></span>
      <p><span data-l="es"><strong>PDF mensual → extracción de texto → revisión visual → datos por fecha → aviso diario.</strong></span><span data-l="en"><strong>Monthly PDF → text extraction → visual review → date-indexed data → daily notification.</strong></span></p>
    </div>
    <p><span data-l="es">La parte interesante no es que una IA pueda leer un PDF. Es aprender a usarla como traductora entre un documento pensado para personas y una automatización que necesita datos fiables, sin delegarle el criterio sobre aquello que no está claro.</span><span data-l="en">The interesting part is not that AI can read a PDF. It is learning to use AI as a translator between a document designed for people and an automation that needs reliable data, without delegating judgement over anything unclear.</span></p>

    <h2 id="s1">01 · <span data-l="es">El problema era una pregunta diaria, no la falta de una app</span><span data-l="en">The problem was a daily question, not the lack of an app</span></h2>
    <p><span data-l="es">Antes de automatizar algo conviene definir bien qué se quiere eliminar. Yo no necesitaba navegar por menús históricos, editar platos ni compartir calendarios con otros usuarios. Tampoco necesitaba una pantalla más. Necesitaba que, un día lectivo, apareciera un mensaje con la comida correspondiente. Nada más.</span><span data-l="en">Before automating anything, it helps to define exactly what you want to remove. I did not need to browse historical menus, edit dishes or share calendars with other users. Nor did I need another screen. On a nursery day, I needed a message with that day's meal. Nothing more.</span></p>
    <p><span data-l="es">Esa diferencia recorta muchísimo la solución. Si el resultado deseado es un aviso, el producto no tiene por qué ser una interfaz. Puede ser simplemente un flujo:</span><span data-l="en">That distinction makes the solution much smaller. If the desired output is a notification, the product does not have to be an interface. It can simply be a workflow:</span></p>
    <ol class="post-bullets">
      <li><span data-l="es">Recibir el documento mensual.</span><span data-l="en">Receive the monthly document.</span></li>
      <li><span data-l="es">Transformarlo en una representación fiable.</span><span data-l="en">Turn it into a reliable representation.</span></li>
      <li><span data-l="es">Consultar esa representación cada día.</span><span data-l="en">Query that representation each day.</span></li>
      <li><span data-l="es">Emitir un mensaje solo cuando exista una respuesta válida.</span><span data-l="en">Send a message only when a valid answer exists.</span></li>
    </ol>
    <p><span data-l="es">Crear una app habría desplazado la fricción, no la habría eliminado. Ya no tendría que abrir el PDF, pero sí mantener otro servicio, decidir dónde alojarlo, actualizarlo y asegurarme de que siguiera funcionando. Para una familia, «técnicamente interesante» y «útil» no siempre son sinónimos. Qué inoportuno por parte de la realidad.</span><span data-l="en">Building an app would have moved the friction rather than removed it. I would no longer have to open the PDF, but I would have another service to maintain, host, update and keep alive. For a family, “technically interesting” and “useful” are not always synonyms. How inconsiderate of reality.</span></p>

    <h2 id="s2">02 · <span data-l="es">Un PDF no es una base de datos con peor interfaz</span><span data-l="en">A PDF is not a database with a worse interface</span></h2>
    <p><span data-l="es">El documento parece sencillo: días distribuidos en columnas, semanas en filas y un plato en cada celda. Visualmente se entiende en segundos. Para un extractor de texto, la historia puede ser bastante menos elegante.</span><span data-l="en">The document looks simple: days arranged in columns, weeks in rows and one meal in each cell. A person understands it within seconds. For a text extractor, the story can be far less elegant.</span></p>
    <p><span data-l="es">Un PDF describe cómo colocar elementos en una página. No garantiza que el texto se recupere en el orden lógico que vemos. Una extracción lineal puede devolver primero todos los números de día, después varios platos y finalmente los encabezados. También puede mezclar columnas, separar una celda en varias líneas o perder la relación entre una fecha y su contenido.</span><span data-l="en">A PDF describes how elements are positioned on a page. It does not guarantee that text will be recovered in the logical order we see. Linear extraction may return all the day numbers first, then several meals and finally the headings. It may also mix columns, split one cell across several lines or lose the relationship between a date and its contents.</span></p>
    <div class="post-three" data-r="three">
      <div class="post-three-col">
        <strong><span data-l="es">Extraer texto</span><span data-l="en">Extract text</span></strong>
        <p><span data-l="es">Recuperar las palabras presentes en el documento.</span><span data-l="en">Recover the words present in the document.</span></p>
      </div>
      <div class="post-three-col">
        <strong><span data-l="es">Comprender la tabla</span><span data-l="en">Understand the table</span></strong>
        <p><span data-l="es">Reconstruir qué contenido pertenece a cada fecha.</span><span data-l="en">Reconstruct which content belongs to each date.</span></p>
      </div>
      <div class="post-three-col">
        <strong><span data-l="es">Verificar</span><span data-l="en">Verify</span></strong>
        <p><span data-l="es">Contrastar la interpretación con la disposición visual.</span><span data-l="en">Check the interpretation against the visual layout.</span></p>
      </div>
    </div>
    <p><span data-l="es">En este caso, la IA ayuda a proponer una interpretación inicial: identifica fechas, platos, cierres y posibles huecos. Pero esa interpretación se contrasta con una imagen renderizada de la página. No doy por correcta una asociación solo porque el texto extraído parezca coherente.</span><span data-l="en">In this case, AI helps propose an initial interpretation: it identifies dates, meals, closures and possible gaps. But that interpretation is checked against a rendered image of the page. I do not accept an association merely because the extracted text looks plausible.</span></p>
    <div class="post-callout">
      <span class="post-callout-label"><span data-l="es">Regla práctica</span><span data-l="en">Practical rule</span></span>
      <p><span data-l="es">Si el significado depende de filas y columnas, revisar únicamente el texto lineal es revisar una versión incompleta de la fuente.</span><span data-l="en">If meaning depends on rows and columns, reviewing only linear text means reviewing an incomplete version of the source.</span></p>
    </div>

    <h2 id="s3">03 · <span data-l="es">Procesar una vez, consultar muchas</span><span data-l="en">Process once, query many times</span></h2>
    <p><span data-l="es">Podría ejecutar un modelo cada mañana, entregarle el PDF y preguntarle qué corresponde a la fecha actual. Funcionaría algunos días. También sería una forma innecesariamente cara, lenta y variable de responder a una consulta que, una vez interpretado el documento, deja de contener ambigüedad.</span><span data-l="en">I could run a model every morning, give it the PDF and ask what belongs to the current date. It would work on some days. It would also be an unnecessarily expensive, slow and variable way to answer a query that stops being ambiguous once the document has been interpreted.</span></p>
    <h3><span data-l="es">Procesamiento mensual con IA</span><span data-l="en">Monthly processing with AI</span></h3>
    <ul class="post-bullets">
      <li><span data-l="es">Confirmo mes y año usando el propio documento, no solo el nombre del archivo.</span><span data-l="en">I confirm month and year from the document itself, not just its filename.</span></li>
      <li><span data-l="es">Extraigo el texto y renderizo la página para revisar la geometría de la tabla.</span><span data-l="en">I extract the text and render the page to inspect the table's geometry.</span></li>
      <li><span data-l="es">Asocio fechas y platos, y marco cierres, huecos y ambigüedades.</span><span data-l="en">I associate dates with meals and mark closures, gaps and ambiguities.</span></li>
      <li><span data-l="es">Conservo el PDF original y genero un archivo de datos por fecha.</span><span data-l="en">I preserve the original PDF and generate a date-indexed data file.</span></li>
    </ul>
    <h3><span data-l="es">Consulta diaria sin IA</span><span data-l="en">Daily query without AI</span></h3>
    <ul class="post-bullets">
      <li><span data-l="es">Un script calcula la fecha local y abre los datos del mes.</span><span data-l="en">A script calculates the local date and opens that month's data.</span></li>
      <li><span data-l="es">Busca el día actual e imprime el menú si existe.</span><span data-l="en">It looks up the current day and prints the meal if one exists.</span></li>
      <li><span data-l="es">No produce ninguna salida si no hay un menú válido.</span><span data-l="en">It produces no output when there is no valid meal.</span></li>
    </ul>
    <p><span data-l="es">La IA interviene donde aporta algo: traducir una fuente irregular. Después se retira y deja el trabajo repetitivo a código determinista. Es una separación que me gusta especialmente: <strong>criterio durante la ingestión, previsibilidad durante la ejecución</strong>.</span><span data-l="en">AI steps in where it adds value: translating an irregular source. Then it steps aside and leaves repetitive work to deterministic code. It is a separation I particularly like: <strong>judgement during ingestion, predictability during execution</strong>.</span></p>
    <p><span data-l="es">Una representación simplificada de los datos podría ser esta:</span><span data-l="en">A simplified representation of the data could look like this:</span></p>
    <div class="code-block">
      <div class="code-block-header"><span class="code-block-filename"><span data-l="es">Datos mensuales</span><span data-l="en">Monthly data</span></span></div>
      <pre class="code-block-pre"><code><span data-l="es">{
  "month": "2026-08",
  "days": {
    "3": "Plato del día; postre",
    "4": "Otro plato; postre",
    "24": "CERRADO"
  }
}</span><span data-l="en">{
  "month": "2026-08",
  "days": {
    "3": "Meal of the day; dessert",
    "4": "Another meal; dessert",
    "24": "CLOSED"
  }
}</span></code></pre>
    </div>
    <p><span data-l="es">No hace falta una base de datos, un servidor ni una API. Para un documento mensual pequeño, un archivo estructurado es suficiente, fácil de inspeccionar y trivial de consultar.</span><span data-l="en">There is no need for a database, a server or an API. For a small monthly document, one structured file is enough: easy to inspect and trivial to query.</span></p>

    <h2 id="s4">04 · <span data-l="es">La revisión visual no es un trámite ceremonial</span><span data-l="en">Visual review is not a ceremonial step</span></h2>
    <p><span data-l="es">Uno de los riesgos de incorporar IA a un flujo doméstico es aceptar una respuesta plausible como si fuera una respuesta comprobada. En un menú, inventar una asociación parece poco grave hasta que descubres que la automatización ha unido el plato del martes con el miércoles y lo ha hecho con una seguridad envidiable.</span><span data-l="en">One risk of adding AI to a household workflow is accepting a plausible answer as a verified one. In a menu, inventing an association seems harmless until you discover that the automation joined Tuesday's meal to Wednesday and did so with admirable confidence.</span></p>
    <p><span data-l="es">La revisión visual funciona como un control obligatorio, no como una auditoría opcional cuando «algo tiene mala pinta». Compruebo, al menos:</span><span data-l="en">Visual review is a mandatory control, not an optional audit reserved for when “something looks wrong.” At a minimum, I check:</span></p>
    <ul class="post-bullets">
      <li><span data-l="es">Que cada número de día corresponde a la columna correcta.</span><span data-l="en">That every day number belongs to the correct column.</span></li>
      <li><span data-l="es">Que la secuencia encaja con el calendario real del mes.</span><span data-l="en">That the sequence matches the real calendar for that month.</span></li>
      <li><span data-l="es">Que ningún plato ha saltado a la celda contigua.</span><span data-l="en">That no meal has slipped into an adjacent cell.</span></li>
      <li><span data-l="es">Que un texto que abarca varias columnas no se convierte en fechas inventadas.</span><span data-l="en">That text spanning several columns does not become invented dates.</span></li>
      <li><span data-l="es">Que los días sin contenido permanecen sin contenido.</span><span data-l="en">That days without content remain without content.</span></li>
    </ul>
    <p><span data-l="es">Esto no contradice la automatización. La hace honesta. El objetivo no es eliminar cualquier intervención humana, sino concentrarla en el momento donde realmente hace falta criterio y evitar treinta consultas manuales posteriores.</span><span data-l="en">This does not contradict automation. It makes it honest. The goal is not to eliminate every human intervention, but to concentrate it at the point where judgement is genuinely needed and avoid thirty manual lookups afterwards.</span></p>
    <p><span data-l="es"><strong>Delego la ejecución a la IA, no la decisión de considerar correcta una interpretación ambigua.</strong></span><span data-l="en"><strong>I delegate execution to AI, not the decision to treat an ambiguous interpretation as correct.</strong></span></p>

    <h2 id="s5">05 · <span data-l="es">Los huecos también contienen información</span><span data-l="en">Gaps contain information too</span></h2>
    <p><span data-l="es">Una tabla real rara vez tiene todas las celdas limpias y completas. Puede incluir un festivo, vacaciones, una celda en blanco o un texto como «cerrado» extendido visualmente sobre varios días.</span><span data-l="en">A real table rarely has every cell neatly completed. It may include a public holiday, a closure period, a blank cell or text such as “closed” visually spanning several days.</span></p>
    <p><span data-l="es">Aquí es donde una automatización puede causar daño por exceso de entusiasmo. Si una celda está vacía, hay varias explicaciones posibles: no hay menú, el documento omite el dato, una celda combinada cubre ese espacio o la extracción ha fallado. Elegir una sin evidencia sería inventar.</span><span data-l="en">This is where an overenthusiastic automation can cause trouble. A blank cell has several possible explanations: there is no meal, the document omitted it, a merged cell covers that space or extraction failed. Choosing one without evidence would be fabrication.</span></p>
    <table class="post-table post-table--stacked">
      <thead>
        <tr>
          <th><span data-l="es">Lo que muestra la fuente</span><span data-l="en">What the source shows</span></th>
          <th><span data-l="es">Lo que guardo</span><span data-l="en">What I store</span></th>
          <th><span data-l="es">Comportamiento diario</span><span data-l="en">Daily behaviour</span></th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td data-label-es="Fuente" data-label-en="Source"><span data-l="es">Fecha y menú inequívocos</span><span data-l="en">Unambiguous date and meal</span></td>
          <td data-label-es="Dato" data-label-en="Data"><span data-l="es">El menú de esa fecha</span><span data-l="en">That date's meal</span></td>
          <td data-label-es="Comportamiento" data-label-en="Behaviour"><span data-l="es">Envía el aviso</span><span data-l="en">Send the notification</span></td>
        </tr>
        <tr>
          <td data-label-es="Fuente" data-label-en="Source"><span data-l="es">Cierre asociado a una fecha</span><span data-l="en">Closure tied to a date</span></td>
          <td data-label-es="Dato" data-label-en="Data"><span data-l="es"><code>CERRADO</code></span><span data-l="en"><code>CLOSED</code></span></td>
          <td data-label-es="Comportamiento" data-label-en="Behaviour"><span data-l="es">Permanece en silencio</span><span data-l="en">Stay silent</span></td>
        </tr>
        <tr>
          <td data-label-es="Fuente" data-label-en="Source"><span data-l="es">Celda vacía</span><span data-l="en">Blank cell</span></td>
          <td data-label-es="Dato" data-label-en="Data"><span data-l="es">Sin dato</span><span data-l="en">No data</span></td>
          <td data-label-es="Comportamiento" data-label-en="Behaviour"><span data-l="es">Permanece en silencio</span><span data-l="en">Stay silent</span></td>
        </tr>
        <tr>
          <td data-label-es="Fuente" data-label-en="Source"><span data-l="es">Relación dudosa</span><span data-l="en">Uncertain association</span></td>
          <td data-label-es="Dato" data-label-en="Data"><span data-l="es">Ambigüedad pendiente</span><span data-l="en">Pending ambiguity</span></td>
          <td data-label-es="Comportamiento" data-label-en="Behaviour"><span data-l="es">No activa el dato</span><span data-l="en">Do not activate the data</span></td>
        </tr>
      </tbody>
    </table>
    <p><span data-l="es">El silencio no significa que el sistema haya deducido «no hay guardería». Significa algo más preciso: <strong>no existe un menú documentado que sea seguro comunicar para esa fecha</strong>. Una automatización fiable no rellena huecos para que los datos queden bonitos.</span><span data-l="en">Silence does not mean the system inferred “nursery is closed.” It means something more precise: <strong>there is no documented meal that can safely be reported for that date</strong>. A reliable automation does not fill gaps merely to make the data look tidy.</span></p>

    <h2 id="s6">06 · <span data-l="es">Conservar el original y controlar las correcciones</span><span data-l="en">Preserve the original and control corrections</span></h2>
    <p><span data-l="es">Transformar el PDF en datos no convierte el resultado derivado en la única fuente de verdad. El documento original se conserva porque permite responder a una pregunta fundamental: «¿Esto estaba realmente en el PDF o apareció durante el procesamiento?».</span><span data-l="en">Transforming the PDF into data does not make the derived result the sole source of truth. The original document is preserved because it lets me answer a fundamental question: “Was this really in the PDF, or did it appear during processing?”</span></p>
    <p><span data-l="es">También calculo una huella del archivo antes de incorporarlo. Si vuelve a llegar un PDF para el mismo mes y la huella coincide, reprocesarlo no debería duplicar nada. Si la huella cambia, no se sobrescribe silenciosamente: podría ser una versión corregida y conviene comparar ambas.</span><span data-l="en">I also calculate a fingerprint of the file before ingesting it. If a PDF for the same month arrives again with the same fingerprint, reprocessing it should not duplicate anything. If the fingerprint differs, it is not silently overwritten: it may be a corrected version, and the two should be compared.</span></p>
    <div class="post-three" data-r="three">
      <div class="post-three-col"><strong><span data-l="es">Trazabilidad</span><span data-l="en">Traceability</span></strong><p><span data-l="es">Puedo volver al documento que originó cada dato.</span><span data-l="en">I can return to the document behind each data point.</span></p></div>
      <div class="post-three-col"><strong><span data-l="es">Idempotencia</span><span data-l="en">Idempotency</span></strong><p><span data-l="es">Repetir la operación no crea duplicados.</span><span data-l="en">Repeating the operation creates no duplicates.</span></p></div>
      <div class="post-three-col"><strong><span data-l="es">Control de versiones</span><span data-l="en">Version control</span></strong><p><span data-l="es">Una corrección no sustituye el mes sin revisión.</span><span data-l="en">A correction does not replace the month without review.</span></p></div>
    </div>
    <p><span data-l="es">La gestión de versiones puede parecer excesiva para un menú mensual. En realidad, es barata de implementar y evita una clase de errores muy común en cualquier documento periódico: sustituir una versión sin saber qué cambió.</span><span data-l="en">Version handling may sound excessive for a monthly menu. In practice, it is cheap to implement and prevents a common error in recurring documents: replacing one version without knowing what changed.</span></p>

    <h2 id="s7">07 · <span data-l="es">El aviso diario es casi aburrido, como debe ser</span><span data-l="en">The daily notification is almost boring, as it should be</span></h2>
    <p><span data-l="es">Después de todo el trabajo de interpretación mensual, la ejecución diaria cabe en unas pocas líneas:</span><span data-l="en">After all the monthly interpretation work, the daily execution fits into a few lines:</span></p>
    <div class="code-block">
      <div class="code-block-header"><span class="code-block-filename"><span data-l="es">Consulta diaria</span><span data-l="en">Daily query</span></span></div>
      <pre class="code-block-pre"><code><span data-l="es">hoy = fecha_local()
menu = buscar_menu(hoy)

if menu and not menu.startswith("CERRADO"):
    print(f"Hoy el menú es: {menu}")</span><span data-l="en">today = local_date()
meal = find_meal(today)

if meal and not meal.startswith("CLOSED"):
    print(f"Today's meal is: {meal}")</span></code></pre>
    </div>
    <p><span data-l="es">No hay un <code>else</code>. Esa ausencia forma parte del diseño. La tarea se ejecuta de lunes a viernes. Cuando el script imprime un menú, el programador lo entrega como mensaje. Si el día no está documentado, es fin de semana o figura como cierre, el script termina correctamente sin salida y no llega ninguna notificación.</span><span data-l="en">There is no <code>else</code>. That absence is part of the design. The task runs from Monday to Friday. When the script prints a meal, the scheduler delivers it as a message. If the day is undocumented, falls on a weekend or is marked as closed, the script completes successfully with no output and no notification is sent.</span></p>
    <p><span data-l="es">Un error real debe seguir otro camino: no poder leer los datos no es lo mismo que no encontrar menú. Un archivo ausente para un mes que debería estar activo, datos corruptos o un fallo de permisos deberían producir una alerta técnica, no disfrazarse de silencio. Esta es una mejora importante para cualquier automatización: <strong>distinguir el estado esperado de la incapacidad para comprobarlo</strong>.</span><span data-l="en">A genuine error must take a different path: being unable to read the data is not the same as finding no meal. A missing file for an active month, corrupt data or a permissions failure should produce a technical alert rather than masquerade as silence. This is an important improvement for any automation: <strong>distinguish an expected state from an inability to check it</strong>.</span></p>
    <p><span data-l="es">En mi caso, la tarea diaria se ejecuta directamente como script programado, sin llamar a un modelo. La <a href="https://hermes-agent.nousresearch.com/docs/user-guide/features/cron" target="_blank" rel="noopener">documentación oficial de las tareas programadas de Hermes</a> describe este modo de ejecución: el contenido del script se entrega como mensaje, una salida vacía permanece silenciosa y un fallo genera una alerta. No hay tokens, interpretación ni creatividad en la consulta cotidiana. A las diez de la mañana tampoco necesitamos que Shakespeare improvise el puré.</span><span data-l="en">In my case, the daily task runs directly as a scheduled script, without calling a model. The <a href="https://hermes-agent.nousresearch.com/docs/user-guide/features/cron" target="_blank" rel="noopener">official Hermes scheduled-task documentation</a> describes this execution mode: script output is delivered as a message, empty output remains silent and a failure raises an alert. There are no tokens, interpretation or creativity in the everyday query. At ten in the morning, we do not need Shakespeare improvising the purée either.</span></p>

    <h2 id="s8">08 · <span data-l="es">Qué mantenimiento sigue existiendo</span><span data-l="en">What maintenance still exists</span></h2>
    <p><span data-l="es">Automatizar no elimina la realidad administrativa del universo. Cada mes sigue haciendo falta recibir el nuevo PDF y procesarlo. Si el formato cambia de forma sustancial, habrá que revisar la extracción. Si llega una corrección, habrá que compararla. Si el documento llega después de la hora programada, conviene ejecutar una recuperación manual para no perder el aviso de ese día.</span><span data-l="en">Automation does not eliminate the universe's administrative reality. The new PDF still has to arrive and be processed every month. If its format changes substantially, extraction must be reviewed. If a correction arrives, it must be compared. If the document arrives after the scheduled run, a manual catch-up avoids missing that day's notification.</span></p>
    <p><span data-l="es">El flujo reduce una tarea diaria, pero conserva una intervención mensual. Me parece un intercambio razonable porque concentra el esfuerzo:</span><span data-l="en">The workflow removes a daily task but keeps a monthly intervention. That seems like a reasonable trade because it concentrates the effort:</span></p>
    <ul class="post-bullets">
      <li><span data-l="es"><strong>Antes:</strong> abrir y consultar el documento muchas veces.</span><span data-l="en"><strong>Before:</strong> open and check the document repeatedly.</span></li>
      <li><span data-l="es"><strong>Después:</strong> revisar bien el documento una vez y olvidarse del resto del mes.</span><span data-l="en"><strong>After:</strong> review the document properly once and forget about it for the rest of the month.</span></li>
    </ul>
    <p><span data-l="es">También hay límites que no conviene esconder. El contenido pertenece al ámbito familiar y debe almacenarse con prudencia. El sistema informa de lo que dice el documento; no evalúa decisiones nutricionales ni educativas. Y la revisión visual sigue siendo necesaria cuando la fuente es ambigua.</span><span data-l="en">There are also limits worth stating openly. The content belongs to the family sphere and should be stored carefully. The system reports what the document says; it does not evaluate nutritional or educational decisions. And visual review remains necessary whenever the source is ambiguous.</span></p>
    <p><span data-l="es">La IA no convierte una mala fuente en una verdad perfecta. Solo puede ayudar a transformarla bajo controles explícitos.</span><span data-l="en">AI does not turn a poor source into perfect truth. It can only help transform it under explicit controls.</span></p>

    <h2 id="s9">09 · <span data-l="es">Un patrón reutilizable más allá del menú</span><span data-l="en">A reusable pattern beyond the menu</span></h2>
    <p><span data-l="es">El caso es doméstico, pero la arquitectura aparece en muchos otros sitios:</span><span data-l="en">The case is domestic, but the architecture appears in many other places:</span></p>
    <ul class="post-bullets">
      <li><span data-l="es">Un horario mensual convertido en recordatorios diarios.</span><span data-l="en">A monthly timetable converted into daily reminders.</span></li>
      <li><span data-l="es">Una factura periódica transformada en una fecha de pago y un importe verificable.</span><span data-l="en">A recurring invoice turned into a payment date and verifiable amount.</span></li>
      <li><span data-l="es">Un calendario escolar que genera avisos solo en días especiales.</span><span data-l="en">A school calendar that produces notifications only on special days.</span></li>
      <li><span data-l="es">Un cuadrante laboral convertido en turnos consultables.</span><span data-l="en">A work rota converted into queryable shifts.</span></li>
      <li><span data-l="es">Un boletín periódico del que se extraen cambios relevantes.</span><span data-l="en">A periodic bulletin from which relevant changes are extracted.</span></li>
    </ul>
    <p><span data-l="es">El patrón se mantiene: preservar la fuente, usar IA para interpretar lo irregular, revisar visualmente aquello que depende del diseño, guardar una representación estructurada y mínima, ejecutar después una lógica determinista y no inventar donde la fuente no permite concluir.</span><span data-l="en">The pattern remains the same: preserve the source, use AI to interpret irregular material, visually review anything dependent on layout, store a minimal structured representation, run deterministic logic afterwards and never invent where the source does not support a conclusion.</span></p>
    <p><span data-l="es">No todos estos casos merecen automatización. La pregunta práctica es si la fricción se repite lo suficiente y si la transformación mensual cuesta menos que las consultas que evita. Si la respuesta es sí, probablemente tampoco necesiten una app completa.</span><span data-l="en">Not all these cases deserve automation. The practical question is whether the friction repeats often enough and whether the monthly transformation costs less than the lookups it prevents. If the answer is yes, they probably do not need a full app either.</span></p>

    <h2 id="s10">10 · <span data-l="es">Automatizar la fricción, no fabricar otra plataforma</span><span data-l="en">Automate the friction, not another platform</span></h2>
    <p><span data-l="es">Este proyecto no tiene usuarios, roadmap ni panel de administración. No intenta convertirse en el «SaaS definitivo para menús de guardería», una frase que espero no haber regalado a ningún inversor con exceso de cafeína.</span><span data-l="en">This project has no users, roadmap or admin dashboard. It is not trying to become “the ultimate SaaS for nursery menus,” a phrase I hope I have not just donated to an over-caffeinated investor.</span></p>
    <p><span data-l="es">Hace una sola cosa: transforma un documento mensual incómodo en el dato que necesito en el momento adecuado.</span><span data-l="en">It does one thing: transforms an awkward monthly document into the piece of information I need at the right time.</span></p>
    <p><span data-l="es">Lo valioso de la IA aquí no es que ejecute todo el proceso para siempre. Es que permite cruzar una frontera que antes hacía poco rentable la automatización: comprender una tabla humana lo bastante bien como para convertirla, con revisión, en datos simples. A partir de ahí, el resto vuelve a ser software aburrido y fiable.</span><span data-l="en">The value of AI here is not that it runs the whole process forever. It lets us cross a boundary that previously made automation poor value: understanding a human table well enough to turn it, with review, into simple data. From that point onwards, the rest can return to being boring, reliable software.</span></p>
    <p><span data-l="es">Si tienes un PDF, una hoja o un correo que consultas una y otra vez para responder siempre a la misma pregunta, quizá no necesites construir otra aplicación. Empieza por escribir cuál es la salida mínima que quieres recibir. Separa la interpretación puntual de la ejecución repetitiva. Decide qué debe ocurrir ante un hueco, una corrección y un fallo. Y conserva siempre la posibilidad de volver a la fuente.</span><span data-l="en">If you have a PDF, spreadsheet or email that you repeatedly consult to answer the same question, perhaps you do not need to build another application. Start by writing down the smallest output you want to receive. Separate one-off interpretation from repetitive execution. Decide what should happen when there is a gap, a correction or a failure. And always preserve the ability to return to the source.</span></p>
    <div class="post-callout">
      <span class="post-callout-label"><span data-l="es">La idea final</span><span data-l="en">The final idea</span></span>
      <p><span data-l="es">A veces automatizar no consiste en crear una nueva herramienta que usar. Consiste en conseguir que una tarea deje, por fin, de pedirte atención.</span><span data-l="en">Sometimes automation is not about creating a new tool to use. It is about making a task finally stop asking for your attention.</span></p>
    </div>
  `
};
