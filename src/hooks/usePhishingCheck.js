import { useState } from 'react';
import { checkPhishing } from '../services/api';

// Custom hook for phishing check functionality
const usePhishingCheck = () => {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const checkUrl = async (url) => {
    if (!url) {
      setError('Please enter a valid URL');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Call the actual API
      const data = await checkPhishing(url);
      setResult(data);
    } catch (err) {
      setError(err.message || 'An error occurred while checking the URL');
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setResult(null);
    setLoading(false);
    setError(null);
  };

  return {
    result,
    loading,
    error,
    checkUrl,
    reset,
  };
};

export default usePhishingCheck;