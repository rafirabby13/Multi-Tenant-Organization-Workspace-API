import { NextFunction, Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { OrganizationServices } from "./organization.service";

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

export const OrganizationController = {
    createOrganization,
}