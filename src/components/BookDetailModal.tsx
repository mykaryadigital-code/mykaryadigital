import React, { useState, useEffect } from 'react';
import { X, BookOpen, Star, Bookmark, Highlighter, Download, Trash2, Edit3, Clock, FileText } from 'lucide-react';
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
      ...book.chapters.map((ch, idx) => `\n--- ${ch.title} ---\n\n${ch.content}\n`),
    ].join('\n');

    const blob = new Blob([fullText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${book.title.replace(/[^\w\s-]/gi, '')}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-stone-900/60 backdrop-blur-xs">
      <div className="bg-white border border-stone-200 rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in-50 zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-stone-200 flex items-center justify-between bg-stone-50">
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase tracking-wider text-stone-500 font-mono-data">
              Informasi Pustaka
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-stone-400 hover:text-stone-700 rounded-md transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1 custom-scrollbar space-y-6">
          <div className="flex flex-col sm:flex-row gap-6 items-start">
            <div className="shrink-0 mx-auto sm:mx-0">
              <BookCover
                title={book.title}
                author={book.author}
                coverUrl={book.coverUrl}
                coverTheme={book.coverTheme}
                size="lg"
              />
            </div>

            <div className="flex-1 min-w-0">
              <h2 className="text-xl sm:text-2xl font-serif-book font-bold text-stone-900 leading-snug mb-1">
                {book.title}
              </h2>
              <p className="text-sm font-medium text-amber-900 mb-3 font-sans-ui">
                {book.author}
              </p>

              {/* Unboxed metadata */}
              <div className="flex flex-wrap items-center gap-2 text-xs text-stone-500 mb-4 font-sans-ui">
                <span>{book.category}</span>
                <span aria-hidden="true" className="text-stone-300">·</span>
                <span className="font-mono-data">{book.totalWords.toLocaleString('id-ID')} kata</span>
                <span aria-hidden="true" className="text-stone-300">·</span>
                <span className="font-mono-data">~{book.estimatedReadTimeMinutes} menit baca</span>
                <span aria-hidden="true" className="text-stone-300">·</span>
                <span className="uppercase text-[11px] font-mono-data">{book.fileType}</span>
              </div>

              {/* Price and Digital Product Banner */}
              <div className="mb-4 p-3 bg-amber-50/80 border border-amber-200/90 rounded-lg flex items-center justify-between">
                <div>
                  <div className="text-[10px] uppercase font-mono-data text-stone-500 tracking-wider">
                    Harga Produk Digital
                  </div>
                  <div className="text-xl font-bold font-mono-data text-amber-950">
                    {book.currency || 'RM'}{' '}
                    {book.price !== undefined
                      ? book.currency === 'Rp'
                        ? book.price.toLocaleString('id-ID')
                        : book.price.toFixed(2)
                      : '0.00'}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] uppercase font-mono-data text-stone-500">
                    Kod SKU / Naskah
                  </div>
                  <div className="text-xs font-mono-data font-semibold text-stone-800">
                    {book.sku || 'MYK-EBOOK'}
                  </div>
                  {book.salesCount !== undefined && (
                    <div className="text-[11px] text-stone-500 font-mono-data mt-0.5">
                      {book.salesCount} unit terjual
                    </div>
                  )}
                </div>
              </div>

              {/* Star Rating */}
              <div className="flex items-center gap-2 mb-4">
                <span className="text-xs text-stone-500 font-sans-ui">Penilaian:</span>
                <div className="flex items-center gap-0.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => onUpdateRating(book.id, star)}
                      className="p-0.5 text-stone-300 hover:text-amber-500 cursor-pointer transition-colors"
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
              <div className="mb-4 p-3 bg-stone-50 rounded-lg border border-stone-200/80">
                <div className="flex justify-between items-center text-xs text-stone-600 mb-1.5 font-mono-data">
                  <span>Progres Baca: Bab {(book.currentChapterIndex || 0) + 1} dari {book.chapters.length}</span>
                  <span className="font-semibold text-amber-900">{book.currentProgress}%</span>
                </div>
                <div className="w-full h-2 bg-stone-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-amber-900 rounded-full transition-all"
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
                  className="px-4 py-2 text-xs font-semibold text-white bg-amber-900 hover:bg-amber-800 rounded-md cursor-pointer transition-colors shadow-xs flex items-center gap-1.5"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>{book.currentProgress > 0 ? 'Lanjutkan Membaca' : 'Buka & Baca'}</span>
                </button>

                <button
                  onClick={() => {
                    onClose();
                    onEditBook(book);
                  }}
                  className="px-3 py-2 text-xs font-medium text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-md cursor-pointer transition-colors flex items-center gap-1.5"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit Teks</span>
                </button>

                <button
                  onClick={handleExportTxt}
                  className="px-3 py-2 text-xs font-medium text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-md cursor-pointer transition-colors flex items-center gap-1.5"
                  title="Unduh seluruh buku dalam format teks (.txt)"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Unduh TXT</span>
                </button>

                <button
                  onClick={() => {
                    if (confirm(`Hapus "${book.title}" dari perpustakaan? Tindakan ini tidak dapat dibatalkan.`)) {
                      onDeleteBook(book.id);
                      onClose();
                    }
                  }}
                  className="px-3 py-2 text-xs font-medium text-rose-700 hover:bg-rose-50 rounded-md cursor-pointer transition-colors ml-auto flex items-center gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Hapus</span>
                </button>
              </div>
            </div>
          </div>

          {/* Synopsis */}
          <div>
            <h4 className="text-xs uppercase tracking-wider text-stone-500 font-sans-ui mb-1.5">
              Sinopsis
            </h4>
            <p className="text-sm text-stone-700 leading-relaxed font-serif-book whitespace-pre-line bg-stone-50/70 p-4 rounded-lg border border-stone-200/60">
              {book.description || 'Tidak ada deskripsi sinopsis untuk buku ini.'}
            </p>
          </div>

          {/* Tabs: Chapters / Bookmarks / Highlights */}
          <div>
            <div className="flex items-center gap-1 border-b border-stone-200 mb-3">
              <button
                onClick={() => setActiveTab('chapters')}
                className={`px-3 py-2 text-xs font-medium cursor-pointer transition-colors border-b-2 -mb-px ${
                  activeTab === 'chapters'
                    ? 'border-amber-900 text-stone-900 font-semibold'
                    : 'border-transparent text-stone-500 hover:text-stone-900'
                }`}
              >
                Daftar Bab ({book.chapters.length})
              </button>
              <button
                onClick={() => setActiveTab('bookmarks')}
                className={`px-3 py-2 text-xs font-medium cursor-pointer transition-colors border-b-2 -mb-px ${
                  activeTab === 'bookmarks'
                    ? 'border-amber-900 text-stone-900 font-semibold'
                    : 'border-transparent text-stone-500 hover:text-stone-900'
                }`}
              >
                Penanda Halaman ({bookmarks.length})
              </button>
              <button
                onClick={() => setActiveTab('highlights')}
                className={`px-3 py-2 text-xs font-medium cursor-pointer transition-colors border-b-2 -mb-px ${
                  activeTab === 'highlights'
                    ? 'border-amber-900 text-stone-900 font-semibold'
                    : 'border-transparent text-stone-500 hover:text-stone-900'
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
                    className="p-3 bg-stone-50 hover:bg-stone-100 rounded-md border border-stone-200/70 cursor-pointer flex items-center justify-between text-xs transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-mono-data text-stone-400 w-6">
                        {(idx + 1).toString().padStart(2, '0')}.
                      </span>
                      <span className="font-medium text-stone-900">{ch.title}</span>
                    </div>
                    <span className="text-stone-500 font-mono-data">{ch.wordCount.toLocaleString('id-ID')} kata</span>
                  </div>
                ))}
              </div>
            )}

            {/* Tab: Bookmarks */}
            {activeTab === 'bookmarks' && (
              <div className="space-y-2">
                {bookmarks.length === 0 ? (
                  <div className="text-center py-6 text-xs text-stone-400">
                    Belum ada penanda halaman. Anda dapat menandai halaman saat membaca di e-reader.
                  </div>
                ) : (
                  bookmarks.map((bm) => (
                    <div
                      key={bm.id}
                      onClick={() => {
                        onClose();
                        onOpenReader(book, bm.chapterIndex);
                      }}
                      className="p-3 bg-stone-50 hover:bg-stone-100 rounded-md border border-stone-200/70 cursor-pointer text-xs"
                    >
                      <div className="flex items-center justify-between font-semibold text-stone-800 mb-1">
                        <span>{bm.chapterTitle}</span>
                        <span className="text-stone-400 font-mono-data text-[11px]">
                          {new Date(bm.createdAt).toLocaleDateString('id-ID')}
                        </span>
                      </div>
                      <p className="text-stone-600 italic line-clamp-2 font-serif-book">
                        "{bm.snippet}"
                      </p>
                      {bm.note && (
                        <div className="mt-1 text-[11px] text-amber-900 font-medium">
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
                  <div className="text-center py-6 text-xs text-stone-400">
                    Belum ada kalimat yang disorot. Sorot teks penting saat membaca untuk menyimpannya ke sini.
                  </div>
                ) : (
                  highlights.map((hl) => (
                    <div
                      key={hl.id}
                      onClick={() => {
                        onClose();
                        onOpenReader(book, hl.chapterIndex);
                      }}
                      className="p-3 bg-stone-50 hover:bg-stone-100 rounded-md border border-stone-200/70 cursor-pointer text-xs"
                    >
                      <p className="text-stone-800 font-serif-book leading-relaxed pl-2 border-l-2 border-amber-600">
                        {hl.selectedText}
                      </p>
                      {hl.note && (
                        <div className="mt-1.5 text-[11px] text-stone-600">
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
      </div>
    </div>
  );
};
