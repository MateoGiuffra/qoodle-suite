import { Request, Response } from 'express';
import { getQoodleClient } from '../middleware/session.js';
import { moodleIdSchema } from 'qoodle-sdk';

export async function getForumDiscussions(req: Request, res: Response) {
    const forumId = moodleIdSchema.parse(req.params.id);
    const { client, persist } = getQoodleClient(req);

    const result = await client.getForumDiscussions(forumId);
    persist();
    res.json(result);
}

export async function getForumDiscussion(req: Request, res: Response) {
    const discussionId = moodleIdSchema.parse(req.params.id);
    const { client, persist } = getQoodleClient(req);

    const result = await client.getForumDiscussion(discussionId);
    persist();
    res.json(result);
}
