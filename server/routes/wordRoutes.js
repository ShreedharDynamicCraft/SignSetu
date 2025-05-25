const express = require('express');
const router = express.Router();
const Word = require('../models/Word');

// Simple in-memory cache for faster responses in Vercel
// This helps with the Vercel MongoDB timeout issue
const cache = {
  allWords: null,
  wordById: {},
  timestamp: null,
  CACHE_DURATION: 5 * 60 * 1000, // 5 minutes
};

// Cache invalidation function
function invalidateCache() {
  cache.allWords = null;
  cache.wordById = {};
  cache.timestamp = null;
  console.log('[CACHE] Cache invalidated');
}

// Check if cache is valid
function isCacheValid() {
  return (
    cache.timestamp && 
    (Date.now() - cache.timestamp) < cache.CACHE_DURATION
  );
}

// Get all words with cache support
router.get('/words', async (req, res) => {
  try {
    const { search } = req.query;
    
    // If it's a search query, bypass cache
    if (search) {
      console.log(`[WORDS] Searching for: ${search}`);
      const regex = new RegExp(search, 'i');
      const words = await Word.find({
        $or: [
          { word: regex },
          { definition: regex }
        ]
      });
      return res.json(words);
    }
    
    // Check cache first for all words
    if (isCacheValid() && cache.allWords) {
      console.log('[CACHE] Serving words from cache');
      return res.json(cache.allWords);
    }
    
    console.log('[WORDS] Fetching all words from database');
    // Add a longer timeout for Vercel
    const words = await Word.find().maxTimeMS(25000);
    
    // Update cache
    cache.allWords = words;
    cache.timestamp = Date.now();
    
    res.json(words);
  } catch (err) {
    console.error('[ERROR] GET /words:', err.message);
    res.status(500).json({ message: err.message });
  }
});

// Get word by ID with cache support
router.get('/words/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check cache first
    if (isCacheValid() && cache.wordById[id]) {
      console.log(`[CACHE] Serving word ${id} from cache`);
      return res.json(cache.wordById[id]);
    }
    
    console.log(`[WORDS] Fetching word ${id} from database`);
    const word = await Word.findById(id).maxTimeMS(15000);
    
    if (!word) {
      return res.status(404).json({ message: 'Word not found' });
    }
    
    // Update cache
    cache.wordById[id] = word;
    if (!cache.timestamp) cache.timestamp = Date.now();
    
    res.json(word);
  } catch (err) {
    console.error(`[ERROR] GET /words/${req.params.id}:`, err.message);
    res.status(500).json({ message: err.message });
  }
});

// Create a new word and invalidate cache
router.post('/words', async (req, res) => {
  try {
    const word = new Word(req.body);
    const newWord = await word.save();
    
    // Invalidate cache when data changes
    invalidateCache();
    
    res.status(201).json(newWord);
  } catch (err) {
    console.error('[ERROR] POST /words:', err.message);
    res.status(400).json({ message: err.message });
  }
});

// Update a word and invalidate cache
router.put('/words/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updatedWord = await Word.findByIdAndUpdate(id, req.body, { new: true });
    
    if (!updatedWord) {
      return res.status(404).json({ message: 'Word not found' });
    }
    
    // Invalidate cache when data changes
    invalidateCache();
    
    res.json(updatedWord);
  } catch (err) {
    console.error(`[ERROR] PUT /words/${req.params.id}:`, err.message);
    res.status(400).json({ message: err.message });
  }
});

// Delete a word and invalidate cache
router.delete('/words/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deletedWord = await Word.findByIdAndDelete(id);
    
    if (!deletedWord) {
      return res.status(404).json({ message: 'Word not found' });
    }
    
    // Invalidate cache when data changes
    invalidateCache();
    
    res.json({ message: 'Word deleted successfully' });
  } catch (err) {
    console.error(`[ERROR] DELETE /words/${req.params.id}:`, err.message);
    res.status(500).json({ message: err.message });
  }
});

// Add logs endpoint to the API router to fix /api/logs issue
router.get('/logs', (req, res) => {
  // Access logs from parent scope or use your logging system
  const logs = global.logs || [];
  
  res.status(200).json({
    total: logs.length,
    logs: logs
  });
});

module.exports = router;
