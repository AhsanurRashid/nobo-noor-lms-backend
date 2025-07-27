"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const lesson_controller_1 = require("../controllers/lesson.controller");
const lesson_controller_2 = require("../controllers/lesson.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const multer_1 = require("../utils/multer");
const router = (0, express_1.Router)();
// Multipart/form upload
router.post("/", auth_middleware_1.authMiddleware, multer_1.upload.array("resources", 5), // up to 5 files
lesson_controller_1.createLesson);
router.put("/:id", auth_middleware_1.authMiddleware, multer_1.upload.array("resources", 5), lesson_controller_1.updateLesson);
router.delete("/:id", auth_middleware_1.authMiddleware, lesson_controller_1.deleteLesson);
router.get("/:courseId", lesson_controller_2.getLessonsByCourse);
exports.default = router;
