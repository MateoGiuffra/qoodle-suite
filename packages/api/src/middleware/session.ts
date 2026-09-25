import { NextFunction, Request, Response } from 'express';
import { CookieJar } from 'tough-cookie';
import { QoodleClient, StaticSession, UnauthorizedError } from 'qoodle-sdk';

declare module 'express-session' {
    interface SessionData {
        user?: { username: string };
        qoodleCookies?: unknown;
    }
}

/** Corta la request si todavía no se hizo `/api/login` en esta sesión de Express. */
export function requireAuth(req: Request, _res: Response, next: NextFunction) {
    if (!req.session.user) {
        return next(new UnauthorizedError('No autorizado: inicie sesión en /api/login'));
    }
    next();
}

/**
 * Arma un QoodleClient a partir de las cookies guardadas en la sesión de Express,
 * y devuelve una función `persist()` para volver a guardarlas después (por si Moodle
 * las renovó durante la request).
 */
export function getQoodleClient(req: Request): { client: QoodleClient; persist: () => void } {
    const jar = req.session.qoodleCookies
        ? CookieJar.fromJSON(JSON.stringify(req.session.qoodleCookies))
        : new CookieJar();

    const session = new StaticSession(jar);
    const client = new QoodleClient(session);
    const persist = () => { req.session.qoodleCookies = jar.toJSON(); };

    return { client, persist };
}
