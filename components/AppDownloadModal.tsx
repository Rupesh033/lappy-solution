'use client';

import React, { useState } from 'react';
import { 
  X, Download, Smartphone, ShieldCheck, CheckCircle2, 
  Sparkles, QrCode, ArrowDownToLine, Bell, ExternalLink, Zap
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { useStore } from '../context/StoreContext';

interface AppDownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AppDownloadModal: React.FC<AppDownloadModalProps> = ({ isOpen, onClose }) => {
  const { siteSettings, showToast } = useStore();
  const [downloadStarted, setDownloadStarted] = useState(false);

  if (!isOpen) return null;

  const downloadUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}/downloads/lapiez-app.apk`
    : '/downloads/lapiez-app.apk';

  const handleDownload = () => {
    setDownloadStarted(true);
    showToast('Starting Lapiez Android App download...');
    const link = document.createElement('a');
    link.href = '/downloads/lapiez-app.apk';
    link.download = 'Lapiez-Garhwa-App.apk';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => setDownloadStarted(false), 4000);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/65 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-lg overflow-hidden rounded-3xl bg-white shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Ribbon */}
        <div className="bg-gradient-to-r from-[#0F172A] via-[#1E293B] to-[#1A56DB] p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3.5">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#1A56DB] to-[#0A2560] border-2 border-white/20 flex items-center justify-center text-white shadow-lg flex-shrink-0">
              <Smartphone className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 mb-1">
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 font-extrabold text-[10px] uppercase tracking-wider flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Official Android App
                </span>
                <span className="text-[10px] text-slate-400">v1.0.0</span>
              </div>
              <h3 className="text-xl font-black text-white tracking-tight leading-tight">
                Download Lapiez App
              </h3>
              <p className="text-xs text-slate-300 mt-0.5">
                Garhwa's Fastest Hardware & CCTV Store on Mobile
              </p>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5">
          {/* Main Action: Direct APK Download Button */}
          <div>
            <button
              onClick={handleDownload}
              className="w-full h-13 px-5 rounded-2xl bg-[#1A56DB] hover:bg-[#1545B0] text-white font-extrabold text-sm sm:text-base flex items-center justify-center gap-2.5 shadow-lg shadow-blue-600/20 active:scale-[0.99] transition-all cursor-pointer"
            >
              <ArrowDownToLine className="w-5 h-5" />
              <span>{downloadStarted ? 'Downloading Lapiez APK...' : 'Download Android App (APK)'}</span>
            </button>
            <span className="text-[11px] text-gray-500 text-center block mt-1.5 font-medium">
              Direct Safe Download • Android 7.0 and above • 100% Virus-Free
            </span>
          </div>

          {/* QR Code Scan Section */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col sm:flex-row items-center gap-4">
            <div className="bg-white p-2 rounded-xl border border-slate-200 shadow-2xs flex-shrink-0">
              <QRCodeSVG 
                value={downloadUrl} 
                size={88}
                level="M"
                includeMargin={false}
              />
            </div>
            <div className="text-center sm:text-left space-y-1">
              <span className="text-xs font-bold text-gray-900 block flex items-center justify-center sm:justify-start gap-1">
                <QrCode className="w-3.5 h-3.5 text-blue-600" />
                Scan QR to Download on Phone
              </span>
              <p className="text-[11px] text-gray-500 leading-relaxed">
                Open your mobile camera or Google Lens to download the APK directly onto your smartphone.
              </p>
            </div>
          </div>

          {/* App Advantages */}
          <div className="space-y-2 pt-1">
            <span className="text-xs font-bold text-gray-800 uppercase tracking-wider block">
              Why Install Our Mobile App?
            </span>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded-xl bg-blue-50/50 border border-blue-100 flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#1A56DB] flex-shrink-0 mt-0.5" />
                <span className="text-slate-700 text-[11.5px] font-medium leading-tight">
                  Instant Order & Invoice Tracking
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-emerald-50/50 border border-emerald-100 flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                <span className="text-slate-700 text-[11.5px] font-medium leading-tight">
                  Real-time Stock Alerts & Deals
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-purple-50/50 border border-purple-100 flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-purple-600 flex-shrink-0 mt-0.5" />
                <span className="text-slate-700 text-[11.5px] font-medium leading-tight">
                  Fast 1-Tap UPI QR Checkout
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-amber-50/50 border border-amber-100 flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                <span className="text-slate-700 text-[11.5px] font-medium leading-tight">
                  Direct Showroom Desk Chat
                </span>
              </div>
            </div>
          </div>

          {/* Quick How to Install instructions */}
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-gray-400">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              Verified Clean APK (CBIC Compliant)
            </span>
            <span>Garhwa Showroom Official</span>
          </div>
        </div>
      </div>
    </div>
  );
};
