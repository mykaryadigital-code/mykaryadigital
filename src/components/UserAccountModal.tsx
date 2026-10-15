import React, { useState } from 'react';
import {
  X,
  User,
  ShieldCheck,
  Database,
  Sun,
  Moon,
  Wallet,
  Feather,
  CheckCircle2,
  Lock,
} from 'lucide-react';
import { useMarketplace } from '../context/MarketplaceContext';

interface UserAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  isAdmin: boolean;
  onToggleAdmin: () => void;
  onOpenBackup: () => void;
  onOpenAuthorDashboard: () => void;
  onOpenAdminPortal: () => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
}

export const UserAccountModal: React.FC<UserAccountModalProps> = ({
  isOpen,
  onClose,
  isAdmin,
  onToggleAdmin,
  onOpenBackup,
  onOpenAuthorDashboard,
  onOpenAdminPortal,
  isDarkMode,
  onToggleDarkMode,
}) => {
  const { authorProfile } = useMarketplace();
  const [adminPinInput, setAdminPinInput] = useState('');
  const [showPinPrompt, setShowPinPrompt] = useState(false);
  const [pinError, setPinError] = useState('');

  if (!isOpen) return null;

  const handleAdminToggleClick = () => {
    if (isAdmin) {
      // Turn off directly
      onToggleAdmin();
    } else {
      setShowPinPrompt(true);
      setPinError('');
    }
  };

  const handleConfirmPin = (e: React.FormEvent) => {
    e.preventDefault();
    // Default master PIN for admin access: 2026 or admin
    if (adminPinInput === '2026' || adminPinInput.toLowerCase() === 'admin' || adminPinInput.trim() === 'mykarya') {
      onToggleAdmin();
      setShowPinPrompt(false);
      setAdminPinInput('');
      setPinError('');
    } else {
      setPinError('PIN Pentadbir tidak tepat. (Petunjuk: 2026)');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-md w-full overflow-hidden shadow-2xl flex flex-col text-left">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#ECFDF5] dark:bg-emerald-950 text-[#006B57] dark:text-emerald-400 flex items-center justify-center">
              <User className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Akaun &amp; Tetapan Peribadi
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {/* User Profile Card */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 flex items-center justify-between">
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                {authorProfile?.name || 'Pembaca MyKarya'}
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {authorProfile?.email || 'mykaryadigital@gmail.com'}
              </p>
              <div className="flex items-center gap-1.5 mt-2">
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#ECFDF5] dark:bg-emerald-950 text-[#006B57] dark:text-emerald-400 border border-[#A7F3D0] dark:border-emerald-800">
                  {authorProfile?.isSubscribed ? 'Pengarang Sah (95% Royalti)' : 'Akaun Pembaca'}
                </span>
                {isAdmin && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 border border-rose-200">
                    Pentadbir (Admin)
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Action List */}
          <div className="space-y-2 text-xs">
            {/* Dompet Royalti (Penulis) */}
            <button
              onClick={() => {
                onClose();
                onOpenAuthorDashboard();
              }}
              className="w-full min-h-[44px] p-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center justify-between transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <Wallet className="w-4 h-4 text-[#006B57] dark:text-emerald-400" />
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  Pusat Royalti &amp; Dompet Penulis
                </span>
              </div>
              <span className="font-bold font-mono-data text-[#006B57] dark:text-emerald-400">
                RM {authorProfile?.balance !== undefined ? authorProfile.balance.toFixed(2) : '308.75'}
              </span>
            </button>

            {/* Simpanan Setempat & Sandaran */}
            <button
              onClick={() => {
                onClose();
                onOpenBackup();
              }}
              className="w-full min-h-[44px] p-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center justify-between transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <Database className="w-4 h-4 text-blue-500" />
                <div className="text-left">
                  <span className="font-semibold text-slate-800 dark:text-slate-200 block">
                    Simpanan Setempat &amp; Sandaran Data
                  </span>
                  <span className="text-[10px] text-slate-400">
                    Eksport / import fail naskhah di peranti anda
                  </span>
                </div>
              </div>
              <span className="text-[10px] text-slate-400 font-semibold">Urus &rarr;</span>
            </button>

            {/* Tukar Mod Tema */}
            <button
              onClick={onToggleDarkMode}
              className="w-full min-h-[44px] p-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center justify-between transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                {isDarkMode ? (
                  <Sun className="w-4 h-4 text-amber-400" />
                ) : (
                  <Moon className="w-4 h-4 text-slate-600" />
                )}
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  Tema: {isDarkMode ? 'Mod Gelap (Aktif)' : 'Mod Cerah (Aktif)'}
                </span>
              </div>
              <span className="text-[10px] text-slate-400 font-semibold">Tukar</span>
            </button>

            {/* Admin Portal Direct Button if already admin */}
            {isAdmin && (
              <button
                onClick={() => {
                  onClose();
                  onOpenAdminPortal();
                }}
                className="w-full min-h-[44px] p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-800 dark:text-rose-200 flex items-center justify-between transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-rose-600" />
                  <span className="font-bold">Buka Portal Pentadbir (Admin)</span>
                </div>
                <span className="text-[10px] text-rose-500 font-semibold">5% Panel &rarr;</span>
              </button>
            )}
          </div>

          {/* Admin Role Toggle Section */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between text-xs">
              <div>
                <span className="font-semibold text-slate-700 dark:text-slate-300 block">
                  Peranan Pentadbir (Admin)
                </span>
                <span className="text-[10px] text-slate-400">
                  {isAdmin ? 'Menu admin sedang aktif' : 'Menu admin disembunyikan untuk keselamatan'}
                </span>
              </div>
              <button
                type="button"
                onClick={handleAdminToggleClick}
                className={`min-h-[36px] px-3 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                  isAdmin
                    ? 'bg-rose-100 text-rose-700 hover:bg-rose-200 dark:bg-rose-950 dark:text-rose-300'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300'
                }`}
              >
                {isAdmin ? 'Nyahaktif' : 'Aktifkan'}
              </button>
            </div>

            {/* PIN Prompt if activating admin */}
            {showPinPrompt && (
              <form onSubmit={handleConfirmPin} className="mt-3 p-3 bg-slate-50 dark:bg-slate-800/80 rounded-xl space-y-2">
                <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-700 dark:text-slate-200">
                  <Lock className="w-3.5 h-3.5 text-amber-500" />
                  <span>Masukkan PIN Admin (contoh: 2026):</span>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="password"
                    value={adminPinInput}
                    onChange={(e) => setAdminPinInput(e.target.value)}
                    placeholder="PIN..."
                    className="flex-1 p-2 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:border-[#006B57]"
                    autoFocus
                  />
                  <button
                    type="submit"
                    className="px-3 py-2 bg-[#006B57] text-white text-xs font-semibold rounded-lg cursor-pointer"
                  >
                    Sahkan
                  </button>
                </div>
                {pinError && <p className="text-[10px] text-rose-500 font-medium">{pinError}</p>}
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
