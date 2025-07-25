import { Schema, model, Document, Types } from "mongoose";

export interface ILesson extends Document {
  title: string;
  content: string;
  course: Types.ObjectId;
  videoUrl?: string;
  resources: {
    name: string;
    url: string;
  }[];
}

const lessonSchema = new Schema<ILesson>(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    course: { type: Schema.Types.ObjectId, ref: "Course", required: true },
    videoUrl: { type: String },
    resources: [
      {
        name: { type: String, required: true },
        url: { type: String, required: true },
      },
    ],
  },
  { timestamps: true }
);

export default model<ILesson>("Lesson", lessonSchema);
