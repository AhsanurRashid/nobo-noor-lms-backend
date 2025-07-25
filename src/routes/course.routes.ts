import { Router } from "express";
import { createCourse, getCourses } from "../controllers/course.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

router.post("/", authMiddleware, createCourse);
router.get("/", getCourses);

export default router;
