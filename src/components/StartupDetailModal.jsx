import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  X, 
  ShieldCheck, 
  TrendingUp, 
  Sparkles, 
  ShoppingCart, 
  CheckCircle2, 
  Award, 
  FileText, 
  DollarSign, 
  BarChart2, 
  Zap, 
  AlertTriangle,
  Building,
  UserCheck
} from 'lucide-react';

export const StartupDetailModal = () => {
  const { 
    selectedStartup, 
    setSelectedStartup, 
    formatMoney, 
    formatValuation, 
    executeBuyShares, 
    addToCart, 
    walletBalance,
    platformFeeRate,
    currency
  } = useApp();

  const [sharesToBuy, setSharesToBuy] = useState(10);
  const [paymentMethod, setPaymentMethod] = useState('wallet'); // 'wallet' or 'bank'
  const [isProcessing, setIsProcessing] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);

  if (!selectedStartup) return null;

  const st = selectedStartup;
  const subtotal = sharesToBuy * st.sharePrice;
  const fee = subtotal * platformFeeRate;
  const totalAmount = subtotal + fee;

  // Approximate fractional ownership percentage
  const equityPercent = ((sharesToBuy / st.totalShares) * 100).toFixed(4);

  // 3-Year AI Projected Return
  const projectedSharePrice = st.sharePrice * 2.15;
  const projectedValuation3Y = sharesToBuy * projectedSharePrice;
  const projectedGain = projectedValuation3Y - totalAmount;
  const projectedGainPercent = ((projectedGain / totalAmount) * 100).toFixed(1);

  const handleDirectBuy = () => {
    setIsProcessing(true);
    setTimeout(() => {
      const success = executeBuyShares([{
        startupId: st.id,
        name: st.name,
        ticker: st.ticker,
        sharePrice: st.sharePrice,
        shares: sharesToBuy
      }], paymentMethod);

      setIsProcessing(false);
      if (success) {
        setSuccessMessage(`Successfully purchased ${sharesToBuy} digital shares of ${st.name}! Official stock certificate has been minted to your Investor Portfolio.`);
        setTimeout(() => {
          setSuccessMessage(null);
          setSelectedStartup(null);
        }, 2200);
      }
    }, 600);
  };

  return (
    <div className="modal-overlay" onClick={() => setSelectedStartup(null)}>
      <div 
        className="modal-content" 
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '920px', width: '100%', padding: '0', position: 'relative' }}
      >
        {/* Header Bar */}
        <div style={{ 
          padding: '24px 30px', 
          borderBottom: '1px solid var(--border-color)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'rgba(15, 23, 42, 0.95)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ 
              fontSize: '2.2rem', 
              width: '54px', 
              height: '54px', 
              borderRadius: '14px', 
              background: 'rgba(255, 255, 255, 0.08)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid rgba(255, 255, 255, 0.15)'
            }}>
              {st.logo}
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <h2 style={{ fontSize: '1.45rem', color: '#fff', margin: 0 }}>{st.name}</h2>
                <span className="badge badge-gold" style={{ fontSize: '0.75rem' }}>
                  <ShieldCheck size={13} />
                  <span>RBI AUDITED</span>
                </span>
                <span className="badge badge-cyan" style={{ fontSize: '0.75rem' }}>{st.ticker}</span>
              </div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: '4px 0 0 0' }}>
                {st.sector} • Round: {st.stage} • Founder: {st.founder}
              </p>
            </div>
          </div>

          <button 
            onClick={() => setSelectedStartup(null)}
            className="btn btn-ghost btn-sm"
            style={{ borderRadius: '50%', width: '36px', height: '36px', padding: 0 }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div style={{ padding: '28px 30px' }}>
          
          {successMessage ? (
            <div style={{ textAlign: 'center', padding: '40px 20px' }}>
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
              <h3 style={{ fontSize: '1.5rem', marginBottom: '10px', color: '#fff' }}>Investment Order Executed!</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '1rem', maxWidth: '540px', margin: '0 auto 20px auto' }}>
                {successMessage}
              </p>
              <div className="badge badge-emerald" style={{ padding: '8px 16px', fontSize: '0.85rem' }}>
                View Certificate in Investor Portfolio
              </div>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '28px' }}>
              
              {/* Left Column: Business & AI Valuation Analytics */}
              <div>
                {/* Pitch Summary */}
                <div style={{ marginBottom: '22px' }}>
                  <h4 style={{ fontSize: '1rem', color: '#fff', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <FileText size={16} className="text-amber-400" />
                    Executive Pitch Memorandum
                  </h4>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.6' }}>
                    {st.pitch}
                  </p>
                </div>

                {/* Interactive SVG Valuation Trend Chart */}
                <div style={{ 
                  background: 'rgba(10, 16, 30, 0.9)', 
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '14px',
                  padding: '18px',
                  marginBottom: '22px'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                    <div style={{ fontSize: '0.82rem', fontWeight: '700', color: '#fff', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <TrendingUp size={15} className="text-emerald-400" />
                      Valuation Trajectory & AI Projections
                    </div>
                    <span className="badge badge-emerald" style={{ fontSize: '0.7rem' }}>
                      {st.change24h} Last 24h
                    </span>
                  </div>

                  {/* SVG Chart Graphic */}
                  <div style={{ position: 'relative', width: '100%', height: '140px' }}>
                    <svg viewBox="0 0 400 130" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
                      <defs>
                        <linearGradient id="valGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" stopColor="#10b981" stopOpacity="0.4" />
                          <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
                        </linearGradient>
                      </defs>
                      {/* Grid lines */}
                      <line x1="0" y1="30" x2="400" y2="30" stroke="rgba(255,255,255,0.06)" strokeDasharray="3,3" />
                      <line x1="0" y1="70" x2="400" y2="70" stroke="rgba(255,255,255,0.06)" strokeDasharray="3,3" />
                      <line x1="0" y1="110" x2="400" y2="110" stroke="rgba(255,255,255,0.06)" strokeDasharray="3,3" />

                      {/* Area Fill */}
                      <polygon 
                        points="20,110 80,95 160,75 260,50 360,18 360,120 20,120" 
                        fill="url(#valGrad)" 
                      />

                      {/* Line */}
                      <polyline 
                        fill="none" 
                        stroke="#10b981" 
                        strokeWidth="3.5" 
                        points="20,110 80,95 160,75 260,50 360,18" 
                      />

                      {/* Projected segment dashed */}
                      <line x1="260" y1="50" x2="360" y2="18" stroke="#38bdf8" strokeWidth="2.5" strokeDasharray="4,4" />

                      {/* Data dots */}
                      {st.historicalValuation.map((pt, idx) => {
                        const x = 20 + idx * 85;
                        const y = 115 - (pt.val * 2.8);
                        return (
                          <g key={idx}>
                            <circle cx={x} cy={y} r="5" fill="#070b14" stroke={idx === 4 ? "#38bdf8" : "#10b981"} strokeWidth="3" />
                            <text x={x} y={y - 10} fill="#fff" fontSize="10" fontWeight="700" textAnchor="middle">
                              ${pt.val}M
                            </text>
                            <text x={x} y="125" fill="#64748b" fontSize="9" textAnchor="middle">
                              {pt.period}
                            </text>
                          </g>
                        );
                      })}
                    </svg>
                  </div>
                </div>

                {/* Valuation Engine & Financial Audit Breakdown Box */}
                {(() => {
                  const audit = st.valuationAudit || st.aiBreakdown || {};
                  return (
                    <div style={{ 
                      background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.08) 0%, rgba(13, 20, 36, 0.9) 100%)',
                      border: '1px solid rgba(6, 182, 212, 0.25)',
                      borderRadius: '14px',
                      padding: '18px'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <ShieldCheck size={17} className="text-cyan-400" />
                          <span style={{ fontSize: '0.85rem', fontWeight: '700', color: '#22d3ee' }}>
                            RBI Audited Valuation & Due Diligence Breakdown
                          </span>
                        </div>
                        <span className="badge badge-cyan" style={{ fontSize: '0.7rem' }}>
                          {audit.confidenceScore || '96.4%'} Confidence
                        </span>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '12px' }}>
                        <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '8px 12px', borderRadius: '8px' }}>
                          <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>DCF Model Valuation</div>
                          <div style={{ fontSize: '0.95rem', fontWeight: '700', color: '#fff' }}>{audit.dcfValuation || '₹1.8 Cr'}</div>
                        </div>
                        <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '8px 12px', borderRadius: '8px' }}>
                          <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>Revenue / EBITDA Multiple</div>
                          <div style={{ fontSize: '0.95rem', fontWeight: '700', color: '#fbbf24' }}>{audit.revenueMultiple || audit.ebitdaMultiple || '2.0x Multiple'}</div>
                        </div>
                      </div>

                      <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: '1.5', margin: 0 }}>
                        💡 <strong style={{ color: '#fff' }}>Audit Summary:</strong> {audit.summary}
                      </p>
                    </div>
                  );
                })()}
              </div>

              {/* Right Column: E-Commerce Share Checkout & Calculator */}
              <div style={{ 
                background: 'rgba(13, 20, 36, 0.75)', 
                border: '1px solid rgba(255, 255, 255, 0.1)', 
                borderRadius: '16px', 
                padding: '22px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}>
                <div>
                  <h4 style={{ fontSize: '1.1rem', color: '#fff', marginBottom: '4px' }}>
                    Purchase Digital Shares
                  </h4>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '18px' }}>
                    Issue fractional equity certificates via Royal Bank of Investment custody.
                  </p>

                  {/* Share Price Display */}
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'baseline',
                    padding: '12px',
                    background: 'rgba(245, 158, 11, 0.06)',
                    border: '1px solid rgba(245, 158, 11, 0.2)',
                    borderRadius: '10px',
                    marginBottom: '18px'
                  }}>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Share Price:</span>
                    <span style={{ fontSize: '1.35rem', fontWeight: '800', color: '#fbbf24' }}>
                      {formatMoney(st.sharePrice)}
                    </span>
                  </div>

                  {/* Shares Slider & Input */}
                  <div style={{ marginBottom: '18px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '8px' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Quantity to Acquire:</span>
                      <span style={{ fontWeight: '700', color: '#38bdf8' }}>{sharesToBuy} Shares</span>
                    </div>

                    <input 
                      type="range"
                      min="1"
                      max={Math.min(200, st.availableShares)}
                      value={sharesToBuy}
                      onChange={(e) => setSharesToBuy(parseInt(e.target.value) || 1)}
                      style={{ width: '100%', accentColor: '#fbbf24', cursor: 'pointer', marginBottom: '8px' }}
                    />

                    <div style={{ display: 'flex', gap: '6px' }}>
                      {[5, 10, 25, 50, 100].map(amt => (
                        <button 
                          key={amt} 
                          onClick={() => setSharesToBuy(amt)}
                          className={`btn btn-sm ${sharesToBuy === amt ? 'btn-primary' : 'btn-secondary'}`}
                          style={{ flex: 1, padding: '4px 0', fontSize: '0.75rem' }}
                        >
                          {amt}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Order Financial Breakdown */}
                  <div style={{ 
                    borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                    paddingTop: '14px',
                    marginBottom: '18px',
                    fontSize: '0.85rem'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', color: 'var(--text-muted)' }}>
                      <span>Equity Allocation:</span>
                      <span style={{ color: '#fff', fontWeight: '600' }}>{equityPercent}% of Company</span>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', color: 'var(--text-muted)' }}>
                      <span>Subtotal ({sharesToBuy} shares):</span>
                      <span style={{ color: '#fff', fontWeight: '600' }}>{formatMoney(subtotal)}</span>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', color: 'var(--text-muted)' }}>
                      <span title="Standard 1.5% RBI Platform Settlement Fee">RBI Platform Fee (1.5%):</span>
                      <span style={{ color: '#fbbf24', fontWeight: '600' }}>{formatMoney(fee)}</span>
                    </div>

                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      paddingTop: '10px',
                      borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                      fontSize: '1.05rem',
                      fontWeight: '800'
                    }}>
                      <span style={{ color: '#fff' }}>Total Order:</span>
                      <span style={{ color: '#10b981' }}>{formatMoney(totalAmount)}</span>
                    </div>
                  </div>

                  {/* Projected Gain Highlight */}
                  <div style={{ 
                    padding: '10px 14px', 
                    borderRadius: '10px', 
                    background: 'rgba(16, 185, 129, 0.08)',
                    border: '1px solid rgba(16, 185, 129, 0.25)',
                    marginBottom: '18px'
                  }}>
                    <div style={{ fontSize: '0.72rem', color: '#34d399', textTransform: 'uppercase', fontWeight: '700' }}>
                      3-Year AI Projected Value
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                      <span style={{ fontSize: '1.15rem', fontWeight: '800', color: '#10b981' }}>
                        {formatMoney(projectedValuation3Y)}
                      </span>
                      <span style={{ fontSize: '0.8rem', fontWeight: '700', color: '#34d399' }}>
                        +{projectedGainPercent}% ROI
                      </span>
                    </div>
                  </div>

                  {/* Payment Method Selector */}
                  <div style={{ marginBottom: '20px' }}>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginBottom: '6px' }}>Select Settlement Method:</div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                      <button 
                        type="button"
                        onClick={() => setPaymentMethod('wallet')}
                        className={`btn btn-sm ${paymentMethod === 'wallet' ? 'btn-primary' : 'btn-secondary'}`}
                        style={{ fontSize: '0.78rem', padding: '8px 4px' }}
                      >
                        Vault ({formatMoney(walletBalance)})
                      </button>
                      <button 
                        type="button"
                        onClick={() => setPaymentMethod('bank')}
                        className={`btn btn-sm ${paymentMethod === 'bank' ? 'btn-primary' : 'btn-secondary'}`}
                        style={{ fontSize: '0.78rem', padding: '8px 4px' }}
                      >
                        Direct Bank/UPI
                      </button>
                    </div>
                  </div>
                </div>

                {/* Final Actions */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <button 
                    onClick={handleDirectBuy}
                    disabled={isProcessing}
                    className="btn btn-emerald btn-lg"
                    style={{ width: '100%', fontSize: '0.95rem' }}
                  >
                    {isProcessing ? 'Minting Shares on RBI Ledger...' : `Invest & Authorize ${formatMoney(totalAmount)}`}
                  </button>

                  <button 
                    onClick={() => {
                      addToCart(st, sharesToBuy);
                      setSelectedStartup(null);
                    }}
                    className="btn btn-secondary"
                    style={{ width: '100%', fontSize: '0.85rem' }}
                  >
                    <ShoppingCart size={15} />
                    <span>Add to Investment Cart</span>
                  </button>
                </div>

              </div>

            </div>
          )}

        </div>
      </div>
    </div>
  );
};
