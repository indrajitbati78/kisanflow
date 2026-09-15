import React, { useState } from 'react';
import { 
  User, 
  X, 
  Edit3, 
  Save, 
  ShieldCheck, 
  Phone, 
  Mail, 
  MapPin, 
  Building2, 
  CreditCard, 
  Wheat, 
  CheckCircle2, 
  Sparkles, 
  Info,
  Scale,
  Award
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { FarmerProfile } from '../../types';

export const AboutProfileModal: React.FC = () => {
  const { 
    isAboutProfileOpen, 
    setIsAboutProfileOpen, 
    farmerProfile, 
    setFarmerProfile,
    selectedDistrict,
    centres,
    selectedCentreId
  } = useApp();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<FarmerProfile>({ ...farmerProfile });
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isAboutProfileOpen) return null;

  const currentCentre = centres.find(c => c.id === selectedCentreId) || centres[0];

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setFarmerProfile(formData);
    setIsEditing(false);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleCancel = () => {
    setFormData({ ...farmerProfile });
    setIsEditing(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full border border-stone-200 shadow-2xl overflow-hidden my-8">
        
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-emerald-800 via-emerald-700 to-teal-800 text-white p-6 relative">
          <button
            type="button"
            onClick={() => setIsAboutProfileOpen(false)}
            className="absolute right-4 top-4 w-9 h-9 rounded-full bg-black/20 hover:bg-black/40 text-white flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center border border-white/20 text-white font-black text-2xl font-display">
              {farmerProfile.fullName.charAt(0) || 'R'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold uppercase tracking-widest text-emerald-200">
                  Farmer Profile & Mandi Record
                </span>
                <span className="text-[10px] bg-emerald-500/80 px-2 py-0.5 rounded-full font-mono font-bold">
                  ID: {farmerProfile.id}
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold font-display">
                {farmerProfile.fullName}
              </h2>
              <p className="text-xs text-emerald-100 flex items-center gap-1 mt-0.5">
                <MapPin className="w-3.5 h-3.5" />
                <span>{farmerProfile.village}, {farmerProfile.district}, Gujarat</span>
              </p>
            </div>
          </div>
        </div>

        {/* Tab / Actions Bar */}
        <div className="px-6 py-3 bg-stone-50 border-b border-stone-200 flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-stone-600 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Kisan Aadhaar & Land Record Profile</span>
          </span>

          {!isEditing ? (
            <button
              type="button"
              id="edit-profile-btn"
              onClick={() => {
                setFormData({ ...farmerProfile });
                setIsEditing(true);
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-2xs transition-all"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit Profile</span>
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleCancel}
                className="px-3 py-1.5 rounded-xl border border-stone-300 text-stone-700 text-xs font-bold hover:bg-stone-100"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-2xs"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Changes</span>
              </button>
            </div>
          )}
        </div>

        {savedSuccess && (
          <div className="m-4 p-3 rounded-xl bg-emerald-50 border border-emerald-300 text-xs font-bold text-emerald-900 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Profile information updated successfully!</span>
          </div>
        )}

        <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto">
          
          {/* Editable Form / Display Grid */}
          <form onSubmit={handleSave} className="space-y-4">
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Full Name */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-500 mb-1">
                  Full Farmer Name
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-white text-stone-900 text-xs font-bold focus:border-emerald-500"
                  />
                ) : (
                  <div className="text-sm font-bold text-stone-900">
                    {farmerProfile.fullName}
                  </div>
                )}
              </div>

              {/* Mobile */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-500 mb-1">
                  Mobile Number (SMS Alerts)
                </label>
                {isEditing ? (
                  <input
                    type="tel"
                    required
                    value={formData.mobileNumber}
                    onChange={(e) => setFormData({ ...formData, mobileNumber: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-white text-stone-900 text-xs font-bold focus:border-emerald-500"
                  />
                ) : (
                  <div className="text-sm font-bold text-stone-900 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{farmerProfile.mobileNumber}</span>
                  </div>
                )}
              </div>

              {/* Village & Taluka */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-500 mb-1">
                  Village & Taluka
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    required
                    value={formData.village}
                    onChange={(e) => setFormData({ ...formData, village: e.target.value, taluka: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-white text-stone-900 text-xs font-bold focus:border-emerald-500"
                  />
                ) : (
                  <div className="text-sm font-bold text-stone-900">
                    {farmerProfile.village}, {farmerProfile.taluka}
                  </div>
                )}
              </div>

              {/* Land Holding */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-500 mb-1">
                  Cultivable Land Holding (Acres)
                </label>
                {isEditing ? (
                  <input
                    type="number"
                    step="0.5"
                    required
                    value={formData.landAreaAcres}
                    onChange={(e) => setFormData({ ...formData, landAreaAcres: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-white text-stone-900 text-xs font-bold focus:border-emerald-500"
                  />
                ) : (
                  <div className="text-sm font-bold text-emerald-700">
                    {farmerProfile.landAreaAcres} Acres (Registered in 7/12 e-Dhara)
                  </div>
                )}
              </div>

              {/* Gujarat District */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-500 mb-1">
                  Jurisdiction District
                </label>
                <div className="text-sm font-bold text-stone-800">
                  {selectedDistrict}, Gujarat
                </div>
              </div>

              {/* Aadhaar Linkage */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-500 mb-1">
                  Aadhaar Seeded Status
                </label>
                <div className="text-sm font-semibold text-stone-700 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>{farmerProfile.aadhaarNumber || 'XXXX-XXXX-8921'} (DBT PFMS Linked)</span>
                </div>
              </div>

              {/* Bank Account */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-500 mb-1">
                  Direct Benefit Transfer (DBT) Bank
                </label>
                <div className="text-sm font-semibold text-stone-700 flex items-center gap-1.5">
                  <CreditCard className="w-4 h-4 text-emerald-600" />
                  <span>{farmerProfile.bankName} • Acc ending {farmerProfile.bankAccountEnding}</span>
                </div>
              </div>

              {/* KCC Number */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-500 mb-1">
                  Kisan Credit Card (KCC)
                </label>
                <div className="text-xs font-mono font-bold text-stone-800 bg-stone-100 p-2 rounded-xl border border-stone-200">
                  {farmerProfile.kccNumber}
                </div>
              </div>

            </div>

          </form>

          {/* About KisanFlow Section */}
          <div className="pt-4 border-t border-stone-200 space-y-3">
            <div className="flex items-center gap-2 text-stone-900 font-bold text-sm">
              <Info className="w-4 h-4 text-emerald-700" />
              <span>About KisanFlow Gujarat e-Procurement</span>
            </div>
            
            <p className="text-xs text-stone-600 leading-relaxed">
              <strong>KisanFlow</strong> is Gujarat&apos;s digital agricultural procurement platform deployed across APMC market yards to eliminate highway traffic congestion, physical standing queues, and manual tally delays.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                <Scale className="w-4 h-4 text-emerald-700 mb-1" />
                <h4 className="text-xs font-bold text-stone-900">Zero Wait Weighing</h4>
                <p className="text-[11px] text-stone-500">Automated axle load sensors and tare subtraction.</p>
              </div>

              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                <Award className="w-4 h-4 text-amber-700 mb-1" />
                <h4 className="text-xs font-bold text-stone-900">Fair MSP Guarantee</h4>
                <p className="text-[11px] text-stone-500">Official Minimum Support Price for Gujarat crops.</p>
              </div>

              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                <CreditCard className="w-4 h-4 text-teal-700 mb-1" />
                <h4 className="text-xs font-bold text-stone-900">Direct Bank Transfer</h4>
                <p className="text-[11px] text-stone-500">Fast PFMS settlement directly to farmer accounts.</p>
              </div>
            </div>

            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-900 flex items-center justify-between">
              <div>
                <strong>Gujarat Kisan Helpline:</strong> 1800-180-1551 (Toll-Free, 24x7)
              </div>
              <span className="text-[10px] font-bold bg-white px-2 py-0.5 rounded border border-emerald-300">
                APMC v3.4
              </span>
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-stone-50 border-t border-stone-200 flex justify-end">
          <button
            type="button"
            onClick={() => setIsAboutProfileOpen(false)}
            className="px-6 py-2.5 bg-stone-800 hover:bg-stone-900 text-white rounded-xl text-xs font-bold transition-colors"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
