import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthorProfile, PlatformTransaction, PlatformStats } from '../types/marketplace';
import { Book } from '../types/book';

interface MarketplaceContextType {
  currentRole: 'reader' | 'author' | 'admin';
  setCurrentRole: (role: 'reader' | 'author' | 'admin') => void;
  authorProfile: AuthorProfile | null;
  transactions: PlatformTransaction[];
  purchasedBookIds: string[];
  stats: PlatformStats;
  subscribeAsAuthor: (data: {
    name: string;
    email: string;
    phone?: string;
    bankName: string;
    bankAccountNumber: string;
  }) => Promise<boolean>;
  renewAuthorSubscription: () => Promise<boolean>;
  buyBook: (book: Book) => Promise<{ success: boolean; authorShare: number; platformShare: number }>;
  withdrawEarnings: (amount: number) => Promise<boolean>;
  isBookPurchased: (bookId: string) => boolean;
  canAccessChapter: (book: Book, chapterIndex: number) => boolean;
}

const MarketplaceContext = createContext<MarketplaceContextType | undefined>(undefined);

const INITIAL_AUTHOR: AuthorProfile = {
  id: 'author-default',
  name: 'Karya Digital Author',
  email: 'penulis@karyadigital.my',
  phone: '+6012-3456789',
  bankName: 'Maybank',
  bankAccountNumber: '514012345678',
  isSubscribed: true,
  subscriptionPlan: 'year_1',
  subscriptionFeePaid: 20.0,
  subscriptionDate: '2026-01-15T00:00:00.000Z',
  subscriptionExpiryDate: '2027-01-15T00:00:00.000Z',
  totalEarnings: 275.50, // 95%
  balance: 275.50,
  withdrawnAmount: 0,
};

const INITIAL_TRANSACTIONS: PlatformTransaction[] = [
  {
    id: 'tx-sub-001',
    type: 'author_subscription',
    authorId: 'author-default',
    authorName: 'Karya Digital Author',
    totalAmount: 20.0,
    authorShare: 0,
    platformShare: 20.0,
    date: '2026-01-15T09:30:00.000Z',
    status: 'completed',
  },
  {
    id: 'tx-sale-001',
    type: 'book_sale',
    bookId: 'buku-vanderwijck',
    bookTitle: 'Tenggelamnya Kapal Van der Wijck',
    authorId: 'author-default',
    authorName: 'Buya Hamka',
    buyerName: 'Ahmad Hafiz',
    buyerEmail: 'hafiz@example.com',
    totalAmount: 29.0,
    authorShare: 27.55, // 95%
    platformShare: 1.45, // 5%
    date: '2026-09-20T14:20:00.000Z',
    status: 'completed',
  },
  {
    id: 'tx-sale-002',
    type: 'book_sale',
    bookId: 'buku-resepi-bonda',
    bookTitle: 'Resepi Warisan Dapur Bonda',
    authorId: 'author-default',
    authorName: 'Chef Fatimah Zahra',
    buyerName: 'Nurul Huda',
    buyerEmail: 'huda@example.com',
    totalAmount: 28.0,
    authorShare: 26.60, // 95%
    platformShare: 1.40, // 5%
    date: '2026-09-27T10:15:00.000Z',
    status: 'completed',
  },
  {
    id: 'tx-sale-003',
    type: 'book_sale',
    bookId: 'buku-senja',
    bookTitle: 'Filosofi Aroma Senja: Catatan dari Sudut Kafe Kecil',
    authorId: 'author-default',
    authorName: 'Ahmad Rian Pratama',
    buyerName: 'Siti Aminah',
    buyerEmail: 'siti@example.com',
    totalAmount: 10.0,
    authorShare: 9.50, // 95%
    platformShare: 0.50, // 5%
    date: '2026-09-28T11:00:00.000Z',
    status: 'completed',
  }
];

export const MarketplaceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentRole, setCurrentRole] = useState<'reader' | 'author' | 'admin'>('reader');
  
  const [authorProfile, setAuthorProfile] = useState<AuthorProfile | null>(() => {
    const saved = localStorage.getItem('kd_author_profile');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return INITIAL_AUTHOR;
      }
    }
    return INITIAL_AUTHOR;
  });

  const [transactions, setTransactions] = useState<PlatformTransaction[]>(() => {
    const saved = localStorage.getItem('kd_transactions');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return INITIAL_TRANSACTIONS;
      }
    }
    return INITIAL_TRANSACTIONS;
  });

  const [purchasedBookIds, setPurchasedBookIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('kd_purchased_books');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return ['buku-vanderwijck'];
      }
    }
    return ['buku-vanderwijck']; // Give 1 purchased book initially for demo
  });

  useEffect(() => {
    if (authorProfile) {
      localStorage.setItem('kd_author_profile', JSON.stringify(authorProfile));
    }
  }, [authorProfile]);

  useEffect(() => {
    localStorage.setItem('kd_transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('kd_purchased_books', JSON.stringify(purchasedBookIds));
  }, [purchasedBookIds]);

  // Calculate platform stats
  const stats: PlatformStats = {
    totalPlatformCommission: transactions
      .filter((t) => t.type === 'book_sale')
      .reduce((sum, t) => sum + t.platformShare, 0),
    totalSubscriptionFees: transactions
      .filter((t) => t.type === 'author_subscription')
      .reduce((sum, t) => sum + t.platformShare, 0),
    totalBooksSold: transactions.filter((t) => t.type === 'book_sale').length,
    totalRegisteredAuthors: authorProfile?.isSubscribed ? 1 : 0,
  };

  const subscribeAsAuthor = async (data: {
    name: string;
    email: string;
    phone?: string;
    bankName: string;
    bankAccountNumber: string;
  }): Promise<boolean> => {
    const now = new Date();
    const expiry = new Date();
    expiry.setFullYear(now.getFullYear() + 1);

    const fee = 20.0; // Tahun pertama RM 20

    const newProfile: AuthorProfile = {
      id: `author-${Date.now()}`,
      name: data.name,
      email: data.email,
      phone: data.phone,
      bankName: data.bankName,
      bankAccountNumber: data.bankAccountNumber,
      isSubscribed: true,
      subscriptionPlan: 'year_1',
      subscriptionFeePaid: fee,
      subscriptionDate: now.toISOString(),
      subscriptionExpiryDate: expiry.toISOString(),
      totalEarnings: 0,
      balance: 0,
      withdrawnAmount: 0,
    };

    const subTx: PlatformTransaction = {
      id: `tx-sub-${Date.now()}`,
      type: 'author_subscription',
      authorId: newProfile.id,
      authorName: newProfile.name,
      totalAmount: fee,
      authorShare: 0,
      platformShare: fee,
      date: now.toISOString(),
      status: 'completed',
    };

    setAuthorProfile(newProfile);
    setTransactions((prev) => [subTx, ...prev]);
    setCurrentRole('author');
    return true;
  };

  const renewAuthorSubscription = async (): Promise<boolean> => {
    if (!authorProfile) return false;
    const now = new Date();
    const expiry = new Date();
    expiry.setFullYear(now.getFullYear() + 1);

    const renewalFee = 10.0; // Tahun seterusnya RM 10

    const updatedProfile: AuthorProfile = {
      ...authorProfile,
      isSubscribed: true,
      subscriptionPlan: 'renewal',
      subscriptionFeePaid: renewalFee,
      subscriptionDate: now.toISOString(),
      subscriptionExpiryDate: expiry.toISOString(),
    };

    const subTx: PlatformTransaction = {
      id: `tx-sub-${Date.now()}`,
      type: 'author_subscription',
      authorId: updatedProfile.id,
      authorName: updatedProfile.name,
      totalAmount: renewalFee,
      authorShare: 0,
      platformShare: renewalFee,
      date: now.toISOString(),
      status: 'completed',
    };

    setAuthorProfile(updatedProfile);
    setTransactions((prev) => [subTx, ...prev]);
    return true;
  };

  const buyBook = async (
    book: Book
  ): Promise<{ success: boolean; authorShare: number; platformShare: number }> => {
    const price = book.price || 0;
    
    // Formula: Penulis 95%, Admin Platform 5%
    const platformShare = Math.round(price * 0.05 * 100) / 100; // 5%
    const authorShare = Math.round((price - platformShare) * 100) / 100; // 95%

    const saleTx: PlatformTransaction = {
      id: `tx-sale-${Date.now()}`,
      type: 'book_sale',
      bookId: book.id,
      bookTitle: book.title,
      authorId: book.authorId || authorProfile?.id || 'author-default',
      authorName: book.author,
      buyerName: 'Pembaca Karya Digital',
      buyerEmail: 'pembaca@karyadigital.my',
      totalAmount: price,
      authorShare: authorShare,
      platformShare: platformShare,
      date: new Date().toISOString(),
      status: 'completed',
    };

    // Update transactions
    setTransactions((prev) => [saleTx, ...prev]);

    // Update author balance if matched
    if (authorProfile) {
      setAuthorProfile((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          totalEarnings: Math.round((prev.totalEarnings + authorShare) * 100) / 100,
          balance: Math.round((prev.balance + authorShare) * 100) / 100,
        };
      });
    }

    // Add book to purchased list
    setPurchasedBookIds((prev) => {
      if (prev.includes(book.id)) return prev;
      return [...prev, book.id];
    });

    return { success: true, authorShare, platformShare };
  };

  const withdrawEarnings = async (amount: number): Promise<boolean> => {
    if (!authorProfile || authorProfile.balance < amount) return false;
    setAuthorProfile((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        balance: Math.round((prev.balance - amount) * 100) / 100,
        withdrawnAmount: Math.round((prev.withdrawnAmount + amount) * 100) / 100,
      };
    });
    return true;
  };

  const isBookPurchased = (bookId: string): boolean => {
    return purchasedBookIds.includes(bookId);
  };

  const canAccessChapter = (book: Book, chapterIndex: number): boolean => {
    // If reader bought it, full access!
    if (purchasedBookIds.includes(book.id)) return true;

    // If free book (price <= 0), full access!
    if (!book.price || book.price <= 0) return true;

    // Author or admin previewing their books
    if (currentRole === 'admin') return true;

    // Free preview rule: Chapters below freeChapterCount are 100% free!
    const freeLimit = book.freeChapterCount !== undefined ? book.freeChapterCount : 1;
    return chapterIndex < freeLimit;
  };

  return (
    <MarketplaceContext.Provider
      value={{
        currentRole,
        setCurrentRole,
        authorProfile,
        transactions,
        purchasedBookIds,
        stats,
        subscribeAsAuthor,
        renewAuthorSubscription,
        buyBook,
        withdrawEarnings,
        isBookPurchased,
        canAccessChapter,
      }}
    >
      {children}
    </MarketplaceContext.Provider>
  );
};

export const useMarketplace = () => {
  const context = useContext(MarketplaceContext);
  if (!context) {
    throw new Error('useMarketplace must be used within a MarketplaceProvider');
  }
  return context;
};
