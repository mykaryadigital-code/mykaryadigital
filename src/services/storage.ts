import { Book, Bookmark, Highlight, CustomShelf, ReaderSettings } from '../types/book';
import { INITIAL_BOOKS } from '../data/initialBooks';

const DB_NAME = 'PustakaDigitalDB';
const DB_VERSION = 1;

let dbPromise: Promise<IDBDatabase> | null = null;

function getDB(): Promise<IDBDatabase> {
  if (dbPromise) return dbPromise;

  dbPromise = new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;

      if (!db.objectStoreNames.contains('books')) {
        const bookStore = db.createObjectStore('books', { keyPath: 'id' });
        bookStore.createIndex('category', 'category', { unique: false });
        bookStore.createIndex('status', 'status', { unique: false });
        bookStore.createIndex('dateAdded', 'dateAdded', { unique: false });
      }

      if (!db.objectStoreNames.contains('bookmarks')) {
        const bookmarkStore = db.createObjectStore('bookmarks', { keyPath: 'id' });
        bookmarkStore.createIndex('bookId', 'bookId', { unique: false });
      }

      if (!db.objectStoreNames.contains('highlights')) {
        const highlightStore = db.createObjectStore('highlights', { keyPath: 'id' });
        highlightStore.createIndex('bookId', 'bookId', { unique: false });
      }

      if (!db.objectStoreNames.contains('shelves')) {
        db.createObjectStore('shelves', { keyPath: 'id' });
      }

      if (!db.objectStoreNames.contains('settings')) {
        db.createObjectStore('settings', { keyPath: 'key' });
      }
    };

    request.onsuccess = async (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      // Auto seed initial books if database is empty
      await autoSeedIfEmpty(db);
      resolve(db);
    };

    request.onerror = (event) => {
      console.error('IndexedDB error:', (event.target as IDBOpenDBRequest).error);
      reject((event.target as IDBOpenDBRequest).error);
    };
  });

  return dbPromise;
}

async function autoSeedIfEmpty(db: IDBDatabase): Promise<void> {
  return new Promise((resolve) => {
    const tx = db.transaction('books', 'readonly');
    const store = tx.objectStore('books');
    const countReq = store.count();

    countReq.onsuccess = () => {
      if (countReq.result === 0) {
        const writeTx = db.transaction(['books', 'shelves'], 'readwrite');
        const bookStore = writeTx.objectStore('books');
        INITIAL_BOOKS.forEach((b) => bookStore.put(b));

        const shelfStore = writeTx.objectStore('shelves');
        const defaultShelves: CustomShelf[] = [
          { id: 'shelf-klasik', name: 'Koleksi Klasik Nusantara', description: 'Karya sastra dan roman terkemuka', createdAt: new Date().toISOString() },
          { id: 'shelf-favorit', name: 'Buku Favorit Pilihan', description: 'Buku yang paling berkesan', createdAt: new Date().toISOString() }
        ];
        defaultShelves.forEach((s) => shelfStore.put(s));

        writeTx.oncomplete = () => resolve();
        writeTx.onerror = () => resolve();
      } else {
        resolve();
      }
    };
    countReq.onerror = () => resolve();
  });
}

/* ================= BOOKS CRUD ================= */

export async function getAllBooks(): Promise<Book[]> {
  const db = await getDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('books', 'readonly');
    const store = tx.objectStore('books');
    const request = store.getAll();

    request.onsuccess = () => {
      const rawBooks: Book[] = request.result || [];
      const existingIds = new Set(rawBooks.map((b) => b.id));
      const missingInitial = INITIAL_BOOKS.filter((ib) => !existingIds.has(ib.id));
      const allList = [...rawBooks, ...missingInitial];

      const books: Book[] = allList.map((b) => {
        const match = INITIAL_BOOKS.find((ib) => ib.id === b.id || ib.title === b.title);
        const updated: Book = {
          ...b,
          imageUrl: b.imageUrl || match?.imageUrl,
          coverUrl: b.coverUrl || match?.coverUrl,
        };

        if (b.price === undefined || b.price === null) {
          return {
            ...updated,
            price: match?.price ?? 25.0,
            currency: match?.currency ?? 'RM',
            sku: match?.sku ?? `MYK-${b.id.substring(0, 8).toUpperCase()}`,
            salesCount: match?.salesCount ?? 25,
          };
        }
        return updated;
      });
      resolve(books);
    };
    request.onerror = () => reject(request.error);
  });
}

export async function getBookById(id: string): Promise<Book | null> {
  const db = await getDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('books', 'readonly');
    const store = tx.objectStore('books');
    const request = store.get(id);

    request.onsuccess = () => resolve(request.result || null);
    request.onerror = () => reject(request.error);
  });
}

export async function saveBook(book: Book): Promise<void> {
  const db = await getDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('books', 'readwrite');
    const store = tx.objectStore('books');
    const request = store.put(book);

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

export async function deleteBook(id: string): Promise<void> {
  const db = await getDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(['books', 'bookmarks', 'highlights'], 'readwrite');
    const bookStore = tx.objectStore('books');
    bookStore.delete(id);

    // Delete associated bookmarks
    const bStore = tx.objectStore('bookmarks');
    const bIndex = bStore.index('bookId');
    const bReq = bIndex.getAllKeys(id);
    bReq.onsuccess = () => {
      (bReq.result || []).forEach((k) => bStore.delete(k));
    };

    // Delete associated highlights
    const hStore = tx.objectStore('highlights');
    const hIndex = hStore.index('bookId');
    const hReq = hIndex.getAllKeys(id);
    hReq.onsuccess = () => {
      (hReq.result || []).forEach((k) => hStore.delete(k));
    };

    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

/* ================= BOOKMARKS CRUD ================= */

export async function getBookmarksByBookId(bookId: string): Promise<Bookmark[]> {
  const db = await getDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('bookmarks', 'readonly');
    const store = tx.objectStore('bookmarks');
    const index = store.index('bookId');
    const request = index.getAll(bookId);

    request.onsuccess = () => resolve(request.result || []);
    request.onerror = () => reject(request.error);
  });
}

export async function saveBookmark(bookmark: Bookmark): Promise<void> {
  const db = await getDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('bookmarks', 'readwrite');
    const store = tx.objectStore('bookmarks');
    const request = store.put(bookmark);

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

export async function deleteBookmark(id: string): Promise<void> {
  const db = await getDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('bookmarks', 'readwrite');
    const store = tx.objectStore('bookmarks');
    const request = store.delete(id);

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

/* ================= HIGHLIGHTS CRUD ================= */

export async function getHighlightsByBookId(bookId: string): Promise<Highlight[]> {
  const db = await getDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('highlights', 'readonly');
    const store = tx.objectStore('highlights');
    const index = store.index('bookId');
    const request = index.getAll(bookId);

    request.onsuccess = () => resolve(request.result || []);
    request.onerror = () => reject(request.error);
  });
}

export async function saveHighlight(highlight: Highlight): Promise<void> {
  const db = await getDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('highlights', 'readwrite');
    const store = tx.objectStore('highlights');
    const request = store.put(highlight);

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

export async function deleteHighlight(id: string): Promise<void> {
  const db = await getDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('highlights', 'readwrite');
    const store = tx.objectStore('highlights');
    const request = store.delete(id);

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

/* ================= SHELVES CRUD ================= */

export async function getShelves(): Promise<CustomShelf[]> {
  const db = await getDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('shelves', 'readonly');
    const store = tx.objectStore('shelves');
    const request = store.getAll();

    request.onsuccess = () => resolve(request.result || []);
    request.onerror = () => reject(request.error);
  });
}

export async function saveShelf(shelf: CustomShelf): Promise<void> {
  const db = await getDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('shelves', 'readwrite');
    const store = tx.objectStore('shelves');
    const request = store.put(shelf);

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

export async function deleteShelf(id: string): Promise<void> {
  const db = await getDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('shelves', 'readwrite');
    const store = tx.objectStore('shelves');
    const request = store.delete(id);

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

/* ================= SETTINGS ================= */

export const DEFAULT_READER_SETTINGS: ReaderSettings = {
  theme: 'sepia',
  fontSize: 18,
  fontFamily: 'serif',
  lineHeight: 1.8,
  maxWidth: 'medium',
  textAlign: 'left',
};

export async function getReaderSettings(): Promise<ReaderSettings> {
  try {
    const db = await getDB();
    return new Promise((resolve) => {
      const tx = db.transaction('settings', 'readonly');
      const store = tx.objectStore('settings');
      const request = store.get('reader_settings');

      request.onsuccess = () => {
        if (request.result && request.result.value) {
          resolve({ ...DEFAULT_READER_SETTINGS, ...request.result.value });
        } else {
          resolve(DEFAULT_READER_SETTINGS);
        }
      };
      request.onerror = () => resolve(DEFAULT_READER_SETTINGS);
    });
  } catch {
    return DEFAULT_READER_SETTINGS;
  }
}

export async function saveReaderSettings(settings: ReaderSettings): Promise<void> {
  try {
    const db = await getDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction('settings', 'readwrite');
      const store = tx.objectStore('settings');
      const request = store.put({ key: 'reader_settings', value: settings });

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  } catch (e) {
    console.error('Error saving reader settings:', e);
  }
}

/* ================= EXPORT & BACKUP ================= */

export async function exportAllData(): Promise<string> {
  const books = await getAllBooks();
  const db = await getDB();

  return new Promise((resolve, reject) => {
    const tx = db.transaction(['bookmarks', 'highlights', 'shelves'], 'readonly');
    const bStore = tx.objectStore('bookmarks').getAll();
    const hStore = tx.objectStore('highlights').getAll();
    const sStore = tx.objectStore('shelves').getAll();

    tx.oncomplete = () => {
      const exportObject = {
        version: 1,
        exportedAt: new Date().toISOString(),
        books,
        bookmarks: bStore.result || [],
        highlights: hStore.result || [],
        shelves: sStore.result || []
      };
      resolve(JSON.stringify(exportObject, null, 2));
    };

    tx.onerror = () => reject(tx.error);
  });
}

export async function importAllData(jsonString: string): Promise<{ bookCount: number }> {
  const parsed = JSON.parse(jsonString);
  if (!parsed.books || !Array.isArray(parsed.books)) {
    throw new Error('Format berkas cadangan (backup) tidak valid.');
  }

  const db = await getDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(['books', 'bookmarks', 'highlights', 'shelves'], 'readwrite');
    const bookStore = tx.objectStore('books');
    const bookmarkStore = tx.objectStore('bookmarks');
    const highlightStore = tx.objectStore('highlights');
    const shelfStore = tx.objectStore('shelves');

    parsed.books.forEach((b: Book) => bookStore.put(b));

    if (Array.isArray(parsed.bookmarks)) {
      parsed.bookmarks.forEach((bm: Bookmark) => bookmarkStore.put(bm));
    }
    if (Array.isArray(parsed.highlights)) {
      parsed.highlights.forEach((h: Highlight) => highlightStore.put(h));
    }
    if (Array.isArray(parsed.shelves)) {
      parsed.shelves.forEach((s: CustomShelf) => shelfStore.put(s));
    }

    tx.oncomplete = () => resolve({ bookCount: parsed.books.length });
    tx.onerror = () => reject(tx.error);
  });
}
