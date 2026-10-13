import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  X, 
  ShoppingCart, 
  Trash2, 
  Plus, 
  Minus, 
  ShieldCheck, 
  CheckCircle2, 
  ArrowRight, 
  Wallet, 
  CreditCard,
  Building
} from 'lucide-react';

export const InvestmentCartModal = () => {
  const { 
    isCartOpen, 
    setIsCartOpen, 
    cart, 
    updateCartShares, 
    removeFromCart, 
    clearCart, 
    formatMoney, 
    platformFeeRate, 
    walletBalance, 
    executeBuyShares,
    setActiveTab
  } = useApp();

  const [paymentMethod, setPaymentMethod] = useState('wallet');
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);

  if (!isCartOpen) return null;

  const subtotal = cart.reduce((sum, item) => sum + (item.shares * item.sharePrice), 0);
  const fee = subtotal * platformFeeRate;
  const totalAmount = subtotal + fee;

  const handleCheckout = () => {
    if (cart.length === 0) return;
    setIsProcessing(true);

    setTimeout(() => {
      const success = executeBuyShares(cart, paymentMethod);
      setIsProcessing(false);
      if (success) {
        setOrderComplete(true);
        clearCart();
      }
    }, 800);
  };

  const handleClose = () => {
    setIsCartOpen(false);
    setOrderComplete(false);
  };

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div 
        className="modal-content" 
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '640px', width: '100%', padding: '0', position: 'relative' }}
      >
        {/* Header */}
        <div style={{ 
          padding: '20px 24px', 
          borderBottom: '1px solid var(--border-color)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'rgba(15, 23, 42, 0.95)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <ShoppingCart size={22} className="text-amber-400" />
            <h3 style={{ fontSize: '1.25rem', color: '#fff', margin: 0 }}>Investment Share Cart</h3>
            <span className="badge badge-gold" style={{ fontSize: '0.7rem' }}>
              {cart.length} {cart.length === 1 ? 'Startup' : 'Startups'}
            </span>
          </div>

          <button 
            onClick={handleClose}
            className="btn btn-ghost btn-sm"
            style={{ borderRadius: '50%', width: '32px', height: '32px', padding: 0 }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div style={{ padding: '24px' }}>
          
          {orderComplete ? (
            <div style={{ textAlign: 'center', padding: '30px 10px' }}>
              <div style={{ 
                width: '64px', 
                height: '64px', 
                borderRadius: '50%', 
                background: 'rgba(16, 185, 129, 0.15)',
                color: '#10b981',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px auto',
                border: '2px solid #10b981'
              }}>
                <CheckCircle2 size={36} />
              </div>
              <h3 style={{ fontSize: '1.4rem', color: '#fff', marginBottom: '8px' }}>Shares Successfully Issued!</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '24px' }}>
                Your order has been settled and fractional stock ownership records have been securely recorded on the RBI Depository Ledger.
              </p>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                <button 
                  onClick={() => {
                    handleClose();
                    setActiveTab('portfolio');
                  }}
                  className="btn btn-emerald"
                  style={{ fontSize: '0.9rem' }}
                >
                  Go to Portfolio & Certificates
                </button>
                <button 
                  onClick={handleClose}
                  className="btn btn-secondary"
                  style={{ fontSize: '0.9rem' }}
                >
                  Explore More Startups
                </button>
              </div>
            </div>
          ) : cart.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 10px' }}>
              <ShoppingCart size={48} style={{ color: 'var(--text-dim)', margin: '0 auto 16px auto' }} />
              <h4 style={{ fontSize: '1.2rem', color: '#fff', marginBottom: '6px' }}>Your Investment Cart is Empty</h4>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '20px' }}>
                Browse the marketplace to discover audited, high-growth startups and acquire digital shares.
              </p>
              <button 
                onClick={handleClose}
                className="btn btn-primary btn-sm"
              >
                Browse Share Marketplace
              </button>
            </div>
          ) : (
            <div>
              {/* Items List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
                {cart.map(item => (
                  <div 
                    key={item.startupId}
                    style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'space-between',
                      background: 'rgba(255, 255, 255, 0.03)',
                      border: '1px solid rgba(255, 255, 255, 0.06)',
                      borderRadius: '12px',
                      padding: '12px 16px'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span style={{ fontSize: '1.6rem' }}>{item.logo}</span>
                      <div>
                        <div style={{ fontWeight: '700', color: '#fff', fontSize: '0.95rem' }}>{item.name}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          <span className="font-mono text-amber-400">{item.ticker}</span> • {formatMoney(item.sharePrice)} / share
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      {/* Share counter */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <button 
                          onClick={() => updateCartShares(item.startupId, item.shares - 1)}
                          className="btn btn-secondary btn-sm"
                          style={{ width: '28px', height: '28px', padding: 0, borderRadius: '6px' }}
                        >
                          <Minus size={12} />
                        </button>
                        <span style={{ width: '32px', textAlign: 'center', fontWeight: '700', fontSize: '0.9rem' }}>
                          {item.shares}
                        </span>
                        <button 
                          onClick={() => updateCartShares(item.startupId, item.shares + 1)}
                          className="btn btn-secondary btn-sm"
                          style={{ width: '28px', height: '28px', padding: 0, borderRadius: '6px' }}
                        >
                          <Plus size={12} />
                        </button>
                      </div>

                      {/* Line Item Total */}
                      <div style={{ textAlign: 'right', minWidth: '80px' }}>
                        <div style={{ fontWeight: '700', color: '#fbbf24', fontSize: '1rem' }}>
                          {formatMoney(item.shares * item.sharePrice)}
                        </div>
                      </div>

                      {/* Remove Button */}
                      <button 
                        onClick={() => removeFromCart(item.startupId)}
                        className="btn btn-ghost btn-sm"
                        style={{ padding: '6px', color: '#f43f5e' }}
                        title="Remove from Cart"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Financial Breakdown */}
              <div style={{ 
                background: 'rgba(10, 16, 30, 0.9)', 
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '14px',
                padding: '16px',
                marginBottom: '20px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  <span>Gross Share Subtotal:</span>
                  <span style={{ color: '#fff', fontWeight: '600' }}>{formatMoney(subtotal)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  <span>RBI Settlement Brokerage (1.5%):</span>
                  <span style={{ color: '#fbbf24', fontWeight: '600' }}>{formatMoney(fee)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  <span>Digital Custodial Storage:</span>
                  <span style={{ color: '#10b981', fontWeight: '600' }}>Free ($0.00)</span>
                </div>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                  paddingTop: '10px',
                  fontSize: '1.15rem',
                  fontWeight: '800'
                }}>
                  <span style={{ color: '#fff' }}>Total Order:</span>
                  <span style={{ color: '#10b981' }}>{formatMoney(totalAmount)}</span>
                </div>
              </div>

              {/* Settlement Payment Method Selection */}
              <div style={{ marginBottom: '20px' }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)', marginBottom: '8px' }}>
                  Select Settlement Method:
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <button 
                    type="button"
                    onClick={() => setPaymentMethod('wallet')}
                    className={`btn btn-sm ${paymentMethod === 'wallet' ? 'btn-primary' : 'btn-secondary'}`}
                    style={{ fontSize: '0.82rem', padding: '10px', justifyContent: 'flex-start' }}
                  >
                    <Wallet size={16} />
                    <span>Vault ({formatMoney(walletBalance)})</span>
                  </button>
                  <button 
                    type="button"
                    onClick={() => setPaymentMethod('bank')}
                    className={`btn btn-sm ${paymentMethod === 'bank' ? 'btn-primary' : 'btn-secondary'}`}
                    style={{ fontSize: '0.82rem', padding: '10px', justifyContent: 'flex-start' }}
                  >
                    <CreditCard size={16} />
                    <span>Direct UPI / NetBanking</span>
                  </button>
                </div>
              </div>

              {/* Checkout Button */}
              <button 
                onClick={handleCheckout}
                disabled={isProcessing}
                className="btn btn-emerald btn-lg"
                style={{ width: '100%', fontSize: '1rem' }}
              >
                {isProcessing ? 'Executing Block Order...' : `Authorize & Purchase Shares (${formatMoney(totalAmount)})`}
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
