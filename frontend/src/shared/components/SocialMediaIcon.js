import React from 'react';
import { Instagram, MessageCircle, MapPin } from 'lucide-react';
import './SocialMediaIcon.scss';

const SocialMediaIcon = ({ platform, url }) => {
  const renderIcon = () => {
    switch (platform) {
      case 'instagram':
        return <Instagram size={24} />;
      case 'whatsapp':
        return <MessageCircle size={24} />;
      case 'tiktok':
        return (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M20 8V13.5C20 17.6421 16.6421 21 12.5 21C8.35786 21 5 17.6421 5 13.5C5 9.35786 8.35786 6 12.5 6V11.5C10.5 11.5 9 12.5 9 14.5C9 16.5 10.5 17.5 12.5 17.5C14.5 17.5 16 16.5 16 14.5V3H20V8Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        );
      case 'gmaps':
        return <MapPin size={24} />;
      default:
        return null;
    }
  };
  
  return (
    <a 
      href={url} 
      target="_blank" 
      rel="noopener noreferrer" 
      className={`social-icon ${platform}`}
    >
      {renderIcon()}
    </a>
  );
};

export default SocialMediaIcon;