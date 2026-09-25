import { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';
import { isAppError } from 'qoodle-sdk';

/** Middleware de error centralizado: traduce excepciones de dominio y de validación a respuestas HTTP consistentes. */
export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction) {
    if (isAppError(err)) {
        return res.status(err.statusCode).json({ error: err.code, message: err.message });
    }

    if (err instanceof ZodError) {
        return res.status(400).json({
            error: 'VALIDATION_ERROR',
            message: 'Datos de entrada inválidos',
            details: err.issues.map((i) => ({ path: i.path.join('.'), message: i.message }))
        });
    }

    console.error('Error no controlado:', err);
    res.status(500).json({ error: 'INTERNAL_ERROR', message: 'Error interno del servidor' });
}
