import { z } from 'zod';
import { TaskStatus } from '../../../../prisma/generated/prisma/enums';

const createTaskSchema = z.object({
    body: z.object({
        title: z.string({ message: "Title is required" }).min(3).max(100),
        description: z.string().optional(),
        projectId: z.string({ message: "Project ID is required" }).uuid(),
        assigneeId: z.string().uuid().optional(),
        dueDate: z.string().datetime().optional()
            .transform((str) => (str ? new Date(str) : undefined))
    }),
});

const updateTaskSchema = z.object({
    body: z.object({
        title: z.string().optional(),
        description: z.string().optional(),
        status: z.nativeEnum(TaskStatus).optional(),
        assigneeId: z.string().uuid().optional(),
        dueDate: z.string().datetime().optional()
            .transform((str) => (str ? new Date(str) : undefined))
    }),
});

export const TaskValidation = {
    createTaskSchema,
    updateTaskSchema
};