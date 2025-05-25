import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaSignLanguage, FaHandPeace, FaHandPointRight } from 'react-icons/fa';
import { GiHand } from 'react-icons/gi';

// Signs for animated display
const signs = [
  { icon: <FaHandPeace />, color: '#3B82F6' },
  { icon: <FaSignLanguage />, color: '#8B5CF6' },
  { icon: <GiHand />, color: '#EC4899' }, // Using GiHand instead
  { icon: <FaHandPointRight />, color: '#10B981' },
];

// Text animation hooks
const useTypingEffect = (text, speed = 100) => {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (!text || currentIndex >= text.length) {
      setIsComplete(true);
      return;
    }

    const timeout = setTimeout(() => {
      setDisplayedText(prev => prev + text[currentIndex]);
      setCurrentIndex(prevIndex => prevIndex + 1);
    }, speed);

    return () => clearTimeout(timeout);
  }, [currentIndex, speed, text]);

  return { displayedText, isComplete };
};

const HeroSection = () => {
  const [scrollY, setScrollY] = useState(0);
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [showNextText, setShowNextText] = useState(false);
  
  const headlines = [
    "Welcome to SignSetu",
    "Learn Sign Language Visually",
    "Bridging Communication Gaps",
    "Explore Indian Sign Language"
  ];
  
  const { displayedText, isComplete } = useTypingEffect(headlines[currentTextIndex], 80);
  
  // Handle scroll parallax effect
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  
  // Rotate through headlines
  useEffect(() => {
    if (isComplete) {
      const timeout = setTimeout(() => {
        setShowNextText(true);
        
        setTimeout(() => {
          setCurrentTextIndex((prevIndex) => (prevIndex + 1) % headlines.length);
          setShowNextText(false);
        }, 1000);
        
      }, 2000);
      
      return () => clearTimeout(timeout);
    }
  }, [isComplete, headlines.length]);
  
  // Floating animation variants for signs
  const floatingSignVariants = {
    animate: (i) => ({
      y: [0, -15, 0],
      rotate: [-5, 5, -5],
      transition: {
        duration: 3 + i * 0.5,
        ease: "easeInOut",
        repeat: Infinity,
      }
    })
  };
  
  // Container variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
        when: "beforeChildren"
      }
    }
  };
  
  // Fade in variants for child elements
  const fadeInUpVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { 
        type: "spring", 
        stiffness: 100,
        damping: 15
      }
    }
  };

  return (
    <motion.div
      className="relative overflow-hidden mb-16 py-16 px-4 rounded-xl bg-gradient-to-br from-blue-900 via-indigo-800 to-purple-900 text-white"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7 }}
      variants={containerVariants}
    >
      {/* Animated background signs */}
      <div className="absolute inset-0 overflow-hidden opacity-20">
        {[...Array(15)].map((_, i) => {
          const randomSign = signs[Math.floor(Math.random() * signs.length)];
          const size = Math.floor(Math.random() * 30) + 20;
          const left = Math.random() * 100;
          const top = Math.random() * 100;
          const delay = Math.random() * 5;
          
          return (
            <motion.div
              key={i}
              className="absolute text-4xl"
              style={{ 
                left: `${left}%`, 
                top: `${top}%`,
                color: randomSign.color,
                fontSize: `${size}px`
              }}
              initial={{ opacity: 0.2, scale: 0.5 }}
              custom={i}
              variants={floatingSignVariants}
              animate="animate"
              transition={{ delay }}
            >
              {randomSign.icon}
            </motion.div>
          );
        })}
      </div>
      
      {/* Parallax effect */}
      <motion.div
        className="absolute inset-0 z-0"
        style={{ 
          backgroundImage: "radial-gradient(circle at 50% 50%, rgba(79, 70, 229, 0.3) 0%, transparent 50%)",
          y: scrollY * -0.2
        }}
      />
      
      <div className="container mx-auto h-full flex flex-col items-center justify-center relative z-10">
        <div className="text-center max-w-3xl mx-auto">
          {/* Animated hand icon */}
          <motion.div 
            className="mb-6 text-6xl md:text-7xl mx-auto inline-block"
            initial={{ scale: 0 }}
            animate={{ scale: 1, rotate: [0, 10, 0, -10, 0] }}
            transition={{ 
              type: "spring", 
              stiffness: 260, 
              damping: 20,
              duration: 2
            }}
          >
            <FaSignLanguage />
          </motion.div>
          
          {/* Title with typing animation */}
          <div className="min-h-[60px]">
            <AnimatePresence mode="wait">
              <motion.h1
                key={currentTextIndex}
                className="text-3xl md:text-5xl font-bold mb-4"
                initial={showNextText ? { y: -20, opacity: 0 } : {}}
                animate={showNextText ? { y: 20, opacity: 0 } : { y: 0, opacity: 1 }}
                exit={{ y: 20, opacity: 0 }}
                transition={{ type: "spring", stiffness: 100 }}
              >
                {displayedText}<span className="animate-pulse">|</span>
              </motion.h1>
            </AnimatePresence>
          </div>
          
          {/* Subtitle with staggered letters */}
          <motion.div 
            className="mb-8 overflow-hidden"
            variants={fadeInUpVariants}
          >
            <p className="text-lg md:text-xl text-blue-100">
              {"Explore and learn sign language visually".split('').map((char, index) => (
                <motion.span
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ 
                    delay: 1 + (index * 0.03),
                    duration: 0.5
                  }}
                  className="inline-block"
                >
                  {char === ' ' ? '\u00A0' : char}
                </motion.span>
              ))}
            </p>
          </motion.div>
          
          {/* Animated sign language demonstration */}
          <motion.div 
            className="flex justify-center mb-10 space-x-4"
            variants={fadeInUpVariants}
          >
            {["S", "I", "G", "N"].map((letter, i) => (
              <motion.div
                key={i}
                className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-white text-primary flex items-center justify-center text-2xl font-bold"
                initial={{ y: 50, opacity: 0 }}
                animate={{ 
                  y: 0, 
                  opacity: 1,
                  scale: [1, 1.2, 1]
                }}
                transition={{ 
                  delay: 2 + (i * 0.2),
                  duration: 0.5,
                  times: [0, 0.5, 1]
                }}
              >
                {letter}
              </motion.div>
            ))}
          </motion.div>
          
          {/* Call to action button with hover effect */}
          <motion.a
            href="#search-section"
            className="inline-block px-8 py-3 bg-white text-primary rounded-full font-medium hover:bg-blue-50 transition-colors shadow-lg group"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            variants={fadeInUpVariants}
          >
            Start Exploring
            <motion.span 
              className="inline-block ml-2"
              animate={{
                x: [0, 5, 0],
                transition: { 
                  repeat: Infinity, 
                  duration: 1,
                  repeatType: "reverse" 
                }
              }}
            >
              <FaHandPointRight />
            </motion.span>
          </motion.a>
        </div>
        
        {/* Improved bottom wave with clearer transition */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden" style={{ height: '100px' }}>
          <motion.div 
            className="w-full h-full"
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            transition={{ 
              duration: 1.2, 
              delay: 0.5,
              ease: "easeOut" 
            }}
          >
            <svg
              className="absolute bottom-0 left-0 w-full"
              preserveAspectRatio="none"
              viewBox="0 0 1440 120"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              style={{ height: '120px' }}
            >
              <motion.path
                d="M0,64L48,80C96,96,192,128,288,128C384,128,480,96,576,85.3C672,75,768,85,864,96C960,107,1056,117,1152,112C1248,107,1344,85,1392,74.7L1440,64L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
                fill="#FFFFFF"
                stroke="#FFFFFF"
                strokeWidth="1"
                initial={{ opacity: 0, pathLength: 0 }}
                animate={{ opacity: 1, pathLength: 1 }}
                transition={{ duration: 1.5, delay: 0.7 }}
              />
              
              {/* Improve the second decorative wave appearance for better visual separation */}
              <motion.path
                d="M0,96L60,90.7C120,85,240,75,360,80C480,85,600,107,720,112C840,117,960,107,1080,90.7C1200,75,1320,53,1380,42.7L1440,32L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"
                fill="rgba(255, 255, 255, 0.7)"
                initial={{ opacity: 0, pathLength: 0 }}
                animate={{ opacity: 1, pathLength: 1 }}
                transition={{ duration: 1.8, delay: 1 }}
              />
              
              {/* Add a third subtle wave for better layered effect */}
              <motion.path
                d="M0,32L40,48C80,64,160,96,240,106.7C320,117,400,107,480,101.3C560,96,640,96,720,96C800,96,880,96,960,85.3C1040,75,1120,53,1200,53.3C1280,53,1360,75,1400,85.3L1440,96L1440,320L1400,320C1360,320,1280,320,1200,320C1120,320,1040,320,960,320C880,320,800,320,720,320C640,320,560,320,480,320C400,320,320,320,240,320C160,320,80,320,40,320L0,320Z"
                fill="rgba(255, 255, 255, 0.5)"
                initial={{ opacity: 0, pathLength: 0 }}
                animate={{ opacity: 1, pathLength: 1 }}
                transition={{ duration: 2, delay: 1.3 }}
              />
            </svg>
          </motion.div>
        </div>
        
        {/* Add a clear visual indicator for scrolling down */}
        <motion.div 
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-20"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 3, duration: 0.5 }}
        >
          <motion.div
            className="flex flex-col items-center cursor-pointer"
            onClick={() => document.getElementById('search-section').scrollIntoView({ behavior: 'smooth' })}
            animate={{ y: [0, 10, 0] }}
            transition={{ 
              repeat: Infinity, 
              duration: 1.5,
              repeatType: "reverse" 
            }}
          >
            <span className="text-white text-xs font-medium mb-1">Scroll Down</span>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M7 10L12 15L17 10" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default HeroSection;
