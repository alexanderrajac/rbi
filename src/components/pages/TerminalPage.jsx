import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Building2, 
  TrendingUp, 
  ShieldCheck, 
  Users, 
  Clock, 
  CheckCircle2, 
  ArrowUpRight, 
  Layers, 
  PieChart, 
  BarChart3, 
  Calendar,
  Lock,
  ArrowRight
} from 'lucide-react';

export const TerminalPage = ({
  portfolioAggregates,
  projectInvestments,
  businessProjects = [],
  onInvest,
  setActiveTab
}) => {
  const [selectedProjectId, setSelectedProjectId] = useState(
    businessProjects[0]?.id || 1
  );

  const selectedProject = businessProjects.find(p => p.id === selectedProjectId) || businessProjects[0];

  // Helper for currency formatting
  const formatMoney = (val) => {
    return '₹' + Number(val || 0).toLocaleString('en-IN');
  };

  // Safe sample 500 calculation
  const getSampleReturns = (proj) => {
    if (!proj) return { returnAmt: 575, profit: 75, days: 90, yieldPct: '15.0%' };
    const goal = proj.goal || 100000;
    const estRev = proj.estimatedRevenue || (goal * 1.35);
    const profitSharing = proj.profitSharingPercent || 30;
    const profitPool = (estRev - goal) * (profitSharing / 100);
    const termYield = profitPool > 0 ? (profitPool / goal) : 0.15;
    const profit = Math.round(500 * termYield);
    return {
      returnAmt: 500 + profit,
      profit: profit,
      days: proj.durationDays || 90,
      yieldPct: (termYield * 100).toFixed(1) + '%'
    };
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      style={{ paddingBottom: '40px' }}
    >
      {/* Page Header */}
      <div className="page-header-trading">
        <div className="page-breadcrumb">
          <button onClick={() => setActiveTab('ventures')} style={{ color: '#64748B' }}>Ventures</button>
          <span style={{ color: '#CBD5E1' }}>/</span>
          <span style={{ color: '#0F172A', fontWeight: '600' }}>Growth & Financial Analytics</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <span style={{ fontSize: '0.70rem', padding: '3px 10px', background: '#DCFCE7', color: '#166534', fontWeight: '700', borderRadius: '9999px', display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#16A34A' }}></span>
                Verified Business Analytics
              </span>
              <span style={{ fontSize: '0.74rem', color: '#475569', fontWeight: '600' }}>
                100% Escrow-Protected SME Portfolios
              </span>
            </div>
            <h2 style={{ fontSize: '1.75rem', fontWeight: '800', color: '#0F172A', margin: 0, letterSpacing: '-0.02em' }}>
              Growth & Financial Analytics Hub
            </h2>
            <p style={{ color: '#475569', fontSize: '0.90rem', margin: '6px 0 0 0', maxWidth: '720px' }}>
              Transparent unit economics, milestone execution timelines, and pre-agreed fixed return schedules across active ventures.
            </p>
          </div>
          <button 
            onClick={() => setActiveTab('ventures')}
            className="btn btn-secondary btn-sm"
            style={{ gap: '6px', background: '#FFFFFF', border: '1px solid #CBD5E1', color: '#0F172A', fontWeight: '600' }}
          >
            <Building2 size={15} />
            <span>Browse All 4 Deals</span>
          </button>
        </div>
      </div>

      {/* Top 4 Key Financial Metrics Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '28px' }}>
        <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '14px', padding: '18px 20px', boxShadow: '0 2px 6px rgba(0,0,0,0.02)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <span style={{ fontSize: '0.76rem', color: '#64748B', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Total Syndicate Target
            </span>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#E0F2FE', color: '#0284C7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Building2 size={16} />
            </div>
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: '800', color: '#0F172A', letterSpacing: '-0.02em' }}>
            ₹2,90,000
          </div>
          <div style={{ fontSize: '0.74rem', color: '#059669', fontWeight: '600', marginTop: '4px' }}>
            Across 4 vetted MSME operations
          </div>
        </div>

        <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '14px', padding: '18px 20px', boxShadow: '0 2px 6px rgba(0,0,0,0.02)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <span style={{ fontSize: '0.76rem', color: '#64748B', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Expected Fixed Yield
            </span>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#DCFCE7', color: '#16A34A', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <TrendingUp size={16} />
            </div>
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: '800', color: '#15803D', letterSpacing: '-0.02em' }}>
            14.0% – 16.8%
          </div>
          <div style={{ fontSize: '0.74rem', color: '#166534', fontWeight: '600', marginTop: '4px' }}>
            Pre-agreed sprint profit sharing
          </div>
        </div>

        <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '14px', padding: '18px 20px', boxShadow: '0 2px 6px rgba(0,0,0,0.02)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <span style={{ fontSize: '0.76rem', color: '#64748B', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Minimum Entry Barrier
            </span>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#FEF3C7', color: '#D97706', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Users size={16} />
            </div>
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: '800', color: '#0F172A', letterSpacing: '-0.02em' }}>
            ₹500 Only
          </div>
          <div style={{ fontSize: '0.74rem', color: '#D97706', fontWeight: '600', marginTop: '4px' }}>
            Democratized for retail backers
          </div>
        </div>

        <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '14px', padding: '18px 20px', boxShadow: '0 2px 6px rgba(0,0,0,0.02)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <span style={{ fontSize: '0.76rem', color: '#64748B', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Escrow Protection
            </span>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#F3E8FF', color: '#9333EA', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ShieldCheck size={16} />
            </div>
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: '800', color: '#0F172A', letterSpacing: '-0.02em' }}>
            100% Segregated
          </div>
          <div style={{ fontSize: '0.74rem', color: '#7E22CE', fontWeight: '600', marginTop: '4px' }}>
            UPI ID: 8248651695-3@ybl
          </div>
        </div>
      </div>

      {/* Venture Selector Pills */}
      <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '16px', padding: '8px', marginBottom: '24px', display: 'flex', gap: '8px', overflowX: 'auto' }}>
        {businessProjects.map((p) => {
          const isSelected = p.id === selectedProjectId;
          const sample = getSampleReturns(p);
          return (
            <button
              key={p.id}
              onClick={() => setSelectedProjectId(p.id)}
              style={{
                flex: '1 1 200px',
                minWidth: '220px',
                padding: '12px 16px',
                borderRadius: '12px',
                border: isSelected ? '2px solid #0284C7' : '1px solid #E2E8F0',
                background: isSelected ? '#F0F9FF' : '#FAFAFA',
                textAlign: 'left',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                <span style={{ fontSize: '0.70rem', color: isSelected ? '#0369A1' : '#64748B', fontWeight: '700', textTransform: 'uppercase' }}>
                  {p.category}
                </span>
                <span style={{ fontSize: '0.72rem', color: '#16A34A', fontWeight: '800' }}>
                  {sample.yieldPct}
                </span>
              </div>
              <div style={{ fontSize: '0.94rem', fontWeight: '800', color: '#0F172A', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {p.name}
              </div>
              <div style={{ fontSize: '0.74rem', color: '#64748B', marginTop: '4px' }}>
                Goal: {formatMoney(p.goal)} • {p.durationDays} Days
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected Venture In-Depth Analytics Grid */}
      {selectedProject && (() => {
        const sample = getSampleReturns(selectedProject);
        const raisedPct = Math.min(100, Math.round(((selectedProject.raised || 0) / (selectedProject.goal || 1)) * 100));

        return (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px', marginBottom: '32px' }}>
            
            {/* Left Column: Business Overview & Capital Allocation */}
            <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '16px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                {selectedProject.imageUrl && (
                  <img 
                    src={selectedProject.imageUrl} 
                    alt={selectedProject.name} 
                    style={{ width: '54px', height: '54px', borderRadius: '12px', objectFit: 'cover', border: '1px solid #E2E8F0' }}
                  />
                )}
                <div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#0F172A', margin: 0 }}>
                    {selectedProject.name}
                  </h3>
                  <div style={{ fontSize: '0.78rem', color: '#64748B', marginTop: '2px' }}>
                    {selectedProject.category} • Sprint Duration: {selectedProject.durationDays} Days
                  </div>
                </div>
              </div>

              <p style={{ fontSize: '0.86rem', color: '#475569', lineHeight: '1.6', marginBottom: '20px' }}>
                {selectedProject.description}
              </p>

              {/* Capital Usage Breakdown */}
              <h4 style={{ fontSize: '0.90rem', fontWeight: '800', color: '#0F172A', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <PieChart size={16} style={{ color: '#0284C7' }} />
                Capital Utilization Breakdown
              </h4>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '24px' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: '4px' }}>
                    <span style={{ color: '#334155', fontWeight: '600' }}>Inventory & Direct Raw Materials (Invoiced)</span>
                    <span style={{ color: '#0F172A', fontWeight: '700' }}>55%</span>
                  </div>
                  <div style={{ height: '8px', background: '#F1F5F9', borderRadius: '9999px', overflow: 'hidden' }}>
                    <div style={{ width: '55%', height: '100%', background: '#0284C7', borderRadius: '9999px' }}></div>
                  </div>
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: '4px' }}>
                    <span style={{ color: '#334155', fontWeight: '600' }}>Production Tools & Equipment</span>
                    <span style={{ color: '#0F172A', fontWeight: '700' }}>25%</span>
                  </div>
                  <div style={{ height: '8px', background: '#F1F5F9', borderRadius: '9999px', overflow: 'hidden' }}>
                    <div style={{ width: '25%', height: '100%', background: '#10B981', borderRadius: '9999px' }}></div>
                  </div>
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: '4px' }}>
                    <span style={{ color: '#334155', fontWeight: '600' }}>Order Fulfillment & Logistics</span>
                    <span style={{ color: '#0F172A', fontWeight: '700' }}>12%</span>
                  </div>
                  <div style={{ height: '8px', background: '#F1F5F9', borderRadius: '9999px', overflow: 'hidden' }}>
                    <div style={{ width: '12%', height: '100%', background: '#F59E0B', borderRadius: '9999px' }}></div>
                  </div>
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: '4px' }}>
                    <span style={{ color: '#334155', fontWeight: '600' }}>Escrow Reserve & Contingency</span>
                    <span style={{ color: '#0F172A', fontWeight: '700' }}>8%</span>
                  </div>
                  <div style={{ height: '8px', background: '#F1F5F9', borderRadius: '9999px', overflow: 'hidden' }}>
                    <div style={{ width: '8%', height: '100%', background: '#8B5CF6', borderRadius: '9999px' }}></div>
                  </div>
                </div>
              </div>

              {/* Milestone Execution Status */}
              <h4 style={{ fontSize: '0.90rem', fontWeight: '800', color: '#0F172A', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Clock size={16} style={{ color: '#D97706' }} />
                Milestone Execution Schedule
              </h4>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {(selectedProject.milestones || [
                  { title: 'Capital Syndicate Close & Escrow Lock', targetDays: 'Day 10' },
                  { title: 'Equipment & Material Acquisition', targetDays: 'Day 25' },
                  { title: 'Full Commercial Production & Delivery', targetDays: 'Day 60' },
                  { title: 'Revenue Settlement & Backer Payouts', targetDays: 'Day 90' }
                ]).map((m, idx) => (
                  <div 
                    key={idx}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '10px 14px',
                      background: '#F8FAFC',
                      border: '1px solid #E2E8F0',
                      borderRadius: '10px'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ width: '22px', height: '22px', borderRadius: '50%', background: '#E2E8F0', color: '#475569', fontSize: '0.72rem', fontWeight: '800', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {idx + 1}
                      </span>
                      <span style={{ fontSize: '0.82rem', fontWeight: '600', color: '#1E293B' }}>
                        {m.title}
                      </span>
                    </div>
                    <span style={{ fontSize: '0.68rem', fontWeight: '700', padding: '3px 8px', background: '#FEF3C7', color: '#B45309', borderRadius: '6px' }}>
                      UPCOMING
                    </span>
                  </div>
                ))}
              </div>

            </div>

            {/* Right Column: Unit Economics & Returns Calculator Card */}
            <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '16px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.03)', display: 'flex', flexDirection: 'column' }}>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                <div>
                  <span style={{ fontSize: '0.70rem', color: '#166534', background: '#DCFCE7', padding: '3px 10px', borderRadius: '9999px', fontWeight: '700' }}>
                    UNIT ECONOMICS FOR RETAIL BACKERS
                  </span>
                  <h3 style={{ fontSize: '1.30rem', fontWeight: '800', color: '#0F172A', margin: '8px 0 0 0' }}>
                    What a ₹500 Backing Yields
                  </h3>
                </div>
                <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#DCFCE7', color: '#16A34A', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <TrendingUp size={20} />
                </div>
              </div>

              {/* Big Payout Highlight Box */}
              <div style={{ background: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: '14px', padding: '18px', marginBottom: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '4px' }}>
                  <span style={{ fontSize: '0.82rem', color: '#166534', fontWeight: '600' }}>Total Expected Payout:</span>
                  <span style={{ fontSize: '1.65rem', fontWeight: '900', color: '#15803D' }}>₹{sample.returnAmt}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.76rem', color: '#166534' }}>
                  <span>Net Profit Generated:</span>
                  <span style={{ fontWeight: '700' }}>+₹{sample.profit} ({sample.yieldPct} in {sample.days} Days)</span>
                </div>
              </div>

              {/* Itemized Economics Rows */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', paddingBottom: '8px', borderBottom: '1px dashed #E2E8F0' }}>
                  <span style={{ color: '#64748B' }}>Your Capital Contribution</span>
                  <span style={{ color: '#0F172A', fontWeight: '700' }}>₹500.00</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', paddingBottom: '8px', borderBottom: '1px dashed #E2E8F0' }}>
                  <span style={{ color: '#64748B' }}>Expected Profit Sharing Yield</span>
                  <span style={{ color: '#16A34A', fontWeight: '700' }}>{sample.yieldPct}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', paddingBottom: '8px', borderBottom: '1px dashed #E2E8F0' }}>
                  <span style={{ color: '#64748B' }}>Target Revenue Pool</span>
                  <span style={{ color: '#0F172A', fontWeight: '700' }}>{formatMoney(selectedProject.estimatedRevenue || selectedProject.goal * 1.35)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', paddingBottom: '8px', borderBottom: '1px dashed #E2E8F0' }}>
                  <span style={{ color: '#64748B' }}>Settlement Duration</span>
                  <span style={{ color: '#0F172A', fontWeight: '700' }}>{selectedProject.durationDays} Days</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', paddingBottom: '8px', borderBottom: '1px dashed #E2E8F0' }}>
                  <span style={{ color: '#64748B' }}>Escrow Depository</span>
                  <span style={{ color: '#0284C7', fontWeight: '700' }}>8248651695-3@ybl</span>
                </div>
              </div>

              {/* Escrow Guarantee Pill */}
              <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '12px 14px', marginBottom: '20px', display: 'flex', gap: '10px', alignItems: 'center' }}>
                <ShieldCheck size={20} style={{ color: '#059669', flexShrink: 0 }} />
                <div style={{ fontSize: '0.74rem', color: '#475569', lineHeight: '1.4' }}>
                  <strong style={{ color: '#0F172A' }}>Escrow Ring-Fenced:</strong> Funds remain securely locked in designated bank escrow and are only released against verified business invoices.
                </div>
              </div>

              {/* CTA Button to back this selected deal */}
              <button
                type="button"
                onClick={() => onInvest && onInvest(selectedProject)}
                className="btn-order-cta"
                style={{
                  width: '100%',
                  padding: '14px',
                  fontSize: '0.96rem',
                  borderRadius: '12px',
                  marginTop: 'auto',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
              >
                <Building2 size={18} />
                <span>Back {selectedProject.name} (from ₹500)</span>
              </button>

            </div>

          </div>
        );
      })()}

      {/* Comparison Matrix of All 4 Active Ventures */}
      <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '16px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', flexWrap: 'wrap', gap: '10px' }}>
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#0F172A', margin: 0 }}>
              Comparative Venture Matrix
            </h3>
            <p style={{ color: '#64748B', fontSize: '0.82rem', margin: '4px 0 0 0' }}>
              Direct side-by-side audit of yield, timeline, target goals, and escrow custodian details
            </p>
          </div>
          <button 
            onClick={() => setActiveTab('calculator')}
            className="btn btn-secondary btn-sm"
            style={{ gap: '6px', fontSize: '0.76rem', color: '#0284C7', borderColor: '#BAE6FD', background: '#F0F9FF' }}
          >
            <span>Open Advanced Calculator</span>
            <ArrowRight size={13} />
          </button>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '680px' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #E2E8F0', background: '#F8FAFC' }}>
                <th style={{ padding: '12px 14px', fontSize: '0.74rem', color: '#475569', fontWeight: '700', textTransform: 'uppercase' }}>Venture Name</th>
                <th style={{ padding: '12px 14px', fontSize: '0.74rem', color: '#475569', fontWeight: '700', textTransform: 'uppercase' }}>Category</th>
                <th style={{ padding: '12px 14px', fontSize: '0.74rem', color: '#475569', fontWeight: '700', textTransform: 'uppercase' }}>Min Contribution</th>
                <th style={{ padding: '12px 14px', fontSize: '0.74rem', color: '#475569', fontWeight: '700', textTransform: 'uppercase' }}>Target Goal</th>
                <th style={{ padding: '12px 14px', fontSize: '0.74rem', color: '#475569', fontWeight: '700', textTransform: 'uppercase' }}>Sprint Days</th>
                <th style={{ padding: '12px 14px', fontSize: '0.74rem', color: '#475569', fontWeight: '700', textTransform: 'uppercase' }}>Expected Yield</th>
                <th style={{ padding: '12px 14px', fontSize: '0.74rem', color: '#475569', fontWeight: '700', textTransform: 'uppercase', textAlign: 'right' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {businessProjects.map((p) => {
                const sample = getSampleReturns(p);
                return (
                  <tr key={p.id} style={{ borderBottom: '1px solid #E2E8F0' }}>
                    <td style={{ padding: '14px', fontWeight: '700', color: '#0F172A', fontSize: '0.88rem' }}>
                      {p.name}
                    </td>
                    <td style={{ padding: '14px', color: '#64748B', fontSize: '0.80rem' }}>
                      <span style={{ background: '#F1F5F9', padding: '3px 8px', borderRadius: '6px', fontWeight: '600' }}>
                        {p.category}
                      </span>
                    </td>
                    <td style={{ padding: '14px', fontWeight: '700', color: '#059669', fontSize: '0.84rem' }}>
                      ₹500
                    </td>
                    <td style={{ padding: '14px', fontWeight: '600', color: '#0F172A', fontSize: '0.84rem' }}>
                      {formatMoney(p.goal)}
                    </td>
                    <td style={{ padding: '14px', color: '#64748B', fontSize: '0.84rem' }}>
                      {p.durationDays} Days
                    </td>
                    <td style={{ padding: '14px', fontWeight: '800', color: '#15803D', fontSize: '0.86rem' }}>
                      {sample.yieldPct}
                    </td>
                    <td style={{ padding: '14px', textAlign: 'right' }}>
                      <button
                        onClick={() => onInvest && onInvest(p)}
                        style={{
                          background: '#0F172A',
                          color: '#FFFFFF',
                          border: 'none',
                          padding: '6px 14px',
                          borderRadius: '8px',
                          fontSize: '0.76rem',
                          fontWeight: '700',
                          cursor: 'pointer'
                        }}
                      >
                        Back Deal →
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </motion.div>
  );
};
