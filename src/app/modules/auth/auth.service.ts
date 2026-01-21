
import bcrypt from "bcryptjs";
import { jwtHelper } from "../../helpers/jwtHelper";
import { config } from "../../../config";
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

    // console.log({tokenPayload})
    const accessToken = jwtHelper.generateToken(tokenPayload, config.jwt_secret as string, "10h");
    const refreshToken = jwtHelper.generateToken(tokenPayload, config.jwt_refresh_secret as string, "90d");
    const { password, ...safeUser } = user;

    return {
        accessToken,
        refreshToken,
        user: safeUser
    }
}

const getMe = async (userId: string) => {
    const result = await prisma.user.findUnique({
        where: { id: userId },
        select: {
            id: true,
            email: true,
            role: true,
            status: true,
            organizationId: true,
            organization: { select: { name: true } }, 
            createdAt: true
        }
    });

    return result;
};


const changePassword = async (user: any, payload: any) => {
    
    
    const userData = await prisma.user.findUnique({
        where: { id: user.id, isDeleted: false }
    });

    if (!userData) {
        throw new AppError(404, "User does not exist!");
    }

    
    
    const isPasswordMatched = await bcrypt.compare(payload.oldPassword, userData.password);
    if (!isPasswordMatched) {
        throw new AppError(403, "Incorrect old password");
    }

   
    
    const newHashedPassword = await bcrypt.hash(payload.newPassword, Number(config.salt));

   
    
    await prisma.user.update({
        where: { id: user.id },
        data: {
            password: newHashedPassword,
            needPasswordChange: false 
        }
    });

    return { message: "Password changed successfully" };
};

export const AuthService = {
    login,
    getMe,
    changePassword
}