import { Request, Response } from "express";
import { AuthRequest } from "../middlewares/auth.middleware";
import Course from "../models/Course";

export const createCourse = async (req: AuthRequest, res: Response) => {
  if (req.user?.role !== "instructor")
    return res.status(403).json({ code: 403, message: "Only instructors can create courses" });

  const { title, description } = req.body;
  try {
    const course = await Course.create({
      title,
      description, 
      instructor: req.user.id,
    });
    res.status(201).json({ code: 201, message: "Course created", data: course });
  } catch (err) {
    res.status(500).json({code: 500, message: "Server error", error: err });
  }
};

export const getCourses = async (_: Request, res: Response) => {
    try {
        const courses = await Course.find().populate("instructor", "name email");
        res.json({ code: 200, message: "Courses fetched successfully", data: courses });
    } catch (err) {
        res.status(500).json({ code: 500, message: "Server error", error: err });
    }
};
