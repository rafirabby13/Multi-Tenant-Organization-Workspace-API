import httpStatus from "http-status";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { TaskServices } from "./task.service";
const createTask = catchAsync(async (req, res) => {
    const user = req.user;
    const result = await TaskServices.createTaskIntoDB(req.body, user);
    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: "Task created successfully",
        data: result
    });
});
const getAllTasks = catchAsync(async (req, res) => {
    const user = req.user;
    const result = await TaskServices.getAllTasksFromDB(user, req.query);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Tasks retrieved successfully",
        data: result
    });
});
const getSingleTask = catchAsync(async (req, res) => {
    const { id } = req.params;
    const user = req.user;
    const result = await TaskServices.getSingleTaskFromDB(id, user);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Task retrieved successfully",
        data: result
    });
});
const updateTask = catchAsync(async (req, res) => {
    const { id } = req.params;
    const user = req.user;
    const result = await TaskServices.updateTaskInDB(id, req.body, user);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Task updated successfully",
        data: result
    });
});
const deleteTask = catchAsync(async (req, res) => {
    const { id } = req.params;
    const user = req.user;
    const result = await TaskServices.deleteTaskFromDB(id, user);
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
