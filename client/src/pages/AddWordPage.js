import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import WordForm from '../components/WordForm';
import LoadingSpinner from '../components/LoadingSpinner';
import { WordContext } from '../context/WordContext';

const AddWordPage = () => {
  const { addWord, loading } = useContext(WordContext);
  const [submissionError, setSubmissionError] = useState('');
  const [submissionSuccess, setSubmissionSuccess] = useState(false);
  const navigate = useNavigate();

  const handleAddWord = async (wordData) => {
    try {
      setSubmissionError('');
      await addWord(wordData);
      setSubmissionSuccess(true);
      
      // Navigate back to home page after successful submission with a short delay
      setTimeout(() => {
        navigate('/');
      }, 1500);
      
    } catch (error) {
      setSubmissionError(error.response?.data?.message || 'Error adding word. Please try again.');
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <motion.h1 
        className="text-3xl font-bold text-center mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Add New Word
      </motion.h1>
      
      {loading && <LoadingSpinner />}
      
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
          Word added successfully! Redirecting to home page...
        </motion.div>
      )}
      
      {!loading && !submissionSuccess && (
        <WordForm 
          onSubmit={handleAddWord} 
          buttonText="Add Word" 
        />
      )}
    </div>
  );
};

export default AddWordPage;
