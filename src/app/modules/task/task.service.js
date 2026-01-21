import httpStatus from "http-status";
import { prisma } from "../../../lib/prisma";
import { AppError } from "../../errors/AppError";
import { UserRole } from "../../../../prisma/generated/prisma/enums";
const createTaskIntoDB = async (payload, currentUser) => {
    const project = await prisma.project.findFirst({
        where: {
            id: payload.projectId,
            organizationId: currentUser.organizationId
        }
    });
    if (!project) {
        throw new AppError(httpStatus.NOT_FOUND, "Project not found in your organization");
    }
    if (payload.assigneeId) {
        const assignee = await prisma.user.findFirst({
            where: {
                id: payload.assigneeId,
                organizationId: currentUser.organizationId
            }
        });
        if (!assignee) {
            throw new AppError(httpStatus.NOT_FOUND, "Assignee not found in your organization");
        }
    }
    const result = await prisma.task.create({
        data: {
            title: payload.title,
            description: payload.description || null,
            projectId: payload.projectId,
            assigneeId: payload.assigneeId,
            dueDate: payload.dueDate ? new Date(payload.dueDate) : null
        }
    });
    return result;
};
const getAllTasksFromDB = async (currentUser, queryFilters) => {
    const whereConditions = {
        isDeleted: false
    };
    if (currentUser.role === UserRole.ORG_ADMIN) {
        whereConditions.project = {
            organizationId: currentUser.organizationId
        };
    }
    else if (currentUser.role === UserRole.ORG_MEMBER) {
        whereConditions.assigneeId = currentUser.id;
        whereConditions.project = {
            organizationId: currentUser.organizationId
        };
    }
    if (queryFilters.projectId) {
        whereConditions.projectId = queryFilters.projectId;
    }
    const result = await prisma.task.findMany({
        where: whereConditions,
        include: {
            project: { select: { name: true } },
            assignee: { select: { name: true, email: true } }
        },
        orderBy: { createdAt: 'desc' }
    });
    return result;
};
const getSingleTaskFromDB = async (taskId, currentUser) => {
    const task = await prisma.task.findUnique({
        where: { id: taskId, isDeleted: false },
        include: { project: true }
    });
    if (!task) {
        throw new AppError(httpStatus.NOT_FOUND, "Task not found");
    }
    if (task.project.organizationId !== currentUser.organizationId) {
        throw new AppError(httpStatus.FORBIDDEN, "Access Denied");
    }
    if (currentUser.role === UserRole.ORG_MEMBER && task.assigneeId !== currentUser.id) {
        throw new AppError(httpStatus.FORBIDDEN, "You can only view your own tasks");
    }
    return task;
};
const updateTaskInDB = async (taskId, payload, currentUser) => {
    const task = await prisma.task.findUnique({
        where: { id: taskId, isDeleted: false },
        include: { project: true }
    });
    if (!task) {
        throw new AppError(httpStatus.NOT_FOUND, "Task not found");
    }
    if (task.project.organizationId !== currentUser.organizationId) {
        throw new AppError(httpStatus.FORBIDDEN, "Access Denied");
    }
    if (currentUser.role === UserRole.ORG_MEMBER) {
        if (task.assigneeId !== currentUser.id) {
            throw new AppError(httpStatus.FORBIDDEN, "You cannot update tasks assigned to others");
        }
        const allowedUpdates = ['status'];
        const actualUpdates = Object.keys(payload);
        const isValidUpdate = actualUpdates.every(key => allowedUpdates.includes(key));
        if (!isValidUpdate) {
            throw new AppError(httpStatus.FORBIDDEN, "Members can only update task status");
        }
    }
    const result = await prisma.task.update({
        where: { id: taskId },
        data: payload
    });
    return result;
};
const deleteTaskFromDB = async (taskId, currentUser) => {
    const task = await prisma.task.findUnique({
        where: { id: taskId, isDeleted: false },
        include: { project: true }
    });
    if (!task) {
        throw new AppError(httpStatus.NOT_FOUND, "Task not found");
    }
    if (task.project.organizationId !== currentUser.organizationId) {
        throw new AppError(httpStatus.FORBIDDEN, "Access Denied");
    }
    const result = await prisma.task.update({
        where: { id: taskId },
        data: { isDeleted: true }
    });
    return result;
};
export const TaskServices = {
    createTaskIntoDB,
    getAllTasksFromDB,
    getSingleTaskFromDB,
    updateTaskInDB,
    deleteTaskFromDB
};
