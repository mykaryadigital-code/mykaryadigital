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
import { HeroSection } from './components/HeroSection';
import { ProjectFilterBar } from './components/ProjectFilterBar';
import { MobileBottomNav } from './components/MobileBottomNav';
import { ContactModal } from './components/ContactModal';
import { ProjectGridSkeleton } from './components/SkeletonLoader';
import { ContactCtaSection } from './components/ContactCtaSection';
import { Footer } from './components/Footer';
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
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  // Dark mode state with persistent localStorage
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    try {
      const savedTheme = localStorage.getItem('karya_digital_theme');
      if (savedTheme) {
        return savedTheme === 'dark';
      }
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    } catch {
      return false;
    }
  });

  useEffect(() => {
    try {
      if (isDarkMode) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('karya_digital_theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('karya_digital_theme', 'light');
      }
    } catch {
      // Ignore
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => !prev);
  };

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

  // Project Category Counts for the Pills Filter Bar
  const projectCategoryCounts = useMemo(() => {
    const counts: Record<string, number> = {
      'Semua': books.length,
      'Aplikasi Web': 0,
      'Bisnes & E-Dagang': 0,
      'Sistem & Automasi': 0,
      'Novel & Sastera': 0,
    };

    books.forEach((book) => {
      const bCat = (book.category || '').toLowerCase();
      const bTags = (book.tags || []).map((t) => t.toLowerCase());

      if (
        bCat === 'aplikasi web' ||
        bCat.includes('aplikasi') ||
        bCat.includes('panduan') ||
        bTags.some((t) => t.includes('web') || t.includes('aplikasi') || t.includes('e-reader'))
      ) {
        counts['Aplikasi Web']++;
      }

      if (
        bCat === 'bisnes & e-dagang' ||
        bCat.includes('bisnes') ||
        bCat.includes('dagang') ||
        bCat.includes('resepi') ||
        bCat.includes('non-fik') ||
        bTags.some((t) => t.includes('bisnes') || t.includes('royalti') || t.includes('kulinari') || t.includes('tips'))
      ) {
        counts['Bisnes & E-Dagang']++;
      }

      if (
        bCat === 'sistem & automasi' ||
        bCat.includes('sistem') ||
        bCat.includes('automasi') ||
        bCat.includes('misteri') ||
        bCat.includes('fantasi') ||
        bTags.some((t) => t.includes('sistem') || t.includes('automasi') || t.includes('detektif') || t.includes('silat'))
      ) {
        counts['Sistem & Automasi']++;
      }

      if (
        bCat.includes('novel') ||
        bCat.includes('sastra') ||
        bCat.includes('sastera') ||
        bCat.includes('puisi') ||
        bTags.some((t) => t.includes('sastra') || t.includes('klasik') || t.includes('novel'))
      ) {
        counts['Novel & Sastera']++;
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

      // Category filter (resilient matching for Malaysian labels & project categories)
      if (selectedCategory !== 'Semua') {
        const bCat = (book.category || '').toLowerCase();
        const bTags = (book.tags || []).map((t) => t.toLowerCase());

        let isMatch = false;

        if (selectedCategory === 'Aplikasi Web') {
          isMatch =
            bCat === 'aplikasi web' ||
            bCat.includes('aplikasi') ||
            bCat.includes('panduan') ||
            bTags.some((t) => t.includes('web') || t.includes('aplikasi') || t.includes('e-reader'));
        } else if (selectedCategory === 'Bisnes & E-Dagang') {
          isMatch =
            bCat === 'bisnes & e-dagang' ||
            bCat.includes('bisnes') ||
            bCat.includes('dagang') ||
            bCat.includes('resepi') ||
            bCat.includes('non-fik') ||
            bTags.some((t) => t.includes('bisnes') || t.includes('royalti') || t.includes('kulinari') || t.includes('tips'));
        } else if (selectedCategory === 'Sistem & Automasi') {
          isMatch =
            bCat === 'sistem & automasi' ||
            bCat.includes('sistem') ||
            bCat.includes('automasi') ||
            bCat.includes('misteri') ||
            bCat.includes('fantasi') ||
            bTags.some((t) => t.includes('sistem') || t.includes('automasi') || t.includes('detektif') || t.includes('silat'));
        } else if (selectedCategory === 'Novel & Sastera') {
          isMatch =
            bCat.includes('novel') ||
            bCat.includes('sastra') ||
            bCat.includes('sastera') ||
            bCat.includes('puisi') ||
            bTags.some((t) => t.includes('sastra') || t.includes('klasik') || t.includes('novel'));
        } else {
          isMatch =
            book.category === selectedCategory ||
            (selectedCategory === 'Novel' && book.category.includes('Novel')) ||
            (selectedCategory === 'Novel Sastra' && book.category.includes('Novel')) ||
            (selectedCategory.includes('Fantasi') && book.category.includes('Fantasi')) ||
            (selectedCategory.includes('Non-Fik') && (book.category.includes('Non-Fiksyen') || book.category.includes('Non-Fiksi'))) ||
            (selectedCategory.includes('Puisi') && (book.category.includes('Puisi') || book.category.includes('Sastra')));
        }

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
    <div className="min-h-screen bg-[#F7F9F8] dark:bg-[#0A0F0E] text-[#102A27] dark:text-[#F1F5F9] flex flex-col font-sans antialiased transition-colors duration-200">
      {/* Streamlined Top Bar (Sticky, backdrop-blur, clean navigation and Dark/Light toggle) */}
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
        onOpenAuthorRegistration={() => handleSelectTab('author_guide')}
        onOpenProfile={() => handleSelectTab('author_guide')}
        isDarkMode={isDarkMode}
        onToggleDarkMode={toggleDarkMode}
        currentTab={currentTab}
        onSelectTab={handleSelectTab}
      />

      {/* Main App Layout: Sidebar on Left + Content Area on Right */}
      <div className="flex-1 max-w-[1440px] w-full mx-auto flex items-start">
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
        <main className="flex-1 min-w-0 px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 pb-[calc(6rem+env(safe-area-inset-bottom,0px))] md:pb-8 overflow-x-hidden max-w-full">
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
              {/* Modern Minimal Hero Section */}
              <HeroSection
                onExploreProjects={() => {
                  handleSelectTab('all');
                  const el = document.getElementById('koleksi-buku-grid');
                  if (el) {
                    el.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                onOpenAuthorGuide={() => handleSelectTab('author_guide')}
                onOpenContact={() => setIsContactModalOpen(true)}
                currentTab={currentTab}
                totalBooks={books.length}
              />

              {/* Category Filter Bar (Pills/Tabs) - Mobile-First Horizontal Scroll */}
              <ProjectFilterBar
                categories={['Semua', 'Aplikasi Web', 'Bisnes & E-Dagang', 'Sistem & Automasi', 'Novel & Sastera']}
                selectedCategory={selectedCategory}
                onSelectCategory={(cat) => {
                  setSelectedCategory(cat);
                  if (currentTab !== 'all') {
                    setCurrentTab('all');
                  }
                }}
                categoryCounts={projectCategoryCounts}
                totalCount={books.length}
              />

              {/* Active Search & Shelf Indicator Bar */}
              {(searchQuery || activeShelfFilter) && (
                <div className="bg-white dark:bg-slate-900 border border-[#E2E8F0] dark:border-slate-800 rounded-[14px] px-4 py-3 shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[#64748B] dark:text-slate-400 font-medium flex items-center gap-1.5">
                      <Filter className="w-3.5 h-3.5 text-[#006B57] dark:text-emerald-400" />
                      Menapis mengikut:
                    </span>

                    {selectedCategory !== 'Semua' && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ECFDF5] dark:bg-emerald-950/60 text-[#006B57] dark:text-emerald-400 font-semibold border border-[#A7F3D0] dark:border-emerald-800">
                        <span>Kategori: {selectedCategory}</span>
                        <button
                          onClick={() => setSelectedCategory('Semua')}
                          className="hover:text-emerald-900 dark:hover:text-emerald-200 cursor-pointer text-xs"
                          title="Buang penapis kategori"
                        >
                          ✕
                        </button>
                      </span>
                    )}

                    {searchQuery && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-[#102A27] dark:text-slate-200 font-semibold border border-slate-200 dark:border-slate-700">
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
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-950/60 text-amber-900 dark:text-amber-300 font-semibold border border-amber-200 dark:border-amber-800">
                        <FolderHeart className="w-3 h-3 text-amber-700 dark:text-amber-400" />
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
                    className="text-[#006B57] dark:text-emerald-400 font-semibold hover:underline cursor-pointer"
                  >
                    Set Semula Semua
                  </button>
                </div>
              )}

              {/* Books Display: Skeleton Loading, Empty State, or Grid */}
              {isLoading ? (
                <ProjectGridSkeleton count={6} />
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
                /* Responsive Grid: 1 column (mobile), 2 columns (tablet), 3 columns (desktop) with gap-6 / gap-8 */
                <div id="koleksi-buku-grid" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 scroll-mt-24">
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

              {/* Seksyen Hubungi & Kolaborasi Projek Digital */}
              <ContactCtaSection onOpenContactModal={() => setIsContactModalOpen(true)} />
            </>
          )}

          {/* Seksyen Footer Profesional */}
          <Footer
            onSelectTab={handleSelectTab}
            onOpenContact={() => setIsContactModalOpen(true)}
          />
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

      {/* Mobile Bottom Navigation (Fixed bottom-0 for md:hidden screens) */}
      <MobileBottomNav
        currentTab={currentTab}
        onSelectTab={handleSelectTab}
        onOpenContact={() => setIsContactModalOpen(true)}
      />

      {/* Global Contact Modal */}
      <ContactModal
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
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
