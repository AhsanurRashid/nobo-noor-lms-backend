"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const userSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    role: {
        type: String,
        enum: ["student", "instructor", "admin"],
        default: "student",
    },
}, { timestamps: true });
exports.default = (0, mongoose_1.model)("User", userSchema);
