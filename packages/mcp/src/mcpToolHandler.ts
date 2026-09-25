import { isAppError } from 'qoodle-sdk';

type ToolResult = { content: { type: 'text'; text: string }[]; isError?: boolean };

/**
 * Envuelve el handler de una tool MCP: convierte errores de dominio (AppError) y cualquier
 * excepción inesperada en una respuesta de error legible para el modelo, en vez de tirar
 * abajo la llamada sin explicación.
 */
export function mcpTool<Args>(handler: (args: Args) => Promise<ToolResult>) {
    return async (args: Args): Promise<ToolResult> => {
        try {
            return await handler(args);
        } catch (err) {
            const message = isAppError(err) ? err.message : (err as Error)?.message || 'Error desconocido';
            return { content: [{ type: 'text', text: `Error: ${message}` }], isError: true };
        }
    };
}

export function textResult(text: string): ToolResult {
    return { content: [{ type: 'text', text }] };
}

export function jsonResult(data: unknown): ToolResult {
    return textResult(JSON.stringify(data, null, 2));
}
