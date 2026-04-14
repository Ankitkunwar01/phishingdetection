import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { addComment } from '../services/api';

const ResultBox = ({ result, loading, url }) => {
  const { isAuthenticated } = useContext(AuthContext);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [commentError, setCommentError] = useState('');
  const [commentSuccess, setCommentSuccess] = useState('');

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;

    setSubmitting(true);
    setCommentError('');
    setCommentSuccess('');

    try {
      await addComment(url, comment);
      setCommentSuccess('Comment added successfully!');
      setComment('');
    } catch (err) {
      setCommentError(err.message || 'Failed to add comment');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <section className="result-section">
        <div className="container">
          <div className="result-box loading">
            <div className="spinner"></div>
            <p>Analyzing URL for phishing indicators...</p>
          </div>
        </div>
      </section>
    );
  }

  if (!result) {
    return null;
  }

  const getRiskClass = (score) => {
    if (score >= 70) return 'high-risk';
    if (score >= 40) return 'medium-risk';
    return 'low-risk';
  };

  return (
    <section className="result-section">
      <div className="container">
        <div className={`result-box ${result.isPhishing ? 'phishing' : 'safe'} ${result.cached ? 'cached' : ''}`}>
          <div className="result-header">
            <h2>Analysis Result</h2>
            {result.cached && (
              <span className="cached-badge">Cached Result</span>
            )}
          </div>
          
          <div className="risk-indicator">
            <span className={`risk-badge ${getRiskClass(result.riskScore)}`}>
              {result.isPhishing ? 'PHISHING DETECTED' : 'SAFE'}
            </span>
            <div className="risk-score">
              Risk Score: <strong>{result.riskScore.toFixed(2)}%</strong>
            </div>
          </div>
          
          <div className="result-details">
            <p className="reason">{result.reason}</p>
            
            {result.features && result.features.length > 0 && (
              <div className="features-list">
                <h3>Key Features Analyzed:</h3>
                <ul>
                  {result.features.slice(0, 5).map((feature, index) => (
                    <li key={index}>{feature}</li>
                  ))}
                </ul>
              </div>
            )}
            
            {result.additionalInfo && (
              <div className="additional-info">
                <h3>Additional Information:</h3>
                <p>IP Address: {result.additionalInfo.ipAddress}</p>
                <p>Domain Age: {result.additionalInfo.domainAgeDays > 0 ? `${result.additionalInfo.domainAgeDays} days` : 'Unknown'}</p>
              </div>
            )}

            {isAuthenticated && (
              <div className="comment-section" style={{ marginTop: '25px', padding: '15px', borderTop: '1px solid #eee' }}>
                <h3 style={{ fontSize: '18px', marginBottom: '10px' }}>Leave a Comment</h3>
                <form onSubmit={handleCommentSubmit}>
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Share your thoughts about this URL..."
                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd', minHeight: '80px', marginBottom: '10px' }}
                    required
                  />
                  <button 
                    type="submit" 
                    disabled={submitting}
                    className="btn btn-primary"
                    style={{ padding: '8px 20px', fontSize: '14px' }}
                  >
                    {submitting ? 'Submitting...' : 'Post Comment'}
                  </button>
                </form>
                {commentError && <p style={{ color: '#ef4444', marginTop: '10px', fontSize: '14px' }}>{commentError}</p>}
                {commentSuccess && <p style={{ color: '#22c55e', marginTop: '10px', fontSize: '14px' }}>{commentSuccess}</p>}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ResultBox;