import { NextFunction, Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { UserServices } from "./user.service";
import { userFilterableFields } from "./user.constant";
import httpStatus from "http-status";
import pick from "../../helpers/pick";

const createUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    // console.log({req})
    const user = (req as any).user;
    // console.log(".............", user, {body: req.body})
    const result = await UserServices.createUser(req.body, user)


    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: "User is created successsfully....",
        // data: {}
        data: result
    })

})

const getAllUsers = catchAsync(async (req: Request, res: Response) => {
    const user = (req as any).user;
    const result = await UserServices.getAllUsersFromDB(user);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Users retrieved successfully",
        data: result
    });
});

const updateUserStatus = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { status } = req.body; // Expect { "status": "BLOCKED" }
    const user = (req as any).user;
    
    const result = await UserServices.updateUserStatusInDB(id as string, status, user);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "User status updated successfully",
        data: result
    });
});



// const getAllFromDB = catchAsync(async (req: Request, res: Response) => {
//     const filters = pick(req.query, userFilterableFields) // searching , filtering
//     const options = pick(req.query, ["page", "limit", "sortBy", "sortOrder"]) // pagination and sorting

//     const result = await UserServices.getAllFromDB(filters, options);

//     sendResponse(res, {
//         statusCode: 200,
//         success: true,
//         message: "User retrive successfully!",
//         meta: result.meta,
//         data: result.data
//     })
// })




// const getMyProfile = catchAsync(async (req: Request, res: Response) => {
//     const userId = (req as any).user.id; // From JWT token

//     const result = await UserServices.getUserProfile(userId);

//     sendResponse(res, {
//         statusCode: httpStatus.OK,
//         success: true,
//         message: "My profile retrieved successfully",
//         data: result
//     });
// });


// const updateMyProfile = catchAsync(async (req: Request, res: Response) => {
//     const userId = (req as any).user.id; // From JWT token
//     // console.log({userId})

//     const result = await UserServices.updateMyProfile(userId, req);

//     sendResponse(res, {
//         statusCode: httpStatus.OK,
//         success: true,
//         message: "Profile updated successfully",
//         // data: {}
//         data: result
//     });
// });

// // ✅ Delete User (Admin only)
// const deleteUser = catchAsync(async (req: Request, res: Response) => {
//     const { userId } = req.params;

//     const result = await UserServices.deleteUser(userId as string);

//     sendResponse(res, {
//         statusCode: httpStatus.OK,
//         success: true,
//         message: "User deleted successfully",
//         data: result
//     });
// });

// // ✅ Change Password
// const changePassword = catchAsync(async (req: Request, res: Response) => {
//     const userId = (req as any).user.id;
//     const { oldPassword, newPassword } = req.body;
//     // console.log(req.body)

//     const result = await UserServices.changePassword(userId, oldPassword, newPassword);

//     sendResponse(res, {
//         statusCode: httpStatus.OK,
//         success: true,
//         message: result.message,
//         data: null
//     });
// });

// // ✅ Update User Role (Admin only)
// const updateUserRole = catchAsync(async (req: Request, res: Response) => {
//     const { userId } = req.params;
//     const { role } = req.body;

//     const result = await UserServices.updateUserRole(userId as string, role);

//     sendResponse(res, {
//         statusCode: httpStatus.OK,
//         success: true,
//         message: "User role updated successfully",
//         data: result
//     });
// });

// const UpdateUserStatus = catchAsync(async (req: Request, res: Response) => {
//     const { userId } = req.params;
//     const { status } = req.body

//     console.log("...............", userId, status)

//     const result = await UserServices.UpdateUserStatus(userId as string, status);

//     sendResponse(res, {
//         statusCode: httpStatus.OK,
//         success: true,
//         // message: "User activated successfully",
//         message: result.isDeleted ? "User suspended successfully" : "User activated successfully",
//         data: result
//         // data: {}
//     });
// });
export const UserController = {
    createUser,
    getAllUsers,
    updateUserStatus,
}