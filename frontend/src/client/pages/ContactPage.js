import React from 'react';
import { useOutletContext } from 'react-router-dom';
import './ContactPage.scss';
import SocialMediaIcon from '../../shared/components/SocialMediaIcon';
import { MapPin, Phone, Mail } from 'lucide-react';

const ContactPage = () => {
  const socialMedia = useOutletContext();
  
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
  
  return (
    <div className="contact-page">
      {/* Enhanced Header Section */}
      <section className="contact-header">
        <div className="container">
          <div className="header-content">
            <div className="title-area">
              <Mail size={52} className="title-icon" />
              <div>
                <h1>Hubungi Kami</h1>
                <p>Kami siap membantu Anda dengan informasi dan layanan terbaik</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Contact Section */}
      <section className="section contact-section">
        <div className="container">
          <div className="contact-cards">
            {socialMedia.map((social) => (
              <div key={social.id} className="contact-card">
                <div className="icon-container">
                  <SocialMediaIcon
                    platform={social.platform}
                    url={social.url}
                  />
                </div>
                <div className="contact-info">
                  <h3>{social.platform.charAt(0).toUpperCase() + social.platform.slice(1)}</h3>
                  <p>{getSocialMediaDisplay(social.platform, social.url)}</p>
                  <a href={social.url} target="_blank" rel="noopener noreferrer" className="contact-button">
                    Hubungi
                  </a>
                </div>
              </div>
            ))}
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