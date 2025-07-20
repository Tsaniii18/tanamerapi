// PackagesPage.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';
import './PackagesPage.scss';
import Loader from '../../shared/components/Loader';
import { formatCurrency } from '../../utils/formatCurrency';
import { Search, Package } from 'lucide-react';

const PackagesPage = () => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const response = await api.get('/packages');
        setPackages(response.data);
      } catch (error) {
        console.error('Failed to fetch packages:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchPackages();
  }, []);
  
  const filteredPackages = packages.filter(pkg => {
    return (
      pkg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (pkg.description && pkg.description.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  });
  
  return (
    <div className="packages-page">
      <section className="packages-header">
        <div className="container">
          <div className="header-content">
            <div className="title-area">
              <Package size={62} className="title-icon" />
              <div>
                <h1>Paket Wisata</h1>
                <p>Jelajahi berbagai paket wisata menarik di kawasan Tanah Merapi</p>
              </div>
            </div>
            
            <div className="search-container">
              <div className="search-input">
                <Search size={20} />
                <input 
                  type="text" 
                  placeholder="Cari paket wisata..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <section className="section packages-section">
        <div className="container">
          {loading ? (
            <Loader />
          ) : filteredPackages.length > 0 ? (
            <div className="packages-grid">
              {filteredPackages.map((pkg) => (
                <div key={pkg.id} className="package-card">
                  <div className="package-image">
                    <img 
                      src={`${process.env.REACT_APP_API_URL?.replace('/api', '')}${pkg.image_url}`} 
                      alt={pkg.name}
                    />
                  </div>
                  <div className="package-info">
                    <h3>{pkg.name}</h3>
                    {pkg.route && (
                      <div className="package-route">
                        <span className="route-label">Rute:</span>
                        <span className="route-text">{pkg.route}</span>
                      </div>
                    )}
                    <p>{pkg.description}</p>
                    
                    <div className="package-footer">
                      <div className="package-price">{formatCurrency(pkg.price)}</div>
                      <Link to={`/packages/${pkg.id}`} className="details-button">
                        Lihat Detail
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-results">
              <div className="icon-container">
                <div className="icon-group">
                  <Package size={48} />
                </div>
              </div>
              <h3>Paket Tidak Ditemukan</h3>
              <p>Coba kata kunci pencarian lain atau lihat semua paket kami.</p>
              {searchTerm && (
                <button 
                  className="reset-button"
                  onClick={() => setSearchTerm('')}
                >
                  Lihat Semua Paket
                </button>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default PackagesPage;