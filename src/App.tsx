import React, { useState, useEffect, useMemo } from 'react';
import {
  getAllBooks,
  saveBook,
  deleteBook,
  getShelves,
} from './services/storage';
import { Book, CustomShelf } from './types/book';
import { TopBar } from './components/TopBar';
import { Sidebar } from './components/Sidebar';
import { BookCard } from './components/BookCard';
import { ReaderView } from './components/ReaderView';
import { NovelWriterModal } from './components/NovelWriterModal';
import { BookDetailModal } from './components/BookDetailModal';
import { ShelvesModal } from './components/ShelvesModal';
import { BackupModal } from './components/BackupModal';
import { MarketplaceProvider } from './context/MarketplaceContext';
import { AuthorRegistrationModal } from './components/AuthorRegistrationModal';
import { AuthorDashboardModal } from './components/AuthorDashboardModal';
import { AdminDashboardModal } from './components/AdminDashboardModal';
import { AuthorGuidePage } from './components/AuthorGuidePage';
import { BookCardSkeleton } from './components/BookCardSkeleton';
import { EmptyLibraryState } from './components/EmptyLibraryState';
import {
  BookOpen,
  FolderHeart,
  Filter,
} from 'lucide-react';

function MainAppContent() {
  const [books, setBooks] = useState<Book[]>([]);
  const [shelves, setShelves] = useState<CustomShelf[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Sidebar Open State (default open on desktop)
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Nav Tab state
  const [currentTab, setCurrentTab] = useState<'all' | 'reading' | 'shelves' | 'backup' | 'author_guide'>('reading');

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
  const [statusFilter, setStatusFilter] = useState<'all' | 'reading' | 'completed' | 'favorite'>('all');
  const [activeShelfFilter, setActiveShelfFilter] = useState<string | null>(null);

  // Active Modals & Reader
  const [activeReaderBook, setActiveReaderBook] = useState<Book | null>(null);
  const [readerInitialChapter, setReaderInitialChapter] = useState(0);
  const [activeDetailBook, setActiveDetailBook] = useState<Book | null>(null);
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

  // Category counts calculation for Sidebar
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { Semua: books.length };
    books.forEach((b) => {
      counts[b.category] = (counts[b.category] || 0) + 1;
      // Also map friendly Malaysian category labels
      if (b.category.includes('Novel')) {
        counts['Novel'] = (counts['Novel'] || 0) + 1;
        counts['Novel Sastra'] = counts['Novel'];
      }
      if (b.category.includes('Fantasi')) {
        counts['Fantasi & Pertualangan'] = (counts['Fantasi & Pertualangan'] || 0) + 1;
        counts['Fantasi & Petualangan'] = counts['Fantasi & Pertualangan'];
      }
      if (b.category.includes('Non-Fiksyen') || b.category.includes('Non-Fiksi')) {
        counts['Non-Fiksyen & Esai'] = (counts['Non-Fiksyen & Esai'] || 0) + 1;
        counts['Non-Fiksi & Esai'] = counts['Non-Fiksyen & Esai'];
      }
      if (b.category.includes('Puisi') || b.category.includes('Sastra')) {
        counts['Puisi & Sastera'] = (counts['Puisi & Sastera'] || 0) + 1;
        counts['Puisi & Sastra Klasik'] = counts['Puisi & Sastera'];
      }
    });
    return counts;
  }, [books]);

  // Reading books count
  const readingBooksCount = useMemo(() => {
    return books.filter((b) => b.status === 'reading').length;
  }, [books]);

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
        return true;
      }

      // Shelf filter
      if (activeShelfFilter && book.shelf !== activeShelfFilter) {
        return false;
      }

      // Category filter (resilient matching for Malaysian labels)
      if (selectedCategory !== 'Semua') {
        const isMatch =
          book.category === selectedCategory ||
          (selectedCategory === 'Novel' && book.category.includes('Novel')) ||
          (selectedCategory === 'Novel Sastra' && book.category.includes('Novel')) ||
          (selectedCategory.includes('Fantasi') && book.category.includes('Fantasi')) ||
          (selectedCategory.includes('Non-Fik') && (book.category.includes('Non-Fiksyen') || book.category.includes('Non-Fiksi'))) ||
          (selectedCategory.includes('Puisi') && (book.category.includes('Puisi') || book.category.includes('Sastra')));

        if (!isMatch) return false;
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
      // Author Guide view
    } else {
      setStatusFilter('all');
      setActiveShelfFilter(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F9F8] text-[#102A27] flex flex-col font-sans antialiased">
      {/* Streamlined Top Bar (Clean 3-zone, no button congestion) */}
      <TopBar
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onOpenWriter={() => {
          setEditingBookForWriter(null);
          setIsWriterModalOpen(true);
        }}
        onOpenAuthorPortal={() => setIsAuthorDashboardOpen(true)}
        onOpenAuthorRegistration={() => setIsAuthorRegOpen(true)}
        onOpenProfile={() => handleSelectTab('author_guide')}
      />

      {/* Main App Layout: Sidebar on Left + Content Area on Right */}
      <div className="flex-1 max-w-[1400px] w-full mx-auto flex items-start">
        {/* Sidebar housing Menu Utama, Kategori Buku, Royalti, Admin, and Tulis Buku */}
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          currentTab={currentTab}
          onSelectTab={handleSelectTab}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          categoryCounts={categoryCounts}
          totalBooksCount={books.length}
          readingBooksCount={readingBooksCount}
          onOpenWriter={() => {
            setEditingBookForWriter(null);
            setIsWriterModalOpen(true);
          }}
          onOpenAuthorPortal={() => setIsAuthorDashboardOpen(true)}
          onOpenAdminPortal={() => setIsAdminDashboardOpen(true)}
        />

        {/* Main Content Area */}
        <main className="flex-1 min-w-0 px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
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
              {/* Hero Section: Sedang Dibaca (Height ~160px, soft green tint, subtle visual) */}
              <section className="w-full min-h-[160px] bg-gradient-to-br from-[#F0FDF4]/90 via-[#F7FDF9] to-[#ECFDF5]/80 border border-[#E2E8F0] rounded-[18px] p-6 sm:p-7 flex flex-col md:flex-row items-start md:items-center justify-between gap-5 shadow-[0_4px_20px_rgba(15,23,42,0.03)] relative overflow-hidden">
                {/* Decorative Subtle Bookshelf / Editorial SVG Watermark */}
                <svg
                  className="absolute right-0 bottom-0 top-0 h-full w-auto text-[#006B57] opacity-[0.045] pointer-events-none select-none"
                  viewBox="0 0 400 160"
                  fill="none"
                  preserveAspectRatio="xMaxYMid meet"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M20 140H380" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
                  <path d="M50 40V140M60 30V140M75 50V140M85 35V140M105 25V140M115 45V140M135 30V140M150 40V140M165 20V140M180 50V140M200 35V140M215 30V140M230 45V140M250 20V140M265 40V140M285 35V140M300 25V140M320 45V140M335 30V140M350 40V140" stroke="currentColor" strokeWidth="10" strokeLinecap="round" opacity="0.7" />
                </svg>

                {/* Left Column: Icon + Title + Subtitle */}
                <div className="flex items-center gap-4 relative z-10">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-[#006B57] text-white flex items-center justify-center shrink-0 shadow-xs">
                    <BookOpen className="w-6 h-6 sm:w-7 sm:h-7 text-emerald-100" />
                  </div>
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#006B57]">
                      Perpustakaan Digital
                    </span>
                    <h1 className="text-2xl sm:text-[28px] font-bold text-[#102A27] tracking-tight leading-snug">
                      {currentTab === 'reading' ? 'SEDANG DIBACA' : 'KOLEKSI BUKU'}
                    </h1>
                    <p className="text-xs sm:text-sm text-[#64748B] font-medium mt-0.5">
                      Teruskan perjalanan ilmu anda. Bacaan terbaik, lebih bermakna.
                    </p>
                  </div>
                </div>

                {/* Right Column: Editorial Quote */}
                <div className="text-right hidden sm:block relative z-10 border-l border-emerald-900/10 pl-6">
                  <span className="font-serif-book italic text-sm sm:text-base text-[#102A27]/85 font-medium tracking-wide block">
                    “Buku hari ini, kejayaan esok”
                  </span>
                  <p className="text-[11px] text-[#64748B] font-medium mt-0.5">Koleksi Terpilih Karya Digital</p>
                </div>
              </section>

              {/* Active Filter Bar (Clean indicator when searching, category selected, or shelf active) */}
              {(selectedCategory !== 'Semua' || searchQuery || activeShelfFilter) && (
                <div className="bg-white border border-[#E2E8F0] rounded-[14px] px-4 py-3 shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[#64748B] font-medium flex items-center gap-1.5">
                      <Filter className="w-3.5 h-3.5 text-[#006B57]" />
                      Menapis mengikut:
                    </span>

                    {selectedCategory !== 'Semua' && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ECFDF5] text-[#006B57] font-semibold border border-[#A7F3D0]">
                        <span>Kategori: {selectedCategory}</span>
                        <button
                          onClick={() => setSelectedCategory('Semua')}
                          className="hover:text-emerald-900 cursor-pointer text-xs"
                          title="Buang penapis kategori"
                        >
                          ✕
                        </button>
                      </span>
                    )}

                    {searchQuery && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-[#102A27] font-semibold border border-slate-200">
                        <span>Carian: "{searchQuery}"</span>
                        <button
                          onClick={() => setSearchQuery('')}
                          className="hover:text-red-600 cursor-pointer text-xs"
                          title="Padam carian"
                        >
                          ✕
                        </button>
                      </span>
                    )}

                    {activeShelfFilter && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-900 font-semibold border border-amber-200">
                        <FolderHeart className="w-3 h-3 text-amber-700" />
                        <span>Rak: {activeShelfFilter}</span>
                        <button
                          onClick={() => setActiveShelfFilter(null)}
                          className="hover:text-red-600 cursor-pointer text-xs"
                          title="Buang penapis rak"
                        >
                          ✕
                        </button>
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => {
                      setSelectedCategory('Semua');
                      setSearchQuery('');
                      setActiveShelfFilter(null);
                    }}
                    className="text-[#006B57] font-semibold hover:underline cursor-pointer"
                  >
                    Set Semula Semua
                  </button>
                </div>
              )}

              {/* Books Display: Skeleton Loading, Empty State, or Grid */}
              {isLoading ? (
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 lg:gap-8">
                  <BookCardSkeleton />
                  <BookCardSkeleton />
                </div>
              ) : filteredBooks.length === 0 ? (
                <EmptyLibraryState
                  isFiltered={Boolean(searchQuery || selectedCategory !== 'Semua' || activeShelfFilter)}
                  onAddBook={() => {
                    setEditingBookForWriter(null);
                    setIsWriterModalOpen(true);
                  }}
                  onResetFilter={() => {
                    setSearchQuery('');
                    setSelectedCategory('Semua');
                    setStatusFilter('all');
                    setActiveShelfFilter(null);
                  }}
                />
              ) : (
                /* 2-Column Desktop Grid Layout (Spacious, 24-32px gap) */
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 lg:gap-8">
                  {filteredBooks.map((book) => (
                    <BookCard
                      key={book.id}
                      book={book}
                      onOpenReader={(b) => handleOpenReader(b, b.currentChapterIndex || 0)}
                      onOpenDetail={(b) => setActiveDetailBook(b)}
                      onToggleFavorite={handleToggleFavorite}
                      onDeleteBook={handleDeleteBook}
                      onUpdateStatus={handleUpdateStatus}
                      onEditBook={(b) => {
                        setEditingBookForWriter(b);
                        setIsWriterModalOpen(true);
                      }}
                    />
                  ))}
                </div>
              )}
            </>
          )}
        </main>
      </div>

      {/* Reader View Overlay (Fullscreen Reading Room) */}
      {activeReaderBook && (
        <ReaderView
          book={activeReaderBook}
          initialChapterIndex={readerInitialChapter}
          onBackToLibrary={() => setActiveReaderBook(null)}
          onBookUpdated={(updated) => {
            setBooks((prev) => prev.map((b) => (b.id === updated.id ? updated : b)));
          }}
        />
      )}

      {/* Book Detail Modal */}
      <BookDetailModal
        book={activeDetailBook}
        isOpen={Boolean(activeDetailBook)}
        onClose={() => setActiveDetailBook(null)}
        onOpenReader={(b, chIdx) => {
          setActiveDetailBook(null);
          handleOpenReader(b, chIdx || 0);
        }}
        onEditBook={(b) => {
          setActiveDetailBook(null);
          setEditingBookForWriter(b);
          setIsWriterModalOpen(true);
        }}
        onDeleteBook={handleDeleteBook}
        onUpdateRating={handleUpdateRating}
      />

      {/* Novel Writer Studio Modal (Tulis Buku + Unggah Ebook) */}
      <NovelWriterModal
        isOpen={isWriterModalOpen}
        onClose={() => {
          setIsWriterModalOpen(false);
          setEditingBookForWriter(null);
        }}
        onSaveBook={handleSaveBook}
        editingBook={editingBookForWriter}
      />

      {/* Custom Shelves Modal */}
      <ShelvesModal
        isOpen={isShelvesModalOpen}
        onClose={() => setIsShelvesModalOpen(false)}
        shelves={shelves}
        books={books}
        onShelvesUpdated={loadData}
        onSelectShelfFilter={(shelfName: string | null) => {
          setActiveShelfFilter(shelfName);
          setIsShelvesModalOpen(false);
        }}
        activeShelfFilter={activeShelfFilter}
      />

      {/* Backup & Import Modal */}
      <BackupModal
        isOpen={isBackupModalOpen}
        onClose={() => setIsBackupModalOpen(false)}
        onDataRestored={loadData}
      />

      {/* Author Registration Modal */}
      <AuthorRegistrationModal
        isOpen={isAuthorRegOpen}
        onClose={() => setIsAuthorRegOpen(false)}
        onSuccess={() => {
          setIsAuthorRegOpen(false);
          setEditingBookForWriter(null);
          setIsWriterModalOpen(true);
        }}
      />

      {/* Author Royalty Dashboard Modal */}
      <AuthorDashboardModal
        isOpen={isAuthorDashboardOpen}
        onClose={() => setIsAuthorDashboardOpen(false)}
        onOpenWriter={() => {
          setIsAuthorDashboardOpen(false);
          setEditingBookForWriter(null);
          setIsWriterModalOpen(true);
        }}
      />

      {/* Admin Commission Dashboard Modal */}
      <AdminDashboardModal
        isOpen={isAdminDashboardOpen}
        onClose={() => setIsAdminDashboardOpen(false)}
      />
    </div>
  );
}

export function App() {
  return (
    <MarketplaceProvider>
      <MainAppContent />
    </MarketplaceProvider>
  );
}

export default App;
