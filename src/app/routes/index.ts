import { Router } from "express";
import { authRoutes } from "../modules/auth/auth.routes";
import { UserRoutes } from "../modules/user/user.routes";
import { OrganizationRoutes } from "../modules/organization/organization.routes";

const router = Router()

const moduleRoutes = [
    {
        path: "/auth",
        route: authRoutes
    },
    {
        path: "/user",
        route: UserRoutes
    },
    {
        path: "/organization",
        route: OrganizationRoutes
    }
]

moduleRoutes.forEach((route) => router.use(route.path, route.route))

export default router

