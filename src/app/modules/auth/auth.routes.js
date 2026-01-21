import express from 'express';
import { AuthController } from './auth.controller';
import { UserRole } from '../../../../prisma/generated/prisma/enums';
import auth from '../../middlewares/auth';
const router = express.Router();
router.post("/login", AuthController.login);
router.get("/me", auth(UserRole.PLATFORM_ADMIN, UserRole.ORG_ADMIN, UserRole.ORG_MEMBER), AuthController.getMe);
router.post("/change-password", auth(UserRole.PLATFORM_ADMIN, UserRole.ORG_ADMIN, UserRole.ORG_MEMBER), AuthController.changePassword);
export const authRoutes = router;
