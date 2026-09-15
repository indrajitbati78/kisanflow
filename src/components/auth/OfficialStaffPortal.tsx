import React, { useState } from 'react';
import { 
  Building2, 
  ShieldCheck, 
  Lock, 
  KeyRound, 
  ArrowLeft, 
  CheckCircle2, 
  AlertTriangle, 
  Scale, 
  BarChart3, 
  MapPin, 
  Wheat, 
  Sparkles,
  Eye,
  EyeOff
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface OfficialStaffPortalProps {
  onBackToFarmer: () => void;
}

export const OfficialStaffPortal: React.FC<OfficialStaffPortalProps> = ({ onBackToFarmer }) => {
  const { loginOfficialStaff, centres, language } = useApp();

  const [activeStaffTab, setActiveStaffTab] = useState<'operator' | 'admin'>('operator');

  // Operator fields
  const [operatorId, setOperatorId] = useState('OPR-GUJ-7721');
  const [operatorPin, setOperatorPin] = useState('OPR@7721');
  const [selectedYardId, setSelectedYardId] = useState('centre_ahmedabad_central');
  const [showOperatorPin, setShowOperatorPin] = useState(false);

  // Admin fields
  const [adminId, setAdminId] = useState('ADM-GUJ-9901');
  const [adminKey, setAdminKey] = useState('ADMIN#GUJ2026');
  const [showAdminKey, setShowAdminKey] = useState(false);

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleOperatorSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsLoading(true);

    setTimeout(() => {
      const result = loginOfficialStaff({
        role: 'operator',
        uniqueId: operatorId,
        secretKey: operatorPin,
        centreId: selectedYardId
      });

      if (!result.success) {
        setErrorMessage(result.error || 'Invalid credentials.');
      }
      setIsLoading(false);
    }, 400);
  };

  const handleAdminSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsLoading(true);

    setTimeout(() => {
      const result = loginOfficialStaff({
        role: 'admin',
        uniqueId: adminId,
        secretKey: adminKey
      });

      if (!result.success) {
        setErrorMessage(result.error || 'Invalid credentials.');
      }
      setIsLoading(false);
    }, 400);
  };

  const fillOperatorDemo = () => {
    setOperatorId('OPR-GUJ-7721');
    setOperatorPin('OPR@7721');
    setErrorMessage(null);
  };

  const fillAdminDemo = () => {
    setAdminId('ADM-GUJ-9901');
    setAdminKey('ADMIN#GUJ2026');
    setErrorMessage(null);
  };

  return (
    <div className="min-h-screen flex flex-col justify-center py-8 sm:py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden bg-stone-100/70 text-stone-900">
      
      {/* Top Background Pattern */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-80 bg-gradient-to-b from-amber-100/50 via-stone-100/40 to-transparent blur-2xl pointer-events-none" />

      {/* Top Action Ribbon */}
      <div className="absolute top-4 left-4 sm:top-6 sm:left-8 z-20">
        <button
          type="button"
          onClick={onBackToFarmer}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold text-stone-700 bg-white border border-stone-300 hover:bg-stone-50 shadow-2xs transition-all"
        >
          <ArrowLeft className="w-4 h-4 text-emerald-700" />
          <span>← Back to Farmer Registration (ખેડૂત પોર્ટલ)</span>
        </button>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-xl z-10">
        
        {/* Emblem & Official Header */}
        <div className="text-center space-y-2 mb-6">
          <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-stone-900 text-amber-400 shadow-lg shadow-stone-900/20 ring-4 ring-stone-200 mb-1">
            <Lock className="w-8 h-8" />
          </div>
          
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 border border-amber-300 text-amber-900 text-xs font-bold">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-700" />
            <span>સત્તાવાર સ્ટાફ પોર્ટલ • RESTRICTED ACCESS TERMINAL</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black font-display tracking-tight text-stone-900">
            APMC Mandi Staff & Directorate Console
          </h1>
          
          <p className="text-xs text-stone-600 max-w-md mx-auto">
            Authorized access only for Gujarat APMC Weighbridge Operators and State Agriculture Directorate Officers. Farmers are prohibited from accessing this terminal.
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-3xl border border-stone-300 shadow-xl overflow-hidden">
          
          {/* Official Notice Bar */}
          <div className="bg-stone-900 text-stone-200 px-6 py-2.5 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>SEC-26 GUJARAT APMC ACT, 1963</span>
            </div>
            <span className="text-[11px] text-stone-400">Govt Network Active</span>
          </div>

          {/* Role Tabs */}
          <div className="p-3 bg-stone-100/80 border-b border-stone-200">
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  setActiveStaffTab('operator');
                  setErrorMessage(null);
                }}
                className={`py-3 px-3 rounded-2xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 border transition-all ${
                  activeStaffTab === 'operator'
                    ? 'bg-white text-amber-950 border-amber-400 shadow-sm ring-1 ring-amber-400/30'
                    : 'bg-transparent text-stone-600 border-transparent hover:bg-white/60'
                }`}
              >
                <Building2 className={`w-4 h-4 ${activeStaffTab === 'operator' ? 'text-amber-600' : 'text-stone-400'}`} />
                <span>Mandi Yard Operator (ઓપરેટર)</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveStaffTab('admin');
                  setErrorMessage(null);
                }}
                className={`py-3 px-3 rounded-2xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 border transition-all ${
                  activeStaffTab === 'admin'
                    ? 'bg-white text-teal-950 border-teal-500 shadow-sm ring-1 ring-teal-500/30'
                    : 'bg-transparent text-stone-600 border-transparent hover:bg-white/60'
                }`}
              >
                <BarChart3 className={`w-4 h-4 ${activeStaffTab === 'admin' ? 'text-teal-600' : 'text-stone-400'}`} />
                <span>Directorate Admin (એડમિન)</span>
              </button>
            </div>
          </div>

          {/* Error Banner */}
          {errorMessage && (
            <div className="mx-6 mt-6 p-4 rounded-2xl bg-red-50 border border-red-300 text-red-900 text-xs flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-red-950 mb-0.5">Authorization Failed</p>
                <p className="text-red-800 leading-relaxed">{errorMessage}</p>
                <p className="text-[11px] text-red-700 mt-1 font-medium">
                  Note: Farmers must use the Farmer Portal to book slots. This terminal is strictly for verified mandi staff.
                </p>
              </div>
            </div>
          )}

          <div className="p-6 sm:p-8 space-y-6">
            
            {/* TAB 1: OPERATOR LOGIN */}
            {activeStaffTab === 'operator' && (
              <form onSubmit={handleOperatorSubmit} className="space-y-4">
                
                <div className="p-3 bg-amber-50/60 rounded-2xl border border-amber-200/80 text-xs text-amber-950 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Scale className="w-4 h-4 text-amber-700 shrink-0" />
                    <span>APMC Inward Weighbridge & Physical Inspection Terminal</span>
                  </div>
                  <button
                    type="button"
                    onClick={fillOperatorDemo}
                    className="px-2.5 py-1 rounded-lg bg-white border border-amber-300 text-[11px] font-bold text-amber-900 hover:bg-amber-100 transition-colors"
                  >
                    Use Demo ID
                  </button>
                </div>

                {/* Operator Unique Service ID */}
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Operator Unique Service ID (સ્ટાફ સર્વિસ નંબર) *
                  </label>
                  <div className="relative">
                    <Building2 className="w-4 h-4 text-stone-400 absolute left-3 top-3.5" />
                    <input
                      type="text"
                      id="operator-service-id"
                      required
                      value={operatorId}
                      onChange={(e) => setOperatorId(e.target.value)}
                      placeholder="e.g. OPR-GUJ-7721"
                      className="w-full pl-9 pr-3 py-2.5 text-xs sm:text-sm font-mono uppercase bg-stone-50 border border-stone-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:bg-white text-stone-900 font-bold"
                    />
                  </div>
                  <p className="text-[11px] text-stone-500 mt-1">
                    Issued exclusively to certified APMC Weighbridge Officers (e.g. <span className="font-mono font-bold text-stone-700">OPR-GUJ-7721</span>)
                  </p>
                </div>

                {/* Assigned Mandi Yard */}
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Assigned APMC Mandi Yard (માર્કેટ યાર્ડ પસંદ કરો) *
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-stone-400 absolute left-3 top-3.5" />
                    <select
                      id="operator-yard-select"
                      value={selectedYardId}
                      onChange={(e) => setSelectedYardId(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 text-xs sm:text-sm bg-stone-50 border border-stone-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:bg-white text-stone-900 font-semibold"
                    >
                      {centres.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name} ({c.district})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Terminal PIN */}
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Official Security Passcode / Terminal PIN *
                  </label>
                  <div className="relative">
                    <KeyRound className="w-4 h-4 text-stone-400 absolute left-3 top-3.5" />
                    <input
                      type={showOperatorPin ? 'text' : 'password'}
                      id="operator-pin-input"
                      required
                      value={operatorPin}
                      onChange={(e) => setOperatorPin(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-9 pr-10 py-2.5 text-xs sm:text-sm bg-stone-50 border border-stone-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:bg-white text-stone-900 font-medium"
                    />
                    <button
                      type="button"
                      onClick={() => setShowOperatorPin(!showOperatorPin)}
                      className="absolute right-3 top-3.5 text-stone-500 hover:text-stone-700"
                    >
                      {showOperatorPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  <p className="text-[11px] text-stone-500 mt-1">
                    Demo security PIN: <span className="font-mono font-bold text-stone-700">OPR@7721</span>
                  </p>
                </div>

                {/* Submit Operator */}
                <button
                  type="submit"
                  id="operator-submit-btn"
                  disabled={isLoading}
                  className="w-full mt-2 inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-amber-700 hover:bg-amber-800 text-white rounded-2xl font-bold shadow-md hover:shadow-lg transition-all text-sm active:scale-98"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <ShieldCheck className="w-4 h-4" />
                      <span>Verify & Access APMC Operator Terminal</span>
                    </>
                  )}
                </button>
              </form>
            )}

            {/* TAB 2: ADMIN LOGIN */}
            {activeStaffTab === 'admin' && (
              <form onSubmit={handleAdminSubmit} className="space-y-4">
                
                <div className="p-3 bg-teal-50/60 rounded-2xl border border-teal-200/80 text-xs text-teal-950 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-teal-700 shrink-0" />
                    <span>Gujarat Directorate e-Procurement Master Console</span>
                  </div>
                  <button
                    type="button"
                    onClick={fillAdminDemo}
                    className="px-2.5 py-1 rounded-lg bg-white border border-teal-300 text-[11px] font-bold text-teal-900 hover:bg-teal-100 transition-colors"
                  >
                    Use Demo ID
                  </button>
                </div>

                {/* Directorate Master ID */}
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Directorate Master ID (રાજ્ય વહીવટી ID) *
                  </label>
                  <div className="relative">
                    <ShieldCheck className="w-4 h-4 text-stone-400 absolute left-3 top-3.5" />
                    <input
                      type="text"
                      id="admin-master-id"
                      required
                      value={adminId}
                      onChange={(e) => setAdminId(e.target.value)}
                      placeholder="e.g. ADM-GUJ-9901"
                      className="w-full pl-9 pr-3 py-2.5 text-xs sm:text-sm font-mono uppercase bg-stone-50 border border-stone-300 rounded-xl focus:ring-2 focus:ring-teal-600 focus:bg-white text-stone-900 font-bold"
                    />
                  </div>
                  <p className="text-[11px] text-stone-500 mt-1">
                    Restricted to Directorate of Agriculture, Gandhinagar (<span className="font-mono font-bold text-stone-700">ADM-GUJ-9901</span>)
                  </p>
                </div>

                {/* Directorate Passkey */}
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Government Master Security Passkey *
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-3.5" />
                    <input
                      type={showAdminKey ? 'text' : 'password'}
                      id="admin-passkey-input"
                      required
                      value={adminKey}
                      onChange={(e) => setAdminKey(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-9 pr-10 py-2.5 text-xs sm:text-sm bg-stone-50 border border-stone-300 rounded-xl focus:ring-2 focus:ring-teal-600 focus:bg-white text-stone-900 font-medium"
                    />
                    <button
                      type="button"
                      onClick={() => setShowAdminKey(!showAdminKey)}
                      className="absolute right-3 top-3.5 text-stone-500 hover:text-stone-700"
                    >
                      {showAdminKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  <p className="text-[11px] text-stone-500 mt-1">
                    Demo security passkey: <span className="font-mono font-bold text-stone-700">ADMIN#GUJ2026</span>
                  </p>
                </div>

                {/* Submit Admin */}
                <button
                  type="submit"
                  id="admin-submit-btn"
                  disabled={isLoading}
                  className="w-full mt-2 inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-teal-800 hover:bg-teal-900 text-white rounded-2xl font-bold shadow-md hover:shadow-lg transition-all text-sm active:scale-98"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <Lock className="w-4 h-4" />
                      <span>Authorize & Unlock Directorate Console</span>
                    </>
                  )}
                </button>
              </form>
            )}

            {/* Quick credentials reference for testing */}
            <div className="pt-4 border-t border-stone-200">
              <div className="bg-stone-50 rounded-2xl p-3 border border-stone-200 space-y-1.5 text-xs text-stone-600">
                <div className="flex items-center gap-1.5 font-bold text-stone-800">
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                  <span>Authorized Staff Credentials (Secret)</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                  <div className="p-2 bg-white rounded-xl border border-stone-200">
                    <span className="font-bold text-amber-900 block">Operator ID:</span>
                    <span className="font-mono">OPR-GUJ-7721</span> | PIN: <span className="font-mono">OPR@7721</span>
                  </div>
                  <div className="p-2 bg-white rounded-xl border border-stone-200">
                    <span className="font-bold text-teal-900 block">Admin ID:</span>
                    <span className="font-mono">ADM-GUJ-9901</span> | Key: <span className="font-mono">ADMIN#GUJ2026</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Return Button */}
        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={onBackToFarmer}
            className="text-xs font-semibold text-stone-600 hover:text-stone-900 underline"
          >
            ← Not an APMC official? Go to Farmer Registration & Sign In
          </button>
        </div>

      </div>
    </div>
  );
};
