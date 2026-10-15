import React from 'react';
import { motion } from 'framer-motion';
import { Calculator, Building2, TrendingUp, ShieldCheck, Zap } from 'lucide-react';

export const CalculatorPage = ({
  businessProjects,
  calcAmount,
  setCalcAmount,
  calculateInvestmentReturn,
  onInvest,
  setActiveTab
}) => {
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
          <span style={{ color: '#0F172A', fontWeight: '600' }}>Return Calculator</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <span className="badge badge-emerald font-mono-numbers" style={{ fontSize: '0.62rem', padding: '2px 8px' }}>
                YIELD SIMULATOR
              </span>
              <span style={{ fontSize: '0.72rem', color: '#64748B' }}>
                Mathematical Return Modelling & Sprint Paybacks
              </span>
            </div>
            <h2 style={{ fontSize: '1.65rem', fontWeight: '800', color: '#0F172A', margin: 0, letterSpacing: '-0.02em' }}>
              Transparent Profit Ratio & Return Calculator
            </h2>
            <p style={{ color: '#64748B', fontSize: '0.86rem', margin: '4px 0 0 0' }}>
              Simulate exact net returns, sprint payback period, and profit multiples across each verified business venture.
            </p>
          </div>
          <button 
            onClick={() => setActiveTab('ventures')}
            className="btn btn-secondary btn-sm"
            style={{ gap: '6px', background: '#FFFFFF', border: '1px solid #CBD5E1', color: '#0F172A' }}
          >
            <Building2 size={15} />
            <span>Browse All 4 Deals</span>
          </button>
        </div>
      </div>

      {/* Main Interactive Calculator Console */}
      <div 
        className="trading-panel-card"
        style={{
          padding: '28px 24px',
          marginBottom: '26px',
          background: '#FFFFFF',
          border: '1px solid #E2E8F0',
          boxShadow: '0 4px 20px -2px rgba(15, 23, 42, 0.05)'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '22px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Calculator size={20} className="text-emerald-600" />
              <h3 style={{ fontSize: '1.30rem', fontWeight: '800', color: '#0F172A', margin: 0 }}>
                Simulate Capital Allocation on ₹{calcAmount || '500'}
              </h3>
            </div>
            <p style={{ color: '#64748B', fontSize: '0.86rem', margin: '4px 0 0 0' }}>
              Select a quick order size or enter custom amount to project net return multiples across all 4 deals:
            </p>
          </div>

          {/* Quick Preset Buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.78rem', color: '#64748B', fontWeight: '600' }}>Order Size:</span>
            {[500, 1000, 2500, 5000, 10000, 25000].map(amt => (
              <button
                key={amt}
                onClick={() => setCalcAmount(amt.toString())}
                className="font-mono-numbers"
                style={{
                  padding: '6px 12px',
                  borderRadius: '8px',
                  fontSize: '0.80rem',
                  fontWeight: '700',
                  border: calcAmount === amt.toString() ? '1px solid #059669' : '1px solid #E2E8F0',
                  background: calcAmount === amt.toString() ? '#ECFDF5' : '#F8FAFC',
                  color: calcAmount === amt.toString() ? '#059669' : '#475569',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                ₹{amt.toLocaleString('en-IN')}
              </button>
            ))}
          </div>
        </div>

        {/* 4 Projects Return Cards Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
          {businessProjects.map(proj => {
            const ret = calculateInvestmentReturn(proj, calcAmount);
            return (
              <div 
                key={proj.id}
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
                    <span className="badge font-mono-numbers" style={{ fontSize: '0.62rem', background: '#F0F9FF', color: '#0284C7', border: '1px solid #BAE6FD', marginBottom: '4px' }}>
                      {proj.category}
                    </span>
                    <strong style={{ display: 'block', fontSize: '1.02rem', color: '#0F172A', letterSpacing: '-0.01em', marginTop: '2px' }}>{proj.name}</strong>
                  </div>
                  <span className="badge font-mono-numbers" style={{ fontSize: '0.70rem', background: '#ECFDF5', color: '#059669', border: '1px solid #A7F3D0', fontWeight: '800' }}>
                    +{ret.yieldPercent}
                  </span>
                </div>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', paddingTop: '10px', borderTop: '1px dashed #E2E8F0' }}>
                  <span className="micro-label" style={{ color: '#64748B' }}>Total Payout:</span>
                  <span className="font-mono-numbers" style={{ fontSize: '1.35rem', fontWeight: '900', color: '#059669' }}>
                    ₹{ret.totalReturn}
                  </span>
                </div>

                <div className="font-mono-numbers" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '0.74rem', background: '#F8FAFC', padding: '10px 12px', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                  <div>
                    <span className="micro-label" style={{ display: 'block', marginBottom: '2px', color: '#64748B' }}>Net Profit</span>
                    <strong style={{ color: '#D97706', fontSize: '0.96rem' }}>+₹{ret.profit}</strong>
                  </div>
                  <div>
                    <span className="micro-label" style={{ display: 'block', marginBottom: '2px', color: '#64748B' }}>Sprint Days</span>
                    <strong style={{ color: '#0F172A', fontSize: '0.96rem' }}>{ret.days}</strong>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => onInvest(proj, calcAmount)}
                  className="btn-order-cta"
                  style={{ padding: '10px 14px', fontSize: '0.80rem', marginTop: 'auto', width: '100%', minHeight: '44px' }}
                >
                  <Zap size={14} />
                  <span>Allocate ₹{calcAmount || '500'} Now</span>
                </button>
              </div>
            );
          })}
        </div>

        {/* Compounding & Sprint Payout Explainer Banner */}
        <div style={{ marginTop: '24px', padding: '16px 20px', background: '#F0FDF4', borderRadius: '12px', border: '1px solid #BBF7D0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <ShieldCheck size={22} className="text-emerald-600" />
            <div>
              <div style={{ color: '#065F46', fontSize: '0.86rem', fontWeight: '700' }}>
                Bank Escrow Clearing & Milestone Protection
              </div>
              <div style={{ color: '#047857', fontSize: '0.76rem' }}>
                All returns are backed by physical commercial inventory and audited milestone progress.
              </div>
            </div>
          </div>
          <button 
            onClick={() => setActiveTab('escrow')}
            className="btn btn-ghost btn-sm"
            style={{ color: '#0284C7', fontSize: '0.78rem', fontWeight: '700' }}
          >
            Review Escrow Protection →
          </button>
        </div>
      </div>
    </motion.div>
  );
};
