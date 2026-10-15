import React, { useState } from 'react';
import { Book } from '../types/book';
import { useMarketplace } from '../context/MarketplaceContext';
import { BookPurchaseModal } from './BookPurchaseModal';
import { BookCover } from './BookCover';
import {
  Heart,
  MoreVertical,
  Check,
  Edit3,
  Trash2,
  Share2,
  BookOpen,
  Info,
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
  onDeleteBook,
  onEditBook,
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const [isPurchaseOpen, setIsPurchaseOpen] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [copiedToast, setCopiedToast] = useState(false);
  const [imageError, setImageError] = useState(false);
  const { isBookPurchased } = useMarketplace();

  const isFree = !book.price || book.price <= 0;
  const purchased = isBookPurchased(book.id) || isFree;
  const imageSource = !imageError ? (book.imageUrl || book.coverUrl) : null;

  const formatPrice = (price?: number, currency: string = 'RM') => {
    if (price === undefined || price === null || price === 0) return 'Percuma';
    return `${currency} ${price.toFixed(2)}`;
  };

  const handleCopyLink = () => {
    setShowMenu(false);
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedToast(true);
      setTimeout(() => setCopiedToast(false), 2200);
    }
  };

  const handleDelete = () => {
    setShowMenu(false);
    setShowDeleteConfirm(false);
    onDeleteBook(book.id);
  };

  const handleReadClick = () => {
    if (purchased || (book.freeChapterCount && book.freeChapterCount > 0)) {
      onOpenReader(book);
    } else {
      setIsPurchaseOpen(true);
    }
  };

  // Subtle ambient backdrop color based on book category/theme
  const getAmbientGlow = (category: string) => {
    switch (category) {
      case 'Novel Sastra':
      case 'Novel & Sastera':
        return 'rgba(30, 58, 138, 0.2)';
      case 'Misteri & Detektif':
        return 'rgba(131, 24, 67, 0.2)';
      case 'Fantasi & Petualangan':
      case 'Aplikasi Web':
        return 'rgba(5, 150, 105, 0.2)';
      case 'Resepi':
        return 'rgba(194, 65, 12, 0.2)';
      case 'Romansa':
        return 'rgba(225, 29, 72, 0.2)';
      default:
        return 'rgba(0, 107, 87, 0.2)';
    }
  };

  return (
    <>
      <article className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col group relative select-none">
        {/* Toast Notification */}
        {copiedToast && (
          <div className="absolute top-3 left-1/2 -translate-x-1/2 z-40 bg-[#063F35] text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1.5 animate-in fade-in-50 duration-150">
            <Check className="w-3.5 h-3.5 text-emerald-400" />
            <span>Pautan naskhah berjaya disalin!</span>
          </div>
        )}

        {/* ======================================================== */}
        {/* 1. STAGE PAMERAN BUKU (NATURAL PORTRAIT 3D HARDCOVER)     */}
        {/* ======================================================== */}
        <div className="relative w-full min-h-[290px] sm:min-h-[310px] p-6 sm:p-7 flex flex-col items-center justify-center bg-gradient-to-b from-stone-100/90 via-slate-50/70 to-white dark:from-slate-800/80 dark:via-slate-900/60 dark:to-slate-900/95 border-b border-slate-100 dark:border-slate-800/80 overflow-hidden">
          {/* Ambient Studio Lighting Glow */}
          <div
            className="absolute inset-0 blur-3xl opacity-40 dark:opacity-25 pointer-events-none transform scale-90"
            style={{ background: getAmbientGlow(book.category) }}
          />

          {/* Top Stage Left: Status or Price Badge */}
          <div className="absolute top-3.5 left-3.5 z-20 flex items-center gap-1.5">
            {book.status === 'reading' ? (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold bg-emerald-700/90 text-white backdrop-blur-md shadow-xs">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-pulse" />
                <span>Sedang Dibaca</span>
              </span>
            ) : (
              <span
                className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold backdrop-blur-md shadow-xs ${
                  isFree
                    ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/30'
                    : 'bg-black/60 text-white border border-white/20'
                }`}
              >
                {formatPrice(book.price)}
              </span>
            )}
          </div>

          {/* Top Stage Right: Favorite & Quick Menu */}
          <div className="absolute top-3.5 right-3.5 z-20 flex items-center gap-1.5">
            {/* Favorite Button */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onToggleFavorite(book.id, book.isFavorite);
              }}
              className={`w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-md transition-all cursor-pointer shadow-xs ${
                book.isFavorite
                  ? 'bg-rose-500 text-white'
                  : 'bg-black/35 hover:bg-black/60 text-white/80 hover:text-white'
              }`}
              title={book.isFavorite ? 'Buang daripada kegemaran' : 'Tambah ke kegemaran'}
              aria-label="Kegemaran"
            >
              <Heart className={`w-4 h-4 ${book.isFavorite ? 'fill-current' : ''}`} />
            </button>

            {/* Quick Menu */}
            <div className="relative">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowMenu(!showMenu);
                }}
                className="w-8 h-8 rounded-full bg-black/35 hover:bg-black/60 text-white/80 hover:text-white backdrop-blur-md flex items-center justify-center transition-all cursor-pointer shadow-xs"
                title="Pilihan lanjut"
                aria-label="Pilihan lanjut"
              >
                <MoreVertical className="w-4 h-4" />
              </button>

              {/* Dropdown Menu */}
              {showMenu && (
                <>
                  <div className="fixed inset-0 z-30" onClick={() => setShowMenu(false)} />
                  <div className="absolute right-0 top-10 z-40 w-44 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl py-1 text-xs animate-in fade-in-50 duration-150">
                    {onEditBook && (
                      <button
                        onClick={() => {
                          setShowMenu(false);
                          onEditBook(book);
                        }}
                        className="w-full flex items-center gap-2 px-3.5 py-2 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                      >
                        <Edit3 className="w-3.5 h-3.5 text-slate-400" />
                        <span>Sunting Naskhah</span>
                      </button>
                    )}

                    <button
                      onClick={handleCopyLink}
                      className="w-full flex items-center gap-2 px-3.5 py-2 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                    >
                      <Share2 className="w-3.5 h-3.5 text-slate-400" />
                      <span>Salin Pautan</span>
                    </button>

                    <button
                      onClick={() => {
                        setShowMenu(false);
                        setShowDeleteConfirm(true);
                      }}
                      className="w-full flex items-center gap-2 px-3.5 py-2 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer border-t border-slate-100 dark:border-slate-800"
                    >
                      <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                      <span>Padam Naskhah</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* THE 3D BOOK COVER OBJECT (NATURAL PORTRAIT RATIO) */}
          <div
            onClick={handleReadClick}
            className="relative z-10 w-[155px] sm:w-[170px] aspect-[2/3] max-h-[255px] rounded-r-md rounded-l-xs cursor-pointer group/cover transition-all duration-300 transform group-hover:-translate-y-2 group-hover:scale-[1.02]"
            title={`Ketik untuk membaca "${book.title}"`}
          >
            {/* 3D Realistic Book Drop Shadow on Ground */}
            <div className="absolute -bottom-3 inset-x-3 h-5 bg-black/40 dark:bg-black/70 blur-md rounded-full pointer-events-none transform scale-95 transition-all duration-300 group-hover:scale-105 group-hover:opacity-70" />

            {imageSource ? (
              /* Real Custom / Uploaded Book Cover (Displays FULL portrait without clipping) */
              <div className="relative w-full h-full rounded-r-md rounded-l-xs overflow-hidden book-spine-effect shadow-[0_12px_28px_-6px_rgba(0,0,0,0.35)] dark:shadow-[0_16px_36px_-6px_rgba(0,0,0,0.65)] bg-slate-900 border-r-2 border-amber-50/20">
                {/* Book Spine Line Shader */}
                <div className="book-spine-line" />

                {/* Left Spine Fold Depth Gradient */}
                <div className="absolute inset-y-0 left-0 w-4 bg-gradient-to-r from-black/45 via-black/15 to-transparent pointer-events-none z-10" />

                {/* Real Book Cover Image - Clean object-cover in portrait 2:3 */}
                <img
                  src={imageSource}
                  alt={book.title}
                  loading="lazy"
                  onError={() => setImageError(true)}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover/cover:scale-105"
                />

                {/* Top Subtle Gloss Reflection */}
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-white/20 pointer-events-none opacity-60 group-hover/cover:opacity-80 transition-opacity" />

                {/* Hover Read Indicator Pill */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/cover:opacity-100 transition-opacity flex items-center justify-center p-3 backdrop-blur-[1px]">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#006B57] text-white text-xs font-semibold shadow-lg transform translate-y-1 group-hover/cover:translate-y-0 transition-transform">
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Baca Naskhah</span>
                  </span>
                </div>
              </div>
            ) : (
              /* Thematic Classical Typography Book Cover */
              <div className="w-full h-full flex items-center justify-center">
                <BookCover
                  title={book.title}
                  author={book.author}
                  coverTheme={book.coverTheme}
                  size="md"
                  className="w-full h-full shadow-[0_12px_28px_-6px_rgba(0,0,0,0.35)]"
                />
              </div>
            )}
          </div>

          {/* Reading Progress Line (if in progress) */}
          {book.currentProgress > 0 && (
            <div className="relative z-10 w-[155px] sm:w-[170px] mt-3 space-y-1 text-left">
              <div className="flex items-center justify-between text-[10px] font-mono-data text-slate-500 dark:text-slate-400">
                <span>Kemajuan</span>
                <span className="font-semibold text-[#006B57] dark:text-emerald-400">
                  {book.currentProgress}%
                </span>
              </div>
              <div className="w-full h-1 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#006B57] to-emerald-400 rounded-full transition-all duration-300"
                  style={{ width: `${book.currentProgress}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* ======================================================== */}
        {/* 2. MAKLUMAT EDITORIAL & TIPOGRAFI NASKHAH                 */}
        {/* ======================================================== */}
        <div className="p-5 flex-1 flex flex-col justify-between text-left space-y-3.5">
          <div className="space-y-1.5">
            {/* Kategori Unboxed Kicker */}
            <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-[#006B57] dark:text-emerald-400">
              <span>{book.category}</span>
              <span className="font-mono-data text-[10px] text-slate-400 dark:text-slate-500 font-medium">
                {book.sku || 'KARYA-DIGITAL'}
              </span>
            </div>

            {/* Tajuk Buku Berkualiti Tinggi (Serif Sastera) */}
            <h3
              onClick={handleReadClick}
              className="font-serif-book font-bold text-lg sm:text-[19px] text-slate-900 dark:text-white leading-snug line-clamp-1 group-hover:text-[#006B57] dark:group-hover:text-emerald-400 transition-colors cursor-pointer"
              title={book.title}
            >
              {book.title}
            </h3>

            {/* Nama Penulis */}
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-medium truncate">
              oleh <span className="text-slate-900 dark:text-slate-100 font-semibold">{book.author}</span>
            </p>

            {/* Sinopsis / Penerangan Ringkas */}
            <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed pt-1">
              {book.description}
            </p>
          </div>

          {/* Metadata Naskhah (Unboxed, bersih dengan pembahagi titik ·) */}
          <div className="flex items-center flex-wrap gap-x-2 gap-y-1 text-[11px] text-slate-500 dark:text-slate-400 font-medium pt-1 border-t border-slate-100 dark:border-slate-800">
            <span>{book.totalWords ? `${book.totalWords.toLocaleString('ms-MY')} kata` : 'Edisi Lengkap'}</span>
            <span aria-hidden="true" className="text-slate-300 dark:text-slate-600">·</span>
            <span>~{book.estimatedReadTimeMinutes || 20} min baca</span>
            {book.salesCount ? (
              <>
                <span aria-hidden="true" className="text-slate-300 dark:text-slate-600">·</span>
                <span>{book.salesCount} pembaca</span>
              </>
            ) : null}
          </div>
        </div>

        {/* ======================================================== */}
        {/* 3. BAHAGIAN BAWAH (ACTION FOOTER): HARGA & BACA NASKHAH  */}
        {/* ======================================================== */}
        <div className="border-t border-slate-100 dark:border-slate-800/80 px-5 py-3.5 flex items-center justify-between gap-3 mt-auto bg-slate-50/50 dark:bg-slate-900/50">
          {/* Harga Naskhah */}
          <div>
            <span className="text-[10px] uppercase tracking-wider text-slate-400 dark:text-slate-500 font-semibold block leading-tight">
              Harga
            </span>
            <span
              className={`text-sm font-bold tracking-tight ${
                isFree ? 'text-[#006B57] dark:text-emerald-400' : 'text-slate-900 dark:text-white'
              }`}
            >
              {formatPrice(book.price)}
            </span>
          </div>

          {/* Butang Tindakan */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onOpenDetail(book)}
              className="p-2 rounded-xl text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              title="Maklumat terperinci naskhah"
              aria-label="Maklumat terperinci"
            >
              <Info className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={handleReadClick}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-[#006B57] hover:bg-[#063F35] dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white shadow-2xs hover:shadow-xs transition-all active:scale-[0.97] cursor-pointer"
              title="Buka naskhah di e-reader pelayar"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>{purchased ? 'Mula Membaca' : isFree ? 'Baca Percuma' : 'Buka Naskhah'}</span>
            </button>
          </div>
        </div>
      </article>

      {/* Delete Confirmation Dialog */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in-50 duration-150">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-sm w-full p-6 shadow-2xl space-y-4 animate-in zoom-in-95 duration-150 text-left">
            <h4 className="text-base font-bold text-slate-900 dark:text-white">Padam Naskhah?</h4>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Adakah anda pasti ingin memadam naskhah <strong>"{book.title}"</strong>? Tindakan ini tidak boleh dibatalkan.
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(false)}
                className="px-3.5 py-2 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleDelete}
                className="px-4 py-2 text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white rounded-xl transition-colors cursor-pointer shadow-xs"
              >
                Padam
              </button>
            </div>
          </div>
        </div>
      )}

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
