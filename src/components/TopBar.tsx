import React from 'react';
import { PenSquare, ShieldCheck, User } from 'lucide-react';
import { KaryaDigitalLogo } from './KaryaDigitalLogo';
import { useMarketplace } from '../context/MarketplaceContext';

interface TopBarProps {
  currentTab: 'all' | 'reading' | 'shelves' | 'backup' | 'author_guide';
  onSelectTab: (tab: 'all' | 'reading' | 'shelves' | 'backup' | 'author_guide') => void;
  onOpenWriter: () => void;
  onOpenAdminPortal: () => void;
  onOpenAuthorRegistration: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  currentTab,
  onSelectTab,
  onOpenWriter,
  onOpenAdminPortal,
  onOpenAuthorRegistration,
}) => {
  const { authorProfile } = useMarketplace();

  const handleWriteClick = () => {
    if (authorProfile?.isSubscribed) {
      onOpenWriter();
    } else {
      onOpenAuthorRegistration();
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-100 shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between gap-4">
        {/* Brand / Logo: Karya Digital (Ilmu • Amal • Manfaat) */}
        <div className="flex items-center shrink-0 pr-4 sm:pr-6 mr-1 sm:mr-4 border-r border-slate-200/80">
          <button
            onClick={() => onSelectTab('all')}
            className="flex items-center text-left cursor-pointer transition-transform hover:scale-[1.02] active:scale-[0.98]"
            title="Karya Digital - Halaman Utama"
          >
            <KaryaDigitalLogo size="md" />
          </button>
        </div>

        {/* Center Nav Links with active green indicator line matching reference */}
        <nav className="hidden md:flex items-center gap-6 lg:gap-8 text-sm font-semibold">
          <button
            onClick={() => onSelectTab('all')}
            className={`relative py-2 transition-colors cursor-pointer whitespace-nowrap ${
              currentTab === 'all'
                ? 'text-slate-900 font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Koleksi Buku
            {currentTab === 'all' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0E7749] rounded-full" />
            )}
          </button>

          <button
            onClick={() => onSelectTab('reading')}
            className={`relative py-2 transition-colors cursor-pointer whitespace-nowrap ${
              currentTab === 'reading'
                ? 'text-slate-900 font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Sedang Dibaca
            {currentTab === 'reading' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0E7749] rounded-full" />
            )}
          </button>

          <button
            onClick={() => onSelectTab('author_guide')}
            className={`relative py-2 transition-colors cursor-pointer whitespace-nowrap ${
              currentTab === 'author_guide'
                ? 'text-[#0E7749] font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Nak Jadi Penulis
            {currentTab === 'author_guide' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0E7749] rounded-full" />
            )}
          </button>

          <button
            onClick={() => onSelectTab('shelves')}
            className={`relative py-2 transition-colors cursor-pointer whitespace-nowrap ${
              currentTab === 'shelves'
                ? 'text-slate-900 font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Rak Kustom
            {currentTab === 'shelves' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0E7749] rounded-full" />
            )}
          </button>

          <button
            onClick={() => onSelectTab('backup')}
            className={`relative py-2 transition-colors cursor-pointer whitespace-nowrap ${
              currentTab === 'backup'
                ? 'text-slate-900 font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Cadangan & Impor
            {currentTab === 'backup' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0E7749] rounded-full" />
            )}
          </button>
        </nav>

        {/* Right Action Buttons matching screenshot: Admin (5%) -> Tulis Buku -> Profile Avatar Circle */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Admin Commission Portal */}
          <button
            onClick={onOpenAdminPortal}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-100/90 hover:bg-slate-200/80 rounded-full transition-colors cursor-pointer whitespace-nowrap border border-slate-200/60 shadow-2xs"
            title="Portal Pentadbir: Pantau caj komisen platform 5% & yuran pendaftaran"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-red-600" />
            <span>Admin (5%)</span>
          </button>

          {/* Tulis Buku Button */}
          <button
            onClick={handleWriteClick}
            className="flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-semibold text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer whitespace-nowrap border border-slate-200/50 shadow-2xs"
            title="Tulis buku baharu atau unggah fail naskhah manuskrip"
          >
            <PenSquare className="w-4 h-4 text-slate-700" />
            <span>Tulis Buku</span>
          </button>

          {/* User Profile Avatar Circle matching red circle in screenshot */}
          <button
            onClick={() => onSelectTab('author_guide')}
            className="w-9 h-9 rounded-full bg-[#d91424] hover:bg-red-700 text-white flex items-center justify-center shrink-0 shadow-xs transition-transform hover:scale-105 active:scale-95 cursor-pointer"
            title="Profil & Akaun Penulis"
          >
            <User className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Mobile nav bar */}
      <div className="md:hidden flex items-center justify-around px-2 py-2 border-t border-slate-100 bg-slate-50 text-xs">
        <button
          onClick={() => onSelectTab('all')}
          className={`px-3 py-1 font-medium ${
            currentTab === 'all' ? 'text-[#0E7749] font-bold border-b-2 border-[#0E7749]' : 'text-slate-600'
          }`}
        >
          Koleksi
        </button>
        <button
          onClick={() => onSelectTab('reading')}
          className={`px-3 py-1 font-medium ${
            currentTab === 'reading' ? 'text-[#0E7749] font-bold border-b-2 border-[#0E7749]' : 'text-slate-600'
          }`}
        >
          Dibaca
        </button>
        <button
          onClick={() => onSelectTab('author_guide')}
          className={`px-3 py-1 font-medium ${
            currentTab === 'author_guide' ? 'text-[#0E7749] font-bold border-b-2 border-[#0E7749]' : 'text-slate-600'
          }`}
        >
          Nak Jadi Penulis
        </button>
        <button
          onClick={onOpenAdminPortal}
          className="px-3 py-1 font-medium text-slate-700"
        >
          Admin
        </button>
      </div>
    </header>
  );
};
