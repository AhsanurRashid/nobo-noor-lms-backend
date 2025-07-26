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

//update course
export const updateCourse = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;

  if (req.user?.role !== "instructor") {
    return res.status(403).json({ code: 403, message: "Only instructors can update courses" });
  }

  const { title, description } = req.body;

  try {
    const course = await Course.findById(id);
    if (!course) return res.status(404).json({ code: 404, message: "Course not found" });

    if (String(course.instructor) !== req.user?.id) {
      return res.status(403).json({ code: 403, message: "Only instructor can update this course" });
    }

    course.title = title || course.title;
    course.description = description || course.description;
    await course.save();

    res.status(200).json({ code: 200, message: "Course updated", data: course });
  } catch (err) {
    res.status(500).json({ code: 500, message: "Server error", error: err });
  }
};


// Delete course
export const deleteCourse = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;

  if (req.user?.role !== "instructor") {
    return res.status(403).json({ code: 403, message: "Only instructors can delete courses" });
  }

  try {
    const course = await Course.findById(id);
    if (!course) return res.status(404).json({ code: 404, message: "Course not found" });

    if (String(course.instructor) !== req.user?.id) {
      return res.status(403).json({ code: 403, message: "Only instructor can delete this course" });
    }

    await course.deleteOne();
    res.status(200).json({ code: 200, message: "Course deleted" });
  } catch (err) {
    res.status(500).json({ code: 500, message: "Server error", error: err });     
  }
}