import * as cheerio from 'cheerio';

export interface AssignmentFile {
    name: string;
    url: string | null;
}

export interface AssignmentInfo {
    title: string;
    fields: Record<string, string>;
    dueDate: string | null;
    submissionStatus: string | null;
    gradingStatus: string | null;
    submittedFiles: AssignmentFile[];
    onlineText: string | null;
    feedback: string | null;
}

/** Busca en `fields` la primera clave que matchee alguno de los patrones (case-insensitive, ES/EN). */
function findField(fields: Record<string, string>, patterns: RegExp[]): string | null {
    for (const key of Object.keys(fields)) {
        if (patterns.some((p) => p.test(key))) {
            return fields[key];
        }
    }
    return null;
}

export function parseAssignmentView(html: string): AssignmentInfo {
    const $ = cheerio.load(html);

    const title = $('h2, h1').first().text().trim() || $('title').text().trim();

    const fields: Record<string, string> = {};

    // Moodle pinta el estado de la entrega en tablas .generaltable con filas th/td.
    $('table.generaltable tr, table.submissionstatustable tr').each((_, row) => {
        const $row = $(row);
        const key = $row.find('th').first().text().trim();
        const $td = $row.find('td').first();
        if (!key || $td.length === 0) return;
        const value = $td.text().replace(/\s+/g, ' ').trim();
        if (value) fields[key] = value;
    });

    const submittedFiles: AssignmentFile[] = [];
    $('.fileuploadsubmission a, .submissionfilessubmission a, a.fp-filename-icon, .filemanager a').each((_, el) => {
        const $a = $(el);
        const name = $a.text().trim();
        const url = $a.attr('href') || null;
        if (name) submittedFiles.push({ name, url });
    });

    const onlineText = $('.submissiononlinetext, .onlinetext, .textsubmission').first().text().trim() || null;

    const feedback = $('.feedbacktext, .gradefeedback, .commentscontent').first().text().replace(/\s+/g, ' ').trim() || null;

    const dueDate = findField(fields, [/fecha de entrega/i, /due date/i]);
    const submissionStatus = findField(fields, [/estado de la entrega/i, /submission status/i]);
    const gradingStatus = findField(fields, [/estado de.*calificaci/i, /grading status/i]);

    return {
        title,
        fields,
        dueDate,
        submissionStatus,
        gradingStatus,
        submittedFiles,
        onlineText: onlineText || null,
        feedback: feedback || null
    };
}
