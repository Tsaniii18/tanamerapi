import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import './MenuDetailPage.scss';
import Loader from '../../shared/components/Loader';
import { formatCurrency } from '../../utils/formatCurrency';
import { ArrowLeft, Coffee } from 'lucide-react';

const MenuDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [menuItem, setMenuItem] = useState(null);
  const [relatedItems, setRelatedItems] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [itemResponse, allItemsResponse] = await Promise.all([
          api.get(`/menu-items/${id}`),
          api.get('/menu-items')
        ]);
        
        setMenuItem(itemResponse.data);
        
        // Get related items (excluding current item)
        const otherItems = allItemsResponse.data.filter(item => item.id !== parseInt(id));
        // Get random 3 items
        const randomItems = otherItems.sort(() => 0.5 - Math.random()).slice(0, 3);
        setRelatedItems(randomItems);
      } catch (error) {
        console.error('Failed to fetch menu item:', error);
        // If item not found, redirect to menu page
        if (error.response && error.response.status === 404) {
          navigate('/menu');
        }
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [id, navigate]);
  
  if (loading) {
    return <Loader />;
  }
  
  if (!menuItem) {
    return (
      <div className="not-found-container">
        <Coffee size={48} />
        <h2>Menu tidak ditemukan</h2>
        <p>Menu yang Anda cari tidak tersedia.</p>
        <Link to="/menu" className="back-button">
          <ArrowLeft size={18} /> Kembali ke Menu
        </Link>
      </div>
    );
  }
  
  return (
    <div className="menu-detail-page">
      <div className="container">
        <div className="breadcrumb">
          <Link to="/menu">
            <ArrowLeft size={18} /> Kembali ke Menu
          </Link>
        </div>
        
        <div className="menu-detail">
          <div className="menu-image">
            <img 
              src={`${process.env.REACT_APP_API_URL?.replace('/api', '')}${menuItem.image_url}`} 
              alt={menuItem.name}
            />
          </div>
          
          <div className="menu-info">
            <h1>{menuItem.name}</h1>
            <div className="menu-price">{formatCurrency(menuItem.price)}</div>
            <div className="menu-description">
              <h3>Deskripsi</h3>
              <p>{menuItem.description || 'Tidak ada deskripsi untuk menu ini.'}</p>
            </div>
            <div className="menu-cta">
              <a 
                href={`https://wa.me/6281234567890?text=Halo,%20saya%20tertarik%20dengan%20${menuItem.name}.%20Apakah%20masih%20tersedia?`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="order-button"
              >
                Pesan Sekarang
              </a>
            </div>
          </div>
        </div>
        
        {relatedItems.length > 0 && (
          <div className="related-menu">
            <h2>Menu Lainnya</h2>
            <div className="related-grid">
              {relatedItems.map((item) => (
                <Link key={item.id} to={`/menu/${item.id}`} className="related-card">
                  <div className="related-image">
                    <img 
                      src={`${process.env.REACT_APP_API_URL?.replace('/api', '')}${item.image_url}`} 
                      alt={item.name}
                    />
                  </div>
                  <div className="related-info">
                    <h3>{item.name}</h3>
                    <div className="related-price">{formatCurrency(item.price)}</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MenuDetailPage;