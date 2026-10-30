import React from 'react';
import { ActiveOption, User } from '../types';
import { SignaturePad } from './SignaturePad';
import { CheckCircle2, FileCheck, PenLine, Save, User as UserIcon, ShieldAlert, ArrowLeft } from 'lucide-react';

interface ConfirmationPanelProps {
  user: User;
  activeOption: ActiveOption;
  onChangeOption: (option: ActiveOption) => void;
  isConfirmedChecked: boolean;
  onToggleConfirmChecked: (checked: boolean) => void;
  appliedSignatureUrl: string | null;
  onApplySignature: (dataUrl: string) => void;
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
  onApplySignature,
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

      {/* Execution Method Selector: Option A vs Option B */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-slate-900 uppercase tracking-wider block">
          Select Execution Method
        </label>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {/* Option A card */}
          <button
            type="button"
            onClick={() => onChangeOption('confirm')}
            className={`p-3.5 rounded-xl border text-left transition-all flex flex-col justify-between cursor-pointer relative ${
              activeOption === 'confirm'
                ? 'border-indigo-600 bg-indigo-50/50 shadow-xs ring-1 ring-indigo-500'
                : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50'
            }`}
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-900">
                <FileCheck className="w-4 h-4 text-indigo-600" />
                Option A — Confirm
              </span>
              <span className="text-[10px] px-1.5 py-0.5 rounded font-medium bg-indigo-100 text-indigo-800">
                Default
              </span>
            </div>
            <p className="text-[11px] text-slate-500 leading-snug">
              Confirm agreement without drawing a signature mark.
            </p>
          </button>

          {/* Option B card */}
          <button
            type="button"
            onClick={() => onChangeOption('signature')}
            className={`p-3.5 rounded-xl border text-left transition-all flex flex-col justify-between cursor-pointer relative ${
              activeOption === 'signature'
                ? 'border-indigo-600 bg-indigo-50/50 shadow-xs ring-1 ring-indigo-500'
                : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50'
            }`}
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-900">
                <PenLine className="w-4 h-4 text-indigo-600" />
                Option B — Add Signature
              </span>
              <span className="text-[10px] px-1.5 py-0.5 rounded font-medium bg-slate-100 text-slate-700">
                Optional
              </span>
            </div>
            <p className="text-[11px] text-slate-500 leading-snug">
              Draw and affix your personal handwritten signature mark.
            </p>
          </button>
        </div>
      </div>

      {/* Option A Body */}
      {activeOption === 'confirm' && (
        <div className="p-4 rounded-xl border border-indigo-100 bg-indigo-50/30 space-y-3 animate-fade-in">
          <label
            htmlFor="confirm-contract-checkbox"
            className="flex items-start gap-3 cursor-pointer select-none"
          >
            <input
              id="confirm-contract-checkbox"
              type="checkbox"
              checked={isConfirmedChecked}
              onChange={(e) => onToggleConfirmChecked(e.target.checked)}
              className="mt-1 w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500 cursor-pointer"
            />
            <div className="space-y-1">
              <span className="text-xs font-semibold text-slate-900 block">
                I confirm that I have read and agree to this contract.
              </span>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                By ticking this box, your legal name (<strong className="text-slate-800">{user.fullName}</strong>) and current execution timestamp will be automatically inscribed into the document as a binding electronic affirmation.
              </p>
            </div>
          </label>

          {isConfirmedChecked && (
            <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center gap-2 text-emerald-800 text-xs">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Contract placeholders have been populated with your electronic confirmation.</span>
            </div>
          )}
        </div>
      )}

      {/* Option B Body */}
      {activeOption === 'signature' && (
        <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3.5 animate-fade-in">
          <SignaturePad
            onApplySignature={onApplySignature}
            onClearSignature={onClearSignature}
            appliedSignatureUrl={appliedSignatureUrl}
          />

          {appliedSignatureUrl && (
            <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center justify-between text-emerald-800 text-xs">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Your handwritten signature is embedded into the contract.</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Primary Action Button: Save Contract */}
      <div className="pt-2 space-y-2">
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
          Saving stores an immutable, audited snapshot to your local version history ledger.
        </p>
      </div>
    </div>
  );
};
