import React, { useState } from 'react';
import { Book } from '../types/book';
import { BookCover } from './BookCover';
import { useMarketplace } from '../context/MarketplaceContext';
import { BookPurchaseModal } from './BookPurchaseModal';
import {
  User,
  FileText,
  BookOpen,
  Layers,
  Tag,
  MoreVertical,
  CheckCircle2,
  Trash2,
  Heart,
  ShieldCheck,
} from 'lucide-react';

interface BookCardProps {
  book: Book;
  onOpenReader: (book: Book) => void;
  onOpenDetail: (book: Book) => void;
  onToggleFavorite: (bookId: string, current: boolean) => void;
  onDeleteBook: (bookId: string) => void;
  onUpdateStatus: (bookId: string, status: Book['status']) => void;
}

export const BookCard: React.FC<BookCardProps> = ({
  book,
  onOpenReader,
  onOpenDetail,
  onToggleFavorite,
  onDeleteBook,
  onUpdateStatus,
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const [isPurchaseOpen, setIsPurchaseOpen] = useState(false);
  const { isBookPurchased } = useMarketplace();

  const purchased = isBookPurchased(book.id) || !book.price || book.price <= 0;

  const formatPrice = (price?: number, currency: string = 'RM') => {
    if (price === undefined || price === null || price === 0) return `${currency}0.00`;
    if (currency === 'Rp') {
      return `Rp ${price.toLocaleString('id-ID')}`;
    }
    return `${currency}${price.toFixed(2)}`;
  };

  const isCompleted = book.status === 'completed' || book.currentProgress >= 100;
  const isReading = book.status === 'reading' || !book.status;

  // Determine theme accents based on category / price matching the screenshot
  const isGreenTheme =
    book.category === 'Panduan' ||
    book.price === 0 ||
    book.title.toLowerCase().includes('panduan') ||
    book.title.toLowerCase().includes('gunting');

  return (
    <div
      className={`rounded-3xl p-6 sm:p-7 shadow-xs hover:shadow-md transition-all flex flex-col justify-between relative overflow-hidden group border ${
        isGreenTheme
          ? 'bg-gradient-to-br from-[#f8fdfa] via-[#f1f9f4] to-[#e7f5ed] border-[#d2ecdf]'
          : 'bg-gradient-to-br from-[#fffdf9] via-[#fff8f0] to-[#fff3e5] border-[#fae7ce]'
      }`}
    >
      {/* Decorative Corner Leaf Watermarks matching reference image */}
      <svg
        className={`absolute -bottom-8 -left-8 w-36 h-36 pointer-events-none transition-transform duration-500 group-hover:scale-105 ${
          isGreenTheme ? 'text-[#86efac]/35' : 'text-[#fed7aa]/45'
        }`}
        viewBox="0 0 100 100"
        fill="currentColor"
      >
        <path d="M10,90 Q40,50 90,40 Q50,70 10,90 Z" />
        <path d="M25,85 Q60,60 85,25 Q55,65 25,85 Z" opacity="0.7" />
        <path d="M5,70 Q45,45 75,10 Q35,55 5,70 Z" opacity="0.5" />
      </svg>
      <svg
        className={`absolute -top-10 -right-10 w-32 h-32 pointer-events-none ${
          isGreenTheme ? 'text-[#86efac]/25' : 'text-[#fed7aa]/35'
        }`}
        viewBox="0 0 100 100"
        fill="currentColor"
      >
        <path d="M90,10 Q60,50 10,60 Q50,30 90,10 Z" />
      </svg>

      {/* Top 2 Columns Section */}
      <div className="flex flex-col sm:flex-row gap-5 lg:gap-6 items-start relative z-10">
        {/* Left Column: 3D Book Cover */}
        <div
          onClick={() => onOpenReader(book)}
          className="cursor-pointer shrink-0 transition-transform duration-200 hover:-translate-y-1 mx-auto sm:mx-0 drop-shadow-md"
        >
          <BookCover
            title={book.title}
            author={book.author}
            coverUrl={book.coverUrl}
            coverTheme={book.coverTheme}
            size="md"
          />
        </div>

        {/* Right Column: Book Details */}
        <div className="flex-1 min-w-0 flex flex-col justify-between self-stretch">
          <div>
            {/* Row 1: Status Badge & 3-Dots Menu */}
            <div className="flex items-center justify-between gap-2">
              {isGreenTheme ? (
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#dcfce7] text-[#166534] border border-[#bbf7d0]/60">
                  <BookOpen className="w-3.5 h-3.5 text-[#166534]" />
                  <span>Sedang Dibaca</span>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#ffedd5] text-[#9a3412] border border-[#fed7aa]/60">
                  <BookOpen className="w-3.5 h-3.5 text-[#9a3412]" />
                  <span>Sedang Dibaca</span>
                </div>
              )}

              <div className="relative">
                <button
                  onClick={() => setShowMenu(!showMenu)}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-black/5 transition-colors cursor-pointer"
                  title="Pilihan lainnya"
                >
                  <MoreVertical className="w-4 h-4" />
                </button>

                {showMenu && (
                  <>
                    <div
                      className="fixed inset-0 z-20"
                      onClick={() => setShowMenu(false)}
                    />
                    <div className="absolute right-0 top-8 z-30 w-48 bg-white border border-slate-200 rounded-xl shadow-lg py-1.5 text-xs text-slate-700 animate-in fade-in-50 duration-100">
                      <button
                        onClick={() => {
                          setShowMenu(false);
                          onOpenDetail(book);
                        }}
                        className="w-full text-left px-3.5 py-2 hover:bg-slate-50 flex items-center gap-2 cursor-pointer font-medium"
                      >
                        <BookOpen className="w-3.5 h-3.5 text-slate-500" />
                        <span>Rincian Buku & Harga</span>
                      </button>
                      <button
                        onClick={() => {
                          setShowMenu(false);
                          onToggleFavorite(book.id, book.isFavorite);
                        }}
                        className="w-full text-left px-3.5 py-2 hover:bg-slate-50 flex items-center gap-2 cursor-pointer font-medium"
                      >
                        <Heart
                          className={`w-3.5 h-3.5 ${
                            book.isFavorite ? 'fill-red-600 text-red-600' : 'text-slate-500'
                          }`}
                        />
                        <span>{book.isFavorite ? 'Buang dari Favorit' : 'Tambah ke Favorit'}</span>
                      </button>
                      <button
                        onClick={() => {
                          setShowMenu(false);
                          onUpdateStatus(
                            book.id,
                            book.status === 'completed' ? 'reading' : 'completed'
                          );
                        }}
                        className="w-full text-left px-3.5 py-2 hover:bg-slate-50 flex items-center gap-2 cursor-pointer font-medium"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-slate-500" />
                        <span>
                          {book.status === 'completed'
                            ? 'Tandai Sedang Dibaca'
                            : 'Tandai Selesai'}
                        </span>
                      </button>
                      <div className="border-t border-slate-100 my-1" />
                      <button
                        onClick={() => {
                          setShowMenu(false);
                          if (confirm(`Hapus "${book.title}" dari perpustakaan?`)) {
                            onDeleteBook(book.id);
                          }
                        }}
                        className="w-full text-left px-3.5 py-2 hover:bg-red-50 text-red-600 flex items-center gap-2 cursor-pointer font-medium"
                      >
                        <Trash2 className="w-3.5 h-3.5 text-red-600" />
                        <span>Hapus dari Pustaka</span>
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Row 2: Large Bold Price matching screenshot (RM19.90 or RM0.00) */}
            <div
              className={`text-2xl sm:text-3xl font-extrabold tracking-tight mt-2.5 mb-1 ${
                isGreenTheme ? 'text-[#047857]' : 'text-[#d91424]'
              }`}
            >
              {formatPrice(book.price, book.currency)}
            </div>

            {/* Row 3: Title */}
            <h3
              onClick={() => onOpenReader(book)}
              className="text-base sm:text-lg font-bold text-slate-900 hover:text-emerald-800 transition-colors line-clamp-2 leading-snug cursor-pointer font-sans"
            >
              {book.title}
            </h3>

            {/* Row 4: Author with User icon */}
            <div className="flex items-center gap-1.5 text-xs text-slate-700 font-medium my-1.5">
              <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="truncate">{book.author}</span>
            </div>

            {/* Row 5: Metadata Row with Icons (Category, words, chapters) */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-slate-500 font-medium my-2.5">
              <div className="flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>{book.category}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="font-mono-data">{book.totalWords.toLocaleString('id-ID')} kata</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>{book.chapters.length} bab</span>
              </div>
            </div>

            {/* Row 6: Synopsis */}
            <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-4">
              {book.description}
            </p>
          </div>

          {/* Row 7: Badges row (RM 19.90 pill + Bab 1 Percuma, or Akses Penuh Dimiliki) */}
          <div className="flex flex-wrap items-center gap-2 mb-4">
            {purchased ? (
              <span className="px-3.5 py-1.5 rounded-full text-xs font-bold bg-[#dcfce7] text-[#15803d] border border-[#bbf7d0] flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-[#15803d]" />
                <span>Akses Penuh Dimiliki</span>
              </span>
            ) : (
              <>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#e6f4ea] text-[#0d652d] border border-[#ceead6] flex items-center gap-1">
                  <Tag className="w-3 h-3 text-[#0d652d]" />
                  <span>{formatPrice(book.price, book.currency)}</span>
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#ffedd5] text-[#9a3412] border border-[#fed7aa]">
                  Bab {book.freeChapterCount || 1} Percuma
                </span>
              </>
            )}
          </div>

          {/* Row 8: Action Buttons (Beli Buku + Pratonton, or Baca Sekarang) */}
          <div className="flex items-center gap-2.5">
            {!purchased ? (
              <>
                <button
                  onClick={() => setIsPurchaseOpen(true)}
                  className="px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm bg-[#0b4d32] hover:bg-[#073623] text-white flex items-center gap-2 shadow-xs cursor-pointer transition-colors"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>Beli Buku</span>
                </button>

                <button
                  onClick={() => onOpenReader(book)}
                  className="px-4 py-2.5 rounded-xl font-semibold text-xs sm:text-sm bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 flex items-center gap-2 cursor-pointer shadow-2xs transition-colors"
                >
                  <BookOpen className="w-4 h-4 text-slate-400" />
                  <span>Pratonton</span>
                </button>
              </>
            ) : (
              <button
                onClick={() => onOpenReader(book)}
                className="px-6 py-2.5 rounded-xl font-bold text-xs sm:text-sm bg-[#0b4d32] hover:bg-[#073623] text-white flex items-center gap-2 shadow-xs cursor-pointer transition-colors"
              >
                <BookOpen className="w-4 h-4" />
                <span>Baca Sekarang</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Purchase Modal */}
      <BookPurchaseModal
        isOpen={isPurchaseOpen}
        book={book}
        onClose={() => setIsPurchaseOpen(false)}
        onPurchaseSuccess={() => {
          setIsPurchaseOpen(false);
          onOpenReader(book);
        }}
      />
    </div>
  );
};
