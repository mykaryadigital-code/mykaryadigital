import React from 'react';
import { CoverTheme } from '../types/book';

interface BookCoverProps {
  title: string;
  author: string;
  coverUrl?: string;
  coverTheme?: CoverTheme;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const THEME_STYLES: Record<
  CoverTheme['variant'],
  {
    bg: string;
    text: string;
    subtext: string;
    border: string;
    accent: string;
    illustrationType: 'coffee' | 'warrior' | 'ship' | 'detective' | 'classic';
  }
> = {
  terracotta: {
    bg: 'linear-gradient(145deg, #7c2d12 0%, #451a03 55%, #290f04 100%)',
    text: '#ffffff',
    subtext: '#fed7aa',
    border: 'rgba(253, 186, 116, 0.45)',
    accent: '#fb923c',
    illustrationType: 'coffee',
  },
  emerald: {
    bg: 'linear-gradient(145deg, #064e3b 0%, #022c22 55%, #011a14 100%)',
    text: '#ffffff',
    subtext: '#a7f3d0',
    border: 'rgba(110, 231, 183, 0.45)',
    accent: '#34d399',
    illustrationType: 'warrior',
  },
  navy: {
    bg: 'linear-gradient(145deg, #1e3a8a 0%, #0f172a 55%, #020617 100%)',
    text: '#ffffff',
    subtext: '#bfdbfe',
    border: 'rgba(147, 197, 253, 0.45)',
    accent: '#60a5fa',
    illustrationType: 'ship',
  },
  noir: {
    bg: 'linear-gradient(145deg, #27272a 0%, #18181b 55%, #09090b 100%)',
    text: '#ffffff',
    subtext: '#e4e4e7',
    border: 'rgba(212, 212, 216, 0.45)',
    accent: '#a1a1aa',
    illustrationType: 'detective',
  },
  burgundy: {
    bg: 'linear-gradient(145deg, #831843 0%, #500724 55%, #2e0515 100%)',
    text: '#ffffff',
    subtext: '#fbcfe8',
    border: 'rgba(244, 114, 182, 0.45)',
    accent: '#f472b6',
    illustrationType: 'classic',
  },
  amber: {
    bg: 'linear-gradient(145deg, #b45309 0%, #78350f 55%, #451a03 100%)',
    text: '#ffffff',
    subtext: '#fde68a',
    border: 'rgba(252, 211, 77, 0.45)',
    accent: '#f59e0b',
    illustrationType: 'coffee',
  },
  slate: {
    bg: 'linear-gradient(145deg, #334155 0%, #1e293b 55%, #0f172a 100%)',
    text: '#ffffff',
    subtext: '#cbd5e1',
    border: 'rgba(203, 213, 225, 0.45)',
    accent: '#94a3b8',
    illustrationType: 'classic',
  },
};

export const BookCover: React.FC<BookCoverProps> = ({
  title,
  author,
  coverUrl,
  coverTheme = { variant: 'terracotta', pattern: 'classic_border' },
  size = 'md',
  className = '',
}) => {
  // Auto-detect theme based on title if not explicitly set
  let variant = coverTheme.variant;
  if (title.toLowerCase().includes('kopi') || title.toLowerCase().includes('senja')) {
    variant = 'terracotta';
  } else if (title.toLowerCase().includes('gunting') || title.toLowerCase().includes('pendekar') || title.toLowerCase().includes('silat')) {
    variant = 'emerald';
  } else if (title.toLowerCase().includes('vanderwijck') || title.toLowerCase().includes('kapal')) {
    variant = 'navy';
  } else if (title.toLowerCase().includes('sherlock') || title.toLowerCase().includes('misteri')) {
    variant = 'noir';
  }

  const theme = THEME_STYLES[variant] || THEME_STYLES.terracotta;

  // Sizing tokens matching exact proportions of the screenshot
  const sizeClasses = {
    sm: 'w-24 h-34 text-[10px]',
    md: 'w-48 sm:w-56 h-72 sm:h-80 text-xs',
    lg: 'w-60 h-88 text-sm',
    xl: 'w-72 h-104 text-base',
  };

  if (coverUrl) {
    return (
      <div
        className={`book-spine-effect rounded-r-xl rounded-l-xs overflow-hidden shrink-0 select-none bg-stone-900 ${sizeClasses[size]} ${className}`}
      >
        <div className="book-spine-line" />
        <img
          src={coverUrl}
          alt={title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover"
          onError={(e) => {
            e.currentTarget.style.display = 'none';
          }}
        />
      </div>
    );
  }

  return (
    <div
      className={`book-spine-effect rounded-r-xl rounded-l-sm p-4 sm:p-5 flex flex-col justify-between shrink-0 select-none relative overflow-hidden shadow-lg ${sizeClasses[size]} ${className}`}
      style={{
        background: theme.bg,
        color: theme.text,
      }}
    >
      {/* 3D Book Spine effect highlight */}
      <div className="book-spine-line" />

      {/* Outer Decorative Double Gold Border (like screenshot) */}
      <div
        className="absolute inset-3 pointer-events-none rounded-sm border"
        style={{ borderColor: theme.border }}
      />
      <div
        className="absolute inset-4 pointer-events-none rounded-2xs border opacity-40"
        style={{ borderColor: theme.border }}
      />

      {/* Top Header Label */}
      <div className="relative z-10 pt-1 text-center">
        <div
          className="text-[9px] sm:text-[10px] uppercase tracking-widest font-mono-data opacity-80"
          style={{ color: theme.subtext }}
        >
          KOLEKSI DIGITAL
        </div>
      </div>

      {/* Center Title & Author */}
      <div className="relative z-10 text-center my-auto px-2">
        <h3
          className="text-base sm:text-xl font-serif-book font-bold tracking-tight mb-2 text-balance leading-snug drop-shadow-xs"
          style={{ color: theme.text }}
        >
          {title}
        </h3>

        <div
          className="w-10 h-0.5 mx-auto my-2 opacity-50 rounded-full"
          style={{ backgroundColor: theme.accent }}
        />

        <p
          className="text-xs sm:text-sm font-sans font-medium line-clamp-1 opacity-90"
          style={{ color: theme.subtext }}
        >
          {author}
        </p>
      </div>

      {/* Thematic Illustrated Silhouette in the lower center (Coffee / Warrior / Ship / Mystery) */}
      <div className="relative z-10 h-24 sm:h-28 flex items-center justify-center my-1 pointer-events-none opacity-85">
        {theme.illustrationType === 'coffee' && (
          <svg viewBox="0 0 160 90" className="w-full h-full drop-shadow-md" fill="none">
            {/* Cozy sunset window & coffee cup illustration */}
            <path d="M10 85H150V40C150 20 130 10 80 10C30 10 10 20 10 40V85Z" fill="#1f0904" opacity="0.65" />
            {/* Sunset gradient in window */}
            <circle cx="80" cy="50" r="28" fill="#ea580c" opacity="0.75" />
            <path d="M30 65C50 55 110 55 130 65V85H30V65Z" fill="#0c0402" opacity="0.8" />
            {/* Table & Coffee Cup */}
            <ellipse cx="80" cy="72" rx="20" ry="5" fill="#451a03" />
            <path d="M72 60H88V70C88 74 84 76 80 76C76 76 72 74 72 70V60Z" fill="#fed7aa" />
            {/* Steam */}
            <path d="M76 56C76 52 79 50 78 46" stroke="#fed7aa" strokeWidth="1.5" strokeLinecap="round" opacity="0.8" />
            <path d="M83 55C83 51 85 49 84 45" stroke="#fed7aa" strokeWidth="1.5" strokeLinecap="round" opacity="0.8" />
          </svg>
        )}

        {theme.illustrationType === 'warrior' && (
          <svg viewBox="0 0 160 90" className="w-full h-full drop-shadow-md" fill="none">
            {/* Forest jungle silhouette & keris warrior */}
            <path d="M15 85L30 30L45 85H15Z" fill="#011812" opacity="0.7" />
            <path d="M115 85L130 25L145 85H115Z" fill="#011812" opacity="0.7" />
            <circle cx="80" cy="45" r="26" fill="#059669" opacity="0.5" />
            {/* Warrior holding sword silhouette */}
            <path
              d="M78 40C81 40 83 38 83 35C83 32 81 30 78 30C75 30 73 32 73 35C73 38 75 40 78 40Z"
              fill="#022c22"
            />
            <path
              d="M72 42H84L87 56H81L83 80H78L77 62L74 80H69L72 56H68L72 42Z"
              fill="#011a14"
            />
            {/* Sword blade glowing */}
            <path d="M87 48L102 36L104 38L88 50Z" fill="#34d399" opacity="0.9" />
          </svg>
        )}

        {theme.illustrationType === 'ship' && (
          <svg viewBox="0 0 160 90" className="w-full h-full drop-shadow-md" fill="none">
            {/* Ocean sunset & sailing steamship */}
            <circle cx="80" cy="40" r="24" fill="#38bdf8" opacity="0.4" />
            <path d="M10 80C30 75 50 78 70 75C90 72 110 77 150 74V90H10V80Z" fill="#020617" />
            {/* Ship silhouette */}
            <path d="M45 68L55 60H105L115 68H45Z" fill="#0f172a" />
            <rect x="75" y="45" width="4" height="15" fill="#1e293b" />
            <rect x="85" y="48" width="3" height="12" fill="#1e293b" />
            <path d="M79 45C85 40 90 38 98 38" stroke="#93c5fd" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
          </svg>
        )}

        {(theme.illustrationType === 'detective' || theme.illustrationType === 'classic') && (
          <svg viewBox="0 0 160 90" className="w-full h-full drop-shadow-md" fill="none">
            {/* Victorian London foggy streetlamp */}
            <circle cx="80" cy="40" r="20" fill="#e2e8f0" opacity="0.3" />
            <rect x="79" y="30" width="2" height="45" fill="#09090b" />
            <polygon points="76,30 84,30 82,24 78,24" fill="#facc15" opacity="0.8" />
            <path d="M60 75C68 70 75 72 82 71C90 70 98 74 110 73V90H60V75Z" fill="#09090b" />
          </svg>
        )}
      </div>

      {/* Bottom Emblem / Stamp matching Karya Digital */}
      <div className="relative z-10 text-center pb-0.5">
        <div
          className="text-[9px] sm:text-[10px] tracking-wider uppercase opacity-75 font-mono-data"
          style={{ color: theme.subtext }}
        >
          KARYA DIGITAL &nbsp;•&nbsp; EDISI BAKU
        </div>
      </div>
    </div>
  );
};
