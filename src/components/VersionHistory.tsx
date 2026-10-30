import React, { useState } from 'react';
import { ContractVersion } from '../types';
import { History, X, Clock, CheckCircle, PenLine, FileText, Download, Eye, ChevronRight, ShieldCheck, Trash2, ArrowLeft } from 'lucide-react';

interface VersionHistoryProps {
  isOpen: boolean;
  onClose: () => void;
  versions: ContractVersion[];
  activeViewingVersion: ContractVersion | null;
  onSelectVersion: (version: ContractVersion) => void;
  onReturnToCurrent: () => void;
  onDownloadVersionPdf: (version: ContractVersion) => void;
  onClearHistory: () => void;
}

export const VersionHistory: React.FC<VersionHistoryProps> = ({
  isOpen,
  onClose,
  versions,
  activeViewingVersion,
  onSelectVersion,
  onReturnToCurrent,
  onDownloadVersionPdf,
  onClearHistory,
}) => {
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  if (!isOpen) return null;

  const formatDate = (isoString: string) => {
    try {
      const d = new Date(isoString);
      return d.toLocaleString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return isoString;
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Contract Version History Drawer"
      className="fixed inset-0 z-50 overflow-hidden"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-6 sm:pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col border-l border-slate-200 animate-slide-in-right">
          {/* Header */}
          <div className="p-5 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center">
                <History className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-slate-900">Version History & Audit Log</h2>
                <p className="text-[11px] text-slate-500">
                  {versions.length} recorded {versions.length === 1 ? 'version' : 'versions'} (Newest first)
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors cursor-pointer"
              aria-label="Close drawer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Active view status reminder if viewing past */}
          {activeViewingVersion && (
            <div className="bg-amber-50 border-b border-amber-200 px-5 py-3 flex items-center justify-between text-xs text-amber-900">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-600 shrink-0" />
                <span>
                  Viewing <strong>{activeViewingVersion.versionLabel}</strong> snapshot
                </span>
              </div>
              <button
                onClick={() => {
                  onReturnToCurrent();
                  onClose();
                }}
                className="font-semibold text-amber-950 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Back to current
              </button>
            </div>
          )}

          {/* Content List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4 legal-scroll">
            {versions.length === 0 ? (
              <div className="text-center py-16 px-4 space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                  <FileText className="w-6 h-6" />
                </div>
                <h3 className="text-sm font-semibold text-slate-800">No versions saved yet</h3>
                <p className="text-xs text-slate-500 max-w-xs mx-auto leading-relaxed">
                  Confirm or sign the contract in the execution panel and click <strong>"Save Contract"</strong> to archive your first audited version.
                </p>
              </div>
            ) : (
              versions.map((ver, idx) => {
                const isSelected = activeViewingVersion?.id === ver.id;
                const isLatest = idx === 0;

                return (
                  <div
                    key={ver.id}
                    className={`rounded-xl border transition-all p-4 space-y-3 ${
                      isSelected
                        ? 'border-indigo-500 ring-2 ring-indigo-100 bg-indigo-50/40'
                        : 'border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50/50'
                    }`}
                  >
                    {/* Top row */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-slate-900 font-mono">
                          {ver.versionLabel}
                        </span>
                        {isLatest && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded font-semibold bg-indigo-100 text-indigo-700">
                            Latest
                          </span>
                        )}
                        {isSelected && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded font-semibold bg-amber-100 text-amber-800">
                            Viewing
                          </span>
                        )}
                      </div>

                      {/* Method Badge */}
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium ${
                          ver.method === 'signed'
                            ? 'bg-blue-50 text-blue-700 border border-blue-200'
                            : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        }`}
                      >
                        {ver.method === 'signed' ? (
                          <>
                            <PenLine className="w-3 h-3 text-blue-600" />
                            Drawn Signature
                          </>
                        ) : (
                          <>
                            <CheckCircle className="w-3 h-3 text-emerald-600" />
                            Confirmed
                          </>
                        )}
                      </span>
                    </div>

                    {/* Meta info */}
                    <div className="text-xs space-y-1 text-slate-600">
                      <p className="flex items-center gap-1 text-[11px] text-slate-500">
                        <Clock className="w-3 h-3" />
                        <span>Saved: {formatDate(ver.timestamp)}</span>
                      </p>
                      <p>
                        <span className="text-slate-400">Signer:</span>{' '}
                        <strong className="text-slate-800">{ver.signerName}</strong>
                      </p>
                      <p className="font-mono text-[10px] text-slate-400 truncate">
                        Hash: {ver.auditHash}
                      </p>
                    </div>

                    {/* Signature thumbnail if present */}
                    {ver.signatureImage && (
                      <div className="p-2 bg-slate-50 rounded border border-slate-200 flex items-center justify-between">
                        <span className="text-[10px] text-slate-400">Signature stamp:</span>
                        <img
                          src={ver.signatureImage}
                          alt="Signature thumbnail"
                          className="h-7 max-w-[120px] object-contain"
                        />
                      </div>
                    )}

                    {/* Action buttons */}
                    <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                      <button
                        type="button"
                        onClick={() => {
                          onSelectVersion(ver);
                          onClose();
                        }}
                        className={`font-semibold flex items-center gap-1 py-1 px-2.5 rounded-lg transition-colors cursor-pointer ${
                          isSelected
                            ? 'text-indigo-700 bg-indigo-100'
                            : 'text-slate-700 hover:text-indigo-600 hover:bg-slate-100'
                        }`}
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>{isSelected ? 'Currently Viewing' : 'View Snapshot'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => onDownloadVersionPdf(ver)}
                        className="text-slate-600 hover:text-slate-900 font-medium flex items-center gap-1 py-1 px-2 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                        title="Download PDF"
                      >
                        <Download className="w-3.5 h-3.5 text-slate-500" />
                        <span>PDF</span>
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer with Reset / Clear option for testing */}
          {versions.length > 0 && (
            <div className="p-4 border-t border-slate-200 bg-slate-50">
              {showClearConfirm ? (
                <div className="space-y-2 text-xs">
                  <p className="text-rose-700 font-medium">
                    Clear all saved version snapshots from localStorage?
                  </p>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        onClearHistory();
                        setShowClearConfirm(false);
                      }}
                      className="px-3 py-1.5 bg-rose-600 text-white rounded-lg font-semibold hover:bg-rose-700 cursor-pointer"
                    >
                      Yes, Clear All
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowClearConfirm(false)}
                      className="px-3 py-1.5 bg-slate-200 text-slate-700 rounded-lg font-medium hover:bg-slate-300 cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Audited Local Ledger</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowClearConfirm(true)}
                    className="text-rose-600 hover:text-rose-800 text-[11px] font-medium flex items-center gap-1 hover:underline cursor-pointer"
                  >
                    <Trash2 className="w-3 h-3" />
                    Reset Ledger
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
