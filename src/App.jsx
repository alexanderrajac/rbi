import React from 'react';
import { useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { MarqueeTicker } from './components/MarqueeTicker';
import { BusinessProjectsDashboard } from './components/BusinessProjectsDashboard';
import { AdminPortal } from './components/AdminPortal';
import { KYCModal } from './components/KYCModal';
import { Footer } from './components/Footer';

export const App = () => {
  const { activeTab, isAdminLoggedIn } = useApp();
  const isExplicitAdminUrl = typeof window !== 'undefined' && (
    window.location.search.includes('admin') || 
    window.location.hash.includes('admin')
  );

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#F8FAFC', color: '#0F172A' }}>
      {/* Universal Institutional Header */}
      <Navbar />

      {/* Streaming High-Frequency Marquee Ticker */}
      <MarqueeTicker />

      {/* Main Content Area: Business Projects Investment Syndicate */}
      <main style={{ flex: 1 }}>
        {activeTab === 'admin' && (isAdminLoggedIn || isExplicitAdminUrl) ? (
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

