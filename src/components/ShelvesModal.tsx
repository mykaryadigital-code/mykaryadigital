import React, { useState } from 'react';
import { X, Plus, Trash2, FolderHeart, Book as BookIcon } from 'lucide-react';
import { Book, CustomShelf } from '../types/book';
import { saveShelf, deleteShelf } from '../services/storage';

interface ShelvesModalProps {
  isOpen: boolean;
  onClose: () => void;
  shelves: CustomShelf[];
  books: Book[];
  onShelvesUpdated: () => void;
  onSelectShelfFilter: (shelfName: string | null) => void;
  activeShelfFilter: string | null;
}

export const ShelvesModal: React.FC<ShelvesModalProps> = ({
  isOpen,
  onClose,
  shelves,
  books,
  onShelvesUpdated,
  onSelectShelfFilter,
  activeShelfFilter,
}) => {
  const [newShelfName, setNewShelfName] = useState('');
  const [newShelfDesc, setNewShelfDesc] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [shelfToDelete, setShelfToDelete] = useState<CustomShelf | null>(null);

  if (!isOpen) return null;

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newShelfName.trim()) return;

    const newShelf: CustomShelf = {
      id: `shelf-${Date.now()}`,
      name: newShelfName.trim(),
      description: newShelfDesc.trim(),
      createdAt: new Date().toISOString(),
    };

    await saveShelf(newShelf);
    setNewShelfName('');
    setNewShelfDesc('');
    setIsCreating(false);
    onShelvesUpdated();
  };

  const handleConfirmDelete = async () => {
    if (!shelfToDelete) return;
    await deleteShelf(shelfToDelete.id);
    if (activeShelfFilter === shelfToDelete.name) {
      onSelectShelfFilter(null);
    }
    setShelfToDelete(null);
    onShelvesUpdated();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="relative bg-white border border-[#E2E8F0] rounded-[20px] shadow-2xl max-w-xl w-full overflow-hidden animate-in fade-in-50 zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#E2E8F0] flex items-center justify-between bg-[#F7F9F8]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#ECFDF5] flex items-center justify-center text-[#006B57]">
              <FolderHeart className="w-4 h-4" />
            </div>
            <h2 className="text-base font-bold text-[#102A27]">
              Rak Buku Kustom
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto custom-scrollbar">
          <div className="flex items-center justify-between">
            <p className="text-xs text-[#64748B]">
              Kelompokkan koleksi novel dan ebook anda ke dalam rak tematik.
            </p>
            <button
              onClick={() => setIsCreating(!isCreating)}
              className="px-3 py-1.5 text-xs font-semibold text-[#006B57] bg-[#ECFDF5] hover:bg-[#D1FAE5] rounded-[10px] border border-[#A7F3D0] cursor-pointer flex items-center gap-1 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{isCreating ? 'Tutup Borang' : 'Buat Rak Baru'}</span>
            </button>
          </div>

          {isCreating && (
            <form onSubmit={handleCreate} className="p-4 bg-[#F7F9F8] border border-[#E2E8F0] rounded-[14px] space-y-3">
              <div>
                <label className="block text-xs font-bold text-[#102A27] mb-1">
                  Nama Rak Buku
                </label>
                <input
                  type="text"
                  required
                  value={newShelfName}
                  onChange={(e) => setNewShelfName(e.target.value)}
                  placeholder="cth. Novel Kegemaran, Resepi Warisan"
                  className="w-full text-xs px-3 py-2 bg-white border border-[#CBD5E1] rounded-[10px] focus:outline-none focus:border-[#006B57]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#102A27] mb-1">
                  Keterangan (Pilihan)
                </label>
                <input
                  type="text"
                  value={newShelfDesc}
                  onChange={(e) => setNewShelfDesc(e.target.value)}
                  placeholder="Koleksi buku terpilih untuk santai petang"
                  className="w-full text-xs px-3 py-2 bg-white border border-[#CBD5E1] rounded-[10px] focus:outline-none focus:border-[#006B57]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setIsCreating(false)}
                  className="px-3 py-1.5 text-xs text-[#64748B] hover:text-[#102A27] cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-semibold text-white bg-[#006B57] hover:bg-[#063F35] rounded-[10px] cursor-pointer shadow-xs transition-colors"
                >
                  Simpan Rak
                </button>
              </div>
            </form>
          )}

          {shelves.length === 0 ? (
            <div className="text-center py-8 text-xs text-[#64748B] bg-slate-50 border border-[#E2E8F0] rounded-[14px]">
              Belum ada rak kustom. Klik "Buat Rak Baru" untuk memulakan.
            </div>
          ) : (
            <div className="space-y-2">
              {shelves.map((shelf) => {
                const count = books.filter((b) => b.shelf === shelf.name).length;
                const isSelected = activeShelfFilter === shelf.name;

                return (
                  <div
                    key={shelf.id}
                    className={`p-3.5 rounded-[14px] border flex items-center justify-between gap-3 transition-colors ${
                      isSelected
                        ? 'bg-[#ECFDF5] border-[#A7F3D0]'
                        : 'bg-white border-[#E2E8F0] hover:bg-slate-50'
                    }`}
                  >
                    <div
                      onClick={() => onSelectShelfFilter(isSelected ? null : shelf.name)}
                      className="flex-1 cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-[#102A27]">{shelf.name}</span>
                        {isSelected && (
                          <span className="text-[10px] font-bold text-[#006B57] bg-white px-2 py-0.5 rounded-full border border-[#A7F3D0]">
                            Aktif
                          </span>
                        )}
                      </div>
                      {shelf.description && (
                        <p className="text-[11px] text-[#64748B] mt-0.5">{shelf.description}</p>
                      )}
                      <div className="flex items-center gap-1.5 mt-1 text-[11px] text-[#64748B] font-mono-data">
                        <BookIcon className="w-3 h-3 text-[#64748B]" />
                        <span>{count} buah buku</span>
                      </div>
                    </div>

                    <button
                      onClick={() => setShelfToDelete(shelf)}
                      className="p-1.5 text-slate-400 hover:text-[#E53935] rounded-md transition-colors cursor-pointer"
                      title="Padam rak"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Inline Safe Delete Overlay */}
        {shelfToDelete && (
          <div className="absolute inset-0 z-30 bg-white/95 backdrop-blur-xs rounded-[20px] p-6 flex flex-col items-center justify-center text-center animate-in fade-in-50 duration-150">
            <Trash2 className="w-8 h-8 text-[#E53935] mb-2" />
            <h4 className="text-base font-bold text-[#102A27] mb-1">Padam Rak "{shelfToDelete.name}"?</h4>
            <p className="text-xs text-[#64748B] max-w-xs mb-4">
              Buku di dalam rak ini tidak akan terhapus daripada perpustakaan anda.
            </p>
            <div className="flex items-center gap-2.5">
              <button
                onClick={() => setShelfToDelete(null)}
                className="h-9 px-4 rounded-[10px] text-xs font-semibold text-[#102A27] bg-slate-100 hover:bg-slate-200 cursor-pointer"
              >
                Batal
              </button>
              <button
                onClick={handleConfirmDelete}
                className="h-9 px-4 rounded-[10px] text-xs font-semibold text-white bg-[#E53935] hover:bg-red-700 cursor-pointer shadow-xs"
              >
                Ya, Padam Rak
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
