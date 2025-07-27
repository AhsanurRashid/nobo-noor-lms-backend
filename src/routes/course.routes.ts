import { Router } from "express";
import { createCourse, deleteCourse, getCourses, updateCourse } from "../controllers/course.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { uploadCourse } from "../utils/multer.course";

const router = Router();

router.post("/", authMiddleware, uploadCourse.single("thumbnail"), createCourse);
router.get("/", getCourses);
router.put("/:id", authMiddleware, uploadCourse.single("thumbnail"), updateCourse);
router.delete("/:id", authMiddleware, deleteCourse);

export default router;
