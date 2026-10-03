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

        <div className="relative z-10 max-w-3xl space-y-5 sm:space-y-6 text-left">
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
            <strong className="text-slate-900 dark:text-white font-semibold">95% royalti bersih</strong> untuk penulis.
          </p>

          {/* 2 Call-to-Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 sm:gap-4 pt-1">
            {/* Butang Primer: High contrast with subtle hover effect */}
            <button
              onClick={onExploreProjects}
              className="inline-flex items-center justify-center gap-2 h-11 sm:h-12 px-5 sm:px-6 rounded-[12px] bg-[#006B57] hover:bg-[#063F35] dark:bg-emerald-500 dark:hover:bg-emerald-400 text-white font-semibold text-xs sm:text-sm shadow-sm hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer"
            >
              <BookOpen className="w-4 h-4 text-emerald-100 dark:text-emerald-950" />
              <span>Lihat Projek Digital</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* Butang Sekunder: Outline / Ghost Button */}
            <button
              onClick={handleContactClick}
              className="inline-flex items-center justify-center gap-2 h-11 sm:h-12 px-5 sm:px-6 rounded-[12px] border border-slate-300 dark:border-slate-700 bg-white/70 dark:bg-slate-800/70 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 font-semibold text-xs sm:text-sm transition-all hover:-translate-y-0.5 active:translate-y-0 cursor-pointer shadow-2xs"
            >
              <Mail className="w-4 h-4 text-slate-500 dark:text-slate-400" />
              <span>Hubungi Kami</span>
            </button>

            {/* Optional quick link to Author Guide */}
            <button
              onClick={onOpenAuthorGuide}
              className="text-xs font-semibold text-[#006B57] dark:text-emerald-400 hover:underline px-2 py-2 cursor-pointer hidden md:inline-flex items-center gap-1"
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
                    rows={3}
                    value={contactMessage}
                    onChange={(e) => setContactMessage(e.target.value)}
                    placeholder="Tuliskan pertanyaan mengenai naskhah atau penerbitan buku anda..."
                    className="w-full p-2.5 rounded-[10px] bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-[#006B57] dark:focus:border-emerald-400 resize-none"
                  />
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <button
                    type="submit"
                    className="flex-1 flex items-center justify-center gap-2 h-10 bg-[#006B57] hover:bg-[#063F35] dark:bg-emerald-500 dark:hover:bg-emerald-400 text-white font-semibold rounded-[12px] transition-colors cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Hantar Emel</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsContactModalOpen(false)}
                    className="px-4 h-10 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-[12px] font-medium transition-colors cursor-pointer"
                  >
                    Batal
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
