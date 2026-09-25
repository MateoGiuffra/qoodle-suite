import 'dotenv/config';
import { z } from 'zod';

const envSchema = z.object({
    CAMPUS_USERNAME: z.string().min(1, 'Falta CAMPUS_USERNAME en el entorno'),
    CAMPUS_PASSWORD: z.string().min(1, 'Falta CAMPUS_PASSWORD en el entorno')
});

function loadEnv() {
    const parsed = envSchema.safeParse(process.env);
    if (!parsed.success) {
        console.error('Faltan CAMPUS_USERNAME / CAMPUS_PASSWORD en el entorno del servidor MCP.');
        process.exit(1);
    }
    return parsed.data;
}

export const env = loadEnv();
