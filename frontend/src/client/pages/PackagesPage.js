import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';
import './PackagesPage.scss';
import Loader from '../../shared/components/Loader';
import { formatCurrency } from '../../utils/formatCurrency';
import { MapPin, Search, Apple, Car } from 'lucide-react';

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
    // Filter by search
    return (
      pkg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (pkg.description && pkg.description.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  });
  
  return (
    <div className="packages-page">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1>Paket Jeep & Petik Jeruk</h1>
          <p>Nikmati pengalaman menarik di Tanah Merapi</p>
        </div>
      </section>
      
      {/* Packages Section */}
      <section className="section packages-section">
        <div className="container">
          <div className="filters">
            <div className="search-container">
              <div className="search-input">
                <Search size={20} />
                <input 
                  type="text" 
                  placeholder="Cari paket..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>
          
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
                    <div className="package-type">
                      {pkg.type === 'jeep' ? (
                        <>
                          <Car size={20}/>
                          <span>Jeep</span>
                        </>
                      ) : (
                        <>
                          <Apple size={20}/>
                          <span>Petik Jeruk</span>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="package-info">
                    <h3>{pkg.name}</h3>
                    {pkg.type === 'jeep' && pkg.route && (
                      <div className="package-route">
                        <MapPin size={16} />
                        <span>{pkg.route}</span>
                      </div>
                    )}
                    <p>{pkg.description}</p>
                    
                    {pkg.items && pkg.items.length > 0 && (
                      <div className="package-items">
                        <span>Termasuk:</span>
                        <ul>
                          {pkg.items.slice(0, 4).map((item, index) => (
                            <li key={index}>{item.item_name}</li>
                          ))}
                          {pkg.items.length > 4 && <li>Dan lainnya...</li>}
                        </ul>
                      </div>
                    )}
                    
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
                  <Car size={24}/>
                  <Apple size={24} />
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