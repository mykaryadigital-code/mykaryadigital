import React, { useState } from 'react';
import {
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  DollarSign,
  BookOpen,
  Infinity,
  AlertTriangle,
  Gift,
  Building2,
  CreditCard,
  ArrowRight,
  TrendingUp,
  PenSquare,
  Wallet,
  ChevronDown,
  Award,
  ArrowDownToLine,
  Receipt,
  User,
} from 'lucide-react';
import { useMarketplace } from '../context/MarketplaceContext';

interface AuthorGuidePageProps {
  onOpenWriter: () => void;
  onOpenAuthorDashboard: () => void;
  onReadGuideBook?: () => void;
}

export const AuthorGuidePage: React.FC<AuthorGuidePageProps> = ({
  onOpenWriter,
  onOpenAuthorDashboard,
  onReadGuideBook,
}) => {
  const { authorProfile, stats, transactions, subscribeAsAuthor, withdrawEarnings } = useMarketplace();

  // Interactive Calculator State
  const [calcPrice, setCalcPrice] = useState<number>(15);
  const [calcCopies, setCalcCopies] = useState<number>(120);

  // Registration Form State
  const [name, setName] = useState(authorProfile?.name || '');
  const [email, setEmail] = useState(authorProfile?.email || '');
  const [phone, setPhone] = useState(authorProfile?.phone || '');
  const [bankName, setBankName] = useState(authorProfile?.bankName || 'Maybank');
  const [bankAccountNumber, setBankAccountNumber] = useState(authorProfile?.bankAccountNumber || '');
  const [agreedToEtiquette, setAgreedToEtiquette] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'fpx' | 'card' | 'tng'>('fpx');
  const [isProcessing, setIsProcessing] = useState(false);
  const [formMsg, setFormMsg] = useState<{ type: 'error' | 'success'; text: string } | null>(null);

  // Royalty Withdrawal State
  const [withdrawAmount, setWithdrawAmount] = useState<string>('');
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const [withdrawMsg, setWithdrawMsg] = useState<{ type: 'error' | 'success'; text: string } | null>(null);

  // FAQ Accordion State
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // Calculator computations (95% Author, 5% Platform)
  const totalGross = calcPrice * calcCopies;
  const platformCut = Math.round(totalGross * 0.05 * 100) / 100;
  const authorEarnings = Math.round((totalGross - platformCut) * 100) / 100;

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !bankAccountNumber.trim()) {
      setFormMsg({ type: 'error', text: 'Sila lengkapkan semua butiran termasuk nombor akaun bank anda.' });
      return;
    }

    if (!agreedToEtiquette) {
      setFormMsg({
        type: 'error',
        text: 'Anda wajib bersetuju dengan syarat etika kandungan: Bebas daripada sebarang unsur lucah dan seks.',
      });
      return;
    }

    setIsProcessing(true);
    setFormMsg(null);

    try {
      await subscribeAsAuthor({
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        bankName,
        bankAccountNumber: bankAccountNumber.trim(),
      });
      setIsProcessing(false);
      setFormMsg({
        type: 'success',
        text: 'Tahniah! Akaun Penulis anda telah berjaya diaktifkan (RM20.00). Hadiah percuma "Panduan Menulis Buku Dengan Pantas" sedia untuk dibaca!',
      });
    } catch (err) {
      setIsProcessing(false);
      setFormMsg({ type: 'error', text: 'Ralat semasa memproses pembayaran pendaftaran. Sila cuba lagi.' });
    }
  };

  const handleWithdraw = async (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(withdrawAmount);
    if (!amt || isNaN(amt) || amt <= 0) {
      setWithdrawMsg({ type: 'error', text: 'Sila masukkan jumlah pengeluaran yang sah.' });
      return;
    }
    if (!authorProfile || amt > authorProfile.balance) {
      setWithdrawMsg({ type: 'error', text: 'Baki royalti tidak mencukupi.' });
      return;
    }

    setIsWithdrawing(true);
    setWithdrawMsg(null);
    try {
      await withdrawEarnings(amt);
      setWithdrawMsg({
        type: 'success',
        text: `Permohonan pengeluaran RM ${amt.toFixed(2)} ke akaun ${authorProfile.bankName} (${authorProfile.bankAccountNumber}) telah berjaya dihantar!`,
      });
      setWithdrawAmount('');
      setIsWithdrawing(false);
    } catch (err) {
      setIsWithdrawing(false);
      setWithdrawMsg({ type: 'error', text: 'Ralat semasa memproses pengeluaran tunai.' });
    }
  };

  const scrollToRegistration = () => {
    const el = document.getElementById('borang-pendaftaran-penulis');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const faqs = [
    {
      q: 'Bagaimanakah sistem royalti 95% berfungsi?',
      a: 'Bagi setiap buku yang dibeli oleh pembaca, caj pengurusan dan server platform hanyalah 5%. Baki 95% akan terus dikreditkan ke akaun dompet royalti penulis anda dan boleh dikeluarkan terus ke akaun bank anda pada bila-bila masa.',
    },
    {
      q: 'Mengapakah yuran permulaan RM20 untuk tahun pertama dan RM10 untuk tahun seterusnya?',
      a: 'Yuran permulaan RM 20 meliputi kos pendaftaran akaun rasmi, akses studio penulisan tanpa had, sistem jualan buku digital, dan hadiah percuma Ebook "Panduan Menulis Buku Dengan Pantas" bernilai RM 49. Tahun seterusnya hanya dikenakan RM 10 setahun untuk mengekalkan kedai dan rak jualan anda sentiasa aktif.',
    },
    {
      q: 'Apakah yang dimaksudkan dengan larangan unsur lucah dan seks?',
      a: 'Karya Digital komited membina komuniti membaca yang sihat, bermoral, dan selamat untuk semua lapisan masyarakat. Segala bentuk novel erotik, kandungan eksplisit, atau bahan berunsur pornografi adalah dilarang sama sekali. Karya yang melanggar syarat ini akan dipadamkan serta-merta tanpa ganti rugi.',
    },
    {
      q: 'Bagaimanakah cara saya menerima naskhah hadiah percuma "Panduan Menulis Buku Dengan Pantas"?',
      a: 'Sebaik sahaja pendaftaran tahun pertama (RM20.00) disahkan, ebook eksklusif ini akan terus dibuka secara automatik di dalam akaun anda dengan akses penuh tanpa sebarang bayaran tambahan.',
    },
    {
      q: 'Adakah saya boleh menerbitkan seberapa banyak buku yang saya mahu?',
      a: 'Ya, 100% UNLIMITED! Anda bebas menerbitkan seberapa banyak judul buku, novel, atau himpunan resepi digital yang anda inginkan tanpa bayaran tambahan bagi setiap naskhah.',
    },
  ];

  return (
    <div className="space-y-10 pb-16">
      {/* AUTHOR ROYALTY HUB (If Author is Registered) */}
      {authorProfile?.isSubscribed && (
        <section className="bg-white border-2 border-emerald-500/80 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-5 border-b border-slate-100">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-[#0E7749]">
                <Wallet className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl sm:text-2xl font-bold font-serif-book text-slate-900">
                    Papan Pemuka Royalti Penulis
                  </h2>
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-[#0E7749]">
                    Akaun Aktif
                  </span>
                </div>
                <p className="text-xs text-slate-500">
                  {authorProfile.name} • {authorProfile.bankName} ({authorProfile.bankAccountNumber})
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <button
                onClick={onOpenWriter}
                className="px-4 py-2 bg-[#0b4d32] hover:bg-[#073623] text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center gap-1.5"
              >
                <PenSquare className="w-4 h-4" />
                <span>Tulis Buku Baru</span>
              </button>
            </div>
          </div>

          {/* 4 Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Stat 1: Baki Royalti */}
            <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-4.5 space-y-1">
              <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider">
                Baki Royalti Boleh Dikeluarkan
              </span>
              <div className="text-2xl sm:text-3xl font-black text-[#0b4d32] font-mono">
                RM {authorProfile.balance.toFixed(2)}
              </div>
              <span className="text-[10px] text-emerald-600 block">Kredit sedia dipindahkan ke akaun bank</span>
            </div>

            {/* Stat 2: Kadar Royalti */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4.5 space-y-1">
              <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                Kadar Royalti Anda
              </span>
              <div className="text-2xl sm:text-3xl font-black text-slate-900 font-mono">
                95%
              </div>
              <span className="text-[10px] text-slate-500 block">Caj platform pengurusan hanya 5%</span>
            </div>

            {/* Stat 3: Naskhah Terjual */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4.5 space-y-1">
              <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                Jumlah Buku Terjual
              </span>
              <div className="text-2xl sm:text-3xl font-black text-slate-900 font-mono">
                {stats.totalBooksSold || 2} naskhah
              </div>
              <span className="text-[10px] text-slate-500 block">Jualan daripada semua tajuk buku</span>
            </div>

            {/* Stat 4: Status Yuran */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4.5 space-y-1">
              <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                Status Yuran Tahunan
              </span>
              <div className="text-base sm:text-lg font-bold text-slate-900">
                Tahun 1 (RM 20)
              </div>
              <span className="text-[10px] text-emerald-700 font-medium block">
                Pembaharuan tahun depan: RM 10.00 sahaja
              </span>
            </div>
          </div>

          {/* Form Pengeluaran Royalti */}
          <div className="bg-slate-50 border border-slate-200/90 rounded-2xl p-5 space-y-4">
            <div className="flex items-center gap-2">
              <ArrowDownToLine className="w-4 h-4 text-[#0b4d32]" />
              <h3 className="text-sm font-bold text-slate-900">
                Permohonan Pengeluaran Royalti ke Bank ({authorProfile.bankName})
              </h3>
            </div>

            {withdrawMsg && (
              <div
                className={`p-3 rounded-xl text-xs font-medium border ${
                  withdrawMsg.type === 'error'
                    ? 'bg-rose-50 border-rose-200 text-rose-800'
                    : 'bg-emerald-50 border-emerald-200 text-emerald-800'
                }`}
              >
                {withdrawMsg.text}
              </div>
            )}

            <form onSubmit={handleWithdraw} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <div className="relative flex-1">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-bold text-xs text-slate-500">RM</span>
                <input
                  type="number"
                  step="0.01"
                  min="5"
                  max={authorProfile.balance}
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  placeholder={`Maksimum RM ${authorProfile.balance.toFixed(2)}`}
                  className="w-full text-xs font-mono pl-11 pr-4 py-2.5 bg-white border border-slate-300 rounded-xl focus:outline-none focus:border-[#0E7749]"
                />
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  type="button"
                  onClick={() => setWithdrawAmount('50')}
                  className="px-2.5 py-2 text-xs font-semibold bg-white hover:bg-slate-100 border border-slate-200 rounded-lg cursor-pointer"
                >
                  RM50
                </button>
                <button
                  type="button"
                  onClick={() => setWithdrawAmount('100')}
                  className="px-2.5 py-2 text-xs font-semibold bg-white hover:bg-slate-100 border border-slate-200 rounded-lg cursor-pointer"
                >
                  RM100
                </button>
                <button
                  type="button"
                  onClick={() => setWithdrawAmount(authorProfile.balance.toFixed(2))}
                  className="px-2.5 py-2 text-xs font-semibold bg-white hover:bg-slate-100 border border-slate-200 rounded-lg cursor-pointer text-[#0b4d32]"
                >
                  Semua
                </button>
              </div>

              <button
                type="submit"
                disabled={isWithdrawing || authorProfile.balance <= 0}
                className="px-5 py-2.5 bg-[#0b4d32] hover:bg-[#073623] text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer disabled:opacity-50 whitespace-nowrap"
              >
                {isWithdrawing ? 'Memproses...' : 'Tarik Tunai Sekarang'}
              </button>
            </form>
          </div>
        </section>
      )}

      {/* 1. Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0a4a2e] via-[#0E7749] to-[#043d24] text-white p-8 sm:p-12 lg:p-16 shadow-xl border border-emerald-800">
        <div className="relative z-10 max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/15 border border-white/20 text-xs font-bold uppercase tracking-wider backdrop-blur-md">
            <Sparkles className="w-4 h-4 text-emerald-300" />
            <span>Nak Jadi Penulis? • Program Penerbitan Karya Digital</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black font-serif-book leading-tight tracking-tight">
            Jana Pendapatan Pasif Berterusan Sebagai Penulis Buku Digital
          </h1>

          <p className="text-emerald-100 text-sm sm:text-base leading-relaxed max-w-2xl font-sans">
            Terbitkan karya anda secara <strong className="text-white">unlimited</strong>, nikmati{' '}
            <strong className="text-white">95% royalti bersih</strong> bagi setiap naskhah terjual, dan dapatkan hadiah
            percuma <em>"Panduan Menulis Buku Dengan Pantas"</em> hari ini!
          </p>

          {/* Quick Pillars Badges */}
          <div className="flex flex-wrap gap-2.5 pt-2 text-xs font-semibold text-emerald-100">
            <span className="bg-black/20 backdrop-blur-xs px-3 py-1.5 rounded-xl border border-white/10 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Yuran Permulaan: RM20 (Tahun 1)
            </span>
            <span className="bg-black/20 backdrop-blur-xs px-3 py-1.5 rounded-xl border border-white/10 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Tahun Seterusnya: RM10 Sahaja
            </span>
            <span className="bg-black/20 backdrop-blur-xs px-3 py-1.5 rounded-xl border border-white/10 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Royalti 95% Milik Penulis
            </span>
            <span className="bg-black/20 backdrop-blur-xs px-3 py-1.5 rounded-xl border border-white/10 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Karya Unlimited
            </span>
          </div>

          {/* Action CTAs */}
          <div className="pt-4 flex flex-wrap items-center gap-4">
            <button
              onClick={scrollToRegistration}
              className="px-6 py-3.5 bg-white text-[#0a4a2e] hover:bg-emerald-50 rounded-xl font-bold text-sm sm:text-base shadow-lg transition-transform hover:scale-105 active:scale-95 cursor-pointer flex items-center gap-2"
            >
              <span>Daftar Jadi Penulis Sekarang (RM 20)</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {onReadGuideBook && (
              <button
                onClick={onReadGuideBook}
                className="px-5 py-3.5 bg-emerald-800/80 hover:bg-emerald-800 text-white rounded-xl font-semibold text-sm border border-emerald-600 transition-colors cursor-pointer flex items-center gap-2"
              >
                <Gift className="w-4 h-4 text-amber-300" />
                <span>Lihat Panduan Percuma</span>
              </button>
            )}
          </div>
        </div>

        {/* Decorative Abstract Glow */}
        <div className="absolute -right-20 -bottom-20 w-96 h-96 bg-emerald-400/20 rounded-full blur-3xl pointer-events-none" />
      </section>

      {/* 2. Enam (6) Syarat & Keistimewaan Utama */}
      <section className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold font-serif-book text-slate-900">
            6 Syarat & Keistimewaan Penulis di Karya Digital
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            Model penerbitan digital yang telus, adil, mesra penulis, dan beretika tinggi.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* Syarat 1: Yuran Permulaan RM20 */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs hover:shadow-md transition-all space-y-3 relative overflow-hidden group">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-[#0E7749]">
              <DollarSign className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#0E7749]">Syarat 1</span>
              <h3 className="text-base font-bold text-slate-900">Yuran Permulaan: RM 20 (Tahun Pertama)</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Akses penuh selama 1 tahun untuk membuka studio penulisan, memuat naik manuskrip atau fail EPUB/TXT, menetapkan harga,
                dan menguruskan jualan buku anda tanpa sebarang caj tersembunyi.
              </p>
            </div>
          </div>

          {/* Syarat 2: Tahun Seterusnya RM10 */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs hover:shadow-md transition-all space-y-3 relative overflow-hidden group">
            <div className="w-12 h-12 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-700">
              <Award className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-teal-700">Syarat 2</span>
              <h3 className="text-base font-bold text-slate-900">Tahun Seterusnya: RM 10 Sahaja</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Yuran pembaharuan tahunan yang sangat mampu milik. Hanya RM 10 setahun untuk mengekalkan kedai dan
                semua buku anda sentiasa aktif di pasaran pembaca.
              </p>
            </div>
          </div>

          {/* Syarat 3: Bebas Unsur Lucah & Seks */}
          <div className="bg-rose-50/60 border border-rose-200 rounded-2xl p-6 shadow-xs hover:shadow-md transition-all space-y-3 relative overflow-hidden group">
            <div className="w-12 h-12 rounded-xl bg-rose-100 border border-rose-300 flex items-center justify-center text-rose-700">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-rose-700">Syarat 3 (Wajib)</span>
              <h3 className="text-base font-bold text-rose-950">Tidak Boleh Ada Unsur Lucah & Seks</h3>
              <p className="text-xs text-rose-800/90 leading-relaxed">
                Semua karya mestilah beretika, sopan, dan selamat untuk dibaca. Sebarang bahan lucah, pornografi, atau
                seks dilarang sama sekali demi memelihara integriti komuniti pembaca.
              </p>
            </div>
          </div>

          {/* Syarat 4: Percuma Panduan Menulis Pantas */}
          <div className="bg-amber-50/60 border border-amber-200 rounded-2xl p-6 shadow-xs hover:shadow-md transition-all space-y-3 relative overflow-hidden group">
            <div className="w-12 h-12 rounded-xl bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-800">
              <Gift className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800">Syarat 4 (Bonus Percuma)</span>
              <h3 className="text-base font-bold text-amber-950">Hadiah: Panduan Menulis Pantas</h3>
              <p className="text-xs text-amber-900/90 leading-relaxed">
                Diberikan percuma sebaik sahaja mendaftar! Ebook panduan padat membongkar teknik menghasilkan naskhah
                lengkap dalam masa 30 hari dan menembusi writer’s block.
              </p>
            </div>
          </div>

          {/* Syarat 5: Jual Buku Unlimited */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs hover:shadow-md transition-all space-y-3 relative overflow-hidden group">
            <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-700">
              <Infinity className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-blue-700">Syarat 5</span>
              <h3 className="text-base font-bold text-slate-900">Boleh Jual Buku Sini Unlimited</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Tiada kuota atau had terbitan. Anda boleh menerbitkan 5, 20, atau 100 naskhah novel dan buku resepi
                tanpa sebarang bayaran tambahan bagi setiap tajuk baru.
              </p>
            </div>
          </div>

          {/* Syarat 6: Royalti 5% Platform (95% Penulis) */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs hover:shadow-md transition-all space-y-3 relative overflow-hidden group">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-[#0E7749]">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#0E7749]">Syarat 6</span>
              <h3 className="text-base font-bold text-slate-900">Caj Platform 5% (Penulis Dapat 95%)</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Caj platform yang paling adil di pasaran. Contoh: Buku dijual RM 10.00 &rarr; Penulis terima{' '}
                <strong>RM 9.50</strong>, manakala platform admin hanya mengambil <strong>RM 0.50</strong>.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Interactive Royalty Calculator */}
      <section className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-3xl p-6 sm:p-10 shadow-xl border border-slate-700">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-semibold">
              <TrendingUp className="w-4 h-4" />
              <span>Simulasi Anggaran Pendapatan Penulis</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold font-serif-book">
              Kira Potensi Royalti Bulanan Anda (95% Royalti Bersih)
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Lihat sendiri betapa lumayannya pendapatan anda dengan kadar pemotongan rendah 5% di Karya Digital.
            </p>
          </div>

          {/* Sliders & Results Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            {/* Sliders Area */}
            <div className="space-y-6 bg-slate-800/80 p-6 rounded-2xl border border-slate-700/80">
              {/* Slider 1: Harga Buku */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-300 font-medium">Harga Seunit Naskhah Buku:</span>
                  <span className="text-base font-bold text-emerald-400 font-mono">RM {calcPrice.toFixed(2)}</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="80"
                  step="1"
                  value={calcPrice}
                  onChange={(e) => setCalcPrice(Number(e.target.value))}
                  className="w-full accent-emerald-500 cursor-pointer h-2 bg-slate-700 rounded-lg"
                />
                <div className="flex justify-between text-[10px] text-slate-500">
                  <span>RM 5.00</span>
                  <span>RM 40.00</span>
                  <span>RM 80.00</span>
                </div>
              </div>

              {/* Slider 2: Anggaran Naskhah Terjual Sebulan */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-300 font-medium">Anggaran Naskhah Terjual Sebulan:</span>
                  <span className="text-base font-bold text-emerald-400 font-mono">{calcCopies} naskhah</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="1000"
                  step="10"
                  value={calcCopies}
                  onChange={(e) => setCalcCopies(Number(e.target.value))}
                  className="w-full accent-emerald-500 cursor-pointer h-2 bg-slate-700 rounded-lg"
                />
                <div className="flex justify-between text-[10px] text-slate-500">
                  <span>10 naskhah</span>
                  <span>500 naskhah</span>
                  <span>1,000 naskhah</span>
                </div>
              </div>
            </div>

            {/* Results Breakdown Card */}
            <div className="bg-gradient-to-br from-emerald-950/80 to-[#0a4a2e]/90 p-6 sm:p-8 rounded-2xl border border-emerald-600/40 space-y-5 text-center sm:text-left">
              <div>
                <span className="text-xs uppercase tracking-wider font-bold text-emerald-400">
                  Royalti Bersih Masuk Akaun Anda (95%)
                </span>
                <div className="text-3xl sm:text-4xl font-black text-white font-mono mt-1">
                  RM {authorEarnings.toLocaleString('ms-MY', { minimumFractionDigits: 2 })}
                </div>
                <span className="text-[11px] text-emerald-200">Setiap bulan (dianggarkan)</span>
              </div>

              <div className="pt-3 border-t border-emerald-700/50 space-y-2 text-xs font-mono">
                <div className="flex justify-between text-slate-300">
                  <span>Jumlah Jualan Kasar:</span>
                  <span>RM {totalGross.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-emerald-300">
                  <span>Royalti Anda (95%):</span>
                  <strong>RM {authorEarnings.toFixed(2)}</strong>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Caj Platform (5%):</span>
                  <span>RM {platformCut.toFixed(2)}</span>
                </div>
              </div>

              <div className="bg-white/10 rounded-xl p-3 text-[11px] text-emerald-100 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-300 shrink-0" />
                <span>
                  Hanya dengan menjual <strong>2 naskhah</strong> buku, anda sudah pulang modal yuran pendaftaran RM20!
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Showcase Hadiah Bonus Percuma: Ebook Menulis Pantas */}
      <section className="bg-gradient-to-r from-amber-500/10 via-emerald-500/10 to-transparent border border-emerald-200/80 rounded-3xl p-6 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="space-y-4 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold border border-amber-200">
            <Gift className="w-4 h-4 text-amber-700" />
            <span>Hadiah Percuma Eksklusif Penulis Berdaftar</span>
          </div>

          <h3 className="text-2xl font-bold font-serif-book text-slate-900">
            "Panduan Menulis Buku Dengan Pantas: Dari Idea Menjadi Naskhah Terbitan"
          </h3>

          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Ebook eksklusif ini disusun khas untuk membimbing anda dari zero hingga mempunyai manuskrip lengkap yang
            sedia dijual di pasaran. Bernilai RM 49.00 tetapi diberikan <strong>100% PERCUMA</strong> untuk anda
            sebaik mendaftar sebagai penulis.
          </p>

          <div className="space-y-2 text-xs text-slate-700">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#0E7749]" />
              <span>Modul 1: Menemukan Idea Emas & Menembusi Writer’s Block</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#0E7749]" />
              <span>Modul 2: Teknik Menulis 1,000 Patah Perkataan Setiap Hari</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#0E7749]" />
              <span>Modul 3: Membina Tajuk & Kulit Buku yang Menggoda Pembeli</span>
            </div>
          </div>
        </div>

        <div className="shrink-0 flex flex-col items-center text-center p-6 bg-white border border-slate-200 rounded-2xl shadow-sm w-full md:w-64 space-y-3">
          <div className="w-20 h-28 bg-[#0a4a2e] text-emerald-200 rounded-lg flex flex-col items-center justify-center p-2 shadow-md">
            <BookOpen className="w-8 h-8 text-white mb-1" />
            <span className="text-[9px] font-bold text-center uppercase tracking-wider text-amber-300">
              Ebook Percuma
            </span>
          </div>
          <div className="space-y-1">
            <span className="text-xs line-through text-slate-400">Harga Asal: RM 49.00</span>
            <div className="text-base font-black text-[#0E7749]">PERCUMA UNTUK ANDA</div>
          </div>
          {onReadGuideBook && (
            <button
              onClick={onReadGuideBook}
              className="w-full py-2 bg-emerald-50 hover:bg-emerald-100 text-[#0E7749] border border-emerald-300 rounded-xl text-xs font-bold transition-colors cursor-pointer"
            >
              Baca Pratonton Sekarang
            </button>
          )}
        </div>
      </section>

      {/* 5. Borang Pendaftaran Penulis Bersepadu */}
      <section
        id="borang-pendaftaran-penulis"
        className="bg-white border-2 border-emerald-300 rounded-3xl p-6 sm:p-10 lg:p-12 shadow-lg space-y-8"
      >
        <div className="text-center max-w-xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-[#0E7749] text-xs font-bold">
            <PenSquare className="w-4 h-4" />
            <span>Borang Pendaftaran Penulis</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold font-serif-book text-slate-900">
            Daftar Sekarang & Mula Terbitkan Karya Anda
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Hanya RM 20 untuk tahun pertama (Tahun seterusnya RM 10 sahaja). Tiada yuran tersembunyi.
          </p>
        </div>

        {authorProfile?.isSubscribed ? (
          <div className="bg-emerald-50 border border-emerald-300 rounded-2xl p-6 sm:p-8 text-center space-y-4 max-w-xl mx-auto">
            <div className="w-16 h-16 bg-[#0E7749] text-white rounded-full flex items-center justify-center mx-auto shadow-md">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <div className="space-y-1">
              <h3 className="text-xl font-bold text-slate-900">Anda Sudah Berdaftar Sebagai Penulis Sah!</h3>
              <p className="text-xs text-slate-600">
                Akaun atas nama <strong>{authorProfile.name}</strong> ({authorProfile.email}) sedang aktif.
              </p>
            </div>
            <div className="bg-white p-4 rounded-xl border border-emerald-200 text-xs flex justify-between items-center font-mono">
              <span className="text-slate-600">Baki Royalti Semasa:</span>
              <strong className="text-base text-[#0E7749]">RM {authorProfile.balance.toFixed(2)}</strong>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
              <button
                onClick={onOpenWriter}
                className="px-6 py-2.5 bg-[#0E7749] hover:bg-[#0a5634] text-white rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-2"
              >
                <PenSquare className="w-4 h-4" />
                <span>Buka Studio Tulis Buku</span>
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleRegister} className="max-w-2xl mx-auto space-y-6">
            {formMsg && (
              <div
                className={`p-4 rounded-xl text-xs font-medium border ${
                  formMsg.type === 'error'
                    ? 'bg-rose-50 border-rose-200 text-rose-800'
                    : 'bg-emerald-50 border-emerald-200 text-emerald-800'
                }`}
              >
                {formMsg.text}
              </div>
            )}

            {/* Pricing Summary Banner */}
            <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
              <div>
                <span className="font-bold text-[#0E7749] text-sm">Yuran Pendaftaran: RM 20.00</span>
                <p className="text-slate-500">Tahun Pertama (Tahun berikutnya hanya RM 10.00)</p>
              </div>
              <span className="px-2.5 py-1 bg-white text-[#0E7749] border border-emerald-300 font-bold rounded-lg text-[11px]">
                95% Royalti Milik Anda
              </span>
            </div>

            {/* Input Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Nama Penuh / Nama Pena Penulis <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="cth. Fatimah Zahra / Penulis Kembara"
                  className="w-full text-xs px-3.5 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0E7749] bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Emel Penulis <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="penulis@email.com"
                  className="w-full text-xs px-3.5 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0E7749] bg-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Nombor Telefon / WhatsApp
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="cth. +6012-3456789"
                  className="w-full text-xs px-3.5 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0E7749] bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Bank Pembayaran Royalti (95%) <span className="text-red-500">*</span>
                </label>
                <select
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0E7749] bg-white cursor-pointer"
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
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Nombor Akaun Bank Penulis <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={bankAccountNumber}
                onChange={(e) => setBankAccountNumber(e.target.value)}
                placeholder="cth. 164012345678"
                className="w-full text-xs font-mono px-3.5 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0E7749] bg-white"
              />
              <span className="text-[11px] text-slate-400 mt-1 block">
                Royalti jualan 95% akan disalurkan terus ke nombor akaun ini.
              </span>
            </div>

            {/* Syarat Mutlak: No Pornography / Obscenity Checkbox */}
            <div className="bg-rose-50/70 border-2 border-rose-200 rounded-2xl p-4 space-y-2">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  required
                  checked={agreedToEtiquette}
                  onChange={(e) => setAgreedToEtiquette(e.target.checked)}
                  className="mt-1 w-4 h-4 accent-rose-600 rounded cursor-pointer"
                />
                <div className="text-xs text-rose-950">
                  <strong className="block font-bold mb-0.5">
                    Perakuan Etika Kandungan (Syarat Wajib):
                  </strong>
                  <span>
                    Saya berikrar dan bersetuju bahawa semua buku yang diterbitkan adalah{' '}
                    <strong>bebas sepenuhnya daripada sebarang unsur lucah, pornografi, atau seks</strong>, serta
                    bersetuju dengan caj perkhidmatan platform 5% bagi setiap jualan.
                  </span>
                </div>
              </label>
            </div>

            {/* Payment Selector */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Pilih Kaedah Bayaran Yuran RM 20.00
              </label>
              <div className="grid grid-cols-3 gap-2.5">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('fpx')}
                  className={`p-3 rounded-xl border text-xs font-bold flex flex-col items-center justify-center gap-1 cursor-pointer transition-all ${
                    paymentMethod === 'fpx'
                      ? 'border-[#0E7749] bg-emerald-50 text-[#0E7749] shadow-xs'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <Building2 className="w-5 h-5" />
                  <span>FPX Online</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  className={`p-3 rounded-xl border text-xs font-bold flex flex-col items-center justify-center gap-1 cursor-pointer transition-all ${
                    paymentMethod === 'card'
                      ? 'border-[#0E7749] bg-emerald-50 text-[#0E7749] shadow-xs'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <CreditCard className="w-5 h-5" />
                  <span>Kad Bank</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('tng')}
                  className={`p-3 rounded-xl border text-xs font-bold flex flex-col items-center justify-center gap-1 cursor-pointer transition-all ${
                    paymentMethod === 'tng'
                      ? 'border-[#0E7749] bg-emerald-50 text-[#0E7749] shadow-xs'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <Sparkles className="w-5 h-5" />
                  <span>TnG eWallet</span>
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isProcessing}
              className="w-full py-4 bg-[#0E7749] hover:bg-[#0a5634] text-white rounded-xl font-bold text-sm sm:text-base shadow-lg transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isProcessing ? (
                <span>Memproses Pendaftaran Penulis RM 20.00...</span>
              ) : (
                <>
                  <span>Bayar RM 20.00 & Mula Terbitkan Buku Sekarang</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
            <p className="text-[11px] text-center text-slate-400">
              Langganan sah selama 1 tahun. Pembaharuan tahun hadapan hanya RM 10.00.
            </p>
          </form>
        )}
      </section>

      {/* 6. Soalan Lazim (FAQ) */}
      <section className="space-y-4 max-w-3xl mx-auto">
        <div className="text-center space-y-1">
          <h3 className="text-xl font-bold font-serif-book text-slate-900">
            Soalan Lazim Mengenai Penerbitan Penulis
          </h3>
          <p className="text-xs text-slate-500">Ketahui lebih lanjut mengenai hak cipta, royalti dan syarat terbitan.</p>
        </div>

        <div className="border border-slate-200 rounded-2xl overflow-hidden divide-y divide-slate-100 bg-white shadow-xs">
          {faqs.map((faq, idx) => (
            <div key={idx} className="p-4 transition-colors">
              <button
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full flex items-center justify-between text-left font-bold text-xs sm:text-sm text-slate-800 cursor-pointer"
              >
                <span>{faq.q}</span>
                <ChevronDown
                  className={`w-4 h-4 text-slate-400 transition-transform ${openFaq === idx ? 'rotate-180' : ''}`}
                />
              </button>
              {openFaq === idx && (
                <p className="text-xs text-slate-600 mt-2 leading-relaxed pl-1 pt-1 border-t border-slate-50">
                  {faq.a}
                </p>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
