import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Building2, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight, 
  DollarSign, 
  TrendingUp, 
  ShieldCheck, 
  Clock, 
  Layers,
  FileCheck,
  Hammer,
  FileText,
  Plus,
  Trash2,
  Calendar
} from 'lucide-react';

export const StartupPortal = () => {
  const { 
    submitBusinessListing, 
    pendingApplications, 
    formatMoney, 
    formatValuation,
    triggerConfetti,
    setActiveTab
  } = useApp();

  const [fundingCategory, setFundingCategory] = useState('PROJECT_ORDER'); // 'PROJECT_ORDER' (CarpenterBullet) vs 'EQUITY_SHARES'
  const [step, setStep] = useState(1);

  // Form State
  const [formData, setFormData] = useState({
    businessName: 'CarpenterBullet Architectural Woodcraft',
    ticker: 'CB-WOOD',
    founder: 'Alexander Rajasingh',
    sector: 'Furniture & Construction',
    customerContractValue: '450000', // ₹4,50,000
    capitalRequired: '200000',       // ₹2,00,000
    businessContribution: '100000',  // ₹1,00,000
    durationDays: '45',
    projectTitle: '20-Door Luxury Villa Interior & Teak Furniture Batch',
    description: 'Immediate working capital to procure seasoned Burma teak, premium brass hinges, and master carpenter guild labour against verified signed purchase order.',
    items: [
      { name: 'Seasoned Teak Timber (120 cu ft)', cost: 125000, vendor: 'Malabar Timber Mart' },
      { name: 'Master Carpenter Guild Labour', cost: 50000, vendor: 'In-House Crew' },
      { name: 'Hardware, Hinges & Fasteners', cost: 15000, vendor: 'Hettich Authorised' },
      { name: 'Logistics & Site Transport', cost: 10000, vendor: 'City Express Freight' }
    ]
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const addItemCost = () => {
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, { name: 'Additional Raw Material', cost: 10000, vendor: 'Verified Vendor' }]
    }));
  };

  const removeItemCost = (index) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }));
  };

  const handleItemChange = (index, field, value) => {
    setFormData(prev => {
      const updated = [...prev.items];
      updated[index][field] = field === 'cost' ? (parseFloat(value) || 0) : value;
      return { ...prev, items: updated };
    });
  };

  const totalCalculatedCost = formData.items.reduce((sum, item) => sum + item.cost, 0);
  const contractVal = parseFloat(formData.customerContractValue) || 0;
  const expectedSurplus = Math.max(0, contractVal - totalCalculatedCost);

  const handleSubmit = (e) => {
    e.preventDefault();

    submitBusinessListing({
      type: fundingCategory === 'PROJECT_ORDER' ? 'PROJECT_FUNDING' : 'EQUITY_SHARES',
      name: formData.businessName,
      ticker: formData.ticker,
      founder: formData.founder,
      sector: formData.sector,
      stage: fundingCategory === 'PROJECT_ORDER' ? 'Order Working Capital' : 'Series A',
      claimedValuation: parseFloat(formData.customerContractValue),
      targetRaise: parseFloat(formData.capitalRequired),
      annualRevenue: 4200000,
      growthRate: 140,
      ebitda: 22,
      description: formData.description,
      useOfFunds: formData.items.map(i => `${i.name}: ₹${i.cost.toLocaleString('en-IN')}`).join(', ')
    });

    setStep(3);
    triggerConfetti();
  };

  return (
    <div style={{ padding: '32px 0 60px 0' }}>
      <div className="container" style={{ maxWidth: '980px' }}>
        
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div className="badge badge-gold" style={{ marginBottom: '10px' }}>
            <Building2 size={13} />
            <span>ROYAL BUSINESS • CAPITAL ACCESS INFRASTRUCTURE</span>
          </div>
          <h1 style={{ fontSize: '2.4rem', color: '#fff', marginBottom: '8px' }}>
            Turn Verified Business Orders into <span className="gold-gradient-text">Immediate Capital</span>
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1rem', maxWidth: '700px', margin: '0 auto' }}>
            Are you a carpenter, restaurant, cloud kitchen, or manufacturer with a confirmed customer order? Connect your purchase order to eligible capital providers on Royal with 100% transparent milestone tracking.
          </p>
        </div>

        {/* Model Selector Tabs */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '32px' }}>
          <div 
            onClick={() => { setFundingCategory('PROJECT_ORDER'); setStep(1); }}
            style={{ 
              padding: '20px', 
              borderRadius: '14px', 
              cursor: 'pointer',
              background: fundingCategory === 'PROJECT_ORDER' ? 'rgba(245, 158, 11, 0.12)' : 'rgba(255, 255, 255, 0.03)',
              border: fundingCategory === 'PROJECT_ORDER' ? '2px solid #fbbf24' : '1px solid rgba(255, 255, 255, 0.08)',
              transition: 'all 0.2s ease'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <Hammer size={24} className="text-amber-400" />
              <h3 style={{ fontSize: '1.15rem', color: '#fff', margin: 0 }}>
                SME Order / Working Capital Financing
              </h3>
            </div>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: 0 }}>
              The <strong>CarpenterBullet</strong> model: You have a confirmed customer purchase order (e.g. ₹4.5L villa order), need ₹2L spot working capital for timber, hardware & labour.
            </p>
          </div>

          <div 
            onClick={() => { setFundingCategory('EQUITY_SHARES'); setStep(1); }}
            style={{ 
              padding: '20px', 
              borderRadius: '14px', 
              cursor: 'pointer',
              background: fundingCategory === 'EQUITY_SHARES' ? 'rgba(6, 182, 212, 0.12)' : 'rgba(255, 255, 255, 0.03)',
              border: fundingCategory === 'EQUITY_SHARES' ? '2px solid #06b6d4' : '1px solid rgba(255, 255, 255, 0.08)',
              transition: 'all 0.2s ease'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <TrendingUp size={24} className="text-cyan-400" />
              <h3 style={{ fontSize: '1.15rem', color: '#fff', margin: 0 }}>
                Valuation-Based Startup Equity
              </h3>
            </div>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: 0 }}>
              Issue digital fractional common shares based on your company's ARR, EBITDA multiple, and RBI Valuation & Due Diligence audit.
            </p>
          </div>
        </div>

        {/* Form Container */}
        <div className="glass-panel" style={{ padding: '36px', borderRadius: '20px' }}>
          
          {step === 1 && (
            <div>
              <h3 style={{ fontSize: '1.3rem', color: '#fff', marginBottom: '6px' }}>
                Step 1: Business Profile & Confirmed Order
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginBottom: '24px' }}>
                Provide registered business details and customer contract scope.
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '20px', marginBottom: '20px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '6px' }}>Business Trade Name</label>
                  <input 
                    type="text" 
                    name="businessName" 
                    value={formData.businessName} 
                    onChange={handleInputChange} 
                    className="form-input" 
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '6px' }}>Proposed Ticker Symbol</label>
                  <input 
                    type="text" 
                    name="ticker" 
                    value={formData.ticker} 
                    onChange={handleInputChange} 
                    className="form-input" 
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '6px' }}>Founder / Promoter Name</label>
                  <input 
                    type="text" 
                    name="founder" 
                    value={formData.founder} 
                    onChange={handleInputChange} 
                    className="form-input" 
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '6px' }}>Industry Category</label>
                  <select name="sector" value={formData.sector} onChange={handleInputChange} className="form-input">
                    <option value="Furniture & Construction">Furniture & Construction (CarpenterBullet)</option>
                    <option value="Food & Cloud Kitchen">Food & Cloud Kitchen (UnavuKadai)</option>
                    <option value="Manufacturing & Aerospace">Manufacturing & Machining</option>
                    <option value="Hardware & Retail">Hardware & Retail Supplies</option>
                    <option value="Artificial Intelligence">Artificial Intelligence Scale-Up</option>
                  </select>
                </div>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '6px' }}>Project Title</label>
                <input 
                  type="text" 
                  name="projectTitle" 
                  value={formData.projectTitle} 
                  onChange={handleInputChange} 
                  className="form-input" 
                />
              </div>

              <div style={{ marginBottom: '28px' }}>
                <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '6px' }}>Customer Contract Scope & Description</label>
                <textarea 
                  name="description" 
                  rows="3" 
                  value={formData.description} 
                  onChange={handleInputChange} 
                  className="form-input" 
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button onClick={() => setStep(2)} className="btn btn-primary">
                  <span>Next: Project Economics & Costs</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <h3 style={{ fontSize: '1.3rem', color: '#fff', marginBottom: '6px' }}>
                Step 2: Project Economics & Itemized Use of Funds
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginBottom: '24px' }}>
                Enter the exact cost of wood, materials, labour, and transport. Royal releases capital strictly against verified invoices.
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '24px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '6px' }}>Customer Contract Value (₹)</label>
                  <input 
                    type="number" 
                    name="customerContractValue" 
                    value={formData.customerContractValue} 
                    onChange={handleInputChange} 
                    className="form-input" 
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '6px' }}>Capital Required (₹)</label>
                  <input 
                    type="number" 
                    name="capitalRequired" 
                    value={formData.capitalRequired} 
                    onChange={handleInputChange} 
                    className="form-input" 
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '6px' }}>Business Skin-in-Game (₹)</label>
                  <input 
                    type="number" 
                    name="businessContribution" 
                    value={formData.businessContribution} 
                    onChange={handleInputChange} 
                    className="form-input" 
                  />
                </div>
              </div>

              {/* Itemized Cost Breakdown Builder */}
              <div style={{ marginBottom: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <label style={{ fontSize: '0.85rem', color: '#fff', fontWeight: '700' }}>Itemized Cost Breakdown (Materials + Labour):</label>
                  <button type="button" onClick={addItemCost} className="btn btn-secondary btn-sm" style={{ fontSize: '0.75rem', gap: '4px' }}>
                    <Plus size={13} />
                    <span>Add Expense Line</span>
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {formData.items.map((item, index) => (
                    <div key={index} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1.5fr auto', gap: '8px', alignItems: 'center' }}>
                      <input 
                        type="text" 
                        value={item.name} 
                        onChange={(e) => handleItemChange(index, 'name', e.target.value)} 
                        placeholder="e.g. Burma Teak Timber" 
                        className="form-input" 
                        style={{ padding: '8px 12px', fontSize: '0.85rem' }} 
                      />
                      <input 
                        type="number" 
                        value={item.cost} 
                        onChange={(e) => handleItemChange(index, 'cost', e.target.value)} 
                        placeholder="Cost (₹)" 
                        className="form-input" 
                        style={{ padding: '8px 12px', fontSize: '0.85rem' }} 
                      />
                      <input 
                        type="text" 
                        value={item.vendor} 
                        onChange={(e) => handleItemChange(index, 'vendor', e.target.value)} 
                        placeholder="Vendor / Supplier" 
                        className="form-input" 
                        style={{ padding: '8px 12px', fontSize: '0.85rem' }} 
                      />
                      <button 
                        type="button" 
                        onClick={() => removeItemCost(index)} 
                        className="btn btn-ghost btn-sm" 
                        style={{ color: '#fb7185', padding: '6px' }}
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Live Project Economics Preview */}
              <div style={{ 
                background: 'rgba(10, 16, 30, 0.9)', 
                border: '1px solid rgba(245, 158, 11, 0.3)', 
                borderRadius: '12px', 
                padding: '16px',
                marginBottom: '28px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '6px' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Customer Contract Revenue:</span>
                  <span style={{ color: '#fff', fontWeight: '700' }}>₹{contractVal.toLocaleString('en-IN')}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '6px' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Total Estimated Costs:</span>
                  <span style={{ color: '#fbbf24', fontWeight: '700' }}>₹{totalCalculatedCost.toLocaleString('en-IN')}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.05rem', fontWeight: '800', borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '8px' }}>
                  <span style={{ color: '#fff' }}>Expected Project Gross Surplus:</span>
                  <span style={{ color: '#10b981' }}>₹{expectedSurplus.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <button onClick={() => setStep(1)} className="btn btn-secondary">
                  Back
                </button>
                <button onClick={handleSubmit} className="btn btn-emerald btn-lg">
                  <ShieldCheck size={18} />
                  <span>Submit Order for RBI Verification</span>
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div style={{ textAlign: 'center', padding: '30px 10px' }}>
              <div style={{ 
                width: '68px', 
                height: '68px', 
                borderRadius: '50%', 
                background: 'rgba(16, 185, 129, 0.15)',
                color: '#10b981',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px auto',
                border: '2px solid #10b981'
              }}>
                <CheckCircle2 size={40} />
              </div>
              <h3 style={{ fontSize: '1.6rem', color: '#fff', marginBottom: '8px' }}>
                Project Funding Request Logged!
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', maxWidth: '580px', margin: '0 auto 24px auto' }}>
                Your order financing request for <strong>{formData.businessName}</strong> ({formData.ticker}) has been submitted to the RBI Compliance Desk. Upon verification of the customer PO and timber/material quotations, the deal will be listed for capital funding.
              </p>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                <button 
                  onClick={() => setActiveTab('admin')} 
                  className="btn btn-emerald"
                >
                  Switch to Admin Portal to Review & Approve
                </button>
                <button 
                  onClick={() => setStep(1)} 
                  className="btn btn-secondary"
                >
                  Create Another Project
                </button>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
