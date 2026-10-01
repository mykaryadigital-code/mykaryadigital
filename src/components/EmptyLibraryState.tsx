import React from 'react';
import { BookOpen, Plus } from 'lucide-react';

interface EmptyLibraryStateProps {
  onAddBook: () => void;
  onResetFilter?: () => void;
  isFiltered?: boolean;
}

export const EmptyLibraryState: React.FC<EmptyLibraryStateProps> = ({
  onAddBook,
  onResetFilter,
  isFiltered = false,
}) => {
  return (
    <div className="py-20 px-6 text-center bg-white border border-[#E2E8F0] rounded-[20px] shadow-[0_4px_20px_rgba(15,23,42,0.03)] max-w-xl mx-auto my-6">
      <div className="w-16 h-16 rounded-2xl bg-[#ECFDF5] border border-[#A7F3D0]/60 flex items-center justify-center mx-auto mb-4 text-[#006B57]">
        <BookOpen className="w-8 h-8" />
      </div>

      <h3 className="text-xl font-bold text-[#102A27] tracking-tight mb-2">
        {isFiltered ? 'Tiada Buku Ditemui' : 'Belum ada buku di rak anda.'}
      </h3>

      <p className="text-sm text-[#64748B] max-w-sm mx-auto mb-6 leading-relaxed">
        {isFiltered
          ? 'Tiada buku yang sepadan dengan carian atau kategori yang dipilih.'
          : 'Tambahkan buku pertama anda untuk mula membina koleksi perpustakaan digital peribadi.'}
      </p>

      <div className="flex flex-wrap items-center justify-center gap-3">
        {isFiltered && onResetFilter && (
          <button
            onClick={onResetFilter}
            className="h-11 px-5 rounded-[12px] text-sm font-semibold text-[#102A27] bg-white border border-[#CBD5E1] hover:bg-slate-50 transition-colors cursor-pointer"
          >
            Reset Penapis
          </button>
        )}

        <button
          onClick={onAddBook}
          className="h-11 px-6 rounded-[12px] text-sm font-semibold text-white bg-[#006B57] hover:bg-[#063F35] transition-colors cursor-pointer shadow-xs flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>+ Tambah Buku</span>
        </button>
      </div>
    </div>
  );
};
