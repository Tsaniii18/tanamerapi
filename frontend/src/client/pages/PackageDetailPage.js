import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import './PackageDetailPage.scss';
import Loader from '../../shared/components/Loader';
import { formatCurrency } from '../../utils/formatCurrency';
import { ArrowLeft, MapPin, Check, Apple } from 'lucide-react';

// Custom Jeep Icon since it's not in Lucide
const CustomJeepIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M4 13V16H6L7 16C7.55228 16 8 16.4477 8 17C8 17.5523 7.55228 18 7 18C6.44772 18 6 17.5523 6 17H4C4 18.6569 5.34315 20 7 20C8.65685 20 10 18.6569 10 17C10 15.8954 9.10457 15 8 15H7.5V13H16.5V15H16C14.8954 15 14 15.8954 14 17C14 18.6569 15.3431 20 17 20C18.6569 20 20 18.6569 20 17H18C18 17.5523 17.5523 18 17 18C16.4477 18 16 17.5523 16 17C16 16.4477 16.4477 16 17 16L18 16H20V13H19M6.5 9V11H17.5V9M6.5 9H17.5M6.5 9C4.5 9 4 10.5 4 13M17.5 9C19.5 9 20 10.5 20 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const PackageDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [packageData, setPackageData] = useState(null);
  const [relatedPackages, setRelatedPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [packageResponse, allPackagesResponse] = await Promise.all([
          api.get(`/packages/${id}`),
          api.get('/packages')
        ]);
        
        setPackageData(packageResponse.data);
        
        // Get related packages of the same type (excluding current package)
        const otherPackages = allPackagesResponse.data.filter(pkg => 
          pkg.id !== parseInt(id) && pkg.type === packageResponse.data.type
        );
        // Get random 2 packages
        const randomPackages = otherPackages.sort(() => 0.5 - Math.random()).slice(0, 2);
        setRelatedPackages(randomPackages);
      } catch (error) {
        console.error('Failed to fetch package:', error);
        // If package not found, redirect to packages page
        if (error.response && error.response.status === 404) {
          navigate('/packages');
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
  
  if (!packageData) {
    return (
      <div className="not-found-container">
        <div className="icon-container">
          <CustomJeepIcon />
          <Apple size={24} />
        </div>
        <h2>Paket tidak ditemukan</h2>
        <p>Paket yang Anda cari tidak tersedia.</p>
        <Link to="/packages" className="back-button">
          <ArrowLeft size={18} /> Kembali ke Paket
        </Link>
      </div>
    );
  }
  
  return (
    <div className="package-detail-page">
      <div className="container">
        <div className="breadcrumb">
          <Link to="/packages">
            <ArrowLeft size={18} /> Kembali ke Paket
          </Link>
        </div>
        
        <div className="package-detail">
          <div className="package-image">
            <img 
              src={`${process.env.REACT_APP_API_URL?.replace('/api', '')}${packageData.image_url}`} 
              alt={packageData.name}
            />
            <div className="package-type">
              {packageData.type === 'jeep' ? (
                <>
                  <CustomJeepIcon />
                  <span>Jeep</span>
                </>
              ) : (
                <>
                  <Apple size={20} />
                  <span>Petik Jeruk</span>
                </>
              )}
            </div>
          </div>
          
          <div className="package-info">
            <h1>{packageData.name}</h1>
            
            {packageData.type === 'jeep' && packageData.route && (
              <div className="package-route">
                <MapPin size={20} />
                <span>Rute: {packageData.route}</span>
              </div>
            )}
            
            <div className="package-price">
              <span>Harga Paket:</span>
              <div className="price">{formatCurrency(packageData.price)}</div>
            </div>
            
            <div className="package-description">
              <h3>Deskripsi</h3>
              <p>{packageData.description || 'Tidak ada deskripsi untuk paket ini.'}</p>
            </div>
            
            {packageData.items && packageData.items.length > 0 && (
              <div className="package-includes">
                <h3>Termasuk dalam Paket</h3>
                <ul className="includes-list">
                  {packageData.items.map((item, index) => (
                    <li key={index}>
                      <Check size={18} />
                      <span>{item.item_name}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            <div className="package-cta">
              <a 
                href={`https://wa.me/6281234567890?text=Halo,%20saya%20tertarik%20dengan%20${packageData.name}.%20Apakah%20masih%20tersedia?`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="book-button"
              >
                Pesan Sekarang
              </a>
            </div>
          </div>
        </div>
        
        {relatedPackages.length > 0 && (
          <div className="related-packages">
            <h2>Paket Lainnya</h2>
            <div className="related-grid">
              {relatedPackages.map((pkg) => (
                <Link key={pkg.id} to={`/packages/${pkg.id}`} className="related-card">
                  <div className="related-image">
                    <img 
                      src={`${process.env.REACT_APP_API_URL?.replace('/api', '')}${pkg.image_url}`} 
                      alt={pkg.name}
                    />
                  </div>
                  <div className="related-info">
                    <h3>{pkg.name}</h3>
                    <div className="related-price">{formatCurrency(pkg.price)}</div>
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

export default PackageDetailPage;