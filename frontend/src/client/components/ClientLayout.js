import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import './ClientLayout.scss';
import api from '../../utils/api';
import Loader from '../../shared/components/Loader';

const ClientLayout = () => {
  const [socialMedia, setSocialMedia] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchSocialMedia = async () => {
      try {
        const response = await api.get('/social-media');
        setSocialMedia(response.data);
      } catch (error) {
        console.error('Failed to fetch social media links:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchSocialMedia();
  }, []);
  
  if (loading) {
    return <Loader />;
  }
  
  return (
    <div className="client-layout">
      <Navbar socialMedia={socialMedia} />
      <main className="main-content">
        <Outlet context={socialMedia} />
      </main>
      <Footer socialMedia={socialMedia} />
    </div>
  );
};

export default ClientLayout;