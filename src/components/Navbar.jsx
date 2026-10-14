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
    <header className="sticky top-0 z-50 border-b border-[#e2e8f0] bg-white/95 backdrop-blur-xl shadow-sm">
      {/* Main Navbar */}
      <div className="container" style={{ padding: '14px 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
          
          {/* Logo & Platform Title */}
          <div 
            onClick={() => setActiveTab('projects')} 
            style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}
          >
            <div style={{ 
              width: '42px', 
              height: '42px', 
              borderRadius: '12px', 
              background: 'linear-gradient(135deg, #fbbf24 0%, #d97706 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 20px rgba(245, 158, 11, 0.4)',
              color: '#000'
            }}>
              <Building2 size={24} strokeWidth={2.4} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '1.2rem', fontWeight: '800', letterSpacing: '-0.02em' }} className="gold-gradient-text">
                  ROYAL BANK OF INVESTMENT
                </span>
                <span className="badge badge-gold" style={{ fontSize: '0.62rem', padding: '2px 7px' }}>
                  VENTURE CAPITAL
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '1px' }}>
                <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', margin: 0, letterSpacing: '0.02em' }}>
                  Real Business Projects Syndicate & Escrow
                </p>
                <span style={{ color: 'var(--text-dim)', fontSize: '0.65rem' }}>•</span>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.7rem', color: '#10b981', fontWeight: '600' }}>
                  <span className="live-pulse-dot" style={{ width: '6px', height: '6px' }}></span>
                  4 Active Ventures
                </span>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav style={{ display: 'flex', alignItems: 'center', gap: '8px' }} className="nav-desktop">
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
                  border: activeTab === 'admin' ? 'none' : '1px solid #e2e8f0'
                }}
                title="Sovereign Admin Management Desk"
              >
                <ShieldCheck size={16} color={activeTab === 'admin' ? '#000' : '#d97706'} />
                <span>Admin Desk</span>
                {pendingApprovalsCount > 0 ? (
                  <span style={{ background: '#f59e0b', color: '#000', borderRadius: '12px', padding: '1px 7px', fontSize: '0.62rem', fontWeight: '800' }}>
                    {pendingApprovalsCount}
                  </span>
                ) : (
                  <span className="badge badge-gold" style={{ fontSize: '0.6rem', padding: '1px 5px' }}>
                    Admin
                  </span>
                )}
              </button>
            )}
          </nav>

          {/* Right Action Bar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            
            {/* Currency Selector */}
            <button 
              onClick={() => setCurrency(currency === 'USD' ? 'INR' : 'USD')}
              className="btn btn-secondary btn-sm"
              style={{ padding: '7px 11px', fontSize: '0.8rem', gap: '5px' }}
              title="Switch Currency between INR and USD"
            >
              <Globe size={14} />
              <span style={{ fontWeight: '700' }}>{currency === 'USD' ? '$ USD' : '₹ INR'}</span>
            </button>

            {/* Quick Invest CTA */}
            <button 
              onClick={() => {
                setActiveTab('projects');
                setTimeout(() => {
                  const el = document.getElementById('projects-grid');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }, 50);
              }}
              className="btn btn-primary btn-sm"
              style={{ 
                padding: '7px 14px', 
                fontWeight: '700',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <Zap size={15} />
              <span>Invest Now</span>
            </button>

            {/* User KYC Badge */}
            <button 
              onClick={() => setIsKYCModalOpen(true)}
              className={`badge ${user.kycStatus === 'verified' ? 'badge-emerald' : 'badge-gold'}`}
              style={{ cursor: 'pointer', padding: '6px 12px', height: '36px', textTransform: 'none' }}
              title="Click to check KYC Status"
            >
              <BadgeCheck size={16} />
              <span style={{ fontWeight: '600', fontSize: '0.82rem' }}>
                {user.kycStatus === 'verified' ? 'Verified Investor' : 'Verify Identity'}
              </span>
            </button>

            {/* Google OAuth Supabase Authentication */}
            {supabaseUser ? (
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '8px', 
                padding: '4px 10px', 
                borderRadius: '10px', 
                background: '#f8fafc', 
                border: '1px solid #e2e8f0',
                boxShadow: '0 1px 2px rgba(0,0,0,0.04)'
              }}>
                {user.avatarUrl ? (
                  <img 
                    src={user.avatarUrl} 
                    alt={user.name} 
                    referrerPolicy="no-referrer"
                    style={{ width: '28px', height: '28px', borderRadius: '50%', objectFit: 'cover' }} 
                  />
                ) : (
                  <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#d97706', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: '700' }}>
                    {user.name?.charAt(0) || 'U'}
                  </div>
                )}
                <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'left', maxWidth: '120px' }}>
                  <span style={{ fontSize: '0.78rem', fontWeight: '700', color: '#0f172a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {user.name}
                  </span>
                  <span style={{ fontSize: '0.64rem', color: '#10b981', fontWeight: '600' }}>Google Verified</span>
                </div>
                <button
                  onClick={logoutUser}
                  className="btn btn-ghost btn-sm"
                  style={{ padding: '4px', minWidth: 'auto', color: '#64748b' }}
                  title="Sign Out"
                >
                  <LogOut size={14} />
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
                  padding: '7px 12px',
                  fontWeight: '600',
                  fontSize: '0.82rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  borderRadius: '10px',
                  boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                  cursor: isAuthLoading ? 'wait' : 'pointer'
                }}
                title="Sign in with Google via Supabase OAuth"
              >
                <svg width="16" height="16" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                </svg>
                <span>{isAuthLoading ? 'Loading...' : 'Sign in with Google'}</span>
              </button>
            )}

          </div>

        </div>
      </div>
    </header>
  );
};
