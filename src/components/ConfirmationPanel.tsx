import React from 'react';
import { ActiveOption, User } from '../types';
import { CheckCircle2, FileCheck, PenLine, Save, ShieldAlert, ArrowLeft, Trash2, Edit3, Sparkles } from 'lucide-react';

interface ConfirmationPanelProps {
  user: User;
  activeOption: ActiveOption;
  onChangeOption: (option: ActiveOption) => void;
  isConfirmedChecked: boolean;
  onToggleConfirmChecked: (checked: boolean) => void;
  appliedSignatureUrl: string | null;
  onOpenSignatureModal: () => void;
  onClearSignature: () => void;
  onSaveContract: () => void;
  isSaveEnabled: boolean;
  nextVersionLabel: string;
  isReadOnlyPastVersion?: boolean;
  pastVersionLabel?: string;
  onReturnToCurrent?: () => void;
}

export const ConfirmationPanel: React.FC<ConfirmationPanelProps> = ({
  user,
  activeOption,
  onChangeOption,
  isConfirmedChecked,
  onToggleConfirmChecked,
  appliedSignatureUrl,
  onOpenSignatureModal,
  onClearSignature,
  onSaveContract,
  isSaveEnabled,
  nextVersionLabel,
  isReadOnlyPastVersion = false,
  pastVersionLabel = '',
  onReturnToCurrent,
}) => {
  if (isReadOnlyPastVersion) {
    return (
      <div className="bg-white rounded-2xl border border-amber-200 p-5 shadow-xs space-y-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-900">Historical Snapshot: {pastVersionLabel}</h3>
            <p className="text-xs text-slate-600 mt-0.5">
              You are currently viewing an immutable, previously saved version. Editing and re-executing this archived record is locked.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onReturnToCurrent}
          className="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all shadow-sm cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Exit Read-Only & Return to Active Contract</span>
        </button>
      </div>
    );
  }

  const hasSignature = !!appliedSignatureUrl;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-5 space-y-5">
      {/* Signer Identity Header Card */}
      <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-indigo-100 text-indigo-700 font-semibold flex items-center justify-center text-xs shadow-xs">
            {user.fullName.split(' ').map((n) => n[0]).join('')}
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-900 flex items-center gap-1.5">
              {user.fullName}
              <span className="inline-block px-1.5 py-0.2 rounded text-[10px] font-medium bg-emerald-100 text-emerald-800 border border-emerald-200">
                Verified
              </span>
            </p>
            <p className="text-[11px] text-slate-500">{user.email} • ID: {user.idNumber}</p>
          </div>
        </div>
        <div className="text-right hidden sm:block">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold">Signatory</span>
          <span className="text-[11px] font-medium text-slate-700">Client Counterparty</span>
        </div>
      </div>

      {/* Main Execution Flow: Option A (Confirm) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
            <FileCheck className="w-4 h-4 text-indigo-600" />
            <span>Option A — Confirmation</span>
          </span>
          <span className="text-[10px] px-2 py-0.5 rounded font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100">
            Primary
          </span>
        </div>

        {/* Option A Confirmation Checkbox */}
        <div
          className={`p-4 rounded-xl border transition-all ${
            isConfirmedChecked && !hasSignature
              ? 'border-indigo-300 bg-indigo-50/50 shadow-xs'
              : 'border-slate-200 bg-white hover:border-slate-300'
          }`}
        >
          <label
            htmlFor="confirm-contract-checkbox"
            className="flex items-start gap-3 cursor-pointer select-none"
          >
            <input
              id="confirm-contract-checkbox"
              type="checkbox"
              checked={isConfirmedChecked && !hasSignature}
              onChange={(e) => {
                if (e.target.checked) {
                  onToggleConfirmChecked(true);
                  onChangeOption('confirm');
                } else {
                  onToggleConfirmChecked(false);
                }
              }}
              className="mt-1 w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500 cursor-pointer"
            />
            <div className="space-y-1">
              <span className="text-xs font-semibold text-slate-900 block">
                I confirm that I have read and agree to this contract.
              </span>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Checking this box auto-fills your legal name (<strong className="text-slate-800">{user.fullName}</strong>) and execution date into the contract.
              </p>
            </div>
          </label>

          {isConfirmedChecked && !hasSignature && (
            <div className="mt-3 p-2.5 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center gap-2 text-emerald-800 text-xs animate-fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Contract confirmed electronically. Ready to save!</span>
            </div>
          )}
        </div>
      </div>

      {/* Option B Status & Popup Trigger Card */}
      {hasSignature ? (
        <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/40 space-y-3 animate-fade-in">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-900 flex items-center gap-1.5">
              <PenLine className="w-4 h-4 text-emerald-600" />
              <span>Option B — Signature Attached</span>
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300">
              Active
            </span>
          </div>

          <div className="p-3 bg-white rounded-lg border border-emerald-200 flex items-center justify-between gap-3 shadow-2xs">
            <img
              src={appliedSignatureUrl}
              alt="Applied Signature"
              className="h-10 max-w-[160px] object-contain"
            />
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={onOpenSignatureModal}
                className="px-2.5 py-1 text-xs font-medium text-slate-700 hover:text-indigo-600 hover:bg-slate-100 rounded-md border border-slate-200 transition-colors flex items-center gap-1 cursor-pointer"
                title="Redraw signature"
              >
                <Edit3 className="w-3 h-3" />
                <span>Edit</span>
              </button>
              <button
                type="button"
                onClick={onClearSignature}
                className="px-2.5 py-1 text-xs font-medium text-rose-600 hover:bg-rose-50 rounded-md border border-rose-200 transition-colors flex items-center gap-1 cursor-pointer"
                title="Remove signature"
              >
                <Trash2 className="w-3 h-3" />
                <span>Remove</span>
              </button>
            </div>
          </div>
          <p className="text-[11px] text-emerald-800">
            Handwritten mark embedded into contract clause & signature block.
          </p>
        </div>
      ) : (
        <div className="pt-1">
          <button
            type="button"
            onClick={onOpenSignatureModal}
            className="w-full py-2.5 px-3.5 rounded-xl border border-dashed border-indigo-300 hover:border-indigo-500 bg-indigo-50/40 hover:bg-indigo-50 text-indigo-700 text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer group"
          >
            <PenLine className="w-4 h-4 text-indigo-600 group-hover:scale-110 transition-transform" />
            <span>Prefer to draw a signature? Open Option B</span>
          </button>
        </div>
      )}

      {/* Primary Action Button: Save Contract */}
      <div className="pt-2 space-y-2 border-t border-slate-100">
        <button
          type="button"
          onClick={onSaveContract}
          disabled={!isSaveEnabled}
          className={`w-full py-3 px-4 rounded-xl font-semibold text-xs flex items-center justify-center gap-2 transition-all shadow-sm ${
            isSaveEnabled
              ? 'bg-slate-900 hover:bg-slate-800 text-white shadow-slate-300 active:scale-[0.99] cursor-pointer'
              : 'bg-slate-200 text-slate-400 cursor-not-allowed'
          }`}
        >
          <Save className="w-4 h-4" />
          <span>
            {isSaveEnabled
              ? `Save Contract (Create ${nextVersionLabel})`
              : 'Save Contract (Confirm or Sign to Enable)'}
          </span>
        </button>

        <p className="text-[11px] text-center text-slate-500">
          Saving generates an audited snapshot in your version history ledger.
        </p>
      </div>
    </div>
  );
};
