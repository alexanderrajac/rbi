import React from 'react';
import { useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { FundCollectionPortal } from './components/FundCollectionPortal';
import { BusinessProjectsDashboard } from './components/BusinessProjectsDashboard';
import { Marketplace } from './components/Marketplace';
import { Portfolio } from './components/Portfolio';
import { StartupPortal } from './components/StartupPortal';
import { AIValuationOracle } from './components/AIValuationOracle';
import { AdminPortal } from './components/AdminPortal';
import { StartupDetailModal } from './components/StartupDetailModal';
import { InvestmentCartModal } from './components/InvestmentCartModal';
import { DigitalCertificateModal } from './components/DigitalCertificateModal';
import { WalletDepositModal } from './components/WalletDepositModal';
import { KYCModal } from './components/KYCModal';
import { ProjectDetailModal } from './components/ProjectDetailModal';
import { Footer } from './components/Footer';

export const App = () => {
  const { activeTab } = useApp();

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Universal Navigation Header */}
      <Navbar />

      {/* Main Content Area */}
      <main style={{ flex: 1 }}>
        {activeTab === 'projects' && <BusinessProjectsDashboard />}
        {activeTab === 'collect' && <FundCollectionPortal />}
        {activeTab === 'marketplace' && <Marketplace />}
        {activeTab === 'portfolio' && <Portfolio />}
        {activeTab === 'raise' && <StartupPortal />}
        {activeTab === 'ai-oracle' && <AIValuationOracle />}
        {activeTab === 'admin' && <AdminPortal />}
      </main>

      {/* Global Interactive Modals */}
      <StartupDetailModal />
      <ProjectDetailModal />
      <InvestmentCartModal />
      <DigitalCertificateModal />
      <WalletDepositModal />
      <KYCModal />

      {/* Institutional Footer */}
      <Footer />
    </div>
  );
};

