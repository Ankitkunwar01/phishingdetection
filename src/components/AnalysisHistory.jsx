import React, { useState, useEffect } from 'react';
import { getUrlAnalyses } from '../services/api';

// Import Swiper JS
import Swiper from 'swiper';
import { Autoplay, Pagination, Scrollbar, A11y } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';

const AnalysisHistory = () => {
  const [analyses, setAnalyses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchAnalyses = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getUrlAnalyses();
      setAnalyses(data.analyses || []);
    } catch (err) {
      setError(err.message || 'Failed to fetch analysis history');
      console.error('Error fetching analyses:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalyses();
  }, []);

  // Initialize Swiper when analyses change
  useEffect(() => {
    if (analyses.length > 0) {
      // Destroy existing swiper instance if it exists
      if (window.mySwiper) {
        window.mySwiper.destroy(true, true);
      }
      
      // Initialize new swiper
      const swiper = new Swiper('.swiper', {
        modules: [Autoplay, Pagination, Scrollbar, A11y],
        spaceBetween: 20,
        slidesPerView: 1,
        autoplay: {
          delay: 3000,
          disableOnInteraction: false,
        },
        pagination: {
          el: '.swiper-pagination',
          clickable: true,
        },
        scrollbar: {
          el: '.swiper-scrollbar',
          draggable: true,
        },
        loop: true,
        grabCursor: true,
        breakpoints: {
          // when window width >= 768px
          768: {
            slidesPerView: 2,
          },
          // when window width >= 1024px
          1024: {
            slidesPerView: 3,
          },
        },
      });
      
      // Store swiper instance
      window.mySwiper = swiper;
      
      // Cleanup function
      return () => {
        if (window.mySwiper) {
          window.mySwiper.destroy(true, true);
        }
      };
    }
  }, [analyses]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const getRiskLevel = (score) => {
    if (score >= 70) return 'High Risk';
    if (score >= 40) return 'Medium Risk';
    return 'Low Risk';
  };

  const getRiskClass = (score) => {
    if (score >= 70) return 'high-risk';
    if (score >= 40) return 'medium-risk';
    return 'low-risk';
  };

  if (loading && analyses.length === 0) {
    return (
      <section className="analysis-history">
        <div className="container">
          <div className="section-header">
            <h2>Analysis History</h2>
            <button onClick={fetchAnalyses} disabled={loading} className="refresh-btn">
              {loading ? 'Refreshing...' : 'Refresh'}
            </button>
          </div>
          <div className="loading-message">
            <p>Loading analysis history...</p>
          </div>
        </div>
      </section>
    );
  }

  if (!loading && analyses.length === 0 && !error) {
    return (
      <section className="analysis-history">
        <div className="container">
          <div className="section-header">
            <h2>Analysis History</h2>
            <button onClick={fetchAnalyses} disabled={loading} className="refresh-btn">
              {loading ? 'Refreshing...' : 'Refresh'}
            </button>
          </div>
          <div className="empty-message">
            <p>No analysis history found.</p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="analysis-history">
        <div className="container">
          <div className="section-header">
            <h2>Analysis History</h2>
            <button onClick={fetchAnalyses} disabled={loading} className="refresh-btn">
              {loading ? 'Refreshing...' : 'Refresh'}
            </button>
          </div>
          <div className="error-message">
            <p>Error: {error}</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="analysis-history">
      <div className="container-full"> {/* Changed to full width container */}
        <div className="section-header">
          <h2>Analysis History</h2>
          <button onClick={fetchAnalyses} disabled={loading} className="refresh-btn">
            {loading ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>
        
        {analyses.length > 0 && (
          <div className="history-swiper-container">
            {/* Slider main container */}
            <div className="swiper">
              {/* Additional required wrapper */}
              <div className="swiper-wrapper">
                {/* Slides */}
                {analyses.map((analysis) => (
                  <div key={analysis.id} className="swiper-slide">
                    <div className="analysis-item">
                      <div className="analysis-header">
                        <div className="url-info">
                          <span className={`risk-indicator ${getRiskClass(analysis.riskScore)}`}>
                            {analysis.isPhishing ? 'PHISHING' : 'SAFE'}
                          </span>
                          {analysis.cached && (
                            <span className="cached-badge">Cached</span>
                          )}
                          <h3>{analysis.url}</h3>
                        </div>
                        <div className="analysis-meta">
                          <span className="risk-score">Risk Score: {analysis.riskScore.toFixed(2)}%</span>
                          <span className="risk-level">{getRiskLevel(analysis.riskScore)}</span>
                          <span className="timestamp">{formatDate(analysis.analyzedAt)}</span>
                        </div>
                      </div>
                      <div className="analysis-details">
                        <h4>Key Features:</h4>
                        <ul>
                          {Object.entries(analysis.features)
                            .slice(0, 5)
                            .map(([key, value]) => (
                              <li key={key}>
                                <strong>{key}:</strong> {String(value)}
                              </li>
                            ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {/* If we need pagination */}
              {/* <div className="swiper-pagination"></div> */}

              {/* If we need scrollbar */}
              {/* <div className="swiper-scrollbar"></div> */}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default AnalysisHistory;