import React from 'react';
import { Book } from '../types/book';
import { useMarketplace } from '../context/MarketplaceContext';
import {
  Feather,
  Wallet,
  PenSquare,
  BookOpen,
  ArrowUpRight,
  TrendingUp,
  ShieldCheck,
  Sparkles,
  FileText,
  DollarSign,
  BarChart3,
  Edit3,
} from 'lucide-react';

interface AuthorStudioSpaceProps {
  books: Book[];
  onOpenWriter: () => void;
  onEditBook: (book: Book) => void;
  onOpenAuthorDashboard: () => void;
  onOpenAdminPortal: () => void;
  onOpenAuthorGuide: () => void;
  isAdmin?: boolean;
}

export const AuthorStudioSpace: React.FC<AuthorStudioSpaceProps> = ({
  books,
  onOpenWriter,
  onEditBook,
  onOpenAuthorDashboard,
  onOpenAdminPortal,
  onOpenAuthorGuide,
  isAdmin = false,
}) => {
  const { authorProfile, stats } = useMarketplace();

  // Published books
  const myWorks = books.filter((b) => !b.isDemo || b.category === 'Panduan' || b.category.includes('Novel'));

  const balance = authorProfile?.balance !== undefined ? authorProfile.balance : 308.75;
  const totalSalesCount = books.reduce((acc, b) => acc + (b.salesCount || 0), 0);

  return (
    <div className="space-y-6 sm:space-y-8 text-left animate-in fade-in duration-200">
      {/* Studio Header Banner */}
      <div className="rounded-2xl border border-emerald-200/80 dark:border-emerald-800/80 bg-gradient-to-br from-[#063F35] via-[#006B57] to-[#01221c] p-6 sm:p-8 text-white relative overflow-hidden shadow-sm">
        <div className="absolute -top-12 -right-12 w-56 h-56 bg-emerald-400/20 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-5">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-emerald-200 text-xs font-semibold border border-white/10">
              <Feather className="w-3.5 h-3.5 text-amber-300" />
              <span>Studio Penulis &amp; Penerbitan Digital</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              Pusat Autonomi &amp; Royalti Penulis
            </h1>
            <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed">
              Terbitkan karya baharu, pantau pembaca secara langsung, dan nikmati agihan telus{' '}
              <strong className="text-white font-semibold">95% royalti bersih</strong> tanpa orang tengah.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={onOpenWriter}
              className="min-h-[44px] h-11 px-5 rounded-xl bg-white text-[#006B57] hover:bg-emerald-50 text-xs sm:text-sm font-bold shadow-xs flex items-center gap-2 transition-all active:scale-95 cursor-pointer"
            >
              <PenSquare className="w-4 h-4 text-[#006B57]" />
              <span>Terbitkan Naskhah</span>
            </button>
            <button
              onClick={onOpenAuthorGuide}
              className="min-h-[44px] h-11 px-4 rounded-xl border border-white/30 hover:bg-white/10 text-white text-xs sm:text-sm font-medium flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <span>Panduan Penulis (RM20)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Royalty & Financial Summary Cards (95% vs 5%) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Card 1: Baki Royalti Terkini */}
        <div className="p-5 rounded-2xl border border-emerald-200/80 dark:border-emerald-800/80 bg-white dark:bg-slate-900 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Baki Royalti Penulis
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/80 text-[#006B57] dark:text-emerald-400 flex items-center justify-center">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <div className="my-2">
            <div className="text-2xl sm:text-3xl font-extrabold font-mono-data text-[#006B57] dark:text-emerald-400">
              RM {balance.toFixed(2)}
            </div>
            <span className="text-[11px] text-slate-500 dark:text-slate-400">
              Agihan 95% daripada setiap naskhah terjual
            </span>
          </div>
          <button
            onClick={onOpenAuthorDashboard}
            className="w-full min-h-[40px] mt-2 py-2 px-3 rounded-lg bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/60 dark:hover:bg-emerald-900/60 text-[#006B57] dark:text-emerald-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <span>Urus Dompet &amp; Penyata</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Card 2: Jumlah Pembaca & Naskhah */}
        <div className="p-5 rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Jumlah Jualan / Pembaca
            </span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="my-2">
            <div className="text-2xl sm:text-3xl font-extrabold font-mono-data text-slate-900 dark:text-white">
              {totalSalesCount}
            </div>
            <span className="text-[11px] text-slate-500 dark:text-slate-400">
              Unit naskhah dibaca &amp; dimuat turun
            </span>
          </div>
          <div className="pt-2 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800">
            <span>Koleksi Aktif: <strong>{books.length} judul</strong></span>
          </div>
        </div>

        {/* Card 3: Model Pembahagian Royalti Telus */}
        <div className="p-5 rounded-2xl border border-amber-200/80 dark:border-amber-800/80 bg-gradient-to-br from-amber-50/50 via-white to-white dark:from-amber-950/20 dark:via-slate-900 dark:to-slate-900 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-amber-800 dark:text-amber-300">
              Kadar Agihan Bersih
            </span>
            <div className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div className="my-2">
            <div className="text-2xl sm:text-3xl font-extrabold font-mono-data text-amber-600 dark:text-amber-400">
              95% : 5%
            </div>
            <span className="text-[11px] text-slate-600 dark:text-slate-300">
              95% royalti pengarang • 5% komisen platform
            </span>
          </div>
          <div className="pt-2 text-[11px] text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800">
            Tanpa caj tersembunyi atau potongan pengedar pihak ketiga.
          </div>
        </div>
      </div>

      {/* Senarai Karya & Manuskrip Anda */}
      <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
              Pengurusan Manuskrip &amp; Naskhah Diterbitkan
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Kemas kini kandungan bab, ubah harga, atau muat naik fail naskhah baharu.
            </p>
          </div>
          <button
            onClick={onOpenWriter}
            className="min-h-[44px] h-10 px-4 rounded-xl bg-[#006B57] hover:bg-[#063F35] text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer self-start sm:self-auto shrink-0"
          >
            <PenSquare className="w-3.5 h-3.5" />
            <span>Tambah Bab / Naskhah</span>
          </button>
        </div>

        {/* Table / Works List */}
        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {books.map((work) => (
            <div
              key={work.id}
              className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/60 dark:hover:bg-slate-800/40 px-2 rounded-xl transition-colors"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-14 rounded-md overflow-hidden bg-slate-900 shrink-0 border border-black/10">
                  {work.imageUrl || work.coverUrl ? (
                    <img
                      src={work.imageUrl || work.coverUrl}
                      alt={work.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-[#006B57] text-white flex items-center justify-center text-[10px]">
                      {work.category.substring(0, 3)}
                    </div>
                  )}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                      {work.title}
                    </h4>
                    {work.isDemo && (
                      <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 uppercase">
                        Demo
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    <span>{work.category}</span>
                    <span>•</span>
                    <span>{work.chapters?.length || 1} Bab</span>
                    <span>•</span>
                    <span className="font-mono-data">{work.totalWords?.toLocaleString('ms-MY') || 0} perkataan</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0 self-end sm:self-auto">
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 uppercase block font-semibold leading-tight">
                    Harga
                  </span>
                  <span className="font-bold text-sm text-slate-900 dark:text-white font-mono-data">
                    {!work.price || work.price <= 0 ? 'Percuma' : `RM ${work.price.toFixed(2)}`}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => onEditBook(work)}
                  className="min-h-[38px] h-9 px-3 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Sunting</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Admin Portal Card - ONLY VISIBLE IF isAdmin IS TRUE */}
      {isAdmin && (
        <div className="rounded-2xl border border-rose-200 dark:border-rose-900/60 bg-gradient-to-r from-rose-50/60 via-white to-white dark:from-rose-950/20 dark:via-slate-900 dark:to-slate-900 p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-rose-600 text-white flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                  Portal Pentadbir (Admin Platform)
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 border border-rose-200">
                  5% Komisen
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
                Pengurusan hasil keseluruhan platform, audit transaksi pembayaran FPX/Kad, dan kelulusan penulis.
              </p>
            </div>
          </div>

          <button
            onClick={onOpenAdminPortal}
            className="min-h-[44px] h-11 px-5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer shrink-0"
          >
            <span>Buka Panel Pentadbir</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
