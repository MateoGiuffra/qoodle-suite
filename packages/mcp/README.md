# qoodle-mcp-server

Servidor MCP (stdio) sobre [`qoodle-sdk`](../sdk): expone tools para leer
Qoodle desde Claude Code u otro cliente MCP. Usa un único usuario fijo (el del
`.env`), con login perezoso y re-login automático si la sesión expira.

## Configurar en Claude Code

Copiá `.mcp.json.example` (en la raíz del monorepo) a `.mcp.json`, y completá
tus credenciales:

```json
{
  "mcpServers": {
    "qoodle": {
      "command": "npx",
      "args": ["tsx", "/ruta/absoluta/a/qoodle-suite/packages/mcp/src/mcpServer.ts"],
      "env": {
        "CAMPUS_USERNAME": "tu_usuario",
        "CAMPUS_PASSWORD": "tu_password"
      }
    }
  }
}
```

Claude Code detecta el `.mcp.json` automáticamente al abrir el proyecto.

## Correr suelto (sin Claude Code)

```bash
cd packages/mcp
CAMPUS_USERNAME=tu_usuario CAMPUS_PASSWORD=tu_password pnpm start
```

## Tools disponibles

| Tool | Qué hace |
|---|---|
| `list_courses` | Lista las aulas del usuario. `classification`: `inprogress` (activas ahora, default), `future`, `past`, `all`. |
| `get_course_content` | Secciones y actividades de un aula, a partir de su `courseId`. |
| `get_forum_discussions` | Discusiones de un foro (`forumId`). |
| `get_forum_discussion` | Una discusión completa con respuestas anidadas (`discussionId`). |
| `get_resource_info` | Resuelve la URL real de un recurso sin descargarlo (`resourceId`). |
| `get_resource_text` | Texto plano de un recurso PDF, sin guardar nada en disco (`resourceId`). |
| `download_resource` | Descarga el archivo real (PDF, etc.) a `packages/mcp/downloads/` (`resourceId`). |
| `get_youtube_transcript` | Transcripción pública (subtítulos) de un video de YouTube citado en el material (`video`: id o URL). No requiere login. |
| `get_google_sheet` | Filas de una Google Sheet pública ("cualquiera con el link puede ver"), como las que comparten los docentes (`url`, `gid` opcional). No requiere login ni MCP de Drive. |
| `get_assignment_info` | Estado de una tarea (`assign`): fecha de entrega, si ya se entregó, formato (archivo/texto), y estado de calificación (`assignmentId`). |

Todos los IDs son los que aparecen en las URLs de Qoodle. `list_courses` y
`get_course_content` devuelven esos IDs para encadenar las demás tools, así
que no hace falta ir a buscarlos a mano.
