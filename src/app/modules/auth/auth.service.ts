
import bcrypt from "bcryptjs";
import { jwtHelper } from "../../helpers/jwtHelper";
import { config } from "../../../config/index.env";
import { prisma } from "../../../lib/prisma";
import { UserStatus } from "../../../../prisma/generated/prisma/enums";
import { AppError } from "../../errors/AppError";

const login = async (payload: { email: string, password: string }) => {
    console.log({ payload })
    const user = await prisma.user.findUniqueOrThrow({
        where: {
            email: payload.email,
            status: UserStatus.ACTIVE
        },
    })
    const isCorrectPassword = await bcrypt.compare(payload.password, user.password);
    if (!isCorrectPassword) {
        throw new AppError(401, "Invalid credentials");
    }
    const tokenPayload = {
        id: user.id,
        email: user.email,
        role: user.role,
        organizationId: user.organizationId ?? null,
    };

    console.log({tokenPayload})
    const accessToken = jwtHelper.generateToken(tokenPayload, config.jwt_secret as string, "10h");
    const refreshToken = jwtHelper.generateToken(tokenPayload, config.jwt_refresh_secret as string, "90d");
    const { password, ...safeUser } = user;

    return {
        accessToken,
        refreshToken,
        user: safeUser
    }
}

export const AuthService = {
    login
}