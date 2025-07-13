import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer } from 'http';
import { parse } from 'url';
import { recordVisit, getAnalytics, resetAnalytics } from './analytics.js';

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
    
    // GET /api/analytics - Get analytics data
    if (pathname === '/api/analytics' && req.method === 'GET') {
      const analytics = getAnalytics();
      res.writeHead(200, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify(analytics));
    }
    
    // POST /api/analytics/reset - Reset analytics
    if (pathname === '/api/analytics/reset' && req.method === 'POST') {
      resetAnalytics();
      res.writeHead(200, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ message: 'Analytics reset successfully' }));
    }
    
    // GET /api/rentals - Get all rental properties
    if (pathname === '/api/rentals' && req.method === 'GET') {
      try {
        const response = await fetch(`https://cloud.appwrite.io/v1/databases/67fc08930035410438a5/collections/6813961c00369dd87643/documents?queries[0]={"method":"limit","values":[100]}`, {
          headers: {
            'X-Appwrite-Project': '67fc0576000b05b9e495',
            'X-Appwrite-Key': process.env.VITE_APPWRITE_API_KEY
          }
        });
        const data = await response.json();
        res.writeHead(200, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ success: true, data: data.documents }));
      } catch (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ success: false, message: err.message }));
      }
    }
    
    // GET /api/rental-units - Get all rental units
    if (pathname === '/api/rental-units' && req.method === 'GET') {
      try {
        const response = await fetch(`https://cloud.appwrite.io/v1/databases/67fc08930035410438a5/collections/6813965c0018e59b3f32/documents?queries[0]={"method":"limit","values":[100]}`, {
          headers: {
            'X-Appwrite-Project': '67fc0576000b05b9e495',
            'X-Appwrite-Key': process.env.VITE_APPWRITE_API_KEY
          }
        });
        const data = await response.json();
        res.writeHead(200, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ success: true, data: data.documents }));
      } catch (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ success: false, message: err.message }));
      }
    }
    
    // Record visit for actual page views only
    if (!pathname.startsWith('/api/') && isActualPageView(pathname)) {
      recordVisit(req);
    }
    
    // Helper function to identify actual page views
    function isActualPageView(path) {
      // Only count main routes as page views
      const mainRoutes = ['/', '/about', '/contact', '/terms', '/privacy', '/admin', 
                         '/meal-sharing', '/rental-listings', '/marketplace'];
      
      // Check if it's a main route or has a file extension (excluding assets)
      return mainRoutes.includes(path) || 
             (path.indexOf('.') === -1 && !path.includes('node_modules'));
    }
    
    // Continue to next middleware if not handled
    next();
  });
}