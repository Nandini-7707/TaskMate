// server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";

dotenv.config();
connectDB();

const app = express();
app.use(express.json());
app.use(cors());


// routes
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);

// basic root
app.get("/", (req, res) => {
  res.send("TaskMate API is running.");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
