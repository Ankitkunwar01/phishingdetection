import React from 'react';
import '../styles/AlertsCarousel.css';

const AlertsCarousel = ({ alerts }) => {
  if (!alerts || alerts.length === 0) {
    return (
      <div className="alerts-carousel-container">
        <div className="section-header">
          <h2>Community Feed</h2>
          <p>Recent discussion on potential phishing threats</p>
        </div>
        <div style={{ textAlign: 'center', color: '#6b7280', padding: '40px' }}>
          No recent alerts with community discussion.
        </div>
      </div>
    );
  }

  // Double the alerts for seamless looping
  const displayAlerts = [...alerts, ...alerts];

  const getRiskDetails = (score = 0) => {
    if (score >= 70) return { label: 'Phishing', class: 'high', cardClass: 'risk-high' };
    if (score >= 40) return { label: 'Suspicious', class: 'medium', cardClass: 'risk-medium' };
    return { label: 'Safe', class: 'low', cardClass: 'risk-low' };
  };

  return (
    <div className="alerts-carousel-container">
      <div className="container">
        <div className="section-header">
          <h2>Community Discussion</h2>
          <p>Real-time alerts and user reports from around the web</p>
        </div>
      </div>
      
      <div className="alerts-carousel-track-wrapper">
        <div className="alerts-carousel-track">
          {displayAlerts.map((alert, index) => {
            const risk = getRiskDetails(alert.riskScore || 0);
            return (
              <div className={`alert-card ${risk.cardClass}`} key={`${alert.id}-${index}`}>
                <div className="card-header">
                  <span className={`risk-badge ${risk.class}`}>
                    {risk.label}
                  </span>
                  <div className="risk-score-display">
                    {typeof alert.riskScore === 'number' ? `${alert.riskScore.toFixed(0)}%` : 'N/A'}
                  </div>
                </div>
                
                <div className="url" title={alert.url}>
                  {alert.url}
                </div>
                
                <div className="comment">
                  "{alert.text}"
                </div>
                
                <div className="meta">
                  <span className="user">@{alert.user}</span>
                  <span className="date">
                    {alert.createdAt ? new Date(alert.createdAt).toLocaleDateString() : 'Recent'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AlertsCarousel;
