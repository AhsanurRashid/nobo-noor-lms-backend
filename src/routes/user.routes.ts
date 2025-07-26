import { Router } from "express";
import {
    createUser,
    getUsers,
    getUserById,
    updateUser,
    deleteUser,
    getUserCountByRole
} from "../controllers/user.controller"
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

router.post("/", authMiddleware, createUser);
router.get("/", authMiddleware, getUsers);
router.get("/count", authMiddleware, getUserCountByRole);
router.get("/:userId", authMiddleware, getUserById);
router.put("/:userId", authMiddleware, updateUser);
router.delete("/:userId", authMiddleware, deleteUser);

export default router;
