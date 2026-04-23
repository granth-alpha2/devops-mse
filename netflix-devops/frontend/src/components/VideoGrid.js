import React, { useState } from 'react';
import VideoPlayer from './VideoPlayer';
import MovieCard from './MovieCard';

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
          <p style={{ fontSize: '1.2rem', color: '#d0d0d0' }}>Loading movies...</p>
        </div>
      </section>
    );
  }

  // Organize videos into categories
  const organizeVideos = () => {
    const sorted = [...videos].sort((a, b) => (b.rating || 0) - (a.rating || 0));
    return {
      featured: videos[0],
      trending: sorted.slice(0, 6),
      continueWatching: videos.slice(1, 7), // Simulate continue watching
      myList: videos.slice(2, 8), // Simulate my list
      all: videos
    };
  };

  const { featured, trending, continueWatching, myList, all } = organizeVideos();

  return (
    <>
      {/* Featured Movie Section */}
      {featured && (
        <section className="featured-section">
          <div className="featured-movie">
            <MovieCard
              video={featured}
              onWatchClick={handleWatchClick}
              featured={true}
            />
          </div>
        </section>
      )}

      {/* Continue Watching */}
      <section className="gallery-section">
        <div className="gallery-header">
          <h3>Continue Watching</h3>
          <p>Pick up where you left off</p>
        </div>
        <div className="horizontal-scroll">
          {continueWatching.map((video) => (
            <div key={video._id || video.id} className="scroll-card-wrapper">
              <MovieCard
                video={video}
                onWatchClick={handleWatchClick}
                isShrunk={true}
              />
            </div>
          ))}
        </div>
      </section>

      {/* Trending Section */}
      <section className="gallery-section">
        <div className="gallery-header">
          <h3>🔥 Trending Now</h3>
          <p>The hottest content this week</p>
        </div>
        <div className="horizontal-scroll">
          {trending.map((video) => (
            <div key={video._id || video.id} className="scroll-card-wrapper">
              <MovieCard
                video={video}
                onWatchClick={handleWatchClick}
                isShrunk={true}
              />
            </div>
          ))}
        </div>
      </section>

      {/* My List */}
      <section className="gallery-section">
        <div className="gallery-header">
          <h3>📋 My List</h3>
          <p>Your personalized collection</p>
        </div>
        <div className="horizontal-scroll">
          {myList.map((video) => (
            <div key={video._id || video.id} className="scroll-card-wrapper">
              <MovieCard
                video={video}
                onWatchClick={handleWatchClick}
                isShrunk={true}
              />
            </div>
          ))}
        </div>
      </section>

      {/* All Movies Grid */}
      <section className="gallery-section">
        <div className="gallery-header">
          <h3>📺 All Movies</h3>
          <p>Browse our complete collection</p>
        </div>
        <div className="video-grid">
          {all.map((video) => (
            <MovieCard
              key={video._id || video.id}
              video={video}
              onWatchClick={handleWatchClick}
            />
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
