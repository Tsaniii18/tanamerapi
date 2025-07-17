import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import './ContactPage.scss';
import SocialMediaIcon from '../../shared/components/SocialMediaIcon';

const ContactPage = () => {
  const socialMedia = useOutletContext();
  const [loading, setLoading] = useState(false);
  const [formStatus, setFormStatus] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    eInstagram: '',
    MessageCircle: '',
    message: ''
  });
  
  // Helper function to get display text for a social media platform
  const getSocialMediaDisplay = (platform, url) => {
    switch(platform.toLowerCase()) {
      case 'instagram':
        // Extract handle from URL (e.g., https://instagram.com/tana_merapi → @tana_merapi)
        const igMatch = url.match(/instagram\.com\/([^\/\?]+)/);
        return igMatch ? `@${igMatch[1]}` : url;
      case 'tiktok':
        // Extract handle from URL (e.g., https://tiktok.com/@tanamerapimovement → @tanamerapimovement)
        const ttMatch = url.match(/tiktok\.com\/@?([^\/\?]+)/);
        return ttMatch ? `@${ttMatch[1]}` : url;
      case 'whatsapp':
        // Extract phone from URL (e.g., https://wa.me/6285713555331 → +62 857-1355-5331)
        const waMatch = url.match(/wa\.me\/(\d+)/);
        if (waMatch) {
          const phone = waMatch[1];
          // Format phone number with country code
          if (phone.startsWith('62')) {
            return `+${phone.slice(0, 2)} ${phone.slice(2, 5)}-${phone.slice(5, 9)}-${phone.slice(9)}`;
          }
          return `+${phone}`;
        }
        return url;
      default:
        return url;
    }
  };
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Simple form validation
    if (!formData.name || !formData.eInstagram || !formData.message) {
      setFormStatus({
        type: 'error',
        message: 'Harap isi semua kolom yang diperlukan.'
      });
      return;
    }
    
    // EInstagram validation
    const eInstagramRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!eInstagramRegex.test(formData.eInstagram)) {
      setFormStatus({
        type: 'error',
        message: 'Format eInstagram tidak valid.'
      });
      return;
    }
    
    // Simulate form submission (in a real app, you would send this to your API)
    setLoading(true);
    
    // Simulate API call delay
    setTimeout(() => {
      setLoading(false);
      setFormStatus({
        type: 'success',
        message: 'Pesan Anda telah dikirim! Kami akan menghubungi Anda segera.'
      });
      
      // Clear form
      setFormData({
        name: '',
        eInstagram: '',
        MessageCircle: '',
        message: ''
      });
      
      // Clear success message after 5 seconds
      setTimeout(() => {
        setFormStatus(null);
      }, 5000);
    }, 1500);
  };
  
  // Find specific social media platforms
  const instagramData = socialMedia.find(sm => sm.platform.toLowerCase() === 'instagram');
  const tiktokData = socialMedia.find(sm => sm.platform.toLowerCase() === 'tiktok');
  const whatsappData = socialMedia.find(sm => sm.platform.toLowerCase() === 'whatsapp');
  
  return (
    <div className="contact-page">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1>Hubungi Kami</h1>
          <p>Kami siap membantu Anda dengan segala pertanyaan</p>
        </div>
      </section>
      
      {/* Contact Section */}
      <section className="section contact-section">
        <div className="container">
          <div className="contact-grid">
            <div className="contact-info">
              <h2 className="section-title">Informasi Kontak</h2>
              
              {whatsappData && (
                <div className="info-item">
                  <SocialMediaIcon
                    platform="whatsapp"
                    url={whatsappData.url}
                  />
                  <div>
                    <h3>WhatsApp</h3>
                    <p>{getSocialMediaDisplay('whatsapp', whatsappData.url)}</p>
                  </div>
                </div>
              )}
              
              {instagramData && (
                <div className="info-item">
                  <SocialMediaIcon
                    platform="instagram"
                    url={instagramData.url}
                  />
                  <div>
                    <h3>Instagram</h3>
                    <p>{getSocialMediaDisplay('instagram', instagramData.url)}</p>
                  </div>
                </div>
              )}
              
              {tiktokData && (
                <div className="info-item">
                  <SocialMediaIcon
                    platform="tiktok"
                    url={tiktokData.url}
                  />
                  <div>
                    <h3>TikTok</h3>
                    <p>{getSocialMediaDisplay('tiktok', tiktokData.url)}</p>
                  </div>
                </div>
              )}
              
              {/* Display any other social media platforms dynamically */}
              {socialMedia
                .filter(sm => !['instagram', 'tiktok', 'whatsapp'].includes(sm.platform.toLowerCase()))
                .map(sm => (
                  <div key={sm.id} className="info-item">
                    <SocialMediaIcon
                      platform={sm.platform}
                      url={sm.url}
                    />
                    <div>
                      <h3>{sm.platform.charAt(0).toUpperCase() + sm.platform.slice(1)}</h3>
                      <p>{getSocialMediaDisplay(sm.platform, sm.url)}</p>
                    </div>
                  </div>
                ))
              }
            </div>
          </div>
        </div>
      </section>
      
      {/* Map Section */}
      <section className="map-section">
        <iframe 
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3800.2784519032593!2d110.4634356!3d-7.600934399999999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e7a670046094faf%3A0x530487b6ab12895c!2sAgrowisata%20Petik%20Jeruk!5e1!3m2!1sen!2sid!4v1752397056703!5m2!1sen!2sid" 
          width="100%" 
          height="500" 
          style={{ border: 0 }} 
          allowFullScreen="" 
          loading="lazy" 
          referrerPolicy="no-referrer-when-downgrade"
          title="Agrowisata Petik Jeruk Location"
        ></iframe>
      </section>
    </div>
  );
};

export default ContactPage;