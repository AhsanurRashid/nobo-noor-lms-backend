import { Response } from "express";
import Course from "../models/Course";
import { AuthRequest } from "../middlewares/auth.middleware";

export const enrollInCourse = async (req: AuthRequest, res: Response) => {
  const { courseId } = req.body;

  if (req.user?.role !== "student") {
    return res.status(403).json({ code: 403, message: "Only students can enroll" });
  }

  try {
    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ code: 404, message: "Course not found" });

    const mongoose = require("mongoose");
    const alreadyEnrolled = course.students.includes(new mongoose.Types.ObjectId(req.user.id));
    if (alreadyEnrolled) {
      return res.status(400).json({ code: 400, message: "Already enrolled in this course" });
    }

    course.students.push(new mongoose.Types.ObjectId(req.user.id));
    await course.save();

    res.status(200).json({ code: 200, message: "Enrolled successfully" });
  } catch (err) {
    res.status(500).json({ code: 500, message: "Server error", error: err });
  }
};

export const getEnrolledStudents = async (req: AuthRequest, res: Response) => {
  const { courseId } = req.params;

  try {
    const course = await Course.findById(courseId).populate("students", "name email");
    if (!course) return res.status(404).json({code: 404, message: "Course not found" });

    if (
      req.user?.role !== "admin" &&
      String(course.instructor) !== req.user?.id
    ) {
      return res.status(403).json({ code: 403, message: "Not authorized to view students" });
    }

    res.status(200).json(course.students);
  } catch (err) {
    res.status(500).json({ code: 500, message: "Server error", error: err });
  }
};
