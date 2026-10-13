import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
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
  FileText
} from 'lucide-react';

export const AdminPortal = () => {
  const { 
    isAdminLoggedIn, 
    adminLogin, 
    adminLogout, 
    pendingApplications, 
    approveApplication, 
    rejectApplication, 
    startups, 
    projectDeals,
    advanceProjectMilestone,
    transactions, 
    ledgerEntries,
    formatMoney, 
    formatValuation,
    platformFeeRate,
    setPlatformFeeRate,
    user,
    setUser
  } = useApp();

  const [passwordInput, setPasswordInput] = useState('admin123');
  const [emailInput, setEmailInput] = useState('admin@rbi-group.org');
  const [loginError, setLoginError] = useState(false);
  const [adminTab, setAdminTab] = useState('approvals'); // 'approvals' | 'milestones' | 'ledger' | 'transactions' | 'users'
  const [actionNotice, setActionNotice] = useState(null);

  // Platform aggregations for Admin KPI
  const totalListedValuation = startups.reduce((sum, s) => sum + s.valuation, 0);
  const totalProjectCapital = projectDeals.reduce((sum, p) => sum + p.capitalRequired, 0);
  const totalFeesEarned = transactions.reduce((sum, tx) => sum + (tx.fee || 0), 0);

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    const success = adminLogin(passwordInput);
    if (!success) {
      setLoginError(true);
    } else {
      setLoginError(false);
    }
  };

  const handleApprove = (appId, appName) => {
    approveApplication(appId);
    setActionNotice(`Approved "${appName}" for public digital marketplace launch!`);
    setTimeout(() => setActionNotice(null), 3500);
  };

  const handleReject = (appId, appName) => {
    rejectApplication(appId);
    setActionNotice(`Rejected application for "${appName}".`);
    setTimeout(() => setActionNotice(null), 3500);
  };

  const handleApproveMilestone = (projectId, milestoneId, milestoneTitle) => {
    advanceProjectMilestone(projectId, milestoneId);
    setActionNotice(`Milestone "${milestoneTitle}" verified! Next tranche released to business.`);
    setTimeout(() => setActionNotice(null), 3500);
  };

  // If not authenticated, show Admin Login Portal
  if (!isAdminLoggedIn) {
    return (
      <div style={{ padding: '60px 0', minHeight: '80vh', display: 'flex', alignItems: 'center' }}>
        <div className="container" style={{ maxWidth: '480px' }}>
          
          <div className="glass-panel" style={{ 
            padding: '36px', 
            borderRadius: '20px',
            border: '1px solid rgba(245, 158, 11, 0.3)',
            boxShadow: '0 25px 50px -12px rgba(0,0,0,0.8), 0 0 30px rgba(245, 158, 11, 0.15)'
          }}>
            
            {/* Header */}
            <div style={{ textAlign: 'center', marginBottom: '28px' }}>
              <div style={{ 
                width: '64px', 
                height: '64px', 
                borderRadius: '16px', 
                background: 'linear-gradient(135deg, #fbbf24 0%, #d97706 100%)',
                color: '#000',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px auto',
                boxShadow: '0 0 25px rgba(245, 158, 11, 0.4)'
              }}>
                <ShieldCheck size={36} />
              </div>
              <h2 style={{ fontSize: '1.6rem', color: '#fff', marginBottom: '4px' }}>
                RBI Central Command Console
              </h2>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                Administrative supervision, order verification, and double-entry ledger oversight.
              </p>
            </div>

            {loginError && (
              <div style={{ 
                padding: '10px 14px', 
                borderRadius: '8px', 
                background: 'rgba(244, 63, 94, 0.15)', 
                border: '1px solid rgba(244, 63, 94, 0.3)',
                color: '#fb7185',
                fontSize: '0.85rem',
                marginBottom: '18px',
                textAlign: 'center'
              }}>
                Invalid administrator key. Use <strong>admin123</strong> for demo access.
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleLoginSubmit}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
                  Admin ID / Email
                </label>
                <input 
                  type="email" 
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  className="form-input"
                  required
                />
              </div>

              <div style={{ marginBottom: '22px' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
                  Master Access Key
                </label>
                <input 
                  type="password" 
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  className="form-input"
                  placeholder="admin123"
                  required
                />
              </div>

              <button 
                type="submit" 
                className="btn btn-primary"
                style={{ width: '100%', marginBottom: '12px' }}
              >
                <Lock size={16} />
                <span>Authenticate Admin Session</span>
              </button>

              <button 
                type="button" 
                onClick={() => adminLogin('admin123')}
                className="btn btn-secondary btn-sm"
                style={{ width: '100%', fontSize: '0.8rem' }}
              >
                ⚡ 1-Click Demo Login (admin123)
              </button>
            </form>

            <div style={{ marginTop: '20px', textAlign: 'center', fontSize: '0.72rem', color: 'var(--text-dim)' }}>
              🔒 256-Bit SSL Encrypted Admin Infrastructure • Royal Bank of Investment
            </div>

          </div>

        </div>
      </div>
    );
  }

  // Authenticated Admin Dashboard
  return (
    <div style={{ padding: '32px 0 60px 0' }}>
      <div className="container">
        
        {/* Admin Header */}
        <div style={{ 
          display: 'flex', 
          flexWrap: 'wrap', 
          alignItems: 'center', 
          justifyContent: 'space-between', 
          gap: '16px',
          marginBottom: '28px',
          borderBottom: '1px solid var(--border-color)',
          paddingBottom: '20px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ 
              width: '46px', 
              height: '46px', 
              borderRadius: '12px', 
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              boxShadow: '0 0 20px rgba(16, 185, 129, 0.4)'
            }}>
              <ShieldCheck size={28} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h1 style={{ fontSize: '1.8rem', color: '#fff', margin: 0 }}>RBI Central Administration</h1>
                <span className="badge badge-emerald">Regulatory Node Active</span>
              </div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', margin: '2px 0 0 0' }}>
                Alexander Rajasingh Supervision Suite • Section 42 & P2P Partner Ledger Rails
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button 
              onClick={adminLogout}
              className="btn btn-secondary btn-sm"
              style={{ color: '#fb7185' }}
            >
              <LogOut size={15} />
              <span>Exit Admin Mode</span>
            </button>
          </div>
        </div>

        {actionNotice && (
          <div style={{ 
            padding: '14px 20px', 
            borderRadius: '12px', 
            background: 'rgba(16, 185, 129, 0.15)', 
            border: '1px solid rgba(16, 185, 129, 0.4)',
            color: '#34d399',
            marginBottom: '24px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            <CheckCircle2 size={18} />
            <span>{actionNotice}</span>
          </div>
        )}

        {/* Executive Metric Cards */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', 
          gap: '18px', 
          marginBottom: '32px' 
        }}>
          <div className="glass-panel" style={{ padding: '20px' }}>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', textTransform: 'uppercase', marginBottom: '4px' }}>
              Active SME Project Orders
            </div>
            <div style={{ fontSize: '1.65rem', fontWeight: '800', color: '#fff' }}>
              ₹{(totalProjectCapital / 100000).toFixed(1)} Lakhs
            </div>
            <div style={{ fontSize: '0.75rem', color: '#38bdf8', marginTop: '4px' }}>
              {projectDeals.length} Verified Projects (CarpenterBullet, etc.)
            </div>
          </div>

          <div className="glass-panel" style={{ padding: '20px' }}>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', textTransform: 'uppercase', marginBottom: '4px' }}>
              Total Assets Under Custody
            </div>
            <div style={{ fontSize: '1.65rem', fontWeight: '800', color: '#10b981' }}>
              {formatValuation(totalListedValuation)}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
              Across {startups.length} Equity Startups
            </div>
          </div>

          <div className="glass-panel" style={{ padding: '20px', border: '1px solid rgba(245, 158, 11, 0.3)' }}>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', textTransform: 'uppercase', marginBottom: '4px' }}>
              RBI Platform Revenue (1.5%)
            </div>
            <div style={{ fontSize: '1.65rem', fontWeight: '800', color: '#fbbf24' }}>
              {formatMoney(totalFeesEarned, true)}
            </div>
            <div style={{ fontSize: '0.75rem', color: '#fbbf24', marginTop: '4px' }}>
              Origination & Brokerage Income
            </div>
          </div>

          <div className="glass-panel" style={{ padding: '20px' }}>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', textTransform: 'uppercase', marginBottom: '4px' }}>
              Pending Review Queue
            </div>
            <div style={{ fontSize: '1.65rem', fontWeight: '800', color: '#38bdf8' }}>
              {pendingApplications.filter(a => a.status === 'Pending Review').length} In Queue
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
              Awaiting KYC & Quotation Audit
            </div>
          </div>
        </div>

        {/* Admin Navigation Tabs */}
        <div style={{ display: 'flex', gap: '10px', marginBottom: '24px', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px', overflowX: 'auto' }}>
          <button 
            onClick={() => setAdminTab('approvals')}
            className={`btn btn-sm ${adminTab === 'approvals' ? 'btn-primary' : 'btn-ghost'}`}
            style={{ borderRadius: '8px' }}
          >
            <Building2 size={15} />
            <span>Listing Approvals ({pendingApplications.filter(a => a.status === 'Pending Review').length})</span>
          </button>

          <button 
            onClick={() => setAdminTab('milestones')}
            className={`btn btn-sm ${adminTab === 'milestones' ? 'btn-primary' : 'btn-ghost'}`}
            style={{ borderRadius: '8px' }}
          >
            <Hammer size={15} />
            <span>Milestone Evidence & Tranches</span>
          </button>

          <button 
            onClick={() => setAdminTab('ledger')}
            className={`btn btn-sm ${adminTab === 'ledger' ? 'btn-primary' : 'btn-ghost'}`}
            style={{ borderRadius: '8px' }}
          >
            <Layers size={15} />
            <span>Double-Entry Central Ledger ({ledgerEntries.length})</span>
          </button>

          <button 
            onClick={() => setAdminTab('transactions')}
            className={`btn btn-sm ${adminTab === 'transactions' ? 'btn-primary' : 'btn-ghost'}`}
            style={{ borderRadius: '8px' }}
          >
            <TrendingUp size={15} />
            <span>Transaction Audits ({transactions.length})</span>
          </button>
        </div>

        {/* TAB 1: LISTING APPROVALS */}
        {adminTab === 'approvals' && (
          <div>
            <h3 style={{ fontSize: '1.25rem', color: '#fff', marginBottom: '14px' }}>
              New Business & Order Financing Applications Awaiting Review
            </h3>

            {pendingApplications.length === 0 ? (
              <div className="glass-panel" style={{ padding: '40px', textAlign: 'center' }}>
                <CheckCircle2 size={36} style={{ color: '#10b981', margin: '0 auto 12px auto' }} />
                <h4 style={{ color: '#fff' }}>No Pending Applications</h4>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>All submitted businesses have been audited.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {pendingApplications.map(app => (
                  <div 
                    key={app.id} 
                    className="glass-panel" 
                    style={{ 
                      padding: '24px', 
                      borderRadius: '16px',
                      borderLeft: app.status === 'Approved' ? '4px solid #10b981' : app.status === 'Rejected' ? '4px solid #f43f5e' : '4px solid #fbbf24'
                    }}
                  >
                    <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px', marginBottom: '14px' }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <h4 style={{ fontSize: '1.25rem', color: '#fff', margin: 0 }}>{app.name}</h4>
                          <span className="font-mono text-amber-400 font-bold">({app.ticker})</span>
                          <span className="badge badge-cyan">{app.sector}</span>
                          <span className="badge badge-gold">{app.stage}</span>
                        </div>
                        <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                          Founder: <strong style={{ color: '#fff' }}>{app.founder}</strong> • Submitted: {app.submittedAt} • App ID: {app.id}
                        </div>
                      </div>

                      <span className={`badge ${
                        app.status === 'Approved' ? 'badge-emerald' : app.status === 'Rejected' ? 'badge-rose' : 'badge-gold'
                      }`} style={{ fontSize: '0.8rem', padding: '6px 12px' }}>
                        {app.status}
                      </span>
                    </div>

                    <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '16px', lineHeight: '1.5' }}>
                      {app.description}
                    </p>

                    {app.useOfFunds && (
                      <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '10px 14px', borderRadius: '8px', marginBottom: '16px', fontSize: '0.82rem' }}>
                        <strong style={{ color: '#fbbf24' }}>Use of Funds:</strong> {app.useOfFunds}
                      </div>
                    )}

                    <div style={{ 
                      display: 'grid', 
                      gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', 
                      gap: '10px', 
                      background: 'rgba(255, 255, 255, 0.02)', 
                      padding: '14px', 
                      borderRadius: '10px',
                      marginBottom: '18px'
                    }}>
                      <div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>Order / Valuation</div>
                        <div style={{ fontSize: '1.1rem', fontWeight: '800', color: '#fff' }}>
                          {formatMoney(app.claimedValuation, true)}
                        </div>
                      </div>
                      <div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>Target Capital Raise</div>
                        <div style={{ fontSize: '1.1rem', fontWeight: '800', color: '#10b981' }}>
                          {formatMoney(app.targetRaise, true)}
                        </div>
                      </div>
                      <div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>Annual Turnover</div>
                        <div style={{ fontSize: '1.1rem', fontWeight: '800', color: '#fbbf24' }}>
                          {formatMoney(app.annualRevenue, true)}
                        </div>
                      </div>
                    </div>

                    {app.status === 'Pending Review' && (
                      <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                        <button 
                          onClick={() => handleReject(app.id, app.name)}
                          className="btn btn-secondary btn-sm"
                          style={{ color: '#fb7185' }}
                        >
                          <XCircle size={15} />
                          <span>Reject Application</span>
                        </button>
                        <button 
                          onClick={() => handleApprove(app.id, app.name)}
                          className="btn btn-emerald btn-sm"
                        >
                          <CheckCircle2 size={15} />
                          <span>Approve & Launch on Marketplace</span>
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: MILESTONES & EVIDENCE AUDIT (The CarpenterBullet Inspection Desk) */}
        {adminTab === 'milestones' && (
          <div>
            <h3 style={{ fontSize: '1.25rem', color: '#fff', marginBottom: '8px' }}>
              Project Milestone Verification & Staged Tranche Release
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '20px' }}>
              Inspect uploaded timber receipts, material invoices, and assembly videos before releasing capital tranches from escrow.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {projectDeals.map(proj => {
                const pendingMilestone = proj.milestones.find(m => m.status === 'IN_PROGRESS');

                return (
                  <div key={proj.id} className="glass-panel" style={{ padding: '24px', borderRadius: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ fontSize: '1.8rem' }}>{proj.logo}</span>
                        <div>
                          <h4 style={{ fontSize: '1.15rem', color: '#fff', margin: 0 }}>{proj.businessName}</h4>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Project: {proj.title} ({proj.ticker})</span>
                        </div>
                      </div>

                      <span className="badge badge-gold">
                        Capital: {formatMoney(proj.capitalRaised, true)} of {formatMoney(proj.capitalRequired, true)}
                      </span>
                    </div>

                    {/* Milestones Flow */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '10px', marginBottom: '16px' }}>
                      {proj.milestones.map(m => (
                        <div 
                          key={m.id} 
                          style={{ 
                            padding: '10px', 
                            borderRadius: '8px', 
                            background: m.status === 'COMPLETED' ? 'rgba(16, 185, 129, 0.1)' : m.status === 'IN_PROGRESS' ? 'rgba(245, 158, 11, 0.1)' : 'rgba(255, 255, 255, 0.02)',
                            border: m.status === 'COMPLETED' ? '1px solid rgba(16, 185, 129, 0.3)' : m.status === 'IN_PROGRESS' ? '1px solid rgba(245, 158, 11, 0.3)' : '1px solid rgba(255, 255, 255, 0.05)'
                          }}
                        >
                          <div style={{ fontSize: '0.65rem', color: 'var(--text-dim)' }}>{m.id} • {m.date}</div>
                          <div style={{ fontSize: '0.8rem', fontWeight: '700', color: m.status === 'COMPLETED' ? '#34d399' : m.status === 'IN_PROGRESS' ? '#fbbf24' : '#fff' }}>
                            {m.title}
                          </div>
                          <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                            Proof: <code style={{ color: '#38bdf8' }}>{m.proof}</code>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Active verification action */}
                    {pendingMilestone && (
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(245, 158, 11, 0.05)', padding: '12px 16px', borderRadius: '10px', border: '1px solid rgba(245, 158, 11, 0.2)' }}>
                        <div>
                          <div style={{ fontSize: '0.82rem', fontWeight: '700', color: '#fff' }}>
                            Awaiting Admin Audit: {pendingMilestone.title}
                          </div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                            Document / Photo Submitted: <code>{pendingMilestone.proof}</code>
                          </div>
                        </div>

                        <button 
                          onClick={() => handleApproveMilestone(proj.id, pendingMilestone.id, pendingMilestone.title)}
                          className="btn btn-emerald btn-sm"
                        >
                          <CheckCircle2 size={14} />
                          <span>Verify Evidence & Release Tranche</span>
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 3: CENTRAL DOUBLE-ENTRY LEDGER */}
        {adminTab === 'ledger' && (
          <div className="glass-panel" style={{ overflow: 'hidden' }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontWeight: '700', color: '#fff' }}>Internal Immutable Double-Entry Ledger</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>Auditable debit & credit financial log records</div>
              </div>
              <span className="badge badge-emerald">Ledger Balanced (Zero Discrepancy)</span>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
                <thead>
                  <tr style={{ background: 'rgba(255, 255, 255, 0.03)', borderBottom: '1px solid var(--border-color)' }}>
                    <th style={{ padding: '12px 16px', color: 'var(--text-dim)', textTransform: 'uppercase', fontSize: '0.72rem' }}>Entry ID</th>
                    <th style={{ padding: '12px 16px', color: 'var(--text-dim)', textTransform: 'uppercase', fontSize: '0.72rem' }}>Timestamp</th>
                    <th style={{ padding: '12px 16px', color: 'var(--text-dim)', textTransform: 'uppercase', fontSize: '0.72rem' }}>Debit Account</th>
                    <th style={{ padding: '12px 16px', color: 'var(--text-dim)', textTransform: 'uppercase', fontSize: '0.72rem' }}>Credit Account</th>
                    <th style={{ padding: '12px 16px', color: 'var(--text-dim)', textTransform: 'uppercase', fontSize: '0.72rem' }}>Amount</th>
                    <th style={{ padding: '12px 16px', color: 'var(--text-dim)', textTransform: 'uppercase', fontSize: '0.72rem' }}>Reference</th>
                    <th style={{ padding: '12px 16px', color: 'var(--text-dim)', textTransform: 'uppercase', fontSize: '0.72rem' }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {ledgerEntries.map(entry => (
                    <tr key={entry.entryNo} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                      <td style={{ padding: '12px 16px', fontFamily: 'var(--font-mono)', color: '#38bdf8' }}>{entry.entryNo}</td>
                      <td style={{ padding: '12px 16px', color: 'var(--text-muted)', fontSize: '0.78rem' }}>{entry.timestamp}</td>
                      <td style={{ padding: '12px 16px', color: '#fb7185', fontWeight: '600' }}>{entry.debitAccount}</td>
                      <td style={{ padding: '12px 16px', color: '#34d399', fontWeight: '600' }}>{entry.creditAccount}</td>
                      <td style={{ padding: '12px 16px', fontWeight: '800', color: '#fff' }}>{formatMoney(entry.amount, true)}</td>
                      <td style={{ padding: '12px 16px', color: 'var(--text-dim)', fontSize: '0.78rem' }}>{entry.reference}</td>
                      <td style={{ padding: '12px 16px' }}>
                        <span className="badge badge-emerald" style={{ fontSize: '0.68rem' }}>{entry.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: TRANSACTION AUDITS */}
        {adminTab === 'transactions' && (
          <div className="glass-panel" style={{ overflow: 'hidden' }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontWeight: '700', color: '#fff' }}>Platform Transaction Stream</div>
              <div style={{ fontSize: '0.8rem', color: '#10b981' }}>Total Revenue: <strong>{formatMoney(totalFeesEarned, true)}</strong></div>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
                <thead>
                  <tr style={{ background: 'rgba(255, 255, 255, 0.03)', borderBottom: '1px solid var(--border-color)' }}>
                    <th style={{ padding: '12px 16px', color: 'var(--text-dim)', textTransform: 'uppercase', fontSize: '0.72rem' }}>Tx ID</th>
                    <th style={{ padding: '12px 16px', color: 'var(--text-dim)', textTransform: 'uppercase', fontSize: '0.72rem' }}>Timestamp</th>
                    <th style={{ padding: '12px 16px', color: 'var(--text-dim)', textTransform: 'uppercase', fontSize: '0.72rem' }}>Type</th>
                    <th style={{ padding: '12px 16px', color: 'var(--text-dim)', textTransform: 'uppercase', fontSize: '0.72rem' }}>Category</th>
                    <th style={{ padding: '12px 16px', color: 'var(--text-dim)', textTransform: 'uppercase', fontSize: '0.72rem' }}>Target</th>
                    <th style={{ padding: '12px 16px', color: 'var(--text-dim)', textTransform: 'uppercase', fontSize: '0.72rem' }}>Gross Amount</th>
                    <th style={{ padding: '12px 16px', color: 'var(--text-dim)', textTransform: 'uppercase', fontSize: '0.72rem' }}>Platform Fee</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map(tx => (
                    <tr key={tx.id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                      <td style={{ padding: '12px 16px', fontFamily: 'var(--font-mono)', color: '#38bdf8' }}>{tx.id}</td>
                      <td style={{ padding: '12px 16px', color: 'var(--text-muted)' }}>{tx.timestamp}</td>
                      <td style={{ padding: '12px 16px' }}>
                        <span className={`badge ${tx.type === 'BUY' || tx.type === 'FUND_PROJECT' ? 'badge-emerald' : 'badge-gold'}`}>
                          {tx.type}
                        </span>
                      </td>
                      <td style={{ padding: '12px 16px', color: 'var(--text-muted)' }}>{tx.category}</td>
                      <td style={{ padding: '12px 16px', fontWeight: '600', color: '#fff' }}>{tx.companyName}</td>
                      <td style={{ padding: '12px 16px', fontWeight: '700', color: '#fff' }}>{formatMoney(tx.totalAmount, true)}</td>
                      <td style={{ padding: '12px 16px', fontWeight: '700', color: '#fbbf24' }}>{formatMoney(tx.fee, true)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
