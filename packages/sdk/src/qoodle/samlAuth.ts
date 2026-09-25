import * as cheerio from 'cheerio';
import { AxiosInstance } from 'axios';

const FORM_HEADERS = {
    'Content-Type': 'application/x-www-form-urlencoded',
    'Accept': 'text/html'
};

/**
 * Ejecuta el handshake SAML (SimpleSAMLphp) contra acceso.uvq.edu.ar
 * partiendo de cualquier URL protegida de Qoodle, y deja al cliente
 * con la sesión de Moodle ya establecida.
 */
export async function performSamlLogin(client: AxiosInstance, username: string, password: string, targetUrl: string): Promise<string> {
    // Paso 1: pedir el recurso protegido -> redirige al IdP con AuthState
    const resTrigger = await client.get(targetUrl, { headers: { Accept: 'text/html' } });
    const $login = cheerio.load(resTrigger.data);
    const authState = $login('input[name="AuthState"]').val() as string | undefined;
    const loginPostUrl = (resTrigger.request?.res?.responseUrl as string) || targetUrl;

    if (!authState) {
        throw new Error('No se pudo obtener AuthState del IdP (¿la sesión ya estaba logueada, o cambió el flujo?)');
    }

    // Paso 2: POST de credenciales al IdP
    const loginPayload = new URLSearchParams({
        username,
        password,
        AuthState: authState,
        'wp-submit': 'Ingresar'
    });

    const resIdp = await client.post(loginPostUrl, loginPayload.toString(), {
        headers: { ...FORM_HEADERS, Referer: loginPostUrl }
    });

    const $saml = cheerio.load(resIdp.data);
    const samlResponse = $saml('input[name="SAMLResponse"]').val() as string | undefined;
    const relayState = $saml('input[name="RelayState"]').val() as string | undefined;
    let acsAction = $saml('form').attr('action');

    if (!samlResponse) {
        throw new Error('Credenciales inválidas: no se generó SAMLResponse');
    }

    if (acsAction && !acsAction.startsWith('http')) {
        const base = new URL((resIdp.request?.res?.responseUrl as string) || loginPostUrl).origin;
        acsAction = new URL(acsAction, base).href;
    }
    if (!acsAction) {
        throw new Error('No se encontró la URL de ACS (Assertion Consumer Service) en la respuesta del IdP');
    }

    // Paso 3: POST del SAMLResponse al ACS de Qoodle -> establece sesión Moodle
    const acsPayload = new URLSearchParams({ SAMLResponse: samlResponse });
    if (relayState) acsPayload.append('RelayState', relayState);

    const resFinal = await client.post(acsAction, acsPayload.toString(), { headers: FORM_HEADERS });

    return resFinal.data as string;
}
