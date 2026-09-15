import React, { createContext, useContext, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  Language,
  UserRole,
  ProcurementCentre,
  CropInfo,
  TimeSlot,
  FarmerProfile,
  TokenBooking,
  NotificationItem,
  QualityGrade,
  FarmerQuery
} from '../types';
import {
  CROP_LIST,
  PROCUREMENT_CENTRES,
  INITIAL_TIME_SLOTS,
  INITIAL_FARMER,
  INITIAL_BOOKINGS,
  INITIAL_NOTIFICATIONS,
  INITIAL_QUERIES,
  INITIAL_REGISTERED_FARMERS
} from '../data/mockData';
import { translations, Translations } from '../i18n/translations';
import { 
  auth, 
  googleProvider, 
  FirebaseUser 
} from '../firebase';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged,
  sendPasswordResetEmail,
  updateProfile
} from 'firebase/auth';

export interface RegisterParams {
  fullName: string;
  mobileNumber: string;
  district: string;
  village: string;
  taluka?: string;
  landAreaAcres?: number;
  password?: string;
  isGoogle?: boolean;
  email?: string;
  preferredCentreId?: string;
  bankName?: string;
  bankAccountEnding?: string;
  ifscCode?: string;
}

interface AppContextType {
  // Auth state
  isAuthenticated: boolean;
  register: (params: RegisterParams) => void;
  login: (username?: string, password?: string, role?: UserRole, isGoogle?: boolean) => void;
  loginOfficialStaff: (params: {
    role: 'operator' | 'admin';
    uniqueId: string;
    secretKey: string;
    centreId?: string;
  }) => { success: boolean; error?: string };
  logout: () => void;
  staffOfficerId: string | null;
  registeredFarmers: FarmerProfile[];
  registerNewFarmer: (
    profile: Partial<FarmerProfile>,
    createBooking?: boolean,
    cropName?: string,
    quantityQuintals?: number,
    centreId?: string
  ) => { profile: FarmerProfile; booking?: TokenBooking };
  issueWalkInToken: (
    farmerId: string,
    centreId: string,
    cropName?: string,
    quantityQuintals?: number
  ) => TokenBooking;

  // Firebase Auth Integration
  firebaseUser: FirebaseUser | null;
  isFirebaseLoading: boolean;
  firebaseAuthError: string | null;
  clearAuthError: () => void;
  signUpWithFirebase: (email: string, password: string, fullName?: string) => Promise<{ success: boolean; error?: string }>;
  signInWithFirebase: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signInWithGoogle: () => Promise<{ success: boolean; error?: string }>;
  resetFirebasePassword: (email: string) => Promise<{ success: boolean; error?: string }>;
  hasPendingRegistration: boolean;
  setHasPendingRegistration: (pending: boolean) => void;
  completeFarmerRegistration: (params: RegisterParams) => Promise<void>;

  // Language & Role
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;
  
  // Farmer state & Sequential Step Enforcement
  farmerStep: number;
  setFarmerStep: (step: number) => void;
  maxUnlockedStep: number;
  setMaxUnlockedStep: React.Dispatch<React.SetStateAction<number>>;
  advanceStep: (nextStep: number) => void;

  farmerProfile: FarmerProfile;
  setFarmerProfile: React.Dispatch<React.SetStateAction<FarmerProfile>>;
  selectedCentreId: string;
  setSelectedCentreId: (id: string) => void;
  selectedState: string;
  setSelectedState: (state: string) => void;
  selectedDistrict: string;
  setSelectedDistrict: (district: string) => void;
  activeTokenBooking: TokenBooking | null;
  setActiveTokenBooking: (booking: TokenBooking | null) => void;

  // Master data
  centres: ProcurementCentre[];
  timeSlots: TimeSlot[];
  crops: CropInfo[];
  bookings: TokenBooking[];
  notifications: NotificationItem[];
  unreadNotificationCount: number;

  // Queries & Helpdesk
  queries: FarmerQuery[];
  addQuery: (category: FarmerQuery['category'], subject: string, description: string) => void;

  // UI Overlays
  isAboutProfileOpen: boolean;
  setIsAboutProfileOpen: (open: boolean) => void;
  isQueryOpen: boolean;
  setIsQueryOpen: (open: boolean) => void;
  isNotificationOpen: boolean;
  setIsNotificationOpen: (open: boolean) => void;

  // Actions
  bookSlot: (params: {
    centreId: string;
    cropId: string;
    quantityQuintals: number;
    slotTime: string;
    bookingDate: string;
    harvestDate: string;
    qualityCategory: QualityGrade;
  }) => TokenBooking;
  
  markArrived: (bookingId: string) => void;
  callToken: (bookingId: string) => void;
  submitWeighing: (bookingId: string, grossWeightKg: number, tareWeightKg: number) => void;
  submitQualityCheck: (
    bookingId: string,
    grade: QualityGrade,
    moisture: number,
    foreignMatter: number,
    deductionPct: number,
    notes?: string
  ) => void;
  approvePaymentVoucher: (bookingId: string) => void;
  simulateNextStage: (bookingId: string) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  downloadBookingReceipt: (targetBooking?: TokenBooking) => void;
  resetAllData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEY = 'kisanflow_state_v3';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load saved state
  const savedState = (() => {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  })();

  // Auth: Defaults to false so Registration/Sign In is the first interface
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(savedState?.isAuthenticated ?? false);
  const [staffOfficerId, setStaffOfficerId] = useState<string | null>(savedState?.staffOfficerId || null);

  // Firebase Auth State
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [isFirebaseLoading, setIsFirebaseLoading] = useState<boolean>(false);
  const [firebaseAuthError, setFirebaseAuthError] = useState<string | null>(null);
  const [hasPendingRegistration, setHasPendingRegistration] = useState<boolean>(false);

  const clearAuthError = () => setFirebaseAuthError(null);

  const [language, setLanguageState] = useState<Language>(savedState?.language || 'gu');
  const [currentRole, setCurrentRole] = useState<UserRole>(savedState?.currentRole || 'farmer');
  
  // Sequential Step State: Do not jump ahead directly
  const [farmerStep, setFarmerStepState] = useState<number>(savedState?.farmerStep || 1);
  const [maxUnlockedStep, setMaxUnlockedStep] = useState<number>(savedState?.maxUnlockedStep || 1);

  const [farmerProfile, setFarmerProfile] = useState<FarmerProfile>(savedState?.farmerProfile || INITIAL_FARMER);
  const [registeredFarmers, setRegisteredFarmers] = useState<FarmerProfile[]>(savedState?.registeredFarmers || INITIAL_REGISTERED_FARMERS);
  const [selectedState, setSelectedState] = useState<string>('Gujarat');
  const [selectedDistrict, setSelectedDistrict] = useState<string>(savedState?.selectedDistrict || 'Ahmedabad');
  const [selectedCentreId, setSelectedCentreId] = useState<string>(savedState?.selectedCentreId || 'centre_ahmedabad_central');

  const [centres, setCentres] = useState<ProcurementCentre[]>(savedState?.centres || PROCUREMENT_CENTRES);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>(savedState?.timeSlots || INITIAL_TIME_SLOTS);
  const [crops] = useState<CropInfo[]>(CROP_LIST);
  const [bookings, setBookings] = useState<TokenBooking[]>(savedState?.bookings || INITIAL_BOOKINGS);
  const [notifications, setNotifications] = useState<NotificationItem[]>(savedState?.notifications || INITIAL_NOTIFICATIONS);
  const [queries, setQueries] = useState<FarmerQuery[]>(savedState?.queries || INITIAL_QUERIES);

  // Overlays
  const [isAboutProfileOpen, setIsAboutProfileOpen] = useState(false);
  const [isQueryOpen, setIsQueryOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  // Active token
  const activeBookingId = savedState?.activeBookingId || (bookings.length > 0 ? bookings[bookings.length - 1].id : null);
  const activeTokenBooking = bookings.find(b => b.id === activeBookingId) || (bookings.length > 0 ? bookings[bookings.length - 1] : null);

  // Enforce ONLY white theme: Always remove dark class
  useEffect(() => {
    document.documentElement.classList.remove('dark');
  }, []);

  // Save to localStorage on change
  useEffect(() => {
    try {
      const toSave = {
        isAuthenticated,
        staffOfficerId,
        registeredFarmers,
        language,
        currentRole,
        farmerStep,
        maxUnlockedStep,
        farmerProfile,
        selectedState: 'Gujarat',
        selectedDistrict,
        selectedCentreId,
        centres,
        timeSlots,
        bookings,
        notifications,
        queries,
        activeBookingId: activeTokenBooking?.id
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
    } catch {
      // Storage error ignored
    }
  }, [
    isAuthenticated,
    staffOfficerId,
    registeredFarmers,
    language,
    currentRole,
    farmerStep,
    maxUnlockedStep,
    farmerProfile,
    selectedDistrict,
    selectedCentreId,
    centres,
    timeSlots,
    bookings,
    notifications,
    queries,
    activeTokenBooking
  ]);

  // Firebase Auth Error Formatter
  const formatFirebaseAuthError = (error: any): string => {
    const code = error?.code || '';
    switch (code) {
      case 'auth/invalid-email':
        return 'Invalid email address format.';
      case 'auth/user-disabled':
        return 'This account has been disabled. Please contact Mandi support.';
      case 'auth/user-not-found':
        return 'No registered account found with this email. Please click Sign Up to create one.';
      case 'auth/wrong-password':
      case 'auth/invalid-credential':
        return 'Incorrect email or password. Please verify your credentials or reset your password.';
      case 'auth/email-already-in-use':
        return 'This email is already registered. Please use "Sign In" or click Forgot Password.';
      case 'auth/weak-password':
        return 'Password must be at least 6 characters.';
      case 'auth/popup-closed-by-user':
        return 'Google sign-in popup was closed before completion.';
      case 'auth/operation-not-allowed':
        return 'Email/Password sign-in is not yet enabled in the Firebase Console. You may also proceed with demo mode.';
      case 'auth/unauthorized-domain': {
        const currentHost = typeof window !== 'undefined' ? window.location.hostname : 'your-domain.run.app';
        return `Firebase auth/unauthorized-domain: The current domain (${currentHost}) is not added to "Authorized domains" in your Firebase project.`;
      }
      case 'auth/network-request-failed':
        return 'Network connection problem. Please check your internet connection.';
      default:
        return error?.message || 'Authentication error. Please check your details.';
    }
  };

  // Firebase Auth State Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setFirebaseUser(user);
      setIsFirebaseLoading(false);

      if (user) {
        // Look up if user has a completed farmer profile in memory or storage
        const userEmail = user.email?.toLowerCase();
        const matched = registeredFarmers.find(
          f => f.email?.toLowerCase() === userEmail || (f as any).uid === user.uid
        );

        if (matched) {
          setFarmerProfile(matched);
          setSelectedDistrict(matched.district);
          setIsAuthenticated(true);
          setCurrentRole('farmer');
          setStaffOfficerId(null);
          setHasPendingRegistration(false);
        } else {
          // User exists in Firebase, but needs to complete Farmer APMC Registration
          setHasPendingRegistration(true);
        }
      }
    });

    return () => unsubscribe();
  }, [registeredFarmers]);

  // Register a new farmer and make them immediately visible to Operator & Admin
  const registerNewFarmer = (
    profile: Partial<FarmerProfile>,
    createBooking: boolean = true,
    cropName: string = 'Sharbati Wheat (શરબતી ઘઉં)',
    quantityQuintals: number = 40,
    centreId?: string
  ): { profile: FarmerProfile; booking?: TokenBooking } => {
    const newFarmerId = profile.id || `KF${Math.floor(1000 + Math.random() * 9000)}`;
    const preferredYard = centreId || profile.preferredCentreId || selectedCentreId || 'centre_ahmedabad_central';
    const selectedCentre = centres.find(c => c.id === preferredYard) || centres[0];

    const newProfile: FarmerProfile = {
      id: newFarmerId,
      fullName: profile.fullName || 'New Farmer Beneficiary',
      email: profile.email || `${profile.mobileNumber || 'farmer'}@kisanflow.gujarat.gov.in`,
      mobileNumber: profile.mobileNumber || '98250 14820',
      village: profile.village || 'Sanand Rural',
      taluka: profile.taluka || profile.village || 'Sanand',
      district: profile.district || 'Ahmedabad',
      state: 'Gujarat',
      landAreaAcres: profile.landAreaAcres || 4.5,
      aadhaarNumber: profile.aadhaarNumber || 'XXXX-XXXX-8921',
      kccNumber: profile.kccNumber || `KCC-GJ-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`,
      bankName: profile.bankName || 'State Bank of India',
      bankAccountEnding: profile.bankAccountEnding || '9182',
      ifscCode: profile.ifscCode || 'SBIN0001892',
      preferredCentreId: preferredYard,
      registeredDate: new Date().toISOString().split('T')[0]
    };

    setRegisteredFarmers(prev => [newProfile, ...prev.filter(f => f.id !== newProfile.id)]);

    let newBooking: TokenBooking | undefined;
    if (createBooking) {
      const nextSeq = 100 + (bookings.length + 1);
      const tokenNumber = `KF-${nextSeq}`;
      const tokenBookingId = `TB-${Date.now().toString().slice(-4)}`;
      const produceId = `PR${2000 + bookings.length + 1}`;

      newBooking = {
        id: tokenBookingId,
        tokenNumber,
        tokenSequence: nextSeq,
        farmerId: newProfile.id,
        farmerName: newProfile.fullName,
        farmerPhone: newProfile.mobileNumber,
        farmerVillage: `${newProfile.village}, ${newProfile.district}`,
        produceId,
        cropName,
        quantityQuintals,
        centreId: selectedCentre.id,
        centreName: selectedCentre.name,
        bookingDate: new Date().toISOString().split('T')[0],
        slotTime: '10:00 AM - 11:00 AM',
        queuePosition: bookings.filter(b => b.centreId === selectedCentre.id && b.status !== 'completed').length + 1,
        status: 'booked',
        createdAt: 'Just now'
      };

      setBookings(prev => [newBooking!, ...prev]);
    }

    addNotification({
      title: `Farmer Added: ${newProfile.fullName} (${newProfile.id})`,
      message: `Farmer registration successfully recorded in APMC registry. ${newBooking ? `Inward Token ${newBooking.tokenNumber} created.` : ''}`,
      type: 'success'
    });

    return { profile: newProfile, booking: newBooking };
  };

  // Issue walk-in gate entry pass for any farmer directly at the gate
  const issueWalkInToken = (
    farmerId: string,
    centreId: string,
    cropName: string = 'Sharbati Wheat (શરબતી ઘઉં)',
    quantityQuintals: number = 35
  ): TokenBooking => {
    const farmer = registeredFarmers.find(f => f.id === farmerId) || farmerProfile;
    const selectedCentre = centres.find(c => c.id === centreId) || centres[0];
    const nextSeq = 100 + (bookings.length + 1);
    const tokenNumber = `KF-${nextSeq}`;
    const tokenBookingId = `TB-${Date.now().toString().slice(-4)}`;
    const produceId = `PR${2000 + bookings.length + 1}`;

    const newBooking: TokenBooking = {
      id: tokenBookingId,
      tokenNumber,
      tokenSequence: nextSeq,
      farmerId: farmer.id,
      farmerName: farmer.fullName,
      farmerPhone: farmer.mobileNumber,
      farmerVillage: `${farmer.village}, ${farmer.district}`,
      produceId,
      cropName,
      quantityQuintals,
      centreId: selectedCentre.id,
      centreName: selectedCentre.name,
      bookingDate: new Date().toISOString().split('T')[0],
      slotTime: 'Gate Inward (Now)',
      queuePosition: bookings.filter(b => b.centreId === selectedCentre.id && b.status !== 'completed').length + 1,
      status: 'arrived',
      createdAt: 'Just now',
      arrivedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setBookings(prev => [newBooking, ...prev]);

    addNotification({
      title: `Gate Entry Pass: ${tokenNumber}`,
      message: `Token issued for ${farmer.fullName} at ${selectedCentre.name}. Status: Arrived at gate.`,
      type: 'success'
    });

    return newBooking;
  };

  // Firebase Sign Up (Step 1 before registration)
  const signUpWithFirebase = async (email: string, password: string, fullName?: string) => {
    setFirebaseAuthError(null);
    setIsFirebaseLoading(true);
    try {
      const cred = await createUserWithEmailAndPassword(auth, email.trim(), password);
      if (fullName && cred.user) {
        await updateProfile(cred.user, { displayName: fullName.trim() });
      }
      setFirebaseUser(cred.user);
      // Immediately transition to step 2 (Farmer APMC registration)
      setHasPendingRegistration(true);
      setIsFirebaseLoading(false);
      return { success: true };
    } catch (err: any) {
      const msg = formatFirebaseAuthError(err);
      setFirebaseAuthError(msg);
      setIsFirebaseLoading(false);
      return { success: false, error: msg };
    }
  };

  // Firebase Sign In
  const signInWithFirebase = async (email: string, password: string) => {
    setFirebaseAuthError(null);
    setIsFirebaseLoading(true);
    try {
      const cred = await signInWithEmailAndPassword(auth, email.trim(), password);
      const user = cred.user;
      setFirebaseUser(user);

      const userEmail = user.email?.toLowerCase();
      let matched = registeredFarmers.find(
        f => f.email?.toLowerCase() === userEmail || (f as any).uid === user.uid
      );

      if (matched) {
        setFarmerProfile(matched);
        setSelectedDistrict(matched.district);
        setIsAuthenticated(true);
        setCurrentRole('farmer');
        setStaffOfficerId(null);
        setHasPendingRegistration(false);
        setFarmerStepState(1);
        setMaxUnlockedStep(prev => Math.max(prev, 1));
        addNotification({
          title: 'Signed in with Firebase',
          message: `Welcome back, ${matched.fullName}! APMC e-Procurement active.`,
          type: 'success'
        });
      } else {
        setHasPendingRegistration(true);
      }

      setIsFirebaseLoading(false);
      return { success: true };
    } catch (err: any) {
      const msg = formatFirebaseAuthError(err);
      setFirebaseAuthError(msg);
      setIsFirebaseLoading(false);
      return { success: false, error: msg };
    }
  };

  // Firebase Google Sign In / Sign Up
  const signInWithGoogle = async () => {
    setFirebaseAuthError(null);
    setIsFirebaseLoading(true);
    try {
      const cred = await signInWithPopup(auth, googleProvider);
      const user = cred.user;
      setFirebaseUser(user);

      const userEmail = user.email?.toLowerCase();
      let matched = registeredFarmers.find(
        f => f.email?.toLowerCase() === userEmail || (f as any).uid === user.uid
      );

      if (matched) {
        setFarmerProfile(matched);
        setSelectedDistrict(matched.district);
        setIsAuthenticated(true);
        setCurrentRole('farmer');
        setStaffOfficerId(null);
        setHasPendingRegistration(false);
        setFarmerStepState(1);
        setMaxUnlockedStep(prev => Math.max(prev, 1));
        addNotification({
          title: 'Google Account Connected',
          message: `Welcome back, ${matched.fullName}!`,
          type: 'success'
        });
      } else {
        setHasPendingRegistration(true);
      }

      setIsFirebaseLoading(false);
      return { success: true };
    } catch (err: any) {
      const msg = formatFirebaseAuthError(err);
      setFirebaseAuthError(msg);
      setIsFirebaseLoading(false);
      return { success: false, error: msg };
    }
  };

  // Firebase Password Reset
  const resetFirebasePassword = async (email: string) => {
    setFirebaseAuthError(null);
    try {
      await sendPasswordResetEmail(auth, email.trim());
      addNotification({
        title: 'Password Reset Email Sent',
        message: `Password reset link has been dispatched to ${email}.`,
        type: 'info'
      });
      return { success: true };
    } catch (err: any) {
      const msg = formatFirebaseAuthError(err);
      setFirebaseAuthError(msg);
      return { success: false, error: msg };
    }
  };

  // Complete Farmer Registration (Step 2 after Sign Up)
  const completeFarmerRegistration = async (params: RegisterParams) => {
    const newFarmerId = `KF${Math.floor(1000 + Math.random() * 9000)}`;
    const currentEmail = firebaseUser?.email || params.email || `${params.mobileNumber}@kisanflow.gujarat.gov.in`;
    const currentName = params.fullName || firebaseUser?.displayName || 'Farmer Beneficiary';
    const preferredYard = params.preferredCentreId || selectedCentreId || 'centre_ahmedabad_central';
    const selectedCentre = centres.find(c => c.id === preferredYard) || centres[0];

    const newProfile: FarmerProfile = {
      id: newFarmerId,
      fullName: currentName,
      email: currentEmail,
      mobileNumber: params.mobileNumber || '98250 14820',
      village: params.village || 'Sanand Rural',
      taluka: params.taluka || params.village || 'Sanand',
      district: params.district || 'Ahmedabad',
      state: 'Gujarat',
      landAreaAcres: params.landAreaAcres || 5.0,
      aadhaarNumber: 'XXXX-XXXX-8921',
      kccNumber: `KCC-GJ-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`,
      bankName: params.bankName || 'State Bank of India',
      bankAccountEnding: params.bankAccountEnding || '9182',
      ifscCode: params.ifscCode || 'SBIN0001892',
      preferredCentreId: preferredYard,
      registeredDate: new Date().toISOString().split('T')[0]
    };

    // Auto-generate active inward gate pass token so Operator & Admin dashboards show this registration instantly
    const nextSeq = 100 + (bookings.length + 1);
    const tokenNumber = `KF-${nextSeq}`;
    const tokenBookingId = `TB-${Date.now().toString().slice(-4)}`;
    const produceId = `PR${2000 + bookings.length + 1}`;

    const initialBooking: TokenBooking = {
      id: tokenBookingId,
      tokenNumber,
      tokenSequence: nextSeq,
      farmerId: newProfile.id,
      farmerName: newProfile.fullName,
      farmerPhone: newProfile.mobileNumber,
      farmerVillage: `${newProfile.village}, ${newProfile.district}`,
      produceId,
      cropName: 'Sharbati Wheat (શરબતી ઘઉં)',
      quantityQuintals: Math.min((newProfile.landAreaAcres || 5) * 8, 40),
      centreId: selectedCentre.id,
      centreName: selectedCentre.name,
      bookingDate: new Date().toISOString().split('T')[0],
      slotTime: '10:00 AM - 11:00 AM',
      queuePosition: bookings.filter(b => b.centreId === selectedCentre.id && b.status !== 'completed').length + 1,
      status: 'booked',
      createdAt: 'Just now'
    };

    setFarmerProfile(newProfile);
    setRegisteredFarmers(prev => [newProfile, ...prev.filter(f => f.id !== newProfile.id)]);
    setBookings(prev => [initialBooking, ...prev]);
    setSelectedDistrict(newProfile.district);
    setSelectedCentreId(preferredYard);
    setIsAuthenticated(true);
    setCurrentRole('farmer');
    setStaffOfficerId(null);
    setHasPendingRegistration(false);
    setFarmerStepState(1);
    setMaxUnlockedStep(1);

    try {
      confetti({
        particleCount: 75,
        spread: 65,
        origin: { y: 0.6 }
      });
    } catch {
      // Ignored
    }

    addNotification({
      title: 'Farmer APMC Registration Complete',
      message: `Welcome ${newProfile.fullName}! Farmer ID ${newFarmerId} registered with Inward Token ${tokenNumber} at ${selectedCentre.name}. Visible in Operator & Admin dashboards.`,
      type: 'success'
    });
  };

  // Advance step sequentially: sets the new step and unlocks it
  const advanceStep = (nextStep: number) => {
    setMaxUnlockedStep(prev => Math.max(prev, nextStep));
    setFarmerStepState(nextStep);
  };

  // setFarmerStep wrapper: will NOT allow jumping ahead past maxUnlockedStep
  const setFarmerStep = (step: number) => {
    if (step <= maxUnlockedStep) {
      setFarmerStepState(step);
    } else {
      // If code internally advances, expand maxUnlockedStep
      setMaxUnlockedStep(prev => Math.max(prev, step));
      setFarmerStepState(step);
    }
  };

  const addNotification = (notif: Omit<NotificationItem, 'id' | 'timestamp' | 'read'>) => {
    const newNotif: NotificationItem = {
      ...notif,
      id: 'notif_' + Date.now(),
      timestamp: 'Just now',
      read: false
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  // Farmer Registration (New Farmer Sign Up)
  const register = (params: RegisterParams) => {
    const newFarmerId = `KF${Math.floor(1000 + Math.random() * 9000)}`;
    const preferredYard = params.preferredCentreId || selectedCentreId || 'centre_ahmedabad_central';
    const selectedCentre = centres.find(c => c.id === preferredYard) || centres[0];

    const newProfile: FarmerProfile = {
      id: newFarmerId,
      fullName: params.fullName || (params.isGoogle ? 'Indrajit Bati (ઇન્દ્રજીત બાટી)' : 'Ramesh Patel'),
      email: params.isGoogle ? 'indrajitbati@gmail.com' : `${params.mobileNumber}@kisanflow.gujarat.gov.in`,
      mobileNumber: params.mobileNumber || '98250 14820',
      village: params.village || 'Sanand Rural',
      taluka: params.village || 'Sanand',
      district: params.district || 'Ahmedabad',
      state: 'Gujarat',
      landAreaAcres: params.landAreaAcres || 5.0,
      aadhaarNumber: 'XXXX-XXXX-8921',
      kccNumber: `KCC-GJ-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`,
      bankName: params.bankName || 'State Bank of India',
      bankAccountEnding: params.bankAccountEnding || '9182',
      ifscCode: params.ifscCode || 'SBIN0001892',
      preferredCentreId: preferredYard,
      registeredDate: new Date().toISOString().split('T')[0]
    };

    // Auto-generate active inward gate pass token so Operator & Admin dashboards show this registration instantly
    const nextSeq = 100 + (bookings.length + 1);
    const tokenNumber = `KF-${nextSeq}`;
    const tokenBookingId = `TB-${Date.now().toString().slice(-4)}`;
    const produceId = `PR${2000 + bookings.length + 1}`;

    const initialBooking: TokenBooking = {
      id: tokenBookingId,
      tokenNumber,
      tokenSequence: nextSeq,
      farmerId: newProfile.id,
      farmerName: newProfile.fullName,
      farmerPhone: newProfile.mobileNumber,
      farmerVillage: `${newProfile.village}, ${newProfile.district}`,
      produceId,
      cropName: 'Sharbati Wheat (શરબતી ઘઉં)',
      quantityQuintals: Math.min((newProfile.landAreaAcres || 5) * 8, 40),
      centreId: selectedCentre.id,
      centreName: selectedCentre.name,
      bookingDate: new Date().toISOString().split('T')[0],
      slotTime: '10:00 AM - 11:00 AM',
      queuePosition: bookings.filter(b => b.centreId === selectedCentre.id && b.status !== 'completed').length + 1,
      status: 'booked',
      createdAt: 'Just now'
    };

    setFarmerProfile(newProfile);
    setRegisteredFarmers(prev => [newProfile, ...prev.filter(f => f.id !== newProfile.id)]);
    setBookings(prev => [initialBooking, ...prev]);
    setSelectedDistrict(newProfile.district);
    setSelectedCentreId(preferredYard);
    setIsAuthenticated(true);
    setCurrentRole('farmer');
    setStaffOfficerId(null);
    
    // Set to step 1 (Language & District setup) with step 1 unlocked
    setFarmerStepState(1);
    setMaxUnlockedStep(1);

    try {
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 }
      });
    } catch {
      // Ignored
    }

    addNotification({
      title: params.isGoogle ? 'Google Account Registered' : 'Farmer Registered Successfully',
      message: `Welcome ${newProfile.fullName}! Farmer ID ${newFarmerId} registered with Inward Token ${tokenNumber}. Visible in Operator & Admin dashboards.`,
      type: 'success'
    });
  };

  // Sign In / Login for Farmers ONLY
  const login = (username?: string, _password?: string, _role: UserRole = 'farmer', isGoogle: boolean = false) => {
    setIsAuthenticated(true);
    setCurrentRole('farmer');
    setStaffOfficerId(null);
    
    if (isGoogle) {
      setFarmerProfile(prev => ({
        ...prev,
        fullName: 'Indrajit Bati (ઇન્દ્રજીત બાટી)',
        email: 'indrajitbati@gmail.com'
      }));
    } else if (username && username.trim().length > 0) {
      setFarmerProfile(prev => ({
        ...prev,
        fullName: username.includes('@') ? username.split('@')[0] : username
      }));
    }

    // Default to step 1 with step 1 unlocked
    setFarmerStepState(1);
    setMaxUnlockedStep(prev => Math.max(prev, 1));

    addNotification({
      title: isGoogle ? 'Google Account Signed In' : 'Farmer Signed In Successfully',
      message: `Welcome back to KisanFlow Gujarat APMC Mandi Portal.`,
      type: 'success'
    });
  };

  // Dedicated Official Staff Authentication (Operator & Admin)
  const loginOfficialStaff = ({
    role,
    uniqueId,
    secretKey,
    centreId
  }: {
    role: 'operator' | 'admin';
    uniqueId: string;
    secretKey: string;
    centreId?: string;
  }): { success: boolean; error?: string } => {
    const trimmedId = uniqueId.trim().toUpperCase();
    const trimmedKey = secretKey.trim();

    if (!trimmedId || !trimmedKey) {
      return {
        success: false,
        error: 'Please enter both Official Service ID and Security Passcode/PIN.'
      };
    }

    if (role === 'operator') {
      // Operator Verification
      // Accepted ID: OPR-GUJ-7721, OPR-7721, OPR7721
      // Accepted PIN: OPR@7721, 7721, opr123
      const isIdValid = trimmedId === 'OPR-GUJ-7721' || trimmedId === 'OPR-7721' || trimmedId === 'OPR7721';
      const isKeyValid = trimmedKey === 'OPR@7721' || trimmedKey === '7721' || trimmedKey === 'opr123';

      if (!isIdValid || !isKeyValid) {
        return {
          success: false,
          error: 'Access Denied: Unrecognized Operator Service ID or Security PIN. Farmers cannot log in to this terminal.'
        };
      }

      setCurrentRole('operator');
      setStaffOfficerId(trimmedId);
      if (centreId) {
        setSelectedCentreId(centreId);
      }
      setIsAuthenticated(true);
      addNotification({
        title: 'Mandi Yard Operator Authenticated',
        message: `Officer ${trimmedId} signed into APMC Weighbridge & Registration terminal.`,
        type: 'success'
      });
      return { success: true };
    } else {
      // Directorate Admin Verification
      // Accepted ID: ADM-GUJ-9901, ADM-9901, ADM9901
      // Accepted Key: ADMIN#GUJ2026, GUJ2026, admin123
      const isIdValid = trimmedId === 'ADM-GUJ-9901' || trimmedId === 'ADM-9901' || trimmedId === 'ADM9901';
      const isKeyValid = trimmedKey === 'ADMIN#GUJ2026' || trimmedKey === 'GUJ2026' || trimmedKey === 'admin123';

      if (!isIdValid || !isKeyValid) {
        return {
          success: false,
          error: 'Access Denied: Invalid Directorate Master Security Key. Restricted to Gujarat Agriculture Directorate.'
        };
      }

      setCurrentRole('admin');
      setStaffOfficerId(trimmedId);
      setIsAuthenticated(true);
      addNotification({
        title: 'Directorate Admin Authenticated',
        message: `State Directorate Master Console unlocked by ${trimmedId}. All 24 districts active.`,
        type: 'success'
      });
      return { success: true };
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch {
      // Ignore
    }
    setFirebaseUser(null);
    setIsAuthenticated(false);
    setHasPendingRegistration(false);
    setCurrentRole('farmer');
    setStaffOfficerId(null);
    setIsAboutProfileOpen(false);
    setIsQueryOpen(false);
    setIsNotificationOpen(false);
  };

  const setActiveTokenBooking = (booking: TokenBooking | null) => {
    if (!booking) return;
    setBookings(prev => {
      const exists = prev.find(b => b.id === booking.id);
      if (exists) {
        return prev.map(b => (b.id === booking.id ? booking : b));
      }
      return [...prev, booking];
    });
  };

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  // Add query ticket
  const addQuery = (category: FarmerQuery['category'], subject: string, description: string) => {
    const nextId = `TKT-${4100 + queries.length + 1}`;
    const selectedCentre = centres.find(c => c.id === selectedCentreId) || centres[0];

    const newQuery: FarmerQuery = {
      id: nextId,
      farmerId: farmerProfile.id,
      farmerName: farmerProfile.fullName,
      farmerPhone: farmerProfile.mobileNumber,
      district: selectedDistrict,
      centreName: selectedCentre.name,
      category,
      subject,
      description,
      status: 'Open',
      createdAt: 'Just now'
    };

    setQueries(prev => [newQuery, ...prev]);

    addNotification({
      title: `Query Ticket ${nextId} Registered`,
      message: `Your query regarding "${subject}" has been submitted to the APMC Mandi helpdesk.`,
      type: 'info'
    });
  };

  // Book a new slot
  const bookSlot = ({
    centreId,
    cropId,
    quantityQuintals,
    slotTime,
    bookingDate,
    harvestDate: _harvestDate,
    qualityCategory: _qualityCategory
  }: {
    centreId: string;
    cropId: string;
    quantityQuintals: number;
    slotTime: string;
    bookingDate: string;
    harvestDate: string;
    qualityCategory: QualityGrade;
  }): TokenBooking => {
    const selectedCentre = centres.find(c => c.id === centreId) || centres[0];
    const crop = crops.find(c => c.id === cropId) || crops[0];

    const nextSeq = 100 + (bookings.length + 1);
    const tokenNumber = `KF-${nextSeq}`;
    const tokenBookingId = `TB-${Date.now().toString().slice(-4)}`;
    const produceId = `PR${2000 + bookings.length + 1}`;

    const waitingCount = bookings.filter(
      b => b.centreId === centreId && (b.status === 'booked' || b.status === 'arrived' || b.status === 'waiting')
    ).length;

    const newBooking: TokenBooking = {
      id: tokenBookingId,
      tokenNumber,
      tokenSequence: nextSeq,
      farmerId: farmerProfile.id,
      farmerName: farmerProfile.fullName,
      farmerPhone: farmerProfile.mobileNumber,
      farmerVillage: farmerProfile.village,
      produceId,
      cropName: crop.name,
      quantityQuintals,
      centreId,
      centreName: selectedCentre.name,
      bookingDate,
      slotTime,
      queuePosition: waitingCount + 1,
      status: 'booked',
      createdAt: 'Just now'
    };

    // Update bookings
    setBookings(prev => [...prev, newBooking]);

    // Update slots capacity
    setTimeSlots(prev =>
      prev.map(slot => {
        if (slot.centreId === centreId && slot.timeRange === slotTime) {
          const newCount = slot.bookedCount + 1;
          return {
            ...slot,
            bookedCount: newCount,
            isAvailable: newCount < slot.maxCapacity
          };
        }
        return slot;
      })
    );

    // Update centre booked counts
    setCentres(prev =>
      prev.map(c => {
        if (c.id === centreId) {
          return {
            ...c,
            currentBookedQuintals: c.currentBookedQuintals + quantityQuintals,
            currentBookedFarmers: c.currentBookedFarmers + 1
          };
        }
        return c;
      })
    );

    // Confetti celebration
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch {
      // Ignored
    }

    addNotification({
      title: `Slot Confirmed: Token ${tokenNumber}`,
      message: `Your arrival window for ${crop.name} at ${selectedCentre.name} is confirmed for ${slotTime}.`,
      type: 'success'
    });

    // Advance to token pass and unlock through step 7 & 8
    advanceStep(7);

    return newBooking;
  };

  // Download Booking Confirmation Receipt
  const downloadBookingReceipt = (targetBooking?: TokenBooking) => {
    const booking = targetBooking || activeTokenBooking;
    if (!booking) return;

    const crop = crops.find(c => booking.cropName.includes(c.name.split(' ')[0])) || crops[0];
    const estimatedValue = booking.quantityQuintals * crop.mspPerQuintal;

    const receiptContent = `
================================================================================
                    GOVERNMENT OF GUJARAT - APMC MANDI
               KISANFLOW SMART AGRICULTURAL PROCUREMENT PASS
================================================================================
CONFIRMATION SLIP & ELECTRONIC GATE ENTRY AUTHORIZATION
Date Issued: ${new Date().toLocaleDateString('en-IN', { dateStyle: 'full' })}

--------------------------------------------------------------------------------
TOKEN & QUEUE DETAILS:
--------------------------------------------------------------------------------
Token Number        : ${booking.tokenNumber}
Queue Position      : #${booking.queuePosition}
Booking Status      : ${booking.status.toUpperCase()}
Produce ID          : ${booking.produceId}

--------------------------------------------------------------------------------
FARMER & BENEFICIARY INFORMATION:
--------------------------------------------------------------------------------
Farmer Name         : ${booking.farmerName}
Farmer ID           : ${booking.farmerId}
Mobile Number       : ${booking.farmerPhone}
Village / Taluka    : ${booking.farmerVillage}
Gujarat District    : ${selectedDistrict}
Aadhaar Linkage     : ${farmerProfile.aadhaarNumber || 'XXXX-XXXX-8921'} (DBT Verified)
Bank Account        : Ending in ${farmerProfile.bankAccountEnding || '9182'} (${farmerProfile.bankName || 'SBI'})

--------------------------------------------------------------------------------
PROCUREMENT CENTRE DETAILS:
--------------------------------------------------------------------------------
Centre Name         : ${booking.centreName}
Assigned Slot       : ${booking.slotTime}
Reporting Date      : ${booking.bookingDate}
Weighbridge Bay     : Automated Inbound Bay #2
Gate Pass Validity  : 30-Minute Grace Buffer from slot opening

--------------------------------------------------------------------------------
PRODUCE SPECIFICATION & MSP DETAILS:
--------------------------------------------------------------------------------
Crop / Produce      : ${booking.cropName}
Estimated Quantity  : ${booking.quantityQuintals} Quintals (${booking.quantityQuintals * 100} kg)
Govt MSP Rate       : Rs. ${crop.mspPerQuintal.toLocaleString('en-IN')} / Quintal
Estimated Value     : Rs. ${estimatedValue.toLocaleString('en-IN')}
Quality Expectation : Fair Average Quality (FAQ Standard, Moisture < ${crop.moistureLimitPercent}%)

--------------------------------------------------------------------------------
INSTRUCTIONS FOR FARMER / DRIVER:
--------------------------------------------------------------------------------
1. Present this digital slip at the APMC entry boom-barrier to security.
2. Ensure tractor/truck tyres are free of excessive mud before weighbridge tare.
3. Keep sample bag ready for automated digital moisture assay tester.
4. Final payment will be credited via Direct Benefit Transfer (DBT/PFMS).
5. For queries or roadside delay assistance, call Toll-Free: 1800-180-1551.

================================================================================
AUTHENTICATION HASH: KF-GJ-${booking.id}-SECURE-VERIFIED
KisanFlow Digital e-Procurement System - Ministry of Agriculture & Farmers Welfare
================================================================================
`.trim();

    const blob = new Blob([receiptContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `KisanFlow_Booking_Confirmation_${booking.tokenNumber}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    addNotification({
      title: `Receipt Downloaded: ${booking.tokenNumber}`,
      message: `Booking confirmation pass saved to your downloads folder.`,
      type: 'info'
    });
  };

  // Farmer marks arrived
  const markArrived = (bookingId: string) => {
    const arrivedAt = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    let updatedBooking: TokenBooking | null = null;

    setBookings(prev =>
      prev.map(b => {
        if (b.id === bookingId) {
          updatedBooking = {
            ...b,
            status: 'arrived',
            arrivedAt
          };
          return updatedBooking;
        }
        return b;
      })
    );

    if (updatedBooking) {
      addNotification({
        title: `Vehicle Arrived: Token ${(updatedBooking as TokenBooking).tokenNumber}`,
        message: `Status updated to Arrived. Please wait in the staging parking bay for your call.`,
        type: 'info'
      });
    }
  };

  // Operator calls token to weighbridge
  const callToken = (bookingId: string) => {
    const calledAt = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    let updatedBooking: TokenBooking | null = null;

    setBookings(prev =>
      prev.map(b => {
        if (b.id === bookingId) {
          updatedBooking = {
            ...b,
            status: 'called',
            calledAt
          };
          return updatedBooking;
        }
        return b;
      })
    );

    if (updatedBooking) {
      addNotification({
        title: `🚨 NOW SERVING: Token ${(updatedBooking as TokenBooking).tokenNumber}`,
        message: `Please proceed immediately with your tractor to Electronic Weighbridge #2.`,
        type: 'alert'
      });
    }
  };

  // Submit weighing results
  const submitWeighing = (bookingId: string, grossWeightKg: number, tareWeightKg: number) => {
    const netKg = Math.max(0, grossWeightKg - tareWeightKg);
    const netQtl = Math.round((netKg / 100) * 10) / 10;
    const weighingDetails = {
      grossWeightKg,
      tareWeightKg,
      netWeightKg: netKg,
      netWeightQuintals: netQtl,
      weighedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      operatorId: staffOfficerId || 'OPR-01'
    };

    let updatedBooking: TokenBooking | null = null;

    setBookings(prev =>
      prev.map(b => {
        if (b.id === bookingId) {
          updatedBooking = {
            ...b,
            status: 'in_progress',
            weighingDetails
          };
          return updatedBooking;
        }
        return b;
      })
    );

    if (updatedBooking) {
      addNotification({
        title: `Weighbridge Slip Generated: ${(updatedBooking as TokenBooking).tokenNumber}`,
        message: `Net Weight confirmed: ${netQtl} Quintals (${netKg} kg). Ready for quality assay.`,
        type: 'info'
      });
    }
  };

  // Submit quality verification
  const submitQualityCheck = (
    bookingId: string,
    grade: QualityGrade,
    moisture: number,
    foreignMatter: number,
    deductionPct: number,
    notes?: string
  ) => {
    const qualityDetails = {
      assignedGrade: grade,
      moisturePercent: moisture,
      foreignMatterPercent: foreignMatter,
      deductionPercent: deductionPct,
      verifiedBy: staffOfficerId ? `Insp. (${staffOfficerId})` : 'Insp. J. Patel',
      verifiedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      notes
    };

    let updatedBooking: TokenBooking | null = null;

    setBookings(prev =>
      prev.map(b => {
        if (b.id === bookingId) {
          updatedBooking = {
            ...b,
            qualityDetails
          };
          return updatedBooking;
        }
        return b;
      })
    );

    if (updatedBooking) {
      addNotification({
        title: `Quality Verified: ${grade}`,
        message: `Moisture: ${moisture}%, Foreign Matter: ${foreignMatter}%. Quality certification approved.`,
        type: 'success'
      });
    }
  };

  // Approve payment voucher
  const approvePaymentVoucher = (bookingId: string) => {
    const booking = bookings.find(b => b.id === bookingId);
    if (!booking) return;

    const crop = crops.find(c => booking.cropName.includes(c.name.split(' ')[0])) || crops[0];
    const netQuintals = booking.weighingDetails?.netWeightQuintals || booking.quantityQuintals;
    const rate = crop.mspPerQuintal;
    const gross = netQuintals * rate;
    const deductions = booking.qualityDetails?.deductionPercent
      ? Math.round((gross * booking.qualityDetails.deductionPercent) / 100)
      : 0;
    const finalAmount = gross - deductions;

    const voucherNumber = `VCH-GJ-${new Date().getFullYear()}-${booking.tokenSequence}`;
    const dbtRef = `PFMS${Date.now().toString().slice(-10)}`;
    const completedAt = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const paymentDetails = {
      voucherNumber,
      approvedQuantityQuintals: netQuintals,
      pricePerQuintal: rate,
      grossAmount: gross,
      deductionsAmount: deductions,
      finalPayableAmount: finalAmount,
      paymentStatus: 'Paid DBT' as const,
      dbtReferenceNo: dbtRef,
      paidAt: completedAt,
      bankAccountEnding: farmerProfile.bankAccountEnding ? `${farmerProfile.bankAccountEnding} (${farmerProfile.bankName || 'SBI'})` : '9182 (State Bank of India)'
    };

    const updatedBooking: TokenBooking = {
      ...booking,
      status: 'completed',
      completedAt,
      paymentDetails
    };

    setBookings(prev =>
      prev.map(b => (b.id === bookingId ? updatedBooking : b))
    );

    addNotification({
      title: `₹${finalAmount.toLocaleString('en-IN')} DBT Voucher Sanctioned!`,
      message: `Voucher ${voucherNumber} approved. Funds dispatched via PFMS to your account.`,
      type: 'success'
    });
  };

  // Fast-forward demo progression
  const simulateNextStage = (bookingId: string) => {
    const booking = bookings.find(b => b.id === bookingId);
    if (!booking) return;

    if (booking.status === 'booked') {
      markArrived(bookingId);
    } else if (booking.status === 'arrived') {
      callToken(bookingId);
    } else if (booking.status === 'called') {
      submitWeighing(bookingId, 7800, 3800);
    } else if (booking.weighingDetails && !booking.qualityDetails) {
      submitQualityCheck(bookingId, 'Grade A', 10.5, 0.4, 0, 'FAQ Approved');
    } else if (booking.qualityDetails && booking.status !== 'completed') {
      approvePaymentVoucher(bookingId);
    }
  };

  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => (n.id === id ? { ...n, read: true } : n)));
  };

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const resetAllData = () => {
    localStorage.removeItem(STORAGE_KEY);
    setCentres(PROCUREMENT_CENTRES);
    setTimeSlots(INITIAL_TIME_SLOTS);
    setBookings(INITIAL_BOOKINGS);
    setNotifications(INITIAL_NOTIFICATIONS);
    setQueries(INITIAL_QUERIES);
    setFarmerProfile(INITIAL_FARMER);
    setFarmerStepState(1);
    setMaxUnlockedStep(1);
    setIsAuthenticated(false);
  };

  const unreadNotificationCount = notifications.filter(n => !n.read).length;
  const t = translations[language];

  return (
    <AppContext.Provider
      value={{
        isAuthenticated,
        register,
        login,
        loginOfficialStaff,
        logout,
        staffOfficerId,
        registeredFarmers,
        registerNewFarmer,
        issueWalkInToken,

        // Firebase Auth Integration
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

        language,
        setLanguage,
        t,
        currentRole,
        setCurrentRole,
        farmerStep,
        setFarmerStep,
        maxUnlockedStep,
        setMaxUnlockedStep,
        advanceStep,
        farmerProfile,
        setFarmerProfile,
        selectedState,
        setSelectedState,
        selectedDistrict,
        setSelectedDistrict,
        selectedCentreId,
        setSelectedCentreId,
        activeTokenBooking,
        setActiveTokenBooking,
        centres,
        timeSlots,
        crops,
        bookings,
        notifications,
        unreadNotificationCount,
        queries,
        addQuery,
        isAboutProfileOpen,
        setIsAboutProfileOpen,
        isQueryOpen,
        setIsQueryOpen,
        isNotificationOpen,
        setIsNotificationOpen,

        bookSlot,
        markArrived,
        callToken,
        submitWeighing,
        submitQualityCheck,
        approvePaymentVoucher,
        simulateNextStage,
        markNotificationRead,
        markAllNotificationsRead,
        downloadBookingReceipt,
        resetAllData
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
