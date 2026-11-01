import React, { useState, useRef, useMemo, useCallback } from 'react';
import { mockUser, mockContract } from './mockData';
import { ActiveOption, ConfirmationMethod, ToastMessage, ContractVersion } from './types';
import { useContractVersions } from './hooks/useContractVersions';
import { ContractDocument } from './components/ContractDocument';
import { SignatureModal } from './components/SignatureModal';
import { SuccessModal } from './components/SuccessModal';
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
  PenLine,
} from 'lucide-react';

export default function App() {
  // 1. Versioning Hook
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

  // 2. Version History Drawer state
  const [isHistoryDrawerOpen, setIsHistoryDrawerOpen] = useState(false);

  // 3. Signature Modal (Option B) popup state
  const [isSignatureModalOpen, setIsSignatureModalOpen] = useState(false);

  // 4. Success Modal popup state
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

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
    return new Date().toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
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

  // Option B signature apply: immediately applies signature mark and saves the document
  const handleApplySignature = (dataUrl: string) => {
    setActiveOption('signature');
    setIsConfirmedChecked(false);
    setAppliedSignatureUrl(dataUrl);

    // Save document version automatically on apply
    const saved = saveVersion({
      method: 'signed',
      signerName: mockUser.fullName,
      signerEmail: mockUser.email,
      signerIdNumber: mockUser.idNumber,
      signDate: todayFormattedDate,
      signatureImage: dataUrl,
      contractSnapshot: mockContract,
    });

    addToast(
      `Contract signed & saved as ${saved.versionLabel}`,
      `Audited record archived on ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} with cryptographic hash.`,
      'success'
    );

    // Show success popup
    setIsSuccessModalOpen(true);

    // Celebratory confetti
    try {
      confetti({
        particleCount: 55,
        spread: 60,
        origin: { y: 0.7 },
      });
    } catch {
      // Ignore if unavailable
    }
  };

  // Option B clear signature
  const handleClearSignature = () => {
    setAppliedSignatureUrl(null);
  };

  // Next version label
  const nextVersionNumber = versions.length > 0 ? versions[0].versionNumber + 1 : 1;
  const nextVersionLabel = `v${nextVersionNumber}`;

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
    const fileName = `Contract-${mockContract.reservationNumber}-${vLabel}.pdf`;

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

  // Derived display values depending on whether viewing a historical version or active state
  const activeVersionOrLatest = activeViewingVersion || latestVersion;

  const displaySignDate = activeVersionOrLatest
    ? activeVersionOrLatest.signDate
    : appliedSignatureUrl
    ? todayFormattedDate
    : '';

  const displaySignatureImage = activeViewingVersion
    ? activeViewingVersion.signatureImage || null
    : appliedSignatureUrl || latestVersion?.signatureImage || null;

  const displayMethod: ConfirmationMethod | 'none' = activeVersionOrLatest
    ? activeVersionOrLatest.method
    : appliedSignatureUrl
    ? 'signed'
    : 'none';

  const isDisplayFilled = isViewingPastVersion || !!latestVersion || !!appliedSignatureUrl;

  // Header version badge text near title
  const currentVersionBadgeText = isViewingPastVersion
    ? `Viewing ${activeViewingVersion?.versionLabel} (Archived)`
    : latestVersion
    ? `${latestVersion.versionLabel} (Latest Saved)`
    : 'Draft (Unsaved)';

  const signButtonLabel = versions.length > 0 ? 'Update Sign' : 'Sign';

  return (
    <div className="min-h-screen bg-slate-100/90 text-slate-900 flex flex-col font-sans">
      {/* 1. Version History Drawer */}
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

      {/* 2. Option B Signature Modal Popup */}
      <SignatureModal
        isOpen={isSignatureModalOpen}
        onClose={() => setIsSignatureModalOpen(false)}
        user={mockUser}
        onApplySignature={handleApplySignature}
        onClearSignature={handleClearSignature}
        appliedSignatureUrl={appliedSignatureUrl}
        nextVersionLabel={nextVersionLabel}
      />

      {/* 3. Signed Success Modal Popup */}
      <SuccessModal
        isOpen={isSuccessModalOpen}
        onClose={() => setIsSuccessModalOpen(false)}
        onDownloadPdf={() => handleDownloadPdf()}
        reservationNumber={mockContract.reservationNumber}
        contractNumber={mockContract.contractNumber}
        guestName={mockUser.fullName}
        versionLabel={latestVersion ? latestVersion.versionLabel : nextVersionLabel}
      />

      {/* 4. Toast Notifications */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />

      {/* TOP APPLICATION BAR */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-2xs no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          {/* Left: Brand, Document Title & History Button */}
          <div className="flex items-center gap-3 sm:gap-4">
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
                  {mockContract.title.en} · {mockContract.title.ar}
                </p>
              </div>
            </div>

            {/* Version History Button - Placed on the left */}
            <button
              type="button"
              onClick={() => setIsHistoryDrawerOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200/80 rounded-xl transition-colors cursor-pointer border border-slate-200"
              title="View History"
            >
              <History className="w-3.5 h-3.5 text-indigo-600" />
              <span>History</span>
              {versions.length > 0 && (
                <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-indigo-600 text-white font-mono">
                  {versions.length}
                </span>
              )}
            </button>
          </div>

          {/* Right actions: Sign button and Download PDF button */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Option B Add Signature button - shown at the top of the screen on big screens */}
            {!isViewingPastVersion && (
              <button
                type="button"
                onClick={() => setIsSignatureModalOpen(true)}
                className="hidden lg:inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-all shadow-xs cursor-pointer border border-indigo-500/50 hover:shadow-indigo-500/20 active:scale-[0.98]"
                title={signButtonLabel}
              >
                <PenLine className="w-3.5 h-3.5 text-indigo-200" />
                <span>{signButtonLabel}</span>
              </button>
            )}

            {/* Print / Download Button - Only visible once the document has been saved */}
            {versions.length > 0 && (
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
            )}
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

      {/* MAIN CONTENT AREA - Centered Contract Document */}
      <main className="max-w-4xl mx-auto px-3 sm:px-6 lg:px-8 py-6 flex-1 w-full flex flex-col items-center">
        {/* Helper status strip above paper */}
        <div className="w-full max-w-[820px] mb-3 flex items-center justify-between text-xs text-slate-500 no-print">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>{mockContract.title.en} {mockContract.reservationNumber}</span>
          </div>
          <div className="flex items-center gap-3">
            {versions.length > 0 && (
              <>
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="hover:text-slate-800 flex items-center gap-1 cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print preview</span>
                </button>
                <span>•</span>
              </>
            )}
            <span>Zoom: 100% (A4)</span>
          </div>
        </div>

        {/* The Document */}
        <ContractDocument
          contract={mockContract}
          isFilled={isDisplayFilled}
          signDate={displaySignDate}
          signatureImage={displaySignatureImage}
          method={displayMethod}
          acceptedAt={activeVersionOrLatest?.timestamp}
          auditHash={activeVersionOrLatest?.auditHash}
          documentRef={documentRef}
        />
      </main>

      {/* Floating Option B "Sign" button on mobile / smaller screens */}
      {!isViewingPastVersion && (
        <button
          type="button"
          onClick={() => setIsSignatureModalOpen(true)}
          className="no-print lg:hidden fixed bottom-6 right-6 z-40 flex items-center gap-2 px-5 py-3.5 rounded-full text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-2xl shadow-indigo-600/40 hover:scale-105 active:scale-95 transition-all cursor-pointer border border-indigo-400/30"
          aria-label={signButtonLabel}
        >
          <PenLine className="w-4 h-4 text-indigo-200" />
          <span>{signButtonLabel}</span>
        </button>
      )}

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
            <span>Electronic Records Protocol</span>
            <span>•</span>
            <span>TLS 1.3 Certified</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
