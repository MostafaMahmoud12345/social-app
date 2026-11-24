import { NextFunction,Request,Response } from "express";
import { AppError } from "./error";

export function globalErrorHandler(err:AppError, req:Request, res:Response, _next:NextFunction) {



    if (err.isOperational === true) {
        return res.status(err.statusCode).json({
            message: err.message,
            success: false,
        });
    }
    return res.status(500).json({
        message: 'Something went wrong', success: false,
    });
}