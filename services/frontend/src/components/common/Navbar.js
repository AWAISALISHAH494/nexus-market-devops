import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  FiSearch, FiShoppingCart, FiUser, FiMenu, FiX, 
  FiLogOut, FiPackage, FiHeart
} from 'react-icons/fi';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
      setIsMobileMenuOpen(false);
    }
  };

  const handleLogout = () => {
    logout();
    setIsUserMenuOpen(false);
    navigate('/');
  };


  return (
    <header className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
      <div className="navbar-container">
        {/* Logo */}
        <Link to="/" className="navbar-logo">
          <span className="logo-nexus">NEXUS</span>
          <span className="logo-market">MARKET</span>
        </Link>

        {/* Desktop Search */}
        <div className="navbar-search desktop-only">
          <form onSubmit={handleSearchSubmit}>
            <input
              type="text"
              placeholder="Search premium products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit">
              <FiSearch />
            </button>
          </form>
        </div>

        {/* Desktop Actions */}
        <div className="navbar-actions desktop-only">
          {user && (
            <Link to="/cart" className="action-icon">
              <FiShoppingCart />
              {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
            </Link>
          )}
          
          <div className="user-dropdown-container">
            <button 
              className="action-icon"
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            >
              <FiUser />
            </button>
            
            {isUserMenuOpen && (
              <div className="user-dropdown-menu">
                {user ? (
                  <>
                    <div className="dropdown-header">
                      <p className="user-name">{user.username}</p>
                      <p className="user-email">{user.email}</p>
                    </div>
                    <div className="dropdown-divider"></div>
                    <Link to="/profile" onClick={() => setIsUserMenuOpen(false)}>
                      <FiUser /> Profile
                    </Link>
                    <Link to="/orders" onClick={() => setIsUserMenuOpen(false)}>
                      <FiPackage /> Orders
                    </Link>
                    <Link to="/wishlist" onClick={() => setIsUserMenuOpen(false)}>
                      <FiHeart /> Wishlist
                    </Link>
                    <div className="dropdown-divider"></div>
                    <button onClick={handleLogout} className="logout-btn">
                      <FiLogOut /> Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link to="/login" onClick={() => setIsUserMenuOpen(false)}>Login</Link>
                    <Link to="/register" onClick={() => setIsUserMenuOpen(false)}>Register</Link>
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Mobile Menu Toggle */}
        <button 
          className="mobile-menu-toggle mobile-only"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <FiX /> : <FiMenu />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="mobile-menu">
          <form className="mobile-search" onSubmit={handleSearchSubmit}>
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit"><FiSearch /></button>
          </form>
          
          <div className="mobile-links">
            <Link to="/products" onClick={() => setIsMobileMenuOpen(false)}>Products</Link>
            
            {user ? (
              <>
                <Link to="/cart" onClick={() => setIsMobileMenuOpen(false)}>
                  Cart {cartCount > 0 && <span className="mobile-cart-count">({cartCount})</span>}
                </Link>
                <Link to="/profile" onClick={() => setIsMobileMenuOpen(false)}>Profile</Link>
                <Link to="/orders" onClick={() => setIsMobileMenuOpen(false)}>Orders</Link>
                <button onClick={handleLogout} className="mobile-logout">Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>Login</Link>
                <Link to="/register" onClick={() => setIsMobileMenuOpen(false)}>Register</Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
