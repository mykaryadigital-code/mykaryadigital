import React, { useState } from 'react';
import { Book } from '../types/book';
import { BookCover } from './BookCover';
import { useMarketplace } from '../context/MarketplaceContext';
import { BookPurchaseModal } from './BookPurchaseModal';
import {
  User,
  BookOpen,
  Layers,
  MoreVertical,
  Trash2,
  Heart,
  Share2,
  Info,
  Edit3,
  Check,
  FileText,
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
  const { isBookPurchased } = useMarketplace();

  const isFree = !book.price || book.price <= 0;
  const purchased = isBookPurchased(book.id) || isFree;
  const isCompleted = book.status === 'completed' || book.currentProgress >= 100;
  const isReading = book.status === 'reading' && !isCompleted;

  const formatPrice = (price?: number, currency: string = 'RM') => {
    if (price === undefined || price === null || price === 0) return `${currency}0.00`;
    if (currency === 'Rp') {
      return `Rp ${price.toLocaleString('id-ID')}`;
    }
    return `${currency}${price.toFixed(2)}`;
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

  return (
    <article className="relative bg-white border border-[#E2E8F0] rounded-[18px] p-5 sm:p-6 shadow-[0_4px_20px_rgba(15,23,42,0.04)] hover:shadow-[0_10px_25px_rgba(15,23,42,0.07)] hover:-translate-y-0.5 transition-all duration-200 flex flex-col justify-between group">
      {/* Toast Notification for Link Copy */}
      {copiedToast && (
        <div className="absolute top-3 left-1/2 -translate-x-1/2 z-40 bg-[#063F35] text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1.5 animate-in fade-in-50 duration-150">
          <Check className="w-3.5 h-3.5 text-emerald-400" />
          <span>Pautan buku berjaya disalin!</span>
        </div>
      )}

      {/* 2 Columns Layout: [ BOOK COVER ] [ BOOK INFORMATION ] */}
      <div className="flex flex-col sm:flex-row gap-5 lg:gap-6 items-start">
        {/* Left: Book Cover (~220–250px height on desktop, border radius 12px, subtle shadow) */}
        <div
          onClick={() => onOpenReader(book)}
          className="cursor-pointer shrink-0 mx-auto sm:mx-0 transition-transform duration-200 hover:scale-[1.015] active:scale-[0.99]"
          title={`Buka pembaca untuk "${book.title}"`}
        >
          <div className="rounded-[12px] overflow-hidden shadow-[0_4px_14px_rgba(0,0,0,0.10)] border border-black/5">
            <BookCover
              title={book.title}
              author={book.author}
              coverUrl={book.coverUrl}
              coverTheme={book.coverTheme}
              size="md"
            />
          </div>
        </div>

        {/* Right: Book Information Hierarchy */}
        <div className="flex-1 min-w-0 flex flex-col justify-between self-stretch">
          <div>
            {/* 1. STATUS BADGE + THREE DOT MENU (40x40px, rounded-10px) */}
            <div className="flex items-center justify-between gap-2 mb-1">
              <div className="flex flex-wrap items-center gap-2">
                {isFree ? (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#F0FDF4] text-[#15803D]">
                    Percuma
                  </span>
                ) : purchased || isCompleted ? (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#ECFDF5] text-[#047857]">
                    Dimiliki
                  </span>
                ) : isReading ? (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#FFF7ED] text-[#C2410C]">
                    Sedang Dibaca
                  </span>
                ) : null}

                {!purchased && book.freeChapterCount && book.freeChapterCount > 0 ? (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#EFF6FF] text-[#1D4ED8]">
                    Bab 1 Percuma
                  </span>
                ) : null}
              </div>

              {/* Three-Dot Menu (40x40px, hover: #F1F5F9, rounded: 10px) */}
              <div className="relative">
                <button
                  onClick={() => setShowMenu(!showMenu)}
                  className="w-9 h-9 sm:w-10 sm:h-10 rounded-[10px] flex items-center justify-center text-[#64748B] hover:text-[#102A27] hover:bg-[#F1F5F9] transition-colors cursor-pointer"
                  title="Pilihan lainnya"
                  aria-label="Pilihan buku"
                >
                  <MoreVertical className="w-4 h-4" />
                </button>

                {showMenu && (
                  <>
                    <div
                      className="fixed inset-0 z-20"
                      onClick={() => setShowMenu(false)}
                    />
                    <div className="absolute right-0 top-11 z-30 w-44 bg-white border border-[#E2E8F0] rounded-[12px] shadow-[0_10px_25px_-5px_rgba(15,23,42,0.12)] py-1.5 text-xs text-[#102A27] animate-in fade-in-50 duration-150">
                      {onEditBook && (
                        <button
                          onClick={() => {
                            setShowMenu(false);
                            onEditBook(book);
                          }}
                          className="w-full text-left px-3.5 py-2 hover:bg-slate-50 flex items-center gap-2.5 cursor-pointer font-medium text-[#102A27]"
                        >
                          <Edit3 className="w-4 h-4 text-[#64748B]" />
                          <span>Edit</span>
                        </button>
                      )}

                      <button
                        onClick={() => {
                          setShowMenu(false);
                          onOpenDetail(book);
                        }}
                        className="w-full text-left px-3.5 py-2 hover:bg-slate-50 flex items-center gap-2.5 cursor-pointer font-medium text-[#102A27]"
                      >
                        <Info className="w-4 h-4 text-[#64748B]" />
                        <span>Lihat</span>
                      </button>

                      <button
                        onClick={() => {
                          setShowMenu(false);
                          onToggleFavorite(book.id, book.isFavorite);
                        }}
                        className="w-full text-left px-3.5 py-2 hover:bg-slate-50 flex items-center gap-2.5 cursor-pointer font-medium text-[#102A27]"
                      >
                        <Heart
                          className={`w-4 h-4 ${
                            book.isFavorite ? 'fill-[#E53935] text-[#E53935]' : 'text-[#64748B]'
                          }`}
                        />
                        <span>{book.isFavorite ? 'Kegemaran (Ditanda)' : 'Kegemaran'}</span>
                      </button>

                      <button
                        onClick={handleCopyLink}
                        className="w-full text-left px-3.5 py-2 hover:bg-slate-50 flex items-center gap-2.5 cursor-pointer font-medium text-[#102A27]"
                      >
                        <Share2 className="w-4 h-4 text-[#64748B]" />
                        <span>Kongsi</span>
                      </button>

                      <div className="border-t border-[#E2E8F0] my-1" />

                      <button
                        onClick={() => {
                          setShowMenu(false);
                          setShowDeleteConfirm(true);
                        }}
                        className="w-full text-left px-3.5 py-2 hover:bg-red-50 text-[#E53935] flex items-center gap-2.5 cursor-pointer font-medium"
                      >
                        <Trash2 className="w-4 h-4 text-[#E53935]" />
                        <span>Padam</span>
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* 2. HARGA (Clear, readable, not overpowering title) */}
            <div
              className={`text-lg sm:text-xl font-bold font-mono-data tracking-tight mb-1 ${
                isFree ? 'text-[#006B57]' : 'text-[#063F35]'
              }`}
            >
              {formatPrice(book.price, book.currency)}
            </div>

            {/* 3. JUDUL BUKU (font-size: 20–22px, font-weight: 700, line-height: 1.25, max 2–3 lines) */}
            <h3
              onClick={() => onOpenReader(book)}
              className="text-xl sm:text-[22px] font-bold text-[#102A27] hover:text-[#006B57] transition-colors line-clamp-2 leading-[1.25] tracking-tight cursor-pointer my-1.5"
              title={book.title}
            >
              {book.title}
            </h3>

            {/* 4. PENULIS (👤 Author, 14px, #64748B) */}
            <div className="flex items-center gap-1.5 text-xs sm:text-sm font-medium text-[#64748B] mb-2.5">
              <User className="w-3.5 h-3.5 text-[#64748B] shrink-0" />
              <span className="truncate">{book.author}</span>
            </div>

            {/* 5. METADATA (Consistent Lucide icons, 14px, #64748B) */}
            <div className="flex flex-wrap items-center gap-x-3.5 gap-y-1 text-xs sm:text-sm text-[#64748B] font-medium mb-3">
              <div className="flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-[#64748B] shrink-0" />
                <span>{book.category}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-[#64748B] shrink-0" />
                <span className="font-mono-data">{book.totalWords.toLocaleString('id-ID')} kata</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-[#64748B] shrink-0" />
                <span>{book.chapters.length} bab</span>
              </div>
            </div>

            {/* 6. DESCRIPTION (3–4 baris maksimum dengan line-clamp, #64748B) */}
            <p className="text-xs sm:text-sm text-[#64748B] line-clamp-3 leading-relaxed mb-4">
              {book.description}
            </p>
          </div>

          {/* 7. CTA BUTTON (Primary: BELI BUKU / BACA SEKARANG in #006B57; Secondary: PRATONTON, height 44px, radius 12px) */}
          <div className="flex items-center gap-2.5 pt-1">
            {!purchased ? (
              <>
                <button
                  onClick={() => setIsPurchaseOpen(true)}
                  className="flex-1 sm:flex-none h-[44px] px-6 rounded-[12px] font-semibold text-xs sm:text-sm bg-[#006B57] hover:bg-[#063F35] text-white flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer whitespace-nowrap active:scale-[0.99]"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>Beli Buku</span>
                </button>

                <button
                  onClick={() => onOpenReader(book)}
                  className="flex-1 sm:flex-none h-[44px] px-5 rounded-[12px] font-semibold text-xs sm:text-sm bg-white hover:bg-slate-50 text-[#102A27] border border-[#E2E8F0] hover:border-[#CBD5E1] flex items-center justify-center gap-2 transition-colors cursor-pointer whitespace-nowrap active:scale-[0.99]"
                >
                  <span>Pratonton</span>
                </button>
              </>
            ) : (
              <button
                onClick={() => onOpenReader(book)}
                className="w-full sm:w-auto h-[44px] px-7 rounded-[12px] font-semibold text-xs sm:text-sm bg-[#006B57] hover:bg-[#063F35] text-white flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer whitespace-nowrap active:scale-[0.99]"
              >
                <BookOpen className="w-4 h-4" />
                <span>Baca Sekarang</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Inline Safe Delete Confirmation Overlay */}
      {showDeleteConfirm && (
        <div className="absolute inset-0 z-30 bg-white/95 backdrop-blur-xs rounded-[18px] p-6 flex flex-col items-center justify-center text-center animate-in fade-in-50 duration-150">
          <Trash2 className="w-8 h-8 text-[#E53935] mb-2" />
          <h4 className="text-base font-bold text-[#102A27] mb-1">Padam Buku Ini?</h4>
          <p className="text-xs text-[#64748B] max-w-xs mb-4">
            Adakah anda pasti mahu memadam "<strong>{book.title}</strong>" daripada perpustakaan anda?
          </p>
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setShowDeleteConfirm(false)}
              className="h-10 px-4 rounded-[10px] text-xs font-semibold text-[#102A27] bg-slate-100 hover:bg-slate-200 cursor-pointer"
            >
              Batal
            </button>
            <button
              onClick={handleDelete}
              className="h-10 px-4 rounded-[10px] text-xs font-semibold text-white bg-[#E53935] hover:bg-red-700 cursor-pointer shadow-xs"
            >
              Ya, Padam
            </button>
          </div>
        </div>
      )}

      {/* Book Purchase Modal */}
      <BookPurchaseModal
        isOpen={isPurchaseOpen}
        book={book}
        onClose={() => setIsPurchaseOpen(false)}
        onPurchaseSuccess={() => {
          setIsPurchaseOpen(false);
          onOpenReader(book);
        }}
      />
    </article>
  );
};
