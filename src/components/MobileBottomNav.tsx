import React from 'react';
import { Compass, BookmarkCheck, Feather, User } from 'lucide-react';

export type MobileTab = 'explore' | 'my_books' | 'studio' | 'account';

interface MobileBottomNavProps {
  activeTab: MobileTab;
  onSelectMobileTab: (tab: MobileTab) => void;
  readingCount?: number;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  activeTab,
  onSelectMobileTab,
  readingCount = 0,
}) => {
  const navItems: { id: MobileTab; label: string; icon: any; count?: number }[] = [
    {
      id: 'explore',
      label: 'Terokai',
      icon: Compass,
    },
    {
      id: 'my_books',
      label: 'Buku Saya',
      icon: BookmarkCheck,
      count: readingCount > 0 ? readingCount : undefined,
    },
    {
      id: 'studio',
      label: 'Studio',
      icon: Feather,
    },
    {
      id: 'account',
      label: 'Akaun',
      icon: User,
    },
  ];

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg border-t border-slate-200/90 dark:border-slate-800/90 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] px-2 pt-1 pb-[max(0.6rem,env(safe-area-inset-bottom))] transition-colors select-none"
      aria-label="Navigasi Bawah Telefon"
    >
      <div className="grid grid-cols-4 items-center justify-around max-w-md mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelectMobileTab(item.id)}
              className={`min-h-[44px] flex flex-col items-center justify-center py-1 px-1 rounded-xl transition-all duration-150 cursor-pointer active:scale-95 focus-visible:outline-none ${
                isActive
                  ? 'text-[#006B57] dark:text-emerald-400 font-bold'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 font-medium'
              }`}
              aria-label={item.label}
              aria-current={isActive ? 'page' : undefined}
            >
              <div
                className={`relative p-1 rounded-lg transition-transform ${
                  isActive ? 'scale-110 bg-[#ECFDF5] dark:bg-emerald-950/70 text-[#006B57] dark:text-emerald-400' : ''
                }`}
              >
                <Icon className="w-5 h-5" />
                {item.count !== undefined && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#006B57] text-white text-[9px] font-mono-data font-bold flex items-center justify-center">
                    {item.count}
                  </span>
                )}
              </div>
              <span className="text-[11px] mt-0.5 leading-tight">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
