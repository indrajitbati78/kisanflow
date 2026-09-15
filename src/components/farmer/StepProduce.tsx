import React, { useState } from 'react';
import { Wheat, Calendar, IndianRupee, Scale, ShieldCheck, ArrowRight, ArrowLeft, Info, Sparkles } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { QualityGrade } from '../../types';

export const StepProduce: React.FC = () => {
  const { 
    t, 
    language, 
    crops, 
    centres, 
    selectedCentreId, 
    setFarmerStep,
    farmerProfile 
  } = useApp();

  const [selectedCropId, setSelectedCropId] = useState(crops[0].id);
  const [quantityQuintals, setQuantityQuintals] = useState<number>(40);
  const [harvestDate, setHarvestDate] = useState('2026-09-18');
  const [qualityGrade, setQualityGrade] = useState<QualityGrade>('Grade A');

  const selectedCrop = crops.find(c => c.id === selectedCropId) || crops[0];
  const selectedCentre = centres.find(c => c.id === selectedCentreId) || centres[0];

  const estimatedTotal = (quantityQuintals || 0) * selectedCrop.mspPerQuintal;
  const produceId = `PR${2000 + Math.floor(Math.random() * 80) + 1}`;

  const handleContinue = (e: React.FormEvent) => {
    e.preventDefault();
    // Save draft or continue to smart slot booking
    setFarmerStep(6);
  };

  return (
    <div id="step-produce" className="max-w-2xl mx-auto space-y-6">
      <div className="text-center space-y-2">
        <div className="inline-flex p-3 rounded-2xl bg-emerald-100 text-emerald-800 mb-1">
          <Wheat className="w-8 h-8" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-stone-900 font-display">
          {t.produceRegTitle}
        </h2>
        <p className="text-stone-600 text-sm sm:text-base max-w-lg mx-auto">
          {t.produceRegDesc}
        </p>
      </div>

      {/* Produce ID preview */}
      <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-between text-xs text-amber-900">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-600" />
          <span>Produce Declaration ID: <strong className="font-mono text-sm font-bold">{produceId}</strong></span>
        </div>
        <span className="bg-amber-200/80 px-2 py-0.5 rounded font-semibold text-amber-950">
          Farmer: {farmerProfile.id}
        </span>
      </div>

      <form onSubmit={handleContinue} className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm space-y-5">
        
        {/* Crop Selection */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
            {t.cropType} *
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {crops.map((crop) => {
              const displayName = language === 'hi' ? crop.nameHi : language === 'gu' ? crop.nameGu : crop.name;
              const isSelected = selectedCropId === crop.id;

              return (
                <button
                  type="button"
                  key={crop.id}
                  id={`crop-select-${crop.id}`}
                  onClick={() => setSelectedCropId(crop.id)}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    isSelected
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-950 ring-1 ring-emerald-600'
                      : 'border-stone-200 hover:border-emerald-200 text-stone-700 bg-stone-50/40'
                  }`}
                >
                  <div className="flex items-start justify-between gap-1">
                    <span className="font-bold text-sm leading-tight block">{displayName}</span>
                    <span className="text-[10px] bg-stone-200 px-1.5 py-0.5 rounded font-medium text-stone-700">
                      {crop.category}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 mt-1 text-xs text-emerald-700 font-semibold">
                    <IndianRupee className="w-3 h-3" />
                    <span>₹{crop.mspPerQuintal.toLocaleString('en-IN')} / Quintal</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Quantity (Quintals) */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
            {t.expectedQuantity} ({t.quintals}) *
          </label>
          <div className="relative">
            <input
              id="input-produce-quantity"
              type="number"
              min="1"
              max="500"
              required
              value={quantityQuintals}
              onChange={(e) => setQuantityQuintals(Math.max(1, Number(e.target.value)))}
              className="w-full px-4 py-2.5 pl-10 rounded-xl border border-stone-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-hidden font-bold text-stone-900 text-lg"
              placeholder="e.g. 40"
            />
            <Scale className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
            <span className="absolute right-4 top-3 text-xs font-semibold text-stone-500">
              = {(quantityQuintals * 100).toLocaleString('en-IN')} kg
            </span>
          </div>
          <p className="text-[11px] text-stone-500 mt-1">
            Standard 1 Tractor Trolley ~ 30-50 Quintals. 1 Quintal = 100 Kilograms.
          </p>
        </div>

        {/* Harvest Date & Quality Category */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
              {t.harvestDate}
            </label>
            <div className="relative">
              <input
                id="input-harvest-date"
                type="date"
                value={harvestDate}
                onChange={(e) => setHarvestDate(e.target.value)}
                className="w-full px-3 py-2 pl-9 rounded-xl border border-stone-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-hidden text-sm font-medium text-stone-800"
              />
              <Calendar className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
              {t.qualityCategory}
            </label>
            <select
              id="select-quality-grade"
              value={qualityGrade}
              onChange={(e) => setQualityGrade(e.target.value as QualityGrade)}
              className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-hidden text-sm font-medium text-stone-800 bg-white"
            >
              <option value="Grade A">Grade A (FAQ - Fair Average Quality)</option>
              <option value="Grade B">Grade B (Marginal Dockage)</option>
              <option value="Grade C">Grade C (High Moisture &gt; 12%)</option>
            </select>
          </div>
        </div>

        {/* Financial Transparency Summary Card */}
        <div className="p-4 rounded-xl bg-stone-50 border border-stone-200/90 space-y-2">
          <div className="flex items-center justify-between text-xs text-stone-600">
            <span>Govt Guaranteed MSP (Minimum Support Price):</span>
            <span className="font-semibold text-stone-900">₹{selectedCrop.mspPerQuintal.toLocaleString('en-IN')} / Qtl</span>
          </div>
          <div className="flex items-center justify-between text-xs text-stone-600">
            <span>Procurement Centre:</span>
            <span className="font-medium text-emerald-800">{selectedCentre.name}</span>
          </div>
          <div className="pt-2 border-t border-stone-200 flex items-center justify-between">
            <span className="text-xs font-bold text-stone-800 uppercase tracking-wide">
              {t.estimatedTotalValue}:
            </span>
            <span className="text-lg font-black text-emerald-700 font-mono">
              ₹{estimatedTotal.toLocaleString('en-IN')}
            </span>
          </div>
          <p className="text-[11px] text-stone-500 flex items-center gap-1 pt-1">
            <Info className="w-3.5 h-3.5 text-stone-400" />
            Final payout is calculated based on automated electronic weighbridge tare and moisture tester.
          </p>
        </div>

        {/* Navigation buttons */}
        <div className="flex items-center justify-between pt-3 border-t border-stone-100">
          <button
            id="produce-back-btn"
            type="button"
            onClick={() => setFarmerStep(4)}
            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl border border-stone-300 text-stone-700 hover:bg-stone-100 font-medium transition-colors text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{t.backBtn}</span>
          </button>

          <button
            id="produce-continue-btn"
            type="submit"
            className="inline-flex items-center gap-2 px-8 py-3 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-semibold shadow-sm hover:shadow-md transition-all text-base"
          >
            <span>Proceed to Slot Booking</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </form>
    </div>
  );
};
