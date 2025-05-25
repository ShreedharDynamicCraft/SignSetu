import React, { useState, useEffect } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import AddWordPage from './pages/AddWordPage';
import EditWordPage from './pages/EditWordPage';
import WordDetailPage from './pages/WordDetailPage';
import AboutPage from './pages/AboutPage';
import TranslatorPage from './pages/TranslatorPage';
import Footer from './components/Footer';
import WelcomeExperience from './components/WelcomeExperience';
import { motion, AnimatePresence } from 'framer-motion';
import { ErrorBoundary } from './components/ErrorBoundary';

// Configuration based on environment
const config = {
  appName: process.env.REACT_APP_PROJECT_NAME || 'SignSetu',
  apiUrl: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  environment: process.env.NODE_ENV
};

console.log(`Running in ${config.environment} environment`);

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [showWelcome, setShowWelcome] = useState(false);
  const [accessibilityMode, setAccessibilityMode] = useState('standard');
  
  // Check if first visit or returning user
  useEffect(() => {
    // Add a small delay for the loading animation
    setTimeout(() => {
      setIsLoading(false);
      
      // Check if we should show the welcome experience
      const hasSeenIntro = localStorage.getItem('hasSeenIntro');
      setShowWelcome(!hasSeenIntro);
    }, 1000);
  }, []);
  
  const handleWelcomeComplete = () => {
    setShowWelcome(false);
  };
  
  return (
    <ErrorBoundary>
      <div className={`min-h-screen flex flex-col ${accessibilityMode === 'high-contrast' ? 'high-contrast-mode' : ''} ${accessibilityMode === 'deaf-friendly' ? 'deaf-friendly-mode' : ''} ${accessibilityMode === 'motor-friendly' ? 'motor-friendly-mode' : ''}`}>
        <AnimatePresence>
          {isLoading && (
            <motion.div 
              className="fixed inset-0 z-50 flex items-center justify-center bg-primary"
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8 }}
            >
              <motion.div
                animate={{ 
                  scale: [1, 1.2, 1],
                  rotate: [0, 180, 360],
                }}
                transition={{ 
                  repeat: Infinity,
                  repeatType: "loop",
                  duration: 2
                }}
                className="text-white text-6xl"
              >
                <span className="sr-only">Loading</span>
                <svg className="w-24 h-24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 5C8.13401 5 5 8.13401 5 12C5 15.866 8.13401 19 12 19C15.866 19 19 15.866 19 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {showWelcome && !isLoading && (
          <WelcomeExperience 
            onComplete={handleWelcomeComplete} 
            accessibilityMode={accessibilityMode}
            setAccessibilityMode={setAccessibilityMode}
          />
        )}
        
        <AnimatePresence>
          {(!showWelcome || localStorage.getItem('hasSeenIntro') === 'true') && !isLoading && (
            <motion.div 
              className="flex flex-col min-h-screen"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <Navbar accessibilityMode={accessibilityMode} setAccessibilityMode={setAccessibilityMode} />
              <div className="flex-grow container mx-auto px-4 pt-24 pb-8">
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/about" element={<AboutPage />} />
                  <Route path="/translator" element={<TranslatorPage />} />
                  <Route path="/add" element={<AddWordPage />} />
                  <Route path="/edit/:id" element={<EditWordPage />} />
                  <Route path="/word/:id" element={<WordDetailPage />} />
                  {/* Catch-all route for 404 */}
                  <Route path="*" element={
                    <div className="text-center py-20">
                      <h1 className="text-4xl font-bold text-gray-800 mb-4">Page Not Found</h1>
                      <p className="text-xl text-gray-600 mb-8">The page you're looking for doesn't exist.</p>
                      <Link to="/" className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-secondary transition-colors">
                        Go Home
                      </Link>
                    </div>
                  } />
                </Routes>
              </div>
              <Footer />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </ErrorBoundary>
  );
}

export default App;
