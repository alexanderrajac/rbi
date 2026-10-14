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
          <button onClick={() => setActiveTab('ventures')}>Ventures</button>
          <span>/</span>
          <span style={{ color: '#F0F6FC' }}>My Portfolio</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <span className="badge badge-gold font-mono-numbers" style={{ fontSize: '0.62rem', padding: '2px 8px' }}>
                INVESTOR HOLDINGS
              </span>
              <span style={{ fontSize: '0.72rem', color: '#8B949E' }}>
                Live Syndicate Allocation Ledger & Official Certificates
              </span>
            </div>
            <h2 style={{ fontSize: '1.65rem', fontWeight: '800', color: '#F0F6FC', margin: 0, letterSpacing: '-0.02em' }}>
              My Portfolio & Investment Certificates
            </h2>
            <p style={{ color: '#8B949E', fontSize: '0.86rem', margin: '4px 0 0 0' }}>
              Track your registered business allocations, payment confirmation references, and instant printable certificates.
            </p>
          </div>
          <button 
            onClick={() => setActiveTab('ventures')}
            className="btn btn-secondary btn-sm"
            style={{ gap: '6px' }}
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
        <div style={{ background: '#161B22', padding: '16px 20px', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
          <div style={{ fontSize: '0.70rem', color: '#8B949E', textTransform: 'uppercase', fontWeight: '700' }}>Total Allocations</div>
          <div className="font-mono-numbers" style={{ fontSize: '1.45rem', fontWeight: '800', color: '#F0F6FC', marginTop: '2px' }}>
            {projectInvestments?.length || 0}
          </div>
        </div>

        <div style={{ background: '#161B22', padding: '16px 20px', borderRadius: '12px', border: '1px solid rgba(0, 245, 155, 0.4)' }}>
          <div style={{ fontSize: '0.70rem', color: '#00F59B', textTransform: 'uppercase', fontWeight: '700' }}>Capital Committed</div>
          <div className="font-mono-numbers" style={{ fontSize: '1.45rem', fontWeight: '800', color: '#00F59B', marginTop: '2px' }}>
            {formatMoney(totalInvested)}
          </div>
        </div>

        <div style={{ background: '#161B22', padding: '16px 20px', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
          <div style={{ fontSize: '0.70rem', color: '#8B949E', textTransform: 'uppercase', fontWeight: '700' }}>Verified In Escrow</div>
          <div className="font-mono-numbers" style={{ fontSize: '1.45rem', fontWeight: '800', color: '#38BDF8', marginTop: '2px' }}>
            {totalApproved.length} Active
          </div>
        </div>

        <div style={{ background: '#161B22', padding: '16px 20px', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
          <div style={{ fontSize: '0.70rem', color: '#8B949E', textTransform: 'uppercase', fontWeight: '700' }}>Pending Verification</div>
          <div className="font-mono-numbers" style={{ fontSize: '1.45rem', fontWeight: '800', color: '#F59E0B', marginTop: '2px' }}>
            {totalPending.length} Pending
          </div>
        </div>
      </div>

      {/* Main Allocations List */}
      <div 
        id="my-investments-section"
        className="trading-panel-card"
        style={{
          background: '#0D1117',
          padding: '28px'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '24px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Layers size={20} className="text-amber-400" />
              <h3 style={{ fontSize: '1.30rem', fontWeight: '800', color: '#F0F6FC', margin: 0 }}>
                Registered Positions & Backing History
              </h3>
            </div>
            <p style={{ color: '#8B949E', fontSize: '0.84rem', margin: '4px 0 0 0' }}>
              Official record of all submissions sent to UPI ID <strong style={{ color: '#00F59B' }}>8248651695-3@ybl</strong>:
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
          <div style={{ textAlign: 'center', padding: '48px 20px', background: '#161B22', borderRadius: '14px', border: '1px dashed rgba(255, 255, 255, 0.12)' }}>
            <Building2 size={40} style={{ color: '#6E7681', margin: '0 auto 12px auto' }} />
            <h4 style={{ color: '#F0F6FC', fontSize: '1.05rem', margin: '0 0 6px 0', fontWeight: '700' }}>No Active Investments Yet</h4>
            <p style={{ color: '#8B949E', fontSize: '0.86rem', margin: '0 0 20px 0', maxWidth: '480px', marginInline: 'auto' }}>
              Select any of the 4 verified business projects and click <strong style={{ color: '#00F59B' }}>"Allocate Capital"</strong> to fund and receive your official digital allocation certificate.
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
