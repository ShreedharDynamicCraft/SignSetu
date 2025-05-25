require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const wordRoutes = require('./routes/wordRoutes');
const path = require('path');

/**
 * Server configuration optimized for both local development and Vercel deployment
 */

const app = express();
const PORT = process.env.PORT || 5000;

// CORS configuration - allow all origins for maximum flexibility
app.use(cors({
  origin: '*', // Allow requests from any origin
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Allow common HTTP methods
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  credentials: true, // Allow credentials
  maxAge: 86400 // Cache preflight requests for 24 hours
}));

app.use(express.json());

// MongoDB connection with safe handling for Vercel
const connectToMongoDB = async () => {
  try {
    // For Vercel deployment, make sure to configure Environment Variables in the Vercel dashboard
    const mongoURI = process.env.MONGODB_URI;
    
    if (!mongoURI) {
      throw new Error('MongoDB URI is not defined in environment variables');
    }

    const options = {
      connectTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      // These options handle Vercel serverless function reconnection efficiently
      serverSelectionTimeoutMS: 5000,
      // Auto-index creation should be disabled on Vercel due to serverless constraints
      autoIndex: process.env.NODE_ENV !== 'production'
    };
    
    await mongoose.connect(mongoURI, options);
    console.log('MongoDB connected successfully');
  } catch (err) {
    console.error('MongoDB connection error:', err);
    
    // Don't retry on Vercel production as it's a serverless environment
    if (process.env.VERCEL !== '1') {
      console.log('Retrying connection in 5 seconds...');
      setTimeout(connectToMongoDB, 5000);
    }
  }
};

// Connect to database
connectToMongoDB();

// API Routes Documentation Middleware
app.get('/api', (req, res) => {
  res.status(200).json({
    message: 'SignSetu API Documentation',
    version: '1.0.0',
    availableEndpoints: {
      words: {
        GET_all: '/api/words - Get all sign language words',
        GET_search: '/api/words?search=query - Search for words matching the query',
        GET_single: '/api/words/:id - Get a specific word by ID',
        POST: '/api/words - Add a new word (requires word data in request body)',
        PUT: '/api/words/:id - Update an existing word (requires word data)',
        DELETE: '/api/words/:id - Delete a word by ID'
      },
      system: {
        GET_health: '/health - Check API health status',
        GET_logs: '/logs - View recent system logs (requires admin access)',
        GET_api_logs: '/api/logs - Alternative logs endpoint under API prefix'
      }
    },
    examples: {
      addWord: {
        method: 'POST',
        endpoint: '/api/words',
        body: {
          word: 'Example',
          definition: 'A demonstration word',
          imageUrl: 'https://example.com/image.jpg',
          videoUrl: 'https://example.com/video.mp4'
        }
      }
    }
  });
});

// Logging system
const logs = [];
const MAX_LOGS = 100;

// Enhanced logging middleware with detailed debugging
app.use((req, res, next) => {
  const requestStart = Date.now();
  const log = {
    timestamp: new Date().toISOString(),
    method: req.method,
    path: req.path,
    originalUrl: req.originalUrl,
    ip: req.ip,
    userAgent: req.get('User-Agent') || 'Unknown',
    query: req.query,
    body: req.method !== 'GET' ? req.body : undefined,
    headers: req.headers
  };
  
  // Log the request to console
  console.log(`[REQUEST] ${log.method} ${log.originalUrl} from ${log.ip}`);
  
  // Store the log
  logs.unshift(log);
  
  // Keep logs at reasonable size
  if (logs.length > MAX_LOGS) {
    logs.pop();
  }
  
  // Log response information after request completes
  res.on('finish', () => {
    const duration = Date.now() - requestStart;
    const logResponse = {
      ...log,
      statusCode: res.statusCode,
      statusMessage: res.statusMessage,
      duration: `${duration}ms`,
      contentLength: res.get('content-length') || 0
    };
    
    console.log(`[RESPONSE] ${logResponse.method} ${logResponse.originalUrl} - ${logResponse.statusCode} - ${logResponse.duration}`);
    
    // Update the log in our array with the response data
    const index = logs.findIndex(l => 
      l.timestamp === log.timestamp && 
      l.path === log.path && 
      l.method === log.method
    );
    
    if (index !== -1) {
      logs[index] = logResponse;
    }
  });
  
  next();
});

// API routes
app.use('/api', wordRoutes);

// Logs endpoint with NO authentication - open to all
app.get('/logs', (req, res) => {
  // No authentication required - public endpoint for everyone
  console.log('[ACCESS] Logs endpoint accessed');
  
  res.status(200).json({
    total: logs.length,
    logs: logs
  });
});

// Also make /api/logs available for consistency
app.get('/api/logs', (req, res) => {
  console.log('[ACCESS] API Logs endpoint accessed');
  
  res.status(200).json({
    total: logs.length,
    logs: logs
  });
});

// Health check endpoint for Vercel
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'ok', 
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString(),
    uptime: process.uptime() + ' seconds',
    memoryUsage: process.memoryUsage()
  });
});

// Root route
app.get('/', (req, res) => {
  res.send(`
    <html>
      <head>
        <title>SignSetu API</title>
        <style>
          body { font-family: system-ui, sans-serif; line-height: 1.6; max-width: 800px; margin: 0 auto; padding: 20px; }
          h1 { color: #3B82F6; }
          .endpoint { background: #f1f5f9; padding: 10px; border-radius: 4px; margin-bottom: 10px; }
          code { background: #e2e8f0; padding: 2px 4px; border-radius: 3px; }
        </style>
      </head>
      <body>
        <h1>SignSetu API</h1>
        <p>The API is running successfully. View comprehensive documentation at <a href="/api">/api</a>.</p>
        <h2>Main Endpoints:</h2>
        <div class="endpoint"><code>GET /api/words</code> - Get all words</div>
        <div class="endpoint"><code>GET /api/words?search=query</code> - Search for words</div>
        <div class="endpoint"><code>GET /api/health</code> - Check API health</div>
      </body>
    </html>
  `);
});

// For Vercel serverless deployment - this handles function timeouts better
if (process.env.VERCEL === '1') {
  // Export the express app for Vercel serverless deployment
  module.exports = app;
} else {
  // Enhanced server startup with debug information
  app.listen(PORT, () => {
    console.log(`
=================================================================
🚀 SignSetu API Server running on port ${PORT}
=================================================================
📝 Available endpoints:
   - GET  /api/words         - Get all words
   - GET  /api/words/:id     - Get word by ID
   - POST /api/words         - Add new word
   - PUT  /api/words/:id     - Update word
   - DELETE /api/words/:id   - Delete word
   - GET  /health           - Check server health
   - GET  /logs             - View logs (auth required)
   - GET  /api              - View API documentation
   
🔧 Debug Information:
   - NODE_ENV: ${process.env.NODE_ENV || 'development'}
   - MongoDB Connected: ${mongoose.connection.readyState === 1 ? 'Yes ✅' : 'No ❌'}
   - Process ID: ${process.pid}

⚠️ Note: The '/logs' endpoint is at the root level, not under '/api'
=================================================================
    `);
  });

  // Debug logging for route requests
  app.use((req, res, next) => {
    const startTime = Date.now();
    res.on('finish', () => {
      const duration = Date.now() - startTime;
      console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl} - ${res.statusCode} - ${duration}ms`);
    });
    next();
  });
}

// Add this to fix 404 errors - must be at the end after all routes
app.use((req, res, next) => {
  console.log(`[404] Route not found: ${req.method} ${req.originalUrl}`);
  res.status(404).json({ 
    error: 'Not Found',
    message: `The requested endpoint ${req.method} ${req.originalUrl} does not exist.`,
    availableEndpoints: {
      api: '/api',
      health: '/health',
      logs: '/logs',
      words: '/api/words'
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(`[ERROR] ${err.stack}`);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
    stack: process.env.NODE_ENV === 'production' ? undefined : err.stack
  });
});
