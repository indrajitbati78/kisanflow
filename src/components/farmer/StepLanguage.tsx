import React from 'react';
import { Check, Languages, ArrowRight, Volume2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Language } from '../../types';

export const StepLanguage: React.FC = () => {
  const { language, setLanguage, setFarmerStep, t } = useApp();

  const options: {
    id: Language;
    title: string;
    nativeName: string;
    subtext: string;
    badge: string;
  }[] = [
    {
      id: 'en',
      title: 'English',
      nativeName: 'English',
      subtext: 'Standard government agricultural procurement portal',
      badge: 'Official'
    },
    {
      id: 'hi',
      title: 'Hindi',
      nativeName: 'हिन्दी',
      subtext: 'सरल भाषा में किसान सेवा एवं ई-मंडी पंजीकरण',
      badge: 'लोकप्रिय'
    },
    {
      id: 'gu',
      title: 'Gujarati',
      nativeName: 'ગુજરાતી',
      subtext: 'સરળ ગુજરાતીમાં ખેડૂત સ્લોટ બુકિંગ અને ટોકન પ્રણાલી',
      badge: 'પ્રાદેશિક'
    }
  ];

  const handleSpeakSample = (text: string) => {
    if ('speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 0.95;
        window.speechSynthesis.speak(utterance);
      } catch {
        // Voice fallback
      }
    }
  };

  return (
    <div id="step-language" className="max-w-3xl mx-auto space-y-6">
      <div className="text-center space-y-2">
        <div className="inline-flex p-3 rounded-2xl bg-emerald-100 text-emerald-800 mb-1">
          <Languages className="w-8 h-8" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-stone-900 font-display">
          {t.selectLanguageTitle}
        </h2>
        <p className="text-stone-600 text-sm sm:text-base max-w-lg mx-auto">
          {t.selectLanguageDesc}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
        {options.map((opt) => {
          const isSelected = language === opt.id;
          return (
            <div
              key={opt.id}
              id={`lang-card-${opt.id}`}
              onClick={() => setLanguage(opt.id)}
              className={`relative p-5 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between text-left ${
                isSelected
                  ? 'border-emerald-600 bg-emerald-50/70 shadow-md ring-2 ring-emerald-600/20'
                  : 'border-stone-200 bg-white hover:border-emerald-300 hover:bg-stone-50/50'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                    isSelected ? 'bg-emerald-200 text-emerald-900' : 'bg-stone-100 text-stone-600'
                  }`}>
                    {opt.badge}
                  </span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSpeakSample(`${opt.nativeName}. Welcome to KisanFlow.`);
                    }}
                    className="p-1 rounded-md text-stone-400 hover:text-emerald-700 hover:bg-emerald-100/50 transition-colors"
                    title="Audio preview"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>

                <h3 className="text-2xl font-bold text-stone-900 mb-0.5 font-display">
                  {opt.nativeName}
                </h3>
                <p className="text-sm font-medium text-emerald-800 mb-2">
                  {opt.title}
                </p>
                <p className="text-xs text-stone-500 leading-relaxed">
                  {opt.subtext}
                </p>
              </div>

              <div className="mt-5 pt-3 border-t border-stone-200/60 flex items-center justify-between">
                <span className={`text-xs font-semibold ${isSelected ? 'text-emerald-800' : 'text-stone-400'}`}>
                  {isSelected ? '✓ Selected' : 'Tap to select'}
                </span>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                  isSelected ? 'bg-emerald-600 text-white' : 'border border-stone-300'
                }`}>
                  {isSelected && <Check className="w-3.5 h-3.5" />}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="pt-4 flex justify-end">
        <button
          id="lang-continue-btn"
          onClick={() => setFarmerStep(2)}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-semibold shadow-sm hover:shadow-md transition-all text-base"
        >
          <span>{t.continueBtn}</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
