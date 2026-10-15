import React from 'react';
import { Menu, X, Search, User, Sun, Moon } from 'lucide-react';
import { KaryaDigitalLogo } from './KaryaDigitalLogo';

interface TopBarProps {
  isSidebarOpen: boolean;
  onToggleSidebar: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onOpenProfile: () => void;
  isDarkMode?: boolean;
  onToggleDarkMode?: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  isSidebarOpen,
  onToggleSidebar,
  searchQuery,
  onSearchChange,
  onOpenProfile,
  isDarkMode = false,
  onToggleDarkMode,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/80 transition-colors duration-200">
      <div className="max-w-[1440px] h-[72px] mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-3 sm:gap-6">
        {/* Left Zone: Sidebar Toggle + Brand Logo */}
        <div className="flex items-center gap-2.5 sm:gap-3.5 shrink-0">
          <button
            onClick={onToggleSidebar}
            className={`w-11 h-11 min-h-[44px] rounded-[12px] flex items-center justify-center border transition-all cursor-pointer ${
              isSidebarOpen
                ? 'bg-[#ECFDF5] dark:bg-emerald-950/60 border-[#A7F3D0] dark:border-emerald-800 text-[#006B57] dark:text-emerald-400'
                : 'bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border-slate-200 dark:border-slate-700/80 text-slate-700 dark:text-slate-200'
            }`}
            title={isSidebarOpen ? 'Tutup Bilah Sisi' : 'Buka Bilah Sisi'}
            aria-label="Toggle Sidebar"
          >
            {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <div className="flex items-center text-left">
            <KaryaDigitalLogo size="md" />
          </div>
        </div>

        {/* Center Zone: Search Bar (Desktop / Tablet) */}
        <div className="flex-1 max-w-md lg:max-w-lg hidden md:block">
          <div className="relative w-full">
            <Search className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Cari naskhah, penulis atau kategori..."
              className="w-full h-11 min-h-[44px] text-sm pl-10 pr-9 bg-slate-100/80 dark:bg-slate-800/80 hover:bg-white dark:hover:bg-slate-800 focus:bg-white dark:focus:bg-slate-800 border border-slate-200/90 dark:border-slate-700/90 rounded-[12px] focus:outline-none focus:border-[#006B57] dark:focus:border-emerald-400 focus:ring-1 focus:ring-[#006B57] dark:focus:ring-emerald-400 transition-all text-slate-800 dark:text-slate-100 placeholder:text-slate-400"
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

        {/* Right Zone: Dark Mode Toggle + Profile Only (No Duplicate Nav Links) */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Dark / Light Mode Toggle */}
          {onToggleDarkMode && (
            <button
              onClick={onToggleDarkMode}
              className="w-11 h-11 min-h-[44px] rounded-[12px] bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-amber-300 flex items-center justify-center shrink-0 transition-all cursor-pointer shadow-2xs active:scale-95"
              title={isDarkMode ? 'Tukar ke Mod Cerah' : 'Tukar ke Mod Gelap'}
              aria-label="Tukar Tema Mod Gelap / Mod Cerah"
            >
              {isDarkMode ? (
                <Sun className="w-5 h-5 text-amber-400 transition-transform rotate-0 hover:rotate-45" />
              ) : (
                <Moon className="w-5 h-5 text-slate-600 transition-transform rotate-0 hover:-rotate-12" />
              )}
            </button>
          )}

          {/* Profile / Account Avatar */}
          <button
            onClick={onOpenProfile}
            className="w-11 h-11 min-h-[44px] rounded-[12px] bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 hover:border-[#006B57] dark:hover:border-emerald-400 text-slate-700 dark:text-slate-200 hover:text-[#006B57] dark:hover:text-emerald-400 flex items-center justify-center shrink-0 transition-colors shadow-2xs cursor-pointer active:scale-95"
            title="Profil Pengguna & Penulis"
            aria-label="Profil Pengguna"
          >
            <User className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Mobile Search Bar row */}
      <div className="md:hidden px-4 pb-3 pt-1 border-t border-slate-100 dark:border-slate-800/60 bg-white/40 dark:bg-slate-900/40">
        <div className="relative w-full">
          <Search className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Cari naskhah, penulis atau kategori..."
            className="w-full h-11 min-h-[44px] text-base pl-10 pr-8 bg-slate-100/90 dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/80 rounded-[12px] focus:outline-none focus:border-[#006B57] dark:focus:border-emerald-400 text-slate-900 dark:text-white"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm p-1"
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
