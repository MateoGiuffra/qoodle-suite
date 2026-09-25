import { NextFunction, Request, Response } from 'express';

type AsyncRouteHandler = (req: Request, res: Response, next: NextFunction) => Promise<unknown>;

/** Envuelve un controller async para que sus rechazos caigan en el errorHandler en vez de colgar el request. */
export function asyncHandler(handler: AsyncRouteHandler) {
    return (req: Request, res: Response, next: NextFunction) => {
        handler(req, res, next).catch(next);
    };
}
