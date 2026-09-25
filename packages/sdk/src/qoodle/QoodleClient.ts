import { CourseContent, parseCourse } from '../parsers/courseParser.js';
import { AssignmentInfo, parseAssignmentView } from '../parsers/assignmentParser.js';
import { DiscussionContent, ForumDiscussionList, parseDiscussion, parseForumView } from '../parsers/forumParser.js';
import { CourseClassification, CourseSummary, listCourses } from './courseListService.js';
import { DownloadedResource, ResolvedResource, downloadResource, resolveResourceUrl } from './resourceService.js';
import { ResourceText, getResourceText } from './resourceTextService.js';
import { QoodleAuth } from './QoodleAuth.js';

const BASE_URL = 'https://qoodle.uvq.edu.ar';

/**
 * Fachada de dominio: agrupa todas las operaciones sobre Qoodle detrás de una sesión ya
 * autenticada. Es el único punto que server.ts (HTTP) y mcpServer.ts (MCP) deberían tocar
 * para hablar con Qoodle — evita repetir la lógica de "armar la URL + pedir + parsear" dos veces.
 */
export class QoodleClient {
    constructor(private readonly session: QoodleAuth) {}

    async listCourses(classification: CourseClassification = 'inprogress'): Promise<CourseSummary[]> {
        await this.session.ensureLogin();
        return listCourses(this.session.httpClient, classification);
    }

    async getCourseContent(courseId: string): Promise<CourseContent> {
        const html = await this.session.authedGet(`${BASE_URL}/course/view.php?id=${encodeURIComponent(courseId)}`);
        return parseCourse(html);
    }

    async getForumDiscussions(forumId: string): Promise<ForumDiscussionList> {
        const html = await this.session.authedGet(`${BASE_URL}/mod/forum/view.php?id=${encodeURIComponent(forumId)}`);
        return parseForumView(html);
    }

    async getForumDiscussion(discussionId: string): Promise<DiscussionContent> {
        const html = await this.session.authedGet(`${BASE_URL}/mod/forum/discuss.php?d=${encodeURIComponent(discussionId)}`);
        return parseDiscussion(html);
    }

    async resolveResource(resourceId: string): Promise<ResolvedResource> {
        await this.session.ensureLogin();
        return resolveResourceUrl(this.session.httpClient, resourceId);
    }

    async downloadResource(resourceId: string, destDir: string): Promise<DownloadedResource> {
        await this.session.ensureLogin();
        return downloadResource(this.session.httpClient, resourceId, destDir);
    }

    async getResourceText(resourceId: string): Promise<ResourceText> {
        await this.session.ensureLogin();
        return getResourceText(this.session.httpClient, resourceId);
    }

    async getAssignmentInfo(assignmentId: string): Promise<AssignmentInfo> {
        const html = await this.session.authedGet(`${BASE_URL}/mod/assign/view.php?id=${encodeURIComponent(assignmentId)}&action=view`);
        return parseAssignmentView(html);
    }
}
