import { AxiosInstance } from 'axios';
import { CookieJar } from 'tough-cookie';
import { UnauthorizedError, UpstreamError } from '../errors/AppError.js';
import { createHttpClient } from './httpClient.js';
import { QoodleAuth } from './QoodleAuth.js';

function looksLikeLoginPage(html: unknown): boolean {
    return typeof html === 'string' && html.includes('loginform') && html.includes('AuthState');
}

/**
 * Sesión "de una sola vez": envuelve cookies ya logueadas (por `/api/login`) sin guardar la
 * contraseña del usuario. Si la sesión de Moodle expiró, no puede reloguear sola (no tiene
 * las credenciales) — pide explícitamente que el usuario pase de nuevo por `/api/login`.
 */
export class StaticSession implements QoodleAuth {
    readonly httpClient: AxiosInstance;

    constructor(cookieJar: CookieJar) {
        this.httpClient = createHttpClient(cookieJar).client;
    }

    async ensureLogin(): Promise<void> {
        // El login ya ocurrió en /api/login; acá no hay credenciales para reintentarlo.
    }

    async authedGet(url: string): Promise<string> {
        const res = await this.httpClient.get(url).catch((err) => {
            throw new UpstreamError(`Falló la petición a Qoodle (${url})`, err);
        });

        if (looksLikeLoginPage(res.data)) {
            throw new UnauthorizedError('La sesión de Qoodle expiró, volvé a loguearte en /api/login');
        }

        return res.data as string;
    }
}
