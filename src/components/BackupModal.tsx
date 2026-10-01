import React, { useState } from 'react';
import { X, Download, Upload, CheckCircle2, AlertCircle, Database } from 'lucide-react';
import { exportAllData, importAllData } from '../services/storage';

interface BackupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDataRestored: () => void;
}

export const BackupModal: React.FC<BackupModalProps> = ({
  isOpen,
  onClose,
  onDataRestored,
}) => {
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  if (!isOpen) return null;

  const handleExport = async () => {
    try {
      setIsExporting(true);
      setStatusMessage(null);
      const jsonData = await exportAllData();
      const blob = new Blob([jsonData], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `cadangan-karya-digital-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
      setStatusMessage({ type: 'success', text: 'Semua buku, penanda, dan sorotan berjaya dicadangkan.' });
    } catch (e: any) {
      setStatusMessage({ type: 'error', text: 'Gagal mengeksport data: ' + e?.message });
    } finally {
      setIsExporting(false);
    }
  };

  const handleImportFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      try {
        setIsImporting(true);
        setStatusMessage(null);
        const text = await file.text();
        const result = await importAllData(text);
        setStatusMessage({
          type: 'success',
          text: `Berjaya memulihkan ${result.bookCount} buku digital ke dalam pustaka anda.`,
        });
        onDataRestored();
      } catch (err: any) {
        setStatusMessage({
          type: 'error',
          text: 'Format fail tidak sah atau rosak: ' + (err?.message || ''),
        });
      } finally {
        setIsImporting(false);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white border border-[#E2E8F0] rounded-[20px] shadow-2xl max-w-lg w-full overflow-hidden animate-in fade-in-50 zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#E2E8F0] flex items-center justify-between bg-[#F7F9F8]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#ECFDF5] flex items-center justify-center text-[#006B57]">
              <Database className="w-4 h-4" />
            </div>
            <h2 className="text-base font-bold text-[#102A27]">
              Cadangan & Pemulihan Pustaka
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <p className="text-xs text-[#64748B] leading-relaxed">
            Semua buku digital, novel, bab tulisan anda, penanda halaman, serta catatan sorotan disimpan di peranti anda. Anda boleh memuat turun fail sandaran JSON untuk disimpan atau dipindahkan ke peranti lain.
          </p>

          {statusMessage && (
            <div
              className={`p-3 rounded-[12px] text-xs flex items-start gap-2 ${
                statusMessage.type === 'success'
                  ? 'bg-[#ECFDF5] border border-[#A7F3D0] text-[#047857]'
                  : 'bg-rose-50 border border-rose-200 text-rose-800'
              }`}
            >
              {statusMessage.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-[#006B57] shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              )}
              <span>{statusMessage.text}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <button
              onClick={handleExport}
              disabled={isExporting}
              className="p-4 rounded-[14px] border border-[#CBD5E1] hover:border-[#006B57] bg-white hover:bg-slate-50 transition-all flex flex-col items-center justify-center gap-2 text-center cursor-pointer group shadow-2xs"
            >
              <div className="w-10 h-10 rounded-full bg-[#ECFDF5] text-[#006B57] flex items-center justify-center group-hover:scale-110 transition-transform">
                <Download className="w-5 h-5" />
              </div>
              <div>
                <span className="block text-xs font-bold text-[#102A27]">
                  {isExporting ? 'Mengeksport...' : 'Muat Turun Sandaran'}
                </span>
                <span className="text-[10px] text-[#64748B]">Simpan fail JSON ke peranti</span>
              </div>
            </button>

            <label className="p-4 rounded-[14px] border border-[#CBD5E1] hover:border-[#006B57] bg-white hover:bg-slate-50 transition-all flex flex-col items-center justify-center gap-2 text-center cursor-pointer group shadow-2xs">
              <input
                type="file"
                accept=".json"
                onChange={handleImportFile}
                disabled={isImporting}
                className="hidden"
              />
              <div className="w-10 h-10 rounded-full bg-slate-100 text-[#102A27] flex items-center justify-center group-hover:scale-110 transition-transform">
                <Upload className="w-5 h-5" />
              </div>
              <div>
                <span className="block text-xs font-bold text-[#102A27]">
                  {isImporting ? 'Memulihkan...' : 'Pulihkan Sandaran'}
                </span>
                <span className="text-[10px] text-[#64748B]">Pilih fail JSON dari peranti</span>
              </div>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};
