import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { OrganizationServices } from "./organization.service";
import httpStatus from "http-status";
const createOrganization = catchAsync(async (req, res, next) => {
    // console.log({req})
    const user = req.user;
    // console.log(".............", user)
    const result = await OrganizationServices.createOrganization(req.body, user);
    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: "Organization is created successfully....",
        // data: {}
        data: result
    });
});
const getAllOrganizations = catchAsync(async (req, res) => {
    const result = await OrganizationServices.getAllOrganizationsFromDB();
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Organizations retrieved successfully",
        data: result
    });
});
const getOrganizationById = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = await OrganizationServices.getOrganizationByIdFromDB(id, req.user);
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
};
