/** Excepción base de la aplicación. Nunca se lanza directamente: siempre una subclase. */
export abstract class AppError extends Error {
    abstract readonly statusCode: number;
    abstract readonly code: string;

    constructor(message: string, readonly cause?: unknown) {
        super(message);
        this.name = new.target.name;
    }
}

/** Datos de entrada inválidos (params/query/body que no pasan la validación). */
export class ValidationError extends AppError {
    readonly statusCode = 400;
    readonly code = 'VALIDATION_ERROR';
}

/** No hay sesión / credenciales inválidas contra el IdP de Qoodle. */
export class UnauthorizedError extends AppError {
    readonly statusCode = 401;
    readonly code = 'UNAUTHORIZED';
}

/** El recurso pedido no existe o no se pudo resolver (ej: un resourceId que no resuelve a ningún archivo). */
export class NotFoundError extends AppError {
    readonly statusCode = 404;
    readonly code = 'NOT_FOUND';
}

/** Falló la comunicación con un servicio externo (Qoodle, YouTube, Google Sheets). */
export class UpstreamError extends AppError {
    readonly statusCode = 502;
    readonly code = 'UPSTREAM_ERROR';
}

export function isAppError(err: unknown): err is AppError {
    return err instanceof AppError;
}
