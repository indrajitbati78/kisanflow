import React, { useState } from 'react';
import { 
  Ticket, 
  Printer, 
  Share2, 
  Download, 
  Clock, 
  MapPin, 
  ArrowRight,
  ShieldCheck,
  Check,
  Zap
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const StepDigitalToken: React.FC = () => {
  const { t, activeTokenBooking, setFarmerStep, simulateNextStage, downloadBookingReceipt } = useApp();
  const [copied, setCopied] = useState(false);

  if (!activeTokenBooking) {
    return (
      <div className="text-center py-12">
        <Ticket className="w-12 h-12 text-stone-300 mx-auto mb-3" />
        <p className="text-stone-600 font-medium">No active token booking found.</p>
        <button
          onClick={() => setFarmerStep(1)}
          className="mt-4 px-6 py-2.5 bg-emerald-700 text-white rounded-xl font-semibold"
        >
          Start New Booking
        </button>
      </div>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  const handleShare = () => {
    const text = `KisanFlow Digital Token: ${activeTokenBooking.tokenNumber}\nFarmer: ${activeTokenBooking.farmerName}\nCentre: ${activeTokenBooking.centreName}\nTime Slot: ${activeTokenBooking.slotTime}\nQueue Pos: #${activeTokenBooking.queuePosition}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  };

  return (
    <div id="step-digital-token" className="max-w-2xl mx-auto space-y-6">
      <div className="text-center space-y-2">
        <div className="inline-flex p-3 rounded-2xl bg-emerald-100 text-emerald-800 mb-1">
          <Ticket className="w-8 h-8" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-stone-900 font-display">
          {t.digitalTokenTitle}
        </h2>
        <p className="text-stone-600 text-sm sm:text-base max-w-lg mx-auto">
          {t.digitalTokenDesc}
        </p>
      </div>

      {/* Official Token Pass Card */}
      <div
        id="printable-token"
        className="bg-white rounded-3xl border-2 border-stone-300 shadow-xl overflow-hidden relative"
      >
        {/* Top Header of Token */}
        <div className="bg-gradient-to-r from-emerald-800 via-emerald-700 to-teal-800 text-white p-5 sm:p-6">
          <div className="flex items-center justify-between gap-3">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-widest text-emerald-200">
                Government of Gujarat e-Procurement Gate Pass
              </span>
              <h3 className="text-lg font-bold font-display">KisanFlow Official Digital Token</h3>
            </div>
            <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-400 text-stone-900 shadow-xs">
              CONFIRMED
            </span>
          </div>

          <div className="mt-4 pt-4 border-t border-emerald-600/60 flex items-center justify-between">
            <div>
              <span className="text-xs text-emerald-200 block">{t.tokenNumber}</span>
              <span className="text-3xl sm:text-4xl font-black font-mono tracking-tight text-white">
                {activeTokenBooking.tokenNumber}
              </span>
            </div>
            <div className="text-right">
              <span className="text-xs text-emerald-200 block">{t.queuePosition}</span>
              <span className="text-2xl sm:text-3xl font-bold text-amber-300 font-mono">
                #{activeTokenBooking.queuePosition}
              </span>
            </div>
          </div>
        </div>

        {/* Perforated Divider Visual */}
        <div className="relative flex items-center justify-between px-2 bg-stone-100 py-1.5 border-y border-dashed border-stone-300">
          <div className="w-4 h-4 bg-stone-50 rounded-full -ml-4 border-r border-stone-300" />
          <span className="text-[10px] uppercase font-mono text-stone-500 tracking-widest font-semibold">
            VALID FOR APMC ENTRY – PRESENT AT SECURITY GATE
          </span>
          <div className="w-4 h-4 bg-stone-50 rounded-full -mr-4 border-l border-stone-300" />
        </div>

        {/* Token Details Body */}
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div>
              <span className="text-stone-500 font-medium block">Farmer Name</span>
              <span className="text-stone-900 font-bold text-sm">{activeTokenBooking.farmerName}</span>
              <span className="text-stone-500 block">ID: {activeTokenBooking.farmerId}</span>
            </div>
            <div>
              <span className="text-stone-500 font-medium block">Produce & Quantity</span>
              <span className="text-stone-900 font-bold text-sm">{activeTokenBooking.cropName}</span>
              <span className="text-emerald-700 font-semibold block">{activeTokenBooking.quantityQuintals} Quintals (Estimated)</span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200 space-y-2 text-xs">
            <div className="flex items-center gap-2 text-stone-700">
              <MapPin className="w-4 h-4 text-emerald-700 shrink-0" />
              <span><strong>Centre:</strong> {activeTokenBooking.centreName}</span>
            </div>
            <div className="flex items-center gap-2 text-stone-700">
              <Clock className="w-4 h-4 text-emerald-700 shrink-0" />
              <span><strong>Reporting Window:</strong> {activeTokenBooking.bookingDate}, {activeTokenBooking.slotTime}</span>
            </div>
          </div>

          {/* QR Code and Barcode Box */}
          <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1 text-center sm:text-left">
              <span className="text-xs font-bold text-stone-800 uppercase tracking-wide flex items-center justify-center sm:justify-start gap-1">
                <ShieldCheck className="w-4 h-4 text-emerald-600" /> Digital Security Seal
              </span>
              <p className="text-[11px] text-stone-500 max-w-xs leading-relaxed">
                Scan at the boom-barrier gate reader for automatic tractor weighbridge authorization.
              </p>
              <div className="font-mono text-[10px] text-stone-400">
                REF: {activeTokenBooking.id} • HASH: KF-GJ-SECURE-PASSED
              </div>
            </div>

            {/* Stylized QR Code SVG */}
            <div className="p-2.5 bg-white rounded-xl border border-stone-300 shadow-2xs shrink-0 flex flex-col items-center">
              <svg className="w-24 h-24 text-stone-900" viewBox="0 0 100 100" fill="currentColor">
                <path d="M10 10h30v30h-30z M15 15v20h20v-20z M20 20h10v10h-10z" />
                <path d="M60 10h30v30h-30z M65 15v20h20v-20z M70 20h10v10h-10z" />
                <path d="M10 60h30v30h-30z M15 65v20h20v-20z M20 70h10v10h-10z" />
                <path d="M50 15h5v15h-5z M50 45h10v10h-10z M65 50h15v5h-15z M85 50h5v15h-5z M60 70h10v20h-10z M75 80h15v10h-15z M45 65h10v10h-10z" />
              </svg>
              <span className="text-[9px] font-mono text-stone-500 mt-1 font-bold">QR-SECURE</span>
            </div>
          </div>
        </div>

        {/* Action buttons inside token: DOWNLOAD RECEIPT, Print, Share */}
        <div className="bg-stone-50/90 p-4 border-t border-stone-200 grid grid-cols-1 sm:grid-cols-3 gap-2">
          
          <button
            type="button"
            id="download-receipt-btn"
            onClick={() => downloadBookingReceipt(activeTokenBooking)}
            className="inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-xs transition-all"
          >
            <Download className="w-4 h-4" />
            <span>Download Receipt</span>
          </button>

          <button
            type="button"
            id="print-token-btn"
            onClick={handlePrint}
            className="inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl border border-stone-300 bg-white hover:bg-stone-100 text-stone-700 text-xs font-semibold transition-colors"
          >
            <Printer className="w-4 h-4 text-stone-500" />
            <span>{t.printToken}</span>
          </button>

          <button
            type="button"
            id="share-token-btn"
            onClick={handleShare}
            className="inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl border border-stone-300 bg-white hover:bg-stone-100 text-stone-700 text-xs font-semibold transition-colors"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4 text-stone-500" />}
            <span>{copied ? 'Copied Link!' : t.shareToken}</span>
          </button>

        </div>
      </div>

      {/* Next Flow Actions: Track Live Queue & Simulator */}
      <div className="space-y-3 pt-2">
        <button
          id="track-queue-btn"
          onClick={() => setFarmerStep(9)}
          className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-2xl font-bold shadow-md hover:shadow-lg transition-all text-base"
        >
          <span>Track Live Queue & Produce</span>
          <ArrowRight className="w-5 h-5" />
        </button>

        {/* Demo Fast Forward */}
        <div className="p-3 bg-amber-50 rounded-xl border border-amber-200/80 flex items-center justify-between text-xs text-amber-900">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-600 shrink-0" />
            <span>Interactive Demo: Test what happens as the centre processes your produce</span>
          </div>
          <button
            onClick={() => simulateNextStage(activeTokenBooking.id)}
            className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-bold shrink-0 transition-colors"
          >
            Advance Queue Stage
          </button>
        </div>
      </div>
    </div>
  );
};
