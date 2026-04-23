import React from 'react';

export const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <h4>🎬 StreamFlix Premium</h4>
          <p>Next-generation streaming platform powered by DevOps excellence</p>
        </div>
        
        <div className="footer-section">
          <h5>Quick Links</h5>
          <ul>
            <li><a href="#home">Home</a></li>
            <li><a href="#browse">Browse</a></li>
            <li><a href="#about">About</a></li>
          </ul>
        </div>
        
        <div className="footer-section">
          <h5>Technology</h5>
          <ul>
            <li>React 18 + Modern Web APIs</li>
            <li>Node.js + Express Backend</li>
            <li>MongoDB Database</li>
            <li>Docker & Kubernetes</li>
          </ul>
        </div>
        
        <div className="footer-section">
          <h5>Connect</h5>
          <ul>
            <li><a href="https://github.com" target="_blank" rel="noopener noreferrer">GitHub</a></li>
            <li><a href="https://twitter.com" target="_blank" rel="noopener noreferrer">Twitter</a></li>
            <li><a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">LinkedIn</a></li>
          </ul>
        </div>
      </div>
      
      <div className="footer-bottom">
        <p>&copy; 2026 StreamFlix. All rights reserved. | DevOps Demo Project</p>
      </div>
    </footer>
  );
};

export default Footer;
