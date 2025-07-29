import crypto from "crypto"; 
import User from "../models/User";
import { Request, Response } from "express";
import sendEmail from "../utils/send.email";

export const forgotPassword = async (req: Request, res: Response) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: "User not found" });

  const resetToken = crypto.randomBytes(32).toString("hex");
  const resetTokenExpiry = Date.now() + 1000 * 60 * 15; // 15 minutes

  user.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");
  user.resetPasswordExpires = resetTokenExpiry;

  await user.save();

  const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;
  await sendEmail(user.email, "Password Reset", `Reset your password here: ${resetUrl}`);

  res.status(200).json({ message: "Reset email sent" });
};
