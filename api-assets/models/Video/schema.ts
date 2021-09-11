import { mongoose, options } from "../../database";

interface VideoInterface extends mongoose.Document {
  id: string;
  duration: number;
  isRequired: boolean;
}

const VideoSchema: mongoose.Schema = new mongoose.Schema(
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

const Video: mongoose.Model<VideoInterface> = mongoose.model(
  "Video",
  VideoSchema
);

export { VideoInterface, VideoSchema, Video };
