import { Request, Response } from "express";
import Lesson from "../models/Lesson";
import Course from "../models/Course";
import { AuthRequest } from "../middlewares/auth.middleware";

export const createLesson = async (req: AuthRequest, res: Response) => {
  const { title, content, courseId, videoUrl } = req.body;

  try {
    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ code: 404, message: "Course not found" });

    if (String(course.instructor) !== req.user?.id) {
      return res.status(403).json({ code: 403, message: "Only instructor can add lessons" });
    }

    const resources = (Array.isArray(req.files) ? req.files : []).map((file: any) => ({
      name: file.originalname,
      url: `/uploads/lessons/${file.filename}`,
    }));

    const lesson = await Lesson.create({
      title,
      content,
      course: courseId,
      videoUrl,
      resources,
    });

    course.lessons.push(lesson._id as import("mongoose").Types.ObjectId);
    await course.save();

    res.status(201).json({ code: 201, message: "Lesson created", lesson });
  } catch (err) {
    res.status(500).json({ code: 500, message: "Server error", error: err });
  }
};


export const getLessonsByCourse = async (req: Request, res: Response) => {
  const { courseId } = req.params;
  try {
    const lessons = await Lesson.find({ course: courseId });
    res.status(200).json({ code: 200, message: "Lessons fetched", lessons });
  } catch (err) {
    res.status(500).json({ code: 500, message: "Server error", error: err });
  }
};


export const updateLesson = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { title, content, videoUrl } = req.body;

  try {
    const lesson = await Lesson.findById(id);
    if (!lesson) return res.status(404).json({ code: 404, message: "Lesson not found" });

    const course = await Course.findById(lesson.course);
    if (String(course?.instructor) !== req.user?.id) {
      return res.status(403).json({ code: 403, message: "Only instructor can update this lesson" });
    }

    lesson.title = title || lesson.title;
    lesson.content = content || lesson.content;
    lesson.videoUrl = videoUrl || lesson.videoUrl;

    if (req.files) {
      const newFiles = (req.files as Express.Multer.File[]).map((file) => ({
        name: file.originalname,
        url: `/uploads/lessons/${file.filename}`,
      }));
      lesson.resources = [...lesson.resources, ...newFiles];
    }

    await lesson.save();
    res.status(200).json({ code: 200, message: "Lesson updated", lesson });
  } catch (err) {
    res.status(500).json({ code: 500, message: "Server error", error: err });
  }
};

export const deleteLesson = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;

  try {
    const lesson = await Lesson.findById(id);
    if (!lesson) return res.status(404).json({ code: 404, message: "Lesson not found" });

    const course = await Course.findById(lesson.course);
    if (!course) {
      return res.status(404).json({ code: 404, message: "Course not found" });
    }
    if (String(course.instructor) !== req.user?.id) {
      return res.status(403).json({ code: 403, message: "Only instructor can delete this lesson" });
    }

    await lesson.deleteOne();
    await Course.findByIdAndUpdate(course._id, {
      $pull: { lessons: lesson._id },
    });

    res.status(200).json({ code: 200, message: "Lesson deleted" });
  } catch (err) {
    res.status(500).json({ code: 500, message: "Server error", error: err });
  }
};
