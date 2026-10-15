import React from 'react';
import { Feather, ArrowRight, CheckCircle2 } from 'lucide-react';

interface WriterSmallBannerProps {
  onOpenStudio: () => void;
}

export const WriterSmallBanner: React.FC<WriterSmallBannerProps> = ({ onOpenStudio }) => {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-emerald-200/80 dark:border-emerald-800/80 bg-gradient-to-r from-emerald-50/90 via-teal-50/60 to-white dark:from-slate-900 dark:via-emerald-950/30 dark:to-slate-900 p-5 sm:p-6 text-left transition-all">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-start sm:items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-[#006B57] text-white flex items-center justify-center shrink-0 shadow-xs">
            <Feather className="w-5 h-5 text-emerald-200" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                Berminat Menerbitkan Karya Anda?
              </h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#ECFDF5] dark:bg-emerald-950 text-[#006B57] dark:text-emerald-400 border border-[#A7F3D0] dark:border-emerald-800">
                95% Royalti
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Daftar sebagai penulis, terbitkan fail naskhah anda, dan terima pendapatan jualan terus tanpa orang tengah.
            </p>
          </div>
        </div>

        <button
          onClick={onOpenStudio}
          className="min-h-[44px] h-11 px-5 rounded-xl bg-[#006B57] hover:bg-[#063F35] text-white text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 shadow-xs transition-all active:scale-95 cursor-pointer shrink-0"
        >
          <span>Buka Studio Penulis</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
