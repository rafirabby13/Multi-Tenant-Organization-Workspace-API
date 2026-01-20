import { Router } from "express"
import { UserController } from "./user.controller"
import validateRequest from "../../middlewares/validateRequest"
import { createUserSchema } from "./user.validation"
import auth from "../../middlewares/auth"
import { UserRole } from "../../../../prisma/generated/prisma/enums"


const router = Router()


router.post("/create-user", auth(UserRole.ORG_ADMIN), validateRequest(createUserSchema), UserController.createUser)

export const UserRoutes = router