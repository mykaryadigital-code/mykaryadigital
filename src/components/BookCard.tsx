import React, { useState } from 'react';
import { Book } from '../types/book';
import { useMarketplace } from '../context/MarketplaceContext';
import { BookPurchaseModal } from './BookPurchaseModal';
import { BookCover } from './BookCover';
import {
  Heart,
  BookOpen,
  RotateCcw,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';

interface BookCardProps {
  book: Book;
  onOpenReader: (book: Book) => void;
  onOpenDetail: (book: Book) => void;
  onToggleFavorite: (bookId: string, current: boolean) => void;
  onDeleteBook: (bookId: string) => void;
  onUpdateStatus: (bookId: string, status: Book['status']) => void;
  onEditBook?: (book: Book) => void;
}

export const BookCard: React.FC<BookCardProps> = ({
  book,
  onOpenReader,
  onOpenDetail,
  onToggleFavorite,
}) => {
  const [isPurchaseOpen, setIsPurchaseOpen] = useState(false);
  const [imageError, setImageError] = useState(false);
  const { isBookPurchased } = useMarketplace();

  const isFree = !book.price || book.price <= 0;
  const purchased = isBookPurchased(book.id) || isFree;
  const imageSource = !imageError ? (book.imageUrl || book.coverUrl) : null;

  // Format currency
  const formatPrice = (price?: number, currency: string = 'RM') => {
    if (price === undefined || price === null || price === 0) return 'Percuma';
    return `${currency} ${price.toFixed(2)}`;
  };

  // Status calculation: 0 = Belum Mula, 1-99 = Sedang Dibaca, 100 = Selesai
  const progress = Math.max(0, Math.min(100, Math.round(book.currentProgress || 0)));
  const isCompleted = progress >= 100;
  const isInProgress = progress > 0 && progress < 100;
  const isNotStarted = progress === 0;

  // Primary Action Handler
  const handlePrimaryAction = () => {
    if (isNotStarted && !purchased && !book.freeChapterCount) {
      setIsPurchaseOpen(true);
      return;
    }
    // Open reader directly
    onOpenReader(book);
  };

  // Primary button label & icon
  const getButtonConfig = () => {
    if (isCompleted) {
      return {
        label: 'Baca Semula',
        icon: RotateCcw,
        variant: 'border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700',
      };
    }
    if (isInProgress) {
      return {
        label: 'Sambung Membaca',
        icon: BookOpen,
        variant: 'bg-[#006B57] hover:bg-[#063F35] text-white shadow-xs',
      };
    }
    // isNotStarted
    if (!purchased && !isFree && (!book.freeChapterCount || book.freeChapterCount <= 0)) {
      return {
        label: `Dapatkan • ${formatPrice(book.price)}`,
        icon: Sparkles,
        variant: 'bg-[#006B57] hover:bg-[#063F35] text-white shadow-xs',
      };
    }
    return {
      label: 'Mula Membaca',
      icon: BookOpen,
      variant: 'bg-[#006B57] hover:bg-[#063F35] text-white shadow-xs',
    };
  };

  const btnConfig = getButtonConfig();
  const BtnIcon = btnConfig.icon;

  return (
    <>
      <article className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-xs hover:shadow-lg transition-all duration-300 hover:-translate-y-1 flex flex-col group relative select-none">
        {/* ======================================================== */}
        {/* 1. COVER SHOWCASE (NATURAL PORTRAIT 2:3 WITH 3D DEPTH)   */}
        {/* ======================================================== */}
        <div
          onClick={() => onOpenDetail(book)}
          className="relative w-full h-[225px] sm:h-[245px] p-4 flex items-center justify-center bg-gradient-to-b from-stone-100/80 via-slate-50/60 to-white dark:from-slate-800/80 dark:via-slate-900/60 dark:to-slate-900 border-b border-slate-100 dark:border-slate-800/80 overflow-hidden cursor-pointer"
        >
          {/* Subtle Ambient Color Glow */}
          <div className="absolute inset-0 bg-emerald-500/10 dark:bg-emerald-400/5 blur-2xl transform scale-75 pointer-events-none" />

          {/* Top Left: Demo Badge / Status */}
          <div className="absolute top-3 left-3 z-20 flex items-center gap-1.5">
            {book.isDemo && (
              <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-slate-900/75 text-amber-300 border border-amber-400/30 backdrop-blur-md shadow-2xs">
                Demo
              </span>
            )}

            {isCompleted && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-600/90 text-white backdrop-blur-md shadow-2xs">
                <CheckCircle2 className="w-2.5 h-2.5" />
                <span>Selesai</span>
              </span>
            )}
          </div>

          {/* Top Right: Favorite Button */}
          <div className="absolute top-3 right-3 z-20">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onToggleFavorite(book.id, book.isFavorite);
              }}
              className={`w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-md transition-all cursor-pointer shadow-xs active:scale-95 ${
                book.isFavorite
                  ? 'bg-rose-500 text-white'
                  : 'bg-black/30 hover:bg-black/50 text-white/80 hover:text-white'
              }`}
              title={book.isFavorite ? 'Buang daripada kegemaran' : 'Tambah ke kegemaran'}
              aria-label="Kegemaran"
            >
              <Heart className={`w-3.5 h-3.5 ${book.isFavorite ? 'fill-current' : ''}`} />
            </button>
          </div>

          {/* The 3D Book Object */}
          <div className="relative z-10 w-[125px] sm:w-[140px] aspect-[2/3] max-h-[210px] rounded-r-md rounded-l-xs shadow-[0_10px_25px_-5px_rgba(0,0,0,0.3)] dark:shadow-[0_14px_30px_-5px_rgba(0,0,0,0.6)] group-hover:scale-[1.03] group-hover:-translate-y-1 transition-transform duration-300">
            {imageSource ? (
              <div className="relative w-full h-full rounded-r-md rounded-l-xs overflow-hidden book-spine-effect bg-slate-900 border-r border-amber-50/20">
                <div className="book-spine-line" />
                <div className="absolute inset-y-0 left-0 w-3 bg-gradient-to-r from-black/40 via-black/10 to-transparent pointer-events-none z-10" />
                <img
                  src={imageSource}
                  alt={book.title}
                  loading="lazy"
                  onError={() => setImageError(true)}
                  className="w-full h-full object-cover select-none"
                />
              </div>
            ) : (
              <BookCover
                title={book.title}
                author={book.author}
                coverTheme={book.coverTheme}
                size="sm"
                className="w-full h-full"
              />
            )}
          </div>
        </div>

        {/* ======================================================== */}
        {/* 2. MAKLUMAT RINGKAS: TAJUK, PENULIS, HARGA / KEMAJUAN     */}
        {/* ======================================================== */}
        <div className="p-4 flex-1 flex flex-col justify-between text-left space-y-3">
          <div>
            {/* Tajuk Buku */}
            <h3
              onClick={() => onOpenDetail(book)}
              className="font-serif-book font-bold text-base sm:text-[17px] text-slate-900 dark:text-white leading-snug line-clamp-1 group-hover:text-[#006B57] dark:group-hover:text-emerald-400 transition-colors cursor-pointer"
              title={book.title}
            >
              {book.title}
            </h3>

            {/* Nama Penulis */}
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium truncate mt-0.5">
              {book.author}
            </p>
          </div>

          {/* Baris Status: Kemajuan Bacaan ATAU Harga */}
          <div className="pt-1">
            {isInProgress ? (
              /* Kemajuan Bacaan (1% - 99%) */
              <div className="space-y-1">
                <div className="flex items-center justify-between text-[11px] font-mono-data">
                  <span className="text-slate-500 dark:text-slate-400">Kemajuan bacaan</span>
                  <span className="font-bold text-[#006B57] dark:text-emerald-400">{progress}%</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#006B57] to-emerald-400 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            ) : isCompleted ? (
              /* Selesai 100% */
              <div className="flex items-center justify-between text-xs">
                <span className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Selesai dibaca</span>
                </span>
                <span className="font-mono-data text-[11px] text-slate-400">100%</span>
              </div>
            ) : (
              /* Belum Mula: Papar Harga */
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-slate-500 dark:text-slate-400">Harga</span>
                <span
                  className={`text-sm font-bold tracking-tight ${
                    isFree ? 'text-[#006B57] dark:text-emerald-400' : 'text-slate-900 dark:text-white'
                  }`}
                >
                  {formatPrice(book.price)}
                </span>
              </div>
            )}
          </div>

          {/* ======================================================== */}
          {/* 3. SATU BUTANG UTAMA (MINIMUM 44PX TARGET TOUCH)          */}
          {/* ======================================================== */}
          <div className="pt-1">
            <button
              type="button"
              onClick={handlePrimaryAction}
              className={`w-full min-h-[44px] h-11 px-4 rounded-xl text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-all active:scale-[0.98] cursor-pointer ${btnConfig.variant}`}
            >
              <BtnIcon className="w-4 h-4 shrink-0" />
              <span className="truncate">{btnConfig.label}</span>
            </button>
          </div>
        </div>
      </article>

      {/* Book Purchase Modal if locked */}
      {isPurchaseOpen && (
        <BookPurchaseModal
          book={book}
          isOpen={isPurchaseOpen}
          onClose={() => setIsPurchaseOpen(false)}
          onPurchaseSuccess={() => {
            setIsPurchaseOpen(false);
            onOpenReader(book);
          }}
        />
      )}
    </>
  );
};
