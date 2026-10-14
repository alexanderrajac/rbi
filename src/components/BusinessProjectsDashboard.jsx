import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAnimatedCounter } from '../hooks/useAnimatedCounter';
import { useApp } from '../context/AppContext';
import { 
  calculateProjectFinancials, 
  parseNaturalLanguagePlan 
} from '../data/businessProjectsData';
import { LiveCandlestickTerminal } from './LiveCandlestickTerminal';
import { 
  Building2, 
  TrendingUp, 
  Sparkles, 
  CheckCircle2, 
  Clock, 
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
  FileText,
  Plus,
  Trash2,
  Send,
  ChevronRight,
  Lock,
  SlidersHorizontal,
  Upload,
  AlertCircle,
  CheckCircle,
  Calculator,
  UserCheck
} from 'lucide-react';

export const BusinessProjectsDashboard = () => {
  const { 
    businessProjects, 
    updateBusinessProject, 
    investInBusinessProject,
    updateProjectMilestone,
    addProjectMilestone,
    deleteProjectMilestone,
    addProjectLiveUpdate,
    approveBusinessInvestment,
    rejectBusinessInvestment,
    projectInvestments,
    formatMoney, 
    currency,
    user,
    isAdminLoggedIn
  } = useApp();

  // Active Filter & Search
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
  const [investmentAmount, setInvestmentAmount] = useState('500');
  const [paymentMethod, setPaymentMethod] = useState('UPI'); // 'UPI' | 'BANK' | 'CARD'
  const [investmentNote, setInvestmentNote] = useState('');
  const [investorUtr, setInvestorUtr] = useState('');
  const [screenshotPreview, setScreenshotPreview] = useState('');

  // Submission Acknowledgment Modal State
  const [submissionSuccessModal, setSubmissionSuccessModal] = useState(null);

  // Admin Approval Desk Modal State
  const [isAdminApprovalModalOpen, setIsAdminApprovalModalOpen] = useState(false);

  // Screenshot Zoom Modal State
  const [previewScreenshotUrl, setPreviewScreenshotUrl] = useState(null);

  // Interactive Profit Calculator State (Default ₹500)
  const [calcAmount, setCalcAmount] = useState('500');

  // UI Feedback States
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [copiedAcc, setCopiedAcc] = useState(false);
  const [copiedIfsc, setCopiedIfsc] = useState(false);

  // Certificate Modal State
  const [activeCertificate, setActiveCertificate] = useState(null);

  // Detailed Investment Overview Modal State
  const [detailedOverviewProject, setDetailedOverviewProject] = useState(null);

  // Admin Milestones Manager Modal State
  const [adminMilestoneProject, setAdminMilestoneProject] = useState(null);
  const [newMilestonePhase, setNewMilestonePhase] = useState('');
  const [newMilestonePeriod, setNewMilestonePeriod] = useState('');
  const [newMilestoneBudget, setNewMilestoneBudget] = useState('');
  const [newMilestoneDeliverables, setNewMilestoneDeliverables] = useState('');
  const [newLiveUpdateNote, setNewLiveUpdateNote] = useState('');

  // Milestone Inline Editing State
  const [editingMilestoneId, setEditingMilestoneId] = useState(null);
  const [editingMilestoneForm, setEditingMilestoneForm] = useState({
    phase: '',
    period: '',
    sprintDuration: '',
    deliverables: '',
    allocatedBudget: '1000',
    spent: '0',
    status: 'UPCOMING'
  });
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

  // Helper: Calculate exact return & profit for any project & amount (Dynamic Logic)
  const calculateInvestmentReturn = (project, amountVal) => {
    const amt = parseFloat(amountVal) || 0;
    let yieldRate = 0.145; // default 14.5%
    
    // Dynamically extract yield percentage from project.expectedTermYield (e.g. "14.2% Net Term Yield")
    if (project?.expectedTermYield) {
      const match = project.expectedTermYield.match(/(\d+(?:\.\d+)?)\s*%/);
      if (match) {
        yieldRate = parseFloat(match[1]) / 100;
      }
    } else if (project?.id === 'proj-unavukadai') {
      yieldRate = 0.142;
    } else if (project?.id === 'proj-carpenterbullet') {
      yieldRate = 0.150;
    } else if (project?.id === 'proj-wooden-laptop-case') {
      yieldRate = 0.168;
    } else if (project?.id === 'proj-bamboo-cup') {
      yieldRate = 0.145;
    }

    const profit = Math.round(amt * yieldRate * 100) / 100;
    const totalReturn = Math.round((amt + profit) * 100) / 100;
    const yieldPercent = (yieldRate * 100).toFixed(1) + '%';
    const timeline = project?.payoutTimeline || "Sprint Completion";

    return {
      invested: amt,
      profit,
      totalReturn,
      yieldPercent,
      days: timeline,
      payoutTimeline: timeline
    };
  };

  // Handle Screenshot Upload via FileReader
  const handleScreenshotChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("Screenshot image size exceeds 5MB. Please upload a smaller image.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setScreenshotPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Open Invest Modal
  const handleOpenInvest = (project) => {
    setInvestingProject(project);
    setInvestmentAmount(project.minInvestment ? project.minInvestment.toString() : '500');
    setInvestmentNote(`Capital backing for ${project.name}`);
    if (user?.name && !investorName) setInvestorName(user.name);
    if (user?.email && !investorEmail) setInvestorEmail(user.email);
    setInvestorUtr('');
    setScreenshotPreview('');
  };

  // Submit Investment (Awaiting Admin Approval)
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
      utrNumber: investorUtr,
      screenshotUrl: screenshotPreview,
      note: investmentNote
    });

    if (newInvestment) {
      setInvestingProject(null);
      setSubmissionSuccessModal(newInvestment);
      setInvestorName('');
      setInvestorEmail('');
      setInvestorPhone('');
      setInvestorUtr('');
      setScreenshotPreview('');
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

  // Handle Add Milestone from Admin Modal
  const handleCreateMilestone = (e) => {
    e.preventDefault();
    if (!adminMilestoneProject || !newMilestonePhase.trim()) return;

    addProjectMilestone(adminMilestoneProject.id, {
      phase: newMilestonePhase.trim(),
      period: newMilestonePeriod.trim() || 'Active Sprint',
      allocatedBudget: parseFloat(newMilestoneBudget) || 0,
      deliverables: newMilestoneDeliverables.trim() || 'Operational milestone completion.'
    });

    setNewMilestonePhase('');
    setNewMilestonePeriod('');
    setNewMilestoneBudget('');
    setNewMilestoneDeliverables('');
  };

  // Handle Post Live Update
  const handlePostLiveUpdate = (e) => {
    e.preventDefault();
    if (!adminMilestoneProject || !newLiveUpdateNote.trim()) return;

    addProjectLiveUpdate(
      adminMilestoneProject.id,
      newLiveUpdateNote.trim(),
      user?.name || "Operations Lead"
    );
    setNewLiveUpdateNote('');
  };

  // Filtered Projects
  const filteredProjects = businessProjects.filter(p => {
    const matchesCat = selectedCategory === 'ALL' || p.status === selectedCategory || p.category.toLowerCase().includes(selectedCategory.toLowerCase());
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  // Pending investments waiting for Admin Approval
  const pendingInvestments = (projectInvestments || []).filter(inv => inv.status === 'PENDING_APPROVAL');

  // Portfolio aggregates
  const portfolioAggregates = businessProjects.reduce((acc, p) => {
    const fin = calculateProjectFinancials(p);
    acc.totalCapitalRequested += fin.capitalRequested;
    acc.totalCapitalRaised += fin.capitalRaised;
    acc.totalInvestors += fin.investorsCount;
    return acc;
  }, { totalCapitalRequested: 0, totalCapitalRaised: 0, totalInvestors: 0 });

  // Spring-driven numeric counters for trading desk metrics
  const animatedRaised = useAnimatedCounter(portfolioAggregates.totalCapitalRaised);
  const animatedTarget = useAnimatedCounter(portfolioAggregates.totalCapitalRequested);
  const animatedInvestors = useAnimatedCounter(portfolioAggregates.totalInvestors);

  return (
    <div className="container" style={{ padding: '28px 16px', maxWidth: '1280px', margin: '0 auto' }}>
      
      {/* ========================================================================= */}
      {/* 1. INSTITUTIONAL TRADING DESK HERO TELEMETRY (DARK OBSIDIAN THEME) */}
      {/* ========================================================================= */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="hero-box-mobile trading-panel-card"
        style={{
          padding: '28px 24px',
          marginBottom: '24px',
          boxShadow: '0 10px 30px -10px rgba(0, 0, 0, 0.6)'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '20px' }}>
          <div style={{ maxWidth: '860px', width: '100%' }}>
            
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(0, 245, 155, 0.08)', border: '1px solid rgba(0, 245, 155, 0.3)', borderRadius: '20px', padding: '4px 12px', marginBottom: '14px', maxWidth: '100%' }}>
              <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#00F59B', boxShadow: '0 0 8px #00F59B', flexShrink: 0 }}></span>
              <span className="font-mono-numbers" style={{ fontSize: '0.72rem', fontWeight: '700', color: '#00F59B', letterSpacing: '0.04em', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                RBI SOVEREIGN TRADING DESK • ESCROW RING-FENCED • ZERO DEFAULT
              </span>
            </div>

            <h1 className="hero-heading-mobile" style={{ fontSize: '2.1rem', fontWeight: '900', color: '#F0F6FC', margin: '0 0 10px 0', letterSpacing: '-0.03em', lineHeight: '1.2' }}>
              Invest in Real-World Business Ventures
            </h1>
            <p style={{ color: '#8B949E', fontSize: '0.94rem', margin: '0 0 20px 0', lineHeight: '1.6' }}>
              Direct capital allocation into 4 verified businesses across <strong style={{ color: '#E6EDF3' }}>Food Delivery & Cloud Kitchen</strong>, <strong style={{ color: '#E6EDF3' }}>Carpentry Service Marketplaces</strong>, and <strong style={{ color: '#E6EDF3' }}>Sustainable Eco-Friendly Manufacturing</strong>. Every rupee spent is audited, milestones trigger escrow disbursement, and investors receive direct sprint return settlements.
            </p>

            {/* High-Density Key Trading Telemetry Numbers */}
            <div className="responsive-stat-grid">
              <div style={{ background: '#161B22', padding: '14px 18px', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                <div style={{ fontSize: '0.70rem', color: '#8B949E', textTransform: 'uppercase', fontWeight: '700', letterSpacing: '0.04em' }}>Active Businesses</div>
                <div className="font-mono-numbers" style={{ fontSize: '1.45rem', fontWeight: '800', color: '#F0F6FC', marginTop: '2px' }}>4 Open Deals</div>
              </div>
              <div className="card-pulse-bullish" style={{ background: '#161B22', padding: '14px 18px', borderRadius: '12px', border: '1px solid rgba(0, 245, 155, 0.4)' }}>
                <div style={{ fontSize: '0.70rem', color: '#00F59B', textTransform: 'uppercase', fontWeight: '700', letterSpacing: '0.04em' }}>Total Capital Raised</div>
                <div className="font-mono-numbers" style={{ fontSize: '1.45rem', fontWeight: '800', color: '#00F59B', marginTop: '2px' }}>₹{animatedRaised.toLocaleString('en-IN')}</div>
              </div>
              <div style={{ background: '#161B22', padding: '14px 18px', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                <div style={{ fontSize: '0.70rem', color: '#8B949E', textTransform: 'uppercase', fontWeight: '700', letterSpacing: '0.04em' }}>Target Capital Goal</div>
                <div className="font-mono-numbers" style={{ fontSize: '1.45rem', fontWeight: '800', color: '#F59E0B', marginTop: '2px' }}>₹{animatedTarget.toLocaleString('en-IN')}</div>
              </div>
              <div style={{ background: '#161B22', padding: '14px 18px', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                <div style={{ fontSize: '0.70rem', color: '#8B949E', textTransform: 'uppercase', fontWeight: '700', letterSpacing: '0.04em' }}>Verified Backers</div>
                <div className="font-mono-numbers" style={{ fontSize: '1.45rem', fontWeight: '800', color: '#38BDF8', marginTop: '2px' }}>{animatedInvestors} Investors</div>
              </div>
            </div>
          </div>

          {/* Admin Approval Quick Gate - STRICTLY SOVEREIGN ADMIN */}
          {isAdminLoggedIn && (
            <div style={{ background: '#161B22', border: '1px solid rgba(245, 158, 11, 0.35)', borderRadius: '14px', padding: '18px', minWidth: '240px' }}>
              <div style={{ fontSize: '0.72rem', fontWeight: '800', color: '#F59E0B', textTransform: 'uppercase', marginBottom: '8px', letterSpacing: '0.05em' }}>
                Admin Verification Desk
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
                <span className="badge font-mono-numbers" style={{ fontSize: '0.78rem', padding: '4px 10px', background: pendingInvestments.length > 0 ? 'rgba(245, 158, 11, 0.15)' : 'rgba(0, 245, 155, 0.15)', color: pendingInvestments.length > 0 ? '#F59E0B' : '#00F59B', border: '1px solid currentColor' }}>
                  {pendingInvestments.length} Pending Approval
                </span>
              </div>
              <button
                onClick={() => setIsAdminApprovalModalOpen(true)}
                className="btn btn-sm"
                style={{ width: '100%', borderRadius: '8px', fontWeight: '700', gap: '6px', background: '#F59E0B', color: '#0B0E14' }}
              >
                <UserCheck size={15} />
                <span>Review Submissions</span>
              </button>
            </div>
          )}
        </div>
      </motion.div>

      {/* ========================================================================= */}
      {/* 1.5. LIVE STOCK MARKET CANDLESTICK TERMINAL (Moving Real-time Engine) */}
      {/* ========================================================================= */}
      <LiveCandlestickTerminal 
        totalCapitalRaised={portfolioAggregates.totalCapitalRaised} 
        totalInvestors={portfolioAggregates.totalInvestors} 
        investments={projectInvestments}
        projects={businessProjects}
        onInvest={(targetProj, amt) => {
          const proj = targetProj || businessProjects[0];
          setInvestingProject(proj);
          if (amt) {
            setInvestmentAmount(String(amt));
          } else if (proj?.minInvestment) {
            setInvestmentAmount(String(proj.minInvestment));
          } else {
            setInvestmentAmount('500');
          }
          setInvestmentNote(`Capital backing for ${proj?.name || 'Venture'}`);
          setInvestorUtr('');
          setScreenshotPreview('');
        }}
      />

      {/* ========================================================================= */}
      {/* 2. PROFIT RATIO & ₹500 RETURN BREAKDOWN CALCULATOR */}
      {/* ========================================================================= */}
      {/* ========================================================================= */}
      {/* 2. PROFIT RATIO & ₹500 RETURN BREAKDOWN CALCULATOR (TRADING DESK SIMULATOR) */}
      {/* ========================================================================= */}
      <div 
        className="trading-panel-card"
        style={{
          padding: '22px 24px',
          marginBottom: '26px',
          background: '#0D1117'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Calculator size={18} className="text-emerald-400" />
              <h3 style={{ fontSize: '1.20rem', fontWeight: '800', color: '#F0F6FC', margin: 0 }}>
                Transparent Profit Ratio & Return Calculator
              </h3>
            </div>
            <p style={{ color: '#8B949E', fontSize: '0.84rem', margin: '4px 0 0 0' }}>
              Simulate exact net returns and sprint payout for backing any deal with <strong className="font-mono-numbers" style={{ color: '#00F59B' }}>₹{calcAmount || '500'}</strong>:
            </p>
          </div>

          {/* Quick Amount Inputs */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '0.78rem', color: '#8B949E', fontWeight: '600' }}>Order Size:</span>
            {[500, 1000, 2500, 5000].map(amt => (
              <button
                key={amt}
                onClick={() => setCalcAmount(amt.toString())}
                className="font-mono-numbers"
                style={{
                  padding: '5px 12px',
                  borderRadius: '8px',
                  fontSize: '0.78rem',
                  fontWeight: '700',
                  border: calcAmount === amt.toString() ? '1px solid #00F59B' : '1px solid rgba(255, 255, 255, 0.1)',
                  background: calcAmount === amt.toString() ? 'rgba(0, 245, 155, 0.15)' : '#161B22',
                  color: calcAmount === amt.toString() ? '#00F59B' : '#C9D1D9',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                ₹{amt}
              </button>
            ))}
          </div>
        </div>

        {/* 4 Projects Return Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '12px' }}>
          {businessProjects.map(proj => {
            const ret = calculateInvestmentReturn(proj, calcAmount);
            return (
              <div 
                key={proj.id}
                style={{
                  background: '#161B22',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '12px',
                  padding: '14px 16px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <strong style={{ fontSize: '0.88rem', color: '#F0F6FC' }}>{proj.name}</strong>
                  <span className="badge font-mono-numbers" style={{ fontSize: '0.66rem', background: 'rgba(0, 245, 155, 0.12)', color: '#00F59B', border: '1px solid rgba(0, 245, 155, 0.25)' }}>
                    +{ret.yieldPercent}
                  </span>
                </div>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', paddingTop: '4px', borderTop: '1px dashed rgba(255, 255, 255, 0.1)' }}>
                  <span style={{ fontSize: '0.74rem', color: '#8B949E' }}>If backed with ₹{calcAmount}:</span>
                  <span className="font-mono-numbers" style={{ fontSize: '1.15rem', fontWeight: '800', color: '#00F59B' }}>
                    ₹{ret.totalReturn}
                  </span>
                </div>

                <div className="font-mono-numbers" style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: '#8B949E' }}>
                  <span>Net Profit: <strong style={{ color: '#F59E0B' }}>+₹{ret.profit}</strong></span>
                  <span>Timeline: <strong style={{ color: '#C9D1D9' }}>{ret.days}</strong></span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. FILTER & SEARCH BAR */}
      {/* ========================================================================= */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px', marginBottom: '24px' }}>
        
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
              className="font-mono-numbers"
              style={{
                padding: '7px 14px',
                borderRadius: '8px',
                fontSize: '0.78rem',
                fontWeight: '700',
                border: selectedCategory === cat.id ? '1px solid #38BDF8' : '1px solid rgba(255, 255, 255, 0.08)',
                background: selectedCategory === cat.id ? 'rgba(56, 189, 248, 0.15)' : '#161B22',
                color: selectedCategory === cat.id ? '#38BDF8' : '#8B949E',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div style={{ position: 'relative' }}>
          <Search size={14} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#6E7681' }} />
          <input 
            type="text"
            placeholder="Search business ventures..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              padding: '8px 14px 8px 34px',
              borderRadius: '8px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              background: '#161B22',
              fontSize: '0.82rem',
              color: '#F0F6FC',
              outline: 'none',
              minWidth: '240px'
            }}
          />
        </div>

      </div>

      {/* ========================================================================= */}
      {/* 4. BUSINESS PROJECT CARDS (WITH PROFIT RATIO & APPROVAL WORKFLOW) */}
      {/* ========================================================================= */}
      {/* ========================================================================= */}
      {/* 4. BUSINESS PROJECT CARDS (DARK TRADING INSTRUMENTS GRID) */}
      {/* ========================================================================= */}
      <div id="projects-grid" className="responsive-projects-grid">
        {filteredProjects.map((project, idx) => {
          const customUnits = project.id === 'proj-bamboo-cup' ? bambooScenario : null;
          const financials = calculateProjectFinancials(project, customUnits);
          const currentTab = cardActiveTab[project.id] || 'overview';
          const sample500 = calculateInvestmentReturn(project, 500);

          const tickerCode = project.id === 'proj-unavukadai' ? 'UNAVU' :
                             project.id === 'proj-carpenterbullet' ? 'CARPB' :
                             project.id === 'proj-wooden-laptop-case' ? 'WLC' : 'WCUP';

          return (
            <motion.div 
              key={project.id}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: idx * 0.08, ease: "easeOut" }}
              className="trading-panel-card"
              style={{
                background: '#0D1117',
                borderRadius: '16px',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                padding: '22px 18px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              <div>
                {/* Header Badge, Admin Milestone Button & Title */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                      <span className="badge font-mono-numbers" style={{ fontSize: '0.64rem', padding: '2px 7px', background: 'rgba(0, 245, 155, 0.12)', color: '#00F59B', border: '1px solid rgba(0, 245, 155, 0.3)' }}>
                        OPEN FOR SYNDICATE
                      </span>
                      <span className="font-mono-numbers" style={{ fontSize: '0.66rem', color: '#38BDF8', background: 'rgba(56, 189, 248, 0.1)', padding: '2px 6px', borderRadius: '4px', border: '1px solid rgba(56, 189, 248, 0.25)' }}>
                        [{tickerCode}]
                      </span>
                    </div>
                    <h2 style={{ fontSize: '1.30rem', fontWeight: '800', color: '#F0F6FC', margin: '4px 0 2px 0', letterSpacing: '-0.02em' }}>
                      {project.name}
                    </h2>
                    <span style={{ fontSize: '0.76rem', color: '#8B949E', fontWeight: '600' }}>
                      {project.category}
                    </span>
                  </div>

                  {/* Top Action Buttons - STRICTLY SOVEREIGN ADMIN */}
                  {isAdminLoggedIn && (
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <button 
                        onClick={() => setAdminMilestoneProject(project)}
                        className="btn btn-secondary btn-sm"
                        title="Manage Milestones & Live Work (Admin)"
                        style={{ padding: '5px 8px', fontSize: '0.70rem', gap: '4px', background: '#161B22', color: '#F59E0B', border: '1px solid rgba(245, 158, 11, 0.3)' }}
                      >
                        <SlidersHorizontal size={13} />
                        <span>Admin Milestones</span>
                      </button>
                      <button 
                        onClick={() => handleOpenEdit(project)}
                        className="btn btn-ghost btn-sm"
                        title="Edit Assumptions"
                        style={{ padding: '5px', color: '#8B949E' }}
                      >
                        <Edit3 size={13} />
                      </button>
                    </div>
                  )}
                </div>

                <p style={{ fontSize: '0.84rem', color: '#8B949E', margin: '6px 0 16px 0', lineHeight: '1.5' }}>
                  {project.description}
                </p>

                {/* Return on ₹500 Snapshot Pill (Dark Trading Style) */}
                <div style={{ background: '#161B22', border: '1px solid rgba(0, 245, 155, 0.25)', borderRadius: '10px', padding: '8px 12px', marginBottom: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.74rem', color: '#8B949E', fontWeight: '600' }}>
                    Order ₹500 → Return:
                  </span>
                  <div className="font-mono-numbers" style={{ fontSize: '0.86rem', fontWeight: '800', color: '#00F59B' }}>
                    ₹{sample500.totalReturn} <span style={{ fontSize: '0.72rem', color: '#F59E0B' }}>(+₹{sample500.profit} in {sample500.days})</span>
                  </div>
                </div>

                {/* Live Funding Progress Bar */}
                <div style={{ 
                  background: '#161B22', 
                  padding: '14px 16px', 
                  borderRadius: '12px', 
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  marginBottom: '16px' 
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '8px' }}>
                    <div>
                      <span className="font-mono-numbers" style={{ fontSize: '1.3rem', fontWeight: '900', color: '#00F59B' }}>
                        {formatMoney(financials.capitalRaised)}
                      </span>
                      <span style={{ fontSize: '0.74rem', color: '#8B949E', marginLeft: '6px' }}>
                        raised of {formatMoney(financials.capitalRequested)}
                      </span>
                    </div>
                    <span className="font-mono-numbers" style={{ fontSize: '0.92rem', fontWeight: '800', color: '#F59E0B' }}>
                      {financials.fundingPercent}%
                    </span>
                  </div>

                  {/* Progress Line */}
                  <div style={{ width: '100%', height: '7px', background: '#21262D', borderRadius: '6px', overflow: 'hidden' }}>
                    <div 
                      style={{ 
                        width: `${financials.fundingPercent}%`, 
                        height: '100%', 
                        background: 'linear-gradient(90deg, #F59E0B 0%, #00F59B 100%)',
                        borderRadius: '6px',
                        transition: 'width 0.4s ease'
                      }}
                    />
                  </div>

                  <div className="font-mono-numbers" style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px', fontSize: '0.72rem', color: '#8B949E' }}>
                    <span>👥 {financials.investorsCount} Backers</span>
                    <span>Min: {formatMoney(financials.minInvestment)}</span>
                    <span style={{ color: '#38BDF8', fontWeight: '700' }}>Yield: {financials.expectedTermYield}</span>
                  </div>
                </div>

                {/* In-Card Tabs for Details */}
                <div style={{ 
                  display: 'flex', 
                  gap: '4px', 
                  background: '#161B22', 
                  padding: '3px', 
                  borderRadius: '10px', 
                  marginBottom: '14px',
                  border: '1px solid rgba(255, 255, 255, 0.08)'
                }}>
                  {[
                    { id: 'overview', label: 'Economics' },
                    { id: 'costs', label: 'All Costs' },
                    { id: 'timeline', label: 'Milestones' },
                    { id: 'activity', label: 'Live Work' }
                  ].map(tab => (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setProjectCardTab(project.id, tab.id)}
                      className="font-mono-numbers"
                      style={{
                        flex: 1,
                        padding: '6px 4px',
                        borderRadius: '7px',
                        fontSize: '0.72rem',
                        fontWeight: '700',
                        border: 'none',
                        background: currentTab === tab.id ? '#21262D' : 'transparent',
                        color: currentTab === tab.id ? '#F0F6FC' : '#8B949E',
                        boxShadow: currentTab === tab.id ? '0 1px 3px rgba(0,0,0,0.4)' : 'none',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                {/* TAB 1: ECONOMICS */}
                {currentTab === 'overview' && (
                  <div>
                    <div style={{ 
                      background: '#161B22', 
                      borderRadius: '12px', 
                      padding: '12px 14px', 
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                      display: 'grid', 
                      gridTemplateColumns: '1fr 1fr', 
                      gap: '10px',
                      marginBottom: '14px',
                      fontSize: '0.76rem'
                    }}>
                      <div>
                        <span style={{ color: '#8B949E' }}>Target Revenue:</span>
                        <div className="font-mono-numbers" style={{ fontWeight: '800', color: '#F0F6FC', fontSize: '0.92rem' }}>{formatMoney(financials.projectedRevenue)}</div>
                      </div>
                      <div>
                        <span style={{ color: '#8B949E' }}>Projected Net Profit:</span>
                        <div className="font-mono-numbers" style={{ fontWeight: '800', color: '#00F59B', fontSize: '0.92rem' }}>{formatMoney(financials.projectedNetProfit)}</div>
                      </div>
                      <div>
                        <span style={{ color: '#8B949E' }}>Sprint Payout:</span>
                        <div className="font-mono-numbers" style={{ fontWeight: '700', color: '#F59E0B' }}>{financials.payoutTimeline}</div>
                      </div>
                      <div>
                        <span style={{ color: '#8B949E' }}>Ad Spend Allocation:</span>
                        <div className="font-mono-numbers" style={{ fontWeight: '700', color: '#38BDF8' }}>{formatMoney(financials.totalAdSpend)}</div>
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 2: ALL COSTS */}
                {currentTab === 'costs' && (
                  <div style={{ marginBottom: '14px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {(project.expenseBreakdown || []).slice(0, 4).map((exp, expIdx) => (
                      <div key={expIdx} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 10px', borderRadius: '8px', background: '#161B22', border: '1px solid rgba(255, 255, 255, 0.06)', fontSize: '0.74rem' }}>
                        <span style={{ color: '#C9D1D9' }}>{exp.item}</span>
                        <strong className="font-mono-numbers" style={{ color: '#F59E0B' }}>{formatMoney(exp.amount)}</strong>
                      </div>
                    ))}
                    <div style={{ fontSize: '0.68rem', color: '#6E7681', textAlign: 'right', marginTop: '2px' }}>
                      All items verified & ring-fenced in escrow
                    </div>
                  </div>
                )}

                {/* TAB 3: MILESTONES (UPCOMING SPRINTS) */}
                {currentTab === 'timeline' && (
                  <div style={{ marginBottom: '14px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {(project.timeline || []).map((m, stepIdx) => (
                      <div key={m.id || stepIdx} style={{ padding: '10px 12px', borderRadius: '10px', background: '#161B22', border: '1px solid rgba(255, 255, 255, 0.08)', fontSize: '0.74rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px', marginBottom: '4px' }}>
                          <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                              <span style={{ fontSize: '0.65rem', fontWeight: '800', color: '#8B949E', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                                Step {m.stepNumber || stepIdx + 1}/{m.stepTotal || (project.timeline?.length || 5)}:
                              </span>
                              <strong style={{ color: '#F0F6FC', fontSize: '0.76rem' }}>
                                {m.phase}
                              </strong>
                            </div>
                            
                            {/* Sprint Duration & Time Badge */}
                            <div className="font-mono-numbers" style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', marginTop: '4px', background: 'rgba(245, 158, 11, 0.12)', color: '#F59E0B', padding: '2px 8px', borderRadius: '6px', fontSize: '0.66rem', fontWeight: '700', border: '1px solid rgba(245, 158, 11, 0.25)' }}>
                              <Clock size={11} />
                              <span>Sprint: {m.sprintDuration || m.period}</span>
                            </div>
                          </div>
                          
                          <span className="badge font-mono-numbers" style={{ fontSize: '0.60rem', padding: '2px 6px', background: 'rgba(245, 158, 11, 0.15)', color: '#F59E0B', border: '1px solid rgba(245, 158, 11, 0.3)', flexShrink: 0 }}>
                            {m.status || 'UPCOMING'}
                          </span>
                        </div>

                        <div style={{ color: '#8B949E', fontSize: '0.70rem', marginTop: '4px', lineHeight: '1.4' }}>{m.deliverables}</div>
                        
                        <div className="font-mono-numbers" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '6px', fontSize: '0.68rem', color: '#8B949E' }}>
                          <span>Dates: <strong style={{ color: '#C9D1D9' }}>{m.period}</strong></span>
                          <span>Budget: <strong style={{ color: '#00F59B' }}>{formatMoney(m.allocatedBudget)}</strong></span>
                        </div>
                        
                        {/* Quick Status Buttons - Strictly Sovereign Admin */}
                        {isAdminLoggedIn && (
                          <div style={{ display: 'flex', gap: '4px', marginTop: '6px', paddingTop: '6px', borderTop: '1px dashed rgba(255, 255, 255, 0.08)' }}>
                            <button
                              type="button"
                              onClick={() => updateProjectMilestone(project.id, m.id, { status: 'COMPLETED' })}
                              style={{ padding: '2px 7px', borderRadius: '5px', fontSize: '0.65rem', border: '1px solid rgba(0, 245, 155, 0.3)', background: m.status === 'COMPLETED' ? 'rgba(0, 245, 155, 0.2)' : '#161B22', color: '#00F59B', cursor: 'pointer', fontWeight: '700' }}
                            >
                              ✓ Completed
                            </button>
                            <button
                              type="button"
                              onClick={() => updateProjectMilestone(project.id, m.id, { status: 'IN_PROGRESS' })}
                              style={{ padding: '2px 7px', borderRadius: '5px', fontSize: '0.65rem', border: '1px solid rgba(56, 189, 248, 0.3)', background: m.status === 'IN_PROGRESS' ? 'rgba(56, 189, 248, 0.2)' : '#161B22', color: '#38BDF8', cursor: 'pointer', fontWeight: '700' }}
                            >
                              ▶ In Progress
                            </button>
                            <button
                              type="button"
                              onClick={() => updateProjectMilestone(project.id, m.id, { status: 'UPCOMING' })}
                              style={{ padding: '2px 7px', borderRadius: '5px', fontSize: '0.65rem', border: '1px solid rgba(255, 255, 255, 0.1)', background: m.status === 'UPCOMING' ? 'rgba(255, 255, 255, 0.08)' : '#161B22', color: '#8B949E', cursor: 'pointer' }}
                            >
                              Upcoming
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* TAB 4: LIVE WORK */}
                {currentTab === 'activity' && (
                  <div style={{ marginBottom: '14px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {(project.liveUpdates || []).slice(0, 3).map((upd, updIdx) => (
                      <div key={updIdx} style={{ padding: '8px 10px', borderRadius: '8px', background: '#161B22', borderLeft: '3px solid #00F59B', borderTop: '1px solid rgba(255, 255, 255, 0.06)', borderRight: '1px solid rgba(255, 255, 255, 0.06)', borderBottom: '1px solid rgba(255, 255, 255, 0.06)', fontSize: '0.74rem' }}>
                        <div style={{ color: '#F0F6FC', fontWeight: '600' }}>{upd.note}</div>
                        <div style={{ color: '#8B949E', fontSize: '0.66rem', marginTop: '2px' }}>{upd.date} • {upd.author}</div>
                      </div>
                    ))}
                  </div>
                )}

              </div>

              {/* Card Footer: PRIMARY "EXECUTE BACKING ORDER" + DETAILED OVERVIEW BUTTON */}
              <div style={{ marginTop: '14px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <button 
                  type="button"
                  onClick={() => handleOpenInvest(project)}
                  className="btn-order-cta"
                  style={{
                    width: '100%',
                    padding: '12px',
                    fontSize: '0.88rem'
                  }}
                >
                  <Building2 size={16} />
                  <span>Execute Backing Order (Min {formatMoney(financials.minInvestment)})</span>
                </button>

                <button 
                  type="button"
                  onClick={() => setDetailedOverviewProject(project)}
                  className="btn-secondary-trading"
                  style={{
                    width: '100%',
                    padding: '8px',
                    fontSize: '0.78rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    cursor: 'pointer'
                  }}
                >
                  <FileText size={13} style={{ color: '#F59E0B' }} />
                  <span>Audit Terms & Unit Economics</span>
                </button>
              </div>

            </motion.div>
          );
        })}
      </div>

      {/* ========================================================================= */}
      {/* 5. HOW IT WORKS SECTION (NORMAL & PROFESSIONAL WHITE THEME) */}
      {/* ========================================================================= */}
      {/* ========================================================================= */}
      {/* 5. HOW IT WORKS SECTION (DARK TRADING DESK WORKFLOW) */}
      {/* ========================================================================= */}
      <div 
        id="how-it-works-section"
        className="trading-panel-card"
        style={{
          marginTop: '48px',
          padding: '32px 28px',
          background: '#0D1117'
        }}
      >
        <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 32px auto' }}>
          <span className="badge font-mono-numbers" style={{ fontSize: '0.68rem', padding: '3px 10px', background: 'rgba(245, 158, 11, 0.12)', color: '#F59E0B', border: '1px solid rgba(245, 158, 11, 0.25)', marginBottom: '8px' }}>
            EXECUTION WORKFLOW
          </span>
          <h3 style={{ fontSize: '1.65rem', fontWeight: '800', color: '#F0F6FC', margin: '6px 0 8px 0', letterSpacing: '-0.02em' }}>
            Straightforward Business Capital Allocation
          </h3>
          <p style={{ color: '#8B949E', fontSize: '0.88rem', margin: 0 }}>
            Four simple steps to back verified local enterprises with complete escrow protection and clear yield terms.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
          <div style={{ background: '#161B22', padding: '20px', borderRadius: '14px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
            <div className="font-mono-numbers" style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(245, 158, 11, 0.15)', color: '#F59E0B', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900', marginBottom: '12px' }}>
              01
            </div>
            <h4 style={{ color: '#F0F6FC', fontSize: '0.96rem', margin: '0 0 6px 0', fontWeight: '700' }}>Choose Venture</h4>
            <p style={{ color: '#8B949E', fontSize: '0.80rem', margin: 0, lineHeight: '1.5' }}>
              Select a verified venture based on unit economics, operational timeline, and targeted term yields.
            </p>
          </div>

          <div style={{ background: '#161B22', padding: '20px', borderRadius: '14px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
            <div className="font-mono-numbers" style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(56, 189, 248, 0.15)', color: '#38BDF8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900', marginBottom: '12px' }}>
              02
            </div>
            <h4 style={{ color: '#F0F6FC', fontSize: '0.96rem', margin: '0 0 6px 0', fontWeight: '700' }}>Review All Costs</h4>
            <p style={{ color: '#8B949E', fontSize: '0.80rem', margin: 0, lineHeight: '1.5' }}>
              Inspect where every rupee is spent across materials, labour, packaging, delivery, and marketing.
            </p>
          </div>

          <div style={{ background: '#161B22', padding: '20px', borderRadius: '14px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
            <div className="font-mono-numbers" style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(0, 245, 155, 0.15)', color: '#00F59B', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900', marginBottom: '12px' }}>
              03
            </div>
            <h4 style={{ color: '#F0F6FC', fontSize: '0.96rem', margin: '0 0 6px 0', fontWeight: '700' }}>Instant UPI Clearing</h4>
            <p style={{ color: '#8B949E', fontSize: '0.80rem', margin: 0, lineHeight: '1.5' }}>
              Scan QR to pay UPI ID <strong style={{ color: '#00F59B' }}>8248651695-3@ybl</strong>, enter your UTR number, and upload screenshot.
            </p>
          </div>

          <div style={{ background: '#161B22', padding: '20px', borderRadius: '14px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
            <div className="font-mono-numbers" style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(168, 85, 247, 0.15)', color: '#A855F7', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900', marginBottom: '12px' }}>
              04
            </div>
            <h4 style={{ color: '#F0F6FC', fontSize: '0.96rem', margin: '0 0 6px 0', fontWeight: '700' }}>Escrow Audit & Cert</h4>
            <p style={{ color: '#8B949E', fontSize: '0.80rem', margin: 0, lineHeight: '1.5' }}>
              Admin verifies the payment against bank escrow rails, approves allocation, and issues your certificate.
            </p>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 6. INVESTOR PROTECTION & ESCROW ASSURANCE */}
      {/* ========================================================================= */}
      <div 
        id="investor-protection-section"
        className="trading-panel-card"
        style={{
          marginTop: '32px',
          background: '#0D1117',
          padding: '28px 32px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '24px'
        }}
      >
        <div style={{ maxWidth: '720px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <ShieldCheck size={22} className="text-emerald-400" />
            <h3 style={{ fontSize: '1.30rem', fontWeight: '800', color: '#F0F6FC', margin: 0 }}>
              Royal Bank of Investment Institutional Escrow Ring-Fence
            </h3>
          </div>
          <p style={{ color: '#8B949E', fontSize: '0.86rem', margin: 0, lineHeight: '1.6' }}>
            All investor funds are held in segregated, audited escrow accounts. Capital is disbursed in strict tranches only upon verified milestone completion. In the event a project does not meet targets, 100% of unspent funds are returned to backers.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button 
            type="button"
            onClick={() => window.print()}
            className="btn-secondary-trading"
            style={{ padding: '8px 14px', fontSize: '0.80rem', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}
          >
            <Printer size={14} /> <span>Print Due Diligence</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 7. MY INVESTMENTS & DIGITAL CERTIFICATES */}
      {/* ========================================================================= */}
      <div 
        id="my-investments-section"
        className="trading-panel-card"
        style={{
          marginTop: '32px',
          background: '#0D1117',
          padding: '28px'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '24px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Layers size={20} className="text-amber-400" />
              <h3 style={{ fontSize: '1.30rem', fontWeight: '800', color: '#F0F6FC', margin: 0 }}>
                My Portfolio & Investment Certificates
              </h3>
            </div>
            <p style={{ color: '#8B949E', fontSize: '0.84rem', margin: '4px 0 0 0' }}>
              View your registered business allocations, payment confirmation references, and instant printable certificates.
            </p>
          </div>
          <span className="badge font-mono-numbers" style={{ fontSize: '0.72rem', padding: '4px 10px', background: 'rgba(245, 158, 11, 0.15)', color: '#F59E0B', border: '1px solid rgba(245, 158, 11, 0.3)' }}>
            {projectInvestments?.length || 0} Total Allocations
          </span>
        </div>

        {projectInvestments && projectInvestments.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
            {projectInvestments.map((inv) => (
              <div 
                key={inv.id}
                style={{
                  background: '#161B22',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '14px',
                  padding: '18px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <span className="badge font-mono-numbers" style={{ fontSize: '0.64rem', marginBottom: '4px', background: 'rgba(245, 158, 11, 0.12)', color: '#F59E0B', border: '1px solid rgba(245, 158, 11, 0.25)' }}>
                      {inv.category || 'Business Venture'}
                    </span>
                    <h4 style={{ fontSize: '1.05rem', fontWeight: '800', color: '#F0F6FC', margin: '4px 0 0 0' }}>
                      {inv.projectName}
                    </h4>
                  </div>
                  
                  {/* Status Badge */}
                  {inv.status === 'CONFIRMED' ? (
                    <span className="badge font-mono-numbers" style={{ fontSize: '0.68rem', background: 'rgba(0, 245, 155, 0.15)', color: '#00F59B', border: '1px solid rgba(0, 245, 155, 0.3)' }}>
                      ✓ Verified & Allocated
                    </span>
                  ) : inv.status === 'REJECTED' ? (
                    <span className="badge font-mono-numbers" style={{ fontSize: '0.68rem', background: 'rgba(255, 51, 102, 0.15)', color: '#FF3366', border: '1px solid rgba(255, 51, 102, 0.3)' }}>
                      ✕ Rejected
                    </span>
                  ) : (
                    <span className="badge font-mono-numbers" style={{ fontSize: '0.68rem', background: 'rgba(245, 158, 11, 0.15)', color: '#F59E0B', border: '1px solid rgba(245, 158, 11, 0.3)' }}>
                      ⏳ Awaiting Admin Approval
                    </span>
                  )}
                </div>

                <div className="font-mono-numbers" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', padding: '12px', background: '#0D1117', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '10px' }}>
                  <div>
                    <div style={{ fontSize: '0.68rem', color: '#8B949E' }}>Invested Capital</div>
                    <div style={{ fontSize: '1.05rem', fontWeight: '800', color: '#00F59B' }}>{formatMoney(inv.amount)}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.68rem', color: '#8B949E' }}>Target Yield</div>
                    <div style={{ fontSize: '0.95rem', fontWeight: '700', color: '#F59E0B' }}>{inv.expectedYield || '14.5%'}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.68rem', color: '#8B949E' }}>Payout Timeline</div>
                    <div style={{ fontSize: '0.80rem', color: '#C9D1D9', fontWeight: '600' }}>{inv.payoutTimeline || 'Sprint End'}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.68rem', color: '#8B949E' }}>Ref ID</div>
                    <div style={{ fontSize: '0.72rem', color: '#6E7681' }}>{inv.id}</div>
                  </div>
                </div>

                {/* Attached Screenshot or UTR info */}
                {(inv.utrNumber || inv.screenshotUrl) && (
                  <div style={{ fontSize: '0.74rem', background: '#0D1117', padding: '8px 10px', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                    {inv.utrNumber && <div><span style={{ color: '#8B949E' }}>UTR:</span> <strong className="font-mono-numbers" style={{ color: '#F0F6FC' }}>{inv.utrNumber}</strong></div>}
                    {inv.screenshotUrl && (
                      <button
                        type="button"
                        onClick={() => setPreviewScreenshotUrl(inv.screenshotUrl)}
                        style={{ background: 'none', border: 'none', color: '#38BDF8', cursor: 'pointer', padding: 0, fontWeight: '700', fontSize: '0.72rem', marginTop: '4px' }}
                      >
                        👁 View Attached Payment Screenshot
                      </button>
                    )}
                  </div>
                )}

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
                  <span className="font-mono-numbers" style={{ fontSize: '0.70rem', color: '#8B949E' }}>Submitted: {inv.date}</span>
                  {inv.status === 'CONFIRMED' ? (
                    <button
                      type="button"
                      onClick={() => setActiveCertificate(inv)}
                      className="btn-secondary-trading"
                      style={{ padding: '6px 12px', borderRadius: '8px', fontSize: '0.74rem', gap: '5px', cursor: 'pointer' }}
                    >
                      <FileText size={13} style={{ color: '#F59E0B' }} />
                      <span>View Certificate</span>
                    </button>
                  ) : (
                    <span style={{ fontSize: '0.70rem', color: '#F59E0B', fontWeight: '600' }}>
                      Admin verification in progress
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '40px 20px', background: '#161B22', borderRadius: '14px', border: '1px dashed rgba(255, 255, 255, 0.12)' }}>
            <Building2 size={36} style={{ color: '#6E7681', margin: '0 auto 12px auto' }} />
            <h4 style={{ color: '#F0F6FC', fontSize: '1rem', margin: '0 0 6px 0', fontWeight: '700' }}>No Active Investments Yet</h4>
            <p style={{ color: '#8B949E', fontSize: '0.84rem', margin: '0 0 16px 0', maxWidth: '480px', marginInline: 'auto' }}>
              Select any of the 4 verified business projects above and click <strong style={{ color: '#00F59B' }}>"Execute Backing Order"</strong> to fund and receive your official digital allocation certificate.
            </p>
            <button
              onClick={() => {
                const el = document.getElementById('projects-grid');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="btn-order-cta"
              style={{ padding: '8px 16px', fontSize: '0.82rem' }}
            >
              Browse Active Business Deals
            </button>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* MODAL 1: DIRECT "INVEST IN THIS BUSINESS" MODAL (WITH SCREENSHOT & UTR) */}
      {/* ========================================================================= */}
      {investingProject && (() => {
        const fin = calculateProjectFinancials(investingProject);
        const dynamicReturn = calculateInvestmentReturn(investingProject, investmentAmount);
        const officialUpi = "8248651695-3@ybl";
        const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(`upi://pay?pa=${officialUpi}&pn=RoyalBankOfInvestment&am=${investmentAmount}&cu=INR`)}`;

        return (
          <div className="modal-overlay" onClick={() => setInvestingProject(null)}>
            <div 
              className="modal-content" 
              onClick={(e) => e.stopPropagation()}
              style={{ maxWidth: '560px', width: '100%', padding: '28px', borderRadius: '20px' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                <div>
                  <div style={{ fontSize: '0.74rem', fontWeight: '700', color: '#059669', textTransform: 'uppercase' }}>
                    Capital Allocation Desk
                  </div>
                  <h3 style={{ fontSize: '1.35rem', color: '#0f172a', margin: '3px 0', fontWeight: '800' }}>
                    Invest in {investingProject.name}
                  </h3>
                  <div style={{ fontSize: '0.78rem', color: '#64748b' }}>
                    Yield: <strong style={{ color: '#d97706' }}>{dynamicReturn.yieldPercent}</strong> • Payback: {dynamicReturn.days}
                  </div>
                </div>
                <button onClick={() => setInvestingProject(null)} className="btn btn-ghost btn-sm" style={{ padding: '4px' }}>
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleConfirmInvestment} style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxHeight: '75vh', overflowY: 'auto', paddingRight: '4px' }}>
                
                {/* Amount Selector */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: '#0f172a', fontWeight: '700', marginBottom: '6px' }}>
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
                          border: investmentAmount === preset.toString() ? '1px solid #d97706' : '1px solid #e2e8f0',
                          background: investmentAmount === preset.toString() ? '#fef3c7' : '#f8fafc',
                          color: investmentAmount === preset.toString() ? '#92400e' : '#475569',
                          cursor: 'pointer'
                        }}
                      >
                        {formatMoney(preset)}
                      </button>
                    ))}
                  </div>

                  {/* Custom Input */}
                  <div style={{ position: 'relative' }}>
                    <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#d97706', fontWeight: '800' }}>₹</span>
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
                        border: '1px solid #cbd5e1',
                        background: '#ffffff',
                        color: '#0f172a',
                        fontSize: '1rem',
                        fontWeight: '700',
                        outline: 'none'
                      }}
                    />
                  </div>
                </div>

                {/* Dynamic Return Breakdown Box (Explicit Return Calculation for Amount) */}
                <div style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', borderRadius: '12px', padding: '12px 16px' }}>
                  <div style={{ fontSize: '0.74rem', fontWeight: '700', color: '#065f46', textTransform: 'uppercase', marginBottom: '4px' }}>
                    Expected Return Breakdown ({dynamicReturn.days})
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                    <div>
                      <span style={{ fontSize: '0.78rem', color: '#065f46' }}>You Invest:</span>
                      <div style={{ fontSize: '1rem', fontWeight: '800', color: '#0f172a' }}>₹{dynamicReturn.invested}</div>
                    </div>
                    <div>
                      <span style={{ fontSize: '0.78rem', color: '#065f46' }}>Net Profit (+{dynamicReturn.yieldPercent}):</span>
                      <div style={{ fontSize: '1rem', fontWeight: '800', color: '#d97706' }}>+₹{dynamicReturn.profit}</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{ fontSize: '0.78rem', color: '#065f46' }}>Total Payout:</span>
                      <div style={{ fontSize: '1.2rem', fontWeight: '900', color: '#065f46' }}>₹{dynamicReturn.totalReturn}</div>
                    </div>
                  </div>
                </div>

                {/* Official UPI Payment Details Box */}
                <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: '12px', padding: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <QrCode size={18} className="text-amber-500" />
                      <strong style={{ fontSize: '0.86rem', color: '#92400e' }}>Pay via UPI ID:</strong>
                    </div>
                    <button 
                      type="button" 
                      onClick={() => copyToClipboard(officialUpi, setCopiedUpi)}
                      className="btn btn-secondary btn-sm" 
                      style={{ padding: '3px 8px', fontSize: '0.72rem', color: copiedUpi ? '#059669' : '#d97706', gap: '4px' }}
                    >
                      <Copy size={12} />
                      {copiedUpi ? 'Copied' : 'Copy UPI'}
                    </button>
                  </div>

                  <div style={{ background: '#ffffff', border: '1px solid #fde68a', borderRadius: '8px', padding: '8px 12px', fontSize: '1.05rem', fontWeight: '900', color: '#0f172a', fontFamily: 'monospace', letterSpacing: '0.02em', textAlign: 'center' }}>
                    {officialUpi}
                  </div>

                  {/* QR Code Display */}
                  <div style={{ textAlign: 'center', marginTop: '12px' }}>
                    <img 
                      src={qrUrl} 
                      alt="UPI QR Code" 
                      style={{ width: '150px', height: '150px', borderRadius: '10px', border: '2px solid #e2e8f0', margin: '0 auto', display: 'block', background: '#fff' }}
                    />
                    <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '6px' }}>
                      Scan using Google Pay, PhonePe, Paytm, or BHIM UPI app
                    </div>
                  </div>
                </div>

                {/* Investor Details */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.76rem', color: '#64748b', marginBottom: '4px', fontWeight: '600' }}>
                      Investor Full Name: *
                    </label>
                    <input 
                      type="text"
                      placeholder="e.g. Ramesh Kumar"
                      value={investorName}
                      onChange={(e) => setInvestorName(e.target.value)}
                      required
                      style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#ffffff', color: '#0f172a', fontSize: '0.85rem' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.76rem', color: '#64748b', marginBottom: '4px', fontWeight: '600' }}>
                      WhatsApp / Phone: *
                    </label>
                    <input 
                      type="tel"
                      placeholder="+91 98400 12345"
                      value={investorPhone}
                      onChange={(e) => setInvestorPhone(e.target.value)}
                      required
                      style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#ffffff', color: '#0f172a', fontSize: '0.85rem' }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.76rem', color: '#64748b', marginBottom: '4px', fontWeight: '600' }}>
                    Email Address (for Digital Certificate):
                  </label>
                  <input 
                    type="email"
                    placeholder="investor@example.com"
                    value={investorEmail}
                    onChange={(e) => setInvestorEmail(e.target.value)}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#ffffff', color: '#0f172a', fontSize: '0.85rem' }}
                  />
                </div>

                {/* UTR / UPI Transaction Reference Input */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', color: '#0f172a', marginBottom: '4px', fontWeight: '700' }}>
                    UPI Reference / UTR Number (12 Digits): *
                  </label>
                  <input 
                    type="text"
                    placeholder="e.g. 428901238475"
                    value={investorUtr}
                    onChange={(e) => setInvestorUtr(e.target.value)}
                    required
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#ffffff', color: '#0f172a', fontSize: '0.88rem', fontFamily: 'monospace' }}
                  />
                  <span style={{ fontSize: '0.68rem', color: '#64748b' }}>Found in your GPay / PhonePe / Paytm transaction receipt.</span>
                </div>

                {/* Payment Screenshot Upload */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', color: '#0f172a', marginBottom: '4px', fontWeight: '700' }}>
                    Attach Payment Screenshot: *
                  </label>
                  <div style={{ border: '2px dashed #cbd5e1', borderRadius: '10px', padding: '14px', textAlign: 'center', background: '#f8fafc' }}>
                    <input 
                      type="file"
                      accept="image/*"
                      id="screenshot-file-input"
                      onChange={handleScreenshotChange}
                      style={{ display: 'none' }}
                      required={!screenshotPreview}
                    />
                    <label 
                      htmlFor="screenshot-file-input"
                      style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', cursor: 'pointer', color: '#0284c7', fontWeight: '700', fontSize: '0.82rem' }}
                    >
                      <Upload size={16} />
                      {screenshotPreview ? 'Change Screenshot' : 'Upload Payment Screenshot (PNG/JPG)'}
                    </label>

                    {screenshotPreview && (
                      <div style={{ marginTop: '10px', position: 'relative', display: 'inline-block' }}>
                        <img 
                          src={screenshotPreview} 
                          alt="Screenshot Preview" 
                          style={{ maxWidth: '180px', maxHeight: '120px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                        />
                        <button
                          type="button"
                          onClick={() => setScreenshotPreview('')}
                          style={{ position: 'absolute', top: '-6px', right: '-6px', background: '#e11d48', color: '#fff', border: 'none', borderRadius: '50%', width: '20px', height: '20px', cursor: 'pointer', fontSize: '10px' }}
                        >
                          ✕
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Submit Action Button */}
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
                  <Send size={18} />
                  <span>Submit Payment Proof for Admin Approval</span>
                </button>

                <div style={{ textAlign: 'center', fontSize: '0.72rem', color: '#64748b' }}>
                  🔒 Admin verifies UTR against bank escrow ledger before confirming certificate.
                </div>

              </form>
            </div>
          </div>
        );
      })()}

      {/* ========================================================================= */}
      {/* MODAL 2: SUBMISSION ACKNOWLEDGMENT (AWAITING ADMIN APPROVAL) */}
      {/* ========================================================================= */}
      {submissionSuccessModal && (
        <div className="modal-overlay" onClick={() => setSubmissionSuccessModal(null)}>
          <div 
            className="modal-content" 
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: '500px', width: '100%', padding: '32px', borderRadius: '20px', textAlign: 'center' }}
          >
            <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: '#fef3c7', color: '#92400e', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px auto' }}>
              <Clock size={28} />
            </div>

            <h3 style={{ fontSize: '1.4rem', fontWeight: '900', color: '#0f172a', margin: '0 0 8px 0' }}>
              Payment Proof Submitted!
            </h3>
            <p style={{ color: '#475569', fontSize: '0.88rem', lineHeight: '1.5', margin: '0 0 20px 0' }}>
              Your investment request for <strong>{submissionSuccessModal.projectName}</strong> has been logged.
            </p>

            <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '16px', textAlign: 'left', marginBottom: '20px', fontSize: '0.82rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span style={{ color: '#64748b' }}>Reference ID:</span>
                <strong style={{ color: '#0f172a', fontFamily: 'monospace' }}>{submissionSuccessModal.id}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span style={{ color: '#64748b' }}>Amount Submitted:</span>
                <strong style={{ color: '#059669', fontSize: '0.95rem' }}>{formatMoney(submissionSuccessModal.amount)}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span style={{ color: '#64748b' }}>UTR / Ref No:</span>
                <strong style={{ color: '#0f172a', fontFamily: 'monospace' }}>{submissionSuccessModal.utrNumber || 'Attached Screenshot'}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748b' }}>Escrow Status:</span>
                <span className="badge badge-gold" style={{ fontSize: '0.65rem' }}>
                  ⏳ Awaiting Admin Approval
                </span>
              </div>
            </div>

            <p style={{ fontSize: '0.78rem', color: '#64748b', lineHeight: '1.45', margin: '0 0 20px 0' }}>
              Admin is currently verifying the UTR with the escrow bank. Once approved, your official digital allocation certificate will be unlocked in <strong>"My Investments"</strong>.
            </p>

            <button
              onClick={() => setSubmissionSuccessModal(null)}
              className="btn btn-primary"
              style={{ width: '100%', borderRadius: '10px', fontWeight: '700' }}
            >
              Done & Return to Projects
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 3: ADMIN APPROVAL DESK (APPROVE / REJECT SUBMISSIONS) */}
      {/* ========================================================================= */}
      {isAdminLoggedIn && isAdminApprovalModalOpen && (
        <div className="modal-overlay" onClick={() => setIsAdminApprovalModalOpen(false)}>
          <div 
            className="modal-content" 
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: '780px', width: '100%', padding: '28px', borderRadius: '20px' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', borderBottom: '1px solid #e2e8f0', paddingBottom: '14px' }}>
              <div>
                <div style={{ fontSize: '0.74rem', fontWeight: '700', color: '#d97706', textTransform: 'uppercase' }}>
                  Administrative Desk
                </div>
                <h3 style={{ fontSize: '1.35rem', color: '#0f172a', margin: '2px 0', fontWeight: '800' }}>
                  Pending Investment Approvals ({pendingInvestments.length})
                </h3>
              </div>
              <button onClick={() => setIsAdminApprovalModalOpen(false)} className="btn btn-ghost btn-sm" style={{ padding: '4px' }}>
                <X size={18} />
              </button>
            </div>

            <div style={{ maxHeight: '70vh', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '14px', paddingRight: '4px' }}>
              {pendingInvestments.length > 0 ? (
                pendingInvestments.map((inv) => (
                  <div 
                    key={inv.id}
                    style={{
                      background: '#f8fafc',
                      border: '1px solid #e2e8f0',
                      borderRadius: '14px',
                      padding: '18px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '12px'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                        <span className="badge badge-gold" style={{ fontSize: '0.65rem', marginBottom: '4px' }}>
                          Ref: {inv.id}
                        </span>
                        <h4 style={{ fontSize: '1.15rem', fontWeight: '800', color: '#0f172a', margin: '2px 0' }}>
                          {inv.projectName}
                        </h4>
                        <div style={{ fontSize: '0.78rem', color: '#64748b' }}>
                          Investor: <strong style={{ color: '#0f172a' }}>{inv.investorName}</strong> • Phone: {inv.phone || 'N/A'} • Email: {inv.email || 'N/A'}
                        </div>
                      </div>

                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '1.25rem', fontWeight: '900', color: '#059669' }}>
                          {formatMoney(inv.amount)}
                        </div>
                        <span style={{ fontSize: '0.72rem', color: '#64748b' }}>via {inv.paymentMethod}</span>
                      </div>
                    </div>

                    {/* UTR & Screenshot row */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#ffffff', padding: '10px 14px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                      <div>
                        <span style={{ fontSize: '0.72rem', color: '#64748b' }}>UTR / Reference:</span>
                        <div style={{ fontSize: '0.9rem', fontWeight: '800', color: '#0f172a', fontFamily: 'monospace' }}>
                          {inv.utrNumber || 'N/A'}
                        </div>
                      </div>

                      {inv.screenshotUrl && (
                        <button
                          type="button"
                          onClick={() => setPreviewScreenshotUrl(inv.screenshotUrl)}
                          className="btn btn-secondary btn-sm"
                          style={{ fontSize: '0.75rem', gap: '5px' }}
                        >
                          <Eye size={13} className="text-sky-500" />
                          <span>View Screenshot Proof</span>
                        </button>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', paddingTop: '8px', borderTop: '1px dashed #e2e8f0' }}>
                      <button
                        type="button"
                        onClick={() => rejectBusinessInvestment(inv.id, "Payment verification unconfirmed")}
                        className="btn btn-ghost btn-sm"
                        style={{ color: '#e11d48', fontWeight: '700', fontSize: '0.8rem' }}
                      >
                        ✕ Reject
                      </button>
                      <button
                        type="button"
                        onClick={() => approveBusinessInvestment(inv.id)}
                        className="btn btn-primary btn-sm"
                        style={{ fontWeight: '700', fontSize: '0.82rem', gap: '6px' }}
                      >
                        <CheckCircle2 size={15} />
                        <span>✓ Approve & Issue Allocation Certificate</span>
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div style={{ textAlign: 'center', padding: '40px', background: '#f8fafc', borderRadius: '14px', border: '1px dashed #cbd5e1' }}>
                  <CheckCircle size={36} style={{ color: '#059669', margin: '0 auto 10px auto' }} />
                  <h4 style={{ color: '#0f172a', fontSize: '1rem', margin: '0 0 4px 0', fontWeight: '700' }}>
                    All Submissions Cleared
                  </h4>
                  <p style={{ color: '#64748b', fontSize: '0.82rem', margin: 0 }}>
                    There are no pending investments waiting for admin approval right now.
                  </p>
                </div>
              )}
            </div>

            <div style={{ marginTop: '16px', paddingTop: '12px', borderTop: '1px solid #e2e8f0', textAlign: 'right' }}>
              <button 
                type="button" 
                onClick={() => setIsAdminApprovalModalOpen(false)}
                className="btn btn-secondary btn-sm"
                style={{ borderRadius: '8px' }}
              >
                Close Desk
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 4: SCREENSHOT PREVIEW MODAL */}
      {/* ========================================================================= */}
      {previewScreenshotUrl && (
        <div className="modal-overlay" onClick={() => setPreviewScreenshotUrl(null)}>
          <div 
            className="modal-content" 
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: '540px', width: '100%', padding: '24px', borderRadius: '16px', textAlign: 'center' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <h4 style={{ margin: 0, color: '#0f172a', fontWeight: '800' }}>Payment Screenshot Proof</h4>
              <button onClick={() => setPreviewScreenshotUrl(null)} className="btn btn-ghost btn-sm" style={{ padding: '4px' }}>
                <X size={18} />
              </button>
            </div>
            <img 
              src={previewScreenshotUrl} 
              alt="Payment Proof" 
              style={{ width: '100%', maxHeight: '70vh', objectFit: 'contain', borderRadius: '10px', border: '1px solid #e2e8f0' }}
            />
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 5: DETAILED OVERVIEW ABOUT INVESTMENTS (INVESTMENT MEMO & TERMS) */}
      {/* ========================================================================= */}
      {detailedOverviewProject && (() => {
        const fin = calculateProjectFinancials(detailedOverviewProject);
        return (
          <div className="modal-overlay" onClick={() => setDetailedOverviewProject(null)}>
            <div 
              className="modal-content" 
              onClick={(e) => e.stopPropagation()}
              style={{ maxWidth: '640px', width: '100%', padding: '32px', borderRadius: '20px' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px', borderBottom: '1px solid #e2e8f0', paddingBottom: '16px' }}>
                <div>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#fef3c7', padding: '3px 8px', borderRadius: '6px', fontSize: '0.7rem', fontWeight: '700', color: '#92400e', marginBottom: '6px' }}>
                    <ShieldCheck size={13} /> VERIFIED VENTURE DEAL MEMO
                  </div>
                  <h3 style={{ fontSize: '1.45rem', color: '#0f172a', margin: '2px 0', fontWeight: '900' }}>
                    {detailedOverviewProject.name} — Investment Overview
                  </h3>
                  <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
                    Industry: <strong>{detailedOverviewProject.category}</strong> • Status: <strong>{detailedOverviewProject.status}</strong>
                  </div>
                </div>
                <button onClick={() => setDetailedOverviewProject(null)} className="btn btn-ghost btn-sm" style={{ padding: '4px' }}>
                  <X size={20} />
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxHeight: '70vh', overflowY: 'auto', paddingRight: '4px' }}>
                
                {/* 1. Executive Summary */}
                <div>
                  <h4 style={{ fontSize: '0.92rem', fontWeight: '800', color: '#0f172a', marginBottom: '6px' }}>
                    1. Commercial Model & Purpose
                  </h4>
                  <p style={{ fontSize: '0.84rem', color: '#475569', lineHeight: '1.6', margin: 0 }}>
                    {detailedOverviewProject.description} This capital allocation covers immediate inventory purchasing, precision fabrication, local acquisition marketing, and working capital buffers to fulfill order quotas.
                  </p>
                </div>

                {/* 2. Key Investment Terms & Yields */}
                <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                  <h4 style={{ fontSize: '0.92rem', fontWeight: '800', color: '#0f172a', marginBottom: '12px' }}>
                    2. Investment Terms & Financial Structure
                  </h4>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '0.82rem' }}>
                    <div>
                      <span style={{ color: '#64748b' }}>Target Capital:</span>
                      <div style={{ fontWeight: '800', color: '#0f172a' }}>{formatMoney(fin.capitalRequested)}</div>
                    </div>
                    <div>
                      <span style={{ color: '#64748b' }}>Minimum Ticket:</span>
                      <div style={{ fontWeight: '800', color: '#0f172a' }}>{formatMoney(fin.minInvestment)}</div>
                    </div>
                    <div>
                      <span style={{ color: '#64748b' }}>Expected Net Yield:</span>
                      <div style={{ fontWeight: '800', color: '#059669', fontSize: '0.95rem' }}>{fin.expectedTermYield}</div>
                    </div>
                    <div>
                      <span style={{ color: '#64748b' }}>Settlement Timeline:</span>
                      <div style={{ fontWeight: '800', color: '#d97706' }}>{fin.payoutTimeline}</div>
                    </div>
                  </div>
                </div>

                {/* 3. Detailed Expense Itemization */}
                <div>
                  <h4 style={{ fontSize: '0.92rem', fontWeight: '800', color: '#0f172a', marginBottom: '8px' }}>
                    3. Itemized Budget Allocation (Where Money Is Spent)
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {(detailedOverviewProject.expenseBreakdown || []).map((exp, idx) => (
                      <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '0.8rem' }}>
                        <div>
                          <span style={{ fontWeight: '600', color: '#0f172a' }}>{exp.item}</span>
                          <span style={{ fontSize: '0.72rem', color: '#64748b', display: 'block' }}>{exp.category}</span>
                        </div>
                        <strong style={{ color: '#d97706', fontSize: '0.9rem' }}>{formatMoney(exp.amount)}</strong>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 4. Milestone Escrow Release Schedule */}
                <div>
                  <h4 style={{ fontSize: '0.92rem', fontWeight: '800', color: '#0f172a', marginBottom: '8px' }}>
                    4. Milestone Escrow Release Tranches
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {(detailedOverviewProject.timeline || []).map((m, idx) => (
                      <div key={m.id || idx} style={{ padding: '10px 14px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', fontSize: '0.78rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px', marginBottom: '4px' }}>
                          <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                              <span style={{ fontSize: '0.65rem', fontWeight: '800', color: '#64748b' }}>
                                Step {m.stepNumber || idx + 1}/{m.stepTotal || (detailedOverviewProject.timeline?.length || 5)}:
                              </span>
                              <span style={{ color: '#0f172a', fontWeight: '700' }}>{m.phase}</span>
                            </div>
                            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', marginTop: '3px', background: '#fef3c7', color: '#92400e', padding: '2px 8px', borderRadius: '6px', fontSize: '0.68rem', fontWeight: '700', border: '1px solid #fde68a' }}>
                              <Clock size={12} strokeWidth={2.4} />
                              <span>Sprint: {m.sprintDuration || m.period}</span>
                            </div>
                          </div>
                          <span className={`badge ${m.status === 'COMPLETED' ? 'badge-emerald' : m.status === 'IN_PROGRESS' ? 'badge-cyan' : 'badge-gold'}`} style={{ fontSize: '0.65rem', padding: '2px 8px' }}>
                            {m.status}
                          </span>
                        </div>
                        <div style={{ color: '#475569', marginTop: '4px', lineHeight: '1.4' }}>{m.deliverables}</div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#64748b', fontSize: '0.72rem', marginTop: '6px', paddingTop: '4px', borderTop: '1px dashed #e2e8f0' }}>
                          <span>Dates: <strong style={{ color: '#334155' }}>{m.period}</strong></span>
                          <span>Budget: <strong style={{ color: '#334155' }}>{formatMoney(m.allocatedBudget)}</strong> • Spent: <strong style={{ color: '#334155' }}>{formatMoney(m.spent)}</strong></span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 5. Escrow Safeguard & Guarantees */}
                <div style={{ background: '#ecfdf5', padding: '14px', borderRadius: '10px', border: '1px solid #a7f3d0' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#065f46', fontWeight: '800', fontSize: '0.84rem', marginBottom: '4px' }}>
                    <ShieldCheck size={16} /> Investor Capital Ring-Fence Guarantee
                  </div>
                  <p style={{ color: '#065f46', fontSize: '0.78rem', margin: 0, lineHeight: '1.5' }}>
                    Investor contributions are deposited directly into a segregated commercial escrow facility. Tranche payouts to operations require verified physical receipts and courier consignment notes. If a sprint fails to initiate, 100% of unspent funds are returned to backer accounts.
                  </p>
                </div>

              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '10px', marginTop: '24px', paddingTop: '16px', borderTop: '1px solid #e2e8f0' }}>
                <button 
                  type="button" 
                  onClick={() => setDetailedOverviewProject(null)}
                  className="btn btn-secondary"
                  style={{ flex: 1, borderRadius: '10px' }}
                >
                  Close Overview
                </button>
                <button 
                  type="button" 
                  onClick={() => {
                    const target = detailedOverviewProject;
                    setDetailedOverviewProject(null);
                    handleOpenInvest(target);
                  }}
                  className="btn btn-primary"
                  style={{ flex: 1.5, borderRadius: '10px' }}
                >
                  <Building2 size={16} />
                  <span>Invest in this Business</span>
                </button>
              </div>

            </div>
          </div>
        );
      })()}

      {/* ========================================================================= */}
      {/* MODAL 6: ADMIN MILESTONE & LIVE OPERATIONS MANAGER */}
      {/* ========================================================================= */}
      {isAdminLoggedIn && adminMilestoneProject && (() => {
        const liveAdminProject = businessProjects.find(p => p.id === adminMilestoneProject.id) || adminMilestoneProject;
        return (
          <div className="modal-overlay" onClick={() => setAdminMilestoneProject(null)}>
            <div 
              className="modal-content" 
              onClick={(e) => e.stopPropagation()}
              style={{ maxWidth: '680px', width: '100%', padding: '28px', borderRadius: '20px' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '18px', borderBottom: '1px solid #e2e8f0', paddingBottom: '14px' }}>
                <div>
                  <div style={{ fontSize: '0.74rem', fontWeight: '700', color: '#d97706', textTransform: 'uppercase' }}>
                    Admin Operations Desk
                  </div>
                  <h3 style={{ fontSize: '1.35rem', color: '#0f172a', margin: '2px 0', fontWeight: '800' }}>
                    Manage Milestones: {liveAdminProject.name}
                  </h3>
                  <div style={{ fontSize: '0.78rem', color: '#64748b' }}>
                    Update live progress, release milestone escrow tranches, and post live operational updates.
                  </div>
                </div>
              <button onClick={() => setAdminMilestoneProject(null)} className="btn btn-ghost btn-sm" style={{ padding: '4px' }}>
                <X size={18} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxHeight: '72vh', overflowY: 'auto', paddingRight: '4px' }}>
              
              {/* 1. Existing Milestones List */}
              <div>
                <h4 style={{ fontSize: '0.9rem', fontWeight: '800', color: '#0f172a', marginBottom: '8px' }}>
                  Current Project Milestones ({liveAdminProject.timeline?.length || 0})
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {(liveAdminProject.timeline || []).map((m) => (
                    <div key={m.id} style={{ padding: '12px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px' }}>
                      {editingMilestoneId === m.id ? (
                        /* Inline Edit Form */
                        <div style={{ background: '#ffffff', border: '2px solid #3b82f6', borderRadius: '8px', padding: '12px' }}>
                          <div style={{ fontSize: '0.8rem', fontWeight: '800', color: '#1e40af', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <Edit3 size={14} /> Edit Milestone
                          </div>
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '8px' }}>
                            <div>
                              <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: '700', color: '#64748b' }}>Phase:</label>
                              <input 
                                type="text"
                                value={editingMilestoneForm.phase}
                                onChange={(e) => setEditingMilestoneForm({ ...editingMilestoneForm, phase: e.target.value })}
                                style={{ width: '100%', padding: '5px 8px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.78rem' }}
                              />
                            </div>
                            <div>
                              <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: '700', color: '#64748b' }}>Period:</label>
                              <input 
                                type="text"
                                value={editingMilestoneForm.period}
                                onChange={(e) => setEditingMilestoneForm({ ...editingMilestoneForm, period: e.target.value })}
                                style={{ width: '100%', padding: '5px 8px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.78rem' }}
                              />
                            </div>
                            <div>
                              <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: '700', color: '#64748b' }}>Budget (₹):</label>
                              <input 
                                type="number"
                                value={editingMilestoneForm.allocatedBudget}
                                onChange={(e) => setEditingMilestoneForm({ ...editingMilestoneForm, allocatedBudget: e.target.value })}
                                style={{ width: '100%', padding: '5px 8px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.78rem' }}
                              />
                            </div>
                            <div>
                              <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: '700', color: '#64748b' }}>Status:</label>
                              <select
                                value={editingMilestoneForm.status}
                                onChange={(e) => setEditingMilestoneForm({ ...editingMilestoneForm, status: e.target.value })}
                                style={{ width: '100%', padding: '5px 8px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.78rem', background: '#fff' }}
                              >
                                <option value="UPCOMING">UPCOMING</option>
                                <option value="IN_PROGRESS">IN_PROGRESS</option>
                                <option value="COMPLETED">COMPLETED</option>
                              </select>
                            </div>
                          </div>
                          <div style={{ marginBottom: '8px' }}>
                            <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: '700', color: '#64748b' }}>Deliverables:</label>
                            <textarea 
                              rows={2}
                              value={editingMilestoneForm.deliverables}
                              onChange={(e) => setEditingMilestoneForm({ ...editingMilestoneForm, deliverables: e.target.value })}
                              style={{ width: '100%', padding: '5px 8px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.78rem' }}
                            />
                          </div>
                          <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                            <button
                              type="button"
                              onClick={() => setEditingMilestoneId(null)}
                              className="btn btn-secondary btn-sm"
                              style={{ padding: '4px 10px', fontSize: '0.72rem' }}
                            >
                              Cancel
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                updateProjectMilestone(adminMilestoneProject.id, m.id, {
                                  ...editingMilestoneForm,
                                  allocatedBudget: parseFloat(editingMilestoneForm.allocatedBudget) || 0
                                });
                                setEditingMilestoneId(null);
                              }}
                              className="btn btn-primary btn-sm"
                              style={{ padding: '4px 12px', fontSize: '0.72rem', fontWeight: '800' }}
                            >
                              Save
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                              <strong style={{ color: '#0f172a', fontSize: '0.85rem' }}>{m.phase}</strong>
                              <span style={{ fontSize: '0.72rem', color: '#64748b', display: 'block' }}>{m.period} • Budget: {formatMoney(m.allocatedBudget)}</span>
                            </div>
                            <div style={{ display: 'flex', gap: '4px' }}>
                              <button
                                type="button"
                                onClick={() => {
                                  setEditingMilestoneId(m.id);
                                  setEditingMilestoneForm({
                                    phase: m.phase || '',
                                    period: m.period || '',
                                    deliverables: m.deliverables || '',
                                    allocatedBudget: String(m.allocatedBudget || 0),
                                    spent: String(m.spent || 0),
                                    status: m.status || 'UPCOMING'
                                  });
                                }}
                                className="btn btn-ghost btn-sm"
                                style={{ padding: '4px', color: '#0284c7' }}
                                title="Edit Milestone Details"
                              >
                                <Edit3 size={14} />
                              </button>
                              <button
                                type="button"
                                onClick={() => deleteProjectMilestone(adminMilestoneProject.id, m.id)}
                                className="btn btn-ghost btn-sm"
                                style={{ padding: '4px', color: '#e11d48' }}
                                title="Delete Milestone"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </div>
                          <p style={{ fontSize: '0.75rem', color: '#475569', margin: '4px 0 8px 0' }}>{m.deliverables}</p>

                          {/* Status Action Buttons */}
                          <div style={{ display: 'flex', gap: '6px' }}>
                            <button
                              type="button"
                              onClick={() => updateProjectMilestone(adminMilestoneProject.id, m.id, { status: 'COMPLETED' })}
                              style={{
                                padding: '4px 10px',
                                borderRadius: '6px',
                                fontSize: '0.72rem',
                                fontWeight: '700',
                                border: m.status === 'COMPLETED' ? '1px solid #059669' : '1px solid #cbd5e1',
                                background: m.status === 'COMPLETED' ? '#ecfdf5' : '#ffffff',
                                color: m.status === 'COMPLETED' ? '#065f46' : '#475569',
                                cursor: 'pointer'
                              }}
                            >
                              ✓ Mark Completed
                            </button>
                            <button
                              type="button"
                              onClick={() => updateProjectMilestone(adminMilestoneProject.id, m.id, { status: 'IN_PROGRESS' })}
                              style={{
                                padding: '4px 10px',
                                borderRadius: '6px',
                                fontSize: '0.72rem',
                                fontWeight: '700',
                                border: m.status === 'IN_PROGRESS' ? '1px solid #0284c7' : '1px solid #cbd5e1',
                                background: m.status === 'IN_PROGRESS' ? '#f0f9ff' : '#ffffff',
                                color: m.status === 'IN_PROGRESS' ? '#075985' : '#475569',
                                cursor: 'pointer'
                              }}
                            >
                              ▶ In Progress
                            </button>
                            <button
                              type="button"
                              onClick={() => updateProjectMilestone(adminMilestoneProject.id, m.id, { status: 'UPCOMING' })}
                              style={{
                                padding: '4px 10px',
                                borderRadius: '6px',
                                fontSize: '0.72rem',
                                fontWeight: '700',
                                border: m.status === 'UPCOMING' ? '1px solid #d97706' : '1px solid #cbd5e1',
                                background: m.status === 'UPCOMING' ? '#fffbeb' : '#ffffff',
                                color: m.status === 'UPCOMING' ? '#92400e' : '#475569',
                                cursor: 'pointer'
                              }}
                            >
                              Upcoming
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* 2. Add New Milestone Form */}
              <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                <h4 style={{ fontSize: '0.88rem', fontWeight: '800', color: '#0f172a', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Plus size={15} /> Add New Milestone
                </h4>
                <form onSubmit={handleCreateMilestone} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '10px' }}>
                    <input 
                      type="text"
                      placeholder="Phase Title (e.g. Phase 4: Production Run)"
                      value={newMilestonePhase}
                      onChange={(e) => setNewMilestonePhase(e.target.value)}
                      required
                      style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#ffffff', fontSize: '0.82rem', color: '#0f172a' }}
                    />
                    <input 
                      type="text"
                      placeholder="Period (e.g. Oct 20 - 24)"
                      value={newMilestonePeriod}
                      onChange={(e) => setNewMilestonePeriod(e.target.value)}
                      style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#ffffff', fontSize: '0.82rem', color: '#0f172a' }}
                    />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '10px' }}>
                    <input 
                      type="number"
                      placeholder="Budget (₹)"
                      value={newMilestoneBudget}
                      onChange={(e) => setNewMilestoneBudget(e.target.value)}
                      style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#ffffff', fontSize: '0.82rem', color: '#0f172a' }}
                    />
                    <input 
                      type="text"
                      placeholder="Deliverables & expected outcome"
                      value={newMilestoneDeliverables}
                      onChange={(e) => setNewMilestoneDeliverables(e.target.value)}
                      style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#ffffff', fontSize: '0.82rem', color: '#0f172a' }}
                    />
                  </div>
                  <button type="submit" className="btn btn-secondary btn-sm" style={{ alignSelf: 'flex-start', borderRadius: '8px' }}>
                    <Plus size={14} /> Add Milestone to Project
                  </button>
                </form>
              </div>

              {/* 3. Post Live Work Activity Update */}
              <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                <h4 style={{ fontSize: '0.88rem', fontWeight: '800', color: '#0f172a', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Send size={14} /> Post Live Work Update to Investors
                </h4>
                <form onSubmit={handlePostLiveUpdate} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <textarea 
                    rows={2}
                    placeholder="Enter what the team is working on right now (e.g. Received timber batch from sawmill, CNC cutting started)..."
                    value={newLiveUpdateNote}
                    onChange={(e) => setNewLiveUpdateNote(e.target.value)}
                    required
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#ffffff', fontSize: '0.82rem', color: '#0f172a', outline: 'none' }}
                  />
                  <button type="submit" className="btn btn-primary btn-sm" style={{ alignSelf: 'flex-start', borderRadius: '8px' }}>
                    <Send size={13} /> Publish Live Update
                  </button>
                </form>
              </div>

            </div>

            <div style={{ marginTop: '18px', paddingTop: '14px', borderTop: '1px solid #e2e8f0', textAlign: 'right' }}>
              <button 
                type="button" 
                onClick={() => setAdminMilestoneProject(null)}
                className="btn btn-secondary btn-sm"
                style={{ borderRadius: '8px' }}
              >
                Close Admin Desk
              </button>
            </div>
          </div>
        </div>
      );
    })()}

      {/* ========================================================================= */}
      {/* MODAL 7: OFFICIAL DIGITAL INVESTMENT CERTIFICATE (INSTITUTIONAL GRADE) */}
      {/* ========================================================================= */}
      {activeCertificate && (
        <div className="modal-overlay" onClick={() => setActiveCertificate(null)}>
          <div 
            className="modal-content" 
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: '580px', width: '100%', padding: '32px', borderRadius: '20px' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <BadgeCheck size={22} className="text-emerald-500" />
                <h3 style={{ fontSize: '1.25rem', color: '#0f172a', margin: 0, fontWeight: '800' }}>
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
                background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
                border: '2px solid #d97706',
                borderRadius: '16px',
                padding: '24px',
                marginBottom: '20px',
                position: 'relative',
                boxShadow: '0 4px 18px rgba(217, 119, 6, 0.1)'
              }}
            >
              {/* Institutional Header */}
              <div style={{ textAlign: 'center', borderBottom: '1px dashed #cbd5e1', paddingBottom: '16px', marginBottom: '16px' }}>
                <div style={{ fontSize: '0.72rem', color: '#92400e', fontWeight: '800', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                  ROYAL BANK OF INVESTMENT • CENTRAL VAULT ESCROW
                </div>
                <h2 style={{ fontSize: '1.4rem', fontWeight: '900', color: '#0f172a', margin: '4px 0' }}>
                  Certificate of Capital Allocation
                </h2>
                <div style={{ fontSize: '0.75rem', color: '#64748b', fontFamily: 'monospace' }}>
                  Reference No: {activeCertificate.id}
                </div>
              </div>

              {/* Certificate Details */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.85rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#64748b' }}>Registered Investor:</span>
                  <strong style={{ color: '#0f172a' }}>{activeCertificate.investorName}</strong>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#64748b' }}>Business Venture:</span>
                  <strong style={{ color: '#d97706' }}>{activeCertificate.projectName}</strong>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#64748b' }}>Category:</span>
                  <span style={{ color: '#0f172a' }}>{activeCertificate.category}</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 12px', background: '#ecfdf5', borderRadius: '8px', border: '1px solid #a7f3d0' }}>
                  <span style={{ color: '#065f46', fontWeight: '700' }}>Capital Deployed:</span>
                  <strong style={{ color: '#065f46', fontSize: '1.15rem' }}>{formatMoney(activeCertificate.amount)}</strong>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#64748b' }}>Target Sprint Yield:</span>
                  <strong style={{ color: '#0284c7' }}>{activeCertificate.expectedYield}</strong>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#64748b' }}>Payout Timeline:</span>
                  <span style={{ color: '#0f172a', fontWeight: '600' }}>{activeCertificate.payoutTimeline}</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#64748b' }}>Payment Channel:</span>
                  <span style={{ color: '#0f172a' }}>{activeCertificate.paymentMethod} (UTR: {activeCertificate.utrNumber || 'Verified'})</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#64748b' }}>Issued On:</span>
                  <span style={{ color: '#0f172a' }}>{activeCertificate.date}</span>
                </div>
              </div>

              {/* Seal Stamp */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '18px', paddingTop: '14px', borderTop: '1px dashed #cbd5e1' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.74rem', color: '#059669', fontWeight: '700' }}>
                  <ShieldCheck size={16} /> VERIFIED BY RBI SOVEREIGN RAILS
                </div>
                <div style={{ fontSize: '0.68rem', color: '#64748b' }}>
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
      {/* MODAL 8: EDIT PROJECT ASSUMPTIONS (ADMIN) */}
      {/* ========================================================================= */}
      {isAdminLoggedIn && editingProject && (
        <div className="modal-overlay" onClick={() => setEditingProject(null)}>
          <div 
            className="modal-content" 
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: '540px', width: '100%', padding: '28px', borderRadius: '20px' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <div>
                <h3 style={{ fontSize: '1.25rem', color: '#0f172a', margin: 0, fontWeight: '800' }}>
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
                  <label style={{ display: 'block', fontSize: '0.78rem', color: '#64748b', marginBottom: '4px', fontWeight: '600' }}>Daily Ad Budget (₹):</label>
                  <input type="number" value={editFormData.dailyAdBudget} onChange={(e) => setEditFormData(prev => ({ ...prev, dailyAdBudget: e.target.value }))} required style={{ width: '100%', padding: '9px', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#ffffff', color: '#0f172a' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', color: '#64748b', marginBottom: '4px', fontWeight: '600' }}>Campaign Days:</label>
                  <input type="number" value={editFormData.campaignDurationDays} onChange={(e) => setEditFormData(prev => ({ ...prev, campaignDurationDays: e.target.value }))} required style={{ width: '100%', padding: '9px', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#ffffff', color: '#0f172a' }} />
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
