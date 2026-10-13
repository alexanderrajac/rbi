import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  TrendingUp, 
  TrendingDown, 
  Wallet, 
  Award, 
  ArrowUpRight, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  DollarSign, 
  ShieldCheck, 
  BadgeCheck, 
  FileText, 
  Download, 
  ExternalLink,
  PlusCircle,
  RefreshCw,
  Sparkles,
  Hammer,
  Layers,
  Calendar,
  Zap,
  Printer
} from 'lucide-react';

export const Portfolio = () => {
  const { 
    holdings, 
    projectInvestments,
    transactions, 
    walletBalance, 
    formatMoney, 
    formatValuation, 
    user, 
    setIsCertificateModalOpen, 
    setSelectedCertificate,
    setIsKYCModalOpen,
    setIsWalletModalOpen,
    executeSellShares,
    setActiveTab
  } = useApp();

  const [activeTab, setPortfolioTab] = useState('projects'); // 'projects' | 'equity' | 'transactions'
  const [sellingHolding, setSellingHolding] = useState(null);
  const [sharesToSell, setSharesToSell] = useState(1);
  const [sellSuccessNotice, setSellSuccessNotice] = useState(null);

  // Financial aggregates
  const totalEquityInvested = holdings.reduce((sum, h) => sum + h.investedAmount, 0);
  const totalEquityValue = holdings.reduce((sum, h) => sum + h.currentValue, 0);
  const totalProjectCapitalDeployed = projectInvestments.reduce((sum, p) => sum + p.investedAmount, 0);
  const totalExpectedMaturity = projectInvestments.reduce((sum, p) => sum + p.expectedMaturityAmount, 0);
  const totalProjectYieldProfit = Math.max(0, totalExpectedMaturity - totalProjectCapitalDeployed);
  
  const totalNetWorth = walletBalance + totalEquityValue + totalProjectCapitalDeployed;

  const handleOpenCertificate = (item) => {
    setSelectedCertificate(item);
    setIsCertificateModalOpen(true);
  };

  const handleConfirmSell = () => {
    if (!sellingHolding) return;
    const success = executeSellShares(sellingHolding.companyId, sharesToSell);
    if (success) {
      setSellSuccessNotice(`Liquidated ${sharesToSell} shares of ${sellingHolding.companyName}. Funds have been credited to your Vault.`);
      setSellingHolding(null);
      setTimeout(() => setSellSuccessNotice(null), 3000);
    }
  };

  const handlePrintStatement = () => {
    window.print();
  };

  return (
    <div style={{ padding: '32px 0 60px 0' }}>
      <div className="container">
        
        {/* Executive Portfolio Header */}
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '20px', marginBottom: '28px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <h1 style={{ fontSize: '2.1rem', color: '#fff', margin: 0 }}>Capital Provider Portfolio</h1>
              <span className="badge badge-gold">{user.memberTier}</span>
              <span className="badge badge-emerald">
                <ShieldCheck size={12} />
                <span>KYC Tier 1 Accredited</span>
              </span>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', margin: 0 }}>
              Beneficiary: <strong style={{ color: '#fff' }}>{user.name}</strong> • Account ID: <code style={{ color: '#38bdf8' }}>{user.investorId}</code> • Central Depository Custody
            </p>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button 
              onClick={handlePrintStatement}
              className="btn btn-secondary btn-sm"
              style={{ gap: '6px' }}
            >
              <Printer size={14} />
              <span>Export Dossier</span>
            </button>
            <button 
              onClick={() => setIsWalletModalOpen(true)}
              className="btn btn-primary btn-sm"
              style={{ gap: '6px' }}
            >
              <PlusCircle size={15} />
              <span>Deposit Capital</span>
            </button>
            <button 
              onClick={() => setActiveTab('marketplace')}
              className="btn btn-emerald btn-sm"
            >
              Explore Deals
            </button>
          </div>
        </div>

        {sellSuccessNotice && (
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
            <CheckCircle size={18} />
            <span>{sellSuccessNotice}</span>
          </div>
        )}

        {/* Portfolio Summary Cards */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', 
          gap: '20px', 
          marginBottom: '32px' 
        }}>
          <div className="glass-panel" style={{ padding: '22px', borderLeft: '4px solid #fbbf24' }}>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', textTransform: 'uppercase', marginBottom: '6px', fontWeight: '700' }}>
              SME Project Capital Deployed
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: '800', color: '#fbbf24', marginBottom: '4px' }}>
              {formatMoney(totalProjectCapitalDeployed, true)}
            </div>
            <div style={{ fontSize: '0.82rem', color: '#34d399', fontWeight: '600' }}>
              Expected Maturity: <strong style={{ color: '#fff' }}>{formatMoney(totalExpectedMaturity, true)}</strong> (+{formatMoney(totalProjectYieldProfit, true)})
            </div>
          </div>

          <div className="glass-panel" style={{ padding: '22px', borderLeft: '4px solid #10b981' }}>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', textTransform: 'uppercase', marginBottom: '6px', fontWeight: '700' }}>
              Private SME Equity Value
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: '800', color: '#10b981', marginBottom: '4px' }}>
              {formatMoney(totalEquityValue, true)}
            </div>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              Cost Basis: {formatMoney(totalEquityInvested, true)} • <span style={{ color: '#34d399', fontWeight: '600' }}>+{formatMoney(totalEquityValue - totalEquityInvested, true)} P&L</span>
            </div>
          </div>

          <div className="glass-panel" style={{ padding: '22px', borderLeft: '4px solid #38bdf8' }}>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', textTransform: 'uppercase', marginBottom: '6px', fontWeight: '700' }}>
              Available Vault Cash
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: '800', color: '#38bdf8', marginBottom: '4px' }}>
              {formatMoney(walletBalance, true)}
            </div>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              Immediate liquidity for 1-click allocation
            </div>
          </div>

          <div className="glass-panel" style={{ padding: '22px', borderLeft: '4px solid #a78bfa' }}>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', textTransform: 'uppercase', marginBottom: '6px', fontWeight: '700' }}>
              Combined Net Assets
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: '800', color: '#fff', marginBottom: '4px' }}>
              {formatMoney(totalNetWorth, true)}
            </div>
            <div style={{ fontSize: '0.82rem', color: '#10b981', fontWeight: '600' }}>
              100% Custodied by RBI Depository
            </div>
          </div>
        </div>

        {/* High-Impact Next Payout Banner */}
        {projectInvestments.length > 0 && (
          <div style={{ 
            background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.12) 0%, rgba(16, 185, 129, 0.1) 100%)', 
            border: '1px solid rgba(245, 158, 11, 0.35)', 
            borderRadius: '16px', 
            padding: '20px 24px', 
            marginBottom: '32px',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '16px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{ 
                width: '46px', 
                height: '46px', 
                borderRadius: '12px', 
                background: 'rgba(245, 158, 11, 0.2)', 
                color: '#fbbf24', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <Calendar size={24} />
              </div>
              <div>
                <div style={{ fontSize: '0.72rem', color: '#fbbf24', textTransform: 'uppercase', fontWeight: '800', letterSpacing: '0.04em' }}>
                  Next Contract Payout Scheduled
                </div>
                <div style={{ fontSize: '1.2rem', fontWeight: '800', color: '#fff' }}>
                  {formatMoney(projectInvestments[0].expectedMaturityAmount, true)} Maturity from {projectInvestments[0].businessName}
                </div>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                  Due in {projectInvestments[0].daysRemaining} Days ({projectInvestments[0].contractualReturnRate} Contractual Term Yield)
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button 
                onClick={() => handleOpenCertificate(projectInvestments[0])}
                className="btn btn-secondary btn-sm"
              >
                <Award size={14} className="text-amber-400" />
                <span>View Escrow Certificate</span>
              </button>
            </div>
          </div>
        )}

        {/* Portfolio Tabs Navigation */}
        <div style={{ display: 'flex', gap: '10px', marginBottom: '24px', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
          <button 
            onClick={() => setPortfolioTab('projects')}
            className={`btn btn-sm ${activeTab === 'projects' ? 'btn-primary' : 'btn-ghost'}`}
            style={{ borderRadius: '8px' }}
          >
            <Hammer size={14} />
            <span>Funded SME Projects ({projectInvestments.length})</span>
          </button>

          <button 
            onClick={() => setPortfolioTab('equity')}
            className={`btn btn-sm ${activeTab === 'equity' ? 'btn-primary' : 'btn-ghost'}`}
            style={{ borderRadius: '8px' }}
          >
            <TrendingUp size={14} />
            <span>Equity Share Holdings ({holdings.length})</span>
          </button>

          <button 
            onClick={() => setPortfolioTab('transactions')}
            className={`btn btn-sm ${activeTab === 'transactions' ? 'btn-primary' : 'btn-ghost'}`}
            style={{ borderRadius: '8px' }}
          >
            <Clock size={14} />
            <span>Transaction Ledger ({transactions.length})</span>
          </button>
        </div>

        {/* TAB 1: FUNDED SME PROJECTS (CARPENTERBULLET MILESTONES) */}
        {activeTab === 'projects' && (
          <div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {projectInvestments.map((p, idx) => (
                <div key={idx} className="glass-panel" style={{ padding: '26px', borderRadius: '18px' }}>
                  <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-start', gap: '14px', marginBottom: '16px' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <h3 style={{ fontSize: '1.3rem', color: '#fff', margin: 0 }}>{p.businessName}</h3>
                        <span className="font-mono text-amber-400 font-bold">({p.ticker})</span>
                        <span className="badge badge-emerald">ACTIVE IN PRODUCTION</span>
                      </div>
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                        Project: <strong style={{ color: '#fff' }}>{p.projectName}</strong> • Contract ID: <code style={{ color: '#38bdf8' }}>{p.certificateId}</code>
                      </div>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: '700' }}>Expected Payout</div>
                      <div style={{ fontSize: '1.45rem', fontWeight: '900', color: '#10b981' }}>
                        {formatMoney(p.expectedMaturityAmount, true)}
                      </div>
                      <div style={{ fontSize: '0.78rem', color: '#fbbf24', fontWeight: '700' }}>
                        +{p.contractualReturnRate} Contractual Yield ({p.daysRemaining} days remaining)
                      </div>
                    </div>
                  </div>

                  {/* Current Active Milestone Notice */}
                  <div style={{ 
                    background: 'rgba(10, 16, 28, 0.85)', 
                    border: '1px solid rgba(245, 158, 11, 0.25)', 
                    borderRadius: '12px', 
                    padding: '16px',
                    marginBottom: '16px'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                      <div style={{ fontSize: '0.84rem', fontWeight: '700', color: '#fff', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Layers size={16} className="text-amber-400" />
                        Current Milestone: {p.currentMilestone}
                      </div>
                      <span className="badge badge-cyan" style={{ fontSize: '0.7rem' }}>
                        Stage 3 of 6 In Progress
                      </span>
                    </div>
                    <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: 0 }}>
                      📋 <strong>Latest Verification Evidence:</strong> {p.lastMilestoneUpdate}
                    </p>
                  </div>

                  {/* Financial Grid */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '10px', fontSize: '0.85rem' }}>
                    <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '10px 14px', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
                      <div style={{ color: 'var(--text-dim)', fontSize: '0.7rem' }}>Principal Capital</div>
                      <div style={{ fontWeight: '700', color: '#fff' }}>{formatMoney(p.investedAmount, true)}</div>
                    </div>
                    <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '10px 14px', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
                      <div style={{ color: 'var(--text-dim)', fontSize: '0.7rem' }}>Project Tenure</div>
                      <div style={{ fontWeight: '700', color: '#38bdf8' }}>{p.tenureDays} Days</div>
                    </div>
                    <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '10px 14px', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
                      <div style={{ color: 'var(--text-dim)', fontSize: '0.7rem' }}>Net Estimated Gain</div>
                      <div style={{ fontWeight: '700', color: '#10b981' }}>+{formatMoney(p.expectedMaturityAmount - p.investedAmount, true)}</div>
                    </div>
                    <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '10px 14px', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
                      <div style={{ color: 'var(--text-dim)', fontSize: '0.7rem' }}>Escrow Custody</div>
                      <div style={{ fontWeight: '700', color: '#fbbf24' }}>Ring-Fenced</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: EQUITY HOLDINGS */}
        {activeTab === 'equity' && (
          <div className="glass-panel" style={{ overflow: 'hidden' }}>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                <thead>
                  <tr style={{ background: 'rgba(255, 255, 255, 0.03)', borderBottom: '1px solid var(--border-color)' }}>
                    <th style={{ padding: '16px 20px', color: 'var(--text-dim)', fontWeight: '600', fontSize: '0.75rem', textTransform: 'uppercase' }}>Company & Ticker</th>
                    <th style={{ padding: '16px 20px', color: 'var(--text-dim)', fontWeight: '600', fontSize: '0.75rem', textTransform: 'uppercase' }}>Shares Owned</th>
                    <th style={{ padding: '16px 20px', color: 'var(--text-dim)', fontWeight: '600', fontSize: '0.75rem', textTransform: 'uppercase' }}>Avg Buy Price</th>
                    <th style={{ padding: '16px 20px', color: 'var(--text-dim)', fontWeight: '600', fontSize: '0.75rem', textTransform: 'uppercase' }}>Current Price</th>
                    <th style={{ padding: '16px 20px', color: 'var(--text-dim)', fontWeight: '600', fontSize: '0.75rem', textTransform: 'uppercase' }}>Total Value</th>
                    <th style={{ padding: '16px 20px', color: 'var(--text-dim)', fontWeight: '600', fontSize: '0.75rem', textTransform: 'uppercase' }}>Unrealized P&L</th>
                    <th style={{ padding: '16px 20px', color: 'var(--text-dim)', fontWeight: '600', fontSize: '0.75rem', textTransform: 'uppercase', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {holdings.map((h, i) => (
                    <tr key={h.companyId} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                      <td style={{ padding: '16px 20px' }}>
                        <div style={{ fontWeight: '700', color: '#fff' }}>{h.companyName}</div>
                        <div style={{ fontSize: '0.75rem', color: '#fbbf24', fontFamily: 'var(--font-mono)' }}>{h.ticker}</div>
                      </td>
                      <td style={{ padding: '16px 20px', fontWeight: '700', color: '#fff' }}>
                        {h.shares} Shares
                      </td>
                      <td style={{ padding: '16px 20px', color: 'var(--text-muted)' }}>
                        {formatMoney(h.avgBuyPrice)}
                      </td>
                      <td style={{ padding: '16px 20px', color: '#fff', fontWeight: '600' }}>
                        {formatMoney(h.currentPrice)}
                      </td>
                      <td style={{ padding: '16px 20px', fontWeight: '700', color: '#fff' }}>
                        {formatMoney(h.currentValue)}
                      </td>
                      <td style={{ padding: '16px 20px' }}>
                        <div style={{ fontWeight: '700', color: h.pnlAmount >= 0 ? '#10b981' : '#f43f5e' }}>
                          {h.pnlAmount >= 0 ? '+' : ''}{formatMoney(h.pnlAmount)}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: h.pnlPercentage >= 0 ? '#34d399' : '#fb7185' }}>
                          ({h.pnlPercentage >= 0 ? '+' : ''}{h.pnlPercentage.toFixed(2)}%)
                        </div>
                      </td>
                      <td style={{ padding: '16px 20px', textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: '8px' }}>
                          <button 
                            onClick={() => handleOpenCertificate(h)}
                            className="btn btn-secondary btn-sm"
                            style={{ fontSize: '0.75rem', padding: '6px 10px', gap: '4px' }}
                          >
                            <Award size={13} className="text-amber-400" />
                            <span>Certificate</span>
                          </button>
                          <button 
                            onClick={() => {
                              setSellingHolding(h);
                              setSharesToSell(1);
                            }}
                            className="btn btn-secondary btn-sm"
                            style={{ fontSize: '0.75rem', padding: '6px 10px', color: '#fb7185' }}
                          >
                            Sell
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: TRANSACTION AUDIT LEDGER */}
        {activeTab === 'transactions' && (
          <div className="glass-panel" style={{ overflow: 'hidden' }}>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                <thead>
                  <tr style={{ background: 'rgba(255, 255, 255, 0.03)', borderBottom: '1px solid var(--border-color)' }}>
                    <th style={{ padding: '16px 20px', color: 'var(--text-dim)', fontSize: '0.75rem', textTransform: 'uppercase' }}>Audit Tx ID</th>
                    <th style={{ padding: '16px 20px', color: 'var(--text-dim)', fontSize: '0.75rem', textTransform: 'uppercase' }}>Timestamp</th>
                    <th style={{ padding: '16px 20px', color: 'var(--text-dim)', fontSize: '0.75rem', textTransform: 'uppercase' }}>Type</th>
                    <th style={{ padding: '16px 20px', color: 'var(--text-dim)', fontSize: '0.75rem', textTransform: 'uppercase' }}>Target Asset</th>
                    <th style={{ padding: '16px 20px', color: 'var(--text-dim)', fontSize: '0.75rem', textTransform: 'uppercase' }}>Gross Capital</th>
                    <th style={{ padding: '16px 20px', color: 'var(--text-dim)', fontSize: '0.75rem', textTransform: 'uppercase' }}>Certificate / Contract</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map(tx => (
                    <tr key={tx.id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                      <td style={{ padding: '16px 20px', fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: '#38bdf8' }}>{tx.id}</td>
                      <td style={{ padding: '16px 20px', color: 'var(--text-muted)', fontSize: '0.8rem' }}>{tx.timestamp}</td>
                      <td style={{ padding: '16px 20px' }}>
                        <span className={`badge ${tx.type === 'BUY' || tx.type === 'FUND_PROJECT' ? 'badge-emerald' : 'badge-gold'}`} style={{ fontSize: '0.7rem' }}>
                          {tx.type}
                        </span>
                      </td>
                      <td style={{ padding: '16px 20px', fontWeight: '600', color: '#fff' }}>{tx.companyName}</td>
                      <td style={{ padding: '16px 20px', fontWeight: '700', color: '#fff' }}>{formatMoney(tx.totalAmount, true)}</td>
                      <td style={{ padding: '16px 20px', fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: '#10b981' }}>{tx.certificateId}</td>
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
