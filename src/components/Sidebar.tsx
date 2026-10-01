import React from 'react';
import {
  BookOpen,
  FolderHeart,
  Database,
  Feather,
  Wallet,
  ShieldCheck,
  PenSquare,
  X,
  Compass,
  UtensilsCrossed,
  Heart,
  FileText,
  BookmarkCheck,
  Sparkles,
} from 'lucide-react';
import { KaryaDigitalLogo } from './KaryaDigitalLogo';
import { useMarketplace } from '../context/MarketplaceContext';

export interface CategoryItem {
  label: string;
  value: string;
  icon: any;
}

export const CATEGORIES_LIST: CategoryItem[] = [
  { label: 'Panduan', value: 'Panduan', icon: BookOpen },
  { label: 'Resepi', value: 'Resepi', icon: UtensilsCrossed },
  { label: 'Novel', value: 'Novel Sastra', icon: FileText },
  { label: 'Fantasi & Pertualangan', value: 'Fantasi & Petualangan', icon: Compass },
  { label: 'Puisi & Sastera', value: 'Puisi & Sastra Klasik', icon: Feather },
  { label: 'Misteri & Detektif', value: 'Misteri & Detektif', icon: Compass },
  { label: 'Non-Fiksyen & Esai', value: 'Non-Fiksi & Esai', icon: FileText },
  { label: 'Romansa', value: 'Romansa', icon: Heart },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  currentTab: 'all' | 'reading' | 'shelves' | 'backup' | 'author_guide';
  onSelectTab: (tab: 'all' | 'reading' | 'shelves' | 'backup' | 'author_guide') => void;
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  categoryCounts: Record<string, number>;
  totalBooksCount: number;
  readingBooksCount: number;
  onOpenWriter: () => void;
  onOpenAuthorPortal: () => void;
  onOpenAdminPortal: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onClose,
  currentTab,
  onSelectTab,
  selectedCategory,
  onSelectCategory,
  categoryCounts,
  totalBooksCount,
  readingBooksCount,
  onOpenWriter,
  onOpenAuthorPortal,
  onOpenAdminPortal,
}) => {
  const { authorProfile } = useMarketplace();

  const handleNavClick = (tab: SidebarProps['currentTab']) => {
    onSelectTab(tab);
    if (window.innerWidth < 1024) {
      onClose();
    }
  };

  const handleCategoryClick = (categoryVal: string) => {
    onSelectCategory(categoryVal);
    if (currentTab === 'author_guide') {
      onSelectTab('all');
    }
    if (window.innerWidth < 1024) {
      onClose();
    }
  };

  const navItems = [
    {
      id: 'all' as const,
      label: 'Koleksi Buku',
      icon: BookOpen,
      count: totalBooksCount,
    },
    {
      id: 'reading' as const,
      label: 'Sedang Dibaca',
      icon: BookmarkCheck,
      count: readingBooksCount,
    },
    {
      id: 'author_guide' as const,
      label: 'Nak Jadi Penulis',
      icon: Feather,
      badge: '95% Royalti',
    },
    {
      id: 'shelves' as const,
      label: 'Rak Kustom',
      icon: FolderHeart,
    },
    {
      id: 'backup' as const,
      label: 'Cadangan & Impor',
      icon: Database,
    },
  ];

  return (
    <>
      {/* Mobile / Tablet Overlay Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="lg:hidden fixed inset-0 z-40 bg-black/40 backdrop-blur-xs transition-opacity duration-200"
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-white border-r border-[#E2E8F0] shadow-xl lg:shadow-none flex flex-col transition-transform duration-200 ease-out lg:static lg:translate-x-0 lg:z-30 lg:h-[calc(100vh-72px)] lg:sticky lg:top-[72px] shrink-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:hidden'
        }`}
      >
        {/* Mobile-Only Header with Logo & Close Button */}
        <div className="lg:hidden h-[72px] px-5 flex items-center justify-between border-b border-[#E2E8F0] shrink-0 bg-white">
          <KaryaDigitalLogo size="sm" />
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
            aria-label="Tutup Sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto custom-scrollbar px-4 py-5 space-y-6">
          {/* Quick Primary Action: Tulis Buku */}
          <div>
            <button
              onClick={() => {
                onOpenWriter();
                if (window.innerWidth < 1024) onClose();
              }}
              className="w-full h-11 px-4 rounded-[12px] bg-[#006B57] hover:bg-[#063F35] text-white font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer active:scale-[0.99]"
            >
              <PenSquare className="w-4 h-4 text-emerald-100" />
              <span>Tulis Buku Baharu</span>
            </button>
          </div>

          {/* Section 1: MENU UTAMA */}
          <div className="space-y-1">
            <span className="px-3 text-[11px] font-bold text-[#64748B] uppercase tracking-wider block mb-2">
              Menu Utama
            </span>

            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-[12px] text-xs font-semibold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#ECFDF5] text-[#006B57] font-bold border border-[#A7F3D0]/60'
                      : 'text-[#102A27] hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon
                      className={`w-4 h-4 ${
                        isActive ? 'text-[#006B57]' : 'text-[#64748B]'
                      }`}
                    />
                    <span>{item.label}</span>
                  </div>

                  {item.count !== undefined && (
                    <span
                      className={`font-mono-data text-[11px] px-2 py-0.5 rounded-full ${
                        isActive
                          ? 'bg-[#006B57] text-white'
                          : 'bg-slate-100 text-[#64748B]'
                      }`}
                    >
                      {item.count}
                    </span>
                  )}

                  {item.badge && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#ECFDF5] text-[#047857] border border-[#A7F3D0]/70">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Section 2: KATEGORI BUKU (Mudah Dicari) */}
          <div className="space-y-1 pt-3 border-t border-[#E2E8F0]">
            <div className="flex items-center justify-between px-3 mb-2">
              <span className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider">
                Kategori Buku
              </span>
              {selectedCategory !== 'Semua' && (
                <button
                  onClick={() => onSelectCategory('Semua')}
                  className="text-[10px] text-[#006B57] font-semibold hover:underline cursor-pointer"
                >
                  Semua
                </button>
              )}
            </div>

            {/* "Semua Kategori" option */}
            <button
              onClick={() => handleCategoryClick('Semua')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-[10px] text-xs transition-all cursor-pointer ${
                selectedCategory === 'Semua'
                  ? 'bg-[#006B57] text-white font-semibold shadow-2xs'
                  : 'text-[#102A27] hover:bg-slate-50 font-medium'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Sparkles className={`w-4 h-4 ${selectedCategory === 'Semua' ? 'text-white' : 'text-[#64748B]'}`} />
                <span>Semua Kategori</span>
              </div>
              <span
                className={`font-mono-data text-[11px] px-2 py-0.5 rounded ${
                  selectedCategory === 'Semua' ? 'bg-white/20 text-white' : 'text-[#64748B]'
                }`}
              >
                {categoryCounts['Semua'] || totalBooksCount}
              </span>
            </button>

            {/* Individual categories */}
            {CATEGORIES_LIST.map((cat) => {
              const Icon = cat.icon;
              const isSelected = selectedCategory === cat.value;
              const count = categoryCounts[cat.value] || 0;

              return (
                <button
                  key={cat.label}
                  onClick={() => handleCategoryClick(cat.value)}
                  className={`w-full flex items-center justify-between px-3.5 py-2 rounded-[10px] text-xs transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#006B57] text-white font-semibold shadow-2xs'
                      : 'text-[#102A27] hover:bg-slate-50 font-medium'
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate pr-1">
                    <Icon
                      className={`w-4 h-4 shrink-0 ${
                        isSelected ? 'text-white' : 'text-[#64748B]'
                      }`}
                    />
                    <span className="truncate">{cat.label}</span>
                  </div>

                  <span
                    className={`font-mono-data text-[11px] px-1.5 py-0.5 rounded shrink-0 ${
                      isSelected ? 'bg-white/20 text-white' : 'text-[#64748B]'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Section 3: Bawah Sidebar (Royalti & Admin) */}
        <div className="p-4 border-t border-[#E2E8F0] bg-[#F7F9F8] space-y-2 shrink-0">
          {/* Dompet Royalti 95% */}
          <button
            onClick={() => {
              onOpenAuthorPortal();
              if (window.innerWidth < 1024) onClose();
            }}
            className="w-full flex items-center justify-between p-3 rounded-[12px] bg-white border border-[#A7F3D0] hover:border-[#006B57] text-[#006B57] text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
            title="Buka Dompet Royalti Penulis (95%)"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#ECFDF5] flex items-center justify-center text-[#006B57]">
                <Wallet className="w-4 h-4" />
              </div>
              <div className="text-left">
                <span className="block text-[10px] text-[#64748B] font-normal leading-none mb-0.5">
                  Baki Royalti Penulis
                </span>
                <span className="font-mono-data font-bold text-xs text-[#006B57]">
                  RM {authorProfile?.balance !== undefined ? authorProfile.balance.toFixed(2) : '308.75'}
                </span>
              </div>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#ECFDF5] text-[#047857]">
              95%
            </span>
          </button>

          {/* Portal Admin 5% */}
          <button
            onClick={() => {
              onOpenAdminPortal();
              if (window.innerWidth < 1024) onClose();
            }}
            className="w-full flex items-center justify-between px-3 py-2 rounded-[10px] bg-white border border-[#E2E8F0] hover:bg-slate-50 text-[#102A27] text-xs font-medium transition-colors cursor-pointer"
            title="Portal Pentadbir: Komisen 5%"
          >
            <span className="flex items-center gap-2 text-slate-700">
              <ShieldCheck className="w-4 h-4 text-[#E53935]" />
              <span>Portal Admin (5%)</span>
            </span>
            <span className="text-[10px] text-slate-400">Panel &rarr;</span>
          </button>
        </div>
      </aside>
    </>
  );
};
