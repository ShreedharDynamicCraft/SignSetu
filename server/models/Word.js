const mongoose = require('mongoose');

const wordSchema = new mongoose.Schema({
  word: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  definition: {
    type: String,
    required: true,
    trim: true
  },
  imageUrl: {
    type: String,
    required: true,
    trim: true
  },
  videoUrl: {
    type: String,
    required: true,
    trim: true
  },
  // Add support for native video embedding
  videoType: {
    type: String,
    enum: ['youtube', 'direct', 'other'],
    default: 'youtube'
  },
  videoId: {
    type: String,
    // This will be extracted from videoUrl when saved
  },
  difficulty: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    default: 'beginner'
  },
  category: {
    type: String,
    default: 'general'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Add index for faster searching
wordSchema.index({ word: 'text' });
wordSchema.index({ category: 1 });
wordSchema.index({ difficulty: 1 });

// Extract YouTube ID before saving
wordSchema.pre('save', function(next) {
  if (this.videoUrl && this.videoType === 'youtube') {
    this.videoId = extractYouTubeId(this.videoUrl);
  }
  next();
});

// Add a method to find related words
wordSchema.statics.findRelated = function(word, limit = 3) {
  return this.find({ 
    _id: { $ne: word._id }, // exclude current word
    $or: [
      { word: { $regex: new RegExp(word.word.substring(0, 3), 'i') } },
      { category: word.category },
      // Could add more sophisticated matching here
    ]
  }).limit(limit);
};

// Helper function to extract YouTube ID from common URL formats
function extractYouTubeId(url) {
  if (!url) return null;
  
  // Match common YouTube URL formats
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  
  return (match && match[2].length === 11) ? match[2] : null;
}

// Helper method to get embedded video URL
wordSchema.methods.getEmbeddedVideoUrl = function() {
  if (this.videoType === 'youtube' && this.videoId) {
    return `https://www.youtube.com/embed/${this.videoId}`;
  }
  return this.videoUrl;
};

// Helper to get video thumbnail
wordSchema.methods.getVideoThumbnail = function() {
  if (this.videoType === 'youtube' && this.videoId) {
    return `https://img.youtube.com/vi/${this.videoId}/mqdefault.jpg`;
  }
  return null;
};

module.exports = mongoose.model('Word', wordSchema);
