import { z } from 'zod';

export const createOrganizationSchema = z.object({
  body: z.object({
    // 1. Organization Details
    organizationName: z
      .string({ message: "Organization name is required" })
      .min(2, "Organization name must be at least 2 characters")
      .max(100, "Organization name cannot exceed 100 characters"),

   
    
    adminEmail: z
      .string({ message: "Admin email is required" })
      .email("Invalid email format"),

    adminPassword: z
      .string({ message: "Admin password is required" })
      .min(8, "Password must be at least 8 characters")
      // Optional: Enforce complexity
      .regex(
        /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)/,
        "Password must include uppercase, lowercase, and number"
      ),
      
  
  }),
});


export type ICreateOrganizationRequest = z.infer<typeof createOrganizationSchema>['body'];

export const OrganizationValidation = {
  createOrganizationSchema,
};