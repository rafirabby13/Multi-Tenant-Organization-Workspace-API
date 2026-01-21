import httpStatus from "http-status";
import { prisma } from "../../../lib/prisma"; // Adjust path
import { AppError } from "../../errors/AppError"; // Adjust path
import { UserRole } from "../../../../prisma/generated/prisma/client";
const createProjectIntoDB = async (payload, currentUser) => {
    if (currentUser.role !== UserRole.ORG_ADMIN) {
        throw new AppError(httpStatus.FORBIDDEN, "Only Organization Admins can create projects");
    }
    const existingProject = await prisma.project.findFirst({
        where: {
            organizationId: currentUser.organizationId,
            name: payload.name
        }
    });
    if (existingProject) {
        throw new AppError(httpStatus.CONFLICT, "A project with this name already exists in your organization");
    }
    const result = await prisma.project.create({
        data: {
            name: payload.name,
            description: payload.description,
            organizationId: currentUser.organizationId,
            creatorId: currentUser.id
        }
    });
    return result;
};
const getAllProjectsFromDB = async (currentUser) => {
    const result = await prisma.project.findMany({
        where: {
            organizationId: currentUser.organizationId
        },
        include: {
            _count: {
                select: { tasks: true }
            }
        },
        orderBy: {
            createdAt: 'desc'
        }
    });
    return result;
};
const getSingleProjectFromDB = async (projectId, currentUser) => {
    console.log({ currentUser });
    const result = await prisma.project.findFirst({
        where: {
            id: projectId,
            organizationId: currentUser.organizationId
        },
        include: {
            tasks: true
        }
    });
    if (!result) {
        throw new AppError(httpStatus.NOT_FOUND, "Project not found or access denied");
    }
    return result;
};
const updateProjectInDB = async (projectId, payload, currentUser) => {
    const project = await prisma.project.findFirst({
        where: {
            id: projectId,
            organizationId: currentUser.organizationId
        }
    });
    if (!project) {
        throw new AppError(httpStatus.NOT_FOUND, "Project not found or access denied");
    }
    const result = await prisma.project.update({
        where: { id: projectId },
        data: payload
    });
    return result;
};
const deleteProjectFromDB = async (projectId, currentUser) => {
    const project = await prisma.project.findFirst({
        where: {
            id: projectId,
            organizationId: currentUser.organizationId
        }
    });
    if (!project) {
        throw new AppError(httpStatus.NOT_FOUND, "Project not found or access denied");
    }
    const result = await prisma.project.delete({
        where: { id: projectId }
    });
    return result;
};
export const ProjectServices = {
    createProjectIntoDB,
    getAllProjectsFromDB,
    getSingleProjectFromDB,
    updateProjectInDB,
    deleteProjectFromDB
};
