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
  Lock,
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
    if (price === undefined || price === null || price === 0) return `${currency} 0.00`;
    if (currency === 'Rp') {
      return `Rp ${price.toLocaleString('id-ID')}`;
    }
    return `${currency} ${price.toFixed(2)}`;
  };

  const isCompleted = book.status === 'completed' || book.currentProgress >= 100;
  const isReading = book.status === 'reading';

  // Determine theme accents based on status/category matching the screenshot
  const isGreenTheme = isCompleted || book.title.toLowerCase().includes('gunting');

  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
      {/* Top 2 Columns Section */}
      <div className="flex flex-col sm:flex-row gap-5 lg:gap-6 items-start">
        {/* Left Column: Book Cover */}
        <div
          onClick={() => onOpenReader(book)}
          className="cursor-pointer shrink-0 transition-transform duration-200 hover:-translate-y-1 mx-auto sm:mx-0"
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
              {isReading ? (
                <span className="px-3.5 py-1 rounded-full text-xs font-semibold bg-[#fff1e7] text-[#c2410c]">
                  Sedang Dibaca
                </span>
              ) : isCompleted ? (
                <span className="px-3.5 py-1 rounded-full text-xs font-semibold bg-[#ecfdf5] text-[#047857]">
                  Selesai
                </span>
              ) : (
                <span className="px-3.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">
                  Ingin Dibaca
                </span>
              )}

              <div className="relative">
                <button
                  onClick={() => setShowMenu(!showMenu)}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
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

            {/* Row 2: Price in bold red font matching screenshot */}
            <div className="text-xl sm:text-2xl font-black text-[#d91424] font-sans tracking-tight mt-2">
              {formatPrice(book.price, book.currency)}
            </div>

            {/* Row 3: Title */}
            <h3
              onClick={() => onOpenReader(book)}
              className="text-base sm:text-lg font-bold text-slate-900 hover:text-red-600 transition-colors line-clamp-2 leading-tight mt-1 mb-2.5 cursor-pointer font-sans"
            >
              {book.title}
            </h3>

            {/* Row 4: Author with User icon */}
            <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-600 font-medium mb-2.5">
              <User className="w-4 h-4 text-slate-400 shrink-0" />
              <span className="truncate">{book.author}</span>
            </div>

            {/* Row 5: Metadata Row with Icons (Category, words, chapters) */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-slate-500 font-medium mb-3">
              <div className="flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-slate-400 shrink-0" />
                <span>{book.category}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-slate-400 shrink-0" />
                <span className="font-mono-data">{book.totalWords.toLocaleString('id-ID')} kata</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-slate-400 shrink-0" />
                <span>{book.chapters.length} bab</span>
              </div>
            </div>

            {/* Row 6: Synopsis */}
            <p className="text-xs sm:text-sm text-slate-500 line-clamp-3 leading-relaxed mb-4">
              {book.description}
            </p>
          </div>

          {/* Row 7: Bottom Action Row (Price Tag Pill + Buy / Read Buttons) */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            {/* Price Pill Tag Badge */}
            {purchased ? (
              <div className="px-3.5 py-1.5 rounded-full text-xs font-semibold bg-[#ecfdf5] text-[#047857] flex items-center gap-1.5 border border-emerald-200">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#047857]" />
                <span>Akses Penuh Dimiliki</span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <div className="px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-50 text-[#0E7749] border border-emerald-200 flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-[#0E7749]" />
                  <span className="font-bold font-mono-data">
                    {formatPrice(book.price, book.currency)}
                  </span>
                </div>
                <span className="text-[11px] text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full font-medium">
                  Bab 1 Percuma
                </span>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              {!purchased && (
                <button
                  onClick={() => setIsPurchaseOpen(true)}
                  className="px-3.5 py-2 rounded-xl font-bold text-xs bg-[#0E7749] hover:bg-[#0a5634] text-white flex items-center gap-1.5 transition-all cursor-pointer shadow-xs whitespace-nowrap"
                  title="Beli akses penuh (95% royalti ke penulis)"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>Beli Buku</span>
                </button>
              )}

              <button
                onClick={() => onOpenReader(book)}
                className={`px-4 py-2 rounded-xl font-semibold text-xs text-white flex items-center gap-1.5 transition-all cursor-pointer shadow-xs whitespace-nowrap ${
                  purchased
                    ? 'bg-slate-800 hover:bg-slate-900'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>{purchased ? 'Baca Sekarang' : 'Pratonton'}</span>
              </button>
            </div>
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

      {/* Kemajuan Membaca Progress Bar at bottom of card */}
      <div className="mt-5 pt-4 border-t border-slate-100">
        <div className="flex items-center justify-between text-xs text-slate-700 font-semibold mb-1.5">
          <span>Kemajuan Membaca</span>
          <span className="font-mono-data">{book.currentProgress}%</span>
        </div>
        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-[#047857] rounded-full transition-all duration-300"
            style={{ width: `${book.currentProgress}%` }}
          />
        </div>
      </div>
    </div>
  );
};
