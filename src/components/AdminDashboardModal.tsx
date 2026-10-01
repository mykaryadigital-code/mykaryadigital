import React from 'react';
import { X, BarChart3, ShieldCheck } from 'lucide-react';
import { useMarketplace } from '../context/MarketplaceContext';

interface AdminDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminDashboardModal: React.FC<AdminDashboardModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { stats, transactions } = useMarketplace();

  if (!isOpen) return null;

  const totalRevenue = stats.totalPlatformCommission + stats.totalSubscriptionFees;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white rounded-[20px] shadow-2xl max-w-4xl w-full overflow-hidden border border-[#E2E8F0] flex flex-col my-8 max-h-[90vh]">
        {/* Header */}
        <div className="bg-[#063F35] text-white p-6 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider bg-white/20 rounded-full text-white flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
                Portal Pentadbir Platform
              </span>
              <span className="text-xs text-emerald-200">Pusat Kawalan Kewangan & Komisen</span>
            </div>
            <h2 className="text-2xl font-bold font-serif-book mt-1">Pengurusan Platform Karya Digital</h2>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white p-2 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 overflow-y-auto custom-scrollbar flex-1">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="p-4 bg-rose-50/60 border border-rose-200 rounded-[16px]">
              <span className="text-xs text-rose-800 font-semibold block mb-1">Hasil Bersih Platform</span>
              <div className="text-2xl font-black text-[#E53935] font-mono-data">
                RM {totalRevenue.toFixed(2)}
              </div>
              <span className="text-[10px] text-[#64748B]">Komisen 5% + Yuran Penulis</span>
            </div>

            <div className="p-4 bg-[#ECFDF5] border border-[#A7F3D0] rounded-[16px]">
              <span className="text-xs text-[#063F35] font-semibold block mb-1">Komisen Jualan (5%)</span>
              <div className="text-2xl font-black text-[#006B57] font-mono-data">
                RM {stats.totalPlatformCommission.toFixed(2)}
              </div>
              <span className="text-[10px] text-[#64748B]">Ditolak dari jualan buku</span>
            </div>

            <div className="p-4 bg-slate-50 border border-[#E2E8F0] rounded-[16px]">
              <span className="text-xs text-[#102A27] font-semibold block mb-1">Yuran Penulis (RM20/RM10)</span>
              <div className="text-2xl font-black text-[#102A27] font-mono-data">
                RM {stats.totalSubscriptionFees.toFixed(2)}
              </div>
              <span className="text-[10px] text-[#64748B]">Yuran pendaftaran tahunan</span>
            </div>

            <div className="p-4 bg-slate-50 border border-[#E2E8F0] rounded-[16px]">
              <span className="text-xs text-[#64748B] font-semibold block mb-1">Buku Terjual</span>
              <div className="text-2xl font-black text-[#102A27] font-mono-data">
                {stats.totalBooksSold}
              </div>
              <span className="text-[10px] text-[#64748B]">Transaksi jualan berjaya</span>
            </div>
          </div>

          {/* Ledger Table */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-[#102A27] flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-[#006B57]" />
                <span>Lejar Lengkap Transaksi Platform (Caj 5% & Royalti 95%)</span>
              </h3>
              <span className="text-xs text-[#64748B] font-mono-data">{transactions.length} rekod</span>
            </div>

            <div className="border border-[#E2E8F0] rounded-[14px] overflow-hidden text-xs">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-[#E2E8F0] font-semibold text-[#64748B]">
                    <th className="p-3">Jenis / Perkara</th>
                    <th className="p-3">Penulis</th>
                    <th className="p-3 text-right">Harga Jual</th>
                    <th className="p-3 text-right text-[#006B57]">Penulis (95%)</th>
                    <th className="p-3 text-right text-[#E53935] font-bold">Admin (5%)</th>
                    <th className="p-3 text-right">Tarikh</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E2E8F0]">
                  {transactions.map((tx) => (
                    <tr key={tx.id} className="hover:bg-slate-50/70 font-mono-data">
                      <td className="p-3 font-sans font-medium text-[#102A27]">
                        {tx.type === 'book_sale' ? tx.bookTitle : 'Yuran Langganan Penulis'}
                      </td>
                      <td className="p-3 font-sans text-[#64748B]">{tx.authorName || '-'}</td>
                      <td className="p-3 text-right text-[#64748B]">RM {(tx.totalAmount ?? tx.amount ?? 0).toFixed(2)}</td>
                      <td className="p-3 text-right text-[#006B57] font-semibold">
                        {tx.authorShare ? `RM ${tx.authorShare.toFixed(2)}` : '-'}
                      </td>
                      <td className="p-3 text-right text-[#E53935] font-bold">
                        RM {tx.platformShare ? tx.platformShare.toFixed(2) : (tx.totalAmount ?? tx.amount ?? 0).toFixed(2)}
                      </td>
                      <td className="p-3 text-right text-[#64748B] text-[11px]">
                        {new Date(tx.date).toLocaleDateString('ms-MY')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
