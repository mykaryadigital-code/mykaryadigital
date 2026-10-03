import React, { useState, useEffect } from 'react';
import { X, BookOpen, Star, Bookmark, Download, Trash2, Edit3 } from 'lucide-react';
import { Book, Bookmark as BookmarkType, Highlight } from '../types/book';
import { BookCover } from './BookCover';
import { getBookmarksByBookId, getHighlightsByBookId } from '../services/storage';

interface BookDetailModalProps {
  book: Book | null;
  isOpen: boolean;
  onClose: () => void;
  onOpenReader: (book: Book, chapterIndex?: number) => void;
  onEditBook: (book: Book) => void;
  onDeleteBook: (bookId: string) => void;
  onUpdateRating: (bookId: string, rating: number) => void;
}

export const BookDetailModal: React.FC<BookDetailModalProps> = ({
  book,
  isOpen,
  onClose,
  onOpenReader,
  onEditBook,
  onDeleteBook,
  onUpdateRating,
}) => {
  const [activeTab, setActiveTab] = useState<'chapters' | 'bookmarks' | 'highlights'>('chapters');
  const [bookmarks, setBookmarks] = useState<BookmarkType[]>([]);
  const [highlights, setHighlights] = useState<Highlight[]>([]);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    if (book && isOpen) {
      getBookmarksByBookId(book.id).then(setBookmarks);
      getHighlightsByBookId(book.id).then(setHighlights);
    }
  }, [book, isOpen]);

  if (!isOpen || !book) return null;

  const handleExportTxt = () => {
    const fullText = [
      `JUDUL: ${book.title}`,
      `PENULIS: ${book.author}`,
      `KATEGORI: ${book.category}`,
      `SINOPSIS:\n${book.description}`,
      '\n' + '='.repeat(40) + '\n',
      ...book.chapters.map((ch) => `\n--- ${ch.title} ---\n\n${ch.content}\n`),
    ].join('\n');

    const blob = new Blob([fullText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${book.title.replace(/[^\w\s-]/gi, '')}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleConfirmDelete = () => {
    onDeleteBook(book.id);
    setShowDeleteConfirm(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-xs">
      <div className="relative bg-white border border-[#E2E8F0] rounded-[20px] shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in-50 zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#E2E8F0] flex items-center justify-between bg-[#F7F9F8]">
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase tracking-wider text-[#64748B] font-bold">
              Informasi Pustaka • Karya Digital
            </span>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1 custom-scrollbar space-y-6">
          <div className="flex flex-col sm:flex-row gap-6 items-start">
            <div className="shrink-0 mx-auto sm:mx-0">
              <div className="rounded-[12px] overflow-hidden shadow-[0_4px_14px_rgba(0,0,0,0.12)] border border-black/5">
                <BookCover
                  title={book.title}
                  author={book.author}
                  coverUrl={book.imageUrl || book.coverUrl}
                  coverTheme={book.coverTheme}
                  size="lg"
                />
              </div>
            </div>

            <div className="flex-1 min-w-0">
              <h2 className="text-xl sm:text-2xl font-serif-book font-bold text-[#102A27] leading-snug mb-1">
                {book.title}
              </h2>
              <p className="text-sm font-medium text-[#006B57] mb-3">
                {book.author}
              </p>

              {/* Unboxed metadata */}
              <div className="flex flex-wrap items-center gap-2 text-xs text-[#64748B] mb-4">
                <span>{book.category}</span>
                <span aria-hidden="true" className="text-slate-300">·</span>
                <span className="font-mono-data">{book.totalWords.toLocaleString('id-ID')} kata</span>
                <span aria-hidden="true" className="text-slate-300">·</span>
                <span className="font-mono-data">~{book.estimatedReadTimeMinutes} minit baca</span>
                <span aria-hidden="true" className="text-slate-300">·</span>
                <span className="uppercase text-[11px] font-mono-data">{book.fileType}</span>
              </div>

              {/* Price and Digital Product Banner */}
              <div className="mb-4 p-3.5 bg-[#ECFDF5] border border-[#A7F3D0] rounded-[14px] flex items-center justify-between">
                <div>
                  <div className="text-[10px] uppercase font-bold text-[#64748B] tracking-wider">
                    Harga Produk Digital
                  </div>
                  <div className="text-xl font-bold font-mono-data text-[#006B57]">
                    {book.currency || 'RM'}{' '}
                    {book.price !== undefined
                      ? book.currency === 'Rp'
                        ? book.price.toLocaleString('id-ID')
                        : book.price.toFixed(2)
                      : '0.00'}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] uppercase font-bold text-[#64748B]">
                    Kod SKU / Naskhah
                  </div>
                  <div className="text-xs font-mono-data font-semibold text-[#102A27]">
                    {book.sku || 'KD-EBOOK'}
                  </div>
                  {book.salesCount !== undefined && (
                    <div className="text-[11px] text-[#64748B] font-mono-data mt-0.5">
                      {book.salesCount} unit terjual
                    </div>
                  )}
                </div>
              </div>

              {/* Star Rating */}
              <div className="flex items-center gap-2 mb-4">
                <span className="text-xs text-[#64748B]">Penilaian:</span>
                <div className="flex items-center gap-0.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => onUpdateRating(book.id, star)}
                      className="p-0.5 text-slate-300 hover:text-amber-500 cursor-pointer transition-colors"
                    >
                      <Star
                        className={`w-4 h-4 ${
                          star <= book.rating ? 'fill-amber-400 text-amber-400' : ''
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Progress */}
              <div className="mb-4 p-3 bg-slate-50 rounded-[12px] border border-[#E2E8F0]">
                <div className="flex justify-between items-center text-xs text-[#64748B] mb-1.5 font-mono-data">
                  <span>Kemajuan: Bab {(book.currentChapterIndex || 0) + 1} daripada {book.chapters.length}</span>
                  <span className="font-semibold text-[#006B57]">{book.currentProgress}%</span>
                </div>
                <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#006B57] rounded-full transition-all"
                    style={{ width: `${book.currentProgress}%` }}
                  />
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => {
                    onClose();
                    onOpenReader(book, book.currentChapterIndex);
                  }}
                  className="px-4 py-2 text-xs font-semibold text-white bg-[#006B57] hover:bg-[#063F35] rounded-[10px] cursor-pointer transition-colors shadow-xs flex items-center gap-1.5"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>{book.currentProgress > 0 ? 'Lanjutkan Membaca' : 'Buka & Baca'}</span>
                </button>

                <button
                  onClick={() => {
                    onClose();
                    onEditBook(book);
                  }}
                  className="px-3 py-2 text-xs font-medium text-[#102A27] bg-slate-100 hover:bg-slate-200 rounded-[10px] cursor-pointer transition-colors flex items-center gap-1.5"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit Teks</span>
                </button>

                <button
                  onClick={handleExportTxt}
                  className="px-3 py-2 text-xs font-medium text-[#102A27] bg-slate-100 hover:bg-slate-200 rounded-[10px] cursor-pointer transition-colors flex items-center gap-1.5"
                  title="Muat turun seluruh buku dalam format teks (.txt)"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Muat Turun TXT</span>
                </button>

                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="px-3 py-2 text-xs font-medium text-[#E53935] hover:bg-rose-50 rounded-[10px] cursor-pointer transition-colors ml-auto flex items-center gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Padam</span>
                </button>
              </div>
            </div>
          </div>

          {/* Synopsis */}
          <div>
            <h4 className="text-xs uppercase tracking-wider text-[#64748B] font-bold mb-1.5">
              Sinopsis
            </h4>
            <p className="text-sm text-[#102A27] leading-relaxed whitespace-pre-line bg-slate-50 p-4 rounded-[12px] border border-[#E2E8F0]">
              {book.description || 'Tiada deskripsi sinopsis untuk buku ini.'}
            </p>
          </div>

          {/* Tabs: Chapters / Bookmarks / Highlights */}
          <div>
            <div className="flex items-center gap-1 border-b border-[#E2E8F0] mb-3">
              <button
                onClick={() => setActiveTab('chapters')}
                className={`px-3 py-2 text-xs font-semibold cursor-pointer transition-colors border-b-2 -mb-px ${
                  activeTab === 'chapters'
                    ? 'border-[#006B57] text-[#006B57]'
                    : 'border-transparent text-[#64748B] hover:text-[#102A27]'
                }`}
              >
                Daftar Bab ({book.chapters.length})
              </button>
              <button
                onClick={() => setActiveTab('bookmarks')}
                className={`px-3 py-2 text-xs font-semibold cursor-pointer transition-colors border-b-2 -mb-px ${
                  activeTab === 'bookmarks'
                    ? 'border-[#006B57] text-[#006B57]'
                    : 'border-transparent text-[#64748B] hover:text-[#102A27]'
                }`}
              >
                Penanda Halaman ({bookmarks.length})
              </button>
              <button
                onClick={() => setActiveTab('highlights')}
                className={`px-3 py-2 text-xs font-semibold cursor-pointer transition-colors border-b-2 -mb-px ${
                  activeTab === 'highlights'
                    ? 'border-[#006B57] text-[#006B57]'
                    : 'border-transparent text-[#64748B] hover:text-[#102A27]'
                }`}
              >
                Sorotan Teks ({highlights.length})
              </button>
            </div>

            {/* Tab: Chapters */}
            {activeTab === 'chapters' && (
              <div className="space-y-1.5">
                {book.chapters.map((ch, idx) => (
                  <div
                    key={ch.id}
                    onClick={() => {
                      onClose();
                      onOpenReader(book, idx);
                    }}
                    className="p-3 bg-slate-50 hover:bg-emerald-50/60 rounded-[10px] border border-[#E2E8F0] cursor-pointer flex items-center justify-between text-xs transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-mono-data text-slate-400 w-6">
                        {(idx + 1).toString().padStart(2, '0')}.
                      </span>
                      <span className="font-semibold text-[#102A27]">{ch.title}</span>
                    </div>
                    <span className="text-[#64748B] font-mono-data">{ch.wordCount.toLocaleString('id-ID')} perkataan</span>
                  </div>
                ))}
              </div>
            )}

            {/* Tab: Bookmarks */}
            {activeTab === 'bookmarks' && (
              <div className="space-y-2">
                {bookmarks.length === 0 ? (
                  <div className="text-center py-6 text-xs text-[#64748B]">
                    Belum ada penanda halaman. Anda boleh menandai halaman semasa membaca di e-reader.
                  </div>
                ) : (
                  bookmarks.map((bm) => (
                    <div
                      key={bm.id}
                      onClick={() => {
                        onClose();
                        onOpenReader(book, bm.chapterIndex);
                      }}
                      className="p-3 bg-slate-50 hover:bg-slate-100 rounded-[10px] border border-[#E2E8F0] cursor-pointer text-xs"
                    >
                      <div className="flex items-center justify-between font-semibold text-[#102A27] mb-1">
                        <span>{bm.chapterTitle}</span>
                        <span className="text-[#64748B] font-mono-data text-[11px]">
                          {new Date(bm.createdAt).toLocaleDateString('ms-MY')}
                        </span>
                      </div>
                      <p className="text-[#64748B] italic line-clamp-2">
                        "{bm.snippet}"
                      </p>
                      {bm.note && (
                        <div className="mt-1 text-[11px] text-[#006B57] font-medium">
                          Catatan: {bm.note}
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Tab: Highlights */}
            {activeTab === 'highlights' && (
              <div className="space-y-2">
                {highlights.length === 0 ? (
                  <div className="text-center py-6 text-xs text-[#64748B]">
                    Belum ada ayat yang disorot. Sorot teks penting semasa membaca untuk menyimpannya ke sini.
                  </div>
                ) : (
                  highlights.map((hl) => (
                    <div
                      key={hl.id}
                      onClick={() => {
                        onClose();
                        onOpenReader(book, hl.chapterIndex);
                      }}
                      className="p-3 bg-slate-50 hover:bg-slate-100 rounded-[10px] border border-[#E2E8F0] cursor-pointer text-xs"
                    >
                      <p className="text-[#102A27] leading-relaxed pl-2 border-l-2 border-[#006B57]">
                        {hl.selectedText}
                      </p>
                      {hl.note && (
                        <div className="mt-1.5 text-[11px] text-[#64748B]">
                          <strong>Catatan:</strong> {hl.note}
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>

        {/* Delete Confirmation Modal Overlay */}
        {showDeleteConfirm && (
          <div className="absolute inset-0 z-30 bg-white/95 backdrop-blur-xs flex flex-col items-center justify-center p-6 text-center animate-in fade-in-50 duration-150">
            <Trash2 className="w-10 h-10 text-[#E53935] mb-2" />
            <h3 className="text-lg font-bold text-[#102A27] mb-1">Padam Buku Dari Perpustakaan?</h3>
            <p className="text-xs text-[#64748B] max-w-sm mb-5">
              Adakah anda pasti mahu memadam "<strong>{book.title}</strong>"? Tindakan ini tidak boleh dibatalkan.
            </p>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 text-xs font-semibold text-[#102A27] bg-slate-100 hover:bg-slate-200 rounded-[10px] cursor-pointer"
              >
                Batal
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 text-xs font-semibold text-white bg-[#E53935] hover:bg-red-700 rounded-[10px] cursor-pointer shadow-xs"
              >
                Ya, Padam Buku
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
