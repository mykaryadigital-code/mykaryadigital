export type BookCategory = 
  | 'Panduan'
  | 'Fiksi Umum'
  | 'Novel Sastra'
  | 'Resepi'
  | 'Fantasi & Petualangan'
  | 'Misteri & Detektif'
  | 'Romansa'
  | 'Fiksi Ilmiah'
  | 'Sejarah & Biografi'
  | 'Non-Fiksi & Esai'
  | 'Puisi & Sastra Klasik'
  | 'Lainnya';

export type BookStatus = 'reading' | 'completed' | 'want_to_read' | 'unread';

export interface Chapter {
  id: string;
  title: string;
  content: string; // Plain text or clean HTML paragraphs
  wordCount: number;
}

export interface Bookmark {
  id: string;
  bookId: string;
  chapterIndex: number;
  chapterTitle: string;
  percentage: number;
  snippet: string;
  note?: string;
  createdAt: string;
}

export interface Highlight {
  id: string;
  bookId: string;
  chapterIndex: number;
  selectedText: string;
  color: 'amber' | 'emerald' | 'rose' | 'sky';
  note?: string;
  createdAt: string;
}

export interface CoverTheme {
  variant: 'burgundy' | 'navy' | 'emerald' | 'noir' | 'amber' | 'terracotta' | 'slate';
  pattern: 'classic_border' | 'geometric' | 'minimal' | 'ornate';
}

export interface Book {
  id: string;
  title: string;
  author: string;
  description: string;
  category: BookCategory;
  status: BookStatus;
  isFavorite: boolean;
  rating: number; // 0 to 5
  price?: number; // Harga produk digital
  currency?: 'RM' | 'Rp' | 'USD'; // Mata uang (default: RM)
  sku?: string; // Kod produk digital / ISBN
  salesCount?: number; // Jumlah terjual / unduhan
  freeChapterCount?: number; // Bilangan bab percuma untuk pembaca (default: 1)
  authorId?: string; // ID penulis pemilik royalti
  coverUrl?: string; // Uploaded custom image (data URL)
  coverTheme: CoverTheme;
  tags: string[];
  shelf?: string; // Custom shelf name
  totalWords: number;
  estimatedReadTimeMinutes: number;
  dateAdded: string;
  lastReadDate?: string;
  currentProgress: number; // 0 - 100
  currentChapterIndex: number;
  scrollPosition?: number;
  chapters: Chapter[];
  fileType: 'epub' | 'txt' | 'custom' | 'md';
  originalFileName?: string;
}

export type ReaderThemeMode = 'sepia' | 'dark' | 'light' | 'midnight' | 'forest';
export type ReaderFontFamily = 'serif' | 'sans' | 'mono';
export type ReaderColumnWidth = 'narrow' | 'medium' | 'wide' | 'full';

export interface ReaderSettings {
  theme: ReaderThemeMode;
  fontSize: number; // e.g. 18
  fontFamily: ReaderFontFamily;
  lineHeight: number; // e.g. 1.8
  maxWidth: ReaderColumnWidth;
  textAlign: 'left' | 'justify';
}

export interface CustomShelf {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
}
