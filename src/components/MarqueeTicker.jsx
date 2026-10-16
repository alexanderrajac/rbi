import React from 'react';
import { ShieldCheck, CheckCircle2, Award, Building2, TrendingUp, Lock } from 'lucide-react';

export const MarqueeTicker = () => {
  const highlights = [
    { title: "UnavuKadai (Cloud Kitchen)", tag: "Food & Beverage", stat: "14.2% Fixed Return", note: "6-Day Sprint", type: "emerald" },
    { title: "CarpenterBullet", tag: "Artisan Craft", stat: "15.0% Fixed Return", note: "40-Day Sprint", type: "emerald" },
    { title: "Wooden Laptop Case", tag: "D2C Manufacturing", stat: "16.8% Fixed Return", note: "52-Day Sprint", type: "emerald" },
    { title: "Handcrafted Wooden Cup", tag: "Eco Retail", stat: "14.5% Fixed Return", note: "50-Day Sprint", type: "emerald" },
    { title: "100% Escrow Protection", tag: "ICICI & NPCI", stat: "Principal Ring-Fenced", note: "Zero Default Guarantee", type: "gold" },
    { title: "Direct UPI Depository", tag: "Official Handle", stat: "8248651695-3@ybl", note: "Instant Receipt Audit", type: "blue" },
    { title: "Legal Syndicate Deed", tag: "Indian Contract Act", stat: "Digital Certificate Issued", note: "Tamper-Evident", type: "purple" }
  ];

  const streamItems = [...highlights, ...highlights];

  return (
    <div style={{
      width: '100%',
      background: '#FFFFFF',
      borderTop: '1px solid #E2E8F0',
      borderBottom: '1px solid #E2E8F0',
      overflow: 'hidden',
      position: 'relative',
      height: '40px',
      display: 'flex',
      alignItems: 'center',
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
      fontSize: '0.78rem',
      userSelect: 'none',
      zIndex: 40
    }}>
      {/* Fixed Badge */}
      <div style={{
        position: 'relative',
        zIndex: 2,
        background: '#F8FAFC',
        padding: '0 16px',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        borderRight: '1px solid #E2E8F0',
        boxShadow: '4px 0 10px rgba(15, 23, 42, 0.04)',
        whiteSpace: 'nowrap'
      }}>
        <ShieldCheck size={16} className="text-emerald-600" />
        <span style={{ color: '#0F172A', fontWeight: '800', letterSpacing: '-0.01em', fontSize: '0.76rem' }}>
          VERIFIED SYNDICATE
        </span>
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
            key={`${item.title}-${idx}`} 
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              padding: '0 20px',
              borderRight: '1px solid #E2E8F0',
              color: '#475569'
            }}
          >
            <span style={{ color: '#0F172A', fontWeight: '700' }}>
              {item.title}
            </span>
            <span style={{ 
              fontSize: '0.68rem', 
              padding: '2px 7px', 
              borderRadius: '6px', 
              background: '#F1F5F9', 
              color: '#475569',
              fontWeight: '600'
            }}>
              {item.tag}
            </span>
            <span style={{ 
              color: item.type === 'emerald' ? '#059669' : item.type === 'blue' ? '#0284C7' : item.type === 'gold' ? '#D97706' : '#6366F1', 
              fontWeight: '800'
            }}>
              {item.stat}
            </span>
            <span style={{ 
              fontSize: '0.68rem', 
              padding: '2px 8px', 
              borderRadius: '6px', 
              border: item.type === 'gold' ? '1px solid rgba(217, 119, 6, 0.3)' : '1px solid rgba(16, 185, 129, 0.25)',
              background: item.type === 'gold' ? '#FEF3C7' : '#ECFDF5',
              color: item.type === 'gold' ? '#B45309' : '#059669',
              fontWeight: '700'
            }}>
              {item.note}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
