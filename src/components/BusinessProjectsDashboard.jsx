import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  calculateProjectFinancials, 
  parseNaturalLanguagePlan 
} from '../data/businessProjectsData';
import { 
  Building2, 
  TrendingUp, 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  Bot, 
  Download, 
  Printer, 
  Search, 
  Eye, 
  Edit3, 
  Layers, 
  ShieldCheck, 
  X, 
  Calendar,
  Activity,
  Package,
  Hammer,
  Truck,
  Check,
  ArrowRight,
  Info,
  DollarSign,
  QrCode,
  Copy,
  CreditCard,
  HeartHandshake,
  Shield,
  BadgeCheck,
  FileText
} from 'lucide-react';

export const BusinessProjectsDashboard = () => {
  const { 
    businessProjects, 
    updateBusinessProject, 
    investInBusinessProject,
    projectInvestments,
    formatMoney, 
    currency 
  } = useApp();

  // Active Filter
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Per-Card Tab State (Map of projectId -> 'overview' | 'costs' | 'timeline' | 'activity')
  const [cardActiveTab, setCardActiveTab] = useState({
    'proj-unavukadai': 'overview',
    'proj-carpenterbullet': 'overview',
    'proj-wooden-laptop-case': 'overview',
    'proj-bamboo-cup': 'overview'
  });

  // Bamboo Cup Scenario Toggle (100 vs 150 units)
  const [bambooScenario, setBambooScenario] = useState(100);

  // Investment Modal State
  const [investingProject, setInvestingProject] = useState(null);
  const [investorName, setInvestorName] = useState('');
  const [investorEmail, setInvestorEmail] = useState('');
  const [investorPhone, setInvestorPhone] = useState('');
  const [investmentAmount, setInvestmentAmount] = useState('5000');
  const [paymentMethod, setPaymentMethod] = useState('UPI'); // 'UPI' | 'BANK' | 'CARD'
  const [investmentNote, setInvestmentNote] = useState('');

  // UI Feedback States
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [copiedAcc, setCopiedAcc] = useState(false);
  const [copiedIfsc, setCopiedIfsc] = useState(false);

  // Certificate Modal State
  const [activeCertificate, setActiveCertificate] = useState(null);

  // Edit Modal State (Admin)
  const [editingProject, setEditingProject] = useState(null);
  const [editFormData, setEditFormData] = useState({});

  // Helper: Set card tab
  const setProjectCardTab = (projectId, tab) => {
    setCardActiveTab(prev => ({ ...prev, [projectId]: tab }));
  };

  // Copy Helper
  const copyToClipboard = (text, setter) => {
    navigator.clipboard.writeText(text);
    setter(true);
    setTimeout(() => setter(false), 2000);
  };

  // Quick Amount Presets
  const quickInvestmentPresets = [500, 1000, 2500, 5000, 10000, 25000];

  // Open Invest Modal
  const handleOpenInvest = (project) => {
    setInvestingProject(project);
    setInvestmentAmount(project.minInvestment ? project.minInvestment.toString() : '1000');
    setInvestmentNote(`Capital backing for ${project.name}`);
  };

  // Submit Investment
  const handleConfirmInvestment = (e) => {
    e.preventDefault();
    if (!investingProject) return;

    const numAmount = parseFloat(investmentAmount);
    if (isNaN(numAmount) || numAmount <= 0) {
      alert("Please enter a valid investment amount.");
      return;
    }

    const newInvestment = investInBusinessProject({
      projectId: investingProject.id,
      investorName: investorName || 'Verified Backer',
      email: investorEmail,
      phone: investorPhone,
      amount: numAmount,
      paymentMethod,
      note: investmentNote
    });

    if (newInvestment) {
      setInvestingProject(null);
      setActiveCertificate(newInvestment);
      // Reset form
      setInvestorName('');
      setInvestorEmail('');
      setInvestorPhone('');
      setInvestmentNote('');
    }
  };

  // Open Edit Modal for a project
  const handleOpenEdit = (project) => {
    setEditingProject(project);
    setEditFormData({
      dailyAdBudget: project.dailyAdBudget,
      campaignDurationDays: project.campaignDurationDays,
      status: project.status,
      proposedSellingPrice: project.proposedSellingPrice || project.avgSellingPricePerUnit || 0,
      totalDirectCostPerUnit: project.totalDirectCostPerUnit || project.directCostPerUnit || 0,
      productionTarget: project.productionTarget || project.totalOrderTarget || project.campaignSalesTarget || 0,
      commissionPerCompletedSale: project.commissionPerCompletedSale || 0,
      statedTotalBudget: project.statedTotalBudget || project.capitalRequested || 0
    });
  };

  // Save Edit Changes
  const handleSaveEdit = (e) => {
    e.preventDefault();
    if (!editingProject) return;

    const updated = {
      dailyAdBudget: parseFloat(editFormData.dailyAdBudget) || 0,
      campaignDurationDays: parseInt(editFormData.campaignDurationDays, 10) || 0,
      status: editFormData.status,
      statedTotalBudget: parseFloat(editFormData.statedTotalBudget) || 0,
      capitalRequested: parseFloat(editFormData.statedTotalBudget) || 0
    };

    if (editingProject.type === 'COMMISSION_MARKETPLACE') {
      updated.commissionPerCompletedSale = parseFloat(editFormData.commissionPerCompletedSale) || 0;
      updated.campaignSalesTarget = parseInt(editFormData.productionTarget, 10) || 0;
    } else if (editingProject.type === 'SERVICE_ORDER') {
      updated.avgSellingPricePerUnit = parseFloat(editFormData.proposedSellingPrice) || 0;
      updated.directCostPerUnit = parseFloat(editFormData.totalDirectCostPerUnit) || 0;
      updated.totalOrderTarget = parseInt(editFormData.productionTarget, 10) || 0;
    } else {
      updated.proposedSellingPrice = parseFloat(editFormData.proposedSellingPrice) || 0;
      updated.totalDirectCostPerUnit = parseFloat(editFormData.totalDirectCostPerUnit) || 0;
      updated.productionTarget = parseInt(editFormData.productionTarget, 10) || 0;
      updated.salesTarget = parseInt(editFormData.productionTarget, 10) || 0;
    }

    updateBusinessProject(
      editingProject.id, 
      updated, 
      `Assumption edit: daily ads ₹${updated.dailyAdBudget}, ${updated.campaignDurationDays} days`
    );
    setEditingProject(null);
  };

  // Filtered Projects
  const filteredProjects = businessProjects.filter(p => {
    const matchesCat = selectedCategory === 'ALL' || p.status === selectedCategory || p.category.toLowerCase().includes(selectedCategory.toLowerCase());
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  // Portfolio aggregates
  const portfolioAggregates = businessProjects.reduce((acc, p) => {
    const fin = calculateProjectFinancials(p);
    acc.totalCapitalRequested += fin.capitalRequested;
    acc.totalCapitalRaised += fin.capitalRaised;
    acc.totalInvestors += fin.investorsCount;
    return acc;
  }, { totalCapitalRequested: 0, totalCapitalRaised: 0, totalInvestors: 0 });

  return (
    <div className="container" style={{ padding: '30px 20px', maxWidth: '1240px', margin: '0 auto' }}>
      
      {/* ========================================================================= */}
      {/* 1. PROFESSIONAL HERO BANNER */}
      {/* ========================================================================= */}
      <div 
        style={{
          background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.9) 100%)',
          borderRadius: '24px',
          padding: '36px 40px',
          border: '1px solid rgba(245, 158, 11, 0.25)',
          boxShadow: '0 16px 40px -10px rgba(0, 0, 0, 0.5)',
          marginBottom: '32px'
        }}
      >
        <div style={{ maxWidth: '880px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.3)', borderRadius: '20px', padding: '4px 14px', marginBottom: '14px' }}>
            <span className="live-pulse-dot" style={{ width: '7px', height: '7px', background: '#10b981' }}></span>
            <span style={{ fontSize: '0.78rem', fontWeight: '700', color: '#fbbf24', letterSpacing: '0.04em' }}>
              RBI VERIFIED SMALL BUSINESS INVESTMENT DESK
            </span>
          </div>

          <h1 style={{ fontSize: '2.5rem', fontWeight: '900', color: '#fff', margin: '0 0 12px 0', letterSpacing: '-0.02em', lineHeight: '1.2' }}>
            Invest in Real-World Business Projects
          </h1>
          <p style={{ color: '#cbd5e1', fontSize: '1.05rem', margin: '0 0 24px 0', lineHeight: '1.6' }}>
            Direct capital allocation into 4 verified businesses across <strong>Food Delivery & Cloud Kitchen</strong>, <strong>Carpentry Marketplaces</strong>, and <strong>Sustainable Eco Manufacturing</strong>. Track every rupee spent, monitor stage timelines, and receive sprint settlements directly into your account.
          </p>

          {/* Key Platform Numbers */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '14px' }}>
            <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '12px 16px', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Active Projects</div>
              <div style={{ fontSize: '1.4rem', fontWeight: '800', color: '#fff', marginTop: '2px' }}>4 Open Businesses</div>
            </div>
            <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '12px 16px', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Total Capital Raised</div>
              <div style={{ fontSize: '1.4rem', fontWeight: '800', color: '#10b981', marginTop: '2px' }}>{formatMoney(portfolioAggregates.totalCapitalRaised)}</div>
            </div>
            <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '12px 16px', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Target Funding Goal</div>
              <div style={{ fontSize: '1.4rem', fontWeight: '800', color: '#fbbf24', marginTop: '2px' }}>{formatMoney(portfolioAggregates.totalCapitalRequested)}</div>
            </div>
            <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '12px 16px', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Total Active Backers</div>
              <div style={{ fontSize: '1.4rem', fontWeight: '800', color: '#38bdf8', marginTop: '2px' }}>{portfolioAggregates.totalInvestors} Investors</div>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. FILTER & SEARCH BAR */}
      {/* ========================================================================= */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px', marginBottom: '26px' }}>
        
        {/* Category Pills */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {[
            { id: 'ALL', label: 'All Businesses (4)' },
            { id: 'Food', label: 'Food Delivery' },
            { id: 'Marketplace', label: 'Marketplaces' },
            { id: 'Manufacturing', label: 'Product Manufacturing' },
            { id: 'Eco-Friendly', label: 'Eco-Friendly Products' }
          ].map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              style={{
                padding: '7px 14px',
                borderRadius: '10px',
                fontSize: '0.82rem',
                fontWeight: '700',
                border: selectedCategory === cat.id ? '1px solid #fbbf24' : '1px solid rgba(255, 255, 255, 0.1)',
                background: selectedCategory === cat.id ? 'rgba(245, 158, 11, 0.15)' : 'rgba(255, 255, 255, 0.02)',
                color: selectedCategory === cat.id ? '#fbbf24' : '#cbd5e1',
                cursor: 'pointer',
                transition: 'all 0.15s'
              }}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div style={{ position: 'relative' }}>
          <Search size={14} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input 
            type="text"
            placeholder="Search business projects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              padding: '8px 14px 8px 34px',
              borderRadius: '10px',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              background: 'rgba(0, 0, 0, 0.3)',
              fontSize: '0.85rem',
              color: '#fff',
              outline: 'none',
              minWidth: '220px'
            }}
          />
        </div>

      </div>

      {/* ========================================================================= */}
      {/* 3. BUSINESS PROJECT CARDS (WITH DIRECT "INVEST NOW" ACTION) */}
      {/* ========================================================================= */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '24px' }}>
        {filteredProjects.map(project => {
          const customUnits = project.id === 'proj-bamboo-cup' ? bambooScenario : null;
          const financials = calculateProjectFinancials(project, customUnits);
          const currentTab = cardActiveTab[project.id] || 'overview';

          return (
            <div 
              key={project.id}
              style={{
                background: 'var(--card-bg, #0b1120)',
                borderRadius: '20px',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                padding: '26px',
                boxShadow: '0 10px 32px rgba(0, 0, 0, 0.45)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              <div>
                {/* Header Badge & Title */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                  <div>
                    <span className="badge" style={{ 
                      fontSize: '0.7rem', 
                      background: 'rgba(16, 185, 129, 0.15)',
                      color: '#10b981',
                      border: '1px solid rgba(16, 185, 129, 0.3)',
                      marginBottom: '6px',
                      display: 'inline-block'
                    }}>
                      OPEN FOR INVESTMENT
                    </span>
                    <h2 style={{ fontSize: '1.4rem', fontWeight: '800', color: '#fff', margin: '4px 0' }}>
                      {project.name}
                    </h2>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      {project.category}
                    </span>
                  </div>

                  <button 
                    onClick={() => handleOpenEdit(project)}
                    className="btn btn-ghost btn-sm"
                    title="Edit Assumptions"
                    style={{ padding: '6px' }}
                  >
                    <Edit3 size={14} />
                  </button>
                </div>

                <p style={{ fontSize: '0.86rem', color: '#94a3b8', margin: '6px 0 16px 0', lineHeight: '1.5' }}>
                  {project.description}
                </p>

                {/* Bamboo Cup 100 vs 150 Scenario Toggle */}
                {project.id === 'proj-bamboo-cup' && (
                  <div style={{ 
                    background: 'rgba(245, 158, 11, 0.08)', 
                    padding: '8px 12px', 
                    borderRadius: '10px', 
                    border: '1px solid rgba(245, 158, 11, 0.2)',
                    marginBottom: '16px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#fbbf24' }}>
                      Production Target Scenario:
                    </span>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <button
                        type="button"
                        onClick={() => setBambooScenario(100)}
                        style={{
                          padding: '3px 8px',
                          borderRadius: '6px',
                          fontSize: '0.72rem',
                          fontWeight: '700',
                          border: bambooScenario === 100 ? '1px solid #fbbf24' : '1px solid rgba(255,255,255,0.1)',
                          background: bambooScenario === 100 ? '#fbbf24' : 'transparent',
                          color: bambooScenario === 100 ? '#000' : '#fff',
                          cursor: 'pointer'
                        }}
                      >
                        100 Cups
                      </button>
                      <button
                        type="button"
                        onClick={() => setBambooScenario(150)}
                        style={{
                          padding: '3px 8px',
                          borderRadius: '6px',
                          fontSize: '0.72rem',
                          fontWeight: '700',
                          border: bambooScenario === 150 ? '1px solid #fbbf24' : '1px solid rgba(255,255,255,0.1)',
                          background: bambooScenario === 150 ? '#fbbf24' : 'transparent',
                          color: bambooScenario === 150 ? '#000' : '#fff',
                          cursor: 'pointer'
                        }}
                      >
                        150 Cups
                      </button>
                    </div>
                  </div>
                )}

                {/* Live Funding Progress Bar */}
                <div style={{ 
                  background: 'rgba(0, 0, 0, 0.3)', 
                  padding: '14px', 
                  borderRadius: '12px', 
                  border: '1px solid rgba(255, 255, 255, 0.06)',
                  marginBottom: '16px' 
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '8px' }}>
                    <div>
                      <span style={{ fontSize: '1.25rem', fontWeight: '900', color: '#10b981' }}>
                        {formatMoney(financials.capitalRaised)}
                      </span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginLeft: '6px' }}>
                        raised of {formatMoney(financials.capitalRequested)}
                      </span>
                    </div>
                    <span style={{ fontSize: '0.95rem', fontWeight: '800', color: '#fbbf24' }}>
                      {financials.fundingPercent}%
                    </span>
                  </div>

                  {/* Progress Line */}
                  <div style={{ width: '100%', height: '8px', background: 'rgba(255, 255, 255, 0.08)', borderRadius: '6px', overflow: 'hidden' }}>
                    <div 
                      style={{ 
                        width: `${financials.fundingPercent}%`, 
                        height: '100%', 
                        background: 'linear-gradient(90deg, #10b981 0%, #fbbf24 100%)',
                        borderRadius: '6px',
                        transition: 'width 0.4s ease'
                      }}
                    />
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                    <span>👥 {financials.investorsCount} Backers</span>
                    <span>Min: {formatMoney(financials.minInvestment)}</span>
                    <span style={{ color: '#38bdf8', fontWeight: '600' }}>Target: {financials.expectedTermYield}</span>
                  </div>
                </div>

                {/* In-Card Tabs for Details */}
                <div style={{ 
                  display: 'flex', 
                  gap: '4px', 
                  background: 'rgba(0, 0, 0, 0.35)', 
                  padding: '3px', 
                  borderRadius: '8px', 
                  marginBottom: '14px',
                  border: '1px solid rgba(255, 255, 255, 0.05)'
                }}>
                  <button
                    type="button"
                    onClick={() => setProjectCardTab(project.id, 'overview')}
                    style={{
                      flex: 1,
                      padding: '6px 4px',
                      borderRadius: '6px',
                      fontSize: '0.72rem',
                      fontWeight: '700',
                      border: 'none',
                      background: currentTab === 'overview' ? 'rgba(245, 158, 11, 0.2)' : 'transparent',
                      color: currentTab === 'overview' ? '#fbbf24' : 'var(--text-muted)',
                      cursor: 'pointer'
                    }}
                  >
                    Economics
                  </button>
                  <button
                    type="button"
                    onClick={() => setProjectCardTab(project.id, 'costs')}
                    style={{
                      flex: 1,
                      padding: '6px 4px',
                      borderRadius: '6px',
                      fontSize: '0.72rem',
                      fontWeight: '700',
                      border: 'none',
                      background: currentTab === 'costs' ? 'rgba(56, 189, 248, 0.2)' : 'transparent',
                      color: currentTab === 'costs' ? '#38bdf8' : 'var(--text-muted)',
                      cursor: 'pointer'
                    }}
                  >
                    All Costs
                  </button>
                  <button
                    type="button"
                    onClick={() => setProjectCardTab(project.id, 'timeline')}
                    style={{
                      flex: 1,
                      padding: '6px 4px',
                      borderRadius: '6px',
                      fontSize: '0.72rem',
                      fontWeight: '700',
                      border: 'none',
                      background: currentTab === 'timeline' ? 'rgba(16, 185, 129, 0.2)' : 'transparent',
                      color: currentTab === 'timeline' ? '#10b981' : 'var(--text-muted)',
                      cursor: 'pointer'
                    }}
                  >
                    Milestones
                  </button>
                  <button
                    type="button"
                    onClick={() => setProjectCardTab(project.id, 'activity')}
                    style={{
                      flex: 1,
                      padding: '6px 4px',
                      borderRadius: '6px',
                      fontSize: '0.72rem',
                      fontWeight: '700',
                      border: 'none',
                      background: currentTab === 'activity' ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
                      color: currentTab === 'activity' ? '#fff' : 'var(--text-muted)',
                      cursor: 'pointer'
                    }}
                  >
                    Live Work
                  </button>
                </div>

                {/* TAB 1: ECONOMICS */}
                {currentTab === 'overview' && (
                  <div>
                    <div style={{ 
                      background: 'rgba(0, 0, 0, 0.25)', 
                      borderRadius: '12px', 
                      padding: '12px', 
                      display: 'grid', 
                      gridTemplateColumns: '1fr 1fr', 
                      gap: '10px',
                      marginBottom: '14px',
                      fontSize: '0.78rem'
                    }}>
                      <div>
                        <span style={{ color: 'var(--text-muted)' }}>Target Revenue:</span>
                        <div style={{ fontWeight: '800', color: '#fff', fontSize: '0.95rem' }}>{formatMoney(financials.projectedRevenue)}</div>
                      </div>
                      <div>
                        <span style={{ color: 'var(--text-muted)' }}>Projected Net Profit:</span>
                        <div style={{ fontWeight: '800', color: '#10b981', fontSize: '0.95rem' }}>{formatMoney(financials.projectedNetProfit)}</div>
                      </div>
                      <div>
                        <span style={{ color: 'var(--text-muted)' }}>Sprint Payout:</span>
                        <div style={{ fontWeight: '700', color: '#fbbf24' }}>{financials.payoutTimeline}</div>
                      </div>
                      <div>
                        <span style={{ color: 'var(--text-muted)' }}>Ad Spend Allocation:</span>
                        <div style={{ fontWeight: '700', color: '#38bdf8' }}>{formatMoney(financials.totalAdSpend)}</div>
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 2: ALL COSTS */}
                {currentTab === 'costs' && (
                  <div style={{ marginBottom: '14px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {(project.expenseBreakdown || []).slice(0, 4).map((exp, idx) => (
                      <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 8px', borderRadius: '6px', background: 'rgba(255,255,255,0.02)', fontSize: '0.75rem' }}>
                        <span style={{ color: '#cbd5e1' }}>{exp.item}</span>
                        <strong style={{ color: '#fbbf24' }}>{formatMoney(exp.amount)}</strong>
                      </div>
                    ))}
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textAlign: 'right', marginTop: '2px' }}>
                      + More verified in full budget itemization
                    </div>
                  </div>
                )}

                {/* TAB 3: TIMELINE */}
                {currentTab === 'timeline' && (
                  <div style={{ marginBottom: '14px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {(project.timeline || []).slice(0, 3).map((m, idx) => (
                      <div key={m.id} style={{ padding: '6px 8px', borderRadius: '6px', background: 'rgba(255,255,255,0.02)', fontSize: '0.74rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <strong style={{ color: m.status === 'COMPLETED' ? '#10b981' : '#38bdf8' }}>{m.phase}</strong>
                          <span style={{ color: 'var(--text-muted)', fontSize: '0.65rem' }}>{m.status}</span>
                        </div>
                        <div style={{ color: '#94a3b8', fontSize: '0.68rem', marginTop: '2px' }}>{m.deliverables}</div>
                      </div>
                    ))}
                  </div>
                )}

                {/* TAB 4: LIVE WORK */}
                {currentTab === 'activity' && (
                  <div style={{ marginBottom: '14px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {(project.liveUpdates || []).slice(0, 2).map((upd, idx) => (
                      <div key={idx} style={{ padding: '6px 8px', borderRadius: '6px', background: 'rgba(255,255,255,0.02)', borderLeft: '2px solid #10b981', fontSize: '0.74rem' }}>
                        <div style={{ color: '#e2e8f0' }}>{upd.note}</div>
                        <div style={{ color: 'var(--text-muted)', fontSize: '0.65rem', marginTop: '2px' }}>{upd.date} • {upd.author}</div>
                      </div>
                    ))}
                  </div>
                )}

              </div>

              {/* Card Footer: PRIMARY "INVEST IN THIS BUSINESS" BUTTON */}
              <div style={{ marginTop: '12px' }}>
                <button 
                  type="button"
                  onClick={() => handleOpenInvest(project)}
                  className="btn btn-primary"
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '12px',
                    fontSize: '0.98rem',
                    fontWeight: '800',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    boxShadow: '0 4px 18px rgba(245, 158, 11, 0.35)'
                  }}
                >
                  <Building2 size={18} />
                  <span>Invest in this Business (Min {formatMoney(financials.minInvestment)})</span>
                </button>
              </div>

            </div>
          );
        })}
      </div>

      {/* ========================================================================= */}
      {/* 4. HOW IT WORKS SECTION (NORMAL & PROFESSIONAL) */}
      {/* ========================================================================= */}
      <div 
        id="how-it-works-section"
        style={{
          marginTop: '60px',
          background: 'var(--card-bg, #0b1120)',
          borderRadius: '24px',
          padding: '36px',
          border: '1px solid rgba(255, 255, 255, 0.08)'
        }}
      >
        <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 36px auto' }}>
          <span className="badge badge-gold" style={{ fontSize: '0.72rem', padding: '3px 10px', marginBottom: '8px' }}>
            HOW IT WORKS
          </span>
          <h3 style={{ fontSize: '1.8rem', fontWeight: '800', color: '#fff', margin: '4px 0 8px 0' }}>
            Straightforward Business Capital Allocation
          </h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', margin: 0 }}>
            Four simple steps to back verified local enterprises with complete escrow protection.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
          <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '20px', borderRadius: '16px', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(245, 158, 11, 0.15)', color: '#fbbf24', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900', marginBottom: '12px' }}>
              1
            </div>
            <h4 style={{ color: '#fff', fontSize: '1rem', margin: '0 0 6px 0', fontWeight: '700' }}>Choose Business</h4>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', margin: 0, lineHeight: '1.45' }}>
              Select a verified project based on unit economics, target order volume, and sprint duration.
            </p>
          </div>

          <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '20px', borderRadius: '16px', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900', marginBottom: '12px' }}>
              2
            </div>
            <h4 style={{ color: '#fff', fontSize: '1rem', margin: '0 0 6px 0', fontWeight: '700' }}>Review All Costs</h4>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', margin: 0, lineHeight: '1.45' }}>
              Inspect where every rupee is spent across materials, labour, packaging, delivery, and marketing.
            </p>
          </div>

          <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '20px', borderRadius: '16px', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(16, 185, 129, 0.15)', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900', marginBottom: '12px' }}>
              3
            </div>
            <h4 style={{ color: '#fff', fontSize: '1rem', margin: '0 0 6px 0', fontWeight: '700' }}>Invest via UPI / Bank</h4>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', margin: 0, lineHeight: '1.45' }}>
              Scan dynamic QR or transfer to ring-fenced bank escrow account with zero platform fees.
            </p>
          </div>

          <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '20px', borderRadius: '16px', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(168, 85, 247, 0.15)', color: '#c084fc', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900', marginBottom: '12px' }}>
              4
            </div>
            <h4 style={{ color: '#fff', fontSize: '1rem', margin: '0 0 6px 0', fontWeight: '700' }}>Receive Certificate & Yield</h4>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', margin: 0, lineHeight: '1.45' }}>
              Get your official digital allocation certificate immediately and receive returns post-sprint.
            </p>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 5. INVESTOR PROTECTION & ESCROW ASSURANCE */}
      {/* ========================================================================= */}
      <div 
        id="investor-protection-section"
        style={{
          marginTop: '36px',
          background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.05) 0%, rgba(15, 23, 42, 0.8) 100%)',
          borderRadius: '24px',
          padding: '32px 36px',
          border: '1px solid rgba(16, 185, 129, 0.25)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '24px'
        }}
      >
        <div style={{ maxWidth: '720px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <ShieldCheck size={24} className="text-emerald-400" />
            <h3 style={{ fontSize: '1.35rem', fontWeight: '800', color: '#fff', margin: 0 }}>
              Royal Bank of Investment Institutional Escrow Ring-Fence
            </h3>
          </div>
          <p style={{ color: '#cbd5e1', fontSize: '0.88rem', margin: 0, lineHeight: '1.55' }}>
            All investor funds are held in segregated, audited escrow accounts. Capital is disbursed only upon verified milestone completion (materials invoice verification, dispatch bill verification). In the event a campaign is cancelled, 100% of unspent funds are returned to backers.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button 
            type="button"
            onClick={() => window.print()}
            className="btn btn-secondary btn-sm"
            style={{ borderRadius: '10px' }}
          >
            <Printer size={15} /> Print Due Diligence
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 6. MY INVESTMENTS & DIGITAL CERTIFICATES */}
      {/* ========================================================================= */}
      <div 
        id="my-investments-section"
        style={{
          marginTop: '36px',
          background: 'rgba(15, 23, 42, 0.65)',
          borderRadius: '24px',
          padding: '32px',
          border: '1px solid rgba(255, 255, 255, 0.08)'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '24px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Layers size={22} className="text-amber-400" />
              <h3 style={{ fontSize: '1.35rem', fontWeight: '800', color: '#fff', margin: 0 }}>
                My Portfolio & Investment Certificates
              </h3>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: '4px 0 0 0' }}>
              View your registered business allocations, payment confirmation references, and instant printable certificates.
            </p>
          </div>
          <span className="badge badge-gold" style={{ fontSize: '0.75rem', padding: '4px 10px' }}>
            {projectInvestments?.length || 0} Total Allocations
          </span>
        </div>

        {projectInvestments && projectInvestments.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
            {projectInvestments.map((inv) => (
              <div 
                key={inv.id}
                style={{
                  background: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '16px',
                  padding: '20px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <span className="badge badge-gold" style={{ fontSize: '0.65rem', marginBottom: '4px' }}>
                      {inv.category || 'Business Venture'}
                    </span>
                    <h4 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#fff', margin: '4px 0 0 0' }}>
                      {inv.projectName}
                    </h4>
                  </div>
                  <span className="badge badge-emerald" style={{ fontSize: '0.7rem' }}>
                    {inv.status || 'CONFIRMED'}
                  </span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', padding: '10px 12px', background: 'rgba(0,0,0,0.3)', borderRadius: '10px' }}>
                  <div>
                    <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>Invested Capital</div>
                    <div style={{ fontSize: '1rem', fontWeight: '800', color: '#10b981' }}>{formatMoney(inv.amount)}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>Target Yield</div>
                    <div style={{ fontSize: '0.9rem', fontWeight: '700', color: '#fbbf24' }}>{inv.expectedYield || '14.5%'}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>Payout Timeline</div>
                    <div style={{ fontSize: '0.8rem', color: '#e2e8f0' }}>{inv.payoutTimeline || 'Sprint End'}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>Ref ID</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', fontFamily: 'monospace' }}>{inv.id}</div>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Issued: {inv.date}</span>
                  <button
                    type="button"
                    onClick={() => setActiveCertificate(inv)}
                    className="btn btn-secondary btn-sm"
                    style={{ borderRadius: '8px', fontSize: '0.75rem', gap: '5px' }}
                  >
                    <FileText size={13} className="text-amber-400" />
                    <span>View Certificate</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '40px 20px', background: 'rgba(255, 255, 255, 0.01)', borderRadius: '16px', border: '1px dashed rgba(255, 255, 255, 0.1)' }}>
            <Building2 size={36} style={{ color: 'var(--text-dim)', margin: '0 auto 12px auto' }} />
            <h4 style={{ color: '#fff', fontSize: '1rem', margin: '0 0 6px 0', fontWeight: '700' }}>No Active Investments Yet</h4>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.84rem', margin: '0 0 16px 0', maxWidth: '480px', marginInline: 'auto' }}>
              Select any of the 4 verified business projects above and click <strong>"Invest in this Business"</strong> to fund and receive your official digital allocation certificate.
            </p>
            <button
              onClick={() => {
                const el = document.getElementById('projects-grid');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="btn btn-primary btn-sm"
              style={{ borderRadius: '10px' }}
            >
              Browse Active Business Deals
            </button>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* MODAL 1: DIRECT "INVEST IN THIS BUSINESS" ACTION MODAL */}
      {/* ========================================================================= */}
      {investingProject && (() => {
        const fin = calculateProjectFinancials(investingProject);
        return (
          <div className="modal-overlay" onClick={() => setInvestingProject(null)}>
            <div 
              className="modal-content" 
              onClick={(e) => e.stopPropagation()}
              style={{ maxWidth: '520px', width: '100%', padding: '28px', borderRadius: '24px' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '18px' }}>
                <div>
                  <div style={{ fontSize: '0.75rem', fontWeight: '700', color: '#10b981', textTransform: 'uppercase' }}>
                    Capital Allocation Desk
                  </div>
                  <h3 style={{ fontSize: '1.35rem', color: '#fff', margin: '4px 0', fontWeight: '800' }}>
                    Invest in {investingProject.name}
                  </h3>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    Target Yield: <strong style={{ color: '#fbbf24' }}>{fin.expectedTermYield}</strong> • Payout: {fin.payoutTimeline}
                  </div>
                </div>
                <button onClick={() => setInvestingProject(null)} className="btn btn-ghost btn-sm" style={{ padding: '4px' }}>
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleConfirmInvestment} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                
                {/* Amount Selector */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: '#fff', fontWeight: '600', marginBottom: '6px' }}>
                    Select Investment Amount ({currency}):
                  </label>

                  {/* Preset chips */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '10px' }}>
                    {quickInvestmentPresets.map(preset => (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => setInvestmentAmount(preset.toString())}
                        style={{
                          padding: '6px 12px',
                          borderRadius: '8px',
                          fontSize: '0.82rem',
                          fontWeight: '700',
                          border: investmentAmount === preset.toString() ? '1px solid #fbbf24' : '1px solid rgba(255, 255, 255, 0.1)',
                          background: investmentAmount === preset.toString() ? 'rgba(245, 158, 11, 0.2)' : 'rgba(255, 255, 255, 0.03)',
                          color: investmentAmount === preset.toString() ? '#fbbf24' : '#e2e8f0',
                          cursor: 'pointer'
                        }}
                      >
                        {formatMoney(preset)}
                      </button>
                    ))}
                  </div>

                  {/* Custom Input */}
                  <div style={{ position: 'relative' }}>
                    <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#fbbf24', fontWeight: '800' }}>₹</span>
                    <input 
                      type="number"
                      min={fin.minInvestment}
                      value={investmentAmount}
                      onChange={(e) => setInvestmentAmount(e.target.value)}
                      required
                      style={{
                        width: '100%',
                        padding: '10px 12px 10px 30px',
                        borderRadius: '10px',
                        border: '1px solid rgba(245, 158, 11, 0.4)',
                        background: 'rgba(0, 0, 0, 0.35)',
                        color: '#fff',
                        fontSize: '1rem',
                        fontWeight: '700',
                        outline: 'none'
                      }}
                    />
                  </div>
                </div>

                {/* Investor Details */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.76rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
                      Investor Full Name:
                    </label>
                    <input 
                      type="text"
                      placeholder="e.g. Ramesh Kumar"
                      value={investorName}
                      onChange={(e) => setInvestorName(e.target.value)}
                      required
                      style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.3)', color: '#fff', fontSize: '0.85rem' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.76rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
                      WhatsApp / Phone:
                    </label>
                    <input 
                      type="tel"
                      placeholder="+91 98400 12345"
                      value={investorPhone}
                      onChange={(e) => setInvestorPhone(e.target.value)}
                      required
                      style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.3)', color: '#fff', fontSize: '0.85rem' }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.76rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
                    Email Address (for Digital Certificate):
                  </label>
                  <input 
                    type="email"
                    placeholder="investor@example.com"
                    value={investorEmail}
                    onChange={(e) => setInvestorEmail(e.target.value)}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.3)', color: '#fff', fontSize: '0.85rem' }}
                  />
                </div>

                {/* Payment Mode Selector */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: '#fff', fontWeight: '600', marginBottom: '6px' }}>
                    Select Payment Method:
                  </label>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                    <div 
                      onClick={() => setPaymentMethod('UPI')}
                      style={{
                        padding: '10px 8px',
                        borderRadius: '10px',
                        border: paymentMethod === 'UPI' ? '2px solid #fbbf24' : '1px solid rgba(255, 255, 255, 0.1)',
                        background: paymentMethod === 'UPI' ? 'rgba(245, 158, 11, 0.1)' : 'rgba(255, 255, 255, 0.02)',
                        textAlign: 'center',
                        cursor: 'pointer'
                      }}
                    >
                      <QrCode size={18} style={{ margin: '0 auto 4px auto', color: paymentMethod === 'UPI' ? '#fbbf24' : 'var(--text-muted)' }} />
                      <div style={{ fontSize: '0.75rem', fontWeight: '700', color: paymentMethod === 'UPI' ? '#fff' : 'var(--text-muted)' }}>UPI / QR</div>
                    </div>

                    <div 
                      onClick={() => setPaymentMethod('BANK')}
                      style={{
                        padding: '10px 8px',
                        borderRadius: '10px',
                        border: paymentMethod === 'BANK' ? '2px solid #fbbf24' : '1px solid rgba(255, 255, 255, 0.1)',
                        background: paymentMethod === 'BANK' ? 'rgba(245, 158, 11, 0.1)' : 'rgba(255, 255, 255, 0.02)',
                        textAlign: 'center',
                        cursor: 'pointer'
                      }}
                    >
                      <Building2 size={18} style={{ margin: '0 auto 4px auto', color: paymentMethod === 'BANK' ? '#fbbf24' : 'var(--text-muted)' }} />
                      <div style={{ fontSize: '0.75rem', fontWeight: '700', color: paymentMethod === 'BANK' ? '#fff' : 'var(--text-muted)' }}>Bank IMPS</div>
                    </div>

                    <div 
                      onClick={() => setPaymentMethod('CARD')}
                      style={{
                        padding: '10px 8px',
                        borderRadius: '10px',
                        border: paymentMethod === 'CARD' ? '2px solid #fbbf24' : '1px solid rgba(255, 255, 255, 0.1)',
                        background: paymentMethod === 'CARD' ? 'rgba(245, 158, 11, 0.1)' : 'rgba(255, 255, 255, 0.02)',
                        textAlign: 'center',
                        cursor: 'pointer'
                      }}
                    >
                      <CreditCard size={18} style={{ margin: '0 auto 4px auto', color: paymentMethod === 'CARD' ? '#fbbf24' : 'var(--text-muted)' }} />
                      <div style={{ fontSize: '0.75rem', fontWeight: '700', color: paymentMethod === 'CARD' ? '#fff' : 'var(--text-muted)' }}>Card/NetBank</div>
                    </div>
                  </div>
                </div>

                {/* Dynamic Payment Instruction */}
                {paymentMethod === 'UPI' && (
                  <div style={{ background: 'rgba(245, 158, 11, 0.06)', border: '1px solid rgba(245, 158, 11, 0.2)', borderRadius: '10px', padding: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Escrow UPI VPA:</span>
                      <button 
                        type="button" 
                        onClick={() => copyToClipboard(investingProject.upiId || 'rbi.invest@okhdfcbank', setCopiedUpi)}
                        className="btn btn-ghost btn-sm" 
                        style={{ padding: '2px 6px', fontSize: '0.7rem', color: copiedUpi ? '#10b981' : '#fbbf24' }}
                      >
                        {copiedUpi ? 'Copied' : 'Copy'}
                      </button>
                    </div>
                    <div style={{ fontSize: '0.92rem', fontWeight: '800', color: '#fff', fontFamily: 'monospace', marginTop: '2px' }}>
                      {investingProject.upiId || 'rbi.invest@okhdfcbank'}
                    </div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                      Scan via Google Pay, PhonePe, Paytm or any BHIM UPI mobile app.
                    </div>
                  </div>
                )}

                {paymentMethod === 'BANK' && (
                  <div style={{ background: 'rgba(56, 189, 248, 0.06)', border: '1px solid rgba(56, 189, 248, 0.2)', borderRadius: '10px', padding: '12px', fontSize: '0.8rem' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                      <div>
                        <span style={{ color: 'var(--text-muted)', fontSize: '0.7rem' }}>Bank Name:</span>
                        <div style={{ fontWeight: '700', color: '#fff' }}>{investingProject.bankName || 'HDFC Bank Escrow'}</div>
                      </div>
                      <div>
                        <span style={{ color: 'var(--text-muted)', fontSize: '0.7rem' }}>A/C Number:</span>
                        <div style={{ fontWeight: '700', color: '#fff', fontFamily: 'monospace' }}>{investingProject.bankAccount || '50200084729103'}</div>
                      </div>
                      <div>
                        <span style={{ color: 'var(--text-muted)', fontSize: '0.7rem' }}>IFSC Code:</span>
                        <div style={{ fontWeight: '700', color: '#fff', fontFamily: 'monospace' }}>{investingProject.ifsc || 'HDFC0001234'}</div>
                      </div>
                      <div>
                        <span style={{ color: 'var(--text-muted)', fontSize: '0.7rem' }}>Account Type:</span>
                        <div style={{ fontWeight: '700', color: '#38bdf8' }}>Current / Escrow</div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Confirm Action Button */}
                <button 
                  type="submit"
                  className="btn btn-primary"
                  style={{
                    padding: '13px',
                    borderRadius: '12px',
                    fontSize: '1rem',
                    fontWeight: '800',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px'
                  }}
                >
                  <CheckCircle2 size={18} />
                  <span>Confirm & Complete Investment of {formatMoney(parseFloat(investmentAmount) || 0)}</span>
                </button>

                <div style={{ textAlign: 'center', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                  🔒 Official Digital Allocation Certificate issued instantly upon confirmation.
                </div>

              </form>
            </div>
          </div>
        );
      })()}

      {/* ========================================================================= */}
      {/* MODAL 2: OFFICIAL DIGITAL INVESTMENT CERTIFICATE (INSTITUTIONAL GRADE) */}
      {/* ========================================================================= */}
      {activeCertificate && (
        <div className="modal-overlay" onClick={() => setActiveCertificate(null)}>
          <div 
            className="modal-content" 
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: '580px', width: '100%', padding: '32px', borderRadius: '24px' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <BadgeCheck size={22} className="text-emerald-400" />
                <h3 style={{ fontSize: '1.25rem', color: '#fff', margin: 0, fontWeight: '800' }}>
                  Official Investment Allocation Certificate
                </h3>
              </div>
              <button onClick={() => setActiveCertificate(null)} className="btn btn-ghost btn-sm" style={{ padding: '4px' }}>
                <X size={18} />
              </button>
            </div>

            {/* Certificate Canvas Box */}
            <div 
              style={{
                background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.6) 0%, rgba(15, 23, 42, 0.9) 100%)',
                border: '2px solid rgba(245, 158, 11, 0.4)',
                borderRadius: '16px',
                padding: '24px',
                marginBottom: '20px',
                position: 'relative'
              }}
            >
              {/* Institutional Header */}
              <div style={{ textAlign: 'center', borderBottom: '1px dashed rgba(255, 255, 255, 0.15)', paddingBottom: '16px', marginBottom: '16px' }}>
                <div style={{ fontSize: '0.72rem', color: '#fbbf24', fontWeight: '800', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                  ROYAL BANK OF INVESTMENT • CENTRAL VAULT ESCROW
                </div>
                <h2 style={{ fontSize: '1.4rem', fontWeight: '900', color: '#fff', margin: '4px 0' }}>
                  Certificate of Capital Allocation
                </h2>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'monospace' }}>
                  Reference No: {activeCertificate.id}
                </div>
              </div>

              {/* Certificate Details */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.85rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Registered Investor:</span>
                  <strong style={{ color: '#fff' }}>{activeCertificate.investorName}</strong>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Business Venture:</span>
                  <strong style={{ color: '#fbbf24' }}>{activeCertificate.projectName}</strong>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Category:</span>
                  <span style={{ color: '#cbd5e1' }}>{activeCertificate.category}</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 10px', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '8px', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                  <span style={{ color: '#fff', fontWeight: '700' }}>Capital Deployed:</span>
                  <strong style={{ color: '#10b981', fontSize: '1.1rem' }}>{formatMoney(activeCertificate.amount)}</strong>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Target Sprint Yield:</span>
                  <strong style={{ color: '#38bdf8' }}>{activeCertificate.expectedYield}</strong>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Payout Timeline:</span>
                  <span style={{ color: '#fff' }}>{activeCertificate.payoutTimeline}</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Payment Channel:</span>
                  <span style={{ color: '#cbd5e1' }}>{activeCertificate.paymentMethod}</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Issued On:</span>
                  <span style={{ color: '#fff' }}>{activeCertificate.date}</span>
                </div>
              </div>

              {/* Seal Stamp */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '18px', paddingTop: '14px', borderTop: '1px dashed rgba(255, 255, 255, 0.15)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.72rem', color: '#10b981', fontWeight: '700' }}>
                  <ShieldCheck size={16} /> VERIFIED BY RBI SOVEREIGN RAILS
                </div>
                <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>
                  Tamper-Proof Escrow Record
                </div>
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: '10px' }}>
              <button 
                type="button" 
                onClick={() => window.print()}
                className="btn btn-secondary btn-sm"
                style={{ flex: 1, justifyContent: 'center', borderRadius: '10px' }}
              >
                <Printer size={15} /> Print / Save Certificate PDF
              </button>
              <button 
                type="button" 
                onClick={() => setActiveCertificate(null)}
                className="btn btn-primary btn-sm"
                style={{ flex: 1, justifyContent: 'center', borderRadius: '10px' }}
              >
                Close Certificate
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 3: EDIT PROJECT ASSUMPTIONS (ADMIN) */}
      {/* ========================================================================= */}
      {editingProject && (
        <div className="modal-overlay" onClick={() => setEditingProject(null)}>
          <div 
            className="modal-content" 
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: '540px', width: '100%', padding: '28px', borderRadius: '20px' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <div>
                <h3 style={{ fontSize: '1.25rem', color: '#fff', margin: 0, fontWeight: '800' }}>
                  Edit Assumptions: {editingProject.name}
                </h3>
              </div>
              <button onClick={() => setEditingProject(null)} className="btn btn-ghost btn-sm" style={{ padding: '4px' }}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Daily Ad Budget (₹):</label>
                  <input type="number" value={editFormData.dailyAdBudget} onChange={(e) => setEditFormData(prev => ({ ...prev, dailyAdBudget: e.target.value }))} required style={{ width: '100%', padding: '9px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.3)', color: '#fff' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Campaign Days:</label>
                  <input type="number" value={editFormData.campaignDurationDays} onChange={(e) => setEditFormData(prev => ({ ...prev, campaignDurationDays: e.target.value }))} required style={{ width: '100%', padding: '9px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.3)', color: '#fff' }} />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <button type="button" onClick={() => setEditingProject(null)} className="btn btn-secondary" style={{ flex: 1, borderRadius: '10px' }}>Cancel</button>
                <button type="submit" className="btn btn-primary" style={{ flex: 1, borderRadius: '10px' }}>Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
