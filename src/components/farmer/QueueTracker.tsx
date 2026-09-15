import React from 'react';
import { 
  Radio, 
  Clock, 
  Users, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowRight, 
  Sparkles, 
  Scale, 
  Building2,
  Volume2,
  PhoneCall,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { QueueStatus } from '../../types';

export const QueueTracker: React.FC = () => {
  const { 
    t, 
    activeTokenBooking, 
    bookings, 
    setFarmerStep, 
    simulateNextStage, 
    markArrived 
  } = useApp();

  if (!activeTokenBooking) {
    return (
      <div className="text-center py-12">
        <p className="text-stone-600 font-medium">No active booking to track.</p>
        <button
          onClick={() => setFarmerStep(1)}
          className="mt-3 px-5 py-2 bg-emerald-700 text-white rounded-xl text-sm"
        >
          Book Slot
        </button>
      </div>
    );
  }

  // Active bookings at this centre
  const centreBookings = bookings.filter(b => b.centreId === activeTokenBooking.centreId);
  const activeProcessing = centreBookings.find(b => b.status === 'in_progress') || centreBookings.find(b => b.status === 'called');
  
  // Calculate farmers ahead of activeTokenBooking
  const myIndex = centreBookings.findIndex(b => b.id === activeTokenBooking.id);
  const activeIndex = activeProcessing ? centreBookings.findIndex(b => b.id === activeProcessing.id) : 0;
  const farmersAhead = Math.max(0, myIndex - activeIndex);
  const estimatedWaitMinutes = farmersAhead * 8; // ~8 mins per truck weighbridge cycle

  const getStatusBadge = (status: QueueStatus) => {
    switch (status) {
      case 'completed':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">Completed</span>;
      case 'in_progress':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-800 animate-pulse">In Progress (Weighbridge)</span>;
      case 'called':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 animate-bounce">Called to Gate #2</span>;
      case 'arrived':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800">Arrived (In Shed)</span>;
      default:
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-stone-100 text-stone-700">Booked (On the way)</span>;
    }
  };

  const handleVoiceCallout = () => {
    if ('speechSynthesis' in window) {
      const text = `Attention Token ${activeTokenBooking.tokenNumber}. Status is currently ${activeTokenBooking.status}. Farmers ahead: ${farmersAhead}. Estimated wait: ${estimatedWaitMinutes} minutes.`;
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.95;
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div id="step-queue-tracker" className="max-w-3xl mx-auto space-y-6">
      
      {/* Header */}
      <div className="text-center space-y-1">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-2">
          <Radio className="w-3.5 h-3.5 text-emerald-600 animate-ping" />
          Live Center Feed Active
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-stone-900 font-display">
          {t.liveQueueTitle}
        </h2>
        <p className="text-stone-600 text-xs sm:text-sm">
          {activeTokenBooking.centreName} • Live Electronic Weighbridge Monitoring
        </p>
      </div>

      {/* Main Waiting Room Status Billboard */}
      <div className="bg-stone-900 text-white p-6 rounded-3xl shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
          
          {/* Left: Current Active Token being served */}
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex flex-col justify-between">
            <div>
              <span className="text-xs text-stone-400 font-medium block uppercase tracking-wider">
                {t.nowServing} (Electronic Weighbridge #2)
              </span>
              <div className="text-4xl font-black font-mono text-emerald-400 mt-1">
                {activeProcessing ? activeProcessing.tokenNumber : 'KF-097'}
              </div>
              <p className="text-xs text-stone-300 mt-1">
                {activeProcessing ? activeProcessing.farmerName : 'Kishore Rabari'} ({activeProcessing?.cropName.split(' ')[0] || 'Cotton'})
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs text-stone-400">
              <span className="flex items-center gap-1">
                <Scale className="w-3.5 h-3.5 text-emerald-400" /> Weighbridge: Active
              </span>
              <span className="text-emerald-300 font-mono">Sensors Calibrated</span>
            </div>
          </div>

          {/* Right: Farmer's Token Details */}
          <div className="p-4 rounded-2xl bg-emerald-950/80 border border-emerald-500/30 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-emerald-300 font-medium block uppercase tracking-wider">
                  Your Token Number
                </span>
                {getStatusBadge(activeTokenBooking.status)}
              </div>
              <div className="text-4xl font-black font-mono text-white mt-1">
                {activeTokenBooking.tokenNumber}
              </div>
              <p className="text-xs text-emerald-200 mt-1">
                Assigned: {activeTokenBooking.slotTime} ({activeTokenBooking.bookingDate})
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-emerald-800/60 flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5 text-emerald-200">
                <Users className="w-4 h-4 text-amber-300" />
                <span>{farmersAhead} {t.farmersAhead}</span>
              </div>
              <div className="flex items-center gap-1.5 text-emerald-200">
                <Clock className="w-4 h-4 text-emerald-400" />
                <span>~{estimatedWaitMinutes} mins wait</span>
              </div>
            </div>
          </div>

        </div>

        {/* Audio Assistance and Self Check-in Banner */}
        <div className="mt-5 pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <button
            type="button"
            onClick={handleVoiceCallout}
            className="flex items-center gap-1.5 text-stone-300 hover:text-white px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
          >
            <Volume2 className="w-4 h-4 text-amber-300" />
            <span>Voice Status Broadcast (Hindi/Gujarati)</span>
          </button>

          {activeTokenBooking.status === 'booked' && (
            <button
              onClick={() => markArrived(activeTokenBooking.id)}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition-colors flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>I Have Arrived at APMC Gate</span>
            </button>
          )}

          {activeTokenBooking.status === 'called' && (
            <div className="px-3 py-1.5 rounded-xl bg-amber-500 text-stone-950 font-bold animate-pulse flex items-center gap-1.5">
              <PhoneCall className="w-4 h-4" />
              <span>PROCEED TO WEIGHBRIDGE #2 NOW</span>
            </div>
          )}
        </div>
      </div>

      {/* Live Queue Table Preview */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
        <div className="px-5 py-3.5 border-b border-stone-100 bg-stone-50/70 flex items-center justify-between">
          <h3 className="text-sm font-bold text-stone-800">
            Center Queue Sequence (Today's Tokens)
          </h3>
          <span className="text-xs text-stone-500 font-medium">
            Total {centreBookings.length} Vehicles Scheduled
          </span>
        </div>

        <div className="divide-y divide-stone-100">
          {centreBookings.map((item, idx) => {
            const isMe = item.id === activeTokenBooking.id;

            return (
              <div
                key={item.id}
                className={`p-4 flex items-center justify-between gap-3 transition-colors ${
                  isMe 
                    ? 'bg-emerald-50/70 border-l-4 border-l-emerald-600 font-medium' 
                    : idx === 0 
                    ? 'bg-purple-50/30' 
                    : 'hover:bg-stone-50/50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-mono font-bold text-xs ${
                    isMe ? 'bg-emerald-700 text-white' : 'bg-stone-100 text-stone-600'
                  }`}>
                    #{idx + 1}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-stone-900 font-mono text-sm">{item.tokenNumber}</span>
                      {isMe && (
                        <span className="text-[10px] bg-emerald-600 text-white px-1.5 py-0.2 rounded font-bold">
                          YOU
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-stone-500 block">
                      {item.farmerName} • {item.quantityQuintals} Qtl {item.cropName.split(' ')[0]}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-right">
                  <div className="hidden sm:block text-xs text-stone-500 font-mono">
                    {item.slotTime}
                  </div>
                  {getStatusBadge(item.status)}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Simulator bar & Next step buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={() => simulateNextStage(activeTokenBooking.id)}
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold text-xs shadow-sm transition-all"
          >
            <Zap className="w-4 h-4" />
            <span>Simulate Operator Calling / Processing</span>
          </button>
        </div>

        <button
          onClick={() => setFarmerStep(10)}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold shadow-md hover:shadow-lg transition-all text-sm"
        >
          <span>View 7-Stage Produce Timeline</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
};
