import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  HeartHandshake, 
  Wallet, 
  QrCode, 
  Building2, 
  CreditCard, 
  Copy, 
  Check, 
  Share2, 
  Download, 
  ExternalLink, 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  Users, 
  ArrowUpRight, 
  Plus, 
  SlidersHorizontal, 
  Search, 
  Printer, 
  X,
  MessageCircle,
  HelpCircle,
  ShieldCheck
} from 'lucide-react';

export const FundCollectionPortal = () => {
  const { 
    fundCampaign, 
    updateFundCampaign, 
    contributions, 
    recordContribution, 
    clearContributions,
    formatMoney, 
    currency 
  } = useApp();

  // Contribution Form State
  const [contributorName, setContributorName] = useState('');
  const [contributorEmail, setContributorEmail] = useState('');
  const [contributorPhone, setContributorPhone] = useState('');
  const [amount, setAmount] = useState('5000');
  const [paymentMethod, setPaymentMethod] = useState('UPI'); // 'UPI' | 'BANK' | 'CARD'
  const [note, setNote] = useState('');

  // UI Feedback States
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [copiedAcc, setCopiedAcc] = useState(false);
  const [copiedIfsc, setCopiedIfsc] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [activeReceipt, setActiveReceipt] = useState(null);

  // Edit Campaign State
  const [editForm, setEditForm] = useState({
    title: fundCampaign.title,
    targetAmount: fundCampaign.targetAmount,
    organizer: fundCampaign.organizer,
    upiId: fundCampaign.upiId,
    bankName: fundCampaign.bankName,
    accountNumber: fundCampaign.accountNumber,
    ifscCode: fundCampaign.ifscCode,
    accountHolder: fundCampaign.accountHolder,
    description: fundCampaign.description
  });

  // Calculate Fund Metrics
  const totalRaised = contributions.reduce((sum, c) => sum + (Number(c.amount) || 0), 0);
  const targetGoal = fundCampaign.targetAmount || 500000;
  const progressPercent = Math.min(Math.round((totalRaised / targetGoal) * 100), 100);
  const backersCount = contributions.length;
  const avgContribution = backersCount > 0 ? totalRaised / backersCount : 0;

  // Amount Presets
  const quickAmounts = [500, 1000, 2500, 5000, 10000, 25000, 50000];

  // Copy Helpers
  const copyToClipboard = (text, setSetter) => {
    navigator.clipboard.writeText(text);
    setSetter(true);
    setTimeout(() => setSetter(false), 2000);
  };

  // Submit Contribution
  const handleContribute = (e) => {
    e.preventDefault();
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      alert('Please enter a valid contribution amount.');
      return;
    }

    const newTxn = recordContribution({
      contributorName: contributorName || 'Anonymous Contributor',
      email: contributorEmail,
      phone: contributorPhone,
      amount: numAmount,
      paymentMethod,
      note: note || 'Fund Contribution'
    });

    if (newTxn) {
      setActiveReceipt(newTxn);
      // Reset inputs
      setContributorName('');
      setContributorEmail('');
      setContributorPhone('');
      setNote('');
    }
  };

  // Save Campaign Settings
  const handleSaveCampaign = (e) => {
    e.preventDefault();
    updateFundCampaign({
      ...editForm,
      targetAmount: parseFloat(editForm.targetAmount) || 500000
    });
    setIsEditModalOpen(false);
  };

  // Export CSV
  const exportToCSV = () => {
    if (contributions.length === 0) {
      alert('No contributions recorded yet to export.');
      return;
    }
    const headers = ['Transaction ID', 'Contributor Name', 'Amount (INR)', 'Payment Method', 'Date', 'Phone', 'Email', 'Note'];
    const rows = contributions.map(c => [
      c.id,
      `"${c.contributorName}"`,
      c.amount,
      c.paymentMethod,
      `"${c.date}"`,
      `"${c.phone || ''}"`,
      `"${c.email || ''}"`,
      `"${c.note || ''}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `fund_contributions_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // WhatsApp Share Link
  const currentUrl = typeof window !== 'undefined' ? window.location.href : 'http://localhost:3000';
  const whatsappShareText = encodeURIComponent(
    `🤝 Support our Fund Collection: ${fundCampaign.title}\n\nWe have raised ${formatMoney(totalRaised)} of ${formatMoney(targetGoal)}. You can contribute directly via UPI or Bank Transfer here:\n${currentUrl}\n\nUPI ID: ${fundCampaign.upiId}`
  );

  // Filtered Contributions
  const filteredContributions = contributions.filter(c => 
    c.contributorName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.note?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container" style={{ padding: '24px 20px', maxWidth: '1240px', margin: '0 auto' }}>
      
      {/* Top Banner / Campaign Overview */}
      <div 
        style={{
          background: 'linear-gradient(135deg, rgba(30, 27, 75, 0.6) 0%, rgba(15, 23, 42, 0.8) 100%)',
          borderRadius: '20px',
          padding: '30px',
          border: '1px solid rgba(245, 158, 11, 0.25)',
          boxShadow: '0 12px 35px -8px rgba(0, 0, 0, 0.5)',
          marginBottom: '28px',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
          <div style={{ maxWidth: '780px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
              <span className="badge badge-gold" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '4px 10px', fontSize: '0.75rem' }}>
                <span className="live-pulse-dot" style={{ width: '7px', height: '7px', background: '#10b981' }}></span>
                FUND COLLECTION LIVE & ACTIVE
              </span>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                Direct Escrow by {fundCampaign.organizer}
              </span>
            </div>

            <h1 style={{ fontSize: '2.1rem', fontWeight: '800', color: '#fff', margin: '0 0 10px 0', lineHeight: '1.2' }}>
              {fundCampaign.title}
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.98rem', margin: '0 0 20px 0', lineHeight: '1.5' }}>
              {fundCampaign.description}
            </p>
          </div>

          {/* Quick Actions */}
          <div style={{ display: 'flex', gap: '10px' }}>
            <button 
              onClick={() => {
                setEditForm({
                  title: fundCampaign.title,
                  targetAmount: fundCampaign.targetAmount,
                  organizer: fundCampaign.organizer,
                  upiId: fundCampaign.upiId,
                  bankName: fundCampaign.bankName,
                  accountNumber: fundCampaign.accountNumber,
                  ifscCode: fundCampaign.ifscCode,
                  accountHolder: fundCampaign.accountHolder,
                  description: fundCampaign.description
                });
                setIsEditModalOpen(true);
              }}
              className="btn btn-secondary btn-sm"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', borderRadius: '10px' }}
            >
              <SlidersHorizontal size={15} />
              <span>Configure Details</span>
            </button>

            <a 
              href={`https://api.whatsapp.com/send?text=${whatsappShareText}`}
              target="_blank"
              rel="noreferrer"
              className="btn btn-emerald btn-sm"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', borderRadius: '10px' }}
            >
              <MessageCircle size={15} />
              <span>Share on WhatsApp</span>
            </a>
          </div>
        </div>

        {/* Progress Bar & Key Numbers */}
        <div style={{ marginTop: '10px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '8px' }}>
            <div>
              <span style={{ fontSize: '2.2rem', fontWeight: '900', color: '#fbbf24', letterSpacing: '-0.02em' }}>
                {formatMoney(totalRaised)}
              </span>
              <span style={{ fontSize: '1rem', color: 'var(--text-muted)', marginLeft: '8px' }}>
                collected of <strong style={{ color: '#fff' }}>{formatMoney(targetGoal)}</strong> goal
              </span>
            </div>
            <div style={{ fontSize: '1.25rem', fontWeight: '800', color: '#10b981' }}>
              {progressPercent}%
            </div>
          </div>

          {/* Visual Progress Bar */}
          <div style={{ width: '100%', height: '14px', background: 'rgba(255, 255, 255, 0.08)', borderRadius: '10px', overflow: 'hidden' }}>
            <div 
              style={{ 
                width: `${progressPercent}%`, 
                height: '100%', 
                background: 'linear-gradient(90deg, #fbbf24 0%, #10b981 100%)',
                borderRadius: '10px',
                transition: 'width 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
                boxShadow: '0 0 16px rgba(16, 185, 129, 0.5)'
              }}
            />
          </div>

          {/* Quick Metrics Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '14px', marginTop: '20px' }}>
            <div style={{ background: 'rgba(255, 255, 255, 0.04)', padding: '12px 16px', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Total Backers</div>
              <div style={{ fontSize: '1.35rem', fontWeight: '800', color: '#fff', marginTop: '3px' }}>{backersCount} contributors</div>
            </div>
            <div style={{ background: 'rgba(255, 255, 255, 0.04)', padding: '12px 16px', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Avg Contribution</div>
              <div style={{ fontSize: '1.35rem', fontWeight: '800', color: '#fbbf24', marginTop: '3px' }}>{formatMoney(avgContribution)}</div>
            </div>
            <div style={{ background: 'rgba(255, 255, 255, 0.04)', padding: '12px 16px', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Active UPI ID</div>
              <div style={{ fontSize: '0.98rem', fontWeight: '700', color: '#38bdf8', marginTop: '6px', wordBreak: 'break-all' }}>{fundCampaign.upiId}</div>
            </div>
            <div style={{ background: 'rgba(255, 255, 255, 0.04)', padding: '12px 16px', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Status</div>
              <div style={{ fontSize: '1rem', fontWeight: '700', color: '#10b981', display: 'flex', alignItems: 'center', gap: '6px', marginTop: '6px' }}>
                <CheckCircle2 size={16} /> Instant Settlement
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Two-Column Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.4fr) minmax(0, 1fr)', gap: '26px', alignItems: 'start' }} className="fund-grid-layout">
        
        {/* Left Column: Direct Fund Contribution Form */}
        <div 
          style={{
            background: 'var(--card-bg, #0b1120)',
            borderRadius: '18px',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            padding: '28px',
            boxShadow: '0 8px 30px rgba(0, 0, 0, 0.4)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
            <div style={{ 
              width: '36px', 
              height: '36px', 
              borderRadius: '10px', 
              background: 'rgba(245, 158, 11, 0.15)', 
              color: '#fbbf24', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center' 
            }}>
              <HeartHandshake size={20} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.35rem', fontWeight: '700', color: '#fff', margin: 0 }}>
                Contribute & Send Funds
              </h2>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: 0 }}>
                Instant confirmation • Verified Central Ledger
              </p>
            </div>
          </div>

          <form onSubmit={handleContribute} style={{ marginTop: '22px' }}>
            
            {/* Amount Selection */}
            <div style={{ marginBottom: '22px' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#fff', marginBottom: '8px' }}>
                Select Contribution Amount ({currency}):
              </label>
              
              {/* Preset Chips */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '12px' }}>
                {quickAmounts.map(preset => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setAmount(preset.toString())}
                    style={{
                      padding: '7px 14px',
                      borderRadius: '8px',
                      fontSize: '0.85rem',
                      fontWeight: '700',
                      border: amount === preset.toString() ? '1px solid #fbbf24' : '1px solid rgba(255, 255, 255, 0.12)',
                      background: amount === preset.toString() ? 'rgba(245, 158, 11, 0.2)' : 'rgba(255, 255, 255, 0.03)',
                      color: amount === preset.toString() ? '#fbbf24' : '#e2e8f0',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    {formatMoney(preset)}
                  </button>
                ))}
              </div>

              {/* Custom Input */}
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#fbbf24', fontWeight: '800', fontSize: '1.1rem' }}>
                  ₹
                </span>
                <input 
                  type="number"
                  min="1"
                  step="any"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Or enter custom amount"
                  required
                  style={{
                    width: '100%',
                    padding: '12px 14px 12px 34px',
                    borderRadius: '10px',
                    border: '1px solid rgba(245, 158, 11, 0.4)',
                    background: 'rgba(0, 0, 0, 0.3)',
                    color: '#fff',
                    fontSize: '1.1rem',
                    fontWeight: '700',
                    outline: 'none'
                  }}
                />
              </div>
            </div>

            {/* Contributor Information */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px', marginBottom: '18px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '5px' }}>
                  Contributor Name:
                </label>
                <input 
                  type="text"
                  value={contributorName}
                  onChange={(e) => setContributorName(e.target.value)}
                  placeholder="e.g. Ramesh Kumar"
                  required
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    background: 'rgba(0, 0, 0, 0.25)',
                    color: '#fff',
                    fontSize: '0.9rem',
                    outline: 'none'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '5px' }}>
                  Phone Number (for SMS Receipt):
                </label>
                <input 
                  type="tel"
                  value={contributorPhone}
                  onChange={(e) => setContributorPhone(e.target.value)}
                  placeholder="e.g. +91 98400 12345"
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    background: 'rgba(0, 0, 0, 0.25)',
                    color: '#fff',
                    fontSize: '0.9rem',
                    outline: 'none'
                  }}
                />
              </div>
            </div>

            <div style={{ marginBottom: '18px' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '5px' }}>
                Email Address (Optional):
              </label>
              <input 
                type="email"
                value={contributorEmail}
                onChange={(e) => setContributorEmail(e.target.value)}
                placeholder="e.g. ramesh@example.com"
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: '8px',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  background: 'rgba(0, 0, 0, 0.25)',
                  color: '#fff',
                  fontSize: '0.9rem',
                  outline: 'none'
                }}
              />
            </div>

            {/* Payment Method Selector */}
            <div style={{ marginBottom: '22px' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#fff', marginBottom: '8px' }}>
                Select Payment Mode:
              </label>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                
                {/* UPI Option */}
                <div 
                  onClick={() => setPaymentMethod('UPI')}
                  style={{
                    padding: '12px 10px',
                    borderRadius: '10px',
                    border: paymentMethod === 'UPI' ? '2px solid #fbbf24' : '1px solid rgba(255, 255, 255, 0.1)',
                    background: paymentMethod === 'UPI' ? 'rgba(245, 158, 11, 0.1)' : 'rgba(255, 255, 255, 0.02)',
                    cursor: 'pointer',
                    textAlign: 'center',
                    transition: 'all 0.2s'
                  }}
                >
                  <QrCode size={22} style={{ margin: '0 auto 6px auto', color: paymentMethod === 'UPI' ? '#fbbf24' : 'var(--text-muted)' }} />
                  <div style={{ fontSize: '0.85rem', fontWeight: '700', color: paymentMethod === 'UPI' ? '#fff' : 'var(--text-muted)' }}>
                    UPI / QR Code
                  </div>
                  <div style={{ fontSize: '0.68rem', color: '#10b981', marginTop: '2px' }}>Instant</div>
                </div>

                {/* Bank Transfer Option */}
                <div 
                  onClick={() => setPaymentMethod('BANK')}
                  style={{
                    padding: '12px 10px',
                    borderRadius: '10px',
                    border: paymentMethod === 'BANK' ? '2px solid #fbbf24' : '1px solid rgba(255, 255, 255, 0.1)',
                    background: paymentMethod === 'BANK' ? 'rgba(245, 158, 11, 0.1)' : 'rgba(255, 255, 255, 0.02)',
                    cursor: 'pointer',
                    textAlign: 'center',
                    transition: 'all 0.2s'
                  }}
                >
                  <Building2 size={22} style={{ margin: '0 auto 6px auto', color: paymentMethod === 'BANK' ? '#fbbf24' : 'var(--text-muted)' }} />
                  <div style={{ fontSize: '0.85rem', fontWeight: '700', color: paymentMethod === 'BANK' ? '#fff' : 'var(--text-muted)' }}>
                    Bank IMPS/NEFT
                  </div>
                  <div style={{ fontSize: '0.68rem', color: '#38bdf8', marginTop: '2px' }}>Zero Fee</div>
                </div>

                {/* Card / Gateway Option */}
                <div 
                  onClick={() => setPaymentMethod('CARD')}
                  style={{
                    padding: '12px 10px',
                    borderRadius: '10px',
                    border: paymentMethod === 'CARD' ? '2px solid #fbbf24' : '1px solid rgba(255, 255, 255, 0.1)',
                    background: paymentMethod === 'CARD' ? 'rgba(245, 158, 11, 0.1)' : 'rgba(255, 255, 255, 0.02)',
                    cursor: 'pointer',
                    textAlign: 'center',
                    transition: 'all 0.2s'
                  }}
                >
                  <CreditCard size={22} style={{ margin: '0 auto 6px auto', color: paymentMethod === 'CARD' ? '#fbbf24' : 'var(--text-muted)' }} />
                  <div style={{ fontSize: '0.85rem', fontWeight: '700', color: paymentMethod === 'CARD' ? '#fff' : 'var(--text-muted)' }}>
                    Card / Banking
                  </div>
                  <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: '2px' }}>Secure</div>
                </div>

              </div>
            </div>

            {/* Dynamic Payment Details Display */}
            {paymentMethod === 'UPI' && (
              <div 
                style={{
                  background: 'rgba(245, 158, 11, 0.05)',
                  border: '1px solid rgba(245, 158, 11, 0.2)',
                  borderRadius: '12px',
                  padding: '16px',
                  marginBottom: '20px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Pay to UPI VPA:</span>
                  <button 
                    type="button"
                    onClick={() => copyToClipboard(fundCampaign.upiId, setCopiedUpi)}
                    className="btn btn-ghost btn-sm"
                    style={{ fontSize: '0.75rem', padding: '3px 8px', color: copiedUpi ? '#10b981' : '#fbbf24' }}
                  >
                    {copiedUpi ? <><Check size={13} /> Copied</> : <><Copy size={13} /> Copy UPI ID</>}
                  </button>
                </div>
                <div style={{ fontSize: '1.05rem', fontWeight: '800', color: '#fff', fontFamily: 'monospace' }}>
                  {fundCampaign.upiId}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '6px' }}>
                  Supports Google Pay, PhonePe, Paytm, BHIM & all Mobile Banking UPI apps.
                </div>
              </div>
            )}

            {paymentMethod === 'BANK' && (
              <div 
                style={{
                  background: 'rgba(56, 189, 248, 0.05)',
                  border: '1px solid rgba(56, 189, 248, 0.2)',
                  borderRadius: '12px',
                  padding: '16px',
                  marginBottom: '20px',
                  fontSize: '0.85rem'
                }}
              >
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>Bank Name:</div>
                    <div style={{ fontWeight: '700', color: '#fff' }}>{fundCampaign.bankName}</div>
                  </div>
                  <div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>Beneficiary Name:</div>
                    <div style={{ fontWeight: '700', color: '#fff' }}>{fundCampaign.accountHolder}</div>
                  </div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>A/C Number:</span>
                      <button 
                        type="button" 
                        onClick={() => copyToClipboard(fundCampaign.accountNumber, setCopiedAcc)}
                        style={{ background: 'none', border: 'none', color: copiedAcc ? '#10b981' : '#38bdf8', cursor: 'pointer', fontSize: '0.7rem' }}
                      >
                        {copiedAcc ? 'Copied' : 'Copy'}
                      </button>
                    </div>
                    <div style={{ fontWeight: '700', color: '#fff', fontFamily: 'monospace' }}>{fundCampaign.accountNumber}</div>
                  </div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>IFSC Code:</span>
                      <button 
                        type="button" 
                        onClick={() => copyToClipboard(fundCampaign.ifscCode, setCopiedIfsc)}
                        style={{ background: 'none', border: 'none', color: copiedIfsc ? '#10b981' : '#38bdf8', cursor: 'pointer', fontSize: '0.7rem' }}
                      >
                        {copiedIfsc ? 'Copied' : 'Copy'}
                      </button>
                    </div>
                    <div style={{ fontWeight: '700', color: '#fff', fontFamily: 'monospace' }}>{fundCampaign.ifscCode}</div>
                  </div>
                </div>
              </div>
            )}

            {/* Note / Purpose */}
            <div style={{ marginBottom: '22px' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '5px' }}>
                Note / Purpose of Contribution:
              </label>
              <input 
                type="text"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="e.g. Working capital support, Seed round contribution"
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: '8px',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  background: 'rgba(0, 0, 0, 0.25)',
                  color: '#fff',
                  fontSize: '0.9rem',
                  outline: 'none'
                }}
              />
            </div>

            {/* Submit Button */}
            <button 
              type="submit"
              className="btn btn-primary"
              style={{
                width: '100%',
                padding: '14px',
                fontSize: '1.05rem',
                fontWeight: '800',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: '0 6px 20px rgba(245, 158, 11, 0.4)'
              }}
            >
              <CheckCircle2 size={20} />
              <span>Record & Complete Contribution of {formatMoney(parseFloat(amount) || 0)}</span>
            </button>

            <div style={{ textAlign: 'center', marginTop: '12px' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                🔒 Zero commission • Instant ledger credit • Automated Digital Receipt
              </span>
            </div>

          </form>
        </div>

        {/* Right Column: Share & Direct QR Code Section */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Direct Scan QR Card */}
          <div 
            style={{
              background: 'var(--card-bg, #0b1120)',
              borderRadius: '18px',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              padding: '24px',
              textAlign: 'center',
              boxShadow: '0 8px 30px rgba(0, 0, 0, 0.4)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '4px' }}>
              <QrCode size={18} className="text-amber-400" />
              <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#fff', margin: 0 }}>
                Scan QR to Pay Instantly
              </h3>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '0 0 16px 0' }}>
              Open PhonePe, GPay, Paytm or BHIM on your mobile
            </p>

            {/* Stylized QR Code Box */}
            <div 
              style={{
                background: '#ffffff',
                padding: '16px',
                borderRadius: '16px',
                display: 'inline-block',
                boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
                marginBottom: '16px'
              }}
            >
              {/* Dynamic SVG QR Visual */}
              <svg width="170" height="170" viewBox="0 0 170 170" style={{ display: 'block' }}>
                <rect width="170" height="170" fill="#ffffff" />
                {/* QR Finder Corners */}
                <rect x="10" y="10" width="40" height="40" fill="#000000" rx="4" />
                <rect x="18" y="18" width="24" height="24" fill="#ffffff" rx="2" />
                <rect x="24" y="24" width="12" height="12" fill="#000000" rx="1" />

                <rect x="120" y="10" width="40" height="40" fill="#000000" rx="4" />
                <rect x="128" y="18" width="24" height="24" fill="#ffffff" rx="2" />
                <rect x="134" y="24" width="12" height="12" fill="#000000" rx="1" />

                <rect x="10" y="120" width="40" height="40" fill="#000000" rx="4" />
                <rect x="18" y="128" width="24" height="24" fill="#ffffff" rx="2" />
                <rect x="24" y="134" width="12" height="12" fill="#000000" rx="1" />

                {/* Simulated Pattern Blocks */}
                <rect x="60" y="15" width="8" height="8" fill="#000" />
                <rect x="75" y="15" width="12" height="8" fill="#000" />
                <rect x="95" y="15" width="8" height="8" fill="#000" />
                <rect x="60" y="30" width="16" height="8" fill="#000" />
                <rect x="85" y="30" width="8" height="16" fill="#000" />
                <rect x="100" y="30" width="12" height="8" fill="#000" />
                <rect x="60" y="45" width="8" height="8" fill="#000" />
                <rect x="75" y="45" width="16" height="8" fill="#000" />
                
                {/* Center Badge */}
                <rect x="70" y="70" width="30" height="30" fill="#d97706" rx="6" />
                <text x="85" y="89" fill="#ffffff" fontSize="13" fontWeight="900" textAnchor="middle" fontFamily="sans-serif">₹</text>

                <rect x="15" y="60" width="8" height="16" fill="#000" />
                <rect x="30" y="60" width="16" height="8" fill="#000" />
                <rect x="15" y="85" width="12" height="8" fill="#000" />
                <rect x="35" y="85" width="8" height="16" fill="#000" />

                <rect x="120" y="60" width="12" height="8" fill="#000" />
                <rect x="140" y="60" width="8" height="16" fill="#000" />
                <rect x="125" y="80" width="16" height="8" fill="#000" />
                <rect x="145" y="85" width="8" height="8" fill="#000" />

                <rect x="60" y="110" width="16" height="8" fill="#000" />
                <rect x="85" y="110" width="8" height="16" fill="#000" />
                <rect x="100" y="110" width="16" height="8" fill="#000" />
                <rect x="60" y="130" width="8" height="16" fill="#000" />
                <rect x="80" y="130" width="16" height="8" fill="#000" />
                <rect x="110" y="130" width="8" height="8" fill="#000" />
                <rect x="130" y="125" width="20" height="8" fill="#000" />
                <rect x="135" y="140" width="8" height="16" fill="#000" />
              </svg>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
              <span style={{ fontSize: '0.85rem', color: '#fbbf24', fontWeight: '700' }}>
                {fundCampaign.upiId}
              </span>
              <button 
                type="button"
                onClick={() => copyToClipboard(fundCampaign.upiId, setCopiedUpi)}
                className="btn btn-ghost btn-sm"
                style={{ padding: '2px 6px' }}
                title="Copy UPI ID"
              >
                {copiedUpi ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
              </button>
            </div>
          </div>

          {/* Share Campaign Link Card */}
          <div 
            style={{
              background: 'var(--card-bg, #0b1120)',
              borderRadius: '18px',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              padding: '24px',
              boxShadow: '0 8px 30px rgba(0, 0, 0, 0.4)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <Share2 size={18} className="text-sky-400" />
              <h3 style={{ fontSize: '1.05rem', fontWeight: '700', color: '#fff', margin: 0 }}>
                Share with People to Collect Funds
              </h3>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '0 0 14px 0' }}>
              Send this link to investors, friends or backers to receive payments directly.
            </p>

            {/* Copyable Link Input */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '14px' }}>
              <input 
                type="text" 
                readOnly 
                value={currentUrl} 
                style={{
                  flex: 1,
                  background: 'rgba(0, 0, 0, 0.3)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '8px',
                  padding: '8px 12px',
                  fontSize: '0.8rem',
                  color: 'var(--text-muted)'
                }}
              />
              <button 
                type="button"
                onClick={() => copyToClipboard(currentUrl, setCopiedLink)}
                className="btn btn-secondary btn-sm"
                style={{ borderRadius: '8px', minWidth: '85px' }}
              >
                {copiedLink ? <><Check size={14} /> Done</> : <><Copy size={14} /> Copy</>}
              </button>
            </div>

            {/* Quick Share Buttons */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <a 
                href={`https://api.whatsapp.com/send?text=${whatsappShareText}`}
                target="_blank"
                rel="noreferrer"
                className="btn btn-emerald btn-sm"
                style={{ justifyContent: 'center', borderRadius: '8px', fontSize: '0.82rem' }}
              >
                <MessageCircle size={15} /> WhatsApp
              </a>

              <a 
                href={`mailto:?subject=${encodeURIComponent(fundCampaign.title)}&body=${encodeURIComponent(`Hi,\n\nPlease find our fund collection link here:\n${currentUrl}\n\nTarget Goal: ${formatMoney(targetGoal)}\nUPI ID: ${fundCampaign.upiId}`)}`}
                className="btn btn-secondary btn-sm"
                style={{ justifyContent: 'center', borderRadius: '8px', fontSize: '0.82rem' }}
              >
                <ExternalLink size={15} /> Email Link
              </a>
            </div>
          </div>

          {/* Quick Backers Ticker */}
          <div 
            style={{
              background: 'var(--card-bg, #0b1120)',
              borderRadius: '18px',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              padding: '20px',
              boxShadow: '0 8px 30px rgba(0, 0, 0, 0.4)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Users size={16} className="text-emerald-400" />
                <h4 style={{ fontSize: '0.95rem', fontWeight: '700', color: '#fff', margin: 0 }}>
                  Recent Backers
                </h4>
              </div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                {backersCount} total
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {contributions.slice(0, 3).map((item) => (
                <div 
                  key={item.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '8px 10px',
                    borderRadius: '8px',
                    background: 'rgba(255, 255, 255, 0.02)',
                    border: '1px solid rgba(255, 255, 255, 0.04)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ 
                      width: '32px', 
                      height: '32px', 
                      borderRadius: '50%', 
                      background: 'rgba(245, 158, 11, 0.15)', 
                      color: '#fbbf24', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      fontWeight: '800',
                      fontSize: '0.82rem'
                    }}>
                      {item.contributorName.charAt(0)}
                    </div>
                    <div>
                      <div style={{ fontSize: '0.85rem', fontWeight: '700', color: '#fff' }}>{item.contributorName}</div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{item.date}</div>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '0.9rem', fontWeight: '800', color: '#10b981' }}>{formatMoney(item.amount)}</div>
                    <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>{item.paymentMethod}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* Bottom Section: Full Collected Funds Ledger & Contributor Records */}
      <div 
        style={{
          marginTop: '36px',
          background: 'var(--card-bg, #0b1120)',
          borderRadius: '18px',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          padding: '26px',
          boxShadow: '0 8px 30px rgba(0, 0, 0, 0.4)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px', marginBottom: '20px' }}>
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#fff', margin: '0 0 4px 0' }}>
              Collected Funds Ledger
            </h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: 0 }}>
              Audit-ready records of all received contributions.
            </p>
          </div>

          {/* Search & Export Tools */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            
            {/* Search Input */}
            <div style={{ position: 'relative' }}>
              <Search size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input 
                type="text"
                placeholder="Search contributor or ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  padding: '7px 12px 7px 30px',
                  borderRadius: '8px',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  background: 'rgba(0, 0, 0, 0.3)',
                  fontSize: '0.82rem',
                  color: '#fff',
                  outline: 'none',
                  minWidth: '220px'
                }}
              />
            </div>

            {/* Export CSV Button */}
            <button 
              type="button"
              onClick={exportToCSV}
              className="btn btn-secondary btn-sm"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', borderRadius: '8px' }}
            >
              <Download size={14} />
              <span>Export CSV</span>
            </button>

            {/* Reset / Clear Ledger Button */}
            <button 
              type="button"
              onClick={() => {
                if (window.confirm('Do you want to reset the contributions list to start from ₹0?')) {
                  clearContributions();
                }
              }}
              className="btn btn-ghost btn-sm"
              style={{ fontSize: '0.78rem', color: '#ef4444' }}
            >
              Reset List
            </button>
          </div>
        </div>

        {/* Ledger Table */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.08)', color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase' }}>
                <th style={{ padding: '12px 14px' }}>Txn ID</th>
                <th style={{ padding: '12px 14px' }}>Contributor Name</th>
                <th style={{ padding: '12px 14px' }}>Amount</th>
                <th style={{ padding: '12px 14px' }}>Payment Mode</th>
                <th style={{ padding: '12px 14px' }}>Date & Time</th>
                <th style={{ padding: '12px 14px' }}>Note</th>
                <th style={{ padding: '12px 14px' }}>Status</th>
                <th style={{ padding: '12px 14px', textAlign: 'right' }}>Receipt</th>
              </tr>
            </thead>
            <tbody>
              {filteredContributions.length === 0 ? (
                <tr>
                  <td colSpan="8" style={{ textAlign: 'center', padding: '36px', color: 'var(--text-muted)' }}>
                    No contributions match your search. Record a contribution above to see it here!
                  </td>
                </tr>
              ) : (
                filteredContributions.map((item) => (
                  <tr 
                    key={item.id}
                    style={{ 
                      borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
                      transition: 'background 0.15s ease'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.02)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                  >
                    <td style={{ padding: '12px 14px', fontFamily: 'monospace', fontSize: '0.8rem', color: '#94a3b8' }}>
                      {item.id}
                    </td>
                    <td style={{ padding: '12px 14px' }}>
                      <div style={{ fontWeight: '700', color: '#fff', fontSize: '0.88rem' }}>{item.contributorName}</div>
                      {item.phone && <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{item.phone}</div>}
                    </td>
                    <td style={{ padding: '12px 14px', fontWeight: '800', color: '#fbbf24', fontSize: '0.95rem' }}>
                      {formatMoney(item.amount)}
                    </td>
                    <td style={{ padding: '12px 14px' }}>
                      <span className="badge" style={{ 
                        fontSize: '0.72rem', 
                        background: item.paymentMethod === 'UPI' ? 'rgba(245, 158, 11, 0.15)' : 'rgba(56, 189, 248, 0.15)',
                        color: item.paymentMethod === 'UPI' ? '#fbbf24' : '#38bdf8',
                        padding: '3px 8px'
                      }}>
                        {item.paymentMethod}
                      </span>
                    </td>
                    <td style={{ padding: '12px 14px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      {item.date}
                    </td>
                    <td style={{ padding: '12px 14px', fontSize: '0.8rem', color: '#cbd5e1', maxWidth: '200px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {item.note || '—'}
                    </td>
                    <td style={{ padding: '12px 14px' }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', color: '#10b981', fontWeight: '700' }}>
                        <CheckCircle2 size={13} /> Completed
                      </span>
                    </td>
                    <td style={{ padding: '12px 14px', textAlign: 'right' }}>
                      <button 
                        type="button"
                        onClick={() => setActiveReceipt(item)}
                        className="btn btn-ghost btn-sm"
                        style={{ padding: '4px 8px', fontSize: '0.75rem', color: '#fbbf24' }}
                      >
                        View Receipt
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal 1: Digital Contribution Receipt Modal */}
      {activeReceipt && (
        <div className="modal-overlay" onClick={() => setActiveReceipt(null)}>
          <div 
            className="modal-content" 
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: '480px', width: '100%', padding: '28px', borderRadius: '20px' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ShieldCheck size={22} className="text-emerald-400" />
                <h3 style={{ fontSize: '1.2rem', color: '#fff', margin: 0, fontWeight: '800' }}>
                  Official Contribution Receipt
                </h3>
              </div>
              <button onClick={() => setActiveReceipt(null)} className="btn btn-ghost btn-sm" style={{ padding: '4px' }}>
                <X size={18} />
              </button>
            </div>

            {/* Receipt Body */}
            <div 
              style={{
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '14px',
                padding: '20px',
                marginBottom: '20px'
              }}
            >
              <div style={{ textAlign: 'center', paddingBottom: '16px', borderBottom: '1px dashed rgba(255, 255, 255, 0.15)', marginBottom: '16px' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Royal Bank of Investment (RBI) Escrow
                </div>
                <div style={{ fontSize: '1.8rem', fontWeight: '900', color: '#fbbf24', marginTop: '6px' }}>
                  {formatMoney(activeReceipt.amount)}
                </div>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', marginTop: '4px', fontSize: '0.8rem', color: '#10b981', fontWeight: '700' }}>
                  <CheckCircle2 size={14} /> Payment Verified & Credited
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.85rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Receipt Ref:</span>
                  <span style={{ fontWeight: '700', fontFamily: 'monospace', color: '#fff' }}>{activeReceipt.id}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Contributor:</span>
                  <span style={{ fontWeight: '700', color: '#fff' }}>{activeReceipt.contributorName}</span>
                </div>
                {activeReceipt.phone && (
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Phone:</span>
                    <span style={{ color: '#fff' }}>{activeReceipt.phone}</span>
                  </div>
                )}
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Payment Mode:</span>
                  <span style={{ fontWeight: '700', color: '#38bdf8' }}>{activeReceipt.paymentMethod}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Date & Time:</span>
                  <span style={{ color: '#fff' }}>{activeReceipt.date}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Campaign:</span>
                  <span style={{ color: '#fbbf24', fontWeight: '600' }}>{fundCampaign.title}</span>
                </div>
                {activeReceipt.note && (
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Note:</span>
                    <span style={{ color: '#cbd5e1' }}>{activeReceipt.note}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: '10px' }}>
              <button 
                type="button" 
                onClick={() => window.print()}
                className="btn btn-secondary btn-sm"
                style={{ flex: 1, justifyContent: 'center', borderRadius: '10px' }}
              >
                <Printer size={15} /> Print / Save PDF
              </button>
              <button 
                type="button" 
                onClick={() => setActiveReceipt(null)}
                className="btn btn-primary btn-sm"
                style={{ flex: 1, justifyContent: 'center', borderRadius: '10px' }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal 2: Edit Campaign Details Modal */}
      {isEditModalOpen && (
        <div className="modal-overlay" onClick={() => setIsEditModalOpen(false)}>
          <div 
            className="modal-content" 
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: '540px', width: '100%', padding: '28px', borderRadius: '20px' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <SlidersHorizontal size={20} className="text-amber-400" />
                <h3 style={{ fontSize: '1.25rem', color: '#fff', margin: 0, fontWeight: '800' }}>
                  Configure Fund Collection Details
                </h3>
              </div>
              <button onClick={() => setIsEditModalOpen(false)} className="btn btn-ghost btn-sm" style={{ padding: '4px' }}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveCampaign} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
                  Fund Campaign Title:
                </label>
                <input 
                  type="text" 
                  value={editForm.title} 
                  onChange={(e) => setEditForm(prev => ({ ...prev, title: e.target.value }))}
                  required 
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.3)', color: '#fff' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
                    Target Goal (₹):
                  </label>
                  <input 
                    type="number" 
                    value={editForm.targetAmount} 
                    onChange={(e) => setEditForm(prev => ({ ...prev, targetAmount: e.target.value }))}
                    required 
                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.3)', color: '#fff' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
                    Organizer / Fund Lead:
                  </label>
                  <input 
                    type="text" 
                    value={editForm.organizer} 
                    onChange={(e) => setEditForm(prev => ({ ...prev, organizer: e.target.value }))}
                    required 
                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.3)', color: '#fff' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
                  Receiving UPI ID (e.g. yourname@okaxis):
                </label>
                <input 
                  type="text" 
                  value={editForm.upiId} 
                  onChange={(e) => setEditForm(prev => ({ ...prev, upiId: e.target.value }))}
                  required 
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.3)', color: '#fff', fontFamily: 'monospace' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
                    Bank Account Number:
                  </label>
                  <input 
                    type="text" 
                    value={editForm.accountNumber} 
                    onChange={(e) => setEditForm(prev => ({ ...prev, accountNumber: e.target.value }))}
                    required 
                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.3)', color: '#fff', fontFamily: 'monospace' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
                    IFSC Code:
                  </label>
                  <input 
                    type="text" 
                    value={editForm.ifscCode} 
                    onChange={(e) => setEditForm(prev => ({ ...prev, ifscCode: e.target.value }))}
                    required 
                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.3)', color: '#fff', fontFamily: 'monospace' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
                  Bank Name & Branch:
                </label>
                <input 
                  type="text" 
                  value={editForm.bankName} 
                  onChange={(e) => setEditForm(prev => ({ ...prev, bankName: e.target.value }))}
                  required 
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.3)', color: '#fff' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
                  Description / Purpose:
                </label>
                <textarea 
                  rows={2} 
                  value={editForm.description} 
                  onChange={(e) => setEditForm(prev => ({ ...prev, description: e.target.value }))}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.3)', color: '#fff', fontSize: '0.85rem' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <button type="button" onClick={() => setIsEditModalOpen(false)} className="btn btn-secondary" style={{ flex: 1, borderRadius: '10px' }}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" style={{ flex: 1, borderRadius: '10px' }}>
                  Save & Apply Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
