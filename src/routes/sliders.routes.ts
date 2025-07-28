import { Router } from "express";
import { getLessonsByCourse } from "../controllers/lesson.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { uploadSliders } from "../utils/multer.sliders";
import { createSliders, deleteSliders, getSliders, updateSlider } from "../controllers/sliders.controller";

const router = Router();

// Multipart/form upload
router.post(
  "/",
  authMiddleware,
  uploadSliders.single("slider"), // up to 5 files
  createSliders
);

// router.put("/:id", authMiddleware, uploadSliders.array("resources", 5), updateSliders);
// router.delete("/:id", authMiddleware, deleteSliders);

router.get("/",  getSliders);
router.delete("/:id", authMiddleware, deleteSliders);
router.put("/:id", authMiddleware, uploadSliders.single("slider"), updateSlider);

export default router;
