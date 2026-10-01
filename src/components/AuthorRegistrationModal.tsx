import React, { useState } from 'react';
import { X, ShieldCheck, Sparkles, Building2, CreditCard, ArrowRight } from 'lucide-react';
import { useMarketplace } from '../context/MarketplaceContext';

interface AuthorRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const AuthorRegistrationModal: React.FC<AuthorRegistrationModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { subscribeAsAuthor, authorProfile } = useMarketplace();
  const [name, setName] = useState(authorProfile?.name || '');
  const [email, setEmail] = useState(authorProfile?.email || '');
  const [phone, setPhone] = useState(authorProfile?.phone || '');
  const [bankName, setBankName] = useState(authorProfile?.bankName || 'Maybank');
  const [bankAccountNumber, setBankAccountNumber] = useState(authorProfile?.bankAccountNumber || '');
  const [paymentMethod, setPaymentMethod] = useState<'fpx' | 'card' | 'tng'>('fpx');
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !bankAccountNumber.trim()) {
      setErrorMsg('Sila lengkapkan semua butiran wajib termasuk nombor akaun bank.');
      return;
    }

    setIsProcessing(true);
    setErrorMsg('');

    try {
      await subscribeAsAuthor({
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        bankName,
        bankAccountNumber: bankAccountNumber.trim(),
      });
      setIsProcessing(false);
      onSuccess();
    } catch (err) {
      setIsProcessing(false);
      setErrorMsg('Ralat semasa pemprosesan bayaran. Sila cuba lagi.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white rounded-[20px] shadow-2xl max-w-xl w-full overflow-hidden border border-[#E2E8F0] flex flex-col my-8">
        {/* Header */}
        <div className="bg-[#006B57] text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white p-1 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2.5 mb-2">
            <span className="px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider bg-white/20 rounded-full text-white">
              Program Penulis Karya Digital
            </span>
          </div>
          <h2 className="text-2xl font-bold font-serif-book">Daftar Sebagai Penulis Buku</h2>
          <p className="text-emerald-100 text-xs sm:text-sm mt-1">
            Terbitkan karya anda, tetapkan harga, dan terima 95% royalti terus ke akaun bank anda.
          </p>
        </div>

        {/* Pricing & Benefit Banner */}
        <div className="bg-[#ECFDF5] border-b border-[#A7F3D0] p-4 px-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-extrabold text-[#006B57] font-mono-data">RM 20.00</span>
              <span className="text-xs font-semibold text-[#64748B]">/ Tahun Pertama</span>
            </div>
            <p className="text-xs text-[#64748B] mt-0.5">
              Pembaharuan tahun seterusnya hanya <strong>RM 10.00 / tahun</strong>.
            </p>
          </div>
          <div className="bg-white px-3 py-1.5 rounded-xl border border-[#A7F3D0] text-xs font-medium text-[#006B57] flex items-center gap-1.5 shadow-2xs">
            <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Anda dapat <strong>95%</strong> hasil jualan</span>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {errorMsg && (
            <div className="p-3 text-xs text-rose-800 bg-rose-50 border border-rose-200 rounded-[12px]">
              {errorMsg}
            </div>
          )}

          {/* Example Royalty Split Explanation */}
          <div className="bg-[#F7F9F8] border border-[#E2E8F0] rounded-[14px] p-3.5 text-xs text-[#102A27] space-y-1">
            <div className="font-semibold text-[#102A27] flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#006B57]" />
              <span>Telus & Adil: Caj Platform Hanya 5%</span>
            </div>
            <p className="text-[#64748B]">
              Contoh jika buku dijual pada harga <strong>RM 10.00</strong>:
            </p>
            <div className="grid grid-cols-2 gap-2 pt-1 font-mono-data text-[11px]">
              <div className="bg-white p-2.5 rounded-[10px] border border-[#E2E8F0] text-[#006B57]">
                <span className="block text-[#64748B] text-[10px] font-sans">Penulis Terima (95%)</span>
                <strong>RM 9.50</strong> (Masuk akaun bank)
              </div>
              <div className="bg-white p-2.5 rounded-[10px] border border-[#E2E8F0] text-[#64748B]">
                <span className="block text-[#64748B] text-[10px] font-sans">Platform Fee (5%)</span>
                <strong>RM 0.50</strong> (Pengurusan & server)
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#102A27] mb-1">
                Nama Penuh / Nama Pena <span className="text-[#E53935]">*</span>
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="cth. Fatimah Zahra / Penulis Melayu"
                className="w-full text-xs px-3.5 py-2.5 border border-[#CBD5E1] rounded-[12px] focus:outline-none focus:border-[#006B57]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#102A27] mb-1">
                Emel Penulis <span className="text-[#E53935]">*</span>
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="penulis@contoh.com"
                className="w-full text-xs px-3.5 py-2.5 border border-[#CBD5E1] rounded-[12px] focus:outline-none focus:border-[#006B57]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#102A27] mb-1">
                Bank Pembayaran Royalti <span className="text-[#E53935]">*</span>
              </label>
              <select
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
                className="w-full text-xs px-3.5 py-2.5 border border-[#CBD5E1] rounded-[12px] focus:outline-none focus:border-[#006B57] bg-white cursor-pointer"
              >
                <option value="Maybank">Maybank (Malayan Banking)</option>
                <option value="CIMB">CIMB Bank</option>
                <option value="Bank Islam">Bank Islam Malaysia</option>
                <option value="RHB">RHB Bank</option>
                <option value="Public Bank">Public Bank</option>
                <option value="Hong Leong">Hong Leong Bank</option>
                <option value="AmBank">AmBank</option>
                <option value="BSN">Bank Simpanan Nasional (BSN)</option>
                <option value="Bank Muamalat">Bank Muamalat</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-[#102A27] mb-1">
                Nombor Akaun Bank <span className="text-[#E53935]">*</span>
              </label>
              <input
                type="text"
                required
                value={bankAccountNumber}
                onChange={(e) => setBankAccountNumber(e.target.value)}
                placeholder="cth. 164012345678"
                className="w-full text-xs px-3.5 py-2.5 border border-[#CBD5E1] rounded-[12px] focus:outline-none focus:border-[#006B57] font-mono-data"
              />
            </div>
          </div>

          {/* Payment Method Selector */}
          <div>
            <label className="block text-xs font-bold text-[#102A27] mb-1.5">
              Kaedah Bayaran Yuran Pendaftaran (RM 20.00)
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setPaymentMethod('fpx')}
                className={`flex flex-col items-center justify-center p-2.5 rounded-[12px] border text-xs font-bold cursor-pointer transition-all ${
                  paymentMethod === 'fpx'
                    ? 'border-[#006B57] bg-[#ECFDF5] text-[#006B57] shadow-2xs'
                    : 'border-[#CBD5E1] text-[#64748B] hover:bg-slate-50'
                }`}
              >
                <Building2 className="w-4 h-4 mb-1" />
                <span>FPX Online</span>
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod('card')}
                className={`flex flex-col items-center justify-center p-2.5 rounded-[12px] border text-xs font-bold cursor-pointer transition-all ${
                  paymentMethod === 'card'
                    ? 'border-[#006B57] bg-[#ECFDF5] text-[#006B57] shadow-2xs'
                    : 'border-[#CBD5E1] text-[#64748B] hover:bg-slate-50'
                }`}
              >
                <CreditCard className="w-4 h-4 mb-1" />
                <span>Kad Bank</span>
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod('tng')}
                className={`flex flex-col items-center justify-center p-2.5 rounded-[12px] border text-xs font-bold cursor-pointer transition-all ${
                  paymentMethod === 'tng'
                    ? 'border-[#006B57] bg-[#ECFDF5] text-[#006B57] shadow-2xs'
                    : 'border-[#CBD5E1] text-[#64748B] hover:bg-slate-50'
                }`}
              >
                <Sparkles className="w-4 h-4 mb-1" />
                <span>TnG eWallet</span>
              </button>
            </div>
          </div>

          {/* Footer Submit */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isProcessing}
              className="w-full py-3 px-4 bg-[#006B57] hover:bg-[#063F35] text-white rounded-[12px] font-bold text-sm transition-colors shadow-xs flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isProcessing ? (
                <span>Memproses Pembayaran RM 20.00...</span>
              ) : (
                <>
                  <span>Bayar RM 20.00 & Aktifkan Status Penulis</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
            <p className="text-[11px] text-center text-[#64748B] mt-2">
              Langganan sah selama 1 tahun. Pembaharuan tahun hadapan hanya RM 10.00.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};
