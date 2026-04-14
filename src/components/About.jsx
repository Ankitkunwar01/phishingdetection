import React from 'react';
import '../styles/global.css';

const About = () => {
  return (
    <section className="about-section" id="about">
      <div className="container">
        <h2 className="section-title">About This Project</h2>
        <p className="section-subtitle">Learn more about our mission and the technology behind PhishGuard</p>
        <div className="about-content">
          <p>
            PhishGuard is a machine learning-powered phishing detection tool designed to protect users from online fraud 
            and malicious websites. Our system analyzes URL characteristics and website features to determine if a site 
            is legitimate or potentially harmful.
          </p>
          
          <div className="tech-stack">
            <h3>Technologies Used</h3>
            <ul>
              <li><strong>Frontend:</strong> React.js with Vite</li>
              <li><strong>Backend:</strong> Django REST Framework</li>
              <li><strong>Machine Learning:</strong> Python with Scikit-learn</li>
              <li><strong>Dataset:</strong> PhishTank and custom collected URLs</li>
            </ul>
          </div>
          
          <div className="project-info">
            <h3>Project Information</h3>
            <p>
              This is a BCA 6th Semester Project developed by Ankit Kunwar. The project demonstrates the application 
              of machine learning techniques in cybersecurity, specifically for detecting phishing websites.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;