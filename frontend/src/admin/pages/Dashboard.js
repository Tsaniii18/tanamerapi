import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';
import './Dashboard.scss';
import { 
  Image, 
  Coffee, 
  Package, 
  Tag, 
  Share2, 
  Plus,
  Clock
} from 'lucide-react';
import Loader from '../../shared/components/Loader';
import { formatDate } from '../../utils/formatCurrency';

const Dashboard = () => {
  const [stats, setStats] = useState({
    slides: 0,
    menuItems: 0,
    packages: 0,
    promotions: 0,
    socialMedia: 0
  });
  const [latestPromotions, setLatestPromotions] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch data from all endpoints
        const [
          slidesRes,
          menuItemsRes,
          packagesRes,
          promotionsRes,
          socialMediaRes
        ] = await Promise.all([
          api.get('/slides'),
          api.get('/menu-items'),
          api.get('/packages'),
          api.get('/promotions'),
          api.get('/social-media')
        ]);
        
        // Update stats
        setStats({
          slides: slidesRes.data.length,
          menuItems: menuItemsRes.data.length,
          packages: packagesRes.data.length,
          promotions: promotionsRes.data.length,
          socialMedia: socialMediaRes.data.length
        });
        
        // Get latest promotions
        const sortedPromotions = promotionsRes.data
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 3);
        
        setLatestPromotions(sortedPromotions);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  if (loading) {
    return <Loader />;
  }
  
  return (
    <div className="dashboard-page">
      <div className="welcome-card">
        <div className="welcome-message">
          <h1>Selamat Datang di Admin Dashboard</h1>
          <p>Kelola konten website Tanah Merapi dengan mudah melalui dashboard ini.</p>
        </div>
      </div>
      
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">
            <Image size={28} />
          </div>
          <div className="stat-info">
            <h3>Slides</h3>
            <p>{stats.slides}</p>
          </div>
          <Link to="/admin/slides" className="stat-action">
            Kelola Slides
          </Link>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">
            <Coffee size={28} />
          </div>
          <div className="stat-info">
            <h3>Menu</h3>
            <p>{stats.menuItems}</p>
          </div>
          <Link to="/admin/menu-items" className="stat-action">
            Kelola Menu
          </Link>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">
            <Package size={28} />
          </div>
          <div className="stat-info">
            <h3>Paket</h3>
            <p>{stats.packages}</p>
          </div>
          <Link to="/admin/packages" className="stat-action">
            Kelola Paket
          </Link>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">
            <Tag size={28} />
          </div>
          <div className="stat-info">
            <h3>Promo</h3>
            <p>{stats.promotions}</p>
          </div>
          <Link to="/admin/promotions" className="stat-action">
            Kelola Promo
          </Link>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">
            <Share2 size={28} />
          </div>
          <div className="stat-info">
            <h3>Social Media</h3>
            <p>{stats.socialMedia}</p>
          </div>
          <Link to="/admin/social-media" className="stat-action">
            Kelola Social Media
          </Link>
        </div>
      </div>
      
      <div className="dashboard-sections">
        <div className="dashboard-section">
          <div className="section-header">
            <h2>Promo Terbaru</h2>
            <Link to="/admin/promotions" className="view-all">
              Lihat Semua
            </Link>
          </div>
          
          {latestPromotions.length > 0 ? (
            <div className="promotions-list">
              {latestPromotions.map((promotion) => (
                <div key={promotion.id} className="promotion-card">
                  <div className="promotion-info">
                    <h3>{promotion.title}</h3>
                    <p>{promotion.description}</p>
                    <div className="promotion-meta">
                      <div className="discount">
                        <Tag size={16} />
                        <span>{promotion.discount_percent}% OFF</span>
                      </div>
                      <div className="validity">
                        <Clock size={16} />
                        <span>
                          {formatDate(promotion.valid_from)} - {formatDate(promotion.valid_until)}
                        </span>
                      </div>
                    </div>
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
          ) : (
            <div className="empty-state">
              <p>Tidak ada promo yang tersedia.</p>
              <Link to="/admin/promotions" className="create-button">
                <Plus size={16} />
                <span>Buat Promo Baru</span>
              </Link>
            </div>
          )}
        </div>
      </div>
      
      <div className="quick-actions">
        <h2>Tindakan Cepat</h2>
        <div className="actions-grid">
          <Link to="/admin/slides" className="action-card">
            <Image size={24} />
            <span>Tambah Slide</span>
          </Link>
          
          <Link to="/admin/menu-items" className="action-card">
            <Coffee size={24} />
            <span>Tambah Menu</span>
          </Link>
          
          <Link to="/admin/packages" className="action-card">
            <Package size={24} />
            <span>Tambah Paket</span>
          </Link>
          
          <Link to="/admin/promotions" className="action-card">
            <Tag size={24} />
            <span>Tambah Promo</span>
          </Link>
          
          <Link to="/admin/social-media" className="action-card">
            <Share2 size={24} />
            <span>Tambah Social Media</span>
          </Link>
          
          <a 
            href="/" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="action-card preview"
          >
            <span>Preview Website</span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;