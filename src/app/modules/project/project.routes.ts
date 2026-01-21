import express, { Router } from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { ProjectValidation } from './project.validation';
import { ProjectController } from './project.controller';
import { UserRole } from '../../../../prisma/generated/prisma/client';

const router = Router();



// router.use(auth(UserRole.ORG_ADMIN)); 

router.post(
    '/create-project',
    auth(UserRole.ORG_ADMIN),
    validateRequest(ProjectValidation.createProjectSchema),
    ProjectController.createProject
);

router.get(
    '/all-projects',
    auth(UserRole.ORG_ADMIN),
    ProjectController.getAllProjects
);

router.get(
    '/:id',
    ProjectController.getSingleProject
);

router.put(
    '/:id',
    validateRequest(ProjectValidation.updateProjectSchema),
    ProjectController.updateProject
);

router.delete(
    '/:id',
    ProjectController.deleteProject
);

export const ProjectRoutes = router;