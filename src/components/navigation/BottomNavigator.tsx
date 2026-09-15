import React from 'react';
import { 
  CalendarClock, 
  Truck, 
  Ticket, 
  Bell
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const BottomNavigator: React.FC = () => {
  const { 
    currentRole,
    farmerStep, 
    setFarmerStep, 
    maxUnlockedStep,
    unreadNotificationCount, 
    setIsNotificationOpen
  } = useApp();

  // Bottom navigation is strictly for the Farmer workflow
  if (currentRole !== 'farmer') {
    return null;
  }

  const isBookingActive = farmerStep >= 1 && farmerStep <= 6;
  const isTokenActive = farmerStep === 7;
  const isTrackActive = farmerStep >= 8 && farmerStep <= 11;

  return (
    <nav 
      aria-label="Bottom Navigation" 
      className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-stone-200 shadow-xl"
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-8 py-2 flex items-center justify-around">
        
        {/* 1. Booking Slot Tab */}
        <button
          id="nav-booking-slot"
          type="button"
          onClick={() => {
            if (maxUnlockedStep >= 6) {
              setFarmerStep(6);
            } else {
              setFarmerStep(Math.min(maxUnlockedStep, 2));
            }
          }}
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all ${
            isBookingActive && currentRole === 'farmer'
              ? 'text-emerald-700 font-bold'
              : 'text-stone-500 hover:text-stone-900 font-medium'
          }`}
        >
          <div className={`p-1.5 rounded-xl transition-all ${
            isBookingActive && currentRole === 'farmer' ? 'bg-emerald-100 shadow-xs' : ''
          }`}>
            <CalendarClock className="w-5 h-5" />
          </div>
          <span className="text-[11px] sm:text-xs mt-1 whitespace-nowrap">
            Book Slot
          </span>
        </button>

        {/* 2. Track Produce Tab */}
        <button
          id="nav-track-produce"
          type="button"
          onClick={() => {
            if (maxUnlockedStep >= 9) {
              setFarmerStep(10);
            } else {
              // Not yet unlocked, go to highest unlocked step
              setFarmerStep(maxUnlockedStep);
            }
          }}
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all ${
            isTrackActive && currentRole === 'farmer'
              ? 'text-emerald-700 font-bold'
              : 'text-stone-500 hover:text-stone-900 font-medium'
          }`}
        >
          <div className={`p-1.5 rounded-xl transition-all ${
            isTrackActive && currentRole === 'farmer' ? 'bg-emerald-100 shadow-xs' : ''
          }`}>
            <Truck className="w-5 h-5" />
          </div>
          <span className="text-[11px] sm:text-xs mt-1 whitespace-nowrap">
            Track Produce
          </span>
        </button>

        {/* 3. View Token Tab */}
        <button
          id="nav-view-token"
          type="button"
          onClick={() => {
            if (maxUnlockedStep >= 7) {
              setFarmerStep(7);
            } else {
              setFarmerStep(maxUnlockedStep);
            }
          }}
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all ${
            isTokenActive && currentRole === 'farmer'
              ? 'text-emerald-700 font-bold'
              : 'text-stone-500 hover:text-stone-900 font-medium'
          }`}
        >
          <div className={`p-1.5 rounded-xl transition-all ${
            isTokenActive && currentRole === 'farmer' ? 'bg-emerald-100 shadow-xs' : ''
          }`}>
            <Ticket className="w-5 h-5" />
          </div>
          <span className="text-[11px] sm:text-xs mt-1 whitespace-nowrap">
            View Token
          </span>
        </button>

        {/* 4. Notification Tab */}
        <button
          id="nav-notification"
          type="button"
          onClick={() => setIsNotificationOpen(true)}
          className="flex flex-col items-center justify-center py-1 px-3 rounded-xl text-stone-500 hover:text-stone-900 transition-all relative font-medium"
        >
          <div className="p-1.5 rounded-xl relative">
            <Bell className="w-5 h-5" />
            {unreadNotificationCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-600 text-white text-[10px] font-bold flex items-center justify-center animate-pulse">
                {unreadNotificationCount}
              </span>
            )}
          </div>
          <span className="text-[11px] sm:text-xs mt-1 whitespace-nowrap">
            Notification
          </span>
        </button>

      </div>
    </nav>
  );
};
