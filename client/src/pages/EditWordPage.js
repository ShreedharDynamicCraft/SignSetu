import React, { useContext, useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import WordForm from '../components/WordForm';
import LoadingSpinner from '../components/LoadingSpinner';
import { WordContext } from '../context/WordContext';

const EditWordPage = () => {
  const { id } = useParams();
  const { getWordById, updateWord, loading } = useContext(WordContext);
  const [word, setWord] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const [submissionError, setSubmissionError] = useState('');
  const [submissionSuccess, setSubmissionSuccess] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchedWord = getWordById(id);
    if (fetchedWord) {
      setWord(fetchedWord);
    } else {
      setNotFound(true);
    }
  }, [id, getWordById]);

  const handleUpdateWord = async (wordData) => {
    try {
      setSubmissionError('');
      await updateWord(id, wordData);
      setSubmissionSuccess(true);
      
      // Navigate back to home page after successful update with a short delay
      setTimeout(() => {
        navigate('/');
      }, 1500);
      
    } catch (error) {
      setSubmissionError(error.response?.data?.message || 'Error updating word. Please try again.');
    }
  };

  if (notFound) {
    return (
      <div className="max-w-2xl mx-auto text-center py-10">
        <h1 className="text-3xl font-bold mb-4">Word Not Found</h1>
        <p className="text-gray-600 mb-4">
          The word you are trying to edit could not be found.
        </p>
        <button 
          onClick={() => navigate('/')}
          className="bg-primary text-white px-4 py-2 rounded hover:bg-secondary transition-colors"
        >
          Back to Home
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <motion.h1 
        className="text-3xl font-bold text-center mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Edit Word
      </motion.h1>
      
      {(loading || !word) && <LoadingSpinner />}
      
      {submissionError && (
        <motion.div 
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {submissionError}
        </motion.div>
      )}
      
      {submissionSuccess && (
        <motion.div 
          className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          Word updated successfully! Redirecting to home page...
        </motion.div>
      )}
      
      {word && !loading && !submissionSuccess && (
        <WordForm 
          initialData={word}
          onSubmit={handleUpdateWord} 
          buttonText="Update Word" 
        />
      )}
    </div>
  );
};

export default EditWordPage;
