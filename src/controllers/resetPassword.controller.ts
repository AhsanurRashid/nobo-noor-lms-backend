import { Request, Response } from "express";
import User from "../models/User";
import crypto from "crypto";
// import bcrypt from "bcrypt"; // Uncomment if you're using bcrypt for hashing

export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    if (!token || !password) {
      return res.status(400).json({ code: 400, message: "Token and password are required" });
    }

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ code: 400, message: "Invalid or expired token" });
    }

    // ⚠️ Hash the password before saving (this is just placeholder)
    // user.password = await bcrypt.hash(password, 10); // If using bcrypt
    user.password = password; // <-- Replace this line after adding hashing middleware or manual hashing

    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    return res.status(200).json({ code: 200, message: "Password reset successful" });
  } catch (err) {
    console.error("Error in resetPassword:", err);
    return res.status(500).json({
      code: 500,
      message: "Internal Server Error",
      error: (err as Error).message || err,
    });
  }
};
