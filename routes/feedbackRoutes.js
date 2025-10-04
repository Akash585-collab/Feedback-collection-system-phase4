const express = require("express");
const jwt = require("jsonwebtoken");

const router = express.Router();

// Temporary in-memory feedback store
const feedbacks = [];

// Middleware to check JWT
function authMiddleware(req, res, next) {
  const token = req.headers["authorization"];
  if (!token) return res.status(403).json({ message: "No token provided" });

  jwt.verify(token, "secret123", (err, decoded) => {
    if (err) return res.status(401).json({ message: "Unauthorized" });
    req.user = decoded;
    next();
  });
}

// Submit feedback
router.post("/", authMiddleware, (req, res) => {
  const { feedback } = req.body;
  feedbacks.push({ email: req.user.email, feedback });
  res.json({ message: "✅ Feedback submitted" });
});

// Get all feedback (protected)
router.get("/", authMiddleware, (req, res) => {
  res.json(feedbacks);
});

module.exports = router;
