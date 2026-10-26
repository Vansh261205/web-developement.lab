const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const app = express();

app.use(express.json());
const JWT_SECRET = process.env.JWT_SECRET || "jss_ds_lab_secret_2026";

mongoose.connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/jss_auth_lab");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  branch: { type: String, default: "CSE (Data Science)" },
  passwordHash: { type: String, required: true }
});
const User = mongoose.model("User", userSchema);

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ success: false, message: "Access denied. Token missing." });
  }
  try {
    req.user = jwt.verify(authHeader.split(" ")[1], JWT_SECRET);
    next();
  } catch (err) {
    res.status(403).json({ success: false, message: "Invalid or expired JWT token" });
  }
};

app.post("/api/auth/register", async (req, res) => {
  const { name, email, password } = req.body;
  const passwordHash = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, passwordHash });
  res.status(201).json({ success: true, userId: user._id });
});

app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    return res.status(401).json({ success: false, message: "Invalid credentials" });
  }
  const token = jwt.sign({ id: user._id, email: user.email, branch: user.branch }, JWT_SECRET, { expiresIn: "2h" });
  res.status(200).json({ success: true, token, user: { name: user.name, email: user.email, branch: user.branch } });
});

app.get("/api/auth/profile", verifyToken, (req, res) => {
  res.status(200).json({ success: true, message: "Protected profile accessed", user: req.user });
});

app.post("/api/auth/logout", verifyToken, (req, res) => {
  res.status(200).json({ success: true, message: "User logged out and token cleared" });
});

app.listen(5000, () => console.log("JWT Auth Server running on port 5000"));