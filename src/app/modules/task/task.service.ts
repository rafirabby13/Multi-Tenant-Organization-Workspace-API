import httpStatus from "http-status";
import { prisma } from "../../../lib/prisma";
import { AppError } from "../../errors/AppError";
import { ICreateTask, IUpdateTask } from "./task.interface";

// ---------------------------------------------------------
// 1. CREATE TASK (Org Admin Only)
// ---------------------------------------------------------
const createTaskIntoDB = async (payload: ICreateTask, currentUser: any) => {
    
    // A. Verify Project belongs to Organization
    const project = await prisma.project.findFirst({
        where: {
            id: payload.projectId,
            organizationId: currentUser.organizationId
        }
    });

    if (!project) {
        throw new AppError(httpStatus.NOT_FOUND, "Project not found in your organization");
    }

    // B. Verify Assignee belongs to Organization (if provided)
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

    // C. Create
    const result = await prisma.task.create({
        data: {
            title: payload.title,
            description: payload.description,
            projectId: payload.projectId,
            assigneeId: payload.assigneeId,
            dueDate: payload.dueDate,
            // status defaults to PENDING via Schema
        }
    });

    return result;
};

// ---------------------------------------------------------
// 2. GET ALL TASKS (Dynamic View)
// ---------------------------------------------------------
const getAllTasksFromDB = async (currentUser: any, queryFilters: any) => {
    
    const whereConditions: any = {
        isDeleted: false // 🛑 Filter out soft-deleted items
    };

    // SCENARIO A: Org Admin -> Sees everything in the Org
    if (currentUser.role === UserRole.ORG_ADMIN) {
        whereConditions.project = {
            organizationId: currentUser.organizationId
        };
    }
    
    // SCENARIO B: Org Member -> Sees ONLY assigned tasks
    else if (currentUser.role === UserRole.ORG_MEMBER) {
        whereConditions.assigneeId = currentUser.id;
        whereConditions.project = {
            organizationId: currentUser.organizationId // Extra safety layer
        };
    }

    // Filter by Project ID if requested via query params
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

// ---------------------------------------------------------
// 3. GET SINGLE TASK (Validation)
// ---------------------------------------------------------
const getSingleTaskFromDB = async (taskId: string, currentUser: any) => {
    const task = await prisma.task.findUnique({
        where: { id: taskId, isDeleted: false },
        include: { project: true }
    });

    if (!task) {
        throw new AppError(httpStatus.NOT_FOUND, "Task not found");
    }

    // Security: Check Org
    if (task.project.organizationId !== currentUser.organizationId) {
        throw new AppError(httpStatus.FORBIDDEN, "Access Denied");
    }

    // Security: If Member, Check Assignment
    if (currentUser.role === UserRole.ORG_MEMBER && task.assigneeId !== currentUser.id) {
        throw new AppError(httpStatus.FORBIDDEN, "You can only view your own tasks");
    }

    return task;
};

// ---------------------------------------------------------
// 4. UPDATE TASK (Mixed Access)
// ---------------------------------------------------------
const updateTaskInDB = async (taskId: string, payload: IUpdateTask, currentUser: any) => {
    
    const task = await prisma.task.findUnique({
        where: { id: taskId, isDeleted: false },
        include: { project: true }
    });

    if (!task) {
        throw new AppError(httpStatus.NOT_FOUND, "Task not found");
    }

    // Check Organization Scope
    if (task.project.organizationId !== currentUser.organizationId) {
        throw new AppError(httpStatus.FORBIDDEN, "Access Denied");
    }

    // MEMBER RESTRICTIONS
    if (currentUser.role === UserRole.ORG_MEMBER) {
        // 1. Can only update own tasks
        if (task.assigneeId !== currentUser.id) {
            throw new AppError(httpStatus.FORBIDDEN, "You cannot update tasks assigned to others");
        }
        // 2. Can ONLY update status
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

// ---------------------------------------------------------
// 5. DELETE TASK (Soft Delete)
// ---------------------------------------------------------
const deleteTaskFromDB = async (taskId: string, currentUser: any) => {
    
    const task = await prisma.task.findUnique({
        where: { id: taskId, isDeleted: false },
        include: { project: true }
    });

    if (!task) {
        throw new AppError(httpStatus.NOT_FOUND, "Task not found");
    }

    // Only Admin can delete
    if (task.project.organizationId !== currentUser.organizationId) {
        throw new AppError(httpStatus.FORBIDDEN, "Access Denied");
    }

    // Soft Delete
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