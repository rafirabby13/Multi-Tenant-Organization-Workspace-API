import { Request, Response } from "express";
import httpStatus from "http-status";
import { ProjectServices } from "./project.services";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";

const createProject = catchAsync(async (req: Request, res: Response) => {
  
    
    const user = (req as any).user;
    const result = await ProjectServices.createProjectIntoDB(req.body, user);

    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: "Project created successfully",
        data: result
    });
});

const getAllProjects = catchAsync(async (req: Request, res: Response) => {
     const user = (req as any).user;
    const result = await ProjectServices.getAllProjectsFromDB(user);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Projects retrieved successfully",
        data: result
    });
});

const getSingleProject = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
     const user = (req as any).user;
    const result = await ProjectServices.getSingleProjectFromDB(id as string, user);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Project retrieved successfully",
        data: result
    });
});

const updateProject = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
     const user = (req as any).user;
    const result = await ProjectServices.updateProjectInDB(id as string, req.body,user);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Project updated successfully",
        data: result
    });
});

const deleteProject = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
     const user = (req as any).user;
    const result = await ProjectServices.deleteProjectFromDB(id as string, user);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Project deleted successfully",
        data: result
    });
});

export const ProjectController = {
    createProject,
    getAllProjects,
    getSingleProject,
    updateProject,
    deleteProject
};