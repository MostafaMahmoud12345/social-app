import { AppError } from "../error/error";
import jwt from "jsonwebtoken";
import { env } from "../config/env";
export function authGuard(req, res, next) {
    try {
        const token = req.cookies.access_token;
        ;
        if (!token)
            throw new AppError('no token provided', 403);
        req.user = jwt.verify(token, env.jwt.accessSecret);
        next();
    }
    catch (error) {
        next(error);
    }
}
