import express from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { TaskValidation } from './task.validation';
import { TaskController } from './task.controller';
import { UserRole } from '../../../../prisma/generated/prisma/enums';

const router = express.Router();

// 1. Create (Admin Only)
router.post(
    '/',
    auth(UserRole.ORG_ADMIN),
    validateRequest(TaskValidation.createTaskSchema),
    TaskController.createTask
);

// 2. Read All/Single (Admin + Member)
router.get(
    '/',
    auth(UserRole.ORG_ADMIN, UserRole.ORG_MEMBER),
    TaskController.getAllTasks
);

router.get(
    '/:id',
    auth(UserRole.ORG_ADMIN, UserRole.ORG_MEMBER),
    TaskController.getSingleTask
);

// 3. Update (Admin + Member with restrictions)
router.put(
    '/:id',
    auth(UserRole.ORG_ADMIN, UserRole.ORG_MEMBER),
    validateRequest(TaskValidation.updateTaskSchema),
    TaskController.updateTask
);

// 4. Delete (Admin Only)
router.delete(
    '/:id',
    auth(UserRole.ORG_ADMIN),
    TaskController.deleteTask
);

export const TaskRoutes = router;