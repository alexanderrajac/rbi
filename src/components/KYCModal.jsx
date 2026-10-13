import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  X, 
  ShieldCheck, 
  BadgeCheck, 
  CheckCircle2, 
  Upload, 
  UserCheck,
  FileText
} from 'lucide-react';

export const KYCModal = () => {
  const { isKYCModalOpen, setIsKYCModalOpen, user, setUser } = useApp();
  const [submitted, setSubmitted] = useState(false);
  const [idType, setIdType] = useState('Passport / National ID');
  const [idNumber, setIdNumber] = useState('Z8910442B');

  if (!isKYCModalOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setUser(prev => ({ ...prev, kycStatus: 'verified' }));
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setIsKYCModalOpen(false);
    }, 1800);
  };

  return (
    <div className="modal-overlay" onClick={() => setIsKYCModalOpen(false)}>
      <div 
        className="modal-content" 
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '480px', width: '100%', padding: '24px' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <BadgeCheck size={22} className="text-emerald-400" />
            <h3 style={{ fontSize: '1.25rem', color: '#fff', margin: 0 }}>Investor KYC Verification</h3>
          </div>
          <button onClick={() => setIsKYCModalOpen(false)} className="btn btn-ghost btn-sm" style={{ padding: '4px' }}>
            <X size={18} />
          </button>
        </div>

        {submitted ? (
          <div style={{ textAlign: 'center', padding: '30px 10px' }}>
            <div style={{ 
              width: '54px', 
              height: '54px', 
              borderRadius: '50%', 
              background: 'rgba(16, 185, 129, 0.15)',
              color: '#10b981',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 14px auto',
              border: '2px solid #10b981'
            }}>
              <CheckCircle2 size={32} />
            </div>
            <h4 style={{ color: '#fff', fontSize: '1.2rem', marginBottom: '6px' }}>Identity Verified</h4>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
              Your accredited investor profile has been upgraded to Tier 1 Sovereign Status.
            </p>
          </div>
        ) : (
          <div>
            <div style={{ 
              padding: '12px 16px', 
              borderRadius: '10px', 
              background: user.kycStatus === 'verified' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)',
              border: user.kycStatus === 'verified' ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(245, 158, 11, 0.3)',
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Status</div>
                <div style={{ fontSize: '0.95rem', fontWeight: '700', color: user.kycStatus === 'verified' ? '#34d399' : '#fbbf24' }}>
                  {user.kycStatus === 'verified' ? 'KYC Tier 1 Accredited' : 'Pending Verification'}
                </div>
              </div>
              <ShieldCheck size={28} className={user.kycStatus === 'verified' ? 'text-emerald-400' : 'text-amber-400'} />
            </div>

            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Legal Name</label>
                <input type="text" value={user.name} disabled className="form-input" style={{ opacity: 0.8 }} />
              </div>

              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Document Type</label>
                <select value={idType} onChange={(e) => setIdType(e.target.value)} className="form-input">
                  <option value="Passport / National ID">Passport / National ID</option>
                  <option value="Aadhaar / PAN Card">Aadhaar / PAN Card (India)</option>
                  <option value="Driver License">Driver's License</option>
                </select>
              </div>

              <div style={{ marginBottom: '18px' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Document Identification Number</label>
                <input 
                  type="text" 
                  value={idNumber} 
                  onChange={(e) => setIdNumber(e.target.value)} 
                  className="form-input" 
                  required 
                />
              </div>

              <div style={{ 
                border: '1px dashed rgba(255, 255, 255, 0.2)', 
                borderRadius: '10px', 
                padding: '16px', 
                textAlign: 'center', 
                marginBottom: '20px',
                background: 'rgba(255, 255, 255, 0.02)'
              }}>
                <Upload size={20} style={{ color: 'var(--text-dim)', margin: '0 auto 6px auto' }} />
                <div style={{ fontSize: '0.82rem', color: '#fff', fontWeight: '600' }}>ID Document Upload Verified</div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>Govt-issued photo ID encrypted under AES-256</div>
              </div>

              <button type="submit" className="btn btn-emerald" style={{ width: '100%' }}>
                {user.kycStatus === 'verified' ? 'Re-Verify Credentials' : 'Submit & Complete KYC'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
