import bcrypt from "bcryptjs";
import httpStatus from "http-status";
import { UserRole } from "../../../../prisma/generated/prisma/client";
import { AppError } from "../../errors/AppError";
import { prisma } from "../../../lib/prisma";
import { config } from "../../../config";
const createUser = async (payload, currentUser) => {
    let organizationId = null;
    let role = UserRole.ORG_MEMBER;
    if (currentUser.role === UserRole.ORG_ADMIN) {
        organizationId = currentUser.organizationId;
        if (payload.role === UserRole.ORG_ADMIN || payload.role === UserRole.ORG_MEMBER) {
            role = payload.role;
        }
        else {
            role = UserRole.ORG_MEMBER;
        }
    }
    else if (currentUser.role === UserRole.PLATFORM_ADMIN) {
        if (payload.role !== UserRole.PLATFORM_ADMIN) {
            throw new AppError(httpStatus.FORBIDDEN, "Platform Admins cannot create Organization Users. Please use the 'Create Organization' endpoint or let the Org Admin do it.");
        }
        organizationId = null;
        role = UserRole.PLATFORM_ADMIN;
    }
    else {
        throw new AppError(httpStatus.FORBIDDEN, "Invalid Role Permissions");
    }
    if (!organizationId && role !== UserRole.PLATFORM_ADMIN) {
        throw new AppError(httpStatus.BAD_REQUEST, "Organization ID is required for this user role");
    }
    const existingUser = await prisma.user.findUnique({
        where: { email: payload.email }
    });
    if (existingUser) {
        throw new AppError(httpStatus.CONFLICT, "Email already exists");
    }
    const hashedPassword = await bcrypt.hash(payload.password, config.salt ? parseInt(config.salt) : 12);
    const createdUser = await prisma.user.create({
        data: {
            email: payload.email,
            password: hashedPassword,
            role: role,
            organizationId: organizationId,
        }
    });
    const { password, ...userWithoutPassword } = createdUser;
    return { user: userWithoutPassword };
};
const getAllUsersFromDB = async (currentUser) => {
    const whereConditions = {
        isDeleted: false
    };
    if (currentUser.organizationId) {
        whereConditions.organizationId = currentUser.organizationId;
    }
    const result = await prisma.user.findMany({
        where: whereConditions,
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            status: true,
            contactNumber: true,
            organizationId: true
        }
    });
    return result;
};
const updateUserStatusInDB = async (userId, status, currentUser) => {
    const targetUser = await prisma.user.findUnique({
        where: { id: userId, isDeleted: false }
    });
    if (!targetUser) {
        throw new AppError(httpStatus.NOT_FOUND, "User not found");
    }
    if (currentUser.role === UserRole.ORG_ADMIN) {
        if (targetUser.organizationId !== currentUser.organizationId) {
            throw new AppError(httpStatus.FORBIDDEN, "Access Denied");
        }
    }
    const result = await prisma.user.update({
        where: { id: userId },
        data: { status }
    });
    return result;
};
export const UserServices = {
    createUser,
    getAllUsersFromDB,
    updateUserStatusInDB
};
