import React, { useState, useEffect } from 'react';

interface KaryaDigitalLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'hero';
  showTagline?: boolean;
  allowUpload?: boolean;
}

export const KaryaDigitalLogo: React.FC<KaryaDigitalLogoProps> = ({
  className = '',
  size = 'md',
}) => {
  const [customLogoUrl, setCustomLogoUrl] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('karya_digital_custom_logo');
    if (saved) {
      setCustomLogoUrl(saved);
    }
  }, []);

  // Responsive height matching the navbar without any clipping
  const heightClass = {
    sm: 'h-10',
    md: 'h-14 sm:h-16',
    lg: 'h-20 sm:h-24',
    hero: 'h-32 sm:h-44',
  }[size];

  const logoSrc = customLogoUrl || '/logo_kd.svg';

  return (
    <div className={`inline-flex items-center shrink-0 select-none ${className}`}>
      <img
        src={logoSrc}
        alt="Karya Digital - Berkarya Tanpa Sempadan"
        className={`${heightClass} w-auto object-contain drop-shadow-2xs`}
        loading="eager"
        onError={(e) => {
          // Fallback if SVG asset is loading
          e.currentTarget.src = '/logo_kd.svg';
        }}
      />
    </div>
  );
};
