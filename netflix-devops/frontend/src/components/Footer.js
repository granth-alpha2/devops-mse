import React from 'react';

export const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <h4>Questions? Contact us.</h4>
          <p>Ready to watch? Enter your email to create or restart your membership.</p>
        </div>
        
        <div className="footer-section">
          <h5>FAQ</h5>
          <ul>
            <li><a href="#faq">What is Netflix?</a></li>
            <li><a href="#faq">How much does Netflix cost?</a></li>
            <li><a href="#faq">Where can I watch?</a></li>
          </ul>
        </div>
        
        <div className="footer-section">
          <h5>Help Center</h5>
          <ul>
            <li><a href="#help">Account</a></li>
            <li><a href="#help">Media Center</a></li>
            <li><a href="#help">Investor Relations</a></li>
          </ul>
        </div>
        
        <div className="footer-section">
          <h5>Account</h5>
          <ul>
            <li><a href="#account">Redeem gift cards</a></li>
            <li><a href="#account">Privacy</a></li>
            <li><a href="#account">Speed Test</a></li>
          </ul>
        </div>
      </div>
      
      <div className="footer-bottom">
        <p>&copy; 1997-2026 Netflix, Inc.</p>
      </div>
    </footer>
  );
};

export default Footer;
