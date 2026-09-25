import 'dotenv/config';
import { z } from 'zod';

const envSchema = z.object({
    PORT: z.coerce.number().int().positive().default(3600),
    SESSION_SECRET: z.string().min(1).default('qoodle-mcp-secret')
});

export const env = envSchema.parse(process.env);
