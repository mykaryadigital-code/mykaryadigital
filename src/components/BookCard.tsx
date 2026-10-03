import React, { useState } from 'react';
import { Book } from '../types/book';
import { useMarketplace } from '../context/MarketplaceContext';
import { BookPurchaseModal } from './BookPurchaseModal';
import {
  ExternalLink,
  ArrowUpRight,
  Heart,
  MoreVertical,
  Check,
  Edit3,
  Trash2,
  Share2,
  BookOpen,
  Code2,
  Layers,
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

  const handleLiveDemoClick = () => {
    if (purchased || (book.freeChapterCount && book.freeChapterCount > 0)) {
      onOpenReader(book);
    } else {
      setIsPurchaseOpen(true);
    }
  };

  // Curate modern tech-stack badges from tags or defaults
  const techStackList = React.useMemo(() => {
    if (book.tags && book.tags.length > 0) {
      // Map tags to clean tech badges
      return book.tags.slice(0, 3);
    }
    // Intelligent fallback tech stack based on project category
    if (book.category === 'Aplikasi Web') return ['React', 'Tailwind', 'Vite'];
    if (book.category === 'Sistem & Automasi') return ['TypeScript', 'Fintech', 'EPUB'];
    if (book.category === 'Bisnes & E-Dagang') return ['React', 'Tailwind', 'E-Dagang'];
    return ['Tailwind', 'TypeScript', 'IndexedDB'];
  }, [book.tags, book.category]);

  // Background gradient theme for preview banner
  const getBannerGradient = (variant?: string) => {
    switch (variant) {
      case 'navy':
        return 'from-slate-900 via-indigo-950 to-slate-900 text-indigo-300';
      case 'burgundy':
        return 'from-rose-950 via-slate-900 to-rose-900 text-rose-300';
      case 'slate':
        return 'from-slate-800 via-slate-900 to-slate-950 text-slate-300';
      case 'amber':
        return 'from-amber-950 via-slate-900 to-yellow-950 text-amber-300';
      case 'emerald':
      default:
        return 'from-[#063F35] via-[#006B57] to-slate-900 text-emerald-200';
    }
  };

  return (
    <>
      <article className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col group relative">
        {/* Toast Notification */}
        {copiedToast && (
          <div className="absolute top-3 left-1/2 -translate-x-1/2 z-40 bg-[#063F35] text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1.5 animate-in fade-in-50 duration-150">
            <Check className="w-3.5 h-3.5 text-emerald-400" />
            <span>Pautan projek berjaya disalin!</span>
          </div>
        )}

        {/* Bahagian Atas: Imej Pratonton dengan nisbah aspek tetap (aspect-video / 16:9) & zoom halus */}
        <div className="relative w-full aspect-video overflow-hidden bg-slate-100 dark:bg-slate-800 select-none">
          {imageSource ? (
            <img
              src={imageSource}
              alt={book.title}
              loading="lazy"
              onError={() => setImageError(true)}
              className="w-full h-full aspect-video object-cover transition-transform duration-500 ease-out group-hover:scale-105"
            />
          ) : (
            /* Modern Generative Project Preview Banner Canvas (Fallback with category icon & gradient) */
            <div
              className={`w-full h-full aspect-video bg-gradient-to-br ${getBannerGradient(
                book.coverTheme?.variant
              )} p-5 flex flex-col justify-between relative overflow-hidden transition-transform duration-500 ease-out group-hover:scale-105`}
            >
              {/* Subtle architectural dot/grid background watermark */}
              <div
                className="absolute inset-0 opacity-[0.08] pointer-events-none"
                style={{
                  backgroundImage: 'radial-gradient(currentColor 1.5px, transparent 1.5px)',
                  backgroundSize: '16px 16px',
                }}
              />

              {/* Decorative Geometric Rings */}
              <div className="absolute -right-8 -bottom-8 w-40 h-40 rounded-full border border-white/10 pointer-events-none" />
              <div className="absolute -right-14 -bottom-14 w-52 h-52 rounded-full border border-white/5 pointer-events-none" />

              {/* Mock Browser Header Bar */}
              <div className="flex items-center justify-between relative z-10">
                <div className="flex items-center gap-1.5 opacity-60">
                  <span className="w-2.5 h-2.5 rounded-full bg-white/40" />
                  <span className="w-2.5 h-2.5 rounded-full bg-white/40" />
                  <span className="w-2.5 h-2.5 rounded-full bg-white/40" />
                </div>
                <span className="text-[10px] font-mono-data tracking-wider uppercase opacity-75 font-semibold">
                  {book.sku || 'KARYA-DIGITAL'}
                </span>
              </div>

              {/* Center Canvas Mockup Text / Icon */}
              <div className="relative z-10 my-auto text-left">
                <div className="inline-flex items-center gap-2 p-2 rounded-xl bg-white/10 backdrop-blur-md border border-white/10 text-white mb-2 shadow-xs">
                  <Code2 className="w-4 h-4 text-emerald-300" />
                  <span className="text-xs font-semibold">{book.category}</span>
                </div>
                <h4 className="text-white font-bold text-sm sm:text-base leading-tight font-sans line-clamp-1 drop-shadow-xs">
                  {book.title}
                </h4>
              </div>

              {/* Bottom Canvas Author Info */}
              <div className="relative z-10 flex items-center justify-between text-[11px] text-white/70 font-medium">
                <span className="truncate max-w-[180px]">{book.author}</span>
                <span className="font-mono-data text-[10px]">{book.totalWords} perkataan</span>
              </div>
            </div>
          )}

          {/* Top Overlays: Status / Price Badge on Left */}
          <div className="absolute top-3 left-3 z-20 flex items-center gap-1.5">
            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-md shadow-xs ${
                isFree
                  ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/30'
                  : purchased
                  ? 'bg-slate-900/80 text-white border border-white/20'
                  : 'bg-black/60 text-white border border-white/20'
              }`}
            >
              {formatPrice(book.price)}
            </span>

            {book.status === 'reading' && (
              <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-amber-500/90 text-white backdrop-blur-md shadow-xs">
                Sedang Dibaca
              </span>
            )}
          </div>

          {/* Top Overlays: Quick Action Menu & Favorite on Right */}
          <div className="absolute top-3 right-3 z-20 flex items-center gap-1.5">
            {/* Quick Favorite Button */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onToggleFavorite(book.id, book.isFavorite);
              }}
              className={`w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-md transition-all cursor-pointer shadow-xs ${
                book.isFavorite
                  ? 'bg-rose-500 text-white'
                  : 'bg-black/40 hover:bg-black/60 text-white/80 hover:text-white'
              }`}
              title={book.isFavorite ? 'Buang daripada kegemaran' : 'Tambah ke kegemaran'}
              aria-label="Kegemaran"
            >
              <Heart className={`w-4 h-4 ${book.isFavorite ? 'fill-current' : ''}`} />
            </button>

            {/* Quick Three-Dot Menu */}
            <div className="relative">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowMenu(!showMenu);
                }}
                className="w-8 h-8 rounded-full bg-black/40 hover:bg-black/60 text-white/80 hover:text-white backdrop-blur-md flex items-center justify-center transition-all cursor-pointer shadow-xs"
                title="Pilihan lanjut"
                aria-label="Pilihan lanjut"
              >
                <MoreVertical className="w-4 h-4" />
              </button>

              {/* Dropdown Menu */}
              {showMenu && (
                <>
                  <div
                    className="fixed inset-0 z-30"
                    onClick={() => setShowMenu(false)}
                  />
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
        </div>

        {/* Bahagian Tengah: Kategori, Tajuk, Penerangan Ringkas (line-clamp-2), & Tech-Stack Pills */}
        <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between text-left space-y-3">
          <div>
            {/* Kategori kecil di atas tajuk */}
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#006B57] dark:text-emerald-400 block mb-1">
              {book.category}
            </span>

            {/* Tajuk projek (font-semibold text-lg) */}
            <h3
              onClick={handleLiveDemoClick}
              className="font-semibold text-lg text-slate-900 dark:text-white leading-snug line-clamp-1 group-hover:text-[#006B57] dark:group-hover:text-emerald-400 transition-colors cursor-pointer"
              title={book.title}
            >
              {book.title}
            </h3>

            {/* Penerangan ringkas (maksimum 2 baris sahaja dengan class line-clamp-2) */}
            <p className="text-sm text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed mt-2">
              {book.description}
            </p>
          </div>

          {/* Badges tech-stack kecil di bawah penerangan */}
          <div className="flex flex-wrap items-center gap-1.5 pt-2">
            {techStackList.map((tech) => (
              <span
                key={tech}
                className="px-2.5 py-0.5 text-[11px] font-medium rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700/60 transition-colors"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* Bahagian Bawah (Action Footer): Butang "Live Demo" & Pautan "Ketahui Lanjut" */}
        <div className="border-t border-slate-100 dark:border-slate-800/80 px-5 py-3.5 flex items-center justify-between gap-3 mt-auto bg-slate-50/50 dark:bg-slate-900/50">
          {/* Butang "Live Demo" dengan ikon anak panah/external link */}
          <button
            type="button"
            onClick={handleLiveDemoClick}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-[#006B57] hover:bg-[#063F35] dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white shadow-2xs hover:shadow-xs transition-all active:scale-[0.98] cursor-pointer"
            title="Buka pratonton langsung projek / e-reader"
          >
            <span>Live Demo</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>

          {/* Pautan "Ketahui Lanjut" */}
          <button
            type="button"
            onClick={() => onOpenDetail(book)}
            className="inline-flex items-center gap-1 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-[#006B57] dark:hover:text-emerald-400 transition-colors cursor-pointer py-1.5 px-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
            title="Lihat maklumat terperinci naskhah"
          >
            <span>Ketahui Lanjut</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
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
