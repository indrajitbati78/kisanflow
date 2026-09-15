import React, { useState } from 'react';
import { Clock, Calendar, ShieldCheck, Users, CheckCircle2, ArrowRight, ArrowLeft, AlertCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const StepSlotBooking: React.FC = () => {
  const { 
    t, 
    timeSlots, 
    centres, 
    selectedCentreId, 
    bookSlot, 
    crops,
    setFarmerStep 
  } = useApp();

  const selectedCentre = centres.find(c => c.id === selectedCentreId) || centres[0];
  const [selectedDate, setSelectedDate] = useState<'Today' | 'Tomorrow' | 'Day After Tomorrow'>('Today');
  const [selectedSlotTime, setSelectedSlotTime] = useState<string>('10:30 AM – 11:30 AM');

  const availableCentreSlots = timeSlots.filter(
    s => s.centreId === selectedCentreId || s.centreId === 'centre_ahmedabad_central'
  );

  const handleBooking = (e: React.FormEvent) => {
    e.preventDefault();
    bookSlot({
      centreId: selectedCentre.id,
      cropId: crops[0].id,
      quantityQuintals: 40,
      slotTime: selectedSlotTime,
      bookingDate: selectedDate,
      harvestDate: '2026-09-18',
      qualityCategory: 'Grade A'
    });
  };

  return (
    <div id="step-slot-booking" className="max-w-3xl mx-auto space-y-6">
      <div className="text-center space-y-2">
        <div className="inline-flex p-3 rounded-2xl bg-emerald-100 text-emerald-800 mb-1">
          <Clock className="w-8 h-8" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-stone-900 font-display">
          {t.slotBookingTitle}
        </h2>
        <p className="text-stone-600 text-sm sm:text-base max-w-lg mx-auto">
          {t.slotBookingDesc}
        </p>
      </div>

      {/* Selected Centre banner */}
      <div className="p-4 rounded-xl bg-white border border-stone-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <span className="text-xs font-semibold text-emerald-800 uppercase tracking-wide">
            Target APMC Procurement Yard
          </span>
          <h3 className="font-bold text-stone-900 text-base">{selectedCentre.name}</h3>
          <p className="text-xs text-stone-500">{selectedCentre.address}</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full font-bold">
            {selectedCentre.workingHours}
          </span>
        </div>
      </div>

      <form onSubmit={handleBooking} className="space-y-5">
        {/* Date Selector Tabs */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-2 flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-emerald-700" />
            {t.selectDate}
          </label>
          <div className="grid grid-cols-3 gap-2.5">
            {(['Today', 'Tomorrow', 'Day After Tomorrow'] as const).map((d) => (
              <button
                type="button"
                key={d}
                id={`date-btn-${d.replace(/\s+/g, '-').toLowerCase()}`}
                onClick={() => setSelectedDate(d)}
                className={`py-3 px-3 rounded-xl border text-center font-medium transition-all ${
                  selectedDate === d
                    ? 'border-emerald-600 bg-emerald-50 text-emerald-950 font-bold shadow-2xs ring-1 ring-emerald-600'
                    : 'border-stone-200 bg-white text-stone-700 hover:border-stone-300'
                }`}
              >
                <span className="block text-sm">{d}</span>
                <span className="text-[11px] text-stone-500 font-normal">
                  {d === 'Today' ? 'Sep 15 (Active)' : d === 'Tomorrow' ? 'Sep 16' : 'Sep 17'}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Time Slots Grid with Capacity Checks */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-2 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-emerald-700" />
              {t.availableSlots}
            </span>
            <span className="text-[11px] text-stone-500 font-normal">
              Max 15 farmers per 60-minute window
            </span>
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {availableCentreSlots.map((slot) => {
              const remaining = Math.max(0, slot.maxCapacity - slot.bookedCount);
              const isFull = remaining <= 0;
              const isSelected = selectedSlotTime === slot.timeRange && !isFull;

              return (
                <div
                  key={slot.id}
                  id={`slot-${slot.id}`}
                  onClick={() => {
                    if (!isFull) {
                      setSelectedSlotTime(slot.timeRange);
                    }
                  }}
                  className={`p-4 rounded-xl border-2 transition-all flex items-center justify-between ${
                    isFull
                      ? 'border-stone-200 bg-stone-100/80 opacity-60 cursor-not-allowed'
                      : isSelected
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-950 ring-2 ring-emerald-600/20 cursor-pointer shadow-sm'
                      : 'border-stone-200 bg-white hover:border-emerald-300 cursor-pointer shadow-2xs'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Clock className={`w-4 h-4 ${isSelected ? 'text-emerald-700' : 'text-stone-400'}`} />
                      <span className="font-bold text-sm text-stone-900">{slot.timeRange}</span>
                    </div>

                    <div className="flex items-center gap-2 text-xs">
                      {isFull ? (
                        <span className="text-red-600 font-semibold flex items-center gap-1">
                          <AlertCircle className="w-3.5 h-3.5" /> {t.slotFull}
                        </span>
                      ) : (
                        <span className={`font-medium ${remaining <= 3 ? 'text-amber-700' : 'text-emerald-700'}`}>
                          {remaining} {t.slotsRemaining} ({slot.bookedCount}/{slot.maxCapacity} booked)
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="text-right">
                    {isSelected && (
                      <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center">
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                    )}
                    {isFull && (
                      <span className="text-[10px] uppercase font-bold text-stone-400">Full</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Algorithm benefits badge */}
        <div className="p-3.5 rounded-xl bg-teal-50/70 border border-teal-200/60 flex items-start gap-2.5 text-xs text-teal-900">
          <ShieldCheck className="w-5 h-5 text-teal-700 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong>Smart Capacity Distribution:</strong> By staggering arrival windows, average farmer waiting time is reduced from 4.5 hours to <strong>less than 25 minutes</strong>. Electronic weighbridge is reserved for your vehicle.
          </p>
        </div>

        {/* Navigation buttons */}
        <div className="flex items-center justify-between pt-3 border-t border-stone-100">
          <button
            id="slot-back-btn"
            type="button"
            onClick={() => setFarmerStep(5)}
            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl border border-stone-300 text-stone-700 hover:bg-stone-100 font-medium transition-colors text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{t.backBtn}</span>
          </button>

          <button
            id="slot-confirm-btn"
            type="submit"
            className="inline-flex items-center gap-2 px-8 py-3 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold shadow-md hover:shadow-lg transition-all text-base"
          >
            <span>{t.confirmBtn}</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </form>
    </div>
  );
};
