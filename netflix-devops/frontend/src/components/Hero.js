import React, { useEffect, useState } from 'react';

export const Hero = () => {
  const [displayText, setDisplayText] = useState('');
  const fullText = 'Experience cinema reimagined for 2026';
  
  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      if (index < fullText.length) {
        setDisplayText(fullText.substring(0, index + 1));
        index++;
      } else {
        clearInterval(interval);
      }
    }, 50);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="hero" id="home">
      <div className="hero-overlay" />
      <div className="hero-content">
        <span className="eyebrow">⚡ Welcome to the Future of Streaming</span>
        <h2>{displayText}<span style={{ animation: 'blink 1s infinite' }}>_</span></h2>
        <p>
          Immerse yourself in a stunning next-generation platform featuring 12+ premium titles, 
          3D interactive UI, real movie trailers, and a fully responsive design optimized for every device. 
          Powered by scalable DevOps infrastructure.
        </p>
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginTop: '32px' }}>
          <button 
            className="btn-primary" 
            onClick={() => window.scrollTo({ top: 550, behavior: 'smooth' })}
            title="Browse all available titles"
          >
            🎬 Explore Titles
          </button>
          <button 
            className="btn-secondary" 
            onClick={() => alert('Netflix DevOps Demo 2026\n\nFeatures:\n✓ 12 Premium Movies\n✓ 3D Interactions\n✓ Real Trailers\n✓ Responsive Design\n✓ Cloud-Native Architecture')}
            title="Learn more about this platform"
          >
            📚 Learn More
          </button>
        </div>
      </div>
      
      <style>{`
        @keyframes blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }
      `}</style>
    </section>
  );
};

export default Hero;
