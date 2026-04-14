import React, { useState, useEffect } from 'react';
import '../styles/global.css';
import emage from '../assest/emage.webp';
import image from '../assest/image.webp';
import image1 from '../assest/image1.gif';

const HeroSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const slides = [
    { image: emage, alt: "Phishing Detection Illustration 1" },
    { image: image, alt: "Phishing Detection Illustration 2" },
    { image: image1, alt: "Phishing Detection Illustration 3" }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide(prevSlide => (prevSlide + 1) % slides.length);
    }, 3000); // Change slide every 3 seconds

    return () => clearInterval(interval);
  }, [slides.length]);

  const handleIndicatorClick = (index) => {
    setCurrentSlide(index);
  };

  return (
    <section className="hero-section" id="home">
      <div className="hero-content">
        <div className="hero-text">
          <h1>Detect Phishing Scams Instantly & Smartly</h1>
          <p>Protect yourself from online fraud with our advanced machine learning technology</p>
          {/* <button className="cta-button">Get Started</button> */}
        </div>
        <div className="hero-image">
          <img 
            src={slides[currentSlide].image} 
            alt={slides[currentSlide].alt} 
          />
          <div className="slideshow-indicators">
            {slides.map((_, index) => (
              <span 
                key={index}
                className={`indicator ${index === currentSlide ? 'active' : ''}`}
                onClick={() => handleIndicatorClick(index)}
              ></span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;