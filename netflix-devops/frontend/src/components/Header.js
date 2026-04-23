import React, { useState } from 'react';

export const Header = ({ user, onLogout, onSearch, searchQuery }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`header ${isScrolled ? 'scrolled' : ''}`}>
      <div className="header-container">
        <div className="logo-section">
          <div className="logo">🎬 StreamFlix</div>
          <span className="tagline">Premium Streaming 2026</span>
        </div>

        <nav className="nav">
          <a href="#home" title="Home">Home</a>
          <a href="#browse" title="Browse">Browse</a>
          <a href="#trending" title="Trending">Trending</a>
        </nav>

        <div className="header-search">
          <input
            type="text"
            placeholder="Search movies..."
            value={searchQuery}
            onChange={(e) => onSearch(e.target.value)}
            className="search-input"
          />
          <span className="search-icon">🔍</span>
        </div>

        <div className="user-section">
          {user ? (
            <div className="user-menu">
              <button className="profile-btn" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                👤 {user.name}
              </button>
              {isMenuOpen && (
                <div className="dropdown-menu">
                  <button onClick={onLogout}>Sign Out</button>
                </div>
              )}
            </div>
          ) : (
            <span className="connecting">Connecting...</span>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;

