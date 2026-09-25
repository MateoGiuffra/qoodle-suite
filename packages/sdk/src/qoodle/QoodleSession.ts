import { AxiosInstance } from 'axios';
import { CookieJar } from 'tough-cookie';
import { UnauthorizedError, UpstreamError } from '../errors/AppError.js';
import { createHttpClient } from './httpClient.js';
import { QoodleAuth } from './QoodleAuth.js';
import { performSamlLogin } from './samlAuth.js';

const QOODLE_HOME = 'https://qoodle.uvq.edu.ar/my/';

function looksLikeLoginPage(html: unknown): boolean {
    return typeof html === 'string' && html.includes('loginform') && html.includes('AuthState');
}

/**
 * Encapsula el estado de una sesión autenticada contra Qoodle: el cookie jar,
 * el cliente HTTP y si ya se hizo el handshake SAML. Una instancia por usuario/proceso
 * (en el server HTTP vive en `req.session`, en el MCP vive una sola vez, de por vida del proceso).
 */
export class QoodleSession implements QoodleAuth {
    readonly httpClient: AxiosInstance;
    readonly cookieJar: CookieJar;
    private loggedIn = false;

    constructor(private readonly username: string, private readonly password: string, existingJar?: CookieJar) {
        const { client, jar } = createHttpClient(existingJar);
        this.httpClient = client;
        this.cookieJar = jar;
    }

    async ensureLogin(force = false): Promise<void> {
        if (this.loggedIn && !force) return;

        try {
            await performSamlLogin(this.httpClient, this.username, this.password, QOODLE_HOME);
            this.loggedIn = true;
        } catch (err) {
            throw new UnauthorizedError('No se pudo iniciar sesión en Qoodle: revisá el usuario y la contraseña', err);
        }
    }

    /** GET autenticado, con un reintento de login si la sesión venció en el medio. */
    async authedGet(url: string): Promise<string> {
        await this.ensureLogin();

        const res = await this.httpClient.get(url).catch((err) => {
            throw new UpstreamError(`Falló la petición a Qoodle (${url})`, err);
        });

        if (looksLikeLoginPage(res.data)) {
            this.loggedIn = false;
            await this.ensureLogin(true);
            const retry = await this.httpClient.get(url).catch((err) => {
                throw new UpstreamError(`Falló la petición a Qoodle luego de reloguear (${url})`, err);
            });
            return retry.data as string;
        }

        return res.data as string;
    }
}
