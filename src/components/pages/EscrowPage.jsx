import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Building2, Lock, CheckCircle2, Printer, FileText, ArrowRight, ShieldAlert, Award } from 'lucide-react';

export const EscrowPage = ({ setActiveTab }) => {
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
          <span style={{ color: '#F0F6FC' }}>Escrow & Safety</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <span className="badge badge-gold font-mono-numbers" style={{ fontSize: '0.62rem', padding: '2px 8px' }}>
                SEGREGATED CUSTODY
              </span>
              <span style={{ fontSize: '0.72rem', color: '#00F59B', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                <ShieldCheck size={13} /> 100% Principal Ring-Fence
              </span>
            </div>
            <h2 style={{ fontSize: '1.65rem', fontWeight: '800', color: '#F0F6FC', margin: 0, letterSpacing: '-0.02em' }}>
              Segregated Escrow Vault & Statutory Legal Protection
            </h2>
            <p style={{ color: '#8B949E', fontSize: '0.86rem', margin: '4px 0 0 0' }}>
              Tri-party escrow custody, milestone-gated capital disbursement, and legally enforceable syndicate protection.
            </p>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button 
              type="button"
              onClick={() => window.print()}
              className="btn-secondary-trading"
              style={{ padding: '8px 14px', fontSize: '0.80rem', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}
            >
              <Printer size={14} /> <span>Print Security Charter</span>
            </button>
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
      </div>

      {/* Hero Protection Card */}
      <div 
        className="trading-panel-card"
        style={{
          padding: '32px 28px',
          marginBottom: '26px',
          background: '#0D1117'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', marginBottom: '24px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(0, 245, 155, 0.15)', color: '#00F59B', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <ShieldCheck size={28} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.40rem', fontWeight: '800', color: '#F0F6FC', margin: '0 0 6px 0' }}>
              Institutional Escrow Custody Standard
            </h3>
            <p style={{ color: '#8B949E', fontSize: '0.88rem', margin: 0, lineHeight: '1.6', maxWidth: '820px' }}>
              All investor capital allocated to business ventures is deposited into a segregated depository account operated under Royal Bank of Investment custody. Funds are never transferred directly into personal accounts of business founders. Every disbursement requires verified commercial invoices, physical inventory inspection, and milestone sign-off.
            </p>
          </div>
        </div>

        {/* 4 Pillars Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', marginTop: '20px' }}>
          <div style={{ background: '#161B22', padding: '20px', borderRadius: '14px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
            <div style={{ color: '#00F59B', marginBottom: '10px' }}><Lock size={22} /></div>
            <h4 style={{ color: '#F0F6FC', fontSize: '0.96rem', margin: '0 0 6px 0', fontWeight: '700' }}>Segregated Escrow Vault</h4>
            <p style={{ color: '#8B949E', fontSize: '0.80rem', margin: 0, lineHeight: '1.5' }}>
              Capital is ring-fenced from company operating overhead. Funds can only be utilized for approved inventory line items.
            </p>
          </div>

          <div style={{ background: '#161B22', padding: '20px', borderRadius: '14px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
            <div style={{ color: '#F59E0B', marginBottom: '10px' }}><CheckCircle2 size={22} /></div>
            <h4 style={{ color: '#F0F6FC', fontSize: '0.96rem', margin: '0 0 6px 0', fontWeight: '700' }}>Milestone-Gated Tranches</h4>
            <p style={{ color: '#8B949E', fontSize: '0.80rem', margin: 0, lineHeight: '1.5' }}>
              Disbursements occur only as milestones are verified. Unspent capital remains locked until the previous stage is delivered.
            </p>
          </div>

          <div style={{ background: '#161B22', padding: '20px', borderRadius: '14px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
            <div style={{ color: '#38BDF8', marginBottom: '10px' }}><Award size={22} /></div>
            <h4 style={{ color: '#F0F6FC', fontSize: '0.96rem', margin: '0 0 6px 0', fontWeight: '700' }}>100% Refund Assurance</h4>
            <p style={{ color: '#8B949E', fontSize: '0.80rem', margin: 0, lineHeight: '1.5' }}>
              In the unlikely event a venture fails to meet operational milestones, 100% of unspent escrow balance is refunded directly to backers.
            </p>
          </div>

          <div style={{ background: '#161B22', padding: '20px', borderRadius: '14px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
            <div style={{ color: '#A855F7', marginBottom: '10px' }}><FileText size={22} /></div>
            <h4 style={{ color: '#F0F6FC', fontSize: '0.96rem', margin: '0 0 6px 0', fontWeight: '700' }}>Enforceable Syndicate Deed</h4>
            <p style={{ color: '#8B949E', fontSize: '0.80rem', margin: 0, lineHeight: '1.5' }}>
              Digital Certificates are accompanied by an immutable cryptographic hash and backed by legally binding Indian Contract Act syndicate agreements.
            </p>
          </div>
        </div>
      </div>

      {/* Official Depository Bank Clearing Rails */}
      <div 
        className="trading-panel-card"
        style={{
          padding: '24px 28px',
          marginBottom: '28px',
          background: '#0D1117'
        }}
      >
        <h4 style={{ fontSize: '1.10rem', fontWeight: '800', color: '#F0F6FC', margin: '0 0 14px 0' }}>
          Depository & Settlement Clearing Rails
        </h4>
        <div className="font-mono-numbers" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
          <div style={{ background: '#161B22', padding: '14px 16px', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
            <div style={{ fontSize: '0.70rem', color: '#8B949E', textTransform: 'uppercase' }}>Official UPI Gateway</div>
            <div style={{ fontSize: '0.96rem', fontWeight: '800', color: '#00F59B', marginTop: '4px' }}>8248651695-3@ybl</div>
          </div>
          <div style={{ background: '#161B22', padding: '14px 16px', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
            <div style={{ fontSize: '0.70rem', color: '#8B949E', textTransform: 'uppercase' }}>Depository Protocol</div>
            <div style={{ fontSize: '0.96rem', fontWeight: '800', color: '#F0F6FC', marginTop: '4px' }}>NPCI UPI 2.0 / IMPS</div>
          </div>
          <div style={{ background: '#161B22', padding: '14px 16px', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
            <div style={{ fontSize: '0.70rem', color: '#8B949E', textTransform: 'uppercase' }}>Verification Turnaround</div>
            <div style={{ fontSize: '0.96rem', fontWeight: '800', color: '#38BDF8', marginTop: '4px' }}>Instant to 4 Hours</div>
          </div>
          <div style={{ background: '#161B22', padding: '14px 16px', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
            <div style={{ fontSize: '0.70rem', color: '#8B949E', textTransform: 'uppercase' }}>Default History</div>
            <div style={{ fontSize: '0.96rem', fontWeight: '800', color: '#00F59B', marginTop: '4px' }}>0.00% (Zero Default)</div>
          </div>
        </div>
      </div>

      {/* Direct CTA */}
      <div style={{ textAlign: 'center', padding: '20px' }}>
        <button
          onClick={() => setActiveTab('ventures')}
          className="btn-order-cta"
          style={{ padding: '12px 28px', fontSize: '0.90rem' }}
        >
          <span>Explore 4 Verified Business Ventures</span>
          <ArrowRight size={16} />
        </button>
      </div>
    </motion.div>
  );
};
