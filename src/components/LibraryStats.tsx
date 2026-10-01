import React from 'react';
import { Book } from '../types/book';

interface LibraryStatsProps {
  books: Book[];
}

export const LibraryStats: React.FC<LibraryStatsProps> = ({ books }) => {
  const totalBooks = books.length;
  const totalValuation = books.reduce((acc, b) => acc + (b.price || 0), 0);
  const totalSales = books.reduce((acc, b) => acc + (b.salesCount || 0), 0);
  const currency = books[0]?.currency || 'RM';
  const currentlyReading = books.filter((b) => b.status === 'reading').length;
  const completedBooks = books.filter((b) => b.status === 'completed').length;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-4 px-5 bg-white border border-stone-200/80 rounded-lg shadow-2xs">
      <div>
        <div className="text-[11px] uppercase tracking-wider text-stone-500 font-sans-ui">
          Produk Digital Tersimpan
        </div>
        <div className="text-xl sm:text-2xl font-semibold font-mono-data text-stone-900 mt-1">
          {totalBooks} <span className="text-xs font-normal text-stone-500">naskah / ebook</span>
        </div>
      </div>

      <div>
        <div className="text-[11px] uppercase tracking-wider text-stone-500 font-sans-ui">
          Nilai Katalog Digital
        </div>
        <div className="text-xl sm:text-2xl font-bold font-mono-data text-amber-950 mt-1">
          {currency} {totalValuation.toFixed(2)}
        </div>
      </div>

      <div>
        <div className="text-[11px] uppercase tracking-wider text-stone-500 font-sans-ui">
          Total Terjual / Unduhan
        </div>
        <div className="text-xl sm:text-2xl font-semibold font-mono-data text-stone-900 mt-1">
          {totalSales.toLocaleString('id-ID')} <span className="text-xs font-normal text-stone-500">salinan</span>
        </div>
      </div>

      <div>
        <div className="text-[11px] uppercase tracking-wider text-stone-500 font-sans-ui">
          Status Pembacaan
        </div>
        <div className="text-xl sm:text-2xl font-semibold font-mono-data text-stone-900 mt-1">
          <span className="text-amber-900">{currentlyReading}</span> <span className="text-xs font-normal text-stone-400">baca</span> · <span>{completedBooks}</span> <span className="text-xs font-normal text-stone-400">tamat</span>
        </div>
      </div>
    </div>
  );
};
