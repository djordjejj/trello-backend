import mongoose, { Schema, Document } from "mongoose";

export interface IStatus extends Document {
  name: string;
}

const StatusSchema: Schema = new Schema({
  name: {
    type: String,
    enum: ["todo", "in-progress", "done"],
    required: true,
    unique: true,
  },
});

export default mongoose.model<IStatus>("Status", StatusSchema);
