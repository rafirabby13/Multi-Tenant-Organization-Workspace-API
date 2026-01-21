import express from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { TaskValidation } from './task.validation';
import { TaskController } from './task.controller';
import { UserRole } from '../../../../prisma/generated/prisma/enums';

const router = express.Router();



router.post(
    '/create-task',
    auth(UserRole.ORG_ADMIN),
    validateRequest(TaskValidation.createTaskSchema),
    TaskController.createTask
);



router.get(
    '/all-tasks',
    auth(UserRole.ORG_ADMIN, UserRole.ORG_MEMBER),
    TaskController.getAllTasks
);

router.get(
    '/single-task/:id',
    auth(UserRole.ORG_ADMIN, UserRole.ORG_MEMBER),
    TaskController.getSingleTask
);



router.patch(
    '/update-task/:id',
    auth(UserRole.ORG_ADMIN, UserRole.ORG_MEMBER),
    validateRequest(TaskValidation.updateTaskSchema),
    TaskController.updateTask
);



router.delete(
    '/delete-task/:id',
    auth(UserRole.ORG_ADMIN),
    TaskController.deleteTask
);

export const TaskRoutes = router;