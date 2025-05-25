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

// MongoDB connection with special handling for Vercel
const connectToMongoDB = async () => {
  try {
    // For Vercel deployment, make sure to configure Environment Variables in the Vercel dashboard
    const mongoURI = process.env.MONGODB_URI;
    
    if (!mongoURI) {
      throw new Error('MongoDB URI is not defined in environment variables');
    }

    // Optimized settings for serverless environment like Vercel
    const options = {
      // Less aggressive timeouts for Vercel's serverless functions
      connectTimeoutMS: 30000,
      socketTimeoutMS: 60000,
      // These options handle Vercel serverless function reconnection efficiently
      serverSelectionTimeoutMS: 30000,
      // Auto-index creation should be disabled on Vercel
      autoIndex: false,
      // Important for Vercel to maintain connection
      maxPoolSize: 10,
      // Don't disable buffering in Vercel - this causes the error
      bufferCommands: true, // Changed from false to true
    };
    
    // Special handling for Vercel
    if (process.env.VERCEL === '1') {
      console.log('[MONGODB] Connecting with Vercel optimized settings');
      
      // Check if already connected
      if (mongoose.connection.readyState === 1) {
        console.log('[MONGODB] Already connected');
        return mongoose.connection;
      }
    }

    // Await connection
    const connection = await mongoose.connect(mongoURI, options);
    console.log('[MONGODB] Connected successfully');
    return connection;
  } catch (err) {
    console.error('[MONGODB] Connection error:', err);
    
    // Don't retry on Vercel production as it's a serverless environment
    if (process.env.VERCEL !== '1') {
      console.log('[MONGODB] Retrying connection in 5 seconds...');
      setTimeout(connectToMongoDB, 5000);
    } else {
      // In Vercel, propagate the error
      throw err;
    }
  }
};

// Connect to database
connectToMongoDB();

// Make the connection function available globally
global.connectToMongoDB = connectToMongoDB;

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

// Make mongoose connection available globally
global.mongooseConnection = mongoose;

// Export a serverless-compatible handler for Vercel
const serverlessHandler = async (req, res) => {
  // Make sure MongoDB is connected before handling requests
  if (mongoose.connection.readyState !== 1) {
    console.log('[VERCEL] Ensuring MongoDB connection before request');
    await connectToMongoDB();
  }

  // Then process the request with the Express app
  return app(req, res);
};

// For Vercel serverless deployment - this handles function timeouts better
if (process.env.VERCEL === '1') {
  // Export the serverless handler for Vercel
  module.exports = serverlessHandler;
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
