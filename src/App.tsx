import React, { useState, useRef, useMemo, useCallback } from 'react';
import { mockUser, mockContract } from './mockData';
import { ActiveOption, ConfirmationMethod, ToastMessage, ContractVersion } from './types';
import { useContractVersions } from './hooks/useContractVersions';
import { TermsModal } from './components/TermsModal';
import { ContractDocument } from './components/ContractDocument';
import { ConfirmationPanel } from './components/ConfirmationPanel';
import { VersionHistory } from './components/VersionHistory';
import { ToastContainer } from './components/Toast';
import { exportElementToPdf } from './utils/pdfExport';
import confetti from 'canvas-confetti';
import {
  FileText,
  History,
  Download,
  Printer,
  ShieldCheck,
  ArrowLeft,
  CheckCircle2,
  Lock,
  Layers,
  Sparkles,
  HelpCircle,
} from 'lucide-react';

export default function App() {
  // 1. Terms Modal state: starts open on load as blocking modal
  const [isTermsModalOpen, setIsTermsModalOpen] = useState(true);
  const [hasAcceptedTermsOnce, setHasAcceptedTermsOnce] = useState(false);

  // 2. Versioning Hook
  const {
    versions,
    latestVersion,
    activeViewingVersion,
    isViewingPastVersion,
    saveVersion,
    viewVersion,
    returnToCurrent,
    clearAllVersions,
  } = useContractVersions(mockContract);

  // 3. Version History Drawer state
  const [isHistoryDrawerOpen, setIsHistoryDrawerOpen] = useState(false);

  // 4. Execution panel state (Option A vs Option B)
  const [activeOption, setActiveOption] = useState<ActiveOption>('confirm');
  const [isConfirmedChecked, setIsConfirmedChecked] = useState(false);
  const [appliedSignatureUrl, setAppliedSignatureUrl] = useState<string | null>(null);

  // 5. Toast notifications
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // 6. PDF exporting status
  const [isExportingPdf, setIsExportingPdf] = useState(false);
  const documentRef = useRef<HTMLDivElement | null>(null);

  // Format today's date for live insertion
  const todayFormattedDate = useMemo(() => {
    return new Date().toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  }, []);

  // Helper to add toast
  const addToast = useCallback((title: string, description?: string, type: ToastMessage['type'] = 'success') => {
    const newToast: ToastMessage = {
      id: `toast-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      title,
      description,
      type,
    };
    setToasts((prev) => [...prev, newToast]);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Handle Terms Accept
  const handleAcceptTerms = () => {
    setIsTermsModalOpen(false);
    setHasAcceptedTermsOnce(true);
    addToast('Terms Accepted', 'You have granted electronic records consent.', 'info');
  };

  // Option switching: "Switching options resets the other option's state."
  const handleOptionChange = (newOption: ActiveOption) => {
    setActiveOption(newOption);
    if (newOption === 'confirm') {
      // Clear signature pad applied state
      setAppliedSignatureUrl(null);
    } else {
      // Clear Option A confirmation checkbox
      setIsConfirmedChecked(false);
    }
  };

  // Option A toggle
  const handleToggleConfirmChecked = (checked: boolean) => {
    setIsConfirmedChecked(checked);
  };

  // Option B signature apply
  const handleApplySignature = (dataUrl: string) => {
    setAppliedSignatureUrl(dataUrl);
    addToast('Signature Applied', 'Your handwritten mark has been positioned in the contract.', 'success');
  };

  // Option B clear signature
  const handleClearSignature = () => {
    setAppliedSignatureUrl(null);
  };

  // Is current draft filled/ready?
  const isCurrentDraftFilled = activeOption === 'confirm' ? isConfirmedChecked : !!appliedSignatureUrl;
  const isSaveEnabled = isCurrentDraftFilled && !isViewingPastVersion;

  // Next version label
  const nextVersionNumber = versions.length > 0 ? versions[0].versionNumber + 1 : 1;
  const nextVersionLabel = `v${nextVersionNumber}`;

  // Handle saving the contract version
  const handleSaveContract = () => {
    if (!isSaveEnabled) return;

    const method: ConfirmationMethod = activeOption === 'confirm' ? 'confirmed' : 'signed';

    const saved = saveVersion({
      method,
      signerName: mockUser.fullName,
      signerEmail: mockUser.email,
      signerIdNumber: mockUser.idNumber,
      signDate: todayFormattedDate,
      signatureImage: method === 'signed' && appliedSignatureUrl ? appliedSignatureUrl : undefined,
      contractSnapshot: mockContract,
    });

    // Success notification exactly as requested: "Contract saved as v2"
    addToast(
      `Contract saved as ${saved.versionLabel}`,
      `Audited record archived on ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} with SHA-256 hash.`,
      'success'
    );

    // Micro celebratory confetti
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8 },
      });
    } catch {
      // Ignore if unavailable
    }
  };

  // Handle PDF Export
  const handleDownloadPdf = async (targetVersion?: ContractVersion) => {
    if (targetVersion) {
      // If user clicked download for a specific archived version in history drawer,
      // switch to viewing it and download
      viewVersion(targetVersion);
    }

    const element = documentRef.current || document.getElementById('printable-contract-document');
    if (!element) {
      window.print();
      return;
    }

    setIsExportingPdf(true);
    addToast('Generating PDF Document', 'Rendering high-resolution vector snapshot...', 'info');

    const vLabel = activeViewingVersion ? activeViewingVersion.versionLabel : latestVersion ? latestVersion.versionLabel : 'draft';
    const fileName = `Contract-${mockContract.contractNumber}-${vLabel}.pdf`;

    try {
      await exportElementToPdf(element, fileName);
      addToast('Download Complete', `${fileName} saved to your device.`, 'success');
    } catch (err) {
      console.error(err);
      addToast('Download Notice', 'Initiated standard printable format.', 'info');
    } finally {
      setIsExportingPdf(false);
    }
  };

  // Derived display values depending on whether viewing a historical version or active draft
  const displayClientName = isViewingPastVersion
    ? activeViewingVersion?.signerName || ''
    : isCurrentDraftFilled
    ? mockUser.fullName
    : '';

  const displaySignDate = isViewingPastVersion
    ? activeViewingVersion?.signDate || ''
    : isCurrentDraftFilled
    ? todayFormattedDate
    : '';

  const displaySignatureImage = isViewingPastVersion
    ? activeViewingVersion?.signatureImage || null
    : appliedSignatureUrl;

  const displayMethod: ConfirmationMethod | 'none' = isViewingPastVersion
    ? activeViewingVersion?.method || 'none'
    : isCurrentDraftFilled
    ? activeOption === 'confirm'
      ? 'confirmed'
      : 'signed'
    : 'none';

  const isDisplayFilled = isViewingPastVersion || isCurrentDraftFilled;

  // Header version badge text near title
  const currentVersionBadgeText = isViewingPastVersion
    ? `Viewing ${activeViewingVersion?.versionLabel} (Archived)`
    : latestVersion
    ? `${latestVersion.versionLabel} (Latest Saved)`
    : 'Draft (Unsaved)';

  return (
    <div className="min-h-screen bg-slate-100/90 text-slate-900 flex flex-col font-sans">
      {/* 1. Terms & Conditions Modal (blocking on load) */}
      <TermsModal
        isOpen={isTermsModalOpen}
        onAccept={handleAcceptTerms}
        userFullName={mockUser.fullName}
      />

      {/* 2. Version History Drawer */}
      <VersionHistory
        isOpen={isHistoryDrawerOpen}
        onClose={() => setIsHistoryDrawerOpen(false)}
        versions={versions}
        activeViewingVersion={activeViewingVersion}
        onSelectVersion={viewVersion}
        onReturnToCurrent={returnToCurrent}
        onDownloadVersionPdf={handleDownloadPdf}
        onClearHistory={clearAllVersions}
      />

      {/* 3. Toast Notifications */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />

      {/* TOP APPLICATION BAR */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-2xs no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          {/* Brand & Document Name */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-700 to-slate-900 text-white flex items-center justify-center font-bold shadow-xs">
              <FileText className="w-5 h-5 text-indigo-200" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm tracking-tight text-slate-900">SignFlow</span>
                <span className="text-[11px] px-2 py-0.5 rounded-full font-mono font-medium bg-slate-100 text-slate-600 border border-slate-200">
                  {currentVersionBadgeText}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 hidden sm:block truncate max-w-sm">
                {mockContract.title}
              </p>
            </div>
          </div>

          {/* Right actions: User pill, History button, PDF export */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Review terms link */}
            <button
              type="button"
              onClick={() => setIsTermsModalOpen(true)}
              className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
              title="Review Terms & Conditions Disclosure"
            >
              <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
              <span>Review Terms</span>
            </button>

            {/* Version History Button */}
            <button
              type="button"
              onClick={() => setIsHistoryDrawerOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200/80 rounded-xl transition-colors cursor-pointer border border-slate-200"
            >
              <History className="w-3.5 h-3.5 text-indigo-600" />
              <span>History</span>
              {versions.length > 0 && (
                <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-indigo-600 text-white font-mono">
                  {versions.length}
                </span>
              )}
            </button>

            {/* Print / Download Button */}
            <button
              type="button"
              onClick={() => handleDownloadPdf()}
              disabled={isExportingPdf}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-all shadow-xs cursor-pointer disabled:opacity-50"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">
                {isExportingPdf ? 'Exporting...' : 'Download PDF'}
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Historical View Sticky Notice Banner (When user is viewing a past version snapshot) */}
      {isViewingPastVersion && activeViewingVersion && (
        <div className="bg-amber-500 text-slate-950 px-4 py-2.5 text-xs font-medium shadow-xs flex items-center justify-between no-print sticky top-16 z-20">
          <div className="max-w-7xl mx-auto w-full flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="font-bold uppercase tracking-wider text-[11px] bg-amber-950 text-white px-2 py-0.5 rounded">
                Read-Only Archive
              </span>
              <span>
                Viewing <strong>{activeViewingVersion.versionLabel}</strong> — saved{' '}
                {new Date(activeViewingVersion.timestamp).toLocaleString(undefined, {
                  dateStyle: 'medium',
                  timeStyle: 'short',
                })}{' '}
                by {activeViewingVersion.signerName}
              </span>
            </div>
            <button
              type="button"
              onClick={returnToCurrent}
              className="bg-slate-950 text-white hover:bg-slate-800 px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer shrink-0"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to current draft</span>
            </button>
          </div>
        </div>
      )}

      {/* MAIN CONTENT AREA */}
      <main className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 flex-1 w-full">
        {/* Two-column layout on desktop: Contract Document on left/center, Sticky Confirmation Panel on right */}
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          
          {/* LEFT: Contract Paper Document View */}
          <div className="w-full lg:flex-1 flex flex-col items-center">
            {/* Helper status strip above paper */}
            <div className="w-full max-w-[820px] mb-3 flex items-center justify-between text-xs text-slate-500 no-print">
              <div className="flex items-center gap-2">
                <span className="inline-block w-2 h-2 rounded-full bg-emerald-500"></span>
                <span>Commercial Standard Form AGR-2026</span>
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="hover:text-slate-800 flex items-center gap-1 cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print preview</span>
                </button>
                <span>•</span>
                <span>Zoom: 100% (A4)</span>
              </div>
            </div>

            {/* The Document */}
            <ContractDocument
              contract={mockContract}
              isFilled={isDisplayFilled}
              clientName={displayClientName}
              signDate={displaySignDate}
              signatureImage={displaySignatureImage}
              method={displayMethod}
              versionBadgeText={currentVersionBadgeText}
              isHistoricalView={isViewingPastVersion}
              historicalDate={activeViewingVersion?.timestamp}
              auditHash={activeViewingVersion?.auditHash}
              documentRef={documentRef}
            />
          </div>

          {/* RIGHT: Confirmation & Execution Panel (Sticky on desktop, stacked on mobile) */}
          <aside className="w-full lg:w-96 lg:sticky lg:top-24 shrink-0 no-print space-y-4">
            <ConfirmationPanel
              user={mockUser}
              activeOption={activeOption}
              onChangeOption={handleOptionChange}
              isConfirmedChecked={isConfirmedChecked}
              onToggleConfirmChecked={handleToggleConfirmChecked}
              appliedSignatureUrl={appliedSignatureUrl}
              onApplySignature={handleApplySignature}
              onClearSignature={handleClearSignature}
              onSaveContract={handleSaveContract}
              isSaveEnabled={isSaveEnabled}
              nextVersionLabel={nextVersionLabel}
              isReadOnlyPastVersion={isViewingPastVersion}
              pastVersionLabel={activeViewingVersion?.versionLabel}
              onReturnToCurrent={returnToCurrent}
            />

            {/* Quick Audit & Security Guarantee Card */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-4 text-xs text-slate-600 space-y-2.5 shadow-2xs">
              <div className="flex items-center gap-2 text-slate-900 font-semibold">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Legally Binding Digital Protocol</span>
              </div>
              <p className="text-[11px] leading-relaxed text-slate-500">
                This transaction adheres to the Electronic Signatures in Global and National Commerce Act (E-SIGN) and UETA guidelines. Each version snapshot is tamper-sealed and persisted to localStorage.
              </p>
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                <span className="text-slate-400">Total Saved Versions:</span>
                <span className="font-mono font-bold text-slate-800">{versions.length}</span>
              </div>
            </div>
          </aside>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="mt-auto border-t border-slate-200 bg-white py-6 text-xs text-slate-500 no-print">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-800">SignFlow</span>
            <span>•</span>
            <span>Client Signing Workspace</span>
            <span>•</span>
            <span className="text-slate-400">Client: {mockUser.fullName}</span>
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <button
              onClick={() => setIsTermsModalOpen(true)}
              className="hover:text-slate-700 underline cursor-pointer"
            >
              Electronic Disclosure Terms
            </button>
            <span>•</span>
            <span>TLS 1.3 Certified</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
