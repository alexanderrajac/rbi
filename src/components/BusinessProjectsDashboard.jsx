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
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  SlidersHorizontal, 
  Bot, 
  FileText, 
  Download, 
  Printer, 
  HelpCircle, 
  Search, 
  ArrowRight, 
  Info, 
  Eye, 
  Edit3, 
  Layers, 
  Coins, 
  ShieldAlert, 
  X, 
  PlusCircle, 
  History, 
  BarChart3,
  Check,
  Percent,
  RefreshCw
} from 'lucide-react';

export const BusinessProjectsDashboard = () => {
  const { 
    businessProjects, 
    updateBusinessProject, 
    addBusinessProject, 
    projectChangeHistory, 
    formatMoney, 
    currency 
  } = useApp();

  // Active Tab View: 'grid' | 'investor' | 'ai-parser' | 'audit-log'
  const [activeSubView, setActiveSubView] = useState('grid');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

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
      `Manual assumption edit: daily ads ₹${updated.dailyAdBudget}, ${updated.campaignDurationDays} days`
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
      alert(`AI Assumptions successfully verified and saved to ${target.name}!`);
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
      'Daily Ad Budget (INR)',
      'Campaign Days',
      'Total Ad Spend (INR)',
      'Sales/Order Target',
      'Selling Price / Commission (INR)',
      'Projected Revenue (INR)',
      'Direct Costs (INR)',
      'Projected Gross Profit (INR)',
      'Remaining After Ads (INR)',
      'Projected Net Profit (INR)',
      'Amount Spent to Date (INR)',
      'Actual Revenue Collected (INR)',
      'Actual Operating Profit/Loss (INR)'
    ];

    const rows = businessProjects.map(proj => {
      const fin = calculateProjectFinancials(proj);
      const targetUnits = proj.productionTarget || proj.totalOrderTarget || proj.campaignSalesTarget || 0;
      const priceOrComm = proj.commissionPerCompletedSale || proj.proposedSellingPrice || proj.avgSellingPricePerUnit || 0;

      return [
        proj.id,
        `"${proj.name}"`,
        `"${proj.category}"`,
        proj.status,
        fin.capitalRequested,
        proj.dailyAdBudget,
        proj.campaignDurationDays,
        fin.totalAdSpend,
        targetUnits,
        priceOrComm,
        fin.projectedRevenue,
        fin.directCosts,
        fin.projectedGrossProfit,
        fin.remainingAfterAds,
        fin.projectedNetProfit,
        fin.actualSpent,
        fin.actualRevenue,
        fin.actualOperatingProfit
      ];
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `rbi_business_projects_financials_${new Date().toISOString().slice(0, 10)}.csv`);
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
    acc.totalProjectedRevenue += fin.projectedRevenue;
    acc.totalActualSpent += fin.actualSpent;
    acc.totalActualRevenue += fin.actualRevenue;
    return acc;
  }, { totalCapitalRequested: 0, totalAdSpend: 0, totalProjectedRevenue: 0, totalActualSpent: 0, totalActualRevenue: 0 });

  return (
    <div className="container" style={{ padding: '24px 20px', maxWidth: '1280px', margin: '0 auto' }}>
      
      {/* Platform Title Banner */}
      <div 
        style={{
          background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.9) 0%, rgba(30, 41, 59, 0.8) 100%)',
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
                AI-POWERED BUSINESS PORTFOLIO
              </span>
              <span style={{ fontSize: '0.8rem', color: '#10b981', display: 'flex', alignItems: 'center', gap: '5px' }}>
                <span className="live-pulse-dot" style={{ width: '6px', height: '6px', background: '#10b981' }}></span>
                4 Verified Business Engines
              </span>
            </div>

            <h1 style={{ fontSize: '2.1rem', fontWeight: '800', color: '#fff', margin: '0 0 8px 0', letterSpacing: '-0.02em' }}>
              Business Investment & Project Dashboard
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', margin: 0, maxWidth: '820px', lineHeight: '1.5' }}>
              Independent financial modelling for <strong>UnavuKadai Jasai</strong>, <strong>CarpenterBullet</strong>, <strong>Wooden Laptop Case</strong>, and <strong>Bamboo Cup</strong>. Strictly audits capital requested, ad spend, verified revenue, and prevents unverified profit promises.
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
              <span>AI Data Entry Assistant</span>
            </button>

            <button 
              onClick={exportPortfolioCSV}
              className="btn btn-secondary btn-sm"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', borderRadius: '10px' }}
            >
              <Download size={15} />
              <span>Export Excel / CSV</span>
            </button>

            <button 
              onClick={() => window.print()}
              className="btn btn-ghost btn-sm"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', borderRadius: '10px' }}
            >
              <Printer size={15} />
              <span>Print PDF</span>
            </button>
          </div>
        </div>

        {/* Portfolio Top Metrics Bar */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '14px', marginTop: '24px' }}>
          <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '14px 18px', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Capital Requested (4 Proj)</div>
            <div style={{ fontSize: '1.45rem', fontWeight: '800', color: '#fbbf24', marginTop: '4px' }}>{formatMoney(portfolioAggregates.totalCapitalRequested)}</div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '2px' }}>Fully allocated into segregated accounts</div>
          </div>

          <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '14px 18px', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Planned Total Ad Spend</div>
            <div style={{ fontSize: '1.45rem', fontWeight: '800', color: '#38bdf8', marginTop: '4px' }}>{formatMoney(portfolioAggregates.totalAdSpend)}</div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '2px' }}>Meta, Google & Print channels</div>
          </div>

          <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '14px 18px', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Projected Target Revenue</div>
            <div style={{ fontSize: '1.45rem', fontWeight: '800', color: '#10b981', marginTop: '4px' }}>{formatMoney(portfolioAggregates.totalProjectedRevenue)}</div>
            <div style={{ fontSize: '0.72rem', color: '#cbd5e1', marginTop: '2px' }}>*Based on target volumes (Projections)</div>
          </div>

          <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '14px 18px', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Revenue Collected to Date</div>
            <div style={{ fontSize: '1.45rem', fontWeight: '800', color: '#e2e8f0', marginTop: '4px' }}>{formatMoney(portfolioAggregates.totalActualRevenue)}</div>
            <div style={{ fontSize: '0.72rem', color: '#10b981', marginTop: '2px' }}>Spent: {formatMoney(portfolioAggregates.totalActualSpent)} verified</div>
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
            <span>Project Cards (4)</span>
          </button>

          <button 
            onClick={() => setActiveSubView('investor')}
            className={`btn btn-sm ${activeSubView === 'investor' ? 'btn-primary' : 'btn-ghost'}`}
            style={{ borderRadius: '8px' }}
          >
            <Eye size={15} />
            <span>Investor Diligence View</span>
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
            <span>AI Natural Language Parser</span>
          </button>

          <button 
            onClick={() => setActiveSubView('audit-log')}
            className={`btn btn-sm ${activeSubView === 'audit-log' ? 'btn-primary' : 'btn-ghost'}`}
            style={{ borderRadius: '8px' }}
          >
            <History size={15} />
            <span>Audit Trail Log</span>
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
      {/* SUB-VIEW 1: PROJECT CARDS GRID */}
      {/* ========================================================================= */}
      {activeSubView === 'grid' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '22px' }}>
          {filteredProjects.map(project => {
            // Check if project is Bamboo Cup to apply scenario
            const customUnits = project.id === 'proj-bamboo-cup' ? bambooScenario : null;
            const financials = calculateProjectFinancials(project, customUnits);

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
                {/* Header */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                    <div>
                      <span className="badge" style={{ 
                        fontSize: '0.7rem', 
                        background: project.status === 'Active' ? 'rgba(16, 185, 129, 0.15)' : project.status === 'Testing' ? 'rgba(56, 189, 248, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                        color: project.status === 'Active' ? '#10b981' : project.status === 'Testing' ? '#38bdf8' : '#fbbf24',
                        marginBottom: '4px',
                        display: 'inline-block'
                      }}>
                        {project.status.toUpperCase()}
                      </span>
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

                  <p style={{ fontSize: '0.84rem', color: '#94a3b8', margin: '8px 0 16px 0', lineHeight: '1.45' }}>
                    {project.description}
                  </p>

                  {/* Special Bamboo Cup 100 vs 150 Scenario Toggle */}
                  {project.id === 'proj-bamboo-cup' && (
                    <div style={{ 
                      background: 'rgba(245, 158, 11, 0.08)', 
                      padding: '10px 14px', 
                      borderRadius: '10px', 
                      border: '1px solid rgba(245, 158, 11, 0.2)',
                      marginBottom: '16px' 
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
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
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                        {bambooScenario === 100 ? 'Revenue: ₹49,900 | Stated Unit Profit: ₹19,900' : 'Revenue: ₹74,850 | Stated Unit Profit: ₹29,850'}
                      </div>
                    </div>
                  )}

                  {/* Core Metrics Grid */}
                  <div style={{ 
                    background: 'rgba(0, 0, 0, 0.25)', 
                    borderRadius: '12px', 
                    padding: '14px', 
                    border: '1px solid rgba(255, 255, 255, 0.05)',
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '12px',
                    marginBottom: '16px'
                  }}>
                    <div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Required Investment</div>
                      <div style={{ fontSize: '1rem', fontWeight: '800', color: '#fbbf24' }}>{formatMoney(financials.capitalRequested)}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Daily Ad Budget</div>
                      <div style={{ fontSize: '1rem', fontWeight: '800', color: '#38bdf8' }}>{formatMoney(project.dailyAdBudget)}/day</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Campaign Duration</div>
                      <div style={{ fontSize: '0.92rem', fontWeight: '700', color: '#fff' }}>{project.campaignDurationDays} Days</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Total Ad Spend</div>
                      <div style={{ fontSize: '0.92rem', fontWeight: '700', color: '#38bdf8' }}>{formatMoney(financials.totalAdSpend)}</div>
                    </div>

                    {/* Model-Specific Targets */}
                    {project.type === 'COMMISSION_MARKETPLACE' ? (
                      <>
                        <div>
                          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Target Leads / Day</div>
                          <div style={{ fontSize: '0.92rem', fontWeight: '700', color: '#fff' }}>15–20 leads</div>
                        </div>
                        <div>
                          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Completed Sales Target</div>
                          <div style={{ fontSize: '0.92rem', fontWeight: '700', color: '#10b981' }}>{project.campaignSalesTarget} sales</div>
                        </div>
                        <div>
                          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Commission / Sale</div>
                          <div style={{ fontSize: '0.92rem', fontWeight: '700', color: '#fbbf24' }}>₹{project.commissionPerCompletedSale}</div>
                        </div>
                        <div>
                          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Remaining After Ads</div>
                          <div style={{ fontSize: '0.92rem', fontWeight: '700', color: '#10b981' }}>{formatMoney(financials.remainingAfterAds)}</div>
                        </div>
                      </>
                    ) : project.type === 'SERVICE_ORDER' ? (
                      <>
                        <div>
                          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Daily Order Target</div>
                          <div style={{ fontSize: '0.92rem', fontWeight: '700', color: '#fff' }}>{project.dailyOrderTarget} orders/day</div>
                        </div>
                        <div>
                          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Total Target Orders</div>
                          <div style={{ fontSize: '0.92rem', fontWeight: '700', color: '#10b981' }}>{project.totalOrderTarget} orders</div>
                        </div>
                        <div>
                          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Avg Order Value</div>
                          <div style={{ fontSize: '0.92rem', fontWeight: '700', color: '#fbbf24' }}>{formatMoney(project.avgSellingPricePerUnit)}</div>
                        </div>
                        <div>
                          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Unit Cost + Delivery</div>
                          <div style={{ fontSize: '0.92rem', fontWeight: '700', color: '#e2e8f0' }}>₹{project.directCostPerUnit + project.deliveryCostPerUnit}</div>
                        </div>
                      </>
                    ) : (
                      <>
                        <div>
                          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Selling Price / Unit</div>
                          <div style={{ fontSize: '0.92rem', fontWeight: '700', color: '#fbbf24' }}>₹{project.proposedSellingPrice}</div>
                        </div>
                        <div>
                          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Cost Per Unit</div>
                          <div style={{ fontSize: '0.92rem', fontWeight: '700', color: '#e2e8f0' }}>₹{project.totalDirectCostPerUnit}</div>
                        </div>
                        <div>
                          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Production / Target</div>
                          <div style={{ fontSize: '0.92rem', fontWeight: '700', color: '#fff' }}>{customUnits || project.productionTarget} units</div>
                        </div>
                        <div>
                          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Remaining After Ads</div>
                          <div style={{ fontSize: '0.92rem', fontWeight: '700', color: '#10b981' }}>{formatMoney(financials.remainingAfterAds)}</div>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Financial Results Bar */}
                  <div style={{ 
                    background: 'rgba(16, 185, 129, 0.05)', 
                    border: '1px solid rgba(16, 185, 129, 0.2)', 
                    borderRadius: '12px', 
                    padding: '12px 14px',
                    marginBottom: '16px' 
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                      <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Expected Revenue:</span>
                      <strong style={{ fontSize: '0.95rem', color: '#fff' }}>{formatMoney(financials.projectedRevenue)}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                      <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Gross Profit:</span>
                      <strong style={{ fontSize: '0.95rem', color: '#38bdf8' }}>{formatMoney(financials.projectedGrossProfit)}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Projected Net Profit:</span>
                      <strong style={{ fontSize: '1rem', color: '#10b981' }}>{formatMoney(financials.projectedNetProfit)}</strong>
                    </div>
                  </div>
                </div>

                {/* Card Footer Actions */}
                <div style={{ display: 'flex', gap: '8px', paddingTop: '12px', borderTop: '1px solid rgba(255, 255, 255, 0.06)' }}>
                  <button 
                    onClick={() => setInvestorModalProject(project)}
                    className="btn btn-secondary btn-sm"
                    style={{ flex: 1, borderRadius: '8px', fontSize: '0.8rem', justifyContent: 'center' }}
                  >
                    <Eye size={14} /> Investor Breakdown
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
      {/* SUB-VIEW 2: INVESTOR DUE DILIGENCE VIEW */}
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
                Investor Capital Protection & Transparency Protocol
              </h4>
              <p style={{ color: '#fca5a5', fontSize: '0.82rem', margin: 0 }}>
                This platform strictly distinguishes between capital invested, funds spent, revenue collected, and net profit. <strong>We do not promise guaranteed returns.</strong> Forecasts are labeled as estimates until verified by bank statements and sales invoices.
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#fff', margin: 0 }}>
              Comparative Financial Due Diligence Table
            </h3>
            <button onClick={exportPortfolioCSV} className="btn btn-secondary btn-sm" style={{ borderRadius: '8px' }}>
              <Download size={14} /> Export Table
            </button>
          </div>

          {/* Table */}
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.1)', color: 'var(--text-muted)', fontSize: '0.74rem', textTransform: 'uppercase' }}>
                  <th style={{ padding: '12px 14px' }}>Project</th>
                  <th style={{ padding: '12px 14px' }}>Capital Requested</th>
                  <th style={{ padding: '12px 14px' }}>Spent to Date</th>
                  <th style={{ padding: '12px 14px' }}>Revenue Collected</th>
                  <th style={{ padding: '12px 14px' }}>Verified Expenses</th>
                  <th style={{ padding: '12px 14px' }}>Current Op Profit/Loss</th>
                  <th style={{ padding: '12px 14px' }}>Forecast Revenue</th>
                  <th style={{ padding: '12px 14px' }}>Forecast Net Profit</th>
                  <th style={{ padding: '12px 14px', textAlign: 'right' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {businessProjects.map(proj => {
                  const fin = calculateProjectFinancials(proj);
                  const isProfitPositive = fin.actualOperatingProfit >= 0;

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
                      <td style={{ padding: '14px', color: '#e2e8f0' }}>
                        {formatMoney(fin.actualSpent)}
                      </td>
                      <td style={{ padding: '14px', fontWeight: '700', color: '#10b981' }}>
                        {formatMoney(fin.actualRevenue)}
                      </td>
                      <td style={{ padding: '14px', color: '#94a3b8' }}>
                        {formatMoney(fin.actualVerifiedExpenses)}
                      </td>
                      <td style={{ padding: '14px' }}>
                        <span style={{ 
                          fontWeight: '800', 
                          color: isProfitPositive ? '#10b981' : '#f43f5e',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}>
                          {formatMoney(fin.actualOperatingProfit)}
                        </span>
                      </td>
                      <td style={{ padding: '14px', color: '#38bdf8' }}>
                        {formatMoney(fin.projectedRevenue)}*
                      </td>
                      <td style={{ padding: '14px', fontWeight: '700', color: '#10b981' }}>
                        {formatMoney(fin.projectedNetProfit)}*
                      </td>
                      <td style={{ padding: '14px', textAlign: 'right' }}>
                        <button 
                          onClick={() => setInvestorModalProject(proj)}
                          className="btn btn-ghost btn-sm"
                          style={{ fontSize: '0.75rem', padding: '4px 8px', color: '#fbbf24' }}
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div style={{ marginTop: '16px', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
            *Asterisk denotes forward-looking estimates subject to cost verification and market conditions.
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUB-VIEW 3: AI NATURAL LANGUAGE PARSER & DATA ENTRY */}
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

          {/* Textarea Input */}
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

          {/* Target Project Dropdown & Parse Button */}
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

          {/* AI Analysis Preview Box */}
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

              {/* Extracted Values Grid */}
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
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Daily Leads Target</div>
                  <div style={{ fontSize: '1rem', fontWeight: '800', color: '#cbd5e1', marginTop: '2px' }}>
                    {aiAnalysisResult.extractedValues.leadsPerDay || '—'}
                  </div>
                </div>

                <div style={{ background: 'rgba(0,0,0,0.3)', padding: '10px 12px', borderRadius: '8px' }}>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Sales Target</div>
                  <div style={{ fontSize: '1rem', fontWeight: '800', color: '#10b981', marginTop: '2px' }}>
                    {aiAnalysisResult.extractedValues.totalSalesTarget ? `${aiAnalysisResult.extractedValues.totalSalesTarget} units` : '—'}
                  </div>
                </div>

                <div style={{ background: 'rgba(0,0,0,0.3)', padding: '10px 12px', borderRadius: '8px' }}>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Commission / Selling Price</div>
                  <div style={{ fontSize: '1rem', fontWeight: '800', color: '#fbbf24', marginTop: '2px' }}>
                    {aiAnalysisResult.extractedValues.commissionPerSale ? `₹${aiAnalysisResult.extractedValues.commissionPerSale} (Comm)` : aiAnalysisResult.extractedValues.sellingPrice ? `₹${aiAnalysisResult.extractedValues.sellingPrice} (Price)` : '—'}
                  </div>
                </div>

                <div style={{ background: 'rgba(0,0,0,0.3)', padding: '10px 12px', borderRadius: '8px' }}>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Projected Revenue</div>
                  <div style={{ fontSize: '1rem', fontWeight: '800', color: '#10b981', marginTop: '2px' }}>
                    {aiAnalysisResult.extractedValues.projectedRevenue ? formatMoney(aiAnalysisResult.extractedValues.projectedRevenue) : '—'}
                  </div>
                </div>

                <div style={{ background: 'rgba(0,0,0,0.3)', padding: '10px 12px', borderRadius: '8px' }}>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Remaining After Ads</div>
                  <div style={{ fontSize: '1rem', fontWeight: '800', color: '#fbbf24', marginTop: '2px' }}>
                    {aiAnalysisResult.extractedValues.remainingAfterAds ? formatMoney(aiAnalysisResult.extractedValues.remainingAfterAds) : '—'}
                  </div>
                </div>
              </div>

              {/* Clarification & Warning Notes */}
              {aiAnalysisResult.clarificationQuestions && aiAnalysisResult.clarificationQuestions.length > 0 && (
                <div style={{ marginBottom: '16px' }}>
                  {aiAnalysisResult.clarificationQuestions.map((q, idx) => (
                    <div 
                      key={idx}
                      style={{
                        background: 'rgba(245, 158, 11, 0.08)',
                        border: '1px solid rgba(245, 158, 11, 0.25)',
                        borderRadius: '10px',
                        padding: '10px 14px',
                        fontSize: '0.8rem',
                        color: '#fef08a',
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '8px',
                        marginBottom: '6px'
                      }}
                    >
                      <Info size={16} style={{ flexShrink: 0, marginTop: '2px' }} />
                      <span>{q}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Confirmation Action Button */}
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
                  {isApplyingAi ? 'Saving Assumptions...' : 'Confirm & Apply to Project'}
                </button>
              </div>

            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUB-VIEW 4: AUDIT TRAIL LOG */}
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
                  All financial metrics automatically recalculate upon update.
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

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <button type="button" onClick={() => setEditingProject(null)} className="btn btn-secondary" style={{ flex: 1, borderRadius: '10px' }}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" style={{ flex: 1, borderRadius: '10px' }}>
                  Save & Recalculate
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
              style={{ maxWidth: '640px', width: '100%', padding: '28px', borderRadius: '20px' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
                <div>
                  <h3 style={{ fontSize: '1.35rem', color: '#fff', margin: 0, fontWeight: '800' }}>
                    Investor Summary: {investorModalProject.name}
                  </h3>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    Category: {investorModalProject.category}
                  </span>
                </div>
                <button onClick={() => setInvestorModalProject(null)} className="btn btn-ghost btn-sm" style={{ padding: '4px' }}>
                  <X size={18} />
                </button>
              </div>

              {/* Capital & Use of Funds */}
              <div style={{ background: 'rgba(255, 255, 255, 0.03)', borderRadius: '14px', padding: '16px', marginBottom: '18px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
                <h4 style={{ fontSize: '0.88rem', fontWeight: '700', color: '#fbbf24', margin: '0 0 10px 0' }}>
                  Planned Use of Funds & Expense Itemization:
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {(investorModalProject.expenseBreakdown || []).map((item, idx) => (
                    <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem' }}>
                      <span style={{ color: '#cbd5e1' }}>• {item.item}</span>
                      <strong style={{ color: '#fff' }}>{formatMoney(item.amount)}</strong>
                    </div>
                  ))}
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', paddingTop: '8px', borderTop: '1px dashed rgba(255, 255, 255, 0.1)', marginTop: '4px' }}>
                    <span style={{ fontWeight: '700', color: 'var(--text-muted)' }}>Total Capital Required:</span>
                    <strong style={{ color: '#fbbf24' }}>{formatMoney(fin.capitalRequested)}</strong>
                  </div>
                </div>
              </div>

              {/* Actuals vs Projections */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '18px' }}>
                <div style={{ background: 'rgba(0, 0, 0, 0.3)', padding: '14px', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Actuals to Date</div>
                  <div style={{ marginTop: '8px', fontSize: '0.82rem', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <div>Spent: <strong style={{ color: '#fff' }}>{formatMoney(fin.actualSpent)}</strong></div>
                    <div>Revenue: <strong style={{ color: '#10b981' }}>{formatMoney(fin.actualRevenue)}</strong></div>
                    <div>Operating P/L: <strong style={{ color: fin.actualOperatingProfit >= 0 ? '#10b981' : '#f43f5e' }}>{formatMoney(fin.actualOperatingProfit)}</strong></div>
                  </div>
                </div>

                <div style={{ background: 'rgba(0, 0, 0, 0.3)', padding: '14px', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Forecast (Unverified)</div>
                  <div style={{ marginTop: '8px', fontSize: '0.82rem', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <div>Projected Rev: <strong style={{ color: '#38bdf8' }}>{formatMoney(fin.projectedRevenue)}</strong></div>
                    <div>Gross Profit: <strong style={{ color: '#fff' }}>{formatMoney(fin.projectedGrossProfit)}</strong></div>
                    <div>Net Profit: <strong style={{ color: '#10b981' }}>{formatMoney(fin.projectedNetProfit)}</strong></div>
                  </div>
                </div>
              </div>

              {/* Risks & Assumptions */}
              <div style={{ marginBottom: '18px' }}>
                <h4 style={{ fontSize: '0.82rem', fontWeight: '700', color: '#fff', margin: '0 0 8px 0' }}>
                  Audited Risks & Underlying Assumptions:
                </h4>
                <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: '1.45' }}>
                  {(investorModalProject.risksAndAssumptions || []).map((risk, idx) => (
                    <li key={idx} style={{ marginBottom: '6px' }}>{risk}</li>
                  ))}
                </ul>
              </div>

              <div style={{ textAlign: 'right' }}>
                <button onClick={() => setInvestorModalProject(null)} className="btn btn-secondary btn-sm" style={{ borderRadius: '8px' }}>
                  Close Summary
                </button>
              </div>

            </div>
          </div>
        );
      })()}

    </div>
  );
};
