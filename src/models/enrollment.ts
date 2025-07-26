import mongoose, { Schema } from "mongoose";

const enrollmentSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    course: { type: Schema.Types.ObjectId, ref: "Course", required: true },
  },
  { timestamps: true }
);

enrollmentSchema.index({ user: 1, course: 1 }, { unique: true }); // prevent duplicate enrollments

export const Enrollment = mongoose.model("Enrollment", enrollmentSchema);
