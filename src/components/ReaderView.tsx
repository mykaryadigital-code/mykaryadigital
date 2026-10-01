import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Settings,
  List,
  Bookmark,
  Volume2,
  VolumeX,
  Play,
  Pause,
  Square,
  Highlighter,
  Type,
  Maximize2,
  Minimize2,
  Check,
  MessageSquareQuote,
  Star,
  Clock,
  Lock,
  ShieldCheck,
} from 'lucide-react';
import { useMarketplace } from '../context/MarketplaceContext';
import { BookPurchaseModal } from './BookPurchaseModal';
import {
  Book,
  Chapter,
  Bookmark as BookmarkType,
  Highlight,
  ReaderSettings,
  ReaderThemeMode,
} from '../types/book';
import {
  saveBook,
  getBookmarksByBookId,
  saveBookmark,
  deleteBookmark,
  getHighlightsByBookId,
  saveHighlight,
  deleteHighlight,
  getReaderSettings,
  saveReaderSettings,
} from '../services/storage';

interface ReaderViewProps {
  book: Book;
  initialChapterIndex?: number;
  onBackToLibrary: () => void;
  onBookUpdated: (updatedBook: Book) => void;
}

const THEME_STYLES: Record<
  ReaderThemeMode,
  {
    bg: string;
    text: string;
    toolbarBg: string;
    toolbarBorder: string;
    accent: string;
    panelBg: string;
    panelBorder: string;
  }
> = {
  sepia: {
    bg: '#f7f4ee',
    text: '#292524',
    toolbarBg: 'rgba(247, 244, 238, 0.95)',
    toolbarBorder: '#e7e2d7',
    accent: '#78350f',
    panelBg: '#f2eee5',
    panelBorder: '#ded7c9',
  },
  dark: {
    bg: '#0c0a09',
    text: '#e7e5e4',
    toolbarBg: 'rgba(12, 10, 9, 0.95)',
    toolbarBorder: '#292524',
    accent: '#d6d3d1',
    panelBg: '#1c1917',
    panelBorder: '#44403c',
  },
  light: {
    bg: '#ffffff',
    text: '#1c1917',
    toolbarBg: 'rgba(255, 255, 255, 0.95)',
    toolbarBorder: '#e5e5e5',
    accent: '#44403c',
    panelBg: '#fafafa',
    panelBorder: '#e5e5e5',
  },
  midnight: {
    bg: '#0f172a',
    text: '#e2e8f0',
    toolbarBg: 'rgba(15, 23, 42, 0.95)',
    toolbarBorder: '#1e293b',
    accent: '#93c5fd',
    panelBg: '#1e293b',
    panelBorder: '#334155',
  },
  forest: {
    bg: '#061d18',
    text: '#e0ebe6',
    toolbarBg: 'rgba(6, 29, 24, 0.95)',
    toolbarBorder: '#0b352c',
    accent: '#6ee7b7',
    panelBg: '#092922',
    panelBorder: '#104338',
  },
};

export const ReaderView: React.FC<ReaderViewProps> = ({
  book,
  initialChapterIndex = 0,
  onBackToLibrary,
  onBookUpdated,
}) => {
  const [currentChapterIndex, setCurrentChapterIndex] = useState(
    Math.min(Math.max(0, initialChapterIndex), Math.max(0, book.chapters.length - 1))
  );

  const [settings, setSettings] = useState<ReaderSettings>({
    theme: 'sepia',
    fontSize: 18,
    fontFamily: 'serif',
    lineHeight: 1.8,
    maxWidth: 'medium',
    textAlign: 'left',
  });

  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showToc, setShowToc] = useState(false);
  const [showBookmarks, setShowBookmarks] = useState(false);
  const [showHighlights, setShowHighlights] = useState(false);
  const [showTtsPanel, setShowTtsPanel] = useState(false);

  // Bookmarks & Highlights
  const [bookmarks, setBookmarks] = useState<BookmarkType[]>([]);
  const [highlights, setHighlights] = useState<Highlight[]>([]);

  // Text selection state
  const [selectedText, setSelectedText] = useState('');
  const [selectionCoords, setSelectionCoords] = useState<{ x: number; y: number } | null>(null);

  // TTS State
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [ttsRate, setTtsRate] = useState(1.0);
  const [speechUtterance, setSpeechUtterance] = useState<SpeechSynthesisUtterance | null>(null);
  const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState(false);

  const { canAccessChapter, isBookPurchased } = useMarketplace();
  const isChapterLocked = !canAccessChapter(book, currentChapterIndex);

  const contentContainerRef = useRef<HTMLDivElement>(null);

  // Load saved settings
  useEffect(() => {
    getReaderSettings().then((s) => setSettings(s));
    loadBookmarksAndHighlights();
  }, [book.id]);

  const loadBookmarksAndHighlights = async () => {
    const bms = await getBookmarksByBookId(book.id);
    const hls = await getHighlightsByBookId(book.id);
    setBookmarks(bms);
    setHighlights(hls);
  };

  const currentChapter: Chapter = book.chapters[currentChapterIndex] || {
    id: 'empty',
    title: 'Halaman Kosong',
    content: 'Tidak ada teks pada bab ini.',
    wordCount: 0,
  };

  const currentTheme = THEME_STYLES[settings.theme] || THEME_STYLES.sepia;

  // Update progress in database whenever chapter changes
  useEffect(() => {
    const totalChapters = Math.max(1, book.chapters.length);
    const progress = Math.min(100, Math.round(((currentChapterIndex + 1) / totalChapters) * 100));

    const updatedBook: Book = {
      ...book,
      currentChapterIndex,
      currentProgress: Math.max(book.currentProgress, progress),
      lastReadDate: new Date().toISOString(),
      status: progress >= 100 ? 'completed' : 'reading',
    };

    saveBook(updatedBook);
    onBookUpdated(updatedBook);

    // Scroll to top of content when chapter changes
    if (contentContainerRef.current) {
      contentContainerRef.current.scrollTop = 0;
    }

    // Stop speaking if active
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  }, [currentChapterIndex]);

  const handleUpdateSettings = (newSettings: Partial<ReaderSettings>) => {
    const updated = { ...settings, ...newSettings };
    setSettings(updated);
    saveReaderSettings(updated);
  };

  // Chapter Navigation
  const handleNextChapter = () => {
    if (currentChapterIndex < book.chapters.length - 1) {
      setCurrentChapterIndex((prev) => prev + 1);
    }
  };

  const handlePrevChapter = () => {
    if (currentChapterIndex > 0) {
      setCurrentChapterIndex((prev) => prev - 1);
    }
  };

  // Text selection handler
  const handleMouseUp = () => {
    const selection = window.getSelection();
    if (!selection || selection.isCollapsed) {
      setSelectedText('');
      setSelectionCoords(null);
      return;
    }

    const text = selection.toString().trim();
    if (text.length > 2) {
      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      setSelectedText(text);
      setSelectionCoords({
        x: rect.left + rect.width / 2,
        y: rect.top - 10,
      });
    } else {
      setSelectedText('');
      setSelectionCoords(null);
    }
  };

  // Add Highlight
  const handleAddHighlight = async (color: Highlight['color']) => {
    if (!selectedText) return;

    const newHl: Highlight = {
      id: `hl-${Date.now()}`,
      bookId: book.id,
      chapterIndex: currentChapterIndex,
      selectedText,
      color,
      createdAt: new Date().toISOString(),
    };

    await saveHighlight(newHl);
    setHighlights((prev) => [...prev, newHl]);
    setSelectedText('');
    setSelectionCoords(null);
    window.getSelection()?.removeAllRanges();
  };

  // Add Bookmark
  const handleAddBookmark = async () => {
    const snippet = currentChapter.content.substring(0, 140).replace(/\s+/g, ' ').trim() + '...';
    const newBm: BookmarkType = {
      id: `bm-${Date.now()}`,
      bookId: book.id,
      chapterIndex: currentChapterIndex,
      chapterTitle: currentChapter.title,
      percentage: Math.round(((currentChapterIndex + 1) / book.chapters.length) * 100),
      snippet,
      createdAt: new Date().toISOString(),
    };

    await saveBookmark(newBm);
    setBookmarks((prev) => [newBm, ...prev]);
    setShowBookmarks(true);
  };

  // TTS Controls
  const toggleTTS = () => {
    if (!('speechSynthesis' in window)) {
      alert('Peramban Anda tidak mendukung Text-to-Speech Web Speech API.');
      return;
    }

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    } else {
      const plainText = currentChapter.content;
      const utterance = new SpeechSynthesisUtterance(plainText);

      // Try finding Indonesian or Malay voice if possible
      const voices = window.speechSynthesis.getVoices();
      const idVoice = voices.find(
        (v) => v.lang.startsWith('id') || v.lang.startsWith('ms') || v.lang.includes('Indonesia')
      );
      if (idVoice) {
        utterance.voice = idVoice;
      }

      utterance.rate = ttsRate;
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      window.speechSynthesis.speak(utterance);
      setSpeechUtterance(utterance);
      setIsSpeaking(true);
      setShowTtsPanel(true);
    }
  };

  const handleTtsRateChange = (newRate: number) => {
    setTtsRate(newRate);
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(currentChapter.content);
      utterance.rate = newRate;
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  // Max width classes
  const maxWidthClass = {
    narrow: 'max-w-xl',
    medium: 'max-w-2xl',
    wide: 'max-w-4xl',
    full: 'max-w-6xl',
  }[settings.maxWidth];

  // Font family class
  const fontClass = {
    serif: 'font-serif-book',
    sans: 'font-sans-ui',
    mono: 'font-mono-data',
  }[settings.fontFamily];

  // Estimated reading time for current chapter
  const chapterReadingMinutes = Math.max(1, Math.ceil(currentChapter.wordCount / 200));

  // Paragraph processing with highlight overlays
  const chapterParagraphs = useMemo(() => {
    return currentChapter.content.split('\n\n').filter((p) => p.trim().length > 0);
  }, [currentChapter.content]);

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col transition-colors duration-200 select-text"
      style={{
        backgroundColor: currentTheme.bg,
        color: currentTheme.text,
      }}
    >
      {/* Top Header Bar */}
      <header
        className="h-14 px-4 sm:px-6 flex items-center justify-between border-b backdrop-blur-md shrink-0 transition-colors z-20"
        style={{
          backgroundColor: currentTheme.toolbarBg,
          borderColor: currentTheme.toolbarBorder,
        }}
      >
        {/* Left: Back & Title */}
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={onBackToLibrary}
            className="p-1.5 rounded-md hover:bg-black/5 dark:hover:bg-white/10 transition-colors cursor-pointer"
            title="Kembali ke Pustaka"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <div className="min-w-0">
            <h1 className="text-xs sm:text-sm font-semibold truncate leading-tight">
              {book.title}
            </h1>
            <p className="text-[11px] opacity-70 truncate font-sans-ui">
              {currentChapter.title}
            </p>
          </div>
        </div>

        {/* Center: Chapter Quick Selector */}
        <div className="hidden lg:flex items-center gap-2">
          <button
            onClick={handlePrevChapter}
            disabled={currentChapterIndex === 0}
            className="p-1 rounded disabled:opacity-30 hover:bg-black/5 dark:hover:bg-white/10 transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <span className="text-xs font-mono-data opacity-80 whitespace-nowrap">
            Bab {currentChapterIndex + 1} / {book.chapters.length}
          </span>

          <button
            onClick={handleNextChapter}
            disabled={currentChapterIndex === book.chapters.length - 1}
            className="p-1 rounded disabled:opacity-30 hover:bg-black/5 dark:hover:bg-white/10 transition-colors cursor-pointer"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Right: Actions (TOC, Bookmark, TTS, Settings) */}
        <div className="flex items-center gap-1 sm:gap-2">
          {/* Text to Speech */}
          <button
            onClick={toggleTTS}
            className={`p-2 rounded-md transition-colors cursor-pointer ${
              isSpeaking ? 'bg-amber-900 text-white' : 'hover:bg-black/5 dark:hover:bg-white/10'
            }`}
            title={isSpeaking ? 'Hentikan Pembaca Suara' : 'Dengarkan dengan Suara (TTS)'}
          >
            {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          {/* Bookmark */}
          <button
            onClick={handleAddBookmark}
            className="p-2 rounded-md hover:bg-black/5 dark:hover:bg-white/10 transition-colors cursor-pointer"
            title="Tandai Halaman Ini"
          >
            <Bookmark className="w-4 h-4" />
          </button>

          {/* Table of contents */}
          <button
            onClick={() => {
              setShowToc(!showToc);
              setShowSettings(false);
              setShowBookmarks(false);
            }}
            className={`p-2 rounded-md transition-colors cursor-pointer ${
              showToc ? 'bg-black/10 dark:bg-white/20' : 'hover:bg-black/5 dark:hover:bg-white/10'
            }`}
            title="Daftar Isi Bab"
          >
            <List className="w-4 h-4" />
          </button>

          {/* Settings button */}
          <button
            onClick={() => {
              setShowSettings(!showSettings);
              setShowToc(false);
              setShowBookmarks(false);
            }}
            className={`p-2 rounded-md transition-colors cursor-pointer ${
              showSettings ? 'bg-black/10 dark:bg-white/20' : 'hover:bg-black/5 dark:hover:bg-white/10'
            }`}
            title="Pengaturan Tampilan & Huruf"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Reading Progress Line */}
      <div
        className="w-full h-1 bg-black/5 dark:bg-white/10 relative z-20"
        style={{ backgroundColor: `${currentTheme.toolbarBorder}` }}
      >
        <div
          className="h-full bg-amber-800 transition-all duration-300"
          style={{
            width: `${Math.round(((currentChapterIndex + 1) / book.chapters.length) * 100)}%`,
          }}
        />
      </div>

      {/* Main Reading Canvas & Panels */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Floating Text Selection Popup Toolbar */}
        {selectedText && selectionCoords && (
          <div
            className="fixed z-50 -translate-x-1/2 -translate-y-full mb-2 bg-stone-900 text-white rounded-lg shadow-xl px-2.5 py-1.5 flex items-center gap-2 text-xs animate-in fade-in zoom-in-95 duration-150"
            style={{
              left: `${selectionCoords.x}px`,
              top: `${selectionCoords.y}px`,
            }}
          >
            <span className="text-[11px] text-stone-400 font-sans-ui">Sorot:</span>
            <button
              onClick={() => handleAddHighlight('amber')}
              className="w-4 h-4 rounded-full bg-amber-400 hover:scale-125 transition-transform cursor-pointer"
              title="Kuning"
            />
            <button
              onClick={() => handleAddHighlight('emerald')}
              className="w-4 h-4 rounded-full bg-emerald-400 hover:scale-125 transition-transform cursor-pointer"
              title="Hijau"
            />
            <button
              onClick={() => handleAddHighlight('rose')}
              className="w-4 h-4 rounded-full bg-rose-400 hover:scale-125 transition-transform cursor-pointer"
              title="Merah Muda"
            />
            <button
              onClick={() => handleAddHighlight('sky')}
              className="w-4 h-4 rounded-full bg-sky-400 hover:scale-125 transition-transform cursor-pointer"
              title="Biru"
            />
          </div>
        )}

        {/* Reading Content Area */}
        <main
          ref={contentContainerRef}
          onMouseUp={handleMouseUp}
          className="flex-1 overflow-y-auto px-4 sm:px-8 py-8 sm:py-16 custom-scrollbar"
        >
          <div className={`mx-auto ${maxWidthClass}`}>
            {/* Chapter Header */}
            <div className="mb-10 text-center border-b pb-6" style={{ borderColor: currentTheme.toolbarBorder }}>
              <div className="text-xs uppercase tracking-widest font-mono-data opacity-60 mb-2">
                Bab {currentChapterIndex + 1} dari {book.chapters.length} · ~{chapterReadingMinutes} menit baca
              </div>
              <h2
                className={`text-2xl sm:text-3xl font-semibold tracking-tight ${fontClass}`}
                style={{ textWrap: 'balance' }}
              >
                {currentChapter.title}
              </h2>
            </div>

            {/* Prose Content or Locked Chapter Notice */}
            {isChapterLocked ? (
              <div
                className="my-10 p-8 border rounded-2xl text-center space-y-4 shadow-lg animate-in fade-in duration-300"
                style={{
                  backgroundColor: currentTheme.panelBg,
                  borderColor: currentTheme.panelBorder,
                }}
              >
                <div className="w-16 h-16 bg-amber-500/10 text-amber-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                  <Lock className="w-8 h-8" />
                </div>
                <div>
                  <span className="text-[11px] uppercase tracking-widest font-bold text-amber-700 bg-amber-100 dark:bg-amber-950/60 dark:text-amber-300 px-3 py-1 rounded-full">
                    Kandungan Berbayar
                  </span>
                  <h3 className="text-2xl font-bold font-serif-book mt-3">Bab Ini Dikunci</h3>
                  <p className="text-xs max-w-md mx-auto opacity-75 mt-1.5 leading-relaxed">
                    Anda sedang menikmati pratonton percuma (bab 1 percuma). Untuk meneruskan pembacaan bab ini dan semua bab selanjutnya, sila dapatkan akses penuh buku ini.
                  </p>
                </div>

                <div
                  className="p-4 rounded-xl border max-w-sm mx-auto text-xs space-y-2 text-left"
                  style={{ borderColor: currentTheme.toolbarBorder }}
                >
                  <div className="flex justify-between items-center text-sm font-bold">
                    <span>Harga Akses Penuh:</span>
                    <span className="text-xl text-[#0E7749] font-black">
                      {book.currency || 'RM'} {(book.price || 10).toFixed(2)}
                    </span>
                  </div>
                  <div className="text-[11px] text-[#0E7749] flex items-center gap-1.5 font-medium pt-1 border-t" style={{ borderColor: currentTheme.toolbarBorder }}>
                    <ShieldCheck className="w-4 h-4 shrink-0" />
                    <span>95% hasil jualan disalurkan terus kepada penulis!</span>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => setIsPurchaseModalOpen(true)}
                    className="px-7 py-3 bg-[#0E7749] hover:bg-[#0a5634] text-white rounded-xl font-bold text-sm shadow-md transition-colors cursor-pointer inline-flex items-center gap-2"
                  >
                    <Lock className="w-4 h-4" />
                    <span>Beli Akses Buku Penuh Sekarang</span>
                  </button>
                  <p className="text-[10px] opacity-60 mt-2 font-mono">
                    Pembayaran selamat melalui FPX Online Banking, Kad, & eWallet
                  </p>
                </div>
              </div>
            ) : (
              <article
                className={`leading-relaxed ${fontClass} ${
                  settings.textAlign === 'justify' ? 'text-justify' : 'text-left'
                }`}
                style={{
                  fontSize: `${settings.fontSize}px`,
                  lineHeight: settings.lineHeight,
                }}
              >
                {chapterParagraphs.map((paragraph, pIdx) => {
                  // Check if this paragraph matches any highlight
                  const matchingHl = highlights.find(
                    (h) => h.chapterIndex === currentChapterIndex && paragraph.includes(h.selectedText)
                  );

                  if (matchingHl) {
                    const parts = paragraph.split(matchingHl.selectedText);
                    const colorClass =
                      matchingHl.color === 'amber'
                        ? 'bg-amber-200/50 dark:bg-amber-900/40 text-stone-900 dark:text-amber-100'
                        : matchingHl.color === 'emerald'
                        ? 'bg-emerald-200/50 dark:bg-emerald-900/40 text-stone-900 dark:text-emerald-100'
                        : matchingHl.color === 'rose'
                        ? 'bg-rose-200/50 dark:bg-rose-900/40 text-stone-900 dark:text-rose-100'
                        : 'bg-sky-200/50 dark:bg-sky-900/40 text-stone-900 dark:text-sky-100';

                    return (
                      <p key={pIdx} className="mb-6 indent-6">
                        {parts[0]}
                        <mark className={`px-1 py-0.5 rounded ${colorClass} cursor-pointer`} title="Sorotan Tersimpan">
                          {matchingHl.selectedText}
                        </mark>
                        {parts[1]}
                      </p>
                    );
                  }

                  return (
                    <p key={pIdx} className="mb-6 indent-6">
                      {paragraph}
                    </p>
                  );
                })}
              </article>
            )}

            {/* Chapter End & Bottom Navigation */}
            <div
              className="mt-16 pt-8 border-t flex flex-col sm:flex-row items-center justify-between gap-4 font-sans-ui"
              style={{ borderColor: currentTheme.toolbarBorder }}
            >
              <button
                onClick={handlePrevChapter}
                disabled={currentChapterIndex === 0}
                className="w-full sm:w-auto px-4 py-2.5 rounded-lg border text-xs font-medium flex items-center justify-center gap-2 disabled:opacity-30 cursor-pointer transition-colors"
                style={{
                  borderColor: currentTheme.toolbarBorder,
                  backgroundColor: currentTheme.panelBg,
                }}
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Bab Sebelumnya</span>
              </button>

              <div className="text-xs font-mono-data opacity-60">
                Selesai Bab {currentChapterIndex + 1}
              </div>

              <button
                onClick={handleNextChapter}
                disabled={currentChapterIndex === book.chapters.length - 1}
                className="w-full sm:w-auto px-5 py-2.5 rounded-lg bg-amber-900 text-white hover:bg-amber-800 text-xs font-medium flex items-center justify-center gap-2 disabled:opacity-30 cursor-pointer transition-colors shadow-xs"
              >
                <span>{currentChapterIndex === book.chapters.length - 1 ? 'Selesai Membaca' : 'Bab Selanjutnya'}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </main>

        {/* Drawer 1: Table of Contents (TOC) */}
        {showToc && (
          <aside
            className="w-72 sm:w-80 border-l flex flex-col z-30 transition-all shadow-xl animate-in slide-in-from-right-4 duration-200"
            style={{
              backgroundColor: currentTheme.panelBg,
              borderColor: currentTheme.panelBorder,
            }}
          >
            <div
              className="p-4 border-b flex items-center justify-between"
              style={{ borderColor: currentTheme.panelBorder }}
            >
              <h3 className="text-sm font-semibold">Daftar Isi ({book.chapters.length} Bab)</h3>
              <button
                onClick={() => setShowToc(false)}
                className="p-1 rounded hover:bg-black/5 dark:hover:bg-white/10 cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-2 space-y-1 custom-scrollbar">
              {book.chapters.map((ch, idx) => {
                const chLocked = !canAccessChapter(book, idx);
                const isFreePreview = !chLocked && (book.price ?? 0) > 0 && idx < (book.freeChapterCount ?? 1) && !isBookPurchased(book.id);

                return (
                  <div
                    key={ch.id}
                    onClick={() => {
                      setCurrentChapterIndex(idx);
                      setShowToc(false);
                    }}
                    className={`p-3 rounded-md text-xs cursor-pointer transition-colors flex items-center justify-between ${
                      currentChapterIndex === idx
                        ? 'bg-amber-900 text-white font-medium shadow-xs'
                        : 'hover:bg-black/5 dark:hover:bg-white/10 opacity-80 hover:opacity-100'
                    }`}
                  >
                    <div className="truncate pr-2 flex items-center gap-1.5">
                      <span className="font-mono-data opacity-70">
                        {(idx + 1).toString().padStart(2, '0')}.
                      </span>
                      <span className="truncate">{ch.title}</span>
                      {chLocked && <Lock className="w-3 h-3 text-amber-500 shrink-0" />}
                      {isFreePreview && (
                        <span className="text-[9px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded shrink-0">
                          Percuma
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] opacity-70 font-mono-data shrink-0">
                      {ch.wordCount} kata
                    </span>
                  </div>
                );
              })}
            </div>
          </aside>
        )}

        {/* Drawer 2: Reading Settings & Typography */}
        {showSettings && (
          <aside
            className="w-72 sm:w-80 border-l flex flex-col z-30 shadow-xl animate-in slide-in-from-right-4 duration-200 p-4 overflow-y-auto custom-scrollbar space-y-5"
            style={{
              backgroundColor: currentTheme.panelBg,
              borderColor: currentTheme.panelBorder,
            }}
          >
            <div
              className="pb-3 border-b flex items-center justify-between"
              style={{ borderColor: currentTheme.panelBorder }}
            >
              <h3 className="text-sm font-semibold">Pengaturan Membaca</h3>
              <button
                onClick={() => setShowSettings(false)}
                className="p-1 rounded hover:bg-black/5 dark:hover:bg-white/10 cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Themes */}
            <div>
              <label className="block text-xs font-medium opacity-70 mb-2">
                Suasana & Warna Kertas
              </label>
              <div className="grid grid-cols-5 gap-1.5">
                {(['sepia', 'light', 'dark', 'midnight', 'forest'] as ReaderThemeMode[]).map((mode) => (
                  <button
                    key={mode}
                    onClick={() => handleUpdateSettings({ theme: mode })}
                    className={`h-9 rounded-md border flex items-center justify-center cursor-pointer transition-all ${
                      settings.theme === mode ? 'ring-2 ring-amber-500 scale-105' : 'opacity-80'
                    }`}
                    style={{
                      backgroundColor: THEME_STYLES[mode].bg,
                      borderColor: THEME_STYLES[mode].toolbarBorder,
                      color: THEME_STYLES[mode].text,
                    }}
                    title={mode}
                  >
                    <span className="text-[11px] font-serif font-bold">Aa</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Font Family */}
            <div>
              <label className="block text-xs font-medium opacity-70 mb-2">
                Jenis Tipografi
              </label>
              <div className="grid grid-cols-3 gap-1.5 text-xs">
                <button
                  onClick={() => handleUpdateSettings({ fontFamily: 'serif' })}
                  className={`py-2 px-2 rounded-md border font-serif-book text-center cursor-pointer ${
                    settings.fontFamily === 'serif' ? 'border-amber-800 bg-amber-900/10 font-bold' : ''
                  }`}
                  style={{ borderColor: currentTheme.panelBorder }}
                >
                  Serif Klasik
                </button>
                <button
                  onClick={() => handleUpdateSettings({ fontFamily: 'sans' })}
                  className={`py-2 px-2 rounded-md border font-sans-ui text-center cursor-pointer ${
                    settings.fontFamily === 'sans' ? 'border-amber-800 bg-amber-900/10 font-bold' : ''
                  }`}
                  style={{ borderColor: currentTheme.panelBorder }}
                >
                  Sans Modern
                </button>
                <button
                  onClick={() => handleUpdateSettings({ fontFamily: 'mono' })}
                  className={`py-2 px-2 rounded-md border font-mono-data text-center cursor-pointer ${
                    settings.fontFamily === 'mono' ? 'border-amber-800 bg-amber-900/10 font-bold' : ''
                  }`}
                  style={{ borderColor: currentTheme.panelBorder }}
                >
                  Monospace
                </button>
              </div>
            </div>

            {/* Font Size */}
            <div>
              <div className="flex items-center justify-between text-xs font-medium opacity-70 mb-2">
                <span>Ukuran Huruf</span>
                <span className="font-mono-data">{settings.fontSize}px</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleUpdateSettings({ fontSize: Math.max(14, settings.fontSize - 2) })}
                  className="p-1.5 rounded border text-xs flex-1 cursor-pointer"
                  style={{ borderColor: currentTheme.panelBorder }}
                >
                  A-
                </button>
                <input
                  type="range"
                  min="14"
                  max="30"
                  step="1"
                  value={settings.fontSize}
                  onChange={(e) => handleUpdateSettings({ fontSize: Number(e.target.value) })}
                  className="flex-1 accent-amber-800"
                />
                <button
                  onClick={() => handleUpdateSettings({ fontSize: Math.min(30, settings.fontSize + 2) })}
                  className="p-1.5 rounded border text-xs flex-1 cursor-pointer"
                  style={{ borderColor: currentTheme.panelBorder }}
                >
                  A+
                </button>
              </div>
            </div>

            {/* Line Height */}
            <div>
              <label className="block text-xs font-medium opacity-70 mb-2">
                Jarak Spasi Baris
              </label>
              <div className="grid grid-cols-3 gap-1.5 text-xs">
                {[1.6, 1.8, 2.1].map((lh) => (
                  <button
                    key={lh}
                    onClick={() => handleUpdateSettings({ lineHeight: lh })}
                    className={`py-1.5 rounded border text-center cursor-pointer ${
                      settings.lineHeight === lh ? 'border-amber-800 bg-amber-900/10 font-bold' : ''
                    }`}
                    style={{ borderColor: currentTheme.panelBorder }}
                  >
                    {lh === 1.6 ? 'Rapat' : lh === 1.8 ? 'Nyaman' : 'Lebar'}
                  </button>
                ))}
              </div>
            </div>

            {/* Column Width */}
            <div>
              <label className="block text-xs font-medium opacity-70 mb-2">
                Lebar Halaman Baca
              </label>
              <div className="grid grid-cols-3 gap-1.5 text-xs">
                {(['narrow', 'medium', 'wide'] as const).map((w) => (
                  <button
                    key={w}
                    onClick={() => handleUpdateSettings({ maxWidth: w })}
                    className={`py-1.5 rounded border text-center cursor-pointer ${
                      settings.maxWidth === w ? 'border-amber-800 bg-amber-900/10 font-bold' : ''
                    }`}
                    style={{ borderColor: currentTheme.panelBorder }}
                  >
                    {w === 'narrow' ? 'Sempit' : w === 'medium' ? 'Sedang' : 'Lebar'}
                  </button>
                ))}
              </div>
            </div>

            {/* Text Alignment */}
            <div>
              <label className="block text-xs font-medium opacity-70 mb-2">
                Perataan Teks
              </label>
              <div className="grid grid-cols-2 gap-1.5 text-xs">
                <button
                  onClick={() => handleUpdateSettings({ textAlign: 'left' })}
                  className={`py-1.5 rounded border text-center cursor-pointer ${
                    settings.textAlign === 'left' ? 'border-amber-800 bg-amber-900/10 font-bold' : ''
                  }`}
                  style={{ borderColor: currentTheme.panelBorder }}
                >
                  Rata Kiri
                </button>
                <button
                  onClick={() => handleUpdateSettings({ textAlign: 'justify' })}
                  className={`py-1.5 rounded border text-center cursor-pointer ${
                    settings.textAlign === 'justify' ? 'border-amber-800 bg-amber-900/10 font-bold' : ''
                  }`}
                  style={{ borderColor: currentTheme.panelBorder }}
                >
                  Rata Kanan-Kiri
                </button>
              </div>
            </div>
          </aside>
        )}

        {/* Drawer 3: Bookmarks Drawer */}
        {showBookmarks && (
          <aside
            className="w-72 sm:w-80 border-l flex flex-col z-30 shadow-xl animate-in slide-in-from-right-4 duration-200"
            style={{
              backgroundColor: currentTheme.panelBg,
              borderColor: currentTheme.panelBorder,
            }}
          >
            <div
              className="p-4 border-b flex items-center justify-between"
              style={{ borderColor: currentTheme.panelBorder }}
            >
              <h3 className="text-sm font-semibold">Penanda Halaman ({bookmarks.length})</h3>
              <button
                onClick={() => setShowBookmarks(false)}
                className="p-1 rounded hover:bg-black/5 dark:hover:bg-white/10 cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-3 space-y-2 custom-scrollbar">
              {bookmarks.length === 0 ? (
                <div className="text-center py-8 text-xs opacity-50">
                  Belum ada penanda halaman. Klik ikon penanda di bilah atas untuk menyimpan posisi.
                </div>
              ) : (
                bookmarks.map((bm) => (
                  <div
                    key={bm.id}
                    onClick={() => {
                      setCurrentChapterIndex(bm.chapterIndex);
                      setShowBookmarks(false);
                    }}
                    className="p-3 rounded-lg border text-xs cursor-pointer hover:border-amber-800 transition-colors"
                    style={{
                      borderColor: currentTheme.panelBorder,
                    }}
                  >
                    <div className="flex items-center justify-between font-semibold mb-1">
                      <span>{bm.chapterTitle}</span>
                      <span className="font-mono-data opacity-60 text-[10px]">
                        {new Date(bm.createdAt).toLocaleDateString('id-ID')}
                      </span>
                    </div>
                    <p className="opacity-80 italic line-clamp-2">{bm.snippet}</p>
                  </div>
                ))
              )}
            </div>
          </aside>
        )}

        {/* TTS Floating Audio Bar (Bottom) */}
        {isSpeaking && (
          <div
            className="absolute bottom-4 left-1/2 -translate-x-1/2 z-40 px-4 py-2.5 rounded-full shadow-2xl flex items-center gap-3 text-xs backdrop-blur-md animate-in slide-in-from-bottom-4 duration-200 border"
            style={{
              backgroundColor: currentTheme.toolbarBg,
              borderColor: currentTheme.toolbarBorder,
            }}
          >
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-medium">Membacakan Teks (TTS)</span>
            </div>

            <div className="h-4 w-px bg-stone-300 dark:bg-stone-700" />

            <div className="flex items-center gap-1">
              {[0.75, 1.0, 1.25, 1.5].map((rate) => (
                <button
                  key={rate}
                  onClick={() => handleTtsRateChange(rate)}
                  className={`px-2 py-0.5 rounded text-[11px] font-mono-data cursor-pointer ${
                    ttsRate === rate ? 'bg-amber-900 text-white font-semibold' : 'hover:bg-black/10'
                  }`}
                >
                  {rate}x
                </button>
              ))}
            </div>

            <button
              onClick={toggleTTS}
              className="px-2.5 py-1 rounded bg-rose-600 hover:bg-rose-700 text-white text-[11px] font-medium cursor-pointer"
            >
              Hentikan
            </button>
          </div>
        )}

        {/* Purchase Modal for Locked Chapters */}
        <BookPurchaseModal
          isOpen={isPurchaseModalOpen}
          book={book}
          onClose={() => setIsPurchaseModalOpen(false)}
          onPurchaseSuccess={(updated) => {
            setIsPurchaseModalOpen(false);
            onBookUpdated(updated);
          }}
        />
      </div>
    </div>
  );
};
