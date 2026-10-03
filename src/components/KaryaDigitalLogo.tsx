import React from 'react';

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
  // Sizing tokens: "Karya Digital" tebal (bold 700), "Berkarya Tanpa Sempadan" lebih kecil di bawah
  const sizeConfig = {
    sm: {
      textPrimary: 'text-sm sm:text-[15px]',
      textSecondary: 'text-[8.5px] sm:text-[9.5px]',
      spacing: 'mt-0.5',
    },
    md: {
      textPrimary: 'text-base sm:text-[19px]',
      textSecondary: 'text-[9.5px] sm:text-[10.5px]',
      spacing: 'mt-0.5',
    },
    lg: {
      textPrimary: 'text-xl sm:text-2xl',
      textSecondary: 'text-xs sm:text-sm',
      spacing: 'mt-1',
    },
    hero: {
      textPrimary: 'text-2xl sm:text-3xl',
      textSecondary: 'text-sm sm:text-base',
      spacing: 'mt-1.5',
    },
  }[size];

  return (
    <div
      className={`inline-flex flex-col justify-center text-left select-none leading-none ${className}`}
      style={{ fontFamily: "'Poppins', sans-serif" }}
    >
      {/* "Karya Digital" - Tambah Ketebalan (Bold / 700) */}
      <span
        className={`font-bold tracking-tight text-[#006B57] dark:text-emerald-400 leading-tight ${sizeConfig.textPrimary}`}
        style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700 }}
      >
        Karya Digital
      </span>

      {/* "Berkarya Tanpa Sempadan" - Lebih kecil & diletakkan di bawah */}
      <span
        className={`font-medium tracking-wide text-slate-500 dark:text-slate-400 leading-none ${sizeConfig.spacing} ${sizeConfig.textSecondary}`}
        style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 500 }}
      >
        Berkarya Tanpa Sempadan
      </span>
    </div>
  );
};
