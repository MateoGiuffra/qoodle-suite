import { AxiosInstance } from 'axios';
import { UpstreamError } from '../errors/AppError.js';

export type CourseClassification = 'all' | 'inprogress' | 'future' | 'past';

export interface CourseSummary {
    id: number;
    fullname: string;
    viewurl: string;
    visible: boolean;
    hidden: boolean;
    isfavourite: boolean;
    hasprogress: boolean;
    progress: number;
    startdate: number;
    enddate: number;
}

async function getSesskey(client: AxiosInstance): Promise<string> {
    const res = await client.get('https://qoodle.uvq.edu.ar/my/');
    const html = res.data as string;
    const match = html.match(/"sesskey"\s*:\s*"([^"]+)"/) || html.match(/sesskey=([a-zA-Z0-9]+)/);
    if (!match) throw new UpstreamError('No se pudo obtener el sesskey (¿la sesión de Moodle expiró?)');
    return match[1];
}

/**
 * Lista las aulas (cursos) del usuario, usando el mismo endpoint AJAX que
 * alimenta el dashboard "/my/" de Moodle. Sirve para cualquier aula, no
 * depende de ningún curso en particular.
 */
export async function listCourses(client: AxiosInstance, classification: CourseClassification = 'all'): Promise<CourseSummary[]> {
    const sesskey = await getSesskey(client);

    const payload = [{
        index: 0,
        methodname: 'core_course_get_enrolled_courses_by_timeline_classification',
        args: { classification, limit: 0, offset: 0, sort: 'fullname' }
    }];

    const res = await client.post(
        `https://qoodle.uvq.edu.ar/lib/ajax/service.php?sesskey=${sesskey}&info=core_course_get_enrolled_courses_by_timeline_classification`,
        JSON.stringify(payload),
        { headers: { 'Content-Type': 'application/json' } }
    );

    const body = res.data as Array<{ error: boolean; exception?: { message: string }; data?: { courses: any[] } }>;
    if (body[0]?.error) {
        throw new UpstreamError(body[0].exception?.message || 'Moodle devolvió un error al listar los cursos');
    }

    return (body[0].data?.courses || []).map((c) => ({
        id: c.id,
        fullname: c.fullname,
        viewurl: c.viewurl,
        visible: c.visible,
        hidden: c.hidden,
        isfavourite: c.isfavourite,
        hasprogress: c.hasprogress,
        progress: c.progress,
        startdate: c.startdate,
        enddate: c.enddate
    }));
}
