import React from 'react';
import { motion } from 'framer-motion';

const LoadingSpinner = () => {
  const containerVariants = {
    initial: {
      rotate: 0
    },
    animate: {
      rotate: 360,
      transition: {
        duration: 1,
        ease: "linear",
        repeat: Infinity
      }
    }
  };

  const dotVariants = {
    animate: {
      scale: [1, 1.5, 1],
      transition: {
        duration: 1,
        repeat: Infinity
      }
    }
  };

  return (
    <div className="flex justify-center items-center py-10">
      <motion.div 
        className="w-16 h-16 relative"
        variants={containerVariants}
        initial="initial"
        animate="animate"
      >
        {[...Array(4)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-3 h-3 bg-primary rounded-full"
            style={{
              top: i % 2 === 0 ? 0 : "auto",
              bottom: i % 2 !== 0 ? 0 : "auto",
              left: i === 0 || i === 3 ? 0 : "auto",
              right: i === 1 || i === 2 ? 0 : "auto",
            }}
            variants={dotVariants}
            animate="animate"
            transition={{
              delay: i * 0.2
            }}
          />
        ))}
      </motion.div>
      <p className="ml-3 text-gray-600 font-medium">Loading...</p>
    </div>
  );
};

export default LoadingSpinner;
