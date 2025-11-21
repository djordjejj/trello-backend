import { Request, Response } from "express";
import Task from "../models/Task";

export const getAllTasks = async (req: Request, res: Response) => {
  try {
    const tasks = await Task.find().populate("assignedUserId");
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: "Error fetching tasks" });
  }
};

export const getTask = async (req: Request, res: Response) => {
  try {
    const task = await Task.findById(req.params.id).populate("assignedUserId");
    if (!task) return res.status(404).json({ error: "Task not found" });
    res.json(task);
  } catch {
    res.status(500).json({ error: "Error fetching task" });
  }
};

const allowedUsers = ["unassigned", "JD", "AJ", "SS"];

export const createTask = async (req: Request, res: Response) => {
  try {
    const { title, description, status, assignedUser } = req.body;

    if (!allowedUsers.includes(assignedUser)) {
      return res.status(400).json({
        message: "Invalid assignedUser. Valid values: unassigned, JD, AJ, SS",
      });
    }

    const task = await Task.create({
      title,
      description,
      status,
      assignedUser,
    });

    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const updateTask = async (req: Request, res: Response) => {
  try {
    const { assignedUser } = req.body;

    if (assignedUser && !allowedUsers.includes(assignedUser)) {
      return res.status(400).json({
        message: "Invalid assignedUser. Valid values: unassigned, JD, AJ, SS",
      });
    }

    const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!task) return res.status(404).json({ message: "Task not found" });

    res.json(task);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteTask = async (req: Request, res: Response) => {
  try {
    const deleted = await Task.findByIdAndDelete(req.params.id);

    if (!deleted) return res.status(404).json({ error: "Task not found" });

    res.json({ message: "Task deleted" });
  } catch {
    res.status(500).json({ error: "Error deleting task" });
  }
};
