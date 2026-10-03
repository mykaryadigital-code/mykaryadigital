import React from 'react';
import { Home, Layers, Briefcase, Mail } from 'lucide-react';

interface MobileBottomNavProps {
  currentTab: 'all' | 'reading' | 'shelves' | 'backup' | 'author_guide';
  onSelectTab: (tab: 'all' | 'reading' | 'shelves' | 'backup' | 'author_guide') => void;
  onOpenContact: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  currentTab,
  onSelectTab,
  onOpenContact,
}) => {
  const handleHomeClick = () => {
    onSelectTab('all');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleProjectsClick = () => {
    onSelectTab('all');
    setTimeout(() => {
      const grid = document.getElementById('koleksi-buku-grid');
      if (grid) {
        grid.scrollIntoView({ behavior: 'smooth' });
      }
    }, 50);
  };

  const isHomeActive = currentTab === 'all' || currentTab === 'reading';
  const isServicesActive = currentTab === 'author_guide';

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg border-t border-slate-200 dark:border-slate-800 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] px-2 pt-1.5 pb-[max(0.65rem,env(safe-area-inset-bottom))] transition-colors select-none"
      aria-label="Navigasi Mudah Alih Bawah"
    >
      <div className="grid grid-cols-4 items-center justify-around max-w-md mx-auto">
        {/* Tab 1: Utama */}
        <button
          type="button"
          onClick={handleHomeClick}
          className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all duration-150 cursor-pointer active:scale-95 focus-visible:ring-2 focus-visible:ring-[#006B57] dark:focus-visible:ring-emerald-400 focus-visible:outline-none ${
            isHomeActive
              ? 'text-[#006B57] dark:text-emerald-400 font-bold'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 font-medium'
          }`}
          aria-label="Laman Utama"
        >
          <div
            className={`p-1 rounded-lg transition-transform ${
              isHomeActive ? 'scale-110 bg-emerald-50 dark:bg-emerald-950/60' : ''
            }`}
          >
            <Home className="w-5 h-5" />
          </div>
          <span className="text-[11px] mt-0.5 leading-tight">Utama</span>
        </button>

        {/* Tab 2: Projek */}
        <button
          type="button"
          onClick={handleProjectsClick}
          className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all duration-150 cursor-pointer active:scale-95 focus-visible:ring-2 focus-visible:ring-[#006B57] dark:focus-visible:ring-emerald-400 focus-visible:outline-none ${
            isHomeActive
              ? 'text-slate-600 dark:text-slate-300 hover:text-[#006B57] dark:hover:text-emerald-400 font-semibold'
              : 'text-slate-500 dark:text-slate-400 font-medium'
          }`}
          aria-label="Koleksi Projek Digital"
        >
          <div className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
            <Layers className="w-5 h-5" />
          </div>
          <span className="text-[11px] mt-0.5 leading-tight">Projek</span>
        </button>

        {/* Tab 3: Servis */}
        <button
          type="button"
          onClick={() => onSelectTab('author_guide')}
          className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all duration-150 cursor-pointer active:scale-95 focus-visible:ring-2 focus-visible:ring-[#006B57] dark:focus-visible:ring-emerald-400 focus-visible:outline-none ${
            isServicesActive
              ? 'text-[#006B57] dark:text-emerald-400 font-bold'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 font-medium'
          }`}
          aria-label="Servis & Panduan Penulis"
        >
          <div
            className={`p-1 rounded-lg transition-transform ${
              isServicesActive ? 'scale-110 bg-emerald-50 dark:bg-emerald-950/60' : ''
            }`}
          >
            <Briefcase className="w-5 h-5" />
          </div>
          <span className="text-[11px] mt-0.5 leading-tight">Servis</span>
        </button>

        {/* Tab 4: Hubungi */}
        <button
          type="button"
          onClick={onOpenContact}
          className="flex flex-col items-center justify-center py-1 px-2 rounded-xl text-slate-500 dark:text-slate-400 hover:text-[#006B57] dark:hover:text-emerald-400 font-medium transition-all duration-150 cursor-pointer active:scale-95 focus-visible:ring-2 focus-visible:ring-[#006B57] dark:focus-visible:ring-emerald-400 focus-visible:outline-none"
          aria-label="Hubungi Kami"
        >
          <div className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
            <Mail className="w-5 h-5" />
          </div>
          <span className="text-[11px] mt-0.5 leading-tight">Hubungi</span>
        </button>
      </div>
    </nav>
  );
};
