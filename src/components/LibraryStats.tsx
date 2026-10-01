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
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-4 px-5 bg-white border border-[#E2E8F0] rounded-[16px] shadow-[0_4px_20px_rgba(15,23,42,0.03)]">
      <div>
        <div className="text-[11px] uppercase tracking-wider text-[#64748B] font-semibold">
          Produk Digital Tersimpan
        </div>
        <div className="text-xl sm:text-2xl font-bold font-mono-data text-[#102A27] mt-1">
          {totalBooks} <span className="text-xs font-normal text-[#64748B]">naskah / ebook</span>
        </div>
      </div>

      <div>
        <div className="text-[11px] uppercase tracking-wider text-[#64748B] font-semibold">
          Nilai Katalog Digital
        </div>
        <div className="text-xl sm:text-2xl font-bold font-mono-data text-[#006B57] mt-1">
          {currency} {totalValuation.toFixed(2)}
        </div>
      </div>

      <div>
        <div className="text-[11px] uppercase tracking-wider text-[#64748B] font-semibold">
          Total Terjual / Unduhan
        </div>
        <div className="text-xl sm:text-2xl font-bold font-mono-data text-[#102A27] mt-1">
          {totalSales.toLocaleString('id-ID')} <span className="text-xs font-normal text-[#64748B]">salinan</span>
        </div>
      </div>

      <div>
        <div className="text-[11px] uppercase tracking-wider text-[#64748B] font-semibold">
          Status Pembacaan
        </div>
        <div className="text-xl sm:text-2xl font-bold font-mono-data text-[#102A27] mt-1">
          <span className="text-[#006B57]">{currentlyReading}</span> <span className="text-xs font-normal text-[#64748B]">baca</span> · <span>{completedBooks}</span> <span className="text-xs font-normal text-[#64748B]">tamat</span>
        </div>
      </div>
    </div>
  );
};
