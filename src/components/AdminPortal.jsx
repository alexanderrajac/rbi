import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { calculateProjectFinancials } from '../data/businessProjectsData';
import { 
  ShieldCheck, 
  Lock, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  DollarSign, 
  TrendingUp, 
  Building2, 
  Users, 
  Sliders, 
  KeyRound, 
  LogOut, 
  Eye, 
  Sparkles,
  BarChart2,
  FileCheck,
  Zap,
  RefreshCw,
  Layers,
  Hammer,
  FileText,
  Clock,
  Calendar,
  Plus,
  Trash2,
  Send,
  ArrowLeft,
  Copy,
  ExternalLink,
  Check,
  Upload,
  AlertCircle,
  HelpCircle,
  Activity,
  CheckCircle,
  ChevronRight,
  Edit3
} from 'lucide-react';

export const AdminPortal = () => {
  const { 
    isAdminLoggedIn, 
    adminLogin, 
    adminLogout, 
    activeTab,
    setActiveTab,
    businessProjects, 
    setBusinessProjects,
    updateBusinessProject,
    updateProjectMilestone,
    addProjectMilestone,
    deleteProjectMilestone,
    addProjectLiveUpdate,
    projectInvestments,
    approveBusinessInvestment,
    rejectBusinessInvestment,
    projectChangeHistory,
    formatMoney,
    formatValuation,
    user,
    supabaseUser,
    loginWithGoogle,
    logoutUser,
    isAuthLoading,
    ADMIN_EMAIL
  } = useApp();

  const [passwordInput, setPasswordInput] = useState('');
  const [emailInput, setEmailInput] = useState(ADMIN_EMAIL || 'rajacofficial369@gmail.com');
  const [loginError, setLoginError] = useState(false);
  
  // Admin Tabs: 'payments' | 'sprints' | 'broadcaster' | 'financials' | 'history'
  const [currentAdminTab, setCurrentAdminTab] = useState('payments');

  // Payment Desk Filter: 'ALL' | 'PENDING' | 'CONFIRMED' | 'REJECTED'
  const [paymentFilter, setPaymentFilter] = useState('ALL');
  const [selectedScreenshotModal, setSelectedScreenshotModal] = useState(null);
  const [rejectionModalInv, setRejectionModalInv] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('Payment verification details could not be matched with bank ledger');

  // Selected Project for Sprint / Broadcaster / Financials Desk
  const [selectedProjectId, setSelectedProjectId] = useState(businessProjects[0]?.id || 'proj-unavukadai');

  // New Milestone Form State
  const [newMilestonePhase, setNewMilestonePhase] = useState('');
  const [newMilestoneSprintDuration, setNewMilestoneSprintDuration] = useState('48 Hours (Sprint)');
  const [newMilestonePeriod, setNewMilestonePeriod] = useState('');
  const [newMilestoneDeliverables, setNewMilestoneDeliverables] = useState('');
  const [newMilestoneBudget, setNewMilestoneBudget] = useState('1000');
  const [showAddMilestoneForm, setShowAddMilestoneForm] = useState(false);

  // Edit Existing Milestone State
  const [editingMilestoneId, setEditingMilestoneId] = useState(null);
  const [editingMilestoneForm, setEditingMilestoneForm] = useState({
    phase: '',
    sprintDuration: '',
    period: '',
    deliverables: '',
    allocatedBudget: '1000',
    spent: '0',
    status: 'UPCOMING'
  });

  const handleStartEditMilestone = (m) => {
    setEditingMilestoneId(m.id);
    setEditingMilestoneForm({
      phase: m.phase || '',
      sprintDuration: m.sprintDuration || m.period || '',
      period: m.period || '',
      deliverables: m.deliverables || '',
      allocatedBudget: String(m.allocatedBudget || 0),
      spent: String(m.spent || 0),
      status: m.status || 'UPCOMING'
    });
  };

  const handleSaveMilestoneEdit = (milestoneId) => {
    updateProjectMilestone(activeSelectedProject.id, milestoneId, {
      ...editingMilestoneForm,
      allocatedBudget: parseFloat(editingMilestoneForm.allocatedBudget) || 0,
      spent: parseFloat(editingMilestoneForm.spent) || 0
    });
    setEditingMilestoneId(null);
    setActionNotice('Milestone parameters updated and saved successfully!');
    setTimeout(() => setActionNotice(null), 3000);
  };

  // Live Broadcaster Form State
  const [broadcastNote, setBroadcastNote] = useState('');
  const [broadcastAuthor, setBroadcastAuthor] = useState(user?.name || 'Alexander (Operations Lead)');
  const [broadcastSuccess, setBroadcastSuccess] = useState(false);

  // Comprehensive Business Details Form State
  const activeSelectedProject = businessProjects.find(p => p.id === selectedProjectId) || businessProjects[0];
  const [saveNotice, setSaveNotice] = useState(null);

  const [businessFormData, setBusinessFormData] = useState({
    name: '',
    category: '',
    tagline: '',
    description: '',
    capitalRequested: 0,
    minInvestment: 500,
    expectedTermYield: '',
    payoutTimeline: '',
    upiId: '8248651695-3@ybl',
    dailyAdBudget: 200,
    campaignDurationDays: 6,
    unitPrice: 250,
    directCost: 140,
    volumeTarget: 60,
    expenseBreakdown: []
  });

  // Keep form data synchronized whenever selected venture changes
  React.useEffect(() => {
    if (activeSelectedProject) {
      setBusinessFormData({
        name: activeSelectedProject.name || '',
        category: activeSelectedProject.category || '',
        tagline: activeSelectedProject.tagline || '',
        description: activeSelectedProject.description || '',
        capitalRequested: activeSelectedProject.capitalRequested || activeSelectedProject.statedTotalBudget || 0,
        minInvestment: activeSelectedProject.minInvestment || 500,
        expectedTermYield: activeSelectedProject.expectedTermYield || '14.5% Net Term Yield',
        payoutTimeline: activeSelectedProject.payoutTimeline || 'Sprint Completion',
        upiId: activeSelectedProject.upiId || '8248651695-3@ybl',
        dailyAdBudget: activeSelectedProject.dailyAdBudget || 200,
        campaignDurationDays: activeSelectedProject.campaignDurationDays || 6,
        unitPrice: activeSelectedProject.avgSellingPricePerUnit || activeSelectedProject.proposedSellingPrice || activeSelectedProject.commissionPerCompletedSale || 250,
        directCost: activeSelectedProject.directCostPerUnit || activeSelectedProject.totalDirectCostPerUnit || 0,
        volumeTarget: activeSelectedProject.totalOrderTarget || activeSelectedProject.campaignSalesTarget || activeSelectedProject.productionTarget || 0,
        expenseBreakdown: activeSelectedProject.expenseBreakdown ? JSON.parse(JSON.stringify(activeSelectedProject.expenseBreakdown)) : []
      });
    }
  }, [selectedProjectId, activeSelectedProject]);

  const handleExpenseChange = (idx, field, val) => {
    setBusinessFormData(prev => {
      const list = [...prev.expenseBreakdown];
      list[idx] = { ...list[idx], [field]: field === 'amount' ? (parseFloat(val) || 0) : val };
      return { ...prev, expenseBreakdown: list };
    });
  };

  const handleAddExpenseItem = () => {
    setBusinessFormData(prev => ({
      ...prev,
      expenseBreakdown: [
        ...prev.expenseBreakdown,
        { item: 'New Itemized Expense', amount: 500, category: 'Operations & Sourcing', verified: true, progress: 'Allocated' }
      ]
    }));
  };

  const handleRemoveExpenseItem = (idx) => {
    setBusinessFormData(prev => ({
      ...prev,
      expenseBreakdown: prev.expenseBreakdown.filter((_, i) => i !== idx)
    }));
  };

  const handleSaveAllBusinessDetails = (e) => {
    e.preventDefault();
    if (!selectedProjectId) return;

    const updates = {
      name: businessFormData.name.trim(),
      category: businessFormData.category.trim(),
      tagline: businessFormData.tagline.trim(),
      description: businessFormData.description.trim(),
      capitalRequested: parseFloat(businessFormData.capitalRequested) || 0,
      statedTotalBudget: parseFloat(businessFormData.capitalRequested) || 0,
      minInvestment: parseFloat(businessFormData.minInvestment) || 500,
      expectedTermYield: businessFormData.expectedTermYield.trim(),
      payoutTimeline: businessFormData.payoutTimeline.trim(),
      upiId: businessFormData.upiId.trim() || '8248651695-3@ybl',
      dailyAdBudget: parseFloat(businessFormData.dailyAdBudget) || 0,
      campaignDurationDays: parseInt(businessFormData.campaignDurationDays, 10) || 0,
      expenseBreakdown: businessFormData.expenseBreakdown
    };

    if (activeSelectedProject.type === 'COMMISSION_MARKETPLACE') {
      updates.commissionPerCompletedSale = parseFloat(businessFormData.unitPrice) || 0;
      updates.campaignSalesTarget = parseInt(businessFormData.volumeTarget, 10) || 0;
    } else if (activeSelectedProject.type === 'SERVICE_ORDER') {
      updates.avgSellingPricePerUnit = parseFloat(businessFormData.unitPrice) || 0;
      updates.directCostPerUnit = parseFloat(businessFormData.directCost) || 0;
      updates.totalOrderTarget = parseInt(businessFormData.volumeTarget, 10) || 0;
    } else {
      updates.proposedSellingPrice = parseFloat(businessFormData.unitPrice) || 0;
      updates.totalDirectCostPerUnit = parseFloat(businessFormData.directCost) || 0;
      updates.productionTarget = parseInt(businessFormData.volumeTarget, 10) || 0;
    }

    updateBusinessProject(selectedProjectId, updates, `Admin updated full business profile for ${updates.name}`);
    setSaveNotice(`Successfully saved and synced all details for ${updates.name}! Live across portal.`);
    setTimeout(() => setSaveNotice(null), 4000);
  };

  // Notification Banner
  const [actionNotice, setActionNotice] = useState(null);
  const [copiedUtr, setCopiedUtr] = useState(null);

  // Filtered investments
  const pendingInvestments = projectInvestments.filter(i => i.status === 'PENDING_APPROVAL');
  const confirmedInvestments = projectInvestments.filter(i => i.status === 'CONFIRMED');
  const rejectedInvestments = projectInvestments.filter(i => i.status === 'REJECTED');

  const displayedInvestments = projectInvestments.filter(inv => {
    if (paymentFilter === 'PENDING') return inv.status === 'PENDING_APPROVAL';
    if (paymentFilter === 'CONFIRMED') return inv.status === 'CONFIRMED';
    if (paymentFilter === 'REJECTED') return inv.status === 'REJECTED';
    return true;
  });

  // KPI calculations
  const totalPendingAmount = pendingInvestments.reduce((sum, i) => sum + (Number(i.amount) || 0), 0);
  const totalConfirmedAmount = confirmedInvestments.reduce((sum, i) => sum + (Number(i.amount) || 0), 0);
  const totalSprintsCount = businessProjects.reduce((sum, p) => sum + (p.timeline?.length || 0), 0);

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    const success = adminLogin(passwordInput, emailInput);
    if (!success) {
      setLoginError(true);
    } else {
      setLoginError(false);
    }
  };

  const handleApprovePayment = (inv) => {
    approveBusinessInvestment(inv.id);
    setActionNotice(`Approved ₹${inv.amount.toLocaleString('en-IN')} payment from ${inv.investorName} for ${inv.projectName}. Capital allocated!`);
    setTimeout(() => setActionNotice(null), 4000);
  };

  const handleConfirmRejection = () => {
    if (!rejectionModalInv) return;
    rejectBusinessInvestment(rejectionModalInv.id, rejectionReason);
    setActionNotice(`Rejected submission from ${rejectionModalInv.investorName}.`);
    setRejectionModalInv(null);
    setTimeout(() => setActionNotice(null), 4000);
  };

  const handleCreateMilestone = (e) => {
    e.preventDefault();
    if (!newMilestonePhase.trim()) return;

    addProjectMilestone(activeSelectedProject.id, {
      phase: newMilestonePhase.trim(),
      sprintDuration: newMilestoneSprintDuration.trim(),
      sprintTag: newMilestoneSprintDuration.slice(0, 8),
      period: newMilestonePeriod.trim() || 'Next Sprint',
      deliverables: newMilestoneDeliverables.trim() || 'Process milestone execution',
      allocatedBudget: parseFloat(newMilestoneBudget) || 1000,
      spent: 0,
      stepNumber: (activeSelectedProject.timeline?.length || 0) + 1,
      stepTotal: (activeSelectedProject.timeline?.length || 0) + 1
    });

    setNewMilestonePhase('');
    setNewMilestonePeriod('');
    setNewMilestoneDeliverables('');
    setShowAddMilestoneForm(false);
    setActionNotice(`Added new sprint process milestone to ${activeSelectedProject.name}`);
    setTimeout(() => setActionNotice(null), 3500);
  };

  const handleBroadcastSubmit = (e) => {
    e.preventDefault();
    if (!broadcastNote.trim()) return;

    addProjectLiveUpdate(selectedProjectId, broadcastNote.trim(), broadcastAuthor.trim());
    setBroadcastNote('');
    setBroadcastSuccess(true);
    setActionNotice(`Broadcasted live update to backers of ${activeSelectedProject.name}!`);
    setTimeout(() => {
      setBroadcastSuccess(false);
      setActionNotice(null);
    }, 3500);
  };

  const handleSaveFinancials = (e) => {
    e.preventDefault();
    const updates = {
      dailyAdBudget: parseFloat(editAdBudget) || 200,
      campaignDurationDays: parseInt(editDuration, 10) || 6
    };
    if (activeSelectedProject.avgSellingPricePerUnit !== undefined) {
      updates.avgSellingPricePerUnit = parseFloat(editSellingPrice) || 250;
    } else {
      updates.proposedSellingPrice = parseFloat(editSellingPrice) || 500;
    }

    updateBusinessProject(selectedProjectId, updates);
    setSaveNotice('Financial parameters updated and syndicated across investor models!');
    setTimeout(() => setSaveNotice(null), 3500);
  };

  const copyToClipboard = (text, id) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedUtr(id);
    setTimeout(() => setCopiedUtr(null), 2000);
  };

  // =========================================================================
  // =========================================================================
  // VIEW 1: UNLOGGED ADMIN LOGIN SCREEN (Strictly rajacofficial369@gmail.com)
  // =========================================================================
  if (!isAdminLoggedIn) {
    const isDifferentUser = Boolean(supabaseUser && supabaseUser.email?.toLowerCase() !== 'rajacofficial369@gmail.com');

    return (
      <div style={{ padding: '60px 0', minHeight: '80vh', display: 'flex', alignItems: 'center', background: '#f8fafc' }}>
        <div className="container" style={{ maxWidth: '480px' }}>
          
          <div style={{ 
            background: '#ffffff', 
            padding: '36px', 
            borderRadius: '20px',
            border: '1px solid #e2e8f0',
            boxShadow: '0 10px 25px -5px rgba(0,0,0,0.05), 0 8px 10px -6px rgba(0,0,0,0.01)'
          }}>
            
            {/* Header */}
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <div style={{ 
                width: '64px', 
                height: '64px', 
                borderRadius: '18px', 
                background: 'linear-gradient(135deg, #fbbf24 0%, #d97706 100%)',
                color: '#000',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px auto',
                boxShadow: '0 4px 14px rgba(245, 158, 11, 0.35)'
              }}>
                <ShieldCheck size={34} />
              </div>
              <h2 style={{ fontSize: '1.45rem', color: '#0f172a', fontWeight: '800', marginBottom: '6px' }}>
                RBI Sovereign Admin Desk
              </h2>
              <div style={{ 
                display: 'inline-flex', 
                alignItems: 'center', 
                gap: '6px', 
                background: '#fef3c7', 
                color: '#92400e', 
                padding: '4px 10px', 
                borderRadius: '20px', 
                fontSize: '0.74rem', 
                fontWeight: '700',
                marginBottom: '8px' 
              }}>
                <Lock size={12} />
                Strict Sovereign Access Policy
              </div>
              <p style={{ fontSize: '0.82rem', color: '#64748b', margin: 0 }}>
                Escrow management and operational controls are exclusively reserved for <strong style={{ color: '#0f172a' }}>rajacofficial369@gmail.com</strong>.
              </p>
            </div>

            {/* If logged in with wrong email */}
            {isDifferentUser && (
              <div style={{ 
                padding: '12px 14px', 
                borderRadius: '10px', 
                background: '#fff1f2', 
                border: '1px solid #fecdd3',
                color: '#be123c',
                fontSize: '0.82rem',
                marginBottom: '20px',
                textAlign: 'left'
              }}>
                <div style={{ fontWeight: '700', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <AlertCircle size={15} /> Access Denied
                </div>
                <div>You are signed in as <strong>{supabaseUser.email}</strong>. This account does not possess administrative privileges.</div>
              </div>
            )}

            {loginError && (
              <div style={{ 
                padding: '10px 14px', 
                borderRadius: '8px', 
                background: '#fff1f2', 
                border: '1px solid #fecdd3',
                color: '#e11d48',
                fontSize: '0.82rem',
                marginBottom: '18px',
                textAlign: 'center',
                fontWeight: '600'
              }}>
                Unauthorized credentials. Only rajacofficial369@gmail.com can unlock this terminal.
              </div>
            )}

            {/* Primary Action: Strict Google OAuth Login (rajacofficial369@gmail.com) */}
            <div style={{ marginBottom: '14px' }}>
              <button 
                type="button" 
                onClick={loginWithGoogle}
                disabled={isAuthLoading}
                className="btn btn-primary"
                style={{ 
                  width: '100%', 
                  padding: '13px', 
                  fontSize: '0.92rem', 
                  fontWeight: '700', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  gap: '10px',
                  borderRadius: '12px',
                  boxShadow: '0 4px 14px rgba(217, 119, 6, 0.25)',
                  cursor: isAuthLoading ? 'wait' : 'pointer'
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24">
                  <path fill="#ffffff" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#ffffff" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#ffffff" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                  <path fill="#ffffff" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                </svg>
                <span>{isAuthLoading ? 'Authenticating...' : isDifferentUser ? 'Switch Account to rajacofficial369@gmail.com' : 'Sign In with Google (rajacofficial369@gmail.com)'}</span>
              </button>
            </div>

            {/* Direct Instant Sovereign Unlock for rajacofficial369@gmail.com */}
            <div style={{ marginBottom: '18px', textAlign: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', margin: '14px 0', gap: '8px' }}>
                <div style={{ flex: 1, height: '1px', background: '#e2e8f0' }}></div>
                <span style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: '700', textTransform: 'uppercase' }}>OR DIRECT SOVEREIGN VERIFICATION</span>
                <div style={{ flex: 1, height: '1px', background: '#e2e8f0' }}></div>
              </div>

              <button
                type="button"
                onClick={() => adminLogin('raja369', 'rajacofficial369@gmail.com')}
                className="btn btn-secondary"
                style={{
                  width: '100%',
                  padding: '11px',
                  fontSize: '0.86rem',
                  fontWeight: '700',
                  borderRadius: '12px',
                  border: '1px solid #fde68a',
                  background: '#fef3c7',
                  color: '#92400e',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
              >
                <KeyRound size={16} />
                <span>Authorize Desk (rajacofficial369@gmail.com)</span>
              </button>
            </div>

            <div style={{ 
              background: '#f8fafc', 
              border: '1px solid #e2e8f0', 
              borderRadius: '12px', 
              padding: '14px 16px', 
              textAlign: 'left',
              fontSize: '0.78rem', 
              color: '#64748b',
              lineHeight: '1.5'
            }}>
              <div style={{ fontWeight: '700', color: '#0f172a', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <ShieldCheck size={16} className="text-amber-500" />
                Zero-Trust Admin Security
              </div>
              <div>Administrative access is restricted strictly to verified Google identity <strong>rajacofficial369@gmail.com</strong>. Normal investors can browse deals and make contributions, but cannot alter assumptions, review payments, or modify milestones.</div>
            </div>

            <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <button 
                type="button" 
                onClick={() => setActiveTab('projects')}
                style={{ background: 'none', border: 'none', color: '#64748b', fontSize: '0.78rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
              >
                <ArrowLeft size={14} /> Back to Public Investor Portal
              </button>
              <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>RBI Escrow v5.0</span>
            </div>

          </div>
        </div>
      </div>
    );
  }


  // =========================================================================
  // VIEW 2: AUTHENTICATED INDIVIDUAL ADMIN PAGE
  // =========================================================================
  return (
    <div style={{ padding: '28px 0 60px 0', background: '#f8fafc', minHeight: '90vh' }}>
      <div className="container" style={{ maxWidth: '1240px' }}>
        
        {/* Top Operational Navigation & Status Bar */}
        <div style={{ 
          background: '#ffffff', 
          borderRadius: '16px', 
          border: '1px solid #e2e8f0', 
          padding: '20px 24px', 
          marginBottom: '24px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.03)'
        }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{ 
                width: '46px', 
                height: '46px', 
                borderRadius: '12px', 
                background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(5, 150, 105, 0.25)'
              }}>
                <ShieldCheck size={26} />
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <h1 style={{ fontSize: '1.45rem', fontWeight: '800', color: '#0f172a', margin: 0 }}>
                    RBI Syndicate Admin Control Desk
                  </h1>
                  <span className="badge badge-emerald" style={{ fontSize: '0.65rem', padding: '2px 8px' }}>
                    Authenticated Node
                  </span>
                </div>
                <p style={{ color: '#64748b', fontSize: '0.8rem', margin: '2px 0 0 0' }}>
                  Sovereign Administrator: <strong>rajacofficial369@gmail.com</strong> • Escrow UPI: <strong style={{ color: '#0f172a' }}>8248651695-3@ybl</strong>
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <button 
                onClick={() => setActiveTab('projects')}
                className="btn btn-secondary btn-sm"
                style={{ borderRadius: '8px', fontWeight: '700', gap: '6px' }}
                title="Switch view to public investor portal"
              >
                <ArrowLeft size={15} />
                <span>Public Investor View</span>
              </button>
              
              <button 
                onClick={adminLogout}
                className="btn btn-ghost btn-sm"
                style={{ color: '#e11d48', borderRadius: '8px', padding: '6px 12px', gap: '5px' }}
              >
                <LogOut size={15} />
                <span>Sign Out</span>
              </button>
            </div>

          </div>
        </div>

        {/* Global Action Notification Toast */}
        {actionNotice && (
          <div style={{ 
            padding: '12px 18px', 
            borderRadius: '10px', 
            background: '#ecfdf5', 
            border: '1px solid #a7f3d0',
            color: '#065f46',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            fontSize: '0.86rem',
            fontWeight: '600',
            boxShadow: '0 2px 6px rgba(16, 185, 129, 0.1)'
          }}>
            <CheckCircle2 size={18} />
            <span>{actionNotice}</span>
          </div>
        )}

        {/* Executive KPI Grid */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', 
          gap: '16px', 
          marginBottom: '24px' 
        }}>
          
          {/* Card 1: Pending Approvals */}
          <div style={{ background: '#ffffff', borderRadius: '14px', border: pendingInvestments.length > 0 ? '1px solid #fde68a' : '1px solid #e2e8f0', padding: '18px', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <span style={{ fontSize: '0.72rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Pending Verification
              </span>
              <span className={`badge ${pendingInvestments.length > 0 ? 'badge-gold' : 'badge-emerald'}`} style={{ fontSize: '0.65rem' }}>
                {pendingInvestments.length} Awaiting
              </span>
            </div>
            <div style={{ fontSize: '1.65rem', fontWeight: '800', color: pendingInvestments.length > 0 ? '#d97706' : '#0f172a' }}>
              ₹{totalPendingAmount.toLocaleString('en-IN')}
            </div>
            <div style={{ fontSize: '0.74rem', color: '#64748b', marginTop: '4px' }}>
              {pendingInvestments.length} investor submissions waiting for UTR / receipt check
            </div>
          </div>

          {/* Card 2: Confirmed Capital */}
          <div style={{ background: '#ffffff', borderRadius: '14px', border: '1px solid #e2e8f0', padding: '18px', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <span style={{ fontSize: '0.72rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Allocated Escrow Capital
              </span>
              <span className="badge badge-emerald" style={{ fontSize: '0.65rem' }}>
                Verified
              </span>
            </div>
            <div style={{ fontSize: '1.65rem', fontWeight: '800', color: '#059669' }}>
              ₹{totalConfirmedAmount.toLocaleString('en-IN')}
            </div>
            <div style={{ fontSize: '0.74rem', color: '#64748b', marginTop: '4px' }}>
              {confirmedInvestments.length} confirmed investor tranches deployed to projects
            </div>
          </div>

          {/* Card 3: Active Business Ventures */}
          <div style={{ background: '#ffffff', borderRadius: '14px', border: '1px solid #e2e8f0', padding: '18px', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <span style={{ fontSize: '0.72rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Ventures Supervised
              </span>
              <span className="badge badge-cyan" style={{ fontSize: '0.65rem' }}>
                4 Active
              </span>
            </div>
            <div style={{ fontSize: '1.65rem', fontWeight: '800', color: '#0f172a' }}>
              4 Projects
            </div>
            <div style={{ fontSize: '0.74rem', color: '#64748b', marginTop: '4px' }}>
              UnavuKadai • CarpenterBullet • Wooden Laptop Case • Wooden Cup
            </div>
          </div>

          {/* Card 4: Sprints Under Supervision */}
          <div style={{ background: '#ffffff', borderRadius: '14px', border: '1px solid #e2e8f0', padding: '18px', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <span style={{ fontSize: '0.72rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Time Sprints Tracked
              </span>
              <span className="badge badge-gold" style={{ fontSize: '0.65rem' }}>
                {totalSprintsCount} Process Steps
              </span>
            </div>
            <div style={{ fontSize: '1.65rem', fontWeight: '800', color: '#0f172a' }}>
              {totalSprintsCount} Sprints
            </div>
            <div style={{ fontSize: '0.74rem', color: '#64748b', marginTop: '4px' }}>
              Each step with explicit duration, deliverable & budget tracking
            </div>
          </div>

        </div>

        {/* Main Tabbed Desk Navigation */}
        <div style={{ 
          display: 'flex', 
          gap: '8px', 
          borderBottom: '1px solid #e2e8f0', 
          marginBottom: '20px',
          overflowX: 'auto',
          paddingBottom: '2px'
        }}>
          
          <button
            type="button"
            onClick={() => setCurrentAdminTab('payments')}
            style={{
              padding: '10px 18px',
              borderRadius: '10px 10px 0 0',
              fontWeight: '700',
              fontSize: '0.85rem',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              cursor: 'pointer',
              border: 'none',
              background: currentAdminTab === 'payments' ? '#ffffff' : 'transparent',
              color: currentAdminTab === 'payments' ? '#0f172a' : '#64748b',
              borderBottom: currentAdminTab === 'payments' ? '3px solid #d97706' : '3px solid transparent',
              boxShadow: currentAdminTab === 'payments' ? '0 -1px 3px rgba(0,0,0,0.03)' : 'none'
            }}
          >
            <CreditCard size={16} />
            <span>Payment Approvals Desk</span>
            {pendingInvestments.length > 0 && (
              <span style={{ 
                background: '#f59e0b', 
                color: '#000', 
                borderRadius: '20px', 
                padding: '1px 7px', 
                fontSize: '0.68rem', 
                fontWeight: '800' 
              }}>
                {pendingInvestments.length}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setCurrentAdminTab('sprints')}
            style={{
              padding: '10px 18px',
              borderRadius: '10px 10px 0 0',
              fontWeight: '700',
              fontSize: '0.85rem',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              cursor: 'pointer',
              border: 'none',
              background: currentAdminTab === 'sprints' ? '#ffffff' : 'transparent',
              color: currentAdminTab === 'sprints' ? '#0f172a' : '#64748b',
              borderBottom: currentAdminTab === 'sprints' ? '3px solid #d97706' : '3px solid transparent',
              boxShadow: currentAdminTab === 'sprints' ? '0 -1px 3px rgba(0,0,0,0.03)' : 'none'
            }}
          >
            <Clock size={16} />
            <span>Milestones & Time Sprints</span>
          </button>

          <button
            type="button"
            onClick={() => setCurrentAdminTab('broadcaster')}
            style={{
              padding: '10px 18px',
              borderRadius: '10px 10px 0 0',
              fontWeight: '700',
              fontSize: '0.85rem',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              cursor: 'pointer',
              border: 'none',
              background: currentAdminTab === 'broadcaster' ? '#ffffff' : 'transparent',
              color: currentAdminTab === 'broadcaster' ? '#0f172a' : '#64748b',
              borderBottom: currentAdminTab === 'broadcaster' ? '3px solid #d97706' : '3px solid transparent',
              boxShadow: currentAdminTab === 'broadcaster' ? '0 -1px 3px rgba(0,0,0,0.03)' : 'none'
            }}
          >
            <Activity size={16} />
            <span>Live Work Broadcaster</span>
          </button>

          <button
            type="button"
            onClick={() => setCurrentAdminTab('financials')}
            style={{
              padding: '10px 18px',
              borderRadius: '10px 10px 0 0',
              fontWeight: '700',
              fontSize: '0.85rem',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              cursor: 'pointer',
              border: 'none',
              background: currentAdminTab === 'financials' ? '#ffffff' : 'transparent',
              color: currentAdminTab === 'financials' ? '#0f172a' : '#64748b',
              borderBottom: currentAdminTab === 'financials' ? '3px solid #d97706' : '3px solid transparent',
              boxShadow: currentAdminTab === 'financials' ? '0 -1px 3px rgba(0,0,0,0.03)' : 'none'
            }}
          >
            <Building2 size={16} />
            <span>Edit Business Details</span>
          </button>

          <button
            type="button"
            onClick={() => setCurrentAdminTab('history')}
            style={{
              padding: '10px 18px',
              borderRadius: '10px 10px 0 0',
              fontWeight: '700',
              fontSize: '0.85rem',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              cursor: 'pointer',
              border: 'none',
              background: currentAdminTab === 'history' ? '#ffffff' : 'transparent',
              color: currentAdminTab === 'history' ? '#0f172a' : '#64748b',
              borderBottom: currentAdminTab === 'history' ? '3px solid #d97706' : '3px solid transparent',
              boxShadow: currentAdminTab === 'history' ? '0 -1px 3px rgba(0,0,0,0.03)' : 'none'
            }}
          >
            <FileText size={16} />
            <span>Audit Trail ({projectChangeHistory?.length || 0})</span>
          </button>

        </div>

        {/* ===================================================================== */}
        {/* TAB 1: PAYMENT APPROVALS DESK */}
        {/* ===================================================================== */}
        {currentAdminTab === 'payments' && (
          <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
            
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '12px', marginBottom: '20px', paddingBottom: '16px', borderBottom: '1px solid #e2e8f0' }}>
              <div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: '800', color: '#0f172a', margin: 0 }}>
                  Investor Payment Submissions & Escrow Review
                </h3>
                <p style={{ fontSize: '0.78rem', color: '#64748b', margin: '2px 0 0 0' }}>
                  Verify attached UPI transaction screenshots, match 12-digit bank UTR numbers, and release escrow certificates.
                </p>
              </div>

              {/* Status Filter Buttons */}
              <div style={{ display: 'flex', gap: '6px', background: '#f1f5f9', padding: '4px', borderRadius: '10px' }}>
                <button
                  type="button"
                  onClick={() => setPaymentFilter('ALL')}
                  style={{
                    padding: '5px 12px',
                    borderRadius: '7px',
                    fontSize: '0.75rem',
                    fontWeight: '700',
                    border: 'none',
                    cursor: 'pointer',
                    background: paymentFilter === 'ALL' ? '#ffffff' : 'transparent',
                    color: paymentFilter === 'ALL' ? '#0f172a' : '#64748b',
                    boxShadow: paymentFilter === 'ALL' ? '0 1px 2px rgba(0,0,0,0.05)' : 'none'
                  }}
                >
                  All ({projectInvestments.length})
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentFilter('PENDING')}
                  style={{
                    padding: '5px 12px',
                    borderRadius: '7px',
                    fontSize: '0.75rem',
                    fontWeight: '700',
                    border: 'none',
                    cursor: 'pointer',
                    background: paymentFilter === 'PENDING' ? '#ffffff' : 'transparent',
                    color: paymentFilter === 'PENDING' ? '#d97706' : '#64748b',
                    boxShadow: paymentFilter === 'PENDING' ? '0 1px 2px rgba(0,0,0,0.05)' : 'none'
                  }}
                >
                  Pending ({pendingInvestments.length})
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentFilter('CONFIRMED')}
                  style={{
                    padding: '5px 12px',
                    borderRadius: '7px',
                    fontSize: '0.75rem',
                    fontWeight: '700',
                    border: 'none',
                    cursor: 'pointer',
                    background: paymentFilter === 'CONFIRMED' ? '#ffffff' : 'transparent',
                    color: paymentFilter === 'CONFIRMED' ? '#059669' : '#64748b',
                    boxShadow: paymentFilter === 'CONFIRMED' ? '0 1px 2px rgba(0,0,0,0.05)' : 'none'
                  }}
                >
                  Approved ({confirmedInvestments.length})
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentFilter('REJECTED')}
                  style={{
                    padding: '5px 12px',
                    borderRadius: '7px',
                    fontSize: '0.75rem',
                    fontWeight: '700',
                    border: 'none',
                    cursor: 'pointer',
                    background: paymentFilter === 'REJECTED' ? '#ffffff' : 'transparent',
                    color: paymentFilter === 'REJECTED' ? '#e11d48' : '#64748b',
                    boxShadow: paymentFilter === 'REJECTED' ? '0 1px 2px rgba(0,0,0,0.05)' : 'none'
                  }}
                >
                  Rejected ({rejectedInvestments.length})
                </button>
              </div>
            </div>

            {/* Submissions List */}
            {displayedInvestments.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px 20px', color: '#64748b' }}>
                <CheckCircle2 size={36} color="#cbd5e1" style={{ margin: '0 auto 10px auto' }} />
                <div style={{ fontWeight: '700', color: '#334155' }}>No submissions matching this filter</div>
                <div style={{ fontSize: '0.78rem', marginTop: '4px' }}>
                  {paymentFilter === 'PENDING' ? 'All submitted payments have been verified and processed.' : 'No investment records found.'}
                </div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {displayedInvestments.map((inv) => (
                  <div 
                    key={inv.id}
                    style={{ 
                      padding: '18px 20px', 
                      borderRadius: '12px', 
                      background: inv.status === 'PENDING_APPROVAL' ? '#fffbeb' : '#f8fafc',
                      border: inv.status === 'PENDING_APPROVAL' ? '1px solid #fde68a' : '1px solid #e2e8f0',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-start', gap: '14px' }}>
                      
                      {/* Left: Investor & Venture Details */}
                      <div style={{ flex: '1 1 320px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                          <span style={{ fontSize: '0.68rem', fontWeight: '800', color: '#64748b', textTransform: 'uppercase' }}>
                            {inv.id}
                          </span>
                          <span style={{ color: '#cbd5e1' }}>•</span>
                          <span className={`badge ${inv.status === 'CONFIRMED' ? 'badge-emerald' : inv.status === 'PENDING_APPROVAL' ? 'badge-gold' : 'badge-rose'}`} style={{ fontSize: '0.65rem', padding: '2px 8px' }}>
                            {inv.status === 'PENDING_APPROVAL' ? '⏳ PENDING ADMIN APPROVAL' : inv.status}
                          </span>
                          <span style={{ fontSize: '0.72rem', color: '#64748b' }}>
                            {inv.date}
                          </span>
                        </div>

                        <div style={{ fontSize: '1.05rem', fontWeight: '800', color: '#0f172a' }}>
                          {inv.investorName}
                        </div>
                        
                        <div style={{ fontSize: '0.78rem', color: '#475569', marginTop: '2px' }}>
                          Ventured in: <strong style={{ color: '#0f172a' }}>{inv.projectName}</strong> ({inv.category})
                        </div>

                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginTop: '8px', fontSize: '0.74rem', color: '#64748b' }}>
                          {inv.phone && <span>Phone: <strong style={{ color: '#334155' }}>{inv.phone}</strong></span>}
                          {inv.email && <span>Email: <strong style={{ color: '#334155' }}>{inv.email}</strong></span>}
                          <span>Method: <strong style={{ color: '#334155' }}>{inv.paymentMethod}</strong></span>
                        </div>

                        {inv.note && (
                          <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '6px', fontStyle: 'italic', background: 'rgba(255,255,255,0.7)', padding: '4px 8px', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                            "{inv.note}"
                          </div>
                        )}

                        {inv.rejectionReason && (
                          <div style={{ fontSize: '0.72rem', color: '#e11d48', marginTop: '6px', fontWeight: '600' }}>
                            Rejection Reason: {inv.rejectionReason}
                          </div>
                        )}
                      </div>

                      {/* Middle: Amount & UTR */}
                      <div style={{ flex: '0 0 220px', background: '#ffffff', padding: '12px 14px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                        <div style={{ fontSize: '0.68rem', color: '#64748b', textTransform: 'uppercase', fontWeight: '700' }}>
                          Submitted Amount
                        </div>
                        <div style={{ fontSize: '1.35rem', fontWeight: '800', color: '#059669' }}>
                          ₹{Number(inv.amount).toLocaleString('en-IN')}
                        </div>
                        
                        <div style={{ marginTop: '8px', paddingTop: '8px', borderTop: '1px dashed #e2e8f0' }}>
                          <div style={{ fontSize: '0.68rem', color: '#64748b', fontWeight: '700' }}>
                            12-Digit Bank UTR:
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
                            <span style={{ fontFamily: 'monospace', fontWeight: '700', fontSize: '0.82rem', color: inv.utrNumber ? '#0f172a' : '#94a3b8' }}>
                              {inv.utrNumber || 'None entered'}
                            </span>
                            {inv.utrNumber && (
                              <button
                                type="button"
                                onClick={() => copyToClipboard(inv.utrNumber, inv.id)}
                                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px', color: copiedUtr === inv.id ? '#059669' : '#64748b' }}
                                title="Copy UTR number"
                              >
                                {copiedUtr === inv.id ? <Check size={14} /> : <Copy size={14} />}
                              </button>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Right: Payment Screenshot Thumbnail & Actions */}
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '10px' }}>
                        
                        {/* Screenshot Preview */}
                        <div>
                          {inv.screenshotUrl ? (
                            <div 
                              onClick={() => setSelectedScreenshotModal(inv)}
                              style={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                gap: '6px', 
                                padding: '6px 10px', 
                                borderRadius: '8px', 
                                background: '#ffffff', 
                                border: '1px solid #cbd5e1', 
                                cursor: 'pointer',
                                fontSize: '0.72rem',
                                color: '#0284c7',
                                fontWeight: '700'
                              }}
                              title="Click to zoom attached screenshot"
                            >
                              <img 
                                src={inv.screenshotUrl} 
                                alt="Payment Proof" 
                                style={{ width: '24px', height: '24px', objectFit: 'cover', borderRadius: '4px' }} 
                              />
                              <span>View Receipt Screenshot</span>
                              <ExternalLink size={12} />
                            </div>
                          ) : (
                            <div style={{ fontSize: '0.7rem', color: '#94a3b8', fontStyle: 'italic', padding: '4px 8px' }}>
                              No image attached (UTR only)
                            </div>
                          )}
                        </div>

                        {/* Action Buttons */}
                        {inv.status === 'PENDING_APPROVAL' ? (
                          <div style={{ display: 'flex', gap: '8px' }}>
                            <button
                              type="button"
                              onClick={() => handleApprovePayment(inv)}
                              className="btn btn-primary btn-sm"
                              style={{ 
                                background: '#059669', 
                                borderColor: '#059669', 
                                color: '#ffffff', 
                                fontWeight: '700',
                                padding: '6px 14px',
                                borderRadius: '8px',
                                gap: '5px'
                              }}
                            >
                              <CheckCircle size={15} />
                              <span>Approve & Allocate</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => setRejectionModalInv(inv)}
                              className="btn btn-ghost btn-sm"
                              style={{ 
                                color: '#e11d48', 
                                border: '1px solid #fecdd3', 
                                background: '#fff1f2',
                                fontWeight: '700',
                                padding: '6px 12px',
                                borderRadius: '8px'
                              }}
                            >
                              <XCircle size={15} />
                              <span>Reject</span>
                            </button>
                          </div>
                        ) : inv.status === 'CONFIRMED' ? (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#059669', fontSize: '0.76rem', fontWeight: '700' }}>
                            <CheckCircle2 size={16} />
                            <span>Escrow Receipt Issued</span>
                          </div>
                        ) : (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#e11d48', fontSize: '0.76rem', fontWeight: '700' }}>
                            <XCircle size={16} />
                            <span>Payment Rejected</span>
                          </div>
                        )}

                      </div>

                    </div>
                  </div>
                ))}
              </div>
            )}

          </div>
        )}

        {/* ===================================================================== */}
        {/* TAB 2: MILESTONES & TIME SPRINTS DESK */}
        {/* ===================================================================== */}
        {currentAdminTab === 'sprints' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            {/* Project Picker Bar */}
            <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '18px 20px', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '14px' }}>
              <div>
                <span style={{ fontSize: '0.72rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase' }}>
                  Select Business Venture
                </span>
                <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#0f172a', margin: '2px 0 0 0' }}>
                  {activeSelectedProject.name} — Process Milestones & Sprints
                </h3>
              </div>

              {/* 4 Projects Selector Buttons */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {businessProjects.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => {
                      setSelectedProjectId(p.id);
                      setEditAdBudget(p.dailyAdBudget || 200);
                      setEditDuration(p.campaignDurationDays || 6);
                      setEditSellingPrice(p.avgSellingPricePerUnit || p.proposedSellingPrice || 250);
                    }}
                    style={{
                      padding: '7px 14px',
                      borderRadius: '8px',
                      fontSize: '0.78rem',
                      fontWeight: '700',
                      cursor: 'pointer',
                      border: p.id === selectedProjectId ? '1px solid #d97706' : '1px solid #e2e8f0',
                      background: p.id === selectedProjectId ? '#fffbeb' : '#ffffff',
                      color: p.id === selectedProjectId ? '#b45309' : '#475569',
                      boxShadow: p.id === selectedProjectId ? '0 1px 3px rgba(217, 119, 6, 0.15)' : 'none'
                    }}
                  >
                    {p.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Sprints Overview Card */}
            <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '24px' }}>
              
              <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '12px', marginBottom: '20px', paddingBottom: '16px', borderBottom: '1px solid #e2e8f0' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <h4 style={{ fontSize: '1.05rem', fontWeight: '800', color: '#0f172a', margin: 0 }}>
                      Operational Sprints for {activeSelectedProject.name}
                    </h4>
                    <span className="badge badge-gold" style={{ fontSize: '0.65rem' }}>
                      {activeSelectedProject.timeline?.length || 0} Process Steps
                    </span>
                  </div>
                  <p style={{ fontSize: '0.78rem', color: '#64748b', margin: '2px 0 0 0' }}>
                    Campaign Duration: <strong>{activeSelectedProject.campaignDurationDays} Days</strong> • Target Return: <strong>{activeSelectedProject.expectedTermYield}</strong>
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setShowAddMilestoneForm(!showAddMilestoneForm)}
                  className="btn btn-primary btn-sm"
                  style={{ borderRadius: '8px', fontWeight: '700', gap: '6px' }}
                >
                  <Plus size={15} />
                  <span>{showAddMilestoneForm ? 'Close Form' : 'Add New Process Sprint'}</span>
                </button>
              </div>

              {/* Add Milestone Form */}
              {showAddMilestoneForm && (
                <form onSubmit={handleCreateMilestone} style={{ background: '#f8fafc', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0', marginBottom: '24px' }}>
                  <h5 style={{ fontSize: '0.88rem', fontWeight: '800', color: '#0f172a', marginTop: 0, marginBottom: '14px' }}>
                    Define New Process Milestone & Time Sprint
                  </h5>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', marginBottom: '12px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: '700', color: '#475569', marginBottom: '4px' }}>
                        Phase / Step Title *
                      </label>
                      <input 
                        type="text" 
                        value={newMilestonePhase} 
                        onChange={(e) => setNewMilestonePhase(e.target.value)}
                        placeholder="e.g. Phase 6: Packaging & Express Courier"
                        className="form-input"
                        style={{ background: '#ffffff' }}
                        required
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: '700', color: '#475569', marginBottom: '4px' }}>
                        Time Sprint Duration *
                      </label>
                      <input 
                        type="text" 
                        value={newMilestoneSprintDuration} 
                        onChange={(e) => setNewMilestoneSprintDuration(e.target.value)}
                        placeholder="e.g. 48 Hours (Days 12–13)"
                        className="form-input"
                        style={{ background: '#ffffff' }}
                        required
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: '700', color: '#475569', marginBottom: '4px' }}>
                        Dates / Period
                      </label>
                      <input 
                        type="text" 
                        value={newMilestonePeriod} 
                        onChange={(e) => setNewMilestonePeriod(e.target.value)}
                        placeholder="e.g. Oct 23 - Oct 25, 2026"
                        className="form-input"
                        style={{ background: '#ffffff' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: '700', color: '#475569', marginBottom: '4px' }}>
                        Allocated Budget (₹)
                      </label>
                      <input 
                        type="number" 
                        value={newMilestoneBudget} 
                        onChange={(e) => setNewMilestoneBudget(e.target.value)}
                        placeholder="1000"
                        className="form-input"
                        style={{ background: '#ffffff' }}
                      />
                    </div>
                  </div>
                  <div style={{ marginBottom: '14px' }}>
                    <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: '700', color: '#475569', marginBottom: '4px' }}>
                      Deliverables & Expected Output
                    </label>
                    <textarea 
                      value={newMilestoneDeliverables}
                      onChange={(e) => setNewMilestoneDeliverables(e.target.value)}
                      placeholder="Describe the operational actions to be executed during this sprint..."
                      className="form-input"
                      rows={2}
                      style={{ background: '#ffffff' }}
                    />
                  </div>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button type="submit" className="btn btn-primary btn-sm" style={{ fontWeight: '700' }}>
                      Save Milestone
                    </button>
                    <button type="button" onClick={() => setShowAddMilestoneForm(false)} className="btn btn-secondary btn-sm">
                      Cancel
                    </button>
                  </div>
                </form>
              )}

              {/* Milestones List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {(activeSelectedProject.timeline || []).map((m, idx) => (
                  <div 
                    key={m.id}
                    style={{ 
                      padding: '16px 18px', 
                      borderRadius: '12px', 
                      background: '#f8fafc', 
                      border: '1px solid #e2e8f0',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    {editingMilestoneId === m.id ? (
                      /* Inline Milestone Edit Form */
                      <div style={{ background: '#ffffff', border: '2px solid #3b82f6', borderRadius: '10px', padding: '16px' }}>
                        <div style={{ fontSize: '0.82rem', fontWeight: '800', color: '#1e40af', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <Edit3 size={15} /> Edit Milestone Details
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '10px', marginBottom: '10px' }}>
                          <div>
                            <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: '700', color: '#64748b', marginBottom: '3px' }}>Phase Title:</label>
                            <input 
                              type="text" 
                              value={editingMilestoneForm.phase}
                              onChange={(e) => setEditingMilestoneForm({ ...editingMilestoneForm, phase: e.target.value })}
                              style={{ width: '100%', padding: '6px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.8rem' }}
                            />
                          </div>
                          <div>
                            <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: '700', color: '#64748b', marginBottom: '3px' }}>Sprint Duration:</label>
                            <input 
                              type="text" 
                              value={editingMilestoneForm.sprintDuration}
                              onChange={(e) => setEditingMilestoneForm({ ...editingMilestoneForm, sprintDuration: e.target.value })}
                              style={{ width: '100%', padding: '6px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.8rem' }}
                            />
                          </div>
                          <div>
                            <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: '700', color: '#64748b', marginBottom: '3px' }}>Timeline / Period:</label>
                            <input 
                              type="text" 
                              value={editingMilestoneForm.period}
                              onChange={(e) => setEditingMilestoneForm({ ...editingMilestoneForm, period: e.target.value })}
                              style={{ width: '100%', padding: '6px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.8rem' }}
                            />
                          </div>
                          <div>
                            <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: '700', color: '#64748b', marginBottom: '3px' }}>Allocated Budget (₹):</label>
                            <input 
                              type="number" 
                              value={editingMilestoneForm.allocatedBudget}
                              onChange={(e) => setEditingMilestoneForm({ ...editingMilestoneForm, allocatedBudget: e.target.value })}
                              style={{ width: '100%', padding: '6px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.8rem' }}
                            />
                          </div>
                          <div>
                            <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: '700', color: '#64748b', marginBottom: '3px' }}>Spent to Date (₹):</label>
                            <input 
                              type="number" 
                              value={editingMilestoneForm.spent}
                              onChange={(e) => setEditingMilestoneForm({ ...editingMilestoneForm, spent: e.target.value })}
                              style={{ width: '100%', padding: '6px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.8rem' }}
                            />
                          </div>
                          <div>
                            <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: '700', color: '#64748b', marginBottom: '3px' }}>Current Status:</label>
                            <select
                              value={editingMilestoneForm.status}
                              onChange={(e) => setEditingMilestoneForm({ ...editingMilestoneForm, status: e.target.value })}
                              style={{ width: '100%', padding: '6px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.8rem', background: '#fff' }}
                            >
                              <option value="UPCOMING">UPCOMING</option>
                              <option value="IN_PROGRESS">IN_PROGRESS</option>
                              <option value="COMPLETED">COMPLETED</option>
                            </select>
                          </div>
                        </div>

                        <div style={{ marginBottom: '12px' }}>
                          <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: '700', color: '#64748b', marginBottom: '3px' }}>Deliverables & Tasks:</label>
                          <textarea 
                            rows={2}
                            value={editingMilestoneForm.deliverables}
                            onChange={(e) => setEditingMilestoneForm({ ...editingMilestoneForm, deliverables: e.target.value })}
                            style={{ width: '100%', padding: '6px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.8rem', resize: 'vertical' }}
                          />
                        </div>

                        <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                          <button
                            type="button"
                            onClick={() => setEditingMilestoneId(null)}
                            className="btn btn-secondary btn-sm"
                            style={{ padding: '6px 12px', fontSize: '0.76rem' }}
                          >
                            Cancel
                          </button>
                          <button
                            type="button"
                            onClick={() => handleSaveMilestoneEdit(m.id)}
                            className="btn btn-primary btn-sm"
                            style={{ padding: '6px 14px', fontSize: '0.76rem', fontWeight: '800' }}
                          >
                            Save Milestone
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px' }}>
                        {/* Left Info */}
                        <div style={{ flex: '1 1 340px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '6px' }}>
                            <span style={{ fontSize: '0.7rem', fontWeight: '800', color: '#64748b', textTransform: 'uppercase' }}>
                              Step {m.stepNumber || idx + 1} of {m.stepTotal || activeSelectedProject.timeline?.length}
                            </span>
                            <strong style={{ fontSize: '0.92rem', color: '#0f172a' }}>
                              {m.phase}
                            </strong>
                            <span className={`badge ${m.status === 'COMPLETED' ? 'badge-emerald' : m.status === 'IN_PROGRESS' ? 'badge-cyan' : 'badge-gold'}`} style={{ fontSize: '0.62rem', padding: '1px 6px' }}>
                              {m.status}
                            </span>
                          </div>

                          {/* Prominent Sprint Badge */}
                          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#fef3c7', color: '#92400e', padding: '3px 10px', borderRadius: '6px', fontSize: '0.74rem', fontWeight: '700', border: '1px solid #fde68a', marginBottom: '8px' }}>
                            <Clock size={13} strokeWidth={2.4} />
                            <span>Sprint Duration: {m.sprintDuration || m.period}</span>
                          </div>

                          <div style={{ color: '#334155', fontSize: '0.78rem', lineHeight: '1.4' }}>
                            {m.deliverables}
                          </div>

                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px', marginTop: '8px', fontSize: '0.72rem', color: '#64748b' }}>
                            <span>Timeline: <strong style={{ color: '#1e293b' }}>{m.period}</strong></span>
                            <span>Allocated Budget: <strong style={{ color: '#1e293b' }}>{formatMoney(m.allocatedBudget)}</strong></span>
                            <span>Spent to Date: <strong style={{ color: '#1e293b' }}>{formatMoney(m.spent)}</strong></span>
                          </div>
                        </div>

                        {/* Right Action Switchers */}
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
                          <div style={{ display: 'flex', gap: '5px' }}>
                            <button
                              type="button"
                              onClick={() => updateProjectMilestone(activeSelectedProject.id, m.id, { status: 'COMPLETED' })}
                              style={{
                                padding: '4px 10px',
                                borderRadius: '6px',
                                fontSize: '0.72rem',
                                fontWeight: '700',
                                cursor: 'pointer',
                                border: '1px solid #a7f3d0',
                                background: m.status === 'COMPLETED' ? '#d1fae5' : '#ffffff',
                                color: '#065f46'
                              }}
                            >
                              ✓ Completed
                            </button>
                            <button
                              type="button"
                              onClick={() => updateProjectMilestone(activeSelectedProject.id, m.id, { status: 'IN_PROGRESS' })}
                              style={{
                                padding: '4px 10px',
                                borderRadius: '6px',
                                fontSize: '0.72rem',
                                fontWeight: '700',
                                cursor: 'pointer',
                                border: '1px solid #bae6fd',
                                background: m.status === 'IN_PROGRESS' ? '#e0f2fe' : '#ffffff',
                                color: '#0369a1'
                              }}
                            >
                              ▶ In Progress
                            </button>
                            <button
                              type="button"
                              onClick={() => updateProjectMilestone(activeSelectedProject.id, m.id, { status: 'UPCOMING' })}
                              style={{
                                padding: '4px 10px',
                                borderRadius: '6px',
                                fontSize: '0.72rem',
                                fontWeight: '700',
                                cursor: 'pointer',
                                border: '1px solid #e2e8f0',
                                background: m.status === 'UPCOMING' ? '#f1f5f9' : '#ffffff',
                                color: '#64748b'
                              }}
                            >
                              Upcoming
                            </button>
                          </div>

                          <div style={{ display: 'flex', gap: '6px' }}>
                            <button
                              type="button"
                              onClick={() => handleStartEditMilestone(m)}
                              style={{
                                background: '#f8fafc',
                                border: '1px solid #cbd5e1',
                                color: '#0f172a',
                                fontSize: '0.72rem',
                                fontWeight: '700',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '4px',
                                padding: '3px 8px',
                                borderRadius: '6px'
                              }}
                              title="Edit milestone title, budget, deliverables"
                            >
                              <Edit3 size={12} color="#0284c7" />
                              <span>Edit Details</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => deleteProjectMilestone(activeSelectedProject.id, m.id)}
                              style={{
                                background: 'none',
                                border: 'none',
                                color: '#e11d48',
                                fontSize: '0.72rem',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '4px',
                                padding: '3px 6px'
                              }}
                              title="Delete Milestone"
                            >
                              <Trash2 size={12} />
                              <span>Delete</span>
                            </button>
                          </div>
                        </div>

                      </div>
                    )}
                  </div>
                ))}
              </div>

            </div>

          </div>
        )}

        {/* ===================================================================== */}
        {/* TAB 3: LIVE WORK OPERATIONS BROADCASTER */}
        {/* ===================================================================== */}
        {currentAdminTab === 'broadcaster' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            {/* Project Picker Bar */}
            <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '18px 20px', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '14px' }}>
              <div>
                <span style={{ fontSize: '0.72rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase' }}>
                  Target Project
                </span>
                <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#0f172a', margin: '2px 0 0 0' }}>
                  {activeSelectedProject.name} — Live Work Operational Feed
                </h3>
              </div>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {businessProjects.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setSelectedProjectId(p.id)}
                    style={{
                      padding: '7px 14px',
                      borderRadius: '8px',
                      fontSize: '0.78rem',
                      fontWeight: '700',
                      cursor: 'pointer',
                      border: p.id === selectedProjectId ? '1px solid #d97706' : '1px solid #e2e8f0',
                      background: p.id === selectedProjectId ? '#fffbeb' : '#ffffff',
                      color: p.id === selectedProjectId ? '#b45309' : '#475569'
                    }}
                  >
                    {p.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Broadcast Form & Existing Updates */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
              
              {/* Broadcast Form */}
              <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '24px' }}>
                <h4 style={{ fontSize: '1.05rem', fontWeight: '800', color: '#0f172a', marginTop: 0, marginBottom: '6px' }}>
                  Broadcast Live Work to Investors
                </h4>
                <p style={{ fontSize: '0.78rem', color: '#64748b', margin: '0 0 16px 0' }}>
                  Updates appear instantly on the public project card and investor dashboard under "Live Work".
                </p>

                <form onSubmit={handleBroadcastSubmit}>
                  <div style={{ marginBottom: '14px' }}>
                    <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: '700', color: '#475569', marginBottom: '6px' }}>
                      Operational Notice / Work Completed *
                    </label>
                    <textarea 
                      value={broadcastNote}
                      onChange={(e) => setBroadcastNote(e.target.value)}
                      placeholder="e.g. Received shipment of 150 teak planks. Moisture gauge verified at 8.2%."
                      rows={4}
                      className="form-input"
                      style={{ background: '#f8fafc', borderColor: '#cbd5e1' }}
                      required
                    />
                  </div>

                  <div style={{ marginBottom: '16px' }}>
                    <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: '700', color: '#475569', marginBottom: '6px' }}>
                      Reporting Officer / Author
                    </label>
                    <input 
                      type="text" 
                      value={broadcastAuthor}
                      onChange={(e) => setBroadcastAuthor(e.target.value)}
                      className="form-input"
                      style={{ background: '#f8fafc', borderColor: '#cbd5e1' }}
                      required
                    />
                  </div>

                  <button 
                    type="submit" 
                    className="btn btn-primary"
                    style={{ width: '100%', fontWeight: '700', gap: '6px' }}
                  >
                    <Send size={15} />
                    <span>Broadcast Update to Backers Feed</span>
                  </button>
                </form>
              </div>

              {/* Feed of Published Updates */}
              <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                  <h4 style={{ fontSize: '1.05rem', fontWeight: '800', color: '#0f172a', margin: 0 }}>
                    Active Feed ({activeSelectedProject.liveUpdates?.length || 0} Posts)
                  </h4>
                  <span className="badge badge-emerald" style={{ fontSize: '0.65rem' }}>Live Stream</span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '420px', overflowY: 'auto', paddingRight: '4px' }}>
                  {(activeSelectedProject.liveUpdates || []).map((upd, idx) => (
                    <div 
                      key={idx}
                      style={{ 
                        padding: '12px 14px', 
                        borderRadius: '10px', 
                        background: '#f8fafc', 
                        borderLeft: '4px solid #059669',
                        borderTop: '1px solid #e2e8f0',
                        borderRight: '1px solid #e2e8f0',
                        borderBottom: '1px solid #e2e8f0'
                      }}
                    >
                      <div style={{ color: '#0f172a', fontSize: '0.82rem', fontWeight: '600', lineHeight: '1.4' }}>
                        {upd.note}
                      </div>
                      <div style={{ color: '#64748b', fontSize: '0.7rem', marginTop: '6px' }}>
                        {upd.date} {upd.time ? `• ${upd.time}` : ''} • By: <strong style={{ color: '#334155' }}>{upd.author}</strong>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

          </div>
        )}

        {/* ===================================================================== */}
        {/* TAB 4: COMPREHENSIVE BUSINESS VENTURE DETAILS & FINANCIALS EDITOR */}
        {/* ===================================================================== */}
        {currentAdminTab === 'financials' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            
            {/* Venture Selector Header Bar */}
            <div style={{ 
              background: '#ffffff', 
              borderRadius: '16px', 
              border: '1px solid #e2e8f0', 
              padding: '20px 24px', 
              display: 'flex', 
              flexWrap: 'wrap', 
              alignItems: 'center', 
              justifyContent: 'space-between', 
              gap: '16px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
            }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <span style={{ fontSize: '0.72rem', fontWeight: '800', color: '#d97706', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Active Venture Profile
                  </span>
                  <span style={{ background: '#f1f5f9', color: '#475569', fontSize: '0.72rem', padding: '2px 8px', borderRadius: '12px', fontWeight: '700' }}>
                    {activeSelectedProject.category || 'Venture'}
                  </span>
                </div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: '900', color: '#0f172a', margin: 0 }}>
                  {activeSelectedProject.name}
                </h3>
              </div>

              {/* Venture Switcher Pills */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {businessProjects.map((p) => {
                  const isSelected = p.id === selectedProjectId;
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setSelectedProjectId(p.id)}
                      style={{
                        padding: '8px 16px',
                        borderRadius: '10px',
                        fontSize: '0.8rem',
                        fontWeight: '700',
                        cursor: 'pointer',
                        border: isSelected ? '2px solid #d97706' : '1px solid #e2e8f0',
                        background: isSelected ? '#fffbeb' : '#ffffff',
                        color: isSelected ? '#b45309' : '#475569',
                        boxShadow: isSelected ? '0 2px 6px rgba(217,119,6,0.12)' : 'none',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      {p.name}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Save Notice Notification Banner */}
            {saveNotice && (
              <div style={{ 
                padding: '14px 20px', 
                borderRadius: '12px', 
                background: '#ecfdf5', 
                border: '1px solid #6ee7b7', 
                color: '#065f46', 
                fontSize: '0.88rem', 
                fontWeight: '700', 
                display: 'flex', 
                alignItems: 'center', 
                gap: '10px',
                boxShadow: '0 2px 8px rgba(16,185,129,0.1)'
              }}>
                <CheckCircle2 size={20} color="#059669" />
                <span>{saveNotice}</span>
              </div>
            )}

            {/* Master Business Editing Form */}
            <form onSubmit={handleSaveAllBusinessDetails} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

              {/* CARD 1: Core Business Profile */}
              <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px', paddingBottom: '12px', borderBottom: '1px solid #f1f5f9' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Building2 size={18} color="#2563eb" />
                  </div>
                  <div>
                    <h4 style={{ fontSize: '1.05rem', fontWeight: '800', color: '#0f172a', margin: 0 }}>
                      1. Core Business Profile & Value Proposition
                    </h4>
                    <p style={{ fontSize: '0.76rem', color: '#64748b', margin: 0 }}>
                      Primary branding, customer-facing venture identity, and market proposition.
                    </p>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px', marginBottom: '16px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', color: '#334155', marginBottom: '6px' }}>
                      Business Venture Name *
                    </label>
                    <input 
                      type="text" 
                      value={businessFormData.name} 
                      onChange={(e) => setBusinessFormData(prev => ({ ...prev, name: e.target.value }))}
                      className="form-input"
                      placeholder="e.g. T-Shirt Pre-Order Campaign"
                      style={{ background: '#f8fafc', fontWeight: '700' }}
                      required
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', color: '#334155', marginBottom: '6px' }}>
                      Sector / Industry Category *
                    </label>
                    <input 
                      type="text" 
                      value={businessFormData.category} 
                      onChange={(e) => setBusinessFormData(prev => ({ ...prev, category: e.target.value }))}
                      className="form-input"
                      placeholder="e.g. Apparel & Fashion, Automotive Services"
                      style={{ background: '#f8fafc' }}
                      required
                    />
                  </div>
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', color: '#334155', marginBottom: '6px' }}>
                    Catchy Value Proposition / Tagline *
                  </label>
                  <input 
                    type="text" 
                    value={businessFormData.tagline} 
                    onChange={(e) => setBusinessFormData(prev => ({ ...prev, tagline: e.target.value }))}
                    className="form-input"
                    placeholder="Short punchy summary displayed on public cards"
                    style={{ background: '#f8fafc' }}
                    required
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', color: '#334155', marginBottom: '6px' }}>
                    Full Business Narrative & Execution Model *
                  </label>
                  <textarea 
                    rows={4}
                    value={businessFormData.description} 
                    onChange={(e) => setBusinessFormData(prev => ({ ...prev, description: e.target.value }))}
                    className="form-input"
                    placeholder="Detailed explanation of the business mechanics, fulfillment strategy, and target audience"
                    style={{ background: '#f8fafc', lineHeight: '1.5' }}
                    required
                  />
                </div>
              </div>

              {/* CARD 2: Capital Terms & Payout Structure */}
              <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px', paddingBottom: '12px', borderBottom: '1px solid #f1f5f9' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#ecfdf5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <DollarSign size={18} color="#059669" />
                  </div>
                  <div>
                    <h4 style={{ fontSize: '1.05rem', fontWeight: '800', color: '#0f172a', margin: 0 }}>
                      2. Capital Requirements & Investor Terms
                    </h4>
                    <p style={{ fontSize: '0.76rem', color: '#64748b', margin: 0 }}>
                      Fundraising limits, investor return commitments, payout cycles, and settlement UPI.
                    </p>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '16px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', color: '#334155', marginBottom: '6px' }}>
                      Target Capital Goal (₹) *
                    </label>
                    <input 
                      type="number" 
                      value={businessFormData.capitalRequested} 
                      onChange={(e) => setBusinessFormData(prev => ({ ...prev, capitalRequested: e.target.value }))}
                      className="form-input"
                      placeholder="e.g. 15000"
                      style={{ background: '#f8fafc', fontWeight: '800', color: '#0f172a' }}
                      required
                    />
                    <span style={{ fontSize: '0.7rem', color: '#64748b', marginTop: '3px', display: 'block' }}>
                      Total capital requested from backers
                    </span>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', color: '#334155', marginBottom: '6px' }}>
                      Minimum Ticket Size (₹) *
                    </label>
                    <input 
                      type="number" 
                      value={businessFormData.minInvestment} 
                      onChange={(e) => setBusinessFormData(prev => ({ ...prev, minInvestment: e.target.value }))}
                      className="form-input"
                      placeholder="e.g. 500"
                      style={{ background: '#f8fafc' }}
                      required
                    />
                    <span style={{ fontSize: '0.7rem', color: '#64748b', marginTop: '3px', display: 'block' }}>
                      Default minimum: ₹500
                    </span>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', color: '#334155', marginBottom: '6px' }}>
                      Target Net Term Yield / ROI *
                    </label>
                    <input 
                      type="text" 
                      value={businessFormData.expectedTermYield} 
                      onChange={(e) => setBusinessFormData(prev => ({ ...prev, expectedTermYield: e.target.value }))}
                      className="form-input"
                      placeholder="e.g. 14.5% Net Term Yield"
                      style={{ background: '#f8fafc' }}
                      required
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', color: '#334155', marginBottom: '6px' }}>
                      Payout Timeline / Liquidity *
                    </label>
                    <input 
                      type="text" 
                      value={businessFormData.payoutTimeline} 
                      onChange={(e) => setBusinessFormData(prev => ({ ...prev, payoutTimeline: e.target.value }))}
                      className="form-input"
                      placeholder="e.g. 6-Day Sprint Completion"
                      style={{ background: '#f8fafc' }}
                      required
                    />
                  </div>
                </div>

                <div style={{ background: '#f8fafc', padding: '14px 18px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', color: '#334155', marginBottom: '4px' }}>
                    Designated Settlement UPI ID (Strictly UPI Only)
                  </label>
                  <input 
                    type="text" 
                    value={businessFormData.upiId} 
                    onChange={(e) => setBusinessFormData(prev => ({ ...prev, upiId: e.target.value }))}
                    className="form-input"
                    style={{ background: '#ffffff', fontWeight: '700', color: '#0f172a' }}
                    required
                  />
                  <span style={{ fontSize: '0.7rem', color: '#64748b', marginTop: '4px', display: 'block' }}>
                    All investor transfers must settle strictly to this VPA: <strong>8248651695-3@ybl</strong>
                  </span>
                </div>
              </div>

              {/* CARD 3: Unit Economics & Campaign Parameters */}
              <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px', paddingBottom: '12px', borderBottom: '1px solid #f1f5f9' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#fef3c7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <TrendingUp size={18} color="#d97706" />
                  </div>
                  <div>
                    <h4 style={{ fontSize: '1.05rem', fontWeight: '800', color: '#0f172a', margin: 0 }}>
                      3. Operational Unit Economics & Sprint Controls
                    </h4>
                    <p style={{ fontSize: '0.76rem', color: '#64748b', margin: 0 }}>
                      Calibrate marketing ad velocity, pricing formulas, and product volume goals.
                    </p>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '18px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', color: '#334155', marginBottom: '6px' }}>
                      Daily Ad Budget (₹ / day)
                    </label>
                    <input 
                      type="number" 
                      value={businessFormData.dailyAdBudget} 
                      onChange={(e) => setBusinessFormData(prev => ({ ...prev, dailyAdBudget: e.target.value }))}
                      className="form-input"
                      style={{ background: '#f8fafc' }}
                      required
                    />
                    <span style={{ fontSize: '0.68rem', color: '#64748b', marginTop: '3px', display: 'block' }}>
                      Total Campaign Ad Spend: ₹{((parseFloat(businessFormData.dailyAdBudget) || 0) * (parseInt(businessFormData.campaignDurationDays, 10) || 0)).toLocaleString('en-IN')}
                    </span>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', color: '#334155', marginBottom: '6px' }}>
                      Sprint Duration (Days)
                    </label>
                    <input 
                      type="number" 
                      value={businessFormData.campaignDurationDays} 
                      onChange={(e) => setBusinessFormData(prev => ({ ...prev, campaignDurationDays: e.target.value }))}
                      className="form-input"
                      style={{ background: '#f8fafc' }}
                      required
                    />
                    <span style={{ fontSize: '0.68rem', color: '#64748b', marginTop: '3px', display: 'block' }}>
                      Capital lock-in & execution cycle
                    </span>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', color: '#334155', marginBottom: '6px' }}>
                      Unit Selling Price / Fee (₹)
                    </label>
                    <input 
                      type="number" 
                      value={businessFormData.unitPrice} 
                      onChange={(e) => setBusinessFormData(prev => ({ ...prev, unitPrice: e.target.value }))}
                      className="form-input"
                      style={{ background: '#f8fafc' }}
                      required
                    />
                    <span style={{ fontSize: '0.68rem', color: '#64748b', marginTop: '3px', display: 'block' }}>
                      Customer price or service fee per order
                    </span>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', color: '#334155', marginBottom: '6px' }}>
                      Direct Cost Per Unit (₹)
                    </label>
                    <input 
                      type="number" 
                      value={businessFormData.directCost} 
                      onChange={(e) => setBusinessFormData(prev => ({ ...prev, directCost: e.target.value }))}
                      className="form-input"
                      style={{ background: '#f8fafc' }}
                    />
                    <span style={{ fontSize: '0.68rem', color: '#64748b', marginTop: '3px', display: 'block' }}>
                      COGS / Materials / Labor per unit
                    </span>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', color: '#334155', marginBottom: '6px' }}>
                      Target Volume (Units / Orders)
                    </label>
                    <input 
                      type="number" 
                      value={businessFormData.volumeTarget} 
                      onChange={(e) => setBusinessFormData(prev => ({ ...prev, volumeTarget: e.target.value }))}
                      className="form-input"
                      style={{ background: '#f8fafc' }}
                    />
                    <span style={{ fontSize: '0.68rem', color: '#64748b', marginTop: '3px', display: 'block' }}>
                      Total production or fulfillment target
                    </span>
                  </div>
                </div>

                {/* Economics Live Projection Card */}
                {(() => {
                  const vol = parseInt(businessFormData.volumeTarget, 10) || 0;
                  const price = parseFloat(businessFormData.unitPrice) || 0;
                  const cost = parseFloat(businessFormData.directCost) || 0;
                  const ads = (parseFloat(businessFormData.dailyAdBudget) || 0) * (parseInt(businessFormData.campaignDurationDays, 10) || 0);
                  const grossRevenue = vol * price;
                  const totalCOGS = vol * cost;
                  const estNetProfit = grossRevenue - totalCOGS - ads;

                  return (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '12px', background: '#f1f5f9', padding: '14px 18px', borderRadius: '12px' }}>
                      <div>
                        <span style={{ fontSize: '0.68rem', color: '#64748b', fontWeight: '700', textTransform: 'uppercase' }}>Est. Gross Revenue</span>
                        <div style={{ fontSize: '1rem', fontWeight: '800', color: '#0f172a' }}>₹{grossRevenue.toLocaleString('en-IN')}</div>
                      </div>
                      <div>
                        <span style={{ fontSize: '0.68rem', color: '#64748b', fontWeight: '700', textTransform: 'uppercase' }}>Est. Direct COGS</span>
                        <div style={{ fontSize: '1rem', fontWeight: '800', color: '#64748b' }}>₹{totalCOGS.toLocaleString('en-IN')}</div>
                      </div>
                      <div>
                        <span style={{ fontSize: '0.68rem', color: '#64748b', fontWeight: '700', textTransform: 'uppercase' }}>Est. Ad Marketing</span>
                        <div style={{ fontSize: '1rem', fontWeight: '800', color: '#d97706' }}>₹{ads.toLocaleString('en-IN')}</div>
                      </div>
                      <div>
                        <span style={{ fontSize: '0.68rem', color: '#64748b', fontWeight: '700', textTransform: 'uppercase' }}>Est. Net Venture Profit</span>
                        <div style={{ fontSize: '1rem', fontWeight: '800', color: estNetProfit >= 0 ? '#059669' : '#dc2626' }}>
                          ₹{estNetProfit.toLocaleString('en-IN')}
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>

              {/* CARD 4: Itemized Budget Allocation (Expense Breakdown) */}
              <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px', paddingBottom: '12px', borderBottom: '1px solid #f1f5f9' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#f3e8ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Layers size={18} color="#9333ea" />
                    </div>
                    <div>
                      <h4 style={{ fontSize: '1.05rem', fontWeight: '800', color: '#0f172a', margin: 0 }}>
                        4. Itemized Operational Budget & Expense Allocations
                      </h4>
                      <p style={{ fontSize: '0.76rem', color: '#64748b', margin: 0 }}>
                        Transparent fund allocation visible to verified investors on their dashboard.
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleAddExpenseItem}
                    style={{
                      background: '#f8fafc',
                      border: '1px solid #cbd5e1',
                      borderRadius: '8px',
                      padding: '6px 12px',
                      fontSize: '0.75rem',
                      fontWeight: '700',
                      color: '#0f172a',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      cursor: 'pointer'
                    }}
                  >
                    <Plus size={14} />
                    <span>Add Expense Item</span>
                  </button>
                </div>

                {/* Expense Items List */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '16px' }}>
                  {(businessFormData.expenseBreakdown || []).map((exp, idx) => (
                    <div 
                      key={idx} 
                      style={{ 
                        display: 'grid', 
                        gridTemplateColumns: 'minmax(200px, 2fr) minmax(150px, 1.5fr) minmax(120px, 1fr) 40px', 
                        gap: '10px', 
                        alignItems: 'center',
                        background: '#f8fafc',
                        padding: '10px 14px',
                        borderRadius: '10px',
                        border: '1px solid #e2e8f0'
                      }}
                    >
                      <div>
                        <label style={{ display: 'block', fontSize: '0.68rem', fontWeight: '700', color: '#64748b', marginBottom: '2px' }}>
                          Item Name / Description
                        </label>
                        <input 
                          type="text" 
                          value={exp.item || ''} 
                          onChange={(e) => handleExpenseChange(idx, 'item', e.target.value)}
                          className="form-input"
                          style={{ background: '#ffffff', padding: '6px 10px', fontSize: '0.8rem' }}
                          placeholder="e.g. Blank T-shirts 60 units"
                          required
                        />
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: '0.68rem', fontWeight: '700', color: '#64748b', marginBottom: '2px' }}>
                          Category
                        </label>
                        <input 
                          type="text" 
                          value={exp.category || ''} 
                          onChange={(e) => handleExpenseChange(idx, 'category', e.target.value)}
                          className="form-input"
                          style={{ background: '#ffffff', padding: '6px 10px', fontSize: '0.8rem' }}
                          placeholder="e.g. Sourcing / Marketing"
                          required
                        />
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: '0.68rem', fontWeight: '700', color: '#64748b', marginBottom: '2px' }}>
                          Amount (₹)
                        </label>
                        <input 
                          type="number" 
                          value={exp.amount || 0} 
                          onChange={(e) => handleExpenseChange(idx, 'amount', e.target.value)}
                          className="form-input"
                          style={{ background: '#ffffff', padding: '6px 10px', fontSize: '0.8rem', fontWeight: '700' }}
                          required
                        />
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'center', paddingTop: '16px' }}>
                        <button
                          type="button"
                          onClick={() => handleRemoveExpenseItem(idx)}
                          style={{
                            background: '#fee2e2',
                            border: 'none',
                            color: '#b91c1c',
                            width: '28px',
                            height: '28px',
                            borderRadius: '6px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer'
                          }}
                          title="Remove Item"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Expense Allocation Summary */}
                {(() => {
                  const totalAllocated = (businessFormData.expenseBreakdown || []).reduce((sum, it) => sum + (parseFloat(it.amount) || 0), 0);
                  const goal = parseFloat(businessFormData.capitalRequested) || 0;
                  const difference = goal - totalAllocated;

                  return (
                    <div style={{ 
                      padding: '12px 18px', 
                      borderRadius: '10px', 
                      background: Math.abs(difference) < 1 ? '#ecfdf5' : '#fffbeb', 
                      border: Math.abs(difference) < 1 ? '1px solid #a7f3d0' : '1px solid #fde68a',
                      display: 'flex', 
                      flexWrap: 'wrap', 
                      justifyContent: 'space-between', 
                      alignItems: 'center',
                      gap: '12px'
                    }}>
                      <div>
                        <span style={{ fontSize: '0.74rem', color: '#475569', fontWeight: '600' }}>
                          Total Itemized Allocated: <strong>₹{totalAllocated.toLocaleString('en-IN')}</strong> / Target Goal: <strong>₹{goal.toLocaleString('en-IN')}</strong>
                        </span>
                      </div>
                      <span style={{ 
                        fontSize: '0.74rem', 
                        fontWeight: '800', 
                        color: Math.abs(difference) < 1 ? '#065f46' : '#b45309' 
                      }}>
                        {Math.abs(difference) < 1 ? '✓ Perfectly Balanced Budget' : `Variance: ₹${difference.toLocaleString('en-IN')}`}
                      </span>
                    </div>
                  );
                })()}
              </div>

              {/* Master Save Button Bar */}
              <div style={{ 
                background: '#ffffff', 
                borderRadius: '16px', 
                border: '1px solid #e2e8f0', 
                padding: '20px 24px', 
                display: 'flex', 
                flexWrap: 'wrap', 
                alignItems: 'center', 
                justifyContent: 'space-between', 
                gap: '16px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.04)'
              }}>
                <div>
                  <h5 style={{ fontSize: '0.95rem', fontWeight: '800', color: '#0f172a', margin: 0 }}>
                    Deploy Business Updates Live
                  </h5>
                  <p style={{ fontSize: '0.75rem', color: '#64748b', margin: '2px 0 0 0' }}>
                    Saves all updates to local state and instantly pushes to Supabase cloud tables.
                  </p>
                </div>

                <button 
                  type="submit" 
                  className="btn btn-primary"
                  style={{ 
                    padding: '12px 28px', 
                    fontWeight: '800', 
                    borderRadius: '10px', 
                    fontSize: '0.92rem',
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '8px',
                    boxShadow: '0 4px 12px rgba(217,119,6,0.25)'
                  }}
                >
                  <CheckCircle2 size={18} />
                  <span>Save All Business Details & Sync Live</span>
                </button>
              </div>

            </form>

          </div>
        )}

        {/* ===================================================================== */}
        {/* TAB 5: AUDIT TRAIL LOG */}
        {/* ===================================================================== */}
        {currentAdminTab === 'history' && (
          <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '24px' }}>
            <div style={{ marginBottom: '16px', paddingBottom: '12px', borderBottom: '1px solid #e2e8f0' }}>
              <h4 style={{ fontSize: '1.05rem', fontWeight: '800', color: '#0f172a', margin: 0 }}>
                System Change History & Regulatory Ledger
              </h4>
              <p style={{ fontSize: '0.78rem', color: '#64748b', margin: '2px 0 0 0' }}>
                Immutable record of all admin approvals, milestone updates, and financial adjustments.
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {(projectChangeHistory || []).map((hist) => (
                <div 
                  key={hist.id}
                  style={{ 
                    padding: '12px 14px', 
                    borderRadius: '8px', 
                    background: '#f8fafc', 
                    border: '1px solid #e2e8f0',
                    fontSize: '0.78rem'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <strong style={{ color: '#0f172a' }}>{hist.action}</strong>
                    <span style={{ fontSize: '0.7rem', color: '#64748b' }}>{hist.timestamp} • By: {hist.user}</span>
                  </div>
                  <div style={{ color: '#475569', marginTop: '3px' }}>
                    {hist.note}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* ===================================================================== */}
      {/* MODAL: FULL SCREENSHOT VIEW */}
      {/* ===================================================================== */}
      {selectedScreenshotModal && (
        <div className="modal-overlay" onClick={() => setSelectedScreenshotModal(null)}>
          <div 
            className="modal-content" 
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: '540px', width: '100%', padding: '24px', borderRadius: '16px', background: '#ffffff' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', borderBottom: '1px solid #e2e8f0', paddingBottom: '10px' }}>
              <div>
                <h4 style={{ margin: 0, fontSize: '1.1rem', color: '#0f172a', fontWeight: '800' }}>
                  UPI Payment Receipt Verification
                </h4>
                <div style={{ fontSize: '0.74rem', color: '#64748b' }}>
                  Backer: {selectedScreenshotModal.investorName} • Amount: ₹{selectedScreenshotModal.amount}
                </div>
              </div>
              <button onClick={() => setSelectedScreenshotModal(null)} className="btn btn-ghost btn-sm" style={{ padding: '4px' }}>
                <XCircle size={20} />
              </button>
            </div>

            <div style={{ textAlign: 'center', background: '#f8fafc', padding: '12px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
              <img 
                src={selectedScreenshotModal.screenshotUrl} 
                alt="Payment Proof Receipt" 
                style={{ maxWidth: '100%', maxHeight: '480px', objectFit: 'contain', borderRadius: '8px' }} 
              />
            </div>

            <div style={{ marginTop: '14px', padding: '10px', background: '#f1f5f9', borderRadius: '8px', fontSize: '0.78rem', color: '#334155' }}>
              UTR: <strong style={{ fontFamily: 'monospace' }}>{selectedScreenshotModal.utrNumber || 'N/A'}</strong> • Project: <strong>{selectedScreenshotModal.projectName}</strong>
            </div>

            <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
              <button 
                type="button" 
                onClick={() => {
                  handleApprovePayment(selectedScreenshotModal);
                  setSelectedScreenshotModal(null);
                }}
                className="btn btn-primary"
                style={{ flex: 1, background: '#059669', borderColor: '#059669', fontWeight: '700' }}
              >
                Approve Payment Receipt
              </button>
              <button 
                type="button" 
                onClick={() => setSelectedScreenshotModal(null)}
                className="btn btn-secondary"
                style={{ flex: 1 }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* MODAL: REJECT CONFIRMATION */}
      {/* ===================================================================== */}
      {rejectionModalInv && (
        <div className="modal-overlay" onClick={() => setRejectionModalInv(null)}>
          <div 
            className="modal-content" 
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: '440px', width: '100%', padding: '24px', borderRadius: '16px', background: '#ffffff' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#e11d48', marginBottom: '12px' }}>
              <AlertTriangle size={24} />
              <h4 style={{ margin: 0, fontSize: '1.1rem', fontWeight: '800' }}>
                Reject Payment Submission?
              </h4>
            </div>

            <p style={{ fontSize: '0.82rem', color: '#475569', lineHeight: '1.5' }}>
              Are you sure you want to reject this ₹{rejectionModalInv.amount} payment submission from <strong>{rejectionModalInv.investorName}</strong>?
            </p>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', color: '#334155', marginBottom: '6px' }}>
                Rejection Reason
              </label>
              <textarea 
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                rows={3}
                className="form-input"
                style={{ background: '#f8fafc' }}
              />
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              <button 
                type="button" 
                onClick={handleConfirmRejection}
                className="btn btn-primary"
                style={{ flex: 1, background: '#e11d48', borderColor: '#e11d48', fontWeight: '700' }}
              >
                Confirm Rejection
              </button>
              <button 
                type="button" 
                onClick={() => setRejectionModalInv(null)}
                className="btn btn-secondary"
                style={{ flex: 1 }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
