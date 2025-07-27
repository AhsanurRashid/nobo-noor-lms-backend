"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEnrolledStudents = exports.enrollInCourse = void 0;
const Course_1 = __importDefault(require("../models/Course"));
const enrollInCourse = async (req, res) => {
    const { courseId } = req.body;
    if (req.user?.role !== "student") {
        return res.status(403).json({ code: 403, message: "Only students can enroll" });
    }
    try {
        const course = await Course_1.default.findById(courseId);
        if (!course)
            return res.status(404).json({ code: 404, message: "Course not found" });
        const mongoose = require("mongoose");
        const alreadyEnrolled = course.students.includes(new mongoose.Types.ObjectId(req.user.id));
        if (alreadyEnrolled) {
            return res.status(400).json({ code: 400, message: "Already enrolled in this course" });
        }
        course.students.push(new mongoose.Types.ObjectId(req.user.id));
        await course.save();
        res.status(200).json({ code: 200, message: "Enrolled successfully" });
    }
    catch (err) {
        res.status(500).json({ code: 500, message: "Server error", error: err });
    }
};
exports.enrollInCourse = enrollInCourse;
const getEnrolledStudents = async (req, res) => {
    const { courseId } = req.params;
    try {
        const course = await Course_1.default.findById(courseId).populate("students", "name email");
        if (!course)
            return res.status(404).json({ code: 404, message: "Course not found" });
        if (req.user?.role !== "admin" &&
            String(course.instructor) !== req.user?.id) {
            return res.status(403).json({ code: 403, message: "Not authorized to view students" });
        }
        res.status(200).json(course.students);
    }
    catch (err) {
        res.status(500).json({ code: 500, message: "Server error", error: err });
    }
};
exports.getEnrolledStudents = getEnrolledStudents;
