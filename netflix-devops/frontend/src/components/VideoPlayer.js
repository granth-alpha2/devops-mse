import React, { useEffect, useState, useRef } from 'react';

const VideoPlayer = ({ video, onClose }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [videoProgress, setVideoProgress] = useState(0);
  const [currentQuality, setCurrentQuality] = useState('720p');
  const [showQualityMenu, setShowQualityMenu] = useState(false);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const videoRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    setIsPlaying(false);
    setErrorMessage('');
    setVideoProgress(0);
    setCurrentQuality('720p');
    setShowQualityMenu(false);
    setVolume(1);
    setIsMuted(false);
    setIsFullscreen(false);
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [video]);

  const getCurrentVideoUrl = () => {
    if (video.qualities && video.qualities[currentQuality]) {
      return video.qualities[currentQuality];
    }
    return video.url;
  };

  const handleQualityChange = (quality) => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    const currentTime = videoElement.currentTime;
    const wasPlaying = !videoElement.paused;

    setCurrentQuality(quality);
    setShowQualityMenu(false);

    // Reload video at new quality
    setTimeout(() => {
      if (videoElement) {
        videoElement.load();
        videoElement.currentTime = currentTime;
        if (wasPlaying) {
          videoElement.play();
        }
      }
    }, 100);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
    }
    setIsMuted(newVolume === 0);
  };

  const toggleMute = () => {
    if (videoRef.current) {
      if (isMuted) {
        videoRef.current.volume = volume;
        setIsMuted(false);
      } else {
        videoRef.current.volume = 0;
        setIsMuted(true);
      }
    }
  };

  const handlePlayClick = () => {
    setErrorMessage('');
    setIsPlaying(true);
  };

  const handleVideoError = (e) => {
    console.error('Video error event:', e);
    const videoElement = e.target;
    let errorMsg = 'Video failed to load';
    
    if (videoElement.error) {
      switch(videoElement.error.code) {
        case videoElement.error.MEDIA_ERR_ABORTED:
          errorMsg = 'Video playback was aborted';
          break;
        case videoElement.error.MEDIA_ERR_NETWORK:
          errorMsg = 'Network error - video URL may be unavailable';
          break;
        case videoElement.error.MEDIA_ERR_DECODE:
          errorMsg = 'Video format not supported by your browser';
          break;
        case videoElement.error.MEDIA_ERR_SRC_NOT_SUPPORTED:
          errorMsg = 'Video source type not supported';
          break;
        default:
          errorMsg = 'Unknown video error occurred';
      }
    }
    
    setErrorMessage(errorMsg);
    setIsPlaying(false);
  };

  const handleLoadStart = () => {
    console.log('Video loading started for:', video.title);
  };

  const handleCanPlay = () => {
    console.log('Video ready to play');
  };

  const handleTimeUpdate = (e) => {
    if (e.target.duration) {
      setVideoProgress((e.target.currentTime / e.target.duration) * 100);
    }
  };

  return (
    <div className="video-player-overlay" onClick={onClose}>
      <div className="video-player-container" onClick={(e) => e.stopPropagation()}>
        <div className="video-player-header">
          <div>
            <h2>{video.title}</h2>
            <p className="video-player-subtitle">
              {video.genre} • 
              <span style={{ color: '#ffd700', margin: '0 10px' }}>★ {video.rating}/10</span> • 
              {video.views?.toLocaleString()} views
            </p>
          </div>
          <button className="close-btn" onClick={onClose} aria-label="Close player">✕</button>
        </div>

        <div className="video-player-body">
          <div className="video-panel">
            {!isPlaying ? (
              <div className="video-preview">
                <img 
                  src={video.thumbnail} 
                  alt={video.title} 
                  className="video-thumbnail" 
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/800x450/1a1a1a/ffffff?text=No+Thumbnail';
                  }} 
                />
                <div className="play-overlay">
                  <button className="play-btn-large" onClick={handlePlayClick} aria-label="Play video">
                    ▶
                  </button>
                </div>
              </div>
            ) : (
              <div className="video-container" ref={containerRef}>
                <video
                  ref={videoRef}
                  className="video-element"
                  controls
                  autoPlay
                  playsInline
                  preload="metadata"
                  src={getCurrentVideoUrl()}
                  onError={handleVideoError}
                  onLoadStart={handleLoadStart}
                  onCanPlay={handleCanPlay}
                  onTimeUpdate={handleTimeUpdate}
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                  style={{ width: '100%', height: '100%', objectFit: 'contain', backgroundColor: '#000' }}
                >
                  Your browser does not support the video tag.
                </video>

                {/* Custom Controls Overlay */}
                <div className="video-controls-overlay">
                  {/* Quality Selector */}
                  <div className="quality-selector">
                    <button
                      className="quality-btn"
                      onClick={() => setShowQualityMenu(!showQualityMenu)}
                      title="Video Quality"
                    >
                      {currentQuality} ⚙️
                    </button>
                    {showQualityMenu && (
                      <div className="quality-menu">
                        {video.qualities && Object.keys(video.qualities).map(quality => (
                          <button
                            key={quality}
                            className={`quality-option ${currentQuality === quality ? 'active' : ''}`}
                            onClick={() => handleQualityChange(quality)}
                          >
                            {quality}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Volume Control */}
                  <div className="volume-control">
                    <button className="volume-btn" onClick={toggleMute}>
                      {isMuted ? '🔇' : volume > 0.5 ? '🔊' : '🔉'}
                    </button>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.1"
                      value={isMuted ? 0 : volume}
                      onChange={handleVolumeChange}
                      className="volume-slider"
                    />
                  </div>

                  {/* Fullscreen Button */}
                  <button className="fullscreen-btn" onClick={toggleFullscreen}>
                    {isFullscreen ? '🗗' : '🗖'}
                  </button>
                </div>
                {videoProgress > 0 && (
                  <div style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    height: '3px',
                    width: `${videoProgress}%`,
                    background: 'linear-gradient(90deg, #e50914, #cc0713)',
                    transition: 'width 0.1s linear'
                  }} />
                )}
              </div>
            )}
          </div>

          <div className="video-details-panel">
            <div className="video-details-card">
              <h3>About This Title</h3>
              <p>{video.description}</p>
              <div className="video-details-stats">
                <span><strong>Duration:</strong> {Math.round(video.duration / 60)} minutes</span>
                <span><strong>Genre:</strong> {video.genre}</span>
                <span><strong>Rating:</strong> {video.rating}/10</span>
                <span><strong>Views:</strong> {video.views?.toLocaleString() || 'N/A'}</span>
              </div>
              {errorMessage && (
                <div className="video-error">
                  ⚠️ {errorMessage}
                </div>
              )}
              <div style={{ marginTop: '24px', paddingTop: '24px', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
                <button 
                  style={{
                    width: '100%',
                    padding: '12px',
                    background: 'linear-gradient(135deg, #e50914, #cc0713)',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontWeight: '600',
                    marginBottom: '8px',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => e.target.style.transform = 'scale(1.02)'}
                  onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                  onClick={handlePlayClick}
                >
                  {isPlaying ? 'Continue Watching' : 'Play Now'}
                </button>
                <button 
                  style={{
                    width: '100%',
                    padding: '12px',
                    background: 'rgba(255, 255, 255, 0.1)',
                    color: '#fff',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontWeight: '600',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = 'rgba(255, 255, 255, 0.15)';
                    e.target.style.transform = 'scale(1.02)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = 'rgba(255, 255, 255, 0.1)';
                    e.target.style.transform = 'scale(1)';
                  }}
                  onClick={onClose}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
