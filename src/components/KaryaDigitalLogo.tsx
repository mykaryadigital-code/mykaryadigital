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

  // Balanced proportional height tokens ensuring zero clipping in 72px header
  const heightClass = {
    sm: 'h-8 sm:h-9',
    md: 'h-10 sm:h-11',
    lg: 'h-14 sm:h-16',
    hero: 'h-24 sm:h-28',
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
          e.currentTarget.src = '/logo_kd.svg';
        }}
      />
    </div>
  );
};
