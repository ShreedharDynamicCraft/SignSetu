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

// API routes
app.use('/api', wordRoutes);

// Health check endpoint for Vercel
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', environment: process.env.NODE_ENV });
});

// Root route
app.get('/', (req, res) => {
  res.send('SignSetu API is running. Access API via /api routes.');
});

// For Vercel serverless deployment - this handles function timeouts better
if (process.env.VERCEL === '1') {
  // Export the express app for Vercel serverless deployment
  module.exports = app;
} else {
  // Start server for local development
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}
