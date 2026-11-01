import React from 'react';
import { CheckCircle2, Download, X, FileText, Calendar, ShieldCheck } from 'lucide-react';

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDownloadPdf: () => void;
  reservationNumber: string;
  contractNumber: string;
  guestName: string;
  versionLabel: string;
}

export const SuccessModal: React.FC<SuccessModalProps> = ({
  isOpen,
  onClose,
  onDownloadPdf,
  reservationNumber,
  contractNumber,
  guestName,
  versionLabel,
}) => {
  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="success-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-fade-in no-print"
    >
      {/* Backdrop */}
      <div className="fixed inset-0 -z-10" onClick={onClose} />

      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 overflow-hidden text-center p-6 sm:p-7 relative transition-all">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          aria-label="Close success popup"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Success Icon */}
        <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4 ring-8 ring-emerald-50">
          <CheckCircle2 className="w-9 h-9 stroke-[2.2]" />
        </div>

        {/* Title */}
        <h2 id="success-modal-title" className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
          Reservation contract signed successfully!
        </h2>

        <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
          Your signature has been officially registered and securely bound to this contract.
        </p>

        {/* Summary Card */}
        <div className="bg-slate-50 border border-slate-200/90 rounded-xl p-3.5 my-5 text-left text-xs space-y-2">
          <div className="flex items-center justify-between border-b border-slate-200/80 pb-2">
            <span className="text-slate-500 font-medium">Reservation No.</span>
            <span className="font-bold text-slate-900 font-mono">{reservationNumber}</span>
          </div>
          <div className="flex items-center justify-between border-b border-slate-200/80 pb-2">
            <span className="text-slate-500 font-medium">Contract Ref</span>
            <span className="font-bold text-slate-900 font-mono">{contractNumber}</span>
          </div>
          <div className="flex items-center justify-between border-b border-slate-200/80 pb-2">
            <span className="text-slate-500 font-medium">Signatory</span>
            <span className="font-semibold text-slate-800">{guestName}</span>
          </div>
          <div className="flex items-center justify-between pt-0.5">
            <span className="text-slate-500 font-medium">Saved Version</span>
            <span className="inline-flex items-center gap-1 font-semibold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded text-[11px]">
              <ShieldCheck className="w-3.5 h-3.5" />
              {versionLabel}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-2.5 pt-1">
          <button
            type="button"
            onClick={() => {
              onClose();
              onDownloadPdf();
            }}
            className="w-full sm:flex-1 py-2.5 px-4 rounded-xl text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 shadow-sm flex items-center justify-center gap-1.5 transition-all cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Download PDF</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="w-full sm:flex-1 py-2.5 px-4 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
          >
            View Contract
          </button>
        </div>
      </div>
    </div>
  );
};
