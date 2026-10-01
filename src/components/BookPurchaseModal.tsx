import React, { useState } from 'react';
import { X, CheckCircle2, ShieldCheck, CreditCard, Building2, Sparkles, BookOpen, LockOpen } from 'lucide-react';
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
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-100 flex flex-col">
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-emerald-400" />
            <h3 className="font-bold text-base">Beli Akses Buku Digital Penuh</h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        {successData ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-16 h-16 bg-emerald-100 text-[#0E7749] rounded-full flex items-center justify-center mx-auto animate-bounce">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h4 className="text-xl font-bold text-slate-900">Pembelian Berjaya!</h4>
            <p className="text-xs text-slate-600 max-w-xs mx-auto">
              Semua bab buku <strong>"{book.title}"</strong> telah dibuka sepenuhnya. Selamat membaca!
            </p>
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-xs text-[#0E7749] font-medium text-left">
              <p className="font-bold mb-1">Agihan Bayaran Telus:</p>
              <div className="flex justify-between">
                <span>Penulis ({book.author}) terima (95%):</span>
                <strong>RM {successData.authorShare.toFixed(2)}</strong>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Caj Pengurusan Platform (5%):</span>
                <span>RM {successData.platformShare.toFixed(2)}</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-6 space-y-5">
            {/* Book Mini Card */}
            <div className="flex gap-4 p-3 bg-slate-50 border border-slate-200/80 rounded-xl items-center">
              <div className="w-16 h-22 shrink-0 rounded-md overflow-hidden shadow-xs">
                <BookCover
                  title={book.title}
                  author={book.author}
                  coverUrl={book.coverUrl}
                  coverTheme={book.coverTheme}
                  size="sm"
                />
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-[10px] uppercase font-bold text-[#0E7749] tracking-wider">
                  {book.category}
                </span>
                <h4 className="text-sm font-bold text-slate-900 truncate">{book.title}</h4>
                <p className="text-xs text-slate-500">Oleh: {book.author}</p>
                <div className="text-base font-extrabold text-[#0E7749] mt-1">
                  {book.currency || 'RM'} {price.toFixed(2)}
                </div>
              </div>
            </div>

            {/* Split Transparency */}
            <div className="bg-emerald-50/60 border border-emerald-100 rounded-xl p-3 text-xs space-y-2">
              <div className="flex items-center gap-1.5 font-bold text-[#0E7749]">
                <ShieldCheck className="w-4 h-4" />
                <span>Agihan Hasil Jualan (95% Penulis / 5% Admin)</span>
              </div>
              <div className="space-y-1 font-mono text-[11px] text-slate-700">
                <div className="flex justify-between bg-white p-2 rounded-lg border border-emerald-100">
                  <span className="font-sans text-slate-600">Penulis Dapat (95%):</span>
                  <strong className="text-[#0E7749]">RM {authorRoyalty.toFixed(2)}</strong>
                </div>
                <div className="flex justify-between bg-white p-2 rounded-lg border border-emerald-100">
                  <span className="font-sans text-slate-600">Platform Admin (5%):</span>
                  <strong className="text-slate-700">RM {platformFee.toFixed(2)}</strong>
                </div>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Pilih Kaedah Bayaran
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('fpx')}
                  className={`flex flex-col items-center justify-center p-2 rounded-xl border text-xs font-medium cursor-pointer transition-all ${
                    paymentMethod === 'fpx'
                      ? 'border-[#0E7749] bg-emerald-50 text-[#0E7749] font-bold shadow-2xs'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <Building2 className="w-4 h-4 mb-1" />
                  <span>FPX Bank</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  className={`flex flex-col items-center justify-center p-2 rounded-xl border text-xs font-medium cursor-pointer transition-all ${
                    paymentMethod === 'card'
                      ? 'border-[#0E7749] bg-emerald-50 text-[#0E7749] font-bold shadow-2xs'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <CreditCard className="w-4 h-4 mb-1" />
                  <span>Kad Bank</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('tng')}
                  className={`flex flex-col items-center justify-center p-2 rounded-xl border text-xs font-medium cursor-pointer transition-all ${
                    paymentMethod === 'tng'
                      ? 'border-[#0E7749] bg-emerald-50 text-[#0E7749] font-bold shadow-2xs'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <Sparkles className="w-4 h-4 mb-1" />
                  <span>TnG eWallet</span>
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              onClick={handleConfirmPurchase}
              disabled={isProcessing}
              className="w-full py-3 bg-[#0E7749] hover:bg-[#0a5634] text-white rounded-xl font-bold text-sm transition-colors shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isProcessing ? (
                <span>Memproses Bayaran...</span>
              ) : (
                <>
                  <LockOpen className="w-4 h-4" />
                  <span>Beli & Buka Semua Bab (RM {price.toFixed(2)})</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
