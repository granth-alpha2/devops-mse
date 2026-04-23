import React, { useState } from 'react';

export const FlipCard = ({ video, onWatchClick }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleCardClick = () => {
    setIsFlipped(!isFlipped);
  };

  const handleWatchClick = (e) => {
    e.stopPropagation();
    onWatchClick(video);
  };

  return (
    <div
      className="flip-card-container"
      onClick={handleCardClick}
      role="button"
      tabIndex={0}
      onKeyPress={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          handleCardClick();
        }
      }}
    >
      <div className={`flip-card ${isFlipped ? 'flipped' : ''}`}>
        {/* Front Side */}
        <div className="flip-card-front">
          <div className="card-image-wrapper">
            <img
              src={video.thumbnail || 'https://via.placeholder.com/320x450/111111/ffffff?text=No+Thumbnail'}
              alt={video.title}
              loading="lazy"
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/320x450/111111/ffffff?text=No+Thumbnail';
              }}
              className="card-image"
            />
            <div className="card-overlay">
              <div className="flip-hint">Click to Flip</div>
            </div>
          </div>
        </div>

        {/* Back Side */}
        <div className="flip-card-back">
          <div className="card-details">
            <h3 className="card-title">{video.title}</h3>
            
            <div className="card-meta-info">
              <div className="meta-row">
                <span className="meta-label">Rating:</span>
                <span className="meta-value">⭐ {video.rating || 'N/A'}</span>
              </div>
              
              <div className="meta-row">
                <span className="meta-label">Genre:</span>
                <span className="meta-value">{video.genre?.split(',')[0] || 'Unknown'}</span>
              </div>

              <div className="meta-row">
                <span className="meta-label">Year:</span>
                <span className="meta-value">{video.year || '2024'}</span>
              </div>

              <div className="meta-row">
                <span className="meta-label">Duration:</span>
                <span className="meta-value">{video.duration || '120 min'}</span>
              </div>
            </div>

            <p className="card-description">
              {video.description || 'An amazing movie waiting to be discovered. Click watch to enjoy!'}
            </p>

            <button
              className="watch-button"
              onClick={handleWatchClick}
              aria-label={`Watch ${video.title}`}
            >
              ▶ WATCH NOW
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlipCard;
