import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaSearch, FaTimes } from 'react-icons/fa';

const SearchBar = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [recentSearches, setRecentSearches] = useState(() => {
    const saved = localStorage.getItem('recentSearches');
    return saved ? JSON.parse(saved) : [];
  });
  
  // Add accessibility preferences
  const [accessibilityMode, setAccessibilityMode] = useState(() => {
    const saved = localStorage.getItem('accessibilityMode');
    return saved || 'standard';
  });
  
  // Track if this is the first search
  const [isFirstInteraction, setIsFirstInteraction] = useState(true);
  // Add animation state for showing celebratory effect
  const [showCelebration, setShowCelebration] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;

    // If this is the first interaction, show encouraging animation
    if (isFirstInteraction) {
      setIsFirstInteraction(false);
      // Show celebration animation
      setShowCelebration(true);
      setTimeout(() => setShowCelebration(false), 2000);
    }
    
    onSearch(searchTerm);

    // Save to recent searches
    const updatedSearches = [
      searchTerm,
      ...recentSearches.filter(s => s !== searchTerm)
    ].slice(0, 5);

    setRecentSearches(updatedSearches);
    localStorage.setItem('recentSearches', JSON.stringify(updatedSearches));
  };

  const handleClear = () => {
    setSearchTerm('');
    onSearch('');
  };

  return (
    <motion.div
      className="w-full max-w-2xl mx-auto mb-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <form onSubmit={handleSubmit} className="relative">
        <motion.div
          className={`flex items-center overflow-hidden rounded-lg border ${isFocused
            ? 'border-primary ring-2 ring-blue-200'
            : 'border-gray-300'}`}
          animate={{
            boxShadow: isFocused
              ? '0 4px 20px rgba(59, 130, 246, 0.15)'
              : '0 2px 10px rgba(0,0,0,0.08)'
          }}
        >
          <motion.span
            className="pl-4 text-gray-400"
            animate={{
              scale: isFocused ? 1.1 : 1,
              color: isFocused ? '#3B82F6' : '#9CA3AF'
            }}
          >
            <FaSearch />
          </motion.span>

          <input
            type="text"
            className="w-full px-4 py-3 outline-none bg-transparent"
            placeholder="Search for sign language words..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            aria-label="Search for sign language words"
          />

          <AnimatePresence>
            {searchTerm && (
              <motion.button
                type="button"
                className="px-3 text-gray-400 hover:text-gray-600"
                onClick={handleClear}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0 }}
                aria-label="Clear search"
              >
                <FaTimes />
              </motion.button>
            )}
          </AnimatePresence>

          <motion.button
            type="submit"
            className="px-6 py-3 bg-primary text-white font-medium hover:bg-secondary transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            Search
          </motion.button>
        </motion.div>
      </form>

      <motion.div
        className="flex flex-wrap gap-2 mt-4 justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="w-full flex justify-center gap-2 flex-wrap">
          {['Namaste', 'Chai', 'Yoga', 'Diwali', 'Cricket'].map((suggestion) => (
            <motion.button
              key={suggestion}
              onClick={() => {
                setSearchTerm(suggestion);
                onSearch(suggestion);
              }}
              className="bg-blue-50 px-3 py-1 rounded-full text-sm text-primary hover:bg-blue-100 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {suggestion}
            </motion.button>
          ))}
        </div>

        {recentSearches.length > 0 && (
          <motion.div
            className="w-full mt-2"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <p className="text-xs text-gray-500 text-center mb-1">Recent Searches</p>
            <div className="flex justify-center flex-wrap gap-2">
              {recentSearches.map((term) => (
                <motion.button
                  key={term}
                  onClick={() => {
                    setSearchTerm(term);
                    onSearch(term);
                  }}
                  className="border border-gray-200 px-2 py-0.5 rounded-full text-xs text-gray-600 hover:bg-gray-100 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {term}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* Celebration Animation */}
      {showCelebration && (
        <motion.div
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="text-6xl"
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 15, -15, 0],
              transition: { duration: 0.8, ease: "easeInOut" }
            }}
          >
            🎉
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default SearchBar;
