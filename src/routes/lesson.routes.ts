import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { createLesson, getLessonsByCourse } from "../controllers/lesson.controller";

const router = Router();

router.post("/", authMiddleware, createLesson);
router.get("/:courseId", getLessonsByCourse);

export default router;
