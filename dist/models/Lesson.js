"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const lessonSchema = new mongoose_1.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    course: { type: mongoose_1.Schema.Types.ObjectId, ref: "Course", required: true },
    videoUrl: { type: String },
    resources: [
        {
            name: { type: String, required: true },
            url: { type: String, required: true },
        },
    ],
}, { timestamps: true });
exports.default = (0, mongoose_1.model)("Lesson", lessonSchema);
