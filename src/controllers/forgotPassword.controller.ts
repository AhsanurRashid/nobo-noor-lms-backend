import crypto from "crypto";
import User from "../models/User";
import { Request, Response } from "express";
import sendEmail from "../utils/send.email";

export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ code: 400, message: "Email is required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ code: 404, message: "User not found" });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExpiry = new Date(Date.now() + 1000 * 60 * 15); // 15 minutes

    user.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");
    user.resetPasswordExpires = resetTokenExpiry;

    await user.save();

    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;
    const emailBody = `Click the following link to reset your password:\n\n${resetUrl}\n\nThis link will expire in 15 minutes.`;

    await sendEmail(user.email, "Password Reset Request", emailBody);

    return res.status(200).json({ code: 200, message: "Reset email sent successfully" });
  } catch (err) {
    console.error("Error in forgotPassword:", err);
    return res.status(500).json({
      code: 500,
      message: "Internal Server Error",
      error: (err as Error).message || err,
    });
  }
};

