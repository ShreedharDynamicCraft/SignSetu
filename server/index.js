require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const wordRoutes = require('./routes/wordRoutes');

// Better approach to handle deprecation warnings - use the proper Node.js flags instead
// NODE_OPTIONS="--no-deprecation" can be set in package.json scripts
// Avoid modifying the process warnings directly as it's not a best practice
// Alternative solution below using proper URL handling

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB with updated options to avoid deprecation warnings
// Using the URL constructor instead of punycode directly
const connectWithRetry = async () => {
  try {
    // Create MongoDB connection options
    const options = {
      // Modern MongoDB driver options
      connectTimeoutMS: 10000, // Give MongoDB 10 seconds to connect
      socketTimeoutMS: 45000,  // 45 seconds timeout for operations
    };
    
    const mongoURI = process.env.MONGODB_URI;
    
    // Verify URI is properly formatted before connecting
    if (mongoURI) {
      await mongoose.connect(mongoURI, options);
      console.log('MongoDB connected successfully');
    } else {
      throw new Error('MongoDB URI is not defined in environment variables');
    }
  } catch (err) {
    console.error('MongoDB connection error:', err);
    console.log('Retrying connection in 5 seconds...');
    setTimeout(connectWithRetry, 5000);
  }
};

// Execute connection with retry capability
connectWithRetry();

// Routes
app.use('/api', wordRoutes);

app.get('/', (req, res) => {
  res.send('SignSetu API is running');
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
