import React from 'react';
import { 
  Building2, 
  MapPin, 
  Clock, 
  Users, 
  Scale, 
  Phone, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft,
  Calendar,
  AlertTriangle,
  Info
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const StepCentre: React.FC = () => {
  const { 
    t, 
    language, 
    centres, 
    selectedDistrict, 
    selectedCentreId, 
    setSelectedCentreId, 
    setFarmerStep 
  } = useApp();

  // Filter or show district centres + others if needed
  const districtCentres = centres.filter(c => c.district.toLowerCase() === selectedDistrict.toLowerCase());
  const displayCentres = districtCentres.length > 0 ? districtCentres : centres;

  return (
    <div id="step-centre" className="max-w-4xl mx-auto space-y-6">
      <div className="text-center space-y-2">
        <div className="inline-flex p-3 rounded-2xl bg-emerald-100 text-emerald-800 mb-1">
          <Building2 className="w-8 h-8" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-stone-900 font-display">
          {t.selectCentreTitle}
        </h2>
        <p className="text-stone-600 text-sm sm:text-base max-w-lg mx-auto">
          {t.selectCentreDesc}
        </p>
      </div>

      {/* Grid of Centres */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {displayCentres.map((centre) => {
          const isSelected = selectedCentreId === centre.id;
          const centreName = language === 'hi' ? centre.nameHi : language === 'gu' ? centre.nameGu : centre.name;
          const capacityPct = Math.round((centre.currentBookedQuintals / centre.dailyCapacityQuintals) * 100);

          const getCrowdBadge = () => {
            if (centre.crowdLevel === 'High') {
              return (
                <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full font-semibold bg-red-100 text-red-800">
                  <AlertTriangle className="w-3.5 h-3.5 text-red-600" />
                  {t.statusCrowded}
                </span>
              );
            } else if (centre.crowdLevel === 'Moderate') {
              return (
                <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full font-semibold bg-amber-100 text-amber-800">
                  <Info className="w-3.5 h-3.5 text-amber-600" />
                  Moderate Crowd
                </span>
              );
            }
            return (
              <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full font-semibold bg-emerald-100 text-emerald-800">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                {t.statusNormal}
              </span>
            );
          };

          return (
            <div
              key={centre.id}
              id={`centre-card-${centre.id}`}
              onClick={() => setSelectedCentreId(centre.id)}
              className={`p-5 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? 'border-emerald-600 bg-white shadow-lg ring-2 ring-emerald-600/20'
                  : 'border-stone-200 bg-white hover:border-emerald-300 hover:shadow-xs'
              }`}
            >
              <div>
                {/* Header row */}
                <div className="flex items-start justify-between gap-2 mb-2.5">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-stone-100 text-stone-700">
                      {centre.code}
                    </span>
                    <span className="text-xs text-stone-500 font-medium">
                      {centre.district}, {centre.state}
                    </span>
                  </div>
                  {getCrowdBadge()}
                </div>

                <h3 className="text-lg font-bold text-stone-900 leading-snug font-display mb-1.5">
                  {centreName}
                </h3>

                <p className="text-xs text-stone-600 flex items-start gap-1.5 mb-4 leading-relaxed">
                  <MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0 mt-0.5" />
                  <span>{centre.address}</span>
                </p>

                {/* Key Metrics */}
                <div className="grid grid-cols-2 gap-2 text-xs py-3 border-y border-stone-100 mb-4 bg-stone-50/50 rounded-xl p-2.5">
                  <div className="flex items-center gap-1.5 text-stone-600">
                    <Clock className="w-3.5 h-3.5 text-stone-400" />
                    <span>{centre.workingHours}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-stone-600">
                    <Scale className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{centre.activeWeighbridges} Electronic Weighbridges</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-stone-600">
                    <Users className="w-3.5 h-3.5 text-teal-600" />
                    <span>Limit: {centre.dailyFarmerLimit} Farmers/Day</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-stone-600">
                    <Phone className="w-3.5 h-3.5 text-stone-400" />
                    <span>{centre.contactNumber}</span>
                  </div>
                </div>

                {/* Daily Capacity bar */}
                <div>
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="text-stone-600 font-medium">
                      {t.dailyCapacity} Booked
                    </span>
                    <span className="font-semibold text-stone-900">
                      {centre.currentBookedQuintals} / {centre.dailyCapacityQuintals} Qtl ({capacityPct}%)
                    </span>
                  </div>
                  <div className="w-full bg-stone-100 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        capacityPct > 85 ? 'bg-red-500' : capacityPct > 65 ? 'bg-amber-500' : 'bg-emerald-600'
                      }`}
                      style={{ width: `${Math.min(capacityPct, 100)}%` }}
                    />
                  </div>
                </div>

                {/* Available Dates */}
                <div className="mt-3 flex items-center gap-1.5 text-[11px] text-stone-600">
                  <Calendar className="w-3.5 h-3.5 text-stone-400" />
                  <span className="font-medium">Open Booking Dates:</span>
                  <span className="text-emerald-800 font-semibold">{centre.availableDates.join(', ')}</span>
                </div>
              </div>

              {/* Action selection state */}
              <div className="mt-5 pt-3 border-t border-stone-100 flex items-center justify-between">
                <span className={`text-xs font-semibold ${isSelected ? 'text-emerald-700' : 'text-stone-500'}`}>
                  {isSelected ? t.selectedCentre : t.selectThisCentre}
                </span>
                <button
                  type="button"
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    isSelected
                      ? 'bg-emerald-700 text-white shadow-xs'
                      : 'border border-stone-300 text-stone-700 hover:bg-stone-50'
                  }`}
                >
                  {isSelected ? '✓ Selected' : 'Choose'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Navigation buttons */}
      <div className="flex items-center justify-between pt-2">
        <button
          id="centre-back-btn"
          onClick={() => setFarmerStep(2)}
          className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl border border-stone-300 text-stone-700 hover:bg-stone-100 font-medium transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t.backBtn}</span>
        </button>

        <button
          id="centre-continue-btn"
          onClick={() => setFarmerStep(4)}
          className="inline-flex items-center gap-2 px-8 py-3 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-semibold shadow-sm hover:shadow-md transition-all text-base"
        >
          <span>{t.continueBtn}</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
