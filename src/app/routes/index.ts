import { Router } from "express";
import { authRoutes } from "../modules/auth/auth.routes";
import { UserRoutes } from "../modules/user/user.routes";
import { OrganizationRoutes } from "../modules/organization/organization.routes";
import { ProjectRoutes } from "../modules/project/project.routes";

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
    },
    {
        path: "/project",
        route: ProjectRoutes
    }
]

moduleRoutes.forEach((route) => router.use(route.path, route.route))

export default router

