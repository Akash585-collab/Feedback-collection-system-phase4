const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const router = express.Router();

// Temporary in-memory users store
const users = [];

// Register
router.post("/register", async (req, res) => {
  const { email, password } = req.body;
  const existing = users.find((u) => u.email === email);
  if (existing) return res.json({ message: "User already exists" });

  const hashed = await bcrypt.hash(password, 10);
  users.push({ email, password: hashed });

  res.json({ message: "✅ User registered successfully" });
});

// Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = users.find((u) => u.email === email);
  if (!user) return res.json({ message: "User not found" });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.json({ message: "Invalid credentials" });

  const token = jwt.sign({ email }, "secret123", { expiresIn: "1h" });
  res.json({ message: "✅ Login successful", token });
});

module.exports = router;
