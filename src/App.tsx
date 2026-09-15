import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { AuthView } from './components/auth/AuthView';
import { FarmerWorkflow } from './components/farmer/FarmerWorkflow';
import { OperatorDashboard } from './components/operator/OperatorDashboard';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { AboutProfileModal } from './components/profile/AboutProfileModal';
import { QueryModal } from './components/helpdesk/QueryModal';
import { BottomNavigator } from './components/navigation/BottomNavigator';
import { Phone, ShieldCheck, Wheat } from 'lucide-react';

const MainContent: React.FC = () => {
  const { currentRole } = useApp();

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 flex-1 pb-24 sm:pb-28">
      {currentRole === 'farmer' && <FarmerWorkflow />}
      {currentRole === 'operator' && <OperatorDashboard />}
      {currentRole === 'admin' && <AdminDashboard />}
    </main>
  );
};

const AppShell: React.FC = () => {
  const { isAuthenticated, hasPendingRegistration } = useApp();

  // First interface in front of the website is the Registration / Sign In portal
  if (!isAuthenticated || hasPendingRegistration) {
    return <AuthView />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-stone-50/80 text-stone-900 font-sans">
      {/* Top Header with Profile, Query, Language, & Logout */}
      <Header />

      {/* Main Role Content */}
      <MainContent />

      {/* Modals & Drawers */}
      <AboutProfileModal />
      <QueryModal />

      {/* Persistent Bottom Navigator */}
      <BottomNavigator />

      {/* Global Desktop Footer */}
      <footer className="mt-auto border-t border-stone-200 bg-white py-6 mb-16 sm:mb-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <div className="flex items-center gap-2">
            <span className="font-bold text-stone-800 flex items-center gap-1">
              <Wheat className="w-3.5 h-3.5 text-emerald-600" />
              <span>KisanFlow Gujarat</span>
            </span>
            <span>•</span>
            <span>Smart Agricultural Procurement & Digital Queue System</span>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1 text-emerald-800 font-medium">
              <Phone className="w-3.5 h-3.5" />
              <span>Kisan Helpline: 1800-180-1551 (Toll Free)</span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-1 text-stone-600">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Direct Benefit Transfer (DBT) PFMS Active</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppShell />
    </AppProvider>
  );
}
