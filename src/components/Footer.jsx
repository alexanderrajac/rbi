import React from 'react';
import { useApp } from '../context/AppContext';
import { Building2, ShieldCheck, Heart, Award, ArrowUpRight, Lock, CheckCircle, FileCheck } from 'lucide-react';

export const Footer = () => {
  const { setActiveTab, isAdminLoggedIn } = useApp();

  return (
    <footer style={{ 
      borderTop: '1px solid #E2E8F0', 
      background: '#FFFFFF',
      padding: '44px 0 32px 0',
      fontSize: '0.85rem',
      color: '#64748B'
    }}>
      <div className="container">
        
        {/* Security & Partner Escrow Trust Bar */}
        <div style={{ 
          background: '#F8FAFC', 
          border: '1px solid #E2E8F0', 
          borderRadius: '14px', 
          padding: '16px 20px', 
          marginBottom: '32px',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ShieldCheck size={18} className="text-emerald-600" />
            <span style={{ fontWeight: '700', color: '#0F172A', fontSize: '0.86rem' }}>
              Institutional Escrow & Depository Clearing:
            </span>
          </div>

          <div className="font-mono-numbers" style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', alignItems: 'center', fontSize: '0.78rem', color: '#64748B' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#059669', boxShadow: '0 0 6px rgba(5, 150, 105, 0.4)' }}></span>
              <strong style={{ color: '#0F172A' }}>ICICI Bank</strong> Escrow Vault
            </span>
            <span style={{ color: '#CBD5E1' }}>•</span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <strong style={{ color: '#059669' }}>NPCI UPI</strong> 8248651695-3@ybl
            </span>
            <span style={{ color: '#CBD5E1' }}>•</span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#0284C7' }}>
              <Lock size={12} />
              SHA-256 Ledger Audit
            </span>
          </div>
        </div>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', 
          gap: '32px',
          marginBottom: '36px'
        }}>
          {/* Brand Col */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
              <div style={{ 
                width: '36px', 
                height: '36px', 
                borderRadius: '8px', 
                background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#FFFFFF'
              }}>
                <Building2 size={20} strokeWidth={2.4} />
              </div>
              <span style={{ fontSize: '1.15rem', fontWeight: '800', color: '#0F172A', letterSpacing: '-0.02em' }}>
                ROYAL BANK OF INVESTMENT
              </span>
            </div>
            
            <p style={{ color: '#64748B', lineHeight: '1.6', marginBottom: '14px', fontSize: '0.82rem' }}>
              Democratizing venture capital and SME order financing through valuation-based digital shares, dynamic AI pricing models, and ring-fenced bank escrow custody.
            </p>

            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#059669', fontSize: '0.80rem', fontWeight: '600' }}>
              <Award size={14} />
              <span className="font-mono-numbers">Lead Architect: Alexander Rajasingh</span>
            </div>
          </div>

          {/* Quick Rails */}
          <div>
            <h4 style={{ color: '#0F172A', fontSize: '0.90rem', marginBottom: '14px', fontWeight: '800' }}>Platform Pages</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <li>
                <button onClick={() => setActiveTab('ventures')} className="btn btn-ghost btn-sm" style={{ padding: 0, color: '#64748B', justifyContent: 'flex-start' }}>
                  4 Active Business Ventures
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('terminal')} className="btn btn-ghost btn-sm" style={{ padding: 0, color: '#64748B', justifyContent: 'flex-start' }}>
                  Live Candlestick Terminal
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('calculator')} className="btn btn-ghost btn-sm" style={{ padding: 0, color: '#64748B', justifyContent: 'flex-start' }}>
                  Return & Profit Calculator
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('how-it-works')} className="btn btn-ghost btn-sm" style={{ padding: 0, color: '#64748B', justifyContent: 'flex-start' }}>
                  Execution Workflow & Guide
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('escrow')} className="btn btn-ghost btn-sm" style={{ padding: 0, color: '#64748B', justifyContent: 'flex-start' }}>
                  Escrow Vault & Protection Charter
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('portfolio')} className="btn btn-ghost btn-sm" style={{ padding: 0, color: '#64748B', justifyContent: 'flex-start' }}>
                  My Portfolio & Digital Certificates
                </button>
              </li>
              {isAdminLoggedIn && (
                <li>
                  <button onClick={() => setActiveTab('admin')} className="btn btn-ghost btn-sm" style={{ padding: 0, color: '#D97706', fontWeight: '700', justifyContent: 'flex-start' }}>
                    Sovereign Admin Portal
                  </button>
                </li>
              )}
            </ul>
          </div>

          {/* Compliance & Regulatory Notice */}
          <div>
            <h4 style={{ color: '#0F172A', fontSize: '0.90rem', marginBottom: '14px', fontWeight: '800' }}>Regulatory Disclosures</h4>
            <p style={{ color: '#64748B', fontSize: '0.78rem', lineHeight: '1.6', margin: 0 }}>
              Investments in early-stage businesses and unlisted private companies involve capital risk. Real-time unit economics and milestone escrow allocations are managed under the Royal Bank of Investment depository framework.
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div style={{ 
          borderTop: '1px solid #E2E8F0', 
          paddingTop: '20px',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          color: '#94A3B8',
          fontSize: '0.78rem',
          gap: '12px'
        }}>
          <div>
            © {new Date().getFullYear()} Royal Bank of Investment (RBI). All rights reserved.
          </div>
          <div className="font-mono-numbers" style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
            <span>Confidential Project Architecture</span>
            <span>•</span>
            <span>Alexander Rajasingh</span>
            <span>•</span>
            <span>FinTech & Investment Technology</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
