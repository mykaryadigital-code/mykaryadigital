import React, { useState } from 'react';
import { X, Plus, Trash2, BookOpen, Layers, Save, Image as ImageIcon } from 'lucide-react';
import { Book, Chapter, BookCategory, CoverTheme } from '../types/book';
import { BookCover } from './BookCover';

interface NovelWriterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveBook: (book: Book) => void;
  editingBook?: Book | null;
}

const CATEGORIES: BookCategory[] = [
  'Novel Sastra',
  'Resepi',
  'Fiksi Umum',
  'Fantasi & Petualangan',
  'Misteri & Detektif',
  'Romansa',
  'Fiksi Ilmiah',
  'Sejarah & Biografi',
  'Non-Fiksi & Esai',
  'Puisi & Sastra Klasik',
  'Lainnya',
];

const COVER_VARIANTS: CoverTheme['variant'][] = [
  'burgundy',
  'navy',
  'emerald',
  'noir',
  'terracotta',
  'amber',
  'slate',
];

export const NovelWriterModal: React.FC<NovelWriterModalProps> = ({
  isOpen,
  onClose,
  onSaveBook,
  editingBook,
}) => {
  const [title, setTitle] = useState(editingBook?.title || 'Judul Novel Baru');
  const [author, setAuthor] = useState(editingBook?.author || 'Penulis');
  const [description, setDescription] = useState(editingBook?.description || '');
  const [category, setCategory] = useState<BookCategory>(editingBook?.category || 'Novel Sastra');
  const [price, setPrice] = useState<number>(editingBook?.price ?? 29.0);
  const [currency, setCurrency] = useState<'RM' | 'Rp' | 'USD'>(editingBook?.currency ?? 'RM');
  const [freeChapterCount, setFreeChapterCount] = useState<number>(editingBook?.freeChapterCount ?? 1);
  const [sku, setSku] = useState<string>(editingBook?.sku ?? '');
  const [coverVariant, setCoverVariant] = useState<CoverTheme['variant']>(editingBook?.coverTheme.variant || 'burgundy');
  const [customCoverUrl, setCustomCoverUrl] = useState<string | undefined>(editingBook?.coverUrl);

  const [chapters, setChapters] = useState<Chapter[]>(
    editingBook?.chapters || [
      {
        id: `chap-1-${Date.now()}`,
        title: 'Bab 1: Permulaan',
        content: '',
        wordCount: 0,
      },
    ]
  );
  const [activeChapterIndex, setActiveChapterIndex] = useState(0);

  if (!isOpen) return null;

  const currentChapter = chapters[activeChapterIndex] || chapters[0];

  const handleUpdateChapter = (key: 'title' | 'content', value: string) => {
    const updated = [...chapters];
    const target = { ...updated[activeChapterIndex], [key]: value };
    if (key === 'content') {
      const words = value.split(/\s+/).filter(Boolean).length;
      target.wordCount = words;
    }
    updated[activeChapterIndex] = target;
    setChapters(updated);
  };

  const handleAddChapter = () => {
    const newIdx = chapters.length + 1;
    const newChap: Chapter = {
      id: `chap-${newIdx}-${Date.now()}`,
      title: `Bab ${newIdx}: Judul Bab`,
      content: '',
      wordCount: 0,
    };
    setChapters([...chapters, newChap]);
    setActiveChapterIndex(chapters.length);
  };

  const handleDeleteChapter = (index: number) => {
    if (chapters.length <= 1) {
      alert('Novel minimal harus memiliki setidaknya satu bab.');
      return;
    }
    const filtered = chapters.filter((_, i) => i !== index);
    setChapters(filtered);
    setActiveChapterIndex(Math.max(0, index - 1));
  };

  const handleSave = () => {
    if (!title.trim()) {
      alert('Mohon masukkan judul novel/buku.');
      return;
    }

    const totalWords = chapters.reduce((acc, c) => acc + (c.wordCount || 0), 0);
    const estimatedReadTimeMinutes = Math.max(1, Math.ceil(totalWords / 200));

    const bookToSave: Book = {
      id: editingBook ? editingBook.id : `novel-${Date.now()}`,
      title: title.trim(),
      author: author.trim() || 'Penulis Anonim',
      description: description.trim() || 'Novel karya orisinal.',
      category,
      price: Number(price) || 0,
      currency,
      freeChapterCount: Math.max(1, freeChapterCount),
      sku: sku.trim() || editingBook?.sku || `MYK-${Date.now().toString().slice(-6)}`,
      salesCount: editingBook?.salesCount || 0,
      status: editingBook ? editingBook.status : 'reading',
      isFavorite: editingBook ? editingBook.isFavorite : false,
      rating: editingBook ? editingBook.rating : 0,
      coverUrl: customCoverUrl,
      coverTheme: {
        variant: coverVariant,
        pattern: 'ornate',
      },
      tags: ['Karya Sendiri', category],
      totalWords,
      estimatedReadTimeMinutes,
      dateAdded: editingBook ? editingBook.dateAdded : new Date().toISOString(),
      lastReadDate: new Date().toISOString(),
      currentProgress: editingBook ? editingBook.currentProgress : 0,
      currentChapterIndex: editingBook ? editingBook.currentChapterIndex : 0,
      chapters,
      fileType: 'custom',
    };

    onSaveBook(bookToSave);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-stone-900/70 backdrop-blur-xs">
      <div className="bg-white border border-stone-200 rounded-xl shadow-2xl w-full max-w-5xl h-[92vh] flex flex-col overflow-hidden animate-in fade-in-50 zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-3.5 border-b border-stone-200 flex items-center justify-between bg-stone-50">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-amber-900" />
            <h2 className="text-base font-serif-book font-semibold text-stone-900">
              {editingBook ? 'Edit Buku & Bab' : 'Studio Penulisan Buku Digital'}
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleSave}
              className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium text-white bg-amber-900 hover:bg-amber-800 rounded-md cursor-pointer transition-colors shadow-xs"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Simpan Buku</span>
            </button>
            <button
              onClick={onClose}
              className="p-1 text-stone-400 hover:text-stone-700 rounded-md transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Layout: 3 Columns (Metadata & Cover, Chapter List, Chapter Content Editor) */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          {/* Col 1: Book Info & Cover (280px) */}
          <div className="w-full md:w-72 border-r border-stone-200 p-4 overflow-y-auto custom-scrollbar bg-stone-50/50 space-y-3">
            <div className="flex justify-center mb-2">
              <BookCover
                title={title || 'Judul Novel'}
                author={author || 'Penulis'}
                coverUrl={customCoverUrl}
                coverTheme={{ variant: coverVariant, pattern: 'ornate' }}
                size="sm"
              />
            </div>

            {/* Color variants */}
            <div>
              <label className="block text-[11px] font-medium text-stone-600 mb-1">
                Warna Sampul Buku
              </label>
              <div className="flex items-center gap-1.5">
                {COVER_VARIANTS.map((v) => (
                  <button
                    key={v}
                    type="button"
                    onClick={() => {
                      setCoverVariant(v);
                      setCustomCoverUrl(undefined);
                    }}
                    className={`w-4 h-4 rounded-full border cursor-pointer ${
                      coverVariant === v ? 'ring-2 ring-amber-500 scale-125' : 'border-stone-300'
                    }`}
                    style={{
                      backgroundColor:
                        v === 'navy'
                          ? '#0f2744'
                          : v === 'burgundy'
                          ? '#4a0e17'
                          : v === 'emerald'
                          ? '#063928'
                          : v === 'noir'
                          ? '#1c1917'
                          : v === 'terracotta'
                          ? '#88321d'
                          : v === 'amber'
                          ? '#78350f'
                          : '#3f3f46',
                    }}
                  />
                ))}
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-medium text-stone-600 mb-1">
                Judul Karya
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Contoh: Senja di Pelabuhan Ratu"
                className="w-full text-xs px-2.5 py-1.5 bg-white border border-stone-200 rounded-md focus:outline-none focus:border-amber-800"
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-stone-600 mb-1">
                Nama Pengarang
              </label>
              <input
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="Nama Anda atau Samaran"
                className="w-full text-xs px-2.5 py-1.5 bg-white border border-stone-200 rounded-md focus:outline-none focus:border-amber-800"
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-stone-600 mb-1">
                Kategori
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as BookCategory)}
                className="w-full text-xs px-2.5 py-1.5 bg-white border border-stone-200 rounded-md focus:outline-none focus:border-amber-800"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Price & Currency inputs for Paid Digital Product */}
            <div className="p-2.5 bg-amber-50/60 border border-amber-200 rounded-md space-y-2">
              <div>
                <label className="block text-[11px] font-medium text-amber-950 mb-1">
                  Harga Produk Digital
                </label>
                <div className="flex gap-1.5">
                  <select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value as any)}
                    className="w-16 text-xs px-1.5 py-1 bg-white border border-stone-300 rounded focus:outline-none focus:border-amber-800"
                  >
                    <option value="RM">RM</option>
                    <option value="Rp">Rp</option>
                    <option value="USD">$</option>
                  </select>
                  <input
                    type="number"
                    min="0"
                    step="0.1"
                    value={price}
                    onChange={(e) => setPrice(parseFloat(e.target.value) || 0)}
                    placeholder="29.00"
                    className="flex-1 text-xs font-mono-data px-2 py-1 bg-white border border-stone-300 rounded focus:outline-none focus:border-amber-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-amber-950 mb-1">
                  Bab Percuma untuk Pembaca
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="1"
                    max={Math.max(1, chapters.length)}
                    value={freeChapterCount}
                    onChange={(e) => setFreeChapterCount(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-20 text-xs font-mono-data px-2 py-1 bg-white border border-stone-300 rounded focus:outline-none focus:border-amber-800"
                  />
                  <span className="text-[10px] text-stone-500">
                    Bab pertama percuma. Bab seterusnya terkunci.
                  </span>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-medium text-stone-600 mb-1">
                Sinopsis / Ringkasan
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Tuliskan latar belakang atau premis novel..."
                className="w-full text-xs px-2.5 py-1.5 bg-white border border-stone-200 rounded-md focus:outline-none focus:border-amber-800 resize-none"
              />
            </div>
          </div>

          {/* Col 2: Chapters Nav Strip (200px) */}
          <div className="w-full md:w-56 border-r border-stone-200 p-3 bg-stone-100/50 flex flex-col justify-between">
            <div className="overflow-y-auto flex-1 custom-scrollbar space-y-1">
              <div className="flex items-center justify-between px-1 pb-2 border-b border-stone-200">
                <span className="text-[11px] uppercase tracking-wider font-semibold text-stone-500">
                  Daftar Bab ({chapters.length})
                </span>
                <button
                  type="button"
                  onClick={handleAddChapter}
                  className="p-1 text-stone-600 hover:text-amber-900 hover:bg-stone-200 rounded-xs cursor-pointer"
                  title="Tambah Bab Baru"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="pt-1 space-y-1">
                {chapters.map((chap, idx) => (
                  <div
                    key={chap.id}
                    onClick={() => setActiveChapterIndex(idx)}
                    className={`p-2 rounded-md cursor-pointer flex items-center justify-between text-xs transition-colors ${
                      activeChapterIndex === idx
                        ? 'bg-white border border-stone-300 font-medium text-stone-900 shadow-2xs'
                        : 'text-stone-600 hover:bg-stone-200/60'
                    }`}
                  >
                    <div className="truncate pr-1">
                      <div className="truncate">{chap.title || `Bab ${idx + 1}`}</div>
                      <div className="text-[10px] text-stone-400 font-mono-data">
                        {chap.wordCount || 0} kata
                      </div>
                    </div>

                    {chapters.length > 1 && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteChapter(idx);
                        }}
                        className="text-stone-400 hover:text-rose-600 p-0.5 rounded-xs"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={handleAddChapter}
              className="mt-2 w-full py-1.5 border border-dashed border-stone-300 hover:border-amber-800 text-stone-600 hover:text-amber-900 rounded-md text-xs font-medium flex items-center justify-center gap-1 cursor-pointer transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Tambah Bab Baru</span>
            </button>
          </div>

          {/* Col 3: Chapter Content Editor */}
          <div className="flex-1 flex flex-col p-4 bg-white overflow-hidden">
            <div className="mb-3">
              <label className="block text-[11px] font-medium text-stone-500 mb-1">
                Judul Bab
              </label>
              <input
                type="text"
                value={currentChapter.title}
                onChange={(e) => handleUpdateChapter('title', e.target.value)}
                placeholder="Contoh: Bab 1: Pertemuan di Gerbang Kota"
                className="w-full text-base font-serif-book font-semibold px-3 py-1.5 border-b border-stone-200 focus:outline-none focus:border-amber-900 text-stone-900"
              />
            </div>

            <div className="flex-1 flex flex-col">
              <div className="flex items-center justify-between text-[11px] text-stone-400 mb-1">
                <span>Isi Cerita / Teks Bab:</span>
                <span className="font-mono-data">
                  {currentChapter.wordCount || 0} kata (saran: gunakan paragraf ganda untuk jeda)
                </span>
              </div>
              <textarea
                value={currentChapter.content}
                onChange={(e) => handleUpdateChapter('content', e.target.value)}
                placeholder="Ketik isi novel Anda di sini... Gunakan baris baru untuk memisahkan paragraf."
                className="w-full flex-1 p-4 bg-stone-50/40 border border-stone-200 rounded-lg text-sm leading-relaxed font-serif-book text-stone-800 focus:outline-none focus:border-amber-900 resize-none custom-scrollbar"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
