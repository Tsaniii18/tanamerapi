// PackageDetailPage.js
import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import './PackageDetailPage.scss';
import Loader from '../../shared/components/Loader';
import { formatCurrency } from '../../utils/formatCurrency';
import { ArrowLeft, Package } from 'lucide-react';

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
        
        // Get random 2 packages (excluding current package)
        const otherPackages = allPackagesResponse.data.filter(pkg => 
          pkg.id !== parseInt(id)
        );
        const randomPackages = otherPackages.sort(() => 0.5 - Math.random()).slice(0, 2);
        setRelatedPackages(randomPackages);
      } catch (error) {
        console.error('Failed to fetch package:', error);
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
          <Package size={40} />
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
          </div>
          
          <div className="package-info">
            <h1>{packageData.name}</h1>
            
            <div className="package-price">
              <span>Harga Paket:</span>
              <div className="price">{formatCurrency(packageData.price)}</div>
            </div>
            
            {packageData.description && (
              <div className="package-description">
                <h3>Deskripsi</h3>
                <div className="description-text">
                  {packageData.description.split('\n').map((line, index) => (
                    <React.Fragment key={index}>
                      {line}
                      {index < packageData.description.split('\n').length - 1 && <br />}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            )}
            
            {packageData.route && (
              <div className="package-route">
                <h3>Rute</h3>
                <p>{packageData.route}</p>
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