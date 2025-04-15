import jwt from "jsonwebtoken";
import { createError } from "../error.js";
import { promisify } from "util";

const verifyAsync = promisify(jwt.verify);

export const verifyToken = async (req, res, next) => {
    try {
        if (!req.headers.authorization) {
            return next(createError(401, "Unauthorized: No token provided"));
        }

        const token = req.headers.authorization.split(" ")[1];
        if (!token) {
            return next(createError(401, "Unauthorized: Invalid token format"));
        }

        const JWT_SECRET = process.env.JWT_SECRET || "9fb275dc4669a53bd3151d9ec955d6450d65ea3ae97f89a4650cb68549a607928c88dcdbaf28dea5b9017a1447d89bc4f9037d90b8eef0068faf5d6597bce129";
        const decoded = await verifyAsync(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        if (err.name === "JsonWebTokenError") {
            return next(createError(403, "Forbidden: Invalid token"));
        } else if (err.name === "TokenExpiredError") {
            return next(createError(401, "Unauthorized: Token expired"));
        }
        next(createError(500, "Internal server error"));
    }
};