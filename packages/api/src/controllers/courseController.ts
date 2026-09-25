import { Request, Response } from 'express';
import { getQoodleClient } from '../middleware/session.js';
import { courseClassificationSchema, moodleIdSchema } from 'qoodle-sdk';

export async function listCourses(req: Request, res: Response) {
    const classification = courseClassificationSchema.parse(req.query.classification);
    const { client, persist } = getQoodleClient(req);

    const courses = await client.listCourses(classification);
    persist();
    res.json({ classification, courses });
}

export async function getCourseContent(req: Request, res: Response) {
    const courseId = moodleIdSchema.parse(req.params.id);
    const { client, persist } = getQoodleClient(req);

    const content = await client.getCourseContent(courseId);
    persist();
    res.json(content);
}
