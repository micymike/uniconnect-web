import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const FEEDBACK_FILE = path.join(__dirname, "feedbacks.json");
const DIST_DIR = path.join(__dirname, "dist");

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

// GET /api/feedback
app.get("/api/feedback", (req, res) => {
  const feedbacks = readFeedbacks();
  res.json(feedbacks);
});

// POST /api/feedback
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

// DELETE /api/feedback/:id
app.delete("/api/feedback/:id", (req, res) => {
  const id = req.params.id;
  let feedbacks = readFeedbacks();
  const initialLength = feedbacks.length;
  feedbacks = feedbacks.filter(fb => fb.id !== id);
  if (feedbacks.length === initialLength) {
    return res.status(404).json({ error: "Feedback not found" });
  }
  writeFeedbacks(feedbacks);
  res.json({ success: true });
});

// Serve static files from dist/
app.use(express.static(DIST_DIR));

// Fallback to index.html for SPA routes
app.get("*", (req, res) => {
  res.sendFile(path.join(DIST_DIR, "index.html"));
});

// Start server on 0.0.0.0 and the correct port
const PORT = process.env.PORT || 3000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
});
