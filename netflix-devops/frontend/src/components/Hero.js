import React, { useEffect, useState } from 'react';

export const Hero = ({ videos }) => {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const fullText = 'Your Next Favorite Movie Awaits';
  
  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      if (index < fullText.length) {
        setDisplayText(fullText.substring(0, index + 1));
        index++;
      } else {
        clearInterval(interval);
      }
    }, 40);
    
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (videos.length > 0) {
      const timer = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % videos.length);
      }, 8000);
      return () => clearInterval(timer);
    }
  }, [videos.length]);

  const featuredVideo = videos[currentIndex] || videos[0];

  return (
    <section className="hero" id="home" style={{
      backgroundImage: `linear-gradient(90deg, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0.8) 100%), url(${featuredVideo?.thumbnail})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    }}>
      <div className="hero-overlay" />
      <div className="hero-content">
        <div className="hero-top">
          <span className="hero-badge">N SERIES</span>
        </div>
        
        <h1 className="hero-title">{displayText}<span className="cursor">_</span></h1>
        
        {featuredVideo && (
          <p className="hero-subtitle">
            {featuredVideo.description}
          </p>
        )}
        
        <div className="hero-stats">
          <div className="stat-item">
            <span className="stat-number">2024</span>
            <span className="stat-label">Year</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">TV-MA</span>
            <span className="stat-label">Rating</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">4K</span>
            <span className="stat-label">Ultra HD</span>
          </div>
        </div>

        <div className="hero-actions">
          <button 
            className="btn-primary"
            onClick={() => window.scrollTo({ top: 500, behavior: 'smooth' })}
            title="Start watching now"
          >
            ▶️ Play
          </button>
          <button 
            className="btn-secondary"
            onClick={() => alert('More Info\n\n' + (featuredVideo?.description || 'Watch the latest blockbuster movies and TV shows.'))}
            title="Learn more"
          >
            ℹ️ More Info
          </button>
        </div>
      </div>
      
      <div className="hero-indicators">
        {videos.slice(0, 5).map((_, idx) => (
          <button
            key={idx}
            className={`indicator ${idx === currentIndex ? 'active' : ''}`}
            onClick={() => setCurrentIndex(idx)}
            title={`Go to video ${idx + 1}`}
          />
        ))}
      </div>
    </section>
  );
};

export default Hero;
