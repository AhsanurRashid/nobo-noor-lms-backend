"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const db_1 = __importDefault(require("./config/db"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const course_routes_1 = __importDefault(require("./routes/course.routes"));
const lesson_routes_1 = __importDefault(require("./routes/lesson.routes"));
const enrollment_routes_1 = __importDefault(require("./routes/enrollment.routes"));
const user_routes_1 = __importDefault(require("./routes/user.routes"));
const sliders_routes_1 = __importDefault(require("./routes/sliders.routes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use("/uploads", express_1.default.static("uploads"));
app.use("/api/auth", auth_routes_1.default);
app.use("/api/courses", course_routes_1.default);
app.use("/api/lessons", lesson_routes_1.default);
app.use("/api/enrollments", enrollment_routes_1.default);
app.use("/api/users", user_routes_1.default);
app.use("/api/sliders", sliders_routes_1.default);
(0, db_1.default)().then(() => {
    app.listen(PORT, () => {
        console.log(`>> Server running on port ${PORT} >>`);
    });
});
