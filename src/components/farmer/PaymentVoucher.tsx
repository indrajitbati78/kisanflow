import React from 'react';
import { 
  CreditCard, 
  CheckCircle2, 
  FileText, 
  Printer, 
  ShieldCheck, 
  IndianRupee, 
  Scale, 
  Building2, 
  ArrowLeft,
  RotateCcw,
  Sparkles
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const PaymentVoucher: React.FC = () => {
  const { 
    t, 
    activeTokenBooking, 
    setFarmerStep, 
    crops, 
    approvePaymentVoucher 
  } = useApp();

  if (!activeTokenBooking) {
    return (
      <div className="text-center py-12">
        <p className="text-stone-600 font-medium">No record available.</p>
        <button
          onClick={() => setFarmerStep(1)}
          className="mt-3 px-5 py-2 bg-emerald-700 text-white rounded-xl text-sm"
        >
          Go to Booking
        </button>
      </div>
    );
  }

  const crop = crops.find(c => activeTokenBooking.cropName.includes(c.name.split(' ')[0])) || crops[0];
  const mspRate = crop.mspPerQuintal;

  const payment = activeTokenBooking.paymentDetails || {
    voucherNumber: `VCH-${activeTokenBooking.tokenNumber}-PREVIEW`,
    approvedQuantityQuintals: activeTokenBooking.weighingDetails?.netWeightQuintals || activeTokenBooking.quantityQuintals,
    pricePerQuintal: mspRate,
    grossAmount: (activeTokenBooking.weighingDetails?.netWeightQuintals || activeTokenBooking.quantityQuintals) * mspRate,
    deductionsAmount: activeTokenBooking.qualityDetails?.deductionPercent 
      ? Math.round(((activeTokenBooking.weighingDetails?.netWeightQuintals || activeTokenBooking.quantityQuintals) * mspRate * activeTokenBooking.qualityDetails.deductionPercent) / 100) 
      : 0,
    finalPayableAmount: (activeTokenBooking.weighingDetails?.netWeightQuintals || activeTokenBooking.quantityQuintals) * mspRate,
    paymentStatus: activeTokenBooking.status === 'completed' ? 'Paid DBT' : 'Processing',
    dbtReferenceNo: 'PFMS2026091490214',
    paidAt: 'Direct Settlement In Progress',
    bankAccountEnding: '9182 (State Bank of India)'
  };

  const isFullySettled = activeTokenBooking.status === 'completed';

  return (
    <div id="step-payment-voucher" className="max-w-2xl mx-auto space-y-6">
      
      {/* Header */}
      <div className="text-center space-y-1">
        <div className="inline-flex p-3 rounded-2xl bg-emerald-100 text-emerald-800 mb-1">
          <CreditCard className="w-8 h-8" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-stone-900 font-display">
          {t.paymentTitle}
        </h2>
        <p className="text-stone-600 text-xs sm:text-sm max-w-lg mx-auto">
          {t.paymentDesc}
        </p>
      </div>

      {/* Official Voucher Slip */}
      <div className="bg-white rounded-3xl border-2 border-stone-200 shadow-xl overflow-hidden">
        
        {/* Voucher Header */}
        <div className="bg-stone-900 text-white p-6 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs text-emerald-400 font-mono uppercase tracking-widest font-bold block">
                Govt APMC Settlement Voucher
              </span>
              <h3 className="text-xl font-bold font-display">{payment.voucherNumber}</h3>
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-bold font-mono ${
              isFullySettled ? 'bg-emerald-500 text-white' : 'bg-amber-400 text-stone-950'
            }`}>
              {isFullySettled ? '✓ DBT DISBURSED' : 'PROCESSING APPROVAL'}
            </span>
          </div>

          <div className="mt-4 pt-4 border-t border-stone-800 grid grid-cols-2 gap-4 text-xs">
            <div>
              <span className="text-stone-400 block">Farmer Beneficiary</span>
              <span className="font-bold text-sm text-stone-100">{activeTokenBooking.farmerName}</span>
              <span className="text-stone-400 font-mono block">Farmer ID: {activeTokenBooking.farmerId}</span>
            </div>
            <div className="text-right">
              <span className="text-stone-400 block">Procurement Yard</span>
              <span className="font-bold text-stone-100">{activeTokenBooking.centreName}</span>
              <span className="text-emerald-400 font-mono block">Token: {activeTokenBooking.tokenNumber}</span>
            </div>
          </div>
        </div>

        {/* Breakdown Table */}
        <div className="p-6 space-y-4">
          
          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between py-2 border-b border-stone-100">
              <span className="text-stone-600">Procured Crop</span>
              <span className="font-bold text-stone-900">{activeTokenBooking.cropName}</span>
            </div>

            <div className="flex items-center justify-between py-2 border-b border-stone-100">
              <span className="text-stone-600">{t.approvedQuantity}</span>
              <span className="font-bold font-mono text-stone-900">
                {payment.approvedQuantityQuintals} Quintals ({(payment.approvedQuantityQuintals * 100).toLocaleString('en-IN')} kg)
              </span>
            </div>

            <div className="flex items-center justify-between py-2 border-b border-stone-100">
              <span className="text-stone-600">{t.mspRate}</span>
              <span className="font-bold font-mono text-stone-900">
                ₹{payment.pricePerQuintal.toLocaleString('en-IN')} / Qtl
              </span>
            </div>

            <div className="flex items-center justify-between py-2 border-b border-stone-100">
              <span className="text-stone-600">{t.grossAmount}</span>
              <span className="font-bold font-mono text-stone-900">
                ₹{payment.grossAmount.toLocaleString('en-IN')}
              </span>
            </div>

            <div className="flex items-center justify-between py-2 border-b border-stone-100 text-stone-500">
              <span>{t.deductions}</span>
              <span className="font-mono text-amber-700">
                - ₹{payment.deductionsAmount.toLocaleString('en-IN')} (0%)
              </span>
            </div>

            {/* Net Total Highlight Box */}
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200/80 flex items-center justify-between text-base">
              <div>
                <span className="text-xs font-bold text-emerald-900 uppercase tracking-wide block">
                  {t.finalPayable}
                </span>
                <span className="text-2xl sm:text-3xl font-black text-emerald-950 font-mono">
                  ₹{payment.finalPayableAmount.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="text-right">
                <span className="text-[11px] font-semibold text-emerald-800 uppercase block">Mode</span>
                <span className="text-xs font-mono font-bold bg-white px-2 py-1 rounded border border-emerald-300 text-emerald-900">
                  Direct Benefit Transfer (DBT)
                </span>
              </div>
            </div>
          </div>

          {/* Direct Benefit Transfer Banking Details */}
          <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 text-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-stone-500">Aadhaar Linked Account:</span>
              <span className="font-bold text-stone-900">{payment.bankAccountEnding}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-stone-500">PFMS / DBT Reference Number:</span>
              <span className="font-mono font-bold text-emerald-800">{payment.dbtReferenceNo}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-stone-500">Settlement Verification:</span>
              <span className="text-emerald-700 font-bold flex items-center gap-1">
                <ShieldCheck className="w-4 h-4" /> RBI Automated Clearing House (NACH)
              </span>
            </div>
          </div>

          <p className="text-[11px] text-stone-500 leading-relaxed text-center">
            {t.dbtTransferNotice}
          </p>
        </div>

        {/* Voucher Footer actions */}
        <div className="p-4 bg-stone-50 border-t border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            onClick={() => window.print()}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl border border-stone-300 bg-white hover:bg-stone-100 text-stone-700 font-semibold text-xs"
          >
            <Printer className="w-4 h-4 text-stone-500" />
            <span>Print Official Payment Receipt</span>
          </button>

          {!isFullySettled && (
            <button
              onClick={() => approvePaymentVoucher(activeTokenBooking.id)}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-sm"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Authorize Settlement (Simulate)</span>
            </button>
          )}
        </div>

      </div>

      {/* Navigation options */}
      <div className="flex items-center justify-between pt-2">
        <button
          onClick={() => setFarmerStep(10)}
          className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl border border-stone-300 text-stone-700 hover:bg-stone-100 font-medium text-xs transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Produce Timeline</span>
        </button>

        <button
          onClick={() => setFarmerStep(1)}
          className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-semibold text-xs transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Start New Procurement Session</span>
        </button>
      </div>

    </div>
  );
};
