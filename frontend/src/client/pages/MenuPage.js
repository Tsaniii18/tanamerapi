import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';
import './MenuPage.scss';
import Loader from '../../shared/components/Loader';
import { formatCurrency } from '../../utils/formatCurrency';
import { Coffee, Search } from 'lucide-react';

const MenuPage = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const response = await api.get('/menu-items');
        setMenuItems(response.data);
      } catch (error) {
        console.error('Failed to fetch menu items:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchMenuItems();
  }, []);
  
  const filteredMenuItems = menuItems.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  
  return (
    <div className="menu-page">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1>Menu Kedai Tanah Merapi</h1>
          <p>Nikmati hidangan kami dengan suasana alam yang menyegarkan</p>
        </div>
      </section>
      
      {/* Menu Section */}
      <section className="section menu-section">
        <div className="container">
          <div className="search-container">
            <div className="search-input">
              <Search size={20} />
              <input 
                type="text" 
                placeholder="Cari menu..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          {loading ? (
            <Loader />
          ) : filteredMenuItems.length > 0 ? (
            <div className="menu-grid">
              {filteredMenuItems.map((menuItem) => (
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
                    <Link to={`/menu/${menuItem.id}`} className="details-button">
                      Lihat Detail
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-results">
              <Coffee size={48} />
              <h3>Menu Tidak Ditemukan</h3>
              <p>Coba kata kunci pencarian lain atau lihat semua menu kami.</p>
              {searchTerm && (
                <button 
                  className="reset-button"
                  onClick={() => setSearchTerm('')}
                >
                  Lihat Semua Menu
                </button>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default MenuPage;