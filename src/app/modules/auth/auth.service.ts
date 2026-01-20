
import bcrypt from "bcryptjs";
import { jwtHelper } from "../../helpers/jwtHelper";
import { config } from "../../../config/index.env";
import { prisma } from "../../../lib/prisma";
import { UserStatus } from "../../../../prisma/generated/prisma/enums";

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
        throw new Error("Password is incorrect!")
    }

    const accessToken = jwtHelper.generateToken({ email: user.email, role: user.role, id: user.id }, config.jwt_secret as string, "10h");

    const refreshToken = jwtHelper.generateToken({ email: user.email, role: user.role, id: user.id }, config.jwt_refresh_secret as string, "90d");
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