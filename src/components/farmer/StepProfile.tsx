import React, { useState } from 'react';
import { User, Phone, MapPin, ShieldCheck, ArrowRight, ArrowLeft, KeyRound, Sparkles } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const StepProfile: React.FC = () => {
  const { 
    t, 
    farmerProfile, 
    setFarmerProfile, 
    setFarmerStep, 
    selectedState, 
    selectedDistrict, 
    selectedCentreId, 
    centres 
  } = useApp();

  const [fullName, setFullName] = useState(farmerProfile.fullName);
  const [mobileNumber, setMobileNumber] = useState(farmerProfile.mobileNumber);
  const [landArea, setLandArea] = useState(farmerProfile.landAreaAcres.toString());
  const [username, setUsername] = useState('ramesh_kisan');
  const [password, setPassword] = useState('••••••••');
  const [village, setVillage] = useState(farmerProfile.village);

  const selectedCentre = centres.find(c => c.id === selectedCentreId) || centres[0];

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setFarmerProfile(prev => ({
      ...prev,
      fullName,
      mobileNumber,
      village,
      landAreaAcres: parseFloat(landArea) || 5,
      preferredCentreId: selectedCentreId
    }));
    setFarmerStep(5);
  };

  return (
    <div id="step-profile" className="max-w-2xl mx-auto space-y-6">
      <div className="text-center space-y-2">
        <div className="inline-flex p-3 rounded-2xl bg-emerald-100 text-emerald-800 mb-1">
          <User className="w-8 h-8" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-stone-900 font-display">
          {t.farmerRegTitle}
        </h2>
        <p className="text-stone-600 text-sm sm:text-base max-w-lg mx-auto">
          {t.farmerRegDesc}
        </p>
      </div>

      {/* Unique Farmer ID Card */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-800 to-teal-900 text-white shadow-md flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center border border-white/20">
            <Sparkles className="w-6 h-6 text-amber-300" />
          </div>
          <div>
            <span className="text-xs text-emerald-200 font-medium uppercase tracking-wider block">
              {t.farmerIdGenerated}
            </span>
            <span className="text-2xl font-black font-mono tracking-wider text-amber-300">
              {farmerProfile.id}
            </span>
          </div>
        </div>
        <div className="text-right hidden sm:block">
          <span className="text-xs text-emerald-200">Aadhaar / Kisan e-KYC:</span>
          <span className="text-xs block text-emerald-100 font-semibold flex items-center justify-end gap-1">
            <ShieldCheck className="w-4 h-4 text-emerald-400" /> Verified Citizen
          </span>
        </div>
      </div>

      {/* Registration Form */}
      <form onSubmit={handleSave} className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm space-y-4">
        
        {/* Full Name */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
            {t.fullName} *
          </label>
          <div className="relative">
            <input
              id="input-farmer-name"
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full px-4 py-2.5 pl-10 rounded-xl border border-stone-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-hidden font-medium text-stone-900"
              placeholder="e.g. Ramesh Patel"
            />
            <User className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
          </div>
        </div>

        {/* Mobile Number & Land Area in 2 cols */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
              {t.mobileNumber} *
            </label>
            <div className="relative">
              <input
                id="input-farmer-phone"
                type="tel"
                required
                value={mobileNumber}
                onChange={(e) => setMobileNumber(e.target.value)}
                className="w-full px-4 py-2.5 pl-10 rounded-xl border border-stone-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-hidden font-medium text-stone-900"
                placeholder="10-digit mobile number"
              />
              <Phone className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
              {t.landArea} ({t.landAreaUnit}) *
            </label>
            <input
              id="input-farmer-land"
              type="number"
              step="0.5"
              required
              value={landArea}
              onChange={(e) => setLandArea(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-stone-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-hidden font-medium text-stone-900"
              placeholder="e.g. 6.5"
            />
          </div>
        </div>

        {/* Village */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
            Village / Gram Panchayat *
          </label>
          <div className="relative">
            <input
              id="input-farmer-village"
              type="text"
              required
              value={village}
              onChange={(e) => setVillage(e.target.value)}
              className="w-full px-4 py-2.5 pl-10 rounded-xl border border-stone-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-hidden font-medium text-stone-900"
            />
            <MapPin className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
          </div>
        </div>

        {/* Credentials & Selected Centre summary */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
              Portal Username
            </label>
            <input
              id="input-farmer-username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-stone-200 bg-stone-50 font-mono text-xs text-stone-700"
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
              Security PIN / Password
            </label>
            <div className="relative">
              <input
                id="input-farmer-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 pl-8 rounded-xl border border-stone-200 bg-stone-50 font-mono text-xs text-stone-700"
              />
              <KeyRound className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-2.5" />
            </div>
          </div>
        </div>

        {/* Assigned preferred centre preview */}
        <div className="p-3 bg-emerald-50/70 border border-emerald-100 rounded-xl flex items-center justify-between text-xs">
          <div>
            <span className="text-emerald-900 font-semibold block">Preferred APMC:</span>
            <span className="text-stone-700">{selectedCentre.name} ({selectedDistrict})</span>
          </div>
          <span className="text-emerald-700 font-bold bg-white px-2 py-0.5 rounded border border-emerald-200">
            {selectedState}
          </span>
        </div>

        {/* Navigation buttons */}
        <div className="flex items-center justify-between pt-4 border-t border-stone-100">
          <button
            id="profile-back-btn"
            type="button"
            onClick={() => setFarmerStep(3)}
            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl border border-stone-300 text-stone-700 hover:bg-stone-100 font-medium transition-colors text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{t.backBtn}</span>
          </button>

          <button
            id="profile-continue-btn"
            type="submit"
            className="inline-flex items-center gap-2 px-8 py-3 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-semibold shadow-sm hover:shadow-md transition-all text-base"
          >
            <span>{t.continueBtn}</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </form>
    </div>
  );
};
