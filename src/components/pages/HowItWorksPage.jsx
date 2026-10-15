import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Building2, ShieldCheck, ChevronDown, ChevronUp, CheckCircle, Lock, ArrowRight } from 'lucide-react';

export const HowItWorksPage = ({ setActiveTab }) => {
  const [openFaq, setOpenFaq] = useState(0);

  const faqs = [
    {
      q: "How does milestone-locked escrow protect my capital?",
      a: "When you back a business via UPI ID 8248651695-3@ybl, your funds are deposited into segregated bank escrow. Money is NOT handed over in a lump sum. Instead, capital is released in strict tranches only when the founder submits verified invoices and photographic proof for each milestone. If a milestone fails, 100% of remaining funds are refunded to backers."
    },
    {
      q: "What is the minimum amount required to participate?",
      a: "You can participate with as little as ₹500. Each business venture has clear unit economics showing exactly what ₹500 buys—such as raw material units, packaging, or marketing inventory—along with the targeted sprint return."
    },
    {
      q: "How and when are returns distributed?",
      a: "Returns are distributed at the conclusion of the operating sprint timeline (e.g., 30 to 60 days depending on the project). When sales orders are fulfilled, revenue enters the escrow account, and principal plus targeted profit yield is disbursed directly to your registered bank account or UPI handle."
    },
    {
      q: "Do I receive proof of investment?",
      a: "Yes. Once the sovereign admin validates your UPI UTR number and payment screenshot against the bank depository rails, an official tamper-evident Digital Allocation Certificate is issued with unique serial number, project hash, and legal syndicate backing terms."
    }
  ];

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
          <span style={{ color: '#0F172A', fontWeight: '600' }}>How It Works</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <span className="badge badge-gold font-mono-numbers" style={{ fontSize: '0.62rem', padding: '2px 8px' }}>
                SYNDICATE GUIDE
              </span>
              <span style={{ fontSize: '0.72rem', color: '#64748B' }}>
                Democratized SME Order Financing & Escrow
              </span>
            </div>
            <h2 style={{ fontSize: '1.65rem', fontWeight: '800', color: '#0F172A', margin: 0, letterSpacing: '-0.02em' }}>
              Straightforward Business Capital Allocation Workflow
            </h2>
            <p style={{ color: '#64748B', fontSize: '0.86rem', margin: '4px 0 0 0' }}>
              Four simple steps to back verified local enterprises with complete escrow protection and clear yield terms.
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

      {/* 4 Steps Visual Cards */}
      <div 
        className="trading-panel-card"
        style={{
          padding: '32px 28px',
          marginBottom: '28px',
          background: '#FFFFFF',
          border: '1px solid #E2E8F0',
          boxShadow: '0 4px 20px -2px rgba(15, 23, 42, 0.05)'
        }}
      >
        <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 32px auto' }}>
          <span className="badge font-mono-numbers" style={{ fontSize: '0.68rem', padding: '3px 10px', background: '#FEF3C7', color: '#D97706', border: '1px solid #FDE68A', marginBottom: '8px', fontWeight: '700' }}>
            EXECUTION WORKFLOW
          </span>
          <h3 style={{ fontSize: '1.65rem', fontWeight: '800', color: '#0F172A', margin: '6px 0 8px 0', letterSpacing: '-0.02em' }}>
            From Due Diligence to Profit Settlement
          </h3>
          <p style={{ color: '#64748B', fontSize: '0.88rem', margin: 0 }}>
            Every step is ring-fenced to ensure zero default and complete financial transparency.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
          <div style={{ background: '#F8FAFC', padding: '22px', borderRadius: '14px', border: '1px solid #E2E8F0' }}>
            <div className="font-mono-numbers" style={{ width: '36px', height: '36px', borderRadius: '8px', background: '#FEF3C7', color: '#D97706', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900', marginBottom: '14px' }}>
              01
            </div>
            <h4 style={{ color: '#0F172A', fontSize: '1rem', margin: '0 0 8px 0', fontWeight: '700' }}>Choose Venture</h4>
            <p style={{ color: '#64748B', fontSize: '0.82rem', margin: 0, lineHeight: '1.6' }}>
              Select a verified enterprise across Cloud Kitchens, Marketplace Franchises, or Manufacturing based on unit economics, sprint days, and targeted term yields.
            </p>
          </div>

          <div style={{ background: '#F8FAFC', padding: '22px', borderRadius: '14px', border: '1px solid #E2E8F0' }}>
            <div className="font-mono-numbers" style={{ width: '36px', height: '36px', borderRadius: '8px', background: '#F0F9FF', color: '#0284C7', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900', marginBottom: '14px' }}>
              02
            </div>
            <h4 style={{ color: '#0F172A', fontSize: '1rem', margin: '0 0 8px 0', fontWeight: '700' }}>Inspect All Costs</h4>
            <p style={{ color: '#64748B', fontSize: '0.82rem', margin: 0, lineHeight: '1.6' }}>
              Inspect where every rupee is spent across materials, labour, packaging, delivery, and marketing. Full cost visibility with no hidden promoter fees.
            </p>
          </div>

          <div style={{ background: '#F8FAFC', padding: '22px', borderRadius: '14px', border: '1px solid #E2E8F0' }}>
            <div className="font-mono-numbers" style={{ width: '36px', height: '36px', borderRadius: '8px', background: '#ECFDF5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900', marginBottom: '14px' }}>
              03
            </div>
            <h4 style={{ color: '#0F172A', fontSize: '1rem', margin: '0 0 8px 0', fontWeight: '700' }}>Instant UPI Clearing</h4>
            <p style={{ color: '#64748B', fontSize: '0.82rem', margin: 0, lineHeight: '1.6' }}>
              Scan the dynamic QR or transfer directly to official UPI ID <strong style={{ color: '#059669' }}>8248651695-3@ybl</strong>. Submit your 12-digit UTR reference and receipt.
            </p>
          </div>

          <div style={{ background: '#F8FAFC', padding: '22px', borderRadius: '14px', border: '1px solid #E2E8F0' }}>
            <div className="font-mono-numbers" style={{ width: '36px', height: '36px', borderRadius: '8px', background: '#FAF5FF', color: '#9333EA', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900', marginBottom: '14px' }}>
              04
            </div>
            <h4 style={{ color: '#0F172A', fontSize: '1rem', margin: '0 0 8px 0', fontWeight: '700' }}>Escrow Audit & Cert</h4>
            <p style={{ color: '#64748B', fontSize: '0.82rem', margin: 0, lineHeight: '1.6' }}>
              Sovereign admin clears the payment against depository rails, issues your legal digital allocation certificate, and locks capital in milestone escrow.
            </p>
          </div>
        </div>
      </div>

      {/* Frequently Asked Questions */}
      <div 
        className="trading-panel-card"
        style={{
          padding: '28px',
          marginBottom: '28px',
          background: '#FFFFFF',
          border: '1px solid #E2E8F0',
          boxShadow: '0 4px 20px -2px rgba(15, 23, 42, 0.05)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
          <ShieldCheck size={20} className="text-emerald-600" />
          <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#0F172A', margin: 0 }}>
            Frequently Asked Questions
          </h3>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {faqs.map((faq, i) => (
            <div 
              key={i}
              style={{
                background: '#FFFFFF',
                borderRadius: '12px',
                border: '1px solid #E2E8F0',
                overflow: 'hidden'
              }}
            >
              <button
                type="button"
                onClick={() => setOpenFaq(openFaq === i ? -1 : i)}
                style={{
                  width: '100%',
                  padding: '16px 20px',
                  background: openFaq === i ? '#F8FAFC' : 'none',
                  border: 'none',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  color: '#0F172A',
                  fontSize: '0.92rem',
                  fontWeight: '700',
                  textAlign: 'left',
                  cursor: 'pointer'
                }}
              >
                <span>{faq.q}</span>
                {openFaq === i ? <ChevronUp size={18} color="#059669" /> : <ChevronDown size={18} color="#94A3B8" />}
              </button>
              {openFaq === i && (
                <div style={{ padding: '0 20px 16px 20px', color: '#64748B', fontSize: '0.84rem', lineHeight: '1.6', borderTop: '1px solid #E2E8F0', paddingTop: '12px', background: '#F8FAFC' }}>
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Direct CTA */}
      <div style={{ textAlign: 'center', padding: '24px' }}>
        <button
          onClick={() => setActiveTab('ventures')}
          className="btn-order-cta"
          style={{ padding: '12px 28px', fontSize: '0.90rem' }}
        >
          <span>Explore 4 Verified Ventures</span>
          <ArrowRight size={16} />
        </button>
      </div>
    </motion.div>
  );
};
