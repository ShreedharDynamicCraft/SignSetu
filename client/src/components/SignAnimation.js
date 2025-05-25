import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaSignLanguage, FaHandPeace, FaHandPaper } from 'react-icons/fa';
import { GiHand } from 'react-icons/gi';

// Mapping of common words to their sign animations
const SIGN_ANIMATIONS = {
  "welcome": {
    icon: <FaHandPaper />,
    animation: {
      rotate: [0, 20, 0, -5, 0],
      y: [0, -5, 0, -3, 0]
    }
  },
  "hello": {
    icon: <FaHandPaper />,
    animation: {
      rotate: [0, 40, 0],
      y: [0, -8, 0]
    }
  },
  "thank": {
    icon: <FaHandPeace />,
    animation: {
      rotate: [0, 15, 0, -15, 0], 
      y: [0, -5, 0]
    }
  },
  "learn": {
    icon: <GiHand />,
    animation: {
      rotate: [-20, 0, -20],
      scale: [1, 1.1, 1]
    }
  },
  "language": {
    icon: <FaSignLanguage />,
    animation: {
      rotate: [0, 10, -10, 0],
      scale: [1, 1.15, 1]
    }
  },
  "sign": {
    icon: <FaSignLanguage />,
    animation: {
      rotate: [0, 10, 0, -10, 0],
      x: [0, 5, 0, -5, 0]
    }
  },
  // Add more word-to-sign mappings as needed
};

// Signs to display when no specific word is matched
const DEFAULT_SIGNS = [
  {
    icon: <FaHandPeace />,
    animation: { rotate: [0, 15, -5, 0], y: [0, -5, 0] }
  },
  {
    icon: <FaSignLanguage />,
    animation: { rotate: [0, 5, -5, 0], scale: [1, 1.1, 1] }
  },
  {
    icon: <GiHand />,
    animation: { rotate: [-10, 0, -10], y: [0, -3, 0] }
  }
];

// Colors for the signs
const SIGN_COLORS = ['#3B82F6', '#8B5CF6', '#EC4899', '#10B981', '#F59E0B', '#EF4444'];

/**
 * Component that shows animated sign language representation for words
 * Can be used inline with text or as a standalone element
 * 
 * @param {Object} props
 * @param {string} props.word - Word to animate (will find best match)
 * @param {string} props.color - Color of the sign (optional)
 * @param {number} props.size - Size of the sign icon (default: 24)
 * @param {boolean} props.inline - Whether to display inline (default: false)
 * @param {boolean} props.autoPlay - Whether to auto-play the animation (default: true)
 * @param {function} props.onFinish - Callback when animation finishes (optional)
 */
const SignAnimation = ({ 
  word, 
  color, 
  size = 24,
  inline = false,
  autoPlay = true,
  onFinish
}) => {
  const [isAnimating, setIsAnimating] = useState(autoPlay);
  const [animationKey, setAnimationKey] = useState(0); // for re-triggering animations
  
  // Find the best matching sign animation for the word
  let currentSign;
  
  if (!word) {
    // If no word provided, use a random default sign
    currentSign = DEFAULT_SIGNS[Math.floor(Math.random() * DEFAULT_SIGNS.length)];
  } else {
    // Convert to lowercase and find exact match first
    const normalizedWord = word.toLowerCase();
    let sign = SIGN_ANIMATIONS[normalizedWord];
    
    // If no exact match, look for partial matches
    if (!sign) {
      // Try to find the word as a substring of the keys
      for (const [key, value] of Object.entries(SIGN_ANIMATIONS)) {
        if (normalizedWord.includes(key) || key.includes(normalizedWord)) {
          sign = value;
          break;
        }
      }
    }
    
    // If still no match, use a random default
    currentSign = sign || DEFAULT_SIGNS[Math.floor(Math.random() * DEFAULT_SIGNS.length)];
  }
  
  // Handle animation completion
  const handleAnimationComplete = () => {
    if (onFinish) {
      onFinish();
    }
    
    // If not set to autoplay, stop after one cycle
    if (!autoPlay) {
      setIsAnimating(false);
    }
  };
  
  // Handle manual play of animation
  const playAnimation = () => {
    setIsAnimating(true);
    setAnimationKey(prev => prev + 1);
  };
  
  // Use provided color or pick a random one
  const signColor = color || SIGN_COLORS[Math.floor(Math.random() * SIGN_COLORS.length)];
  
  return (
    <AnimatePresence mode="wait">
      <motion.div 
        key={animationKey}
        className={`sign-animation ${inline ? 'inline-block align-middle' : 'block'}`}
        style={{ color: signColor, fontSize: `${size}px` }}
        whileHover={{ scale: 1.2 }}
        onClick={playAnimation}
        title={word ? `Sign for: ${word}` : "Sign animation"}
      >
        <motion.div
          animate={isAnimating ? currentSign.animation : {}}
          transition={{ 
            duration: 1.5, 
            repeat: autoPlay ? Infinity : 0,
            repeatType: "reverse",
            ease: "easeInOut"
          }}
          onAnimationComplete={handleAnimationComplete}
        >
          {currentSign.icon}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default SignAnimation;
