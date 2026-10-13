import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  X, 
  Award, 
  ShieldCheck, 
  Printer, 
  CheckCircle, 
  QrCode, 
  Download,
  Building2
} from 'lucide-react';

export const DigitalCertificateModal = () => {
  const { 
    isCertificateModalOpen, 
    setIsCertificateModalOpen, 
    selectedCertificate, 
    formatMoney, 
    formatValuation,
    user 
  } = useApp();

  if (!isCertificateModalOpen || !selectedCertificate) return null;

  const cert = selectedCertificate;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="modal-overlay" onClick={() => setIsCertificateModalOpen(false)}>
      <div 
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '800px', width: '100%', padding: '0' }}
      >
        {/* Top Control Bar */}
        <div style={{ 
          padding: '16px 24px', 
          borderBottom: '1px solid var(--border-color)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: '#0a0f1d'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Award size={18} className="text-amber-400" />
            <span style={{ fontSize: '0.9rem', fontWeight: '700', color: '#fff' }}>
              Digital Stock Certificate #{cert.certificateId}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button 
              onClick={handlePrint}
              className="btn btn-secondary btn-sm"
              style={{ fontSize: '0.8rem', gap: '6px' }}
            >
              <Printer size={14} />
              <span>Print / PDF</span>
            </button>
            <button 
              onClick={() => setIsCertificateModalOpen(false)}
              className="btn btn-ghost btn-sm"
              style={{ borderRadius: '50%', width: '30px', height: '30px', padding: 0 }}
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Certificate Canvas */}
        <div style={{ padding: '36px' }}>
          <div className="stock-certificate" style={{ padding: '40px 36px', borderRadius: '16px', position: 'relative' }}>
            
            {/* Watermark Crest */}
            <div style={{ 
              position: 'absolute', 
              top: '50%', 
              left: '50%', 
              transform: 'translate(-50%, -50%)', 
              opacity: '0.04', 
              pointerEvents: 'none',
              fontSize: '240px'
            }}>
              🏛️
            </div>

            {/* Header */}
            <div style={{ textAlign: 'center', marginBottom: '28px', position: 'relative', zIndex: 1 }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                <Building2 size={24} className="text-amber-400" />
                <h2 style={{ fontSize: '1.6rem', letterSpacing: '0.08em', margin: 0 }} className="gold-gradient-text">
                  ROYAL BANK OF INVESTMENT
                </h2>
              </div>
              <p style={{ fontSize: '0.75rem', letterSpacing: '0.2em', color: '#94a3b8', textTransform: 'uppercase', margin: 0 }}>
                Depository Trust & Digital Equity Custody Rails
              </p>
              <div style={{ 
                margin: '14px auto 0 auto', 
                width: '180px', 
                height: '1px', 
                background: 'linear-gradient(90deg, transparent, #d4af37, transparent)' 
              }}></div>
            </div>

            {/* Title */}
            <div style={{ textAlign: 'center', marginBottom: '32px' }}>
              <h3 style={{ 
                fontSize: '1.2rem', 
                color: '#fff', 
                textTransform: 'uppercase', 
                letterSpacing: '0.08em',
                marginBottom: '4px'
              }}>
                Official Fractional Stock Certificate
              </h3>
              <p style={{ fontSize: '0.8rem', color: '#d4af37', fontFamily: 'var(--font-mono)' }}>
                SERIAL NO: {cert.certificateId} • VALUATION-BACKED ASSET ID: {cert.companyId || cert.ticker}
              </p>
            </div>

            {/* Certification Body */}
            <div style={{ fontSize: '0.95rem', color: '#cbd5e1', lineHeight: '1.8', textAlign: 'center', marginBottom: '32px' }}>
              This document certifies that <strong style={{ color: '#fff', fontSize: '1.1rem' }}>{user.name}</strong> (Investor ID: <code style={{ color: '#fbbf24' }}>{user.investorId}</code>) is the registered beneficial owner of:
              
              <div style={{ 
                margin: '20px auto', 
                padding: '16px', 
                background: 'rgba(255, 255, 255, 0.04)', 
                border: '1px solid rgba(212, 175, 55, 0.3)',
                borderRadius: '12px',
                maxWidth: '480px'
              }}>
                <div style={{ fontSize: '1.8rem', fontWeight: '800', color: '#fbbf24', letterSpacing: '-0.02em' }}>
                  {cert.shares} Digital Common Shares
                </div>
                <div style={{ fontSize: '1.1rem', fontWeight: '700', color: '#fff', marginTop: '2px' }}>
                  {cert.companyName} ({cert.ticker})
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                  Valued at issuance: {formatMoney(cert.currentPrice || cert.pricePerShare)} per share • Total Equity Custody: {formatMoney(cert.currentValue || cert.totalAmount)}
                </div>
              </div>

              Recorded permanently in the Royal Bank of Investment Central Ledger under institutional depository compliance standards.
            </div>

            {/* Signatures & Seal */}
            <div style={{ 
              display: 'flex', 
              alignItems: 'flex-end', 
              justifyContent: 'space-between',
              paddingTop: '20px',
              borderTop: '1px solid rgba(212, 175, 55, 0.2)'
            }}>
              
              {/* Founder / Authority Signature */}
              <div style={{ textAlign: 'left' }}>
                <div style={{ 
                  fontFamily: 'serif', 
                  fontStyle: 'italic', 
                  fontSize: '1.35rem', 
                  color: '#fbbf24',
                  marginBottom: '2px' 
                }}>
                  Alexander Rajasingh
                </div>
                <div style={{ width: '160px', height: '1px', background: '#94a3b8', marginBottom: '4px' }}></div>
                <div style={{ fontSize: '0.75rem', fontWeight: '700', color: '#fff' }}>Alexander Rajasingh</div>
                <div style={{ fontSize: '0.68rem', color: '#94a3b8' }}>Chairman & Custody Director, RBI</div>
              </div>

              {/* Gold Verification Crest */}
              <div style={{ textAlign: 'center' }}>
                <div style={{ 
                  width: '68px', 
                  height: '68px', 
                  borderRadius: '50%', 
                  border: '2px double #d4af37',
                  background: 'radial-gradient(circle, rgba(212, 175, 55, 0.2) 0%, transparent 80%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 6px auto',
                  color: '#d4af37'
                }}>
                  <ShieldCheck size={36} />
                </div>
                <div style={{ fontSize: '0.65rem', color: '#d4af37', fontWeight: '700', letterSpacing: '0.06em' }}>
                  RBI SEAL OF TRUST
                </div>
              </div>

              {/* QR & Verification Hash */}
              <div style={{ textAlign: 'right' }}>
                <div style={{ 
                  fontFamily: 'var(--font-mono)', 
                  fontSize: '0.72rem', 
                  color: '#38bdf8',
                  marginBottom: '2px'
                }}>
                  HASH: 0x9f7a...3b42
                </div>
                <div style={{ width: '160px', height: '1px', background: '#94a3b8', marginBottom: '4px', marginLeft: 'auto' }}></div>
                <div style={{ fontSize: '0.75rem', fontWeight: '700', color: '#fff' }}>Automated Smart Custody</div>
                <div style={{ fontSize: '0.68rem', color: '#94a3b8' }}>Date: {new Date().toISOString().substring(0, 10)}</div>
              </div>

            </div>

          </div>
        </div>

      </div>
    </div>
  );
};
