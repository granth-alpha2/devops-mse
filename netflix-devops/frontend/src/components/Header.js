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
          <div className="logo">N</div>
          <span className="tagline">ETFLIX</span>
        </div>

        <nav className="nav">
          <a href="#home" title="Home">Home</a>
          <a href="#tvshows" title="TV Shows">TV Shows</a>
          <a href="#movies" title="Movies">Movies</a>
          <a href="#new" title="New & Popular">New & Popular</a>
          <a href="#mylist" title="My List">My List</a>
        </nav>

        <div className="header-right">
          <div className="header-search">
            <input
              type="text"
              placeholder="Search movies, TV shows..."
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
                  <img src="https://via.placeholder.com/32x32/333/fff?text=U" alt="Profile" className="profile-avatar" />
                </button>
                {isMenuOpen && (
                  <div className="dropdown-menu">
                    <div className="dropdown-header">
                      <img src="https://via.placeholder.com/40x40/333/fff?text=U" alt="Profile" className="dropdown-avatar" />
                      <span>{user.name}</span>
                    </div>
                    <button onClick={onLogout}>Sign Out</button>
                  </div>
                )}
              </div>
            ) : (
              <span className="connecting">Connecting...</span>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

