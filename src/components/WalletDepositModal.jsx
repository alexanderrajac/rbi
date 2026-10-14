import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  X, 
  Wallet, 
  CreditCard, 
  Building, 
  CheckCircle2, 
  ArrowRight,
  ShieldCheck,
  DollarSign
} from 'lucide-react';

export const WalletDepositModal = () => {
  const { 
    isWalletModalOpen, 
    setIsWalletModalOpen, 
    depositWallet, 
    formatMoney, 
    walletBalance,
    currency 
  } = useApp();

  const [depositAmount, setDepositAmount] = useState('5000');
  const [method, setMethod] = useState('wire'); // 'wire', 'card', 'upi'
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isWalletModalOpen) return null;

  const handleDeposit = () => {
    const val = parseFloat(depositAmount);
    if (isNaN(val) || val <= 0) return;

    depositWallet(val);
    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      setIsWalletModalOpen(false);
    }, 1800);
  };

  return (
    <div className="modal-overlay" onClick={() => setIsWalletModalOpen(false)}>
      <div 
        className="modal-content" 
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '480px', width: '100%', padding: '24px' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Wallet size={20} className="text-amber-400" />
            <h3 style={{ fontSize: '1.25rem', color: '#fff', margin: 0 }}>Deposit Vault Funds</h3>
          </div>
          <button onClick={() => setIsWalletModalOpen(false)} className="btn btn-ghost btn-sm" style={{ padding: '4px' }}>
            <X size={18} />
          </button>
        </div>

        {isSuccess ? (
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
            <h4 style={{ color: '#fff', fontSize: '1.2rem', marginBottom: '6px' }}>Deposit Approved</h4>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
              {formatMoney(parseFloat(depositAmount))} has been credited to your RBI Central Vault account.
            </p>
          </div>
        ) : (
          <div>
            <div style={{ 
              background: 'rgba(255, 255, 255, 0.03)', 
              padding: '12px 16px', 
              borderRadius: '10px', 
              marginBottom: '18px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Current Vault Cash:</span>
              <span style={{ fontSize: '1.1rem', fontWeight: '800', color: '#fbbf24' }}>{formatMoney(walletBalance)}</span>
            </div>

            <div style={{ marginBottom: '18px' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
                Deposit Amount ({currency}):
              </label>
              <input 
                type="number"
                min="100"
                step="500"
                value={depositAmount}
                onChange={(e) => setDepositAmount(e.target.value)}
                className="form-input"
                style={{ fontSize: '1.2rem', fontWeight: '700' }}
              />

              <div style={{ display: 'flex', gap: '6px', marginTop: '8px' }}>
                {['1000', '5000', '10000', '25000'].map(amt => (
                  <button 
                    key={amt} 
                    type="button"
                    onClick={() => setDepositAmount(amt)}
                    className="btn btn-secondary btn-sm"
                    style={{ flex: 1, padding: '4px 0', fontSize: '0.75rem' }}
                  >
                    +${amt}
                  </button>
                ))}
              </div>
            </div>

            {/* Official Sovereign UPI Rail Only */}
            <div style={{ marginBottom: '20px', background: '#fffbeb', border: '1px solid #fde68a', borderRadius: '12px', padding: '14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '0.78rem', fontWeight: '700', color: '#92400e' }}>Official Escrow UPI ID:</span>
                <span style={{ fontSize: '0.68rem', background: '#10b981', color: '#fff', padding: '2px 6px', borderRadius: '4px', fontWeight: '700' }}>Active Rail</span>
              </div>
              <div style={{ background: '#ffffff', border: '1px solid #fde68a', borderRadius: '8px', padding: '8px', textAlign: 'center', fontFamily: 'monospace', fontWeight: '800', color: '#0f172a', fontSize: '0.95rem' }}>
                8248651695-3@ybl
              </div>
              <div style={{ textAlign: 'center', marginTop: '10px' }}>
                <img 
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(`upi://pay?pa=8248651695-3@ybl&pn=RoyalBankOfInvestment&am=${depositAmount}&cu=INR`)}`}
                  alt="UPI QR Code"
                  style={{ width: '130px', height: '130px', margin: '0 auto', display: 'block', borderRadius: '8px', border: '1px solid #e2e8f0', background: '#fff' }}
                />
                <div style={{ fontSize: '0.7rem', color: '#64748b', marginTop: '6px' }}>
                  Scan & pay with GPay, PhonePe, Paytm or BHIM UPI
                </div>
              </div>
            </div>

            <button 
              onClick={handleDeposit}
              className="btn btn-emerald"
              style={{ width: '100%', fontSize: '0.95rem' }}
            >
              <span>Instant Capital Injection</span>
              <ArrowRight size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
