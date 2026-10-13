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
  HeartHandshake
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
    startups
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const totalCartCount = cart.reduce((sum, item) => sum + item.shares, 0);

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

          </div>

        </div>
      </div>
    </header>
  );
};
