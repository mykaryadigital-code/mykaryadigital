import React from 'react';
import { X, ShieldAlert, DollarSign, Users, BookOpen, Layers, BarChart3 } from 'lucide-react';
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
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full overflow-hidden border border-slate-100 flex flex-col my-8 max-h-[90vh]">
        {/* Header */}
        <div className="bg-slate-900 text-white p-6 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider bg-red-600 rounded-full text-white">
                Portal Pentadbir / Admin
              </span>
              <span className="text-xs text-slate-400">Pusat Kawalan Kewangan & Komisen</span>
            </div>
            <h2 className="text-2xl font-bold font-serif-book mt-1">Pengurusan Platform Karya Digital</h2>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-2 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 overflow-y-auto custom-scrollbar flex-1">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="p-4 bg-red-50/70 border border-red-200 rounded-2xl">
              <span className="text-xs text-red-700 font-semibold block mb-1">Jumlah Untung Platform</span>
              <div className="text-2xl font-black text-red-600">
                RM {totalRevenue.toFixed(2)}
              </div>
              <span className="text-[10px] text-slate-500">Komisen 5% + Langganan</span>
            </div>

            <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-2xl">
              <span className="text-xs text-emerald-800 font-semibold block mb-1">Komisen Jualan (5%)</span>
              <div className="text-2xl font-black text-[#0E7749]">
                RM {stats.totalPlatformCommission.toFixed(2)}
              </div>
              <span className="text-[10px] text-slate-500">Ditolak dari jualan buku</span>
            </div>

            <div className="p-4 bg-blue-50/70 border border-blue-200 rounded-2xl">
              <span className="text-xs text-blue-800 font-semibold block mb-1">Yuran Penulis (RM20/RM10)</span>
              <div className="text-2xl font-black text-blue-700">
                RM {stats.totalSubscriptionFees.toFixed(2)}
              </div>
              <span className="text-[10px] text-slate-500">Yuran pendaftaran tahunan</span>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl">
              <span className="text-xs text-slate-600 font-semibold block mb-1">Buku Terjual</span>
              <div className="text-2xl font-black text-slate-900">
                {stats.totalBooksSold}
              </div>
              <span className="text-[10px] text-slate-500">Transaksi jualan berjaya</span>
            </div>
          </div>

          {/* Ledger Table */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-slate-700" />
                <span>Lejar Lengkap Transaksi Platform (Caj 5% & Royalti 95%)</span>
              </h3>
              <span className="text-xs text-slate-500">{transactions.length} rekod</span>
            </div>

            <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 font-semibold text-slate-600">
                    <th className="p-3">Jenis / Perkara</th>
                    <th className="p-3">Penulis</th>
                    <th className="p-3 text-right">Harga Jual</th>
                    <th className="p-3 text-right text-[#0E7749]">Penulis (95%)</th>
                    <th className="p-3 text-right text-red-600 font-bold">Admin (5%)</th>
                    <th className="p-3 text-right">Tarikh</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {transactions.map((tx) => (
                    <tr key={tx.id} className="hover:bg-slate-50/60">
                      <td className="p-3 font-medium">
                        {tx.type === 'author_subscription' ? (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800">
                            Pendaftaran Penulis
                          </span>
                        ) : (
                          <div>
                            <span className="font-bold text-slate-900">{tx.bookTitle}</span>
                            <span className="block text-[10px] text-slate-400">Pembeli: {tx.buyerName}</span>
                          </div>
                        )}
                      </td>
                      <td className="p-3 text-slate-600">{tx.authorName}</td>
                      <td className="p-3 text-right font-mono font-bold">
                        RM {tx.totalAmount.toFixed(2)}
                      </td>
                      <td className="p-3 text-right font-mono text-[#0E7749] font-bold">
                        {tx.authorShare > 0 ? `RM ${tx.authorShare.toFixed(2)}` : '-'}
                      </td>
                      <td className="p-3 text-right font-mono text-red-600 font-bold">
                        RM {tx.platformShare.toFixed(2)}
                      </td>
                      <td className="p-3 text-right text-slate-400 text-[11px]">
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
