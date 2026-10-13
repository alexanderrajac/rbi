import React from 'react';
import { useApp } from '../context/AppContext';
import { Building2, ShieldCheck, Heart, Award, ArrowUpRight, Lock, CheckCircle, FileCheck } from 'lucide-react';

export const Footer = () => {
  const { setActiveTab } = useApp();

  return (
    <footer style={{ 
      borderTop: '1px solid var(--border-color)', 
      background: 'rgba(6, 9, 17, 0.98)',
      padding: '48px 0 32px 0',
      fontSize: '0.85rem'
    }}>
      <div className="container">
        
        {/* Security & Partner Escrow Trust Bar */}
        <div style={{ 
          background: 'rgba(255, 255, 255, 0.02)', 
          border: '1px solid rgba(255, 255, 255, 0.06)', 
          borderRadius: '16px', 
          padding: '18px 24px', 
          marginBottom: '36px',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ShieldCheck size={20} className="text-emerald-400" />
            <span style={{ fontWeight: '700', color: '#fff', fontSize: '0.9rem' }}>
              Institutional Escrow & Depository Partners:
            </span>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', alignItems: 'center', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <span className="live-pulse-dot" style={{ width: '6px', height: '6px' }}></span>
              <strong style={{ color: '#fff' }}>ICICI Bank</strong> Partner Escrow
            </span>
            <span style={{ color: 'var(--text-dim)' }}>•</span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <strong style={{ color: '#fff' }}>HDFC</strong> Depository Escrow
            </span>
            <span style={{ color: 'var(--text-dim)' }}>•</span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <strong style={{ color: '#fff' }}>Axis Bank</strong> Commercial Rails
            </span>
            <span style={{ color: 'var(--text-dim)' }}>•</span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#38bdf8' }}>
              <Lock size={13} />
              256-Bit Encrypted Ledger
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
                width: '38px', 
                height: '38px', 
                borderRadius: '10px', 
                background: 'linear-gradient(135deg, #fbbf24 0%, #d97706 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#000'
              }}>
                <Building2 size={22} strokeWidth={2.2} />
              </div>
              <span style={{ fontSize: '1.2rem', fontWeight: '800' }} className="gold-gradient-text">
                ROYAL BANK OF INVESTMENT
              </span>
            </div>
            
            <p style={{ color: 'var(--text-muted)', lineHeight: '1.6', marginBottom: '14px', fontSize: '0.85rem' }}>
              Democratizing venture capital and SME order financing through valuation-based digital shares, dynamic AI pricing models, and ring-fenced bank escrow custody.
            </p>

            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#fbbf24', fontSize: '0.82rem', fontWeight: '600' }}>
              <Award size={15} />
              <span>Project Submitted By: Alexander Rajasingh</span>
            </div>
          </div>

          {/* Quick Rails */}
          <div>
            <h4 style={{ color: '#fff', fontSize: '0.95rem', marginBottom: '14px' }}>Platform Navigation</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <li>
                <button onClick={() => {
                  setActiveTab('projects');
                  const el = document.getElementById('projects-grid');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }} className="btn btn-ghost btn-sm" style={{ padding: 0 }}>
                  Active Business Projects
                </button>
              </li>
              <li>
                <button onClick={() => {
                  setActiveTab('projects');
                  const el = document.getElementById('how-it-works-section');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }} className="btn btn-ghost btn-sm" style={{ padding: 0 }}>
                  How It Works
                </button>
              </li>
              <li>
                <button onClick={() => {
                  setActiveTab('projects');
                  const el = document.getElementById('investor-protection-section');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }} className="btn btn-ghost btn-sm" style={{ padding: 0 }}>
                  Escrow & Investor Protection
                </button>
              </li>
              <li>
                <button onClick={() => {
                  setActiveTab('projects');
                  const el = document.getElementById('my-investments-section');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }} className="btn btn-ghost btn-sm" style={{ padding: 0 }}>
                  My Investments & Certificates
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('admin')} className="btn btn-ghost btn-sm" style={{ padding: 0, color: '#34d399' }}>
                  Admin Portal
                </button>
              </li>
            </ul>
          </div>

          {/* Compliance & Regulatory Notice */}
          <div>
            <h4 style={{ color: '#fff', fontSize: '0.95rem', marginBottom: '14px' }}>Regulatory Disclosures</h4>
            <p style={{ color: 'var(--text-dim)', fontSize: '0.78rem', lineHeight: '1.6', margin: 0 }}>
              Investments in early-stage businesses and unlisted private companies involve capital risk. Real-time AI valuations are derived from proprietary financial algorithms, DCF simulations, and market multiples for guidance purposes. Fractional digital shares and milestone escrow allocations are managed under the Royal Bank of Investment depository framework.
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div style={{ 
          borderTop: '1px solid rgba(255, 255, 255, 0.06)', 
          paddingTop: '20px',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          color: 'var(--text-dim)',
          fontSize: '0.78rem',
          gap: '12px'
        }}>
          <div>
            © {new Date().getFullYear()} Royal Bank of Investment (RBI). All rights reserved.
          </div>
          <div style={{ display: 'flex', gap: '16px' }}>
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
