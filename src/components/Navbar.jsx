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
  User
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
      borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
      background: 'rgba(11, 14, 20, 0.95)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5)'
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
              background: 'linear-gradient(135deg, #00F59B 0%, #059669 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 18px rgba(0, 245, 155, 0.35)',
              color: '#0B0E14'
            }}>
              <Building2 size={22} strokeWidth={2.5} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '1.15rem', fontWeight: '800', letterSpacing: '-0.02em', color: '#F0F6FC' }}>
                  ROYAL BANK OF INVESTMENT
                </span>
                <span className="badge font-mono-numbers" style={{ fontSize: '0.62rem', padding: '2px 7px', background: 'rgba(0, 245, 155, 0.12)', color: '#00F59B', border: '1px solid rgba(0, 245, 155, 0.3)' }}>
                  SYNDICATE TERMINAL
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '1px' }}>
                <p style={{ fontSize: '0.70rem', color: '#8B949E', margin: 0, letterSpacing: '0.02em' }}>
                  Real Business Projects Syndicate & Escrow
                </p>
                <span style={{ color: 'rgba(255, 255, 255, 0.2)', fontSize: '0.65rem' }}>•</span>
                <span className="font-mono-numbers" style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', fontSize: '0.70rem', color: '#00F59B', fontWeight: '600' }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#00F59B', boxShadow: '0 0 6px #00F59B' }}></span>
                  4 Active Ventures
                </span>
              </div>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav style={{ display: 'flex', alignItems: 'center', gap: '8px' }} className="nav-desktop desktop-only">
            <button 
              onClick={() => setActiveTab('projects')}
              className={`btn btn-sm ${activeTab === 'projects' ? 'btn-primary' : 'btn-ghost'}`}
              style={{ borderRadius: '10px', fontWeight: '700' }}
            >
              <Building2 size={16} />
              <span>Business Projects</span>
              <span className="badge badge-emerald" style={{ fontSize: '0.62rem', padding: '1px 6px', marginLeft: '3px' }}>
                4 Open
              </span>
            </button>

            <button 
              onClick={() => {
                setActiveTab('projects');
                setTimeout(() => {
                  const el = document.getElementById('how-it-works-section');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }, 50);
              }}
              className="btn btn-sm btn-ghost"
              style={{ borderRadius: '10px' }}
            >
              <Sparkles size={16} />
              <span>How It Works</span>
            </button>

            <button 
              onClick={() => {
                setActiveTab('projects');
                setTimeout(() => {
                  const el = document.getElementById('investor-protection-section');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }, 50);
              }}
              className="btn btn-sm btn-ghost"
              style={{ borderRadius: '10px' }}
            >
              <ShieldCheck size={16} />
              <span>Escrow & Safety</span>
            </button>

            <button 
              onClick={() => {
                setActiveTab('projects');
                setTimeout(() => {
                  const el = document.getElementById('my-investments-section');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }, 50);
              }}
              className="btn btn-sm btn-ghost"
              style={{ borderRadius: '10px' }}
            >
              <Layers size={16} />
              <span>My Investments</span>
            </button>

            {/* Sovereign Admin Desk Nav Link - Strictly for verified rajacofficial369@gmail.com */}
            {isAdminLoggedIn && (
              <button 
                onClick={() => setActiveTab('admin')}
                className={`btn btn-sm ${activeTab === 'admin' ? 'btn-primary' : 'btn-ghost'}`}
                style={{ 
                  borderRadius: '10px', 
                  fontWeight: '700', 
                  gap: '6px',
                  border: activeTab === 'admin' ? 'none' : '1px solid #e2e8f0',
                  background: activeTab === 'admin' ? undefined : '#fef3c7'
                }}
                title="Sovereign Admin Management Desk (rajacofficial369@gmail.com)"
              >
                <ShieldCheck size={16} color={activeTab === 'admin' ? '#000' : '#d97706'} />
                <span>Admin Desk</span>
                {pendingApprovalsCount > 0 ? (
                  <span style={{ background: '#f59e0b', color: '#000', borderRadius: '12px', padding: '1px 7px', fontSize: '0.62rem', fontWeight: '800' }}>
                    {pendingApprovalsCount}
                  </span>
                ) : (
                  <span className="badge badge-gold" style={{ fontSize: '0.6rem', padding: '1px 5px' }}>
                    Active
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
              flexDirection: 'column', 
              gap: '8px', 
              paddingTop: '12px', 
              marginTop: '12px', 
              borderTop: '1px solid #e2e8f0' 
            }}
          >
            <button 
              onClick={() => {
                setActiveTab('projects');
                setMobileMenuOpen(false);
              }}
              className={`btn btn-sm ${activeTab === 'projects' ? 'btn-primary' : 'btn-ghost'}`}
              style={{ justifyContent: 'flex-start', borderRadius: '8px', fontWeight: '700' }}
            >
              <Building2 size={16} />
              <span>4 Open Business Projects</span>
            </button>

            <button 
              onClick={() => {
                setActiveTab('projects');
                setMobileMenuOpen(false);
                setTimeout(() => {
                  const el = document.getElementById('candlestick-terminal-section');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }, 100);
              }}
              className="btn btn-sm btn-ghost"
              style={{ justifyContent: 'flex-start', borderRadius: '8px' }}
            >
              <BarChart3 size={16} />
              <span>Live Stock Candlestick Terminal</span>
            </button>

            <button 
              onClick={() => {
                setActiveTab('projects');
                setMobileMenuOpen(false);
                setTimeout(() => {
                  const el = document.getElementById('my-investments-section');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }, 100);
              }}
              className="btn btn-sm btn-ghost"
              style={{ justifyContent: 'flex-start', borderRadius: '8px' }}
            >
              <Layers size={16} />
              <span>My Investments</span>
            </button>

            <button 
              onClick={() => {
                setActiveTab('projects');
                setMobileMenuOpen(false);
                setTimeout(() => {
                  const el = document.getElementById('how-it-works-section');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }, 100);
              }}
              className="btn btn-sm btn-ghost"
              style={{ justifyContent: 'flex-start', borderRadius: '8px' }}
            >
              <Sparkles size={16} />
              <span>How It Works & Unit Economics</span>
            </button>

            <button 
              onClick={() => {
                setActiveTab('projects');
                setMobileMenuOpen(false);
                setTimeout(() => {
                  const el = document.getElementById('investor-protection-section');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }, 100);
              }}
              className="btn btn-sm btn-ghost"
              style={{ justifyContent: 'flex-start', borderRadius: '8px' }}
            >
              <ShieldCheck size={16} />
              <span>Escrow & Safety (8248651695-3@ybl)</span>
            </button>

            {/* Sovereign Admin Link (Only for verified admin) */}
            {isAdminLoggedIn && (
              <button 
                onClick={() => {
                  setActiveTab('admin');
                  setMobileMenuOpen(false);
                }}
                className={`btn btn-sm ${activeTab === 'admin' ? 'btn-primary' : 'btn-ghost'}`}
                style={{ justifyContent: 'flex-start', borderRadius: '8px', fontWeight: '700' }}
              >
                <Lock size={16} />
                <span>Admin Management Desk</span>
                <span className="badge badge-gold" style={{ fontSize: '0.62rem', marginLeft: 'auto' }}>
                  Admin Active
                </span>
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

      {/* ========================================================================= */}
      {/* NATIVE MOBILE BOTTOM APP BAR (Robinhood / Zerodha / Binance App Style)    */}
      {/* ========================================================================= */}
      <nav className="mobile-bottom-nav" aria-label="Mobile Bottom Navigation">
        <button 
          onClick={() => {
            setActiveTab('projects');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className={`mobile-nav-item ${activeTab === 'projects' ? 'active' : ''}`}
        >
          <Building2 size={20} />
          <span>Ventures</span>
        </button>

        <button 
          onClick={() => {
            setActiveTab('projects');
            setTimeout(() => {
              const el = document.getElementById('candlestick-terminal-section');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }, 60);
          }}
          className="mobile-nav-item"
        >
          <BarChart3 size={20} />
          <span>Terminal</span>
        </button>

        <button 
          onClick={() => {
            setActiveTab('projects');
            setTimeout(() => {
              const el = document.getElementById('my-investments-section');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }, 60);
          }}
          className="mobile-nav-item"
        >
          <Layers size={20} />
          <span>Holdings</span>
        </button>

        {isAdminLoggedIn ? (
          <button 
            onClick={() => setActiveTab('admin')}
            className={`mobile-nav-item ${activeTab === 'admin' ? 'active' : ''}`}
          >
            <ShieldCheck size={20} />
            <span>Admin</span>
          </button>
        ) : (
          <button 
            onClick={() => {
              setActiveTab('projects');
              setTimeout(() => {
                const el = document.getElementById('how-it-works-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }, 60);
            }}
            className="mobile-nav-item"
          >
            <Sparkles size={20} />
            <span>How It Works</span>
          </button>
        )}

        <button 
          onClick={() => setIsKYCModalOpen(true)}
          className="mobile-nav-item"
        >
          <User size={20} />
          <span>{user.kycStatus === 'verified' ? 'Verified' : 'Account'}</span>
        </button>
      </nav>
    </header>
  );
};
