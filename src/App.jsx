import React from 'react';
import { useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { BusinessProjectsDashboard } from './components/BusinessProjectsDashboard';
import { AdminPortal } from './components/AdminPortal';
import { KYCModal } from './components/KYCModal';
import { Footer } from './components/Footer';

export const App = () => {
  const { activeTab } = useApp();

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Universal Institutional Header */}
      <Navbar />

      {/* Main Content Area: Business Projects Investment Syndicate */}
      <main style={{ flex: 1 }}>
        {activeTab === 'admin' ? (
          <AdminPortal />
        ) : (
          <BusinessProjectsDashboard />
        )}
      </main>

      {/* Investor Verification Modal */}
      <KYCModal />

      {/* Institutional Footer */}
      <Footer />
    </div>
  );
};

