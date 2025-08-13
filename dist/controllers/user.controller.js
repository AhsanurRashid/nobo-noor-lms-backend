"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserCountByRole = exports.deleteUser = exports.updateUser = exports.getUserById = exports.getUsers = exports.createUser = void 0;
const User_1 = __importDefault(require("../models/User"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const Course_1 = __importDefault(require("../models/Course"));
// Create
const createUser = async (req, res) => {
    if (req.user?.role !== "admin") {
        return res.status(403).json({ code: 403, message: "Only admins can create users" });
    }
    const { name, email, password, role, phone } = req.body;
    try {
        const existingUser = await User_1.default.findOne({ email });
        if (existingUser)
            return res.status(400).json({ message: "Email already exists" });
        const hashedPassword = await bcryptjs_1.default.hash(password, 10);
        const user = await User_1.default.create({ name, email, password: hashedPassword, role, phone });
        res.status(201).json({ code: 201, message: "User created successfully", user: { id: user._id, email: user.email, role: user.role, phone: user.phone } });
    }
    catch (err) {
        res.status(500).json({ code: 500, message: "Error creating user", error: err });
    }
};
exports.createUser = createUser;
// Get all users
const getUsers = async (req, res) => {
    if (req.user?.role !== "admin") {
        return res.status(403).json({ code: 403, message: "Only admins can view users" });
    }
    const search = req.query.search?.toString() || "";
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
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
            User_1.default.find(searchFilter).skip(skip).limit(limit).select("-password"),
            User_1.default.countDocuments(searchFilter),
        ]);
        res.status(200).json({ code: 200, message: "Users fetched successfully", users, pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            } });
    }
    catch (err) {
        res.status(500).json({ code: 500, message: "Server error", error: err });
    }
};
exports.getUsers = getUsers;
// Get user by ID
const getUserById = async (req, res) => {
    const { userId } = req.params;
    if (req.user?.role !== "admin" && String(req.user?.id) !== userId) {
        return res.status(403).json({ code: 403, message: "Not authorized to view this user" });
    }
    try {
        const user = await User_1.default.findById(userId);
        if (!user)
            return res.status(404).json({ code: 404, message: "User not found" });
        res.status(200).json({ code: 200, message: "User fetched successfully", user });
    }
    catch (err) {
        res.status(500).json({ code: 500, message: "Server error", error: err });
    }
};
exports.getUserById = getUserById;
// Update user
const updateUser = async (req, res) => {
    const { userId } = req.params;
    if (req.user?.role !== "admin" && String(req.user?.id) !== userId) {
        return res.status(403).json({ code: 403, message: "Not authorized to update this user" });
    }
    const { name, email, password, role, phone } = req.body;
    try {
        const user = await User_1.default.findByIdAndUpdate(userId, { name, email, password, role, phone }, { new: true });
        if (!user)
            return res.status(404).json({ code: 404, message: "User not found" });
        res.status(200).json({ code: 200, message: "User updated successfully", user });
    }
    catch (err) {
        res.status(500).json({ code: 500, message: "Server error", error: err });
    }
};
exports.updateUser = updateUser;
// Delete user
const deleteUser = async (req, res) => {
    const { userId } = req.params;
    if (req.user?.role !== "admin") {
        return res.status(403).json({ code: 403, message: "Only admins can delete users" });
    }
    try {
        const user = await User_1.default.findByIdAndDelete(userId);
        if (!user)
            return res.status(404).json({ code: 404, message: "User not found" });
        res.status(200).json({ code: 200, message: "User deleted successfully" });
    }
    catch (err) {
        res.status(500).json({ code: 500, message: "Server error", error: err });
    }
};
exports.deleteUser = deleteUser;
// need controller for users count for admin role, student role, instructor role
const getUserCountByRole = async (req, res) => {
    if (req.user?.role !== "admin") {
        return res.status(403).json({ code: 403, message: "Only admins can view user counts" });
    }
    try {
        const adminCount = await User_1.default.countDocuments({ role: "admin" });
        const studentCount = await User_1.default.countDocuments({ role: "student" });
        const instructorCount = await User_1.default.countDocuments({ role: "instructor" });
        const courseCount = await Course_1.default.countDocuments();
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
    }
    catch (err) {
        res.status(500).json({ code: 500, message: "Server error", error: err });
    }
};
exports.getUserCountByRole = getUserCountByRole;
