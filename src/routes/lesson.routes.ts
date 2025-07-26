import { Router } from "express";
import { createLesson, updateLesson, deleteLesson } from "../controllers/lesson.controller";
import { getLessonsByCourse } from "../controllers/lesson.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { upload } from "../utils/multer";

const router = Router();

// Multipart/form upload
router.post(
  "/",
  authMiddleware,
  upload.array("resources", 5), // up to 5 files
  createLesson
);

router.put("/:id", authMiddleware, updateLesson);
router.delete("/:id", authMiddleware, deleteLesson);

router.get("/:courseId",  getLessonsByCourse);

export default router;
