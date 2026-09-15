import React from 'react';
import { 
  Languages, 
  MapPin, 
  Building2, 
  User, 
  Wheat, 
  Clock, 
  Ticket, 
  Radio, 
  LineChart, 
  CreditCard,
  ChevronRight,
  Lock,
  CheckCircle2,
  ShieldCheck
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { StepLanguage } from './StepLanguage';
import { StepDistrict } from './StepDistrict';
import { StepCentre } from './StepCentre';
import { StepProfile } from './StepProfile';
import { StepProduce } from './StepProduce';
import { StepSlotBooking } from './StepSlotBooking';
import { StepDigitalToken } from './StepDigitalToken';
import { QueueTracker } from './QueueTracker';
import { ProduceTracker } from './ProduceTracker';
import { PaymentVoucher } from './PaymentVoucher';

export const FarmerWorkflow: React.FC = () => {
  const { farmerStep, setFarmerStep, maxUnlockedStep, activeTokenBooking, language } = useApp();

  const stepList = [
    { num: 1, label: language === 'gu' ? 'ભાષા' : 'Language', icon: <Languages className="w-3.5 h-3.5" /> },
    { num: 2, label: language === 'gu' ? 'ગુજરાત જિલ્લો' : 'District', icon: <MapPin className="w-3.5 h-3.5" /> },
    { num: 3, label: language === 'gu' ? 'APMC કેન્દ્ર' : 'Centre', icon: <Building2 className="w-3.5 h-3.5" /> },
    { num: 4, label: language === 'gu' ? 'પ્રોફાઇલ' : 'Profile', icon: <User className="w-3.5 h-3.5" /> },
    { num: 5, label: language === 'gu' ? 'પાક નોંધણી' : 'Produce', icon: <Wheat className="w-3.5 h-3.5" /> },
    { num: 6, label: language === 'gu' ? 'સ્લોટ બુકિંગ' : 'Slot Booking', icon: <Clock className="w-3.5 h-3.5" /> },
    { num: 7, label: language === 'gu' ? 'ડિજિટલ ટોકન' : 'Digital Token', icon: <Ticket className="w-3.5 h-3.5" /> },
    { num: 9, label: language === 'gu' ? 'લાઇવ કતાર' : 'Live Queue', icon: <Radio className="w-3.5 h-3.5" /> },
    { num: 10, label: language === 'gu' ? 'વેબ્રિજ ટ્રેકિંગ' : 'Tracking', icon: <LineChart className="w-3.5 h-3.5" /> },
    { num: 11, label: language === 'gu' ? 'DBT ચુકવણી' : 'Payment', icon: <CreditCard className="w-3.5 h-3.5" /> }
  ];

  const renderCurrentStep = () => {
    switch (farmerStep) {
      case 1:
        return <StepLanguage />;
      case 2:
        return <StepDistrict />;
      case 3:
        return <StepCentre />;
      case 4:
        return <StepProfile />;
      case 5:
        return <StepProduce />;
      case 6:
        return <StepSlotBooking />;
      case 7:
      case 8:
        return <StepDigitalToken />;
      case 9:
        return <QueueTracker />;
      case 10:
        return <ProduceTracker />;
      case 11:
        return <PaymentVoucher />;
      default:
        return <StepDigitalToken />;
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Sequential Step Progress Header */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-xs p-3 sm:p-4 space-y-3">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-100 pb-2.5">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
            <h3 className="text-xs sm:text-sm font-bold text-stone-800">
              {language === 'gu' 
                ? 'ક્રમશઃ પ્રક્રિયા (Sequential Steps): પહેલાનું પગલું પૂર્ણ કર્યા પછી જ આગળ વધો' 
                : 'Procurement Workflow: Complete each step sequentially to unlock the next stage'}
            </h3>
          </div>

          <div className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full flex items-center gap-1.5 self-start sm:self-auto">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>
              {language === 'gu' ? `પગલું ${farmerStep} સક્રિય` : `Step ${farmerStep} of ${stepList.length} Active`}
            </span>
          </div>
        </div>

        {/* Step Navigation Ribbon */}
        <div className="overflow-x-auto pb-1">
          <div className="flex items-center min-w-max gap-1 px-1">
            {stepList.map((st, i) => {
              const isActive = farmerStep === st.num;
              const isCompleted = st.num < farmerStep;
              const isUnlocked = st.num <= maxUnlockedStep;

              return (
                <React.Fragment key={st.num}>
                  <button
                    type="button"
                    id={`nav-step-${st.num}`}
                    disabled={!isUnlocked}
                    onClick={() => {
                      if (isUnlocked) {
                        setFarmerStep(st.num);
                      }
                    }}
                    title={
                      !isUnlocked 
                        ? (language === 'gu' ? 'પહેલાના પગલાં પૂર્ણ કરો' : 'Complete previous steps to unlock')
                        : undefined
                    }
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-emerald-700 text-white shadow-xs ring-2 ring-emerald-700/20'
                        : isCompleted
                        ? 'bg-emerald-50 text-emerald-900 hover:bg-emerald-100 border border-emerald-200/80 cursor-pointer'
                        : isUnlocked
                        ? 'bg-white text-stone-700 hover:bg-stone-100 border border-stone-200 cursor-pointer'
                        : 'bg-stone-100/70 text-stone-400 border border-stone-200/60 cursor-not-allowed opacity-60'
                    }`}
                  >
                    <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${
                      isActive 
                        ? 'bg-white text-emerald-800 font-bold' 
                        : isCompleted 
                        ? 'bg-emerald-200 text-emerald-900 font-bold' 
                        : isUnlocked
                        ? 'bg-stone-200 text-stone-700 font-bold'
                        : 'bg-stone-200 text-stone-400'
                    }`}>
                      {!isUnlocked ? (
                        <Lock className="w-2.5 h-2.5 text-stone-400" />
                      ) : isCompleted ? (
                        '✓'
                      ) : (
                        st.num
                      )}
                    </span>
                    <span>{st.label}</span>
                  </button>

                  {i < stepList.length - 1 && (
                    <ChevronRight className="w-3.5 h-3.5 text-stone-300 shrink-0" />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>

      </div>

      {/* Quick Status Bar for Farmer */}
      {activeTokenBooking && (
        <div className="bg-emerald-50/90 border border-emerald-200 rounded-2xl p-3 px-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
            <span className="text-emerald-950 font-semibold">
              Active Booking: <strong>{activeTokenBooking.tokenNumber}</strong> ({activeTokenBooking.cropName})
            </span>
            <span className="text-emerald-800 bg-white px-2 py-0.5 rounded border border-emerald-200 font-mono">
              Status: {activeTokenBooking.status.toUpperCase()}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setFarmerStep(7)}
              className="px-2.5 py-1 rounded-lg bg-white border border-emerald-300 text-emerald-900 font-medium hover:bg-emerald-100/50"
            >
              View Pass
            </button>
            <button
              onClick={() => setFarmerStep(9)}
              className="px-2.5 py-1 rounded-lg bg-emerald-700 text-white font-medium hover:bg-emerald-800"
            >
              Live Queue
            </button>
          </div>
        </div>
      )}

      {/* Render Current Step View */}
      <div className="min-h-[500px]">
        {renderCurrentStep()}
      </div>

    </div>
  );
};
