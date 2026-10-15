import React from 'react';
import { Sparkles, ArrowRight, BookOpen, Feather } from 'lucide-react';

interface CompactHeroBannerProps {
  onExploreBooks: () => void;
  onOpenStudio: () => void;
}

export const CompactHeroBanner: React.FC<CompactHeroBannerProps> = ({
  onExploreBooks,
  onOpenStudio,
}) => {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#063F35] via-[#006B57] to-[#012620] text-white p-5 sm:p-7 shadow-sm text-left select-none">
      {/* Subtle Background Glow */}
      <div className="absolute -top-12 -right-12 w-48 h-48 bg-emerald-400/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-teal-300/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1.5 max-w-xl">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/10 text-emerald-200 text-[11px] font-semibold border border-white/10">
            <Sparkles className="w-3 h-3 text-amber-300" />
            <span>Pustaka &amp; Studio Digital Karya</span>
          </div>

          <h1 className="text-xl sm:text-2xl lg:text-[26px] font-bold tracking-tight text-white leading-snug">
            Perpustakaan Digital Masa Hadapan.
          </h1>

          <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed">
            Akses naskhah terpilih di pelayar tanpa pasang aplikasi, atau jana{' '}
            <strong className="text-white font-semibold">95% royalti</strong> sebagai penulis.
          </p>
        </div>

        {/* Action Button (min 44px) */}
        <div className="flex items-center gap-2.5 shrink-0 pt-1 sm:pt-0">
          <button
            onClick={onOpenStudio}
            className="min-h-[44px] h-11 px-4 sm:px-5 rounded-xl bg-white text-[#006B57] hover:bg-emerald-50 text-xs sm:text-sm font-bold shadow-xs flex items-center gap-2 transition-all active:scale-95 cursor-pointer"
          >
            <Feather className="w-4 h-4 text-[#006B57]" />
            <span>Studio Penulis</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
