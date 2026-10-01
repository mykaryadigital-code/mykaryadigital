export interface AuthorProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  bankName: string;
  bankAccountNumber: string;
  isSubscribed: boolean;
  subscriptionPlan: 'year_1' | 'renewal';
  subscriptionFeePaid: number; // 20 or 10
  subscriptionDate: string;
  subscriptionExpiryDate: string;
  totalEarnings: number; // 95% accumulated
  balance: number; // Available to withdraw
  withdrawnAmount: number;
}

export interface PlatformTransaction {
  id: string;
  type: 'book_sale' | 'author_subscription';
  bookId?: string;
  bookTitle?: string;
  authorId?: string;
  authorName?: string;
  buyerName?: string;
  buyerEmail?: string;
  totalAmount: number; // e.g. RM 10.00 or RM 20.00
  amount?: number; // alias for totalAmount
  authorShare: number; // e.g. RM 9.50 (95%)
  platformShare: number; // e.g. RM 0.50 (5%)
  date: string;
  status: 'completed' | 'pending';
}

export interface PlatformStats {
  totalPlatformCommission: number; // 5% cuts
  totalSubscriptionFees: number; // RM20 and RM10 fees
  totalBooksSold: number;
  totalRegisteredAuthors: number;
}
