import React from 'react';
import { Link } from 'react-router-dom';
import { 
  FiGithub, FiTwitter, FiInstagram, 
  FiMail, FiPhone, FiMapPin, FiArrowRight 
} from 'react-icons/fi';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-grid">
          {/* Column 1: Brand */}
          <div className="footer-col brand-col">
            <Link to="/" className="footer-logo">
              <span className="logo-nexus">NEXUS</span>
              <span className="logo-market">MARKET</span>
            </Link>
            <p className="footer-desc">
              Experience the future of e-commerce. Premium products, seamless transactions, 
              and unparalleled customer satisfaction in a decentralized marketplace.
            </p>
            <div className="social-icons">
              <a href="https://github.com" target="_blank" rel="noopener noreferrer"><FiGithub /></a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer"><FiTwitter /></a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"><FiInstagram /></a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="footer-col">
            <h3 className="footer-title">Quick Links</h3>
            <ul className="footer-links">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/products">Products</Link></li>
              <li><Link to="/cart">Cart</Link></li>
              <li><Link to="/orders">Orders</Link></li>
            </ul>
          </div>

          {/* Column 3: Support */}
          <div className="footer-col">
            <h3 className="footer-title">Support</h3>
            <ul className="footer-links">
              <li><Link to="/faq">FAQ</Link></li>
              <li><Link to="/contact">Contact Us</Link></li>
              <li><Link to="/shipping">Shipping Info</Link></li>
              <li><Link to="/returns">Returns</Link></li>
            </ul>
            <div className="contact-info">
              <p><FiMail /> support@nexusmarket.io</p>
              <p><FiPhone /> +1 (555) 123-4567</p>
              <p><FiMapPin /> Cyber City, CA 94016</p>
            </div>
          </div>

          {/* Column 4: Newsletter */}
          <div className="footer-col newsletter-col">
            <h3 className="footer-title">Stay Updated</h3>
            <p>Subscribe to our newsletter for exclusive premium drops and offers.</p>
            <form className="newsletter-form" onSubmit={(e) => e.preventDefault()}>
              <input type="email" placeholder="Enter your email" required />
              <button type="submit" className="btn-gradient">
                <FiArrowRight />
              </button>
            </form>
          </div>
        </div>

        <div className="footer-bottom">
          <p className="copyright">
            &copy; {new Date().getFullYear()} Nexus Market. All rights reserved.
          </p>
          <div className="payment-methods">
            {/* Payment icons could go here */}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
