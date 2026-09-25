import { AxiosInstance } from 'axios';

/**
 * Lo mínimo que necesita `QoodleClient` para hablar con Qoodle ya autenticado.
 * Dos implementaciones: `QoodleSession` (usuario fijo del .env, con re-login automático,
 * usada por el MCP) y `StaticSession` (cookies ya logueadas de un usuario cualquiera,
 * usada por el server HTTP multi-usuario, sin guardar su contraseña).
 */
export interface QoodleAuth {
    readonly httpClient: AxiosInstance;
    ensureLogin(force?: boolean): Promise<void>;
    authedGet(url: string): Promise<string>;
}
