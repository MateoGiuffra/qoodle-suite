# qoodle-suite

Monorepo (pnpm workspaces) para loguearse por SAML (SimpleSAMLphp,
`acceso.uvq.edu.ar`) contra Qoodle (Moodle de la UVQ) y leer contenido de
cualquier aula: secciones, foros, discusiones con respuestas, recursos (PDFs)
y estado de tareas.

Tres paquetes, cada uno con su propio README:

| Paquete | Qué es | Se publica |
|---|---|---|
| [`packages/sdk`](packages/sdk) → `qoodle-sdk` | La lógica de dominio (login SAML, parsers, `QoodleClient`). Se instala como librería en cualquier proyecto Node/TS. **Empezá acá si solo querés consumir Qoodle desde tu propio código.** | Sí, a npm |
| [`packages/mcp`](packages/mcp) → `qoodle-mcp-server` | Servidor MCP (stdio) sobre `qoodle-sdk`, para usar desde Claude Code u otro cliente MCP. | No (uso local) |
| [`packages/api`](packages/api) → `qoodle-rest-api` | API REST + Swagger sobre `qoodle-sdk`, con login multiusuario por sesión de Express. | No (uso local) |

## Instalar el SDK en tu propio proyecto

```bash
npm install qoodle-sdk
```

```ts
import { QoodleSession, QoodleClient } from 'qoodle-sdk';

const session = new QoodleSession(process.env.CAMPUS_USERNAME!, process.env.CAMPUS_PASSWORD!);
const qoodle = new QoodleClient(session);

const cursos = await qoodle.listCourses(); // el login pasa solo, en la primera llamada real
```

Ver [`packages/sdk/README.md`](packages/sdk/README.md) para el resto de la
API, manejo de errores, y cómo reusar una sesión ya logueada.

## Levantar este monorepo (para tocar el código)

```bash
git clone https://github.com/MateoGiuffra/qoodle-suite.git
cd qoodle-suite
pnpm install
pnpm build          # compila qoodle-sdk (los otros paquetes corren con tsx, sin build)
```

Después, [`packages/mcp/README.md`](packages/mcp/README.md) para configurarlo
en Claude Code, o [`packages/api/README.md`](packages/api/README.md) para
levantar la API REST + Swagger.

## Arquitectura

```
packages/
  sdk/   qoodle-sdk — dominio puro, sin Express ni MCP
    src/
      errors/      jerarquía de excepciones (AppError -> Validation/Unauthorized/NotFound/Upstream)
      validation/  schemas de zod compartidos por qoodle-mcp-server y qoodle-rest-api
      parsers/     funciones puras HTML -> datos (cheerio), sin estado ni red
      qoodle/      QoodleSession/StaticSession (auth) + QoodleClient (fachada de operaciones)
      external/    servicios externos sin login (YouTube, Google Sheets)
      index.ts     todo lo que se exporta al instalar `qoodle-sdk`
  mcp/   qoodle-mcp-server — tools MCP finitas sobre QoodleClient
  api/   qoodle-rest-api — controllers/routes/middleware de Express sobre QoodleClient
```

`QoodleClient` (en `qoodle-sdk`) es el único lugar que sabe armar URLs de
Qoodle y parsear sus respuestas; tanto `qoodle-mcp-server` como
`qoodle-rest-api` lo consumen a través de la interfaz `QoodleAuth` (dos
implementaciones: `QoodleSession`, con usuario fijo del `.env` y re-login
automático, para el MCP; `StaticSession`, sobre cookies ya logueadas por
`/api/login`, para el server HTTP multiusuario).

## Notas

- Todo es de solo lectura: no hay ningún endpoint que publique, responda o
  modifique nada en Qoodle.
- El flujo de login replica el handshake real de SimpleSAMLphp (AuthState →
  SAMLResponse → ACS), igual al que hace el navegador.
