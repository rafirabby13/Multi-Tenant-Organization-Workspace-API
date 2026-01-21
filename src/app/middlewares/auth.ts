import { NextFunction, Request, Response } from "express"
import httpStatus from "http-status";
import { AppError } from "../errors/AppError";
import { jwtHelper } from "../helpers/jwtHelper";
import { config } from "../../config";

const auth = (...roles: string[]) => {
    return async (req: Request & { user?: any }, res: Response, next: NextFunction) => {
        try {
            // const token = req.cookies.get("accessToken");

            // const token = await req.cookies?.accessToken
            let token: string | undefined;
            console.log({roles})

            console.log(".........", {req})

            const authHeader = req.headers?.authorization;
            if (authHeader && authHeader.startsWith("Bearer")) {
                token = authHeader.split(" ")[1];
            }

            else if (req.cookies?.accessToken) {
                token = req.cookies.accessToken;
            }


            if (!token) {
                throw new AppError(httpStatus.BAD_REQUEST, "You are not authorized!")
            }

            const verifyUser = jwtHelper.verifyToken(token, config.jwt_secret as string);

            req.user = verifyUser;

            if (roles.length && !roles.includes(verifyUser.role)) {
                throw new Error("You are not authorized!")
            }

            next();
        }
        catch (err) {
            next(err)
        }
    }
}

export default auth;