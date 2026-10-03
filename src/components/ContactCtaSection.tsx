import React from 'react';
import { Mail, MessageCircle, ArrowUpRight, Sparkles, CheckCircle2 } from 'lucide-react';

interface ContactCtaSectionProps {
  onOpenContactModal?: () => void;
}

export const ContactCtaSection: React.FC<ContactCtaSectionProps> = ({ onOpenContactModal }) => {
  const whatsappNumber = '601156828990';
  const whatsappPreFilledText = encodeURIComponent(
    'Salam MyKarya Digital, saya berminat untuk berkolaborasi mengenai projek digital dan penerbitan.'
  );
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${whatsappPreFilledText}`;

  const emailSubject = encodeURIComponent('Pertanyaan Kolaborasi Projek Digital - MyKarya');
  const emailBody = encodeURIComponent(
    'Salam pasukan MyKarya Digital,\n\nSaya berminat untuk berbincang mengenai kolaborasi pembangunan projek digital / penerbitan naskhah.\n\nTerima kasih.'
  );
  const mailtoUrl = `mailto:mykaryadigital@gmail.com?subject=${emailSubject}&body=${emailBody}`;

  return (
    <section
      aria-label="Seksyen Kolaborasi & Hubungi"
      className="relative overflow-hidden rounded-3xl border border-emerald-500/20 dark:border-emerald-500/10 bg-gradient-to-br from-[#063F35] via-[#005243] to-[#042822] text-white p-7 sm:p-10 lg:p-12 shadow-xl my-4 sm:my-6"
    >
      {/* Background Decorative Ambient Orbs */}
      <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-emerald-400/15 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full bg-teal-400/10 blur-3xl pointer-events-none" />

      {/* Decorative Grid Mesh */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(currentColor 1.5px, transparent 1.5px)',
          backgroundSize: '20px 20px',
        }}
      />

      <div className="relative z-10 max-w-3xl space-y-5 text-left">
        {/* Top Status Pill */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-400/15 border border-emerald-400/25 text-emerald-200 text-xs font-semibold backdrop-blur-md">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
          </span>
          <span>Buka Untuk Kolaborasi & Projek Baharu</span>
        </div>

        {/* Title */}
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-white leading-tight font-sans">
          Ada Idea Projek Digital atau Ingin Menerbitkan Naskhah Anda?
        </h2>

        {/* Description */}
        <p className="text-sm sm:text-base text-emerald-100/90 leading-relaxed font-normal max-w-2xl">
          Sama ada anda memerlukan sistem aplikasi web moden, integrasi e-dagang berautomasi, atau ingin
          menerbitkan naskhah karya kreatif dengan model agihan royalti 95% telus, kami bersedia membantu menjayakannya.
        </p>

        {/* Action Buttons: WhatsApp & Email */}
        <div className="flex flex-wrap items-center gap-3 pt-2">
          {/* Direct WhatsApp Button with pre-filled message */}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 px-5 py-3 rounded-xl text-xs sm:text-sm font-semibold bg-[#25D366] hover:bg-[#20ba5a] text-white shadow-md hover:shadow-lg transition-all active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#063F35] cursor-pointer"
            title="Sembang terus di WhatsApp"
          >
            <MessageCircle className="w-4 h-4 fill-white" />
            <span>Mesej WhatsApp</span>
            <ArrowUpRight className="w-3.5 h-3.5 opacity-80" />
          </a>

          {/* Email Button */}
          {onOpenContactModal ? (
            <button
              type="button"
              onClick={onOpenContactModal}
              className="inline-flex items-center gap-2.5 px-5 py-3 rounded-xl text-xs sm:text-sm font-semibold bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-md transition-all active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#063F35] cursor-pointer"
              title="Hantar emel rasmi"
            >
              <Mail className="w-4 h-4 text-emerald-200" />
              <span>mykaryadigital@gmail.com</span>
            </button>
          ) : (
            <a
              href={mailtoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 px-5 py-3 rounded-xl text-xs sm:text-sm font-semibold bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-md transition-all active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#063F35] cursor-pointer"
              title="Hantar emel pertanyaan"
            >
              <Mail className="w-4 h-4 text-emerald-200" />
              <span>mykaryadigital@gmail.com</span>
            </a>
          )}
        </div>

        {/* Feature Checkpoints */}
        <div className="pt-3 border-t border-white/10 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-emerald-200/80">
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Respons pantas dalam 24 jam</span>
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Perbincangan & perundingan percuma</span>
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Pematuhan privasi data penuh</span>
          </span>
        </div>
      </div>
    </section>
  );
};
