import React from 'react';
import { motion } from 'framer-motion';
import { Layers, Building2, FileText, CheckCircle2, Clock, AlertCircle, ArrowRight } from 'lucide-react';

export const PortfolioPage = ({
  projectInvestments,
  formatMoney,
  setPreviewScreenshotUrl,
  setActiveCertificate,
  setActiveTab
}) => {
  const totalInvested = (projectInvestments || []).reduce((sum, inv) => sum + (Number(inv.amount) || 0), 0);
  const totalApproved = (projectInvestments || []).filter(inv => inv.status === 'CONFIRMED');
  const totalPending = (projectInvestments || []).filter(inv => inv.status === 'PENDING_APPROVAL');

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
    >
      {/* Page Header */}
      <div className="page-header-trading">
        <div className="page-breadcrumb">
          <button onClick={() => setActiveTab('ventures')} style={{ color: '#64748B' }}>Ventures</button>
          <span style={{ color: '#CBD5E1' }}>/</span>
          <span style={{ color: '#0F172A', fontWeight: '600' }}>My Portfolio</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <span className="badge badge-gold font-mono-numbers" style={{ fontSize: '0.62rem', padding: '2px 8px' }}>
                INVESTOR HOLDINGS
              </span>
              <span style={{ fontSize: '0.72rem', color: '#64748B' }}>
                Live Syndicate Allocation Ledger & Official Certificates
              </span>
            </div>
            <h2 style={{ fontSize: '1.65rem', fontWeight: '800', color: '#0F172A', margin: 0, letterSpacing: '-0.02em' }}>
              My Portfolio & Investment Certificates
            </h2>
            <p style={{ color: '#64748B', fontSize: '0.86rem', margin: '4px 0 0 0' }}>
              Track your registered business allocations, payment confirmation references, and instant printable certificates.
            </p>
          </div>
          <button 
            onClick={() => setActiveTab('ventures')}
            className="btn btn-secondary btn-sm"
            style={{ gap: '6px', background: '#FFFFFF', border: '1px solid #CBD5E1', color: '#0F172A' }}
          >
            <Building2 size={15} />
            <span>Browse Deals</span>
          </button>
        </div>
      </div>

      {/* Summary Telemetry Strip */}
      <div 
        className="responsive-stat-grid"
        style={{ marginBottom: '24px' }}
      >
        <div style={{ background: '#FFFFFF', padding: '16px 20px', borderRadius: '12px', border: '1px solid #E2E8F0', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
          <div style={{ fontSize: '0.70rem', color: '#64748B', textTransform: 'uppercase', fontWeight: '700' }}>Total Allocations</div>
          <div className="font-mono-numbers" style={{ fontSize: '1.45rem', fontWeight: '800', color: '#0F172A', marginTop: '2px' }}>
            {projectInvestments?.length || 0}
          </div>
        </div>

        <div style={{ background: '#ECFDF5', padding: '16px 20px', borderRadius: '12px', border: '1px solid #A7F3D0', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
          <div style={{ fontSize: '0.70rem', color: '#059669', textTransform: 'uppercase', fontWeight: '700' }}>Capital Committed</div>
          <div className="font-mono-numbers" style={{ fontSize: '1.45rem', fontWeight: '800', color: '#059669', marginTop: '2px' }}>
            {formatMoney(totalInvested)}
          </div>
        </div>

        <div style={{ background: '#FFFFFF', padding: '16px 20px', borderRadius: '12px', border: '1px solid #E2E8F0', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
          <div style={{ fontSize: '0.70rem', color: '#64748B', textTransform: 'uppercase', fontWeight: '700' }}>Verified In Escrow</div>
          <div className="font-mono-numbers" style={{ fontSize: '1.45rem', fontWeight: '800', color: '#0284C7', marginTop: '2px' }}>
            {totalApproved.length} Active
          </div>
        </div>

        <div style={{ background: '#FFFFFF', padding: '16px 20px', borderRadius: '12px', border: '1px solid #E2E8F0', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
          <div style={{ fontSize: '0.70rem', color: '#64748B', textTransform: 'uppercase', fontWeight: '700' }}>Pending Verification</div>
          <div className="font-mono-numbers" style={{ fontSize: '1.45rem', fontWeight: '800', color: '#D97706', marginTop: '2px' }}>
            {totalPending.length} Pending
          </div>
        </div>
      </div>

      {/* Main Allocations List */}
      <div 
        id="my-investments-section"
        className="trading-panel-card"
        style={{
          background: '#FFFFFF',
          border: '1px solid #E2E8F0',
          boxShadow: '0 4px 20px -2px rgba(15, 23, 42, 0.05)',
          padding: '28px'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '24px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Layers size={20} className="text-amber-500" />
              <h3 style={{ fontSize: '1.30rem', fontWeight: '800', color: '#0F172A', margin: 0 }}>
                Registered Positions & Backing History
              </h3>
            </div>
            <p style={{ color: '#64748B', fontSize: '0.84rem', margin: '4px 0 0 0' }}>
              Official record of all submissions sent to UPI ID <strong style={{ color: '#059669' }}>8248651695-3@ybl</strong>:
            </p>
          </div>
          <span className="badge font-mono-numbers" style={{ fontSize: '0.72rem', padding: '4px 10px', background: '#FEF3C7', color: '#D97706', border: '1px solid #FDE68A', fontWeight: '700' }}>
            {projectInvestments?.length || 0} Total Allocations
          </span>
        </div>

        {projectInvestments && projectInvestments.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
            {projectInvestments.map((inv) => (
              <div 
                key={inv.id}
                style={{
                  background: '#FFFFFF',
                  border: '1px solid #E2E8F0',
                  borderRadius: '14px',
                  padding: '18px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                  boxShadow: '0 2px 10px rgba(0, 0, 0, 0.03)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <span className="badge font-mono-numbers" style={{ fontSize: '0.64rem', marginBottom: '4px', background: '#FEF3C7', color: '#D97706', border: '1px solid #FDE68A' }}>
                      {inv.category || 'Business Venture'}
                    </span>
                    <h4 style={{ fontSize: '1.05rem', fontWeight: '800', color: '#0F172A', margin: '4px 0 0 0' }}>
                      {inv.projectName}
                    </h4>
                  </div>
                  
                  {/* Status Badge */}
                  {inv.status === 'CONFIRMED' ? (
                    <span className="badge font-mono-numbers" style={{ fontSize: '0.68rem', background: '#ECFDF5', color: '#059669', border: '1px solid #A7F3D0', fontWeight: '700' }}>
                      ✓ Verified & Allocated
                    </span>
                  ) : inv.status === 'REJECTED' ? (
                    <span className="badge font-mono-numbers" style={{ fontSize: '0.68rem', background: '#FEF2F2', color: '#DC2626', border: '1px solid #FECACA', fontWeight: '700' }}>
                      ✕ Rejected
                    </span>
                  ) : (
                    <span className="badge font-mono-numbers" style={{ fontSize: '0.68rem', background: '#FEF3C7', color: '#D97706', border: '1px solid #FDE68A', fontWeight: '700' }}>
                      ⏳ Awaiting Admin Approval
                    </span>
                  )}
                </div>

                <div className="font-mono-numbers" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', padding: '12px', background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '10px' }}>
                  <div>
                    <div style={{ fontSize: '0.68rem', color: '#64748B' }}>Invested Capital</div>
                    <div style={{ fontSize: '1.05rem', fontWeight: '800', color: '#059669' }}>{formatMoney(inv.amount)}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.68rem', color: '#64748B' }}>Target Yield</div>
                    <div style={{ fontSize: '0.95rem', fontWeight: '700', color: '#D97706' }}>{inv.expectedYield || '14.5%'}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.68rem', color: '#64748B' }}>Payout Timeline</div>
                    <div style={{ fontSize: '0.80rem', color: '#334155', fontWeight: '600' }}>{inv.payoutTimeline || 'Sprint End'}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.68rem', color: '#64748B' }}>Ref ID</div>
                    <div style={{ fontSize: '0.72rem', color: '#94A3B8' }}>{inv.id}</div>
                  </div>
                </div>

                {/* Attached Screenshot or UTR info */}
                {(inv.utrNumber || inv.screenshotUrl) && (
                  <div style={{ fontSize: '0.74rem', background: '#F8FAFC', padding: '8px 10px', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                    {inv.utrNumber && <div><span style={{ color: '#64748B' }}>UTR:</span> <strong className="font-mono-numbers" style={{ color: '#0F172A' }}>{inv.utrNumber}</strong></div>}
                    {inv.screenshotUrl && (
                      <button
                        type="button"
                        onClick={() => setPreviewScreenshotUrl(inv.screenshotUrl)}
                        style={{ background: 'none', border: 'none', color: '#0284C7', cursor: 'pointer', padding: 0, fontWeight: '700', fontSize: '0.72rem', marginTop: '4px' }}
                      >
                        👁 View Attached Payment Screenshot
                      </button>
                    )}
                  </div>
                )}

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
                  <span className="font-mono-numbers" style={{ fontSize: '0.70rem', color: '#64748B' }}>Submitted: {inv.date}</span>
                  {inv.status === 'CONFIRMED' ? (
                    <button
                      type="button"
                      onClick={() => setActiveCertificate(inv)}
                      className="btn-secondary-trading"
                      style={{ padding: '6px 12px', borderRadius: '8px', fontSize: '0.74rem', gap: '5px', cursor: 'pointer', background: '#FFFFFF', border: '1px solid #CBD5E1', color: '#0F172A' }}
                    >
                      <FileText size={13} style={{ color: '#D97706' }} />
                      <span>View Certificate</span>
                    </button>
                  ) : (
                    <span style={{ fontSize: '0.70rem', color: '#D97706', fontWeight: '600' }}>
                      Admin verification in progress
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '48px 20px', background: '#F8FAFC', borderRadius: '14px', border: '1px dashed #CBD5E1' }}>
            <Building2 size={40} style={{ color: '#94A3B8', margin: '0 auto 12px auto' }} />
            <h4 style={{ color: '#0F172A', fontSize: '1.05rem', margin: '0 0 6px 0', fontWeight: '700' }}>No Active Investments Yet</h4>
            <p style={{ color: '#64748B', fontSize: '0.86rem', margin: '0 0 20px 0', maxWidth: '480px', marginInline: 'auto' }}>
              Select any of the 4 verified business projects and click <strong style={{ color: '#059669' }}>"Allocate Capital"</strong> to fund and receive your official digital allocation certificate.
            </p>
            <button
              onClick={() => setActiveTab('ventures')}
              className="btn-order-cta"
              style={{ padding: '10px 20px', fontSize: '0.84rem' }}
            >
              <span>Browse Active Business Deals</span>
              <ArrowRight size={15} />
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
};
