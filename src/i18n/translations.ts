import { Language } from '../types';

export interface Translations {
  appName: string;
  tagline: string;
  taglineSub: string;
  navFarmer: string;
  navOperator: string;
  navAdmin: string;
  
  // Step names
  step1: string;
  step2: string;
  step3: string;
  step4: string;
  step5: string;
  step6: string;
  step7: string;
  step8: string;
  step9: string;
  step10: string;
  step11: string;

  // Language selection
  selectLanguageTitle: string;
  selectLanguageDesc: string;
  continueBtn: string;
  backBtn: string;
  submitBtn: string;
  saveBtn: string;
  cancelBtn: string;
  confirmBtn: string;

  // District Selection
  selectLocationTitle: string;
  selectLocationDesc: string;
  stateLabel: string;
  districtLabel: string;
  villageLabel: string;
  availableCentresInDistrict: string;

  // Centre Selection
  selectCentreTitle: string;
  selectCentreDesc: string;
  dailyCapacity: string;
  crowdLevel: string;
  workingHours: string;
  statusOpen: string;
  statusCrowded: string;
  statusNormal: string;
  selectThisCentre: string;
  selectedCentre: string;

  // Farmer Registration
  farmerRegTitle: string;
  farmerRegDesc: string;
  fullName: string;
  mobileNumber: string;
  landArea: string;
  landAreaUnit: string;
  farmerIdGenerated: string;

  // Produce Registration
  produceRegTitle: string;
  produceRegDesc: string;
  cropType: string;
  expectedQuantity: string;
  quintals: string;
  harvestDate: string;
  qualityCategory: string;
  govMspPrice: string;
  estimatedTotalValue: string;

  // Slot Booking
  slotBookingTitle: string;
  slotBookingDesc: string;
  selectDate: string;
  availableSlots: string;
  slotsRemaining: string;
  slotFull: string;
  bookedSuccessfully: string;

  // Digital Token
  digitalTokenTitle: string;
  digitalTokenDesc: string;
  tokenNumber: string;
  queuePosition: string;
  assignedTime: string;
  estimatedWait: string;
  printToken: string;
  shareToken: string;
  trackLiveQueue: string;

  // Live Queue & Tracking
  liveQueueTitle: string;
  nowServing: string;
  yourTurnIn: string;
  farmersAhead: string;
  statusBooked: string;
  statusArrived: string;
  statusWaiting: string;
  statusCalled: string;
  statusInProgress: string;
  statusCompleted: string;

  // 7 Stages
  stage1: string;
  stage2: string;
  stage3: string;
  stage4: string;
  stage5: string;
  stage6: string;
  stage7: string;

  // Payment
  paymentTitle: string;
  paymentDesc: string;
  approvedQuantity: string;
  mspRate: string;
  grossAmount: string;
  deductions: string;
  finalPayable: string;
  paymentStatus: string;
  dbtTransferNotice: string;

  // Operator
  operatorTitle: string;
  operatorSubtitle: string;
  callNextToken: string;
  checkInFarmer: string;
  enterWeighbridgeData: string;
  verifyQuality: string;
  approveProcurement: string;

  // Admin
  adminTitle: string;
  adminSubtitle: string;
  totalFarmersServed: string;
  totalProcuredTonnage: string;
  avgWaitTime: string;
  totalDisbursedFunds: string;
  centreCongestionAlerts: string;
}

export const translations: Record<Language, Translations> = {
  en: {
    appName: "KisanFlow",
    tagline: "Know when to arrive. Know what happens next. Know when you get paid.",
    taglineSub: "Smart Agricultural Procurement & Slot Management System",
    navFarmer: "Farmer Portal",
    navOperator: "APMC Operator Desk",
    navAdmin: "Govt Analytics",

    step1: "Language",
    step2: "District & Village",
    step3: "Procurement Centre",
    step4: "Farmer Profile",
    step5: "Produce Registration",
    step6: "Smart Slot Booking",
    step7: "Digital Token",
    step8: "Centre Arrival",
    step9: "Live Queue",
    step10: "Produce Tracking",
    step11: "Payment & DBT",

    selectLanguageTitle: "Choose Your Language / भाषा चुनें / ભાષા પસંદ કરો",
    selectLanguageDesc: "Select your preferred language to proceed with agricultural procurement services.",
    continueBtn: "Continue",
    backBtn: "Back",
    submitBtn: "Submit",
    saveBtn: "Save",
    cancelBtn: "Cancel",
    confirmBtn: "Confirm & Generate Token",

    selectLocationTitle: "Select State, District & Village",
    selectLocationDesc: "Find designated Government APMC and procurement centres nearest to your fields.",
    stateLabel: "State",
    districtLabel: "District",
    villageLabel: "Village / Gram Panchayat",
    availableCentresInDistrict: "Procurement Centres in this District",

    selectCentreTitle: "Select Procurement Centre",
    selectCentreDesc: "Check live operating status, daily processing capacity, and crowd levels.",
    dailyCapacity: "Daily Capacity",
    crowdLevel: "Crowd Level",
    workingHours: "Working Hours",
    statusOpen: "Open for Booking",
    statusCrowded: "Crowded / High Wait",
    statusNormal: "Normal Flow",
    selectThisCentre: "Select Centre",
    selectedCentre: "Centre Selected",

    farmerRegTitle: "Farmer Registration & Profile",
    farmerRegDesc: "Enter your personal and agricultural details to generate your unique Farmer ID.",
    fullName: "Farmer's Full Name",
    mobileNumber: "Mobile Number (for SMS & Token)",
    landArea: "Land Holding Area",
    landAreaUnit: "Acres",
    farmerIdGenerated: "Unique Farmer ID",

    produceRegTitle: "Produce Registration",
    produceRegDesc: "Declare crop details, harvest date, and expected quantity for verification.",
    cropType: "Select Crop",
    expectedQuantity: "Quantity for Procurement",
    quintals: "Quintals (Qtl)",
    harvestDate: "Harvest / Ready Date",
    qualityCategory: "Expected Grade Category",
    govMspPrice: "Govt MSP Rate",
    estimatedTotalValue: "Estimated Gross Payout",

    slotBookingTitle: "Smart Arrival Slot Booking",
    slotBookingDesc: "Select a convenient time slot. Our algorithm prevents overcrowding and guarantees prompt weighing.",
    selectDate: "Select Arrival Date",
    availableSlots: "Available Time Slots",
    slotsRemaining: "slots remaining",
    slotFull: "Slot Full (Max Capacity)",
    bookedSuccessfully: "Slot Reserved Successfully!",

    digitalTokenTitle: "Your Digital Procurement Token",
    digitalTokenDesc: "Present this digital pass or QR code upon arrival at the procurement centre security gate.",
    tokenNumber: "Token Number",
    queuePosition: "Queue Position",
    assignedTime: "Assigned Arrival Window",
    estimatedWait: "Estimated On-Premise Wait",
    printToken: "Print / Save Slip",
    shareToken: "Share via WhatsApp / SMS",
    trackLiveQueue: "Track Live Queue Status",

    liveQueueTitle: "Real-Time Queue & Arrival Status",
    nowServing: "Now Serving at Gate",
    yourTurnIn: "Approximate Wait Time",
    farmersAhead: "Farmers Ahead of You",
    statusBooked: "Slot Booked",
    statusArrived: "Farmer Arrived",
    statusWaiting: "Waiting for Weighbridge",
    statusCalled: "Token Called",
    statusInProgress: "Inspection in Progress",
    statusCompleted: "Procurement Completed",

    stage1: "Produce Registered",
    stage2: "Slot Booked",
    stage3: "Farmer Arrived at Gate",
    stage4: "Weighing Completed",
    stage5: "Quality Verification",
    stage6: "Procurement Approved",
    stage7: "Procurement Completed & DBT Dispatched",

    paymentTitle: "Procurement Payment & Settlement",
    paymentDesc: "Transparent accounting breakdown of net weight, statutory deductions, and DBT status.",
    approvedQuantity: "Approved Net Weight",
    mspRate: "Fixed MSP Rate",
    grossAmount: "Gross Value",
    deductions: "Moisture & Dockage Deductions",
    finalPayable: "Net Disbursed Amount",
    paymentStatus: "Payment Status",
    dbtTransferNotice: "Amount credited directly into Aadhaar-linked Jan Dhan/Kisan Credit bank account.",

    operatorTitle: "Centre Operations & Queue Console",
    operatorSubtitle: "Manage live gate arrivals, automated weighbridge integration, quality grading, and token flow.",
    callNextToken: "Call Next Token",
    checkInFarmer: "Verify & Mark Arrived",
    enterWeighbridgeData: "Enter Weighbridge Slip",
    verifyQuality: "Quality & Moisture Check",
    approveProcurement: "Approve & Issue Voucher",

    adminTitle: "State Agricultural Procurement Oversight",
    adminSubtitle: "Real-time state & district monitoring dashboard for APMC capacity, arrivals, and MSP disbursements.",
    totalFarmersServed: "Total Farmers Served",
    totalProcuredTonnage: "Total Procured Quantity",
    avgWaitTime: "Average Waiting Time",
    totalDisbursedFunds: "Govt Direct DBT Paid",
    centreCongestionAlerts: "Capacity Congestion Alerts",
  },

  hi: {
    appName: "किसानफ्लो (KisanFlow)",
    tagline: "जानिए कब पहुंचना है। जानिए आगे क्या होगा। जानिए कब भुगतान मिलेगा।",
    taglineSub: "स्मार्ट कृषि खरीद और स्लॉट बुकिंग प्रणाली",
    navFarmer: "किसान पोर्टल",
    navOperator: "खरीद केंद्र ऑपरेटर",
    navAdmin: "सरकारी विश्लेषिकी",

    step1: "भाषा",
    step2: "जिला और गांव",
    step3: "खरीद केंद्र",
    step4: "किसान प्रोफाइल",
    step5: "फसल पंजीकरण",
    step6: "स्मार्ट स्लॉट बुकिंग",
    step7: "डिजिटल टोकन",
    step8: "केंद्र पर आगमन",
    step9: "लाइव कतार",
    step10: "फसल प्रगति ट्रैकिंग",
    step11: "भुगतान और डीबीटी",

    selectLanguageTitle: "अपनी पसंदीदा भाषा चुनें",
    selectLanguageDesc: "कृषि खरीद सेवाओं के लिए अपनी उपयुक्त भाषा का चयन करें।",
    continueBtn: "आगे बढ़ें",
    backBtn: "पीछे जाएं",
    submitBtn: "जमा करें",
    saveBtn: "सुरक्षित करें",
    cancelBtn: "रद्द करें",
    confirmBtn: "पुष्टि करें और टोकन पाएं",

    selectLocationTitle: "राज्य, जिला और गांव चुनें",
    selectLocationDesc: "अपने खेत के निकटतम सरकारी एपीएमसी और खरीद केंद्रों की सूची देखें।",
    stateLabel: "राज्य",
    districtLabel: "जिला",
    villageLabel: "गांव / ग्राम पंचायत",
    availableCentresInDistrict: "इस जिले में उपलब्ध खरीद केंद्र",

    selectCentreTitle: "खरीद केंद्र का चयन करें",
    selectCentreDesc: "केंद्र की दैनिक क्षमता, वर्तमान भीड़ और कार्य समय की जांच करें।",
    dailyCapacity: "दैनिक क्षमता",
    crowdLevel: "भीड़ का स्तर",
    workingHours: "कार्य समय",
    statusOpen: "बुकिंग हेतु खुला",
    statusCrowded: "अत्यधिक भीड़",
    statusNormal: "सामान्य आवाजाही",
    selectThisCentre: "केंद्र चुनें",
    selectedCentre: "चयनित केंद्र",

    farmerRegTitle: "किसान पंजीकरण एवं विवरण",
    farmerRegDesc: "अपनी किसान आईडी उत्पन्न करने के लिए व्यक्तिगत और भूमि विवरण भरें।",
    fullName: "किसान का पूरा नाम",
    mobileNumber: "मोबाइल नंबर (एसएमएस और टोकन के लिए)",
    landArea: "कृषि भूमि का क्षेत्रफल",
    landAreaUnit: "एकड़",
    farmerIdGenerated: "विशिष्ट किसान आईडी",

    produceRegTitle: "फसल पंजीकरण",
    produceRegDesc: "उपज का प्रकार, अनुमानित मात्रा और अपेक्षित ग्रेड दर्ज करें।",
    cropType: "फसल का प्रकार",
    expectedQuantity: "खरीद हेतु मात्रा",
    quintals: "क्विंटल (Qtl)",
    harvestDate: "कटाई / तैयार होने की तिथि",
    qualityCategory: "अपेक्षित गुणवत्ता श्रेणी",
    govMspPrice: "सरकारी एमएसपी दर",
    estimatedTotalValue: "अनुमानित कुल राशि",

    slotBookingTitle: "स्मार्ट आगमन स्लॉट बुकिंग",
    slotBookingDesc: "अपनी सुविधा अनुसार स्लॉट चुनें। हमारी प्रणाली अनावश्यक भीड़ और लंबे इंतजार को रोकती है।",
    selectDate: "आगमन की तिथि चुनें",
    availableSlots: "उपलब्ध समय स्लॉट",
    slotsRemaining: "स्थान शेष",
    slotFull: "स्लॉट पूर्ण (अधिकतम क्षमता)",
    bookedSuccessfully: "स्लॉट सफलतापूर्वक आरक्षित!",

    digitalTokenTitle: "आपका डिजिटल खरीद टोकन",
    digitalTokenDesc: "खरीद केंद्र सुरक्षा द्वार पर यह डिजिटल पास या क्यूआर कोड दिखाएं।",
    tokenNumber: "टोकन संख्या",
    queuePosition: "कतार में स्थान",
    assignedTime: "निर्धारित आगमन समय",
    estimatedWait: "अनुमानित प्रतीक्षा समय",
    printToken: "पर्ची प्रिंट / सहेजें",
    shareToken: "व्हाट्सएप पर साझा करें",
    trackLiveQueue: "लाइव कतार देखें",

    liveQueueTitle: "कतार स्थिति और आगमन प्रगति",
    nowServing: "वर्तमान में चालू टोकन",
    yourTurnIn: "अनुमानित प्रतीक्षा समय",
    farmersAhead: "आपसे आगे कुल किसान",
    statusBooked: "स्लॉट बुक हुआ",
    statusArrived: "किसान उपस्थित",
    statusWaiting: "कांटे की प्रतीक्षा",
    statusCalled: "टोकन बुलाया गया",
    statusInProgress: "जांच जारी है",
    statusCompleted: "खरीद पूर्ण",

    stage1: "फसल पंजीकृत",
    stage2: "स्लॉट बुक हुआ",
    stage3: "केंद्र पर किसान आगमन",
    stage4: "तौल पूर्ण",
    stage5: "गुणवत्ता सत्यापन",
    stage6: "खरीद स्वीकृत",
    stage7: "खरीद संपन्न एवं डीबीटी प्रेषित",

    paymentTitle: "खरीद भुगतान एवं निपटान",
    paymentDesc: "सटीक वजन, कटौती और बैंक खाते में अंतरण की पारदर्शी जानकारी।",
    approvedQuantity: "स्वीकृत शुद्ध वजन",
    mspRate: "एमएसपी समर्थन मूल्य",
    grossAmount: "कुल राशि",
    deductions: "नमी एवं धूल कटौती",
    finalPayable: "शुद्ध देय राशि",
    paymentStatus: "भुगतान स्थिति",
    dbtTransferNotice: "राशि सीधे आधार लिंक किसान बैंक खाते (DBT) में हस्तांतरित।",

    operatorTitle: "केंद्र संचालन एवं कतार नियंत्रण",
    operatorSubtitle: "गेट आगमन, वे-ब्रिज तौल, गुणवत्ता ग्रेडिंग और टोकन प्रवाह का प्रबंधन।",
    callNextToken: "अगला टोकन बुलाएं",
    checkInFarmer: "आगमन दर्ज करें",
    enterWeighbridgeData: "तौल पर्ची दर्ज करें",
    verifyQuality: "गुणवत्ता व नमी जांच",
    approveProcurement: "स्वीकृति व वाउचर जारी करें",

    adminTitle: "राज्य कृषि खरीद निगरानी प्रणाली",
    adminSubtitle: "जिलेवार खरीद केंद्रों की क्षमता, आवक और भुगतान की वास्तविक स्थिति।",
    totalFarmersServed: "लाभान्वित किसान",
    totalProcuredTonnage: "कुल खरीद मात्रा",
    avgWaitTime: "औसत प्रतीक्षा समय",
    totalDisbursedFunds: "डीबीटी द्वारा वितरित राशि",
    centreCongestionAlerts: "भीड़भाड़ चेतावनी केंद्र",
  },

  gu: {
    appName: "કિસાનફ્લો (KisanFlow)",
    tagline: "જાણો ક્યારે પહોંચવું. જાણો આગળ શું થશે. જાણો ક્યારે નાણાં મળશે.",
    taglineSub: "સ્માર્ટ કૃષિ ખરીદી અને સ્લોટ મેનેજમેન્ટ સિસ્ટમ",
    navFarmer: "ખેડૂત પોર્ટલ",
    navOperator: "કેન્દ્ર ઓપરેટર ડેસ્ક",
    navAdmin: "સરકારી વિશ્લેષણ",

    step1: "ભાષા",
    step2: "જિલ્લો અને ગામ",
    step3: "ખરીદી કેન્દ્ર",
    step4: "ખેડૂત પ્રોફાઇલ",
    step5: "પાક નોંધણી",
    step6: "સ્માર્ટ સ્લોટ બુકિંગ",
    step7: "ડિજિટલ ટોકન",
    step8: "કેન્દ્ર પર આગમન",
    step9: "લાઈવ કતાર",
    step10: "પાક ટ્રેકિંગ",
    step11: "ચુકવણી અને ડીબીટી",

    selectLanguageTitle: "તમારી ભાષા પસંદ કરો",
    selectLanguageDesc: "સરળ અને પારદર્શક કૃષિ ખરીદી પ્રક્રિયા માટે તમારી અનુકૂળ ભાષા પસંદ કરો.",
    continueBtn: "આગળ વધો",
    backBtn: "પાછળ જાઓ",
    submitBtn: "સબમિટ કરો",
    saveBtn: "સાચવો",
    cancelBtn: "રદ કરો",
    confirmBtn: "ખાતરી કરો અને ટોકન મેળવો",

    selectLocationTitle: "રાજ્ય, જિલ્લો અને ગામ પસંદ કરો",
    selectLocationDesc: "તમારા ખેતરની સૌથી નજીકના એપીએમસી અને ખરીદી કેન્દ્રો શોધો.",
    stateLabel: "રાજ્ય",
    districtLabel: "જિલ્લો",
    villageLabel: "ગામ / ગ્રામ પંચાયત",
    availableCentresInDistrict: "આ જિલ્લામાં ઉપલબ્ધ ખરીદી કેન્દ્રો",

    selectCentreTitle: "ખરીદી કેન્દ્ર પસંદ કરો",
    selectCentreDesc: "કેન્દ્રની દૈનિક ક્ષમતા, ભીડનું પ્રમાણ અને કામકાજના કલાકો તપાસો.",
    dailyCapacity: "દૈનિક ક્ષમતા",
    crowdLevel: "ભીડનું સ્તર",
    workingHours: "કામકાજનો સમય",
    statusOpen: "બુકિંગ માટે ખુલ્લું",
    statusCrowded: "વધુ ભીડ",
    statusNormal: "સામાન્ય પ્રવાહ",
    selectThisCentre: "કેન્દ્ર પસંદ કરો",
    selectedCentre: "પસંદ કરેલ કેન્દ્ર",

    farmerRegTitle: "ખેડૂત નોંધણી અને વિગતો",
    farmerRegDesc: "તમારી વિશિષ્ટ ફાર્મર આઈડી મેળવવા માટે વ્યક્તિગત અને જમીનની વિગતો ભરો.",
    fullName: "ખેડૂતનું પૂરું નામ",
    mobileNumber: "મોબાઇલ નંબર (એસએમએસ અને ટોકન માટે)",
    landArea: "ખેતીની જમીનનું ક્ષેત્રફળ",
    landAreaUnit: "એકર",
    farmerIdGenerated: "યુનિક ફાર્મર આઈડી",

    produceRegTitle: "ઉપજ અને પાકની નોંધણી",
    produceRegDesc: "પાકનો પ્રકાર, અંદાજિત જથ્થો અને ગુણવત્તા વિગતવાર જણાવો.",
    cropType: "પાક પસંદ કરો",
    expectedQuantity: "વેચાણ માટેનો જથ્થો",
    quintals: "ક્વિન્ટલ (Qtl)",
    harvestDate: "લણણી / તૈયાર તારીખ",
    qualityCategory: "ગુણવત્તા શ્રેણી",
    govMspPrice: "સરકારી ટેકાનો ભાવ (MSP)",
    estimatedTotalValue: "અંદાજિત કુલ રકમ",

    slotBookingTitle: "સ્માર્ટ આગમન સ્લોટ બુકિંગ",
    slotBookingDesc: "તમારી અનુકૂળતા મુજબ સમય સ્લોટ બુક કરો જેથી લાંબી લાઇનમાં ઊભા રહેવું ન પડે.",
    selectDate: "આગમનની તારીખ પસંદ કરો",
    availableSlots: "ઉપલબ્ધ સમય સ્લોટ્સ",
    slotsRemaining: "જગ્યા બાકી",
    slotFull: "સ્લોટ પૂર્ણ",
    bookedSuccessfully: "સ્લોટ સફળતાપૂર્વક બુક થયો!",

    digitalTokenTitle: "તમારું ડિજિટલ ટોકન",
    digitalTokenDesc: "કેન્દ્ર પર પહોંચતી વખતે સિક્યોરિટી ગેટ પર આ ડિજિટલ પાસ અથવા ક્યુઆર કોડ બતાવો.",
    tokenNumber: "ટોકન નંબર",
    queuePosition: "કતારમાં સ્થાન",
    assignedTime: "ફાળવેલ સમય ગાળો",
    estimatedWait: "અંદાજિત પ્રતીક્ષા સમય",
    printToken: "સ્લિપ પ્રિન્ટ / સેવ કરો",
    shareToken: "વોટ્સએપ પર શેર કરો",
    trackLiveQueue: "લાઈવ કતાર જુઓ",

    liveQueueTitle: "લાઈવ કતાર અને આગમન સ્થિતિ",
    nowServing: "હાલમાં ચાલુ ટોકન",
    yourTurnIn: "અંદાજિત રાહ જોવાનો સમય",
    farmersAhead: "તમારી આગળ કુલ ખેડૂતો",
    statusBooked: "સ્લોટ બુક થયો",
    statusArrived: "ખેડૂત પહોંચી ગયા",
    statusWaiting: "કાંટાની રાહ",
    statusCalled: "ટોકન બોલાવાયું",
    statusInProgress: "તપાસ ચાલુ છે",
    statusCompleted: "ખરીદી પૂર્ણ",

    stage1: "પાક નોંધણી થયેલ",
    stage2: "સ્લોટ બુક થયો",
    stage3: "ખેડૂત કેન્દ્ર પર પહોંચ્યા",
    stage4: "વજન પૂર્ણ થયું",
    stage5: "ગુણવત્તા ચકાસણી",
    stage6: "ખરીદી મંજૂર",
    stage7: "ખરીદી પૂર્ણ અને ડીબીટી ટ્રાન્સફર",

    paymentTitle: "ખરીદી ચુકવણી અને હિસાબ",
    paymentDesc: "ચોખ્ખું વજન, કપાત અને બેંક ખાતામાં જમા થયેલ રકમનું પારદર્શક વિવરણ.",
    approvedQuantity: "મંજૂર થયેલ ચોખ્ખું વજન",
    mspRate: "સરકારી ટેકાનો ભાવ",
    grossAmount: "કુલ કિંમત",
    deductions: "ભેજ અને કચરાની કપાત",
    finalPayable: "ચુકવવાપાત્ર ચોખ્ખી રકમ",
    paymentStatus: "ચુકવણી સ્થિતિ",
    dbtTransferNotice: "રકમ સીધી ખેડૂતના આધાર લિન્ક બેંક ખાતામાં (DBT) જમા.",

    operatorTitle: "કેન્દ્ર સંચાલન અને કતાર કન્સોલ",
    operatorSubtitle: "ગેટ એન્ટ્રી, ઇલેક્ટ્રોનિક વજન કાંટો, ગુણવત્તા ગ્રેડિંગ અને પ્રક્રિયા સંચાલન.",
    callNextToken: "આગળનો ટોકન બોલાવો",
    checkInFarmer: "હાજરી નોંધો (Arrived)",
    enterWeighbridgeData: "વજન કાંટાની સ્લિપ દાખલ કરો",
    verifyQuality: "ગુણવત્તા અને ભેજ તપાસ",
    approveProcurement: "મંજૂરી અને વાઉચર આપો",

    adminTitle: "રાજ્ય સ્તરીય કૃષિ ખરીદી નિયંત્રણ",
    adminSubtitle: "જિલ્લાવાર ખરીદી કેન્દ્રોની ક્ષમતા, દૈનિક જથ્થો અને ખેડૂત ચુકવણીની સ્થિતિ.",
    totalFarmersServed: "કુલ નોંધાયેલ ખેડૂતો",
    totalProcuredTonnage: "કુલ ખરીદી જથ્થો",
    avgWaitTime: "સરેરાશ પ્રતીક્ષા સમય",
    totalDisbursedFunds: "સરકારી ડીબીટી ચુકવણી",
    centreCongestionAlerts: "વધુ ભીડવાળા કેન્દ્રોની ચેતવણી",
  }
};
