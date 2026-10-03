import React from 'react';
import {
  Menu,
  X,
  Search,
  PenSquare,
  User,
  Sun,
  Moon,
  BookOpen,
  Sparkles,
} from 'lucide-react';
import { KaryaDigitalLogo } from './KaryaDigitalLogo';
import { useMarketplace } from '../context/MarketplaceContext';

interface TopBarProps {
  isSidebarOpen: boolean;
  onToggleSidebar: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onOpenWriter: () => void;
  onOpenAuthorPortal: () => void;
  onOpenAuthorRegistration: () => void;
  onOpenProfile: () => void;
  isDarkMode?: boolean;
  onToggleDarkMode?: () => void;
  currentTab?: 'all' | 'reading' | 'shelves' | 'backup' | 'author_guide' | string;
  onSelectTab?: (tab: 'all' | 'reading' | 'shelves' | 'backup' | 'author_guide') => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  isSidebarOpen,
  onToggleSidebar,
  searchQuery,
  onSearchChange,
  onOpenWriter,
  onOpenAuthorPortal,
  onOpenAuthorRegistration,
  onOpenProfile,
  isDarkMode = false,
  onToggleDarkMode,
  currentTab = 'all',
  onSelectTab,
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
    <header className="sticky top-0 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/80 transition-colors duration-200">
      <div className="max-w-[1440px] h-[72px] mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-3 sm:gap-6">
        {/* Left Zone: Sidebar Toggle + Brand Logo */}
        <div className="flex items-center gap-2.5 sm:gap-3.5 shrink-0">
          <button
            onClick={onToggleSidebar}
            className={`w-10 h-10 rounded-[12px] flex items-center justify-center border transition-all cursor-pointer ${
              isSidebarOpen
                ? 'bg-[#ECFDF5] dark:bg-emerald-950/60 border-[#A7F3D0] dark:border-emerald-800 text-[#006B57] dark:text-emerald-400'
                : 'bg-white/80 dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-800 border-slate-200 dark:border-slate-700/80 text-slate-700 dark:text-slate-200'
            }`}
            title={isSidebarOpen ? 'Tutup Bilah Sisi' : 'Buka Bilah Sisi'}
            aria-label="Toggle Sidebar"
          >
            {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <button
            onClick={() => onSelectTab ? onSelectTab('all') : onOpenProfile()}
            className="flex items-center text-left cursor-pointer transition-transform hover:scale-[1.01] active:scale-[0.99]"
            title="Karya Digital - Halaman Utama"
          >
            <KaryaDigitalLogo size="md" />
          </button>
        </div>

        {/* Center Zone: Clean Quick Search (Desktop / Tablet) */}
        <div className="flex-1 max-w-sm lg:max-w-md hidden md:block">
          <div className="relative w-full">
            <Search className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Cari naskhah, penulis atau kategori..."
              className="w-full h-10 text-xs pl-10 pr-8 bg-slate-100/70 dark:bg-slate-800/70 hover:bg-white dark:hover:bg-slate-800 focus:bg-white dark:focus:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 rounded-[12px] focus:outline-none focus:border-[#006B57] dark:focus:border-emerald-400 focus:ring-1 focus:ring-[#006B57] dark:focus:ring-emerald-400 transition-all text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xs p-1"
                aria-label="Padam Carian"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Right Zone: Navigasi Ringkas + Actions + Dark Mode Toggle */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Navigasi Ringkas (Desktop) */}
          {onSelectTab && (
            <nav className="hidden lg:flex items-center gap-1 text-xs font-semibold text-slate-600 dark:text-slate-300 mr-1">
              <button
                onClick={() => onSelectTab('all')}
                className={`px-3 py-2 rounded-[10px] transition-colors cursor-pointer ${
                  currentTab === 'all'
                    ? 'text-[#006B57] dark:text-emerald-400 bg-emerald-50/80 dark:bg-emerald-950/50'
                    : 'hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/70 dark:hover:bg-slate-800/70'
                }`}
              >
                Koleksi
              </button>
              <button
                onClick={() => onSelectTab('reading')}
                className={`px-3 py-2 rounded-[10px] transition-colors cursor-pointer ${
                  currentTab === 'reading'
                    ? 'text-[#006B57] dark:text-emerald-400 bg-emerald-50/80 dark:bg-emerald-950/50'
                    : 'hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/70 dark:hover:bg-slate-800/70'
                }`}
              >
                Sedang Dibaca
              </button>
              <button
                onClick={() => onSelectTab('author_guide')}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-[10px] transition-colors cursor-pointer ${
                  currentTab === 'author_guide'
                    ? 'text-[#006B57] dark:text-emerald-400 bg-emerald-50/80 dark:bg-emerald-950/50'
                    : 'hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/70 dark:hover:bg-slate-800/70'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Royalti 95%</span>
              </button>
            </nav>
          )}

          {/* Primary Action Button: Tulis Buku */}
          <button
            onClick={handleWriteClick}
            className="flex items-center gap-2 h-10 px-3.5 sm:px-4 text-xs font-semibold text-white bg-[#006B57] hover:bg-[#063F35] dark:bg-emerald-600 dark:hover:bg-emerald-500 rounded-[12px] transition-all cursor-pointer shadow-xs active:scale-[0.98]"
            title="Tulis naskhah baharu atau unggah fail"
          >
            <PenSquare className="w-4 h-4 text-emerald-100" />
            <span className="whitespace-nowrap hidden sm:inline">Tulis Buku</span>
          </button>

          {/* Dark / Light Mode Toggle Button */}
          {onToggleDarkMode && (
            <button
              onClick={onToggleDarkMode}
              className="w-10 h-10 rounded-[12px] bg-white/80 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-amber-300 flex items-center justify-center shrink-0 transition-all cursor-pointer shadow-2xs"
              title={isDarkMode ? 'Tukar ke Mod Cerah' : 'Tukar ke Mod Gelap'}
              aria-label="Tukar Tema Mod Gelap / Mod Cerah"
            >
              {isDarkMode ? (
                <Sun className="w-4 h-4 text-amber-400 transition-transform rotate-0 hover:rotate-45" />
              ) : (
                <Moon className="w-4 h-4 text-slate-600 transition-transform rotate-0 hover:-rotate-12" />
              )}
            </button>
          )}

          {/* Profile / Account Avatar */}
          <button
            onClick={onOpenProfile}
            className="w-10 h-10 rounded-[12px] bg-white/80 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 hover:border-[#006B57] dark:hover:border-emerald-400 text-slate-700 dark:text-slate-200 hover:text-[#006B57] dark:hover:text-emerald-400 flex items-center justify-center shrink-0 transition-colors shadow-2xs cursor-pointer"
            title="Profil Pengguna & Penulis"
            aria-label="Profil Pengguna"
          >
            <User className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Mobile Search Bar row (Clean & Seamless) */}
      <div className="md:hidden px-4 pb-3 pt-1 border-t border-slate-100 dark:border-slate-800/60 bg-white/40 dark:bg-slate-900/40">
        <div className="relative w-full">
          <Search className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Cari naskhah, penulis atau kategori..."
            className="w-full h-9 text-xs pl-9 pr-7 bg-slate-100/80 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 rounded-[10px] focus:outline-none focus:border-[#006B57] dark:focus:border-emerald-400 text-slate-800 dark:text-slate-100"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs"
              aria-label="Padam Carian"
            >
              ✕
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
