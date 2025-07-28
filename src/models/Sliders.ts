import { Schema, model, Document, Types } from "mongoose";

export interface ISlider extends Document {
  slider: string;
}

const sliderSchema = new Schema<ISlider>(
  {
    slider: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export default model<ISlider>("Slider", sliderSchema);
