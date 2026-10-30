import React from 'react';
import { ContractData, ConfirmationMethod } from '../types';
import { ShieldCheck, FileText, CheckCircle2, AlertCircle, Building2, Stamp, Calendar, UserCheck } from 'lucide-react';

interface ContractDocumentProps {
  contract: ContractData;
  isFilled: boolean;
  clientName: string;
  signDate: string;
  signatureImage: string | null;
  method: ConfirmationMethod | 'none';
  versionBadgeText: string;
  isHistoricalView?: boolean;
  historicalDate?: string;
  auditHash?: string;
  documentRef?: React.RefObject<HTMLDivElement | null>;
}

export const ContractDocument: React.FC<ContractDocumentProps> = ({
  contract,
  isFilled,
  clientName,
  signDate,
  signatureImage,
  method,
  versionBadgeText,
  isHistoricalView = false,
  historicalDate,
  auditHash,
  documentRef,
}) => {
  // Helper to replace text placeholders in clause body
  const renderClauseBody = (body: string) => {
    // Split on placeholders
    const parts = body.split(/({{CLIENT_NAME}}|{{SIGN_DATE}}|{{SIGNATURE}})/g);

    return parts.map((part, index) => {
      if (part === '{{CLIENT_NAME}}') {
        if (isFilled && clientName) {
          return (
            <span
              key={index}
              className="inline-block px-1.5 py-0.5 rounded font-semibold text-indigo-950 bg-indigo-50 border border-indigo-200 transition-colors"
            >
              {clientName}
            </span>
          );
        }
        return (
          <span
            key={index}
            className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-mono font-medium text-amber-800 bg-amber-50 border border-dashed border-amber-300 animate-pulse"
          >
            <AlertCircle className="w-3 h-3 text-amber-600" />
            [Pending: Client Name]
          </span>
        );
      }

      if (part === '{{SIGN_DATE}}') {
        if (isFilled && signDate) {
          return (
            <span
              key={index}
              className="inline-block px-1.5 py-0.5 rounded font-semibold text-indigo-950 bg-indigo-50 border border-indigo-200"
            >
              {signDate}
            </span>
          );
        }
        return (
          <span
            key={index}
            className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-mono font-medium text-amber-800 bg-amber-50 border border-dashed border-amber-300 animate-pulse"
          >
            <Calendar className="w-3 h-3 text-amber-600" />
            [Pending: Sign Date]
          </span>
        );
      }

      if (part === '{{SIGNATURE}}') {
        if (isFilled) {
          if (method === 'signed' && signatureImage) {
            return (
              <span key={index} className="inline-flex items-center gap-1 font-medium text-indigo-900">
                <span className="font-semibold underline">Drawn Digital Signature</span>
              </span>
            );
          }
          return (
            <span key={index} className="inline-flex items-center gap-1 font-medium text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
              Electronic Affirmation
            </span>
          );
        }
        return (
          <span
            key={index}
            className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-mono font-medium text-amber-800 bg-amber-50 border border-dashed border-amber-300 animate-pulse"
          >
            [Pending: Execution]
          </span>
        );
      }

      return <React.Fragment key={index}>{part}</React.Fragment>;
    });
  };

  return (
    <div className="w-full flex justify-center py-2 sm:py-6">
      {/* Paper Container - styled to emulate a crisp legal A4 document */}
      <div
        ref={documentRef}
        id="printable-contract-document"
        className="w-full max-w-[820px] bg-white rounded-none sm:rounded-sm border border-slate-200/80 paper-shadow p-6 sm:p-12 md:p-16 text-slate-800 relative transition-all"
        style={{ minHeight: '1050px' }}
      >
        {/* Paper watermark / security crest */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-[0.025] select-none text-center">
          <ShieldCheck className="w-96 h-96 mx-auto text-slate-900" />
          <p className="text-4xl font-serif font-black tracking-widest uppercase mt-4 text-slate-900">
            CONFIDENTIAL
          </p>
        </div>

        {/* Top Document Header */}
        <div className="border-b-2 border-slate-900 pb-6 mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold tracking-tighter text-xl shadow-xs">
                N
              </div>
              <div>
                <p className="text-xs font-bold tracking-widest text-slate-500 uppercase">
                  Nexus Cloud Enterprise Solutions
                </p>
                <p className="text-[11px] text-slate-400">
                  Global Legal & Commercial Contracts Directorate
                </p>
              </div>
            </div>

            {/* Version & Status Badge */}
            <div className="flex flex-col items-start sm:items-end gap-1">
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
                  isHistoricalView
                    ? 'bg-amber-100 text-amber-900 border border-amber-300'
                    : isFilled
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                    : 'bg-slate-100 text-slate-700 border border-slate-300'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-current" />
                {versionBadgeText}
              </span>
              <span className="text-[10px] font-mono text-slate-400">
                Ref: {contract.contractNumber}
              </span>
            </div>
          </div>

          {/* Title */}
          <div className="mt-8 text-center sm:text-left">
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-slate-950 tracking-tight leading-tight">
              {contract.title}
            </h1>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-xs text-slate-500 font-medium">
              <span>Dated: <strong className="text-slate-800">{contract.date}</strong></span>
              <span>•</span>
              <span>Contract No: <strong className="font-mono text-slate-800">{contract.contractNumber}</strong></span>
              <span>•</span>
              <span>Jurisdiction: <strong className="text-slate-800">State of Delaware</strong></span>
            </div>
          </div>
        </div>

        {/* Parties Box */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-lg bg-slate-50/80 border border-slate-200/90 mb-8 text-xs">
          {/* Party A */}
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 block">
              Party A — {contract.parties.serviceProvider.role}
            </span>
            <p className="font-bold text-slate-900 text-sm">{contract.parties.serviceProvider.name}</p>
            <p className="text-slate-600 leading-snug">{contract.parties.serviceProvider.address}</p>
            <p className="text-slate-500">ID / EIN: {contract.parties.serviceProvider.idNumber}</p>
          </div>

          {/* Party B */}
          <div className="space-y-1 border-t md:border-t-0 md:border-l border-slate-200 pt-3 md:pt-0 md:pl-4">
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 block">
              Party B — {contract.parties.client.role}
            </span>
            <p className="font-bold text-slate-900 text-sm">
              {isFilled && clientName ? (
                <span className="text-indigo-950 bg-indigo-50 px-1 py-0.5 rounded border border-indigo-200">
                  {clientName}
                </span>
              ) : (
                <span className="text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-dashed border-amber-300 font-mono text-xs">
                  [Pending: &#123;&#123;CLIENT_NAME&#125;&#125;]
                </span>
              )}
            </p>
            <p className="text-slate-600 leading-snug">{contract.parties.client.address}</p>
            <p className="text-slate-500">National ID / Passport: {contract.parties.client.idNumber}</p>
          </div>
        </div>

        {/* Recital / Preamble */}
        <div className="mb-8 font-serif-doc text-[14px] leading-relaxed text-slate-700 italic border-l-2 border-slate-300 pl-4 py-1">
          This Master Services Agreement is entered into by and between the parties designated above. In consideration of the mutual covenants, representations, and undertakings hereinafter set forth, the parties hereby covenant and agree as follows:
        </div>

        {/* Numbered Clauses */}
        <div className="space-y-6 font-serif-doc text-slate-800">
          {contract.clauses.map((clause) => (
            <div key={clause.number} className="text-[14px] leading-relaxed">
              <h2 className="font-sans font-bold text-slate-950 text-sm tracking-tight mb-1 flex items-baseline gap-2">
                <span className="font-mono text-xs text-indigo-700 bg-indigo-50 px-1.5 py-0.5 rounded border border-indigo-100">
                  {clause.number}.0
                </span>
                <span>{clause.title}</span>
              </h2>
              <p className="text-slate-700 text-justify">
                {renderClauseBody(clause.body)}
              </p>
            </div>
          ))}
        </div>

        {/* Signature Execution Block at the Bottom */}
        <div className="mt-12 pt-8 border-t-2 border-slate-900">
          <div className="mb-4">
            <h3 className="font-sans font-bold text-sm uppercase tracking-wider text-slate-900">
              IN WITNESS WHEREOF
            </h3>
            <p className="font-serif-doc text-xs text-slate-600 italic">
              The parties hereto have caused this Agreement to be executed by their duly authorized representatives as of the date first written above.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-4">
            {/* Service Provider Signature Block */}
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                For & on behalf of Provider:
              </span>

              {/* Pre-signed official signature */}
              <div className="h-20 flex flex-col justify-end border-b border-slate-300 pb-2">
                <div className="font-serif italic text-lg text-slate-800 tracking-tight font-semibold flex items-center gap-2">
                  <span>Eleanor Vance</span>
                  <Stamp className="w-4 h-4 text-indigo-600" />
                </div>
                <span className="text-[10px] font-mono text-slate-400">
                  Digitally sealed by Nexus Legal Operations
                </span>
              </div>

              <div className="text-xs space-y-0.5 text-slate-600">
                <p><span className="font-medium text-slate-800">Name:</span> Eleanor Vance</p>
                <p><span className="font-medium text-slate-800">Title:</span> VP of Global Operations</p>
                <p><span className="font-medium text-slate-800">Date:</span> {contract.date}</p>
              </div>
            </div>

            {/* Client Signature Block */}
            <div
              className={`p-4 rounded-xl border transition-all space-y-3 ${
                isFilled
                  ? 'border-emerald-300 bg-emerald-50/20'
                  : 'border-dashed border-slate-300 bg-slate-50/30'
              }`}
            >
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                For & on behalf of Client:
              </span>

              {/* Client Signature Display Area */}
              <div className="h-20 flex flex-col justify-end border-b border-slate-300 pb-2 relative">
                {isFilled ? (
                  method === 'signed' && signatureImage ? (
                    <div className="flex items-center justify-between">
                      <img
                        src={signatureImage}
                        alt="Client Authorized Signature"
                        className="max-h-16 max-w-[220px] object-contain"
                      />
                      <span className="text-[10px] font-mono text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded border border-emerald-300">
                        Cryptographic Sign
                      </span>
                    </div>
                  ) : (
                    <div className="bg-emerald-50/80 border border-emerald-200 rounded p-2 text-emerald-900 text-xs flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <div>
                        <p className="font-semibold text-emerald-950">Electronically confirmed by {clientName}</p>
                        <p className="text-[10px] text-emerald-700 font-mono">Consented without handwritten mark</p>
                      </div>
                    </div>
                  )
                ) : (
                  <div className="h-full flex items-center justify-center text-xs font-mono text-amber-700 bg-amber-50/60 rounded border border-dashed border-amber-300">
                    <span>[Signature will appear upon confirmation or signing]</span>
                  </div>
                )}
              </div>

              <div className="text-xs space-y-0.5 text-slate-600">
                <p>
                  <span className="font-medium text-slate-800">Name:</span>{' '}
                  {isFilled && clientName ? (
                    <span className="font-semibold text-slate-900">{clientName}</span>
                  ) : (
                    <span className="text-slate-400 font-mono">[Pending]</span>
                  )}
                </p>
                <p>
                  <span className="font-medium text-slate-800">Identification:</span> {contract.parties.client.idNumber}
                </p>
                <p>
                  <span className="font-medium text-slate-800">Execution Date:</span>{' '}
                  {isFilled && signDate ? (
                    <span className="font-medium text-slate-900">{signDate}</span>
                  ) : (
                    <span className="text-slate-400 font-mono">[Pending]</span>
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Security & Audit Footer on Document */}
        <div className="mt-12 pt-4 border-t border-slate-200 text-[10px] font-mono text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
            <span>
              {auditHash
                ? `Audit Hash: ${auditHash}`
                : `Draft Instrument • Nexus E-Sign System • Tamper Evident Verification`}
            </span>
          </div>
          <div>
            <span>Page 1 of 1 • Certified Record</span>
          </div>
        </div>
      </div>
    </div>
  );
};
