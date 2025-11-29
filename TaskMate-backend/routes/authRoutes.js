import express from "express";
import bcrypt from "bcryptjs";
import User from "../models/User.js";
import jwt from "jsonwebtoken";

const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    const { name,usn, email, password } = req.body;

    console.log("REQUEST BODY:", req.body);

    if (!name  || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(409).json({ message: "Email already exists" });
    }

   const newUser = new User({
  name,
  //usn,
  email,
  password
});


    await newUser.save();

    res.status(201).json({
      message: "User registered successfully",
      user: {
        name: newUser.name,
        //usn: newUser.usn,
        email: newUser.email,
        id: newUser._id
      }
    });

  } catch (error) {
    console.error("REGISTER ERROR:", error.message);
    res.status(500).json({ message: "Server error while registering", error: error.message });
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // create JWT token
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });

  } catch (error) {
    console.error("LOGIN ERROR:", error.message);
    res.status(500).json({ message: "Server error while logging in", error: error.message });
  }
});


export default router;
