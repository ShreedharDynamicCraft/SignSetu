import React, { useState } from 'react';
import { motion } from 'framer-motion';

const WordForm = ({ initialData = {}, onSubmit, buttonText = "Submit" }) => {
  const [formData, setFormData] = useState({
    word: initialData.word || '',
    definition: initialData.definition || '',
    imageUrl: initialData.imageUrl || '',
    videoUrl: initialData.videoUrl || '',
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error when user types
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.word.trim()) newErrors.word = 'Word is required';
    if (!formData.definition.trim()) newErrors.definition = 'Definition is required';
    
    if (!formData.imageUrl.trim()) {
      newErrors.imageUrl = 'Image URL is required';
    } else if (!isValidUrl(formData.imageUrl)) {
      newErrors.imageUrl = 'Please enter a valid URL';
    }
    
    if (!formData.videoUrl.trim()) {
      newErrors.videoUrl = 'Video URL is required';
    } else if (!isValidUrl(formData.videoUrl)) {
      newErrors.videoUrl = 'Please enter a valid URL';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch (error) {
      return false;
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  return (
    <motion.form 
      onSubmit={handleSubmit} 
      className="bg-white p-6 rounded-lg shadow-md"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="word">
          Word
        </label>
        <input
          id="word"
          name="word"
          type="text"
          value={formData.word}
          onChange={handleChange}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${errors.word ? 'border-red-500' : 'border-gray-300'}`}
          placeholder="Enter sign language word"
        />
        {errors.word && <p className="text-red-500 text-xs mt-1">{errors.word}</p>}
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="definition">
          Definition
        </label>
        <textarea
          id="definition"
          name="definition"
          value={formData.definition}
          onChange={handleChange}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${errors.definition ? 'border-red-500' : 'border-gray-300'}`}
          placeholder="Enter definition"
          rows="3"
        ></textarea>
        {errors.definition && <p className="text-red-500 text-xs mt-1">{errors.definition}</p>}
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="imageUrl">
          Image URL
        </label>
        <input
          id="imageUrl"
          name="imageUrl"
          type="text"
          value={formData.imageUrl}
          onChange={handleChange}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${errors.imageUrl ? 'border-red-500' : 'border-gray-300'}`}
          placeholder="Enter image URL"
        />
        {errors.imageUrl && <p className="text-red-500 text-xs mt-1">{errors.imageUrl}</p>}
        
        {formData.imageUrl && isValidUrl(formData.imageUrl) && (
          <div className="mt-2">
            <p className="text-sm text-gray-600 mb-1">Preview:</p>
            <img 
              src={formData.imageUrl} 
              alt="Preview" 
              className="h-40 object-cover rounded-md"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://via.placeholder.com/400x300?text=Invalid+Image+URL';
              }} 
            />
          </div>
        )}
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="videoUrl">
          Video URL
        </label>
        <input
          id="videoUrl"
          name="videoUrl"
          type="text"
          value={formData.videoUrl}
          onChange={handleChange}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${errors.videoUrl ? 'border-red-500' : 'border-gray-300'}`}
          placeholder="Enter video URL"
        />
        {errors.videoUrl && <p className="text-red-500 text-xs mt-1">{errors.videoUrl}</p>}
      </div>

      <motion.button
        type="submit"
        className="w-full bg-primary text-white py-2 px-4 rounded-md hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50 transition-colors"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        {buttonText}
      </motion.button>
    </motion.form>
  );
};

export default WordForm;
