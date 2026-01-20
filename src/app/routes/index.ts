import { Router } from "express";

const router = Router()

const moduleRoutes=[{
    path: "/user",
    route: "sfsd"
}]

moduleRoutes.forEach((route: {path: string, route: string})=> router.use(route.path, router.route))

export default router

