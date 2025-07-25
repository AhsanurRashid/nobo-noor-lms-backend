import { Request, Response } from "express";
import Lesson from "../models/Lesson";
import Course from "../models/Course";
import { AuthRequest } from "../middlewares/auth.middleware";

export const createLesson = async (req: AuthRequest, res: Response) => {
  const { title, content, courseId, videoUrl, resources } = req.body;

  try {
    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: "Course not found" });

    if (String(course.instructor) !== req.user?.id) {
      return res.status(403).json({ message: "Only the instructor can add lessons" });
    }

    const lesson = await Lesson.create({ title, content, videoUrl, resources, course: courseId });
    course.lessons.push(lesson._id as typeof course.lessons[0]);
    await course.save();

    res.status(201).json({ code: 201, message: "Lesson created successfully", data: lesson });
  } catch (err) {
    res.status(500).json({ code: 500, message: "Server error", error: err });
  }
};

export const getLessonsByCourse = async (req: Request, res: Response) => {
  const { courseId } = req.params;
  try {
    const lessons = await Lesson.find({ course: courseId });
    res.json(lessons);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err });
  }
};
