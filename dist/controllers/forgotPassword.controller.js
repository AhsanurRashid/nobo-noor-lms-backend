"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.forgotPassword = void 0;
const crypto_1 = __importDefault(require("crypto"));
const User_1 = __importDefault(require("../models/User"));
const send_email_1 = __importDefault(require("../utils/send.email"));
const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ code: 400, message: "Email is required" });
        }
        const user = await User_1.default.findOne({ email });
        if (!user) {
            return res.status(404).json({ code: 404, message: "User not found" });
        }
        // Generate reset token
        const resetToken = crypto_1.default.randomBytes(32).toString("hex");
        const resetTokenExpiry = new Date(Date.now() + 1000 * 60 * 15); // 15 minutes
        user.resetPasswordToken = crypto_1.default.createHash("sha256").update(resetToken).digest("hex");
        user.resetPasswordExpires = resetTokenExpiry;
        await user.save();
        const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;
        const emailBody = `Click the following link to reset your password:\n\n${resetUrl}\n\nThis link will expire in 15 minutes.`;
        await (0, send_email_1.default)(user.email, "Password Reset Request", emailBody);
        return res.status(200).json({ code: 200, message: "Reset email sent successfully" });
    }
    catch (err) {
        console.error("Error in forgotPassword:", err);
        return res.status(500).json({
            code: 500,
            message: "Internal Server Error",
            error: err.message || err,
        });
    }
};
exports.forgotPassword = forgotPassword;
