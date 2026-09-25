---
name: explicar-clase-qoodle
description: Use when the user asks to review, resolve, explain, or "hacer" a class/unit from Qoodle (campus virtual) using the qoodle MCP tools (list_courses, get_course_content, get_resource_text, etc.). Also use when they say things like "resolveme la clase X de <materia>", "que hay que hacer en la clase X", or "segui con lo del campus". Triggers on any request that mixes a materia/class number with the qoodle MCP.
---

# Explicar clase de Qoodle

Guía de cómo explicar y resolver una clase del campus (Qoodle) para este usuario. Se usa siempre junto con las tools `mcp__qoodle__*`.

## Antes de responder

1. Antes de leer contenido nuevo, mirá si existe `materias/<nombre-materia>.md` (ver skill `organizar-materias`). Si existe, leelo primero: te dice en qué clase están, qué ya se hizo, y qué falta.
2. Usá `mcp__qoodle__list_courses` para encontrar el curso si no sabés el id, y `mcp__qoodle__get_course_content` para ver las secciones/clases.
3. Leé el recurso de la clase pedida con `mcp__qoodle__get_resource_text` (o `download_resource`/`get_resource_info` si hace falta el archivo real).
4. Si la clase referencia un link externo (video de YouTube, un repo de GitHub, una PR, un doc) andá a buscarlo (`get_youtube_transcript`, `WebFetch`, `gh pr view`, `get_google_sheet`) ANTES de explicar, para no responder en abstracto. Nunca digas "mirá el video" sin más — siempre traé la transcripción/contenido real primero.
5. **Regla general, no solo para foros: si la actividad es colaborativa (foro, planilla compartida, glosario, documento compartido, lo que sea que otros compañeros ya tocaron), leé lo que ya hay ahí SIEMPRE antes de armar un aporte — esto no es opcional ni se limita a foros, y no se salta nunca.** `get_forum_discussions`+`get_forum_discussion` para foros, `get_google_sheet` para planillas, etc. No alcanza con inferir el idioma o el tono por el nombre de la materia (ej: "es Inglés II, entonces va en inglés" puede estar mal). De ese contenido real sacás:
   - **El idioma real que usan los compañeros.** Si responden en español (aunque sea una materia de inglés — a veces la actividad es de comprensión/análisis, no de producción escrita en inglés), respondé en español. Si responden en inglés, en inglés. Esto pisa cualquier suposición genérica sobre el idioma de la materia.
   - **El tono/registro y las convenciones de formato que ya usan** (ej: si citan la fuente como "(Mail 2)" o "(Ejemplo 3)" al final de cada expresión, seguí esa misma convención) — ver "Estilo de las respuestas armadas".
   - **Qué ya está puesto, para NO repetirlo.** Antes de sugerir contenido nuevo (una expresión para una planilla, una respuesta para un foro), revisá todo lo que ya cargaron los compañeros y priorizá algo que todavía no esté. Cuando la fuente es chica (ej: 4 mails de ejemplo) y ya casi todo fue usado varias veces, alguna repetición es inevitable — en ese caso decilo explícitamente en vez de fingir que encontraste algo 100% original.
   - **Un compañero real al que responder**, cuando la consigna pide diálogo (ver más abajo).
   - **Feedback que ya haya dejado la docente en ese mismo hilo.** Si está, es la fuente más valiosa que existe: dice exactamente qué corrige o pide precisar en cada compañero. Usalo para armar una respuesta que esquive esos mismos errores (ver "Usar el feedback de la docente").

## Resumir contenido (video/PDF/artículo) — regla estricta

Cuando resumís una transcripción, un PDF o cualquier fuente externa:

- **Resumí SOLO lo que dice la fuente.** No metas conocimiento propio, contexto adicional, ni nada que no esté en el texto/transcripción, aunque sea correcto — el ejercicio evalúa comprensión de ESA fuente puntual.
- **Cortísimo.** Apuntá a una oración o un párrafo chico. Si dudás entre agregar un dato más o cortar, cortá — la idea es lo justo y necesario para resolver el ejercicio, no una clase aparte sobre el tema.
- No hace falta cubrir toda la fuente pareja: priorizá lo que se necesita para responder las preguntas/actividades de esa clase puntual, y dejá afuera lo anecdótico (ej: intros del canal, plugs personales, tangentes).

## Cómo responder (estilo obligatorio)

Nada de tablas frías ni resúmenes tipo informe. Se explica como si le estuvieras contando a la persona de qué se trata la tarea, en orden, hablando normal (rioplatense, tono conversacional, no acartonado).

Estructura:

1. **Arranca contextualizando la clase en 2-3 líneas**: qué género/tema nuevo aparece, por qué, y cómo se conecta con lo anterior. Sin jerga sin explicar.
2. **Después, paso a paso, en el orden real en que hay que hacerlo, con un formato de encabezado fijo (siempre igual, no varía la forma):**

   ```
   Paso N — "Título de la actividad" → link — OBLIGATORIA|OPCIONAL|NO ESPECIFICADA — Entrega: <fecha>|sin fecha en el texto
   ```

   - El estado (obligatoria/opcional/no especificada) y la fecha de entrega van SIEMPRE en esa misma línea de encabezado, nunca sueltos en otra parte del paso ni mezclados con la explicación. Es el único lugar donde vive ese dato.
   - Sale del texto de la clase (la docente suele decirlo explícito: "de carácter obligatorio", "instancia opcional", "optativo") o de la fecha de entrega visible en la página del `assign`/foro. Si no está explícito en ningún lado, poné "NO ESPECIFICADA" / "sin fecha en el texto" — nunca asumas ni lo omitas.
   - Debajo del encabezado, en 1-2 líneas: qué hay que hacer ahí y para qué sirve (sin repetir el estado/fecha, ya están arriba).
   - Si podés resolverlo vos directamente (porque es análisis de un texto/video/código externo), dá la respuesta ya armada, lista para copiar y ajustar.
   - Si es reflexión personal, autoevaluación, o depende de la experiencia propia del usuario (foros de presentación, autoevaluaciones, opiniones), NO inventes la respuesta. Decilo explícito y ofrecé ayudar a redactarlo si te cuenta su experiencia real.
3. **Al final**, un cierre corto con el próximo paso concreto (una sola acción, ej: "decime si querés que te resuelva el paso 4 o te ayude a escribir el self-assessment").

## Nunca ofrezcas dos opciones como cop-out

Si algo no está 100% explícito en el texto de la clase (ej: en qué idioma responder, formato exacto de entrega), no le pases el problema al usuario tipo "podés hacerlo en español o en inglés" — decidí vos cuál es la más probable según el contexto real del curso (ej: si todas las demás actividades de esta materia se responden en inglés, la respuesta es inglés) y dala como respuesta concreta. Si de verdad no hay forma de inferirlo, decilo explícito ("esto no lo aclara ni el texto ni el patrón del curso, preguntale a la docente") en vez de dar dos caminos como si fueran equivalentes.

Evitar: tablas markdown grandes salvo que ayuden genuinamente a algo puntual (como un emparejamiento corto), muros de texto sin separar en pasos, resolver por el usuario cosas que son evaluación de su propio proceso de aprendizaje.

## Estilo de las respuestas armadas para foros (crítico)

Cuando armás un texto en inglés listo para copiar y pegar en un foro del campus, NO escribas como IA. Antes de escribir, leé 2-3 respuestas reales de compañeros en ese mismo foro (`get_forum_discussion`) y calcá el registro: nivel de inglés de estudiante (no nativo perfecto), oraciones más cortas y directas, sin fórmulas de coach corporativo.

Cosas que delatan que es IA — evitalas siempre:
- Frases tipo "I liked how you connected X to Y — it really shows why...", "I think both moves complement each other", elogios genéricos armados en sandwich.
- Rayas largas (—) para conectar ideas, en vez de puntos o "and"/"also".
- Cerrar todo con una síntesis linda tipo moraleja ("Thanks for sharing yours!" como remate calculado).
- Vocabulario más pulido que el del resto del curso (si los compañeros escriben simple, no le metas nivel C1 de golpe).

En cambio: escribí como escribiría el usuario si lo tipeara rápido — directo, capaz alguna oración corta suelta, sin la estructura perfecta de "halago + aporte propio + cierre reflexivo". Metéte con el contenido real (el paso, la definición) más que con comentarios sobre el compañero.

## Usar el feedback de la docente cuando existe

Si en el foro la docente ya dejó devoluciones sobre las respuestas de otros compañeros, leelas con cuidado antes de armar la respuesta: ahí está el criterio de corrección real (qué pide precisar, qué considera "demasiado general", qué distinción espera que se haga). Armá la respuesta evitando explícitamente cada uno de esos errores repetidos — eso es lo que la sube de una respuesta genérica a una de nota alta. Ejemplos típicos de lo que suele pedir (varían por consigna, pero el patrón se repite): ser específico al caso puntual y no quedarse en la definición genérica del género, diferenciar niveles de autoridad/decisión entre los actores de la audiencia (no meterlos a todos en la misma bolsa), y al nombrar una estructura gramatical dar un ejemplo concreto del texto + explicar su función discursiva puntual (no una frase genérica tipo "aporta claridad y precisión").

## Elegir un "compañero" cuando la consigna pide diálogo

Si la actividad pide responder/dialogar con otros (no postear suelto), buscá el foro real con `get_forum_discussions` + `get_forum_discussion` y elegí a alguien que cumpla el requisito puntual de la consigna (ej: que haya elegido una opción distinta a la tuya, que su post no tenga respuestas todavía, que sea el que menos cobertura tiene del ejercicio). Explicá en una línea por qué ese compañero es la mejor opción, y dale el link a su post/perfil si está disponible.

## Después de responder

Actualizá (o creá) `materias/<nombre-materia>.md` con lo visto en esta clase: temas nuevos, qué se resolvió, qué quedó pendiente, y cuál es la próxima clase a abordar. Ver skill `organizar-materias` para el formato exacto.
