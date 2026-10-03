import React, { useState } from 'react';
import {
  BookOpen,
  ArrowRight,
  Mail,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  X,
  Send,
  MessageCircle,
  TrendingUp,
  Lock,
  Bookmark,
  Layers,
} from 'lucide-react';

interface HeroSectionProps {
  onExploreProjects: () => void;
  onOpenAuthorGuide: () => void;
  onOpenContact?: () => void;
  currentTab?: 'all' | 'reading' | 'shelves' | 'backup' | 'author_guide' | string;
  totalBooks?: number;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onExploreProjects,
  onOpenAuthorGuide,
  onOpenContact,
  currentTab = 'all',
  totalBooks = 4,
}) => {
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  const handleContactClick = () => {
    if (onOpenContact) {
      onOpenContact();
    } else {
      setIsContactModalOpen(true);
    }
  };
  const [contactSubject, setContactSubject] = useState('Pertanyaan Karya Digital');
  const [contactMessage, setContactMessage] = useState('');
  const [isSent, setIsSent] = useState(false);

  const handleSendEmail = (e: React.FormEvent) => {
    e.preventDefault();
    const mailtoUrl = `mailto:mykaryadigital@gmail.com?subject=${encodeURIComponent(
      contactSubject
    )}&body=${encodeURIComponent(contactMessage || 'Salam, saya berminat untuk mengetahui lebih lanjut.')}`;
    window.location.href = mailtoUrl;
    setIsSent(true);
    setTimeout(() => {
      setIsContactModalOpen(false);
      setIsSent(false);
      setContactMessage('');
    }, 2000);
  };

  return (
    <>
      <section className="relative overflow-hidden rounded-[24px] border border-slate-200/80 dark:border-slate-800 bg-gradient-to-br from-white/95 via-[#F8FAF9]/90 to-[#ECFDF5]/70 dark:from-slate-900/90 dark:via-slate-900/60 dark:to-emerald-950/20 backdrop-blur-md p-6 sm:p-10 lg:p-12 shadow-[0_4px_24px_rgba(15,23,42,0.03)] dark:shadow-[0_4px_24px_rgba(0,0,0,0.35)] transition-all">
        {/* Ambient subtle background glow */}
        <div className="absolute -top-24 -right-24 w-80 h-80 bg-emerald-400/15 dark:bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-teal-300/10 dark:bg-teal-500/5 rounded-full blur-3xl pointer-events-none" />

        {/* Decorative Editorial SVG Watermark */}
        <svg
          className="absolute right-0 bottom-0 top-0 h-full w-auto text-[#006B57] dark:text-emerald-500 opacity-[0.035] dark:opacity-[0.025] pointer-events-none select-none"
          viewBox="0 0 400 160"
          fill="none"
          preserveAspectRatio="xMaxYMid meet"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M20 140H380" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
          <path
            d="M50 40V140M60 30V140M75 50V140M85 35V140M105 25V140M115 45V140M135 30V140M150 40V140M165 20V140M180 50V140M200 35V140M215 30V140M230 45V140M250 20V140M265 40V140M285 35V140M300 25V140M320 45V140M335 30V140M350 40V140"
            stroke="currentColor"
            strokeWidth="10"
            strokeLinecap="round"
          />
        </svg>

        {/* Responsive Desktop Grid: Text on Left (col-7), Interactive UI Graphic on Right (col-5) */}
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          {/* Left Column: Heading, Subtitle & Actions */}
          <div className="lg:col-span-7 space-y-5 sm:space-y-6 text-left">
            {/* Top Value Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#ECFDF5] dark:bg-emerald-950/60 border border-[#A7F3D0] dark:border-emerald-800/60 text-[#006B57] dark:text-emerald-400 text-xs font-semibold tracking-wide">
              <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
              <span>Platform Penerbitan & Karya Digital Moden</span>
            </div>

            {/* H1 Main Heading: Bold, concise, focusing on digital products */}
            <h1 className="text-3xl sm:text-4xl lg:text-[44px] font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.18]">
              Perpustakaan & Ekosistem Buku Digital{' '}
              <span className="bg-gradient-to-r from-[#006B57] via-[#047857] to-emerald-600 dark:from-emerald-400 dark:to-teal-300 bg-clip-text text-transparent">
                Masa Hadapan.
              </span>
            </h1>

            {/* Subtitle: 1-2 lines explaining the digital solution */}
            <p className="text-sm sm:text-base lg:text-lg text-slate-600 dark:text-slate-300 font-normal leading-relaxed max-w-2xl">
              Akses dan baca naskhah pilihan dengan e-reader pantas di pelayar anda, atau terbitkan karya baharu tanpa had dengan agihan{' '}
              <strong className="text-slate-900 dark:text-white font-semibold">95% royalti bersih</strong> untuk penulis tempatan.
            </p>

            {/* 2 Call-to-Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 sm:gap-4 pt-1">
              {/* Butang Primer */}
              <button
                onClick={onExploreProjects}
                className="inline-flex items-center justify-center gap-2 h-11 sm:h-12 px-5 sm:px-6 rounded-[12px] bg-[#006B57] hover:bg-[#063F35] dark:bg-emerald-500 dark:hover:bg-emerald-400 text-white font-semibold text-xs sm:text-sm shadow-sm hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 active:scale-95 transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#006B57] dark:focus-visible:ring-emerald-400"
              >
                <BookOpen className="w-4 h-4 text-emerald-100 dark:text-emerald-950" />
                <span>Lihat Projek Digital</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {/* Butang Sekunder */}
              <button
                onClick={handleContactClick}
                className="inline-flex items-center justify-center gap-2 h-11 sm:h-12 px-5 sm:px-6 rounded-[12px] border border-slate-300 dark:border-slate-700 bg-white/70 dark:bg-slate-800/70 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 font-semibold text-xs sm:text-sm transition-all hover:-translate-y-0.5 active:translate-y-0 active:scale-95 cursor-pointer shadow-2xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#006B57] dark:focus-visible:ring-emerald-400"
              >
                <Mail className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                <span>Hubungi Kami</span>
              </button>

              {/* Quick link to Author Guide */}
              <button
                onClick={onOpenAuthorGuide}
                className="text-xs font-semibold text-[#006B57] dark:text-emerald-400 hover:underline px-2 py-2 cursor-pointer hidden md:inline-flex items-center gap-1 active:scale-95"
              >
                <span>Program Penulis (RM20)</span>
                <span>&rarr;</span>
              </button>
            </div>

            {/* Minimal Trust Features Row */}
            <div className="pt-2 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1.5 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#006B57] dark:text-emerald-400" />
                <span>95% Royalti Milik Penulis</span>
              </span>
              <span className="flex items-center gap-1.5 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#006B57] dark:text-emerald-400" />
                <span>Penerbitan Fail EPUB & TXT</span>
              </span>
              <span className="flex items-center gap-1.5 font-medium">
                <ShieldCheck className="w-3.5 h-3.5 text-[#006B57] dark:text-emerald-400" />
                <span>Bebas Iklan & Responsif</span>
              </span>
            </div>
          </div>

          {/* Right Column: Interactive Digital Product Mockup UI (Desktop) */}
          <div className="lg:col-span-5 hidden lg:flex flex-col items-center justify-center relative">
            {/* Ambient Background Glow behind device */}
            <div className="absolute inset-0 bg-emerald-500/10 dark:bg-emerald-400/10 rounded-full blur-2xl transform scale-90 pointer-events-none" />

            {/* Main Interactive Tablet / Browser Mockup Card */}
            <div
              onClick={onExploreProjects}
              className="relative w-full max-w-[390px] rounded-2xl border border-slate-200/90 dark:border-slate-700/80 bg-white/95 dark:bg-slate-900/95 shadow-[0_20px_50px_rgba(0,107,87,0.12)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.5)] backdrop-blur-md overflow-hidden select-none cursor-pointer transform hover:-translate-y-1.5 transition-all duration-300 group"
              title="Ketik untuk melihat naskhah secara langsung"
            >
              {/* Window Title Bar with Traffic Dots */}
              <div className="h-9 px-4 bg-slate-100/90 dark:bg-slate-800/90 border-b border-slate-200/70 dark:border-slate-700/70 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-400" />
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                </div>
                <div className="flex items-center gap-1.5 px-3 py-0.5 rounded-md bg-white dark:bg-slate-900 text-[10px] text-slate-500 dark:text-slate-400 font-mono-data border border-slate-200/60 dark:border-slate-700/60">
                  <Lock className="w-2.5 h-2.5 text-emerald-500" />
                  <span>karyadigital.com/reader</span>
                </div>
                <div className="w-8" />
              </div>

              {/* Reader Interface Body Simulation */}
              <div className="p-5 space-y-4 text-left">
                {/* Book Header Bar in Mockup */}
                <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                  <div>
                    <span className="text-[10px] font-mono-data uppercase tracking-wider text-emerald-600 dark:text-emerald-400 font-bold">
                      SEDANG DIBACA • BAB I
                    </span>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1">
                      Tenggelamnya Kapal Van der Wijck
                    </h4>
                  </div>
                  <div className="p-1 rounded-md bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400">
                    <Bookmark className="w-3.5 h-3.5 fill-current" />
                  </div>
                </div>

                {/* Simulated Editorial Reader Paragraph */}
                <div className="text-xs leading-relaxed text-slate-700 dark:text-slate-300 font-serif-book space-y-2">
                  <p>
                    <span className="float-left text-2xl font-bold font-serif-book text-[#006B57] dark:text-emerald-400 pr-1.5 leading-none">
                      K
                    </span>
                    etika kapal api yang membawanya dari pelabuhan Makassar mulai merapat di Teluk Bayur, hati Zainuddin berdebar kencang laksana ombak memecah di karang Pantai Padang...
                  </p>
                </div>

                {/* Reading Progress Indicator */}
                <div className="space-y-1.5 pt-1">
                  <div className="flex items-center justify-between text-[10px] font-mono-data text-slate-500 dark:text-slate-400">
                    <span>Kemajuan Bacaan</span>
                    <span className="font-semibold text-[#006B57] dark:text-emerald-400">42% Selesai</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-[#006B57] to-emerald-400 rounded-full w-[42%]" />
                  </div>
                </div>

                {/* Reader Toolbar Simulation */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 text-[10px] text-slate-500 dark:text-slate-400">
                  <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 font-medium">Aa Teks</span>
                  <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 font-medium">🌙 Mod Gelap</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-semibold group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
                    <span>Buka Reader</span>
                    <span>&rarr;</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Floating Metric Badge 1 (Top Right Offset) */}
            <div className="absolute -top-4 -right-3 bg-white dark:bg-slate-900 border border-emerald-200 dark:border-emerald-800/80 rounded-xl p-2.5 shadow-lg flex items-center gap-2.5 backdrop-blur-md animate-in fade-in duration-300">
              <div className="w-7 h-7 rounded-lg bg-emerald-100 dark:bg-emerald-950/80 text-[#006B57] dark:text-emerald-400 flex items-center justify-center shrink-0">
                <TrendingUp className="w-4 h-4" />
              </div>
              <div className="text-left leading-tight">
                <div className="text-[11px] font-bold text-slate-900 dark:text-white">95% Royalti</div>
                <div className="text-[9px] text-slate-500 dark:text-slate-400 font-medium">Agihan Bersih Penulis</div>
              </div>
            </div>

            {/* Floating Metric Badge 2 (Bottom Left Offset) */}
            <div className="absolute -bottom-3 -left-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 shadow-lg flex items-center gap-2.5 backdrop-blur-md animate-in fade-in duration-300">
              <div className="w-7 h-7 rounded-lg bg-amber-100 dark:bg-amber-950/80 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div className="text-left leading-tight">
                <div className="text-[11px] font-bold text-slate-900 dark:text-white">IndexedDB Ready</div>
                <div className="text-[9px] text-slate-500 dark:text-slate-400 font-medium">Sandaran Luar Talian</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Clean Contact Modal */}
      {isContactModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[20px] max-w-md w-full p-6 shadow-2xl space-y-5 animate-in zoom-in-95 duration-150 text-left">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-[#006B57] dark:text-emerald-400 flex items-center justify-center">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">Hubungi Karya Digital</h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">Pertanyaan, kerjasama & sokongan teknikal</p>
                </div>
              </div>
              <button
                onClick={() => setIsContactModalOpen(false)}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {isSent ? (
              <div className="p-4 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 rounded-xl text-center space-y-1.5">
                <CheckCircle2 className="w-8 h-8 text-[#006B57] dark:text-emerald-400 mx-auto" />
                <h4 className="text-sm font-bold text-[#006B57] dark:text-emerald-300">Pautan Emel Telah Dibuka</h4>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Sila teruskan penghantaran mesej melalui klien emel anda.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSendEmail} className="space-y-3.5 text-xs">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                    Emel Rasmi Platform
                  </label>
                  <div className="p-2.5 rounded-[10px] bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-mono-data">
                    mykaryadigital@gmail.com
                  </div>
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                    Tajuk Perkara
                  </label>
                  <input
                    type="text"
                    value={contactSubject}
                    onChange={(e) => setContactSubject(e.target.value)}
                    required
                    className="w-full p-2.5 rounded-[10px] bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-[#006B57] dark:focus:border-emerald-400"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                    Mesej Anda
                  </label>
                  <textarea
                    value={contactMessage}
                    onChange={(e) => setContactMessage(e.target.value)}
                    rows={4}
                    placeholder="Tuliskan soalan atau hasrat kerjasama anda di sini..."
                    required
                    className="w-full p-2.5 rounded-[10px] bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-[#006B57] dark:focus:border-emerald-400 resize-none"
                  />
                </div>

                <div className="pt-2 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsContactModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-medium transition-colors cursor-pointer"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-[#006B57] hover:bg-[#063F35] text-white font-semibold shadow-xs transition-colors cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Hantar Emel</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
};
