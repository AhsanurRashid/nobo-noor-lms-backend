"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteLesson = exports.updateLesson = exports.getLessonsByCourse = exports.createLesson = void 0;
const Lesson_1 = __importDefault(require("../models/Lesson"));
const Course_1 = __importDefault(require("../models/Course"));
const createLesson = async (req, res) => {
    const { title, content, courseId, videoUrl } = req.body;
    try {
        const course = await Course_1.default.findById(courseId);
        if (!course)
            return res.status(404).json({ code: 404, message: "Course not found" });
        if (String(course.instructor) !== req.user?.id) {
            return res.status(403).json({ code: 403, message: "Only instructor can add lessons" });
        }
        const resources = (Array.isArray(req.files) ? req.files : []).map((file) => ({
            name: file.originalname,
            url: `/uploads/lessons/${file.filename}`,
        }));
        const lesson = await Lesson_1.default.create({
            title,
            content,
            course: courseId,
            videoUrl,
            resources,
        });
        course.lessons.push(lesson._id);
        await course.save();
        res.status(201).json({ code: 201, message: "Lesson created", lesson });
    }
    catch (err) {
        res.status(500).json({ code: 500, message: "Server error", error: err });
    }
};
exports.createLesson = createLesson;
const getLessonsByCourse = async (req, res) => {
    const { courseId } = req.params;
    try {
        const lessons = await Lesson_1.default.find({ course: courseId });
        res.status(200).json({ code: 200, message: "Lessons fetched", lessons });
    }
    catch (err) {
        res.status(500).json({ code: 500, message: "Server error", error: err });
    }
};
exports.getLessonsByCourse = getLessonsByCourse;
const updateLesson = async (req, res) => {
    const { id } = req.params;
    const { title, content, videoUrl } = req.body;
    try {
        const lesson = await Lesson_1.default.findById(id);
        if (!lesson)
            return res.status(404).json({ code: 404, message: "Lesson not found" });
        const course = await Course_1.default.findById(lesson.course);
        if (String(course?.instructor) !== req.user?.id) {
            return res.status(403).json({ code: 403, message: "Only instructor can update this lesson" });
        }
        lesson.title = title || lesson.title;
        lesson.content = content || lesson.content;
        lesson.videoUrl = videoUrl || lesson.videoUrl;
        if (req.files) {
            const newFiles = req.files.map((file) => ({
                name: file.originalname,
                url: `/uploads/lessons/${file.filename}`,
            }));
            lesson.resources = [...lesson.resources, ...newFiles];
        }
        await lesson.save();
        res.status(200).json({ code: 200, message: "Lesson updated", lesson });
    }
    catch (err) {
        res.status(500).json({ code: 500, message: "Server error", error: err });
    }
};
exports.updateLesson = updateLesson;
const deleteLesson = async (req, res) => {
    const { id } = req.params;
    try {
        const lesson = await Lesson_1.default.findById(id);
        if (!lesson)
            return res.status(404).json({ code: 404, message: "Lesson not found" });
        const course = await Course_1.default.findById(lesson.course);
        if (!course) {
            return res.status(404).json({ code: 404, message: "Course not found" });
        }
        if (String(course.instructor) !== req.user?.id) {
            return res.status(403).json({ code: 403, message: "Only instructor can delete this lesson" });
        }
        await lesson.deleteOne();
        await Course_1.default.findByIdAndUpdate(course._id, {
            $pull: { lessons: lesson._id },
        });
        res.status(200).json({ code: 200, message: "Lesson deleted" });
    }
    catch (err) {
        res.status(500).json({ code: 500, message: "Server error", error: err });
    }
};
exports.deleteLesson = deleteLesson;
