import { Router } from "express";
import { createCourse, deleteCourse, getCourses, updateCourse } from "../controllers/course.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

router.post("/", authMiddleware, createCourse);
router.get("/", getCourses);
router.put("/:id", authMiddleware, updateCourse);
router.delete("/:id", authMiddleware, deleteCourse);

export default router;
