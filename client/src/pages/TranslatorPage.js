import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Play, Pause, RotateCcw, Volume2, Book, Hand, ArrowRight, Calculator, Plus, Minus, X, Divide, Equal, Delete, AlertCircle, CheckCircle, Mic, MicOff } from 'lucide-react';

const TranslatorPage = () => {
  const [inputText, setInputText] = useState('');
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [translatedWords, setTranslatedWords] = useState([]);
  const [currentSign, setCurrentSign] = useState(null);
  const [showCalculator, setShowCalculator] = useState(false);
  const [calcDisplay, setCalcDisplay] = useState('0');
  const [calcPrevious, setCalcPrevious] = useState(null);
  const [calcOperation, setCalcOperation] = useState(null);
  const [calcWaitingForNewValue, setCalcWaitingForNewValue] = useState(false);
  const [animatedChars, setAnimatedChars] = useState([]);
  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [playbackSpeed, setPlaybackSpeed] = useState(2000);
  const [voiceLoaded, setVoiceLoaded] = useState(false);

  const timeoutsRef = useRef([]);
  const recognitionRef = useRef(null);

  // Enhanced sign language database with more words and Indian context
  const signDatabase = {
    'hello': {
      description: 'Raise your dominant hand to your forehead, then move it away in a small arc',
      steps: ['✋ Raise hand to forehead', '👋 Move hand away with small wave'],
      category: 'greeting',
      emoji: '👋'
    },
    'hi': {
      description: 'Wave your hand from side to side',
      steps: ['✋ Raise hand up', '👋 Wave from side to side'],
      category: 'greeting',
      emoji: '👋'
    },
    'thank': {
      description: 'Touch fingertips to chin, then move hand forward and down',
      steps: ['👆 Touch fingertips to chin', '👇 Move hand forward and down'],
      category: 'courtesy',
      emoji: '🙏'
    },
    'thanks': {
      description: 'Touch fingertips to chin, then move hand forward and down',
      steps: ['👆 Touch fingertips to chin', '👇 Move hand forward and down'],
      category: 'courtesy',
      emoji: '🙏'
    },
    'you': {
      description: 'Point index finger toward the person you are addressing',
      steps: ['👉 Point index finger forward'],
      category: 'pronoun',
      emoji: '👤'
    },
    'please': {
      description: 'Place flat hand on chest and move in circular motion',
      steps: ['✋ Place hand on chest', '🔄 Move in circular motion'],
      category: 'courtesy',
      emoji: '🙏'
    },
    'water': {
      description: 'Make "W" handshape and tap side of mouth twice',
      steps: ['✌️ Form "W" with three fingers', '👄 Tap side of mouth twice'],
      category: 'noun',
      emoji: '💧'
    },
    'eat': {
      description: 'Bring fingertips to mouth as if eating',
      steps: ['✊ Form loose fist', '👄 Bring to mouth repeatedly'],
      category: 'verb',
      emoji: '🍽️'
    },
    'food': {
      description: 'Bring fingertips to mouth as if eating',
      steps: ['✊ Form loose fist', '👄 Bring to mouth repeatedly'],
      category: 'noun',
      emoji: '🍽️'
    },
    'good': {
      description: 'Place flat hand near mouth, then move down to other hand',
      steps: ['✋ Place hand near mouth', '👇 Move down to other palm'],
      category: 'adjective',
      emoji: '👍'
    },
    'bad': {
      description: 'Place fingertips at mouth, then flip hand down',
      steps: ['👆 Touch fingertips to mouth', '👇 Flip hand downward'],
      category: 'adjective',
      emoji: '👎'
    },
    'yes': {
      description: 'Make fist and nod it up and down like nodding head',
      steps: ['✊ Make a fist', '↕️ Nod up and down'],
      category: 'response',
      emoji: '✅'
    },
    'no': {
      description: 'Extend index and middle finger, then close them',
      steps: ['✌️ Extend index and middle finger', '✊ Close fingers together'],
      category: 'response',
      emoji: '❌'
    },
    'love': {
      description: 'Cross arms over chest in hugging motion',
      steps: ['🤗 Cross arms over chest', '❤️ Squeeze gently'],
      category: 'emotion',
      emoji: '❤️'
    },
    'help': {
      description: 'Place one fist on opposite palm and lift together',
      steps: ['✊ Place fist on palm', '⬆️ Lift both hands together'],
      category: 'verb',
      emoji: '🤝'
    },
    'sorry': {
      description: 'Make fist and rub it in circular motion on chest',
      steps: ['✊ Make a fist', '🔄 Rub in circular motion on chest'],
      category: 'courtesy',
      emoji: '😔'
    },
    'friend': {
      description: 'Hook index fingers together, then reverse',
      steps: ['👆 Hook index fingers together', '🔄 Reverse the hook'],
      category: 'noun',
      emoji: '👫'
    },
    'family': {
      description: 'Make "F" handshape and move in circle',
      steps: ['👌 Make "F" handshape', '🔄 Move in circle'],
      category: 'noun',
      emoji: '👨‍👩‍👧‍👦'
    },
    'home': {
      description: 'Touch fingertips to mouth, then to cheek',
      steps: ['👄 Touch fingertips to mouth', '😊 Move to cheek'],
      category: 'noun',
      emoji: '🏠'
    },
    'work': {
      description: 'Make fists and tap wrists together',
      steps: ['✊ Make both fists', '🔨 Tap wrists together'],
      category: 'verb',
      emoji: '💼'
    },
    'school': {
      description: 'Clap hands together twice',
      steps: ['👏 Clap hands together', '👏 Repeat clapping motion'],
      category: 'noun',
      emoji: '🏫'
    },
    'book': {
      description: 'Open palms like opening a book',
      steps: ['📖 Place palms together', '📚 Open like a book'],
      category: 'noun',
      emoji: '📚'
    },
    'car': {
      description: 'Pretend to steer a steering wheel',
      steps: ['🚗 Grip imaginary steering wheel', '🔄 Turn left and right'],
      category: 'noun',
      emoji: '🚗'
    },
    'money': {
      description: 'Tap back of one hand with other palm',
      steps: ['✋ Place one palm up', '👆 Tap with other hand'],
      category: 'noun',
      emoji: '💰'
    },
    // Numbers
    'one': {
      description: 'Hold up index finger',
      steps: ['☝️ Extend index finger upward'],
      category: 'number',
      emoji: '1️⃣'
    },
    'two': {
      description: 'Hold up index and middle finger in V shape',
      steps: ['✌️ Extend index and middle finger'],
      category: 'number',
      emoji: '2️⃣'
    },
    'three': {
      description: 'Hold up thumb, index, and middle finger',
      steps: ['🤟 Extend thumb, index, and middle finger'],
      category: 'number',
      emoji: '3️⃣'
    },
    'four': {
      description: 'Hold up four fingers, thumb tucked',
      steps: ['🖐️ Extend four fingers, thumb down'],
      category: 'number',
      emoji: '4️⃣'
    },
    'five': {
      description: 'Hold up all five fingers spread apart',
      steps: ['🖐️ Extend all five fingers'],
      category: 'number',
      emoji: '5️⃣'
    },
    // Indian context words
    'namaste': {
      description: 'Press palms together in front of chest and bow slightly',
      steps: ['🙏 Press palms together', '🙇 Bow head slightly'],
      category: 'indian',
      emoji: '🙏'
    },
    'dhanyawad': {
      description: 'Similar to thank you - touch fingertips to chin, move forward',
      steps: ['👆 Touch fingertips to chin', '👇 Move hand forward and down'],
      category: 'indian',
      emoji: '🙏'
    },
    'guru': {
      description: 'Place hand over heart, then extend forward with respect',
      steps: ['❤️ Place hand over heart', '🙏 Extend forward respectfully'],
      category: 'indian',
      emoji: '🧘'
    },
    'chai': {
      description: 'Pretend to hold and sip from a small cup',
      steps: ['☕ Hold imaginary small cup', '😋 Bring to mouth to sip'],
      category: 'indian',
      emoji: '☕'
    },
    'roti': {
      description: 'Make circular motions with palms as if making bread',
      steps: ['🫳 Place palms flat', '🔄 Move in circular motions'],
      category: 'indian',
      emoji: '🫓'
    }
  };

  const categories = {
    'greeting': '👋 Greetings',
    'courtesy': '🙏 Courtesy',
    'pronoun': '👤 Pronouns',
    'noun': '📦 Nouns',
    'verb': '🏃 Verbs',
    'adjective': '⭐ Adjectives',
    'response': '💬 Responses',
    'emotion': '😊 Emotions',
    'number': '🔢 Numbers',
    'indian': '🇮🇳 Indian Signs'
  };

  // Initialize speech recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      setSpeechSupported(true);
      const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-IN'; // Indian English

      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInputText(prev => prev ? `${prev} ${transcript}` : transcript);
        setSuccess('Speech recognized successfully!');
        setTimeout(() => setSuccess(''), 3000);
      };

      recognitionRef.current.onerror = (event) => {
        setError(`Speech recognition error: ${event.error}`);
        setIsListening(false);
        setTimeout(() => setError(''), 5000);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }

    // Check for voice synthesis
    if ('speechSynthesis' in window) {
      const checkVoices = () => {
        const voices = speechSynthesis.getVoices();
        if (voices.length > 0) {
          setVoiceLoaded(true);
        }
      };
      
      checkVoices();
      speechSynthesis.onvoiceschanged = checkVoices;
    }

    return () => {
      clearAllTimeouts();
    };
  }, []);

  // Clear all timeouts
  const clearAllTimeouts = useCallback(() => {
    timeoutsRef.current.forEach(timeout => clearTimeout(timeout));
    timeoutsRef.current = [];
  }, []);

  // Calculator functions with error handling
  const inputNumber = useCallback((num) => {
    try {
      if (calcWaitingForNewValue) {
        setCalcDisplay(String(num));
        setCalcWaitingForNewValue(false);
      } else {
        setCalcDisplay(prev => prev === '0' ? String(num) : prev + num);
      }
    } catch (err) {
      setError('Calculator input error');
      setTimeout(() => setError(''), 3000);
    }
  }, [calcWaitingForNewValue]);

  const inputOperation = useCallback((nextOperation) => {
    try {
      const inputValue = parseFloat(calcDisplay);
      
      if (isNaN(inputValue)) {
        setError('Invalid number format');
        setTimeout(() => setError(''), 3000);
        return;
      }

      if (calcPrevious === null) {
        setCalcPrevious(inputValue);
      } else if (calcOperation) {
        const currentValue = calcPrevious || 0;
        const newValue = calculate(currentValue, inputValue, calcOperation);
        
        if (isNaN(newValue) || !isFinite(newValue)) {
          setError('Invalid calculation result');
          setTimeout(() => setError(''), 3000);
          return;
        }
        
        setCalcDisplay(String(newValue));
        setCalcPrevious(newValue);
      }
      
      setCalcWaitingForNewValue(true);
      setCalcOperation(nextOperation);
    } catch (err) {
      setError('Calculation error occurred');
      setTimeout(() => setError(''), 3000);
    }
  }, [calcDisplay, calcPrevious, calcOperation]);

  const calculate = (firstValue, secondValue, operation) => {
    switch (operation) {
      case '+': return firstValue + secondValue;
      case '-': return firstValue - secondValue;
      case '*': return firstValue * secondValue;
      case '/': 
        if (secondValue === 0) {
          throw new Error('Division by zero');
        }
        return firstValue / secondValue;
      case '=': return secondValue;
      default: return secondValue;
    }
  };

  const performCalculation = useCallback(() => {
    try {
      const inputValue = parseFloat(calcDisplay);
      
      if (isNaN(inputValue)) {
        setError('Invalid number format');
        setTimeout(() => setError(''), 3000);
        return;
      }
      
      if (calcPrevious !== null && calcOperation) {
        const newValue = calculate(calcPrevious, inputValue, calcOperation);
        
        if (isNaN(newValue) || !isFinite(newValue)) {
          setError('Invalid calculation result');
          setTimeout(() => setError(''), 3000);
          return;
        }
        
        setCalcDisplay(String(newValue));
        setCalcPrevious(null);
        setCalcOperation(null);
        setCalcWaitingForNewValue(true);
        setSuccess('Calculation completed!');
        setTimeout(() => setSuccess(''), 2000);
      }
    } catch (err) {
      setError(err.message || 'Calculation error');
      setTimeout(() => setError(''), 3000);
    }
  }, [calcDisplay, calcPrevious, calcOperation]);

  const clearCalculator = useCallback(() => {
    setCalcDisplay('0');
    setCalcPrevious(null);
    setCalcOperation(null);
    setCalcWaitingForNewValue(false);
    setSuccess('Calculator cleared!');
    setTimeout(() => setSuccess(''), 2000);
  }, []);

  // Enhanced text translation with better error handling
  const translateText = useCallback((text) => {
    try {
      if (!text || typeof text !== 'string' || !text.trim()) {
        setTranslatedWords([]);
        setCurrentWordIndex(0);
        setCurrentSign(null);
        setAnimatedChars([]);
        return;
      }

      const words = text.toLowerCase().split(/\s+/).filter(word => word.length > 0);
      const translated = words.map(word => {
        const cleanWord = word.replace(/[^\w]/g, '');
        const sign = signDatabase[cleanWord];
        return {
          original: word,
          clean: cleanWord,
          sign: sign || null,
          hasSign: !!sign,
          characters: word.split('').map((char, i) => ({
            char,
            revealed: false,
            delay: i * 0.1
          }))
        };
      });
      
      setTranslatedWords(translated);
      setCurrentWordIndex(0);
      setCurrentSign(translated[0]?.sign || null);

      // Create character array for animation
      const allChars = words.join(' ').split('').map((char, i) => ({
        char,
        revealed: false,
        delay: i * 0.05
      }));
      
      setAnimatedChars(allChars);
      
      // Clear existing timeouts
      clearAllTimeouts();
      
      // Animate characters
      allChars.forEach((_, i) => {
        const timeout = setTimeout(() => {
          setAnimatedChars(prev => 
            prev.map((charObj, index) => 
              index === i ? { ...charObj, revealed: true } : charObj
            )
          );
        }, i * 80);
        
        timeoutsRef.current.push(timeout);
      });

      // Show success message for words with signs
      const wordsWithSigns = translated.filter(w => w.hasSign).length;
      if (wordsWithSigns > 0) {
        setSuccess(`Found ${wordsWithSigns} sign(s) for your text!`);
        setTimeout(() => setSuccess(''), 3000);
      } else if (translated.length > 0) {
        setError('No signs found for these words. Try using words from the library below.');
        setTimeout(() => setError(''), 5000);
      }
    } catch (err) {
      setError('Error processing text. Please try again.');
      setTimeout(() => setError(''), 3000);
    }
  }, [clearAllTimeouts]);

  // Update text when input changes
  useEffect(() => {
    translateText(inputText);
  }, [inputText, translateText]);

  // Enhanced play animation with better error handling
  const playAnimation = useCallback(() => {
    if (!translatedWords.length) {
      setError('Please enter some text first');
      setTimeout(() => setError(''), 3000);
      return;
    }
    
    setIsPlaying(true);
    clearAllTimeouts();
    
    try {
      translatedWords.forEach((word, wordIndex) => {
        const timeout = setTimeout(() => {
          setCurrentWordIndex(wordIndex);
          setCurrentSign(word?.sign || null);
          
          // Reset and animate characters for current word
          const wordStart = translatedWords.slice(0, wordIndex)
            .reduce((acc, w) => acc + w.original.length + 1, 0);
          
          const wordLength = word.original.length;
          
          for (let i = 0; i < wordLength; i++) {
            const charIndex = wordStart + i;
            const charTimeout = setTimeout(() => {
              setAnimatedChars(prev => 
                prev.map((charObj, idx) => 
                  idx === charIndex ? { ...charObj, revealed: true } : charObj
                )
              );
            }, i * 80);
            
            timeoutsRef.current.push(charTimeout);
          }
        }, wordIndex * playbackSpeed);
        
        timeoutsRef.current.push(timeout);
      });
      
      // Stop animation when complete
      const finalTimeout = setTimeout(() => {
        setIsPlaying(false);
        setSuccess('Animation completed!');
        setTimeout(() => setSuccess(''), 2000);
      }, translatedWords.length * playbackSpeed);
      
      timeoutsRef.current.push(finalTimeout);
    } catch (err) {
      setError('Animation error occurred');
      setIsPlaying(false);
      setTimeout(() => setError(''), 3000);
    }
  }, [translatedWords, playbackSpeed, clearAllTimeouts]);

  // Reset animation
  const resetAnimation = useCallback(() => {
    clearAllTimeouts();
    setIsPlaying(false);
    setCurrentWordIndex(0);
    setCurrentSign(translatedWords[0]?.sign || null);
    
    setAnimatedChars(prev => prev.map(charObj => ({ ...charObj, revealed: false })));
    
    // Re-animate all characters
    animatedChars.forEach((_, i) => {
      const timeout = setTimeout(() => {
        setAnimatedChars(prev => 
          prev.map((charObj, index) => 
            index === i ? { ...charObj, revealed: true } : charObj
          )
        );
      }, i * 40);
      
      timeoutsRef.current.push(timeout);
    });

    setSuccess('Animation reset!');
    setTimeout(() => setSuccess(''), 2000);
  }, [animatedChars, translatedWords, clearAllTimeouts]);

  // Enhanced speech function with Indian voice preference
  const speakText = useCallback((text) => {
    if (!text || !text.trim()) {
      setError('Please enter some text to speak');
      setTimeout(() => setError(''), 3000);
      return;
    }

    if (!('speechSynthesis' in window)) {
      setError('Speech synthesis not supported in this browser');
      setTimeout(() => setError(''), 3000);
      return;
    }

    try {
      speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.7;
      utterance.pitch = 1;
      utterance.volume = 1;
      
      const voices = speechSynthesis.getVoices();
      
      // Prefer Indian English voices
      const indianVoices = voices.filter(voice => 
        voice.lang.includes('en-IN') || 
        voice.name.toLowerCase().includes('indian') ||
        voice.name.toLowerCase().includes('hindi') ||
        voice.name.includes('Ravi') ||
        voice.name.includes('Lekha') ||
        voice.name.includes('Aditi')
      );
      
      if (indianVoices.length > 0) {
        utterance.voice = indianVoices[0];
      } else {
        // Fallback to British or Australian English (closer accent)
        const closerVoices = voices.filter(voice => 
          voice.lang.includes('en-GB') || 
          voice.lang.includes('en-AU')
        );
        if (closerVoices.length > 0) {
          utterance.voice = closerVoices[0];
        }
      }
      
      utterance.onstart = () => {
        setSuccess('Speaking with Indian voice...');
      };
      
      utterance.onend = () => {
        setSuccess('Speech completed!');
        setTimeout(() => setSuccess(''), 2000);
      };
      
      utterance.onerror = (event) => {
        setError(`Speech error: ${event.error}`);
        setTimeout(() => setError(''), 3000);
      };
      
      speechSynthesis.speak(utterance);
    } catch (err) {
      setError('Error with speech synthesis');
      setTimeout(() => setError(''), 3000);
    }
  }, []);

  // Voice input toggle
  const toggleListening = useCallback(() => {
    if (!speechSupported) {
      setError('Speech recognition not supported in this browser');
      setTimeout(() => setError(''), 3000);
      return;
    }

    try {
      if (isListening) {
        recognitionRef.current?.stop();
        setIsListening(false);
      } else {
        recognitionRef.current?.start();
        setIsListening(true);
        setSuccess('Listening... Please speak now');
        setTimeout(() => setSuccess(''), 3000);
      }
    } catch (err) {
      setError('Error with speech recognition');
      setIsListening(false);
      setTimeout(() => setError(''), 3000);
    }
  }, [isListening, speechSupported]);

  // Component definitions
  const CalculatorButton = ({ onClick, children, className = "", span = false }) => (
    <button
      onClick={onClick}
      className={`h-12 rounded-lg font-semibold text-lg transition-all hover:scale-105 active:scale-95 shadow-md ${className} ${span ? 'col-span-2' : ''}`}
    >
      {children}
    </button>
  );

  const AnimatedSign = ({ word, isActive }) => {
    const getSignInfo = (word) => {
      const lowerWord = word.toLowerCase().replace(/[^\w]/g, '');
      const sign = signDatabase[lowerWord];
      
      if (sign) {
        return {
          emoji: sign.emoji,
          hasMatch: true,
          description: sign.description,
          steps: sign.steps,
          category: sign.category
        };
      }
      
      return { 
        emoji: '🤔',
        hasMatch: false,
        description: 'No sign found for this word',
        steps: [],
        category: 'unknown'
      };
    };
    
    const signInfo = getSignInfo(word);
    
    return (
      <div
        className={`inline-flex flex-col items-center mx-2 p-3 rounded-xl transition-all duration-500 ${
          isActive 
            ? 'scale-110 bg-indigo-100 shadow-lg transform-gpu' 
            : 'opacity-70 hover:opacity-100'
        }`}
      >
        <div 
          className={`text-3xl mb-2 transition-all duration-500 ${
            isActive ? 'animate-bounce' : ''
          }`}
        >
          {signInfo.emoji}
        </div>
        <div className={`text-sm font-medium ${
          isActive ? 'text-indigo-800' : 'text-gray-600'
        }`}>
          {word}
        </div>
        {signInfo.hasMatch && (
          <div className={`text-xs px-2 py-1 rounded-full mt-1 ${
            isActive ? 'bg-indigo-200 text-indigo-800' : 'bg-gray-200 text-gray-600'
          }`}>
            {categories[signInfo.category]}
          </div>
        )}
      </div>
    );
  };

  const CharacterAnimation = ({ char, revealed, delay }) => (
    <span
      className={`inline-block transition-all duration-300 ${
        revealed 
          ? 'text-indigo-800 font-bold transform scale-105' 
          : 'text-gray-300 transform scale-95'
      }`}
      style={{ 
        transitionDelay: `${delay}s`,
        fontFamily: 'monospace'
      }}
    >
      {char === ' ' ? '\u00A0' : char}
    </span>
  );

  const AnimatedHand = ({ isActive }) => (
    <div className={`text-8xl transition-all duration-1000 ${
      isActive 
        ? 'animate-pulse scale-110 filter drop-shadow-lg' 
        : 'scale-100 opacity-80'
    }`}>
      🤟
    </div>
  );

  const AlertMessage = ({ type, message, onClose }) => (
    <div className={`fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 flex items-center gap-2 ${
      type === 'error' 
        ? 'bg-red-100 text-red-800 border border-red-200' 
        : 'bg-green-100 text-green-800 border border-green-200'
    }`}>
      {type === 'error' ? <AlertCircle className="h-5 w-5" /> : <CheckCircle className="h-5 w-5" />}
      <span>{message}</span>
      <button onClick={onClose} className="ml-2 text-gray-500 hover:text-gray-700">
        <X className="h-4 w-4" />
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Alert Messages */}
      {error && (
        <AlertMessage 
          type="error" 
          message={error} 
          onClose={() => setError('')} 
        />
      )}
      {success && (
        <AlertMessage 
          type="success" 
          message={success} 
          onClose={() => setSuccess('')} 
        />
      )}

      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-900 via-indigo-800 to-purple-900 text-white py-16 mb-8">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Enhanced ASL Translator
          </h1>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto mb-8">
            Advanced Sign Language Translation with Character-by-Character Animation, 
            Indian Voice Support, and Interactive Learning Features
          </p>
          <div className="flex justify-center items-center space-x-6 text-4xl">
            {["🤟", "👋", "🙏", "❤️"].map((emoji, i) => (
              <div
                key={i}
                className="animate-bounce"
                style={{ animationDelay: `${i * 0.2}s` }}
              >
                {emoji}
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Header */}
      <div className="bg-white shadow-lg border-b-4 border-indigo-500 mb-8">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <div className="bg-indigo-100 p-3 rounded-full">
                <Hand className="h-8 w-8 text-indigo-600" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-gray-800">ASL Translator Pro</h2>
                <p className="text-gray-600">English to Sign Language with Indian Voice</p>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowCalculator(!showCalculator)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
                  showCalculator 
                    ? 'bg-indigo-600 text-white shadow-md' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                aria-label="Toggle calculator"
              >
                <Calculator className="h-5 w-5" />
                <span className="hidden sm:inline">Calculator</span>
              </button>
              <button
                onClick={() => setPlaybackSpeed(prev => prev === 2000 ? 1000 : (prev === 1000 ? 3000 : 2000))}
                className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-xl hover:bg-blue-200 transition-all"
                aria-label="Adjust playback speed"
              >
                <span className="text-sm font-medium">Speed: {playbackSpeed === 1000 ? 'Fast' : (playbackSpeed === 2000 ? 'Normal' : 'Slow')}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-4">
        {/* Character-by-character animation section */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8 border border-gray-100">
          <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            <Book className="mr-2" /> Character-by-Character Animation
          </h3>
          <div className="bg-gray-50 rounded-xl p-6 text-xl min-h-[100px]">
            {animatedChars.length > 0 ? (
              <div className="flex flex-wrap justify-center">
                {animatedChars.map((charObj, index) => (
                  <CharacterAnimation
                    key={index}
                    char={charObj.char}
                    revealed={charObj.revealed}
                    delay={charObj.delay}
                  />
                ))}
              </div>
            ) : (
              <span className="text-gray-400">Type something in the input below...</span>
            )}
          </div>
          
          {/* Word signs animation */}
          {translatedWords.length > 0 && (
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              {translatedWords.map((word, index) => (
                <AnimatedSign
                  key={index}
                  word={word.original}
                  isActive={index === currentWordIndex && isPlaying}
                />
              ))}
            </div>
          )}
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column - Input and Controls */}
          <div className="lg:col-span-5 space-y-8">
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
              <div className="flex items-center justify-between gap-3 mb-4">
                <div className="flex items-center">
                  <Book className="h-6 w-6 text-indigo-600 mr-2" />
                  <h3 className="text-xl font-semibold text-gray-800">Enter Text to Translate</h3>
                </div>
                
                {speechSupported && (
                  <button
                    onClick={toggleListening}
                    className={`p-3 rounded-full ${
                      isListening 
                        ? 'bg-red-600 text-white animate-pulse' 
                        : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                    }`}
                    aria-label={isListening ? "Stop listening" : "Start voice input"}
                  >
                    {isListening ? <MicOff size={20} /> : <Mic size={20} />}
                  </button>
                )}
              </div>
              
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Type your message here... (e.g., 'Hello namaste thank you')"
                className="w-full h-32 p-4 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:outline-none transition-colors resize-none text-lg"
                aria-label="Text to translate"
              />
              
              <div className="flex flex-wrap gap-3 mt-4">
                <button
                  onClick={playAnimation}
                  disabled={!translatedWords.length || isPlaying}
                  className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-xl hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium"
                  aria-label={isPlaying ? "Playing animation" : "Play signs"}
                >
                  {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                  {isPlaying ? 'Playing...' : 'Play Signs'}
                </button>
                
                <button
                  onClick={resetAnimation}
                  disabled={!translatedWords.length}
                  className="flex items-center gap-2 bg-gray-600 text-white px-6 py-3 rounded-xl hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium"
                  aria-label="Reset animation"
                >
                  <RotateCcw className="h-5 w-5" />
                  Reset
                </button>
                
                <button
                  onClick={() => speakText(inputText)}
                  disabled={!inputText.trim() || !voiceLoaded}
                  className="flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-xl hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium"
                  aria-label="Speak text with Indian voice"
                >
                  <Volume2 className="h-5 w-5" />
                  Speak (IN)
                </button>
              </div>
            </div>

            {/* Word Progress */}
            {translatedWords.length > 0 && (
              <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Translation Progress</h3>
                <div className="flex flex-wrap gap-2">
                  {translatedWords.map((word, index) => (
                    <div
                      key={index}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                        index === currentWordIndex
                          ? 'bg-indigo-600 text-white shadow-lg scale-105'
                          : word.hasSign
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {word.original}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Calculator */}
            {showCalculator && (
              <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100 animate__animated animate__fadeIn">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <Calculator className="mr-2 h-5 w-5" /> Calculator
                </h3>
                <div className="bg-gray-100 rounded-xl p-4 mb-4">
                  <div className="text-right text-2xl font-mono font-bold text-gray-800 min-h-[2rem] overflow-x-auto">
                    {calcDisplay}
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  <CalculatorButton onClick={clearCalculator} className="bg-red-500 text-white hover:bg-red-600">
                    C
                  </CalculatorButton>
                  <CalculatorButton onClick={() => setCalcDisplay(calcDisplay.slice(0, -1) || '0')} className="bg-gray-300 text-gray-800 hover:bg-gray-400">
                    <Delete className="h-5 w-5 mx-auto" />
                  </CalculatorButton>
                  <CalculatorButton onClick={() => inputOperation('/')} className="bg-orange-500 text-white hover:bg-orange-600">
                    <Divide className="h-5 w-5 mx-auto" />
                  </CalculatorButton>
                  <CalculatorButton onClick={() => inputOperation('*')} className="bg-orange-500 text-white hover:bg-orange-600">
                    <X className="h-5 w-5 mx-auto" />
                  </CalculatorButton>
                  
                  <CalculatorButton onClick={() => inputNumber(7)} className="bg-gray-200 text-gray-800 hover:bg-gray-300">7</CalculatorButton>
                  <CalculatorButton onClick={() => inputNumber(8)} className="bg-gray-200 text-gray-800 hover:bg-gray-300">8</CalculatorButton>
                  <CalculatorButton onClick={() => inputNumber(9)} className="bg-gray-200 text-gray-800 hover:bg-gray-300">9</CalculatorButton>
                  <CalculatorButton onClick={() => inputOperation('-')} className="bg-orange-500 text-white hover:bg-orange-600">
                    <Minus className="h-5 w-5 mx-auto" />
                  </CalculatorButton>
                  
                  <CalculatorButton onClick={() => inputNumber(4)} className="bg-gray-200 text-gray-800 hover:bg-gray-300">4</CalculatorButton>
                  <CalculatorButton onClick={() => inputNumber(5)} className="bg-gray-200 text-gray-800 hover:bg-gray-300">5</CalculatorButton>
                  <CalculatorButton onClick={() => inputNumber(6)} className="bg-gray-200 text-gray-800 hover:bg-gray-300">6</CalculatorButton>
                  <CalculatorButton onClick={() => inputOperation('+')} className="bg-orange-500 text-white hover:bg-orange-600">
                    <Plus className="h-5 w-5 mx-auto" />
                  </CalculatorButton>
                  
                  <CalculatorButton onClick={() => inputNumber(1)} className="bg-gray-200 text-gray-800 hover:bg-gray-300">1</CalculatorButton>
                  <CalculatorButton onClick={() => inputNumber(2)} className="bg-gray-200 text-gray-800 hover:bg-gray-300">2</CalculatorButton>
                  <CalculatorButton onClick={() => inputNumber(3)} className="bg-gray-200 text-gray-800 hover:bg-gray-300">3</CalculatorButton>
                  <CalculatorButton onClick={performCalculation} className="bg-green-500 text-white hover:bg-green-600 row-span-2">
                    <Equal className="h-6 w-6 mx-auto" />
                  </CalculatorButton>
                  
                  <CalculatorButton onClick={() => inputNumber(0)} span={true} className="bg-gray-200 text-gray-800 hover:bg-gray-300">0</CalculatorButton>
                  <CalculatorButton onClick={() => setCalcDisplay(calcDisplay + '.')} className="bg-gray-200 text-gray-800 hover:bg-gray-300">.</CalculatorButton>
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Animation Display */}
          <div className="lg:col-span-7 space-y-8">
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 text-center">
              <h3 className="text-xl font-semibold text-gray-800 mb-6">Sign Animation Display</h3>
              
              <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-8 mb-6">
                <AnimatedHand isActive={isPlaying} />
                
                {currentSign ? (
                  <div className="mt-6 space-y-4">
                    <div className="bg-white rounded-xl p-4 shadow-md">
                      <div className="flex items-center justify-center gap-2 mb-3">
                        <span className="text-lg font-semibold text-gray-800">
                          {translatedWords[currentWordIndex]?.original.toUpperCase()}
                        </span>
                        <ArrowRight className="h-5 w-5 text-indigo-600" />
                        <span className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm font-medium">
                          {categories[currentSign.category]}
                        </span>
                      </div>
                      <p className="text-gray-700 text-lg leading-relaxed">
                        {currentSign.description}
                      </p>
                    </div>
                    
                    <div className="bg-white rounded-xl p-4 shadow-md">
                      <h4 className="font-semibold text-gray-800 mb-3">Step-by-step Instructions:</h4>
                      <div className="space-y-2">
                        {currentSign.steps.map((step, index) => (
                          <div key={index} className="flex items-center gap-3 text-gray-700 p-2 bg-indigo-50 rounded-lg">
                            <span className="bg-indigo-100 text-indigo-800 w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                              {index + 1}
                            </span>
                            <span>{step}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : translatedWords.length > 0 ? (
                  <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                    <p className="text-yellow-800 font-medium">
                      Sign not available for "{translatedWords[currentWordIndex]?.original}"
                    </p>
                    <p className="text-yellow-600 text-sm mt-1">
                      Try finger spelling or use words from the library below
                    </p>
                  </div>
                ) : (
                  <div className="mt-6 text-gray-500">
                    <p>Enter text above to see sign language translation</p>
                    <p className="text-sm mt-2">Supports English words and Indian greetings like "namaste"</p>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Reference - Enhanced */}
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Available Signs Library</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 text-sm overflow-y-auto max-h-[400px] pr-2">
                {Object.entries(signDatabase).map(([word, data]) => (
                  <button
                    key={word}
                    onClick={() => setInputText(prev => prev ? `${prev} ${word}` : word)}
                    className={`text-left p-3 rounded-lg hover:bg-indigo-50 transition-colors capitalize text-gray-700 hover:text-indigo-800 border border-transparent hover:border-indigo-200 flex items-center ${
                      data.category === 'indian' ? 'bg-orange-50 border-orange-200' : ''
                    }`}
                  >
                    <span className="mr-2 text-xl">{data.emoji}</span>
                    <div>
                      <div className="font-medium">{word}</div>
                      <div className="text-xs text-gray-500">{categories[data.category]}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Instructions */}
        <div className="mt-8 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-6 border border-indigo-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">How to Use This Enhanced ASL Translator</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-700">
            <div className="flex gap-3">
              <span className="bg-indigo-100 text-indigo-800 w-6 h-6 rounded-full flex items-center justify-center font-bold flex-shrink-0">1</span>
              <span>Type in English or click words from the library (includes Indian greetings like "namaste")</span>
            </div>
            <div className="flex gap-3">
              <span className="bg-indigo-100 text-indigo-800 w-6 h-6 rounded-full flex items-center justify-center font-bold flex-shrink-0">2</span>
              <span>Click "Play Signs" to see animated sign language demonstrations</span>
            </div>
            <div className="flex gap-3">
              <span className="bg-indigo-100 text-indigo-800 w-6 h-6 rounded-full flex items-center justify-center font-bold flex-shrink-0">3</span>
              <span>Use "Speak (IN)" for Indian English pronunciation or the microphone for voice input</span>
            </div>
            <div className="flex gap-3">
              <span className="bg-indigo-100 text-indigo-800 w-6 h-6 rounded-full flex items-center justify-center font-bold flex-shrink-0">4</span>
              <span>Toggle calculator for number practice and adjust playback speed as needed</span>
            </div>
          </div>
        </div>

        {/* Footer note */}
        <div className="mt-6 text-center text-sm text-gray-500 pb-8">
          <p>Enhanced ASL Translator with Indian context • Developed for SignSetu</p>
          <p className="mt-1">Supports common English words, phrases, numbers, and Indian greetings</p>
        </div>
      </div>
    </div>
  );
};

export default TranslatorPage;