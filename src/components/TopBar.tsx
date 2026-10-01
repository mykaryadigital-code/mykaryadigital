import React from 'react';
import {
  Menu,
  X,
  Search,
  PenSquare,
  User,
  Wallet,
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
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#E2E8F0] shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
      <div className="max-w-[1400px] h-[72px] mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-3 sm:gap-4">
        {/* Left Zone: Sidebar Toggle + Brand Logo */}
        <div className="flex items-center gap-2.5 sm:gap-3.5 shrink-0">
          <button
            onClick={onToggleSidebar}
            className={`w-10 h-10 rounded-[10px] flex items-center justify-center border transition-all cursor-pointer ${
              isSidebarOpen
                ? 'bg-[#ECFDF5] border-[#A7F3D0] text-[#006B57]'
                : 'bg-slate-50 hover:bg-slate-100 border-[#E2E8F0] text-[#102A27]'
            }`}
            title={isSidebarOpen ? 'Tutup Bilah Sisi' : 'Buka Bilah Sisi (Menu & Kategori)'}
            aria-label="Toggle Sidebar"
          >
            {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <button
            onClick={onOpenProfile}
            className="flex items-center text-left cursor-pointer transition-transform hover:scale-[1.01] active:scale-[0.99]"
            title="Karya Digital - Halaman Utama"
          >
            <KaryaDigitalLogo size="md" />
          </button>
        </div>

        {/* Center Zone: Search Bar (Desktop / Tablet) */}
        <div className="flex-1 max-w-md mx-2 sm:mx-6 hidden sm:block">
          <div className="relative w-full">
            <Search className="w-4 h-4 text-[#64748B] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="🔍 Cari buku, penulis atau kategori..."
              className="w-full h-11 text-xs pl-10 pr-8 bg-[#F8FAFC] hover:bg-white focus:bg-white border border-[#E2E8F0] rounded-[12px] focus:outline-none focus:border-[#006B57] focus:ring-1 focus:ring-[#006B57] transition-all text-[#102A27] placeholder:text-[#94A3B8]"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs p-1"
                aria-label="Padam Carian"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Right Zone: Primary Actions (Tulis Buku > Royalti Pill > Profile Avatar) */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Quick Royalti Pill (Desktop) */}
          <button
            onClick={onOpenAuthorPortal}
            className="hidden md:flex items-center gap-1.5 h-10 px-3.5 text-xs font-semibold text-[#006B57] bg-[#ECFDF5] hover:bg-[#D1FAE5] border border-[#A7F3D0]/80 rounded-full transition-colors cursor-pointer whitespace-nowrap shadow-2xs"
            title="Baki Dompet Royalti Penulis (95%)"
          >
            <Wallet className="w-3.5 h-3.5 text-[#006B57]" />
            <span className="text-[#64748B] font-medium hidden lg:inline">Royalti:</span>
            <span className="font-mono-data font-bold">
              RM {authorProfile?.balance !== undefined ? authorProfile.balance.toFixed(2) : '308.75'}
            </span>
          </button>

          {/* Primary Action Button: Tulis Buku */}
          <button
            onClick={handleWriteClick}
            className="flex items-center gap-2 h-10 sm:h-11 px-4 text-xs sm:text-sm font-semibold text-white bg-[#006B57] hover:bg-[#063F35] rounded-[12px] transition-all cursor-pointer shadow-xs active:scale-[0.98]"
            title="Tulis buku baharu atau unggah manuskrip"
          >
            <PenSquare className="w-4 h-4 text-emerald-100" />
            <span className="whitespace-nowrap hidden xs:inline">Tulis Buku</span>
          </button>

          {/* Profile / Account Avatar */}
          <button
            onClick={onOpenProfile}
            className="w-10 h-10 rounded-full bg-white border border-[#E2E8F0] hover:border-[#006B57] text-[#102A27] hover:text-[#006B57] flex items-center justify-center shrink-0 transition-colors shadow-2xs cursor-pointer"
            title="Profil Penulis & Maklumat Pendaftaran"
            aria-label="Profil Pengguna"
          >
            <User className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Mobile Search Bar row (Integrated seamlessly) */}
      <div className="sm:hidden px-4 pb-2.5 pt-0.5 bg-white border-t border-[#F1F5F9]">
        <div className="relative w-full">
          <Search className="w-4 h-4 text-[#64748B] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="🔍 Cari buku, penulis atau kategori..."
            className="w-full h-9 text-xs pl-9 pr-7 bg-[#F8FAFC] border border-[#E2E8F0] rounded-[10px] focus:outline-none focus:border-[#006B57] text-[#102A27]"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs"
            >
              ✕
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
