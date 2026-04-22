import React, { useState } from 'react';
import VideoPlayer from './VideoPlayer';

export const VideoGrid = ({ videos }) => {
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const handleWatchClick = (video) => {
    setSelectedVideo(video);
  };

  const handleClosePlayer = () => {
    setSelectedVideo(null);
  };

  const handleMouseMove = (e, card) => {
    if (!card) return;
    
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = (y - centerY) / 10;
    const rotateY = (centerX - x) / 10;
    
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(20px) scale(1.02)`;
  };

  const handleMouseLeave = (card) => {
    if (card) {
      card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateZ(0) scale(1)';
    }
  };

  return (
    <>
      <section className="video-grid-section">
        <div className="section-header">
          <div>
            <span className="eyebrow">Next Generation Streaming</span>
            <h3>Featured Blockbusters {videos && videos.length > 0 && `(${videos.length})`}</h3>
          </div>
          <p className="section-copy">
            Experience cinema redefined with 3D interactions, immersive visuals, and the latest blockbuster films from 2026. 
            Exclusively curated for premium subscribers.
          </p>
        </div>

        <div className="video-grid">
          {videos && videos.length > 0 ? (
            videos.map((video) => (
              <article 
                key={video._id || video.id} 
                className="video-card"
                onMouseMove={(e) => handleMouseMove(e, e.currentTarget)}
                onMouseLeave={(e) => handleMouseLeave(e.currentTarget)}
                onClick={() => handleWatchClick(video)}
                role="button"
                tabIndex={0}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    handleWatchClick(video);
                  }
                }}
              >
                <div className="video-card-media">
                  <img
                    src={video.thumbnail || 'https://via.placeholder.com/400x225/111111/ffffff?text=No+Thumbnail'}
                    alt={video.title}
                    className="video-card-img"
                    loading="lazy"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://via.placeholder.com/400x225/111111/ffffff?text=No+Thumbnail';
                    }}
                  />
                  <button 
                    className="btn-watch-card" 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleWatchClick(video);
                    }}
                    aria-label={`Watch ${video.title}`}
                  >
                    ▶ Watch Now
                  </button>
                </div>
                <div className="video-card-body">
                  <h4>{video.title}</h4>
                  <p>{video.description || 'No description available'}</p>
                  <div className="video-card-meta">
                    <span title={`Rating: ${video.rating}/10`}>⭐ {video.rating || 'N/A'}/10</span>
                    <span title={`Genre: ${video.genre}`}>{video.genre || 'Unknown'}</span>
                  </div>
                </div>
              </article>
            ))
          ) : (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '80px 20px', color: '#999' }}>
              <p style={{ fontSize: '1.2rem', marginBottom: '10px' }}>📺 No videos available at the moment</p>
              <p style={{ fontSize: '0.9rem', color: '#666' }}>Please check back later or try refreshing the page</p>
            </div>
          )}
        </div>
      </section>

      {selectedVideo && (
        <VideoPlayer video={selectedVideo} onClose={handleClosePlayer} />
      )}
    </>
  );
};

export default VideoGrid;
