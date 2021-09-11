import { Document, Schema, Model, model } from "mongoose";
import { options } from "../../database";

export interface VideoInterface extends Document {
  id: string;
  duration: number;
  isRequired: boolean;
}

export const VideoSchema: Schema = new Schema(
  {
    id: {
      type: String,
      required: true,
    },
    campaign: {
      type: String,
      required: true,
    },
    duration: {
      type: Number,
      required: true,
    },
    isRequired: {
      type: Boolean,
      default: true,
    },
  },
  options
);

export const Video: Model<VideoInterface> = model("Video", VideoSchema);
