# qoodle-rest-api

API REST + Swagger sobre [`qoodle-sdk`](../sdk), con login SAML multiusuario:
cada quien loguea las suyas por `POST /api/login`, la sesión se guarda en una
cookie de Express (no hay usuario fijo como en el MCP).

## Correr

```bash
cd packages/api
cp ../../.env.example .env   # PORT (opcional, default 3600)
pnpm start                   # o: pnpm dev (con recarga)
```

- Swagger UI: `http://localhost:3600/docs`
- Spec cruda: `http://localhost:3600/openapi.json`

## Endpoints

| Método | Ruta | Qué hace |
|---|---|---|
| POST | `/api/login` | Login SAML, deja la sesión de Moodle activa |
| GET | `/api/me` | Consulta si hay sesión activa |
| GET | `/api/courses?classification=` | Lista aulas (`all`\|`inprogress`\|`future`\|`past`) |
| GET | `/api/course/:id` | Contenido estructurado de un aula |
| GET | `/api/forum/:id` | Discusiones de un foro |
| GET | `/api/forum/discussion/:id` | Discusión con respuestas anidadas |
| GET | `/api/resource/:id` | URL real del recurso, sin descargar |
| GET | `/api/resource/:id/text` | Texto plano del PDF, sin guardar en disco |
| GET | `/api/resource/:id/download` | Descarga el binario real |
| GET | `/api/assignment/:id` | Estado de una tarea: entrega, formato, calificación |
| GET | `/api/youtube/transcript?url=` | Transcripción pública de un video de YouTube (no requiere login) |
| GET | `/api/google-sheet?url=&gid=` | Filas de una Google Sheet pública (no requiere login) |
| POST | `/api/logout` | Cierra la sesión local |
