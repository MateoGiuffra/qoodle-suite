import { AxiosInstance } from 'axios';
import fs from 'fs';
import path from 'path';
import { NotFoundError } from '../errors/AppError.js';

export interface ResolvedResource {
    fileUrl: string;
    filename: string;
}

/**
 * Resuelve la URL real del archivo (pluginfile.php) detrás de mod/resource/view.php,
 * sin descargar el contenido todavía.
 */
export async function resolveResourceUrl(client: AxiosInstance, resourceId: string): Promise<ResolvedResource> {
    const viewUrl = `https://qoodle.uvq.edu.ar/mod/resource/view.php?id=${encodeURIComponent(resourceId)}`;
    const res = await client.get(viewUrl, { maxRedirects: 0, validateStatus: () => true });

    let fileUrl: string | undefined = res.headers.location as string | undefined;

    if (!fileUrl) {
        // Algunos recursos (páginas embebidas) no redirigen: buscamos el link directo en el HTML.
        const cheerio = await import('cheerio');
        const $ = cheerio.load(res.data as string);
        fileUrl = $('object[data*="pluginfile.php"]').attr('data')
            || $('a[href*="pluginfile.php"]').first().attr('href')
            || $('iframe[src*="pluginfile.php"]').attr('src');
    }

    if (!fileUrl) {
        throw new NotFoundError(`No se pudo resolver el archivo del recurso ${resourceId}`);
    }

    const filename = decodeURIComponent(fileUrl.split('/').pop()!.split('?')[0]);
    return { fileUrl, filename };
}

export interface DownloadedResource extends ResolvedResource {
    path: string;
    contentType: string;
    size: number;
}

/**
 * Descarga el archivo real a disco (carpeta downloads/ del proyecto) y devuelve su ubicación.
 */
export async function downloadResource(client: AxiosInstance, resourceId: string, destDir: string): Promise<DownloadedResource> {
    const { fileUrl, filename } = await resolveResourceUrl(client, resourceId);

    const fileRes = await client.get(fileUrl, { responseType: 'arraybuffer' });
    const buffer = Buffer.from(fileRes.data as ArrayBuffer);

    fs.mkdirSync(destDir, { recursive: true });
    const destPath = path.join(destDir, `${resourceId}_${filename}`);
    fs.writeFileSync(destPath, buffer);

    return {
        fileUrl,
        filename,
        path: destPath,
        contentType: (fileRes.headers['content-type'] as string) || 'application/octet-stream',
        size: buffer.length
    };
}
