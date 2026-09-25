import axios from 'axios';
import { UpstreamError, ValidationError } from '../errors/AppError.js';

export interface SheetResult {
    sheetId: string;
    headers: string[];
    rows: string[][];
    csv: string;
}

function extractSheetId(idOrUrl: string): string {
    const match = idOrUrl.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
    if (match) return match[1];
    if (/^[a-zA-Z0-9-_]{20,}$/.test(idOrUrl)) return idOrUrl;
    throw new ValidationError(`No se pudo extraer un id de Google Sheets de: ${idOrUrl}`);
}

function parseCsv(csv: string): string[][] {
    // Parser simple de CSV con soporte de comillas y saltos de línea dentro de campos.
    const rows: string[][] = [];
    let row: string[] = [];
    let field = '';
    let inQuotes = false;

    for (let i = 0; i < csv.length; i++) {
        const char = csv[i];
        const next = csv[i + 1];

        if (inQuotes) {
            if (char === '"' && next === '"') { field += '"'; i++; }
            else if (char === '"') { inQuotes = false; }
            else { field += char; }
        } else {
            if (char === '"') inQuotes = true;
            else if (char === ',') { row.push(field); field = ''; }
            else if (char === '\r') { /* ignore */ }
            else if (char === '\n') { row.push(field); rows.push(row); row = []; field = ''; }
            else field += char;
        }
    }
    if (field.length > 0 || row.length > 0) { row.push(field); rows.push(row); }
    return rows.filter((r) => r.some((c) => c.trim().length > 0));
}

/**
 * Lee una Google Sheet pública ("cualquiera con el link puede ver") como CSV,
 * sin necesidad de autenticación ni de un MCP de Google Drive.
 */
export async function getPublicSheetCsv(idOrUrl: string, gid?: string): Promise<SheetResult> {
    const sheetId = extractSheetId(idOrUrl);
    const gidParam = gid ? `&gid=${encodeURIComponent(gid)}` : '';
    const exportUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv${gidParam}`;

    const res = await axios.get(exportUrl, { maxRedirects: 5, responseType: 'text' }).catch((err) => {
        throw new UpstreamError(`No se pudo descargar la Google Sheet ${sheetId}`, err);
    });
    const csv = res.data as string;

    if (typeof csv !== 'string' || csv.trim().startsWith('<!DOCTYPE') || csv.trim().startsWith('<html')) {
        throw new ValidationError('La hoja no es pública (o requiere permisos): no se pudo exportar como CSV.');
    }

    const parsed = parseCsv(csv);
    const [headers, ...rows] = parsed;

    return { sheetId, headers: headers || [], rows, csv };
}
