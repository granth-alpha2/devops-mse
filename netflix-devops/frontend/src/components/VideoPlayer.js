import React, { useEffect, useState, useRef } from 'react';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const VideoPlayer = ({ video, onClose }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [videoProgress, setVideoProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
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
    if (video?._id || video?.id) {
      const streamUrl = `${API_URL}/stream/${video._id || video.id}`;
      console.log('Using stream URL:', streamUrl);
      return streamUrl;
    }

    if (video.qualities && video.qualities[currentQuality]) {
      console.log('Using quality URL:', video.qualities[currentQuality]);
      return video.qualities[currentQuality];
    }

    console.log('Using direct URL:', video.url);
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
    setTimeout(() => {
      if (videoRef.current) {
        videoRef.current.focus();
        videoRef.current.play().catch(err => {
          console.error('Autoplay failed:', err);
          setErrorMessage('Autoplay blocked. Click play on the video controls.');
        });
      }
    }, 100);
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

  const handleLoadedMetadata = (e) => {
    const durationSeconds = e.target.duration || 0;
    setDuration(durationSeconds);
    setCurrentTime(e.target.currentTime || 0);
    setVideoProgress(durationSeconds ? (e.target.currentTime / durationSeconds) * 100 : 0);
  };

  const handleCanPlay = () => {
    console.log('Video ready to play');
  };

  const formatTime = (time) => {
    if (isNaN(time) || time === Infinity) return '00:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  const handlePlayPause = () => {
    if (!videoRef.current) return;

    if (videoRef.current.paused) {
      videoRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch((err) => {
        console.error('Play failed:', err);
        setErrorMessage('Playback blocked. Use the controls to resume.');
      });
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const handleSeek = (seekValue) => {
    if (!videoRef.current) return;
    videoRef.current.currentTime = seekValue;
    setCurrentTime(seekValue);
    if (duration > 0) {
      setVideoProgress((seekValue / duration) * 100);
    }
  };

  const handleTimeUpdate = (e) => {
    if (e.target.duration) {
      const current = e.target.currentTime;
      setCurrentTime(current);
      setVideoProgress((current / e.target.duration) * 100);
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
          <button className="close-btn" onClick={onClose} aria-label="Close player" title="Close">
            ✕
          </button>
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
                  <button 
                    className="play-btn-large" 
                    onClick={handlePlayClick} 
                    aria-label="Play video"
                    title="Click to play video"
                  >
                    ▶
                  </button>
                </div>
              </div>
            ) : (
              <div className="video-container" ref={containerRef}>
                <video
                  ref={videoRef}
                  className="video-element"
                  playsInline
                  preload="metadata"
                  src={getCurrentVideoUrl()}
                  onError={handleVideoError}
                  onLoadStart={handleLoadStart}
                  onLoadedMetadata={handleLoadedMetadata}
                  onCanPlay={handleCanPlay}
                  onTimeUpdate={handleTimeUpdate}
                />

                <div className="video-controls-overlay">
                  <button
                    className="play-pause-btn"
                    onClick={handlePlayPause}
                    title={isPlaying ? 'Pause video' : 'Play video'}
                    aria-label={isPlaying ? 'Pause video' : 'Play video'}
                  >
                    {isPlaying ? '❚❚' : '▶'}
                  </button>

                  <div className="progress-wrapper">
                    <input
                      type="range"
                      min="0"
                      max={duration || 100}
                      step="0.1"
                      value={currentTime}
                      onChange={(e) => handleSeek(parseFloat(e.target.value))}
                      className="progress-slider"
                      title="Seek"
                    />
                    <div className="progress-labels">
                      {formatTime(currentTime)} / {formatTime(duration)}
                    </div>
                  </div>

                  <div className="video-control-group">
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

                    <div className="volume-control">
                      <button 
                        className="volume-btn" 
                        onClick={toggleMute}
                        title={isMuted ? "Unmute" : "Mute"}
                      >
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
                        title="Volume"
                      />
                    </div>

                    <button 
                      className="fullscreen-btn" 
                      onClick={toggleFullscreen} 
                      title="Fullscreen"
                    >
                      {isFullscreen ? '🗗' : '⛶'}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="video-details-panel">
            <div className="video-details-card">
              <h3>📺 About</h3>
              <p>{video.description}</p>
              <div className="video-details-stats">
                <span>
                  <strong>Duration:</strong> 
                  <span>{Math.round(video.duration / 60)} min</span>
                </span>
                <span>
                  <strong>Genre:</strong> 
                  <span>{video.genre}</span>
                </span>
                <span>
                  <strong>Rating:</strong> 
                  <span>{video.rating}/10</span>
                </span>
                <span>
                  <strong>Views:</strong> 
                  <span>{video.views?.toLocaleString() || 'N/A'}</span>
                </span>
              </div>
              {errorMessage && (
                <div className="video-error">
                  ⚠️ {errorMessage}
                </div>
              )}
              <div style={{ marginTop: 'auto', paddingTop: '20px' }}>
                <button 
                  className="video-player-button video-player-button-secondary"
                  onClick={onClose}
                  title="Close player"
                >
                  ✕ Close
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
