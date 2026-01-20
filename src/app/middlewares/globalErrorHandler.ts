import { NextFunction, Request, Response } from "express"
import httpStatus from "http-status"
import { ZodError } from "zod";
import { Prisma } from "../../../prisma/generated/prisma/client";

const globalErrorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    console.log(err)
    let statusCode = err.statusCode || httpStatus.INTERNAL_SERVER_ERROR;
    let success = false;
    let message = err.message || "Something went wrong!";
    let error = err;

    if (err instanceof ZodError) {
        statusCode = httpStatus.BAD_REQUEST;
        message = "Validation Error";

        error = err.issues.map((issue) => {
            return {
                field: issue.path[issue.path.length - 1], // e.g. "password"
                message: issue.message
            }
        });
    }
    else if (err instanceof Prisma.PrismaClientKnownRequestError) {
        if (err.code === 'P2002') {
            statusCode = httpStatus.CONFLICT; // 409
            message = "Duplicate Entry";
            error = [
                {
                    field: err.meta?.target,
                    message: `This ${err.meta?.target} already exists.`
                }
            ];
        }
    }
    else if (err.name === 'JsonWebTokenError') {
        statusCode = httpStatus.UNAUTHORIZED;
        message = "Invalid Token";
        error = [{ field: "", message: "Unauthorized access" }];
    }
    else if (err.name === 'TokenExpiredError') {
        statusCode = httpStatus.UNAUTHORIZED;
        message = "Token Expired";
        error = [{ field: "", message: "Your session has expired. Login again." }];
    }

    res.status(statusCode).json({
        success,
        message,
        error
    })
};

export default globalErrorHandler;