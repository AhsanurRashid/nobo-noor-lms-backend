"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const multer_sliders_1 = require("../utils/multer.sliders");
const sliders_controller_1 = require("../controllers/sliders.controller");
const router = (0, express_1.Router)();
// Multipart/form upload
router.post("/", auth_middleware_1.authMiddleware, multer_sliders_1.uploadSliders.single("slider"), // up to 5 files
sliders_controller_1.createSliders);
// router.put("/:id", authMiddleware, uploadSliders.array("resources", 5), updateSliders);
// router.delete("/:id", authMiddleware, deleteSliders);
router.get("/", sliders_controller_1.getSliders);
router.delete("/:id", auth_middleware_1.authMiddleware, sliders_controller_1.deleteSliders);
router.put("/:id", auth_middleware_1.authMiddleware, multer_sliders_1.uploadSliders.single("slider"), sliders_controller_1.updateSlider);
exports.default = router;
