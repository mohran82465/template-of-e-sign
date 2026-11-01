import React, { useRef, useEffect, useState, useCallback } from 'react';
import SignaturePadLib from 'signature_pad';
import { Eraser, Check, RotateCcw, PenTool } from 'lucide-react';

interface SignaturePadProps {
  onApplySignature: (dataUrl: string) => void;
  onClearSignature: () => void;
  appliedSignatureUrl: string | null;
  disabled?: boolean;
  applyButtonLabel?: string;
}

export const SignaturePad: React.FC<SignaturePadProps> = ({
  onApplySignature,
  onClearSignature,
  appliedSignatureUrl,
  disabled = false,
  applyButtonLabel = 'Apply & Save Contract',
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const padInstanceRef = useRef<SignaturePadLib | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [isEmpty, setIsEmpty] = useState(true);
  const [penColor, setPenColor] = useState<string>('#1e3a8a'); // Classic executive navy
  const [hasUnappliedStrokes, setHasUnappliedStrokes] = useState(false);

  // Initialize or resize canvas with device pixel ratio
  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ratio = Math.max(window.devicePixelRatio || 1, 1);
    const rect = container.getBoundingClientRect();
    const width = rect.width || 400;
    const height = 160;

    // Save previous data if not empty
    let savedData: ReturnType<SignaturePadLib['toData']> | null = null;
    if (padInstanceRef.current && !padInstanceRef.current.isEmpty()) {
      savedData = padInstanceRef.current.toData();
    }

    canvas.width = width * ratio;
    canvas.height = height * ratio;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.scale(ratio, ratio);
    }

    if (padInstanceRef.current) {
      padInstanceRef.current.clear();
      if (savedData) {
        padInstanceRef.current.fromData(savedData);
      }
    }
  }, []);

  // Setup signature pad
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const pad = new SignaturePadLib(canvas, {
      penColor: penColor,
      backgroundColor: 'rgba(255, 255, 255, 0)',
      minWidth: 1.5,
      maxWidth: 3.5,
      velocityFilterWeight: 0.7,
    });

    padInstanceRef.current = pad;
    resizeCanvas();

    const handleStrokeEnd = () => {
      setIsEmpty(pad.isEmpty());
      setHasUnappliedStrokes(!pad.isEmpty());
    };

    pad.addEventListener('endStroke', handleStrokeEnd);

    const resizeObserver = new ResizeObserver(() => {
      resizeCanvas();
    });

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => {
      pad.removeEventListener('endStroke', handleStrokeEnd);
      resizeObserver.disconnect();
      pad.off();
    };
  }, [resizeCanvas]);

  // Update pen color
  useEffect(() => {
    if (padInstanceRef.current) {
      padInstanceRef.current.penColor = penColor;
    }
  }, [penColor]);

  // Handle Clear
  const handleClear = () => {
    if (padInstanceRef.current) {
      padInstanceRef.current.clear();
      setIsEmpty(true);
      setHasUnappliedStrokes(false);
      onClearSignature();
    }
  };

  // Handle Apply
  const handleApply = () => {
    if (!padInstanceRef.current || padInstanceRef.current.isEmpty()) return;

    // Export trimmed PNG data URL
    const dataUrl = padInstanceRef.current.toDataURL('image/png');
    onApplySignature(dataUrl);
    setHasUnappliedStrokes(false);
  };

  return (
    <div className="space-y-3.5">
      {/* Signature drawing surface container */}
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold text-slate-800 flex items-center gap-1.5">
          <PenTool className="w-3.5 h-3.5 text-indigo-600" />
          <span>Draw Signature</span>
        </label>

        {/* Ink color options */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-lg">
          <span className="text-[10px] text-slate-500 font-medium px-1">Ink:</span>
          <button
            type="button"
            onClick={() => setPenColor('#1e3a8a')}
            title="Navy Blue Ink"
            className={`w-4 h-4 rounded-full bg-blue-900 transition-transform ${
              penColor === '#1e3a8a' ? 'ring-2 ring-indigo-500 ring-offset-1 scale-110' : 'opacity-70 hover:opacity-100'
            }`}
          />
          <button
            type="button"
            onClick={() => setPenColor('#0f172a')}
            title="Carbon Black Ink"
            className={`w-4 h-4 rounded-full bg-slate-900 transition-transform ${
              penColor === '#0f172a' ? 'ring-2 ring-indigo-500 ring-offset-1 scale-110' : 'opacity-70 hover:opacity-100'
            }`}
          />
          <button
            type="button"
            onClick={() => setPenColor('#047857')}
            title="Emerald Ink"
            className={`w-4 h-4 rounded-full bg-emerald-700 transition-transform ${
              penColor === '#047857' ? 'ring-2 ring-indigo-500 ring-offset-1 scale-110' : 'opacity-70 hover:opacity-100'
            }`}
          />
        </div>
      </div>

      <div
        ref={containerRef}
        className={`relative w-full rounded-xl border-2 transition-all bg-white overflow-hidden shadow-xs ${
          disabled
            ? 'border-slate-200 opacity-60 pointer-events-none'
            : appliedSignatureUrl && !hasUnappliedStrokes
            ? 'border-emerald-400 ring-2 ring-emerald-100'
            : hasUnappliedStrokes
            ? 'border-indigo-400 ring-2 ring-indigo-100'
            : 'border-slate-300 hover:border-slate-400 focus-within:border-indigo-500'
        }`}
      >
        {/* Background decorative signing line */}
        <div className="absolute inset-x-6 bottom-7 pointer-events-none border-b border-dashed border-slate-300 flex items-center justify-between text-[10px] text-slate-400 font-mono">
          <span>✕ Sign on or above line</span>
          <span>Digital Signature Surface</span>
        </div>

        <canvas
          ref={canvasRef}
          className="w-full h-40 touch-none cursor-crosshair block relative z-10"
        />

        {/* Empty state hint */}
        {isEmpty && !appliedSignatureUrl && (
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center text-slate-400 text-xs gap-2 select-none">
            <PenTool className="w-4 h-4 text-slate-300" />
            <span>Use mouse or finger to sign here</span>
          </div>
        )}

        {/* Applied badge indicator on canvas */}
        {appliedSignatureUrl && !hasUnappliedStrokes && (
          <div className="absolute top-2.5 right-2.5 z-20 pointer-events-none bg-emerald-500 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-xs">
            <Check className="w-3 h-3" />
            <span>Signature Applied to Document</span>
          </div>
        )}
      </div>

      {/* Action buttons under pad */}
      <div className="flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={handleClear}
          disabled={disabled || (isEmpty && !appliedSignatureUrl)}
          className="px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors flex items-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <Eraser className="w-3.5 h-3.5" />
          <span>Clear</span>
        </button>

        <button
          type="button"
          onClick={handleApply}
          disabled={disabled || isEmpty}
          className={`px-4 py-1.5 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-all shadow-xs ${
            !disabled && !isEmpty
              ? 'bg-indigo-600 text-white hover:bg-indigo-700 active:scale-[0.98]'
              : 'bg-slate-200 text-slate-400 cursor-not-allowed'
          }`}
        >
          <Check className="w-3.5 h-3.5" />
          <span>{applyButtonLabel}</span>
        </button>
      </div>
    </div>
  );
};
