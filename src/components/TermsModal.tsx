import React, { useState, useRef, useEffect, useCallback } from 'react';
import { mockTermsAndConditions } from '../mockData';
import { ShieldCheck, AlertCircle, ArrowDown, Check, X, FileText, Lock } from 'lucide-react';

interface TermsModalProps {
  isOpen: boolean;
  onAccept: () => void;
  userFullName: string;
}

export const TermsModal: React.FC<TermsModalProps> = ({ isOpen, onAccept, userFullName }) => {
  const [hasScrolledToBottom, setHasScrolledToBottom] = useState(false);
  const [isAgreed, setIsAgreed] = useState(false);
  const [declinedMessageVisible, setDeclinedMessageVisible] = useState(false);
  const [scrollPercentage, setScrollPercentage] = useState(0);

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const acceptButtonRef = useRef<HTMLButtonElement>(null);

  // Check scroll position
  const handleScroll = useCallback(() => {
    const el = scrollContainerRef.current;
    if (!el) return;

    const scrollTop = el.scrollTop;
    const scrollHeight = el.scrollHeight;
    const clientHeight = el.clientHeight;

    const maxScroll = scrollHeight - clientHeight;
    const percentage = maxScroll > 0 ? Math.min(100, Math.round((scrollTop / maxScroll) * 100)) : 100;
    setScrollPercentage(percentage);

    // If within 25px of the bottom, unlock the checkbox
    if (scrollTop + clientHeight >= scrollHeight - 25) {
      setHasScrolledToBottom(true);
    }
  }, []);

  // Jump to bottom helper
  const scrollToBottom = () => {
    const el = scrollContainerRef.current;
    if (el) {
      el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
    }
  };

  // Keyboard trap / escape prevention when modal is active
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        // Prevent dismissal without explicit action
        e.preventDefault();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="terms-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-sm animate-fade-in"
    >
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh] transition-all">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 text-white px-6 py-5 flex items-start justify-between relative">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-indigo-300">
              <ShieldCheck className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <h2 id="terms-modal-title" className="text-lg font-semibold tracking-tight text-white flex items-center gap-2">
                Electronic Records & Signature Consent
              </h2>
              <p className="text-xs text-slate-300 mt-0.5">
                Pre-execution legal disclosure for <span className="font-medium text-white">{userFullName}</span>
              </p>
            </div>
          </div>
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium bg-indigo-900/60 border border-indigo-700/60 text-indigo-200">
            <Lock className="w-3 h-3" /> Required
          </span>
        </div>

        {/* Scroll tracker banner */}
        <div className="bg-slate-50 border-b border-slate-200 px-6 py-2.5 flex items-center justify-between text-xs text-slate-600">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-slate-400" />
            <span>Please scroll through and review the full disclosure below</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-20 bg-slate-200 rounded-full h-1.5 overflow-hidden">
              <div
                className={`h-full transition-all duration-150 ${hasScrolledToBottom ? 'bg-emerald-500' : 'bg-indigo-600'}`}
                style={{ width: `${hasScrolledToBottom ? 100 : scrollPercentage}%` }}
              />
            </div>
            <span className="font-mono text-[11px] font-medium text-slate-700">
              {hasScrolledToBottom ? '100% (Read)' : `${scrollPercentage}%`}
            </span>
          </div>
        </div>

        {/* Scrollable Terms Content */}
        <div
          ref={scrollContainerRef}
          onScroll={handleScroll}
          tabIndex={0}
          aria-label="Terms and Conditions text content"
          className="legal-scroll flex-1 overflow-y-auto px-6 py-5 space-y-5 text-sm text-slate-700 focus:outline-none focus:ring-1 focus:ring-indigo-500/20"
        >
          <div className="p-3.5 bg-amber-50/80 border border-amber-200/70 rounded-xl text-amber-900 text-xs flex gap-2.5">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <p>
              Under federal and international electronic transaction frameworks, you must review this notice in its entirety before signing or confirming your binding commercial agreement.
            </p>
          </div>

          {mockTermsAndConditions.map((section, idx) => (
            <div key={idx} className="space-y-1.5">
              <h3 className="font-semibold text-slate-900 text-sm">{section.heading}</h3>
              <p className="text-slate-600 leading-relaxed text-[13px]">{section.content}</p>
            </div>
          ))}

          {/* End of document marker */}
          <div className="pt-4 border-t border-slate-200 text-center pb-2">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-medium">
              <Check className="w-3.5 h-3.5" />
              <span>You have reached the end of the terms disclosure</span>
            </div>
          </div>
        </div>

        {/* Decline alert warning if user clicked decline */}
        {declinedMessageVisible && (
          <div className="mx-6 my-2 p-3.5 bg-rose-50 border border-rose-200 rounded-xl flex items-start justify-between text-xs text-rose-800 animate-fade-in">
            <div className="flex gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-rose-900">Access Restricted</p>
                <p className="mt-0.5">
                  You must accept the terms to view the contract. You cannot inspect or execute this legal agreement without agreeing to electronic disclosure terms.
                </p>
              </div>
            </div>
            <button
              onClick={() => setDeclinedMessageVisible(false)}
              className="text-rose-500 hover:text-rose-700 p-1"
              aria-label="Dismiss message"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Footer with Controls */}
        <div className="bg-slate-50 border-t border-slate-200 p-5 space-y-4">
          {/* Scroll reminder / Jump button if not yet at bottom */}
          {!hasScrolledToBottom ? (
            <div className="flex items-center justify-between text-xs text-slate-500 bg-white p-2.5 rounded-lg border border-slate-200">
              <span className="flex items-center gap-1.5 text-slate-600">
                <ArrowDown className="w-3.5 h-3.5 text-indigo-600 animate-bounce" />
                Scroll to the bottom of the disclosure above to unlock the checkbox.
              </span>
              <button
                type="button"
                onClick={scrollToBottom}
                className="text-indigo-600 hover:text-indigo-800 font-semibold underline text-xs"
              >
                Scroll to end
              </button>
            </div>
          ) : null}

          {/* Agreement Checkbox */}
          <label
            htmlFor="terms-agree-checkbox"
            className={`flex items-start gap-3 p-3 rounded-xl border transition-all ${
              !hasScrolledToBottom
                ? 'opacity-50 cursor-not-allowed bg-slate-100 border-slate-200'
                : isAgreed
                ? 'bg-indigo-50/70 border-indigo-300 shadow-xs cursor-pointer'
                : 'bg-white border-slate-300 hover:border-slate-400 cursor-pointer'
            }`}
          >
            <input
              id="terms-agree-checkbox"
              type="checkbox"
              disabled={!hasScrolledToBottom}
              checked={isAgreed}
              onChange={(e) => {
                if (hasScrolledToBottom) {
                  setIsAgreed(e.target.checked);
                  if (e.target.checked) {
                    setDeclinedMessageVisible(false);
                  }
                }
              }}
              className="mt-0.5 w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500 disabled:opacity-50 cursor-pointer"
            />
            <div className="text-xs">
              <span className="font-medium text-slate-900 block">
                I have read and agree to the Electronic Records & Signature Terms
              </span>
              <span className="text-slate-500 text-[11px] block mt-0.5">
                {!hasScrolledToBottom
                  ? '(Disabled until you scroll through the entire document above)'
                  : 'By checking this box, you confirm consent to digital disclosure and transaction terms.'}
              </span>
            </div>
          </label>

          {/* Action Buttons */}
          <div className="flex items-center justify-between gap-3 pt-1">
            <button
              type="button"
              onClick={() => setDeclinedMessageVisible(true)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-200/70 rounded-lg transition-colors"
            >
              Decline
            </button>

            <div className="flex items-center gap-2">
              <button
                ref={acceptButtonRef}
                type="button"
                disabled={!isAgreed}
                onClick={onAccept}
                className={`px-5 py-2.5 text-xs font-semibold rounded-xl flex items-center gap-2 transition-all shadow-sm ${
                  isAgreed
                    ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-200 active:scale-[0.98]'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
              >
                <Check className="w-4 h-4" />
                <span>Accept Terms & Open Contract</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
