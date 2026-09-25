# qoodle-sdk

SDK para loguearse por SAML (SimpleSAMLphp, `acceso.uvq.edu.ar`) contra Qoodle
(Moodle de la UVQ) y leer contenido de cualquier aula: cursos, foros,
discusiones, recursos y tareas. Sin dependencias de Express ni del SDK de MCP
— es la única pieza que hace falta si querés hablar con Qoodle desde tu
propio código.

## Instalar

```bash
npm install qoodle-sdk
```

## Uso mínimo

```ts
import { QoodleSession, QoodleClient } from 'qoodle-sdk';

const session = new QoodleSession(process.env.CAMPUS_USERNAME!, process.env.CAMPUS_PASSWORD!);
const qoodle = new QoodleClient(session);

const cursos = await qoodle.listCourses(); // el login pasa solo, en la primera llamada real
```

No hace falta llamar a un `.login()` a mano: `QoodleClient` loguea (y
re-loguea si la sesión de Moodle vence en el medio) la primera vez que
necesita pegarle a Qoodle de verdad.

## API de `QoodleClient`

```ts
qoodle.listCourses(classification?)        // 'inprogress' (default) | 'future' | 'past' | 'all'
qoodle.getCourseContent(courseId)          // secciones y actividades de un aula
qoodle.getForumDiscussions(forumId)        // listado de discusiones de un foro
qoodle.getForumDiscussion(discussionId)    // una discusión completa, con respuestas anidadas
qoodle.resolveResource(resourceId)         // URL real (pluginfile.php) de un recurso, sin descargar
qoodle.downloadResource(resourceId, destDir) // descarga el archivo real a disco
qoodle.getResourceText(resourceId)         // texto plano de un recurso PDF
qoodle.getAssignmentInfo(assignmentId)     // fecha de entrega, si ya se entregó, formato, calificación
```

Todos los IDs (`courseId`, `forumId`, `discussionId`, `resourceId`,
`assignmentId`) son los que aparecen en las URLs de Qoodle:
`course/view.php?id=`, `mod/forum/view.php?id=`, `discuss.php?d=`,
`mod/resource/view.php?id=`, `mod/assign/view.php?id=`.

## Configuración opcional: reusar una sesión ya logueada

`QoodleSession` acepta un tercer parámetro opcional, un `CookieJar` (de
[`tough-cookie`](https://www.npmjs.com/package/tough-cookie)) ya autenticado.
Sirve si vos mismo querés persistir la sesión entre reinicios de tu proceso
(guardar las cookies en disco/una base, y rehidratarlas) para no tener que
loguear de nuevo cada vez:

```ts
import { QoodleSession } from 'qoodle-sdk';
import { CookieJar } from 'tough-cookie';

const jar = CookieJar.fromJSON(cookiesGuardadasComoJson);
const session = new QoodleSession(usuario, contraseña, jar);
```

Si ya hiciste el login SAML por tu cuenta (por ejemplo en un flujo web
multiusuario) y solo tenés las cookies, usá `StaticSession` en vez de
`QoodleSession` — no necesita usuario/contraseña, pero tampoco puede
re-loguear sola si la sesión expira (te va a tirar `UnauthorizedError` para
que reautentiques):

```ts
import { StaticSession, QoodleClient } from 'qoodle-sdk';

const session = new StaticSession(jar);
const qoodle = new QoodleClient(session);
```

Ambas implementan la misma interfaz `QoodleAuth`, así que `QoodleClient`
funciona igual con cualquiera de las dos.

## Manejo de errores

Todo lo que puede fallar tira una subclase de `AppError`, nunca un `Error`
genérico:

```ts
import { isAppError, ValidationError, UnauthorizedError, NotFoundError, UpstreamError } from 'qoodle-sdk';

try {
  await qoodle.getResourceText(resourceId);
} catch (err) {
  if (isAppError(err)) {
    console.error(err.code, err.message); // 'NOT_FOUND', 'VALIDATION_ERROR', etc.
  }
}
```

| Clase | Cuándo |
|---|---|
| `ValidationError` | Datos de entrada inválidos (ej: un recurso que no es PDF y pediste `getResourceText`) |
| `UnauthorizedError` | Usuario/contraseña incorrectos, o sesión vencida sin forma de re-loguear (`StaticSession`) |
| `NotFoundError` | El recurso pedido no se pudo resolver |
| `UpstreamError` | Falló la comunicación con Qoodle/YouTube/Google Sheets |

## Otras exportaciones

Además de lo anterior, el paquete exporta los parsers puros (`parseCourse`,
`parseForumView`, `parseDiscussion`, `parseAssignmentView`) por si querés
parsear HTML que ya tenés vos, y dos helpers sin login:
`getYoutubeTranscript(idOrUrl)` y `getPublicSheetCsv(url, gid?)`. Ver el
detalle completo en [`src/index.ts`](src/index.ts).
