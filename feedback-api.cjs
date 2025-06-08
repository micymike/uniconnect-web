const express = require("express");
const fs = require("fs");
const path = require("path");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5001;
const FEEDBACK_FILE = path.join(__dirname, "feedbacks.json");

app.use(cors());
app.use(express.json());

// Helper to read feedbacks from file
function readFeedbacks() {
  try {
    if (!fs.existsSync(FEEDBACK_FILE)) return [];
    const data = fs.readFileSync(FEEDBACK_FILE, "utf-8");
    return JSON.parse(data);
  } catch (err) {
    return [];
  }
}

// Helper to write feedbacks to file
function writeFeedbacks(feedbacks) {
  fs.writeFileSync(FEEDBACK_FILE, JSON.stringify(feedbacks, null, 2));
}

// Get all feedbacks
app.get("/api/feedback", (req, res) => {
  const feedbacks = readFeedbacks();
  res.json(feedbacks);
});

// Add new feedback
app.post("/api/feedback", (req, res) => {
  const feedback = req.body;
  if (!feedback || !feedback.name || !feedback.email || !feedback.subject || !feedback.message) {
    return res.status(400).json({ error: "Missing required fields" });
  }
  feedback.timestamp = feedback.timestamp || new Date().toISOString();
  feedback.id = Date.now().toString() + Math.random().toString(36).substr(2, 6);
  const feedbacks = readFeedbacks();
  feedbacks.push(feedback);
  writeFeedbacks(feedbacks);
  res.status(201).json({ success: true, feedback });
});

// Delete feedback by id
app.delete("/api/feedback/:id", (req, res) => {
  const { id } = req.params;
  let feedbacks = readFeedbacks();
  const initialLength = feedbacks.length;
  feedbacks = feedbacks.filter(fb => fb.id !== id);
  if (feedbacks.length === initialLength) {
    return res.status(404).json({ error: "Feedback not found" });
  }
  writeFeedbacks(feedbacks);
  res.json({ success: true });
});

app.listen(PORT, () => {
  console.log(`Feedback API server running on http://localhost:${PORT}`);
});
