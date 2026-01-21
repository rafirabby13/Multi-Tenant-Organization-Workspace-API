import { Router } from "express"
import auth from "../../middlewares/auth"
import { UserRole } from "../../../../prisma/generated/prisma/enums"
import { OrganizationController } from "./organization.controller"
import validateRequest from "../../middlewares/validateRequest"
import { OrganizationValidation } from "./organization.validation"


const router = Router()


router.post("/create-organization", auth( UserRole.PLATFORM_ADMIN), validateRequest(OrganizationValidation.createOrganizationSchema), OrganizationController.createOrganization)

export const OrganizationRoutes = router