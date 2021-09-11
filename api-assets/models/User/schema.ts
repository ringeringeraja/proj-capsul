import { Document, Schema, SchemaTypes, Model, model } from "mongoose";
import { options } from "../../database";

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

export const ViewedVideoSchema: Schema = new Schema(
  {
    video: {
      type: SchemaTypes.ObjectId,
      ref: "Video",
      required: true,
    },
    status: {
      type: String,
      default: "started",
      validator: (s) => ["started", "complete"].includes(s),
    },
    mark: {
      type: Number,
      default: 0,
    },
  },
  {
    _id: false,
  }
);

export const UserSchema: Schema = new Schema(
  {
    login: {
      type: String,
      required: true,
    },
    viewed: {
      type: Number,
      default: 0,
    },
    viewedVideos: [ViewedVideoSchema],
  },
  options
);

export const User: Model<UserInterface> = model("User", UserSchema);
