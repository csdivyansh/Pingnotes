import React from "react";
import "./Footer.css"; // Make sure this path is correct

//footer page 
const Footer = () => {
  return (
    <footer className="footer-wrapper">
      <div className="footer-container">
        {/* Logo and Tagline */}
        <div className="footer-section">
          <h3>Pingnotes</h3>
          <p className="footer-tagline">
            Helping students stay organized and connected.
          </p>
        </div>

        {/* Quick Links */}
        <div className="footer-section">
          <h4 className="footer-heading">Quick Links</h4>
          <ul className="footer-links">
            <li>
              <a href="/">Home</a>
            </li>
            <li>
              <a href="/features">Features</a>
            </li>
            <li>
              <a href="/dashboard">Dashboard</a>
            </li>
            <li>
              <a href="/about">About</a>
            </li>
          </ul>
        </div>

        {/* Contact Info */}
        <div className="footer-section">
          <h4 className="footer-heading">Contact</h4>
          <p>Email: garvpathak34@gmail.com</p>
          <p>Phone: +91 7300913553</p>
        </div>
      </div>

      <div className="footer-bottom">
        <hr />
        <p>© {new Date().getFullYear()} Ping Note. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
