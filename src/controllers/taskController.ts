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

export const createTask = async (req: Request, res: Response) => {
  try {
    const { title, description, status, assignedUserId } = req.body;

    const task = await Task.create({
      title,
      description,
      status,
      assignedUserId,
    });

    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ error: "Error creating task" });
  }
};

export const updateTask = async (req: Request, res: Response) => {
  try {
    const updated = await Task.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updated) return res.status(404).json({ error: "Task not found" });

    res.json(updated);
  } catch {
    res.status(500).json({ error: "Error updating task" });
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
