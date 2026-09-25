import cors from 'cors';
import express from 'express';
import session from 'express-session';
import fs from 'fs';
import path from 'path';
import swaggerUi from 'swagger-ui-express';
import { fileURLToPath } from 'url';
import YAML from 'yaml';
import { env } from './env.js';
import { errorHandler } from './middleware/errorHandler.js';
import { router } from './routes/index.js';
import './middleware/session.js'; // registra los tipos de SessionData

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(session({
    secret: env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, maxAge: 1000 * 60 * 60 }
}));

const openapiDoc = YAML.parse(fs.readFileSync(path.join(__dirname, '../openapi.yaml'), 'utf-8'));
app.use('/docs', swaggerUi.serve, swaggerUi.setup(openapiDoc));
app.get('/openapi.json', (_req, res) => res.json(openapiDoc));

app.use('/api', router);

app.use(errorHandler);

app.listen(env.PORT, () => {
    console.log(`qoodle-mcp escuchando en http://localhost:${env.PORT}`);
    console.log(`Swagger docs en http://localhost:${env.PORT}/docs`);
});
