import axios, { AxiosInstance } from 'axios';
import { wrapper } from 'axios-cookiejar-support';
import { CookieJar } from 'tough-cookie';

export function createHttpClient(existingJar?: CookieJar): { client: AxiosInstance; jar: CookieJar } {
    const jar = existingJar || new CookieJar();

    const client = wrapper(axios.create({
        jar,
        withCredentials: true,
        maxRedirects: 15,
        timeout: 30000,
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
    }));

    return { client, jar };
}
