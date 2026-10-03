import React, { useState } from 'react';
import { Mail, X, CheckCircle2, Send, MessageCircle } from 'lucide-react';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ContactModal: React.FC<ContactModalProps> = ({ isOpen, onClose }) => {
  const [subject, setSubject] = useState('Pertanyaan Projek Karya Digital');
  const [message, setMessage] = useState('');
  const [isSent, setIsSent] = useState(false);

  if (!isOpen) return null;

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    const mailtoUrl = `mailto:mykaryadigital@gmail.com?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(message || 'Salam, saya ingin bertanya berkenaan projek dan penerbitan Karya Digital.')}`;
    window.location.href = mailtoUrl;
    setIsSent(true);
    setTimeout(() => {
      onClose();
      setIsSent(false);
      setMessage('');
    }, 1800);
  };

  const presetSubjects = [
    'Pertanyaan Projek',
    'Servis Penerbitan 95%',
    'Kerjasama & Bisnes',
    'Sokongan Teknikal',
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[20px] max-w-md w-full p-6 shadow-2xl space-y-4 animate-in zoom-in-95 duration-150 text-left">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-[#006B57] dark:text-emerald-400 flex items-center justify-center">
              <Mail className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Hubungi Karya Digital</h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">mykaryadigital@gmail.com</p>
            </div>
          </div>
          <button
            onClick={onClose}
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
          <form onSubmit={handleSend} className="space-y-3.5 text-xs">
            {/* Quick preset subject pills */}
            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1.5">
                Topik Pertanyaan:
              </label>
              <div className="flex flex-wrap gap-1.5">
                {presetSubjects.map((sub) => (
                  <button
                    key={sub}
                    type="button"
                    onClick={() => setSubject(sub)}
                    className={`px-2.5 py-1 rounded-full text-[11px] font-medium transition-colors cursor-pointer ${
                      subject === sub
                        ? 'bg-[#006B57] text-white'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                    }`}
                  >
                    {sub}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                Tajuk Emel
              </label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
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
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Tuliskan soalan atau cadangan anda mengenai projek digital..."
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
                onClick={onClose}
                className="px-4 h-10 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-[12px] font-medium transition-colors cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
