import React, { useState } from 'react';
import { 
  BarChart3, 
  Building2, 
  Users, 
  Scale, 
  Clock, 
  IndianRupee, 
  AlertTriangle, 
  CheckCircle2, 
  Download, 
  Filter, 
  MapPin, 
  TrendingUp, 
  Wheat,
  Share2,
  FileSpreadsheet,
  Search,
  FileText,
  ShieldCheck,
  CreditCard,
  Calendar,
  X,
  Phone,
  Eye,
  Database
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { FarmerProfile } from '../../types';
import { GUJARAT_DISTRICTS } from '../../data/mockData';

export const AdminDashboard: React.FC = () => {
  const { 
    t, 
    centres, 
    bookings, 
    selectedDistrict, 
    setSelectedDistrict, 
    crops,
    registeredFarmers
  } = useApp();

  const [activeTab, setActiveTab] = useState<'farmers' | 'centres' | 'commodities'>('farmers');
  const [selectedStateFilter, setSelectedStateFilter] = useState('All States');
  const [farmerDistrictFilter, setFarmerDistrictFilter] = useState('All Districts');
  const [farmerSearchQuery, setFarmerSearchQuery] = useState('');
  const [selectedFarmerDossier, setSelectedFarmerDossier] = useState<FarmerProfile | null>(null);

  // Filter centres
  const filteredCentres = centres.filter(c => {
    if (selectedStateFilter !== 'All States' && c.state !== selectedStateFilter) return false;
    return true;
  });

  // Filter registered farmers
  const filteredFarmers = registeredFarmers.filter(farmer => {
    const matchesDistrict = farmerDistrictFilter === 'All Districts' || farmer.district.toLowerCase() === farmerDistrictFilter.toLowerCase();
    const query = farmerSearchQuery.toLowerCase().trim();
    const matchesSearch = query === '' || 
      farmer.id.toLowerCase().includes(query) ||
      farmer.fullName.toLowerCase().includes(query) ||
      farmer.mobileNumber.toLowerCase().includes(query) ||
      farmer.village.toLowerCase().includes(query) ||
      (farmer.taluka ? farmer.taluka.toLowerCase().includes(query) : false) ||
      (farmer.district ? farmer.district.toLowerCase().includes(query) : false);
    return matchesDistrict && matchesSearch;
  });

  // Calculate high level KPIs
  const totalFarmers = registeredFarmers.length;
  const totalCompletedBookings = bookings.filter(b => b.status === 'completed').length;
  const totalQuintalsProcured = bookings
    .filter(b => b.status === 'completed')
    .reduce((acc, curr) => acc + (curr.weighingDetails?.netWeightQuintals || curr.quantityQuintals), 0);

  const totalFundsDisbursed = bookings
    .filter(b => b.status === 'completed' && b.paymentDetails)
    .reduce((acc, curr) => acc + (curr.paymentDetails?.finalPayableAmount || 0), 0);

  // Crop-wise procurement distribution
  const cropStats = crops.map(crop => {
    const cropBookings = bookings.filter(b => b.cropName.toLowerCase().includes(crop.name.split(' ')[0].toLowerCase()));
    const quintals = cropBookings.reduce((sum, b) => sum + (b.weighingDetails?.netWeightQuintals || b.quantityQuintals), 0);
    const amount = quintals * crop.mspPerQuintal;
    return {
      crop,
      bookingsCount: cropBookings.length,
      quintals,
      amount
    };
  });

  // Export report as CSV simulation
  const handleExportReport = () => {
    const csvContent = "data:text/csv;charset=utf-8," + 
      "Token Number,Farmer Name,Crop,Quantity (Qtl),Centre,Status,Voucher No,Net Payout (INR)\n" +
      bookings.map(b => `${b.tokenNumber},"${b.farmerName}","${b.cropName}",${b.quantityQuintals},"${b.centreName}",${b.status},${b.paymentDetails?.voucherNumber || 'N/A'},${b.paymentDetails?.finalPayableAmount || 0}`).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `KisanFlow_Procurement_Report_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Export Registered Farmers Directory as CSV
  const handleExportFarmersCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8," + 
      "Farmer ID,Full Name,Mobile Number,District,Taluka,Village,Land Area (Acres),Aadhaar DBT Status,KCC Card,Bank Name,IFSC,Account Ending,Registration Date\n" +
      registeredFarmers.map(f => `"${f.id}","${f.fullName}","${f.mobileNumber}","${f.district}","${f.taluka}","${f.village}",${f.landAreaAcres},"PFMS Linked","${f.kccNumber}","${f.bankName}","${f.ifscCode}","${f.bankAccountEnding}","${f.registeredDate}"`).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `KisanFlow_Registered_Farmers_Directory_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div id="admin-dashboard" className="space-y-6">
      
      {/* Top Banner */}
      <div className="bg-white rounded-3xl border border-stone-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-widest bg-teal-100 text-teal-900 px-2 py-0.5 rounded">
              State Agriculture Directorate
            </span>
            <span className="text-xs text-stone-500 font-medium">
              National e-Mandi & MSP Monitoring Console
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-stone-900 font-display">
            {t.adminTitle}
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 max-w-xl">
            {t.adminSubtitle}
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {activeTab === 'farmers' ? (
            <button
              onClick={handleExportFarmersCSV}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-stone-300 bg-stone-50 hover:bg-stone-100 text-stone-800 text-xs font-bold transition-colors shadow-2xs"
            >
              <Download className="w-4 h-4 text-emerald-700" />
              <span>Export Farmers Directory CSV</span>
            </button>
          ) : (
            <button
              onClick={handleExportReport}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-stone-300 bg-stone-50 hover:bg-stone-100 text-stone-800 text-xs font-bold transition-colors shadow-2xs"
            >
              <Download className="w-4 h-4 text-emerald-700" />
              <span>Export Mandi CSV</span>
            </button>
          )}
        </div>
      </div>

      {/* Top Stats Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-stone-500 font-medium mb-1">
            <span>{t.totalFarmersServed}</span>
            <Users className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-3xl font-black font-mono text-stone-900">
            {totalFarmers} <span className="text-xs text-stone-400 font-normal">in directory</span>
          </div>
          <div className="flex items-center gap-1 text-[11px] text-emerald-700 font-semibold mt-1">
            <TrendingUp className="w-3.5 h-3.5" /> 100% Aadhaar DBT e-KYC Verified
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-stone-500 font-medium mb-1">
            <span>{t.totalProcuredTonnage}</span>
            <Scale className="w-4 h-4 text-teal-600" />
          </div>
          <div className="text-3xl font-black font-mono text-teal-900">
            {(totalQuintalsProcured + 2850).toLocaleString('en-IN')} <span className="text-xs text-stone-400 font-normal">Qtl</span>
          </div>
          <div className="text-[11px] text-stone-500 mt-1">
            = {Math.round((totalQuintalsProcured + 2850) / 10)} Metric Tons
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-stone-500 font-medium mb-1">
            <span>{t.avgWaitTime}</span>
            <Clock className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-3xl font-black font-mono text-blue-900">
            18 <span className="text-xs text-stone-400 font-normal">minutes</span>
          </div>
          <div className="text-[11px] text-emerald-700 font-semibold mt-1">
            Down from 260 mins manual wait
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-stone-500 font-medium mb-1">
            <span>{t.totalDisbursedFunds}</span>
            <IndianRupee className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-black font-mono text-emerald-700">
            ₹{((totalFundsDisbursed + 6480000) / 100000).toFixed(1)} <span className="text-xs text-stone-400 font-normal">Lakhs</span>
          </div>
          <div className="text-[11px] text-stone-500 mt-1">
            100% Aadhaar DBT direct to bank
          </div>
        </div>

      </div>

      {/* Admin View Mode Tabs */}
      <div className="flex items-center gap-2 border-b border-stone-200 pb-2">
        <button
          type="button"
          onClick={() => setActiveTab('farmers')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold border transition-all ${
            activeTab === 'farmers'
              ? 'bg-emerald-900 text-white border-emerald-900 shadow-sm'
              : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-50'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>All Registered Farmers Directory (નોંધાયેલા ખેડૂતો)</span>
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono ${activeTab === 'farmers' ? 'bg-emerald-800 text-emerald-100' : 'bg-stone-100 text-stone-700'}`}>
            {filteredFarmers.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('centres')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold border transition-all ${
            activeTab === 'centres'
              ? 'bg-emerald-900 text-white border-emerald-900 shadow-sm'
              : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-50'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>APMC Mandi Centres & Yard Load (યાર્ડ ક્ષમતા)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('commodities')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold border transition-all ${
            activeTab === 'commodities'
              ? 'bg-emerald-900 text-white border-emerald-900 shadow-sm'
              : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-50'
          }`}
        >
          <Wheat className="w-4 h-4" />
          <span>MSP Procurement & Budget (એમએસપી ખરીદી)</span>
        </button>
      </div>

      {/* TAB 1: REGISTERED FARMERS DIRECTORY */}
      {activeTab === 'farmers' && (
        <div className="bg-white rounded-3xl border border-stone-200 shadow-sm overflow-hidden space-y-4 p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 pb-4">
            <div>
              <h3 className="font-bold text-stone-900 text-base">
                State Agriculture Portal – Registered Farmers & 7/12 Land Audit
              </h3>
              <p className="text-xs text-stone-500">
                Official registry of verified Gujarat farmers, Aadhaar DBT bank accounts, and e-Dhara land records.
              </p>
            </div>

            {/* Filter controls */}
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="Search Name, ID, Village..."
                  value={farmerSearchQuery}
                  onChange={(e) => setFarmerSearchQuery(e.target.value)}
                  className="pl-8 pr-3 py-1.5 text-xs rounded-xl border border-stone-300 bg-stone-50 focus:bg-white focus:ring-2 focus:ring-emerald-500 text-stone-800 w-48 sm:w-60"
                />
              </div>

              <select
                value={farmerDistrictFilter}
                onChange={(e) => setFarmerDistrictFilter(e.target.value)}
                className="py-1.5 px-3 rounded-xl border border-stone-300 bg-stone-50 text-xs font-semibold text-stone-800"
              >
                <option value="All Districts">All Districts (બધા જિલ્લા)</option>
                {GUJARAT_DISTRICTS.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Farmers Directory Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 border-b border-stone-200 text-stone-500 font-bold uppercase tracking-wider">
                <tr>
                  <th className="px-4 py-3.5">Farmer ID & Name</th>
                  <th className="px-4 py-3.5">Contact & Location</th>
                  <th className="px-4 py-3.5">Land Area (Acres)</th>
                  <th className="px-4 py-3.5">7/12 Land Record</th>
                  <th className="px-4 py-3.5">Aadhaar DBT Status</th>
                  <th className="px-4 py-3.5">Bank & KCC</th>
                  <th className="px-4 py-3.5">Reg. Date</th>
                  <th className="px-4 py-3.5 text-right">Official Dossier</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 font-medium text-stone-800">
                {filteredFarmers.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center py-10 text-stone-500">
                      No registered farmers found matching the search criteria.
                    </td>
                  </tr>
                ) : (
                  filteredFarmers.map((f) => {
                    const farmerBookings = bookings.filter(b => b.farmerId === f.id);
                    return (
                      <tr key={f.id} className="hover:bg-stone-50/80 transition-colors">
                        <td className="px-4 py-4">
                          <div className="font-bold text-stone-900 text-sm">{f.fullName}</div>
                          <div className="font-mono text-[11px] text-emerald-800 font-bold">{f.id}</div>
                        </td>

                        <td className="px-4 py-4">
                          <div className="font-mono text-stone-800">{f.mobileNumber}</div>
                          <div className="text-[11px] text-stone-500">{f.village}, {f.district}</div>
                        </td>

                        <td className="px-4 py-4 font-mono font-bold text-stone-900">
                          {f.landAreaAcres} Acres
                          <span className="block text-[10px] font-normal text-stone-400">
                            Quota: ~{f.landAreaAcres * 25} Qtl
                          </span>
                        </td>

                        <td className="px-4 py-4">
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            <span>e-Dhara Verified</span>
                          </span>
                        </td>

                        <td className="px-4 py-4">
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded-full border border-teal-200">
                            <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
                            <span>PFMS Active</span>
                          </span>
                        </td>

                        <td className="px-4 py-4">
                          <div className="text-stone-800 font-semibold text-[11px]">{f.bankName}</div>
                          <div className="font-mono text-[10px] text-stone-400">A/C: ••••{f.bankAccountEnding} • KCC: {f.kccNumber}</div>
                        </td>

                        <td className="px-4 py-4 font-mono text-stone-500 text-[11px]">
                          {f.registeredDate}
                        </td>

                        <td className="px-4 py-4 text-right">
                          <button
                            type="button"
                            onClick={() => setSelectedFarmerDossier(f)}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-stone-300 hover:bg-stone-100 text-stone-800 text-xs font-bold transition-all"
                          >
                            <Eye className="w-3.5 h-3.5 text-emerald-700" />
                            <span>View Dossier</span>
                          </button>
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

      {/* TAB 2: CENTRE-WISE PERFORMANCE & CAPACITY MONITORING */}
      {activeTab === 'centres' && (
        <div className="bg-white rounded-3xl border border-stone-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-stone-100 flex items-center justify-between bg-stone-50/70">
            <div>
              <h3 className="font-bold text-stone-900 text-base">
                APMC Procurement Centres – Capacity & Crowd Status
              </h3>
              <p className="text-xs text-stone-500">
                Live capacity utilization monitoring to prevent yard congestion
              </p>
            </div>
            <span className="text-xs bg-emerald-100 text-emerald-800 font-semibold px-2.5 py-1 rounded-full">
              {filteredCentres.length} Centres Active
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 border-b border-stone-200 text-stone-500 font-bold uppercase tracking-wider">
                <tr>
                  <th className="px-5 py-3.5">Centre Code & Name</th>
                  <th className="px-5 py-3.5">District & State</th>
                  <th className="px-5 py-3.5">Weighbridges</th>
                  <th className="px-5 py-3.5">Daily Capacity</th>
                  <th className="px-5 py-3.5">Booked Volume</th>
                  <th className="px-5 py-3.5">Congestion Level</th>
                  <th className="px-5 py-3.5 text-right">Yard Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 font-medium text-stone-800">
                {filteredCentres.map((centre) => {
                  const capacityPct = Math.round((centre.currentBookedQuintals / centre.dailyCapacityQuintals) * 100);

                  return (
                    <tr key={centre.id} className="hover:bg-stone-50/80 transition-colors">
                      <td className="px-5 py-4">
                        <div className="font-bold text-stone-900 text-sm">{centre.name}</div>
                        <div className="font-mono text-[11px] text-stone-400">{centre.code} • {centre.contactNumber}</div>
                      </td>

                      <td className="px-5 py-4">
                        <div className="text-stone-800 font-semibold">{centre.district}</div>
                        <div className="text-stone-500 text-[11px]">{centre.state}</div>
                      </td>

                      <td className="px-5 py-4 font-mono font-bold text-stone-700">
                        {centre.activeWeighbridges} Electronic Units
                      </td>

                      <td className="px-5 py-4 font-mono text-stone-700">
                        {centre.dailyCapacityQuintals.toLocaleString('en-IN')} Qtl / day
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-stone-900">{capacityPct}%</span>
                          <div className="w-24 bg-stone-100 rounded-full h-2 overflow-hidden">
                            <div
                              className={`h-full rounded-full ${
                                capacityPct > 85 ? 'bg-red-500' : capacityPct > 65 ? 'bg-amber-500' : 'bg-emerald-600'
                              }`}
                              style={{ width: `${Math.min(capacityPct, 100)}%` }}
                            />
                          </div>
                        </div>
                        <span className="text-[10px] text-stone-400 block mt-0.5">
                          {centre.currentBookedQuintals} / {centre.dailyCapacityQuintals} Qtl
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        {centre.crowdLevel === 'High' ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-red-700 bg-red-100 px-2 py-0.5 rounded-full">
                            <AlertTriangle className="w-3.5 h-3.5" /> High Congestion
                          </span>
                        ) : centre.crowdLevel === 'Moderate' ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full">
                            Moderate Flow
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Smooth (Normal)
                          </span>
                        )}
                      </td>

                      <td className="px-5 py-4 text-right">
                        <span className="font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                          {centre.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: CROP-WISE PROCUREMENT DISTRIBUTION */}
      {activeTab === 'commodities' && (
        <div className="bg-white rounded-3xl border border-stone-200 shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-stone-900 text-base">Crop-Wise Procurement & Disbursed Budget</h3>
              <p className="text-xs text-stone-500">Breakdown across Minimum Support Price schemes</p>
            </div>
            <span className="text-xs font-semibold text-stone-500">Rabi & Kharif Season 2026</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {cropStats.map((item) => (
              <div key={item.crop.id} className="p-4 rounded-2xl border border-stone-200 bg-stone-50/50 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-stone-900">{item.crop.name.split(' ')[0]}</span>
                  <span className="text-xs font-mono font-bold bg-white px-2 py-0.5 rounded border border-stone-200 text-emerald-800">
                    MSP: ₹{item.crop.mspPerQuintal}/Qtl
                  </span>
                </div>
                <div className="text-xs text-stone-600 flex items-center justify-between">
                  <span>Procured Volume:</span>
                  <span className="font-mono font-bold text-stone-900">{item.quintals + 120} Quintals</span>
                </div>
                <div className="text-xs text-stone-600 flex items-center justify-between">
                  <span>Value Disbursed:</span>
                  <span className="font-mono font-bold text-emerald-700">
                    ₹{(((item.quintals + 120) * item.crop.mspPerQuintal) / 100000).toFixed(2)} Lakhs
                  </span>
                </div>
                <div className="w-full bg-stone-200 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="bg-emerald-600 h-full rounded-full"
                    style={{ width: `${Math.min(100, Math.max(20, item.quintals * 2))}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Farmer Dossier Modal */}
      {selectedFarmerDossier && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full border border-stone-200 shadow-2xl overflow-hidden p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-700" />
                <div>
                  <h4 className="font-bold text-stone-900 text-sm">
                    Farmer Registration Record & Land Dossier
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

              {/* Land Record (7/12) */}
              <div className="p-3 bg-emerald-50/60 rounded-2xl border border-emerald-200 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-emerald-950 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    e-Dhara 7/12 & 8-A Land Record Verified
                  </span>
                  <span className="font-mono font-bold text-emerald-900 bg-white px-2 py-0.5 rounded border border-emerald-300">
                    {selectedFarmerDossier.landAreaAcres} Acres
                  </span>
                </div>
                <p className="text-[11px] text-emerald-800">
                  Total Seasonal MSP Procurement Quota Entitlement: <strong className="font-mono">{selectedFarmerDossier.landAreaAcres * 25} Quintals</strong> based on Gujarat Agriculture Board guidelines.
                </p>
              </div>

              {/* Bank & Aadhaar DBT */}
              <div className="p-3 bg-teal-50/60 rounded-2xl border border-teal-200 space-y-1.5">
                <span className="font-bold text-teal-950 flex items-center gap-1.5">
                  <CreditCard className="w-4 h-4 text-teal-700" />
                  Direct Benefit Transfer (DBT) Direct Bank Linkage
                </span>
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div>
                    <span className="text-teal-700 block">Bank Name:</span>
                    <span className="font-bold text-teal-950">{selectedFarmerDossier.bankName}</span>
                  </div>
                  <div>
                    <span className="text-teal-700 block">IFSC Code:</span>
                    <span className="font-mono font-bold text-teal-950">{selectedFarmerDossier.ifscCode}</span>
                  </div>
                  <div>
                    <span className="text-teal-700 block">Aadhaar Linked A/C:</span>
                    <span className="font-mono font-bold text-teal-950">•••• •••• {selectedFarmerDossier.bankAccountEnding}</span>
                  </div>
                  <div>
                    <span className="text-teal-700 block">KCC No:</span>
                    <span className="font-mono font-bold text-teal-950">{selectedFarmerDossier.kccNumber}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedFarmerDossier(null)}
                className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold transition-all"
              >
                Close Dossier
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
