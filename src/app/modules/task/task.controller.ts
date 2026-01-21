import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync"; // Adjust path
import sendResponse from "../../utils/sendResponse"; // Adjust path
import { TaskServices } from "./task.services";

const createTask = catchAsync(async (req: Request, res: Response) => {
    const result = await TaskServices.createTaskIntoDB(req.body, req.user);
    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: "Task created successfully",
        data: result
    });
});

const getAllTasks = catchAsync(async (req: Request, res: Response) => {
    const result = await TaskServices.getAllTasksFromDB(req.user, req.query);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Tasks retrieved successfully",
        data: result
    });
});

const getSingleTask = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await TaskServices.getSingleTaskFromDB(id, req.user);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Task retrieved successfully",
        data: result
    });
});

const updateTask = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await TaskServices.updateTaskInDB(id, req.body, req.user);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Task updated successfully",
        data: result
    });
});

const deleteTask = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await TaskServices.deleteTaskFromDB(id, req.user);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Task deleted successfully",
        data: result
    });
});

export const TaskController = {
    createTask,
    getAllTasks,
    getSingleTask,
    updateTask,
    deleteTask
};