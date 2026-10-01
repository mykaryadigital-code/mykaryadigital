import React, { useState, useEffect, useMemo } from 'react';
import {
  getAllBooks,
  saveBook,
  deleteBook,
  getShelves,
} from './services/storage';
import { Book, CustomShelf, BookCategory } from './types/book';
import { TopBar } from './components/TopBar';
import { BookCard } from './components/BookCard';
import { ReaderView } from './components/ReaderView';
import { UploadModal } from './components/UploadModal';
import { NovelWriterModal } from './components/NovelWriterModal';
import { BookDetailModal } from './components/BookDetailModal';
import { ShelvesModal } from './components/ShelvesModal';
import { BackupModal } from './components/BackupModal';
import { MarketplaceProvider } from './context/MarketplaceContext';
import { AuthorRegistrationModal } from './components/AuthorRegistrationModal';
import { AuthorDashboardModal } from './components/AuthorDashboardModal';
import { AdminDashboardModal } from './components/AdminDashboardModal';
import { AuthorGuidePage } from './components/AuthorGuidePage';
import {
  Search,
  LayoutGrid,
  List as ListIcon,
  Plus,
  Upload,
  BookOpen,
  FileText,
  Compass,
  Feather,
  BookMarked,
  FolderHeart,
  UtensilsCrossed,
} from 'lucide-react';

const CATEGORIES_WITH_ICONS: { label: string; value: string; icon: any }[] = [
  { label: 'Panduan', value: 'Semua', icon: BookOpen },
  { label: 'Resepi', value: 'Resepi', icon: UtensilsCrossed },
  { label: 'Novel', value: 'Novel Sastra', icon: FileText },
  { label: 'Fantasi dan Pertualangan', value: 'Fantasi & Petualangan', icon: Compass },
  { label: 'Puisi dan Sastra', value: 'Puisi & Sastra Klasik', icon: Feather },
  { label: 'Misteri & Detektif', value: 'Misteri & Detektif', icon: Compass },
  { label: 'Non-Fiksi & Esai', value: 'Non-Fiksi & Esai', icon: FileText },
  { label: 'Romansa', value: 'Romansa', icon: Feather },
];

function MainAppContent() {
  const [books, setBooks] = useState<Book[]>([]);
  const [shelves, setShelves] = useState<CustomShelf[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Nav Tab state
  const [currentTab, setCurrentTab] = useState<'all' | 'reading' | 'shelves' | 'backup' | 'author_guide'>('reading');

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
  const [statusFilter, setStatusFilter] = useState<'all' | 'reading' | 'completed' | 'favorite'>('all');
  const [activeShelfFilter, setActiveShelfFilter] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Active Modals & Reader
  const [activeReaderBook, setActiveReaderBook] = useState<Book | null>(null);
  const [readerInitialChapter, setReaderInitialChapter] = useState(0);
  const [activeDetailBook, setActiveDetailBook] = useState<Book | null>(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isWriterModalOpen, setIsWriterModalOpen] = useState(false);
  const [editingBookForWriter, setEditingBookForWriter] = useState<Book | null>(null);
  const [isBackupModalOpen, setIsBackupModalOpen] = useState(false);
  const [isShelvesModalOpen, setIsShelvesModalOpen] = useState(false);
  const [isAuthorRegOpen, setIsAuthorRegOpen] = useState(false);
  const [isAuthorDashboardOpen, setIsAuthorDashboardOpen] = useState(false);
  const [isAdminDashboardOpen, setIsAdminDashboardOpen] = useState(false);

  // Load initial data
  const loadData = async () => {
    try {
      setIsLoading(true);
      const [fetchedBooks, fetchedShelves] = await Promise.all([getAllBooks(), getShelves()]);
      setBooks(fetchedBooks);
      setShelves(fetchedShelves);
    } catch (e) {
      console.error('Error loading library data:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Filtered books calculation
  const filteredBooks = useMemo(() => {
    return books.filter((book) => {
      // Search query (title, author, description, tags, sku)
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = book.title.toLowerCase().includes(query);
        const matchesAuthor = book.author.toLowerCase().includes(query);
        const matchesDesc = book.description.toLowerCase().includes(query);
        const matchesSku = book.sku?.toLowerCase().includes(query);
        const matchesTag = book.tags?.some((t) => t.toLowerCase().includes(query));
        if (!matchesTitle && !matchesAuthor && !matchesDesc && !matchesSku && !matchesTag) {
          return false;
        }
      }

      // Tab constraint
      if (currentTab === 'reading' && book.status !== 'reading' && statusFilter === 'all') {
        // Show reading books when tab is reading
        return true;
      }

      // Shelf filter
      if (activeShelfFilter && book.shelf !== activeShelfFilter) {
        return false;
      }

      // Category filter
      if (selectedCategory !== 'Semua' && book.category !== selectedCategory) {
        return false;
      }

      // Status filter
      if (statusFilter === 'reading' && book.status !== 'reading') return false;
      if (statusFilter === 'completed' && book.status !== 'completed') return false;
      if (statusFilter === 'favorite' && !book.isFavorite) return false;

      return true;
    });
  }, [books, searchQuery, currentTab, activeShelfFilter, selectedCategory, statusFilter]);

  // Handlers
  const handleOpenReader = (book: Book, chapterIndex = 0) => {
    setActiveReaderBook(book);
    setReaderInitialChapter(chapterIndex);
  };

  const handleToggleFavorite = async (bookId: string, current: boolean) => {
    const target = books.find((b) => b.id === bookId);
    if (!target) return;
    const updated = { ...target, isFavorite: !current };
    await saveBook(updated);
    setBooks((prev) => prev.map((b) => (b.id === bookId ? updated : b)));
    if (activeDetailBook?.id === bookId) setActiveDetailBook(updated);
  };

  const handleUpdateStatus = async (bookId: string, status: Book['status']) => {
    const target = books.find((b) => b.id === bookId);
    if (!target) return;
    const updated: Book = {
      ...target,
      status,
      currentProgress: status === 'completed' ? 100 : target.currentProgress,
    };
    await saveBook(updated);
    setBooks((prev) => prev.map((b) => (b.id === bookId ? updated : b)));
    if (activeDetailBook?.id === bookId) setActiveDetailBook(updated);
  };

  const handleDeleteBook = async (bookId: string) => {
    await deleteBook(bookId);
    setBooks((prev) => prev.filter((b) => b.id !== bookId));
    if (activeDetailBook?.id === bookId) setActiveDetailBook(null);
  };

  const handleUpdateRating = async (bookId: string, rating: number) => {
    const target = books.find((b) => b.id === bookId);
    if (!target) return;
    const updated = { ...target, rating };
    await saveBook(updated);
    setBooks((prev) => prev.map((b) => (b.id === bookId ? updated : b)));
    if (activeDetailBook?.id === bookId) setActiveDetailBook(updated);
  };

  const handleSaveBook = async (book: Book) => {
    await saveBook(book);
    await loadData();
  };

  const handleSelectTab = (tab: 'all' | 'reading' | 'shelves' | 'backup' | 'author_guide') => {
    setCurrentTab(tab);
    if (tab === 'shelves') {
      setIsShelvesModalOpen(true);
    } else if (tab === 'backup') {
      setIsBackupModalOpen(true);
    } else if (tab === 'reading') {
      setStatusFilter('all');
    } else if (tab === 'author_guide') {
      // Show author guide page
    } else {
      setStatusFilter('all');
      setActiveShelfFilter(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 flex flex-col font-sans antialiased">
      {/* Top Bar matching reference */}
      <TopBar
        currentTab={currentTab}
        onSelectTab={handleSelectTab}
        onOpenUpload={() => setIsUploadModalOpen(true)}
        onOpenWriter={() => {
          setEditingBookForWriter(null);
          setIsWriterModalOpen(true);
        }}
        onOpenAuthorPortal={() => setIsAuthorDashboardOpen(true)}
        onOpenAdminPortal={() => setIsAdminDashboardOpen(true)}
        onOpenAuthorRegistration={() => setIsAuthorRegOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
        {currentTab === 'author_guide' ? (
          <AuthorGuidePage
            onOpenWriter={() => {
              setEditingBookForWriter(null);
              setIsWriterModalOpen(true);
            }}
            onOpenAuthorDashboard={() => setIsAuthorDashboardOpen(true)}
            onReadGuideBook={() => {
              const guideBook =
                books.find((b) => b.id === 'buku-panduan-penulis-pantas') ||
                books.find((b) => b.title.includes('Panduan Menulis')) ||
                books[0];
              if (guideBook) {
                handleOpenReader(guideBook, 0);
              }
            }}
          />
        ) : (
          <>
            {/* Unified Search, Category Pills, and Status Segmented Controls (Exact matching the reference toolbar) */}
            <section className="bg-white border border-slate-200/90 rounded-2xl p-3 sm:p-3.5 shadow-xs flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
          {/* 1. Left: Search Input Box */}
          <div className="relative flex-1 min-w-[260px] max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari berdasarkan judul, penulis, sinopsis, atau kod SKU..."
              className="w-full text-xs sm:text-sm pl-10 pr-4 py-2 bg-slate-50/70 hover:bg-slate-50 focus:bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-red-600 transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs p-1"
              >
                ✕
              </button>
            )}
          </div>

          {/* 2. Middle: Category Navigation Pills with Icons */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0 custom-scrollbar shrink-0">
            {CATEGORIES_WITH_ICONS.map((cat) => {
              const Icon = cat.icon;
              const isSelected = selectedCategory === cat.value;

              return (
                <button
                  key={cat.label}
                  onClick={() => setSelectedCategory(cat.value)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap cursor-pointer transition-all flex items-center gap-1.5 border ${
                    isSelected
                      ? 'bg-slate-900 text-white border-slate-900 shadow-2xs'
                      : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200/80 hover:border-slate-300'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : 'text-slate-500'}`} />
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>

          {/* 3. Right: Status Segmented Controls & View Switcher */}
          <div className="flex items-center gap-2 self-end lg:self-auto shrink-0">
            <div className="flex items-center gap-1 bg-slate-100/90 p-1 rounded-xl text-xs">
              <button
                onClick={() => setStatusFilter('all')}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer whitespace-nowrap ${
                  statusFilter === 'all'
                    ? 'bg-[#d91424] text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Semua ({books.length})
              </button>

              <button
                onClick={() => setStatusFilter('reading')}
                className={`px-2.5 py-1.5 rounded-lg font-semibold transition-all cursor-pointer whitespace-nowrap ${
                  statusFilter === 'reading'
                    ? 'bg-[#d91424] text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Sedang Dibaca
              </button>

              <button
                onClick={() => setStatusFilter('completed')}
                className={`px-2.5 py-1.5 rounded-lg font-semibold transition-all cursor-pointer whitespace-nowrap ${
                  statusFilter === 'completed'
                    ? 'bg-[#d91424] text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Selesai
              </button>

              <button
                onClick={() => setStatusFilter('favorite')}
                className={`px-2.5 py-1.5 rounded-lg font-semibold transition-all cursor-pointer whitespace-nowrap ${
                  statusFilter === 'favorite'
                    ? 'bg-[#d91424] text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Favorit
              </button>
            </div>

            {/* View Mode Toggle Icons */}
            <div className="flex items-center gap-1 pl-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                  viewMode === 'grid' ? 'text-[#d91424]' : 'text-slate-400 hover:text-slate-700'
                }`}
                title="Tampilan Grid Kad"
              >
                <LayoutGrid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                  viewMode === 'list' ? 'text-[#d91424]' : 'text-slate-400 hover:text-slate-700'
                }`}
                title="Tampilan Senarai"
              >
                <ListIcon className="w-5 h-5" />
              </button>
            </div>
          </div>
        </section>

        {/* Active Shelf banner if filtered */}
        {activeShelfFilter && (
          <div className="flex items-center justify-between p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900">
            <div className="flex items-center gap-2">
              <FolderHeart className="w-4 h-4 text-amber-800" />
              <span>
                Menampilkan rak: <strong>{activeShelfFilter}</strong>
              </span>
            </div>
            <button
              onClick={() => setActiveShelfFilter(null)}
              className="text-xs font-semibold hover:underline cursor-pointer"
            >
              Hapus filter rak
            </button>
          </div>
        )}

        {/* Books Display */}
        {isLoading ? (
          <div className="py-24 text-center text-xs text-slate-500">
            <div className="w-8 h-8 mx-auto border-3 border-red-600 border-t-transparent rounded-full animate-spin mb-3" />
            <span>Memuat perpustakaan produk digital...</span>
          </div>
        ) : filteredBooks.length === 0 ? (
          <div className="py-20 text-center border-2 border-dashed border-slate-200 rounded-2xl bg-white p-8">
            <BookMarked className="w-12 h-12 mx-auto text-slate-300 mb-3" />
            <h3 className="text-base font-bold text-slate-800 mb-1">
              Tiada Buku Ditemui
            </h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto mb-4">
              Tiada produk yang sepadan dengan carian atau penapis kategori semasa.
            </p>
            <div className="flex justify-center gap-3">
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('Semua');
                  setStatusFilter('all');
                  setActiveShelfFilter(null);
                }}
                className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl cursor-pointer"
              >
                Reset Penapis
              </button>
              <button
                onClick={() => setIsUploadModalOpen(true)}
                className="px-4 py-2 text-xs font-semibold text-white bg-[#d91424] hover:bg-red-700 rounded-xl cursor-pointer shadow-xs"
              >
                Unggah Ebook Baru
              </button>
            </div>
          </div>
        ) : viewMode === 'grid' ? (
          /* 2-Column Card Grid exactly matching reference image */
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredBooks.map((book) => (
              <BookCard
                key={book.id}
                book={book}
                onOpenReader={(b) => handleOpenReader(b, b.currentChapterIndex || 0)}
                onOpenDetail={(b) => setActiveDetailBook(b)}
                onToggleFavorite={handleToggleFavorite}
                onDeleteBook={handleDeleteBook}
                onUpdateStatus={handleUpdateStatus}
              />
            ))}
          </div>
        ) : (
          /* List / Table Catalog View with Price column */
          <div className="bg-white border border-slate-200/90 rounded-2xl overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-50 border-b border-slate-200 uppercase font-mono text-[11px] text-slate-500">
                  <tr>
                    <th className="py-3.5 px-5">Judul & Pengarang</th>
                    <th className="py-3.5 px-4">Kategori</th>
                    <th className="py-3.5 px-4">Harga Ebook</th>
                    <th className="py-3.5 px-4">Jumlah Kata</th>
                    <th className="py-3.5 px-4">Kemajuan</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-5 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredBooks.map((book) => (
                    <tr key={book.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-5">
                        <div
                          onClick={() => handleOpenReader(book, book.currentChapterIndex || 0)}
                          className="font-bold text-slate-900 hover:text-red-600 cursor-pointer text-sm"
                        >
                          {book.title}
                        </div>
                        <div className="text-slate-500 text-xs">
                          {book.author} {book.sku ? `· ${book.sku}` : ''}
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-slate-600 font-medium">{book.category}</td>
                      <td className="py-3.5 px-4 font-mono font-bold text-[#d91424] text-sm">
                        {book.currency || 'RM'}{' '}
                        {book.price !== undefined
                          ? book.currency === 'Rp'
                            ? book.price.toLocaleString('id-ID')
                            : book.price.toFixed(2)
                          : '0.00'}
                      </td>
                      <td className="py-3.5 px-4 font-mono text-slate-500">
                        {book.totalWords.toLocaleString('id-ID')} kata
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <div className="w-20 h-2 bg-slate-100 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-[#047857] rounded-full"
                              style={{ width: `${book.currentProgress}%` }}
                            />
                          </div>
                          <span className="font-mono text-xs font-semibold">{book.currentProgress}%</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="text-xs font-semibold text-slate-700">
                          {book.status === 'reading'
                            ? 'Sedang Dibaca'
                            : book.status === 'completed'
                            ? 'Selesai'
                            : 'Ingin Dibaca'}
                        </span>
                      </td>
                      <td className="py-3.5 px-5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleOpenReader(book, book.currentChapterIndex || 0)}
                            className="px-3 py-1.5 text-xs font-semibold text-white bg-[#d91424] hover:bg-red-700 rounded-lg cursor-pointer transition-colors shadow-2xs"
                          >
                            Baca
                          </button>
                          <button
                            onClick={() => setActiveDetailBook(book)}
                            className="px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg cursor-pointer transition-colors"
                          >
                            Rincian
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
          </>
        )}
      </main>

      {/* Reader View Overlay (Fullscreen Reading Room) */}
      {activeReaderBook && (
        <ReaderView
          book={activeReaderBook}
          initialChapterIndex={readerInitialChapter}
          onBackToLibrary={() => {
            setActiveReaderBook(null);
            loadData();
          }}
          onBookUpdated={(updated) => {
            setBooks((prev) => prev.map((b) => (b.id === updated.id ? updated : b)));
          }}
        />
      )}

      {/* Upload Ebook Modal */}
      <UploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onBookImported={async (newBook) => {
          await saveBook(newBook);
          await loadData();
          handleOpenReader(newBook, 0);
        }}
      />

      {/* Novel Writer Studio Modal */}
      <NovelWriterModal
        isOpen={isWriterModalOpen}
        editingBook={editingBookForWriter}
        onClose={() => {
          setIsWriterModalOpen(false);
          setEditingBookForWriter(null);
        }}
        onSaveBook={async (savedBook) => {
          await handleSaveBook(savedBook);
        }}
      />

      {/* Book Detail Modal */}
      <BookDetailModal
        book={activeDetailBook}
        isOpen={!!activeDetailBook}
        onClose={() => setActiveDetailBook(null)}
        onOpenReader={(b, chIdx) => handleOpenReader(b, chIdx || 0)}
        onEditBook={(b) => {
          setEditingBookForWriter(b);
          setIsWriterModalOpen(true);
        }}
        onDeleteBook={handleDeleteBook}
        onUpdateRating={handleUpdateRating}
      />

      {/* Custom Shelves Modal */}
      <ShelvesModal
        isOpen={isShelvesModalOpen}
        onClose={() => setIsShelvesModalOpen(false)}
        shelves={shelves}
        books={books}
        onShelvesUpdated={loadData}
        onSelectShelfFilter={(shelfName) => setActiveShelfFilter(shelfName)}
        activeShelfFilter={activeShelfFilter}
      />

      {/* Backup & Restore Modal */}
      <BackupModal
        isOpen={isBackupModalOpen}
        onClose={() => setIsBackupModalOpen(false)}
        onDataRestored={loadData}
      />

      {/* Author Registration Modal (RM20 Year 1 / RM10 Renewal) */}
      <AuthorRegistrationModal
        isOpen={isAuthorRegOpen}
        onClose={() => setIsAuthorRegOpen(false)}
        onSuccess={() => {
          setIsAuthorRegOpen(false);
          setIsAuthorDashboardOpen(true);
        }}
      />

      {/* Author Dashboard Modal (95% Royalty, Balance & Withdrawal) */}
      <AuthorDashboardModal
        isOpen={isAuthorDashboardOpen}
        onClose={() => setIsAuthorDashboardOpen(false)}
        onOpenWriter={() => {
          setEditingBookForWriter(null);
          setIsWriterModalOpen(true);
        }}
      />

      {/* Admin Commission Dashboard Modal (5% Commission Ledger) */}
      <AdminDashboardModal
        isOpen={isAdminDashboardOpen}
        onClose={() => setIsAdminDashboardOpen(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <MarketplaceProvider>
      <MainAppContent />
    </MarketplaceProvider>
  );
}
