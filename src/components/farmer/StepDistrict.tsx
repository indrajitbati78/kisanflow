import React, { useState } from 'react';
import { MapPin, Navigation, ArrowRight, ArrowLeft, Building2, CheckCircle2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { STATES_DISTRICTS_DATA } from '../../data/mockData';

export const StepDistrict: React.FC = () => {
  const { 
    t, 
    language, 
    selectedState, 
    setSelectedState, 
    selectedDistrict, 
    setSelectedDistrict, 
    setFarmerStep,
    farmerProfile,
    setFarmerProfile,
    centres 
  } = useApp();

  const [villageInput, setVillageInput] = useState(farmerProfile.village || 'Sanand Rural / Modasar');

  const currentStateObj = STATES_DISTRICTS_DATA.find(s => s.state === selectedState) || STATES_DISTRICTS_DATA[0];
  const availableDistricts = currentStateObj.districts;

  const filteredCentres = centres.filter(c => c.district.toLowerCase() === selectedDistrict.toLowerCase());

  const handleContinue = () => {
    setFarmerProfile(prev => ({
      ...prev,
      state: selectedState,
      district: selectedDistrict,
      village: villageInput
    }));
    setFarmerStep(3);
  };

  return (
    <div id="step-district" className="max-w-3xl mx-auto space-y-6">
      <div className="text-center space-y-2">
        <div className="inline-flex p-3 rounded-2xl bg-emerald-100 text-emerald-800 mb-1">
          <MapPin className="w-8 h-8" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-stone-900 font-display">
          {t.selectLocationTitle}
        </h2>
        <p className="text-stone-600 text-sm sm:text-base max-w-lg mx-auto">
          {t.selectLocationDesc}
        </p>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm space-y-5">
        
        {/* State selection */}
        <div>
          <label className="block text-sm font-semibold text-stone-800 mb-2">
            {t.stateLabel}
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {STATES_DISTRICTS_DATA.map((st) => (
              <button
                key={st.state}
                id={`state-btn-${st.state}`}
                type="button"
                onClick={() => {
                  setSelectedState(st.state);
                  setSelectedDistrict(st.districts[0].name);
                }}
                className={`px-4 py-2.5 rounded-xl text-sm font-medium border text-left transition-all ${
                  selectedState === st.state
                    ? 'border-emerald-600 bg-emerald-50 text-emerald-900 font-bold shadow-2xs'
                    : 'border-stone-200 hover:border-stone-300 text-stone-700 bg-stone-50/50'
                }`}
              >
                {st.state}
              </button>
            ))}
          </div>
        </div>

        {/* District selection */}
        <div>
          <label className="block text-sm font-semibold text-stone-800 mb-2">
            {t.districtLabel}
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {availableDistricts.map((dst) => {
              const displayName = language === 'hi' ? dst.nameHi : language === 'gu' ? dst.nameGu : dst.name;
              const isSelected = selectedDistrict.toLowerCase() === dst.name.toLowerCase();

              return (
                <button
                  key={dst.name}
                  id={`district-btn-${dst.name}`}
                  type="button"
                  onClick={() => setSelectedDistrict(dst.name)}
                  className={`p-3 rounded-xl border text-left transition-all flex items-center justify-between ${
                    isSelected
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-900 ring-1 ring-emerald-600 font-bold'
                      : 'border-stone-200 hover:border-emerald-200 text-stone-700 bg-stone-50/40'
                  }`}
                >
                  <div>
                    <span className="block text-sm">{displayName}</span>
                    <span className="text-[11px] text-stone-500 font-normal">
                      {dst.centresCount} APMC Centres
                    </span>
                  </div>
                  {isSelected && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Village / Gram Panchayat */}
        <div>
          <label className="block text-sm font-semibold text-stone-800 mb-2">
            {t.villageLabel}
          </label>
          <div className="relative">
            <input
              id="village-input"
              type="text"
              value={villageInput}
              onChange={(e) => setVillageInput(e.target.value)}
              placeholder="e.g. Sanand Rural, Modasar, Mandal Gram"
              className="w-full px-4 py-3 pl-11 rounded-xl border border-stone-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-hidden text-stone-800 font-medium bg-stone-50/30"
            />
            <Navigation className="w-4 h-4 text-stone-400 absolute left-4 top-3.5" />
          </div>
          <p className="text-xs text-stone-500 mt-1.5">
            Used to map the shortest haulage route to the procurement yard.
          </p>
        </div>

        {/* Quick summary of available centres */}
        <div className="p-4 rounded-xl bg-stone-50 border border-stone-200/80">
          <div className="flex items-center gap-2 mb-2 text-stone-800 text-xs font-semibold uppercase tracking-wider">
            <Building2 className="w-4 h-4 text-emerald-700" />
            <span>{t.availableCentresInDistrict} ({selectedDistrict}):</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {filteredCentres.length > 0 ? (
              filteredCentres.map(c => (
                <span key={c.id} className="text-xs bg-white border border-stone-200 px-2.5 py-1 rounded-lg text-stone-700 font-medium">
                  {language === 'hi' ? c.nameHi : language === 'gu' ? c.nameGu : c.name}
                </span>
              ))
            ) : (
              <span className="text-xs text-stone-500 italic">2 Hub yards operating in this jurisdiction</span>
            )}
          </div>
        </div>

      </div>

      {/* Navigation buttons */}
      <div className="flex items-center justify-between pt-2">
        <button
          id="district-back-btn"
          onClick={() => setFarmerStep(1)}
          className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl border border-stone-300 text-stone-700 hover:bg-stone-100 font-medium transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t.backBtn}</span>
        </button>

        <button
          id="district-continue-btn"
          onClick={handleContinue}
          className="inline-flex items-center gap-2 px-8 py-3 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-semibold shadow-sm hover:shadow-md transition-all text-base"
        >
          <span>{t.continueBtn}</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
