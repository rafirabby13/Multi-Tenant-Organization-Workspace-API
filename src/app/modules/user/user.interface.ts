import { UserRole } from "../../../../prisma/generated/prisma/enums";

export interface ICreateUser {
  name?: string;
  email: string;
  password: string;
  
  role: UserRole; 
  
  profilePhoto?: string;
  contactNumber?: string;
  organizationId?: string; 
}