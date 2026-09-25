import { YoutubeTranscript } from 'youtube-transcript';
import { UpstreamError, ValidationError } from '../errors/AppError.js';

export interface TranscriptResult {
    videoId: string;
    text: string;
    segments: { text: string; offsetMs: number; durationMs: number }[];
}

function extractVideoId(idOrUrl: string): string {
    const match = idOrUrl.match(/(?:youtu\.be\/|v=|\/embed\/|\/shorts\/)([a-zA-Z0-9_-]{11})/);
    if (match) return match[1];
    if (/^[a-zA-Z0-9_-]{11}$/.test(idOrUrl)) return idOrUrl;
    throw new ValidationError(`No se pudo extraer un video id de: ${idOrUrl}`);
}

/**
 * Trae la transcripción pública de un video de YouTube (subtítulos), a partir
 * de su id o de cualquier URL (youtu.be, watch?v=, embed, shorts).
 */
export async function getYoutubeTranscript(idOrUrl: string): Promise<TranscriptResult> {
    const videoId = extractVideoId(idOrUrl);

    const items = await YoutubeTranscript.fetchTranscript(videoId).catch((err) => {
        throw new UpstreamError(`No se pudo obtener la transcripción del video ${videoId}`, err);
    });

    return {
        videoId,
        text: items.map((i) => i.text).join(' '),
        segments: items.map((i) => ({ text: i.text, offsetMs: i.offset, durationMs: i.duration }))
    };
}
