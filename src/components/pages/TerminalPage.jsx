import React from 'react';
import { motion } from 'framer-motion';
import { Building2, TrendingUp } from 'lucide-react';
import { LiveCandlestickTerminal } from '../LiveCandlestickTerminal';

export const TerminalPage = ({
  portfolioAggregates,
  projectInvestments,
  businessProjects,
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
          <span style={{ color: '#F0F6FC' }}>Live Candlestick Terminal</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <span className="badge badge-cyan font-mono-numbers" style={{ fontSize: '0.62rem', padding: '2px 8px' }}>
                MARKET FEED ACTIVE
              </span>
              <span style={{ fontSize: '0.72rem', color: '#00F59B', display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#00F59B', boxShadow: '0 0 6px #00F59B' }}></span>
                Sub-Second Tick Processing
              </span>
            </div>
            <h2 style={{ fontSize: '1.65rem', fontWeight: '800', color: '#F0F6FC', margin: 0, letterSpacing: '-0.02em' }}>
              High-Frequency Candlestick & Order Book Terminal
            </h2>
            <p style={{ color: '#8B949E', fontSize: '0.86rem', margin: '4px 0 0 0' }}>
              Real-time synthetic moving candles, deal depth, recent execution tape, and instant capital allocation desk.
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

      {/* Candlestick Engine Terminal */}
      <LiveCandlestickTerminal 
        totalCapitalRaised={portfolioAggregates.totalCapitalRaised} 
        totalInvestors={portfolioAggregates.totalInvestors} 
        investments={projectInvestments}
        projects={businessProjects}
        onInvest={onInvest}
      />
    </motion.div>
  );
};
