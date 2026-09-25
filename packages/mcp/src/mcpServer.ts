import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import path from 'path';
import { fileURLToPath } from 'url';
import { z } from 'zod';
import {
    QoodleClient,
    QoodleSession,
    courseClassificationSchema,
    getPublicSheetCsv,
    getYoutubeTranscript,
    googleSheetSchema,
    moodleIdSchema,
    youtubeVideoSchema
} from 'qoodle-sdk';
import { env } from './env.js';
import { jsonResult, mcpTool, textResult } from './mcpToolHandler.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// env.ts ya valida CAMPUS_USERNAME/CAMPUS_PASSWORD al cargar (process.exit si faltan).
const session = new QoodleSession(env.CAMPUS_USERNAME, env.CAMPUS_PASSWORD);
const qoodle = new QoodleClient(session);

const server = new McpServer({ name: 'qoodle-mcp', version: '1.0.0' });

server.registerTool(
    'get_google_sheet',
    {
        title: 'Leer una Google Sheet pública',
        description: 'Lee una Google Sheet compartida como "cualquiera con el link puede ver" (por ejemplo, la que comparte un docente en una clase) y devuelve sus filas como CSV parseado. No requiere login de Google ni un MCP de Drive.',
        inputSchema: {
            url: googleSheetSchema.shape.url,
            gid: googleSheetSchema.shape.gid
        }
    },
    mcpTool(async ({ url, gid }: { url: string; gid?: string }) => {
        const result = await getPublicSheetCsv(url, gid);
        return jsonResult({ headers: result.headers, rows: result.rows });
    })
);

server.registerTool(
    'get_youtube_transcript',
    {
        title: 'Transcripción de un video de YouTube',
        description: 'Devuelve la transcripción pública (subtítulos) de un video de YouTube citado en el material de una clase, a partir de su id o de cualquier URL (youtu.be, watch?v=, embed, shorts). No requiere login de Qoodle.',
        inputSchema: { video: youtubeVideoSchema }
    },
    mcpTool(async ({ video }: { video: string }) => {
        const result = await getYoutubeTranscript(video);
        return textResult(result.text);
    })
);

server.registerTool(
    'list_courses',
    {
        title: 'Listar aulas (cursos)',
        description: 'Devuelve las aulas/cursos del usuario en Qoodle. "inprogress" son las cursadas activas ahora mismo (recomendado por defecto), "future"/"past" las que todavía no arrancaron o ya cerraron, "all" todas.',
        inputSchema: { classification: courseClassificationSchema }
    },
    mcpTool(async ({ classification }: { classification: z.infer<typeof courseClassificationSchema> }) => {
        const courses = await qoodle.listCourses(classification);
        return jsonResult(courses);
    })
);

server.registerTool(
    'get_course_content',
    {
        title: 'Contenido de un curso de Qoodle',
        description: 'Devuelve el contenido estructurado (secciones y actividades) de un curso de Qoodle/Moodle a partir de su id.',
        inputSchema: { courseId: moodleIdSchema.describe('ID numérico del curso, el que aparece en course/view.php?id=XXXXX') }
    },
    mcpTool(async ({ courseId }: { courseId: string }) => jsonResult(await qoodle.getCourseContent(courseId)))
);

server.registerTool(
    'get_forum_discussions',
    {
        title: 'Listar discusiones de un foro',
        description: 'Devuelve el listado de discusiones (título, autor, fecha) de un foro de Qoodle a partir de su id (el que aparece en mod/forum/view.php?id=XXXXX).',
        inputSchema: { forumId: moodleIdSchema.describe('ID del foro (cmid)') }
    },
    mcpTool(async ({ forumId }: { forumId: string }) => jsonResult(await qoodle.getForumDiscussions(forumId)))
);

server.registerTool(
    'get_forum_discussion',
    {
        title: 'Leer una discusión de foro completa',
        description: 'Devuelve una discusión de foro con su post original y todas las respuestas anidadas, a partir de su id (el "d=" de discuss.php?d=XXXXX).',
        inputSchema: { discussionId: moodleIdSchema.describe('ID de la discusión') }
    },
    mcpTool(async ({ discussionId }: { discussionId: string }) => jsonResult(await qoodle.getForumDiscussion(discussionId)))
);

server.registerTool(
    'get_resource_info',
    {
        title: 'Resolver URL de un recurso',
        description: 'Resuelve la URL real (pluginfile.php) y el nombre de archivo de un recurso de Qoodle (mod/resource) sin descargarlo.',
        inputSchema: { resourceId: moodleIdSchema.describe('ID del recurso (cmid), el que aparece en mod/resource/view.php?id=XXXXX') }
    },
    mcpTool(async ({ resourceId }: { resourceId: string }) => jsonResult(await qoodle.resolveResource(resourceId)))
);

server.registerTool(
    'get_resource_text',
    {
        title: 'Leer el texto de un recurso PDF',
        description: 'Descarga un recurso PDF de Qoodle (mod/resource) y devuelve su texto plano, sin guardar nada en disco. Ideal para leer el contenido de una clase directamente.',
        inputSchema: { resourceId: moodleIdSchema.describe('ID del recurso (cmid), el que aparece en mod/resource/view.php?id=XXXXX') }
    },
    mcpTool(async ({ resourceId }: { resourceId: string }) => {
        const result = await qoodle.getResourceText(resourceId);
        return textResult(`# ${result.filename}\n\n${result.text}`);
    })
);

server.registerTool(
    'download_resource',
    {
        title: 'Descargar un recurso (PDF, etc.)',
        description: 'Descarga a disco el archivo real de un recurso de Qoodle (por ejemplo un PDF) en la carpeta downloads/ del proyecto, y devuelve la ruta local.',
        inputSchema: { resourceId: moodleIdSchema.describe('ID del recurso (cmid), el que aparece en mod/resource/view.php?id=XXXXX') }
    },
    mcpTool(async ({ resourceId }: { resourceId: string }) => {
        const downloadsDir = path.join(__dirname, '../downloads');
        const file = await qoodle.downloadResource(resourceId, downloadsDir);
        return jsonResult(file);
    })
);

server.registerTool(
    'get_assignment_info',
    {
        title: 'Ver estado de una tarea (assign) de Qoodle',
        description: 'Devuelve la info de la página de una tarea (mod/assign) a partir de su id: fecha de entrega, si ya se entregó o no, formato de la entrega (archivo/texto en línea), y estado de revisión/calificación si está disponible.',
        inputSchema: { assignmentId: moodleIdSchema.describe('ID de la tarea (cmid), el que aparece en mod/assign/view.php?id=XXXXX') }
    },
    mcpTool(async ({ assignmentId }: { assignmentId: string }) => jsonResult(await qoodle.getAssignmentInfo(assignmentId)))
);

const transport = new StdioServerTransport();
await server.connect(transport);
