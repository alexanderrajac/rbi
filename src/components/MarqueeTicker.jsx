import React from 'react';
import { TrendingUp, ShieldCheck, Zap, Activity, CircleDot } from 'lucide-react';

export const MarqueeTicker = () => {
  const tickerItems = [
    { ticker: "UNAVUKADAI", label: "FOOD TECH", cap: "₹4,000", yield: "+14.2%", status: "UPCOMING SPRINT", type: "bullish" },
    { ticker: "CARPBULLET", label: "COMMISSION MKT", cap: "₹10,000", yield: "+15.0%", status: "UPCOMING SPRINT", type: "bullish" },
    { ticker: "WOODEN-LAPTOP", label: "D2C MFG", cap: "₹99,500", yield: "+16.8%", status: "UPCOMING BATCH", type: "bullish" },
    { ticker: "WOODEN-CUP", label: "ARTISAN RETAIL", cap: "₹46,000", yield: "+14.5%", status: "UPCOMING BATCH", type: "bullish" },
    { ticker: "RBI INDEX", label: "SYNDICATE AVG", cap: "₹1,59,500 POOL", yield: "+15.1% NET", status: "VERIFIED", type: "gold" },
    { ticker: "ESCROW AUDIT", label: "RBI VAULT", cap: "100% CAPITAL PROTECT", yield: "ZERO DEFAULT", status: "ACTIVE", type: "emerald" },
    { ticker: "UPI CLEARING", label: "INSTANT SETTLEMENT", cap: "8248651695-3@ybl", yield: "< 24H SPRINT", status: "LIVE", type: "cyan" },
  ];

  // Duplicate for seamless infinite loop
  const streamItems = [...tickerItems, ...tickerItems];

  return (
    <div style={{
      width: '100%',
      background: '#FFFFFF',
      borderTop: '1px solid #E2E8F0',
      borderBottom: '1px solid #E2E8F0',
      overflow: 'hidden',
      position: 'relative',
      height: '38px',
      display: 'flex',
      alignItems: 'center',
      fontFamily: "'JetBrains Mono', 'Fira Code', 'SF Mono', monospace",
      fontSize: '0.74rem',
      userSelect: 'none',
      zIndex: 40
    }}>
      {/* Fixed Terminal Badge */}
      <div style={{
        position: 'relative',
        zIndex: 2,
        background: '#F8FAFC',
        padding: '0 14px',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        borderRight: '1px solid #E2E8F0',
        boxShadow: '4px 0 10px rgba(15, 23, 42, 0.04)',
        whiteSpace: 'nowrap'
      }}>
        <span style={{ 
          display: 'inline-block', 
          width: '7px', 
          height: '7px', 
          borderRadius: '50%', 
          background: '#10B981', 
          boxShadow: '0 0 8px rgba(16, 185, 129, 0.6)' 
        }}></span>
        <span style={{ color: '#059669', fontWeight: '800', letterSpacing: '0.08em' }}>MARKET TAPE</span>
      </div>

      {/* Marquee Continuous Stream */}
      <div className="marquee-track" style={{
        display: 'flex',
        alignItems: 'center',
        whiteSpace: 'nowrap',
        willChange: 'transform'
      }}>
        {streamItems.map((item, idx) => (
          <div 
            key={`${item.ticker}-${idx}`} 
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              padding: '0 20px',
              borderRight: '1px solid #E2E8F0',
              color: '#475569'
            }}
          >
            <span style={{ color: '#0F172A', fontWeight: '800', letterSpacing: '0.04em' }}>
              {item.ticker}
            </span>
            <span style={{ 
              fontSize: '0.64rem', 
              padding: '2px 6px', 
              borderRadius: '4px', 
              background: '#F1F5F9', 
              color: '#475569',
              fontWeight: '600'
            }}>
              {item.label}
            </span>
            <span style={{ color: '#0F172A', fontWeight: '700' }}>
              {item.cap}
            </span>
            <span style={{ 
              color: item.type === 'emerald' ? '#059669' : item.type === 'cyan' ? '#0284C7' : item.type === 'gold' ? '#D97706' : '#059669', 
              fontWeight: '800',
              display: 'flex',
              alignItems: 'center',
              gap: '2px'
            }}>
              <TrendingUp size={12} />
              {item.yield}
            </span>
            <span style={{ 
              fontSize: '0.62rem', 
              padding: '2px 6px', 
              borderRadius: '4px', 
              border: item.status === 'UPCOMING SPRINT' ? '1px solid rgba(217, 119, 6, 0.3)' : '1px solid rgba(16, 185, 129, 0.3)',
              background: item.status === 'UPCOMING SPRINT' ? 'rgba(245, 158, 11, 0.1)' : 'rgba(16, 185, 129, 0.1)',
              color: item.status === 'UPCOMING SPRINT' ? '#D97706' : '#059669',
              fontWeight: '700'
            }}>
              {item.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
