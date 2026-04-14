import React, { useState } from 'react';
import { validateUrl, recordSubmission } from '../utils/urlValidator';
import '../styles/global.css';

const UrlInput = ({ onUrlCheck, loading }) => {
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate URL
    const validation = validateUrl(url);
    
    if (!validation.isValid) {
      setError(validation.errors[0]);
      return;
    }
    
    // Record submission for rate limiting
    recordSubmission();
    
    // Clear any previous error
    setError('');
    
    // Proceed with URL check
    if (onUrlCheck) {
      onUrlCheck(url);
    }
  };

  return (
    <section className="url-input-section">
      <div className="container">
        <h2 className="section-title">Check a Website for Phishing</h2>
        <p className="section-subtitle">Enter any URL to analyze it for potential phishing threats</p>
        <form onSubmit={handleSubmit} className="url-form">
          <label htmlFor="url-input">Enter website URL:</label>
          <div className="input-group">
            <input
              type="text"
              id="url-input"
              value={url}
              onChange={(e) => {
                setUrl(e.target.value);
                // Clear error when user starts typing
                if (error) setError('');
              }}
              placeholder="https://example.com"
              className={`url-input ${error ? 'error' : ''}`}
              disabled={loading}
            />
            <button 
              type="submit" 
              className="check-button" 
              disabled={loading}
            >
              {loading ? 'CHECKING...' : 'CHECK PHISHING'}
            </button>
          </div>
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}
        </form>
      </div>
    </section>
  );
};

export default UrlInput;