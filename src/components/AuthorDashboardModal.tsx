import React, { useState } from 'react';
import { X, Wallet, TrendingUp, Calendar, CreditCard, ArrowDownCircle, CheckCircle, RefreshCw, PenSquare } from 'lucide-react';
import { useMarketplace } from '../context/MarketplaceContext';

interface AuthorDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenWriter: () => void;
}

export const AuthorDashboardModal: React.FC<AuthorDashboardModalProps> = ({
  isOpen,
  onClose,
  onOpenWriter,
}) => {
  const { authorProfile, transactions, withdrawEarnings, renewAuthorSubscription } = useMarketplace();
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawStatus, setWithdrawStatus] = useState<string | null>(null);
  const [isRenewing, setIsRenewing] = useState(false);

  if (!isOpen || !authorProfile) return null;

  const authorSales = transactions.filter(
    (t) => t.type === 'book_sale' && (t.authorId === authorProfile.id || t.authorName === authorProfile.name)
  );

  const handleWithdraw = async (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(withdrawAmount);
    if (isNaN(val) || val <= 0 || val > authorProfile.balance) {
      setWithdrawStatus('Jumlah pengeluaran tidak sah atau melebihi baki.');
      return;
    }

    const ok = await withdrawEarnings(val);
    if (ok) {
      setWithdrawStatus(`Permohonan pengeluaran RM ${val.toFixed(2)} ke akaun ${authorProfile.bankName} (${authorProfile.bankAccountNumber}) telah dihantar!`);
      setWithdrawAmount('');
    }
  };

  const handleRenew = async () => {
    setIsRenewing(true);
    await renewAuthorSubscription();
    setIsRenewing(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full overflow-hidden border border-slate-100 flex flex-col my-8 max-h-[90vh]">
        {/* Header */}
        <div className="bg-[#0E7749] text-white p-6 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider bg-white/20 rounded-full text-white">
                Papan Pemuka Penulis
              </span>
              <span className="text-xs text-emerald-200 flex items-center gap-1">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-300" />
                Langganan Aktif
              </span>
            </div>
            <h2 className="text-2xl font-bold font-serif-book mt-1">{authorProfile.name}</h2>
            <p className="text-xs text-emerald-100">{authorProfile.email}</p>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white p-2 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Subscription Status Bar */}
        <div className="bg-emerald-50 border-b border-emerald-100 px-6 py-3 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-slate-700">
            <Calendar className="w-4 h-4 text-[#0E7749]" />
            <span>
              Pelan: <strong>{authorProfile.subscriptionPlan === 'year_1' ? 'Tahun Pertama (RM 20.00)' : 'Pembaharuan (RM 10.00)'}</strong>
            </span>
            <span className="text-slate-400">•</span>
            <span>
              Sah sehingga: <strong>{new Date(authorProfile.subscriptionExpiryDate).toLocaleDateString('ms-MY')}</strong>
            </span>
          </div>

          <button
            onClick={handleRenew}
            disabled={isRenewing}
            className="flex items-center gap-1.5 px-3 py-1 bg-white border border-[#0E7749] text-[#0E7749] font-bold rounded-lg hover:bg-emerald-100/50 transition-colors cursor-pointer text-xs disabled:opacity-50"
            title="Perbaharui untuk tahun berikutnya hanya RM 10.00"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRenewing ? 'animate-spin' : ''}`} />
            <span>Perbaharui (RM 10.00 / thn)</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6 overflow-y-auto custom-scrollbar flex-1">
          {/* Earnings Overview Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 bg-gradient-to-br from-emerald-50 to-teal-50/50 border border-emerald-200/80 rounded-2xl">
              <div className="flex items-center justify-between text-xs text-slate-500 font-semibold mb-1">
                <span>Baki Royalti (95%)</span>
                <Wallet className="w-4 h-4 text-[#0E7749]" />
              </div>
              <div className="text-2xl font-black text-[#0E7749]">
                RM {authorProfile.balance.toFixed(2)}
              </div>
              <span className="text-[11px] text-emerald-700">Tersedia untuk pengeluaran</span>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl">
              <div className="flex items-center justify-between text-xs text-slate-500 font-semibold mb-1">
                <span>Jumlah Royalti Terkumpul</span>
                <TrendingUp className="w-4 h-4 text-slate-700" />
              </div>
              <div className="text-2xl font-black text-slate-900">
                RM {authorProfile.totalEarnings.toFixed(2)}
              </div>
              <span className="text-[11px] text-slate-500">Hasil jualan 95% bersih</span>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl">
              <div className="flex items-center justify-between text-xs text-slate-500 font-semibold mb-1">
                <span>Jumlah Dikeluarkan</span>
                <ArrowDownCircle className="w-4 h-4 text-slate-700" />
              </div>
              <div className="text-2xl font-black text-slate-900">
                RM {authorProfile.withdrawnAmount.toFixed(2)}
              </div>
              <span className="text-[11px] text-slate-500">Telah dipindahkan ke akaun bank</span>
            </div>
          </div>

          {/* Quick Action: Write Book */}
          <div className="flex items-center justify-between bg-slate-900 text-white p-4 rounded-xl">
            <div>
              <h4 className="font-bold text-sm">Ingin Terbitkan Karya Baru?</h4>
              <p className="text-xs text-slate-300">Tulis buku, tentukan harga dan bilangan bab percuma untuk pembaca.</p>
            </div>
            <button
              onClick={() => {
                onClose();
                onOpenWriter();
              }}
              className="flex items-center gap-2 px-4 py-2 bg-[#0E7749] hover:bg-[#0a5634] text-white rounded-lg text-xs font-bold transition-colors cursor-pointer shrink-0"
            >
              <PenSquare className="w-4 h-4" />
              <span>Tulis Buku Sekarang</span>
            </button>
          </div>

          {/* Withdrawal Box */}
          <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4">
            <h3 className="text-sm font-bold text-slate-900 mb-2 flex items-center gap-1.5">
              <CreditCard className="w-4 h-4 text-[#0E7749]" />
              <span>Pengeluaran Royalti ke Bank ({authorProfile.bankName} - {authorProfile.bankAccountNumber})</span>
            </h3>

            {withdrawStatus && (
              <div className="mb-3 p-2.5 text-xs bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl">
                {withdrawStatus}
              </div>
            )}

            <form onSubmit={handleWithdraw} className="flex flex-col sm:flex-row gap-2.5 items-stretch sm:items-center">
              <div className="relative flex-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                  RM
                </span>
                <input
                  type="number"
                  step="0.01"
                  min="1"
                  max={authorProfile.balance}
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  placeholder={`Maksimum RM ${authorProfile.balance.toFixed(2)}`}
                  className="w-full text-xs pl-10 pr-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0E7749] bg-white font-mono"
                />
              </div>
              <button
                type="submit"
                disabled={authorProfile.balance <= 0}
                className="px-5 py-2 bg-[#0E7749] hover:bg-[#0a5634] text-white rounded-xl text-xs font-bold transition-colors cursor-pointer disabled:opacity-50 whitespace-nowrap"
              >
                Pindahkan Wang Sekarang
              </button>
            </form>
          </div>

          {/* Sales & Royalty Log */}
          <div>
            <h3 className="text-sm font-bold text-slate-900 mb-3">
              Sejarah Jualan & Agihan Royalti (95% Penulis / 5% Platform)
            </h3>
            {authorSales.length === 0 ? (
              <div className="p-8 text-center bg-slate-50 rounded-xl text-xs text-slate-500">
                Belum ada rekod jualan. Terbitkan buku anda untuk mula menjana pendapatan!
              </div>
            ) : (
              <div className="border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-100 text-xs">
                {authorSales.map((tx) => (
                  <div key={tx.id} className="p-3.5 flex items-center justify-between hover:bg-slate-50/80 transition-colors">
                    <div>
                      <h5 className="font-bold text-slate-900">{tx.bookTitle}</h5>
                      <p className="text-[11px] text-slate-500">
                        Pembeli: {tx.buyerName} • {new Date(tx.date).toLocaleDateString('ms-MY')}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="font-mono font-bold text-[#0E7749] text-sm">
                        + RM {tx.authorShare.toFixed(2)} (95%)
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono">
                        Harga: RM {tx.totalAmount.toFixed(2)} (Caj platform: RM {tx.platformShare.toFixed(2)})
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
