import { z } from 'zod';

/** IDs de Moodle (cmid, courseId, discussionId) siempre son enteros positivos como string. */
export const moodleIdSchema = z.string().regex(/^\d+$/, 'Debe ser un id numérico (el que aparece en la URL de Qoodle)');

export const courseClassificationSchema = z.enum(['all', 'inprogress', 'future', 'past']).default('inprogress');

export const youtubeVideoSchema = z.string().min(1, 'Falta el id o la URL del video de YouTube');

export const googleSheetSchema = z.object({
    url: z.string().min(1, 'Falta el id o la URL de la Google Sheet'),
    gid: z.string().optional()
});
