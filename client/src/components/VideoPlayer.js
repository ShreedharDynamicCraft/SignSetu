import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { FaPlay, FaPause, FaExpand, FaCompress } from 'react-icons/fa';

/**
 * A reusable video player component that supports both YouTube embeds and direct video files
 * @param {String} videoUrl - URL of the video
 * @param {String} title - Video title for accessibility
 */
const VideoPlayer = ({ 
  videoUrl, 
  title = 'Sign language video' 
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isYouTube, setIsYouTube] = useState(false);
  const [videoId, setVideoId] = useState('');
  const containerRef = useRef(null);
  const iframeRef = useRef(null);
  const videoRef = useRef(null);

  // Extract YouTube video ID if applicable
  useEffect(() => {
    if (!videoUrl) return;
    
    const youtubeRegex = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    const match = videoUrl.match(youtubeRegex);
    
    if (match && match[7] && match[7].length === 11) {
      setIsYouTube(true);
      setVideoId(match[7]);
    } else {
      setIsYouTube(false);
    }
  }, [videoUrl]);

  // Construct the YouTube embed URL with appropriate parameters
  const getYouTubeEmbedUrl = () => {
    if (!videoId) return '';
    
    // We need to include enablejsapi=1 for postMessage control
    let url = `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1&enablejsapi=1`;
    
    // Set initial state
    if (isPlaying) url += '&autoplay=1';
    
    return url;
  };

  // Handle play/pause
  const togglePlay = () => {
    if (isYouTube && iframeRef.current) {
      if (!isPlaying) {
        // YouTube requires autoplay with mute for most browsers
        // If currently paused, we need to refresh the iframe to autoplay
        const currentSrc = iframeRef.current.src;
        iframeRef.current.src = currentSrc.includes('autoplay=1') ? 
          currentSrc : 
          `${currentSrc}${currentSrc.includes('?') ? '&' : '?'}autoplay=1`;
      } else {
        // Send pause command via postMessage
        iframeRef.current.contentWindow.postMessage(
          JSON.stringify({ event: 'command', func: 'pauseVideo', args: [] }), 
          '*'
        );
      }
      setIsPlaying(!isPlaying);
    } else if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play();
        setIsPlaying(true);
      } else {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    }
  };

  // Handle fullscreen toggle with proper browser support
  const toggleFullscreen = () => {
    if (!containerRef.current) return;

    const enterFullscreen = async (element) => {
      try {
        if (element.requestFullscreen) {
          await element.requestFullscreen();
        } else if (element.webkitRequestFullscreen) {
          await element.webkitRequestFullscreen(); // Safari
        } else if (element.msRequestFullscreen) {
          await element.msRequestFullscreen(); // IE11
        }
        setIsFullscreen(true);
      } catch (err) {
        console.error('Failed to enter fullscreen:', err);
      }
    };

    const exitFullscreen = async () => {
      try {
        if (document.exitFullscreen) {
          await document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
          await document.webkitExitFullscreen(); // Safari
        } else if (document.msExitFullscreen) {
          await document.msExitFullscreen(); // IE11
        }
        setIsFullscreen(false);
      } catch (err) {
        console.error('Failed to exit fullscreen:', err);
      }
    };

    if (!isFullscreen) {
      enterFullscreen(containerRef.current);
    } else {
      exitFullscreen();
    }
  };

  // Listen for fullscreen changes (e.g., when user presses Esc key)
  useEffect(() => {
    const handleFullscreenChange = () => {
      const isCurrentlyFullscreen = 
        document.fullscreenElement || 
        document.webkitFullscreenElement || 
        document.msFullscreenElement;
      
      setIsFullscreen(!!isCurrentlyFullscreen);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('msfullscreenchange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('msfullscreenchange', handleFullscreenChange);
    };
  }, []);

  return (
    <div className="video-player">
      <div 
        ref={containerRef}
        className={`video-container ${isFullscreen ? 'fullscreen' : ''}`}
      >
        {isYouTube ? (
          <iframe
            ref={iframeRef}
            src={getYouTubeEmbedUrl()}
            title={title}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          ></iframe>
        ) : (
          <video
            ref={videoRef}
            src={videoUrl}
            className="w-full h-full"
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            controls={false}
            playsInline
          ></video>
        )}
      </div>
      
      <div className="video-controls">
        <motion.button
          onClick={togglePlay}
          className="sign-friendly-control"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          aria-label={isPlaying ? "Pause video" : "Play video"}
        >
          {isPlaying ? <FaPause size={20} /> : <FaPlay size={20} />}
        </motion.button>
        
        <motion.button
          onClick={toggleFullscreen}
          className="sign-friendly-control"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
        >
          {isFullscreen ? <FaCompress size={20} /> : <FaExpand size={20} />}
        </motion.button>
      </div>
    </div>
  );
};

export default VideoPlayer;
