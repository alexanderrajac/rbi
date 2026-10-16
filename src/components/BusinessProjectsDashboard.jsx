import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAnimatedCounter } from '../hooks/useAnimatedCounter';
import { useApp } from '../context/AppContext';
import { 
  calculateProjectFinancials, 
  parseNaturalLanguagePlan 
} from '../data/businessProjectsData';
import { TerminalPage } from './pages/TerminalPage';
import { CalculatorPage } from './pages/CalculatorPage';
import { HowItWorksPage } from './pages/HowItWorksPage';
import { EscrowPage } from './pages/EscrowPage';
import { PortfolioPage } from './pages/PortfolioPage';
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
    isAdminLoggedIn,
    activeTab,
    setActiveTab
  } = useApp();

  const currentRoute = (activeTab === 'projects' || !activeTab) ? 'ventures' : activeTab;

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
      {/* PAGE 1: 4 BUSINESS VENTURES SYNDICATE DESK ('ventures' or 'projects')    */}
      {/* ========================================================================= */}
      {currentRoute === 'ventures' && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
        >
          {/* 1. INSTITUTIONAL TRADING DESK HERO TELEMETRY (DARK OBSIDIAN THEME) */}
          {/* 1. REAL SMALL BUSINESS BACKING HERO */}
          <div 
            className="hero-box-mobile trading-panel-card"
            style={{
              padding: '28px 24px',
              marginBottom: '24px',
              background: '#FFFFFF',
              border: '1px solid #E2E8F0',
              boxShadow: '0 4px 20px -2px rgba(15, 23, 42, 0.05)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '20px' }}>
              <div style={{ maxWidth: '860px', width: '100%' }}>
                
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: '#ECFDF5', border: '1px solid #A7F3D0', borderRadius: '20px', padding: '5px 14px', marginBottom: '14px', maxWidth: '100%' }}>
                  <ShieldCheck size={16} className="text-emerald-600" />
                  <span style={{ fontSize: '0.74rem', fontWeight: '700', color: '#065F46', letterSpacing: '-0.01em' }}>
                    100% Escrow Protection • Verified Local Businesses • Pre-Agreed Fixed Returns
                  </span>
                </div>

                <h1 className="hero-heading-mobile" style={{ fontSize: '2.1rem', fontWeight: '900', color: '#0F172A', margin: '0 0 10px 0', letterSpacing: '-0.03em', lineHeight: '1.2' }}>
                  Invest in Real Small Business Ventures
                </h1>
                <p style={{ color: '#475569', fontSize: '0.94rem', margin: '0 0 20px 0', lineHeight: '1.6' }}>
                  Back verified local enterprises across <strong>Food Delivery & Cloud Kitchens</strong>, <strong>Custom Craftsmanship</strong>, and <strong>Eco-Friendly Manufacturing</strong>. Every rupee spent is audited, milestones trigger escrow disbursement, and backers receive guaranteed sprint return settlements.
                </p>

                {/* Key Summary Numbers */}
                <div className="responsive-stat-grid">
                  <div style={{ background: '#FFFFFF', padding: '14px 18px', borderRadius: '12px', border: '1px solid #E2E8F0', boxShadow: '0 2px 8px rgba(15, 23, 42, 0.03)' }}>
                    <div style={{ fontSize: '0.72rem', color: '#64748B', fontWeight: '700' }}>Active Ventures</div>
                    <div className="font-mono-numbers" style={{ fontSize: '1.45rem', fontWeight: '800', color: '#0F172A', marginTop: '2px' }}>4 Open Deals</div>
                  </div>
                  <div style={{ background: '#ECFDF5', padding: '14px 18px', borderRadius: '12px', border: '1px solid #A7F3D0', boxShadow: '0 2px 8px rgba(16, 185, 129, 0.06)' }}>
                    <div style={{ fontSize: '0.72rem', color: '#059669', fontWeight: '700' }}>Total Capital Raised</div>
                    <div className="font-mono-numbers" style={{ fontSize: '1.45rem', fontWeight: '800', color: '#059669', marginTop: '2px' }}>₹{animatedRaised.toLocaleString('en-IN')}</div>
                  </div>
                  <div style={{ background: '#FFFFFF', padding: '14px 18px', borderRadius: '12px', border: '1px solid #E2E8F0', boxShadow: '0 2px 8px rgba(15, 23, 42, 0.03)' }}>
                    <div style={{ fontSize: '0.72rem', color: '#64748B', fontWeight: '700' }}>Target Capital Goal</div>
                    <div className="font-mono-numbers" style={{ fontSize: '1.45rem', fontWeight: '800', color: '#D97706', marginTop: '2px' }}>₹{animatedTarget.toLocaleString('en-IN')}</div>
                  </div>
                  <div style={{ background: '#FFFFFF', padding: '14px 18px', borderRadius: '12px', border: '1px solid #E2E8F0', boxShadow: '0 2px 8px rgba(15, 23, 42, 0.03)' }}>
                    <div style={{ fontSize: '0.72rem', color: '#64748B', fontWeight: '700' }}>Verified Backers</div>
                    <div className="font-mono-numbers" style={{ fontSize: '1.45rem', fontWeight: '800', color: '#0284C7', marginTop: '2px' }}>{animatedInvestors} Investors</div>
                  </div>
                </div>
              </div>

              {/* Admin Approval Quick Gate */}
              {isAdminLoggedIn && (
                <div style={{ background: '#FFFBEB', border: '1px solid #FDE68A', borderRadius: '14px', padding: '18px', minWidth: '240px' }}>
                  <div style={{ fontSize: '0.72rem', fontWeight: '800', color: '#B45309', textTransform: 'uppercase', marginBottom: '8px', letterSpacing: '0.05em' }}>
                    Admin Verification Desk
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
                    <span className="badge font-mono-numbers" style={{ fontSize: '0.78rem', padding: '4px 10px', background: pendingInvestments.length > 0 ? '#FEF3C7' : '#ECFDF5', color: pendingInvestments.length > 0 ? '#B45309' : '#059669', border: '1px solid currentColor' }}>
                      {pendingInvestments.length} Pending Approval
                    </span>
                  </div>
                  <button
                    onClick={() => setIsAdminApprovalModalOpen(true)}
                    className="btn btn-sm"
                    style={{ width: '100%', borderRadius: '8px', fontWeight: '700', gap: '6px', background: '#F59E0B', color: '#0F172A' }}
                  >
                    <UserCheck size={15} />
                    <span>Review Submissions</span>
                  </button>
                </div>
              )}
            </div>
          </div>

      {/* ========================================================================= */}
      {/* 2. FILTER & SEARCH BAR */}
      {/* ========================================================================= */}
      <div className="filter-search-container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px', marginBottom: '24px' }}>
        
        {/* Category Pills */}
        <div className="category-pills-scroll">
          {[
            { id: 'ALL', label: 'All Businesses (4)' },
            { id: 'Food Tech', label: 'Food & Beverage' },
            { id: 'Marketplace', label: 'Marketplaces' },
            { id: 'Manufacturing', label: 'Product Manufacturing' },
            { id: 'Eco-Friendly', label: 'Eco-Friendly Products' }
          ].map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              style={{
                padding: '8px 14px',
                borderRadius: '8px',
                fontSize: '0.80rem',
                fontWeight: '700',
                border: selectedCategory === cat.id ? '1px solid #10B981' : '1px solid #E2E8F0',
                background: selectedCategory === cat.id ? '#ECFDF5' : '#FFFFFF',
                color: selectedCategory === cat.id ? '#059669' : '#64748B',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                whiteSpace: 'nowrap'
              }}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="search-input-wrapper" style={{ position: 'relative' }}>
          <Search size={14} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
          <input 
            type="text"
            placeholder="Search business ventures..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              padding: '9px 14px 9px 34px',
              borderRadius: '8px',
              border: '1px solid #E2E8F0',
              background: '#FFFFFF',
              fontSize: '0.86rem',
              color: '#0F172A',
              outline: 'none',
              width: '100%'
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
                background: '#FFFFFF',
                borderRadius: '16px',
                border: '1px solid #E2E8F0',
                padding: '0 0 20px 0',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                boxShadow: '0 4px 20px -2px rgba(15, 23, 42, 0.06), 0 2px 6px -1px rgba(15, 23, 42, 0.04)'
              }}
            >
              <div>
                {/* Hero Image Banner */}
                {project.imageUrl && (
                  <div style={{ position: 'relative', width: '100%', height: '175px', overflow: 'hidden', background: '#F1F5F9' }}>
                    <img 
                      src={project.imageUrl} 
                      alt={project.name} 
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      loading="lazy"
                    />
                    <div style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'linear-gradient(180deg, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0) 40%, rgba(15,23,42,0.65) 100%)'
                    }} />
                    
                    {/* Floating Badges over Image */}
                    <div style={{ position: 'absolute', top: '12px', left: '12px', display: 'flex', gap: '6px', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.68rem', padding: '4px 10px', background: 'rgba(255, 255, 255, 0.96)', color: '#059669', fontWeight: '700', backdropFilter: 'blur(8px)', borderRadius: '9999px', boxShadow: '0 2px 6px rgba(0,0,0,0.12)', display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                        <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10B981' }}></span>
                        Accepting Backers
                      </span>
                      <span style={{ fontSize: '0.68rem', color: '#0369A1', background: 'rgba(255, 255, 255, 0.96)', padding: '4px 10px', borderRadius: '9999px', fontWeight: '700', backdropFilter: 'blur(8px)', boxShadow: '0 2px 6px rgba(0,0,0,0.12)' }}>
                        Verified Business
                      </span>
                    </div>

                    <div style={{ position: 'absolute', bottom: '10px', left: '14px', right: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                      <span style={{ fontSize: '0.72rem', color: '#FFFFFF', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', textShadow: '0 1px 4px rgba(0,0,0,0.8)' }}>
                        {project.category}
                      </span>
                      <span className="font-mono-numbers" style={{ fontSize: '0.74rem', color: '#FDE047', fontWeight: '800', textShadow: '0 1px 4px rgba(0,0,0,0.8)' }}>
                        Yield: {financials.expectedTermYield}
                      </span>
                    </div>
                  </div>
                )}

                <div style={{ padding: '16px 18px 0 18px' }}>
                  {/* Title & Sovereign Admin Controls */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#0F172A', margin: 0, letterSpacing: '-0.02em', lineHeight: '1.25' }}>
                      {project.name}
                    </h2>

                    {isAdminLoggedIn && (
                      <div style={{ display: 'flex', gap: '6px', flexShrink: 0, marginLeft: '8px' }}>
                        <button 
                          onClick={() => setAdminMilestoneProject(project)}
                          className="btn btn-secondary btn-sm"
                          title="Manage Milestones (Admin)"
                          style={{ padding: '4px 8px', fontSize: '0.70rem', gap: '4px', background: '#F8FAFC', color: '#D97706', border: '1px solid rgba(217, 119, 6, 0.3)' }}
                        >
                          <SlidersHorizontal size={13} />
                          <span>Admin Milestones</span>
                        </button>
                        <button 
                          onClick={() => handleOpenEdit(project)}
                          className="btn btn-ghost btn-sm"
                          title="Edit Assumptions"
                          style={{ padding: '4px 6px', color: '#64748B' }}
                        >
                          <Edit3 size={13} />
                        </button>
                      </div>
                    )}
                  </div>

                  <p style={{ fontSize: '0.84rem', color: '#475569', margin: '4px 0 14px 0', lineHeight: '1.5' }}>
                    {project.description}
                  </p>

                  {/* Return on ₹500 Snapshot Pill (Clean Crisp White/Mint Style) */}
                  <div style={{ background: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: '10px', padding: '10px 14px', marginBottom: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.76rem', color: '#166534', fontWeight: '700' }}>
                      Order ₹500 → Return:
                    </span>
                    <div className="font-mono-numbers" style={{ fontSize: '0.90rem', fontWeight: '800', color: '#15803D' }}>
                      ₹{sample500.totalReturn} <span style={{ fontSize: '0.74rem', color: '#B45309', fontWeight: '700' }}>(+₹{sample500.profit} in {sample500.days})</span>
                    </div>
                  </div>

                  {/* Live Funding Progress Bar */}
                  <div style={{ 
                    background: '#F8FAFC', 
                    padding: '14px 16px', 
                    borderRadius: '12px', 
                    border: '1px solid #E2E8F0',
                    marginBottom: '14px' 
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '8px' }}>
                      <div>
                        <span className="font-mono-numbers" style={{ fontSize: '1.25rem', fontWeight: '900', color: '#059669' }}>
                          {formatMoney(financials.capitalRaised)}
                        </span>
                        <span style={{ fontSize: '0.74rem', color: '#64748B', marginLeft: '6px' }}>
                          raised of {formatMoney(financials.capitalRequested)}
                        </span>
                      </div>
                      <span className="font-mono-numbers" style={{ fontSize: '0.92rem', fontWeight: '800', color: '#D97706' }}>
                        {financials.fundingPercent}%
                      </span>
                    </div>

                    {/* Progress Line */}
                    <div style={{ width: '100%', height: '8px', background: '#E2E8F0', borderRadius: '6px', overflow: 'hidden' }}>
                      <div 
                        style={{ 
                          width: `${financials.fundingPercent}%`, 
                          height: '100%', 
                          background: 'linear-gradient(90deg, #F59E0B 0%, #10B981 100%)',
                          borderRadius: '6px',
                          transition: 'width 0.4s ease'
                        }}
                      />
                    </div>

                    <div className="font-mono-numbers" style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px', fontSize: '0.72rem', color: '#64748B' }}>
                      <span>👥 {financials.investorsCount} Backers</span>
                      <span>Min: <strong style={{ color: '#0F172A' }}>{formatMoney(financials.minInvestment)}</strong></span>
                      <span style={{ color: '#0284C7', fontWeight: '700' }}>Term: {financials.payoutTimeline}</span>
                    </div>
                  </div>

                  {/* In-Card Tabs for Details */}
                  <div style={{ 
                    display: 'flex', 
                    gap: '4px', 
                    background: '#F1F5F9', 
                    padding: '4px', 
                    borderRadius: '10px', 
                    marginBottom: '14px',
                    border: '1px solid #E2E8F0'
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
                          background: currentTab === tab.id ? '#FFFFFF' : 'transparent',
                          color: currentTab === tab.id ? '#0F172A' : '#64748B',
                          boxShadow: currentTab === tab.id ? '0 2px 4px rgba(15, 23, 42, 0.08)' : 'none',
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
                        background: '#F8FAFC', 
                        borderRadius: '12px', 
                        padding: '12px 14px', 
                        border: '1px solid #E2E8F0',
                        display: 'grid', 
                        gridTemplateColumns: '1fr 1fr', 
                        gap: '10px',
                        marginBottom: '14px',
                        fontSize: '0.76rem'
                      }}>
                        <div>
                          <span style={{ color: '#64748B' }}>Target Revenue:</span>
                          <div className="font-mono-numbers" style={{ fontWeight: '800', color: '#0F172A', fontSize: '0.92rem' }}>{formatMoney(financials.projectedRevenue)}</div>
                        </div>
                        <div>
                          <span style={{ color: '#64748B' }}>Projected Net Profit:</span>
                          <div className="font-mono-numbers" style={{ fontWeight: '800', color: '#059669', fontSize: '0.92rem' }}>{formatMoney(financials.projectedNetProfit)}</div>
                        </div>
                        <div>
                          <span style={{ color: '#64748B' }}>Sprint Payout:</span>
                          <div className="font-mono-numbers" style={{ fontWeight: '700', color: '#D97706' }}>{financials.payoutTimeline}</div>
                        </div>
                        <div>
                          <span style={{ color: '#64748B' }}>Ad Spend Allocation:</span>
                          <div className="font-mono-numbers" style={{ fontWeight: '700', color: '#0284C7' }}>{formatMoney(financials.totalAdSpend)}</div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* TAB 2: ALL COSTS */}
                  {currentTab === 'costs' && (
                    <div style={{ marginBottom: '14px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      {(project.expenseBreakdown || []).slice(0, 4).map((exp, expIdx) => (
                        <div key={expIdx} style={{ display: 'flex', justifyContent: 'space-between', padding: '7px 10px', borderRadius: '8px', background: '#F8FAFC', border: '1px solid #E2E8F0', fontSize: '0.74rem' }}>
                          <span style={{ color: '#334155', fontWeight: '500' }}>{exp.item}</span>
                          <strong className="font-mono-numbers" style={{ color: '#D97706' }}>{formatMoney(exp.amount)}</strong>
                        </div>
                      ))}
                      <div style={{ fontSize: '0.68rem', color: '#64748B', textAlign: 'right', marginTop: '2px' }}>
                        All items verified & ring-fenced in escrow
                      </div>
                    </div>
                  )}

                  {/* TAB 3: MILESTONES (UPCOMING SPRINTS) */}
                  {currentTab === 'timeline' && (
                    <div style={{ marginBottom: '14px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {(project.timeline || []).map((m, stepIdx) => (
                        <div key={m.id || stepIdx} style={{ padding: '10px 12px', borderRadius: '10px', background: '#F8FAFC', border: '1px solid #E2E8F0', fontSize: '0.74rem' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px', marginBottom: '4px' }}>
                            <div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                                <span style={{ fontSize: '0.65rem', fontWeight: '800', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                                  Step {m.stepNumber || stepIdx + 1}/{m.stepTotal || (project.timeline?.length || 5)}:
                                </span>
                                <strong style={{ color: '#0F172A', fontSize: '0.76rem' }}>
                                  {m.phase}
                                </strong>
                              </div>
                              
                              {/* Sprint Duration & Time Badge */}
                              <div className="font-mono-numbers" style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', marginTop: '4px', background: 'rgba(245, 158, 11, 0.1)', color: '#D97706', padding: '2px 8px', borderRadius: '6px', fontSize: '0.66rem', fontWeight: '700', border: '1px solid rgba(217, 119, 6, 0.25)' }}>
                                <Clock size={11} />
                                <span>Sprint: {m.sprintDuration || m.period}</span>
                              </div>
                            </div>
                            
                            <span className="badge font-mono-numbers" style={{ fontSize: '0.60rem', padding: '2px 6px', background: 'rgba(245, 158, 11, 0.12)', color: '#D97706', border: '1px solid rgba(217, 119, 6, 0.3)', flexShrink: 0 }}>
                              {m.status || 'UPCOMING'}
                            </span>
                          </div>

                          <div style={{ color: '#475569', fontSize: '0.70rem', marginTop: '4px', lineHeight: '1.4' }}>{m.deliverables}</div>
                          
                          <div className="font-mono-numbers" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '6px', fontSize: '0.68rem', color: '#64748B' }}>
                            <span>Dates: <strong style={{ color: '#0F172A' }}>{m.period}</strong></span>
                            <span>Budget: <strong style={{ color: '#059669' }}>{formatMoney(m.allocatedBudget)}</strong></span>
                          </div>
                          
                          {/* Quick Status Buttons - Strictly Sovereign Admin */}
                          {isAdminLoggedIn && (
                            <div style={{ display: 'flex', gap: '4px', marginTop: '6px', paddingTop: '6px', borderTop: '1px dashed #CBD5E1' }}>
                              <button
                                type="button"
                                onClick={() => updateProjectMilestone(project.id, m.id, { status: 'COMPLETED' })}
                                style={{ padding: '2px 7px', borderRadius: '5px', fontSize: '0.65rem', border: '1px solid rgba(16, 185, 129, 0.3)', background: m.status === 'COMPLETED' ? 'rgba(16, 185, 129, 0.15)' : '#FFFFFF', color: '#059669', cursor: 'pointer', fontWeight: '700' }}
                              >
                                ✓ Completed
                              </button>
                              <button
                                type="button"
                                onClick={() => updateProjectMilestone(project.id, m.id, { status: 'IN_PROGRESS' })}
                                style={{ padding: '2px 7px', borderRadius: '5px', fontSize: '0.65rem', border: '1px solid rgba(14, 165, 233, 0.3)', background: m.status === 'IN_PROGRESS' ? 'rgba(14, 165, 233, 0.15)' : '#FFFFFF', color: '#0284C7', cursor: 'pointer', fontWeight: '700' }}
                              >
                                ▶ In Progress
                              </button>
                              <button
                                type="button"
                                onClick={() => updateProjectMilestone(project.id, m.id, { status: 'UPCOMING' })}
                                style={{ padding: '2px 7px', borderRadius: '5px', fontSize: '0.65rem', border: '1px solid #CBD5E1', background: m.status === 'UPCOMING' ? '#E2E8F0' : '#FFFFFF', color: '#64748B', cursor: 'pointer' }}
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
                        <div key={updIdx} style={{ padding: '8px 10px', borderRadius: '8px', background: '#F8FAFC', borderLeft: '3px solid #10B981', borderTop: '1px solid #E2E8F0', borderRight: '1px solid #E2E8F0', borderBottom: '1px solid #E2E8F0', fontSize: '0.74rem' }}>
                          <div style={{ color: '#0F172A', fontWeight: '600' }}>{upd.note}</div>
                          <div style={{ color: '#64748B', fontSize: '0.66rem', marginTop: '2px' }}>{upd.date} • {upd.author}</div>
                        </div>
                      ))}
                    </div>
                  )}

                </div>
              </div>

              {/* Card Footer: PRIMARY "BACK THIS VENTURE" + "VIEW UNIT ECONOMICS" */}
              <div style={{ padding: '0 18px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <button 
                  type="button"
                  onClick={() => handleOpenInvest(project)}
                  className="btn-order-cta"
                  style={{
                    width: '100%',
                    padding: '12px',
                    fontSize: '0.90rem',
                    borderRadius: '10px'
                  }}
                >
                  <Building2 size={16} />
                  <span>Back This Venture (from {formatMoney(financials.minInvestment)})</span>
                </button>

                <button 
                  type="button"
                  onClick={() => setDetailedOverviewProject(project)}
                  className="btn-secondary-trading"
                  style={{
                    width: '100%',
                    padding: '9px',
                    fontSize: '0.80rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    cursor: 'pointer',
                    borderRadius: '10px'
                  }}
                >
                  <FileText size={14} style={{ color: '#0284C7' }} />
                  <span>View Unit Economics & Costs</span>
                </button>
              </div>

            </motion.div>
          );
        })}
      </div>

          {/* Platform Tools & Analytics Hub */}
          <div style={{ marginTop: '48px', paddingTop: '32px', borderTop: '1px solid #E2E8F0' }}>
            <div style={{ textAlign: 'center', marginBottom: '28px' }}>
              <span style={{ fontSize: '0.72rem', padding: '4px 14px', background: '#F1F5F9', color: '#0F172A', border: '1px solid #CBD5E1', borderRadius: '9999px', fontWeight: '700' }}>
                EXPLORE PLATFORM TOOLS
              </span>
              <h3 style={{ fontSize: '1.45rem', fontWeight: '800', color: '#0F172A', margin: '8px 0 6px 0', letterSpacing: '-0.02em' }}>
                Investor Hub & Financial Features
              </h3>
              <p style={{ color: '#475569', fontSize: '0.88rem', margin: 0 }}>
                Transparent analytics, return calculations, and legal escrow security
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
              <div 
                onClick={() => setActiveTab('terminal')}
                className="trading-panel-card"
                style={{ padding: '22px', cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: '10px', background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '14px', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: '#E0F2FE', color: '#0284C7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <TrendingUp size={20} />
                  </div>
                  <span style={{ fontSize: '0.66rem', fontWeight: '700', padding: '3px 8px', background: '#E0F2FE', color: '#0369A1', borderRadius: '6px' }}>METRICS & UNIT ECONOMICS</span>
                </div>
                <h4 style={{ color: '#0F172A', margin: 0, fontSize: '1.05rem', fontWeight: '800' }}>Growth & Financial Analytics</h4>
                <p style={{ color: '#475569', fontSize: '0.82rem', margin: 0, lineHeight: '1.5' }}>
                  Compare venture unit economics, revenue trajectories, escrow disbursement schedules, and performance metrics.
                </p>
                <span style={{ color: '#0284C7', fontSize: '0.80rem', fontWeight: '700', marginTop: 'auto', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  Open Analytics Hub →
                </span>
              </div>

              <div 
                onClick={() => setActiveTab('calculator')}
                className="trading-panel-card"
                style={{ padding: '22px', cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: '10px', background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '14px', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: '#DCFCE7', color: '#16A34A', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Calculator size={20} />
                  </div>
                  <span style={{ fontSize: '0.66rem', fontWeight: '700', padding: '3px 8px', background: '#DCFCE7', color: '#15803D', borderRadius: '6px' }}>SIMULATOR</span>
                </div>
                <h4 style={{ color: '#0F172A', margin: 0, fontSize: '1.05rem', fontWeight: '800' }}>Return Calculator</h4>
                <p style={{ color: '#475569', fontSize: '0.82rem', margin: 0, lineHeight: '1.5' }}>
                  Calculate exact profit multiples, compounding returns, and sprint payout dates on any order size from ₹500.
                </p>
                <span style={{ color: '#16A34A', fontSize: '0.80rem', fontWeight: '700', marginTop: 'auto', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  Calculate Net Returns →
                </span>
              </div>

              <div 
                onClick={() => setActiveTab('escrow')}
                className="trading-panel-card"
                style={{ padding: '22px', cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: '10px', background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '14px', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: '#FEF3C7', color: '#D97706', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <ShieldCheck size={20} />
                  </div>
                  <span style={{ fontSize: '0.66rem', fontWeight: '700', padding: '3px 8px', background: '#FEF3C7', color: '#B45309', borderRadius: '6px' }}>100% ESCROW</span>
                </div>
                <h4 style={{ color: '#0F172A', margin: 0, fontSize: '1.05rem', fontWeight: '800' }}>Escrow & Legal Protection</h4>
                <p style={{ color: '#475569', fontSize: '0.82rem', margin: 0, lineHeight: '1.5' }}>
                  Segregated bank rails, milestone-gated capital disbursement, and legally enforceable syndicate agreements.
                </p>
                <span style={{ color: '#D97706', fontSize: '0.80rem', fontWeight: '700', marginTop: 'auto', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  Read Security Charter →
                </span>
              </div>

              <div 
                onClick={() => setActiveTab('portfolio')}
                className="trading-panel-card"
                style={{ padding: '22px', cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: '10px', background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '14px', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: '#F3E8FF', color: '#9333EA', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Layers size={20} />
                  </div>
                  <span style={{ fontSize: '0.66rem', fontWeight: '700', padding: '3px 8px', background: '#F3E8FF', color: '#7E22CE', borderRadius: '6px' }}>PORTFOLIO</span>
                </div>
                <h4 style={{ color: '#0F172A', margin: 0, fontSize: '1.05rem', fontWeight: '800' }}>My Allocations & Proofs</h4>
                <p style={{ color: '#475569', fontSize: '0.82rem', margin: 0, lineHeight: '1.5' }}>
                  Track active allocations, review approval status, and print tamper-evident digital certificates.
                </p>
                <span style={{ color: '#9333EA', fontSize: '0.80rem', fontWeight: '700', marginTop: 'auto', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  View My Holdings →
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* ========================================================================= */}
      {/* PAGE 2: LIVE STOCK CANDLESTICK TERMINAL                                   */}
      {/* ========================================================================= */}
      {currentRoute === 'terminal' && (
        <TerminalPage 
          portfolioAggregates={portfolioAggregates}
          projectInvestments={projectInvestments}
          businessProjects={businessProjects}
          onInvest={handleOpenInvest}
          setActiveTab={setActiveTab}
        />
      )}

      {/* ========================================================================= */}
      {/* PAGE 3: PROFIT RATIO & RETURN CALCULATOR                                  */}
      {/* ========================================================================= */}
      {currentRoute === 'calculator' && (
        <CalculatorPage 
          businessProjects={businessProjects}
          calcAmount={calcAmount}
          setCalcAmount={setCalcAmount}
          calculateInvestmentReturn={calculateInvestmentReturn}
          onInvest={handleOpenInvest}
          setActiveTab={setActiveTab}
        />
      )}

      {/* ========================================================================= */}
      {/* PAGE 4: HOW IT WORKS WORKFLOW & SYNDICATE GUIDE                           */}
      {/* ========================================================================= */}
      {currentRoute === 'how-it-works' && (
        <HowItWorksPage setActiveTab={setActiveTab} />
      )}

      {/* ========================================================================= */}
      {/* PAGE 5: ESCROW VAULT & LEGAL PROTECTION                                   */}
      {/* ========================================================================= */}
      {currentRoute === 'escrow' && (
        <EscrowPage setActiveTab={setActiveTab} />
      )}

      {/* ========================================================================= */}
      {/* PAGE 6: MY PORTFOLIO & CERTIFICATES                                       */}
      {/* ========================================================================= */}
      {currentRoute === 'portfolio' && (
        <PortfolioPage 
          projectInvestments={projectInvestments}
          formatMoney={formatMoney}
          setPreviewScreenshotUrl={setPreviewScreenshotUrl}
          setActiveCertificate={setActiveCertificate}
          setActiveTab={setActiveTab}
        />
      )}

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
              style={{ 
                maxWidth: '560px', 
                width: '100%', 
                padding: '28px', 
                borderRadius: '20px',
                background: '#FFFFFF',
                border: '1px solid #E2E8F0',
                boxShadow: '0 25px 60px -12px rgba(15, 23, 42, 0.22)'
              }}
            >
              {/* Modal Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '18px', paddingBottom: '14px', borderBottom: '1px solid #E2E8F0' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <span className="badge font-mono-numbers" style={{ fontSize: '0.62rem', padding: '2px 8px', background: 'rgba(16, 185, 129, 0.12)', color: '#059669', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
                      SOVEREIGN ESCROW ALLOCATION
                    </span>
                    <span className="pulse-dot-green"></span>
                  </div>
                  <h3 style={{ fontSize: '1.4rem', color: '#0F172A', margin: '4px 0 2px 0', fontWeight: '800', letterSpacing: '-0.02em' }}>
                    Capital Allocation: {investingProject.name}
                  </h3>
                  <div style={{ fontSize: '0.78rem', color: '#64748B' }}>
                    Yield Target: <strong className="font-mono-numbers" style={{ color: '#059669' }}>{dynamicReturn.yieldPercent}</strong> • Payback: <span className="font-mono-numbers" style={{ color: '#D97706', fontWeight: '700' }}>{dynamicReturn.days}</span>
                  </div>
                </div>
                <button 
                  onClick={() => setInvestingProject(null)} 
                  className="btn btn-ghost btn-sm" 
                  style={{ minWidth: '40px', minHeight: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748B' }}
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleConfirmInvestment} className="modal-form-scroll" style={{ display: 'flex', flexDirection: 'column', gap: '16px', paddingRight: '4px' }}>
                
                {/* Amount Selector */}
                <div>
                  <label className="micro-label" style={{ display: 'block', marginBottom: '8px' }}>
                    Select Capital Allocation Amount ({currency}):
                  </label>

                  {/* Preset chips */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '10px' }}>
                    {quickInvestmentPresets.map(preset => (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => setInvestmentAmount(preset.toString())}
                        className="font-mono-numbers"
                        style={{
                          padding: '7px 14px',
                          borderRadius: '8px',
                          fontSize: '0.82rem',
                          fontWeight: '700',
                          border: investmentAmount === preset.toString() ? '1px solid #10B981' : '1px solid #CBD5E1',
                          background: investmentAmount === preset.toString() ? 'rgba(16, 185, 129, 0.12)' : '#F8FAFC',
                          color: investmentAmount === preset.toString() ? '#059669' : '#475569',
                          boxShadow: investmentAmount === preset.toString() ? '0 2px 8px rgba(16, 185, 129, 0.2)' : 'none',
                          cursor: 'pointer',
                          minHeight: '38px',
                          transition: 'all 0.15s ease'
                        }}
                      >
                        {formatMoney(preset)}
                      </button>
                    ))}
                  </div>

                  {/* Custom Input */}
                  <div style={{ position: 'relative' }}>
                    <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#059669', fontWeight: '800', fontSize: '1.1rem' }}>₹</span>
                    <input 
                      type="number"
                      min={fin.minInvestment}
                      value={investmentAmount}
                      onChange={(e) => setInvestmentAmount(e.target.value)}
                      required
                      className="font-mono-numbers"
                      style={{
                        width: '100%',
                        padding: '12px 14px 12px 34px',
                        borderRadius: '10px',
                        border: '1px solid #CBD5E1',
                        background: '#FFFFFF',
                        color: '#0F172A',
                        fontSize: '1.1rem',
                        fontWeight: '800',
                        outline: 'none'
                      }}
                    />
                  </div>
                </div>

                {/* Dynamic Return Breakdown Box (Explicit Return Calculation for Amount) */}
                <div style={{ background: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: '12px', padding: '14px 16px', boxShadow: '0 4px 16px rgba(16, 185, 129, 0.08)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <span className="micro-label" style={{ color: '#166534' }}>
                      MATHEMATICAL RETURN PROJECTION ({dynamicReturn.days})
                    </span>
                    <span className="badge font-mono-numbers" style={{ fontSize: '0.62rem', background: '#DCFCE7', color: '#15803D', border: '1px solid #86EFAC' }}>
                      VERIFIED ESCROW
                    </span>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                    <div>
                      <div className="micro-label">You Back:</div>
                      <div className="font-mono-numbers" style={{ fontSize: '1.05rem', fontWeight: '800', color: '#0F172A', marginTop: '2px' }}>₹{dynamicReturn.invested}</div>
                    </div>
                    <div>
                      <div className="micro-label">Net Profit (+{dynamicReturn.yieldPercent}):</div>
                      <div className="font-mono-numbers" style={{ fontSize: '1.05rem', fontWeight: '800', color: '#D97706', marginTop: '2px' }}>+₹{dynamicReturn.profit}</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div className="micro-label">Total Return:</div>
                      <div className="font-mono-numbers" style={{ fontSize: '1.25rem', fontWeight: '900', color: '#15803D', marginTop: '2px' }}>₹{dynamicReturn.totalReturn}</div>
                    </div>
                  </div>
                </div>

                {/* Official UPI Payment Details Box */}
                <div style={{ background: '#FFFBEB', border: '1px solid #FDE68A', borderRadius: '12px', padding: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <QrCode size={18} style={{ color: '#D97706' }} />
                      <strong style={{ fontSize: '0.86rem', color: '#92400E' }}>Official Sovereign UPI ID:</strong>
                    </div>
                    <button 
                      type="button" 
                      onClick={() => copyToClipboard(officialUpi, setCopiedUpi)}
                      className="btn btn-secondary btn-sm" 
                      style={{ padding: '4px 10px', fontSize: '0.72rem', color: copiedUpi ? '#059669' : '#D97706', gap: '5px', background: '#FFFFFF', border: '1px solid #FCD34D' }}
                    >
                      <Copy size={13} />
                      {copiedUpi ? '✓ COPIED' : 'COPY UPI'}
                    </button>
                  </div>

                  <div className="font-mono-numbers" style={{ background: '#FFFFFF', border: '1px solid #FCD34D', borderRadius: '8px', padding: '10px 14px', fontSize: '1.10rem', fontWeight: '900', color: '#D97706', letterSpacing: '0.03em', textAlign: 'center' }}>
                    {officialUpi}
                  </div>

                  {/* QR Code Display */}
                  <div style={{ textAlign: 'center', marginTop: '14px' }}>
                    <div style={{ display: 'inline-block', background: '#FFFFFF', padding: '8px', borderRadius: '12px', border: '2px solid #FCD34D', boxShadow: '0 4px 18px rgba(217, 119, 6, 0.15)' }}>
                      <img 
                        src={qrUrl} 
                        alt="UPI QR Code" 
                        style={{ width: '150px', height: '150px', display: 'block', borderRadius: '6px' }}
                      />
                    </div>
                    <div style={{ fontSize: '0.72rem', color: '#92400E', marginTop: '8px', fontWeight: '500' }}>
                      Scan via Google Pay, PhonePe, Paytm, or any BHIM UPI App
                    </div>
                  </div>
                </div>

                {/* Investor Details */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px' }}>
                  <div>
                    <label className="micro-label" style={{ display: 'block', marginBottom: '4px' }}>
                      Investor Full Name: *
                    </label>
                    <input 
                      type="text"
                      placeholder="e.g. Ramesh Kumar"
                      value={investorName}
                      onChange={(e) => setInvestorName(e.target.value)}
                      required
                      style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', background: '#FFFFFF', color: '#0F172A', fontSize: '0.86rem' }}
                    />
                  </div>
                  <div>
                    <label className="micro-label" style={{ display: 'block', marginBottom: '4px' }}>
                      WhatsApp / Phone: *
                    </label>
                    <input 
                      type="tel"
                      placeholder="+91 98400 12345"
                      value={investorPhone}
                      onChange={(e) => setInvestorPhone(e.target.value)}
                      required
                      style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', background: '#FFFFFF', color: '#0F172A', fontSize: '0.86rem' }}
                    />
                  </div>
                </div>

                <div>
                  <label className="micro-label" style={{ display: 'block', marginBottom: '4px' }}>
                    Email Address (for Allocation Certificate):
                  </label>
                  <input 
                    type="email"
                    placeholder="investor@example.com"
                    value={investorEmail}
                    onChange={(e) => setInvestorEmail(e.target.value)}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', background: '#FFFFFF', color: '#0F172A', fontSize: '0.86rem' }}
                  />
                </div>

                {/* UTR / UPI Transaction Reference Input */}
                <div>
                  <label className="micro-label" style={{ display: 'block', marginBottom: '4px', color: '#166534' }}>
                    UPI Reference / UTR Number (12 Digits): *
                  </label>
                  <input 
                    type="text"
                    placeholder="e.g. 428901238475"
                    value={investorUtr}
                    onChange={(e) => setInvestorUtr(e.target.value)}
                    required
                    className="font-mono-numbers"
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #86EFAC', background: '#F0FDF4', color: '#15803D', fontSize: '0.94rem', fontWeight: '700' }}
                  />
                  <span style={{ fontSize: '0.68rem', color: '#64748B', marginTop: '3px', display: 'block' }}>Found in your GPay / PhonePe / Paytm transaction receipt details.</span>
                </div>

                {/* Payment Screenshot Upload */}
                <div>
                  <label className="micro-label" style={{ display: 'block', marginBottom: '4px' }}>
                    Attach Payment Screenshot Proof: *
                  </label>
                  <div style={{ border: '2px dashed #93C5FD', borderRadius: '10px', padding: '14px', textAlign: 'center', background: '#F8FAFC' }}>
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
                      style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', cursor: 'pointer', color: '#0284C7', fontWeight: '700', fontSize: '0.82rem', padding: '6px 12px', borderRadius: '6px', background: '#EFF6FF' }}
                    >
                      <Upload size={16} />
                      {screenshotPreview ? 'Change Screenshot Proof' : 'Upload Payment Screenshot (PNG/JPG)'}
                    </label>

                    {screenshotPreview && (
                      <div style={{ marginTop: '12px', position: 'relative', display: 'inline-block' }}>
                        <img 
                          src={screenshotPreview} 
                          alt="Screenshot Preview" 
                          style={{ maxWidth: '200px', maxHeight: '130px', borderRadius: '8px', border: '1px solid rgba(56, 189, 248, 0.4)' }}
                        />
                        <button
                          type="button"
                          onClick={() => setScreenshotPreview('')}
                          style={{ position: 'absolute', top: '-8px', right: '-8px', background: '#FF3366', color: '#fff', border: 'none', borderRadius: '50%', width: '22px', height: '22px', cursor: 'pointer', fontSize: '11px', fontWeight: '900' }}
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
                  className="btn-order-cta"
                  style={{
                    padding: '14px',
                    borderRadius: '12px',
                    fontSize: '0.96rem',
                    minHeight: '48px',
                    width: '100%',
                    gap: '10px'
                  }}
                >
                  <Send size={18} />
                  <span>Submit Payment Proof for Escrow Verification</span>
                </button>

                <div style={{ textAlign: 'center', fontSize: '0.74rem', color: '#475569', fontWeight: '500' }}>
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
            style={{ 
              maxWidth: '520px', 
              width: '100%', 
              padding: '34px 28px', 
              borderRadius: '20px', 
              textAlign: 'center',
              background: '#FFFFFF',
              border: '1px solid #E2E8F0',
              boxShadow: '0 25px 60px -12px rgba(15, 23, 42, 0.22)'
            }}
          >
            <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'rgba(245, 158, 11, 0.12)', color: '#D97706', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px auto', border: '1px solid rgba(245, 158, 11, 0.3)' }}>
              <Clock size={30} />
            </div>

            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
              <span className="badge font-mono-numbers" style={{ fontSize: '0.62rem', background: 'rgba(245, 158, 11, 0.12)', color: '#D97706', border: '1px solid rgba(245, 158, 11, 0.3)' }}>
                TRANSACTION LOGGED
              </span>
            </div>

            <h3 style={{ fontSize: '1.45rem', fontWeight: '900', color: '#0F172A', margin: '0 0 8px 0', letterSpacing: '-0.02em' }}>
              Payment Proof Submitted
            </h3>
            <p style={{ color: '#475569', fontSize: '0.86rem', lineHeight: '1.5', margin: '0 0 20px 0' }}>
              Your allocation request for <strong style={{ color: '#0F172A' }}>{submissionSuccessModal.projectName}</strong> has entered the sovereign verification queue.
            </p>

            <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '16px', textAlign: 'left', marginBottom: '22px', fontSize: '0.82rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span className="micro-label">Reference ID:</span>
                <strong className="font-mono-numbers" style={{ color: '#0284C7' }}>{submissionSuccessModal.id}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span className="micro-label">Capital Submitted:</span>
                <strong className="font-mono-numbers" style={{ color: '#059669', fontSize: '1rem', fontWeight: '900' }}>{formatMoney(submissionSuccessModal.amount)}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span className="micro-label">UTR / Transaction Ref:</span>
                <strong className="font-mono-numbers" style={{ color: '#0F172A' }}>{submissionSuccessModal.utrNumber || 'Attached Screenshot'}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '6px', borderTop: '1px dashed #CBD5E1' }}>
                <span className="micro-label">Escrow Status:</span>
                <span className="badge font-mono-numbers" style={{ fontSize: '0.65rem', background: 'rgba(245, 158, 11, 0.12)', color: '#D97706', border: '1px solid rgba(245, 158, 11, 0.3)' }}>
                  ⏳ Awaiting Sovereign Verification
                </span>
              </div>
            </div>

            <p style={{ fontSize: '0.78rem', color: '#64748B', lineHeight: '1.45', margin: '0 0 20px 0' }}>
              Admin verifies the UTR against the central escrow ledger. Once cleared, your tamper-proof certificate will be unlocked in <strong>"My Investments"</strong>.
            </p>

            <button
              onClick={() => setSubmissionSuccessModal(null)}
              className="btn-order-cta"
              style={{ width: '100%', minHeight: '44px', borderRadius: '10px', fontWeight: '800' }}
            >
              Done & Return to Ventures
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
            style={{ 
              maxWidth: '780px', 
              width: '100%', 
              padding: '28px', 
              borderRadius: '20px',
              background: '#FFFFFF',
              border: '1px solid #E2E8F0',
              boxShadow: '0 25px 60px -12px rgba(15, 23, 42, 0.22)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', borderBottom: '1px solid #E2E8F0', paddingBottom: '14px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <span className="badge font-mono-numbers" style={{ fontSize: '0.62rem', background: 'rgba(245, 158, 11, 0.12)', color: '#D97706', border: '1px solid rgba(245, 158, 11, 0.3)' }}>
                    SOVEREIGN ESCROW DESK
                  </span>
                  <span className="pulse-dot-green"></span>
                </div>
                <h3 style={{ fontSize: '1.35rem', color: '#0F172A', margin: '2px 0', fontWeight: '800', letterSpacing: '-0.02em' }}>
                  Pending Capital Approvals ({pendingInvestments.length})
                </h3>
              </div>
              <button 
                onClick={() => setIsAdminApprovalModalOpen(false)} 
                className="btn btn-ghost btn-sm" 
                style={{ minWidth: '40px', minHeight: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748B' }}
              >
                <X size={20} />
              </button>
            </div>

            <div style={{ maxHeight: '70vh', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '14px', paddingRight: '4px' }}>
              {pendingInvestments.length > 0 ? (
                pendingInvestments.map((inv) => (
                  <div 
                    key={inv.id}
                    style={{
                      background: '#F8FAFC',
                      border: '1px solid #E2E8F0',
                      borderRadius: '14px',
                      padding: '18px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '12px'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                        <span className="badge font-mono-numbers" style={{ fontSize: '0.62rem', marginBottom: '4px', background: 'rgba(14, 165, 233, 0.1)', color: '#0284C7', border: '1px solid rgba(14, 165, 233, 0.25)' }}>
                          Ref: {inv.id}
                        </span>
                        <h4 style={{ fontSize: '1.15rem', fontWeight: '800', color: '#0F172A', margin: '2px 0' }}>
                          {inv.projectName}
                        </h4>
                        <div style={{ fontSize: '0.78rem', color: '#64748B' }}>
                          Investor: <strong style={{ color: '#0F172A' }}>{inv.investorName}</strong> • Phone: <span className="font-mono-numbers">{inv.phone || 'N/A'}</span> • Email: {inv.email || 'N/A'}
                        </div>
                      </div>

                      <div style={{ textAlign: 'right' }}>
                        <div className="font-mono-numbers" style={{ fontSize: '1.25rem', fontWeight: '900', color: '#059669' }}>
                          {formatMoney(inv.amount)}
                        </div>
                        <span style={{ fontSize: '0.72rem', color: '#64748B' }}>via {inv.paymentMethod}</span>
                      </div>
                    </div>

                    {/* UTR & Screenshot row */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#FFFFFF', padding: '10px 14px', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
                      <div>
                        <span className="micro-label">UTR / Reference:</span>
                        <div className="font-mono-numbers" style={{ fontSize: '0.94rem', fontWeight: '800', color: '#D97706', marginTop: '2px' }}>
                          {inv.utrNumber || 'N/A'}
                        </div>
                      </div>

                      {inv.screenshotUrl && (
                        <button
                          type="button"
                          onClick={() => setPreviewScreenshotUrl(inv.screenshotUrl)}
                          className="btn btn-secondary btn-sm"
                          style={{ fontSize: '0.75rem', gap: '5px', background: '#F8FAFC', border: '1px solid #CBD5E1', color: '#0284C7', minHeight: '34px' }}
                        >
                          <Eye size={13} />
                          <span>View Proof Screenshot</span>
                        </button>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', paddingTop: '10px', borderTop: '1px dashed #CBD5E1' }}>
                      <button
                        type="button"
                        onClick={() => rejectBusinessInvestment(inv.id, "Payment verification unconfirmed")}
                        className="btn btn-ghost btn-sm"
                        style={{ color: '#E11D48', fontWeight: '700', fontSize: '0.8rem', minHeight: '36px', padding: '0 12px' }}
                      >
                        ✕ Reject
                      </button>
                      <button
                        type="button"
                        onClick={() => approveBusinessInvestment(inv.id)}
                        className="btn-order-cta"
                        style={{ fontWeight: '800', fontSize: '0.82rem', gap: '6px', minHeight: '38px', padding: '0 16px' }}
                      >
                        <CheckCircle2 size={15} />
                        <span>✓ Approve & Issue Allocation Certificate</span>
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div style={{ textAlign: 'center', padding: '40px', background: '#F8FAFC', borderRadius: '14px', border: '1px dashed #CBD5E1' }}>
                  <CheckCircle size={36} style={{ color: '#059669', margin: '0 auto 10px auto' }} />
                  <h4 style={{ color: '#0F172A', fontSize: '1rem', margin: '0 0 4px 0', fontWeight: '700' }}>
                    All Submissions Cleared
                  </h4>
                  <p style={{ color: '#64748B', fontSize: '0.82rem', margin: 0 }}>
                    There are no pending investments waiting for admin approval right now.
                  </p>
                </div>
              )}
            </div>

            <div style={{ marginTop: '16px', paddingTop: '12px', borderTop: '1px solid #E2E8F0', textAlign: 'right' }}>
              <button 
                type="button" 
                onClick={() => setIsAdminApprovalModalOpen(false)}
                className="btn btn-secondary btn-sm"
                style={{ borderRadius: '8px', minHeight: '36px', padding: '0 16px', background: '#F8FAFC', border: '1px solid #CBD5E1', color: '#0F172A' }}
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
            style={{ 
              maxWidth: '560px', 
              width: '100%', 
              padding: '24px', 
              borderRadius: '16px', 
              textAlign: 'center',
              background: '#FFFFFF',
              border: '1px solid #E2E8F0',
              boxShadow: '0 25px 60px -12px rgba(15, 23, 42, 0.22)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', borderBottom: '1px solid #E2E8F0', paddingBottom: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Eye size={16} style={{ color: '#0284C7' }} />
                <h4 style={{ margin: 0, color: '#0F172A', fontWeight: '800', fontSize: '1rem' }}>Payment Proof Verification</h4>
              </div>
              <button 
                onClick={() => setPreviewScreenshotUrl(null)} 
                className="btn btn-ghost btn-sm" 
                style={{ minWidth: '36px', minHeight: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748B' }}
              >
                <X size={18} />
              </button>
            </div>
            <div style={{ background: '#F8FAFC', padding: '8px', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
              <img 
                src={previewScreenshotUrl} 
                alt="Payment Proof" 
                style={{ width: '100%', maxHeight: '68vh', objectFit: 'contain', borderRadius: '8px', display: 'block' }}
              />
            </div>
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
              style={{ 
                maxWidth: '680px', 
                width: '100%', 
                padding: '30px 26px', 
                borderRadius: '20px',
                background: '#FFFFFF',
                border: '1px solid #E2E8F0',
                boxShadow: '0 25px 60px -12px rgba(15, 23, 42, 0.22)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '18px', borderBottom: '1px solid #E2E8F0', paddingBottom: '14px' }}>
                <div>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(14, 165, 233, 0.1)', padding: '3px 8px', borderRadius: '6px', fontSize: '0.65rem', fontWeight: '700', color: '#0284C7', border: '1px solid rgba(14, 165, 233, 0.25)', marginBottom: '6px' }}>
                    <ShieldCheck size={13} /> VERIFIED SOVEREIGN VENTURE MEMO
                  </div>
                  <h3 style={{ fontSize: '1.45rem', color: '#0F172A', margin: '2px 0', fontWeight: '800', letterSpacing: '-0.02em' }}>
                    {detailedOverviewProject.name} — Syndicate Audit
                  </h3>
                  <div style={{ fontSize: '0.8rem', color: '#64748B' }}>
                    Industry: <strong style={{ color: '#0F172A' }}>{detailedOverviewProject.category}</strong> • Status: <span className="badge font-mono-numbers" style={{ fontSize: '0.62rem', background: '#DCFCE7', color: '#15803D', border: '1px solid #86EFAC' }}>{detailedOverviewProject.status}</span>
                  </div>
                </div>
                <button 
                  onClick={() => setDetailedOverviewProject(null)} 
                  className="btn btn-ghost btn-sm" 
                  style={{ minWidth: '40px', minHeight: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748B' }}
                >
                  <X size={20} />
                </button>
              </div>

              <div className="modal-form-scroll" style={{ display: 'flex', flexDirection: 'column', gap: '18px', paddingRight: '4px' }}>
                
                {/* 1. Executive Summary */}
                <div>
                  <h4 style={{ fontSize: '0.88rem', fontWeight: '800', color: '#0F172A', marginBottom: '6px' }}>
                    1. Commercial Model & Purpose
                  </h4>
                  <p style={{ fontSize: '0.84rem', color: '#475569', lineHeight: '1.6', margin: 0 }}>
                    {detailedOverviewProject.description} This capital allocation covers immediate inventory purchasing, precision fabrication, local acquisition marketing, and working capital buffers to fulfill order quotas.
                  </p>
                </div>

                {/* 2. Key Investment Terms & Yields */}
                <div style={{ background: '#F8FAFC', padding: '16px', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
                  <h4 style={{ fontSize: '0.88rem', fontWeight: '800', color: '#0F172A', marginBottom: '12px' }}>
                    2. Investment Terms & Financial Structure
                  </h4>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '0.82rem' }}>
                    <div>
                      <span className="micro-label">Target Capital:</span>
                      <div className="font-mono-numbers" style={{ fontWeight: '800', color: '#0F172A', marginTop: '2px', fontSize: '1rem' }}>{formatMoney(fin.capitalRequested)}</div>
                    </div>
                    <div>
                      <span className="micro-label">Minimum Ticket:</span>
                      <div className="font-mono-numbers" style={{ fontWeight: '800', color: '#0F172A', marginTop: '2px', fontSize: '1rem' }}>{formatMoney(fin.minInvestment)}</div>
                    </div>
                    <div>
                      <span className="micro-label">Expected Net Yield:</span>
                      <div className="font-mono-numbers" style={{ fontWeight: '800', color: '#059669', fontSize: '1rem', marginTop: '2px' }}>{fin.expectedTermYield}</div>
                    </div>
                    <div>
                      <span className="micro-label">Settlement Timeline:</span>
                      <div className="font-mono-numbers" style={{ fontWeight: '800', color: '#D97706', marginTop: '2px', fontSize: '1rem' }}>{fin.payoutTimeline}</div>
                    </div>
                  </div>
                </div>

                {/* 3. Detailed Expense Itemization */}
                <div>
                  <h4 style={{ fontSize: '0.88rem', fontWeight: '800', color: '#0F172A', marginBottom: '8px' }}>
                    3. Itemized Budget Allocation (Where Capital Is Deployed)
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {(detailedOverviewProject.expenseBreakdown || []).map((exp, idx) => (
                      <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '8px', fontSize: '0.8rem' }}>
                        <div>
                          <span style={{ fontWeight: '600', color: '#0F172A' }}>{exp.item}</span>
                          <span style={{ fontSize: '0.70rem', color: '#64748B', display: 'block' }}>{exp.category}</span>
                        </div>
                        <strong className="font-mono-numbers" style={{ color: '#D97706', fontSize: '0.9rem' }}>{formatMoney(exp.amount)}</strong>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 4. Milestone Escrow Release Schedule */}
                <div>
                  <h4 style={{ fontSize: '0.88rem', fontWeight: '800', color: '#0F172A', marginBottom: '8px' }}>
                    4. Milestone Escrow Release Tranches
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {(detailedOverviewProject.timeline || []).map((m, idx) => (
                      <div key={m.id || idx} style={{ padding: '10px 14px', background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '10px', fontSize: '0.78rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px', marginBottom: '4px' }}>
                          <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                              <span style={{ fontSize: '0.65rem', fontWeight: '800', color: '#64748B' }}>
                                Step {m.stepNumber || idx + 1}/{m.stepTotal || (detailedOverviewProject.timeline?.length || 5)}:
                              </span>
                              <span style={{ color: '#0F172A', fontWeight: '700' }}>{m.phase}</span>
                            </div>
                            <div className="font-mono-numbers" style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', marginTop: '3px', background: 'rgba(245, 158, 11, 0.1)', color: '#D97706', padding: '2px 8px', borderRadius: '6px', fontSize: '0.68rem', fontWeight: '700', border: '1px solid rgba(217, 119, 6, 0.25)' }}>
                              <Clock size={12} strokeWidth={2.4} />
                              <span>Sprint: {m.sprintDuration || m.period}</span>
                            </div>
                          </div>
                          <span className="badge font-mono-numbers" style={{ fontSize: '0.62rem', padding: '2px 8px', background: 'rgba(245, 158, 11, 0.12)', color: '#D97706', border: '1px solid rgba(217, 119, 6, 0.3)' }}>
                            {m.status || 'UPCOMING'}
                          </span>
                        </div>
                        <div style={{ color: '#475569', marginTop: '4px', lineHeight: '1.4' }}>{m.deliverables}</div>
                        <div className="font-mono-numbers" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#64748B', fontSize: '0.72rem', marginTop: '6px', paddingTop: '4px', borderTop: '1px dashed #CBD5E1' }}>
                          <span>Dates: <strong style={{ color: '#0F172A' }}>{m.period}</strong></span>
                          <span>Budget: <strong style={{ color: '#059669' }}>{formatMoney(m.allocatedBudget)}</strong></span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 5. Escrow Safeguard & Guarantees */}
                <div style={{ background: '#F0FDF4', padding: '14px', borderRadius: '10px', border: '1px solid #BBF7D0' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#166534', fontWeight: '800', fontSize: '0.84rem', marginBottom: '4px' }}>
                    <ShieldCheck size={16} /> Investor Capital Ring-Fence Guarantee
                  </div>
                  <p style={{ color: '#475569', fontSize: '0.78rem', margin: 0, lineHeight: '1.5' }}>
                    Investor contributions are deposited directly into a segregated commercial escrow facility. Tranche payouts to operations require verified physical receipts and courier consignment notes. If a sprint fails to initiate, 100% of unspent funds are returned to backer accounts.
                  </p>
                </div>

              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '10px', marginTop: '22px', paddingTop: '14px', borderTop: '1px solid #E2E8F0' }}>
                <button 
                  type="button" 
                  onClick={() => setDetailedOverviewProject(null)}
                  className="btn btn-secondary"
                  style={{ flex: 1, borderRadius: '10px', minHeight: '44px', background: '#F8FAFC', border: '1px solid #CBD5E1', color: '#0F172A' }}
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
                  className="btn-order-cta"
                  style={{ flex: 1.5, borderRadius: '10px', minHeight: '44px' }}
                >
                  <Building2 size={16} />
                  <span>Execute Backing Order</span>
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
              style={{ 
                maxWidth: '700px', 
                width: '100%', 
                padding: '28px', 
                borderRadius: '20px',
                background: '#FFFFFF',
                border: '1px solid #E2E8F0',
                boxShadow: '0 25px 60px -12px rgba(15, 23, 42, 0.22)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '18px', borderBottom: '1px solid #E2E8F0', paddingBottom: '14px' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <span className="badge font-mono-numbers" style={{ fontSize: '0.62rem', background: 'rgba(245, 158, 11, 0.12)', color: '#D97706', border: '1px solid rgba(245, 158, 11, 0.3)' }}>
                      SOVEREIGN ADMIN
                    </span>
                    <span className="pulse-dot-green"></span>
                  </div>
                  <h3 style={{ fontSize: '1.35rem', color: '#0F172A', margin: '2px 0', fontWeight: '800', letterSpacing: '-0.02em' }}>
                    Manage Sprints: {liveAdminProject.name}
                  </h3>
                  <div style={{ fontSize: '0.78rem', color: '#64748B' }}>
                    Control sprint deliverables, track escrow allocations, and broadcast live field updates.
                  </div>
                </div>
                <button 
                  onClick={() => setAdminMilestoneProject(null)} 
                  className="btn btn-ghost btn-sm" 
                  style={{ minWidth: '40px', minHeight: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748B' }}
                >
                  <X size={20} />
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxHeight: '72vh', overflowY: 'auto', paddingRight: '4px' }}>
                
                {/* 1. Existing Milestones List */}
                <div>
                  <h4 style={{ fontSize: '0.90rem', fontWeight: '800', color: '#0F172A', marginBottom: '10px' }}>
                    Current Venture Sprints ({liveAdminProject.timeline?.length || 0})
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {(liveAdminProject.timeline || []).map((m) => (
                      <div key={m.id} style={{ padding: '12px 14px', background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '10px' }}>
                        {editingMilestoneId === m.id ? (
                          /* Inline Edit Form */
                          <div style={{ background: '#FFFFFF', border: '1px solid #0284C7', borderRadius: '8px', padding: '12px' }}>
                            <div style={{ fontSize: '0.8rem', fontWeight: '800', color: '#0284C7', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                              <Edit3 size={14} /> Edit Sprint Parameters
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '8px' }}>
                              <div>
                                <label className="micro-label" style={{ display: 'block', marginBottom: '3px' }}>Phase:</label>
                                <input 
                                  type="text"
                                  value={editingMilestoneForm.phase}
                                  onChange={(e) => setEditingMilestoneForm({ ...editingMilestoneForm, phase: e.target.value })}
                                  style={{ width: '100%', padding: '6px 10px', borderRadius: '6px', border: '1px solid #CBD5E1', background: '#FFFFFF', color: '#0F172A', fontSize: '0.80rem' }}
                                />
                              </div>
                              <div>
                                <label className="micro-label" style={{ display: 'block', marginBottom: '3px' }}>Period:</label>
                                <input 
                                  type="text"
                                  value={editingMilestoneForm.period}
                                  onChange={(e) => setEditingMilestoneForm({ ...editingMilestoneForm, period: e.target.value })}
                                  style={{ width: '100%', padding: '6px 10px', borderRadius: '6px', border: '1px solid #CBD5E1', background: '#FFFFFF', color: '#0F172A', fontSize: '0.80rem' }}
                                />
                              </div>
                              <div>
                                <label className="micro-label" style={{ display: 'block', marginBottom: '3px' }}>Budget (₹):</label>
                                <input 
                                  type="number"
                                  value={editingMilestoneForm.allocatedBudget}
                                  onChange={(e) => setEditingMilestoneForm({ ...editingMilestoneForm, allocatedBudget: e.target.value })}
                                  className="font-mono-numbers"
                                  style={{ width: '100%', padding: '6px 10px', borderRadius: '6px', border: '1px solid #CBD5E1', background: '#FFFFFF', color: '#059669', fontSize: '0.80rem', fontWeight: '700' }}
                                />
                              </div>
                              <div>
                                <label className="micro-label" style={{ display: 'block', marginBottom: '3px' }}>Status:</label>
                                <select
                                  value={editingMilestoneForm.status}
                                  onChange={(e) => setEditingMilestoneForm({ ...editingMilestoneForm, status: e.target.value })}
                                  style={{ width: '100%', padding: '6px 10px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '0.80rem', background: '#FFFFFF', color: '#0F172A' }}
                                >
                                  <option value="UPCOMING">UPCOMING</option>
                                  <option value="IN_PROGRESS">IN_PROGRESS</option>
                                  <option value="COMPLETED">COMPLETED</option>
                                </select>
                              </div>
                            </div>
                            <div style={{ marginBottom: '8px' }}>
                              <label className="micro-label" style={{ display: 'block', marginBottom: '3px' }}>Deliverables:</label>
                              <textarea 
                                rows={2}
                                value={editingMilestoneForm.deliverables}
                                onChange={(e) => setEditingMilestoneForm({ ...editingMilestoneForm, deliverables: e.target.value })}
                                style={{ width: '100%', padding: '6px 10px', borderRadius: '6px', border: '1px solid #CBD5E1', background: '#FFFFFF', color: '#0F172A', fontSize: '0.80rem' }}
                              />
                            </div>
                            <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                              <button
                                type="button"
                                onClick={() => setEditingMilestoneId(null)}
                                className="btn btn-secondary btn-sm"
                                style={{ padding: '4px 12px', fontSize: '0.74rem', background: '#F8FAFC', color: '#64748B', border: '1px solid #CBD5E1' }}
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
                                className="btn-order-cta"
                                style={{ padding: '4px 14px', fontSize: '0.74rem', fontWeight: '800' }}
                              >
                                Save Changes
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <div>
                                <strong style={{ color: '#0F172A', fontSize: '0.86rem' }}>{m.phase}</strong>
                                <span className="font-mono-numbers" style={{ fontSize: '0.72rem', color: '#64748B', display: 'block', marginTop: '2px' }}>
                                  {m.period} • Budget: <strong style={{ color: '#059669' }}>{formatMoney(m.allocatedBudget)}</strong>
                                </span>
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
                                  style={{ padding: '4px', color: '#0284C7' }}
                                  title="Edit Milestone Details"
                                >
                                  <Edit3 size={14} />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => deleteProjectMilestone(adminMilestoneProject.id, m.id)}
                                  className="btn btn-ghost btn-sm"
                                  style={{ padding: '4px', color: '#E11D48' }}
                                  title="Delete Milestone"
                                >
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            </div>
                            <p style={{ fontSize: '0.76rem', color: '#475569', margin: '4px 0 8px 0', lineHeight: '1.4' }}>{m.deliverables}</p>

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
                                  border: m.status === 'COMPLETED' ? '1px solid #10B981' : '1px solid #CBD5E1',
                                  background: m.status === 'COMPLETED' ? 'rgba(16, 185, 129, 0.15)' : '#FFFFFF',
                                  color: m.status === 'COMPLETED' ? '#059669' : '#64748B',
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
                                  border: m.status === 'IN_PROGRESS' ? '1px solid #0284C7' : '1px solid #CBD5E1',
                                  background: m.status === 'IN_PROGRESS' ? 'rgba(14, 165, 233, 0.15)' : '#FFFFFF',
                                  color: m.status === 'IN_PROGRESS' ? '#0284C7' : '#64748B',
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
                                  border: m.status === 'UPCOMING' ? '1px solid #D97706' : '1px solid #CBD5E1',
                                  background: m.status === 'UPCOMING' ? 'rgba(245, 158, 11, 0.12)' : '#FFFFFF',
                                  color: m.status === 'UPCOMING' ? '#D97706' : '#64748B',
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
                <div style={{ background: '#F8FAFC', padding: '16px', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
                  <h4 style={{ fontSize: '0.88rem', fontWeight: '800', color: '#0F172A', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Plus size={15} style={{ color: '#059669' }} /> Add New Milestone
                  </h4>
                  <form onSubmit={handleCreateMilestone} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '10px' }}>
                      <input 
                        type="text"
                        placeholder="Phase Title (e.g. Phase 4: Production Run)"
                        value={newMilestonePhase}
                        onChange={(e) => setNewMilestonePhase(e.target.value)}
                        required
                        style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', background: '#FFFFFF', fontSize: '0.82rem', color: '#0F172A' }}
                      />
                      <input 
                        type="text"
                        placeholder="Period (e.g. Oct 20 - 24)"
                        value={newMilestonePeriod}
                        onChange={(e) => setNewMilestonePeriod(e.target.value)}
                        style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', background: '#FFFFFF', fontSize: '0.82rem', color: '#0F172A' }}
                      />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '10px' }}>
                      <input 
                        type="number"
                        placeholder="Budget (₹)"
                        value={newMilestoneBudget}
                        onChange={(e) => setNewMilestoneBudget(e.target.value)}
                        className="font-mono-numbers"
                        style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', background: '#FFFFFF', fontSize: '0.82rem', color: '#059669', fontWeight: '700' }}
                      />
                      <input 
                        type="text"
                        placeholder="Deliverables & expected outcome"
                        value={newMilestoneDeliverables}
                        onChange={(e) => setNewMilestoneDeliverables(e.target.value)}
                        style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', background: '#FFFFFF', fontSize: '0.82rem', color: '#0F172A' }}
                      />
                    </div>
                    <button type="submit" className="btn btn-secondary btn-sm" style={{ alignSelf: 'flex-start', borderRadius: '8px', background: '#FFFFFF', border: '1px solid #CBD5E1', color: '#0F172A', minHeight: '36px' }}>
                      <Plus size={14} /> Add Milestone to Project
                    </button>
                  </form>
                </div>

                {/* 3. Post Live Work Activity Update */}
                <div style={{ background: '#F8FAFC', padding: '16px', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
                  <h4 style={{ fontSize: '0.88rem', fontWeight: '800', color: '#0F172A', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Send size={14} style={{ color: '#0284C7' }} /> Post Live Work Update to Investors
                  </h4>
                  <form onSubmit={handlePostLiveUpdate} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <textarea 
                      rows={2}
                      placeholder="Enter what the operations team is executing right now..."
                      value={newLiveUpdateNote}
                      onChange={(e) => setNewLiveUpdateNote(e.target.value)}
                      required
                      style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', background: '#FFFFFF', fontSize: '0.82rem', color: '#0F172A', outline: 'none' }}
                    />
                    <button type="submit" className="btn-order-cta" style={{ alignSelf: 'flex-start', borderRadius: '8px', minHeight: '36px', padding: '0 16px', fontSize: '0.80rem' }}>
                      <Send size={13} /> Publish Live Update
                    </button>
                  </form>
                </div>

              </div>

              <div style={{ marginTop: '18px', paddingTop: '14px', borderTop: '1px solid #E2E8F0', textAlign: 'right' }}>
                <button 
                  type="button" 
                  onClick={() => setAdminMilestoneProject(null)} 
                  className="btn btn-secondary btn-sm"
                  style={{ borderRadius: '8px', minHeight: '36px', padding: '0 16px', background: '#F8FAFC', border: '1px solid #CBD5E1', color: '#0F172A' }}
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
            style={{ 
              maxWidth: '620px', 
              width: '100%', 
              padding: '30px', 
              borderRadius: '20px',
              background: '#FFFFFF',
              border: '1px solid #E2E8F0',
              boxShadow: '0 25px 60px -12px rgba(15, 23, 42, 0.22)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', borderBottom: '1px solid #E2E8F0', paddingBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <BadgeCheck size={22} style={{ color: '#059669' }} />
                <h3 style={{ fontSize: '1.25rem', color: '#0F172A', margin: 0, fontWeight: '800', letterSpacing: '-0.02em' }}>
                  Official Allocation Certificate
                </h3>
              </div>
              <button 
                onClick={() => setActiveCertificate(null)} 
                className="btn btn-ghost btn-sm" 
                style={{ minWidth: '36px', minHeight: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748B' }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Certificate Canvas Box */}
            <div 
              style={{
                background: 'linear-gradient(135deg, #FFFBEB 0%, #FEF3C7 100%)',
                border: '2px solid #F59E0B',
                borderRadius: '16px',
                padding: '26px 24px',
                marginBottom: '20px',
                position: 'relative',
                boxShadow: '0 8px 30px rgba(217, 119, 6, 0.12)'
              }}
            >
              {/* Sovereign Watermark Crest */}
              <div style={{ 
                position: 'absolute', 
                top: '50%', 
                left: '50%', 
                transform: 'translate(-50%, -50%)', 
                opacity: '0.06', 
                pointerEvents: 'none',
                fontSize: '180px',
                userSelect: 'none'
              }}>
                🏛️
              </div>

              {/* Institutional Header */}
              <div style={{ textAlign: 'center', borderBottom: '1px dashed #D97706', paddingBottom: '16px', marginBottom: '16px' }}>
                <div style={{ fontSize: '0.70rem', color: '#B45309', fontWeight: '800', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                  ROYAL BANK OF INVESTMENT • CENTRAL VAULT ESCROW
                </div>
                <h2 style={{ fontSize: '1.45rem', fontWeight: '900', color: '#78350F', margin: '4px 0', letterSpacing: '-0.02em' }}>
                  Certificate of Capital Allocation
                </h2>
                <div className="font-mono-numbers" style={{ fontSize: '0.74rem', color: '#0284C7', fontWeight: '700' }}>
                  Reference No: {activeCertificate.id}
                </div>
              </div>

              {/* Certificate Details */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.85rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span className="micro-label" style={{ color: '#78350F' }}>Registered Backer:</span>
                  <strong style={{ color: '#0F172A' }}>{activeCertificate.investorName}</strong>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span className="micro-label" style={{ color: '#78350F' }}>Business Venture:</span>
                  <strong style={{ color: '#B45309' }}>{activeCertificate.projectName}</strong>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span className="micro-label" style={{ color: '#78350F' }}>Sector:</span>
                  <span style={{ color: '#0F172A', fontWeight: '600' }}>{activeCertificate.category}</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', background: 'rgba(16, 185, 129, 0.15)', borderRadius: '8px', border: '1px solid #10B981' }}>
                  <span className="micro-label" style={{ color: '#166534' }}>Capital Deployed:</span>
                  <strong className="font-mono-numbers" style={{ color: '#15803D', fontSize: '1.15rem' }}>{formatMoney(activeCertificate.amount)}</strong>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span className="micro-label" style={{ color: '#78350F' }}>Target Sprint Yield:</span>
                  <strong className="font-mono-numbers" style={{ color: '#0284C7' }}>{activeCertificate.expectedYield}</strong>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span className="micro-label" style={{ color: '#78350F' }}>Payout Timeline:</span>
                  <span className="font-mono-numbers" style={{ color: '#0F172A', fontWeight: '700' }}>{activeCertificate.payoutTimeline}</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span className="micro-label" style={{ color: '#78350F' }}>Settlement Channel:</span>
                  <span className="font-mono-numbers" style={{ color: '#0F172A' }}>{activeCertificate.paymentMethod} (UTR: {activeCertificate.utrNumber || 'Verified'})</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span className="micro-label" style={{ color: '#78350F' }}>Issued On:</span>
                  <span className="font-mono-numbers" style={{ color: '#64748B' }}>{activeCertificate.date}</span>
                </div>
              </div>

              {/* Seal Stamp */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '18px', paddingTop: '14px', borderTop: '1px dashed #D97706' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.74rem', color: '#15803D', fontWeight: '800' }}>
                  <ShieldCheck size={16} /> VERIFIED BY RBI SOVEREIGN RAILS
                </div>
                <div className="font-mono-numbers" style={{ fontSize: '0.68rem', color: '#78350F' }}>
                  Tamper-Evident SHA-256 Escrow Record
                </div>
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: '10px' }}>
              <button 
                type="button" 
                onClick={() => window.print()}
                className="btn btn-secondary btn-sm"
                style={{ flex: 1, justifyContent: 'center', borderRadius: '10px', minHeight: '44px', background: '#F8FAFC', border: '1px solid #CBD5E1', color: '#0F172A' }}
              >
                <Printer size={16} /> Print / Save Certificate PDF
              </button>
              <button 
                type="button" 
                onClick={() => setActiveCertificate(null)}
                className="btn-order-cta"
                style={{ flex: 1, justifyContent: 'center', borderRadius: '10px', minHeight: '44px' }}
              >
                Done
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
            style={{ 
              maxWidth: '540px', 
              width: '100%', 
              padding: '28px', 
              borderRadius: '20px',
              background: '#FFFFFF',
              border: '1px solid #E2E8F0',
              boxShadow: '0 25px 60px -12px rgba(15, 23, 42, 0.22)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', borderBottom: '1px solid #E2E8F0', paddingBottom: '12px' }}>
              <div>
                <h3 style={{ fontSize: '1.25rem', color: '#0F172A', margin: 0, fontWeight: '800' }}>
                  Edit Assumptions: {editingProject.name}
                </h3>
              </div>
              <button 
                onClick={() => setEditingProject(null)} 
                className="btn btn-ghost btn-sm" 
                style={{ minWidth: '36px', minHeight: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748B' }}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label className="micro-label" style={{ display: 'block', marginBottom: '4px' }}>Daily Ad Budget (₹):</label>
                  <input 
                    type="number" 
                    value={editFormData.dailyAdBudget} 
                    onChange={(e) => setEditFormData(prev => ({ ...prev, dailyAdBudget: e.target.value }))} 
                    required 
                    className="font-mono-numbers"
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', background: '#FFFFFF', color: '#0F172A' }} 
                  />
                </div>
                <div>
                  <label className="micro-label" style={{ display: 'block', marginBottom: '4px' }}>Campaign Days:</label>
                  <input 
                    type="number" 
                    value={editFormData.campaignDurationDays} 
                    onChange={(e) => setEditFormData(prev => ({ ...prev, campaignDurationDays: e.target.value }))} 
                    required 
                    className="font-mono-numbers"
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', background: '#FFFFFF', color: '#0F172A' }} 
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <button 
                  type="button" 
                  onClick={() => setEditingProject(null)} 
                  className="btn btn-secondary" 
                  style={{ flex: 1, borderRadius: '10px', minHeight: '44px', background: '#F8FAFC', border: '1px solid #CBD5E1', color: '#0F172A' }}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn-order-cta" 
                  style={{ flex: 1, borderRadius: '10px', minHeight: '44px' }}
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
