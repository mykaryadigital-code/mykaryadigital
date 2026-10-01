import React from 'react';
import { PenSquare, BookOpen, Wallet, ShieldCheck, Sparkles } from 'lucide-react';
import { KaryaDigitalLogo } from './KaryaDigitalLogo';
import { useMarketplace } from '../context/MarketplaceContext';

interface TopBarProps {
  currentTab: 'all' | 'reading' | 'shelves' | 'backup' | 'author_guide';
  onSelectTab: (tab: 'all' | 'reading' | 'shelves' | 'backup' | 'author_guide') => void;
  onOpenUpload: () => void;
  onOpenWriter: () => void;
  onOpenAuthorPortal: () => void;
  onOpenAdminPortal: () => void;
  onOpenAuthorRegistration: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  currentTab,
  onSelectTab,
  onOpenUpload,
  onOpenWriter,
  onOpenAuthorPortal,
  onOpenAdminPortal,
  onOpenAuthorRegistration,
}) => {
  const { authorProfile, stats } = useMarketplace();

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
        {/* Brand / Logo: Karya Digital (Separated with clean breathing room & divider) */}
        <div className="flex items-center shrink-0 pr-4 sm:pr-6 mr-1 sm:mr-4 border-r border-slate-200/80">
          <button
            onClick={() => onSelectTab('all')}
            className="flex items-center text-left cursor-pointer transition-transform hover:scale-[1.02] active:scale-[0.98]"
            title="Karya Digital - Halaman Utama"
          >
            <KaryaDigitalLogo size="md" />
          </button>
        </div>

        {/* Center Nav Links with active red indicator */}
        <nav className="hidden md:flex items-center gap-6 lg:gap-8 text-sm font-semibold">
          <button
            onClick={() => onSelectTab('all')}
            className={`relative py-2 transition-colors cursor-pointer whitespace-nowrap ${
              currentTab === 'all'
                ? 'text-red-600'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Koleksi Buku
            {currentTab === 'all' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-600 rounded-full" />
            )}
          </button>

          <button
            onClick={() => onSelectTab('reading')}
            className={`relative py-2 transition-colors cursor-pointer whitespace-nowrap ${
              currentTab === 'reading'
                ? 'text-red-600'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Sedang Dibaca
            {currentTab === 'reading' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-600 rounded-full" />
            )}
          </button>

          <button
            onClick={() => onSelectTab('author_guide')}
            className={`relative py-2 transition-colors cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              currentTab === 'author_guide'
                ? 'text-[#0E7749] font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>Nak Jadi Penulis</span>
            <span className="px-1.5 py-0.5 text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-200 rounded-full">
              RM20
            </span>
            {currentTab === 'author_guide' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0E7749] rounded-full" />
            )}
          </button>

          <button
            onClick={() => onSelectTab('shelves')}
            className={`relative py-2 transition-colors cursor-pointer whitespace-nowrap ${
              currentTab === 'shelves'
                ? 'text-red-600'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Rak Kustom
            {currentTab === 'shelves' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-600 rounded-full" />
            )}
          </button>

          <button
            onClick={() => onSelectTab('backup')}
            className={`relative py-2 transition-colors cursor-pointer whitespace-nowrap ${
              currentTab === 'backup'
                ? 'text-red-600'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Cadangan & Impor
            {currentTab === 'backup' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-600 rounded-full" />
            )}
          </button>
        </nav>

        {/* Right Action & Portal Buttons */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Author Portal / Earnings Button */}
          {authorProfile?.isSubscribed ? (
            <button
              onClick={onOpenAuthorPortal}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-[#0E7749] bg-emerald-50 hover:bg-emerald-100/80 border border-emerald-200 rounded-xl transition-colors cursor-pointer whitespace-nowrap"
              title="Papan Pemuka Penulis: Baki Royalti 95% & Tarikh Langganan"
            >
              <Wallet className="w-3.5 h-3.5 text-[#0E7749]" />
              <span className="hidden sm:inline">Royalti:</span>
              <span className="font-mono">RM {authorProfile.balance.toFixed(2)}</span>
            </button>
          ) : (
            <button
              onClick={onOpenAuthorRegistration}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-amber-900 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-xl transition-colors cursor-pointer whitespace-nowrap"
              title="Daftar Penulis: RM 20 Tahun 1, nikmati 95% hasil jualan buku"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-700" />
              <span>Daftar Penulis (RM20)</span>
            </button>
          )}

          {/* Admin Commission Portal */}
          <button
            onClick={onOpenAdminPortal}
            className="hidden lg:flex items-center gap-1.5 px-2.5 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer whitespace-nowrap border border-slate-200/60"
            title="Portal Pentadbir: Pantau caj komisen platform 5% & yuran pendaftaran"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-red-600" />
            <span>Admin (5%)</span>
          </button>

          {/* Tulis Buku Button */}
          <button
            onClick={handleWriteClick}
            className="flex items-center gap-2 px-3.5 sm:px-4 py-2 text-xs sm:text-sm font-semibold text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer whitespace-nowrap"
          >
            <PenSquare className="w-4 h-4 text-slate-700" />
            <span>Tulis Buku</span>
          </button>

          {/* Unggah Ebook Button */}
          <button
            onClick={onOpenUpload}
            className="flex items-center gap-2 px-4 sm:px-5 py-2 text-xs sm:text-sm font-semibold text-white bg-[#d91424] hover:bg-red-700 rounded-xl transition-colors cursor-pointer whitespace-nowrap shadow-xs"
          >
            <BookOpen className="w-4 h-4" />
            <span className="hidden sm:inline">Unggah Ebook</span>
            <span className="sm:hidden">Unggah</span>
          </button>
        </div>
      </div>

      {/* Mobile nav bar */}
      <div className="md:hidden flex items-center justify-around px-2 py-2 border-t border-slate-100 bg-slate-50 text-xs">
        <button
          onClick={() => onSelectTab('all')}
          className={`px-3 py-1 font-medium ${
            currentTab === 'all' ? 'text-red-600 font-bold border-b-2 border-red-600' : 'text-slate-600'
          }`}
        >
          Koleksi
        </button>
        <button
          onClick={() => onSelectTab('reading')}
          className={`px-3 py-1 font-medium ${
            currentTab === 'reading' ? 'text-red-600 font-bold border-b-2 border-red-600' : 'text-slate-600'
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
          onClick={onOpenAuthorPortal}
          className="px-3 py-1 font-medium text-[#0E7749]"
        >
          Penulis
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
