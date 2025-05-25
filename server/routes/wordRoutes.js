const express = require('express');
const Word = require('../models/Word');
const router = express.Router();

// Sample log data
let logs = [
  { id: 1, message: 'Word created: example', timestamp: new Date() },
  { id: 2, message: 'Word deleted: test', timestamp: new Date() }
];

// GET all words
router.get('/words', async (req, res) => {
  try {
    const words = await Word.find().sort({ word: 1 });
    res.json(words);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET word by search query
router.get('/words/:query', async (req, res) => {
  try {
    const query = req.params.query;
    const words = await Word.find({
      word: { $regex: query, $options: 'i' }
    }).sort({ word: 1 });
    
    if (words.length === 0) {
      return res.status(404).json({ message: 'No words found matching the query' });
    }
    
    res.json(words);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST a new word
router.post('/words', async (req, res) => {
  const word = new Word({
    word: req.body.word,
    definition: req.body.definition,
    imageUrl: req.body.imageUrl,
    videoUrl: req.body.videoUrl
  });

  try {
    const newWord = await word.save();
    res.status(201).json(newWord);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// BONUS: DELETE a word
router.delete('/words/:id', async (req, res) => {
  try {
    const deletedWord = await Word.findByIdAndDelete(req.params.id);
    if (!deletedWord) {
      return res.status(404).json({ message: 'Word not found' });
    }
    res.json({ message: 'Word deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// BONUS: UPDATE a word
router.put('/words/:id', async (req, res) => {
  try {
    const updatedWord = await Word.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    
    if (!updatedWord) {
      return res.status(404).json({ message: 'Word not found' });
    }
    
    res.json(updatedWord);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Add logs endpoint to the API router
router.get('/logs', (req, res) => {
  // Simple authentication check
  const auth = req.headers.authorization;
  
  // In production, use proper authentication
  if (!auth || auth !== 'Bearer admin-token') {
    return res.status(401).json({ 
      error: 'Unauthorized',
      message: 'Admin authentication required'
    });
  }
  
  res.status(200).json({
    total: logs.length,
    logs: logs
  });
});

module.exports = router;
