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
  ChevronRight
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
    user
  } = useApp();

  const [passwordInput, setPasswordInput] = useState('admin123');
  const [emailInput, setEmailInput] = useState('admin@rbi-group.org');
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

  // Live Broadcaster Form State
  const [broadcastNote, setBroadcastNote] = useState('');
  const [broadcastAuthor, setBroadcastAuthor] = useState(user?.name || 'Alexander (Operations Lead)');
  const [broadcastSuccess, setBroadcastSuccess] = useState(false);

  // Financials Editor Form State
  const activeSelectedProject = businessProjects.find(p => p.id === selectedProjectId) || businessProjects[0];
  const [editAdBudget, setEditAdBudget] = useState(activeSelectedProject?.dailyAdBudget || 200);
  const [editDuration, setEditDuration] = useState(activeSelectedProject?.campaignDurationDays || 6);
  const [editSellingPrice, setEditSellingPrice] = useState(activeSelectedProject?.avgSellingPricePerUnit || activeSelectedProject?.proposedSellingPrice || 250);
  const [saveNotice, setSaveNotice] = useState(null);

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
    const success = adminLogin(passwordInput);
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

    addProjectMilestone(selectedProjectId, {
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
  // VIEW 1: UNLOGGED ADMIN LOGIN SCREEN
  // =========================================================================
  if (!isAdminLoggedIn) {
    return (
      <div style={{ padding: '60px 0', minHeight: '80vh', display: 'flex', alignItems: 'center', background: '#f8fafc' }}>
        <div className="container" style={{ maxWidth: '460px' }}>
          
          <div style={{ 
            background: '#ffffff', 
            padding: '36px', 
            borderRadius: '20px',
            border: '1px solid #e2e8f0',
            boxShadow: '0 10px 25px -5px rgba(0,0,0,0.05), 0 8px 10px -6px rgba(0,0,0,0.01)'
          }}>
            
            {/* Header */}
            <div style={{ textAlign: 'center', marginBottom: '26px' }}>
              <div style={{ 
                width: '60px', 
                height: '60px', 
                borderRadius: '16px', 
                background: 'linear-gradient(135deg, #fbbf24 0%, #d97706 100%)',
                color: '#000',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px auto',
                boxShadow: '0 4px 14px rgba(245, 158, 11, 0.35)'
              }}>
                <ShieldCheck size={32} />
              </div>
              <h2 style={{ fontSize: '1.45rem', color: '#0f172a', fontWeight: '800', marginBottom: '4px' }}>
                RBI Syndicate Admin Desk
              </h2>
              <p style={{ fontSize: '0.82rem', color: '#64748b', margin: 0 }}>
                Escrow payment verification, sprint progress controls, and operational audit suite.
              </p>
            </div>

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
                Invalid administrator key. Use <strong>admin123</strong> for evaluation access.
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleLoginSubmit}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: '700', color: '#334155', marginBottom: '6px' }}>
                  Admin ID / Email
                </label>
                <input 
                  type="email" 
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  className="form-input"
                  style={{ background: '#f8fafc', borderColor: '#cbd5e1', color: '#0f172a' }}
                  required
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: '700', color: '#334155', marginBottom: '6px' }}>
                  Master Access Key
                </label>
                <input 
                  type="password" 
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  className="form-input"
                  style={{ background: '#f8fafc', borderColor: '#cbd5e1', color: '#0f172a' }}
                  placeholder="admin123"
                  required
                />
              </div>

              <button 
                type="submit" 
                className="btn btn-primary"
                style={{ width: '100%', marginBottom: '10px', fontWeight: '700' }}
              >
                <Lock size={16} />
                <span>Sign In to Admin Workspace</span>
              </button>

              <button 
                type="button" 
                onClick={() => adminLogin('admin123')}
                className="btn btn-secondary btn-sm"
                style={{ width: '100%', fontSize: '0.8rem', background: '#f1f5f9', color: '#334155', border: '1px solid #cbd5e1', fontWeight: '600' }}
              >
                ⚡ 1-Click Fast Unlock (admin123)
              </button>
            </form>

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
                  Master Comptroller: <strong>{user?.name || "Alexander Rajasingh"}</strong> • Escrow UPI: <strong style={{ color: '#0f172a' }}>8248651695-3@ybl</strong>
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
              UnavuKadai • CarpenterBullet • Laptop Case • Bamboo Cup
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
            <SlidersHorizontal size={16} />
            <span>Financials & Parameters</span>
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
                            onClick={() => updateProjectMilestone(selectedProjectId, m.id, { status: 'COMPLETED' })}
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
                            onClick={() => updateProjectMilestone(selectedProjectId, m.id, { status: 'IN_PROGRESS' })}
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
                            onClick={() => updateProjectMilestone(selectedProjectId, m.id, { status: 'UPCOMING' })}
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

                        <button
                          type="button"
                          onClick={() => deleteProjectMilestone(selectedProjectId, m.id)}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: '#e11d48',
                            fontSize: '0.72rem',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            padding: '2px 6px'
                          }}
                          title="Delete Milestone"
                        >
                          <Trash2 size={13} />
                          <span>Delete Step</span>
                        </button>
                      </div>

                    </div>
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
        {/* TAB 4: FINANCIALS & PARAMETERS EDITOR */}
        {/* ===================================================================== */}
        {currentAdminTab === 'financials' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            {/* Project Picker Bar */}
            <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '18px 20px', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '14px' }}>
              <div>
                <span style={{ fontSize: '0.72rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase' }}>
                  Select Venture
                </span>
                <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#0f172a', margin: '2px 0 0 0' }}>
                  {activeSelectedProject.name} — Financial Parameters & Pricing
                </h3>
              </div>

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
                      color: p.id === selectedProjectId ? '#b45309' : '#475569'
                    }}
                  >
                    {p.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Financial Parameters Editor Card */}
            <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '24px' }}>
              <div style={{ marginBottom: '18px', paddingBottom: '14px', borderBottom: '1px solid #e2e8f0' }}>
                <h4 style={{ fontSize: '1.05rem', fontWeight: '800', color: '#0f172a', margin: 0 }}>
                  Unit Economics & Campaign Controls
                </h4>
                <p style={{ fontSize: '0.78rem', color: '#64748b', margin: '2px 0 0 0' }}>
                  Adjust marketing spend, sprint duration, and product selling prices. Investor yields update in real time.
                </p>
              </div>

              {saveNotice && (
                <div style={{ padding: '10px 14px', borderRadius: '8px', background: '#ecfdf5', border: '1px solid #a7f3d0', color: '#065f46', fontSize: '0.8rem', fontWeight: '700', marginBottom: '16px' }}>
                  ✓ {saveNotice}
                </div>
              )}

              <form onSubmit={handleSaveFinancials}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '20px' }}>
                  
                  <div>
                    <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: '700', color: '#475569', marginBottom: '6px' }}>
                      Daily Ad Budget (₹ / day)
                    </label>
                    <input 
                      type="number" 
                      value={editAdBudget} 
                      onChange={(e) => setEditAdBudget(e.target.value)}
                      className="form-input"
                      style={{ background: '#f8fafc' }}
                      required
                    />
                    <span style={{ fontSize: '0.68rem', color: '#64748b' }}>
                      Total Ad Spend: ₹{(editAdBudget * editDuration).toLocaleString('en-IN')}
                    </span>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: '700', color: '#475569', marginBottom: '6px' }}>
                      Campaign Duration (Days)
                    </label>
                    <input 
                      type="number" 
                      value={editDuration} 
                      onChange={(e) => setEditDuration(e.target.value)}
                      className="form-input"
                      style={{ background: '#f8fafc' }}
                      required
                    />
                    <span style={{ fontSize: '0.68rem', color: '#64748b' }}>
                      Payout timeline: Day {editDuration} sprint close
                    </span>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: '700', color: '#475569', marginBottom: '6px' }}>
                      Selling Price / Fee per Unit (₹)
                    </label>
                    <input 
                      type="number" 
                      value={editSellingPrice} 
                      onChange={(e) => setEditSellingPrice(e.target.value)}
                      className="form-input"
                      style={{ background: '#f8fafc' }}
                      required
                    />
                    <span style={{ fontSize: '0.68rem', color: '#64748b' }}>
                      Customer price or platform commission fee
                    </span>
                  </div>

                </div>

                <button 
                  type="submit" 
                  className="btn btn-primary"
                  style={{ fontWeight: '700', borderRadius: '8px' }}
                >
                  Save & Update Financial Blueprint
                </button>
              </form>

            </div>

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
