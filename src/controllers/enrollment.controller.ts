import { Response } from "express";
import Course from "../models/Course";
import { AuthRequest } from "../middlewares/auth.middleware";

export const enrollInCourse = async (req: AuthRequest, res: Response) => {
  const { courseId } = req.body;

  if (req.user?.role !== "student") {
    return res.status(403).json({ message: "Only students can enroll" });
  }

  try {
    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: "Course not found" });

    const alreadyEnrolled = course.students.includes(req.user.id);
    if (alreadyEnrolled) {
      return res.status(400).json({ message: "Already enrolled in this course" });
    }

    course.students.push(req.user.id);
    await course.save();

    res.status(200).json({ message: "Enrolled successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err });
  }
};

export const getEnrolledStudents = async (req: AuthRequest, res: Response) => {
  const { courseId } = req.params;

  try {
    const course = await Course.findById(courseId).populate("students", "name email");
    if (!course) return res.status(404).json({ message: "Course not found" });

    if (
      req.user?.role !== "admin" &&
      String(course.instructor) !== req.user?.id
    ) {
      return res.status(403).json({ message: "Not authorized to view students" });
    }

    res.status(200).json(course.students);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err });
  }
};
