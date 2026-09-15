import React, { useState } from 'react';
import { 
  Building2, 
  Users, 
  Scale, 
  ShieldCheck, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Search, 
  Filter, 
  PhoneCall, 
  FileText, 
  Plus, 
  Sparkles,
  Zap,
  ArrowUpDown,
  Printer,
  Eye,
  X,
  CreditCard,
  Wheat,
  Calendar,
  Check,
  Database
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { TokenBooking, QualityGrade, QueueStatus, FarmerProfile } from '../../types';

export const OperatorDashboard: React.FC = () => {
  const { 
    t, 
    centres, 
    selectedCentreId, 
    setSelectedCentreId, 
    bookings, 
    markArrived, 
    callToken, 
    submitWeighing, 
    submitQualityCheck, 
    approvePaymentVoucher,
    timeSlots,
    registeredFarmers,
    issueWalkInToken
  } = useApp();

  const [operatorTab, setOperatorTab] = useState<'queue' | 'registered_farmers'>('queue');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [yardFilter, setYardFilter] = useState<'this_yard' | 'all_yards'>('this_yard');
  const [searchQuery, setSearchQuery] = useState('');
  const [farmerSearchQuery, setFarmerSearchQuery] = useState('');
  const [selectedFarmerDossier, setSelectedFarmerDossier] = useState<FarmerProfile | null>(null);
  const [inwardPassSuccess, setInwardPassSuccess] = useState<string | null>(null);

  // Modals state
  const [weighingModalBooking, setWeighingModalBooking] = useState<TokenBooking | null>(null);
  const [grossInput, setGrossInput] = useState<number>(7800);
  const [tareInput, setTareInput] = useState<number>(3200);

  const [qualityModalBooking, setQualityModalBooking] = useState<TokenBooking | null>(null);
  const [selectedGrade, setSelectedGrade] = useState<QualityGrade>('Grade A');
  const [moistureInput, setMoistureInput] = useState<number>(10.8);
  const [dockageInput, setDockageInput] = useState<number>(0.5);
  const [inspectorNotes, setInspectorNotes] = useState('Clean grain, passes all FAQ parameters.');

  const currentCentre = centres.find(c => c.id === selectedCentreId) || centres[0];
  const centreBookings = yardFilter === 'all_yards' ? bookings : bookings.filter(b => b.centreId === selectedCentreId);

  // Filtered list of tokens
  const filteredBookings = centreBookings.filter(b => {
    const matchesFilter = filterStatus === 'all' || b.status === filterStatus;
    const matchesQuery = searchQuery === '' || 
      b.tokenNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.farmerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.cropName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesQuery;
  });

  // Filtered list of registered farmers in yard jurisdiction
  const filteredYardFarmers = registeredFarmers.filter(farmer => {
    const query = farmerSearchQuery.toLowerCase().trim();
    const matchesSearch = query === '' || 
      farmer.id.toLowerCase().includes(query) ||
      farmer.fullName.toLowerCase().includes(query) ||
      farmer.mobileNumber.toLowerCase().includes(query) ||
      farmer.village.toLowerCase().includes(query) ||
      farmer.district.toLowerCase().includes(query);
    return matchesSearch;
  });

  // Calculate Operator KPIs
  const totalBookings = centreBookings.length;
  const arrivedCount = centreBookings.filter(b => b.status === 'arrived' || b.status === 'waiting' || b.status === 'called').length;
  const inProgressCount = centreBookings.filter(b => b.status === 'in_progress').length;
  const completedCount = centreBookings.filter(b => b.status === 'completed').length;
  const totalProcuredQuintals = centreBookings
    .filter(b => b.status === 'completed')
    .reduce((acc, curr) => acc + (curr.weighingDetails?.netWeightQuintals || curr.quantityQuintals), 0);

  const capacityPct = Math.round((currentCentre.currentBookedQuintals / currentCentre.dailyCapacityQuintals) * 100);

  const handleOpenWeighing = (b: TokenBooking) => {
    setWeighingModalBooking(b);
    setGrossInput(Math.round(b.quantityQuintals * 100 + 3150));
    setTareInput(3150);
  };

  const handleSaveWeighing = (e: React.FormEvent) => {
    e.preventDefault();
    if (weighingModalBooking) {
      submitWeighing(weighingModalBooking.id, grossInput, tareInput);
      setWeighingModalBooking(null);
    }
  };

  const handleOpenQuality = (b: TokenBooking) => {
    setQualityModalBooking(b);
  };

  const handleSaveQuality = (e: React.FormEvent) => {
    e.preventDefault();
    if (qualityModalBooking) {
      submitQualityCheck(qualityModalBooking.id, selectedGrade, moistureInput, dockageInput, 0, inspectorNotes);
      setQualityModalBooking(null);
    }
  };

  return (
    <div id="operator-dashboard" className="space-y-6">
      
      {/* Centre Operator Console Top Banner */}
      <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono font-bold bg-amber-100 text-amber-900 px-2 py-0.5 rounded">
              {currentCentre.code}
            </span>
            <span className="text-xs text-stone-500 font-medium">
              Operator Station: Gate #1 & Central Weighbridge
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-stone-900 font-display">
            {currentCentre.name}
          </h2>
          <p className="text-xs text-stone-500">{currentCentre.address}</p>
        </div>

        {/* Right Header Actions */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Yard Scope Toggle */}
          <div className="inline-flex rounded-xl border border-stone-200 bg-stone-100 p-0.5 text-xs font-bold">
            <button
              type="button"
              onClick={() => setYardFilter('this_yard')}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                yardFilter === 'this_yard'
                  ? 'bg-white text-stone-900 shadow-2xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              This Yard ({bookings.filter(b => b.centreId === selectedCentreId).length})
            </button>
            <button
              type="button"
              onClick={() => setYardFilter('all_yards')}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                yardFilter === 'all_yards'
                  ? 'bg-white text-stone-900 shadow-2xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              All Gujarat Yards ({bookings.length})
            </button>
          </div>

          {/* Change Centre Switcher */}
          <div className="flex items-center gap-2">
            <label className="text-xs font-semibold text-stone-600 whitespace-nowrap">
              Switch Yard:
            </label>
            <select
              id="operator-centre-select"
              value={selectedCentreId}
              onChange={(e) => setSelectedCentreId(e.target.value)}
              className="px-3 py-2 rounded-xl border border-stone-300 text-xs font-bold text-stone-800 bg-stone-50 outline-hidden"
            >
              {centres.map(c => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.district})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Metric Cards KPI Bar */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
        
        <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-stone-500 font-medium mb-1">
            <span>Daily Bookings</span>
            <Users className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black font-mono text-stone-900">
            {totalBookings} <span className="text-xs text-stone-400 font-normal">farmers</span>
          </div>
          <p className="text-[11px] text-stone-500 mt-1">
            Max limit: {currentCentre.dailyFarmerLimit}
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-stone-500 font-medium mb-1">
            <span>In Yard (Waiting)</span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-black font-mono text-amber-700">
            {arrivedCount} <span className="text-xs text-stone-400 font-normal">in queue</span>
          </div>
          <p className="text-[11px] text-amber-600 font-medium mt-1">
            Avg wait: ~18 mins
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-stone-500 font-medium mb-1">
            <span>Active Weighing</span>
            <Scale className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-2xl font-black font-mono text-purple-800">
            {inProgressCount} <span className="text-xs text-stone-400 font-normal">at scales</span>
          </div>
          <p className="text-[11px] text-stone-500 mt-1">
            {currentCentre.activeWeighbridges} weighbridges online
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-stone-500 font-medium mb-1">
            <span>Completed Today</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black font-mono text-emerald-700">
            {completedCount} <span className="text-xs text-stone-400 font-normal">vouchers</span>
          </div>
          <p className="text-[11px] text-stone-500 mt-1">
            {totalProcuredQuintals} Qtl cleared
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-2xs col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between text-xs text-stone-500 font-medium mb-1">
            <span>Capacity Utilized</span>
            <Building2 className="w-4 h-4 text-teal-600" />
          </div>
          <div className="text-2xl font-black font-mono text-stone-900">
            {capacityPct}%
          </div>
          <div className="w-full bg-stone-100 rounded-full h-1.5 mt-2 overflow-hidden">
            <div
              className={`h-full rounded-full ${capacityPct > 80 ? 'bg-red-500' : 'bg-emerald-600'}`}
              style={{ width: `${Math.min(capacityPct, 100)}%` }}
            />
          </div>
        </div>

      </div>

      {/* Inward Pass Quick Toast */}
      {inwardPassSuccess && (
        <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-950 rounded-2xl text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{inwardPassSuccess}</span>
          </div>
          <button
            type="button"
            onClick={() => setInwardPassSuccess(null)}
            className="text-emerald-700 hover:text-emerald-900 font-bold"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Operator Main Subtabs */}
      <div className="flex items-center gap-2 border-b border-stone-200 pb-2">
        <button
          type="button"
          onClick={() => setOperatorTab('queue')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold border transition-all ${
            operatorTab === 'queue'
              ? 'bg-amber-900 text-white border-amber-900 shadow-sm'
              : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-50'
          }`}
        >
          <Scale className="w-4 h-4" />
          <span>Live Inward & Weighbridge Queue (ટોકન અને વજનકાંટો કતાર)</span>
          <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-amber-800 text-amber-100">
            {centreBookings.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setOperatorTab('registered_farmers')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold border transition-all ${
            operatorTab === 'registered_farmers'
              ? 'bg-amber-900 text-white border-amber-900 shadow-sm'
              : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-50'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Yard Registered Farmers & Quota Records (નોંધાયેલા ખેડૂતો અને જમીન ચકાસણી)</span>
          <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-stone-100 text-stone-700">
            {filteredYardFarmers.length}
          </span>
        </button>
      </div>

      {/* Queue Filter and Table */}
      {operatorTab === 'queue' && (
      <div className="bg-white rounded-3xl border border-stone-200 shadow-sm overflow-hidden">
        
        {/* Table Controls */}
        <div className="p-4 sm:p-5 border-b border-stone-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-stone-50/50">
          
          {/* Status filter chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {[
              { id: 'all', label: 'All Tokens' },
              { id: 'booked', label: 'Booked' },
              { id: 'arrived', label: 'Arrived' },
              { id: 'called', label: 'Called' },
              { id: 'in_progress', label: 'In Progress' },
              { id: 'completed', label: 'Completed' }
            ].map(f => (
              <button
                key={f.id}
                id={`filter-${f.id}`}
                onClick={() => setFilterStatus(f.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  filterStatus === f.id
                    ? 'bg-stone-900 text-white shadow-2xs'
                    : 'bg-white border border-stone-200 text-stone-600 hover:bg-stone-100'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Search box */}
          <div className="relative w-full sm:w-64">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search token, farmer or crop..."
              className="w-full px-3 py-1.5 pl-8 rounded-xl border border-stone-300 text-xs text-stone-800 outline-hidden bg-white focus:border-emerald-500"
            />
            <Search className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-2.5" />
          </div>

        </div>

        {/* Tokens List / Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50 border-b border-stone-200 text-stone-500 font-bold uppercase tracking-wider">
              <tr>
                <th className="px-4 py-3">Token #</th>
                <th className="px-4 py-3">Farmer Details</th>
                <th className="px-4 py-3">Produce & Qty</th>
                <th className="px-4 py-3">Slot Time</th>
                <th className="px-4 py-3">Current Status</th>
                <th className="px-4 py-3">Weighing & Quality</th>
                <th className="px-4 py-3 text-right">Operator Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 font-medium text-stone-800">
              {filteredBookings.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-10 text-stone-400">
                    No tokens match the selected filter.
                  </td>
                </tr>
              ) : (
                filteredBookings.map((b) => (
                  <tr key={b.id} className="hover:bg-stone-50/80 transition-colors">
                    
                    {/* Token */}
                    <td className="px-4 py-3.5 font-mono font-bold text-sm text-stone-950">
                      {b.tokenNumber}
                      <span className="block text-[10px] text-stone-400 font-normal">#{b.queuePosition}</span>
                    </td>

                    {/* Farmer */}
                    <td className="px-4 py-3.5">
                      <div className="font-bold text-stone-900">{b.farmerName}</div>
                      <div className="text-[11px] text-stone-500">ID: {b.farmerId} • {b.farmerPhone}</div>
                      <div className="text-[10px] text-stone-400">{b.farmerVillage}</div>
                    </td>

                    {/* Crop */}
                    <td className="px-4 py-3.5">
                      <div className="font-semibold text-stone-900">{b.cropName}</div>
                      <div className="text-emerald-700 font-mono font-bold">
                        {b.weighingDetails?.netWeightQuintals || b.quantityQuintals} Quintals
                      </div>
                    </td>

                    {/* Slot */}
                    <td className="px-4 py-3.5 font-mono text-[11px] text-stone-600">
                      <div>{b.bookingDate}</div>
                      <div className="text-stone-500">{b.slotTime}</div>
                    </td>

                    {/* Status Badge */}
                    <td className="px-4 py-3.5">
                      {b.status === 'completed' ? (
                        <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800">
                          Completed
                        </span>
                      ) : b.status === 'in_progress' ? (
                        <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-purple-100 text-purple-800">
                          At Weighbridge
                        </span>
                      ) : b.status === 'called' ? (
                        <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-900 animate-pulse">
                          Called
                        </span>
                      ) : b.status === 'arrived' ? (
                        <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-blue-100 text-blue-800">
                          Arrived (Shed)
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-stone-100 text-stone-700">
                          Booked
                        </span>
                      )}
                    </td>

                    {/* Weighing & Quality state */}
                    <td className="px-4 py-3.5 text-[11px]">
                      {b.weighingDetails ? (
                        <div className="text-stone-800">
                          <span className="font-semibold">Net: {b.weighingDetails.netWeightQuintals} Qtl</span>
                          <span className="block text-[10px] text-stone-400">Tare: {b.weighingDetails.tareWeightKg}kg</span>
                        </div>
                      ) : (
                        <span className="text-stone-400 italic">Not weighed</span>
                      )}

                      {b.qualityDetails && (
                        <div className="mt-0.5 text-emerald-800 font-bold text-[10px]">
                          {b.qualityDetails.assignedGrade} ({b.qualityDetails.moisturePercent}% Moisture)
                        </div>
                      )}
                    </td>

                    {/* Operator Workflow Actions */}
                    <td className="px-4 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        
                        {/* Step: Mark Arrived */}
                        {b.status === 'booked' && (
                          <button
                            id={`action-arrive-${b.id}`}
                            onClick={() => markArrived(b.id)}
                            className="px-2.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold transition-all text-xs flex items-center gap-1 shadow-2xs"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Check-In</span>
                          </button>
                        )}

                        {/* Step: Call Token */}
                        {b.status === 'arrived' && (
                          <button
                            id={`action-call-${b.id}`}
                            onClick={() => callToken(b.id)}
                            className="px-2.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold transition-all text-xs flex items-center gap-1 shadow-2xs"
                          >
                            <PhoneCall className="w-3.5 h-3.5" />
                            <span>Call to Gate</span>
                          </button>
                        )}

                        {/* Step: Enter Weighing */}
                        {(b.status === 'called' || (b.status === 'in_progress' && !b.weighingDetails)) && (
                          <button
                            id={`action-weigh-${b.id}`}
                            onClick={() => handleOpenWeighing(b)}
                            className="px-2.5 py-1.5 rounded-lg bg-purple-700 hover:bg-purple-800 text-white font-bold transition-all text-xs flex items-center gap-1 shadow-2xs"
                          >
                            <Scale className="w-3.5 h-3.5" />
                            <span>Weigh Slip</span>
                          </button>
                        )}

                        {/* Step: Quality Check */}
                        {b.weighingDetails && !b.qualityDetails && (
                          <button
                            id={`action-quality-${b.id}`}
                            onClick={() => handleOpenQuality(b)}
                            className="px-2.5 py-1.5 rounded-lg bg-teal-700 hover:bg-teal-800 text-white font-bold transition-all text-xs flex items-center gap-1 shadow-2xs"
                          >
                            <ShieldCheck className="w-3.5 h-3.5" />
                            <span>Grade Check</span>
                          </button>
                        )}

                        {/* Step: Approve Final Voucher */}
                        {b.qualityDetails && b.status !== 'completed' && (
                          <button
                            id={`action-approve-${b.id}`}
                            onClick={() => approvePaymentVoucher(b.id)}
                            className="px-2.5 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-bold transition-all text-xs flex items-center gap-1 shadow-2xs"
                          >
                            <FileText className="w-3.5 h-3.5" />
                            <span>Approve Voucher</span>
                          </button>
                        )}

                        {/* Step: Completed view */}
                        {b.status === 'completed' && (
                          <span className="text-emerald-700 font-bold flex items-center gap-1">
                            <CheckCircle2 className="w-4 h-4" /> Settled
                          </span>
                        )}

                      </div>
                    </td>

                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

      </div>
      )}

      {/* SUBTAB 2: YARD REGISTERED FARMERS & QUOTA VERIFICATION */}
      {operatorTab === 'registered_farmers' && (
        <div className="bg-white rounded-3xl border border-stone-200 shadow-sm overflow-hidden space-y-4 p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 pb-4">
            <div>
              <h3 className="font-bold text-stone-900 text-base">
                APMC Yard Registered Farmers & 7/12 Land Quota Registry
              </h3>
              <p className="text-xs text-stone-500">
                Gate-level physical verification of registered farmers under {currentCentre.name} jurisdiction.
              </p>
            </div>

            <div className="relative w-full sm:w-72">
              <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Search Farmer ID, Name, Village..."
                value={farmerSearchQuery}
                onChange={(e) => setFarmerSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border border-stone-300 bg-stone-50 focus:bg-white focus:ring-2 focus:ring-amber-500 text-stone-800"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 border-b border-stone-200 text-stone-500 font-bold uppercase tracking-wider">
                <tr>
                  <th className="px-4 py-3.5">Farmer ID & Name</th>
                  <th className="px-4 py-3.5">Contact & Village</th>
                  <th className="px-4 py-3.5">Land Area & MSP Quota</th>
                  <th className="px-4 py-3.5">7/12 e-Dhara Record</th>
                  <th className="px-4 py-3.5">Aadhaar Bank DBT</th>
                  <th className="px-4 py-3.5">Active Token Status</th>
                  <th className="px-4 py-3.5 text-right">Gate Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 font-medium text-stone-800">
                {filteredYardFarmers.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-10 text-stone-400">
                      No registered farmers found matching the search.
                    </td>
                  </tr>
                ) : (
                  filteredYardFarmers.map((farmer) => {
                    const activeBooking = bookings.find(b => b.farmerId === farmer.id && b.centreId === selectedCentreId) || bookings.find(b => b.farmerId === farmer.id);
                    return (
                      <tr key={farmer.id} className="hover:bg-stone-50/70 transition-colors">
                        <td className="px-4 py-4">
                          <div className="font-bold text-stone-900 text-sm">{farmer.fullName}</div>
                          <div className="font-mono text-[11px] text-amber-900 font-bold">{farmer.id}</div>
                        </td>

                        <td className="px-4 py-4">
                          <div className="font-mono text-stone-800">{farmer.mobileNumber}</div>
                          <div className="text-[11px] text-stone-500">{farmer.village}, {farmer.district}</div>
                        </td>

                        <td className="px-4 py-4">
                          <span className="font-mono font-bold text-stone-900">{farmer.landAreaAcres} Acres</span>
                          <span className="text-[10px] text-stone-500 block">
                            Max Limit: {farmer.landAreaAcres * 25} Qtl
                          </span>
                        </td>

                        <td className="px-4 py-4">
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            <span>e-Dhara Passed</span>
                          </span>
                        </td>

                        <td className="px-4 py-4">
                          <div className="text-stone-800 font-semibold text-[11px]">{farmer.bankName}</div>
                          <div className="font-mono text-[10px] text-teal-700">Aadhaar Linked (••••{farmer.bankAccountEnding})</div>
                        </td>

                        <td className="px-4 py-4">
                          {activeBooking ? (
                            <span className="font-mono font-bold text-xs text-amber-800 bg-amber-50 px-2 py-1 rounded-lg border border-amber-200 block">
                              {activeBooking.tokenNumber} ({activeBooking.status})
                              <span className="block text-[10px] text-stone-500 font-normal">{activeBooking.centreName}</span>
                            </span>
                          ) : (
                            <span className="text-stone-400 text-xs italic">No active token today</span>
                          )}
                        </td>

                        <td className="px-4 py-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              type="button"
                              onClick={() => setSelectedFarmerDossier(farmer)}
                              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-stone-300 hover:bg-stone-100 text-stone-800 text-xs font-bold transition-all"
                            >
                              <Eye className="w-3.5 h-3.5 text-amber-700" />
                              <span>Dossier</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => {
                                const newPass = issueWalkInToken(farmer.id, selectedCentreId);
                                setInwardPassSuccess(`Gate Inward Pass generated: Token ${newPass.tokenNumber} for ${farmer.fullName} (${farmer.id}) at ${currentCentre.name}.`);
                              }}
                              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition-all shadow-2xs"
                            >
                              <Check className="w-3.5 h-3.5" />
                              <span>Gate Pass</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Farmer Dossier Modal for Operator */}
      {selectedFarmerDossier && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full border border-stone-200 shadow-2xl overflow-hidden p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-amber-700" />
                <div>
                  <h4 className="font-bold text-stone-900 text-sm">
                    Farmer Registration & Inward Verification
                  </h4>
                  <p className="text-[11px] text-stone-500 font-mono">
                    ID: {selectedFarmerDossier.id}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedFarmerDossier(null)}
                className="p-1.5 rounded-full hover:bg-stone-100 text-stone-400 hover:text-stone-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-stone-700">
              <div className="grid grid-cols-2 gap-3 p-3 bg-stone-50 rounded-2xl border border-stone-200">
                <div>
                  <span className="text-[11px] text-stone-500 block">Farmer Full Name</span>
                  <span className="font-bold text-stone-900 text-sm">{selectedFarmerDossier.fullName}</span>
                </div>
                <div>
                  <span className="text-[11px] text-stone-500 block">Registered Mobile</span>
                  <span className="font-mono font-bold text-stone-900">{selectedFarmerDossier.mobileNumber}</span>
                </div>
                <div>
                  <span className="text-[11px] text-stone-500 block">District & Taluka</span>
                  <span className="font-semibold text-stone-800">{selectedFarmerDossier.district}, {selectedFarmerDossier.taluka}</span>
                </div>
                <div>
                  <span className="text-[11px] text-stone-500 block">Village</span>
                  <span className="font-semibold text-stone-800">{selectedFarmerDossier.village}</span>
                </div>
              </div>

              {/* 7/12 Land Record */}
              <div className="p-3 bg-amber-50/70 rounded-2xl border border-amber-200 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-amber-950 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-amber-700" />
                    e-Dhara 7/12 Land Verification
                  </span>
                  <span className="font-mono font-bold text-amber-900 bg-white px-2 py-0.5 rounded border border-amber-300">
                    {selectedFarmerDossier.landAreaAcres} Acres
                  </span>
                </div>
                <p className="text-[11px] text-amber-900">
                  Total Seasonal MSP Quota Limit: <strong className="font-mono">{selectedFarmerDossier.landAreaAcres * 25} Quintals</strong>.
                </p>
              </div>

              {/* Bank & Aadhaar DBT */}
              <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200 space-y-1">
                <span className="font-bold text-stone-900 flex items-center gap-1.5">
                  <CreditCard className="w-4 h-4 text-emerald-700" />
                  Bank Account & DBT Direct Mandate
                </span>
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div>
                    <span className="text-stone-500 block">Bank Name:</span>
                    <span className="font-bold text-stone-900">{selectedFarmerDossier.bankName}</span>
                  </div>
                  <div>
                    <span className="text-stone-500 block">IFSC Code:</span>
                    <span className="font-mono font-bold text-stone-900">{selectedFarmerDossier.ifscCode}</span>
                  </div>
                  <div>
                    <span className="text-stone-500 block">Aadhaar Linked A/C:</span>
                    <span className="font-mono font-bold text-stone-900">•••• {selectedFarmerDossier.bankAccountEnding}</span>
                  </div>
                  <div>
                    <span className="text-stone-500 block">KCC No:</span>
                    <span className="font-mono font-bold text-stone-900">{selectedFarmerDossier.kccNumber}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between">
              <button
                type="button"
                onClick={() => {
                  setInwardPassSuccess(`Gate Inward Pass pre-approved for ${selectedFarmerDossier.fullName}.`);
                  setSelectedFarmerDossier(null);
                }}
                className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition-all"
              >
                Clear Gate Inward Pass
              </button>
              <button
                type="button"
                onClick={() => setSelectedFarmerDossier(null)}
                className="px-4 py-2 bg-stone-200 hover:bg-stone-300 text-stone-800 rounded-xl text-xs font-bold transition-all"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Weighbridge Input Modal */}
      {weighingModalBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full border border-stone-200 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div className="flex items-center gap-2">
                <Scale className="w-5 h-5 text-purple-700" />
                <h3 className="font-bold text-stone-900 text-base">Electronic Weighbridge Slip</h3>
              </div>
              <span className="font-mono text-xs font-bold bg-stone-100 px-2 py-0.5 rounded">
                Token: {weighingModalBooking.tokenNumber}
              </span>
            </div>

            <p className="text-xs text-stone-600">
              Farmer: <strong>{weighingModalBooking.farmerName}</strong> • Crop: {weighingModalBooking.cropName}
            </p>

            <form onSubmit={handleSaveWeighing} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Gross Weight (Vehicle + Produce) in KG
                </label>
                <input
                  type="number"
                  required
                  value={grossInput}
                  onChange={(e) => setGrossInput(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 font-mono font-bold text-base"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Tare Weight (Empty Vehicle / Trolley) in KG
                </label>
                <input
                  type="number"
                  required
                  value={tareInput}
                  onChange={(e) => setTareInput(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 font-mono font-bold text-base"
                />
              </div>

              {/* Calculated Net Weight Preview */}
              <div className="p-3 bg-purple-50 rounded-xl border border-purple-200 flex items-center justify-between text-xs">
                <span className="text-purple-900 font-bold">Calculated Net Weight:</span>
                <span className="font-mono font-black text-purple-950 text-base">
                  {Math.round(((Math.max(0, grossInput - tareInput)) / 100) * 10) / 10} Quintals ({Math.max(0, grossInput - tareInput)} kg)
                </span>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setWeighingModalBooking(null)}
                  className="px-4 py-2 rounded-xl border border-stone-300 text-xs font-semibold text-stone-600 hover:bg-stone-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-purple-700 hover:bg-purple-800 text-white text-xs font-bold shadow-sm"
                >
                  Save Weighbridge Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Quality Verification Modal */}
      {qualityModalBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full border border-stone-200 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-teal-700" />
                <h3 className="font-bold text-stone-900 text-base">Quality & Moisture Assay</h3>
              </div>
              <span className="font-mono text-xs font-bold bg-stone-100 px-2 py-0.5 rounded">
                Token: {qualityModalBooking.tokenNumber}
              </span>
            </div>

            <form onSubmit={handleSaveQuality} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Assigned Quality Grade
                </label>
                <select
                  value={selectedGrade}
                  onChange={(e) => setSelectedGrade(e.target.value as QualityGrade)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs font-bold bg-white"
                >
                  <option value="Grade A">Grade A (FAQ Standard - 0% Deduction)</option>
                  <option value="Grade B">Grade B (Marginal Dockage)</option>
                  <option value="Grade C">Grade C (Sub-Standard)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Moisture % (Digital Meter)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={moistureInput}
                    onChange={(e) => setMoistureInput(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 font-mono font-bold text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Foreign Matter / Dockage %
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={dockageInput}
                    onChange={(e) => setDockageInput(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 font-mono font-bold text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Quality Inspector Remark
                </label>
                <input
                  type="text"
                  value={inspectorNotes}
                  onChange={(e) => setInspectorNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setQualityModalBooking(null)}
                  className="px-4 py-2 rounded-xl border border-stone-300 text-xs font-semibold text-stone-600 hover:bg-stone-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold shadow-sm"
                >
                  Approve Quality Certification
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
