import { ApiError } from "@/utils/apiError";
import type{ NextFunction, Request, Response } from "express";

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
    if (res.headersSent) {
        return next(err);
    }

    if (err instanceof ApiError) {
        res.status(err.statusCode).json({
            success: false,
            message: err.message,
            errors: err.errors,
        });
    } else {
        res.status(500).json({
            success: false,
            message: err.message,
            errors: [],
        });
    }

};