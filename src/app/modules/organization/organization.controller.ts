import { NextFunction, Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { OrganizationServices } from "./organization.service";
import httpStatus from "http-status";
const createOrganization = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    // console.log({req})
    const user = (req as any).user;
    // console.log(".............", user)
    const result = await OrganizationServices.createOrganization(req.body, user)
    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: "Organization is created successfully....",
        // data: {}
        data: result
    })

})
const getAllOrganizations = catchAsync(async (req: Request, res: Response) => {
    const result = await OrganizationServices.getAllOrganizationsFromDB();

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Organizations retrieved successfully",
        data: result
    });
});

const getOrganizationById = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    
    const result = await OrganizationServices.getOrganizationByIdFromDB(id as string, (req as any).user);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Organization details retrieved successfully",
        data: result
    });
});
export const OrganizationController = {
    createOrganization,
    getAllOrganizations,
    getOrganizationById
}