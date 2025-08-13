"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPassword = void 0;
const User_1 = __importDefault(require("../models/User"));
const crypto_1 = __importDefault(require("crypto"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
// import bcrypt from "bcrypt"; // Uncomment if you're using bcrypt for hashing
const resetPassword = async (req, res) => {
    try {
        const { token } = req.params;
        const { password } = req.body;
        if (!token || !password) {
            return res.status(400).json({ code: 400, message: "Token and password are required" });
        }
        const hashedToken = crypto_1.default.createHash("sha256").update(token).digest("hex");
        const user = await User_1.default.findOne({
            resetPasswordToken: hashedToken,
            resetPasswordExpires: { $gt: Date.now() },
        });
        if (!user) {
            return res.status(400).json({ code: 400, message: "Invalid or expired token" });
        }
        const hashedPassword = await bcryptjs_1.default.hash(password, 10);
        user.password = hashedPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();
        return res.status(200).json({ code: 200, message: "Password reset successful" });
    }
    catch (err) {
        console.error("Error in resetPassword:", err);
        return res.status(500).json({
            code: 500,
            message: "Internal Server Error",
            error: err.message || err,
        });
    }
};
exports.resetPassword = resetPassword;
