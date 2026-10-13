import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { SETTLED_PAYOUT_HISTORY, LIVE_INVESTOR_ACTIVITY } from '../data/mockStartups';
import { 
  TrendingUp, 
  Search, 
  Filter, 
  ShieldCheck, 
  Sparkles, 
  ShoppingCart, 
  ArrowUpRight, 
  CheckCircle2, 
  Clock,
  Layers,
  FileText,
  DollarSign,
  Briefcase,
  Zap,
  Info,
  Building2,
  Calendar,
  Hammer,
  Award,
  ChevronRight,
  Calculator,
  Lock,
  ArrowRight,
  BadgeCheck,
  CheckCircle
} from 'lucide-react';

export const Marketplace = () => {
  const { 
    startups, 
    projectDeals,
    formatMoney, 
    formatValuation, 
    addToCart, 
    setSelectedStartup,
    setSelectedProject,
    currency
  } = useApp();

  const [activeOpportunityTab, setActiveOpportunityTab] = useState('ALL'); // 'ALL' | 'PROJECTS' | 'EQUITY'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState('ALL'); // 'ALL' | 'HIGH_YIELD' | 'FAST_MATURITY' | 'LOW_ENTRY' | 'AI_TECH'
  const [quickBuyAmounts, setQuickBuyAmounts] = useState({});

  // Calculator State
  const [calcAmount, setCalcAmount] = useState(25000);
  const [calcStrategy, setCalcStrategy] = useState('SME_ORDER'); // 'SME_ORDER' | 'EQUITY_GROWTH' | 'BALANCED'

  // Filter project deals
  const filteredProjects = useMemo(() => {
    return projectDeals.filter(p => {
      const matchSearch = 
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.businessName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase());

      let matchTag = true;
      const yieldVal = parseFloat(p.indicativeYield) || 0;
      if (selectedTag === 'HIGH_YIELD') matchTag = yieldVal >= 14.0;
      if (selectedTag === 'FAST_MATURITY') matchTag = p.durationDays <= 35;
      if (selectedTag === 'LOW_ENTRY') matchTag = p.minContribution <= 2500;
      if (selectedTag === 'AI_TECH') matchTag = false; // projects are SMEs

      return matchSearch && matchTag;
    });
  }, [projectDeals, searchQuery, selectedTag]);

  // Filter equity startups
  const filteredStartups = useMemo(() => {
    return startups.filter(st => {
      const matchSearch = 
        st.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        st.ticker.toLowerCase().includes(searchQuery.toLowerCase()) ||
        st.sector.toLowerCase().includes(searchQuery.toLowerCase());

      let matchTag = true;
      if (selectedTag === 'HIGH_YIELD') matchTag = false; // equity is capital gain
      if (selectedTag === 'FAST_MATURITY') matchTag = false;
      if (selectedTag === 'LOW_ENTRY') matchTag = st.minInvestment <= 50;
      if (selectedTag === 'SME_CORP') matchTag = st.sector.toLowerCase().includes('furniture') || st.sector.toLowerCase().includes('manufacturing') || st.sector.toLowerCase().includes('food') || st.sector.toLowerCase().includes('agri');

      return matchSearch && matchTag;
    });
  }, [startups, searchQuery, selectedTag]);

  // Calculator return projection formulas
  const calcResults = useMemo(() => {
    const amt = parseFloat(calcAmount) || 0;
    
    // Strategy 1: SME Order Term Yield (~14.5% over 45 days, annualized ~117% if compounded, or ~14.5% net term)
    const smeTermYield = 0.145;
    const smeGrossGain = Math.round(amt * smeTermYield);
    const smeTotal = amt + smeGrossGain;

    // Strategy 2: Audited SME Growth Equity (3-Year projected 2.15x based on EBITDA expansion)
    const equityGain3Y = Math.round(amt * 1.15);
    const equityTotal3Y = amt + equityGain3Y;

    // Benchmark: Traditional Bank Fixed Deposit (6.5% annual = ~0.8% for 45 days)
    const bankGain45D = Math.round(amt * (0.065 * (45 / 365)));
    const bankGain3Y = Math.round(amt * (Math.pow(1.065, 3) - 1));

    return {
      amt,
      smeGrossGain,
      smeTotal,
      equityGain3Y,
      equityTotal3Y,
      bankGain45D,
      bankGain3Y
    };
  }, [calcAmount]);

  const handle1ClickInvestCalc = () => {
    if (calcStrategy === 'SME_ORDER') {
      // Find matching project
      const targetProj = projectDeals.find(p => p.capitalRaised < p.capitalRequired) || projectDeals[0];
      if (targetProj) setSelectedProject(targetProj);
    } else {
      // Find top startup
      const targetSt = startups[0];
      if (targetSt) setSelectedStartup(targetSt);
    }
  };

  return (
    <div>
      {/* 1. Real-time Live Investor Stream Ribbon */}
      <div className="social-ticker-container">
        <div className="social-ticker-track">
          {LIVE_INVESTOR_ACTIVITY.concat(LIVE_INVESTOR_ACTIVITY).map((act, i) => (
            <div key={i} className="inline-flex items-center gap-2 text-slate-300">
              <span className="live-pulse-dot"></span>
              <strong style={{ color: '#fff' }}>{act.investor}</strong>
              <span className="text-slate-400">{act.action}</span>
              <span className="text-amber-400 font-bold">{formatMoney(act.amount, true)}</span>
              <span className="text-slate-300">in {act.target}</span>
              <span className="badge badge-emerald" style={{ fontSize: '0.62rem', padding: '1px 6px' }}>{act.badge}</span>
              <span className="text-slate-500 font-mono text-xs">({act.time})</span>
              <span className="text-slate-700">✦</span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ padding: '36px 0 64px 0' }}>
        <div className="container">
          
          {/* 2. Hero Section: Institutional Wealth & Order Financing Infrastructure */}
          <div className="glass-panel" style={{ 
            padding: '42px 40px', 
            marginBottom: '32px', 
            position: 'relative', 
            overflow: 'hidden',
            background: 'linear-gradient(135deg, rgba(14, 21, 38, 0.98) 0%, rgba(8, 13, 24, 0.99) 100%)',
            border: '1px solid rgba(245, 158, 11, 0.3)',
            borderRadius: '24px'
          }}>
            <div style={{ maxWidth: '880px', position: 'relative', zIndex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px', flexWrap: 'wrap' }}>
                <span className="badge badge-gold">
                  <Sparkles size={12} />
                  <span>ROYAL CAPITAL INFRASTRUCTURE • DIGITAL MARKETPLACE</span>
                </span>
                <span className="badge badge-emerald">
                  <ShieldCheck size={12} />
                  <span>100% RING-FENCED ESCROW</span>
                </span>
                <span className="badge badge-cyan">
                  <span>START FROM ₹1,000 / $25</span>
                </span>
              </div>
              
              <h1 style={{ fontSize: '2.8rem', lineHeight: '1.18', marginBottom: '16px', color: '#fff' }}>
                Earn <span className="gold-gradient-text">12.8% – 15.8% Contractual Yield</span> on Verified SME Orders & Private Equity
              </h1>
              
              <p style={{ color: 'var(--text-muted)', fontSize: '1.08rem', marginBottom: '28px', lineHeight: '1.65', maxWidth: '780px' }}>
                Why let bank savings sit idle at 3%–6%? Fund confirmed, invoice-backed customer orders (like <strong>CarpenterBullet</strong> architectural woodcraft & corporate catering) with milestone-gated escrow releases and audited digital share ownership.
              </p>

              {/* Key Platform Highlights */}
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', 
                gap: '16px',
                paddingTop: '20px',
                borderTop: '1px solid rgba(255, 255, 255, 0.08)'
              }}>
                <div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: '700' }}>Active Order Book</div>
                  <div style={{ fontSize: '1.6rem', fontWeight: '800', color: '#fff' }}>₹19.2 Lakhs</div>
                  <div style={{ fontSize: '0.75rem', color: '#10b981' }}>100% Invoice Verified</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: '700' }}>Historical Payout Track Record</div>
                  <div style={{ fontSize: '1.6rem', fontWeight: '800', color: '#10b981' }}>100.0%</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>0% Default Rate Across 54 Batches</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: '700' }}>Average Project Duration</div>
                  <div style={{ fontSize: '1.6rem', fontWeight: '800', color: '#38bdf8' }}>25 – 45 Days</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Fast Liquidity Turnaround</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: '700' }}>Contractual Net Yield</div>
                  <div style={{ fontSize: '1.6rem', fontWeight: '800', color: '#fbbf24' }}>12.8% – 15.8%</div>
                  <div style={{ fontSize: '0.75rem', color: '#fbbf24' }}>Fixed Term Distribution</div>
                </div>
              </div>
            </div>
          </div>

          {/* 3. Interactive Wealth & ROI Simulator (The "Everybody Wants to Invest" Magnet) */}
          <div className="calc-card" style={{ marginBottom: '40px' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '16px', marginBottom: '24px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <Calculator size={22} className="text-amber-400" />
                  <h2 style={{ fontSize: '1.5rem', color: '#fff', margin: 0 }}>
                    Investor Profit Simulator & Growth Calculator
                  </h2>
                  <span className="badge badge-gold" style={{ fontSize: '0.68rem' }}>INTERACTIVE</span>
                </div>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', margin: 0 }}>
                  Calculate your projected returns and compare directly against standard Bank Fixed Deposits.
                </p>
              </div>

              {/* Strategy Selector Pills */}
              <div style={{ display: 'flex', gap: '6px', background: 'rgba(255, 255, 255, 0.05)', padding: '4px', borderRadius: '12px' }}>
                <button 
                  onClick={() => setCalcStrategy('SME_ORDER')}
                  className={`btn btn-sm ${calcStrategy === 'SME_ORDER' ? 'btn-primary' : 'btn-ghost'}`}
                  style={{ fontSize: '0.8rem', padding: '6px 12px' }}
                >
                  🪵 SME Order Yield (45 Days)
                </button>
                <button 
                  onClick={() => setCalcStrategy('EQUITY_GROWTH')}
                  className={`btn btn-sm ${calcStrategy === 'EQUITY_GROWTH' ? 'btn-primary' : 'btn-ghost'}`}
                  style={{ fontSize: '0.8rem', padding: '6px 12px' }}
                >
                  📈 Audited Growth Equity (3 Years)
                </button>
              </div>
            </div>

            {/* Slider & Math Comparison Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: '28px', alignItems: 'center' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '10px' }}>
                  <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Your Investment Amount:</span>
                  <span style={{ fontSize: '1.75rem', fontWeight: '800', color: '#fbbf24' }}>
                    {formatMoney(calcAmount, true)}
                  </span>
                </div>

                <input 
                  type="range"
                  min="1000"
                  max="250000"
                  step="1000"
                  value={calcAmount}
                  onChange={(e) => setCalcAmount(parseInt(e.target.value) || 1000)}
                  className="range-slider-custom"
                  style={{ marginBottom: '14px' }}
                />

                <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
                  {[2500, 10000, 25000, 50000, 100000].map(amt => (
                    <button 
                      key={amt}
                      onClick={() => setCalcAmount(amt)}
                      className={`btn btn-sm ${calcAmount === amt ? 'btn-primary' : 'btn-secondary'}`}
                      style={{ flex: 1, padding: '5px 0', fontSize: '0.75rem' }}
                    >
                      ₹{amt >= 100000 ? `${amt / 100000}L` : `${amt / 1000}K`}
                    </button>
                  ))}
                </div>

                <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <ShieldCheck size={14} className="text-emerald-400" />
                  <span>Escrow-secured principal backed by confirmed purchaser purchase orders.</span>
                </div>
              </div>

              {/* Comparison Output Box */}
              <div style={{ 
                background: 'rgba(10, 16, 28, 0.85)', 
                border: '1px solid rgba(255, 255, 255, 0.1)', 
                borderRadius: '16px', 
                padding: '20px' 
              }}>
                {calcStrategy === 'SME_ORDER' ? (
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                      <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>45-Day Expected Payout:</span>
                      <span className="badge badge-emerald" style={{ fontSize: '0.75rem' }}>+14.5% Net Term Yield</span>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '16px' }}>
                      <div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Royal Capital Payout</div>
                        <div style={{ fontSize: '1.7rem', fontWeight: '900', color: '#10b981' }}>
                          {formatMoney(calcResults.smeTotal, true)}
                        </div>
                        <div style={{ fontSize: '0.78rem', color: '#34d399', fontWeight: '700' }}>
                          +{formatMoney(calcResults.smeGrossGain, true)} Net Profit
                        </div>
                      </div>

                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Bank FD (6.5% p.a.)</div>
                        <div style={{ fontSize: '1.25rem', fontWeight: '700', color: '#94a3b8' }}>
                          {formatMoney(calcAmount + calcResults.bankGain45D, true)}
                        </div>
                        <div style={{ fontSize: '0.78rem', color: '#64748b' }}>
                          +{formatMoney(calcResults.bankGain45D, true)} Gain
                        </div>
                      </div>
                    </div>

                    <div style={{ 
                      background: 'rgba(245, 158, 11, 0.08)', 
                      border: '1px solid rgba(245, 158, 11, 0.25)', 
                      borderRadius: '10px', 
                      padding: '10px 14px', 
                      marginBottom: '14px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}>
                      <span style={{ fontSize: '0.8rem', color: '#fbbf24', fontWeight: '600' }}>
                        ⚡ <strong>{(calcResults.smeGrossGain / Math.max(1, calcResults.bankGain45D)).toFixed(1)}x Higher Returns</strong> than traditional bank deposits
                      </span>
                    </div>

                    <button 
                      onClick={handle1ClickInvestCalc}
                      className="btn btn-emerald"
                      style={{ width: '100%', fontSize: '0.92rem' }}
                    >
                      <Zap size={15} />
                      <span>Invest {formatMoney(calcAmount, true)} in Top SME Order Deal</span>
                    </button>
                  </div>
                ) : (
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                      <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>3-Year Audited Valuation Target:</span>
                      <span className="badge badge-cyan" style={{ fontSize: '0.75rem' }}>~35% Annual CAGR</span>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '16px' }}>
                      <div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Projected Equity Value</div>
                        <div style={{ fontSize: '1.7rem', fontWeight: '900', color: '#38bdf8' }}>
                          {formatMoney(calcResults.equityTotal3Y, true)}
                        </div>
                        <div style={{ fontSize: '0.78rem', color: '#38bdf8', fontWeight: '700' }}>
                          +{formatMoney(calcResults.equityGain3Y, true)} Growth (+115%)
                        </div>
                      </div>

                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Bank FD (3 Years)</div>
                        <div style={{ fontSize: '1.25rem', fontWeight: '700', color: '#94a3b8' }}>
                          {formatMoney(calcAmount + calcResults.bankGain3Y, true)}
                        </div>
                        <div style={{ fontSize: '0.78rem', color: '#64748b' }}>
                          +{formatMoney(calcResults.bankGain3Y, true)} Gain
                        </div>
                      </div>
                    </div>

                    <button 
                      onClick={handle1ClickInvestCalc}
                      className="btn btn-primary"
                      style={{ width: '100%', fontSize: '0.92rem' }}
                    >
                      <Sparkles size={15} />
                      <span>Acquire Audited SME Equity Shares ({formatMoney(calcAmount, true)})</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 4. Filter & Category Selection Bar */}
          <div style={{ 
            display: 'flex', 
            flexWrap: 'wrap', 
            gap: '12px', 
            marginBottom: '20px', 
            alignItems: 'center', 
            justifyContent: 'space-between' 
          }}>
            {/* Primary Model Switcher */}
            <div style={{ display: 'flex', gap: '6px', background: 'rgba(255, 255, 255, 0.04)', padding: '4px', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
              <button
                onClick={() => setActiveOpportunityTab('ALL')}
                className={`btn btn-sm ${activeOpportunityTab === 'ALL' ? 'btn-primary' : 'btn-ghost'}`}
                style={{ borderRadius: '8px', fontSize: '0.85rem' }}
              >
                🌟 All Deals ({projectDeals.length + startups.length})
              </button>
              <button
                onClick={() => setActiveOpportunityTab('PROJECTS')}
                className={`btn btn-sm ${activeOpportunityTab === 'PROJECTS' ? 'btn-primary' : 'btn-ghost'}`}
                style={{ borderRadius: '8px', fontSize: '0.85rem' }}
              >
                🪵 SME Order Financing ({projectDeals.length})
              </button>
              <button
                onClick={() => setActiveOpportunityTab('EQUITY')}
                className={`btn btn-sm ${activeOpportunityTab === 'EQUITY' ? 'btn-primary' : 'btn-ghost'}`}
                style={{ borderRadius: '8px', fontSize: '0.85rem' }}
              >
                📈 Startup Equity Shares ({startups.length})
              </button>
            </div>

            {/* Search Box */}
            <div style={{ position: 'relative', minWidth: '280px' }}>
              <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} />
              <input 
                type="text"
                placeholder="Search CarpenterBullet, Teak, AI, EV..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="form-input"
                style={{ paddingLeft: '38px', padding: '9px 12px 9px 38px', fontSize: '0.85rem', borderRadius: '10px' }}
              />
            </div>
          </div>

          {/* Quick Filter Tag Pills */}
          <div style={{ display: 'flex', gap: '8px', marginBottom: '32px', flexWrap: 'wrap' }}>
            <button 
              onClick={() => setSelectedTag('ALL')}
              className={`btn btn-sm ${selectedTag === 'ALL' ? 'btn-secondary' : 'btn-ghost'}`}
              style={{ fontSize: '0.78rem', borderRadius: '20px', padding: '4px 12px', border: selectedTag === 'ALL' ? '1px solid #fbbf24' : '1px solid transparent' }}
            >
              All Categories
            </button>
            <button 
              onClick={() => setSelectedTag('HIGH_YIELD')}
              className={`btn btn-sm ${selectedTag === 'HIGH_YIELD' ? 'btn-secondary' : 'btn-ghost'}`}
              style={{ fontSize: '0.78rem', borderRadius: '20px', padding: '4px 12px', border: selectedTag === 'HIGH_YIELD' ? '1px solid #10b981' : '1px solid transparent' }}
            >
              🔥 High Yield (&gt;14%)
            </button>
            <button 
              onClick={() => setSelectedTag('FAST_MATURITY')}
              className={`btn btn-sm ${selectedTag === 'FAST_MATURITY' ? 'btn-secondary' : 'btn-ghost'}`}
              style={{ fontSize: '0.78rem', borderRadius: '20px', padding: '4px 12px', border: selectedTag === 'FAST_MATURITY' ? '1px solid #38bdf8' : '1px solid transparent' }}
            >
              ⚡ Fast Maturity (&le;35 Days)
            </button>
            <button 
              onClick={() => setSelectedTag('LOW_ENTRY')}
              className={`btn btn-sm ${selectedTag === 'LOW_ENTRY' ? 'btn-secondary' : 'btn-ghost'}`}
              style={{ fontSize: '0.78rem', borderRadius: '20px', padding: '4px 12px', border: selectedTag === 'LOW_ENTRY' ? '1px solid #fbbf24' : '1px solid transparent' }}
            >
              🌟 Under ₹2,500 Min Entry
            </button>
            <button 
              onClick={() => setSelectedTag('SME_CORP')}
              className={`btn btn-sm ${selectedTag === 'SME_CORP' ? 'btn-secondary' : 'btn-ghost'}`}
              style={{ fontSize: '0.78rem', borderRadius: '20px', padding: '4px 12px', border: selectedTag === 'SME_CORP' ? '1px solid #a78bfa' : '1px solid transparent' }}
            >
              🏢 Core SME Enterprises
            </button>
          </div>

          {/* 5. SECTION 1: SME ORDER FINANCING (CARPENTERBULLET MODEL) */}
          {(activeOpportunityTab === 'ALL' || activeOpportunityTab === 'PROJECTS') && (
            <div style={{ marginBottom: '52px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px', flexWrap: 'wrap', gap: '8px' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <h2 style={{ fontSize: '1.5rem', color: '#fff', margin: 0 }}>
                      SME Purchase Order Financing
                    </h2>
                    <span className="badge badge-gold">Model C: Project Capital</span>
                    <span className="badge badge-emerald">Fixed Contract Yield</span>
                  </div>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', margin: '4px 0 0 0' }}>
                    Short-term capital for verified manufacturing, woodwork, and catering purchase orders. Direct milestone-staged escrow with zero company balance-sheet dilution.
                  </p>
                </div>
              </div>

              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', 
                gap: '24px' 
              }}>
                {filteredProjects.map(proj => {
                  const fundingPercent = Math.min(100, Math.round((proj.capitalRaised / proj.capitalRequired) * 100));
                  const remainingNeeded = Math.max(0, proj.capitalRequired - proj.capitalRaised);
                  const isNearlyFunded = fundingPercent >= 80 && fundingPercent < 100;
                  const isFullyFunded = fundingPercent >= 100;

                  return (
                    <div 
                      key={proj.id}
                      className="glass-panel glass-panel-hover"
                      style={{ 
                        padding: '26px', 
                        borderRadius: '18px',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        border: isNearlyFunded ? '1px solid rgba(245, 158, 11, 0.45)' : '1px solid rgba(255, 255, 255, 0.09)',
                        position: 'relative'
                      }}
                    >
                      {/* Top ribbon if hot */}
                      {isNearlyFunded && (
                        <div style={{ 
                          position: 'absolute', 
                          top: '12px', 
                          right: '12px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          background: 'rgba(245, 158, 11, 0.2)',
                          color: '#fbbf24',
                          border: '1px solid rgba(245, 158, 11, 0.4)',
                          borderRadius: '20px',
                          padding: '2px 8px',
                          fontSize: '0.65rem',
                          fontWeight: '700'
                        }}>
                          <span className="live-pulse-amber"></span>
                          <span>{fundingPercent}% FUNDED • CLOSING SOON</span>
                        </div>
                      )}

                      <div>
                        {/* Top Header */}
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '12px' }}>
                          <span style={{ 
                            fontSize: '2rem', 
                            width: '48px', 
                            height: '48px', 
                            borderRadius: '12px', 
                            background: 'rgba(255, 255, 255, 0.05)',
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center',
                            border: '1px solid rgba(255, 255, 255, 0.08)' 
                          }}>
                            {proj.logo}
                          </span>
                          <div>
                            <div style={{ fontWeight: '800', color: '#fff', fontSize: '1.08rem' }}>{proj.businessName}</div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                              <span className="font-mono text-amber-400 font-bold">{proj.ticker}</span> • {proj.category}
                            </div>
                          </div>
                        </div>

                        {/* Title & Scope */}
                        <h4 style={{ fontSize: '1rem', color: '#fff', marginBottom: '6px', fontWeight: '700', lineHeight: '1.4' }}>
                          {proj.title}
                        </h4>
                        <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', lineHeight: '1.5', marginBottom: '16px', minHeight: '40px' }}>
                          {proj.tagline}
                        </p>

                        {/* Economics Highlight Box */}
                        <div style={{ 
                          background: 'rgba(10, 16, 28, 0.85)', 
                          border: '1px solid rgba(255, 255, 255, 0.08)',
                          borderRadius: '12px',
                          padding: '14px',
                          marginBottom: '16px'
                        }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                            <div>
                              <div style={{ fontSize: '0.66rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: '700' }}>Customer Order</div>
                              <div style={{ fontSize: '1.2rem', fontWeight: '800', color: '#fff' }}>
                                {formatMoney(proj.customerContractValue, true)}
                              </div>
                            </div>

                            <div style={{ textAlign: 'right' }}>
                              <div style={{ fontSize: '0.66rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: '700' }}>Capital Target</div>
                              <div style={{ fontSize: '1.2rem', fontWeight: '800', color: '#fbbf24' }}>
                                {formatMoney(proj.capitalRequired, true)}
                              </div>
                            </div>
                          </div>

                          {/* Progress Bar */}
                          <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', marginBottom: '4px' }}>
                              <span style={{ color: 'var(--text-muted)' }}>Progress: <strong>{fundingPercent}%</strong></span>
                              <span style={{ color: isFullyFunded ? '#10b981' : '#38bdf8', fontWeight: '700' }}>
                                {formatMoney(proj.capitalRaised, true)} Raised
                              </span>
                            </div>
                            <div style={{ width: '100%', height: '6px', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '3px', overflow: 'hidden' }}>
                              <div style={{ 
                                width: `${fundingPercent}%`, 
                                height: '100%', 
                                background: isFullyFunded ? '#10b981' : 'linear-gradient(90deg, #10b981 0%, #38bdf8 100%)' 
                              }}></div>
                            </div>
                          </div>
                        </div>

                        {/* Financial Return Summary */}
                        <div style={{ 
                          display: 'grid', 
                          gridTemplateColumns: 'repeat(3, 1fr)', 
                          gap: '6px', 
                          marginBottom: '16px', 
                          textAlign: 'center' 
                        }}>
                          <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '8px 4px', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
                            <div style={{ fontSize: '0.62rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Term Duration</div>
                            <div style={{ fontSize: '0.9rem', fontWeight: '800', color: '#38bdf8' }}>{proj.durationDays} Days</div>
                          </div>
                          <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '8px 4px', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
                            <div style={{ fontSize: '0.62rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Contract Yield</div>
                            <div style={{ fontSize: '0.9rem', fontWeight: '800', color: '#10b981' }}>{proj.indicativeYield.split(' ')[0]}</div>
                          </div>
                          <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '8px 4px', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
                            <div style={{ fontSize: '0.62rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Min Entry</div>
                            <div style={{ fontSize: '0.9rem', fontWeight: '800', color: '#fff' }}>{formatMoney(proj.minContribution, true)}</div>
                          </div>
                        </div>

                        {/* Safety & Escrow Badge */}
                        <div style={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'space-between', 
                          fontSize: '0.72rem', 
                          color: 'var(--text-muted)', 
                          marginBottom: '18px',
                          padding: '6px 10px',
                          background: 'rgba(16, 185, 129, 0.06)',
                          borderRadius: '8px',
                          border: '1px solid rgba(16, 185, 129, 0.2)'
                        }}>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#34d399', fontWeight: '600' }}>
                            <ShieldCheck size={13} />
                            {proj.escrowPartner || 'Bank Partner Escrow'}
                          </span>
                          <span style={{ color: '#fbbf24', fontWeight: '700' }}>Safety: {proj.safetyScore || '98/100'}</span>
                        </div>
                      </div>

                      {/* Direct Action Button */}
                      <button 
                        onClick={() => setSelectedProject(proj)}
                        className={`btn ${isFullyFunded ? 'btn-secondary' : 'btn-emerald'}`}
                        style={{ width: '100%', fontSize: '0.9rem' }}
                      >
                        <Hammer size={15} />
                        <span>{isFullyFunded ? 'Inspect Order & Milestone Details' : `Participate & Fund (${formatMoney(proj.minContribution, true)}+)`}</span>
                      </button>

                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* 6. SECTION 2: DIGITAL EQUITY VALUATION SHARES */}
          {(activeOpportunityTab === 'ALL' || activeOpportunityTab === 'EQUITY') && (
            <div style={{ marginBottom: '52px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px', flexWrap: 'wrap', gap: '8px' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <h2 style={{ fontSize: '1.5rem', color: '#fff', margin: 0 }}>
                      Audited Private Business Equity & Growth Shares
                    </h2>
                    <span className="badge badge-cyan">Model A: Digital Shares</span>
                    <span className="badge badge-gold">Fractional Certificates</span>
                  </div>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', margin: '4px 0 0 0' }}>
                    Purchase fractional common shares in audited manufacturing, woodwork, food, and logistics enterprises with RBI depository custody.
                  </p>
                </div>
              </div>

              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', 
                gap: '24px' 
              }}>
                {filteredStartups.map(startup => {
                  const fundedPercent = Math.min(100, Math.round((startup.raisedAmount / startup.targetRaise) * 100));

                  return (
                    <div 
                      key={startup.id} 
                      className="glass-panel glass-panel-hover" 
                      style={{ 
                        display: 'flex', 
                        flexDirection: 'column', 
                        justifyContent: 'space-between',
                        padding: '26px',
                        borderRadius: '18px'
                      }}
                    >
                      <div>
                        {/* Logo, Ticker, Badges */}
                        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '14px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div style={{ 
                              fontSize: '1.8rem', 
                              width: '48px', 
                              height: '48px', 
                              borderRadius: '12px', 
                              background: 'rgba(255, 255, 255, 0.06)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              border: '1px solid rgba(255, 255, 255, 0.1)'
                            }}>
                              {startup.logo}
                            </div>
                            <div>
                              <h3 style={{ fontSize: '1.15rem', color: '#fff', margin: 0 }}>{startup.name}</h3>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
                                <span className="font-mono text-amber-400 font-bold" style={{ fontSize: '0.82rem' }}>
                                  {startup.ticker}
                                </span>
                                <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>•</span>
                                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{startup.stage}</span>
                              </div>
                            </div>
                          </div>

                          <div style={{ 
                            textAlign: 'right',
                            background: 'rgba(16, 185, 129, 0.1)',
                            border: '1px solid rgba(16, 185, 129, 0.3)',
                            padding: '4px 8px',
                            borderRadius: '8px'
                          }}>
                            <div style={{ fontSize: '0.62rem', color: '#34d399', textTransform: 'uppercase', fontWeight: '700' }}>RBI Audit</div>
                            <div style={{ fontSize: '0.95rem', fontWeight: '800', color: '#10b981' }}>{startup.dueDiligenceScore || startup.aiScore || 96}/100</div>
                          </div>
                        </div>

                        <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', marginBottom: '16px', lineHeight: '1.5', minHeight: '38px' }}>
                          {startup.tagline}
                        </p>

                        {/* Valuation Box */}
                        <div style={{ 
                          background: 'rgba(10, 16, 28, 0.85)', 
                          border: '1px solid rgba(255, 255, 255, 0.08)',
                          borderRadius: '12px',
                          padding: '14px',
                          marginBottom: '16px'
                        }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                            <div>
                              <div style={{ fontSize: '0.66rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: '700' }}>Valuation Cap</div>
                              <div style={{ fontSize: '1.25rem', fontWeight: '800', color: '#fff' }}>
                                {formatValuation(startup.valuation)}
                              </div>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                              <div style={{ fontSize: '0.66rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: '700' }}>Share Price</div>
                              <div style={{ fontSize: '1.25rem', fontWeight: '800', color: '#fbbf24' }}>
                                {formatMoney(startup.sharePrice)}
                              </div>
                            </div>
                          </div>

                          <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', marginBottom: '4px' }}>
                              <span style={{ color: 'var(--text-muted)' }}>Progress: <strong>{fundedPercent}%</strong></span>
                              <span style={{ color: '#38bdf8', fontWeight: '700' }}>{formatValuation(startup.raisedAmount)} Raised</span>
                            </div>
                            <div style={{ width: '100%', height: '6px', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '3px', overflow: 'hidden' }}>
                              <div style={{ width: `${fundedPercent}%`, height: '100%', background: 'linear-gradient(90deg, #38bdf8 0%, #10b981 100%)' }}></div>
                            </div>
                          </div>
                        </div>

                        {/* Quick Highlights */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px', marginBottom: '18px', textAlign: 'center' }}>
                          <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '6px', borderRadius: '8px' }}>
                            <div style={{ fontSize: '0.62rem', color: 'var(--text-dim)' }}>ARR</div>
                            <div style={{ fontSize: '0.85rem', fontWeight: '700', color: '#fff' }}>{startup.financials.arr}</div>
                          </div>
                          <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '6px', borderRadius: '8px' }}>
                            <div style={{ fontSize: '0.62rem', color: 'var(--text-dim)' }}>YoY Growth</div>
                            <div style={{ fontSize: '0.85rem', fontWeight: '700', color: '#10b981' }}>{startup.financials.growthYoY}</div>
                          </div>
                          <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '6px', borderRadius: '8px' }}>
                            <div style={{ fontSize: '0.62rem', color: 'var(--text-dim)' }}>24h Trend</div>
                            <div style={{ fontSize: '0.85rem', fontWeight: '700', color: '#fbbf24' }}>{startup.change24h}</div>
                          </div>
                        </div>
                      </div>

                      {/* Dual Action Buttons */}
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                        <button 
                          onClick={() => setSelectedStartup(startup)}
                          className="btn btn-secondary btn-sm"
                          style={{ fontSize: '0.82rem' }}
                        >
                          <Info size={14} />
                          <span>Prospectus</span>
                        </button>

                        <button 
                          onClick={() => addToCart(startup, 5)}
                          className="btn btn-primary btn-sm"
                          style={{ fontSize: '0.82rem' }}
                        >
                          <ShoppingCart size={14} />
                          <span>Buy Shares</span>
                        </button>
                      </div>

                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* 7. SETTLED PAYOUTS TRACK RECORD (Social Proof that builds 100% Trust) */}
          <div className="glass-panel" style={{ 
            padding: '32px', 
            borderRadius: '20px', 
            marginBottom: '40px',
            border: '1px solid rgba(16, 185, 129, 0.3)'
          }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '12px', marginBottom: '20px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <BadgeCheck size={22} className="text-emerald-400" />
                  <h3 style={{ fontSize: '1.35rem', color: '#fff', margin: 0 }}>
                    Settled Payouts & Completed Order History
                  </h3>
                  <span className="badge badge-emerald">Audited Settlements</span>
                </div>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: '4px 0 0 0' }}>
                  Real capital returned to investors with contractual profits upon successful delivery sign-offs.
                </p>
              </div>

              <span className="badge badge-emerald" style={{ padding: '6px 12px' }}>
                100% On-Time Disbursals
              </span>
            </div>

            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
              gap: '16px' 
            }}>
              {SETTLED_PAYOUT_HISTORY.map(settle => (
                <div 
                  key={settle.id}
                  style={{ 
                    background: 'rgba(10, 16, 28, 0.8)', 
                    border: '1px solid rgba(16, 185, 129, 0.25)', 
                    borderRadius: '14px', 
                    padding: '18px' 
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                    <div>
                      <div style={{ fontWeight: '700', color: '#fff', fontSize: '0.95rem' }}>{settle.businessName}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{settle.title}</div>
                    </div>
                    <span className="badge badge-emerald" style={{ fontSize: '0.65rem' }}>PAID OUT</span>
                  </div>

                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'baseline', 
                    padding: '10px 0', 
                    borderTop: '1px solid rgba(255, 255, 255, 0.06)',
                    borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
                    marginBottom: '10px' 
                  }}>
                    <div>
                      <div style={{ fontSize: '0.65rem', color: 'var(--text-dim)' }}>Total Disbursed</div>
                      <div style={{ fontSize: '1.15rem', fontWeight: '800', color: '#10b981' }}>
                        {formatMoney(settle.totalPayoutDistributed, true)}
                      </div>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '0.65rem', color: 'var(--text-dim)' }}>Net Delivered Yield</div>
                      <div style={{ fontSize: '1rem', fontWeight: '800', color: '#fbbf24' }}>
                        {settle.actualYieldDelivered}
                      </div>
                    </div>
                  </div>

                  <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', display: 'flex', justifyContent: 'space-between' }}>
                    <span>{settle.investorsCount} Investors Settled</span>
                    <span>Cleared: {settle.settlementDate}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 8. Institutional Safety & Legal Assurance Pillars */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', 
            gap: '16px' 
          }}>
            <div className="trust-pillar">
              <div style={{ 
                width: '40px', 
                height: '40px', 
                borderRadius: '10px', 
                background: 'rgba(245, 158, 11, 0.15)', 
                color: '#fbbf24', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <ShieldCheck size={22} />
              </div>
              <div>
                <div style={{ fontSize: '0.88rem', fontWeight: '700', color: '#fff' }}>Ring-Fenced Bank Escrow</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Capital remains in segregated custody accounts until vendor material milestones are approved.</div>
              </div>
            </div>

            <div className="trust-pillar">
              <div style={{ 
                width: '40px', 
                height: '40px', 
                borderRadius: '10px', 
                background: 'rgba(16, 185, 129, 0.15)', 
                color: '#10b981', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <FileText size={22} />
              </div>
              <div>
                <div style={{ fontSize: '0.88rem', fontWeight: '700', color: '#fff' }}>Verified Customer Invoices</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Every SME project is backed by a verified, signed client purchase order and customer cash advance.</div>
              </div>
            </div>

            <div className="trust-pillar">
              <div style={{ 
                width: '40px', 
                height: '40px', 
                borderRadius: '10px', 
                background: 'rgba(6, 182, 212, 0.15)', 
                color: '#06b6d4', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <Award size={22} />
              </div>
              <div>
                <div style={{ fontSize: '0.88rem', fontWeight: '700', color: '#fff' }}>Digital Share Certificates</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Instant cryptographic shareholding certificates issued directly to your portfolio with printable PDF proofs.</div>
              </div>
            </div>

            <div className="trust-pillar">
              <div style={{ 
                width: '40px', 
                height: '40px', 
                borderRadius: '10px', 
                background: 'rgba(139, 92, 246, 0.15)', 
                color: '#a78bfa', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <Lock size={22} />
              </div>
              <div>
                <div style={{ fontSize: '0.88rem', fontWeight: '700', color: '#fff' }}>Audited Central Ledger</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Immutable double-entry book-keeping with real-time auditability and zero balance discrepancies.</div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
