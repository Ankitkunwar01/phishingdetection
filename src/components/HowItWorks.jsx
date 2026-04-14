import React from 'react';
import '../styles/global.css';

const HowItWorks = () => {
  const steps = [
    {
      step: 1,
      title: 'User enters URL',
      description: 'Enter any website URL in the input field'
    },
    {
      step: 2,
      title: 'Frontend sends it to backend',
      description: 'The URL is securely sent to our Django backend'
    },
    {
      step: 3,
      title: 'Django extracts features',
      description: 'Our backend analyzes URL characteristics'
    },
    {
      step: 4,
      title: 'ML model predicts phishing/safe',
      description: 'Machine learning model determines if URL is safe'
    },
    {
      step: 5,
      title: 'Result displayed on screen',
      description: 'Clear result shown with detailed analysis'
    }
  ];

  return (
    <section className="how-it-works-section" id="how-it-works">
      <div className="container">
        <h2 className="section-title">How It Works</h2>
        <p className="section-subtitle">Our advanced process ensures accurate and fast phishing detection</p>
        <div className="steps-container">
          {steps.map((stepData, index) => (
            <div className="step" key={index}>
              <div className="step-number">
                <span>{stepData.step}</span>
              </div>
              <div className="step-content">
                <h3>{stepData.title}</h3>
                <p>{stepData.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;