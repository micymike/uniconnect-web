import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const analyticsFile = path.join(__dirname, '../data/analytics.json');

// Initialize analytics file if it doesn't exist
if (!fs.existsSync(analyticsFile)) {
  const initialData = {
    totalVisits: 0,
    uniqueVisitors: 0,
    pageViews: {},
    lastReset: new Date().toISOString()
  };
  fs.writeFileSync(analyticsFile, JSON.stringify(initialData, null, 2));
}

export function recordVisit(req) {
  try {
    const data = JSON.parse(fs.readFileSync(analyticsFile, 'utf8'));
    const url = req.url || '/';
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    
    // Skip development-related paths
    if (shouldSkipPath(url)) {
      return;
    }
    
    // Clean the URL (remove query parameters)
    const page = url.split('?')[0];
    
    // Increment total visits
    data.totalVisits++;
    
    // Track page views
    data.pageViews[page] = (data.pageViews[page] || 0) + 1;
    
    // Simple unique visitor tracking (not perfect but works for basic stats)
    const uniqueVisitors = new Set(data.uniqueVisitorIps ? data.uniqueVisitorIps.split(',') : []);
    uniqueVisitors.add(ip);
    data.uniqueVisitorIps = Array.from(uniqueVisitors).join(',');
    data.uniqueVisitors = uniqueVisitors.size;
    
    fs.writeFileSync(analyticsFile, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Error recording analytics:', error);
  }
}

// Helper function to determine if a path should be skipped
function shouldSkipPath(path) {
  const skipPatterns = [
    // Development-related paths
    '/node_modules/',
    '/@vite/',
    '/@react-refresh',
    '/@fs/',
    '/src/',
    '/?t=',
    '.jsx',
    '.js',
    '.ts',
    '.tsx',
    '.css',
    '.mjs',
    '.map'
  ];
  
  return skipPatterns.some(pattern => path.includes(pattern));
}

export function getAnalytics() {
  try {
    return JSON.parse(fs.readFileSync(analyticsFile, 'utf8'));
  } catch (error) {
    console.error('Error reading analytics:', error);
    return { totalVisits: 0, uniqueVisitors: 0, pageViews: {} };
  }
}

export function resetAnalytics() {
  try {
    const initialData = {
      totalVisits: 0,
      uniqueVisitors: 0,
      uniqueVisitorIps: '',
      pageViews: {},
      lastReset: new Date().toISOString()
    };
    fs.writeFileSync(analyticsFile, JSON.stringify(initialData, null, 2));
    return true;
  } catch (error) {
    console.error('Error resetting analytics:', error);
    return false;
  }
}