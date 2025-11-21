import mongoose, { Schema, Document } from "mongoose";

export interface ITask extends Document {
  title: string;
  description: string;
  status: "todo" | "in-progress" | "done";
  assignedUser: "unassigned" | "JD" | "AJ" | "SS";
}

const TaskSchema = new Schema<ITask>({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: "",
  },
  status: {
    type: String,
    enum: ["todo", "in-progress", "done"],
    required: true,
  },
  assignedUser: {
    type: String,
    enum: ["unassigned", "JD", "AJ", "SS"],
    default: "unassigned",
    required: true,
  },
});

export default mongoose.model<ITask>("Task", TaskSchema);
