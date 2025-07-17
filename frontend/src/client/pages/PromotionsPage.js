import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';
import './PromotionsPage.scss';
import Loader from '../../shared/components/Loader';
import { formatCurrency, formatDate } from '../../utils/formatCurrency';
import { Tag, Percent, Calendar, AlertCircle } from 'lucide-react';

const PromotionsPage = () => {
  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(true);
  
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
  
  return (
    <div className="promotions-page">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1>Promo Spesial</h1>
          <p>Nikmati penawaran terbaik untuk pengalaman di Tanah Merapi</p>
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
                        <h3>{promotion.title}</h3>
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