import React from 'react';
import { 
  User, 
  Building2, 
  BarChart3, 
  Sparkles,
  HelpCircle,
  LogOut,
  ShieldCheck,
  Wheat,
  Bell
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Language } from '../types';
import { NotificationModal } from './NotificationModal';

export const Header: React.FC = () => {
  const { 
    language, 
    setLanguage, 
    currentRole, 
    unreadNotificationCount, 
    logout,
    setIsAboutProfileOpen,
    setIsQueryOpen,
    isNotificationOpen,
    setIsNotificationOpen,
    farmerProfile,
    staffOfficerId,
    centres,
    selectedCentreId,
    setSelectedCentreId
  } = useApp();

  const currentCentre = centres.find(c => c.id === selectedCentreId) || centres[0];

  const languages: { code: Language; label: string; sub: string }[] = [
    { code: 'gu', label: 'ગુજરાતી', sub: 'GU' },
    { code: 'en', label: 'English', sub: 'EN' },
    { code: 'hi', label: 'हिन्दी', sub: 'HI' }
  ];

  return (
    <>
      <header id="app-header" className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200 shadow-2xs">
        
        {/* Top Announcement Ribbon */}
        <div className={`px-4 py-1 text-center text-xs font-medium tracking-wide flex items-center justify-between ${
          currentRole === 'operator' 
            ? 'bg-amber-950 text-amber-100' 
            : currentRole === 'admin' 
            ? 'bg-stone-900 text-stone-100' 
            : 'bg-emerald-900 text-emerald-100'
        }`}>
          <div className="hidden sm:flex items-center gap-1.5 text-[11px]">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-300" />
            <span>
              {currentRole === 'operator'
                ? 'APMC Yard Weighbridge & Inspection Terminal (સત્તાવાર સ્ટાફ)'
                : currentRole === 'admin'
                ? 'Gujarat State Agricultural Marketing Board • State Directorate Console'
                : 'Govt of Gujarat • APMC e-Procurement Portal'}
            </span>
          </div>

          <div className="flex items-center justify-center gap-2 mx-auto sm:mx-0">
            <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse shrink-0" />
            <span className="truncate font-semibold text-[11px] sm:text-xs">
              {currentRole === 'operator'
                ? `Terminal Active • Yard: ${currentCentre.name} • Scale Accuracy Verified`
                : currentRole === 'admin'
                ? 'State Mandi Grid Live: 24 Districts Connected • MSP Direct Benefit Transfer'
                : 'MSP Procurement Active: Wheat ₹2,425/Qtl • Cotton ₹7,121/Qtl • Helpline: 1800-180-1551'}
            </span>
          </div>

          <div className="hidden md:flex items-center gap-2 text-[11px]">
            {currentRole === 'farmer' ? (
              <span>Beneficiary: <strong>{farmerProfile.fullName.split(' ')[0]}</strong></span>
            ) : currentRole === 'operator' ? (
              <span>Operator ID: <strong className="font-mono">{staffOfficerId || 'OPR-GUJ-7721'}</strong></span>
            ) : (
              <span>Directorate ID: <strong className="font-mono">{staffOfficerId || 'ADM-GUJ-9901'}</strong></span>
            )}
          </div>
        </div>

        {/* Main Nav Bar */}
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-2.5 flex items-center justify-between gap-2 sm:gap-4">
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-2.5 shrink-0">
            <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl text-white flex items-center justify-center shadow-md ${
              currentRole === 'operator' 
                ? 'bg-gradient-to-br from-amber-600 to-amber-800 shadow-amber-700/20' 
                : currentRole === 'admin' 
                ? 'bg-gradient-to-br from-teal-700 to-stone-900 shadow-stone-800/20' 
                : 'bg-gradient-to-br from-emerald-600 to-teal-700 shadow-emerald-700/20'
            }`}>
              {currentRole === 'operator' ? (
                <Building2 className="w-5 h-5 sm:w-6 sm:h-6" />
              ) : currentRole === 'admin' ? (
                <BarChart3 className="w-5 h-5 sm:w-6 sm:h-6" />
              ) : (
                <Wheat className="w-5 h-5 sm:w-6 sm:h-6" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-lg sm:text-xl font-black tracking-tight text-stone-900 font-display">
                  Kisan<span className="text-emerald-700">Flow</span>
                </span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold uppercase tracking-wider hidden sm:inline-block ${
                  currentRole === 'operator'
                    ? 'bg-amber-100 text-amber-900'
                    : currentRole === 'admin'
                    ? 'bg-teal-100 text-teal-900'
                    : 'bg-emerald-100 text-emerald-800'
                }`}>
                  {currentRole === 'operator' ? 'Mandi Staff' : currentRole === 'admin' ? 'Admin Console' : 'Gujarat'}
                </span>
              </div>
              <p className="text-[11px] text-stone-500 hidden lg:block">
                {currentRole === 'operator'
                  ? 'APMC Weighbridge & Inward Inspection Desk'
                  : currentRole === 'admin'
                  ? 'Central Directorate Monitoring System'
                  : 'Digital APMC Mandi Procurement'}
              </p>
            </div>
          </div>

          {/* Center Identity Section (Zero Role Switchers for Farmer!) */}
          <div className="flex items-center">
            {currentRole === 'farmer' && (
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-stone-100 border border-stone-200 rounded-2xl text-xs text-stone-800 font-medium">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>ખેડૂત રજિસ્ટર્ડ: <strong>{farmerProfile.fullName}</strong></span>
                <span className="text-stone-300">•</span>
                <span className="text-stone-500">{farmerProfile.district}</span>
              </div>
            )}

            {currentRole === 'operator' && (
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 border border-amber-200 rounded-2xl text-xs text-amber-950 font-semibold">
                  <Building2 className="w-4 h-4 text-amber-700" />
                  <span>યાર્ડ ઓપરેટર: <strong className="font-mono">{staffOfficerId || 'OPR-GUJ-7721'}</strong></span>
                </div>
                {/* Yard selector for Operator */}
                <select
                  value={selectedCentreId}
                  onChange={(e) => setSelectedCentreId(e.target.value)}
                  className="hidden md:block text-xs bg-white border border-stone-300 rounded-xl px-2.5 py-1.5 font-medium text-stone-800 focus:ring-2 focus:ring-amber-500"
                >
                  {centres.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
            )}

            {currentRole === 'admin' && (
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-teal-50 border border-teal-200 rounded-2xl text-xs text-teal-950 font-semibold">
                  <BarChart3 className="w-4 h-4 text-teal-700" />
                  <span>રાજ્ય કૃષિ નિયામક: <strong className="font-mono">{staffOfficerId || 'ADM-GUJ-9901'}</strong></span>
                </div>
              </div>
            )}
          </div>

          {/* Right Action Controls */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            
            {/* Farmer-Only Controls: Profile & Helpdesk */}
            {currentRole === 'farmer' && (
              <>
                <button
                  id="header-profile-btn"
                  type="button"
                  onClick={() => setIsAboutProfileOpen(true)}
                  className="px-2.5 sm:px-3 py-1.5 rounded-xl border border-stone-200 hover:bg-stone-100 text-stone-700 text-xs font-bold flex items-center gap-1.5 transition-colors bg-white shadow-2xs"
                  title="View & Edit Farmer Profile"
                >
                  <User className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="hidden md:inline">Profile (પ્રોફાઇલ)</span>
                </button>

                <button
                  id="header-query-btn"
                  type="button"
                  onClick={() => setIsQueryOpen(true)}
                  className="px-2.5 sm:px-3 py-1.5 rounded-xl border border-stone-200 hover:bg-stone-100 text-stone-700 text-xs font-bold flex items-center gap-1.5 transition-colors bg-white shadow-2xs"
                  title="Ask Query or Grievance"
                >
                  <HelpCircle className="w-3.5 h-3.5 text-amber-600" />
                  <span className="hidden md:inline">Helpdesk (મદદ)</span>
                </button>
              </>
            )}

            {/* Language Switcher */}
            <div className="flex items-center bg-stone-100 rounded-xl p-0.5 border border-stone-200">
              {languages.map(lang => (
                <button
                  key={lang.code}
                  id={`lang-btn-${lang.code}`}
                  type="button"
                  onClick={() => setLanguage(lang.code)}
                  className={`px-1.5 sm:px-2 py-1 text-xs rounded-lg font-bold transition-all ${
                    language === lang.code
                      ? 'bg-white text-emerald-700 shadow-2xs'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                  title={lang.label}
                >
                  <span>{lang.sub}</span>
                </button>
              ))}
            </div>

            {/* Notification Bell */}
            <button
              id="header-notification-btn"
              type="button"
              onClick={() => setIsNotificationOpen(true)}
              className="relative p-2 rounded-xl text-stone-600 hover:text-stone-900 hover:bg-stone-100 border border-stone-200 transition-colors bg-white shadow-2xs"
              title="Mandi Alerts"
            >
              <Bell className="w-4 h-4" />
              {unreadNotificationCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-[10px] font-bold text-white ring-2 ring-white">
                  {unreadNotificationCount}
                </span>
              )}
            </button>

            {/* Logout Button */}
            <button
              id="header-logout-btn"
              type="button"
              onClick={logout}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 border transition-all shadow-2xs ${
                currentRole === 'operator' || currentRole === 'admin'
                  ? 'border-red-300 bg-red-50 text-red-700 hover:bg-red-100'
                  : 'border-stone-200 text-stone-600 hover:text-red-600 hover:bg-red-50 bg-white'
              }`}
              title={currentRole === 'farmer' ? 'Logout' : 'Exit Official Portal'}
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">
                {currentRole === 'farmer' ? 'લૉગઆઉટ' : 'Exit Portal'}
              </span>
            </button>

          </div>
        </div>
      </header>

      {/* Notifications Drawer */}
      <NotificationModal 
        isOpen={isNotificationOpen} 
        onClose={() => setIsNotificationOpen(false)} 
      />
    </>
  );
};
