import React, { useState } from 'react';

export const Header = ({ user, onLogout }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="header">
      <div className="header-container">
        <div className="brand">
          <div className="logo">🎬 Netflix 2026</div>
          <span className="tagline">Next-Generation Streaming Experience</span>
        </div>

        <nav className="nav">
          <a href="#home" title="Home">🏠 Home</a>
          <a href="#browse" title="Browse All Content">📺 Browse</a>
          <a href="#trending" title="Trending Now">🔥 Trending</a>
          <a href="#features" title="Platform Features">⚙️ Features</a>
        </nav>

        <div className="user-menu">
          {user ? (
            <>
              <span title={`User: ${user.name}`}>👤 {user.name}</span>
              <button 
                className="btn-logout" 
                onClick={onLogout}
                title="Sign out"
              >
                Sign Out
              </button>
            </>
          ) : (
            <span>🔄 Connecting...</span>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
