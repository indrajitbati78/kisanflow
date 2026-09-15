import React from 'react';
import { 
  CheckCircle2, 
  Clock, 
  Scale, 
  ShieldCheck, 
  FileCheck, 
  CreditCard, 
  MapPin, 
  ArrowRight,
  ArrowLeft,
  Info,
  Sparkles,
  Zap
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const ProduceTracker: React.FC = () => {
  const { t, activeTokenBooking, setFarmerStep, simulateNextStage } = useApp();

  if (!activeTokenBooking) {
    return (
      <div className="text-center py-12">
        <p className="text-stone-600 font-medium">No produce record found.</p>
        <button
          onClick={() => setFarmerStep(1)}
          className="mt-3 px-5 py-2 bg-emerald-700 text-white rounded-xl text-sm"
        >
          Start Booking
        </button>
      </div>
    );
  }

  // Determine current stage (1 through 7)
  let currentStageNumber = 2; // Slot Booked
  if (activeTokenBooking.status === 'arrived' || activeTokenBooking.status === 'waiting' || activeTokenBooking.status === 'called') {
    currentStageNumber = 3; // Farmer Arrived
  } else if (activeTokenBooking.weighingDetails && !activeTokenBooking.qualityDetails) {
    currentStageNumber = 4; // Weighing Completed
  } else if (activeTokenBooking.qualityDetails && activeTokenBooking.status !== 'completed') {
    currentStageNumber = 5; // Quality Verification
  } else if (activeTokenBooking.status === 'completed' && activeTokenBooking.paymentDetails) {
    currentStageNumber = 7; // Procurement Completed & DBT Dispatched
  }

  const stages = [
    {
      num: 1,
      title: t.stage1,
      subtitle: `Declared ${activeTokenBooking.cropName}, ~${activeTokenBooking.quantityQuintals} Qtl`,
      time: activeTokenBooking.createdAt || '09:00 AM',
      icon: <Sparkles className="w-5 h-5" />,
      detail: `Produce ID: ${activeTokenBooking.produceId}`
    },
    {
      num: 2,
      title: t.stage2,
      subtitle: `Slot ${activeTokenBooking.slotTime} (${activeTokenBooking.bookingDate})`,
      time: activeTokenBooking.createdAt || '09:45 AM',
      icon: <Clock className="w-5 h-5" />,
      detail: `Token: ${activeTokenBooking.tokenNumber} • Pos #${activeTokenBooking.queuePosition}`
    },
    {
      num: 3,
      title: t.stage3,
      subtitle: activeTokenBooking.arrivedAt ? `Verified at APMC Security Gate at ${activeTokenBooking.arrivedAt}` : 'Awaiting arrival at centre entrance',
      time: activeTokenBooking.arrivedAt || 'Pending Arrival',
      icon: <MapPin className="w-5 h-5" />,
      detail: activeTokenBooking.centreName
    },
    {
      num: 4,
      title: t.stage4,
      subtitle: activeTokenBooking.weighingDetails 
        ? `Net Weight: ${activeTokenBooking.weighingDetails.netWeightQuintals} Quintals (${activeTokenBooking.weighingDetails.netWeightKg} kg)`
        : 'Automated weighbridge gross & tare calculation',
      time: activeTokenBooking.weighingDetails?.weighedAt || 'Awaiting Scale',
      icon: <Scale className="w-5 h-5" />,
      detail: activeTokenBooking.weighingDetails 
        ? `Gross: ${activeTokenBooking.weighingDetails.grossWeightKg}kg • Tare: ${activeTokenBooking.weighingDetails.tareWeightKg}kg`
        : 'Sensory weight check upon call'
    },
    {
      num: 5,
      title: t.stage5,
      subtitle: activeTokenBooking.qualityDetails 
        ? `${activeTokenBooking.qualityDetails.assignedGrade} • Moisture ${activeTokenBooking.qualityDetails.moisturePercent}%`
        : 'Quality tester assay, moisture & foreign dockage measurement',
      time: activeTokenBooking.qualityDetails?.verifiedAt || 'Awaiting Lab',
      icon: <ShieldCheck className="w-5 h-5" />,
      detail: activeTokenBooking.qualityDetails?.notes || 'Standard Mandi FAQ quality parameters'
    },
    {
      num: 6,
      title: t.stage6,
      subtitle: activeTokenBooking.status === 'completed' || activeTokenBooking.qualityDetails
        ? 'Government APMC Officer Approval Signed'
        : 'Official procurement sanction certificate',
      time: activeTokenBooking.completedAt || 'Pending Final Review',
      icon: <FileCheck className="w-5 h-5" />,
      detail: 'Govt Authorized Procurement Inspector'
    },
    {
      num: 7,
      title: t.stage7,
      subtitle: activeTokenBooking.paymentDetails
        ? `Net Disbursed: ₹${activeTokenBooking.paymentDetails.finalPayableAmount.toLocaleString('en-IN')} via DBT`
        : 'Direct Benefit Transfer (DBT) to farmer bank account',
      time: activeTokenBooking.paymentDetails?.paidAt || 'Awaiting Final Settlement',
      icon: <CreditCard className="w-5 h-5" />,
      detail: activeTokenBooking.paymentDetails 
        ? `Ref: ${activeTokenBooking.paymentDetails.dbtReferenceNo} (${activeTokenBooking.paymentDetails.paymentStatus})` 
        : 'PFMS Govt Gateway'
    }
  ];

  return (
    <div id="step-produce-tracker" className="max-w-3xl mx-auto space-y-6">
      
      {/* Header */}
      <div className="text-center space-y-1">
        <h2 className="text-2xl sm:text-3xl font-bold text-stone-900 font-display">
          Produce Lifecycle Progress
        </h2>
        <p className="text-stone-600 text-xs sm:text-sm">
          Tracking {activeTokenBooking.cropName} • Token: <strong>{activeTokenBooking.tokenNumber}</strong>
        </p>
      </div>

      {/* Progress Bar Header */}
      <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm">
        <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider mb-2">
          <span className="text-emerald-800">Current Progress: Stage {currentStageNumber} of 7</span>
          <span className="text-stone-600 font-mono">
            {Math.round((currentStageNumber / 7) * 100)}% Completed
          </span>
        </div>
        <div className="w-full bg-stone-100 rounded-full h-3 overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-emerald-600 to-teal-600 transition-all duration-500"
            style={{ width: `${(currentStageNumber / 7) * 100}%` }}
          />
        </div>
      </div>

      {/* 7-Stage Timeline */}
      <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm relative space-y-6">
        {stages.map((stg, idx) => {
          const isDone = stg.num <= currentStageNumber;
          const isCurrent = stg.num === currentStageNumber;

          return (
            <div key={stg.num} className="relative flex items-start gap-4">
              
              {/* Connecting line between steps */}
              {idx < stages.length - 1 && (
                <div
                  className={`absolute left-5 top-10 bottom-0 w-0.5 -mb-6 ${
                    stg.num < currentStageNumber ? 'bg-emerald-500' : 'bg-stone-200'
                  }`}
                />
              )}

              {/* Step Circle Icon */}
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 z-10 transition-all ${
                  isDone
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                    : 'bg-stone-100 text-stone-400 border border-stone-200'
                } ${isCurrent ? 'ring-4 ring-emerald-100 ring-offset-1' : ''}`}
              >
                {stg.num < currentStageNumber ? (
                  <CheckCircle2 className="w-5 h-5" />
                ) : (
                  stg.icon
                )}
              </div>

              {/* Content box */}
              <div className={`flex-1 p-4 rounded-2xl border transition-all ${
                isCurrent 
                  ? 'bg-emerald-50/70 border-emerald-300 shadow-xs' 
                  : isDone 
                  ? 'bg-white border-stone-200' 
                  : 'bg-stone-50/50 border-stone-100 opacity-60'
              }`}>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
                  <div className="flex items-center gap-2">
                    <span className={`text-xs px-2 py-0.5 rounded-md font-mono font-bold ${
                      isDone ? 'bg-emerald-100 text-emerald-900' : 'bg-stone-200 text-stone-600'
                    }`}>
                      Stage {stg.num}
                    </span>
                    <h3 className="font-bold text-stone-900 text-sm sm:text-base">
                      {stg.title}
                    </h3>
                  </div>

                  <span className="text-[11px] font-mono text-stone-400">
                    {stg.time}
                  </span>
                </div>

                <p className="text-xs text-stone-700 mt-0.5 leading-relaxed">
                  {stg.subtitle}
                </p>

                {stg.detail && (
                  <div className="mt-2 text-[11px] text-stone-500 bg-white/80 px-2.5 py-1 rounded-lg border border-stone-200/60 inline-block font-mono">
                    {stg.detail}
                  </div>
                )}
              </div>

            </div>
          );
        })}
      </div>

      {/* Action navigation */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={() => setFarmerStep(9)}
            className="px-4 py-2.5 rounded-xl border border-stone-300 text-stone-700 hover:bg-stone-100 font-medium text-xs flex items-center gap-1.5"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Live Queue</span>
          </button>

          <button
            onClick={() => simulateNextStage(activeTokenBooking.id)}
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold text-xs shadow-sm transition-all"
          >
            <Zap className="w-4 h-4" />
            <span>Advance Next Stage</span>
          </button>
        </div>

        <button
          onClick={() => setFarmerStep(11)}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold shadow-md hover:shadow-lg transition-all text-sm"
        >
          <span>View Payment & Settlement</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>

    </div>
  );
};
