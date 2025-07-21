import React, { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useOutletContext } from 'react-router-dom';
import api from '../../utils/api';
import './PromotionsPage.scss';
import Loader from '../../shared/components/Loader';
import { formatCurrency, formatDate } from '../../utils/formatCurrency';
import { Tag, Percent, Calendar, AlertCircle, Ticket, Menu } from 'lucide-react';
import SocialMediaIcon from '../../shared/components/SocialMediaIcon';
import logoImage from '../../images/logo.png';

const PromotionsPage = () => {
  const socialMedia = useOutletContext();
  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Navbar states - copied from HomePage
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const sidebarRef = useRef(null);
  
  // Navbar functions - copied from HomePage
  const toggleMenu = () => {
    setIsOpen(!isOpen);
    // Scroll prevention is now handled by CSS with the is-sidebar-open class
  };
  
  const closeMenu = () => {
    setIsOpen(false);
    // Scroll prevention is now handled by CSS with the is-sidebar-open class
  };
  
  // Helper function to get display text for a social media platform - copied from HomePage
  const getSocialMediaDisplay = (platform, url) => {
    switch(platform.toLowerCase()) {
      case 'instagram':
        const igMatch = url.match(/instagram\.com\/([^\/\?]+)/);
        return igMatch ? `@${igMatch[1]}` : url;
      case 'tiktok':
        const ttMatch = url.match(/tiktok\.com\/@?([^\/\?]+)/);
        return ttMatch ? `@${ttMatch[1]}` : url;
      case 'whatsapp':
        const waMatch = url.match(/wa\.me\/(\d+)/);
        if (waMatch) {
          const phone = waMatch[1];
          if (phone.startsWith('62')) {
            return `+${phone.slice(0, 2)} ${phone.slice(2, 5)}-${phone.slice(5, 9)}-${phone.slice(9)}`;
          }
          return `+${phone}`;
        }
        return url;
      default:
        return url;
    }
  };
  
  // Get featured social media platforms - copied from HomePage
  const getFeaturedSocialMedia = () => {
    return socialMedia ? socialMedia.filter(sm => 
      ['instagram', 'tiktok', 'whatsapp'].includes(sm.platform.toLowerCase())
    ) : [];
  };
  
  useEffect(() => {
    const fetchPromotions = async () => {
      try {
        const response = await api.get('/promotions');
        
        // Filter only active promotions
        const now = new Date();
        const activePromotions = response.data.filter(promo => {
          const validUntil = new Date(promo.valid_until);
          return validUntil >= now;
        });
        
        setPromotions(activePromotions);
      } catch (error) {
        console.error('Failed to fetch promotions:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchPromotions();
  }, []);
  
  // Handle scroll effect for navbar - copied from HomePage
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
  
  // Close sidebar when clicking outside - copied from HomePage
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target) && isOpen) {
        closeMenu();
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);
  
  return (
    <div className={`promotions-page ${isOpen ? 'is-sidebar-open' : ''}`}>
      {/* Navbar Component - copied from HomePage */}
      <header className={`navbar promotions-list-navbar ${isScrolled ? 'navbar-scrolled' : ''}`}>
        <div className="container">
          <div className="navbar-brand">
            <Link to="/" className="logo" onClick={closeMenu}>
              <img 
                src={logoImage} 
                alt="Tanah Merapi Logo" 
                className="logo-image"
              />
            </Link>
            
            <button className="menu-button" onClick={toggleMenu} aria-label="Toggle menu">
              <Menu size={24} />
            </button>
          </div>
          
          {/* Dark overlay for sidebar */}
          <div 
            className={`sidebar-overlay ${isOpen ? 'is-active' : ''}`} 
            onClick={closeMenu}
          ></div>
          
          <nav className={`navbar-menu ${isOpen ? 'is-active' : ''}`} ref={sidebarRef}>
            <div className="sidebar-header">
              <Link to="/" className="sidebar-logo" onClick={closeMenu}>
                <img 
                  src={logoImage} 
                  alt="Tanah Merapi Logo" 
                  className="logo-image"
                />
              </Link>
            </div>
            
            <div className="navbar-links">
              <NavLink to="/" onClick={closeMenu}>Home</NavLink>
              <NavLink to="/menu" onClick={closeMenu}>Menu</NavLink>
              <NavLink to="/packages" onClick={closeMenu}>Paket Jeep & Jeruk</NavLink>
              <NavLink to="/promotions" onClick={closeMenu}>Promo</NavLink>
              <NavLink to="/contact" onClick={closeMenu}>Kontak & Lokasi</NavLink>
            </div>
            
            <div className="sidebar-footer">
              <p>© 2025 Tanah Merapi</p>
            </div>
          </nav>
        </div>
      </header>

      {/* Enhanced Header Section */}
      <section className="promotions-header">
        <div className="container">
          <div className="header-content">
            <div className="title-area">
              <Ticket size={62} className="title-icon" />
              <div>
                <h1>Promo Spesial</h1>
                <p>Nikmati penawaran terbaik untuk pengalaman di Tanah Merapi</p>
              </div>
            </div>
            <div className="promotions-stats">
              <div className="stat-item">
                <span className="stat-value">{promotions.length}</span>
                <span className="stat-label">Promo Aktif</span>
              </div>
              {promotions.length > 0 && (
                <div className="stat-item">
                  <span className="stat-value">
                    {Math.max(...promotions.map(p => p.discount_percent))}%
                  </span>
                  <span className="stat-label">Diskon Terbesar</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
      
      {/* Promotions Section */}
      <section className="section promotions-section">
        <div className="container">
          {loading ? (
            <Loader />
          ) : promotions.length > 0 ? (
            <div className="promotions-grid">
              {promotions.map((promotion) => (
                <div key={promotion.id} className="promotion-card">
                  {promotion.image_url ? (
                    <div className="promotion-with-image">
                      <div className="promotion-image">
                        <img 
                          src={`${process.env.REACT_APP_API_URL?.replace('/api', '')}${promotion.image_url}`} 
                          alt={promotion.title}
                        />
                        <div className="discount-badge">
                          <Percent size={16} />
                          <span>{promotion.discount_percent}% OFF</span>
                        </div>
                      </div>
                      
                      <div className="promotion-info">
                        <div className="promotion-header">
                          <h3>{promotion.title}</h3>
                          <div className="validity-indicator">
                            <Calendar size={14} />
                            <span>
                              Berakhir {formatDate(promotion.valid_until)}
                            </span>
                          </div>
                        </div>
                        
                        <p>{promotion.description}</p>
                        
                        <div className="promotion-validity">
                          <Calendar size={16} />
                          <span>
                            Berlaku: {formatDate(promotion.valid_from)} - {formatDate(promotion.valid_until)}
                          </span>
                        </div>
                        
                        {promotion.packages && promotion.packages.length > 0 && (
                          <div className="promotion-packages">
                            <Tag size={16} />
                            <span>
                              Berlaku untuk {promotion.packages.length} paket
                            </span>
                          </div>
                        )}
                        
                        <div className="promotion-details">
                          <h4>Syarat dan Ketentuan:</h4>
                          <p>{promotion.terms || 'Tidak ada syarat khusus.'}</p>
                        </div>
                        
                        <div className="packages-list">
                          <h4>Paket yang Tersedia:</h4>
                          {promotion.packages && promotion.packages.length > 0 ? (
                            <ul>
                              {promotion.packages.map((pkg) => (
                                <li key={pkg.id}>
                                  <Link to={`/packages/${pkg.id}`}>
                                    {pkg.name}
                                  </Link>
                                  <div className="price-comparison">
                                    <span className="original-price">
                                      {formatCurrency(pkg.price)}
                                    </span>
                                    <span className="discounted-price">
                                      {formatCurrency(pkg.price - (pkg.price * promotion.discount_percent / 100))}
                                    </span>
                                  </div>
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <p className="no-packages">Tidak ada paket yang tersedia.</p>
                          )}
                        </div>
                        
                        <a 
                          href={`https://wa.me/6281234567890?text=Halo,%20saya%20tertarik%20dengan%20promo%20${promotion.title}.%20Bisakah%20saya%20mendapatkan%20informasi%20lebih%20lanjut?`} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="book-button"
                        >
                          Pesan Sekarang
                        </a>
                      </div>
                    </div>
                  ) : (
                    <div className="promotion-without-image">
                      <div className="promotion-header">
                        <h3>{promotion.title}</h3>
                        <div className="discount-badge">
                          <Percent size={16} />
                          <span>{promotion.discount_percent}% OFF</span>
                        </div>
                      </div>
                      
                      <p>{promotion.description}</p>
                      
                      <div className="promotion-details">
                        <div className="promotion-validity">
                          <Calendar size={16} />
                          <span>
                            Berlaku: {formatDate(promotion.valid_from)} - {formatDate(promotion.valid_until)}
                          </span>
                        </div>
                        
                        {promotion.packages && promotion.packages.length > 0 && (
                          <div className="promotion-packages">
                            <Tag size={16} />
                            <span>
                              Berlaku untuk {promotion.packages.length} paket
                            </span>
                          </div>
                        )}
                      </div>
                      
                      <div className="promotion-terms">
                        <h4>Syarat dan Ketentuan:</h4>
                        <p>{promotion.terms || 'Tidak ada syarat khusus.'}</p>
                      </div>
                      
                      <div className="packages-list">
                        <h4>Paket yang Tersedia:</h4>
                        {promotion.packages && promotion.packages.length > 0 ? (
                          <ul>
                            {promotion.packages.map((pkg) => (
                              <li key={pkg.id}>
                                <Link to={`/packages/${pkg.id}`}>
                                  {pkg.name}
                                </Link>
                                <div className="price-comparison">
                                  <span className="original-price">
                                    {formatCurrency(pkg.price)}
                                  </span>
                                  <span className="discounted-price">
                                    {formatCurrency(pkg.price - (pkg.price * promotion.discount_percent / 100))}
                                  </span>
                                </div>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="no-packages">Tidak ada paket yang tersedia.</p>
                        )}
                      </div>
                      
                      <a 
                        href={`https://wa.me/6281234567890?text=Halo,%20saya%20tertarik%20dengan%20promo%20${promotion.title}.%20Bisakah%20saya%20mendapatkan%20informasi%20lebih%20lanjut?`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="book-button"
                      >
                        Pesan Sekarang
                      </a>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="no-promotions">
              <AlertCircle size={48} />
              <h3>Tidak Ada Promo Saat Ini</h3>
              <p>Saat ini tidak ada promo yang tersedia. Silakan kunjungi kembali di lain waktu untuk penawaran spesial.</p>
              <Link to="/packages" className="view-packages-button">
                Lihat Paket Kami
              </Link>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default PromotionsPage;