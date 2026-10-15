import React, { useState, useEffect, useMemo } from 'react';
import {
  getAllBooks,
  saveBook,
  deleteBook,
  getShelves,
} from './services/storage';
import { Book, CustomShelf } from './types/book';
import { TopBar } from './components/TopBar';
import { Sidebar, MainSpace, BOOK_CATEGORIES_LIST, PROJECT_CATEGORIES_LIST } from './components/Sidebar';
import { BookCard } from './components/BookCard';
import { DigitalProjectCard } from './components/DigitalProjectCard';
import { ReaderView } from './components/ReaderView';
import { NovelWriterModal } from './components/NovelWriterModal';
import { BookDetailModal } from './components/BookDetailModal';
import { ShelvesModal } from './components/ShelvesModal';
import { BackupModal } from './components/BackupModal';
import { MarketplaceProvider } from './context/MarketplaceContext';
import { AuthorDashboardModal } from './components/AuthorDashboardModal';
import { AdminDashboardModal } from './components/AdminDashboardModal';
import { AuthorStudioSpace } from './components/AuthorStudioSpace';
import { AuthorGuidePage } from './components/AuthorGuidePage';
import { BookCardSkeleton } from './components/BookCardSkeleton';
import { EmptyLibraryState } from './components/EmptyLibraryState';
import { CompactHeroBanner } from './components/CompactHeroBanner';
import { WriterSmallBanner } from './components/WriterSmallBanner';
import { ContinueReadingStrip } from './components/ContinueReadingStrip';
import { ProjectFilterBar } from './components/ProjectFilterBar';
import { MobileBottomNav, MobileTab } from './components/MobileBottomNav';
import { UserAccountModal } from './components/UserAccountModal';
import { ContactModal } from './components/ContactModal';
import { Footer } from './components/Footer';
import {
  BookOpen,
  FolderHeart,
  Filter,
  BookmarkCheck,
  CheckCircle2,
  Heart,
  Code2,
  Sparkles,
} from 'lucide-react';

function MainAppContent() {
  const [books, setBooks] = useState<Book[]>([]);
  const [shelves, setShelves] = useState<CustomShelf[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Sidebar Open State (default open on desktop)
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Active Space / Section (Separated Spaces)
  const [activeSpace, setActiveSpace] = useState<MainSpace>('books');

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
  const [activeShelfFilter, setActiveShelfFilter] = useState<string | null>(null);

  // Admin Mode Guard (Hidden from normal users unless activated)
  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    try {
      return localStorage.getItem('karya_digital_is_admin') === 'true';
    } catch {
      return false;
    }
  });

  const toggleAdmin = () => {
    setIsAdmin((prev) => {
      const next = !prev;
      try {
        localStorage.setItem('karya_digital_is_admin', String(next));
      } catch {
        // Ignore
      }
      return next;
    });
  };

  // Active Modals & Reader
  const [activeReaderBook, setActiveReaderBook] = useState<Book | null>(null);
  const [readerInitialChapter, setReaderInitialChapter] = useState(0);
  const [activeDetailBook, setActiveDetailBook] = useState<Book | null>(null);
  const [isWriterModalOpen, setIsWriterModalOpen] = useState(false);
  const [editingBookForWriter, setEditingBookForWriter] = useState<Book | null>(null);
  const [isBackupModalOpen, setIsBackupModalOpen] = useState(false);
  const [isShelvesModalOpen, setIsShelvesModalOpen] = useState(false);
  const [isAuthorDashboardOpen, setIsAuthorDashboardOpen] = useState(false);
  const [isAdminDashboardOpen, setIsAdminDashboardOpen] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);
  const [isGuidePageOpen, setIsGuidePageOpen] = useState(false);

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

  // Load library data
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

  // Split books vs digital projects
  const bookItems = useMemo(() => {
    return books.filter((b) => b.itemType !== 'project');
  }, [books]);

  const projectItems = useMemo(() => {
    return books.filter((b) => b.itemType === 'project');
  }, [books]);

  // Counts strictly respecting Requirement 5:
  // - Sedang Dibaca: ONLY 1% - 99% progress
  // - Selesai: 100% progress
  const readingBooksCount = useMemo(() => {
    return books.filter((b) => (b.currentProgress || 0) >= 1 && (b.currentProgress || 0) < 100).length;
  }, [books]);

  const completedBooksCount = useMemo(() => {
    return books.filter((b) => (b.currentProgress || 0) >= 100).length;
  }, [books]);

  const favoriteBooksCount = useMemo(() => {
    return books.filter((b) => b.isFavorite).length;
  }, [books]);

  // Category counts based on current space
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    const targetItems = activeSpace === 'projects' ? projectItems : bookItems;
    counts['Semua'] = targetItems.length;

    targetItems.forEach((b) => {
      counts[b.category] = (counts[b.category] || 0) + 1;
      // Map category aliases if needed
      if (b.category === 'Novel Sastra') counts['Novel Sastera'] = (counts['Novel Sastera'] || 0) + 1;
      if (b.category === 'Non-Fiksi & Esai') counts['Esai & Refleksi'] = (counts['Esai & Refleksi'] || 0) + 1;
      if (b.category === 'Resepi') counts['Resepi & Kulinari'] = (counts['Resepi & Kulinari'] || 0) + 1;
    });

    return counts;
  }, [books, bookItems, projectItems, activeSpace]);

  // Categories list for FilterBar based on current space
  const currentCategoriesList = useMemo(() => {
    if (activeSpace === 'projects') {
      return ['Semua', ...PROJECT_CATEGORIES_LIST.map((c) => c.label)];
    }
    return ['Semua', ...BOOK_CATEGORIES_LIST.map((c) => c.label)];
  }, [activeSpace]);

  // Filtered Items computation based on activeSpace, category, and search
  const displayedItems = useMemo(() => {
    return books.filter((item) => {
      // 1. Search Query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = item.title.toLowerCase().includes(query);
        const matchesAuthor = item.author.toLowerCase().includes(query);
        const matchesDesc = item.description.toLowerCase().includes(query);
        const matchesCategory = item.category.toLowerCase().includes(query);
        const matchesTags = item.tags?.some((t) => t.toLowerCase().includes(query));
        if (!matchesTitle && !matchesAuthor && !matchesDesc && !matchesCategory && !matchesTags) {
          return false;
        }
      }

      // 2. Shelf Filter
      if (activeShelfFilter && item.shelf !== activeShelfFilter) {
        return false;
      }

      // 3. Space Constraint
      if (activeSpace === 'reading') {
        // STRICT: Only 1% - 99% progress
        const prog = item.currentProgress || 0;
        return prog >= 1 && prog < 100;
      }

      if (activeSpace === 'completed') {
        // STRICT: 100% progress
        return (item.currentProgress || 0) >= 100;
      }

      if (activeSpace === 'favorite') {
        return item.isFavorite === true;
      }

      if (activeSpace === 'projects') {
        if (item.itemType !== 'project') return false;
      } else if (activeSpace === 'books') {
        if (item.itemType === 'project') return false;
      }

      // 4. Category Filter
      if (selectedCategory !== 'Semua') {
        const matchCategory =
          item.category === selectedCategory ||
          (selectedCategory === 'Novel Sastera' && (item.category === 'Novel Sastra' || item.category.includes('Novel'))) ||
          (selectedCategory === 'Esai & Refleksi' && (item.category === 'Non-Fiksi & Esai' || item.category.includes('Esai'))) ||
          (selectedCategory === 'Resepi & Kulinari' && (item.category === 'Resepi' || item.category.includes('Masakan')));
        if (!matchCategory) return false;
      }

      return true;
    });
  }, [books, activeSpace, selectedCategory, searchQuery, activeShelfFilter]);

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
  };

  const handleSaveBook = async (bookData: Book) => {
    await saveBook(bookData);
    setBooks((prev) => {
      const idx = prev.findIndex((b) => b.id === bookData.id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = bookData;
        return next;
      }
      return [bookData, ...prev];
    });
    setIsWriterModalOpen(false);
    setEditingBookForWriter(null);
  };

  const handleUpdateRating = async (bookId: string, rating: number) => {
    const target = books.find((b) => b.id === bookId);
    if (!target) return;
    const updated = { ...target, rating };
    await saveBook(updated);
    setBooks((prev) => prev.map((b) => (b.id === bookId ? updated : b)));
    if (activeDetailBook?.id === bookId) setActiveDetailBook(updated);
  };

  // Space switcher handler
  const handleSelectSpace = (space: MainSpace) => {
    setIsGuidePageOpen(false);
    if (space === 'shelves') {
      setIsShelvesModalOpen(true);
      return;
    }
    if (space === 'backup') {
      setIsBackupModalOpen(true);
      return;
    }
    setActiveSpace(space);
    setSelectedCategory('Semua');
    setActiveShelfFilter(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Mobile navigation tab handler
  const handleMobileTabSelect = (tab: MobileTab) => {
    if (tab === 'explore') {
      handleSelectSpace('books');
    } else if (tab === 'my_books') {
      handleSelectSpace('reading');
    } else if (tab === 'studio') {
      handleSelectSpace('studio');
    } else if (tab === 'account') {
      setIsAccountModalOpen(true);
    }
  };

  // Active mobile tab calculation
  const currentMobileTab: MobileTab = useMemo(() => {
    if (activeSpace === 'studio') return 'studio';
    if (activeSpace === 'reading' || activeSpace === 'completed' || activeSpace === 'favorite') {
      return 'my_books';
    }
    return 'explore';
  }, [activeSpace]);

  return (
    <div className="min-h-screen bg-[#F8FAF9] dark:bg-[#0A0F0E] text-[#102A27] dark:text-[#F1F5F9] flex flex-col font-sans antialiased transition-colors duration-200 overflow-x-hidden">
      {/* 1. Bar Atas (TopBar): Cukup Logo, Carian, Profil & Dark Mode sahaja (Tiada menu berulang) */}
      <TopBar
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onOpenProfile={() => setIsAccountModalOpen(true)}
        isDarkMode={isDarkMode}
        onToggleDarkMode={toggleDarkMode}
      />

      {/* 2. Susunan Aplikasi: Sidebar Desktop di sebelah kiri + Kandungan Utama */}
      <div className="flex-1 max-w-[1440px] w-full mx-auto flex items-start overflow-x-hidden">
        {/* Desktop Sidebar */}
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          activeSpace={activeSpace}
          onSelectSpace={handleSelectSpace}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          categoryCounts={categoryCounts}
          totalBooksCount={bookItems.length}
          readingBooksCount={readingBooksCount}
          completedBooksCount={completedBooksCount}
          favoriteBooksCount={favoriteBooksCount}
          onOpenWriter={() => {
            setEditingBookForWriter(null);
            setIsWriterModalOpen(true);
          }}
          onOpenAdminPortal={() => setIsAdminDashboardOpen(true)}
          isAdmin={isAdmin}
        />

        {/* Kandungan Utama (Responsive & Overflow-X Free) */}
        <main className="flex-1 min-w-0 px-4 sm:px-6 lg:px-8 py-5 sm:py-7 space-y-6 pb-24 md:pb-8 max-w-full overflow-x-hidden text-base">
          {/* A. TAMPILAN KHAS: PANDUAN PENULIS */}
          {isGuidePageOpen ? (
            <AuthorGuidePage
              onOpenWriter={() => {
                setEditingBookForWriter(null);
                setIsWriterModalOpen(true);
              }}
              onOpenAuthorDashboard={() => setIsAuthorDashboardOpen(true)}
              onReadGuideBook={() => {
                const guideBook =
                  books.find((b) => b.id === 'buku-panduan-penulis-pantas') ||
                  books.find((b) => b.title.includes('Panduan')) ||
                  books[0];
                if (guideBook) handleOpenReader(guideBook, 0);
              }}
            />
          ) : activeSpace === 'studio' ? (
            /* B. RUANG KHAS: STUDIO PENULIS (Royalti 95%, Penerbitan & Admin Guard) */
            <AuthorStudioSpace
              books={books}
              onOpenWriter={() => {
                setEditingBookForWriter(null);
                setIsWriterModalOpen(true);
              }}
              onEditBook={(b) => {
                setEditingBookForWriter(b);
                setIsWriterModalOpen(true);
              }}
              onOpenAuthorDashboard={() => setIsAuthorDashboardOpen(true)}
              onOpenAdminPortal={() => setIsAdminDashboardOpen(true)}
              onOpenAuthorGuide={() => setIsGuidePageOpen(true)}
              isAdmin={isAdmin}
            />
          ) : activeSpace === 'projects' ? (
            /* C. RUANG KHAS: PROJEK DIGITAL (Aplikasi Web, Sistem & Kod) */
            <div className="space-y-6 text-left animate-in fade-in duration-200">
              {/* Penapis Kategori Projek Digital di bahagian atas */}
              <ProjectFilterBar
                categories={currentCategoriesList}
                selectedCategory={selectedCategory}
                onSelectCategory={setSelectedCategory}
                categoryCounts={categoryCounts}
                totalCount={projectItems.length}
              />

              <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-xs">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950 text-[#006B57] dark:text-emerald-400 text-xs font-semibold mb-2">
                  <Code2 className="w-3.5 h-3.5" />
                  <span>Ekosistem Produk &amp; Alat Digital</span>
                </div>
                <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                  Katalog Projek &amp; Aplikasi Digital
                </h1>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                  Terokai aplikasi e-reader berasaskan web, sistem royalti berautomasi, dan peralatan digital untuk komuniti pembaca dan pengarang.
                </p>
              </div>

              {/* Grid Projek Digital */}
              {displayedItems.length === 0 ? (
                <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
                  <p className="text-sm text-slate-500">Tiada projek digital dalam kategori ini.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {displayedItems.map((project) => (
                    <DigitalProjectCard
                      key={project.id}
                      project={project}
                      onOpenProject={(p) => handleOpenReader(p, 0)}
                      onOpenDetail={(p) => setActiveDetailBook(p)}
                    />
                  ))}
                </div>
              )}
            </div>
          ) : (
            /* D. RUANG BUKU & BUKU SAYA (Koleksi Buku, Sedang Dibaca, Selesai, Kegemaran) */
            <>
              {/* 1. PENAPIS KATEGORI BUKU DILETAK DI BAHAGIAN PALING ATAS */}
              <div className="pt-0.5">
                <ProjectFilterBar
                  categories={currentCategoriesList}
                  selectedCategory={selectedCategory}
                  onSelectCategory={setSelectedCategory}
                  categoryCounts={categoryCounts}
                  totalCount={bookItems.length}
                />
              </div>

              {/* Bar Penunjuk Carian / Rak Aktif */}
              {(searchQuery || activeShelfFilter) && (
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 flex flex-wrap items-center justify-between gap-2 text-xs text-left">
                  <div className="flex items-center gap-2">
                    <Filter className="w-3.5 h-3.5 text-[#006B57] dark:text-emerald-400" />
                    <span>Penapis Aktif:</span>
                    {searchQuery && (
                      <span className="font-semibold text-slate-800 dark:text-slate-200">
                        Carian "{searchQuery}"
                      </span>
                    )}
                    {activeShelfFilter && (
                      <span className="font-semibold text-amber-700 dark:text-amber-400">
                        Rak: {activeShelfFilter}
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setActiveShelfFilter(null);
                      setSelectedCategory('Semua');
                    }}
                    className="text-[#006B57] dark:text-emerald-400 font-semibold hover:underline cursor-pointer"
                  >
                    Set Semula
                  </button>
                </div>
              )}

              {/* Ruang Header / Title jika dalam 'Sedang Dibaca', 'Selesai', atau 'Kegemaran' */}
              {activeSpace === 'reading' ? (
                <div className="flex items-center gap-2.5 pb-1 text-left">
                  <div className="w-8 h-8 rounded-lg bg-[#ECFDF5] dark:bg-emerald-950 text-[#006B57] dark:text-emerald-400 flex items-center justify-center">
                    <BookmarkCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <h1 className="text-xl font-bold text-slate-900 dark:text-white">Sedang Dibaca</h1>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Naskhah yang sedang aktif dalam kemajuan bacaan anda (1% – 99%).
                    </p>
                  </div>
                </div>
              ) : activeSpace === 'completed' ? (
                <div className="flex items-center gap-2.5 pb-1 text-left">
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h1 className="text-xl font-bold text-slate-900 dark:text-white">Selesai Dibaca</h1>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Naskhah yang telah selesai 100% dibaca. Anda boleh membacanya semula pada bila-bila masa.
                    </p>
                  </div>
                </div>
              ) : activeSpace === 'favorite' ? (
                <div className="flex items-center gap-2.5 pb-1 text-left">
                  <div className="w-8 h-8 rounded-lg bg-rose-50 dark:bg-rose-950 text-rose-500 flex items-center justify-center">
                    <Heart className="w-4 h-4" />
                  </div>
                  <div>
                    <h1 className="text-xl font-bold text-slate-900 dark:text-white">Karya Kegemaran</h1>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Naskhah pilihan yang telah anda simpan sebagai rujukan utama.
                    </p>
                  </div>
                </div>
              ) : (
                /* Banner Pengenalan Yang Dikecilkan */
                <CompactHeroBanner
                  onExploreBooks={() => {
                    const el = document.getElementById('koleksi-buku-grid');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  onOpenStudio={() => handleSelectSpace('studio')}
                />
              )}

              {/* Sambung Membaca (Hanya muncul jika ada buku dalam kemajuan 1–99%) */}
              {activeSpace === 'books' && (
                <ContinueReadingStrip
                  books={books}
                  onOpenReader={(b) => handleOpenReader(b, b.currentChapterIndex || 0)}
                  onOpenDetail={(b) => setActiveDetailBook(b)}
                />
              )}



              {/* 5. Koleksi Buku: Kad Buku Yang Diringkaskan (Cover, Tajuk, Penulis, Harga/Kemajuan, 1 Butang) */}
              {isLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6">
                  {[...Array(6)].map((_, i) => (
                    <BookCardSkeleton key={i} />
                  ))}
                </div>
              ) : displayedItems.length === 0 ? (
                <EmptyLibraryState
                  isFiltered={Boolean(searchQuery || selectedCategory !== 'Semua' || activeShelfFilter)}
                  onAddBook={() => {
                    setEditingBookForWriter(null);
                    setIsWriterModalOpen(true);
                  }}
                  onResetFilter={() => {
                    setSearchQuery('');
                    setSelectedCategory('Semua');
                    setActiveShelfFilter(null);
                  }}
                />
              ) : (
                <div
                  id="koleksi-buku-grid"
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6 scroll-mt-24"
                >
                  {displayedItems.map((book) => (
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

              {/* 6. Banner Kecil "Jadi Penulis" di bahagian bawah halaman utama */}
              {activeSpace === 'books' && (
                <WriterSmallBanner onOpenStudio={() => handleSelectSpace('studio')} />
              )}
            </>
          )}

          {/* Footer Profesional */}
          <Footer
            onSelectTab={(tab) => {
              if (tab === 'backup') setIsBackupModalOpen(true);
              else if (tab === 'author_guide') setIsGuidePageOpen(true);
              else handleSelectSpace('books');
            }}
            onOpenContact={() => setIsContactModalOpen(true)}
          />
        </main>
      </div>

      {/* Reader View Overlay (Bilik Pembaca E-Reader Pelayar) */}
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

      {/* Halaman / Modal Butiran Lengkap Buku (Sinopsis, Bab, Format, Unduhan) */}
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

      {/* Studio Penulisan / Terbitan Naskhah */}
      <NovelWriterModal
        isOpen={isWriterModalOpen}
        onClose={() => {
          setIsWriterModalOpen(false);
          setEditingBookForWriter(null);
        }}
        onSaveBook={handleSaveBook}
        editingBook={editingBookForWriter}
      />

      {/* Modal Rak Kustom */}
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

      {/* Simpanan Setempat & Sandaran Data */}
      <BackupModal
        isOpen={isBackupModalOpen}
        onClose={() => setIsBackupModalOpen(false)}
        onDataRestored={loadData}
      />

      {/* Dompet Royalti Penulis (95%) */}
      <AuthorDashboardModal
        isOpen={isAuthorDashboardOpen}
        onClose={() => setIsAuthorDashboardOpen(false)}
        onOpenWriter={() => {
          setIsAuthorDashboardOpen(false);
          setEditingBookForWriter(null);
          setIsWriterModalOpen(true);
        }}
      />

      {/* Portal Pentadbir (HANYA DIBUKA KEPADA ADMIN) */}
      <AdminDashboardModal
        isOpen={isAdminDashboardOpen}
        onClose={() => setIsAdminDashboardOpen(false)}
      />

      {/* Modal Akaun & Tetapan Peribadi */}
      <UserAccountModal
        isOpen={isAccountModalOpen}
        onClose={() => setIsAccountModalOpen(false)}
        isAdmin={isAdmin}
        onToggleAdmin={toggleAdmin}
        onOpenBackup={() => setIsBackupModalOpen(true)}
        onOpenAuthorDashboard={() => setIsAuthorDashboardOpen(true)}
        onOpenAdminPortal={() => setIsAdminDashboardOpen(true)}
        isDarkMode={isDarkMode}
        onToggleDarkMode={toggleDarkMode}
      />

      {/* Modal Hubungi */}
      <ContactModal
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
      />

      {/* 3. Navigasi Bawah Telefon (Telefon gunakan: Terokai, Buku Saya, Studio dan Akaun) */}
      <MobileBottomNav
        activeTab={currentMobileTab}
        onSelectMobileTab={handleMobileTabSelect}
        readingCount={readingBooksCount}
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
