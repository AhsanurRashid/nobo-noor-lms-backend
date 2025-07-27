"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const enrollment_controller_1 = require("../controllers/enrollment.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = (0, express_1.Router)();
router.post("/enroll", auth_middleware_1.authMiddleware, enrollment_controller_1.enrollInCourse);
router.get("/:courseId/students", auth_middleware_1.authMiddleware, enrollment_controller_1.getEnrolledStudents);
exports.default = router;
