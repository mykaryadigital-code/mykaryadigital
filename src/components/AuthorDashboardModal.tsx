import React, { useState } from 'react';
import { X, Wallet, TrendingUp, Calendar, CheckCircle, RefreshCw, ArrowDownToLine } from 'lucide-react';
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
      <div className="bg-white rounded-[20px] shadow-2xl max-w-3xl w-full overflow-hidden border border-[#E2E8F0] flex flex-col my-8 max-h-[90vh]">
        {/* Header */}
        <div className="bg-[#006B57] text-white p-6 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider bg-white/20 rounded-full text-white">
                Papan Pemuka Penulis
              </span>
              <span className="text-xs text-emerald-100 flex items-center gap-1 font-medium">
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
        <div className="bg-[#ECFDF5] border-b border-[#A7F3D0] px-6 py-3 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-[#102A27]">
            <Calendar className="w-4 h-4 text-[#006B57]" />
            <span>
              Pelan: <strong>{authorProfile.subscriptionPlan === 'year_1' ? 'Tahun Pertama (RM 20.00)' : 'Pembaharuan (RM 10.00)'}</strong>
            </span>
            <span className="text-slate-300">•</span>
            <span>
              Sah sehingga: <strong>{new Date(authorProfile.subscriptionExpiryDate).toLocaleDateString('ms-MY')}</strong>
            </span>
          </div>

          <button
            onClick={handleRenew}
            disabled={isRenewing}
            className="flex items-center gap-1.5 px-3 py-1 bg-white border border-[#006B57] text-[#006B57] font-bold rounded-[8px] hover:bg-emerald-50 transition-colors cursor-pointer text-xs disabled:opacity-50"
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
            <div className="p-4 bg-[#ECFDF5] border border-[#A7F3D0] rounded-[16px]">
              <div className="flex items-center justify-between text-xs text-[#64748B] font-semibold mb-1">
                <span>Baki Royalti (95%)</span>
                <Wallet className="w-4 h-4 text-[#006B57]" />
              </div>
              <div className="text-2xl font-black text-[#006B57] font-mono-data">
                RM {authorProfile.balance.toFixed(2)}
              </div>
              <span className="text-[11px] text-[#047857]">Tersedia untuk pengeluaran</span>
            </div>

            <div className="p-4 bg-white border border-[#E2E8F0] rounded-[16px]">
              <div className="flex items-center justify-between text-xs text-[#64748B] font-semibold mb-1">
                <span>Jumlah Royalti Terkumpul</span>
                <TrendingUp className="w-4 h-4 text-[#64748B]" />
              </div>
              <div className="text-2xl font-black text-[#102A27] font-mono-data">
                RM {authorProfile.totalEarnings.toFixed(2)}
              </div>
              <span className="text-[11px] text-[#64748B]">Semua jualan sepanjang hayat</span>
            </div>

            <div className="p-4 bg-white border border-[#E2E8F0] rounded-[16px]">
              <div className="flex items-center justify-between text-xs text-[#64748B] font-semibold mb-1">
                <span>Kadar Royalti Bersih</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#ECFDF5] text-[#047857]">
                  Aktif
                </span>
              </div>
              <div className="text-2xl font-black text-[#102A27] font-mono-data">
                95%
              </div>
              <span className="text-[11px] text-[#64748B]">Caj platform hanya 5%</span>
            </div>
          </div>

          {/* Quick Action: Studio Tulis Buku */}
          <div className="p-4 bg-[#F7F9F8] border border-[#E2E8F0] rounded-[14px] flex items-center justify-between">
            <div>
              <h4 className="text-xs font-bold text-[#102A27]">Studio Penulisan Buku Digital</h4>
              <p className="text-[11px] text-[#64748B]">Tulis naskhah baharu atau muat naik manuskrip sekarang.</p>
            </div>
            <button
              onClick={onOpenWriter}
              className="px-4 py-2 bg-[#006B57] hover:bg-[#063F35] text-white text-xs font-bold rounded-[10px] transition-colors cursor-pointer"
            >
              Buka Studio
            </button>
          </div>

          {/* Withdraw Form */}
          <div className="p-5 bg-white border border-[#E2E8F0] rounded-[16px] space-y-3">
            <h3 className="text-sm font-bold text-[#102A27] flex items-center gap-2">
              <ArrowDownToLine className="w-4 h-4 text-[#006B57]" />
              <span>Pengeluaran Royalti ke Bank ({authorProfile.bankName})</span>
            </h3>

            {withdrawStatus && (
              <div className="p-3 text-xs bg-[#ECFDF5] border border-[#A7F3D0] text-[#047857] rounded-[10px]">
                {withdrawStatus}
              </div>
            )}

            <form onSubmit={handleWithdraw} className="flex gap-2">
              <div className="relative flex-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">RM</span>
                <input
                  type="number"
                  step="0.01"
                  min="1"
                  max={authorProfile.balance}
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  placeholder={`Maksimum RM ${authorProfile.balance.toFixed(2)}`}
                  className="w-full text-xs font-mono-data pl-10 pr-3 py-2 border border-[#CBD5E1] rounded-[10px] focus:outline-none focus:border-[#006B57]"
                />
              </div>
              <button
                type="submit"
                disabled={authorProfile.balance <= 0}
                className="px-4 py-2 bg-[#006B57] hover:bg-[#063F35] text-white text-xs font-bold rounded-[10px] transition-colors cursor-pointer disabled:opacity-50 whitespace-nowrap shadow-xs"
              >
                Pindah ke Bank
              </button>
            </form>
          </div>

          {/* Sales History */}
          <div>
            <h3 className="text-sm font-bold text-[#102A27] mb-3">Sejarah Transaksi Jualan ({authorSales.length})</h3>
            {authorSales.length === 0 ? (
              <p className="text-xs text-[#64748B] text-center py-6 bg-slate-50 border border-[#E2E8F0] rounded-[12px]">
                Belum ada transaksi jualan direkodkan.
              </p>
            ) : (
              <div className="border border-[#E2E8F0] rounded-[12px] overflow-hidden text-xs">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-[#E2E8F0] font-semibold text-[#64748B]">
                      <th className="p-3">Judul Buku</th>
                      <th className="p-3">Pembeli</th>
                      <th className="p-3 text-right">Harga Jual</th>
                      <th className="p-3 text-right text-[#006B57]">Royalti Anda (95%)</th>
                      <th className="p-3 text-right">Tarikh</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E2E8F0]">
                    {authorSales.map((s) => (
                      <tr key={s.id} className="hover:bg-slate-50/60 font-mono-data">
                        <td className="p-3 font-sans font-medium text-[#102A27]">{s.bookTitle}</td>
                        <td className="p-3 font-sans text-[#64748B]">{s.buyerName}</td>
                        <td className="p-3 text-right text-[#64748B]">RM {(s.totalAmount ?? s.amount ?? 0).toFixed(2)}</td>
                        <td className="p-3 text-right text-[#006B57] font-bold">
                          RM {s.authorShare ? s.authorShare.toFixed(2) : ((s.totalAmount ?? s.amount ?? 0) * 0.95).toFixed(2)}
                        </td>
                        <td className="p-3 text-right text-[#64748B] text-[11px]">
                          {new Date(s.date).toLocaleDateString('ms-MY')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
