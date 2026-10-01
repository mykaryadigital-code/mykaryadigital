import React, { useState, useRef } from 'react';
import { X, Upload, FileText, CheckCircle2, AlertCircle, Image as ImageIcon } from 'lucide-react';
import { Book, BookCategory, CoverTheme } from '../types/book';
import { parseEpubFile, parseTextFile } from '../services/epubParser';
import { BookCover } from './BookCover';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBookImported: (book: Book) => void;
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
  'navy',
  'burgundy',
  'emerald',
  'noir',
  'terracotta',
  'amber',
  'slate',
];

export const UploadModal: React.FC<UploadModalProps> = ({
  isOpen,
  onClose,
  onBookImported,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Parsed book state before saving
  const [parsedData, setParsedData] = useState<Omit<Book, 'id' | 'dateAdded'> | null>(null);
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<BookCategory>('Novel Sastra');
  const [price, setPrice] = useState<number>(29.0);
  const [currency, setCurrency] = useState<'RM' | 'Rp' | 'USD'>('RM');
  const [sku, setSku] = useState<string>('');
  const [coverVariant, setCoverVariant] = useState<CoverTheme['variant']>('navy');
  const [customCoverUrl, setCustomCoverUrl] = useState<string | undefined>(undefined);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleProcessFile = async (file: File) => {
    setIsLoading(true);
    setError(null);
    try {
      let result: Omit<Book, 'id' | 'dateAdded'>;
      const lower = file.name.toLowerCase();

      if (lower.endsWith('.epub')) {
        result = await parseEpubFile(file);
      } else if (lower.endsWith('.txt') || lower.endsWith('.md')) {
        result = await parseTextFile(file);
      } else {
        throw new Error('Format berkas tidak didukung. Harap pilih berkas .epub, .txt, atau .md');
      }

      setParsedData(result);
      setTitle(result.title);
      setAuthor(result.author);
      setDescription(result.description);
      setCategory(result.category);
      setCoverVariant(result.coverTheme.variant);
      setCustomCoverUrl(result.coverUrl);
    } catch (err: any) {
      setError(err?.message || 'Terjadi kesalahan saat memproses berkas digital.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleProcessFile(e.dataTransfer.files[0]);
    }
  };

  const handleCoverUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        setCustomCoverUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveToLibrary = () => {
    if (!parsedData) return;

    const newBook: Book = {
      ...parsedData,
      id: `buku-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      title: title.trim() || 'Tanpa Judul',
      author: author.trim() || 'Penulis Anonim',
      description: description.trim(),
      category,
      price: Number(price) || 0,
      currency,
      sku: sku.trim() || `MYK-${Date.now().toString().slice(-6)}`,
      salesCount: 0,
      coverUrl: customCoverUrl,
      coverTheme: {
        variant: coverVariant,
        pattern: parsedData.coverTheme.pattern || 'classic_border',
      },
      dateAdded: new Date().toISOString(),
    };

    onBookImported(newBook);
    resetAndClose();
  };

  const resetAndClose = () => {
    setParsedData(null);
    setError(null);
    setIsLoading(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs">
      <div className="bg-white border border-stone-200 rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in-50 zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-stone-200 flex items-center justify-between bg-stone-50">
          <div>
            <h2 className="text-lg font-serif-book font-semibold text-stone-900">
              Unggah Ebook atau Novel Digital
            </h2>
            <p className="text-xs text-stone-500 font-sans-ui mt-0.5">
              Mendukung format EPUB, TXT, dan Markdown dengan ekstraksi bab otomatis.
            </p>
          </div>
          <button
            onClick={resetAndClose}
            className="p-1 text-stone-400 hover:text-stone-700 rounded-md transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 overflow-y-auto flex-1 custom-scrollbar">
          {error && (
            <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-lg flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
              <div>{error}</div>
            </div>
          )}

          {!parsedData ? (
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-all ${
                isDragging
                  ? 'border-amber-700 bg-amber-50/50'
                  : 'border-stone-300 hover:border-stone-400 hover:bg-stone-50'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".epub,.txt,.md"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    handleProcessFile(e.target.files[0]);
                  }
                }}
              />

              <div className="w-14 h-14 mx-auto rounded-full bg-stone-100 flex items-center justify-center text-stone-600 mb-4">
                {isLoading ? (
                  <div className="w-6 h-6 border-2 border-amber-900 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Upload className="w-7 h-7 text-amber-900" />
                )}
              </div>

              <h3 className="text-sm font-semibold text-stone-900 mb-1">
                {isLoading ? 'Sedang mengekstrak berkas...' : 'Klik atau seret berkas ebook ke sini'}
              </h3>
              <p className="text-xs text-stone-500 mb-3">
                EPUB (.epub), Dokumen Teks (.txt), atau Catatan Markdown (.md)
              </p>
              <div className="inline-block text-[11px] text-stone-400 font-mono-data">
                Teks & bab akan disimpan secara aman dan persisten di peramban Anda.
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-lg flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <div>
                  Berkas berhasil diurai: <strong className="font-semibold">{parsedData.chapters.length} bab</strong> terdeteksi, total <strong className="font-semibold">{parsedData.totalWords.toLocaleString('id-ID')} kata</strong>.
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-5 items-start">
                {/* Cover Preview & Customizer */}
                <div className="shrink-0 flex flex-col items-center">
                  <BookCover
                    title={title}
                    author={author}
                    coverUrl={customCoverUrl}
                    coverTheme={{ variant: coverVariant, pattern: 'classic_border' }}
                    size="md"
                  />

                  <div className="mt-3 flex flex-col gap-2 w-40">
                    <button
                      type="button"
                      onClick={() => coverInputRef.current?.click()}
                      className="text-xs text-stone-600 hover:text-stone-900 border border-stone-200 hover:bg-stone-50 py-1 px-2 rounded-md flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <ImageIcon className="w-3.5 h-3.5" />
                      <span>{customCoverUrl ? 'Ubah Gambar' : 'Unggah Cover'}</span>
                    </button>
                    <input
                      ref={coverInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleCoverUpload}
                    />

                    {/* Color palette selector for book cloth */}
                    {!customCoverUrl && (
                      <div className="flex items-center justify-center gap-1.5 pt-1">
                        {COVER_VARIANTS.map((v) => (
                          <button
                            key={v}
                            type="button"
                            onClick={() => setCoverVariant(v)}
                            className={`w-4 h-4 rounded-full border cursor-pointer transition-transform ${
                              coverVariant === v ? 'scale-125 border-stone-800 ring-2 ring-amber-400' : 'border-stone-300'
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
                    )}
                  </div>
                </div>

                {/* Edit Form */}
                <div className="flex-1 space-y-3 w-full">
                  <div>
                    <label className="block text-xs font-medium text-stone-700 mb-1">
                      Judul Buku / Novel
                    </label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full text-sm px-3 py-2 bg-stone-50 border border-stone-200 rounded-md focus:outline-none focus:border-amber-800"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-stone-700 mb-1">
                      Nama Penulis / Pengarang
                    </label>
                    <input
                      type="text"
                      value={author}
                      onChange={(e) => setAuthor(e.target.value)}
                      className="w-full text-sm px-3 py-2 bg-stone-50 border border-stone-200 rounded-md focus:outline-none focus:border-amber-800"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-stone-700 mb-1">
                      Kategori & Genre
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value as BookCategory)}
                      className="w-full text-sm px-3 py-2 bg-stone-50 border border-stone-200 rounded-md focus:outline-none focus:border-amber-800"
                    >
                      {CATEGORIES.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Price & Currency inputs for Paid Digital Product */}
                  <div className="grid grid-cols-2 gap-3 p-3 bg-amber-50/50 border border-amber-200/70 rounded-md">
                    <div>
                      <label className="block text-xs font-medium text-amber-950 mb-1">
                        Harga Produk Digital
                      </label>
                      <input
                        type="number"
                        min="0"
                        step="0.1"
                        value={price}
                        onChange={(e) => setPrice(parseFloat(e.target.value) || 0)}
                        placeholder="Contoh: 29.00"
                        className="w-full text-sm font-mono-data px-3 py-2 bg-white border border-stone-300 rounded-md focus:outline-none focus:border-amber-800"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-amber-950 mb-1">
                        Mata Uang
                      </label>
                      <select
                        value={currency}
                        onChange={(e) => setCurrency(e.target.value as any)}
                        className="w-full text-sm px-3 py-2 bg-white border border-stone-300 rounded-md focus:outline-none focus:border-amber-800"
                      >
                        <option value="RM">RM (Ringgit Malaysia)</option>
                        <option value="Rp">Rp (Rupiah Indonesia)</option>
                        <option value="USD">USD ($)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-stone-700 mb-1">
                      Sinopsis Singkat
                    </label>
                    <textarea
                      rows={3}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="w-full text-sm px-3 py-2 bg-stone-50 border border-stone-200 rounded-md focus:outline-none focus:border-amber-800 resize-none"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="px-6 py-3.5 border-t border-stone-200 bg-stone-50 flex items-center justify-between">
          <button
            type="button"
            onClick={resetAndClose}
            className="px-4 py-2 text-xs font-medium text-stone-600 hover:text-stone-900 cursor-pointer"
          >
            Batal
          </button>

          {parsedData && (
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setParsedData(null)}
                className="px-3 py-2 text-xs font-medium text-stone-700 bg-stone-200 hover:bg-stone-300 rounded-md cursor-pointer"
              >
                Pilih Berkas Lain
              </button>
              <button
                type="button"
                onClick={handleSaveToLibrary}
                className="px-4 py-2 text-xs font-medium text-white bg-amber-900 hover:bg-amber-800 rounded-md cursor-pointer transition-colors shadow-xs"
              >
                Simpan ke Pustaka
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
