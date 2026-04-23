import React, { useState } from 'react';
import VideoPlayer from './VideoPlayer';

export const VideoGrid = ({ videos }) => {
  const [selectedVideo, setSelectedVideo] = useState(null);

  const handleWatchClick = (video) => {
    setSelectedVideo(video);
  };

  const handleClosePlayer = () => {
    setSelectedVideo(null);
  };

  if (!videos || videos.length === 0) {
    return (
      <section className="video-grid-section">
        <div style={{ textAlign: 'center', padding: '60px 20px' }}>
          <p style={{ fontSize: '1.2rem', color: '#d0d0d0' }}>No videos available</p>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="video-grid-section">
        <div className="section-header">
          <div>
            <span className="eyebrow">Streaming Now</span>
            <h3>Featured Blockbusters</h3>
          </div>
          <p className="section-copy">
            Discover premium content with 4K quality support, multi-quality streaming, and cloud-native delivery.
          </p>
        </div>

        <div className="video-grid">
          {videos.map((video) => (
            <div
              key={video._id || video.id}
              className="video-card"
              onClick={() => handleWatchClick(video)}
              role="button"
              tabIndex={0}
              onKeyPress={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  handleWatchClick(video);
                }
              }}
              style={{ cursor: 'pointer' }}
            >
              <div className="video-card-image">
                <img
                  src={video.thumbnail || 'https://via.placeholder.com/400x225/111111/ffffff?text=No+Thumbnail'}
                  alt={video.title}
                  loading="lazy"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/400x225/111111/ffffff?text=No+Thumbnail';
                  }}
                />
                <div className="video-card-overlay">
                  <button
                    className="play-button-card"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleWatchClick(video);
                    }}
                    aria-label={`Watch ${video.title}`}
                  >
                    ▶ Play
                  </button>
                </div>
              </div>
              <div className="video-card-info">
                <h4 className="video-title">{video.title}</h4>
                <div className="video-meta">
                  <span className="rating">⭐ {video.rating || 'N/A'}</span>
                  <span className="genre">{video.genre?.split(',')[0] || 'Unknown'}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {selectedVideo && (
        <VideoPlayer video={selectedVideo} onClose={handleClosePlayer} />
      )}
    </>
  );
};

export default VideoGrid;
