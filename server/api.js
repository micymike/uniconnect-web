import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer } from 'http';
import { parse } from 'url';

// Get the directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to the feedback data file
const dataDir = path.join(__dirname, '../data');
const feedbackFile = path.join(dataDir, 'feedback.json');

// Ensure data directory exists
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Ensure feedback.json exists
if (!fs.existsSync(feedbackFile)) {
  fs.writeFileSync(feedbackFile, JSON.stringify([]));
}

// Read feedback data
function readFeedbackData() {
  try {
    const data = fs.readFileSync(feedbackFile, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading feedback data:', error);
    return [];
  }
}

// Write feedback data
function writeFeedbackData(data) {
  try {
    fs.writeFileSync(feedbackFile, JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error('Error writing feedback data:', error);
    return false;
  }
}

// Parse JSON body from request
async function parseBody(req) {
  return new Promise((resolve) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      try {
        resolve(JSON.parse(body));
      } catch (e) {
        resolve({});
      }
    });
  });
}

// API routes handler for Vite middleware
export default function setupFeedbackApi(middlewares) {
  middlewares.use(async (req, res, next) => {
    const parsedUrl = parse(req.url, true);
    const { pathname } = parsedUrl;
    
    // GET /api/feedback - Get all feedback
    if (pathname === '/api/feedback' && req.method === 'GET') {
      const feedbacks = readFeedbackData();
      res.writeHead(200, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify(feedbacks));
    }
    
    // POST /api/feedback - Add new feedback
    if (pathname === '/api/feedback' && req.method === 'POST') {
      try {
        const body = await parseBody(req);
        const feedbacks = readFeedbackData();
        
        const newFeedback = {
          id: Date.now().toString(),
          ...body,
          timestamp: new Date().toISOString()
        };
        
        feedbacks.push(newFeedback);
        writeFeedbackData(feedbacks);
        
        res.writeHead(201, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify(newFeedback));
      } catch (error) {
        console.error('Error adding feedback:', error);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ error: 'Failed to add feedback' }));
      }
    }
    
    // DELETE /api/feedback/:id - Delete feedback
    if (pathname.startsWith('/api/feedback/') && req.method === 'DELETE') {
      try {
        const id = pathname.split('/').pop();
        const feedbacks = readFeedbackData();
        const updatedFeedbacks = feedbacks.filter(feedback => feedback.id !== id);
        
        if (feedbacks.length === updatedFeedbacks.length) {
          res.writeHead(404, { 'Content-Type': 'application/json' });
          return res.end(JSON.stringify({ error: 'Feedback not found' }));
        }
        
        writeFeedbackData(updatedFeedbacks);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ message: 'Feedback deleted successfully' }));
      } catch (error) {
        console.error('Error deleting feedback:', error);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ error: 'Failed to delete feedback' }));
      }
    }
    
    // Continue to next middleware if not handled
    next();
  });
}