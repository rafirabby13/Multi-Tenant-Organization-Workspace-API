
import bcrypt from "bcryptjs";
import httpStatus from "http-status";
import { config } from "../../../config";
import { AppError } from "../../errors/AppError";
import { ICreateOrganizationPayload } from "./organization.interface";
import { UserRole } from "../../../../prisma/generated/prisma/enums";
import { prisma } from "../../../lib/prisma";



const createOrganization = async (payload: ICreateOrganizationPayload, currentUser: any) => {
    
 
    if (currentUser.role !== UserRole.PLATFORM_ADMIN) {
        throw new AppError(httpStatus.FORBIDDEN, "Only Platform Admins can create organizations");
    }

    
    const existingUser = await prisma.user.findUnique({
        where: { email: payload.adminEmail }
    });
    if (existingUser) {
        throw new AppError(httpStatus.CONFLICT, "Admin email already exists");
    }

    
    const hashedPassword = await bcrypt.hash(
        payload.adminPassword, 
        Number(config.salt) || 12
    );

    
    
    const result = await prisma.$transaction(async (tx) => {
        
     
        
        const newOrg = await tx.organization.create({
            data: {
                name: payload.organizationName
            }
        });

       
        
        const newAdmin = await tx.user.create({
            data: {
                email: payload.adminEmail,
                password: hashedPassword,
                role: UserRole.ORG_ADMIN,
                organizationId: newOrg.id 
            }
        });

        const {password, ...adminSafe} = newAdmin;

        return {
            organization: newOrg,
            admin: adminSafe
        };
    });

    

    return {
        organization: result.organization,
        admin: result.admin
    };
};


const getAllOrganizationsFromDB = async () => {
    const result = await prisma.organization.findMany({
        where: {
            isDeleted: false
        },
        orderBy: {
            createdAt: 'desc'
        },
        include: {
            _count: {
                select: { users: true, projects: true }
            }
        }
    });

    return result;
};


const getOrganizationByIdFromDB = async (orgId: string, currentUser: any) => {
    
    
    if (currentUser.role === UserRole.ORG_ADMIN) {
        if (currentUser.organizationId !== orgId) {
            throw new AppError(httpStatus.FORBIDDEN, "You are not authorized to view this organization.");
        }
    }

    const result = await prisma.organization.findUnique({
        where: { 
            id: orgId,
            isDeleted: false 
        },
        include: {
            projects: {
                select: {
                    id: true,
                    name: true,
                    createdAt: true
                }
            }
        }
    });

    if (!result) {
        throw new AppError(httpStatus.NOT_FOUND, "Organization not found");
    }

    return result;
};

export const OrganizationServices = {
    createOrganization,
    getAllOrganizationsFromDB,
    getOrganizationByIdFromDB
};