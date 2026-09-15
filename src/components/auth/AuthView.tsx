import React, { useState } from 'react';
import { 
  Wheat, 
  Lock, 
  User, 
  ArrowRight, 
  ShieldCheck, 
  Building2, 
  Phone, 
  Sparkles, 
  CheckCircle2, 
  Languages, 
  Eye, 
  EyeOff,
  Scale,
  MapPin,
  Check,
  Mail,
  AlertCircle,
  KeyRound,
  LogOut,
  RefreshCw,
  FileText,
  Copy,
  ExternalLink
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Language } from '../../types';
import { GUJARAT_DISTRICTS } from '../../data/mockData';
import { OfficialStaffPortal } from './OfficialStaffPortal';

export const AuthView: React.FC = () => {
  const { 
    language, 
    setLanguage, 
    firebaseUser, 
    isFirebaseLoading, 
    firebaseAuthError, 
    clearAuthError, 
    signUpWithFirebase, 
    signInWithFirebase, 
    signInWithGoogle, 
    resetFirebasePassword, 
    hasPendingRegistration, 
    setHasPendingRegistration, 
    completeFarmerRegistration,
    login,
    centres,
    selectedCentreId,
    logout
  } = useApp();
  
  // Separate official portal toggle
  const [showStaffPortal, setShowStaffPortal] = useState(false);

  // Authentication Tab: 'signin' | 'signup'
  const [authTab, setAuthTab] = useState<'signin' | 'signup'>('signin');

  // Sign In Form State
  const [signInEmail, setSignInEmail] = useState('ramesh.patel@kisanflow.gujarat.gov.in');
  const [signInPassword, setSignInPassword] = useState('kisan123');
  const [showSignInPassword, setShowSignInPassword] = useState(false);

  // Sign Up Form State
  const [signUpName, setSignUpName] = useState('Indrajit Bati');
  const [signUpEmail, setSignUpEmail] = useState('indrajit.bati@kisanflow.gov.in');
  const [signUpPassword, setSignUpPassword] = useState('kisan123');
  const [signUpConfirmPassword, setSignUpConfirmPassword] = useState('kisan123');
  const [showSignUpPassword, setShowSignUpPassword] = useState(false);

  // Forgot Password State
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [resetSuccessMessage, setResetSuccessMessage] = useState<string | null>(null);

  // Local Loading & Feedback
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const [copiedDomain, setCopiedDomain] = useState(false);

  const currentHostname = typeof window !== 'undefined' ? window.location.hostname : '';

  const copyCurrentDomain = () => {
    if (currentHostname && navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(currentHostname);
      setCopiedDomain(true);
      setTimeout(() => setCopiedDomain(false), 3000);
    }
  };

  // Step 2: Farmer Registration Form State
  const [regFullName, setRegFullName] = useState(firebaseUser?.displayName || 'Indrajit Bati');
  const [regMobile, setRegMobile] = useState('98250 14820');
  const [regDistrict, setRegDistrict] = useState('Ahmedabad');
  const [regVillage, setRegVillage] = useState('Sanand Rural');
  const [regTaluka, setRegTaluka] = useState('Sanand');
  const [regLandArea, setRegLandArea] = useState('5.0');
  const [regBankName, setRegBankName] = useState('State Bank of India');
  const [regAccountEnding, setRegAccountEnding] = useState('9182');
  const [regPreferredCentre, setRegPreferredCentre] = useState(selectedCentreId || 'centre_ahmedabad_central');

  // If Official Mandi Staff / Admin portal is requested
  if (showStaffPortal) {
    return <OfficialStaffPortal onBackToFarmer={() => setShowStaffPortal(false)} />;
  }

  // Handle Firebase Sign In Submit
  const handleSignInSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearAuthError();
    setLocalError(null);
    setIsSubmitting(true);

    const email = signInEmail.trim();
    const password = signInPassword.trim();

    if (!email || !password) {
      setLocalError('Please enter both email and password.');
      setIsSubmitting(false);
      return;
    }

    const res = await signInWithFirebase(email, password);
    setIsSubmitting(false);

    if (!res.success && res.error) {
      // If user is testing with mock username or email/password not enabled yet in Firebase console
      if (res.error.includes('not yet enabled') || res.error.includes('No registered account')) {
        setLocalError(res.error);
      }
    }
  };

  // Handle Firebase Sign Up Submit
  const handleSignUpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearAuthError();
    setLocalError(null);

    const name = signUpName.trim();
    const email = signUpEmail.trim();
    const password = signUpPassword.trim();
    const confirmPassword = signUpConfirmPassword.trim();

    if (!name) {
      setLocalError('Please enter your full name.');
      return;
    }
    if (!email) {
      setLocalError('Please enter a valid email address.');
      return;
    }
    if (password.length < 6) {
      setLocalError('Password must be at least 6 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setLocalError('Passwords do not match. Please recheck.');
      return;
    }

    setIsSubmitting(true);
    const res = await signUpWithFirebase(email, password, name);
    setIsSubmitting(false);

    if (res.success) {
      setRegFullName(name);
    }
  };

  // Handle Google Sign In / Sign Up
  const handleGoogleAuth = async () => {
    clearAuthError();
    setLocalError(null);
    setIsSubmitting(true);
    await signInWithGoogle();
    setIsSubmitting(false);
  };

  // Handle Forgot Password Submit
  const handleForgotPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    setResetSuccessMessage(null);
    if (!forgotEmail.trim()) {
      setLocalError('Please enter your registered email address.');
      return;
    }

    setIsSubmitting(true);
    const res = await resetFirebasePassword(forgotEmail.trim());
    setIsSubmitting(false);

    if (res.success) {
      setResetSuccessMessage(`Password reset link has been dispatched to ${forgotEmail}. Please check your inbox.`);
    }
  };

  // Handle Step 2: Farmer Registration Submit
  const handleCompleteRegistrationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    setIsSubmitting(true);

    const landNum = parseFloat(regLandArea) || 5.0;

    await completeFarmerRegistration({
      fullName: regFullName.trim() || 'Indrajit Bati',
      mobileNumber: regMobile.trim() || '98250 14820',
      district: regDistrict,
      taluka: regTaluka.trim() || 'Sanand',
      village: regVillage.trim() || 'Sanand Rural',
      landAreaAcres: landNum,
      bankName: regBankName,
      bankAccountEnding: regAccountEnding,
      preferredCentreId: regPreferredCentre,
      email: firebaseUser?.email || signUpEmail
    });

    setIsSubmitting(false);
  };

  // Quick fill helper for testing
  const fillDemoAccount = (role: 'registered_patel' | 'new_bati') => {
    clearAuthError();
    setLocalError(null);
    if (role === 'registered_patel') {
      setAuthTab('signin');
      setSignInEmail('ramesh.patel@kisanflow.gujarat.gov.in');
      setSignInPassword('kisan123');
    } else {
      setAuthTab('signup');
      setSignUpName('Indrajit Bati');
      setSignUpEmail(`indrajit.${Math.floor(100 + Math.random() * 900)}@kisanflow.gov.in`);
      setSignUpPassword('kisan123');
      setSignUpConfirmPassword('kisan123');
    }
  };

  // Calculate live MSP quota
  const calculatedQuotaQuintals = ((parseFloat(regLandArea) || 0) * 25).toFixed(1);

  // Active error to display
  const activeError = localError || firebaseAuthError;

  return (
    <div className="min-h-screen flex flex-col justify-center py-6 sm:py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden bg-stone-50 text-stone-900">
      
      {/* Agrarian ambient backdrop */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-72 bg-gradient-to-b from-emerald-100/60 via-amber-50/40 to-transparent blur-2xl pointer-events-none" />

      {/* Top Header Controls: Language switcher & Helpline */}
      <div className="absolute top-4 right-4 sm:top-6 sm:right-8 flex items-center gap-2 sm:gap-3 z-20">
        <div className="hidden sm:flex items-center gap-1.5 text-xs text-stone-600 bg-white/90 border border-stone-200 px-2.5 py-1.5 rounded-xl shadow-2xs">
          <Phone className="w-3.5 h-3.5 text-emerald-700" />
          <span>Help: 1800-180-1551</span>
        </div>

        {/* Language switcher */}
        <div className="flex items-center bg-white rounded-xl p-1 border border-stone-200 shadow-xs">
          {(['gu', 'en', 'hi'] as Language[]).map((lang) => (
            <button
              key={lang}
              type="button"
              id={`auth-lang-${lang}`}
              onClick={() => setLanguage(lang)}
              className={`px-2 sm:px-2.5 py-1 text-xs font-bold rounded-lg transition-all ${
                language === lang
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              {lang === 'gu' ? 'ગુજરાતી' : lang === 'hi' ? 'हिन्दी' : 'English'}
            </button>
          ))}
        </div>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-lg z-10">
        
        {/* Brand & Emblem Header */}
        <div className="text-center space-y-2 mb-5">
          <div className="inline-flex items-center justify-center p-3.5 rounded-2xl bg-emerald-700 text-white shadow-md shadow-emerald-700/20 ring-4 ring-emerald-100 mb-1">
            <Wheat className="w-8 h-8" />
          </div>
          
          <h1 className="text-3xl sm:text-4xl font-black font-display tracking-tight text-stone-900">
            Kisan<span className="text-emerald-700">Flow</span>
          </h1>
          
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Gujarat APMC Smart e-Procurement Portal</span>
          </div>

          {/* Firebase Connection Live Badge */}
          <div className="flex items-center justify-center gap-1.5 text-[11px] text-stone-500 font-medium">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Firebase Connected:</span>
            <code className="px-1.5 py-0.5 bg-stone-200/80 rounded font-mono text-[10px] text-stone-700 font-bold">
              kisanflow-4a75e
            </code>
          </div>
        </div>

        {/* MAIN CONTAINER */}
        <div className="bg-white rounded-3xl border border-stone-200 shadow-xl overflow-hidden">
          
          {/* ========================================================================= */}
          {/* SCENARIO A: STEP 2 - COMPLETE FARMER REGISTRATION (AFTER SIGN IN / SIGN UP) */}
          {/* ========================================================================= */}
          {hasPendingRegistration ? (
            <div>
              {/* Step 2 Header Banner */}
              <div className="bg-emerald-800 text-white p-5 sm:p-6 border-b border-emerald-900/40">
                <div className="flex items-center justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-200">
                    <span className="px-2 py-0.5 bg-emerald-700 rounded-md">Step 2 of 2</span>
                    <span>{language === 'gu' ? 'ખેડૂત નોંધણી & જમીન વિગત' : 'Farmer APMC Registration'}</span>
                  </div>

                  <button
                    type="button"
                    onClick={logout}
                    className="text-emerald-200 hover:text-white text-xs flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-emerald-700/60 transition-colors"
                    title="Sign Out"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>{language === 'gu' ? 'બહાર નીકળો' : 'Sign Out'}</span>
                  </button>
                </div>

                <h2 className="text-xl sm:text-2xl font-black font-display tracking-tight text-white">
                  {language === 'gu' ? 'ખેડૂત નોંધણી વિગતો પૂર્ણ કરો' : 'Complete Farmer Profile & Land Records'}
                </h2>
                
                <p className="text-xs text-emerald-100 mt-1">
                  {language === 'gu'
                    ? `ખાતું સક્રિય છે (${firebaseUser?.email || signUpEmail}). MSP સ્લોટ બુકિંગ માટે 7/12 e-Dhara વિગતો નોંધણી કરો.`
                    : `Account authenticated (${firebaseUser?.email || signUpEmail}). Register your 7/12 land records to activate MSP quota and slot booking.`}
                </p>
              </div>

              {/* Progress Stepper Bar */}
              <div className="grid grid-cols-2 bg-emerald-50 border-b border-emerald-100 px-6 py-2.5 text-xs font-bold text-emerald-900">
                <div className="flex items-center gap-1.5 text-emerald-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>1. Firebase Account Active</span>
                </div>
                <div className="flex items-center gap-1.5 text-emerald-900 font-extrabold justify-end">
                  <div className="w-2 h-2 rounded-full bg-emerald-600 animate-ping" />
                  <span>2. Land & Mandi Profile</span>
                </div>
              </div>

              {/* Registration Form */}
              <form onSubmit={handleCompleteRegistrationSubmit} className="p-6 sm:p-8 space-y-4">
                
                {activeError && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                    <span>{activeError}</span>
                  </div>
                )}

                {/* Farmer Full Name */}
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    {language === 'gu' ? 'ખેડૂતનું પૂરું નામ *' : 'Farmer Full Name *'}
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      id="step2-reg-fullname"
                      required
                      value={regFullName}
                      onChange={(e) => setRegFullName(e.target.value)}
                      placeholder="e.g. Indrajit Bati"
                      className="w-full pl-9 pr-3 py-2.5 text-xs sm:text-sm bg-stone-50 border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:bg-white text-stone-900 font-medium"
                    />
                  </div>
                </div>

                {/* Mobile Number */}
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    {language === 'gu' ? 'મોબાઇલ નંબર (SMS સ્લોટ ટોકન માટે) *' : 'Mobile Number (for SMS token & gate entry) *'}
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                    <input
                      type="tel"
                      id="step2-reg-mobile"
                      required
                      value={regMobile}
                      onChange={(e) => setRegMobile(e.target.value)}
                      placeholder="98250 14820"
                      className="w-full pl-9 pr-3 py-2.5 text-xs sm:text-sm bg-stone-50 border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:bg-white text-stone-900 font-medium"
                    />
                  </div>
                </div>

                {/* Gujarat District & Taluka */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      {language === 'gu' ? 'ગુજરાત જિલ્લો *' : 'Gujarat District *'}
                    </label>
                    <div className="relative">
                      <MapPin className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                      <select
                        id="step2-reg-district"
                        value={regDistrict}
                        onChange={(e) => setRegDistrict(e.target.value)}
                        className="w-full pl-9 pr-3 py-2.5 text-xs sm:text-sm bg-stone-50 border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:bg-white text-stone-900 font-semibold"
                      >
                        {GUJARAT_DISTRICTS.map((dist) => (
                          <option key={dist} value={dist}>
                            {dist}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      {language === 'gu' ? 'તાલુકો / ગામ *' : 'Taluka & Village *'}
                    </label>
                    <input
                      type="text"
                      id="step2-reg-village"
                      required
                      value={regVillage}
                      onChange={(e) => setRegVillage(e.target.value)}
                      placeholder="Sanand Rural"
                      className="w-full px-3 py-2.5 text-xs sm:text-sm bg-stone-50 border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:bg-white text-stone-900 font-medium"
                    />
                  </div>
                </div>

                {/* Land Area in Acres with Live Quota Calculator */}
                <div className="p-3.5 bg-emerald-50/80 rounded-2xl border border-emerald-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-bold text-emerald-950">
                      {language === 'gu' ? '7/12 e-Dhara ખેતી જમીન (એકર) *' : '7/12 e-Dhara Farm Land (Acres) *'}
                    </label>
                    <span className="text-[11px] font-bold text-emerald-800 bg-white px-2 py-0.5 rounded-full border border-emerald-300">
                      Standard: 25 Qtl / Acre
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <input
                      type="number"
                      step="0.5"
                      min="0.5"
                      max="100"
                      id="step2-reg-land"
                      required
                      value={regLandArea}
                      onChange={(e) => setRegLandArea(e.target.value)}
                      placeholder="5.0"
                      className="w-32 px-3 py-2 text-xs sm:text-sm bg-white border border-emerald-300 rounded-xl focus:ring-2 focus:ring-emerald-500 font-bold text-stone-900"
                    />
                    <div className="text-xs text-emerald-900 font-medium leading-tight">
                      <span>Maximum MSP Quota Limit:</span>{' '}
                      <strong className="text-emerald-800 font-black text-sm block">
                        {calculatedQuotaQuintals} Quintals (ક્વિન્ટલ)
                      </strong>
                    </div>
                  </div>
                </div>

                {/* Bank DBT & APMC Mandi Selector */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      {language === 'gu' ? 'બેંકનું નામ (DBT ચુકવણી માટે)' : 'Bank (for direct MSP DBT)'}
                    </label>
                    <input
                      type="text"
                      id="step2-reg-bank"
                      value={regBankName}
                      onChange={(e) => setRegBankName(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-xl font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      {language === 'gu' ? 'મનપસંદ APMC યાર્ડ સેન્ટર' : 'Preferred APMC Mandi Yard'}
                    </label>
                    <select
                      id="step2-reg-centre"
                      value={regPreferredCentre}
                      onChange={(e) => setRegPreferredCentre(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-xl font-semibold"
                    >
                      {centres.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Aadhaar DBT verified badge */}
                <div className="flex items-center gap-2 p-2.5 bg-stone-100 rounded-xl text-xs text-stone-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Aadhaar seeded bank account verified for PM-Kisan & APMC DBT transfers.</span>
                </div>

                {/* Submit Register Button */}
                <button
                  type="submit"
                  id="step2-complete-reg-btn"
                  disabled={isSubmitting}
                  className="w-full mt-2 inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-2xl font-bold shadow-md hover:shadow-lg transition-all text-sm active:scale-98"
                >
                  {isSubmitting ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>
                        {language === 'gu'
                          ? 'નોંધણી પૂર્ણ કરો અને મંડી પોર્ટલ ખોલો'
                          : 'Complete Registration & Launch KisanFlow'}
                      </span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            </div>
          ) : (
            /* ========================================================================= */
            /* SCENARIO B: AUTHENTICATION GATEWAY (SIGN IN OR SIGN UP BEFORE REGISTRATION) */
            /* ========================================================================= */
            <div>
              {/* Tab Selector: Sign In vs Sign Up */}
              <div className="grid grid-cols-2 p-1.5 bg-stone-100 border-b border-stone-200">
                <button
                  type="button"
                  id="tab-signin"
                  onClick={() => {
                    setAuthTab('signin');
                    clearAuthError();
                    setLocalError(null);
                    setShowForgotPassword(false);
                  }}
                  className={`py-2.5 text-xs sm:text-sm font-bold rounded-2xl transition-all flex items-center justify-center gap-1.5 ${
                    authTab === 'signin' && !showForgotPassword
                      ? 'bg-white text-emerald-800 shadow-sm'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  <Lock className="w-4 h-4 text-emerald-600" />
                  <span>{language === 'gu' ? 'પ્રવેશ કરો (Sign In)' : 'Farmer Sign In'}</span>
                </button>

                <button
                  type="button"
                  id="tab-signup"
                  onClick={() => {
                    setAuthTab('signup');
                    clearAuthError();
                    setLocalError(null);
                    setShowForgotPassword(false);
                  }}
                  className={`py-2.5 text-xs sm:text-sm font-bold rounded-2xl transition-all flex items-center justify-center gap-1.5 ${
                    authTab === 'signup' && !showForgotPassword
                      ? 'bg-white text-emerald-800 shadow-sm'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  <User className="w-4 h-4 text-emerald-600" />
                  <span>{language === 'gu' ? 'નવું ખાતું (Sign Up)' : 'Create Account'}</span>
                </button>
              </div>

              <div className="p-6 sm:p-8 space-y-5">
                
                {/* Error Banner */}
                {activeError && (
                  <div className="p-3.5 bg-red-50 border border-red-200 rounded-2xl text-xs text-red-800 space-y-2.5 animate-fadeIn">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                      <div className="flex-1 font-medium leading-relaxed">
                        <span>{activeError}</span>
                      </div>
                    </div>

                    {/* Specialized helper for auth/unauthorized-domain */}
                    {(activeError.includes('unauthorized-domain') || activeError.includes('Authorized domains')) && (
                      <div className="p-3 bg-white rounded-xl border border-red-200 text-stone-800 space-y-2 text-[11px]">
                        <div className="font-bold text-red-900 flex items-center gap-1.5">
                          <span>Why this happens:</span>
                        </div>
                        <p className="text-stone-600">
                          Firebase Google Sign-In only permits OAuth popups from domains listed in your Firebase project's <strong>Authorized domains</strong> list.
                        </p>
                        
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 pt-1">
                          <div className="flex-1 bg-stone-100 px-2.5 py-1.5 rounded-lg font-mono text-[11px] text-stone-900 border border-stone-200 truncate select-all">
                            {currentHostname || 'your-app-domain.run.app'}
                          </div>
                          <button
                            type="button"
                            onClick={copyCurrentDomain}
                            className="inline-flex items-center justify-center gap-1 px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg font-bold text-[11px] transition-colors shrink-0 shadow-2xs"
                          >
                            {copiedDomain ? (
                              <>
                                <Check className="w-3.5 h-3.5" />
                                <span>Copied!</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3.5 h-3.5" />
                                <span>Copy Domain</span>
                              </>
                            )}
                          </button>
                        </div>

                        <div className="pt-1.5 border-t border-stone-100 flex flex-wrap items-center justify-between gap-2">
                          <a
                            href="https://console.firebase.google.com/project/kisanflow-4a75e/authentication/settings"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-emerald-800 hover:text-emerald-950 font-bold underline"
                          >
                            <span>Open Firebase Console Settings</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>

                          <button
                            type="button"
                            onClick={() => {
                              // Bypass directly to demo authentication for local testing
                              login(signInEmail, signInPassword, 'farmer', false);
                            }}
                            className="font-bold text-stone-600 hover:text-stone-900 underline"
                          >
                            Continue with Demo Mode →
                          </button>
                        </div>
                      </div>
                    )}

                    {activeError.includes('not yet enabled') && (
                      <div className="pt-1">
                        <button
                          type="button"
                          onClick={() => {
                            // Bypass directly to demo authentication for local testing
                            login(signInEmail, signInPassword, 'farmer', false);
                          }}
                          className="text-[11px] font-bold underline text-red-800 hover:text-red-950"
                        >
                          Click here to proceed in Offline / Demo Mode →
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* Reset success notification */}
                {resetSuccessMessage && (
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{resetSuccessMessage}</span>
                  </div>
                )}

                {/* FORGOT PASSWORD FORM */}
                {showForgotPassword ? (
                  <form onSubmit={handleForgotPasswordSubmit} className="space-y-4">
                    <div className="text-center space-y-1">
                      <h3 className="text-base font-bold text-stone-900">
                        {language === 'gu' ? 'પાસવર્ડ રીસેટ કરો' : 'Reset Account Password'}
                      </h3>
                      <p className="text-xs text-stone-600">
                        {language === 'gu'
                          ? 'તમારો નોંધાયેલ ઈમેલ દાખલ કરો. અમે રીસેટ લિંક મોકલીશું.'
                          : 'Enter your registered email address and we will send you a reset link.'}
                      </p>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-stone-700 mb-1">
                        Email Address *
                      </label>
                      <div className="relative">
                        <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                        <input
                          type="email"
                          required
                          value={forgotEmail}
                          onChange={(e) => setForgotEmail(e.target.value)}
                          placeholder="farmer@kisanflow.gujarat.gov.in"
                          className="w-full pl-9 pr-3 py-2.5 text-xs sm:text-sm bg-stone-50 border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:bg-white text-stone-900 font-medium"
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex-1 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition-colors"
                      >
                        {isSubmitting ? 'Sending...' : 'Send Reset Link'}
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowForgotPassword(false)}
                        className="px-4 py-2.5 border border-stone-300 text-stone-700 rounded-xl text-xs font-bold hover:bg-stone-50"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                  <>
                    {/* GOOGLE AUTH BUTTON */}
                    <div>
                      <button
                        type="button"
                        id="google-auth-btn"
                        onClick={handleGoogleAuth}
                        disabled={isSubmitting || isFirebaseLoading}
                        className="w-full flex items-center justify-center gap-3 px-4 py-3 border-2 border-stone-200 hover:border-emerald-600 rounded-2xl bg-white hover:bg-stone-50 font-bold text-stone-800 text-xs sm:text-sm shadow-2xs transition-all active:scale-98"
                      >
                        <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                          <path
                            fill="#4285F4"
                            d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17Z"
                          />
                          <path
                            fill="#34A853"
                            d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24Z"
                          />
                          <path
                            fill="#FBBC05"
                            d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.14-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.97 0 12s.45 3.82 1.25 5.42l4.03-3.15Z"
                          />
                          <path
                            fill="#EA4335"
                            d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98Z"
                          />
                        </svg>
                        <span>
                          {authTab === 'signup' 
                            ? (language === 'gu' ? 'Google સાથે સાઇન અપ કરો' : 'Sign Up with Google') 
                            : (language === 'gu' ? 'Google સાથે સાઇન ઇન કરો' : 'Sign In with Google')}
                        </span>
                      </button>

                      <div className="relative my-4">
                        <div className="absolute inset-0 flex items-center">
                          <div className="w-full border-t border-stone-200" />
                        </div>
                        <div className="relative flex justify-center text-[11px] uppercase tracking-wider font-semibold text-stone-500">
                          <span className="bg-white px-3">
                            {language === 'gu' ? 'અથવા ઈમેલ દ્વારા' : 'Or with Email & Password'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* TAB 1: SIGN IN FORM */}
                    {authTab === 'signin' && (
                      <form onSubmit={handleSignInSubmit} className="space-y-3.5">
                        {/* Email Address */}
                        <div>
                          <label className="block text-xs font-bold text-stone-700 mb-1">
                            {language === 'gu' ? 'ઈમેલ સરનામું *' : 'Email Address *'}
                          </label>
                          <div className="relative">
                            <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                            <input
                              type="email"
                              id="signin-email"
                              required
                              value={signInEmail}
                              onChange={(e) => setSignInEmail(e.target.value)}
                              placeholder="ramesh.patel@kisanflow.gujarat.gov.in"
                              className="w-full pl-9 pr-3 py-2.5 text-xs sm:text-sm bg-stone-50 border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:bg-white text-stone-900 font-medium"
                            />
                          </div>
                        </div>

                        {/* Password */}
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <label className="block text-xs font-bold text-stone-700">
                              {language === 'gu' ? 'પાસવર્ડ *' : 'Password *'}
                            </label>
                            <button
                              type="button"
                              onClick={() => {
                                setForgotEmail(signInEmail);
                                setShowForgotPassword(true);
                              }}
                              className="text-[11px] font-bold text-emerald-700 hover:text-emerald-800"
                            >
                              Forgot Password?
                            </button>
                          </div>

                          <div className="relative">
                            <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                            <input
                              type={showSignInPassword ? 'text' : 'password'}
                              id="signin-password"
                              required
                              value={signInPassword}
                              onChange={(e) => setSignInPassword(e.target.value)}
                              placeholder="••••••••"
                              className="w-full pl-9 pr-10 py-2.5 text-xs sm:text-sm bg-stone-50 border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:bg-white text-stone-900 font-medium"
                            />
                            <button
                              type="button"
                              onClick={() => setShowSignInPassword(!showSignInPassword)}
                              className="absolute right-3 top-3 text-stone-500 hover:text-stone-700"
                            >
                              {showSignInPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                          </div>
                        </div>

                        {/* Submit Sign In Button */}
                        <button
                          type="submit"
                          id="signin-submit-btn"
                          disabled={isSubmitting || isFirebaseLoading}
                          className="w-full mt-2 inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-2xl font-bold shadow-md hover:shadow-lg transition-all text-sm active:scale-98"
                        >
                          {isSubmitting || isFirebaseLoading ? (
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <>
                              <span>{language === 'gu' ? 'ખેડૂત લૉગિન કરો' : 'Sign In to KisanFlow'}</span>
                              <ArrowRight className="w-4 h-4" />
                            </>
                          )}
                        </button>

                        {/* Switch to Sign Up */}
                        <div className="text-center pt-2 text-xs text-stone-600">
                          <span>{language === 'gu' ? 'નવા ખેડૂત છો? ' : "Don't have an account? "}</span>
                          <button
                            type="button"
                            onClick={() => setAuthTab('signup')}
                            className="font-bold text-emerald-700 hover:underline"
                          >
                            {language === 'gu' ? 'પહેલા ખાતું બનાવો (Sign Up)' : 'Sign Up first before registration'}
                          </button>
                        </div>
                      </form>
                    )}

                    {/* TAB 2: SIGN UP FORM (BEFORE REGISTRATION) */}
                    {authTab === 'signup' && (
                      <form onSubmit={handleSignUpSubmit} className="space-y-3.5">
                        
                        {/* Notice */}
                        <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200/80 text-xs text-amber-900 flex items-start gap-2">
                          <User className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                          <span>
                            {language === 'gu'
                              ? 'પગલું ૧: પહેલા તમારું Firebase ખાતું બનાવો. તે પછી તમે તમારી APMC 7/12 જમીન નોંધણી પૂર્ણ કરશો.'
                              : 'Step 1: Sign up your account first. After sign-up, you will complete your APMC 7/12 land registration.'}
                          </span>
                        </div>

                        {/* Full Name */}
                        <div>
                          <label className="block text-xs font-bold text-stone-700 mb-1">
                            {language === 'gu' ? 'પૂરું નામ *' : 'Full Name *'}
                          </label>
                          <div className="relative">
                            <User className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                            <input
                              type="text"
                              id="signup-fullname"
                              required
                              value={signUpName}
                              onChange={(e) => setSignUpName(e.target.value)}
                              placeholder="e.g. Indrajit Bati"
                              className="w-full pl-9 pr-3 py-2.5 text-xs sm:text-sm bg-stone-50 border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:bg-white text-stone-900 font-medium"
                            />
                          </div>
                        </div>

                        {/* Email */}
                        <div>
                          <label className="block text-xs font-bold text-stone-700 mb-1">
                            {language === 'gu' ? 'ઈમેલ સરનામું *' : 'Email Address *'}
                          </label>
                          <div className="relative">
                            <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                            <input
                              type="email"
                              id="signup-email"
                              required
                              value={signUpEmail}
                              onChange={(e) => setSignUpEmail(e.target.value)}
                              placeholder="farmer@kisanflow.gov.in"
                              className="w-full pl-9 pr-3 py-2.5 text-xs sm:text-sm bg-stone-50 border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:bg-white text-stone-900 font-medium"
                            />
                          </div>
                        </div>

                        {/* Password & Confirm */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-bold text-stone-700 mb-1">
                              {language === 'gu' ? 'પાસવર્ડ (૬+ અક્ષર) *' : 'Password (6+ chars) *'}
                            </label>
                            <div className="relative">
                              <input
                                type={showSignUpPassword ? 'text' : 'password'}
                                id="signup-password"
                                required
                                minLength={6}
                                value={signUpPassword}
                                onChange={(e) => setSignUpPassword(e.target.value)}
                                placeholder="••••••••"
                                className="w-full px-3 pr-9 py-2.5 text-xs sm:text-sm bg-stone-50 border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:bg-white text-stone-900 font-medium"
                              />
                              <button
                                type="button"
                                onClick={() => setShowSignUpPassword(!showSignUpPassword)}
                                className="absolute right-2.5 top-3 text-stone-500 hover:text-stone-700"
                              >
                                {showSignUpPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                              </button>
                            </div>
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-stone-700 mb-1">
                              {language === 'gu' ? 'પાસવર્ડ પુષ્ટિ *' : 'Confirm Password *'}
                            </label>
                            <input
                              type="password"
                              id="signup-confirm-password"
                              required
                              minLength={6}
                              value={signUpConfirmPassword}
                              onChange={(e) => setSignUpConfirmPassword(e.target.value)}
                              placeholder="••••••••"
                              className="w-full px-3 py-2.5 text-xs sm:text-sm bg-stone-50 border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:bg-white text-stone-900 font-medium"
                            />
                          </div>
                        </div>

                        {/* Submit Sign Up Button */}
                        <button
                          type="submit"
                          id="signup-submit-btn"
                          disabled={isSubmitting || isFirebaseLoading}
                          className="w-full mt-2 inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-2xl font-bold shadow-md hover:shadow-lg transition-all text-sm active:scale-98"
                        >
                          {isSubmitting || isFirebaseLoading ? (
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <>
                              <span>
                                {language === 'gu'
                                  ? 'ખાતું બનાવો અને ખેડૂત નોંધણી આગળ ધપાવો'
                                  : 'Sign Up & Proceed to Registration'}
                              </span>
                              <ArrowRight className="w-4 h-4" />
                            </>
                          )}
                        </button>

                        {/* Switch to Sign In */}
                        <div className="text-center pt-2 text-xs text-stone-600">
                          <span>{language === 'gu' ? 'પહેલેથી જ ખાતું છે? ' : 'Already have an account? '}</span>
                          <button
                            type="button"
                            onClick={() => setAuthTab('signin')}
                            className="font-bold text-emerald-700 hover:underline"
                          >
                            {language === 'gu' ? 'અહીં સાઇન ઇન કરો' : 'Sign In here'}
                          </button>
                        </div>
                      </form>
                    )}

                    {/* Quick Fill Demo Bar for Preview Testing */}
                    <div className="pt-3 border-t border-stone-200">
                      <div className="text-[11px] font-bold text-stone-500 uppercase tracking-wider mb-2 text-center">
                        Quick Preview Testing (પ્રીવ્યૂ ડેમો)
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => fillDemoAccount('registered_patel')}
                          className="px-2.5 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 text-[11px] font-semibold rounded-xl border border-stone-200 transition-colors text-center"
                        >
                          Fill: Existing Farmer
                        </button>
                        <button
                          type="button"
                          onClick={() => fillDemoAccount('new_bati')}
                          className="px-2.5 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 text-[11px] font-semibold rounded-xl border border-stone-200 transition-colors text-center"
                        >
                          Fill: New Farmer
                        </button>
                      </div>
                    </div>
                  </>
                )}

              </div>
            </div>
          )}
        </div>

        {/* Official Staff Portal Trigger (Operator & Directorate Admin ONLY) */}
        <div className="mt-6 text-center">
          <button
            type="button"
            id="official-staff-portal-btn"
            onClick={() => setShowStaffPortal(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-white border border-stone-200 text-stone-600 hover:text-stone-900 hover:border-stone-400 hover:bg-stone-50 text-xs font-bold shadow-2xs transition-all"
          >
            <Building2 className="w-4 h-4 text-amber-700" />
            <span>APMC Mandi Staff & Admin Portal (સત્તાવાર સ્ટાફ)</span>
          </button>
          <p className="text-[10px] text-stone-600 mt-1">
            Restricted to Weighbridge Operators & Directorate Admins with unique Service ID and PIN.
          </p>
        </div>

      </div>
    </div>
  );
};
