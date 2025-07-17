import React, { useState, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import './Navbar.scss';
import logoImage from '../../images/logo.jpg';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };
  
  const closeMenu = () => {
    setIsOpen(false);
  };
  
  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 50); // Add background after scrolling 50px
    };
    
    window.addEventListener('scroll', handleScroll);
    
    // Cleanup
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  return (
    <header className={`navbar ${isScrolled ? 'navbar-scrolled' : ''}`}>
      <div className="container">
        <div className="navbar-brand">
          <Link to="/" className="logo" onClick={closeMenu}>
            <img 
              src={logoImage} 
              alt="Tanah Merapi Logo" 
              className="logo-image"
            />
          </Link>
          
          <button className="menu-button" onClick={toggleMenu}>
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
        
        <nav className={`navbar-menu ${isOpen ? 'is-active' : ''}`}>
          <div className="navbar-links">
            <NavLink to="/" onClick={closeMenu}>Home</NavLink>
            <NavLink to="/menu" onClick={closeMenu}>Menu</NavLink>
            <NavLink to="/packages" onClick={closeMenu}>Paket Jeep & Jeruk</NavLink>
            <NavLink to="/promotions" onClick={closeMenu}>Promo</NavLink>
            <NavLink to="/contact" onClick={closeMenu}>Kontak</NavLink>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;