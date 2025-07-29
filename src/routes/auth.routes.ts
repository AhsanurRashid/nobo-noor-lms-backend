import { Router } from "express";
import { register, login } from "../controllers/auth.controller";
import { forgotPassword } from "../controllers/forgotPassword.controller";
import { resetPassword } from "../controllers/resetPassword.controller";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

export default router;
