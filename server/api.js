import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer } from 'http';
import { parse } from 'url';
import { recordVisit, getAnalytics, resetAnalytics } from './analytics.js';
import webpush from 'web-push';

const vapidKeys = {
  publicKey: "BB8XZ16m7PDlgyWJwA5Db4e9UCShMcJmsjp1ma_Ef2WZMficbWuYU_p8UUE-dL25OYYdvNvSAYr1SPC-R2TqNK8",
  privateKey: "SsDFed3Aub_jpFfJftiPzQfbrGzljLAHFnmhw4tpMEo"
};

webpush.setVapidDetails(
  "mailto:admin@uniconnect.com",
  vapidKeys.publicKey,
  vapidKeys.privateKey
);

const pushSubsFile = path.join(path.dirname(fileURLToPath(import.meta.url)), '../data/push_subscriptions.json');

function readPushSubs() {
  try {
    const data = fs.readFileSync(pushSubsFile, 'utf8');
    return JSON.parse(data);
  } catch (e) {
    return [];
  }
}

function writePushSubs(subs) {
  fs.writeFileSync(pushSubsFile, JSON.stringify(subs, null, 2));
}

function addPushSub(sub) {
  const subs = readPushSubs();
  if (!subs.find(s => s.endpoint === sub.endpoint)) {
    subs.push(sub);
    writePushSubs(subs);
  }
}

function removePushSub(endpoint) {
  const subs = readPushSubs();
  const filtered = subs.filter(s => s.endpoint !== endpoint);
  writePushSubs(filtered);
}

async function sendPushToAll(payload) {
  const subs = readPushSubs();
  for (const sub of subs) {
    try {
      await webpush.sendNotification(sub, JSON.stringify(payload));
    } catch (err) {
      // Remove invalid subscriptions
      if (err.statusCode === 410 || err.statusCode === 404) {
        removePushSub(sub.endpoint);
      }
    }
  }
}

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

    // Register push subscription
    if (pathname === '/api/push-subscribe' && req.method === 'POST') {
      try {
        let body = '';
        req.on('data', chunk => { body += chunk.toString(); });
        await new Promise(resolve => req.on('end', resolve));
        const sub = JSON.parse(body);
        addPushSub(sub);
        res.writeHead(201, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ success: true }));
      } catch (e) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ success: false, error: 'Invalid subscription' }));
      }
    }

    // Notify all subscribers of new house
    if (pathname === '/api/notify-new-house' && req.method === 'POST') {
      try {
        let body = '';
        req.on('data', chunk => { body += chunk.toString(); });
        await new Promise(resolve => req.on('end', resolve));
        const { title, url } = JSON.parse(body);
        await sendPushToAll({
          title: title || "New House Added!",
          body: "A new house has just been listed. Check it out now.",
          url: url || "/rentals"
        });
        res.writeHead(200, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ success: true }));
      } catch (e) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ success: false, error: 'Failed to send notification' }));
      }
    }

    // Unregister push subscription
    if (pathname === '/api/push-unsubscribe' && req.method === 'POST') {
      try {
        let body = '';
        req.on('data', chunk => { body += chunk.toString(); });
        await new Promise(resolve => req.on('end', resolve));
        const { endpoint } = JSON.parse(body);
        removePushSub(endpoint);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ success: true }));
      } catch (e) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ success: false, error: 'Invalid request' }));
      }
    }
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
    
    // GET /api/rentals - Get all rental properties and units, combined
    if (pathname === '/api/rentals' && req.method === 'GET') {
      try {
        // Fetch all rental properties
        const allProperties = [];
        let hasMoreProps = true;
        let cursorProps = null;
        const batchSize = 100;
        while (hasMoreProps) {
          let url = `https://cloud.appwrite.io/v1/databases/67fc08930035410438a5/collections/6813961c00369dd87643/documents?limit=${batchSize}&orderField=$createdAt&orderType=DESC`;
          if (cursorProps) {
            url += `&cursor=${cursorProps}`;
          }
          const response = await fetch(url, {
            headers: {
              'X-Appwrite-Project': '67fc0576000b05b9e495',
              'X-Appwrite-Key': process.env.VITE_APPWRITE_API_KEY
            }
          });
          const data = await response.json();
          const documents = data.documents || [];
          allProperties.push(...documents);
          if (documents.length === batchSize && documents[documents.length - 1]?.$id) {
            cursorProps = documents[documents.length - 1].$id;
          } else {
            hasMoreProps = false;
          }
        }

        // Fetch all rental units
        const allUnits = [];
        let hasMoreUnits = true;
        let cursorUnits = null;
        while (hasMoreUnits) {
          let url = `https://cloud.appwrite.io/v1/databases/67fc08930035410438a5/collections/6813965c0018e59b3f32/documents?limit=${batchSize}&orderField=$createdAt&orderType=DESC`;
          if (cursorUnits) {
            url += `&cursor=${cursorUnits}`;
          }
          const response = await fetch(url, {
            headers: {
              'X-Appwrite-Project': '67fc0576000b05b9e495',
              'X-Appwrite-Key': process.env.VITE_APPWRITE_API_KEY
            }
          });
          const data = await response.json();
          const documents = data.documents || [];
          allUnits.push(...documents);
          if (documents.length === batchSize && documents[documents.length - 1]?.$id) {
            cursorUnits = documents[documents.length - 1].$id;
          } else {
            hasMoreUnits = false;
          }
        }

        // Combine units with their parent property
        const allPropertyIds = allProperties.map(prop => prop.$id);
        const unitsWithProperty = allUnits
          .filter(unit => allPropertyIds.includes(unit.propertyId))
          .map(unit => {
            const parentProperty = allProperties.find(prop => prop.$id === unit.propertyId);
            return {
              ...unit,
              property: parentProperty || {}
            };
          });

        // Add placeholder units for properties that do not have any units
        const propertyIdsWithUnits = new Set(allUnits.map(unit => unit.propertyId));
        const propertiesWithoutUnits = allProperties.filter(
          property => !propertyIdsWithUnits.has(property.$id)
        );
        const placeholderUnits = propertiesWithoutUnits.map(property => ({
          $id: `temp-${property.$id}`,
          propertyId: property.$id,
          type: "Main Unit",
          price: property.price || property.Price || "0",
          vacancyStatus: true,
          isFurnished: false,
          property: property
        }));

        // Combine real units and placeholder units
        const combined = [...unitsWithProperty, ...placeholderUnits];

        res.writeHead(200, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ success: true, data: combined }));
      } catch (err) {
        console.error('Rentals API error:', err);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ success: false, message: err.message }));
      }
    }

    // GET /api/rental-units - Get all rental units
    if (pathname === '/api/rental-units' && req.method === 'GET') {
      try {
        const allDocuments = [];
        let hasMore = true;
        let cursor = null;
        const batchSize = 100;
        while (hasMore) {
          let url = `https://cloud.appwrite.io/v1/databases/67fc08930035410438a5/collections/6813965c0018e59b3f32/documents?limit=${batchSize}&orderField=$createdAt&orderType=DESC`;
          if (cursor) {
            url += `&cursor=${cursor}`;
          }
          const response = await fetch(url, {
            headers: {
              'X-Appwrite-Project': '67fc0576000b05b9e495',
              'X-Appwrite-Key': process.env.VITE_APPWRITE_API_KEY
            }
          });
          const data = await response.json();
          const documents = data.documents || [];
          allDocuments.push(...documents);
          if (documents.length === batchSize && documents[documents.length - 1]?.$id) {
            cursor = documents[documents.length - 1].$id;
          } else {
            hasMore = false;
          }
        }
        res.writeHead(200, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ success: true, data: allDocuments }));
      } catch (err) {
        console.error('Units API error:', err);
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
