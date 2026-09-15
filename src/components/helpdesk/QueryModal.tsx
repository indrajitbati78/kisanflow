import React, { useState } from 'react';
import { 
  HelpCircle, 
  X, 
  Send, 
  MessageSquare, 
  CheckCircle2, 
  Clock, 
  ChevronDown, 
  ChevronUp, 
  Phone, 
  ShieldAlert,
  Sparkles
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { FarmerQuery } from '../../types';

export const QueryModal: React.FC = () => {
  const { isQueryOpen, setIsQueryOpen, queries, addQuery, selectedDistrict } = useApp();

  const [category, setCategory] = useState<FarmerQuery['category']>('Slot Booking');
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [activeTab, setActiveTab] = useState<'submit' | 'history' | 'faqs'>('submit');
  const [submittedSuccess, setSubmittedSuccess] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(0);

  if (!isQueryOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !description.trim()) return;

    addQuery(category, subject, description);
    setSubject('');
    setDescription('');
    setSubmittedSuccess(true);
    setTimeout(() => {
      setSubmittedSuccess(false);
      setActiveTab('history');
    }, 1500);
  };

  const faqs = [
    {
      q: 'What happens if my tractor arrives 20 minutes late due to traffic or breakdown?',
      a: 'All digital tokens contain a 30-minute grace window. When you arrive at the gate, inform security and your token will be positioned in the next immediate weighbridge queue cycle without cancellation.'
    },
    {
      q: 'What are the permissible moisture limits for Gujarat APMC procurement?',
      a: 'Wheat (FAQ): Max 12.0%, Cotton (Shankar-6): Max 8.5%, Groundnut (GG-20): Max 9.0%, Mustard: Max 8.0%. Crops within these limits are accepted without quality deduction.'
    },
    {
      q: 'When will the MSP procurement money reflect in my bank account?',
      a: 'After the final digital voucher is approved by the Mandi procurement officer, funds are dispatched via the Public Financial Management System (PFMS) Direct Benefit Transfer (DBT) directly into your Aadhaar-linked bank account within 24 to 48 banking hours.'
    },
    {
      q: 'Can I book multiple arrival slots for different crops on the same day?',
      a: 'Yes, farmers with multiple registered crops can book staggered slots (e.g. Wheat in the morning at 10:30 AM and Mustard at 02:30 PM).'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full border border-stone-200 shadow-2xl overflow-hidden my-8">
        
        {/* Header */}
        <div className="bg-emerald-800 text-white p-6 relative">
          <button
            type="button"
            onClick={() => setIsQueryOpen(false)}
            className="absolute right-4 top-4 w-9 h-9 rounded-full bg-black/20 hover:bg-black/40 text-white flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center text-white">
              <HelpCircle className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-widest text-emerald-200">
                APMC Mandi Helpdesk & Grievances
              </span>
              <h2 className="text-xl sm:text-2xl font-bold font-display">
                Farmer Query & Support Center
              </h2>
              <p className="text-xs text-emerald-100">
                Direct assistance for slot bookings, weighing, quality assay & DBT payments in {selectedDistrict}
              </p>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-stone-200 bg-stone-50 px-6 pt-2">
          <button
            type="button"
            onClick={() => setActiveTab('submit')}
            className={`py-3 px-4 text-xs font-bold border-b-2 transition-all ${
              activeTab === 'submit'
                ? 'border-emerald-700 text-emerald-700'
                : 'border-transparent text-stone-500 hover:text-stone-900'
            }`}
          >
            Ask a Query (નવો પ્રશ્ન)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('history')}
            className={`py-3 px-4 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'history'
                ? 'border-emerald-700 text-emerald-700'
                : 'border-transparent text-stone-500 hover:text-stone-900'
            }`}
          >
            <span>My Queries ({queries.length})</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('faqs')}
            className={`py-3 px-4 text-xs font-bold border-b-2 transition-all ${
              activeTab === 'faqs'
                ? 'border-emerald-700 text-emerald-700'
                : 'border-transparent text-stone-500 hover:text-stone-900'
            }`}
          >
            Mandi FAQs
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          
          {submittedSuccess && (
            <div className="mb-4 p-3.5 rounded-2xl bg-emerald-50 border border-emerald-300 text-xs font-bold text-emerald-900 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>Query submitted successfully! APMC Mandi officers have been notified.</span>
            </div>
          )}

          {activeTab === 'submit' && (
            <form onSubmit={handleSubmit} className="space-y-4">
              
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-1.5">
                  Select Category (શ્રેણી પસંદ કરો)
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {[
                    'Slot Booking',
                    'Weighbridge',
                    'Quality & Assay',
                    'Payment & DBT',
                    'Centre Facility',
                    'Other'
                  ].map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setCategory(cat as FarmerQuery['category'])}
                      className={`p-2.5 rounded-xl text-xs font-bold border transition-all text-left flex items-center justify-between ${
                        category === cat
                          ? 'bg-emerald-50 border-emerald-600 text-emerald-900 shadow-2xs'
                          : 'bg-white border-stone-200 text-stone-600 hover:border-stone-300'
                      }`}
                    >
                      <span>{cat}</span>
                      {category === cat && <span className="w-2 h-2 rounded-full bg-emerald-600" />}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-1.5">
                  Subject (પ્રશ્નનો વિષય)
                </label>
                <input
                  type="text"
                  required
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="e.g. Tractor delayed on highway / Need slot reschedule"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 bg-white text-stone-900 text-xs font-medium focus:border-emerald-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-1.5">
                  Detailed Description (સમસ્યાની વિગતો)
                </label>
                <textarea
                  rows={4}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Please specify your token number, vehicle registration, and exact assistance needed..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 bg-white text-stone-900 text-xs font-medium focus:border-emerald-600"
                />
              </div>

              <div className="pt-2 flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs text-stone-500">
                  <Phone className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Helpline: 1800-180-1551</span>
                </div>

                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-md transition-all active:scale-98"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Submit Ticket</span>
                </button>
              </div>

            </form>
          )}

          {activeTab === 'history' && (
            <div className="space-y-3">
              {queries.length === 0 ? (
                <div className="text-center py-10 text-stone-400">
                  <MessageSquare className="w-10 h-10 mx-auto mb-2 opacity-50" />
                  <p className="text-xs">No queries registered yet.</p>
                </div>
              ) : (
                queries.map((q) => (
                  <div
                    key={q.id}
                    className="p-4 rounded-2xl border border-stone-200 bg-stone-50/70 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                          {q.id}
                        </span>
                        <span className="text-xs font-bold text-stone-500">
                          {q.category}
                        </span>
                      </div>
                      <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                        q.status === 'Resolved'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-900'
                      }`}>
                        {q.status}
                      </span>
                    </div>

                    <h4 className="text-xs font-bold text-stone-900">
                      {q.subject}
                    </h4>
                    
                    <p className="text-xs text-stone-600 leading-relaxed">
                      {q.description}
                    </p>

                    {q.response && (
                      <div className="mt-2 p-2.5 rounded-xl bg-white border border-stone-200 text-xs text-stone-700 space-y-1">
                        <span className="font-bold text-emerald-800 block text-[11px]">
                          Official Mandi Response:
                        </span>
                        <p>{q.response}</p>
                      </div>
                    )}

                    <div className="flex items-center justify-between text-[10px] text-stone-600 pt-1">
                      <span>Submitted: {q.createdAt}</span>
                      <span>Target: {q.centreName}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'faqs' && (
            <div className="space-y-2.5">
              {faqs.map((faq, idx) => {
                const isOpen = expandedFaq === idx;
                return (
                  <div
                    key={idx}
                    className="border border-stone-200 rounded-2xl overflow-hidden bg-white"
                  >
                    <button
                      type="button"
                      onClick={() => setExpandedFaq(isOpen ? null : idx)}
                      className="w-full p-3.5 text-left flex items-center justify-between gap-3 text-xs font-bold text-stone-900 hover:bg-stone-50 transition-colors"
                    >
                      <span>{faq.q}</span>
                      {isOpen ? (
                        <ChevronUp className="w-4 h-4 text-stone-600 shrink-0" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-stone-600 shrink-0" />
                      )}
                    </button>
                    {isOpen && (
                      <div className="p-3.5 pt-0 text-xs text-stone-600 leading-relaxed border-t border-stone-100 bg-stone-50/50">
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 bg-stone-50 border-t border-stone-200 flex justify-end">
          <button
            type="button"
            onClick={() => setIsQueryOpen(false)}
            className="px-6 py-2.5 bg-stone-800 hover:bg-stone-900 text-white rounded-xl text-xs font-bold transition-colors"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
