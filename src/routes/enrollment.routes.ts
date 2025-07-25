import { Router } from "express";
import { enrollInCourse, getEnrolledStudents } from "../controllers/enrollment.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

router.post("/enroll", authMiddleware, enrollInCourse);
router.get("/:courseId/students", authMiddleware, getEnrolledStudents);

export default router;
