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
          <button onClick={() => setActiveTab('ventures')}>Ventures</button>
          <span>/</span>
          <span style={{ color: '#F0F6FC' }}>Return Calculator</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <span className="badge badge-emerald font-mono-numbers" style={{ fontSize: '0.62rem', padding: '2px 8px' }}>
                YIELD SIMULATOR
              </span>
              <span style={{ fontSize: '0.72rem', color: '#8B949E' }}>
                Mathematical Return Modelling & Sprint Paybacks
              </span>
            </div>
            <h2 style={{ fontSize: '1.65rem', fontWeight: '800', color: '#F0F6FC', margin: 0, letterSpacing: '-0.02em' }}>
              Transparent Profit Ratio & Return Calculator
            </h2>
            <p style={{ color: '#8B949E', fontSize: '0.86rem', margin: '4px 0 0 0' }}>
              Simulate exact net returns, sprint payback period, and profit multiples across each verified business venture.
            </p>
          </div>
          <button 
            onClick={() => setActiveTab('ventures')}
            className="btn btn-secondary btn-sm"
            style={{ gap: '6px' }}
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
          background: '#0D1117'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '22px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Calculator size={20} className="text-emerald-400" />
              <h3 style={{ fontSize: '1.30rem', fontWeight: '800', color: '#F0F6FC', margin: 0 }}>
                Simulate Capital Allocation on ₹{calcAmount || '500'}
              </h3>
            </div>
            <p style={{ color: '#8B949E', fontSize: '0.86rem', margin: '4px 0 0 0' }}>
              Select a quick order size or enter custom amount to project net return multiples across all 4 deals:
            </p>
          </div>

          {/* Quick Preset Buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.78rem', color: '#8B949E', fontWeight: '600' }}>Order Size:</span>
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
                  border: calcAmount === amt.toString() ? '1px solid #00F59B' : '1px solid rgba(255, 255, 255, 0.1)',
                  background: calcAmount === amt.toString() ? 'rgba(0, 245, 155, 0.15)' : '#161B22',
                  color: calcAmount === amt.toString() ? '#00F59B' : '#C9D1D9',
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
                  background: '#161B22',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '14px',
                  padding: '18px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <span className="badge font-mono-numbers" style={{ fontSize: '0.62rem', background: 'rgba(56, 189, 248, 0.12)', color: '#38BDF8', border: '1px solid rgba(56, 189, 248, 0.25)', marginBottom: '4px' }}>
                      {proj.category}
                    </span>
                    <strong style={{ display: 'block', fontSize: '0.96rem', color: '#F0F6FC' }}>{proj.name}</strong>
                  </div>
                  <span className="badge font-mono-numbers" style={{ fontSize: '0.68rem', background: 'rgba(0, 245, 155, 0.12)', color: '#00F59B', border: '1px solid rgba(0, 245, 155, 0.25)' }}>
                    +{ret.yieldPercent}
                  </span>
                </div>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', paddingTop: '8px', borderTop: '1px dashed rgba(255, 255, 255, 0.1)' }}>
                  <span style={{ fontSize: '0.76rem', color: '#8B949E' }}>Total Payout:</span>
                  <span className="font-mono-numbers" style={{ fontSize: '1.30rem', fontWeight: '800', color: '#00F59B' }}>
                    ₹{ret.totalReturn}
                  </span>
                </div>

                <div className="font-mono-numbers" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '0.74rem', background: '#0D1117', padding: '8px 10px', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
                  <div>
                    <span style={{ color: '#8B949E', display: 'block' }}>Net Profit</span>
                    <strong style={{ color: '#F59E0B' }}>+₹{ret.profit}</strong>
                  </div>
                  <div>
                    <span style={{ color: '#8B949E', display: 'block' }}>Sprint Days</span>
                    <strong style={{ color: '#C9D1D9' }}>{ret.days}</strong>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => onInvest(proj, calcAmount)}
                  className="btn-order-cta"
                  style={{ padding: '8px 14px', fontSize: '0.78rem', marginTop: 'auto', width: '100%' }}
                >
                  <Zap size={13} />
                  <span>Allocate ₹{calcAmount || '500'} Now</span>
                </button>
              </div>
            );
          })}
        </div>

        {/* Compounding & Sprint Payout Explainer Banner */}
        <div style={{ marginTop: '24px', padding: '16px 20px', background: '#161B22', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.08)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <ShieldCheck size={22} className="text-emerald-400" />
            <div>
              <div style={{ color: '#F0F6FC', fontSize: '0.86rem', fontWeight: '700' }}>
                Bank Escrow Clearing & Milestone Protection
              </div>
              <div style={{ color: '#8B949E', fontSize: '0.76rem' }}>
                All returns are backed by physical commercial inventory and audited milestone progress.
              </div>
            </div>
          </div>
          <button 
            onClick={() => setActiveTab('escrow')}
            className="btn btn-ghost btn-sm"
            style={{ color: '#38BDF8', fontSize: '0.78rem' }}
          >
            Review Escrow Protection →
          </button>
        </div>
      </div>
    </motion.div>
  );
};
