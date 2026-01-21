import { z } from 'zod';
const createProjectSchema = z.object({
    body: z.object({
        name: z
            .string({ message: "Project name is required" })
            .min(3, "Project name must be at least 3 characters")
            .max(100, "Project name cannot exceed 100 characters"),
        description: z.string().optional()
    }),
});
const updateProjectSchema = z.object({
    body: z.object({
        name: z.string().min(3).max(100).optional(),
        description: z.string().optional()
    }),
});
export const ProjectValidation = {
    createProjectSchema,
    updateProjectSchema
};
