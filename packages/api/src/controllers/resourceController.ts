import { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { getQoodleClient } from '../middleware/session.js';
import { moodleIdSchema } from 'qoodle-sdk';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DOWNLOADS_DIR = path.join(__dirname, '../../downloads');

export async function resolveResource(req: Request, res: Response) {
    const resourceId = moodleIdSchema.parse(req.params.id);
    const { client, persist } = getQoodleClient(req);

    const resolved = await client.resolveResource(resourceId);
    persist();
    res.json(resolved);
}

export async function getResourceText(req: Request, res: Response) {
    const resourceId = moodleIdSchema.parse(req.params.id);
    const { client, persist } = getQoodleClient(req);

    const result = await client.getResourceText(resourceId);
    persist();
    res.json(result);
}

export async function downloadResource(req: Request, res: Response) {
    const resourceId = moodleIdSchema.parse(req.params.id);
    const { client, persist } = getQoodleClient(req);

    const file = await client.downloadResource(resourceId, DOWNLOADS_DIR);
    persist();
    res.download(file.path, file.filename);
}
