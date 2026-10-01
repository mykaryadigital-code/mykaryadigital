import React, { useState } from 'react';
import { X, CheckCircle2, CreditCard, Building2, Sparkles, BookOpen } from 'lucide-react';
import { Book } from '../types/book';
import { useMarketplace } from '../context/MarketplaceContext';
import { BookCover } from './BookCover';

interface BookPurchaseModalProps {
  isOpen: boolean;
  book: Book | null;
  onClose: () => void;
  onPurchaseSuccess: (book: Book) => void;
}

export const BookPurchaseModal: React.FC<BookPurchaseModalProps> = ({
  isOpen,
  book,
  onClose,
  onPurchaseSuccess,
}) => {
  const { buyBook } = useMarketplace();
  const [paymentMethod, setPaymentMethod] = useState<'fpx' | 'card' | 'tng'>('fpx');
  const [isProcessing, setIsProcessing] = useState(false);
  const [successData, setSuccessData] = useState<{ authorShare: number; platformShare: number } | null>(null);

  if (!isOpen || !book) return null;

  const price = book.price ?? 10.0;
  const platformFee = Math.round(price * 0.05 * 100) / 100; // 5%
  const authorRoyalty = Math.round((price - platformFee) * 100) / 100; // 95%

  const handleConfirmPurchase = async () => {
    setIsProcessing(true);
    try {
      const res = await buyBook(book);
      setIsProcessing(false);
      setSuccessData(res);
      setTimeout(() => {
        onPurchaseSuccess(book);
      }, 1400);
    } catch (e) {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white rounded-[20px] shadow-2xl max-w-md w-full overflow-hidden border border-[#E2E8F0] flex flex-col">
        {/* Header */}
        <div className="bg-[#006B57] text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-emerald-200" />
            <h3 className="font-bold text-base">Beli Akses Buku Digital Penuh</h3>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white p-1 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        {successData ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-16 h-16 bg-[#ECFDF5] text-[#006B57] rounded-full flex items-center justify-center mx-auto animate-bounce">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h4 className="text-xl font-bold text-[#102A27]">Pembelian Berjaya!</h4>
            <p className="text-xs text-[#64748B] max-w-xs mx-auto">
              Semua bab buku <strong>"{book.title}"</strong> telah dibuka sepenuhnya. Selamat membaca!
            </p>
            <div className="bg-[#ECFDF5] border border-[#A7F3D0] rounded-[12px] p-3 text-xs text-[#047857] font-medium text-left">
              <p className="font-bold mb-1">Agihan Bayaran Telus:</p>
              <div className="flex justify-between font-mono-data">
                <span>Penulis ({book.author}) terima (95%):</span>
                <strong>RM {successData.authorShare.toFixed(2)}</strong>
              </div>
              <div className="flex justify-between text-[#64748B] font-mono-data">
                <span>Caj Pengurusan Platform (5%):</span>
                <span>RM {successData.platformShare.toFixed(2)}</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-6 space-y-5">
            {/* Book Mini Card */}
            <div className="flex gap-4 p-3 bg-[#F7F9F8] border border-[#E2E8F0] rounded-[14px] items-center">
              <div className="w-16 h-22 shrink-0 rounded-[8px] overflow-hidden shadow-xs">
                <BookCover
                  title={book.title}
                  author={book.author}
                  coverUrl={book.coverUrl}
                  coverTheme={book.coverTheme}
                  size="sm"
                />
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-[10px] uppercase font-bold text-[#006B57] tracking-wider block">
                  {book.category}
                </span>
                <h4 className="font-bold text-sm text-[#102A27] truncate mt-0.5">{book.title}</h4>
                <p className="text-xs text-[#64748B] truncate">{book.author}</p>
                <div className="mt-1 text-base font-black text-[#006B57] font-mono-data">
                  {book.currency || 'RM'} {price.toFixed(2)}
                </div>
              </div>
            </div>

            {/* Split Transparency */}
            <div className="bg-[#ECFDF5] border border-[#A7F3D0] rounded-[12px] p-3 text-xs text-[#102A27] space-y-1">
              <span className="font-bold text-[#006B57] block">Ketelusan Royalti (95% Penulis / 5% Platform):</span>
              <div className="flex justify-between text-[#047857] font-mono-data">
                <span>Penulis Terima (95%):</span>
                <strong>RM {authorRoyalty.toFixed(2)}</strong>
              </div>
              <div className="flex justify-between text-[#64748B] font-mono-data">
                <span>Caj Pengurusan Server (5%):</span>
                <span>RM {platformFee.toFixed(2)}</span>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div>
              <label className="block text-xs font-bold text-[#102A27] mb-1.5">
                Pilih Kaedah Bayaran
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('fpx')}
                  className={`p-2.5 rounded-[10px] border text-xs font-bold flex flex-col items-center justify-center gap-1 cursor-pointer transition-all ${
                    paymentMethod === 'fpx'
                      ? 'border-[#006B57] bg-[#ECFDF5] text-[#006B57] shadow-2xs'
                      : 'border-[#CBD5E1] text-[#64748B] hover:bg-slate-50'
                  }`}
                >
                  <Building2 className="w-4 h-4" />
                  <span>FPX</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  className={`p-2.5 rounded-[10px] border text-xs font-bold flex flex-col items-center justify-center gap-1 cursor-pointer transition-all ${
                    paymentMethod === 'card'
                      ? 'border-[#006B57] bg-[#ECFDF5] text-[#006B57] shadow-2xs'
                      : 'border-[#CBD5E1] text-[#64748B] hover:bg-slate-50'
                  }`}
                >
                  <CreditCard className="w-4 h-4" />
                  <span>Kad Bank</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('tng')}
                  className={`p-2.5 rounded-[10px] border text-xs font-bold flex flex-col items-center justify-center gap-1 cursor-pointer transition-all ${
                    paymentMethod === 'tng'
                      ? 'border-[#006B57] bg-[#ECFDF5] text-[#006B57] shadow-2xs'
                      : 'border-[#CBD5E1] text-[#64748B] hover:bg-slate-50'
                  }`}
                >
                  <Sparkles className="w-4 h-4" />
                  <span>TnG eWallet</span>
                </button>
              </div>
            </div>

            {/* CTA Buy Button */}
            <button
              onClick={handleConfirmPurchase}
              disabled={isProcessing}
              className="w-full h-11 bg-[#006B57] hover:bg-[#063F35] text-white rounded-[12px] font-bold text-xs sm:text-sm transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isProcessing ? (
                <span>Memproses Pembayaran...</span>
              ) : (
                <span>Beli Sekarang — RM {price.toFixed(2)}</span>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
