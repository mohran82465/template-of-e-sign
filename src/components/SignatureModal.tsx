import React from 'react';
import { SignaturePad } from './SignaturePad';
import { PenLine, X, ShieldCheck } from 'lucide-react';
import { User } from '../types';

interface SignatureModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User;
  onApplySignature: (dataUrl: string) => void;
  onClearSignature: () => void;
  appliedSignatureUrl: string | null;
  nextVersionLabel?: string;
}

export const SignatureModal: React.FC<SignatureModalProps> = ({
  isOpen,
  onClose,
  user,
  onApplySignature,
  onClearSignature,
  appliedSignatureUrl,
  nextVersionLabel = 'v1',
}) => {
  if (!isOpen) return null;

  const handleApply = (dataUrl: string) => {
    onApplySignature(dataUrl);
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="signature-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/75 backdrop-blur-sm animate-fade-in"
    >
      {/* Click outside to close */}
      <div className="fixed inset-0 -z-10" onClick={onClose} />

      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col transition-all">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-indigo-300">
              <PenLine className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <h2 id="signature-modal-title" className="text-sm font-bold tracking-tight text-white flex items-center gap-2">
                Draw Your Signature
              </h2>
              <p className="text-[11px] text-slate-300">
                Signing as <span className="font-semibold text-white">{user.fullName}</span> (ID: {user.idNumber})
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Close signature modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          {/* Signature canvas */}
          <SignaturePad
            onApplySignature={handleApply}
            onClearSignature={onClearSignature}
            appliedSignatureUrl={appliedSignatureUrl}
            applyButtonLabel={`Save `}
          />
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 border-t border-slate-200 px-6 py-3.5 flex items-center justify-between text-xs text-slate-500">
          <span className="flex items-center gap-1.5 text-[11px]">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Encrypted vector signature • Instant audit save</span>
          </span>
          <button
            type="button"
            onClick={onClose}
            className="text-xs font-semibold text-slate-600 hover:text-slate-900 px-3 py-1.5 rounded-lg hover:bg-slate-200/60 transition-colors cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
