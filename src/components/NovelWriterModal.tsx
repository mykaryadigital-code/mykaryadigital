import React, { useState, useRef } from 'react';
import {
  X,
  Plus,
  Trash2,
  BookOpen,
  Layers,
  Save,
  Upload,
  FileText,
  CheckCircle2,
  AlertCircle,
  Sparkles,
} from 'lucide-react';
import { Book, Chapter, BookCategory, CoverTheme } from '../types/book';
import { BookCover } from './BookCover';
import { parseEpubFile, parseTextFile } from '../services/epubParser';

interface NovelWriterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveBook: (book: Book) => void;
  editingBook?: Book | null;
}

const CATEGORIES: BookCategory[] = [
  'Panduan',
  'Resepi',
  'Novel Sastra',
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
  'emerald',
  'burgundy',
  'navy',
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
  const [title, setTitle] = useState(editingBook?.title || 'Judul Naskhah Baru');
  const [author, setAuthor] = useState(editingBook?.author || 'Penulis');
  const [description, setDescription] = useState(editingBook?.description || '');
  const [category, setCategory] = useState<BookCategory>(editingBook?.category || 'Novel Sastra');
  const [price, setPrice] = useState<number>(editingBook?.price ?? 19.9);
  const [currency, setCurrency] = useState<'RM' | 'Rp' | 'USD'>(editingBook?.currency ?? 'RM');
  const [freeChapterCount, setFreeChapterCount] = useState<number>(editingBook?.freeChapterCount ?? 1);
  const [sku, setSku] = useState<string>(editingBook?.sku ?? '');
  const [coverVariant, setCoverVariant] = useState<CoverTheme['variant']>(editingBook?.coverTheme.variant || 'emerald');
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
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleProcessFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadSuccess(false);
    setErrorMsg(null);

    try {
      const lower = file.name.toLowerCase();
      let result: Omit<Book, 'id' | 'dateAdded'>;
      if (lower.endsWith('.epub')) {
        result = await parseEpubFile(file);
      } else {
        result = await parseTextFile(file);
      }

      if (result.title) setTitle(result.title);
      if (result.author) setAuthor(result.author);
      if (result.description) setDescription(result.description);
      if (result.category) setCategory(result.category);
      if (result.coverUrl) setCustomCoverUrl(result.coverUrl);
      if (result.coverTheme) setCoverVariant(result.coverTheme.variant);
      if (result.chapters && result.chapters.length > 0) {
        setChapters(result.chapters);
        setActiveChapterIndex(0);
      }

      setIsUploading(false);
      setUploadSuccess(true);
      setTimeout(() => setUploadSuccess(false), 3500);
    } catch (err) {
      setIsUploading(false);
      setErrorMsg('Ralat memproses fail ebook. Sila pastikan fail berformat .epub atau .txt yang sah.');
    }
  };

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
      setErrorMsg('Buku minimal perlu mempunyai sekurang-kurangnya satu bab.');
      return;
    }
    const filtered = chapters.filter((_, i) => i !== index);
    setChapters(filtered);
    setActiveChapterIndex(Math.max(0, index - 1));
  };

  const handleSave = () => {
    if (!title.trim()) {
      setErrorMsg('Sila masukkan judul naskhah/buku.');
      return;
    }

    const totalWords = chapters.reduce((acc, c) => acc + (c.wordCount || 0), 0);
    const estimatedReadTimeMinutes = Math.max(1, Math.ceil(totalWords / 200));

    const bookToSave: Book = {
      id: editingBook ? editingBook.id : `novel-${Date.now()}`,
      title: title.trim(),
      author: author.trim() || 'Penulis Karya Digital',
      description: description.trim() || 'Naskhah penerbitan Karya Digital.',
      category,
      price: Number(price) || 0,
      currency,
      freeChapterCount: Math.max(1, freeChapterCount),
      sku: sku.trim() || editingBook?.sku || `KD-${Date.now().toString().slice(-6)}`,
      salesCount: editingBook?.salesCount || 0,
      status: editingBook ? editingBook.status : 'reading',
      isFavorite: editingBook ? editingBook.isFavorite : false,
      rating: editingBook ? editingBook.rating : 0,
      coverUrl: customCoverUrl,
      coverTheme: {
        variant: coverVariant,
        pattern: 'ornate',
      },
      tags: ['Karya Digital', category],
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-xs">
      <div className="bg-white border border-[#E2E8F0] rounded-[20px] shadow-2xl w-full max-w-5xl h-[92vh] flex flex-col overflow-hidden animate-in fade-in-50 zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#E2E8F0] flex items-center justify-between bg-[#F7F9F8]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#006B57] text-white flex items-center justify-center">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#102A27]">
                {editingBook ? 'Edit Naskhah & Bab' : 'Studio Penulisan Buku Digital'}
              </h2>
              <p className="text-xs text-[#64748B]">Tulis naskhah baru atau unggah fail EPUB/TXT</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            {/* Unggah Ebook Button inside Tulis Buku */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleProcessFile}
              accept=".epub,.txt"
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="flex items-center gap-1.5 h-10 px-3.5 text-xs font-semibold text-[#006B57] bg-[#ECFDF5] hover:bg-[#D1FAE5] border border-[#A7F3D0] rounded-[12px] cursor-pointer transition-colors shadow-2xs"
              title="Unggah fail EPUB atau TXT sedia ada untuk dimasukkan ke editor"
            >
              <Upload className="w-3.5 h-3.5 text-[#006B57]" />
              <span>{isUploading ? 'Memproses fail...' : uploadSuccess ? 'Berjaya Diunggah!' : 'Unggah Fail Ebook'}</span>
            </button>

            <button
              onClick={handleSave}
              className="flex items-center gap-1.5 h-10 px-4 text-xs font-semibold text-white bg-[#006B57] hover:bg-[#063F35] rounded-[12px] cursor-pointer transition-colors shadow-xs"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Simpan Naskhah</span>
            </button>

            <button
              onClick={onClose}
              className="w-9 h-9 flex items-center justify-center text-slate-400 hover:text-slate-700 rounded-[10px] hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Error notification banner */}
        {errorMsg && (
          <div className="px-6 py-2.5 bg-rose-50 border-b border-rose-200 text-rose-800 text-xs font-medium flex items-center justify-between">
            <span className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              {errorMsg}
            </span>
            <button onClick={() => setErrorMsg(null)} className="text-rose-500 hover:text-rose-700">
              ✕
            </button>
          </div>
        )}

        {/* Content Layout: 3 Columns (Metadata & Cover, Chapter List, Chapter Content Editor) */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          {/* Col 1: Book Info & Cover (280px) */}
          <div className="w-full md:w-72 border-r border-[#E2E8F0] p-4.5 overflow-y-auto custom-scrollbar bg-slate-50/60 space-y-3.5 text-xs text-[#102A27]">
            <div className="flex justify-center mb-1">
              <BookCover
                title={title || 'Judul Naskhah'}
                author={author || 'Penulis'}
                coverUrl={customCoverUrl}
                coverTheme={{ variant: coverVariant, pattern: 'ornate' }}
                size="sm"
              />
            </div>

            {/* Quick banner for upload inside write */}
            <div
              onClick={() => fileInputRef.current?.click()}
              className="p-2.5 rounded-xl border border-dashed border-[#006B57]/50 bg-emerald-50/60 hover:bg-emerald-50 cursor-pointer text-center transition-colors"
            >
              <Upload className="w-4 h-4 text-[#006B57] mx-auto mb-1" />
              <span className="text-[11px] font-semibold text-[#006B57] block">
                Unggah fail Ebook (.epub, .txt)
              </span>
              <span className="text-[10px] text-[#64748B]">
                Import bab & teks secara automatik
              </span>
            </div>

            {/* Color variants */}
            <div>
              <label className="block text-[11px] font-semibold text-[#64748B] mb-1.5">
                Tema Sampul Buku
              </label>
              <div className="flex items-center gap-2">
                {COVER_VARIANTS.map((v) => (
                  <button
                    key={v}
                    type="button"
                    onClick={() => {
                      setCoverVariant(v);
                      setCustomCoverUrl(undefined);
                    }}
                    className={`w-5 h-5 rounded-full border cursor-pointer transition-transform ${
                      coverVariant === v ? 'ring-2 ring-[#006B57] scale-110' : 'border-slate-300'
                    }`}
                    style={{
                      backgroundColor:
                        v === 'emerald'
                          ? '#006B57'
                          : v === 'navy'
                          ? '#1e3a8a'
                          : v === 'burgundy'
                          ? '#831843'
                          : v === 'noir'
                          ? '#27272a'
                          : v === 'terracotta'
                          ? '#7c2d12'
                          : v === 'amber'
                          ? '#b45309'
                          : '#334155',
                    }}
                  />
                ))}
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-[#64748B] mb-1">
                Judul Karya
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Contoh: Menulis Dengan Pantas"
                className="w-full text-xs px-3.5 py-2.5 bg-white border border-[#CBD5E1] rounded-[12px] focus:outline-none focus:border-[#006B57]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-[#64748B] mb-1">
                Nama Pengarang / Nama Pena
              </label>
              <input
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="Nama Anda"
                className="w-full text-xs px-3.5 py-2.5 bg-white border border-[#CBD5E1] rounded-[12px] focus:outline-none focus:border-[#006B57]"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[11px] font-semibold text-[#64748B] mb-1">
                  Harga Jualan
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold">
                    RM
                  </span>
                  <input
                    type="number"
                    step="0.10"
                    min="0"
                    value={price}
                    onChange={(e) => setPrice(parseFloat(e.target.value) || 0)}
                    className="w-full text-xs pl-9 pr-2.5 py-2.5 bg-white border border-[#CBD5E1] rounded-[12px] focus:outline-none focus:border-[#006B57] font-mono-data font-semibold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#64748B] mb-1">
                  Bab Percuma
                </label>
                <input
                  type="number"
                  min="1"
                  max={chapters.length}
                  value={freeChapterCount}
                  onChange={(e) => setFreeChapterCount(parseInt(e.target.value) || 1)}
                  className="w-full text-xs px-3.5 py-2.5 bg-white border border-[#CBD5E1] rounded-[12px] focus:outline-none focus:border-[#006B57]"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-[#64748B] mb-1">
                Kategori
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as BookCategory)}
                className="w-full text-xs px-3.5 py-2.5 bg-white border border-[#CBD5E1] rounded-[12px] focus:outline-none focus:border-[#006B57]"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-[#64748B] mb-1">
                Sinopsis / Deskripsi
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                placeholder="Ceritakan tentang buku ini..."
                className="w-full text-xs px-3.5 py-2.5 bg-white border border-[#CBD5E1] rounded-[12px] focus:outline-none focus:border-[#006B57] resize-none"
              />
            </div>
          </div>

          {/* Col 2: Chapter Navigation List (240px) */}
          <div className="w-full md:w-60 border-r border-[#E2E8F0] flex flex-col bg-white">
            <div className="p-3 border-b border-[#E2E8F0] flex items-center justify-between bg-slate-50/50">
              <span className="text-xs font-semibold text-[#64748B] uppercase tracking-wider flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-[#006B57]" />
                Daftar Bab ({chapters.length})
              </span>
              <button
                onClick={handleAddChapter}
                className="p-1 rounded-md bg-[#ECFDF5] hover:bg-[#D1FAE5] text-[#006B57] transition-colors cursor-pointer"
                title="Tambah Bab Baru"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-1">
              {chapters.map((chap, idx) => (
                <div
                  key={chap.id}
                  onClick={() => setActiveChapterIndex(idx)}
                  className={`group flex items-center justify-between p-2.5 rounded-[10px] cursor-pointer transition-colors text-xs ${
                    activeChapterIndex === idx
                      ? 'bg-[#ECFDF5] text-[#006B57] font-semibold border border-[#A7F3D0]'
                      : 'hover:bg-slate-50 text-[#102A27]'
                  }`}
                >
                  <div className="truncate flex-1 pr-2">
                    <div className="truncate">{chap.title || `Bab ${idx + 1}`}</div>
                    <span className="text-[10px] text-[#64748B] font-mono-data">
                      {chap.wordCount || 0} perkataan
                    </span>
                  </div>
                  {chapters.length > 1 && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteChapter(idx);
                      }}
                      className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-[#E53935] transition-opacity cursor-pointer"
                      title="Padam Bab"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Col 3: Chapter Content Editor (Flex-1) */}
          <div className="flex-1 flex flex-col bg-white">
            <div className="p-4 border-b border-[#E2E8F0] bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <input
                type="text"
                value={currentChapter.title}
                onChange={(e) => handleUpdateChapter('title', e.target.value)}
                placeholder="Tajuk Bab..."
                className="text-base font-bold text-[#102A27] bg-transparent border-b border-transparent hover:border-slate-300 focus:border-[#006B57] focus:outline-none px-1 py-0.5 flex-1"
              />
              <div className="text-xs text-[#64748B] font-mono-data shrink-0 flex items-center gap-2">
                <span>{currentChapter.wordCount || 0} perkataan</span>
                <span>•</span>
                <span>Bab {activeChapterIndex + 1} daripada {chapters.length}</span>
              </div>
            </div>

            <div className="flex-1 p-6 overflow-y-auto custom-scrollbar">
              <textarea
                value={currentChapter.content}
                onChange={(e) => handleUpdateChapter('content', e.target.value)}
                placeholder="Tulis atau tampal kandungan bab anda di sini..."
                className="w-full h-full min-h-[360px] text-sm leading-relaxed text-[#102A27] font-sans focus:outline-none resize-none placeholder:text-slate-400"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
