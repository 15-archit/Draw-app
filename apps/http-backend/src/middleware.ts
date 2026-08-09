import { NextFunction, Request, Response } from "express";
import  jwt  from "jsonwebtoken";
import { JWT_SECRET } from "@repo/backend-common/config";

interface CustomRequest extends Request {
    userId?: string;
}

export function middleware(
    req: CustomRequest,
    res: Response,
    next: NextFunction
) {
    const token = req.headers["authorization"];

    if (!token) {
        return res.status(401).json({
            message: "Unauthorized",
        });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);

        req.userId = (decoded as jwt.JwtPayload).userId;

        next();
    } catch (error) {
        return res.status(401).json({
            message: "Invalid token",
        });
    }
}