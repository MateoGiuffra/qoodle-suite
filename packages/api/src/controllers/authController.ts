import { Request, Response } from 'express';
import { CookieJar } from 'tough-cookie';
import { UnauthorizedError, ValidationError, createHttpClient, performSamlLogin } from 'qoodle-sdk';

const QOODLE_HOME = 'https://qoodle.uvq.edu.ar/my/';

export async function login(req: Request, res: Response) {
    const { username, password } = req.body || {};
    if (!username || !password) {
        throw new ValidationError('Usuario y contraseña requeridos');
    }

    const jar = new CookieJar();
    const { client } = createHttpClient(jar);

    await performSamlLogin(client, username, password, QOODLE_HOME).catch((err) => {
        throw new UnauthorizedError('Fallo en autenticación', err);
    });

    req.session.user = { username };
    req.session.qoodleCookies = jar.toJSON();

    await new Promise<void>((resolve, reject) => {
        req.session.save((err) => (err ? reject(err) : resolve()));
    });

    res.json({ message: 'Login exitoso', user: username });
}

export function me(req: Request, res: Response) {
    if (req.session.user) return res.json({ loggedIn: true, user: req.session.user });
    res.status(401).json({ loggedIn: false });
}

export function logout(req: Request, res: Response) {
    req.session.destroy(() => res.json({ message: 'Sesión cerrada' }));
}
