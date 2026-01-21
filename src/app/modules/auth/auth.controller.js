import catchAsync from "../../shared/catchAsync";
import { AuthService } from "./auth.service";
import sendResponse from "../../shared/sendResponse";
import httpStatus from "http-status";
const login = catchAsync(async (req, res) => {
    const result = await AuthService.login(req.body);
    const { accessToken, refreshToken, user } = result;
    res.cookie("accessToken", accessToken, {
        secure: true,
        httpOnly: true,
        sameSite: "none",
        maxAge: 1000 * 60 * 60
    });
    res.cookie("refreshToken", refreshToken, {
        secure: true,
        httpOnly: true,
        sameSite: "none",
        maxAge: 1000 * 60 * 60 * 24 * 90
    });
    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: "You logged In successfully!",
        data: user
    });
});
const getMe = catchAsync(async (req, res) => {
    const userId = req.user.id;
    const result = await AuthService.getMe(userId);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "User profile retrieved successfully",
        data: result
    });
});
const changePassword = catchAsync(async (req, res) => {
    const result = await AuthService.changePassword(req.user, req.body);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Password changed successfully",
        data: result
    });
});
export const AuthController = {
    login,
    getMe,
    changePassword
};
