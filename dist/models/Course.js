"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const courseSchema = new mongoose_1.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        trim: true,
    },
    thumbnail: {
        type: String,
        required: true,
    },
    price: {
        type: mongoose_1.Schema.Types.Mixed,
        required: true,
    },
    instructor: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    students: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: "User",
        },
    ],
    lessons: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: "Lesson",
        },
    ],
}, { timestamps: true });
exports.default = (0, mongoose_1.model)("Course", courseSchema);
