import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { WordProvider } from './context/WordContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <WordProvider>
        <App />
      </WordProvider>
    </BrowserRouter>
  </React.StrictMode>
);
