import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaSignLanguage, 
  FaHandPeace, 
  FaHandsHelping, 
  FaAccessibleIcon, 
  FaClosedCaptioning 
} from 'react-icons/fa';

const WelcomeExperience = ({ onComplete, accessibilityMode, setAccessibilityMode }) => {
  const [step, setStep] = useState(0);
  const [visible, setVisible] = useState(true);
  const [selectedOptions, setSelectedOptions] = useState([]);
  
  // Skip intro if user has seen it before
  useEffect(() => {
    const hasSeenIntro = localStorage.getItem('hasSeenIntro');
    if (hasSeenIntro === 'true') {
      // Still show briefly for visual continuity
      setTimeout(() => {
        setVisible(false);
        setTimeout(() => onComplete(), 800);
      }, 1000);
    }
  }, [onComplete]);
  
  const completeWelcome = () => {
    localStorage.setItem('hasSeenIntro', 'true');
    localStorage.setItem('accessibilityMode', accessibilityMode);
    setVisible(false);
    setTimeout(() => onComplete(), 800);
  };
  
  const nextStep = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      completeWelcome();
    }
  };
  
  const selectOption = (option) => {
    if (selectedOptions.includes(option)) {
      setSelectedOptions(selectedOptions.filter(item => item !== option));
    } else {
      setSelectedOptions([...selectedOptions, option]);
    }
    
    // Update accessibility mode based on selections
    if (option === 'visual') {
      setAccessibilityMode('high-contrast');
    } else if (option === 'hearing') {
      setAccessibilityMode('deaf-friendly');
    } else if (option === 'motor') {
      setAccessibilityMode('motor-friendly');
    }
  };
  
  // For users who may want to skip this
  const handleSkip = () => {
    completeWelcome();
  };

  const containerVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { duration: 0.5 } },
    exit: { opacity: 0, transition: { duration: 0.5 } }
  };

  const handVariants = {
    initial: { y: 100, opacity: 0 },
    animate: { 
      y: 0, 
      opacity: 1, 
      transition: { 
        type: 'spring', 
        damping: 12,
        stiffness: 100,
        delay: 0.3 
      }
    }
  };

  const textVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { delay: 0.5, duration: 0.5 } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.3 } }
  };
  
  const buttonVariants = {
    initial: { scale: 0 },
    animate: { scale: 1, transition: { delay: 0.8, type: 'spring' } },
    hover: { scale: 1.05, transition: { duration: 0.2 } },
    tap: { scale: 0.95 }
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-tr from-blue-900 to-indigo-900"
          variants={containerVariants}
          initial="initial"
          animate="animate"
          exit="exit"
        >
          <div className="relative w-full max-w-2xl p-6 mx-4 bg-white rounded-xl shadow-2xl overflow-hidden">
            {/* Skip button for returning users */}
            <button 
              onClick={handleSkip}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
              aria-label="Skip introduction"
            >
              Skip
            </button>
            
            {/* Step 1: Welcome */}
            <AnimatePresence mode="wait">
              {step === 0 && (
                <motion.div 
                  key="welcome"
                  className="text-center py-6"
                  initial="initial"
                  animate="animate"
                  exit="exit"
                >
                  <motion.div
                    className="text-7xl text-primary mb-6 mx-auto"
                    variants={handVariants}
                  >
                    <FaHandPeace className="inline-block" />
                  </motion.div>
                  
                  <motion.h1 
                    className="text-3xl font-bold mb-4 text-gray-800"
                    variants={textVariants}
                  >
                    Welcome to SignSetu!
                  </motion.h1>
                  
                  <motion.p
                    className="text-lg text-gray-600 mb-8"
                    variants={textVariants}
                  >
                    Your magical journey into sign language begins here
                  </motion.p>
                  
                  <motion.button
                    onClick={nextStep}
                    className="px-8 py-3 bg-primary text-white rounded-full text-lg font-medium hover:bg-secondary transition-colors"
                    variants={buttonVariants}
                    whileHover="hover"
                    whileTap="tap"
                  >
                    Let's Begin
                  </motion.button>
                </motion.div>
              )}
              
              {/* Step 2: Accessibility Preferences */}
              {step === 1 && (
                <motion.div 
                  key="accessibility"
                  className="py-6"
                  initial="initial"
                  animate="animate"
                  exit="exit"
                >
                  <motion.h2 
                    className="text-2xl font-bold mb-6 text-center text-gray-800"
                    variants={textVariants}
                  >
                    How can we help you today?
                  </motion.h2>
                  
                  <motion.p
                    className="text-gray-600 mb-6 text-center"
                    variants={textVariants}
                  >
                    Select any options that apply to you (optional)
                  </motion.p>
                  
                  <motion.div 
                    className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
                    variants={textVariants}
                  >
                    <motion.button
                      onClick={() => selectOption('hearing')}
                      className={`p-4 rounded-lg border-2 text-center ${
                        selectedOptions.includes('hearing') 
                          ? 'border-primary bg-blue-50' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      whileHover={{ y: -5, transition: { duration: 0.2 } }}
                      whileTap={{ y: 0 }}
                    >
                      <FaClosedCaptioning className="text-3xl mb-2 mx-auto text-primary" />
                      <h3 className="font-medium">I'm deaf or hard of hearing</h3>
                    </motion.button>
                    
                    <motion.button
                      onClick={() => selectOption('visual')}
                      className={`p-4 rounded-lg border-2 text-center ${
                        selectedOptions.includes('visual') 
                          ? 'border-primary bg-blue-50' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      whileHover={{ y: -5, transition: { duration: 0.2 } }}
                      whileTap={{ y: 0 }}
                    >
                      <FaSignLanguage className="text-3xl mb-2 mx-auto text-primary" />
                      <h3 className="font-medium">I have visual needs</h3>
                    </motion.button>
                    
                    <motion.button
                      onClick={() => selectOption('motor')}
                      className={`p-4 rounded-lg border-2 text-center ${
                        selectedOptions.includes('motor') 
                          ? 'border-primary bg-blue-50' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      whileHover={{ y: -5, transition: { duration: 0.2 } }}
                      whileTap={{ y: 0 }}
                    >
                      <FaAccessibleIcon className="text-3xl mb-2 mx-auto text-primary" />
                      <h3 className="font-medium">I have motor challenges</h3>
                    </motion.button>
                  </motion.div>
                  
                  <div className="flex justify-center">
                    <motion.button
                      onClick={nextStep}
                      className="px-8 py-3 bg-primary text-white rounded-full text-lg font-medium hover:bg-secondary transition-colors"
                      variants={buttonVariants}
                      whileHover="hover"
                      whileTap="tap"
                    >
                      Continue
                    </motion.button>
                  </div>
                </motion.div>
              )}
              
              {/* Step 3: App Features */}
              {step === 2 && (
                <motion.div 
                  key="features"
                  className="py-6"
                  initial="initial"
                  animate="animate"
                  exit="exit"
                >
                  <motion.h2 
                    className="text-2xl font-bold mb-6 text-center text-gray-800"
                    variants={textVariants}
                  >
                    Explore the Magic of SignSetu
                  </motion.h2>
                  
                  <motion.div 
                    className="space-y-4 mb-8"
                    variants={textVariants}
                  >
                    {[
                      { icon: <FaSignLanguage />, text: "Search for sign language words with instant visual results" },
                      { icon: <FaHandsHelping />, text: "Watch clear videos demonstrating each sign" },
                      { icon: <FaHandPeace />, text: "Learn at your own pace with our user-friendly interface" }
                    ].map((item, i) => (
                      <motion.div 
                        key={i}
                        className="flex items-center p-3 bg-blue-50 rounded-lg"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ 
                          opacity: 1, 
                          x: 0, 
                          transition: { delay: 0.3 + (i * 0.2) } 
                        }}
                      >
                        <div className="text-2xl text-primary mr-4">
                          {item.icon}
                        </div>
                        <p className="text-gray-700">{item.text}</p>
                      </motion.div>
                    ))}
                  </motion.div>
                  
                  <div className="flex justify-center">
                    <motion.button
                      onClick={nextStep}
                      className="px-8 py-3 bg-primary text-white rounded-full text-lg font-medium hover:bg-secondary transition-colors"
                      variants={buttonVariants}
                      whileHover="hover"
                      whileTap="tap"
                    >
                      Continue
                    </motion.button>
                  </div>
                </motion.div>
              )}
              
              {/* Step 4: Final Step */}
              {step === 3 && (
                <motion.div 
                  key="final"
                  className="py-6 text-center"
                  initial="initial"
                  animate="animate"
                  exit="exit"
                >
                  <motion.div
                    className="text-9xl text-primary mx-auto mb-6 animate-float"
                    variants={handVariants}
                  >
                    <FaSignLanguage className="inline-block" />
                  </motion.div>
                  
                  <motion.h2 
                    className="text-2xl font-bold mb-4 text-gray-800"
                    variants={textVariants}
                  >
                    You're All Set!
                  </motion.h2>
                  
                  <motion.p
                    className="text-gray-600 mb-8"
                    variants={textVariants}
                  >
                    Your magical journey into sign language starts now
                  </motion.p>
                  
                  <motion.button
                    onClick={completeWelcome}
                    className="px-8 py-3 bg-primary text-white rounded-full text-lg font-medium hover:bg-secondary transition-colors"
                    variants={buttonVariants}
                    whileHover="hover"
                    whileTap="tap"
                  >
                    Start Exploring
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
            
            {/* Progress indicator */}
            <div className="flex justify-center mt-6 space-x-2">
              {[0, 1, 2, 3].map((i) => (
                <motion.div
                  key={i}
                  className={`h-2 rounded-full ${step === i ? 'w-8 bg-primary' : 'w-2 bg-gray-300'}`}
                  initial={false}
                  animate={{ 
                    width: step === i ? 32 : 8,
                    backgroundColor: step === i ? '#3B82F6' : '#D1D5DB'
                  }}
                />
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default WelcomeExperience;
