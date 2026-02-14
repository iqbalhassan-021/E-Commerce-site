import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const BottomBar = () => {
  const location = useLocation();
const handleCartClick = (e) => {
    e.preventDefault(); // Stop the Link from navigating if you use one
    window.dispatchEvent(new Event('toggle-cart'));
  };
  // Helper function to check if a link is active
  const isActive = (path) => location.pathname === path ? 'active' : '';

  return (
    <div className="bottom-bar">
      <Link to="/" className={`bottom-link ${isActive('/')}`}>
        <i className="fas fa-home"></i>
        <span>Home</span>
      </Link>

      <Link to="/Products" className={`bottom-link ${isActive('/Products')}`}>
        <i className="fas fa-shop"></i>
        <span>Shop</span>
      </Link>

      <Link to="/Sale" className={`bottom-link ${isActive('/Sale')}`}>
        <i className="fas fa-tags"></i>
        <span>Sale</span>
      </Link>

      <Link  to="/ForHer" className={`bottom-link ${isActive('/ForHer')}`}>
        <i className="fas fa-gift"></i>
        <span>For Her</span>
      </Link>
    </div>
  );
};

export default BottomBar;