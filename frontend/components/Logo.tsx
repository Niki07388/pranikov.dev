
import React, { useEffect, useState } from 'react';
import { storage } from '../services/storageService';

const Logo: React.FC<{ className?: string }> = ({ className = "w-10 h-10" }) => {
  const [customLogo, setCustomLogo] = useState<string | null>(null);

  useEffect(() => {
    const about = storage.getAbout();
    if (about?.logo) {
      setCustomLogo(about.logo);
    }
  }, []);

  if (customLogo) {
    return (
      <img 
        src={customLogo} 
        alt="Corporate Logo" 
        className={`${className} object-contain`} 
      />
    );
  }

  return (
    <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Background swirl blue */}
      <path d="M50 5C25.1472 5 5 25.1472 5 50C5 74.8528 25.1472 95 50 95C74.8528 95 95 74.8528 95 50C95 25.1472 74.8528 5 50 5ZM50 85C30.67 85 15 69.33 15 50C15 30.67 30.67 15 50 15C69.33 15 85 30.67 85 50C85 69.33 69.33 85 50 85Z" fill="#234582" fillOpacity="0.2"/>
      
      {/* Blue Top Arc */}
      <path d="M50 5C74.8528 5 95 25.1472 95 50C95 55.4851 94.0152 60.74 92.2195 65.6186C89.4716 50.8447 77.8398 38.835 63.3854 35.8456C59.208 34.9818 54.7431 35.2155 50.597 36.4398C51.6441 35.5393 52.7937 34.7397 54.0298 34.0531C64.3828 28.3023 76.5448 27.5678 87.5 32C79 17 65.5 10 50 10C34.5 10 21 17 12.5 32C17.5 25 25.5 15 50 5Z" fill="#234582"/>
      
      {/* Orange Bottom/Left Arc */}
      <path d="M50 95C25.1472 95 5 74.8528 5 50C5 40.5283 7.92542 31.7371 12.915 24.4789C13.4371 42.103 26.6853 56.7725 43.6192 59.508C50.9416 60.6908 58.2678 58.6833 63.7845 54.3409C62.485 56.4172 60.8988 58.2917 59.0345 59.9079C47.8596 69.6053 31.4243 68.8073 21.085 58C28 78 45 90 50 90C65 90 77 82 85 70C80 75 70 85 50 95Z" fill="#F37021"/>
      
      {/* Central P Stem */}
      <path d="M42 35V85H48V45C55 45 62 48 62 55C62 62 55 65 48 65H42" stroke="#F37021" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M42 35C42 27 50 20 60 20C70 20 78 27 78 35C78 43 70 50 60 50H42" fill="#F37021"/>
    </svg>
  );
};

export default Logo;
