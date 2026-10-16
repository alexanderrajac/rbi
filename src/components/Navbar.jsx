import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Building2, 
  ShoppingCart, 
  Wallet, 
  ShieldCheck, 
  TrendingUp, 
  Sparkles, 
  Lock, 
  UserCheck, 
  DollarSign, 
  Layers, 
  Globe, 
  ChevronDown,
  BarChart3,
  BadgeCheck,
  CheckCircle2,
  Menu,
  X,
  Zap,
  HeartHandshake,
  LogOut,
  User,
  Calculator
} from 'lucide-react';

export const Navbar = () => {
  const { 
    activeTab, 
    setActiveTab, 
    currentRole, 
    setCurrentRole, 
    currency, 
    setCurrency, 
    formatMoney, 
    walletBalance, 
    cart, 
    setIsCartOpen, 
    setIsWalletModalOpen, 
    setIsKYCModalOpen,
    user,
    isAdminLoggedIn,
    startups,
    projectInvestments,
    supabaseUser,
    loginWithGoogle,
    logoutUser,
    isAuthLoading
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const totalCartCount = cart.reduce((sum, item) => sum + item.shares, 0);
  const pendingApprovalsCount = (projectInvestments || []).filter(i => i.status === 'PENDING_APPROVAL').length;

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 50,
      borderBottom: '1px solid #E2E8F0',
      background: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      boxShadow: '0 4px 20px rgba(15, 23, 42, 0.06)'
    }}>
      {/* Main Navbar */}
      <div className="container" style={{ padding: '12px 20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
          
          {/* Logo & Platform Title */}
          <div 
            onClick={() => setActiveTab('projects')} 
            style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}
          >
            <div style={{ 
              width: '40px', 
              height: '40px', 
              borderRadius: '10px', 
              background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 14px rgba(16, 185, 129, 0.35)',
              color: '#FFFFFF'
            }}>
              <Building2 size={22} strokeWidth={2.5} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '1.15rem', fontWeight: '800', letterSpacing: '-0.02em', color: '#0F172A' }}>
                  ROYAL BANK OF INVESTMENT
                </span>
                <span className="badge font-mono-numbers" style={{ fontSize: '0.62rem', padding: '2px 7px', background: 'rgba(16, 185, 129, 0.12)', color: '#059669', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
                  ESCROW BACKED
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '1px' }}>
                <p style={{ fontSize: '0.70rem', color: '#64748B', margin: 0, letterSpacing: '0.02em' }}>
                  Real Business Projects Syndicate & Escrow
                </p>
                <span style={{ color: '#CBD5E1', fontSize: '0.65rem' }}>•</span>
                <span className="font-mono-numbers" style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', fontSize: '0.70rem', color: '#059669', fontWeight: '700' }}>
                  <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#10B981', boxShadow: '0 0 6px rgba(16, 185, 129, 0.6)' }}></span>
                  4 Verified Deals
                </span>
              </div>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav style={{ display: 'flex', alignItems: 'center', gap: '6px' }} className="nav-desktop desktop-only">
            <button 
              onClick={() => setActiveTab('ventures')}
              className={`btn btn-sm ${(activeTab === 'ventures' || activeTab === 'projects') ? 'btn-primary' : 'btn-ghost'}`}
              style={{ borderRadius: '8px', fontWeight: '700' }}
            >
              <Building2 size={15} />
              <span>Projects</span>
              <span className="badge badge-emerald" style={{ fontSize: '0.62rem', padding: '1px 6px', marginLeft: '3px' }}>
                4 Open
              </span>
            </button>

            <button 
              onClick={() => setActiveTab('terminal')}
              className={`btn btn-sm ${activeTab === 'terminal' ? 'btn-primary' : 'btn-ghost'}`}
              style={{ borderRadius: '8px', fontWeight: '700' }}
            >
              <BarChart3 size={15} />
              <span>Growth & Financials</span>
            </button>

            <button 
              onClick={() => setActiveTab('calculator')}
              className={`btn btn-sm ${activeTab === 'calculator' ? 'btn-primary' : 'btn-ghost'}`}
              style={{ borderRadius: '8px', fontWeight: '700' }}
            >
              <Calculator size={15} />
              <span>Calculator</span>
            </button>

            <button 
              onClick={() => setActiveTab('how-it-works')}
              className={`btn btn-sm ${activeTab === 'how-it-works' ? 'btn-primary' : 'btn-ghost'}`}
              style={{ borderRadius: '8px', fontWeight: '700' }}
            >
              <Sparkles size={15} />
              <span>How It Works</span>
            </button>

            <button 
              onClick={() => setActiveTab('escrow')}
              className={`btn btn-sm ${activeTab === 'escrow' ? 'btn-primary' : 'btn-ghost'}`}
              style={{ borderRadius: '8px', fontWeight: '700' }}
            >
              <ShieldCheck size={15} />
              <span>Escrow & Safety</span>
            </button>

            <button 
              onClick={() => setActiveTab('portfolio')}
              className={`btn btn-sm ${activeTab === 'portfolio' ? 'btn-primary' : 'btn-ghost'}`}
              style={{ borderRadius: '8px', fontWeight: '700' }}
            >
              <Layers size={15} />
              <span>My Portfolio</span>
              {projectInvestments && projectInvestments.length > 0 && (
                <span className="badge badge-gold" style={{ fontSize: '0.62rem', padding: '1px 5px', marginLeft: '3px' }}>
                  {projectInvestments.length}
                </span>
              )}
            </button>

            {/* Sovereign Admin Desk Nav Link - Strictly for verified rajacofficial369@gmail.com */}
            {isAdminLoggedIn && (
              <button 
                onClick={() => setActiveTab('admin')}
                className={`btn btn-sm ${activeTab === 'admin' ? 'btn-primary' : 'btn-ghost'}`}
                style={{ 
                  borderRadius: '8px', 
                  fontWeight: '700', 
                  gap: '6px',
                  border: activeTab === 'admin' ? 'none' : '1px solid rgba(245, 158, 11, 0.4)',
                  background: activeTab === 'admin' ? '#F59E0B' : 'rgba(245, 158, 11, 0.15)',
                  color: activeTab === 'admin' ? '#0B0E14' : '#F59E0B'
                }}
                title="Sovereign Admin Management Desk (rajacofficial369@gmail.com)"
              >
                <ShieldCheck size={15} />
                <span>Admin Desk</span>
                {pendingApprovalsCount > 0 && (
                  <span style={{ background: '#FF3366', color: '#FFF', borderRadius: '12px', padding: '1px 6px', fontSize: '0.62rem', fontWeight: '800' }}>
                    {pendingApprovalsCount}
                  </span>
                )}
              </button>
            )}
          </nav>

          {/* Right Action Bar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            
            {/* Currency Selector */}
            <button 
              onClick={() => setCurrency(currency === 'USD' ? 'INR' : 'USD')}
              className="btn btn-secondary btn-sm"
              style={{ padding: '6px 10px', fontSize: '0.78rem', gap: '4px', borderRadius: '8px' }}
              title="Switch Currency between INR and USD"
            >
              <Globe size={13} />
              <span style={{ fontWeight: '700' }}>{currency === 'USD' ? '$' : '₹'}</span>
            </button>

            {/* Quick Invest CTA - Desktop only */}
            <button 
              onClick={() => {
                setActiveTab('projects');
                setTimeout(() => {
                  const el = document.getElementById('projects-grid');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }, 50);
              }}
              className="btn btn-primary btn-sm desktop-only"
              style={{ 
                padding: '7px 14px', 
                fontWeight: '700',
                alignItems: 'center',
                gap: '6px',
                borderRadius: '8px'
              }}
            >
              <Zap size={15} />
              <span>Invest</span>
            </button>

            {/* User KYC Badge - Desktop only */}
            <button 
              onClick={() => setIsKYCModalOpen(true)}
              className={`badge ${user.kycStatus === 'verified' ? 'badge-emerald' : 'badge-gold'} desktop-only`}
              style={{ cursor: 'pointer', padding: '6px 12px', height: '34px', textTransform: 'none', borderRadius: '8px' }}
              title="Click to check KYC Status"
            >
              <BadgeCheck size={15} />
              <span style={{ fontWeight: '600', fontSize: '0.8rem' }}>
                {user.kycStatus === 'verified' ? 'Verified' : 'Verify'}
              </span>
            </button>

            {/* Google OAuth Supabase Authentication */}
            {supabaseUser ? (
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '6px', 
                padding: '3px 8px', 
                borderRadius: '8px', 
                background: '#f8fafc', 
                border: '1px solid #e2e8f0',
                boxShadow: '0 1px 2px rgba(0,0,0,0.04)'
              }}>
                {user.avatarUrl ? (
                  <img 
                    src={user.avatarUrl} 
                    alt={user.name} 
                    referrerPolicy="no-referrer"
                    style={{ width: '26px', height: '26px', borderRadius: '50%', objectFit: 'cover' }} 
                  />
                ) : (
                  <div style={{ width: '26px', height: '26px', borderRadius: '50%', background: '#d97706', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.72rem', fontWeight: '700' }}>
                    {user.name?.charAt(0) || 'U'}
                  </div>
                )}
                <span className="desktop-only" style={{ fontSize: '0.76rem', fontWeight: '700', color: '#0f172a', maxWidth: '80px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {user.name}
                </span>
                <button
                  onClick={logoutUser}
                  className="btn btn-ghost btn-sm"
                  style={{ padding: '3px', minWidth: 'auto', color: '#64748b' }}
                  title="Sign Out"
                >
                  <LogOut size={13} />
                </button>
              </div>
            ) : (
              <button
                onClick={loginWithGoogle}
                disabled={isAuthLoading}
                className="btn btn-sm"
                style={{
                  background: '#ffffff',
                  color: '#1f2937',
                  border: '1px solid #d1d5db',
                  padding: '6px 10px',
                  fontWeight: '600',
                  fontSize: '0.78rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  borderRadius: '8px',
                  boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                  cursor: isAuthLoading ? 'wait' : 'pointer'
                }}
                title="Sign in with Google via Supabase OAuth"
              >
                <svg width="14" height="14" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                </svg>
                <span className="desktop-only">{isAuthLoading ? '...' : 'Sign in'}</span>
              </button>
            )}

            {/* Mobile Menu Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="btn btn-ghost btn-sm mobile-only"
              style={{ padding: '6px', minWidth: 'auto', border: '1px solid #e2e8f0', borderRadius: '8px' }}
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>

          </div>

        </div>

        {/* Mobile Slide-down Drawer */}
        {mobileMenuOpen && (
          <div 
            className="mobile-only"
            style={{ 
              display: 'flex',
              flexDirection: 'column', 
              gap: '6px', 
              paddingTop: '12px', 
              marginTop: '12px', 
              borderTop: '1px solid #E2E8F0' 
            }}
          >
            <button 
              onClick={() => {
                setActiveTab('ventures');
                setMobileMenuOpen(false);
              }}
              className={`btn btn-sm ${(activeTab === 'ventures' || activeTab === 'projects') ? 'btn-primary' : 'btn-ghost'}`}
              style={{ justifyContent: 'flex-start', borderRadius: '8px', fontWeight: '700' }}
            >
              <Building2 size={16} />
              <span>4 Open Business Ventures</span>
            </button>

            <button 
              onClick={() => {
                setActiveTab('terminal');
                setMobileMenuOpen(false);
              }}
              className={`btn btn-sm ${activeTab === 'terminal' ? 'btn-primary' : 'btn-ghost'}`}
              style={{ justifyContent: 'flex-start', borderRadius: '8px', fontWeight: '700' }}
            >
              <BarChart3 size={16} />
              <span>Growth & Financial Analytics</span>
            </button>

            <button 
              onClick={() => {
                setActiveTab('calculator');
                setMobileMenuOpen(false);
              }}
              className={`btn btn-sm ${activeTab === 'calculator' ? 'btn-primary' : 'btn-ghost'}`}
              style={{ justifyContent: 'flex-start', borderRadius: '8px', fontWeight: '700' }}
            >
              <Calculator size={16} />
              <span>Profit Ratio & Return Calculator</span>
            </button>

            <button 
              onClick={() => {
                setActiveTab('how-it-works');
                setMobileMenuOpen(false);
              }}
              className={`btn btn-sm ${activeTab === 'how-it-works' ? 'btn-primary' : 'btn-ghost'}`}
              style={{ justifyContent: 'flex-start', borderRadius: '8px', fontWeight: '700' }}
            >
              <Sparkles size={16} />
              <span>Execution Workflow & Guide</span>
            </button>

            <button 
              onClick={() => {
                setActiveTab('escrow');
                setMobileMenuOpen(false);
              }}
              className={`btn btn-sm ${activeTab === 'escrow' ? 'btn-primary' : 'btn-ghost'}`}
              style={{ justifyContent: 'flex-start', borderRadius: '8px', fontWeight: '700' }}
            >
              <ShieldCheck size={16} />
              <span>Escrow Vault & Safety (8248651695-3@ybl)</span>
            </button>

            <button 
              onClick={() => {
                setActiveTab('portfolio');
                setMobileMenuOpen(false);
              }}
              className={`btn btn-sm ${activeTab === 'portfolio' ? 'btn-primary' : 'btn-ghost'}`}
              style={{ justifyContent: 'flex-start', borderRadius: '8px', fontWeight: '700' }}
            >
              <Layers size={16} />
              <span>My Portfolio & Certificates</span>
            </button>

            {/* Sovereign Admin Link (Only for verified admin) */}
            {isAdminLoggedIn && (
              <button 
                onClick={() => {
                  setActiveTab('admin');
                  setMobileMenuOpen(false);
                }}
                className={`btn btn-sm ${activeTab === 'admin' ? 'btn-primary' : 'btn-ghost'}`}
                style={{ 
                  justifyContent: 'flex-start', 
                  borderRadius: '8px', 
                  fontWeight: '700', 
                  gap: '6px',
                  background: activeTab === 'admin' ? '#F59E0B' : 'rgba(245, 158, 11, 0.15)',
                  color: activeTab === 'admin' ? '#0B0E14' : '#F59E0B',
                  border: '1px solid rgba(245, 158, 11, 0.4)'
                }}
              >
                <ShieldCheck size={16} />
                <span>Sovereign Admin Management Desk</span>
              </button>
            )}

            <button 
              onClick={() => {
                setIsKYCModalOpen(true);
                setMobileMenuOpen(false);
              }}
              className="btn btn-secondary btn-sm"
              style={{ justifyContent: 'flex-start', borderRadius: '8px', marginTop: '4px' }}
            >
              <BadgeCheck size={16} />
              <span>Investor Verification (KYC)</span>
            </button>
          </div>
        )}
      </div>

      {/* Multi-Page Mobile Bottom Navigation Bar (Robinhood/TradingView 1-Tap Switching) */}
      <nav className="mobile-bottom-nav">
        <button 
          onClick={() => setActiveTab('ventures')}
          className={`mobile-bottom-nav-item ${(activeTab === 'ventures' || activeTab === 'projects') ? 'active' : ''}`}
        >
          <Building2 size={18} />
          <span>Ventures</span>
        </button>

        <button 
          onClick={() => setActiveTab('terminal')}
          className={`mobile-bottom-nav-item ${activeTab === 'terminal' ? 'active' : ''}`}
        >
          <BarChart3 size={18} />
          <span>Analytics</span>
        </button>

        <button 
          onClick={() => setActiveTab('calculator')}
          className={`mobile-bottom-nav-item ${activeTab === 'calculator' ? 'active' : ''}`}
        >
          <Calculator size={18} />
          <span>Calculator</span>
        </button>

        <button 
          onClick={() => setActiveTab('escrow')}
          className={`mobile-bottom-nav-item ${activeTab === 'escrow' ? 'active' : ''}`}
        >
          <ShieldCheck size={18} />
          <span>Escrow</span>
        </button>

        <button 
          onClick={() => setActiveTab('portfolio')}
          className={`mobile-bottom-nav-item ${activeTab === 'portfolio' ? 'active' : ''}`}
        >
          <Layers size={18} />
          <span>Portfolio</span>
        </button>
      </nav>
    </header>
  );
};
