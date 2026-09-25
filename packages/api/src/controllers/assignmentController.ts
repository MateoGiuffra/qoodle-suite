import { Request, Response } from 'express';
import { getQoodleClient } from '../middleware/session.js';
import { moodleIdSchema } from 'qoodle-sdk';

export async function getAssignmentInfo(req: Request, res: Response) {
    const assignmentId = moodleIdSchema.parse(req.params.id);
    const { client, persist } = getQoodleClient(req);

    const info = await client.getAssignmentInfo(assignmentId);
    persist();
    res.json(info);
}
