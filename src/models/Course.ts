import { Schema, model, Document, Types } from "mongoose";

export interface ICourse extends Document {
  title: string;
  description: string;
  thumbnail: string;
  price: string | number;
  instructor: Types.ObjectId;
  students: Types.ObjectId[];
  lessons: Types.ObjectId[];
}

const courseSchema = new Schema<ICourse>(
  {
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
      type: Schema.Types.Mixed,
      required: true,
    },
    instructor: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    students: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    lessons: [
      {
        type: Schema.Types.ObjectId,
        ref: "Lesson",
      },
    ],
  },
  { timestamps: true }
);

export default model<ICourse>("Course", courseSchema);
