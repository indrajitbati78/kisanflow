export type Language = 'en' | 'hi' | 'gu';

export type UserRole = 'farmer' | 'operator' | 'admin';

export type QueueStatus = 
  | 'booked'
  | 'arrived'
  | 'waiting'
  | 'called'
  | 'in_progress'
  | 'completed'
  | 'cancelled';

export type QualityGrade = 'Grade A' | 'Grade B' | 'Grade C' | 'Rejected';

export interface ProcurementCentre {
  id: string;
  name: string;
  nameHi: string;
  nameGu: string;
  code: string;
  district: string;
  state: string;
  address: string;
  workingHours: string;
  dailyCapacityQuintals: number;
  currentBookedQuintals: number;
  dailyFarmerLimit: number;
  currentBookedFarmers: number;
  status: 'Open' | 'Crowded' | 'Normal' | 'Closed';
  crowdLevel: 'Low' | 'Moderate' | 'High' | 'Normal';
  activeWeighbridges: number;
  contactNumber: string;
  availableDates: string[];
}

export interface CropInfo {
  id: string;
  name: string;
  nameHi: string;
  nameGu: string;
  category: 'Kharif' | 'Rabi' | 'Commercial';
  mspPerQuintal: number; // Minimum Support Price in INR
  moistureLimitPercent: number;
  unit: string;
}

export interface TimeSlot {
  id: string;
  centreId: string;
  date: string; // YYYY-MM-DD
  timeRange: string; // e.g. "09:00 AM - 09:45 AM"
  maxCapacity: number; // Max farmers
  bookedCount: number; // Currently booked
  isAvailable: boolean;
}

export interface FarmerProfile {
  id: string; // e.g. KF1001
  fullName: string;
  fatherOrSpouseName?: string;
  mobileNumber: string;
  email?: string;
  aadhaarNumber?: string;
  kccNumber?: string;
  bankName?: string;
  bankAccountEnding?: string;
  ifscCode?: string;
  village: string;
  taluka?: string;
  district: string;
  state: string;
  landAreaAcres: number;
  preferredCrop?: string;
  preferredCentreId?: string;
  registeredDate: string;
}

export interface FarmerQuery {
  id: string; // e.g. TKT-401
  farmerId: string;
  farmerName: string;
  farmerPhone: string;
  district: string;
  centreName: string;
  category: 'Slot Booking' | 'Weighbridge & Scale' | 'Quality & Moisture' | 'Payment / DBT' | 'APMC Yard Entry' | 'General';
  subject: string;
  description: string;
  status: 'Open' | 'Under Review' | 'Resolved';
  createdAt: string;
  response?: string;
  respondedAt?: string;
}

export interface ProduceRecord {
  id: string; // e.g. PR2001
  farmerId: string;
  cropId: string;
  cropName: string;
  quantityQuintals: number;
  expectedHarvestDate: string;
  qualityCategory: QualityGrade;
  estimatedPricePerQuintal: number;
  centreId: string;
  status: 'Registered' | 'Slot Booked' | 'Inspected' | 'Procured';
}

export interface TokenBooking {
  id: string; // e.g. TB-8901
  tokenNumber: string; // e.g. "KF-101"
  tokenSequence: number;
  farmerId: string;
  farmerName: string;
  farmerPhone: string;
  farmerVillage: string;
  produceId: string;
  cropName: string;
  quantityQuintals: number;
  centreId: string;
  centreName: string;
  bookingDate: string;
  slotTime: string;
  queuePosition: number;
  status: QueueStatus;
  createdAt: string;
  arrivedAt?: string;
  calledAt?: string;
  completedAt?: string;

  // Process details
  weighingDetails?: {
    grossWeightKg: number;
    tareWeightKg: number;
    netWeightKg: number;
    netWeightQuintals: number;
    weighedAt: string;
    operatorId: string;
  };

  qualityDetails?: {
    assignedGrade: QualityGrade;
    moisturePercent: number;
    foreignMatterPercent: number;
    deductionPercent: number;
    verifiedBy: string;
    verifiedAt: string;
    notes?: string;
  };

  paymentDetails?: {
    voucherNumber: string;
    approvedQuantityQuintals: number;
    pricePerQuintal: number;
    grossAmount: number;
    deductionsAmount: number;
    finalPayableAmount: number;
    paymentStatus: 'Pending' | 'Processing' | 'Paid DBT';
    dbtReferenceNo?: string;
    paidAt?: string;
    bankAccountEnding?: string;
  };
}

export interface NotificationItem {
  id: string;
  farmerId?: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'alert';
  timestamp: string;
  read: boolean;
  actionUrl?: string;
}

export interface DistrictInfo {
  state: string;
  name: string;
  nameHi: string;
  nameGu: string;
  centresCount: number;
}
