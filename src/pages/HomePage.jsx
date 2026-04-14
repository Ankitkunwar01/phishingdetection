import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import HeroSection from '../components/HeroSection';
import UrlInput from '../components/UrlInput';
import ResultBox from '../components/ResultBox';
import Features from '../components/Features';
import HowItWorks from '../components/HowItWorks';
import About from '../components/About';
import Footer from '../components/Footer';
import usePhishingCheck from '../hooks/usePhishingCheck';
import { getRecentComments, getRecentPhishingUrls } from '../services/api';
import AlertsCarousel from '../components/AlertsCarousel';
import '../styles/global.css';

const HomePage = () => {
  const { result, loading, error, checkUrl, reset } = usePhishingCheck();
  const [checkingUrl, setCheckingUrl] = useState('');
  const [recentComments, setRecentComments] = useState([]);
  const [recentPhishing, setRecentPhishing] = useState([]);

  useEffect(() => {
    fetchFeeds();
  }, []);

  const fetchFeeds = async () => {
    try {
      const commentsData = await getRecentComments();
      const phishingData = await getRecentPhishingUrls();
      
      const comments = commentsData.comments || [];
      const phishing = phishingData.phishing_urls || [];
      
      // Merge risk data into comments
      const enrichedComments = comments.map(comment => {
        const matchingAlert = phishing.find(p => p.url === comment.url);
        return {
          ...comment,
          riskScore: matchingAlert ? matchingAlert.riskScore : (comment.riskScore || 0),
          isPhishing: matchingAlert ? matchingAlert.isPhishing : (comment.isPhishing || false)
        };
      });
      
      setRecentComments(enrichedComments);
      setRecentPhishing(phishing);
    } catch (err) {
      console.error('Failed to fetch feeds', err);
    }
  };

  const handleUrlCheck = (url) => {
    setCheckingUrl(url);
    checkUrl(url);
  };

  return (
    <div className="home-page">
      <Navbar />
      <main>
        <HeroSection />
        <UrlInput onUrlCheck={handleUrlCheck} loading={loading} />
        {error && (
          <section className="result-section">
            <div className="container">
              <div className="error-box">
                <p>Error: {error}</p>
              </div>
            </div>
          </section>
        )}
        <ResultBox result={result} loading={loading} url={checkingUrl} />

        <AlertsCarousel alerts={recentComments} />

        {/* <Features /> */}
        {/* <HowItWorks /> */}
        {/* <About /> */}
      </main>
      <Footer />
    </div>
  );
};

export default HomePage;