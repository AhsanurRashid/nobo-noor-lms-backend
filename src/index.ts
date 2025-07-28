import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db";
import authRoutes from "./routes/auth.routes";
import courseRoutes from "./routes/course.routes";
import lessonRoutes from "./routes/lesson.routes";
import enrollmentRoutes from "./routes/enrollment.routes";
import userRoutes from "./routes/user.routes";
import sliderRoutes from "./routes/sliders.routes";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static("uploads"));

app.use("/api/auth", authRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/lessons", lessonRoutes);
app.use("/api/enrollments", enrollmentRoutes);
app.use("/api/users", userRoutes);
app.use("/api/sliders", sliderRoutes);

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`>> Server running on port ${PORT} >>`);
    });
})