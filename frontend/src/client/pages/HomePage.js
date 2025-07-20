import React, { useState, useEffect, useRef } from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import Slider from 'react-slick';
import api from '../../utils/api';
import './HomePage.scss';
import Loader from '../../shared/components/Loader';
import aboutImage from '../../images/about.jpg';
import contohImage from '../../images/contoh.jpeg';
import beyonceImage from '../../images/beyonce.png';
import hissImage from '../../images/hiss.png';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { formatCurrency } from '../../utils/formatCurrency';
import SocialMediaIcon from '../../shared/components/SocialMediaIcon';

const HomePage = () => {
  const socialMedia = useOutletContext();
  const [slides, setSlides] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [packages, setPackages] = useState([]);
  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  
  // Create a ref for the slider to access its methods
  const sliderRef = useRef(null);
  
  // Custom carousel images
  const carouselImages = [
    { src: contohImage, alt: "Tanah Merapi Jeep Track" },
    { src: beyonceImage, alt: "Beyonce Image" },
    { src: hissImage, alt: "Hiss Image" }
  ];
  
  // Helper function to get display text for a social media platform
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
  
  // Get featured social media platforms
  const getFeaturedSocialMedia = () => {
    return socialMedia.filter(sm => 
      ['instagram', 'tiktok', 'whatsapp'].includes(sm.platform.toLowerCase())
    ); // Removed the .slice(0, 2) to show all matching social media icons
  };
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [slidesRes, menuItemsRes, packagesRes, promotionsRes] = await Promise.all([
          api.get('/slides'),
          api.get('/menu-items'),
          api.get('/packages'),
          api.get('/promotions')
        ]);
        
        setSlides(slidesRes.data);
        setMenuItems(menuItemsRes.data.slice(0, 3)); // Just get first 3
        setPackages(packagesRes.data.slice(0, 3)); // Just get first 3
        setPromotions(promotionsRes.data);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  // Auto-slide effect - only when no slides from API
  useEffect(() => {
    if (slides.length === 0) {
      const interval = setInterval(() => {
        if (!isTransitioning) {
          setIsTransitioning(true);
          setCurrentImageIndex((prev) => 
            prev === carouselImages.length - 1 ? 0 : prev + 1
          );
          setTimeout(() => setIsTransitioning(false), 500);
        }
      }, 2000); // Changed to 4.5 seconds (4500ms)
      
      return () => clearInterval(interval);
    }
  }, [slides.length, carouselImages.length, isTransitioning]);
  
  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4500, // Changed to 4.5 seconds (4500ms)
    pauseOnHover: true,
    arrows: false // We'll use our custom arrows instead of the default ones
  };
  
  // Navigation functions for the slider from react-slick
  const goToNext = () => {
    if (sliderRef.current) {
      sliderRef.current.slickNext();
    }
  };
  
  const goToPrev = () => {
    if (sliderRef.current) {
      sliderRef.current.slickPrev();
    }
  };
  
  // Custom carousel navigation functions
  const nextImage = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentImageIndex((prev) => 
      prev === carouselImages.length - 1 ? 0 : prev + 1
    );
    setTimeout(() => setIsTransitioning(false), 500);
  };
  
  const prevImage = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentImageIndex((prev) => 
      prev === 0 ? carouselImages.length - 1 : prev - 1
    );
    setTimeout(() => setIsTransitioning(false), 500);
  };
  
  const goToImage = (index) => {
    if (isTransitioning || index === currentImageIndex) return;
    setIsTransitioning(true);
    setCurrentImageIndex(index);
    setTimeout(() => setIsTransitioning(false), 500);
  };
  
  if (loading) {
    return <Loader />;
  }
  
  // Get featured social media for display in hero
  const featuredSocialMedia = getFeaturedSocialMedia();
  
  return (
    <div className="home-page">
      {/* Hero Slider */}
      <section className="hero-slider">
        {slides.length > 0 ? (
          <div className="slider-container">
            <Slider ref={sliderRef} {...sliderSettings}>
              {slides.map((slide) => (
                <div key={slide.id} className="hero-slide">
                  <img 
                    src={`${process.env.REACT_APP_API_URL?.replace('/api', '')}${slide.image_url}`} 
                    alt={slide.title}
                  />
                  <div className="hero-overlay"></div>
                  <div className="hero-content">
                    <h1>{slide.title}</h1>
                    <p>{slide.description || 'Nikmati keindahan alam di lereng Gunung Merapi'}</p>
                  </div>
                </div>
              ))}
            </Slider>
            
            {/* Fixed CTA button and social media icons */}
            <div className="hero-fixed-content">
              <Link to="/contact" className="cta-button">
                Kunjungi Kami
              </Link>
              <div className="hero-social-media">
                {featuredSocialMedia.map(sm => (
                  <SocialMediaIcon
                    key={sm.id}
                    platform={sm.platform}
                    url={sm.url}
                    isLarge={true}
                  />
                ))}
              </div>
            </div>
            
            {/* Custom Navigation Arrows for react-slick */}
            <button className="carousel-nav carousel-prev" onClick={goToPrev}>
              <ChevronLeft size={24} />
            </button>
            <button className="carousel-nav carousel-next" onClick={goToNext}>
              <ChevronRight size={24} />
            </button>
          </div>
        ) : (
          <div className="custom-carousel">
            <div className="carousel-container">
              <div 
                className="carousel-track"
                style={{
                  transform: `translateX(-${currentImageIndex * 100}vw)`
                }}
              >
                {carouselImages.map((image, index) => (
                  <div key={index} className="carousel-slide">
                    <img src={image.src} alt={image.alt} />
                    <div className="hero-overlay"></div>
                  </div>
                ))}
              </div>
              
              {/* Navigation Arrows */}
              <button className="carousel-nav carousel-prev" onClick={prevImage}>
                <ChevronLeft size={24} />
              </button>
              <button className="carousel-nav carousel-next" onClick={nextImage}>
                <ChevronRight size={24} />
              </button>
              
              {/* Dots Indicator */}
              <div className="carousel-dots">
                {carouselImages.map((_, index) => (
                  <button
                    key={index}
                    className={`carousel-dot ${index === currentImageIndex ? 'active' : ''}`}
                    onClick={() => goToImage(index)}
                  />
                ))}
              </div>
              
              <div className="hero-content">
                <h1>Selamat Datang di Tanah Merapi</h1>
                <p>Nikmati keindahan alam di lereng Gunung Merapi</p>
              </div>
              
              {/* Fixed CTA button and social media icons */}
              <div className="hero-fixed-content">
                <Link to="/contact" className="cta-button">
                  Kunjungi Kami
                </Link>
                <div className="hero-social-media">
                  {featuredSocialMedia.map(sm => (
                    <SocialMediaIcon
                      key={sm.id}
                      platform={sm.platform}
                      url={sm.url}
                      isLarge={true}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </section>
      
      {/* About Section */}
      <section className="section about-section">
        <div className="container">
          <h2 className="section-title">Tentang Tanah Merapi</h2>
          <div className="about-content">
            <div className="about-image">
              <img src={aboutImage} alt="Tanah Merapi" />
            </div>
            <div className="about-text">
              <h3>Wisata Alam Outdoor</h3>
              <p>
                Tanah Merapi adalah destinasi wisata alam outdoor yang terletak di lereng Gunung Merapi, Yogyakarta. 
                Kami menawarkan pengalaman wisata yang unik dengan pemandangan yang indah dan udara yang segar.
              </p>
              <p>
                Di Tanah Merapi, Anda dapat menikmati berbagai aktivitas seperti bersantap di kedai alam outdoor, 
                petik jeruk langsung dari kebun, dan menjelajahi keindahan alam dengan jeep.
              </p>
              <Link to="/contact" className="learn-more">
                Pelajari Lebih Lanjut <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      {/* Menu Preview Section */}
      <section className="section menu-preview-section">
        <div className="container">
          <h2 className="section-title">Menu Pilihan</h2>
          <div className="menu-cards">
            {menuItems.map((menuItem) => (
              <div key={menuItem.id} className="menu-card">
                <div className="menu-image">
                  <img 
                    src={`${process.env.REACT_APP_API_URL?.replace('/api', '')}${menuItem.image_url}`} 
                    alt={menuItem.name}
                  />
                </div>
                <div className="menu-info">
                  <h3>{menuItem.name}</h3>
                  <p>{menuItem.description}</p>
                  <div className="menu-price">{formatCurrency(menuItem.price)}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="see-all">
            <Link to="/menu" className="see-all-button">
              Lihat Semua Menu <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>
      
      {/* Packages Preview Section */}
      <section className="section packages-preview-section">
        <div className="container">
          <h2 className="section-title">Paket Jeep & Petik Jeruk</h2>
          <div className="package-cards">
            {packages.map((pkg) => (
              <div key={pkg.id} className="package-card">
                <div className="package-image">
                  <img 
                    src={`${process.env.REACT_APP_API_URL?.replace('/api', '')}${pkg.image_url}`} 
                    alt={pkg.name}
                  />
                </div>
                <div className="package-info">
                  <h3>{pkg.name}</h3>
                  <p>{pkg.description}</p>
                  <div className="package-details">
                    {pkg.items && pkg.items.length > 0 && (
                      <div className="package-items">
                        <span>Termasuk:</span>
                        <ul>
                          {pkg.items.slice(0, 3).map((item, index) => (
                            <li key={index}>{item.item_name}</li>
                          ))}
                          {pkg.items.length > 3 && <li>Dan lainnya...</li>}
                        </ul>
                      </div>
                    )}
                    <div className="package-price">{formatCurrency(pkg.price)}</div>
                  </div>
                  <Link to={`/packages/${pkg.id}`} className="details-button">
                    Lihat Detail
                  </Link>
                </div>
              </div>
            ))}
          </div>
          <div className="see-all">
            <Link to="/packages" className="see-all-button">
              Lihat Semua Paket <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>
      
      {/* Promotions Preview Section */}
      {promotions.length > 0 && (
        <section className="section promotions-preview-section">
          <div className="container">
            <h2 className="section-title">Promo Spesial</h2>
            <div className="promotion-cards">
              {promotions.slice(0, 2).map((promotion) => (
                <div key={promotion.id} className="promotion-card">
                  <div className="promotion-content">
                    <h3>{promotion.title}</h3>
                    <p>{promotion.description}</p>
                    <div className="promotion-discount">
                      <span className="discount-tag">{promotion.discount_percent}% OFF</span>
                    </div>
                    <Link to="/promotions" className="details-button">
                      Lihat Detail
                    </Link>
                  </div>
                  {promotion.image_url && (
                    <div className="promotion-image">
                      <img 
                        src={`${process.env.REACT_APP_API_URL?.replace('/api', '')}${promotion.image_url}`} 
                        alt={promotion.title}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div className="see-all">
              <Link to="/promotions" className="see-all-button">
                Lihat Semua Promo <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </section>
      )}
      
      {/* Contact Section */}
      <section className="section contact-section">
        <div className="container">
          <h2 className="section-title">Kontak & Lokasi</h2>
          <div className="contact-content">
            <div className="contact-info">
              <p>
                Jika Anda memiliki pertanyaan atau ingin melakukan reservasi, 
                jangan ragu untuk menghubungi kami melalui salah satu platform berikut:
              </p>
              <div className="contact-social">
                {socialMedia.map((social) => (
                  <div key={social.id} className="social-contact-item">
                    <SocialMediaIcon 
                      platform={social.platform}
                      url={social.url}
                    />
                    <span>{getSocialMediaDisplay(social.platform, social.url)}</span>
                  </div>
                ))}
              </div>
              <Link to="/contact" className="contact-button">
                Kontak Lengkap
              </Link>
            </div>
            <div className="contact-map">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3800.2784519032593!2d110.4634356!3d-7.600934399999999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e7a670046094faf%3A0x530487b6ab12895c!2sAgrowisata%20Petik%20Jeruk!5e1!3m2!1sen!2sid!4v1752397056703!5m2!1sen!2sid" 
                width="100%" 
                height="500" 
                style={{ border: 0 }} 
                allowFullScreen="" 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                title="Agrowisata Petik Jeruk Location"
              ></iframe>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;