import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaSignLanguage, 
  FaPlus, 
  FaHome, 
  FaSearch, 
  FaBars, 
  FaTimes,
  FaInfoCircle,
  FaLanguage
} from 'react-icons/fa';

const Navbar = ({ accessibilityMode, setAccessibilityMode }) => {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  
  const isActive = (path) => {
    return location.pathname === path;
  };

  // Add navbar appearance change on scroll
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [scrolled]);

  const navItems = [
    { name: "Home", path: "/", icon: <FaHome /> },
   
    { name: "Add Word", path: "/add", icon: <FaPlus /> },
     { name: "Translator", path: "/translator", icon: <FaLanguage /> }, // Add translator link
    { name: "About", path: "/about", icon: <FaInfoCircle /> },
  ];

  return (
    <motion.nav 
      className={`fixed top-0 left-0 right-0 z-30 transition-all duration-300 ${
        scrolled 
          ? 'bg-primary/95 backdrop-blur-md shadow-md py-2' 
          : 'bg-primary py-4'
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 120 }}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2 group">
            <motion.div
              whileHover={{ rotate: [0, -15, 15, -5, 0], transition: { duration: 0.8 } }}
              className="text-3xl text-white"
            >
              <FaSignLanguage />
            </motion.div>
            <span className="text-2xl font-bold text-white">SignSetu</span>
          </Link>
          
          {/* Mobile menu button */}
          <div className="md:hidden">
            <motion.button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 text-white focus:outline-none focus:ring-2 focus:ring-white/50 rounded-md"
              aria-expanded={isMenuOpen}
              aria-label="Toggle menu"
              whileTap={{ scale: 0.95 }}
            >
              {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </motion.button>
          </div>
          
          {/* Desktop navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <Link 
                key={item.path} 
                to={item.path}
                className={`nav-indicator px-4 py-2 rounded-md text-sm font-medium flex items-center space-x-2 transition-colors ${
                  isActive(item.path) 
                    ? 'bg-secondary text-white active' 
                    : 'text-white/90 hover:bg-white/10'
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                <span>{item.name}</span>
                
                {/* Highlight the Translator link with a pulsing effect to make it noticeable */}
                {item.name === "Translator" && !isActive(item.path) && (
                  <span className="flex h-2 w-2 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-yellow-500"></span>
                  </span>
                )}
              </Link>
            ))}

            {/* Search button */}
            {/* <Link
              to="/"
              onClick={() => {
                setTimeout(() => {
                  const searchInput = document.querySelector('input[type="text"]');
                  if (searchInput) searchInput.focus();
                }, 100);
              }}
              className="bg-white text-primary px-4 py-2 rounded-md ml-4 hover:bg-blue-50 transition-colors"
            >
              <FaSearch className="inline mr-2" /> Search Signs
            </Link> */}
          </div>
        </div>
        
        {/* Mobile navigation */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div 
              className="md:hidden mt-4 pt-4 border-t border-white/20"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex flex-col space-y-2">
                {navItems.map((item) => (
                  <Link 
                    key={item.path} 
                    to={item.path}
                    className={`px-4 py-3 rounded-md text-sm font-medium flex items-center space-x-3 ${
                      isActive(item.path) ? 'bg-secondary' : 'hover:bg-secondary/70'
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <span className="text-lg">{item.icon}</span>
                    <span>{item.name}</span>
                    
                    {/* Highlight Translator link in mobile menu too */}
                    {item.name === "Translator" && (
                      <span className="ml-auto px-2 py-0.5 bg-yellow-400 text-xs rounded-full text-primary">New</span>
                    )}
                  </Link>
                ))}
                
                {/* Mobile search button */}
                <Link
                  to="/"
                  onClick={() => {
                    setIsMenuOpen(false);
                    setTimeout(() => {
                      const searchInput = document.querySelector('input[type="text"]');
                      if (searchInput) searchInput.focus();
                    }, 100);
                  }}
                  className="px-4 py-3 mt-2 bg-white text-primary rounded-md font-medium flex items-center space-x-3"
                >
                  <FaSearch className="text-lg" /> 
                  <span>Search Signs</span>
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
};

export default Navbar;
