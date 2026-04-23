import React, { useState } from 'react';

export const MovieCard = ({ video, onWatchClick, featured = false, isShrunk = false }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  const handleCardClick = (e) => {
    e.preventDefault();
    if (!isShrunk) setIsFlipped(!isFlipped);
  };

  const handleWatchClick = (e) => {
    e.stopPropagation();
    onWatchClick(video);
  };

  const handleImageError = () => {
    console.warn(`Failed to load image for: ${video.title}`);
    setImageError(true);
    setImageLoading(false);
  };

  const handleImageLoad = () => {
    setImageLoading(false);
    setImageError(false);
  };

  // Fallback color based on title
  const colors = ['#FF1744', '#F50057', '#D500F9', '#651FFF', '#2979F0', '#00B0FF', '#00E5FF', '#1DE9B6', '#00E676', '#76FF03'];
  const colorIndex = (video.title?.charCodeAt(0) || 0) % colors.length;
  const fallbackColor = colors[colorIndex];

  if (featured) {
    return (
      <div className="featured-card-container" onClick={handleWatchClick}>
        <div className="featured-card-image-wrapper">
          {!imageError ? (
            <>
              {imageLoading && (
                <div style={{
                  position: 'absolute',
                  width: '100%',
                  height: '100%',
                  background: `linear-gradient(90deg, ${fallbackColor}40, ${fallbackColor}20)`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  zIndex: 1,
                }}>
                  <span style={{ fontSize: '2rem', opacity: 0.6 }}>⏳</span>
                </div>
              )}
              <img
                src={video.thumbnail}
                alt={video.title}
                className="featured-card-image"
                onError={handleImageError}
                onLoad={handleImageLoad}
                style={{ display: imageError ? 'none' : 'block' }}
              />
            </>
          ) : (
            <div style={{
              width: '100%',
              height: '100%',
              background: `linear-gradient(135deg, ${fallbackColor}, ${fallbackColor}99)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'column',
              gap: '12px',
            }}>
              <span style={{ fontSize: '4rem' }}>🎬</span>
              <span style={{ fontSize: '0.9rem', opacity: 0.8, color: '#fff' }}>
                {video.title}
              </span>
            </div>
          )}
        </div>
        <div className="featured-card-gradient"></div>
        <div className="featured-card-content">
          <h2 className="featured-card-title">{video.title}</h2>
          <div className="featured-card-meta">
            <span className="featured-rating">⭐ {video.rating || 'N/A'}</span>
            <span className="featured-genre">{video.genre?.split(',')[0]}</span>
            <span className="featured-year">{video.year || '2024'}</span>
          </div>
          <p className="featured-card-description">{video.description}</p>
          <div className="featured-card-buttons">
            <button className="featured-btn-primary" onClick={handleWatchClick}>
              ▶ WATCH NOW
            </button>
            <button className="featured-btn-secondary" onClick={(e) => { e.stopPropagation(); setIsFlipped(true); }}>
              ℹ MORE INFO
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="movie-card-container"
      onClick={handleCardClick}
      role="button"
      tabIndex={0}
      aria-label={`${video.title}`}
    >
      <div className={`movie-card-inner ${isFlipped ? 'flipped' : ''}`}>
        {/* Front Side - Image */}
        <div className="movie-card-front">
          {!imageError ? (
            <>
              {imageLoading && (
                <div style={{
                  position: 'absolute',
                  width: '100%',
                  height: '100%',
                  background: `linear-gradient(90deg, ${fallbackColor}40, ${fallbackColor}20)`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  zIndex: 2,
                  borderRadius: '8px',
                }}>
                  <span style={{ fontSize: '1.5rem', opacity: 0.7 }}>⏳</span>
                </div>
              )}
              <img
                src={video.thumbnail}
                alt={video.title}
                className="movie-card-image"
                onError={handleImageError}
                onLoad={handleImageLoad}
                style={{ display: imageError ? 'none' : 'block' }}
              />
              <div className="movie-card-overlay">
                <div className="overlay-top">
                  <div className="movie-rating">{video.rating || 'N/A'}⭐</div>
                </div>
                <div className="overlay-bottom">
                  <h4 className="movie-card-title">{video.title}</h4>
                  <div className="movie-card-actions">
                    <button
                      className="movie-card-btn play-btn"
                      onClick={handleWatchClick}
                      title="Watch now"
                    >
                      ▶
                    </button>
                    <button
                      className="movie-card-btn info-btn"
                      onClick={handleCardClick}
                      title="Details"
                    >
                      ℹ
                    </button>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div style={{
              width: '100%',
              height: '100%',
              background: `linear-gradient(135deg, ${fallbackColor}, ${fallbackColor}99)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'column',
              gap: '8px',
              borderRadius: '8px',
              padding: '12px',
              textAlign: 'center',
            }}>
              <div style={{ fontSize: '2.5rem' }}>🎬</div>
              <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#fff', lineHeight: 1.2 }}>
                {video.title}
              </div>
            </div>
          )}
        </div>

        {/* Back Side - Details */}
        <div className="movie-card-back">
          <div className="card-back-content">
            <h3 className="card-back-title">{video.title}</h3>
            <div className="card-back-meta-info">
              <span className="meta-item">⭐ {video.rating || 'N/A'}</span>
              <span className="meta-item">{video.genre?.split(',')[0]}</span>
              <span className="meta-item">{video.duration || 120} min</span>
            </div>
            <div className="card-back-description">
              {video.description}
            </div>
          </div>
          <button
            className="card-back-button"
            onClick={handleWatchClick}
          >
            ▶ PLAY
          </button>
        </div>
      </div>
    </div>
  );
};

export default MovieCard;
