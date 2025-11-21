import express from "express";
import cors from "cors";
import taskRoutes from "./routes/taskRoutes";
import connectDB from "./config/db";

const app = express();

app.use(cors());
app.use(express.json());

if (process.env.NODE_ENV !== "test") {
  connectDB();
}

app.use("/api/tasks", taskRoutes);

export default app;
