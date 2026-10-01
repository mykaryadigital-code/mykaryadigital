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

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Hapus rak "${name}"? Buku di dalamnya tidak akan terhapus.`)) {
      await deleteShelf(id);
      if (activeShelfFilter === name) {
        onSelectShelfFilter(null);
      }
      onShelvesUpdated();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs">
      <div className="bg-white border border-stone-200 rounded-xl shadow-2xl max-w-xl w-full overflow-hidden animate-in fade-in-50 zoom-in-95 duration-200">
        <div className="px-6 py-4 border-b border-stone-200 flex items-center justify-between bg-stone-50">
          <div className="flex items-center gap-2">
            <FolderHeart className="w-5 h-5 text-amber-900" />
            <h2 className="text-base font-serif-book font-semibold text-stone-900">
              Rak Buku Kustom
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-stone-400 hover:text-stone-700 rounded-md transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto custom-scrollbar">
          <div className="flex items-center justify-between">
            <p className="text-xs text-stone-500 font-sans-ui">
              Kelompokkan koleksi novel dan ebook Anda ke dalam rak tematik.
            </p>
            <button
              onClick={() => setIsCreating(!isCreating)}
              className="px-2.5 py-1 text-xs font-medium text-amber-900 bg-amber-50 hover:bg-amber-100 rounded-md border border-amber-200 cursor-pointer flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{isCreating ? 'Tutup Form' : 'Buat Rak Baru'}</span>
            </button>
          </div>

          {isCreating && (
            <form onSubmit={handleCreate} className="p-4 bg-stone-50 border border-stone-200 rounded-lg space-y-3">
              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">
                  Nama Rak Buku
                </label>
                <input
                  type="text"
                  required
                  value={newShelfName}
                  onChange={(e) => setNewShelfName(e.target.value)}
                  placeholder="Contoh: Novel Klasik Nusantara, Fiksi Senja..."
                  className="w-full text-xs px-3 py-2 bg-white border border-stone-300 rounded-md focus:outline-none focus:border-amber-900"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">
                  Deskripsi (Opsional)
                </label>
                <input
                  type="text"
                  value={newShelfDesc}
                  onChange={(e) => setNewShelfDesc(e.target.value)}
                  placeholder="Koleksi buku bertema khusus..."
                  className="w-full text-xs px-3 py-2 bg-white border border-stone-300 rounded-md focus:outline-none focus:border-amber-900"
                />
              </div>
              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setIsCreating(false)}
                  className="px-3 py-1.5 text-xs text-stone-600 hover:text-stone-900 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-medium text-white bg-amber-900 hover:bg-amber-800 rounded-md cursor-pointer"
                >
                  Simpan Rak
                </button>
              </div>
            </form>
          )}

          {/* Shelves List */}
          <div className="space-y-2">
            {shelves.length === 0 ? (
              <div className="text-center py-8 text-xs text-stone-400">
                Belum ada rak khusus. Klik "Buat Rak Baru" untuk mulai mengelompokkan buku.
              </div>
            ) : (
              shelves.map((shelf) => {
                const count = books.filter((b) => b.shelf === shelf.name).length;
                const isSelected = activeShelfFilter === shelf.name;

                return (
                  <div
                    key={shelf.id}
                    className={`p-3 rounded-lg border transition-all flex items-center justify-between ${
                      isSelected
                        ? 'border-amber-900 bg-amber-50/60'
                        : 'border-stone-200 hover:border-stone-300 bg-white'
                    }`}
                  >
                    <div
                      onClick={() => {
                        onSelectShelfFilter(isSelected ? null : shelf.name);
                        onClose();
                      }}
                      className="cursor-pointer flex-1"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-stone-900">
                          {shelf.name}
                        </span>
                        {isSelected && (
                          <span className="text-[10px] text-amber-900 font-semibold uppercase">
                            (Aktif)
                          </span>
                        )}
                      </div>
                      {shelf.description && (
                        <p className="text-xs text-stone-500 mt-0.5 line-clamp-1 font-sans-ui">
                          {shelf.description}
                        </p>
                      )}
                      <div className="text-[11px] text-stone-400 font-mono-data mt-1">
                        {count} buku di dalam rak
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          onSelectShelfFilter(isSelected ? null : shelf.name);
                          onClose();
                        }}
                        className="px-2.5 py-1 text-xs text-stone-700 bg-stone-100 hover:bg-stone-200 rounded cursor-pointer"
                      >
                        {isSelected ? 'Batalkan Filter' : 'Tampilkan Buku'}
                      </button>
                      <button
                        onClick={() => handleDelete(shelf.id, shelf.name)}
                        className="p-1.5 text-stone-400 hover:text-rose-600 rounded cursor-pointer"
                        title="Hapus rak"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        <div className="px-6 py-3 border-t border-stone-200 bg-stone-50 flex justify-between items-center text-xs">
          {activeShelfFilter && (
            <button
              onClick={() => {
                onSelectShelfFilter(null);
                onClose();
              }}
              className="text-amber-900 font-medium hover:underline cursor-pointer"
            >
              Hapus filter rak aktif ({activeShelfFilter})
            </button>
          )}
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-medium text-stone-700 hover:text-stone-900 cursor-pointer ml-auto"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
