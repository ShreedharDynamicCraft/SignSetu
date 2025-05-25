import React, { useContext, useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { WordContext } from '../context/WordContext';
import LoadingSpinner from '../components/LoadingSpinner';
import VideoPlayer from '../components/VideoPlayer';
import {
  FaArrowLeft,
  FaEdit,
  FaVolumeUp,
  FaHandPaper
} from 'react-icons/fa';

const WordDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { words, getWordById, loading, fetchWords } = useContext(WordContext);
  const [word, setWord] = useState(null);
  const [relatedWords, setRelatedWords] = useState([]);

  useEffect(() => {
    // Make sure we have words loaded
    if (words.length === 0) {
      fetchWords();
    }

    const currentWord = getWordById(id);
    if (currentWord) {
      setWord(currentWord);
      
      // Find related words (placeholder logic - could be improved)
      const filtered = words
        .filter(w => w._id !== id)
        .sort(() => 0.5 - Math.random())
        .slice(0, 3);
      
      setRelatedWords(filtered);
    }
  }, [id, words, getWordById, fetchWords]);

  // Text-to-speech functionality to read the word and definition with Indian voice preference
  const speakText = (text) => {
    if ('speechSynthesis' in window) {
      // Cancel any ongoing speech
      window.speechSynthesis.cancel();
      
      const speech = new SpeechSynthesisUtterance();
      speech.text = text;
      speech.volume = 1;
      speech.rate = 0.9;
      speech.pitch = 1;
      
      // Get all available voices
      const voices = window.speechSynthesis.getVoices();
      
      // Try to find Indian English voice options
      const indianVoices = voices.filter(voice => 
        voice.lang.includes('en-IN') || 
        voice.name.toLowerCase().includes('indian') ||
        voice.name.toLowerCase().includes('hindi') ||
        voice.name.includes('Ravi') ||
        voice.name.includes('Lekha') ||
        voice.name.includes('Aditi')
      );
      
      // If Indian voices are available, use the first one
      if (indianVoices.length > 0) {
        speech.voice = indianVoices[0];
        console.log('Using Indian voice:', indianVoices[0].name);
      } else {
        // Fallback to other English voices with similar accent (e.g., British, Australian)
        const fallbackVoices = voices.filter(voice => 
          voice.lang.includes('en-GB') || 
          voice.lang.includes('en-AU')
        );
        
        if (fallbackVoices.length > 0) {
          speech.voice = fallbackVoices[0];
          console.log('Using fallback voice:', fallbackVoices[0].name);
        }
      }
      
      // Add event handlers
      speech.onstart = () => console.log('Speech started');
      speech.onend = () => console.log('Speech ended');
      speech.onerror = (event) => console.error('Speech error:', event);
      
      // Start speaking
      window.speechSynthesis.speak(speech);
    } else {
      console.warn('Text-to-speech not supported in this browser');
    }
  };

  if (loading || !word) {
    return <LoadingSpinner />;
  }

  return (
    <div className="max-w-4xl mx-auto px-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="mb-8"
      >
        <Link 
          to="/"
          className="flex items-center text-primary hover:text-secondary transition-colors mb-4"
        >
          <FaArrowLeft className="mr-2" /> Back to Dictionary
        </Link>

        <motion.div
          className="bg-white rounded-xl shadow-xl overflow-hidden"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.6 }}
        >
          <div className="md:flex">
            <div className="md:w-1/2">
              <div className="relative pb-[100%] md:pb-0 md:h-full">
                <img 
                  src={word.imageUrl}
                  alt={`Sign language gesture for ${word.word}`}
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/70 to-transparent p-4 md:hidden">
                  <h1 className="text-3xl font-bold text-white">{word.word}</h1>
                </div>
              </div>
            </div>

            <div className="md:w-1/2 p-6 md:p-8">
              <div className="hidden md:block">
                <div className="flex items-center justify-between">
                  <motion.h1 
                    className="text-3xl font-bold text-gray-800"
                    layoutId={`title-${word._id}`}
                  >
                    {word.word}
                  </motion.h1>
                  
                  <button
                    onClick={() => speakText(`${word.word}. ${word.definition}`)}
                    className="p-3 bg-blue-100 text-primary rounded-full hover:bg-blue-200 transition-colors"
                    aria-label="Read word and definition aloud"
                  >
                    <FaVolumeUp />
                  </button>
                </div>
              </div>

              <div className="mt-6">
                <h2 className="text-xl font-semibold mb-2 text-gray-700">Definition</h2>
                <p className="text-gray-600">{word.definition}</p>
              </div>

              <div className="mt-8">
                <h2 className="text-xl font-semibold mb-4 text-gray-700">Sign Language Video</h2>
                
                <VideoPlayer 
                  videoUrl={word.videoUrl} 
                  title={`Sign language video for ${word.word}`} 
                />
              </div>
              
              <div className="mt-8 flex justify-end">
                <Link
                  to={`/edit/${word._id}`}
                  className="flex items-center px-4 py-2 bg-blue-100 text-primary rounded-lg hover:bg-blue-200 transition-colors"
                >
                  <FaEdit className="mr-2" /> Edit
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {relatedWords.length > 0 && (
        <div className="mt-12 mb-8">
          <h2 className="text-2xl font-bold mb-6">Related Words</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {relatedWords.map((relatedWord) => (
              <motion.div
                key={relatedWord._id}
                className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer"
                whileHover={{ y: -5, boxShadow: "0 10px 20px rgba(0,0,0,0.1)" }}
                onClick={() => navigate(`/word/${relatedWord._id}`)}
              >
                <div className="h-40 overflow-hidden">
                  <img 
                    src={relatedWord.imageUrl} 
                    alt={`Sign for ${relatedWord.word}`}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-lg">{relatedWord.word}</h3>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-16 py-8 flex justify-center">
        <motion.div
          className="flex flex-col items-center text-center max-w-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <FaHandPaper className="text-primary text-4xl mb-4 animate-float" />
          <h3 className="text-xl font-semibold mb-2">Practice Makes Perfect</h3>
          <p className="text-gray-600">
            Try mimicking the sign shown in the video. Regular practice will help you remember
            and use sign language effectively in real-life situations.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default WordDetailPage;
