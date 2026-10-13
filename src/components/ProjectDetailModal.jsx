import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  X, 
  ShieldCheck, 
  Clock, 
  CheckCircle2, 
  DollarSign, 
  FileText, 
  AlertCircle, 
  Sparkles, 
  Building2, 
  CheckCircle, 
  ArrowRight,
  ChevronRight,
  ExternalLink,
  Lock,
  Layers
} from 'lucide-react';

export const ProjectDetailModal = () => {
  const { 
    selectedProject, 
    setSelectedProject, 
    formatMoney, 
    formatValuation, 
    fundProjectDeal, 
    walletBalance,
    user 
  } = useApp();

  const [fundAmount, setFundAmount] = useState('25000');
  const [paymentMethod, setPaymentMethod] = useState('wallet');
  const [isProcessing, setIsProcessing] = useState(false);
  const [successNotice, setSuccessNotice] = useState(null);

  React.useEffect(() => {
    if (selectedProject?.minContribution) {
      setFundAmount(selectedProject.minContribution.toString());
    }
  }, [selectedProject?.id]);

  if (!selectedProject) return null;

  const proj = selectedProject;
  const fundingPercent = Math.min(100, Math.round((proj.capitalRaised / proj.capitalRequired) * 100));
  const remainingNeeded = Math.max(0, proj.capitalRequired - proj.capitalRaised);

  // Projected return calculation
  const yieldNum = parseFloat(proj.indicativeYield) || 14.5;
  const inputAmt = parseFloat(fundAmount) || 0;
  const projectedReturnAmount = Math.round(inputAmt * (1 + (yieldNum / 100)));
  const netGain = projectedReturnAmount - inputAmt;

  const handleFundSubmit = () => {
    if (inputAmt < proj.minContribution) {
      alert(`Minimum participation tranche for this project is ${formatMoney(proj.minContribution, true)}.`);
      return;
    }
    if (inputAmt > remainingNeeded) {
      alert(`Cannot overfund. Maximum remaining capital needed is ${formatMoney(remainingNeeded, true)}.`);
      return;
    }

    setIsProcessing(true);
    setTimeout(() => {
      const success = fundProjectDeal(proj.id, inputAmt, paymentMethod);
      setIsProcessing(false);
      if (success) {
        setSuccessNotice(`Successfully funded ${formatMoney(inputAmt, true)} towards ${proj.businessName} (${proj.ticker})! Project contract and live milestone tracker have been generated in your Portfolio.`);
        setTimeout(() => {
          setSuccessNotice(null);
          setSelectedProject(null);
        }, 2500);
      }
    }, 700);
  };

  return (
    <div className="modal-overlay" onClick={() => setSelectedProject(null)}>
      <div 
        className="modal-content" 
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '960px', width: '100%', padding: '0', position: 'relative' }}
      >
        {/* Header */}
        <div style={{ 
          padding: '24px 30px', 
          borderBottom: '1px solid var(--border-color)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'rgba(15, 23, 42, 0.95)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ 
              fontSize: '2.2rem', 
              width: '54px', 
              height: '54px', 
              borderRadius: '14px', 
              background: 'rgba(255, 255, 255, 0.08)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid rgba(255, 255, 255, 0.15)'
            }}>
              {proj.logo}
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <h2 style={{ fontSize: '1.4rem', color: '#fff', margin: 0 }}>{proj.title}</h2>
                <span className="badge badge-emerald" style={{ fontSize: '0.75rem' }}>
                  <ShieldCheck size={13} />
                  <span>ORDER VERIFIED</span>
                </span>
              </div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: '4px 0 0 0' }}>
                Business: <strong style={{ color: '#fff' }}>{proj.businessName}</strong> ({proj.ticker}) • {proj.category}
              </p>
            </div>
          </div>

          <button 
            onClick={() => setSelectedProject(null)}
            className="btn btn-ghost btn-sm"
            style={{ borderRadius: '50%', width: '36px', height: '36px', padding: 0 }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: '28px 30px' }}>
          
          {successNotice ? (
            <div style={{ textAlign: 'center', padding: '40px 20px' }}>
              <div style={{ 
                width: '64px', 
                height: '64px', 
                borderRadius: '50%', 
                background: 'rgba(16, 185, 129, 0.15)',
                color: '#10b981',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px auto',
                border: '2px solid #10b981'
              }}>
                <CheckCircle2 size={36} />
              </div>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '10px', color: '#fff' }}>Capital Deployed into Project Escrow!</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '1rem', maxWidth: '560px', margin: '0 auto 20px auto' }}>
                {successNotice}
              </p>
              <div className="badge badge-emerald" style={{ padding: '8px 16px', fontSize: '0.85rem' }}>
                Track Milestones & Invoices in Investor Portfolio
              </div>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: '1.25fr 1fr', gap: '28px' }}>
              
              {/* Left Column: Project Economics & Milestones */}
              <div>
                {/* Tagline */}
                <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', lineHeight: '1.6', marginBottom: '20px' }}>
                  {proj.tagline}
                </p>

                {/* THE KILLER SCREEN: PROJECT ECONOMICS MATRIX */}
                <div style={{ 
                  background: 'rgba(10, 16, 30, 0.9)', 
                  border: '1px solid rgba(245, 158, 11, 0.25)',
                  borderRadius: '14px',
                  padding: '20px',
                  marginBottom: '22px'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                    <div style={{ fontSize: '0.85rem', fontWeight: '700', color: '#fbbf24', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <FileText size={16} />
                      Verified Project Financial Economics
                    </div>
                    <span className="badge badge-gold" style={{ fontSize: '0.7rem' }}>
                      {proj.durationDays} Days Execution
                    </span>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
                    <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '10px 14px', borderRadius: '10px' }}>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Customer Contract Value</div>
                      <div style={{ fontSize: '1.25rem', fontWeight: '800', color: '#fff' }}>
                        {formatMoney(proj.customerContractValue, true)}
                      </div>
                      <div style={{ fontSize: '0.72rem', color: '#10b981' }}>Customer Advance: {formatMoney(proj.customerInfo.advancePaid, true)}</div>
                    </div>

                    <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '10px 14px', borderRadius: '10px' }}>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Working Capital Needed</div>
                      <div style={{ fontSize: '1.25rem', fontWeight: '800', color: '#fbbf24' }}>
                        {formatMoney(proj.capitalRequired, true)}
                      </div>
                      <div style={{ fontSize: '0.72rem', color: '#38bdf8' }}>Skin in Game: {formatMoney(proj.businessContribution, true)}</div>
                    </div>
                  </div>

                  {/* Itemized Cost Table (e.g. Wood, Labour, Hardware) */}
                  <div style={{ marginBottom: '14px' }}>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '8px', fontWeight: '600' }}>
                      Itemized Use of Funds & Verified Vendors:
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      {proj.costBreakdown.map((item, idx) => (
                        <div 
                          key={idx}
                          style={{ 
                            display: 'flex', 
                            justifyContent: 'space-between', 
                            alignItems: 'center',
                            background: 'rgba(255, 255, 255, 0.02)',
                            padding: '6px 10px',
                            borderRadius: '6px',
                            fontSize: '0.8rem'
                          }}
                        >
                          <div>
                            <span style={{ color: '#fff', fontWeight: '600' }}>{item.item}</span>
                            <span style={{ color: 'var(--text-dim)', fontSize: '0.72rem', marginLeft: '6px' }}>({item.vendor})</span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ color: '#fbbf24', fontWeight: '700' }}>{formatMoney(item.cost, true)}</span>
                            <CheckCircle size={13} style={{ color: '#10b981' }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Surplus Calculation */}
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                    paddingTop: '10px',
                    fontSize: '0.88rem'
                  }}>
                    <span style={{ color: 'var(--text-muted)' }}>Expected Project Gross Surplus:</span>
                    <span style={{ color: '#10b981', fontWeight: '800' }}>{formatMoney(proj.expectedSurplus, true)}</span>
                  </div>
                </div>

                {/* REAL-TIME MILESTONE TIMELINE */}
                <div style={{ 
                  background: 'rgba(13, 20, 36, 0.8)', 
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '14px',
                  padding: '18px',
                  marginBottom: '20px'
                }}>
                  <div style={{ fontSize: '0.85rem', fontWeight: '700', color: '#fff', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Layers size={16} className="text-cyan-400" />
                    Project Execution Milestones & Evidence Trajectory
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {proj.milestones.map((m, idx) => (
                      <div key={m.id} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                        <div style={{ 
                          width: '24px', 
                          height: '24px', 
                          borderRadius: '50%',
                          background: m.status === 'COMPLETED' ? '#10b981' : m.status === 'IN_PROGRESS' ? '#fbbf24' : 'rgba(255, 255, 255, 0.1)',
                          color: '#000',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '0.7rem',
                          fontWeight: '800',
                          marginTop: '2px',
                          flexShrink: 0
                        }}>
                          {m.status === 'COMPLETED' ? '✓' : idx + 1}
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontSize: '0.85rem', fontWeight: '600', color: m.status === 'COMPLETED' ? '#fff' : m.status === 'IN_PROGRESS' ? '#fbbf24' : 'var(--text-dim)' }}>
                              {m.title}
                            </span>
                            <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>{m.date}</span>
                          </div>
                          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                            Evidence: <code style={{ color: '#38bdf8' }}>{m.proof}</code>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* ROYAL SCORECARD / RISK INFO */}
                <div style={{ 
                  background: 'rgba(255, 255, 255, 0.02)', 
                  border: '1px solid rgba(255, 255, 255, 0.06)',
                  borderRadius: '12px',
                  padding: '16px'
                }}>
                  <div style={{ fontSize: '0.8rem', fontWeight: '700', color: '#fff', marginBottom: '8px' }}>
                    Royal Risk Scorecard & Disclosures:
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '0.75rem' }}>
                    <div style={{ color: 'var(--text-muted)' }}>Customer Concentration: <span style={{ color: '#fff' }}>{proj.riskScorecard.customerConcentration}</span></div>
                    <div style={{ color: 'var(--text-muted)' }}>Documentation: <span style={{ color: '#10b981' }}>{proj.riskScorecard.documentation}</span></div>
                    <div style={{ color: 'var(--text-muted)' }}>Historical Defaults: <span style={{ color: '#10b981' }}>{proj.riskScorecard.defaultHistory}</span></div>
                    <div style={{ color: 'var(--text-muted)' }}>Promoter Skin in Game: <span style={{ color: '#fbbf24' }}>{proj.riskScorecard.promoterSkinInGame}</span></div>
                  </div>
                </div>
              </div>

              {/* Right Column: Funding Participation Calculator */}
              <div style={{ 
                background: 'rgba(13, 20, 36, 0.95)', 
                border: '1px solid rgba(255, 255, 255, 0.1)', 
                borderRadius: '16px', 
                padding: '24px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}>
                <div>
                  <h4 style={{ fontSize: '1.15rem', color: '#fff', marginBottom: '4px' }}>
                    Participate in Project Capital
                  </h4>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '20px' }}>
                    Capital is ring-fenced in the RBI Project Escrow and deployed strictly against verified material milestone receipts.
                  </p>

                  {/* Funding Progress Bar */}
                  <div style={{ marginBottom: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '6px' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Round Progress</span>
                      <span style={{ fontWeight: '700', color: '#10b981' }}>
                        {fundingPercent}% Funded ({formatMoney(proj.capitalRaised, true)} of {formatMoney(proj.capitalRequired, true)})
                      </span>
                    </div>
                    <div style={{ width: '100%', height: '8px', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{ width: `${fundingPercent}%`, height: '100%', background: 'linear-gradient(90deg, #10b981 0%, #38bdf8 100%)' }}></div>
                    </div>
                    <div style={{ fontSize: '0.72rem', color: '#fbbf24', marginTop: '4px', textAlign: 'right' }}>
                      {formatMoney(remainingNeeded, true)} Remaining
                    </div>
                  </div>

                  {/* Indicative Return Box */}
                  <div style={{ 
                    padding: '12px 16px', 
                    borderRadius: '10px', 
                    background: 'rgba(16, 185, 129, 0.08)',
                    border: '1px solid rgba(16, 185, 129, 0.25)',
                    marginBottom: '20px'
                  }}>
                    <div style={{ fontSize: '0.72rem', color: '#34d399', textTransform: 'uppercase', fontWeight: '700' }}>
                      Contractual Term Payout
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                      <span style={{ fontSize: '1.25rem', fontWeight: '800', color: '#10b981' }}>
                        {proj.indicativeYield}
                      </span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        Over {proj.durationDays} Days
                      </span>
                    </div>
                  </div>

                  {/* Participation Amount Input */}
                  <div style={{ marginBottom: '18px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '6px' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Your Capital Participation:</span>
                      <span style={{ fontWeight: '700', color: '#fff' }}>{formatMoney(inputAmt, true)}</span>
                    </div>

                    <input 
                      type="number"
                      min={proj.minContribution}
                      max={remainingNeeded}
                      step="5000"
                      value={fundAmount}
                      onChange={(e) => setFundAmount(e.target.value)}
                      className="form-input"
                      style={{ fontSize: '1.2rem', fontWeight: '700' }}
                    />

                    <div style={{ display: 'flex', gap: '6px', marginTop: '8px' }}>
                      {[
                        proj.minContribution,
                        Math.max(proj.minContribution * 2, 5000),
                        Math.max(proj.minContribution * 5, 25000),
                        Math.min(remainingNeeded, 50000)
                      ].filter((v, idx, arr) => arr.indexOf(v) === idx && v <= remainingNeeded).map(amt => (
                        <button 
                          key={amt} 
                          type="button"
                          onClick={() => setFundAmount(amt.toString())}
                          className={`btn btn-sm ${inputAmt === amt ? 'btn-primary' : 'btn-secondary'}`}
                          style={{ flex: 1, padding: '4px 0', fontSize: '0.75rem' }}
                        >
                          ₹{amt >= 100000 ? `${amt / 100000}L` : `${amt / 1000}K`}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Financial Breakdown */}
                  <div style={{ 
                    borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                    paddingTop: '12px',
                    marginBottom: '18px',
                    fontSize: '0.85rem'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', color: 'var(--text-muted)' }}>
                      <span>Principal Participation:</span>
                      <span style={{ color: '#fff', fontWeight: '600' }}>{formatMoney(inputAmt, true)}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', color: 'var(--text-muted)' }}>
                      <span>RBI Tech & Verification Fee (1%):</span>
                      <span style={{ color: '#fbbf24', fontWeight: '600' }}>{formatMoney(inputAmt * 0.01, true)}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', color: 'var(--text-muted)' }}>
                      <span>Projected Gross Surplus:</span>
                      <span style={{ color: '#10b981', fontWeight: '600' }}>+{formatMoney(netGain, true)}</span>
                    </div>
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                      paddingTop: '8px',
                      fontSize: '1.05rem',
                      fontWeight: '800'
                    }}>
                      <span style={{ color: '#fff' }}>Expected Settlement:</span>
                      <span style={{ color: '#10b981' }}>{formatMoney(projectedReturnAmount, true)}</span>
                    </div>
                  </div>

                  {/* Payment Method */}
                  <div style={{ marginBottom: '20px' }}>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginBottom: '6px' }}>Select Settlement Source:</div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                      <button 
                        type="button"
                        onClick={() => setPaymentMethod('wallet')}
                        className={`btn btn-sm ${paymentMethod === 'wallet' ? 'btn-primary' : 'btn-secondary'}`}
                        style={{ fontSize: '0.78rem', padding: '8px 4px' }}
                      >
                        Vault ({formatMoney(walletBalance, true)})
                      </button>
                      <button 
                        type="button"
                        onClick={() => setPaymentMethod('bank')}
                        className={`btn btn-sm ${paymentMethod === 'bank' ? 'btn-primary' : 'btn-secondary'}`}
                        style={{ fontSize: '0.78rem', padding: '8px 4px' }}
                      >
                        Direct NetBank/UPI
                      </button>
                    </div>
                  </div>
                </div>

                {/* Final Action */}
                <div>
                  <button 
                    onClick={handleFundSubmit}
                    disabled={isProcessing || remainingNeeded === 0}
                    className="btn btn-emerald btn-lg"
                    style={{ width: '100%', fontSize: '0.95rem' }}
                  >
                    {isProcessing ? 'Deploying Capital to Escrow...' : remainingNeeded === 0 ? 'Deal Fully Funded' : `Fund Project (${formatMoney(inputAmt, true)})`}
                  </button>

                  <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', textAlign: 'center', marginTop: '10px' }}>
                    ⚖️ Structured under Section 42 / NBFC-P2P legal partner rails. No guaranteed return claims.
                  </div>
                </div>

              </div>

            </div>
          )}

        </div>
      </div>
    </div>
  );
};
