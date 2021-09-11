import { mongoose, options } from "../../database";

export interface UserInterface extends Document {
  login: string;
  viewedHours: number;
  viewedVideos: [
    {
      video: any;
      status: "started" | "complete";
      mark: number;
    }
  ];
}

export const ViewedVideoSchema: mongoose.Schema = mongoose.Schema({
  video: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'Video',
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
  mark: {
    type: Number,
    required: true,
  }
}, {
  _id: false
})

export const UserSchema: mongoose.Schema = new mongoose.Schema(
  {
    login: {
      type: String,
      required: true,
    },
    viewedVideos: [ ViewedVideoSchema ],
  },
  options
);

export const User: mongoose.Model<UserInterface> = mongoose.model(
  "User",
  UserSchema
);
