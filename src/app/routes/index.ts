import { Router } from "express";
import { authRoutes } from "../modules/auth/auth.routes";
import { UserRoutes } from "../modules/user/user.routes";

const router = Router()

const moduleRoutes = [
    {
        path: "/auth",
        route: authRoutes
    },
    {
        path: "/user",
        route: UserRoutes
    }
]

moduleRoutes.forEach((route) => router.use(route.path, route.route))

export default router

