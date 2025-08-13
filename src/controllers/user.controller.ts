import { Response } from "express";
import User from "../models/User";
import { AuthRequest } from "../middlewares/auth.middleware";
import bcrypt from "bcryptjs";
import Course from "../models/Course";

// Create
export const createUser = async (req: AuthRequest, res: Response) => {

    if (req.user?.role !== "admin") {
        return res.status(403).json({ code: 403, message: "Only admins can create users" });
    }

    const { name, email, password, role, phone } = req.body;

  try {
    const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: "Email already exists" });
    
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({ name, email, password: hashedPassword, role, phone });

        res.status(201).json({code: 201, message: "User created successfully", user: { id: user._id, email: user.email, role: user.role, phone: user.phone }});
  } catch (err) {
    res.status(500).json({ code: 500, message: "Error creating user", error: err });
  }
};

// Get all users
export const getUsers = async (req: AuthRequest, res: Response) => {
  if (req.user?.role !== "admin") {
    return res.status(403).json({ code: 403, message: "Only admins can view users" });
  }

  const search = req.query.search?.toString() || "";
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const skip = (page - 1) * limit;

  try {
    const searchFilter = search
      ? {
          $or: [
            { name: { $regex: search, $options: "i" } },
            { email: { $regex: search, $options: "i" } },
            { phone: { $regex: search, $options: "i" } },
          ],
        }
      : {};

    const [users, total] = await Promise.all([
      User.find(searchFilter).skip(skip).limit(limit).select("-password"),
      User.countDocuments(searchFilter),
    ]);

    res.status(200).json({ code: 200, message: "Users fetched successfully", users,  pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      }});
  } catch (err) {
    res.status(500).json({ code: 500, message: "Server error", error: err });
  }
};

// Get user by ID
export const getUserById = async (req: AuthRequest, res: Response) => {
  const { userId } = req.params;
    if(req.user?.role !== "admin" && String(req.user?.id) !== userId) {
        return res.status(403).json({ code: 403, message: "Not authorized to view this user" });
    }
  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ code: 404, message: "User not found" });

    res.status(200).json({ code: 200, message: "User fetched successfully", user });
  } catch (err) {
    res.status(500).json({ code: 500, message: "Server error", error: err });
  }
}


// Update user
export const updateUser = async (req: AuthRequest, res: Response) => {
  const { userId } = req.params;
  if (req.user?.role !== "admin" && String(req.user?.id) !== userId) {
    return res.status(403).json({ code: 403, message: "Not authorized to update this user" });
  }

  const { name, email, role, phone } = req.body;

  try {
    const user = await User.findByIdAndUpdate(userId, { name, email, role, phone }, { new: true });
    if (!user) return res.status(404).json({ code: 404, message: "User not found" });

    res.status(200).json({ code: 200, message: "User updated successfully", user });
  } catch (err) {
    res.status(500).json({ code: 500, message: "Server error", error: err });
  }
};

// Delete user
export const deleteUser = async (req: AuthRequest, res: Response) => {
  const { userId } = req.params;
  if (req.user?.role !== "admin") {
    return res.status(403).json({ code: 403, message: "Only admins can delete users" });
  }

  try {
    const user = await User.findByIdAndDelete(userId);
    if (!user) return res.status(404).json({ code: 404, message: "User not found" });

    res.status(200).json({ code: 200, message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ code: 500, message: "Server error", error: err });
  }
};


// need controller for users count for admin role, student role, instructor role
export const getUserCountByRole = async (req: AuthRequest, res: Response) => {
  if (req.user?.role !== "admin") {
    return res.status(403).json({ code: 403, message: "Only admins can view user counts" });
  }

  try {
    const adminCount = await User.countDocuments({ role: "admin" });
    const studentCount = await User.countDocuments({ role: "student" });
    const instructorCount = await User.countDocuments({ role: "instructor" });
    const courseCount = await Course.countDocuments();

    res.status(200).json({
      code: 200,
      message: "User counts fetched successfully",
      counts: {
        admin: adminCount,
        student: studentCount,
        instructor: instructorCount,
        course: courseCount
      }
    });
  } catch (err) {
    res.status(500).json({ code: 500, message: "Server error", error: err });
  }
}