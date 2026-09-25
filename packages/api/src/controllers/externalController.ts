import { Request, Response } from 'express';
import { getPublicSheetCsv, getYoutubeTranscript, googleSheetSchema, youtubeVideoSchema } from 'qoodle-sdk';

export async function youtubeTranscript(req: Request, res: Response) {
    const video = youtubeVideoSchema.parse(req.query.url);
    const result = await getYoutubeTranscript(video);
    res.json(result);
}

export async function googleSheet(req: Request, res: Response) {
    const { url, gid } = googleSheetSchema.parse({ url: req.query.url, gid: req.query.gid });
    const result = await getPublicSheetCsv(url, gid);
    res.json(result);
}
