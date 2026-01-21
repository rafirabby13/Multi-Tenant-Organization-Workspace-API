import { z } from "zod";
import { UserRole, UserStatus } from "../../../../prisma/generated/prisma/enums";
// Reusable enum schemas 
export const UserRoleEnum = z.enum(UserRole);
export const UserStatusEnum = z.enum(UserStatus);
export const createUserSchema = z.object({
    body: z.object({
        email: z
            .string()
            .email("Invalid email format"),
        password: z
            .string()
            .min(8, "Password must be at least 8 characters")
            .regex(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)/, "Password must include uppercase, lowercase, and number"),
        role: UserRoleEnum,
        name: z.string().optional(),
        profilePhoto: z
            .string()
            .url("Invalid profile photo URL")
            .optional(),
        contactNumber: z
            .string()
            .min(10)
            .max(15)
            .optional()
    })
});
export const UpdateProfileSchema = z.object({
    name: z.string().min(2).optional(),
    contactNumber: z
        .string()
        .regex(/^\+?[1-9]\d{1,14}$/, "Invalid phone number format")
        .optional(),
    profilePhoto: z.string().url({ message: "Invalid URL" }).optional(),
    status: UserStatusEnum.optional(),
    needPasswordChange: z.boolean().optional(),
    isDeleted: z.boolean().optional(),
});
export const ChangePasswordSchema = z.object({
    oldPassword: z.string().min(1, "Old password is required"),
    newPassword: z
        .string()
        .min(8, "New password must be at least 8 characters")
        .regex(/[A-Z]/, "Must contain at least one uppercase letter")
        .regex(/[0-9]/, "Must contain at least one number")
        .regex(/[^A-Za-z0-9]/, "Must contain at least one special character"),
    confirmNewPassword: z.string().min(8),
}).refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "Passwords do not match",
    path: ["confirmNewPassword"],
});
export const UpdateUserRoleSchema = z.object({
    role: UserRoleEnum,
});
export const UpdateUserStatusSchema = z.object({
    status: UserStatusEnum,
});
export const UserValidation = {
    createUserSchema,
    UpdateProfileSchema,
    ChangePasswordSchema,
    UpdateUserRoleSchema,
    UpdateUserStatusSchema,
};
