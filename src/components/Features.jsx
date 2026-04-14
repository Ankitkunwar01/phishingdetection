import React from 'react';
import '../styles/global.css';

const Features = () => {
  const featuresList = [
    {
      icon: '⚡',
      title: 'Fast ML-based Detection',
      description: 'Our machine learning model analyzes URLs in milliseconds'
    },
    {
      icon: '⏱️',
      title: 'Real-Time URL Analysis',
      description: 'Instant analysis as soon as you enter a URL'
    },
    {
      icon: '🎯',
      title: 'High Accuracy',
      description: '99%+ accuracy rate based on extensive testing'
    },
    {
      icon: '✨',
      title: 'Simple & Clean UI',
      description: 'Easy to use interface designed for everyone'
    }
  ];

  return (
    <section className="features-section" id="features">
      <div className="container">
        <h2 className="section-title">Why Choose Our Phishing Detector?</h2>
        <p className="section-subtitle">Our advanced technology and user-friendly design make phishing detection effortless and reliable</p>
        <div className="features-grid">
          {featuresList.map((feature, index) => (
            <div className="feature-card" key={index}>
              <span className="feature-icon">{feature.icon}</span>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;