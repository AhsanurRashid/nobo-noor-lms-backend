"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCourse = exports.updateCourse = exports.getCourses = exports.createCourse = void 0;
const Course_1 = __importDefault(require("../models/Course"));
const createCourse = async (req, res) => {
    if (req.user?.role !== "instructor")
        return res.status(403).json({ code: 403, message: "Only instructors can create courses" });
    const { title, description, price } = req.body;
    if (!req.file) {
        return res.status(400).json({ code: 400, message: "Thumbnail is required" });
    }
    if (!title || !description || !price) {
        return res.status(400).json({ code: 400, message: "Title, description, and price are required" });
    }
    //if price is a type of number then check price is greater than 0
    if (typeof price === "number" && price <= 0) {
        return res.status(400).json({ code: 400, message: "Price must be a positive number" });
    }
    // now handle thumbnail upload
    const thumbnailUrl = `/uploads/courses/${req.file.filename}`;
    try {
        const course = await Course_1.default.create({
            title,
            description,
            price,
            instructor: req.user.id,
            thumbnail: thumbnailUrl,
        });
        res.status(201).json({ code: 201, message: "Course created", data: course });
    }
    catch (err) {
        res.status(500).json({ code: 500, message: "Server error", error: err });
    }
};
exports.createCourse = createCourse;
const getCourses = async (req, res) => {
    const search = req.query.search?.toString() || "";
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    try {
        const searchFilter = search
            ? {
                $or: [
                    { title: { $regex: search, $options: "i" } },
                    { description: { $regex: search, $options: "i" } },
                ],
            }
            : {};
        const [courses, total] = await Promise.all([
            Course_1.default.find(searchFilter)
                .skip(skip)
                .limit(limit)
                .populate("instructor", "name email"),
            Course_1.default.countDocuments(searchFilter),
        ]);
        res.status(200).json({
            code: 200,
            message: "Courses fetched successfully",
            data: courses,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            }
        });
    }
    catch (err) {
        res.status(500).json({ code: 500, message: "Server error", error: err });
    }
};
exports.getCourses = getCourses;
//update course
const updateCourse = async (req, res) => {
    const { id } = req.params;
    if (req.user?.role !== "instructor") {
        return res.status(403).json({ code: 403, message: "Only instructors can update courses" });
    }
    const { title, description, price } = req.body;
    try {
        const course = await Course_1.default.findById(id);
        if (!course)
            return res.status(404).json({ code: 404, message: "Course not found" });
        if (String(course.instructor) !== req.user?.id) {
            return res.status(403).json({ code: 403, message: "Only instructor can update this course" });
        }
        course.title = title || course.title;
        course.description = description || course.description;
        course.price = price || course.price;
        if (req.file) {
            course.thumbnail = `/uploads/courses/${req.file.filename}` || course.thumbnail;
        }
        await course.save();
        res.status(200).json({ code: 200, message: "Course updated", data: course });
    }
    catch (err) {
        res.status(500).json({ code: 500, message: "Server error", error: err });
    }
};
exports.updateCourse = updateCourse;
// Delete course
const deleteCourse = async (req, res) => {
    const { id } = req.params;
    if (req.user?.role !== "instructor") {
        return res.status(403).json({ code: 403, message: "Only instructors can delete courses" });
    }
    try {
        const course = await Course_1.default.findById(id);
        if (!course)
            return res.status(404).json({ code: 404, message: "Course not found" });
        if (String(course.instructor) !== req.user?.id) {
            return res.status(403).json({ code: 403, message: "Only instructor can delete this course" });
        }
        await course.deleteOne();
        res.status(200).json({ code: 200, message: "Course deleted" });
    }
    catch (err) {
        res.status(500).json({ code: 500, message: "Server error", error: err });
    }
};
exports.deleteCourse = deleteCourse;
