import express from "express";
import Task from "../models/Task.js";
import protect from "../middleware/auth.js";

const router = express.Router();

// CREATE TASK
router.post("/", protect, async (req, res) => {
  const { title, description, dueDate, priority } = req.body;

  if (!title) return res.status(400).json({ message: "Title is required" });

  const task = new Task({
    user: req.user.id,
    title,
    description,
    dueDate,
    priority
  });

  await task.save();
  res.status(201).json(task);
});

// GET ALL TASKS FOR USER
router.get("/", protect, async (req, res) => {
  const tasks = await Task.find({ user: req.user.id }).sort({ createdAt: -1 });
  res.status(200).json(tasks);
});

// GET SINGLE TASK
router.get("/:id", protect, async (req, res) => {
  const task = await Task.findOne({ _id: req.params.id, user: req.user.id });
  if (!task) return res.status(404).json({ message: "Task not found" });
  res.status(200).json(task);
});

// UPDATE TASK
router.put("/:id", protect, async (req, res) => {
  const task = await Task.findOne({ _id: req.params.id, user: req.user.id });
  if (!task) return res.status(404).json({ message: "Task not found" });

  const { title, description, dueDate, priority, completed } = req.body;

  if (title !== undefined) task.title = title;
  if (description !== undefined) task.description = description;
  if (dueDate !== undefined) task.dueDate = dueDate;
  if (priority !== undefined) task.priority = priority;
  if (completed !== undefined) task.completed = completed;

  await task.save();
  res.status(200).json(task);
});

// DELETE TASK
router.delete("/:id", protect, async (req, res) => {
  const task = await Task.findOneAndDelete({ _id: req.params.id, user: req.user.id });
  if (!task) return res.status(404).json({ message: "Task not found" });

  res.status(200).json({ message: "Task deleted successfully" });
});

export default router;
