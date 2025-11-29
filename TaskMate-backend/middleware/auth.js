import jwt from "jsonwebtoken";
import User from "../models/User.js";

const protect = async (req, res, next) => {
  let token = null;

  const authHeader = req.headers.authorization || req.headers.Authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.split(" ")[1];
  }

  if (!token) {
    return res.status(401).json({ message: "Not authorized, token missing" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Check if decoded.id exists
    if (!decoded.id) {
      return res.status(401).json({ message: "Token missing user id" });
    }

    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = user; // attach user safely
    next();
  } catch (error) {
    console.error(error);
    return res.status(401).json({ message: "Not authorized, token invalid" });
  }
};

export default protect;
