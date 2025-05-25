import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { 
  FaEdit, 
  FaTrash, 
  FaPlay, 
  FaPause, 
  FaInfo 
} from 'react-icons/fa';
import * as THREE from 'three';
import VideoPlayer from './VideoPlayer';

const WordCard = ({ word, onDelete }) => {
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const navigate = useNavigate();
  
  // For 3D tilt effect
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  const springConfig = { damping: 20, stiffness: 100 };
  const springX = useSpring(x, springConfig);
  const springY = useSpring(y, springConfig);
  
  const rotateX = useTransform(springY, [-0.5, 0.5], [10, -10]);
  const rotateY = useTransform(springX, [-0.5, 0.5], [-10, 10]);
  const shadow = useTransform(
    y,
    [-0.5, 0.5],
    ['0px 10px 25px rgba(0,0,0,0.18)', '0px 5px 15px rgba(0,0,0,0.1)']
  );

  // Handle mouse movement for 3D effect
  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    
    // Get position of mouse relative to container
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    // Calculate normalized position (0 to 1)
    const normalizedX = (mouseX / width - 0.5);
    const normalizedY = (mouseY / height - 0.5);
    
    // Update motion values
    x.set(normalizedX);
    y.set(normalizedY);
  };

  const resetPosition = () => {
    x.set(0);
    y.set(0);
  };

  const handleCardClick = (e) => {
    // If the video button was clicked, don't navigate
    if (e.target.closest('.video-toggle-btn')) {
      return;
    }
    
    // Navigate to word details page
    navigate(`/word/${word._id}`);
  };

  const toggleVideo = (e) => {
    e.stopPropagation();
    setIsVideoOpen(!isVideoOpen);
    setIsVideoPlaying(!isVideoOpen);
  };

  // THREE.js floating hand animation
  useEffect(() => {
    if (!isHovered || !canvasRef.current) return;
    
    // Set up scene
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      alpha: true,
    });
    renderer.setSize(80, 80);
    
    // Create simple hand geometry
    const geometry = new THREE.BoxGeometry(1, 1.5, 0.2);
    const fingerGeometry = new THREE.BoxGeometry(0.2, 0.8, 0.2);
    
    const material = new THREE.MeshBasicMaterial({ color: 0x3B82F6 });
    
    // Palm
    const palm = new THREE.Mesh(geometry, material);
    scene.add(palm);
    
    // Fingers
    const positions = [
      [-0.3, 0.8, 0], 
      [-0.1, 0.8, 0], 
      [0.1, 0.8, 0], 
      [0.3, 0.8, 0],
      [0.4, -0.4, 0], // Thumb positioned differently
    ];
    
    const fingers = positions.map((pos, i) => {
      const finger = new THREE.Mesh(fingerGeometry, material);
      finger.position.set(...pos);
      if (i === 4) { // Thumb
        finger.rotation.z = Math.PI / 4;
      }
      palm.add(finger);
      return finger;
    });
    
    camera.position.z = 5;
    
    // Animation loop
    const animate = () => {
      if (!isHovered) return;
      
      requestAnimationFrame(animate);
      
      // Rotate hand slightly
      palm.rotation.y += 0.01;
      palm.rotation.z = Math.sin(Date.now() * 0.002) * 0.1;
      
      // Move up and down slightly
      palm.position.y = Math.sin(Date.now() * 0.001) * 0.2;
      
      renderer.render(scene, camera);
    };
    
    animate();
    
    return () => {
      scene.clear();
    };
  }, [isHovered]);

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    },
    hover: {
      scale: 1.03,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 10
      }
    }
  };

  return (
    <motion.div
      ref={containerRef}
      className="bg-white rounded-lg overflow-hidden relative cursor-pointer"
      initial="hidden"
      animate="visible"
      whileHover="hover"
      variants={cardVariants}
      onMouseMove={handleMouseMove}
      onMouseLeave={resetPosition}
      onClick={handleCardClick}
      layout
      style={{
        boxShadow: shadow
      }}
      role="button"
      aria-label={`View details of ${word.word}`}
      tabIndex={0}
    >
      <motion.div 
        className="card-3d-content w-full"
        style={{ 
          rotateX: rotateX, 
          rotateY: rotateY,
          transformPerspective: "1000px" 
        }}
      >
        <div className="relative pb-56 overflow-hidden">
          <motion.img 
            src={word.imageUrl} 
            alt={`Sign for ${word.word}`} 
            className="absolute h-full w-full object-cover"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://via.placeholder.com/400x300?text=Image+Not+Found';
            }}
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.4 }}
          />
          
          <motion.div 
            className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-70"
          />
          
          {/* Repositioned play button to ensure full visibility in the corner */}
          <motion.button 
            onClick={toggleVideo}
            className="video-toggle-btn absolute left-3 bottom-12 p-3 bg-primary text-white rounded-full shadow-lg hover:bg-secondary transition-colors z-20"
            aria-label={isVideoOpen ? "Close video" : "Play video"}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            initial={{ y: 5, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {isVideoPlaying ? 
              <FaPause className="text-xl" /> : 
              <FaPlay className="text-xl ml-0.5" />
            }
          </motion.button>
          
          <motion.div
            className="absolute left-0 bottom-0 w-full p-4 text-white"
          >
            <motion.h2 
              className="text-xl font-bold mb-1"
              layoutId={`title-${word._id}`}
            >
              {word.word}
            </motion.h2>
          </motion.div>
        </div>
        
        <div className="p-4 relative">
          <motion.p 
            className="text-gray-600 line-clamp-2"
          >
            {word.definition}
          </motion.p>
          
          {isVideoOpen && (
            <motion.div 
              className="mt-4"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <VideoPlayer 
                videoUrl={word.videoUrl} 
                title={`Sign language video for ${word.word}`}
              />
            </motion.div>
          )}
          
          <div className="mt-4 flex justify-between items-center">
            <motion.button
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/word/${word._id}`);
              }}
              className="text-primary hover:text-secondary transition-colors flex items-center font-medium"
              whileHover={{ x: 5 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaInfo className="mr-1" /> More details
            </motion.button>
            
            <div className="flex space-x-2">
              <Link
                to={`/edit/${word._id}`}
                onClick={(e) => e.stopPropagation()}
                className="p-2 text-blue-600 hover:text-blue-800 transition-colors"
                aria-label={`Edit ${word.word}`}
              >
                <motion.div whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.9 }}>
                  <FaEdit />
                </motion.div>
              </Link>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(word._id);
                }}
                className="p-2 text-red-600 hover:text-red-800 transition-colors"
                aria-label={`Delete ${word.word}`}
              >
                <motion.div whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.9 }}>
                  <FaTrash />
                </motion.div>
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {isHovered && (
        <div className="absolute top-2 left-2 z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            className="w-20 h-20"
          >
            <canvas ref={canvasRef} className="w-full h-full" />
          </motion.div>
        </div>
      )}
      
      {/* Add a badge indicating About section to make it more visible */}
      {word.category === 'about' && (
        <div className="absolute top-2 right-2 z-20 bg-blue-500 text-white px-2 py-1 text-xs rounded-full">
          About
        </div>
      )}
    </motion.div>
  );
};

export default WordCard;
