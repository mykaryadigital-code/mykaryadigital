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
  CheckCircle2,
  Code2,
  Layers,
  Globe,
  Cpu,
  ShoppingBag,
} from 'lucide-react';
import { KaryaDigitalLogo } from './KaryaDigitalLogo';
import { useMarketplace } from '../context/MarketplaceContext';

export type MainSpace = 'books' | 'projects' | 'studio' | 'reading' | 'completed' | 'favorite' | 'shelves' | 'backup';

export interface CategoryItem {
  label: string;
  value: string;
  icon: any;
}

// Consistent Malay Book Categories
export const BOOK_CATEGORIES_LIST: CategoryItem[] = [
  { label: 'Novel Sastera', value: 'Novel Sastra', icon: FileText },
  { label: 'Misteri & Detektif', value: 'Misteri & Detektif', icon: Compass },
  { label: 'Fantasi & Petualangan', value: 'Fantasi & Petualangan', icon: Compass },
  { label: 'Romansa', value: 'Romansa', icon: Heart },
  { label: 'Resepi & Kulinari', value: 'Resepi', icon: UtensilsCrossed },
  { label: 'Esai & Refleksi', value: 'Non-Fiksi & Esai', icon: Feather },
  { label: 'Panduan Penulis', value: 'Panduan', icon: BookOpen },
];

// Consistent Malay Digital Project Categories
export const PROJECT_CATEGORIES_LIST: CategoryItem[] = [
  { label: 'Aplikasi Web', value: 'Aplikasi Web', icon: Globe },
  { label: 'Sistem & Automasi', value: 'Sistem & Automasi', icon: Cpu },
  { label: 'Bisnes & E-Dagang', value: 'Bisnes & E-Dagang', icon: ShoppingBag },
  { label: 'Templat & Kod', value: 'Templat & Kod', icon: Code2 },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  activeSpace: MainSpace;
  onSelectSpace: (space: MainSpace) => void;
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  categoryCounts: Record<string, number>;
  totalBooksCount: number;
  readingBooksCount: number;
  completedBooksCount: number;
  favoriteBooksCount: number;
  onOpenWriter: () => void;
  onOpenAdminPortal: () => void;
  isAdmin?: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onClose,
  activeSpace,
  onSelectSpace,
  selectedCategory,
  onSelectCategory,
  categoryCounts,
  totalBooksCount,
  readingBooksCount,
  completedBooksCount,
  favoriteBooksCount,
  onOpenWriter,
  onOpenAdminPortal,
  isAdmin = false,
}) => {
  const { authorProfile } = useMarketplace();

  const handleNavClick = (space: MainSpace) => {
    onSelectSpace(space);
    if (window.innerWidth < 1024) {
      onClose();
    }
  };

  const handleCategoryClick = (categoryVal: string) => {
    onSelectCategory(categoryVal);
    if (activeSpace !== 'books' && activeSpace !== 'projects') {
      onSelectSpace('books');
    }
    if (window.innerWidth < 1024) {
      onClose();
    }
  };

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
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-white dark:bg-slate-900 border-r border-[#E2E8F0] dark:border-slate-800 shadow-xl lg:shadow-none flex flex-col transition-transform duration-200 ease-out lg:static lg:translate-x-0 lg:z-30 lg:h-[calc(100vh-72px)] lg:sticky lg:top-[72px] shrink-0 select-none ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:hidden'
        }`}
      >
        {/* Mobile Header with Logo & Close Button */}
        <div className="lg:hidden h-[72px] px-5 flex items-center justify-between border-b border-[#E2E8F0] dark:border-slate-800 shrink-0 bg-white dark:bg-slate-900">
          <KaryaDigitalLogo size="sm" />
          <button
            onClick={onClose}
            className="w-10 h-10 min-h-[44px] rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
            aria-label="Tutup Bilah Sisi"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Navigation */}
        <div className="flex-1 overflow-y-auto custom-scrollbar px-4 py-5 space-y-6">
          {/* Quick Primary Action: Terbit Naskhah */}
          <div>
            <button
              onClick={() => {
                onOpenWriter();
                if (window.innerWidth < 1024) onClose();
              }}
              className="w-full min-h-[44px] h-11 px-4 rounded-[12px] bg-[#006B57] hover:bg-[#063F35] dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer active:scale-[0.98]"
            >
              <PenSquare className="w-4 h-4 text-emerald-100" />
              <span>Tulis / Terbit Naskhah</span>
            </button>
          </div>

          {/* Section 1: RUANG UTAMA (Asingkan Buku, Projek Digital, Studio Penulis) */}
          <div className="space-y-1">
            <span className="px-3 text-[11px] font-bold text-[#64748B] dark:text-slate-400 uppercase tracking-wider block mb-2">
              Ruang Utama
            </span>

            {/* Ruang Buku */}
            <button
              onClick={() => handleNavClick('books')}
              className={`w-full min-h-[44px] flex items-center justify-between px-3.5 py-2.5 rounded-[12px] text-xs font-semibold transition-all cursor-pointer ${
                activeSpace === 'books'
                  ? 'bg-[#ECFDF5] dark:bg-emerald-950/60 text-[#006B57] dark:text-emerald-400 font-bold border border-[#A7F3D0]/60 dark:border-emerald-800/60'
                  : 'text-[#102A27] dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/70'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <BookOpen className="w-4 h-4 text-[#006B57] dark:text-emerald-400" />
                <span>Koleksi Buku</span>
              </div>
              <span className="font-mono-data text-[11px] text-slate-400">{totalBooksCount}</span>
            </button>

            {/* Ruang Projek Digital */}
            <button
              onClick={() => handleNavClick('projects')}
              className={`w-full min-h-[44px] flex items-center justify-between px-3.5 py-2.5 rounded-[12px] text-xs font-semibold transition-all cursor-pointer ${
                activeSpace === 'projects'
                  ? 'bg-[#ECFDF5] dark:bg-emerald-950/60 text-[#006B57] dark:text-emerald-400 font-bold border border-[#A7F3D0]/60 dark:border-emerald-800/60'
                  : 'text-[#102A27] dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/70'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Code2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>Projek Digital</span>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                Sistem &amp; Web
              </span>
            </button>

            {/* Ruang Studio Penulis (Royalti & Penerbitan) */}
            <button
              onClick={() => handleNavClick('studio')}
              className={`w-full min-h-[44px] flex items-center justify-between px-3.5 py-2.5 rounded-[12px] text-xs font-semibold transition-all cursor-pointer ${
                activeSpace === 'studio'
                  ? 'bg-[#ECFDF5] dark:bg-emerald-950/60 text-[#006B57] dark:text-emerald-400 font-bold border border-[#A7F3D0]/60 dark:border-emerald-800/60'
                  : 'text-[#102A27] dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/70'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Feather className="w-4 h-4 text-amber-500" />
                <span>Studio Penulis</span>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 border border-amber-200/60 dark:border-amber-800">
                95% Royalti
              </span>
            </button>
          </div>

          {/* Section 2: KATEGORI BUKU / PROJEK DI BAHAGIAN ATAS */}
          <div className="space-y-1 pt-3 border-t border-[#E2E8F0] dark:border-slate-800">
            <div className="flex items-center justify-between px-3 mb-2">
              <span className="text-[11px] font-bold text-[#64748B] dark:text-slate-400 uppercase tracking-wider">
                {activeSpace === 'projects' ? 'Kategori Projek' : 'Kategori Buku'}
              </span>
              {selectedCategory !== 'Semua' && (
                <button
                  onClick={() => onSelectCategory('Semua')}
                  className="text-[11px] font-semibold text-[#006B57] dark:text-emerald-400 hover:underline cursor-pointer"
                >
                  Semua
                </button>
              )}
            </div>

            {/* Semua Kategori */}
            <button
              onClick={() => handleCategoryClick('Semua')}
              className={`w-full min-h-[38px] flex items-center justify-between px-3 py-2 rounded-[10px] text-xs transition-colors cursor-pointer ${
                selectedCategory === 'Semua'
                  ? 'bg-emerald-50 dark:bg-emerald-950/60 text-[#006B57] dark:text-emerald-400 font-bold border border-emerald-200/60 dark:border-emerald-800/60'
                  : 'text-[#102A27] dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/70 font-medium'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Layers className="w-3.5 h-3.5 text-slate-400" />
                <span>Semua Kategori</span>
              </div>
              <span className="text-[11px] font-mono-data text-slate-400">
                {categoryCounts['Semua'] || totalBooksCount}
              </span>
            </button>

            {/* Senarai Kategori Mengikut Ruang (Buku vs Projek) */}
            {(activeSpace === 'projects' ? PROJECT_CATEGORIES_LIST : BOOK_CATEGORIES_LIST).map((cat) => {
              const Icon = cat.icon;
              const isSelected = selectedCategory === cat.label || selectedCategory === cat.value;
              const count = categoryCounts[cat.label] || categoryCounts[cat.value] || 0;

              return (
                <button
                  key={cat.label}
                  onClick={() => handleCategoryClick(cat.value)}
                  className={`w-full min-h-[38px] flex items-center justify-between px-3 py-2 rounded-[10px] text-xs transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-emerald-50 dark:bg-emerald-950/60 text-[#006B57] dark:text-emerald-400 font-bold border border-emerald-200/60 dark:border-emerald-800/60'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/70 font-medium'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon
                      className={`w-3.5 h-3.5 ${
                        isSelected ? 'text-[#006B57] dark:text-emerald-400' : 'text-slate-400'
                      }`}
                    />
                    <span>{cat.label}</span>
                  </div>
                  <span
                    className={`text-[11px] font-mono-data ${
                      isSelected ? 'text-[#006B57] dark:text-emerald-400 font-semibold' : 'text-slate-400'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Section 3: BUKU SAYA */}
          <div className="space-y-1 pt-3 border-t border-[#E2E8F0] dark:border-slate-800">
            <span className="px-3 text-[11px] font-bold text-[#64748B] dark:text-slate-400 uppercase tracking-wider block mb-2">
              Buku Saya
            </span>

            {/* Sedang Dibaca (1% - 99%) */}
            <button
              onClick={() => handleNavClick('reading')}
              className={`w-full min-h-[44px] flex items-center justify-between px-3.5 py-2.5 rounded-[12px] text-xs font-semibold transition-all cursor-pointer ${
                activeSpace === 'reading'
                  ? 'bg-[#ECFDF5] dark:bg-emerald-950/60 text-[#006B57] dark:text-emerald-400 font-bold border border-[#A7F3D0]/60 dark:border-emerald-800/60'
                  : 'text-[#102A27] dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/70'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <BookmarkCheck className="w-4 h-4 text-[#006B57] dark:text-emerald-400" />
                <span>Sedang Dibaca</span>
              </div>
              {readingBooksCount > 0 && (
                <span className="font-mono-data text-[11px] px-2 py-0.5 rounded-full bg-[#006B57] text-white">
                  {readingBooksCount}
                </span>
              )}
            </button>

            {/* Selesai Dibaca (100%) */}
            <button
              onClick={() => handleNavClick('completed')}
              className={`w-full min-h-[44px] flex items-center justify-between px-3.5 py-2.5 rounded-[12px] text-xs font-semibold transition-all cursor-pointer ${
                activeSpace === 'completed'
                  ? 'bg-[#ECFDF5] dark:bg-emerald-950/60 text-[#006B57] dark:text-emerald-400 font-bold border border-[#A7F3D0]/60 dark:border-emerald-800/60'
                  : 'text-[#102A27] dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/70'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>Selesai Dibaca</span>
              </div>
              <span className="font-mono-data text-[11px] text-slate-400">{completedBooksCount}</span>
            </button>

            {/* Kegemaran */}
            <button
              onClick={() => handleNavClick('favorite')}
              className={`w-full min-h-[44px] flex items-center justify-between px-3.5 py-2.5 rounded-[12px] text-xs font-semibold transition-all cursor-pointer ${
                activeSpace === 'favorite'
                  ? 'bg-[#ECFDF5] dark:bg-emerald-950/60 text-[#006B57] dark:text-emerald-400 font-bold border border-[#A7F3D0]/60 dark:border-emerald-800/60'
                  : 'text-[#102A27] dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/70'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Heart className="w-4 h-4 text-rose-500" />
                <span>Kegemaran</span>
              </div>
              <span className="font-mono-data text-[11px] text-slate-400">{favoriteBooksCount}</span>
            </button>

            {/* Rak Kustom */}
            <button
              onClick={() => handleNavClick('shelves')}
              className={`w-full min-h-[44px] flex items-center justify-between px-3.5 py-2.5 rounded-[12px] text-xs font-semibold transition-all cursor-pointer ${
                activeSpace === 'shelves'
                  ? 'bg-[#ECFDF5] dark:bg-emerald-950/60 text-[#006B57] dark:text-emerald-400 font-bold border border-[#A7F3D0]/60 dark:border-emerald-800/60'
                  : 'text-[#102A27] dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/70'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <FolderHeart className="w-4 h-4 text-amber-500" />
                <span>Rak Kustom</span>
              </div>
            </button>
          </div>

          {/* Section 4: UTILITI SIMPANAN DATA */}
          <div className="pt-3 border-t border-[#E2E8F0] dark:border-slate-800">
            <button
              onClick={() => handleNavClick('backup')}
              className={`w-full min-h-[44px] flex items-center justify-between px-3.5 py-2.5 rounded-[12px] text-xs font-semibold transition-all cursor-pointer ${
                activeSpace === 'backup'
                  ? 'bg-[#ECFDF5] dark:bg-emerald-950/60 text-[#006B57] dark:text-emerald-400 font-bold border border-[#A7F3D0]/60 dark:border-emerald-800/60'
                  : 'text-[#102A27] dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/70'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Database className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                <span>Simpanan &amp; Sandaran Data</span>
              </div>
            </button>
          </div>
        </div>

        {/* Section 5: Bawah Sidebar (Royalti Ringkas & Admin) */}
        <div className="p-4 border-t border-[#E2E8F0] dark:border-slate-800 bg-[#F7F9F8] dark:bg-slate-900/60 space-y-2 shrink-0">
          {/* Dompet Royalti 95% -> Membuka Studio Penulis */}
          <button
            onClick={() => handleNavClick('studio')}
            className="w-full min-h-[44px] flex items-center justify-between p-3 rounded-[12px] bg-white dark:bg-slate-800 border border-[#A7F3D0] dark:border-emerald-800 hover:border-[#006B57] dark:hover:border-emerald-500 text-[#006B57] dark:text-emerald-400 text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
            title="Buka Studio Penulis & Royalti (95%)"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#ECFDF5] dark:bg-emerald-950 flex items-center justify-center text-[#006B57] dark:text-emerald-400">
                <Wallet className="w-4 h-4" />
              </div>
              <div className="text-left">
                <span className="block text-[10px] text-[#64748B] dark:text-slate-400 font-normal leading-none mb-0.5">
                  Baki Royalti Penulis
                </span>
                <span className="font-mono-data font-bold text-xs text-[#006B57] dark:text-emerald-300">
                  RM {authorProfile?.balance !== undefined ? authorProfile.balance.toFixed(2) : '308.75'}
                </span>
              </div>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#ECFDF5] dark:bg-emerald-950 text-[#047857] dark:text-emerald-300">
              95%
            </span>
          </button>

          {/* Portal Admin (HANYA DIPAPARKAN KEPADA ADMIN!) */}
          {isAdmin && (
            <button
              onClick={() => {
                onOpenAdminPortal();
                if (window.innerWidth < 1024) onClose();
              }}
              className="w-full min-h-[44px] flex items-center justify-between px-3 py-2 rounded-[12px] bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-800 dark:text-rose-200 text-xs font-semibold transition-colors cursor-pointer"
              title="Portal Pentadbir: Komisen 5%"
            >
              <span className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-rose-600" />
                <span>Portal Pentadbir</span>
              </span>
              <span className="text-[10px] text-rose-500">5% Panel &rarr;</span>
            </button>
          )}
        </div>
      </aside>
    </>
  );
};
