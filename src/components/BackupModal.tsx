import React, { useState } from 'react';
import { X, Download, Upload, RefreshCw, CheckCircle2, AlertCircle, Database } from 'lucide-react';
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
      a.download = `cadangan-pustaka-digital-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
      setStatusMessage({ type: 'success', text: 'Semua buku, penanda, dan sorotan berhasil dicadangkan.' });
    } catch (e: any) {
      setStatusMessage({ type: 'error', text: 'Gagal mengekspor data: ' + e?.message });
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
          text: `Berhasil memulihkan ${result.bookCount} buku digital ke dalam pustaka Anda.`,
        });
        onDataRestored();
      } catch (err: any) {
        setStatusMessage({
          type: 'error',
          text: 'Format berkas tidak valid atau rusak: ' + (err?.message || ''),
        });
      } finally {
        setIsImporting(false);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs">
      <div className="bg-white border border-stone-200 rounded-xl shadow-2xl max-w-lg w-full overflow-hidden animate-in fade-in-50 zoom-in-95 duration-200">
        <div className="px-6 py-4 border-b border-stone-200 flex items-center justify-between bg-stone-50">
          <div className="flex items-center gap-2">
            <Database className="w-5 h-5 text-amber-900" />
            <h2 className="text-base font-serif-book font-semibold text-stone-900">
              Cadangan & Pemulihan Pustaka
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-stone-400 hover:text-stone-700 rounded-md transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <p className="text-xs text-stone-600 leading-relaxed font-sans-ui">
            Semua buku digital, novel, bab tulisan Anda, penanda halaman, serta catatan sorotan disimpan di penyimpanan lokal peramban (IndexedDB). Anda dapat mengunduh berkas cadangan JSON untuk disimpan di komputer atau dipindahkan ke perangkat lain.
          </p>

          {statusMessage && (
            <div
              className={`p-3 rounded-lg text-xs flex items-start gap-2 ${
                statusMessage.type === 'success'
                  ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
                  : 'bg-rose-50 border border-rose-200 text-rose-800'
              }`}
            >
              {statusMessage.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              )}
              <div>{statusMessage.text}</div>
            </div>
          )}

          <div className="space-y-3 pt-2">
            {/* Export Card */}
            <div className="p-4 bg-stone-50 border border-stone-200/80 rounded-lg flex items-center justify-between gap-4">
              <div>
                <h4 className="text-sm font-semibold text-stone-900">Ekspor Cadangan</h4>
                <p className="text-xs text-stone-500">Unduh seluruh koleksi dalam berkas JSON</p>
              </div>
              <button
                onClick={handleExport}
                disabled={isExporting}
                className="px-3.5 py-2 text-xs font-medium text-stone-900 bg-white border border-stone-300 hover:bg-stone-100 rounded-md transition-colors cursor-pointer flex items-center gap-1.5 shrink-0"
              >
                <Download className="w-3.5 h-3.5" />
                <span>{isExporting ? 'Mengekspor...' : 'Unduh JSON'}</span>
              </button>
            </div>

            {/* Import Card */}
            <div className="p-4 bg-stone-50 border border-stone-200/80 rounded-lg flex items-center justify-between gap-4">
              <div>
                <h4 className="text-sm font-semibold text-stone-900">Pulihkan dari Berkas</h4>
                <p className="text-xs text-stone-500">Unggah berkas JSON cadangan yang telah dibuat</p>
              </div>
              <label className="px-3.5 py-2 text-xs font-medium text-white bg-amber-900 hover:bg-amber-800 rounded-md transition-colors cursor-pointer flex items-center gap-1.5 shrink-0">
                <Upload className="w-3.5 h-3.5" />
                <span>{isImporting ? 'Memproses...' : 'Pilih Berkas'}</span>
                <input
                  type="file"
                  accept=".json"
                  className="hidden"
                  onChange={handleImportFile}
                />
              </label>
            </div>
          </div>
        </div>

        <div className="px-6 py-3 border-t border-stone-200 bg-stone-50 text-right">
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-medium text-stone-700 hover:text-stone-900 cursor-pointer"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
