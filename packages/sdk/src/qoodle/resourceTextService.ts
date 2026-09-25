import { AxiosInstance } from 'axios';
import { PDFParse } from 'pdf-parse';
import { ValidationError } from '../errors/AppError.js';
import { resolveResourceUrl } from './resourceService.js';

export interface ResourceText {
    filename: string;
    text: string;
}

/**
 * Descarga un recurso (hoy: PDF) y devuelve su texto plano, sin guardarlo en disco.
 */
export async function getResourceText(client: AxiosInstance, resourceId: string): Promise<ResourceText> {
    const { fileUrl, filename } = await resolveResourceUrl(client, resourceId);

    if (!filename.toLowerCase().endsWith('.pdf')) {
        throw new ValidationError(`El recurso "${filename}" no es un PDF; extracción de texto no soportada para este tipo.`);
    }

    const fileRes = await client.get(fileUrl, { responseType: 'arraybuffer' });
    const buffer = Buffer.from(fileRes.data as ArrayBuffer);

    const parser = new PDFParse({ data: buffer });
    const result = await parser.getText();

    return { filename, text: result.text };
}
