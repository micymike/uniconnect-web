import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const FEEDBACK_FILE = path.join(__dirname, "../../feedbacks.json");

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
router.get("/", (req, res) => {
  const feedbacks = readFeedbacks();
  res.json(feedbacks);
});

// Add new feedback
router.post("/", (req, res) => {
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
router.delete("/:id", (req, res) => {
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

export default router;
