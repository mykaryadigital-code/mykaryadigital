import React from 'react';
import { Book } from '../types/book';
import { BookOpen, ArrowRight, Clock } from 'lucide-react';
import { BookCover } from './BookCover';

interface ContinueReadingStripProps {
  books: Book[];
  onOpenReader: (book: Book) => void;
  onOpenDetail: (book: Book) => void;
}

export const ContinueReadingStrip: React.FC<ContinueReadingStripProps> = ({
  books,
  onOpenReader,
  onOpenDetail,
}) => {
  // Only books with 1% - 99% progress
  const readingBooks = books.filter(
    (b) => (b.currentProgress || 0) >= 1 && (b.currentProgress || 0) < 100
  );

  if (readingBooks.length === 0) return null;

  return (
    <section className="space-y-3 text-left">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-emerald-100 dark:bg-emerald-950/80 text-[#006B57] dark:text-emerald-400 flex items-center justify-center">
            <BookOpen className="w-4 h-4" />
          </div>
          <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
            Sambung Membaca
          </h2>
          <span className="px-2 py-0.5 rounded-full text-[11px] font-mono-data font-bold bg-[#ECFDF5] dark:bg-emerald-950 text-[#006B57] dark:text-emerald-400 border border-[#A7F3D0]/60 dark:border-emerald-800">
            {readingBooks.length} naskhah
          </span>
        </div>
      </div>

      {/* Horizontal Scrollable In-Progress Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {readingBooks.slice(0, 3).map((book) => {
          const progress = Math.round(book.currentProgress || 0);
          const imageSource = book.imageUrl || book.coverUrl;

          return (
            <div
              key={book.id}
              className="p-3.5 rounded-xl border border-emerald-200/70 dark:border-emerald-800/60 bg-gradient-to-r from-emerald-50/50 via-white to-white dark:from-emerald-950/20 dark:via-slate-900 dark:to-slate-900 shadow-2xs hover:shadow-md transition-all flex items-center gap-3.5 group select-none"
            >
              {/* Thumbnail */}
              <div
                onClick={() => onOpenDetail(book)}
                className="w-14 h-20 shrink-0 rounded-md overflow-hidden shadow-xs cursor-pointer bg-slate-900 border border-black/10"
              >
                {imageSource ? (
                  <img
                    src={imageSource}
                    alt={book.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
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

              {/* Info & Action */}
              <div className="flex-1 min-w-0 flex flex-col justify-between h-20 py-0.5">
                <div>
                  <h4
                    onClick={() => onOpenDetail(book)}
                    className="font-serif-book font-bold text-sm text-slate-900 dark:text-white truncate cursor-pointer hover:text-[#006B57] dark:hover:text-emerald-400"
                    title={book.title}
                  >
                    {book.title}
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                    {book.author}
                  </p>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[10px] font-mono-data text-slate-500 dark:text-slate-400">
                    <span>Kemajuan</span>
                    <span className="font-bold text-[#006B57] dark:text-emerald-400">{progress}%</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#006B57] to-emerald-400 rounded-full"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => onOpenReader(book)}
                  className="min-h-[32px] h-8 px-3 rounded-lg bg-[#006B57] hover:bg-[#063F35] text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer active:scale-95 mt-1"
                >
                  <BookOpen className="w-3 h-3" />
                  <span>Sambung</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
