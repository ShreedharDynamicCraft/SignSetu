import React from 'react';
import { FaHeart, FaGithub, FaLinkedin } from 'react-icons/fa';
import { motion } from 'framer-motion';

const Footer = () => {
  return (
    <footer className="bg-dark text-white py-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-sm">
              © 2025 SignSetu - Sign Language Dictionary. All rights reserved.
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm">Made with</span>
            <motion.div
              animate={{ 
                scale: [1, 1.2, 1],
                transition: { duration: 1, repeat: Infinity }
              }}
            >
              <FaHeart className="text-red-500" />
            </motion.div>
            <span className="text-sm">by Shreedhar</span>
          </div>
          <div className="flex mt-4 md:mt-0 space-x-4">
            <a 
              href="https://github.com/ShreedharDynamicCraft/SignSetu" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-white hover:text-accent transition-colors"
              aria-label="GitHub Repository"
            >
              <FaGithub size={20} />
            </a>
            <a 
              href="https://www.linkedin.com/in/shreedhar-anand-23a699214/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-white hover:text-accent transition-colors"
              aria-label="LinkedIn Profile"
            >
              <FaLinkedin size={20} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
