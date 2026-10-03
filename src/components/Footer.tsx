import React, { useState } from 'react';
import {
  Github,
  Mail,
  MessageCircle,
  ExternalLink,
  ShieldCheck,
  Heart,
  BookOpen,
  Sparkles,
} from 'lucide-react';
import { KaryaDigitalLogo } from './KaryaDigitalLogo';

interface FooterProps {
  onSelectTab?: (tab: 'all' | 'reading' | 'shelves' | 'backup' | 'author_guide') => void;
  onOpenContact?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onSelectTab, onOpenContact }) => {
  const [showTermsModal, setShowTermsModal] = useState<string | null>(null);

  const whatsappUrl =
    'https://wa.me/601156828990?text=' +
    encodeURIComponent('Salam MyKarya Digital, saya ingin berhubung mengenai platform ini.');

  return (
    <>
      <footer
        aria-label="Footer Laman Web"
        className="mt-12 pt-10 pb-8 border-t border-slate-200/80 dark:border-slate-800 text-slate-400 dark:text-slate-500 text-xs transition-colors"
      >
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Main Footer Row: Brand Info + Quick Links */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-left">
            {/* Column 1: Brand Info */}
            <div className="md:col-span-2 space-y-3">
              <div className="flex items-center gap-2.5 flex-wrap">
                <KaryaDigitalLogo size="sm" />
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono-data bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-semibold border border-slate-200/50 dark:border-slate-700/50">
                  v2.4
                </span>
              </div>
              <p className="text-slate-400 dark:text-slate-500 text-xs leading-relaxed max-w-sm">
                Ekosistem naskhah digital interaktif dan aplikasi penerbitan berautomasi Malaysia.
                Membawakan pengalaman membaca responsif serta peluang penjanaan royalti telus 95% untuk penulis tempatan.
              </p>
            </div>

            {/* Column 2: Navigasi Pantas */}
            <div className="space-y-2.5">
              <h4 className="font-semibold text-slate-700 dark:text-slate-300 text-xs uppercase tracking-wider">
                Navigasi
              </h4>
              <ul className="space-y-1.5">
                <li>
                  <button
                    type="button"
                    onClick={() => {
                      if (onSelectTab) onSelectTab('all');
                      const el = document.getElementById('koleksi-buku-grid');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="hover:text-slate-600 dark:hover:text-slate-300 transition-colors cursor-pointer active:scale-95 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#006B57] dark:focus-visible:ring-emerald-400 rounded-md"
                  >
                    Koleksi Projek & Naskhah
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => onSelectTab && onSelectTab('author_guide')}
                    className="hover:text-slate-600 dark:hover:text-slate-300 transition-colors cursor-pointer active:scale-95 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#006B57] dark:focus-visible:ring-emerald-400 rounded-md"
                  >
                    Program Penulis (Royalti 95%)
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => onSelectTab && onSelectTab('shelves')}
                    className="hover:text-slate-600 dark:hover:text-slate-300 transition-colors cursor-pointer active:scale-95 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#006B57] dark:focus-visible:ring-emerald-400 rounded-md"
                  >
                    Pengurusan Rak Buku
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => onSelectTab && onSelectTab('backup')}
                    className="hover:text-slate-600 dark:hover:text-slate-300 transition-colors cursor-pointer active:scale-95 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#006B57] dark:focus-visible:ring-emerald-400 rounded-md"
                  >
                    Sandaran Luar Talian (IndexedDB)
                  </button>
                </li>
              </ul>
            </div>

            {/* Column 3: Profil Rasmi & Perhubungan */}
            <div className="space-y-2.5">
              <h4 className="font-semibold text-slate-700 dark:text-slate-300 text-xs uppercase tracking-wider">
                Hubungan & Profil
              </h4>
              <div className="flex flex-col space-y-2">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 hover:text-[#25D366] transition-colors"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>WhatsApp Rasmi</span>
                </a>

                {onOpenContact ? (
                  <button
                    type="button"
                    onClick={onOpenContact}
                    className="inline-flex items-center gap-2 hover:text-[#006B57] dark:hover:text-emerald-400 transition-colors cursor-pointer text-left"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>mykaryadigital@gmail.com</span>
                  </button>
                ) : (
                  <a
                    href="mailto:mykaryadigital@gmail.com"
                    className="inline-flex items-center gap-2 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>mykaryadigital@gmail.com</span>
                  </a>
                )}

                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
                >
                  <Github className="w-3.5 h-3.5" />
                  <span>GitHub Repository</span>
                </a>
              </div>
            </div>
          </div>

          {/* Sub-Footer Row: Copyright & Legal */}
          <div className="pt-6 border-t border-slate-100 dark:border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px]">
            {/* Clean Copyright Notice */}
            <div className="flex items-center gap-1.5 text-slate-400 dark:text-slate-500">
              <span>&copy; 2026 MyKarya Digital. Hak Cipta Terpelihara.</span>
            </div>

            {/* Policy & Terms Links */}
            <div className="flex items-center gap-4 text-slate-400 dark:text-slate-500">
              <button
                type="button"
                onClick={() => setShowTermsModal('privasi')}
                className="hover:text-slate-600 dark:hover:text-slate-300 transition-colors cursor-pointer"
              >
                Dasar Privasi
              </button>
              <span>&bull;</span>
              <button
                type="button"
                onClick={() => setShowTermsModal('terma')}
                className="hover:text-slate-600 dark:hover:text-slate-300 transition-colors cursor-pointer"
              >
                Terma & Syarat
              </button>
              <span>&bull;</span>
              <span className="flex items-center gap-1 text-slate-400 dark:text-slate-500">
                <ShieldCheck className="w-3 h-3 text-[#006B57] dark:text-emerald-400" />
                <span>Simpanan Tempatan Selamat</span>
              </span>
            </div>
          </div>
        </div>
      </footer>

      {/* Simple Terms & Privacy Dialog */}
      {showTermsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 text-left">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              {showTermsModal === 'privasi' ? 'Dasar Privasi MyKarya Digital' : 'Terma & Syarat Penggunaan'}
            </h3>
            <div className="text-xs text-slate-600 dark:text-slate-300 space-y-2 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
              {showTermsModal === 'privasi' ? (
                <>
                  <p>
                    Semua fail naskhah, rekod penanda buku (*bookmarks*), dan sorotan teks disimpan secara selamat
                    dalam pangkalan data peribadi pelayar anda menggunakan teknologi IndexedDB.
                  </p>
                  <p>
                    Data anda tidak dimuat naik atau dipantau tanpa kebenaran eksplisit anda. Kami komited memelihara
                    hak privasi dan harta intelek setiap pembaca dan penulis.
                  </p>
                </>
              ) : (
                <>
                  <p>
                    Dengan menggunakan platform MyKarya Digital, anda bersetuju untuk mematuhi undang-undang hak cipta
                    naskhah digital yang diedarkan dan diterbitkan.
                  </p>
                  <p>
                    Penulis berhak penuh atas 95% royalti bersih setiap naskhah terjual tanpa sebarang potongan tersembunyi.
                  </p>
                </>
              )}
            </div>
            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setShowTermsModal(null)}
                className="px-4 py-2 text-xs font-semibold bg-[#006B57] dark:bg-emerald-600 text-white rounded-xl hover:bg-[#063F35] dark:hover:bg-emerald-500 transition-colors cursor-pointer"
              >
                Faham & Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
