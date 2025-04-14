import React from 'react';
import '../styles/Footer.css';

function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="footer" role="contentinfo">
      <div className="footer-content">
        <p className="copyright">
          &copy; {currentYear} - Schatz Cards - All rights reserved.
        </p>
      </div>
    </footer>
  );
}

export default Footer;