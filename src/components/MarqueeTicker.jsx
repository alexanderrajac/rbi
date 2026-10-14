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
      background: '#080B0F',
      borderTop: '1px solid rgba(255, 255, 255, 0.06)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
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
        background: '#0B0E14',
        padding: '0 14px',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        borderRight: '1px solid rgba(255, 255, 255, 0.1)',
        boxShadow: '10px 0 15px rgba(0,0,0,0.5)',
        whiteSpace: 'nowrap'
      }}>
        <span style={{ 
          display: 'inline-block', 
          width: '7px', 
          height: '7px', 
          borderRadius: '50%', 
          background: '#00F59B', 
          boxShadow: '0 0 8px #00F59B' 
        }}></span>
        <span style={{ color: '#00F59B', fontWeight: '800', letterSpacing: '0.08em' }}>MARKET TAPE</span>
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
              borderRight: '1px solid rgba(255, 255, 255, 0.05)',
              color: '#8B949E'
            }}
          >
            <span style={{ color: '#F0F6FC', fontWeight: '700', letterSpacing: '0.04em' }}>
              {item.ticker}
            </span>
            <span style={{ 
              fontSize: '0.64rem', 
              padding: '1px 5px', 
              borderRadius: '4px', 
              background: 'rgba(255, 255, 255, 0.05)', 
              color: '#7D8590' 
            }}>
              {item.label}
            </span>
            <span style={{ color: '#C9D1D9', fontWeight: '600' }}>
              {item.cap}
            </span>
            <span style={{ 
              color: item.type === 'emerald' ? '#10B981' : item.type === 'cyan' ? '#38BDF8' : item.type === 'gold' ? '#F59E0B' : '#00F59B', 
              fontWeight: '700',
              display: 'flex',
              alignItems: 'center',
              gap: '2px'
            }}>
              <TrendingUp size={12} />
              {item.yield}
            </span>
            <span style={{
              fontSize: '0.62rem',
              color: '#6E7681',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              padding: '1px 4px',
              borderRadius: '3px'
            }}>
              {item.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
