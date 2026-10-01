import React, { useState, useEffect, useRef } from 'react';
import { Upload, RotateCcw } from 'lucide-react';

interface KaryaDigitalLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'hero';
  showTagline?: boolean;
  allowUpload?: boolean;
}

export const KaryaDigitalLogo: React.FC<KaryaDigitalLogoProps> = ({
  className = '',
  size = 'md',
  showTagline = true,
  allowUpload = true,
}) => {
  const [customLogoUrl, setCustomLogoUrl] = useState<string | null>(null);
  const [showUploadOption, setShowUploadOption] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('karya_digital_custom_logo');
      if (saved) {
        setCustomLogoUrl(saved);
      }
    } catch (e) {
      // Ignore localStorage errors
    }
  }, []);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        setCustomLogoUrl(result);
        try {
          localStorage.setItem('karya_digital_custom_logo', result);
        } catch (err) {
          console.warn('Gagal menyimpan logo ke localStorage:', err);
        }
      }
    };
    reader.readAsDataURL(file);
  };

  const handleResetLogo = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCustomLogoUrl(null);
    try {
      localStorage.removeItem('karya_digital_custom_logo');
    } catch (err) {
      // Ignore
    }
  };

  // Dimensions token
  const config = {
    sm: {
      monogramSize: 'w-7 h-7',
      titleSize: 'text-base',
      taglineSize: 'text-[8.5px]',
      gap: 'gap-2',
      tagline: false,
    },
    md: {
      monogramSize: 'w-9 h-9 sm:w-10 sm:h-10',
      titleSize: 'text-lg sm:text-[21px]',
      taglineSize: 'text-[9.5px] sm:text-[10.5px]',
      gap: 'gap-2.5 sm:gap-3',
      tagline: showTagline,
    },
    lg: {
      monogramSize: 'w-14 h-14',
      titleSize: 'text-2xl sm:text-3xl',
      taglineSize: 'text-xs',
      gap: 'gap-3.5',
      tagline: true,
    },
    hero: {
      monogramSize: 'w-20 h-20',
      titleSize: 'text-3xl sm:text-4xl',
      taglineSize: 'text-sm',
      gap: 'gap-4',
      tagline: true,
    },
  }[size];

  return (
    <div
      className={`relative inline-flex items-center select-none group ${className}`}
      onMouseEnter={() => allowUpload && setShowUploadOption(true)}
      onMouseLeave={() => setShowUploadOption(false)}
    >
      {/* Hidden File Input for Custom Official Logo */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        accept="image/png,image/jpeg,image/svg+xml,image/webp"
        className="hidden"
      />

      {customLogoUrl ? (
        /* If custom official logo image is uploaded */
        <div className="flex items-center gap-2.5">
          <img
            src={customLogoUrl}
            alt="Karya Digital Official Logo"
            className={`${size === 'sm' ? 'h-8' : size === 'md' ? 'h-10 sm:h-11' : 'h-16'} w-auto object-contain drop-shadow-2xs`}
          />
        </div>
      ) : (
        /* Native High-Resolution Horizontal Vector Brand Lockup */
        <div className={`flex items-center ${config.gap}`}>
          {/* Official KD Monogram Vector */}
          <div className={`${config.monogramSize} shrink-0 drop-shadow-2xs flex items-center justify-center`}>
            <svg
              viewBox="100 95 745 460"
              className="w-full h-full"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g fill="#006B57">
                {/* Letter K Left Vertical Column with Bracketed Serifs */}
                <path d="M 120 110 L 255 110 L 255 128 C 235 128 224 138 224 160 L 224 450 C 224 472 235 482 255 482 L 255 500 L 120 500 L 120 482 C 140 482 151 472 151 450 L 151 160 C 151 138 140 128 120 128 Z" />

                {/* Letter K Top Diagonal Arm with Upper-Right Serif */}
                <path d="M 224 285 L 395 110 L 442 110 L 442 128 C 420 128 406 138 388 160 L 268 290 L 375 422 C 398 450 418 462 445 464 L 445 482 C 415 482 382 475 352 442 L 252 316 L 224 345 L 224 285 Z" />
                <path d="M 380 110 L 448 110 L 448 128 C 425 128 412 138 392 160 L 360 196 L 330 162 L 380 110 Z" />

                {/* Letter K Iconic Lower Swooping Calligraphy Tail (cradles underneath D) */}
                <path d="M 240 310 L 345 428 C 405 496, 488 528, 595 528 C 715 528, 788 496, 820 460 C 830 450, 835 440, 838 428 C 830 460, 762 546, 595 546 C 475 546, 388 510, 318 430 L 224 324 Z" />

                {/* Letter D Left Vertical Stem */}
                <path d="M 335 110 L 445 110 L 445 128 C 426 128 416 138 416 160 L 416 450 C 416 472 426 482 445 482 L 445 500 L 335 500 L 335 482 C 354 482 364 472 364 450 L 364 160 C 364 138 354 128 335 128 Z" />

                {/* Letter D Semicircular Curved Outer Bowl & Oblong Inner Counter */}
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M 416 110 H 545 C 690 110, 792 196, 792 305 C 792 414, 690 500, 545 500 H 416 V 464 H 540 C 652 464, 725 398, 725 305 C 725 212, 652 146, 540 146 H 416 V 110 Z"
                />
              </g>
            </svg>
          </div>

          {/* Typography Lockup: Karya Digital + Berkarya Tanpa Sempadan */}
          <div className="flex flex-col justify-center text-left leading-none">
            <span
              className={`font-serif-book font-black ${config.titleSize} text-[#006B57] tracking-tight leading-tight`}
              style={{ fontFamily: "'Playfair Display', 'Newsreader', 'Lora', Georgia, serif" }}
            >
              Karya Digital
            </span>
            {config.tagline && (
              <span
                className={`font-serif-book ${config.taglineSize} text-[#006B57]/80 font-medium tracking-wide mt-0.5 leading-none`}
                style={{ fontFamily: "'Lora', 'Newsreader', Georgia, serif" }}
              >
                Berkarya Tanpa Sempadan
              </span>
            )}
          </div>
        </div>
      )}

      {/* Optional Upload Badge on hover for author/user if they want their custom file */}
      {allowUpload && showUploadOption && (
        <div className="absolute -bottom-8 left-0 z-50 flex items-center gap-1.5 bg-[#063F35] text-white text-[10px] font-semibold py-1 px-2.5 rounded-lg shadow-lg animate-in fade-in-50 duration-150 whitespace-nowrap">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              fileInputRef.current?.click();
            }}
            className="flex items-center gap-1 hover:text-emerald-300 cursor-pointer"
            title="Muat naik fail logo rasmi (PNG/SVG)"
          >
            <Upload className="w-3 h-3 text-emerald-300" />
            <span>Unggah Logo Asal</span>
          </button>
          {customLogoUrl && (
            <>
              <span className="text-white/40">|</span>
              <button
                type="button"
                onClick={handleResetLogo}
                className="flex items-center gap-1 hover:text-rose-300 text-rose-200 cursor-pointer"
                title="Kembalikan kepada logo vektor standard"
              >
                <RotateCcw className="w-2.5 h-2.5" />
                <span>Reset</span>
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
};
