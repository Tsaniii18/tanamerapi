import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import './PromotionDetailPage.scss';
import Loader from '../../shared/components/Loader';
import { formatCurrency, formatDate } from '../../utils/formatCurrency';
import { ArrowLeft, Percent, Calendar, Tag, AlertCircle, MapPin, Check } from 'lucide-react';

const PromotionDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [promotion, setPromotion] = useState(null);
  const [primaryPackage, setPrimaryPackage] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchPromotion = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/promotions/${id}`);
        setPromotion(response.data);
        
        // Find the primary package if it exists
        if (response.data.primary_package_id && response.data.packages) {
          const primary = response.data.packages.find(
            pkg => pkg.id === response.data.primary_package_id
          );
          setPrimaryPackage(primary || response.data.packages[0]);
        } else if (response.data.packages && response.data.packages.length > 0) {
          setPrimaryPackage(response.data.packages[0]);
        }
      } catch (error) {
        console.error('Failed to fetch promotion:', error);
        // If promotion not found, redirect to promotions page
        if (error.response && error.response.status === 404) {
          navigate('/promotions');
        }
      } finally {
        setLoading(false);
      }
    };
    
    fetchPromotion();
  }, [id, navigate]);
  
  // Calculate the discounted price
  const calculateDiscountedPrice = (originalPrice, discountPercent) => {
    return originalPrice - (originalPrice * discountPercent / 100);
  };
  
  if (loading) {
    return <Loader />;
  }
  
  if (!promotion) {
    return (
      <div className="not-found-container">
        <AlertCircle size={48} />
        <h2>Promo tidak ditemukan</h2>
        <p>Promo yang Anda cari tidak tersedia.</p>
        <Link to="/promotions" className="back-button">
          <ArrowLeft size={18} /> Kembali ke Promo
        </Link>
      </div>
    );
  }
  
  return (
    <div className="promotion-detail-page">
      <div className="container">
        <div className="breadcrumb">
          <Link to="/promotions">
            <ArrowLeft size={18} /> Kembali ke Promo
          </Link>
        </div>
        
        <div className="promotion-detail">
          {promotion.image_url && (
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
          )}
          
          <div className="promotion-info">
            <h1>{promotion.title}</h1>
            
            {/* Display primary package details if available */}
            {primaryPackage && (
              <div className="primary-package-info">
                <h3 className="primary-package-title">{primaryPackage.name}</h3>
                <p className="promotion-description">{primaryPackage.description}</p>
                
                {primaryPackage.type === 'jeep' && primaryPackage.route && (
                  <div className="package-route">
                    <MapPin size={18} />
                    <span>Rute: {primaryPackage.route}</span>
                  </div>
                )}
                
                {primaryPackage.items && primaryPackage.items.length > 0 && (
                  <div className="package-includes">
                    <h4>Termasuk dalam Paket</h4>
                    <ul className="includes-list">
                      {primaryPackage.items.map((item, index) => (
                        <li key={index}>
                          <Check size={16} />
                          <span>{item.item_name}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
                <div className="package-price-comparison">
                  <div className="original-price">
                    <span>Harga Normal</span>
                    <div className="price">{formatCurrency(primaryPackage.price)}</div>
                  </div>
                  <div className="arrow">→</div>
                  <div className="discounted-price">
                    <span>Harga Promo</span>
                    <div className="price">
                      {formatCurrency(calculateDiscountedPrice(primaryPackage.price, promotion.discount_percent))}
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* If no primary package but promotion has description */}
            {!primaryPackage && promotion.description && (
              <p className="promotion-description">{promotion.description}</p>
            )}
            
            <div className="promotion-validity">
              <Calendar size={18} />
              <span>
                Berlaku: {formatDate(promotion.valid_from)} - {formatDate(promotion.valid_until)}
              </span>
            </div>
            
            <div className="promotion-terms">
              <h3>Syarat dan Ketentuan</h3>
              <div className="terms-content">
                {promotion.terms ? (
                  <p>{promotion.terms}</p>
                ) : (
                  <p>Tidak ada syarat khusus untuk promo ini.</p>
                )}
              </div>
            </div>
            
            {promotion.packages && promotion.packages.length > 1 && (
              <div className="promotion-packages">
                <h3>Paket Lainnya yang Tersedia</h3>
                <div className="packages-list">
                  {promotion.packages
                    .filter(pkg => !primaryPackage || pkg.id !== primaryPackage.id)
                    .map(pkg => (
                      <div key={pkg.id} className="package-item">
                        <div className="package-info">
                          <h4>{pkg.name}</h4>
                          <p>{pkg.description}</p>
                        </div>
                        <div className="package-price">
                          <div className="original">
                            <span>Harga Normal</span>
                            <div className="price">{formatCurrency(pkg.price)}</div>
                          </div>
                          <div className="discounted">
                            <span>Harga Promo</span>
                            <div className="price">
                              {formatCurrency(calculateDiscountedPrice(pkg.price, promotion.discount_percent))}
                            </div>
                          </div>
                        </div>
                        <Link to={`/packages/${pkg.id}`} className="view-button">
                          Lihat Paket
                        </Link>
                      </div>
                    ))}
                </div>
              </div>
            )}
            
            <div className="promotion-cta">
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
        </div>
      </div>
    </div>
  );
};

export default PromotionDetailPage;