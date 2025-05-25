import React, { useContext, useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import SearchBar from '../components/SearchBar';
import WordCard from '../components/WordCard';
import LoadingSpinner from '../components/LoadingSpinner';
import HeroSection from '../components/HeroSection'; // Import the new HeroSection
import { WordContext } from '../context/WordContext';
import { 
  FaSignLanguage, 
  FaLightbulb, 
  FaHandPointRight, 
  FaHandsHelping,
  FaPlay 
} from 'react-icons/fa';

const HomePage = () => {
  const { words, loading, error, searchWords, fetchWords, deleteWord } = useContext(WordContext);
  const [isSearchActive, setIsSearchActive] = useState(false);
  const introRef = useRef(null);
  const isIntroInView = useInView(introRef, { once: true, margin: "-100px 0px" });
  const navigate = useNavigate();

  const handleSearch = (query) => {
    if (!query.trim()) {
      fetchWords();
      setIsSearchActive(false);
      return;
    }
    
    searchWords(query);
    setIsSearchActive(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this word?')) {
      deleteWord(id);
    }
  };

  const handleClearSearch = () => {
    fetchWords();
    setIsSearchActive(false);
  };

  // Parallax effect
  const [scrollY, setScrollY] = useState(0);
  
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  return (
    <div id="main-content">
      {/* Replace old hero with new enhanced HeroSection */}
      <HeroSection />
      
      {/* Add an ID for smooth scroll from hero CTA */}
      <div id="search-section">
        <SearchBar onSearch={handleSearch} />
      </div>
      
      {isSearchActive && (
        <motion.div 
          className="flex justify-between items-center mb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <p className="text-gray-600" role="status">
            {words.length} {words.length === 1 ? 'result' : 'results'} found
          </p>
          <button 
            onClick={handleClearSearch}
            className="text-primary hover:text-secondary transition-colors font-medium"
          >
            Clear search
          </button>
        </motion.div>
      )}

      {loading && <LoadingSpinner />}
      
      {!loading && error && (
        <motion.div 
          className="bg-red-100 text-red-700 p-4 rounded-md mb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          role="alert"
        >
          {error}
        </motion.div>
      )}

      {!loading && !error && words.length === 0 && (
        <motion.div 
          className="text-center py-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.div 
            className="text-9xl mb-4 text-gray-300 mx-auto"
            animate={{ 
              rotate: [0, 10, -10, 0],
              transition: { 
                repeat: Infinity, 
                duration: 4 
              }
            }}
          >
            <FaSignLanguage className="mx-auto" />
          </motion.div>
          <h2 className="text-2xl font-semibold text-gray-600 mb-2">No words found</h2>
          <p className="text-gray-500">
            {isSearchActive 
              ? "We couldn't find any words matching your search" 
              : "Start by adding your first sign language word"}
          </p>
        </motion.div>
      )}

      <motion.div 
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        layout
      >
        <AnimatePresence>
          {!loading && !error && words.map((word) => (
            <WordCard 
              key={word._id} 
              word={word} 
              onDelete={handleDelete} 
            />
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default HomePage;
