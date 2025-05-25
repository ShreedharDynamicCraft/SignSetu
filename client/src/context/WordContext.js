import React, { createContext, useState, useCallback, useEffect } from 'react';
import axios from 'axios';

// Automatically detect if running on Vercel
const API_URL = process.env.REACT_APP_API_URL || (
  window.location.hostname.includes('vercel.app') 
    ? 'https://signsetu-api.vercel.app/api'
    : 'http://localhost:5000/api'
);

export const WordContext = createContext();

export const WordProvider = ({ children }) => {
  const [words, setWords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Use dynamic API URL based on environment
  const fetchWords = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/words`);
      setWords(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching words:', err);
      setError('Failed to fetch words. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, []);

  const searchWords = async (query) => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/words/${query}`);
      setWords(response.data);
      setError(null);
    } catch (err) {
      if (err.response && err.response.status === 404) {
        setWords([]);
      } else {
        setError('Error searching words. Please try again.');
        console.error('Error searching words:', err);
      }
    } finally {
      setLoading(false);
    }
  };

  const addWord = async (wordData) => {
    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/words`, wordData);
      setWords([...words, response.data]);
      return response.data;
    } catch (err) {
      setError('Error adding word. Please try again.');
      console.error('Error adding word:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteWord = async (id) => {
    setLoading(true);
    try {
      await axios.delete(`${API_URL}/words/${id}`);
      setWords(words.filter(word => word._id !== id));
    } catch (err) {
      setError('Error deleting word. Please try again.');
      console.error('Error deleting word:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateWord = async (id, wordData) => {
    setLoading(true);
    try {
      const response = await axios.put(`${API_URL}/words/${id}`, wordData);
      setWords(words.map(word => word._id === id ? response.data : word));
      return response.data;
    } catch (err) {
      setError('Error updating word. Please try again.');
      console.error('Error updating word:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getWordById = (id) => {
    return words.find(word => word._id === id);
  };

  useEffect(() => {
    fetchWords();
  }, [fetchWords]);

  return (
    <WordContext.Provider value={{
      words,
      loading,
      error,
      fetchWords,
      searchWords,
      addWord,
      deleteWord,
      updateWord,
      getWordById
    }}>
      {children}
    </WordContext.Provider>
  );
};
