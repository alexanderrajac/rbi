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
    <header className="sticky top-0 z-50 border-b border-[var(--border-color)] bg-[#060911]/95 backdrop-blur-xl">
      {/* Real-time Ticker Ribbon */}
      <div className="ticker-container">
        <div className="ticker-track">
          {startups.slice(0, 6).concat(startups.slice(0, 6)).map((st, i) => (
            <div key={`${st.id}-${i}`} className="inline-flex items-center gap-2 cursor-pointer hover:text-amber-400 transition-colors">
              <span className="font-bold text-white">{st.ticker}</span>
              <span className="text-slate-400">{st.name}</span>
              <span className="text-amber-400 font-semibold">{formatMoney(st.sharePrice)}</span>
              <span className="text-emerald-400 text-xs font-mono font-bold">{st.change24h}</span>
              <span className="text-slate-600">|</span>
            </div>
          ))}
        </div>
      </div>

      {/* Main Navbar */}
      <div className="container" style={{ padding: '12px 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
          
          {/* Logo & Platform Title */}
          <div 
            onClick={() => setActiveTab('collect')} 
            style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}
          >
            <div style={{ 
              width: '44px', 
              height: '44px', 
              borderRadius: '13px', 
              background: 'linear-gradient(135deg, #fbbf24 0%, #d97706 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 24px rgba(245, 158, 11, 0.45)',
              color: '#000'
            }}>
              <Building2 size={25} strokeWidth={2.4} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '1.25rem', fontWeight: '800', letterSpacing: '-0.02em' }} className="gold-gradient-text">
                  ROYAL BANK OF INVESTMENT
                </span>
                <span className="badge badge-gold" style={{ fontSize: '0.62rem', padding: '2px 7px' }}>
                  FUND COLLECTION
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '1px' }}>
                <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', margin: 0, letterSpacing: '0.04em' }}>
                  DIRECT CAPITAL & ESCROW FUNDING
                </p>
                <span style={{ color: 'var(--text-dim)', fontSize: '0.65rem' }}>•</span>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.68rem', color: '#10b981', fontWeight: '600' }}>
                  <span className="live-pulse-dot" style={{ width: '6px', height: '6px' }}></span>
                  Escrow Rails Live
                </span>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav style={{ display: 'flex', alignItems: 'center', gap: '6px' }} className="nav-desktop">
            <button 
              onClick={() => setActiveTab('projects')}
              className={`btn btn-sm ${activeTab === 'projects' ? 'btn-primary' : 'btn-ghost'}`}
              style={{ borderRadius: '10px', fontWeight: '700' }}
            >
              <Building2 size={16} />
              <span>Business Projects</span>
              <span className="badge badge-gold" style={{ fontSize: '0.6rem', padding: '1px 5px', marginLeft: '2px' }}>
                4 Plans
              </span>
            </button>

            <button 
              onClick={() => setActiveTab('collect')}
              className={`btn btn-sm ${activeTab === 'collect' ? 'btn-primary' : 'btn-ghost'}`}
              style={{ borderRadius: '10px', fontWeight: '700' }}
            >
              <HeartHandshake size={16} />
              <span>Collect Funds</span>
              <span className="badge badge-emerald" style={{ fontSize: '0.6rem', padding: '1px 5px', marginLeft: '2px' }}>
                Active
              </span>
            </button>

            <button 
              onClick={() => setActiveTab('marketplace')}
              className={`btn btn-sm ${activeTab === 'marketplace' ? 'btn-primary' : 'btn-ghost'}`}
              style={{ borderRadius: '10px' }}
            >
              <TrendingUp size={16} />
              <span>Investment Market</span>
            </button>

            <button 
              onClick={() => setActiveTab('portfolio')}
              className={`btn btn-sm ${activeTab === 'portfolio' ? 'btn-primary' : 'btn-ghost'}`}
              style={{ borderRadius: '10px' }}
            >
              <Layers size={16} />
              <span>My Portfolio</span>
            </button>

            <button 
              onClick={() => setActiveTab('raise')}
              className={`btn btn-sm ${activeTab === 'raise' ? 'btn-primary' : 'btn-ghost'}`}
              style={{ borderRadius: '10px' }}
            >
              <Sparkles size={16} />
              <span>Raise Capital</span>
            </button>

            <button 
              onClick={() => setActiveTab('ai-oracle')}
              className={`btn btn-sm ${activeTab === 'ai-oracle' ? 'btn-primary' : 'btn-ghost'}`}
              style={{ borderRadius: '10px' }}
            >
              <BarChart3 size={16} />
              <span>Valuation Suite</span>
            </button>

            <button 
              onClick={() => {
                setActiveTab('admin');
                setCurrentRole('admin');
              }}
              className={`btn btn-sm ${activeTab === 'admin' ? 'btn-emerald' : 'btn-ghost'}`}
              style={{ 
                borderRadius: '10px',
                border: isAdminLoggedIn ? '1px solid rgba(16, 185, 129, 0.4)' : '1px solid rgba(255, 255, 255, 0.1)'
              }}
            >
              {isAdminLoggedIn ? <ShieldCheck size={16} /> : <Lock size={16} />}
              <span>Admin Console</span>
              {isAdminLoggedIn && (
                <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#10b981', display: 'inline-block' }}></span>
              )}
            </button>
          </nav>

          {/* Right Action Bar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            
            {/* Currency Selector */}
            <button 
              onClick={() => setCurrency(currency === 'USD' ? 'INR' : 'USD')}
              className="btn btn-secondary btn-sm"
              style={{ padding: '6px 10px', fontSize: '0.8rem', gap: '5px' }}
              title="Switch Currency between USD and INR"
            >
              <Globe size={14} />
              <span>{currency === 'USD' ? '$ USD' : '₹ INR'}</span>
            </button>

            {/* Wallet Pill */}
            <button 
              onClick={() => setIsWalletModalOpen(true)}
              className="btn btn-secondary btn-sm"
              style={{ 
                padding: '6px 12px', 
                background: 'rgba(245, 158, 11, 0.08)',
                borderColor: 'rgba(245, 158, 11, 0.3)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <Wallet size={16} className="text-amber-400" />
              <div style={{ textAlign: 'left', lineHeight: '1.1' }}>
                <div style={{ fontSize: '0.64rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Vault Balance</div>
                <div style={{ fontSize: '0.88rem', fontWeight: '800', color: '#fbbf24' }}>{formatMoney(walletBalance)}</div>
              </div>
              <span style={{ 
                background: 'rgba(245, 158, 11, 0.25)', 
                color: '#fbbf24', 
                borderRadius: '4px', 
                fontSize: '0.7rem', 
                padding: '2px 6px',
                marginLeft: '4px',
                fontWeight: '700' 
              }}>+ Add</span>
            </button>

            {/* E-Commerce Cart Icon */}
            <button 
              onClick={() => setIsCartOpen(true)}
              className="btn btn-secondary btn-sm"
              style={{ 
                position: 'relative', 
                padding: '8px 12px',
                borderRadius: '10px'
              }}
              title="View Investment Cart"
            >
              <ShoppingCart size={18} />
              {cart.length > 0 && (
                <span style={{ 
                  position: 'absolute', 
                  top: '-6px', 
                  right: '-6px', 
                  background: 'linear-gradient(135deg, #f43f5e 0%, #e11d48 100%)',
                  color: '#fff',
                  borderRadius: '50%',
                  fontSize: '0.7rem',
                  fontWeight: '700',
                  minWidth: '20px',
                  height: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 2px 8px rgba(244, 63, 94, 0.5)'
                }}>
                  {cart.length}
                </span>
              )}
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
                {user.kycStatus === 'verified' ? 'KYC Verified' : 'Verify KYC'}
              </span>
            </button>

          </div>

        </div>
      </div>
    </header>
  );
};
