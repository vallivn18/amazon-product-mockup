import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaShoppingCart, FaBars, FaTimes } from 'react-icons/fa';
import { getCartItems } from '../api/api'; // Import your API function to get cart items
import './navbar.css';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0); // State for cart item count

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  useEffect(() => {
    const fetchCartCount = async () => {
      try {
        const items = await getCartItems();
        setCartCount(items.length); // Update cart count with the length of items
      } catch (error) {
        console.error('Error fetching cart items:', error);
      }
    };

    fetchCartCount();
  }, []); // Run once on component mount

  return (
    <nav className="navbar">
      {/* Logo Link */}
      <div className="navbar-logo">
        <Link to="/">
          <img src={require('../assets/images/logo.png')} alt="Brand Logo" className="logo" />
        </Link>
      </div>

      {/* Hamburger Menu Icon */}
      <div className="menu-icon" onClick={toggleMenu}>
        {menuOpen ? <FaTimes /> : <FaBars />}
      </div>

      {/* Navbar Links */}
      <div className={`navbar-links ${menuOpen ? 'active' : ''}`}>
        <Link to="/" onClick={toggleMenu}>Products</Link>
        <Link to="/cart" className="cart-link" onClick={toggleMenu}>
          <FaShoppingCart /> Cart {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
