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
  SlidersHorizontal, 
  Bot, 
  Download, 
  Printer, 
  Search, 
  Eye, 
  Edit3, 
  Layers, 
  ShieldAlert, 
  X, 
  History, 
  Calendar,
  Activity,
  Package,
  Hammer,
  Truck,
  Check,
  ArrowRight,
  Info,
  DollarSign,
  PieChart
} from 'lucide-react';

export const BusinessProjectsDashboard = () => {
  const { 
    businessProjects, 
    updateBusinessProject, 
    projectChangeHistory, 
    formatMoney, 
    currency 
  } = useApp();

  // Active Sub-View: 'grid' | 'investor' | 'timeline' | 'ai-parser' | 'audit-log'
  const [activeSubView, setActiveSubView] = useState('grid');
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

  // Edit Modal State
  const [editingProject, setEditingProject] = useState(null);
  const [editFormData, setEditFormData] = useState({});

  // Deep-dive Investor Modal State
  const [investorModalProject, setInvestorModalProject] = useState(null);

  // AI Data Entry State
  const [aiInputText, setAiInputText] = useState(
    "Run ₹250 daily ads for 40 days, generate 20 leads per day, convert 5 leads into paid sales, and earn ₹100 commission per completed sale."
  );
  const [aiAnalysisResult, setAiAnalysisResult] = useState(null);
  const [aiTargetProjectId, setAiTargetProjectId] = useState('proj-carpenterbullet');
  const [isApplyingAi, setIsApplyingAi] = useState(false);

  // Helper: Set card tab
  const setProjectCardTab = (projectId, tab) => {
    setCardActiveTab(prev => ({ ...prev, [projectId]: tab }));
  };

  // Trigger AI parsing on current text
  const handleRunAiAnalysis = () => {
    const result = parseNaturalLanguagePlan(aiInputText);
    setAiAnalysisResult(result);
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

  // Apply AI Extracted Assumptions with Confirmation
  const handleApplyAiAssumptions = () => {
    if (!aiAnalysisResult || !aiAnalysisResult.extractedValues) return;
    const { extractedValues } = aiAnalysisResult;

    const target = businessProjects.find(p => p.id === aiTargetProjectId);
    if (!target) {
      alert("Please select a valid target project.");
      return;
    }

    const updates = {};
    if (extractedValues.dailyAdBudget) updates.dailyAdBudget = extractedValues.dailyAdBudget;
    if (extractedValues.campaignDurationDays) updates.campaignDurationDays = extractedValues.campaignDurationDays;
    if (extractedValues.commissionPerSale && target.type === 'COMMISSION_MARKETPLACE') {
      updates.commissionPerCompletedSale = extractedValues.commissionPerSale;
    }
    if (extractedValues.totalSalesTarget) {
      if (target.type === 'COMMISSION_MARKETPLACE') updates.campaignSalesTarget = extractedValues.totalSalesTarget;
      else if (target.type === 'SERVICE_ORDER') updates.totalOrderTarget = extractedValues.totalSalesTarget;
      else updates.productionTarget = extractedValues.totalSalesTarget;
    }
    if (extractedValues.sellingPrice && target.type !== 'COMMISSION_MARKETPLACE') {
      updates.proposedSellingPrice = extractedValues.sellingPrice;
    }
    if (extractedValues.unitCost && target.type !== 'COMMISSION_MARKETPLACE') {
      updates.totalDirectCostPerUnit = extractedValues.unitCost;
    }

    updateBusinessProject(
      target.id,
      updates,
      `AI-Extracted Plan Applied: "${aiAnalysisResult.originalInput.slice(0, 50)}..."`
    );

    setIsApplyingAi(true);
    setTimeout(() => {
      setIsApplyingAi(false);
      alert(`AI Assumptions successfully saved to ${target.name}!`);
      setActiveSubView('grid');
    }, 600);
  };

  // Export Complete Project Portfolio as CSV
  const exportPortfolioCSV = () => {
    const headers = [
      'Project ID',
      'Project Name',
      'Category',
      'Status',
      'Capital Requested (INR)',
      'Total Ad Spend (INR)',
      'Direct / Production Costs (INR)',
      'Other Setup / Operating Costs (INR)',
      'Total Project Cost (INR)',
      'Amount Spent to Date (INR)',
      'Remaining Capital to Deploy (INR)',
      'Projected Revenue (INR)',
      'Projected Net Profit (INR)',
      'Timeline Completion (%)'
    ];

    const rows = businessProjects.map(proj => {
      const fin = calculateProjectFinancials(proj);
      return [
        proj.id,
        `"${proj.name}"`,
        `"${proj.category}"`,
        proj.status,
        fin.capitalRequested,
        fin.totalAdSpend,
        fin.directCosts,
        fin.nonAdExpenses,
        fin.totalAllCosts,
        fin.actualSpent,
        fin.remainingCapitalToDeploy,
        fin.projectedRevenue,
        fin.projectedNetProfit,
        `${fin.timelineProgressPercent}%`
      ];
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `rbi_complete_projects_audit_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
    acc.totalAdSpend += fin.totalAdSpend;
    acc.totalActualSpent += fin.actualSpent;
    acc.totalRemainingDeploy += fin.remainingCapitalToDeploy;
    acc.totalProjectedRevenue += fin.projectedRevenue;
    acc.totalActualRevenue += fin.actualRevenue;
    return acc;
  }, { totalCapitalRequested: 0, totalAdSpend: 0, totalActualSpent: 0, totalRemainingDeploy: 0, totalProjectedRevenue: 0, totalActualRevenue: 0 });

  return (
    <div className="container" style={{ padding: '24px 20px', maxWidth: '1280px', margin: '0 auto' }}>
      
      {/* Platform Title Banner */}
      <div 
        style={{
          background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.85) 100%)',
          borderRadius: '20px',
          padding: '28px 32px',
          border: '1px solid rgba(245, 158, 11, 0.25)',
          boxShadow: '0 12px 35px -8px rgba(0, 0, 0, 0.5)',
          marginBottom: '26px'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <span className="badge badge-gold" style={{ fontSize: '0.75rem', padding: '4px 10px' }}>
                FULL AUDIT & TIMELINE SUITE
              </span>
              <span style={{ fontSize: '0.8rem', color: '#10b981', display: 'flex', alignItems: 'center', gap: '5px' }}>
                <span className="live-pulse-dot" style={{ width: '6px', height: '6px', background: '#10b981' }}></span>
                Live Milestone Tracking
              </span>
            </div>

            <h1 style={{ fontSize: '2.1rem', fontWeight: '800', color: '#fff', margin: '0 0 8px 0', letterSpacing: '-0.02em' }}>
              Business Investment & Project Dashboard
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', margin: 0, maxWidth: '820px', lineHeight: '1.5' }}>
              Complete transparency for investors: Tracks <strong>Materials, Labour, Logistics, Tooling, & Ads</strong> across all 4 projects with stage-by-stage <strong>Milestone Timelines</strong> and real-time execution updates.
            </p>
          </div>

          {/* Quick Portfolio Controls */}
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <button 
              onClick={() => {
                setActiveSubView('ai-parser');
                handleRunAiAnalysis();
              }}
              className="btn btn-secondary btn-sm"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', borderRadius: '10px' }}
            >
              <Bot size={16} className="text-amber-400" />
              <span>AI Data Entry</span>
            </button>

            <button 
              onClick={exportPortfolioCSV}
              className="btn btn-secondary btn-sm"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', borderRadius: '10px' }}
            >
              <Download size={15} />
              <span>Export Audit CSV</span>
            </button>

            <button 
              onClick={() => window.print()}
              className="btn btn-ghost btn-sm"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', borderRadius: '10px' }}
            >
              <Printer size={15} />
              <span>Print Report</span>
            </button>
          </div>
        </div>

        {/* Portfolio Top Metrics Bar (Full Picture) */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '14px', marginTop: '24px' }}>
          <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '14px 18px', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Total Capital Requested</div>
            <div style={{ fontSize: '1.45rem', fontWeight: '800', color: '#fbbf24', marginTop: '4px' }}>{formatMoney(portfolioAggregates.totalCapitalRequested)}</div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '2px' }}>Full project budgets combined</div>
          </div>

          <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '14px 18px', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Capital Spent to Date</div>
            <div style={{ fontSize: '1.45rem', fontWeight: '800', color: '#e2e8f0', marginTop: '4px' }}>{formatMoney(portfolioAggregates.totalActualSpent)}</div>
            <div style={{ fontSize: '0.72rem', color: '#10b981', marginTop: '2px' }}>Verified against vendor bills</div>
          </div>

          <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '14px 18px', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Remaining Capital to Deploy</div>
            <div style={{ fontSize: '1.45rem', fontWeight: '800', color: '#38bdf8', marginTop: '4px' }}>{formatMoney(portfolioAggregates.totalRemainingDeploy)}</div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '2px' }}>Ready for next milestone stages</div>
          </div>

          <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '14px 18px', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Actual Revenue Collected</div>
            <div style={{ fontSize: '1.45rem', fontWeight: '800', color: '#10b981', marginTop: '4px' }}>{formatMoney(portfolioAggregates.totalActualRevenue)}</div>
            <div style={{ fontSize: '0.72rem', color: '#cbd5e1', marginTop: '2px' }}>Deposited in platform escrow</div>
          </div>
        </div>

      </div>

      {/* View Navigation Ribbon */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px', marginBottom: '22px' }}>
        
        {/* Navigation Tabs */}
        <div style={{ display: 'flex', gap: '6px', background: 'rgba(255, 255, 255, 0.04)', padding: '4px', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
          <button 
            onClick={() => setActiveSubView('grid')}
            className={`btn btn-sm ${activeSubView === 'grid' ? 'btn-primary' : 'btn-ghost'}`}
            style={{ borderRadius: '8px' }}
          >
            <Layers size={15} />
            <span>Interactive Project Cards</span>
          </button>

          <button 
            onClick={() => setActiveSubView('investor')}
            className={`btn btn-sm ${activeSubView === 'investor' ? 'btn-primary' : 'btn-ghost'}`}
            style={{ borderRadius: '8px' }}
          >
            <Eye size={15} />
            <span>Full Costs & Diligence</span>
          </button>

          <button 
            onClick={() => setActiveSubView('timeline')}
            className={`btn btn-sm ${activeSubView === 'timeline' ? 'btn-primary' : 'btn-ghost'}`}
            style={{ borderRadius: '8px' }}
          >
            <Calendar size={15} />
            <span>Master Milestones Timeline</span>
          </button>

          <button 
            onClick={() => {
              setActiveSubView('ai-parser');
              if (!aiAnalysisResult) handleRunAiAnalysis();
            }}
            className={`btn btn-sm ${activeSubView === 'ai-parser' ? 'btn-primary' : 'btn-ghost'}`}
            style={{ borderRadius: '8px' }}
          >
            <Bot size={15} />
            <span>AI Parser</span>
          </button>

          <button 
            onClick={() => setActiveSubView('audit-log')}
            className={`btn btn-sm ${activeSubView === 'audit-log' ? 'btn-primary' : 'btn-ghost'}`}
            style={{ borderRadius: '8px' }}
          >
            <History size={15} />
            <span>Audit Log</span>
          </button>
        </div>

        {/* Search & Filter */}
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <div style={{ position: 'relative' }}>
            <Search size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input 
              type="text"
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                padding: '6px 12px 6px 30px',
                borderRadius: '8px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                background: 'rgba(0, 0, 0, 0.3)',
                fontSize: '0.8rem',
                color: '#fff',
                outline: 'none',
                minWidth: '180px'
              }}
            />
          </div>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            style={{
              padding: '6px 10px',
              borderRadius: '8px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              background: '#0f172a',
              color: '#fff',
              fontSize: '0.8rem',
              outline: 'none'
            }}
          >
            <option value="ALL">All Categories / Status</option>
            <option value="Active">Status: Active</option>
            <option value="Testing">Status: Testing</option>
            <option value="Planning">Status: Planning</option>
            <option value="Completed">Status: Completed</option>
          </select>
        </div>

      </div>

      {/* ========================================================================= */}
      {/* SUB-VIEW 1: PROJECT CARDS WITH IN-CARD TABS (FULL COSTS, TIMELINE & ACTIVITY) */}
      {/* ========================================================================= */}
      {activeSubView === 'grid' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(370px, 1fr))', gap: '22px' }}>
          {filteredProjects.map(project => {
            const customUnits = project.id === 'proj-bamboo-cup' ? bambooScenario : null;
            const financials = calculateProjectFinancials(project, customUnits);
            const currentTab = cardActiveTab[project.id] || 'overview';

            return (
              <div 
                key={project.id}
                style={{
                  background: 'var(--card-bg, #0b1120)',
                  borderRadius: '18px',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  padding: '24px',
                  boxShadow: '0 8px 30px rgba(0, 0, 0, 0.4)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  position: 'relative'
                }}
              >
                <div>
                  {/* Header Title & Status */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                        <span className="badge" style={{ 
                          fontSize: '0.7rem', 
                          background: project.status === 'Active' ? 'rgba(16, 185, 129, 0.15)' : project.status === 'Testing' ? 'rgba(56, 189, 248, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                          color: project.status === 'Active' ? '#10b981' : project.status === 'Testing' ? '#38bdf8' : '#fbbf24',
                          display: 'inline-block'
                        }}>
                          {project.status.toUpperCase()}
                        </span>
                        <span style={{ fontSize: '0.72rem', color: '#10b981', fontWeight: '700' }}>
                          {financials.timelineProgressPercent}% Completed
                        </span>
                      </div>
                      <h2 style={{ fontSize: '1.35rem', fontWeight: '800', color: '#fff', margin: '4px 0' }}>
                        {project.name}
                      </h2>
                      <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                        {project.category}
                      </span>
                    </div>

                    <button 
                      onClick={() => handleOpenEdit(project)}
                      className="btn btn-ghost btn-sm"
                      title="Edit Project Assumptions"
                      style={{ padding: '6px' }}
                    >
                      <Edit3 size={15} />
                    </button>
                  </div>

                  <p style={{ fontSize: '0.84rem', color: '#94a3b8', margin: '6px 0 14px 0', lineHeight: '1.45' }}>
                    {project.description}
                  </p>

                  {/* Bamboo Cup 100 vs 150 Scenario Toggle */}
                  {project.id === 'proj-bamboo-cup' && (
                    <div style={{ 
                      background: 'rgba(245, 158, 11, 0.08)', 
                      padding: '8px 12px', 
                      borderRadius: '10px', 
                      border: '1px solid rgba(245, 158, 11, 0.2)',
                      marginBottom: '14px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#fbbf24' }}>
                        Production Scenario:
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

                  {/* In-Card Interactive Tabs (What Investors Need to See) */}
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
                      Overview
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
                      Timeline
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

                  {/* TAB 1: OVERVIEW & UNIT ECONOMICS */}
                  {currentTab === 'overview' && (
                    <div>
                      <div style={{ 
                        background: 'rgba(0, 0, 0, 0.25)', 
                        borderRadius: '12px', 
                        padding: '12px', 
                        border: '1px solid rgba(255, 255, 255, 0.05)',
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        gap: '10px',
                        marginBottom: '14px'
                      }}>
                        <div>
                          <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>Capital Budget</div>
                          <div style={{ fontSize: '0.98rem', fontWeight: '800', color: '#fbbf24' }}>{formatMoney(financials.capitalRequested)}</div>
                        </div>
                        <div>
                          <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>Advertising Spend</div>
                          <div style={{ fontSize: '0.98rem', fontWeight: '800', color: '#38bdf8' }}>{formatMoney(financials.totalAdSpend)}</div>
                        </div>
                        <div>
                          <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>Materials & Operations</div>
                          <div style={{ fontSize: '0.98rem', fontWeight: '700', color: '#cbd5e1' }}>{formatMoney(financials.directCosts + financials.nonAdExpenses)}</div>
                        </div>
                        <div>
                          <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>Remaining to Deploy</div>
                          <div style={{ fontSize: '0.98rem', fontWeight: '700', color: '#10b981' }}>{formatMoney(financials.remainingCapitalToDeploy)}</div>
                        </div>
                      </div>

                      {/* Financial Projection Box */}
                      <div style={{ 
                        background: 'rgba(16, 185, 129, 0.05)', 
                        border: '1px solid rgba(16, 185, 129, 0.2)', 
                        borderRadius: '12px', 
                        padding: '12px 14px',
                        marginBottom: '14px' 
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Target Revenue:</span>
                          <strong style={{ fontSize: '0.92rem', color: '#fff' }}>{formatMoney(financials.projectedRevenue)}</strong>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Gross Margin:</span>
                          <strong style={{ fontSize: '0.92rem', color: '#38bdf8' }}>{formatMoney(financials.projectedGrossProfit)}</strong>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Projected Net Profit:</span>
                          <strong style={{ fontSize: '0.98rem', color: '#10b981' }}>{formatMoney(financials.projectedNetProfit)}</strong>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* TAB 2: FULL COST BREAKDOWN (WHERE EVERY RUPEE GOES) */}
                  {currentTab === 'costs' && (
                    <div style={{ marginBottom: '14px' }}>
                      <div style={{ fontSize: '0.75rem', fontWeight: '700', color: '#38bdf8', marginBottom: '8px' }}>
                        Itemized Expense Allocation:
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        {(project.expenseBreakdown || []).map((exp, idx) => (
                          <div 
                            key={idx}
                            style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              padding: '8px 10px',
                              borderRadius: '8px',
                              background: 'rgba(255, 255, 255, 0.02)',
                              border: '1px solid rgba(255, 255, 255, 0.04)',
                              fontSize: '0.78rem'
                            }}
                          >
                            <div>
                              <div style={{ color: '#fff', fontWeight: '600' }}>{exp.item}</div>
                              <div style={{ color: 'var(--text-muted)', fontSize: '0.68rem' }}>{exp.category} • {exp.progress}</div>
                            </div>
                            <strong style={{ color: '#fbbf24' }}>{formatMoney(exp.amount)}</strong>
                          </div>
                        ))}
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 10px', marginTop: '6px', background: 'rgba(0, 0, 0, 0.3)', borderRadius: '8px', fontSize: '0.8rem' }}>
                        <span style={{ color: 'var(--text-muted)' }}>Total Allocated:</span>
                        <strong style={{ color: '#fff' }}>{formatMoney(financials.capitalRequested)}</strong>
                      </div>
                    </div>
                  )}

                  {/* TAB 3: PROJECT TIMELINE & MILESTONES (INVESTOR VISIBILITY) */}
                  {currentTab === 'timeline' && (
                    <div style={{ marginBottom: '14px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#10b981' }}>
                          Execution Milestones ({financials.completedMilestones}/{financials.totalMilestones}):
                        </span>
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                          {project.campaignStartDate} to {project.campaignEndDate}
                        </span>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {(project.timeline || []).map((m, idx) => (
                          <div 
                            key={m.id}
                            style={{
                              padding: '8px 10px',
                              borderRadius: '8px',
                              background: m.status === 'COMPLETED' ? 'rgba(16, 185, 129, 0.08)' : m.status === 'IN_PROGRESS' ? 'rgba(56, 189, 248, 0.08)' : 'rgba(255, 255, 255, 0.02)',
                              border: m.status === 'IN_PROGRESS' ? '1px solid rgba(56, 189, 248, 0.3)' : '1px solid rgba(255, 255, 255, 0.05)',
                              fontSize: '0.76rem'
                            }}
                          >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <strong style={{ color: m.status === 'COMPLETED' ? '#10b981' : m.status === 'IN_PROGRESS' ? '#38bdf8' : '#94a3b8' }}>
                                {m.phase}
                              </strong>
                              <span className="badge" style={{ 
                                fontSize: '0.62rem', 
                                padding: '1px 5px',
                                background: m.status === 'COMPLETED' ? '#10b981' : m.status === 'IN_PROGRESS' ? '#38bdf8' : '#475569',
                                color: '#000'
                              }}>
                                {m.status}
                              </span>
                            </div>
                            <div style={{ color: 'var(--text-muted)', fontSize: '0.68rem', marginTop: '2px' }}>{m.period}</div>
                            <div style={{ color: '#cbd5e1', fontSize: '0.72rem', marginTop: '3px' }}>{m.deliverables}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* TAB 4: LIVE WORK (WHAT WE ARE DOING RIGHT NOW) */}
                  {currentTab === 'activity' && (
                    <div style={{ marginBottom: '14px' }}>
                      <div style={{ fontSize: '0.75rem', fontWeight: '700', color: '#fff', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Activity size={14} className="text-emerald-400" />
                        <span>Current Operational Sprint:</span>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {(project.liveUpdates || []).map((upd, idx) => (
                          <div 
                            key={idx}
                            style={{
                              padding: '8px 10px',
                              borderRadius: '8px',
                              background: 'rgba(255, 255, 255, 0.02)',
                              borderLeft: '3px solid #10b981',
                              fontSize: '0.75rem'
                            }}
                          >
                            <div style={{ color: '#e2e8f0', lineHeight: '1.4' }}>{upd.note}</div>
                            <div style={{ color: 'var(--text-muted)', fontSize: '0.65rem', marginTop: '4px', display: 'flex', justifyContent: 'space-between' }}>
                              <span>{upd.date} • {upd.time}</span>
                              <span style={{ color: '#fbbf24' }}>{upd.author}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                </div>

                {/* Card Footer Actions */}
                <div style={{ display: 'flex', gap: '8px', paddingTop: '12px', borderTop: '1px solid rgba(255, 255, 255, 0.06)' }}>
                  <button 
                    onClick={() => setInvestorModalProject(project)}
                    className="btn btn-secondary btn-sm"
                    style={{ flex: 1, borderRadius: '8px', fontSize: '0.8rem', justifyContent: 'center' }}
                  >
                    <Eye size={14} /> Full Investor Breakdown
                  </button>
                  <button 
                    onClick={() => handleOpenEdit(project)}
                    className="btn btn-ghost btn-sm"
                    style={{ borderRadius: '8px', fontSize: '0.8rem' }}
                  >
                    Edit
                  </button>
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUB-VIEW 2: INVESTOR DUE DILIGENCE & COMPLETE COST ALLOCATION TABLE */}
      {/* ========================================================================= */}
      {activeSubView === 'investor' && (
        <div 
          style={{
            background: 'var(--card-bg, #0b1120)',
            borderRadius: '18px',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            padding: '28px',
            boxShadow: '0 8px 30px rgba(0, 0, 0, 0.4)'
          }}
        >
          {/* Warning Banner */}
          <div 
            style={{
              background: 'rgba(239, 68, 68, 0.08)',
              border: '1px solid rgba(239, 68, 68, 0.25)',
              borderRadius: '12px',
              padding: '16px 20px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              marginBottom: '26px'
            }}
          >
            <ShieldAlert size={26} className="text-rose-400" style={{ flexShrink: 0 }} />
            <div>
              <h4 style={{ color: '#fff', margin: '0 0 2px 0', fontSize: '0.98rem', fontWeight: '800' }}>
                Investor Capital Segregation & Verification Standard
              </h4>
              <p style={{ color: '#fca5a5', fontSize: '0.82rem', margin: 0 }}>
                Every single cost—materials, labour, logistics, tooling, and ads—is itemized below. <strong>No guaranteed returns.</strong> Actual revenue is deposited in platform escrow and audited prior to dividend settlements.
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#fff', margin: 0 }}>
              Complete Cost & Capital Allocation Audit
            </h3>
            <button onClick={exportPortfolioCSV} className="btn btn-secondary btn-sm" style={{ borderRadius: '8px' }}>
              <Download size={14} /> Export CSV
            </button>
          </div>

          {/* Table Showing All Costs (Not Just Ads) */}
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.1)', color: 'var(--text-muted)', fontSize: '0.74rem', textTransform: 'uppercase' }}>
                  <th style={{ padding: '12px 14px' }}>Project</th>
                  <th style={{ padding: '12px 14px' }}>Total Capital</th>
                  <th style={{ padding: '12px 14px' }}>Ad Spend</th>
                  <th style={{ padding: '12px 14px' }}>Materials / Direct</th>
                  <th style={{ padding: '12px 14px' }}>Setup / Tech</th>
                  <th style={{ padding: '12px 14px' }}>Spent to Date</th>
                  <th style={{ padding: '12px 14px' }}>Remaining Capital</th>
                  <th style={{ padding: '12px 14px' }}>Revenue Collected</th>
                  <th style={{ padding: '12px 14px' }}>Milestone Progress</th>
                  <th style={{ padding: '12px 14px', textAlign: 'right' }}>Diligence</th>
                </tr>
              </thead>
              <tbody>
                {businessProjects.map(proj => {
                  const fin = calculateProjectFinancials(proj);

                  return (
                    <tr 
                      key={proj.id}
                      style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.04)' }}
                    >
                      <td style={{ padding: '14px' }}>
                        <div style={{ fontWeight: '800', color: '#fff', fontSize: '0.92rem' }}>{proj.name}</div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{proj.category}</div>
                      </td>
                      <td style={{ padding: '14px', fontWeight: '700', color: '#fbbf24' }}>
                        {formatMoney(fin.capitalRequested)}
                      </td>
                      <td style={{ padding: '14px', color: '#38bdf8' }}>
                        {formatMoney(fin.totalAdSpend)}
                      </td>
                      <td style={{ padding: '14px', color: '#cbd5e1' }}>
                        {formatMoney(fin.directCosts)}
                      </td>
                      <td style={{ padding: '14px', color: '#94a3b8' }}>
                        {formatMoney(fin.nonAdExpenses)}
                      </td>
                      <td style={{ padding: '14px', color: '#e2e8f0', fontWeight: '600' }}>
                        {formatMoney(fin.actualSpent)}
                      </td>
                      <td style={{ padding: '14px', color: '#10b981', fontWeight: '700' }}>
                        {formatMoney(fin.remainingCapitalToDeploy)}
                      </td>
                      <td style={{ padding: '14px', color: '#10b981', fontWeight: '700' }}>
                        {formatMoney(fin.actualRevenue)}
                      </td>
                      <td style={{ padding: '14px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <div style={{ width: '60px', height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', overflow: 'hidden' }}>
                            <div style={{ width: `${fin.timelineProgressPercent}%`, height: '100%', background: '#10b981' }} />
                          </div>
                          <span style={{ fontSize: '0.75rem', color: '#fff', fontWeight: '700' }}>{fin.timelineProgressPercent}%</span>
                        </div>
                      </td>
                      <td style={{ padding: '14px', textAlign: 'right' }}>
                        <button 
                          onClick={() => setInvestorModalProject(proj)}
                          className="btn btn-ghost btn-sm"
                          style={{ fontSize: '0.75rem', padding: '4px 8px', color: '#fbbf24' }}
                        >
                          View All
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUB-VIEW 3: MASTER MILESTONES & TIMELINE PIPELINE */}
      {/* ========================================================================= */}
      {activeSubView === 'timeline' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
          {businessProjects.map(proj => {
            const fin = calculateProjectFinancials(proj);

            return (
              <div 
                key={proj.id}
                style={{
                  background: 'var(--card-bg, #0b1120)',
                  borderRadius: '18px',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  padding: '24px 28px',
                  boxShadow: '0 8px 30px rgba(0, 0, 0, 0.4)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '18px' }}>
                  <div>
                    <span className="badge badge-gold" style={{ fontSize: '0.7rem', padding: '2px 8px', marginBottom: '4px' }}>
                      {proj.status.toUpperCase()}
                    </span>
                    <h3 style={{ fontSize: '1.3rem', fontWeight: '800', color: '#fff', margin: '4px 0' }}>
                      {proj.name}: Project Timeline & Milestones
                    </h3>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      Sprint: {proj.campaignStartDate} to {proj.campaignEndDate} ({proj.campaignDurationDays} Days)
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Progress Completion</div>
                    <div style={{ fontSize: '1.25rem', fontWeight: '800', color: '#10b981' }}>{fin.timelineProgressPercent}% Completed</div>
                  </div>
                </div>

                {/* Milestones Flow */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
                  {(proj.timeline || []).map((m, idx) => (
                    <div 
                      key={m.id}
                      style={{
                        padding: '14px',
                        borderRadius: '12px',
                        background: m.status === 'COMPLETED' ? 'rgba(16, 185, 129, 0.08)' : m.status === 'IN_PROGRESS' ? 'rgba(56, 189, 248, 0.08)' : 'rgba(255, 255, 255, 0.02)',
                        border: m.status === 'IN_PROGRESS' ? '1px solid rgba(56, 189, 248, 0.4)' : '1px solid rgba(255, 255, 255, 0.06)',
                        position: 'relative'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                        <span style={{ fontSize: '0.7rem', fontWeight: '700', color: 'var(--text-muted)' }}>
                          Step {idx + 1}
                        </span>
                        <span className="badge" style={{ 
                          fontSize: '0.62rem',
                          background: m.status === 'COMPLETED' ? '#10b981' : m.status === 'IN_PROGRESS' ? '#38bdf8' : '#475569',
                          color: '#000',
                          padding: '1px 6px'
                        }}>
                          {m.status}
                        </span>
                      </div>

                      <strong style={{ display: 'block', fontSize: '0.85rem', color: '#fff', marginBottom: '4px' }}>
                        {m.phase}
                      </strong>
                      <div style={{ fontSize: '0.72rem', color: '#38bdf8', marginBottom: '6px' }}>
                        {m.period}
                      </div>
                      <p style={{ fontSize: '0.75rem', color: '#94a3b8', margin: 0, lineHeight: '1.4' }}>
                        {m.deliverables}
                      </p>

                      <div style={{ marginTop: '10px', paddingTop: '8px', borderTop: '1px dashed rgba(255, 255, 255, 0.08)', fontSize: '0.72rem', display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: 'var(--text-muted)' }}>Budget:</span>
                        <strong style={{ color: '#fbbf24' }}>{formatMoney(m.allocatedBudget)}</strong>
                      </div>
                    </div>
                  ))}
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUB-VIEW 4: AI NATURAL LANGUAGE PARSER & DATA ENTRY */}
      {/* ========================================================================= */}
      {activeSubView === 'ai-parser' && (
        <div 
          style={{
            background: 'var(--card-bg, #0b1120)',
            borderRadius: '18px',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            padding: '28px',
            boxShadow: '0 8px 30px rgba(0, 0, 0, 0.4)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
            <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'rgba(245, 158, 11, 0.15)', color: '#fbbf24', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Bot size={22} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#fff', margin: 0 }}>
                AI-Powered Natural Language Financial Data Entry
              </h3>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: 0 }}>
                Type unstructured text — the AI extracts budget, duration, lead targets, sales goals, and commission figures.
              </p>
            </div>
          </div>

          {/* Quick Sample Prompts */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', margin: '18px 0 14px 0' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', alignSelf: 'center' }}>Quick Test Prompts:</span>
            <button
              type="button"
              onClick={() => {
                setAiInputText("Run ₹250 daily ads for 40 days, generate 20 leads per day, convert 5 leads into paid sales, and earn ₹100 commission per completed sale.");
                setAiTargetProjectId('proj-carpenterbullet');
              }}
              className="btn btn-ghost btn-sm"
              style={{ fontSize: '0.72rem', padding: '3px 8px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.1)' }}
            >
              CarpenterBullet Campaign (User Prompt)
            </button>
            <button
              type="button"
              onClick={() => {
                setAiInputText("Meta ads ₹200 daily for 6 days with posters ₹1000 and domain ₹1100. Target 10 orders per day across 60 total orders at ₹250 average order.");
                setAiTargetProjectId('proj-unavukadai');
              }}
              className="btn btn-ghost btn-sm"
              style={{ fontSize: '0.72rem', padding: '3px 8px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.1)' }}
            >
              UnavuKadai 6-Day Launch
            </button>
            <button
              type="button"
              onClick={() => {
                setAiInputText("Manufacturing cost is ₹600 per piece, selling price is ₹1200, daily ads ₹200 for 30 days, production target 150 units.");
                setAiTargetProjectId('proj-wooden-laptop-case');
              }}
              className="btn btn-ghost btn-sm"
              style={{ fontSize: '0.72rem', padding: '3px 8px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.1)' }}
            >
              Wooden Laptop Case 150 Units
            </button>
          </div>

          <div style={{ marginBottom: '18px' }}>
            <textarea
              rows={4}
              value={aiInputText}
              onChange={(e) => setAiInputText(e.target.value)}
              placeholder="e.g. Run ₹250 daily ads for 40 days, generate 20 leads per day, convert 5 leads into paid sales, and earn ₹100 commission per completed sale."
              style={{
                width: '100%',
                padding: '14px',
                borderRadius: '12px',
                border: '1px solid rgba(245, 158, 11, 0.3)',
                background: 'rgba(0, 0, 0, 0.35)',
                color: '#fff',
                fontSize: '0.95rem',
                outline: 'none',
                fontFamily: 'inherit'
              }}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Target Business Project:</span>
              <select
                value={aiTargetProjectId}
                onChange={(e) => setAiTargetProjectId(e.target.value)}
                style={{
                  padding: '7px 12px',
                  borderRadius: '8px',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  background: '#0f172a',
                  color: '#fff',
                  fontSize: '0.85rem',
                  outline: 'none'
                }}
              >
                {businessProjects.map(p => (
                  <option key={p.id} value={p.id}>{p.name} ({p.category})</option>
                ))}
              </select>
            </div>

            <button 
              type="button"
              onClick={handleRunAiAnalysis}
              className="btn btn-primary"
              style={{ borderRadius: '10px', padding: '10px 18px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
            >
              <Sparkles size={16} />
              <span>Extract Financial Assumptions</span>
            </button>
          </div>

          {/* AI Analysis Preview */}
          {aiAnalysisResult && (
            <div 
              style={{
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '14px',
                padding: '22px'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CheckCircle2 size={18} className="text-emerald-400" />
                  <h4 style={{ fontSize: '1.05rem', fontWeight: '800', color: '#fff', margin: 0 }}>
                    Extracted Values for Administrator Review
                  </h4>
                </div>
                <span className="badge badge-emerald" style={{ fontSize: '0.72rem', padding: '3px 8px' }}>
                  Confidence: {aiAnalysisResult.confidenceScore}
                </span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px', marginBottom: '18px' }}>
                <div style={{ background: 'rgba(0,0,0,0.3)', padding: '10px 12px', borderRadius: '8px' }}>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Daily Ad Budget</div>
                  <div style={{ fontSize: '1rem', fontWeight: '800', color: '#38bdf8', marginTop: '2px' }}>
                    {aiAnalysisResult.extractedValues.dailyAdBudget ? formatMoney(aiAnalysisResult.extractedValues.dailyAdBudget) : '—'}
                  </div>
                </div>

                <div style={{ background: 'rgba(0,0,0,0.3)', padding: '10px 12px', borderRadius: '8px' }}>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Campaign Duration</div>
                  <div style={{ fontSize: '1rem', fontWeight: '800', color: '#fff', marginTop: '2px' }}>
                    {aiAnalysisResult.extractedValues.campaignDurationDays ? `${aiAnalysisResult.extractedValues.campaignDurationDays} Days` : '—'}
                  </div>
                </div>

                <div style={{ background: 'rgba(0,0,0,0.3)', padding: '10px 12px', borderRadius: '8px' }}>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Total Calculated Ad Spend</div>
                  <div style={{ fontSize: '1rem', fontWeight: '800', color: '#fbbf24', marginTop: '2px' }}>
                    {aiAnalysisResult.extractedValues.totalAdBudget ? formatMoney(aiAnalysisResult.extractedValues.totalAdBudget) : '—'}
                  </div>
                </div>

                <div style={{ background: 'rgba(0,0,0,0.3)', padding: '10px 12px', borderRadius: '8px' }}>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Sales Target</div>
                  <div style={{ fontSize: '1rem', fontWeight: '800', color: '#10b981', marginTop: '2px' }}>
                    {aiAnalysisResult.extractedValues.totalSalesTarget ? `${aiAnalysisResult.extractedValues.totalSalesTarget} units` : '—'}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '16px' }}>
                <button
                  type="button"
                  onClick={() => setAiAnalysisResult(null)}
                  className="btn btn-secondary btn-sm"
                  style={{ borderRadius: '8px' }}
                >
                  Discard
                </button>
                <button
                  type="button"
                  onClick={handleApplyAiAssumptions}
                  className="btn btn-emerald btn-sm"
                  style={{ borderRadius: '8px', padding: '8px 18px', fontWeight: '700' }}
                  disabled={isApplyingAi}
                >
                  {isApplyingAi ? 'Saving...' : 'Confirm & Apply to Project'}
                </button>
              </div>

            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUB-VIEW 5: AUDIT TRAIL LOG */}
      {/* ========================================================================= */}
      {activeSubView === 'audit-log' && (
        <div 
          style={{
            background: 'var(--card-bg, #0b1120)',
            borderRadius: '18px',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            padding: '28px',
            boxShadow: '0 8px 30px rgba(0, 0, 0, 0.4)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
            <History size={20} className="text-amber-400" />
            <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#fff', margin: 0 }}>
              Audit History & Changes Log
            </h3>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.08)', color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase' }}>
                  <th style={{ padding: '12px 14px' }}>Timestamp</th>
                  <th style={{ padding: '12px 14px' }}>Project ID</th>
                  <th style={{ padding: '12px 14px' }}>User</th>
                  <th style={{ padding: '12px 14px' }}>Action</th>
                  <th style={{ padding: '12px 14px' }}>Audit Note</th>
                </tr>
              </thead>
              <tbody>
                {projectChangeHistory.map(entry => (
                  <tr key={entry.id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.04)' }}>
                    <td style={{ padding: '12px 14px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      {entry.timestamp}
                    </td>
                    <td style={{ padding: '12px 14px', fontSize: '0.82rem', fontFamily: 'monospace', color: '#38bdf8' }}>
                      {entry.projectId}
                    </td>
                    <td style={{ padding: '12px 14px', fontSize: '0.82rem', color: '#fff', fontWeight: '600' }}>
                      {entry.user}
                    </td>
                    <td style={{ padding: '12px 14px' }}>
                      <span className="badge" style={{ fontSize: '0.72rem', background: 'rgba(245, 158, 11, 0.15)', color: '#fbbf24', padding: '2px 8px' }}>
                        {entry.action}
                      </span>
                    </td>
                    <td style={{ padding: '12px 14px', fontSize: '0.82rem', color: '#cbd5e1' }}>
                      {entry.note}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 1: EDIT PROJECT ASSUMPTIONS (ADMIN) */}
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
                  Edit Project Assumptions: {editingProject.name}
                </h3>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  All metrics automatically recalculate upon saving.
                </span>
              </div>
              <button onClick={() => setEditingProject(null)} className="btn btn-ghost btn-sm" style={{ padding: '4px' }}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
                    Daily Ad Budget (₹):
                  </label>
                  <input 
                    type="number"
                    value={editFormData.dailyAdBudget}
                    onChange={(e) => setEditFormData(prev => ({ ...prev, dailyAdBudget: e.target.value }))}
                    required
                    style={{ width: '100%', padding: '9px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.3)', color: '#fff' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
                    Campaign Duration (Days):
                  </label>
                  <input 
                    type="number"
                    value={editFormData.campaignDurationDays}
                    onChange={(e) => setEditFormData(prev => ({ ...prev, campaignDurationDays: e.target.value }))}
                    required
                    style={{ width: '100%', padding: '9px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.3)', color: '#fff' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
                    Required Capital (₹):
                  </label>
                  <input 
                    type="number"
                    value={editFormData.statedTotalBudget}
                    onChange={(e) => setEditFormData(prev => ({ ...prev, statedTotalBudget: e.target.value }))}
                    required
                    style={{ width: '100%', padding: '9px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.3)', color: '#fff' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
                    Status:
                  </label>
                  <select
                    value={editFormData.status}
                    onChange={(e) => setEditFormData(prev => ({ ...prev, status: e.target.value }))}
                    style={{ width: '100%', padding: '9px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: '#0f172a', color: '#fff' }}
                  >
                    <option value="Planning">Planning</option>
                    <option value="Testing">Testing</option>
                    <option value="Active">Active</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
              </div>

              {editingProject.type === 'COMMISSION_MARKETPLACE' ? (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
                      Commission per Sale (₹):
                    </label>
                    <input 
                      type="number"
                      value={editFormData.commissionPerCompletedSale}
                      onChange={(e) => setEditFormData(prev => ({ ...prev, commissionPerCompletedSale: e.target.value }))}
                      required
                      style={{ width: '100%', padding: '9px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.3)', color: '#fff' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
                      Campaign Sales Target:
                    </label>
                    <input 
                      type="number"
                      value={editFormData.productionTarget}
                      onChange={(e) => setEditFormData(prev => ({ ...prev, productionTarget: e.target.value }))}
                      required
                      style={{ width: '100%', padding: '9px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.3)', color: '#fff' }}
                    />
                  </div>
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
                      Selling Price per Unit (₹):
                    </label>
                    <input 
                      type="number"
                      value={editFormData.proposedSellingPrice}
                      onChange={(e) => setEditFormData(prev => ({ ...prev, proposedSellingPrice: e.target.value }))}
                      required
                      style={{ width: '100%', padding: '9px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.3)', color: '#fff' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
                      Cost per Unit (₹):
                    </label>
                    <input 
                      type="number"
                      value={editFormData.totalDirectCostPerUnit}
                      onChange={(e) => setEditFormData(prev => ({ ...prev, totalDirectCostPerUnit: e.target.value }))}
                      required
                      style={{ width: '100%', padding: '9px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.3)', color: '#fff' }}
                    />
                  </div>
                </div>
              )}

              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <button type="button" onClick={() => setEditingProject(null)} className="btn btn-secondary" style={{ flex: 1, borderRadius: '10px' }}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" style={{ flex: 1, borderRadius: '10px' }}>
                  Save Assumptions
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: INVESTOR DILIGENCE DEEP-DIVE MODAL */}
      {/* ========================================================================= */}
      {investorModalProject && (() => {
        const fin = calculateProjectFinancials(investorModalProject);
        return (
          <div className="modal-overlay" onClick={() => setInvestorModalProject(null)}>
            <div 
              className="modal-content" 
              onClick={(e) => e.stopPropagation()}
              style={{ maxWidth: '680px', width: '100%', padding: '28px', borderRadius: '20px' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
                <div>
                  <h3 style={{ fontSize: '1.35rem', color: '#fff', margin: 0, fontWeight: '800' }}>
                    Investor Diligence: {investorModalProject.name}
                  </h3>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    {investorModalProject.category} • Sprint: {investorModalProject.campaignStartDate} to {investorModalProject.campaignEndDate}
                  </span>
                </div>
                <button onClick={() => setInvestorModalProject(null)} className="btn btn-ghost btn-sm" style={{ padding: '4px' }}>
                  <X size={18} />
                </button>
              </div>

              {/* Complete Cost Itemization */}
              <div style={{ background: 'rgba(255, 255, 255, 0.03)', borderRadius: '14px', padding: '16px', marginBottom: '16px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
                <h4 style={{ fontSize: '0.88rem', fontWeight: '700', color: '#fbbf24', margin: '0 0 10px 0' }}>
                  Full Cost Allocation & Deployment Status:
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {(investorModalProject.expenseBreakdown || []).map((item, idx) => (
                    <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem' }}>
                      <span style={{ color: '#cbd5e1' }}>• {item.item} <span style={{ color: 'var(--text-muted)', fontSize: '0.72rem' }}>({item.progress})</span></span>
                      <strong style={{ color: '#fff' }}>{formatMoney(item.amount)}</strong>
                    </div>
                  ))}
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', paddingTop: '8px', borderTop: '1px dashed rgba(255, 255, 255, 0.1)', marginTop: '4px' }}>
                    <span style={{ fontWeight: '700', color: 'var(--text-muted)' }}>Total Capital Required:</span>
                    <strong style={{ color: '#fbbf24' }}>{formatMoney(fin.capitalRequested)}</strong>
                  </div>
                </div>
              </div>

              {/* Deployment & Spending Balance */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '16px' }}>
                <div style={{ background: 'rgba(0,0,0,0.3)', padding: '10px', borderRadius: '10px', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>Spent to Date</div>
                  <div style={{ fontSize: '0.95rem', fontWeight: '800', color: '#e2e8f0', marginTop: '2px' }}>{formatMoney(fin.actualSpent)}</div>
                </div>
                <div style={{ background: 'rgba(0,0,0,0.3)', padding: '10px', borderRadius: '10px', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>Remaining to Deploy</div>
                  <div style={{ fontSize: '0.95rem', fontWeight: '800', color: '#10b981', marginTop: '2px' }}>{formatMoney(fin.remainingCapitalToDeploy)}</div>
                </div>
                <div style={{ background: 'rgba(0,0,0,0.3)', padding: '10px', borderRadius: '10px', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>Collected Revenue</div>
                  <div style={{ fontSize: '0.95rem', fontWeight: '800', color: '#38bdf8', marginTop: '2px' }}>{formatMoney(fin.actualRevenue)}</div>
                </div>
              </div>

              {/* Milestones Pipeline Summary */}
              <div style={{ marginBottom: '16px' }}>
                <h4 style={{ fontSize: '0.82rem', fontWeight: '700', color: '#10b981', margin: '0 0 8px 0' }}>
                  Stage Milestones Progression ({fin.completedMilestones}/{fin.totalMilestones} Completed):
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {(investorModalProject.timeline || []).map((m, idx) => (
                    <div key={m.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', padding: '6px 8px', borderRadius: '6px', background: 'rgba(255,255,255,0.02)' }}>
                      <span style={{ color: '#e2e8f0' }}>{idx + 1}. {m.phase}</span>
                      <span className="badge" style={{ fontSize: '0.62rem', padding: '1px 5px', background: m.status === 'COMPLETED' ? '#10b981' : '#38bdf8', color: '#000' }}>
                        {m.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <button onClick={() => setInvestorModalProject(null)} className="btn btn-secondary btn-sm" style={{ borderRadius: '8px' }}>
                  Close Diligence View
                </button>
              </div>

            </div>
          </div>
        );
      })()}

    </div>
  );
};
