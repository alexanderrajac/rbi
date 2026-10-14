import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  INITIAL_STARTUPS, 
  INITIAL_PROJECT_DEALS,
  INITIAL_PROJECT_INVESTMENTS,
  INITIAL_TRANSACTIONS, 
  INITIAL_HOLDINGS, 
  INITIAL_PENDING_APPLICATIONS,
  INITIAL_LEDGER_ENTRIES
} from '../data/mockStartups';
import { 
  INITIAL_BUSINESS_PROJECTS, 
  calculateProjectFinancials 
} from '../data/businessProjectsData';
import confetti from 'canvas-confetti';
import { supabase, signInWithGoogle, signOut } from '../lib/supabase';
import { 
  ADMIN_EMAIL, 
  isSuperAdmin, 
  fetchBusinessProjects, 
  syncBusinessProjectToSupabase, 
  fetchProjectInvestments, 
  saveProjectInvestmentToSupabase, 
  updateInvestmentStatusInSupabase, 
  saveAuditLogToSupabase 
} from '../lib/supabaseData';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // Production Data Version Migration: clears old mock cache
  const DATA_VERSION = 'rbi_v5_sprint_admin';
  if (typeof window !== 'undefined') {
    const currentVer = localStorage.getItem('rbi_data_version');
    if (currentVer !== DATA_VERSION) {
      localStorage.removeItem('rbi_business_projects');
      localStorage.removeItem('rbi_proj_investments');
      localStorage.removeItem('rbi_startups');
      localStorage.removeItem('rbi_holdings');
      localStorage.removeItem('rbi_transactions');
      localStorage.removeItem('rbi_ledger');
      localStorage.removeItem('rbi_cart');
      localStorage.removeItem('rbi_project_deals');
      localStorage.setItem('rbi_data_version', DATA_VERSION);
    }
  }

  // Current active view: 'projects' | 'collect' | 'marketplace' | 'portfolio' | 'raise' | 'ai-oracle' | 'admin'
  const [activeTab, setActiveTab] = useState('projects');

  // Role: 'investor' | 'founder' | 'admin'
  const [currentRole, setCurrentRole] = useState(() => {
    return localStorage.getItem('rbi_role') || 'investor';
  });

  const [currency, setCurrency] = useState('INR'); // Default to INR based on project report & blueprint, toggleable to USD
  const USD_TO_INR = 83.5;

  // Admin authentication state
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(() => {
    return localStorage.getItem('rbi_admin_auth') === 'true';
  });

  // User details
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('rbi_user');
    return saved ? JSON.parse(saved) : {
      name: "Alexander Rajasingh",
      email: "alexander@rbi-group.org",
      phone: "+91 98402 11984",
      kycStatus: "verified", // 'verified' | 'pending' | 'unverified'
      memberTier: "RBI Sovereign Syndicate",
      investorId: "RBI-INV-99214"
    };
  });

  // Supabase Google Auth State
  const [supabaseUser, setSupabaseUser] = useState(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  // Sync Supabase Database and enforce Sovereign Admin
  useEffect(() => {
    // 1. Initial live data fetch from Supabase
    fetchBusinessProjects().then(fetchedProjects => {
      if (fetchedProjects && fetchedProjects.length > 0) {
        setBusinessProjects(fetchedProjects);
      }
    });

    fetchProjectInvestments().then(fetchedInvs => {
      if (fetchedInvs && fetchedInvs.length > 0) {
        setProjectInvestments(fetchedInvs);
      }
    });

    // 2. Check active auth session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setSupabaseUser(session.user);
        const isAdmin = isSuperAdmin(session.user);
        setIsAdminLoggedIn(isAdmin);
        if (isAdmin) {
          setCurrentRole('admin');
        }

        setUser(prev => ({
          ...prev,
          name: session.user.user_metadata?.full_name || session.user.user_metadata?.name || session.user.email?.split('@')[0] || prev.name,
          email: session.user.email || prev.email,
          avatarUrl: session.user.user_metadata?.avatar_url || session.user.user_metadata?.picture || null,
          authProvider: 'google',
          isAdmin
        }));
      } else {
        setIsAdminLoggedIn(false);
      }
      setIsAuthLoading(false);
    }).catch(err => {
      console.warn('Session check note:', err?.message || err);
      setIsAuthLoading(false);
    });

    // 3. Subscribe to OAuth redirects and auth events
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setSupabaseUser(session.user);
        const isAdmin = isSuperAdmin(session.user);
        setIsAdminLoggedIn(isAdmin);
        if (isAdmin) {
          setCurrentRole('admin');
        }

        setUser(prev => ({
          ...prev,
          name: session.user.user_metadata?.full_name || session.user.user_metadata?.name || session.user.email?.split('@')[0] || prev.name,
          email: session.user.email || prev.email,
          avatarUrl: session.user.user_metadata?.avatar_url || session.user.user_metadata?.picture || null,
          authProvider: 'google',
          isAdmin
        }));
      } else {
        setSupabaseUser(null);
        setIsAdminLoggedIn(false);
        setCurrentRole('investor');
      }
      setIsAuthLoading(false);
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  const loginWithGoogle = async () => {
    try {
      setIsAuthLoading(true);
      await signInWithGoogle();
    } catch (err) {
      console.error('Google Sign In failed:', err);
      setIsAuthLoading(false);
      throw err;
    }
  };

  const logoutUser = async () => {
    try {
      await signOut();
      setSupabaseUser(null);
    } catch (err) {
      console.error('Sign Out error:', err);
    }
  };

  // Wallet Balance (in INR by default)
  const [walletBalance, setWalletBalance] = useState(() => {
    const saved = localStorage.getItem('rbi_wallet');
    return saved !== null ? parseFloat(saved) : 250000.00; // ₹2,50,000
  });

  // Equity Startups Database
  const [startups, setStartups] = useState(() => {
    const saved = localStorage.getItem('rbi_startups');
    return saved ? JSON.parse(saved) : INITIAL_STARTUPS;
  });

  // Project-based Order Financing Deals (e.g. CarpenterBullet, UnavuKadai)
  const [projectDeals, setProjectDeals] = useState(() => {
    const saved = localStorage.getItem('rbi_project_deals');
    return saved ? JSON.parse(saved) : INITIAL_PROJECT_DEALS;
  });

  // User Portfolio Holdings (Equity Shares)
  const [holdings, setHoldings] = useState(() => {
    const saved = localStorage.getItem('rbi_holdings');
    return saved ? JSON.parse(saved) : INITIAL_HOLDINGS;
  });

  // User Portfolio SME Project Investments
  const [projectInvestments, setProjectInvestments] = useState(() => {
    const saved = localStorage.getItem('rbi_proj_investments');
    return saved ? JSON.parse(saved) : INITIAL_PROJECT_INVESTMENTS;
  });

  // Double-Entry Central Ledger
  const [ledgerEntries, setLedgerEntries] = useState(() => {
    const saved = localStorage.getItem('rbi_ledger');
    return saved ? JSON.parse(saved) : INITIAL_LEDGER_ENTRIES;
  });

  // System Transactions Ledger
  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem('rbi_transactions');
    return saved ? JSON.parse(saved) : INITIAL_TRANSACTIONS;
  });

  // Business applications waiting for Admin review
  const [pendingApplications, setPendingApplications] = useState(() => {
    const saved = localStorage.getItem('rbi_pending_apps');
    return saved ? JSON.parse(saved) : INITIAL_PENDING_APPLICATIONS;
  });

  // E-commerce Cart for shares
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('rbi_cart');
    return saved ? JSON.parse(saved) : [];
  });

  // Dedicated Fund Collection Campaign
  const [fundCampaign, setFundCampaign] = useState(() => {
    const saved = localStorage.getItem('rbi_fund_campaign');
    return saved ? JSON.parse(saved) : {
      title: "Royal Growth & Project Capital Fund",
      organizer: "Alexander Rajasingh",
      targetAmount: 500000,
      description: "Direct community and investor fund collection for immediate working capital, project inventory, and expansion operations.",
      upiId: "8248651695-3@ybl",
      bankName: "HDFC Bank / RBI Institutional Vault",
      accountNumber: "50200084729103",
      ifscCode: "HDFC0001234",
      accountHolder: "Royal Bank of Investment Escrow A/C",
      category: "Venture & Project Backing"
    };
  });

  // Real-time Recorded Contributions Ledger
  const [contributions, setContributions] = useState(() => {
    const saved = localStorage.getItem('rbi_contributions');
    return saved ? JSON.parse(saved) : [
      {
        id: "TXN-89421",
        contributorName: "Dr. Raman Krishnamurthy",
        email: "raman.k@chennai-med.org",
        phone: "+91 98401 22910",
        amount: 50000,
        paymentMethod: "UPI",
        date: "Today, 11:30 AM",
        timestamp: Date.now() - 3600000,
        note: "Direct allocation for project procurement",
        status: "COMPLETED"
      },
      {
        id: "TXN-89310",
        contributorName: "Priya Menon",
        email: "priya.m@techpartners.com",
        phone: "+91 97909 34182",
        amount: 25000,
        paymentMethod: "Bank Transfer",
        date: "Today, 10:15 AM",
        timestamp: Date.now() - 7200000,
        note: "Backing for working capital expansion",
        status: "COMPLETED"
      },
      {
        id: "TXN-89204",
        contributorName: "Vikramaditya Pillai",
        email: "vikram@vp-holdings.in",
        phone: "+91 94440 88219",
        amount: 75000,
        paymentMethod: "UPI",
        date: "Yesterday, 04:45 PM",
        timestamp: Date.now() - 86400000,
        note: "Anchor syndicate contribution",
        status: "COMPLETED"
      },
      {
        id: "TXN-89115",
        contributorName: "Ananya Sharma",
        email: "ananya.s@gmail.com",
        phone: "+91 98841 77312",
        amount: 10000,
        paymentMethod: "UPI",
        date: "Yesterday, 02:20 PM",
        timestamp: Date.now() - 95000000,
        note: "Community contribution",
        status: "COMPLETED"
      }
    ];
  });

  // 4 Business Projects State
  const [businessProjects, setBusinessProjects] = useState(() => {
    const saved = localStorage.getItem('rbi_business_projects');
    return saved ? JSON.parse(saved) : INITIAL_BUSINESS_PROJECTS;
  });

  // Project Change History Audit Log
  const [projectChangeHistory, setProjectChangeHistory] = useState(() => {
    const saved = localStorage.getItem('rbi_project_history');
    return saved ? JSON.parse(saved) : [
      {
        id: "hist-001",
        projectId: "proj-unavukadai",
        timestamp: "2026-10-12 10:30 AM",
        user: "Admin",
        action: "Budget Verification",
        note: "Adjusted listed expenses to verified total of ₹4,000 (clarified ₹4,400 discrepancy)"
      },
      {
        id: "hist-002",
        projectId: "proj-carpenterbullet",
        timestamp: "2026-10-12 11:15 AM",
        user: "Admin",
        action: "Revenue Policy Audit",
        note: "Flagged commission revenue policy: Record only ₹100/sale commission, not customer contract value"
      }
    ];
  });

  // Platform Commission rate (1.5% as specified in Revenue Model)
  const [platformFeeRate, setPlatformFeeRate] = useState(0.015);

  // Active modal controls
  const [selectedStartup, setSelectedStartup] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCertificateModalOpen, setIsCertificateModalOpen] = useState(false);
  const [selectedCertificate, setSelectedCertificate] = useState(null);
  const [isKYCModalOpen, setIsKYCModalOpen] = useState(false);
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);

  // Sync to LocalStorage
  useEffect(() => { localStorage.setItem('rbi_role', currentRole); }, [currentRole]);
  useEffect(() => { localStorage.setItem('rbi_admin_auth', isAdminLoggedIn ? 'true' : 'false'); }, [isAdminLoggedIn]);
  useEffect(() => { localStorage.setItem('rbi_user', JSON.stringify(user)); }, [user]);
  useEffect(() => { localStorage.setItem('rbi_wallet', walletBalance.toString()); }, [walletBalance]);
  useEffect(() => { localStorage.setItem('rbi_startups', JSON.stringify(startups)); }, [startups]);
  useEffect(() => { localStorage.setItem('rbi_project_deals', JSON.stringify(projectDeals)); }, [projectDeals]);
  useEffect(() => { localStorage.setItem('rbi_holdings', JSON.stringify(holdings)); }, [holdings]);
  useEffect(() => { localStorage.setItem('rbi_proj_investments', JSON.stringify(projectInvestments)); }, [projectInvestments]);
  useEffect(() => { localStorage.setItem('rbi_ledger', JSON.stringify(ledgerEntries)); }, [ledgerEntries]);
  useEffect(() => { localStorage.setItem('rbi_transactions', JSON.stringify(transactions)); }, [transactions]);
  useEffect(() => { localStorage.setItem('rbi_pending_apps', JSON.stringify(pendingApplications)); }, [pendingApplications]);
  useEffect(() => { localStorage.setItem('rbi_cart', JSON.stringify(cart)); }, [cart]);
  useEffect(() => { localStorage.setItem('rbi_fund_campaign', JSON.stringify(fundCampaign)); }, [fundCampaign]);
  useEffect(() => { localStorage.setItem('rbi_contributions', JSON.stringify(contributions)); }, [contributions]);
  useEffect(() => { localStorage.setItem('rbi_business_projects', JSON.stringify(businessProjects)); }, [businessProjects]);
  useEffect(() => { localStorage.setItem('rbi_project_history', JSON.stringify(projectChangeHistory)); }, [projectChangeHistory]);

  // Currency Formatter
  const formatMoney = (amountVal, isAlreadyINR = false) => {
    if (isNaN(amountVal)) return '₹0';
    let valInINR = amountVal;
    if (!isAlreadyINR && currency === 'USD') {
      // display in USD
      const usd = amountVal / USD_TO_INR;
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: 2
      }).format(usd);
    }
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(valInINR);
  };

  // Convert raw value to human readable string (e.g. ₹4.5L, ₹18.5 Cr or $18.5M)
  const formatValuation = (valINR) => {
    if (isNaN(valINR)) return '₹0';
    if (currency === 'USD') {
      const valUSD = valINR / USD_TO_INR;
      if (valUSD >= 1000000) return `$${(valUSD / 1000000).toFixed(1)}M`;
      if (valUSD >= 1000) return `$${(valUSD / 1000).toFixed(0)}K`;
      return `$${valUSD.toFixed(0)}`;
    }
    if (valINR >= 10000000) {
      return `₹${(valINR / 10000000).toFixed(1)} Cr`;
    }
    if (valINR >= 100000) {
      return `₹${(valINR / 100000).toFixed(1)} Lakh`;
    }
    return `₹${valINR.toLocaleString('en-IN')}`;
  };

  // Trigger celebration confetti
  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#D4AF37', '#10B981', '#06B6D4', '#FFFFFF']
      });
    } catch (e) {
      console.log('Confetti effect executed');
    }
  };

  // Cart Management for Shares
  const addToCart = (startup, sharesCount = 1) => {
    const existing = cart.find(item => item.startupId === startup.id);
    if (existing) {
      setCart(cart.map(item => 
        item.startupId === startup.id 
          ? { ...item, shares: item.shares + sharesCount }
          : item
      ));
    } else {
      setCart([...cart, {
        startupId: startup.id,
        name: startup.name,
        ticker: startup.ticker,
        logo: startup.logo,
        sharePrice: startup.sharePrice,
        shares: sharesCount,
        valuation: startup.valuation
      }]);
    }
    setIsCartOpen(true);
  };

  const updateCartShares = (startupId, newShares) => {
    if (newShares <= 0) {
      removeFromCart(startupId);
      return;
    }
    setCart(cart.map(item => 
      item.startupId === startupId ? { ...item, shares: newShares } : item
    ));
  };

  const removeFromCart = (startupId) => {
    setCart(cart.filter(item => item.startupId !== startupId));
  };

  const clearCart = () => setCart([]);

  // Direct Buy / Checkout execution for Equity Shares
  const executeBuyShares = (itemsToBuy, paymentMethod = 'wallet') => {
    const subtotal = itemsToBuy.reduce((sum, item) => sum + (item.shares * item.sharePrice), 0);
    const fee = subtotal * platformFeeRate;
    const totalDeduction = subtotal + fee;

    if (paymentMethod === 'wallet' && walletBalance < totalDeduction) {
      alert(`Insufficient Vault balance. Required: ${formatMoney(totalDeduction, true)}, Available: ${formatMoney(walletBalance, true)}. Please top up your wallet.`);
      return false;
    }

    if (paymentMethod === 'wallet') {
      setWalletBalance(prev => prev - totalDeduction);
    }

    // Update Startups inventory and raisedAmount
    setStartups(prevStartups => {
      return prevStartups.map(st => {
        const matchingItem = itemsToBuy.find(i => i.startupId === st.id);
        if (matchingItem) {
          const addedCost = matchingItem.shares * matchingItem.sharePrice;
          return {
            ...st,
            availableShares: Math.max(0, st.availableShares - matchingItem.shares),
            sharesSold: st.sharesSold + matchingItem.shares,
            raisedAmount: Math.min(st.targetRaise, st.raisedAmount + addedCost)
          };
        }
        return st;
      });
    });

    // Update Holdings & Transactions & Double Entry Ledger
    const newTxList = [];
    const newLedgerEntries = [];
    let updatedHoldings = [...holdings];

    itemsToBuy.forEach(item => {
      const certId = `RBI-CERT-${Math.floor(10000 + Math.random() * 90000)}`;
      const cost = item.shares * item.sharePrice;
      const itemFee = cost * platformFeeRate;

      // Add to transactions
      newTxList.push({
        id: `TX-${Math.floor(10000 + Math.random() * 90000)}`,
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
        type: 'BUY',
        category: 'EQUITY_SHARES',
        companyName: item.name,
        ticker: item.ticker,
        shares: item.shares,
        pricePerShare: item.sharePrice,
        totalAmount: cost,
        fee: itemFee,
        status: 'Completed',
        certificateId: certId
      });

      // Immutable Double-Entry Ledger
      newLedgerEntries.push({
        entryNo: `LEDG-${Math.floor(100000 + Math.random() * 900000)}`,
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
        debitAccount: `INVESTOR_VAULT (${user.name})`,
        creditAccount: `COMPANY_EQUITY_ESCROW (${item.name})`,
        amount: cost,
        reference: `SHARE-BUY / ${item.ticker} x ${item.shares}`,
        status: "RECONCILED"
      });

      newLedgerEntries.push({
        entryNo: `LEDG-${Math.floor(100000 + Math.random() * 900000)}`,
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
        debitAccount: `INVESTOR_VAULT (${user.name})`,
        creditAccount: `RBI_PLATFORM_FEE_REVENUE`,
        amount: itemFee,
        reference: `SETTLEMENT-FEE / ${certId}`,
        status: "RECONCILED"
      });

      // Update holdings
      const existingHoldingIdx = updatedHoldings.findIndex(h => h.companyId === item.startupId);
      if (existingHoldingIdx >= 0) {
        const existing = updatedHoldings[existingHoldingIdx];
        const newTotalShares = existing.shares + item.shares;
        const newTotalInvested = existing.investedAmount + cost;
        const newAvgPrice = newTotalInvested / newTotalShares;
        const currentVal = newTotalShares * item.sharePrice;
        const pnl = currentVal - newTotalInvested;

        updatedHoldings[existingHoldingIdx] = {
          ...existing,
          shares: newTotalShares,
          investedAmount: newTotalInvested,
          avgBuyPrice: newAvgPrice,
          currentValue: currentVal,
          pnlAmount: pnl,
          pnlPercentage: (pnl / newTotalInvested) * 100
        };
      } else {
        updatedHoldings.push({
          companyId: item.startupId,
          companyName: item.name,
          ticker: item.ticker,
          shares: item.shares,
          avgBuyPrice: item.sharePrice,
          currentPrice: item.sharePrice,
          investedAmount: cost,
          currentValue: cost,
          pnlAmount: 0,
          pnlPercentage: 0,
          certificateId: certId
        });
      }
    });

    setHoldings(updatedHoldings);
    setTransactions(prev => [...newTxList, ...prev]);
    setLedgerEntries(prev => [...newLedgerEntries, ...prev]);
    triggerConfetti();
    return true;
  };

  // Fund an SME Order Project (e.g. CarpenterBullet CB-2026-001)
  const fundProjectDeal = (projectId, fundAmount, paymentMethod = 'wallet') => {
    const project = projectDeals.find(p => p.id === projectId);
    if (!project) return false;

    const amount = parseFloat(fundAmount);
    if (isNaN(amount) || amount <= 0) return false;

    const platformFee = amount * 0.01; // 1% origination/tech fee
    const totalRequired = amount + platformFee;

    if (paymentMethod === 'wallet' && walletBalance < totalRequired) {
      alert(`Insufficient Vault balance. Required: ${formatMoney(totalRequired, true)}, Available: ${formatMoney(walletBalance, true)}. Please top up your wallet.`);
      return false;
    }

    if (paymentMethod === 'wallet') {
      setWalletBalance(prev => prev - totalRequired);
    }

    // Update project capitalRaised
    setProjectDeals(prev => prev.map(p => {
      if (p.id === projectId) {
        return {
          ...p,
          capitalRaised: Math.min(p.capitalRequired, p.capitalRaised + amount)
        };
      }
      return p;
    }));

    // Calculate projected payout
    const yieldNum = parseFloat(project.indicativeYield) || 14.5;
    const expectedReturn = Math.round(amount * (1 + (yieldNum / 100)));
    const contractId = `RBI-PROJ-${project.ticker}-${Math.floor(1000 + Math.random() * 9000)}`;

    // Add to project investments
    const newInvestment = {
      projectId: project.id,
      dealType: "PROJECT_FINANCING",
      businessName: project.businessName,
      ticker: project.ticker,
      projectName: project.title,
      investedAmount: amount,
      contractualReturnRate: `${yieldNum}%`,
      expectedMaturityAmount: expectedReturn,
      tenureDays: project.durationDays,
      daysRemaining: project.durationDays,
      status: "ACTIVE_PRODUCTION",
      currentMilestone: project.milestones.find(m => m.status === 'IN_PROGRESS')?.title || "Material Procurement",
      certificateId: contractId,
      lastMilestoneUpdate: `Participation funded via RBI Vault. Order backed by ₹${project.customerContractValue.toLocaleString('en-IN')} customer contract.`
    };

    setProjectInvestments(prev => [newInvestment, ...prev]);

    // Create transaction record
    const newTx = {
      id: `TX-${Math.floor(10000 + Math.random() * 90000)}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
      type: 'FUND_PROJECT',
      category: 'PROJECT_FINANCING',
      companyName: `${project.businessName} (${project.ticker})`,
      ticker: project.ticker,
      shares: 1,
      pricePerShare: amount,
      totalAmount: amount,
      fee: platformFee,
      status: 'Completed',
      certificateId: contractId
    };
    setTransactions(prev => [newTx, ...prev]);

    // Double Entry Ledger
    const newLedgers = [
      {
        entryNo: `LEDG-${Math.floor(100000 + Math.random() * 900000)}`,
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
        debitAccount: `CAPITAL_PROVIDER_VAULT (${user.name})`,
        creditAccount: `PROJECT_ESCROW (${project.businessName})`,
        amount: amount,
        reference: `${contractId} / CUSTOMER-ORDER-FUNDING`,
        status: "RECONCILED"
      },
      {
        entryNo: `LEDG-${Math.floor(100000 + Math.random() * 900000)}`,
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
        debitAccount: `CAPITAL_PROVIDER_VAULT (${user.name})`,
        creditAccount: `RBI_TECH_FEE_REVENUE`,
        amount: platformFee,
        reference: `TECH-FEE / ${contractId}`,
        status: "RECONCILED"
      }
    ];
    setLedgerEntries(prev => [...newLedgers, ...prev]);

    triggerConfetti();
    return true;
  };

  // Sell Shares function (Equity)
  const executeSellShares = (companyId, sharesToSell) => {
    const holding = holdings.find(h => h.companyId === companyId);
    if (!holding || holding.shares < sharesToSell) {
      alert("Invalid number of shares to liquidate.");
      return false;
    }

    const currentPrice = holding.currentPrice;
    const grossReturn = sharesToSell * currentPrice;
    const fee = grossReturn * platformFeeRate;
    const netReturn = grossReturn - fee;

    // Credit wallet
    setWalletBalance(prev => prev + netReturn);

    // Update holdings
    if (holding.shares === sharesToSell) {
      setHoldings(holdings.filter(h => h.companyId !== companyId));
    } else {
      const remainingShares = holding.shares - sharesToSell;
      const proportion = remainingShares / holding.shares;
      const newInvested = holding.investedAmount * proportion;
      const newVal = remainingShares * currentPrice;
      const newPnl = newVal - newInvested;

      setHoldings(holdings.map(h => {
        if (h.companyId === companyId) {
          return {
            ...h,
            shares: remainingShares,
            investedAmount: newInvested,
            currentValue: newVal,
            pnlAmount: newPnl,
            pnlPercentage: (newPnl / newInvested) * 100
          };
        }
        return h;
      }));
    }

    // Add transaction record
    const newTx = {
      id: `TX-${Math.floor(10000 + Math.random() * 90000)}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
      type: 'SELL',
      category: 'EQUITY_SHARES',
      companyName: holding.companyName,
      ticker: holding.ticker,
      shares: sharesToSell,
      pricePerShare: currentPrice,
      totalAmount: grossReturn,
      fee: fee,
      status: 'Completed',
      certificateId: `LIQ-${Math.floor(1000 + Math.random() * 9000)}`
    };

    setTransactions(prev => [newTx, ...prev]);
    return true;
  };

  // Deposit funds to wallet
  const depositWallet = (amount) => {
    const val = parseFloat(amount);
    if (isNaN(val) || val <= 0) return;
    setWalletBalance(prev => prev + val);
    
    const newTx = {
      id: `DEP-${Math.floor(10000 + Math.random() * 90000)}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
      type: 'DEPOSIT',
      category: 'VAULT_CASH',
      companyName: 'RBI Vault Capital Injection',
      ticker: 'VAULT',
      shares: 0,
      pricePerShare: 1,
      totalAmount: val,
      fee: 0,
      status: 'Completed',
      certificateId: 'DEP-SUCCESS'
    };
    setTransactions(prev => [newTx, ...prev]);
    triggerConfetti();
  };

  // Submit Business Listing Application (supports both Project Funding and Equity)
  const submitBusinessListing = (appData) => {
    const newApp = {
      id: `APP-${Math.floor(5000 + Math.random() * 5000)}`,
      type: appData.type || "PROJECT_FUNDING",
      name: appData.name,
      ticker: appData.ticker.toUpperCase(),
      founder: appData.founder,
      sector: appData.sector,
      stage: appData.stage,
      claimedValuation: parseFloat(appData.claimedValuation || appData.customerContractValue || 0),
      targetRaise: parseFloat(appData.targetRaise),
      annualRevenue: parseFloat(appData.annualRevenue || 0),
      growthRate: parseFloat(appData.growthRate || 0),
      ebitda: parseFloat(appData.ebitda || 0),
      status: "Pending Review",
      submittedAt: new Date().toISOString().substring(0, 10),
      description: appData.description,
      useOfFunds: appData.useOfFunds || "Raw materials and direct labour",
      patents: parseInt(appData.patents || 0),
      calculatedAiValuation: appData.calculatedAiValuation,
      calculatedSharePrice: appData.calculatedSharePrice
    };

    setPendingApplications(prev => [newApp, ...prev]);
    return newApp;
  };

  // Admin: Approve Business Application & List to Marketplace
  const approveApplication = (appId) => {
    const app = pendingApplications.find(a => a.id === appId);
    if (!app) return;

    if (app.type === 'PROJECT_FUNDING') {
      // Add to Project Deals (CarpenterBullet style)
      const newProject = {
        id: `proj-${app.ticker.toLowerCase()}-${Math.floor(100 + Math.random() * 900)}`,
        dealType: "PROJECT_FINANCING",
        businessName: app.name,
        ticker: app.ticker,
        category: app.sector,
        logo: "🔨",
        title: app.name + " Working Capital Project",
        tagline: app.description,
        customerContractValue: app.claimedValuation || 500000,
        capitalRequired: app.targetRaise || 200000,
        businessContribution: Math.round((app.targetRaise || 200000) * 0.4),
        capitalRaised: 0,
        durationDays: 45,
        minContribution: 5000,
        expectedSurplus: Math.round((app.targetRaise || 200000) * 0.6),
        indicativeYield: "14.0% Contractual Term Yield",
        riskScorecard: {
          customerConcentration: "Medium",
          documentation: "Verified Order & Invoices",
          businessHistory: "Established Guild",
          cashFlowVisibility: "High",
          defaultHistory: "Zero Defaults",
          promoterSkinInGame: "Verified Contribution"
        },
        costBreakdown: [
          { item: "Raw Materials / Direct Stock", cost: Math.round(app.targetRaise * 0.65), vendor: "Verified Supplier", verified: true },
          { item: "Labour & Production", cost: Math.round(app.targetRaise * 0.25), vendor: "Guild Team", verified: true },
          { item: "Logistics & Transport", cost: Math.round(app.targetRaise * 0.1), vendor: "Direct Logistics", verified: true }
        ],
        milestones: [
          { id: "M1", title: "PO & Quotation Audit", status: "COMPLETED", date: new Date().toISOString().substring(0, 10), proof: "AUDIT-CLEARED.pdf" },
          { id: "M2", title: "Material Procurement", status: "IN_PROGRESS", date: "Next 7 Days", proof: "Vendor Invoices" },
          { id: "M3", title: "Production & Delivery", status: "PENDING", date: "Next 30 Days", proof: "Delivery Memo" },
          { id: "M4", title: "Customer Settlement", status: "PENDING", date: "Next 45 Days", proof: "Escrow Release" }
        ],
        customerInfo: {
          clientType: "Commercial Enterprise Client",
          location: "Regional Business District",
          advancePaid: Math.round(app.targetRaise * 0.3),
          balanceDueOnDelivery: app.claimedValuation - Math.round(app.targetRaise * 0.3)
        },
        rbiAuditStatus: "RBI_ORDER_VERIFIED",
        verifiedOrderUrl: "DOC-PO-VERIFIED.pdf"
      };

      setProjectDeals(prev => [newProject, ...prev]);
    } else {
      // Add to Equity Startups
      const valuation = app.calculatedAiValuation || app.claimedValuation;
      const sharePrice = app.calculatedSharePrice || Math.round(valuation / 400000);
      const totalShares = Math.round(valuation / sharePrice);
      const availableShares = Math.round(app.targetRaise / sharePrice);

      const newStartup = {
        id: `rbi-${Math.floor(100 + Math.random() * 900)}`,
        dealType: "EQUITY_SHARES",
        name: app.name,
        ticker: app.ticker,
        sector: app.sector,
        stage: app.stage,
        badge: "RBI Verified",
        tagline: app.description,
        logo: "🚀",
        valuation: valuation,
        sharePrice: sharePrice,
        totalShares: totalShares,
        availableShares: availableShares,
        sharesSold: 0,
        targetRaise: app.targetRaise,
        raisedAmount: 0,
        minInvestment: Math.round(sharePrice * 2),
        dueDiligenceScore: Math.min(98, 85 + Math.floor(Math.random() * 12)),
        riskGrade: app.growthRate > 100 ? "Low-Medium" : "Medium",
        change24h: "+0.0%",
        isTrending: true,
        historicalValuation: [
          { period: "Launch", val: Number((valuation / 1000000).toFixed(1)) },
          { period: "Target", val: Number(((valuation * 1.4) / 1000000).toFixed(1)) }
        ],
        financials: {
          arr: `₹${(app.annualRevenue / 100000).toFixed(1)}L`,
          mrr: `₹${Math.round(app.annualRevenue / 12000)}K`,
          growthYoY: `+${app.growthRate}%`,
          ebitdaMargin: `+${app.ebitda}%`,
          burnRate: "Cashflow Positive",
          runway: "Operating",
          patents: app.patents || 2
        },
        valuationAudit: {
          dcfValuation: `₹${(valuation * 0.95 / 100000).toFixed(1)}L`,
          revenueMultiple: `${(valuation / Math.max(1, app.annualRevenue)).toFixed(1)}x Multiple`,
          ebitdaMultiple: "5.0x EBITDA Multiple",
          moatRating: "RBI Audited Tier 1",
          confidenceScore: "95.0%",
          summary: `Verified business performance with ${app.growthRate}% YoY expansion. Formal financial audit by Royal Bank of Investment.`
        },
        pitch: app.description,
        founder: app.founder,
        rbiApproved: true
      };

      setStartups(prev => [newStartup, ...prev]);
    }

    setPendingApplications(prev => prev.map(a => a.id === appId ? { ...a, status: "Approved" } : a));
    triggerConfetti();
  };

  // Admin: Advance Project Milestone & Release Next Tranche
  const advanceProjectMilestone = (projectId, milestoneId) => {
    setProjectDeals(prevDeals => prevDeals.map(proj => {
      if (proj.id === projectId) {
        let found = false;
        const updatedMilestones = proj.milestones.map(m => {
          if (m.id === milestoneId) {
            found = true;
            return { ...m, status: "COMPLETED", date: new Date().toISOString().substring(0, 10) };
          }
          if (found && m.status === 'PENDING') {
            found = false;
            return { ...m, status: "IN_PROGRESS" };
          }
          return m;
        });
        return { ...proj, milestones: updatedMilestones };
      }
      return proj;
    }));
  };

  // Admin: Reject Business Application
  const rejectApplication = (appId) => {
    setPendingApplications(prev => prev.map(a => a.id === appId ? { ...a, status: "Rejected" } : a));
  };

  // Admin Login Verification - Strictly rajacofficial369@gmail.com
  const adminLogin = (credential, email) => {
    const activeEmail = (email || supabaseUser?.email || user?.email || '').toLowerCase().trim();
    if (activeEmail === ADMIN_EMAIL.toLowerCase()) {
      setIsAdminLoggedIn(true);
      setCurrentRole('admin');
      setActiveTab('admin');
      return true;
    }
    return false;
  };

  const adminLogout = () => {
    setIsAdminLoggedIn(false);
    setCurrentRole('investor');
    setActiveTab('projects');
  };

  // Fund Collection Engine
  const recordContribution = ({ contributorName, email, phone, amount, paymentMethod, note }) => {
    const val = parseFloat(amount);
    if (isNaN(val) || val <= 0) return null;

    const newTxn = {
      id: `TXN-${Math.floor(100000 + Math.random() * 900000)}`,
      contributorName: contributorName?.trim() || 'Supporter',
      email: email?.trim() || '',
      phone: phone?.trim() || '',
      amount: val,
      paymentMethod: paymentMethod || 'UPI',
      date: new Date().toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      timestamp: Date.now(),
      note: note?.trim() || 'Fund Contribution',
      status: 'COMPLETED'
    };

    setContributions(prev => [newTxn, ...prev]);

    // Credit platform wallet/vault
    setWalletBalance(prev => prev + val);

    // Record central transaction
    const systemTxn = {
      id: newTxn.id,
      timestamp: new Date().toISOString(),
      type: 'FUND_COLLECTION',
      description: `Fund collected from ${newTxn.contributorName} via ${newTxn.paymentMethod}`,
      amount: val,
      status: 'COMPLETED',
      category: 'COLLECTION'
    };
    setTransactions(prev => [systemTxn, ...prev]);

    // Fire celebration
    triggerConfetti();

    return newTxn;
  };

  const updateFundCampaign = (updatedFields) => {
    setFundCampaign(prev => ({
      ...prev,
      ...updatedFields
    }));
  };

  const clearContributions = () => {
    setContributions([]);
  };

  // Business Projects Operations
  const updateBusinessProject = (projectId, updatedFields, changeNote = "Assumptions Updated") => {
    let updatedProj = null;
    setBusinessProjects(prev => prev.map(p => {
      if (p.id === projectId) {
        updatedProj = { ...p, ...updatedFields };
        return updatedProj;
      }
      return p;
    }));

    if (updatedProj) {
      syncBusinessProjectToSupabase(updatedProj);
    }

    const historyEntry = {
      id: `hist-${Date.now()}`,
      projectId,
      timestamp: new Date().toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      user: user?.name || "Administrator",
      action: "Project Update",
      note: changeNote
    };

    setProjectChangeHistory(prev => [historyEntry, ...prev]);
    saveAuditLogToSupabase(historyEntry);
  };

  const addBusinessProject = (newProject) => {
    setBusinessProjects(prev => [newProject, ...prev]);
    const historyEntry = {
      id: `hist-${Date.now()}`,
      projectId: newProject.id,
      timestamp: new Date().toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      user: user?.name || "Administrator",
      action: "New Project Created",
      note: `Project ${newProject.name} added to portfolio`
    };
    setProjectChangeHistory(prev => [historyEntry, ...prev]);
    triggerConfetti();
  };

  // Admin Project Milestones Controls
  const updateProjectMilestone = (projectId, milestoneId, updatedData) => {
    setBusinessProjects(prev => prev.map(p => {
      if (p.id === projectId) {
        const updatedTimeline = (p.timeline || []).map(m => {
          if (m.id === milestoneId) {
            return { ...m, ...updatedData };
          }
          return m;
        });
        return { ...p, timeline: updatedTimeline };
      }
      return p;
    }));

    const historyEntry = {
      id: `hist-ms-${Date.now()}`,
      projectId,
      timestamp: new Date().toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      user: user?.name || "Administrator",
      action: "Milestone Updated",
      note: `Milestone ${milestoneId} status set to ${updatedData.status || 'updated'}`
    };
    setProjectChangeHistory(prev => [historyEntry, ...prev]);

    // If milestone is marked completed, automatically append a live operational notice
    if (updatedData.status === 'COMPLETED') {
      const completionNote = `Milestone marked as COMPLETED by Administrator. Verified escrow capital allocated for this sprint.`;
      addProjectLiveUpdate(projectId, completionNote, user?.name || "Operations Lead");
    }
  };

  const addProjectMilestone = (projectId, newMilestone) => {
    const milestoneWithId = {
      id: `ms-${Date.now()}`,
      status: 'UPCOMING',
      spent: 0,
      ...newMilestone
    };

    setBusinessProjects(prev => prev.map(p => {
      if (p.id === projectId) {
        return {
          ...p,
          timeline: [...(p.timeline || []), milestoneWithId]
        };
      }
      return p;
    }));

    const historyEntry = {
      id: `hist-ms-add-${Date.now()}`,
      projectId,
      timestamp: new Date().toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      user: user?.name || "Administrator",
      action: "Milestone Added",
      note: `New milestone "${newMilestone.phase}" added`
    };
    setProjectChangeHistory(prev => [historyEntry, ...prev]);
  };

  const deleteProjectMilestone = (projectId, milestoneId) => {
    setBusinessProjects(prev => prev.map(p => {
      if (p.id === projectId) {
        return {
          ...p,
          timeline: (p.timeline || []).filter(m => m.id !== milestoneId)
        };
      }
      return p;
    }));
  };

  const addProjectLiveUpdate = (projectId, note, author = "Operations Team") => {
    const newUpdate = {
      date: new Date().toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' }),
      time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
      note,
      author
    };

    setBusinessProjects(prev => prev.map(p => {
      if (p.id === projectId) {
        return {
          ...p,
          liveUpdates: [newUpdate, ...(p.liveUpdates || [])]
        };
      }
      return p;
    }));
  };

  // Direct Business Project Investment Engine (Submits for Admin Approval)
  const investInBusinessProject = ({ projectId, investorName, email, phone, amount, paymentMethod, utrNumber, screenshotUrl, note }) => {
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) return null;

    const project = businessProjects.find(p => p.id === projectId);
    if (!project) return null;

    const certId = `RBI-INV-${Math.floor(100000 + Math.random() * 900000)}`;
    const newInvestment = {
      id: certId,
      projectId: project.id,
      projectName: project.name,
      category: project.category,
      investorName: investorName?.trim() || 'Verified Backer',
      email: email?.trim() || '',
      phone: phone?.trim() || '',
      amount: numAmount,
      paymentMethod: paymentMethod || 'UPI',
      utrNumber: utrNumber?.trim() || '',
      screenshotUrl: screenshotUrl || '',
      date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
      timestamp: Date.now(),
      expectedYield: project.expectedTermYield || "14.5% Net Yield",
      payoutTimeline: project.payoutTimeline || "Sprint Completion",
      note: note?.trim() || `Capital allocation into ${project.name}`,
      status: 'PENDING_APPROVAL' // Requires Admin Verification of screenshot / UTR before allocation
    };

    // Add to project investments list
    setProjectInvestments(prev => [newInvestment, ...prev]);

    // Add to Change History
    const historyEntry = {
      id: `hist-sub-${Date.now()}`,
      projectId: project.id,
      timestamp: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
      user: newInvestment.investorName,
      action: 'Payment Submitted (Pending Admin Review)',
      note: `Received ₹${numAmount.toLocaleString('en-IN')} payment submission via ${paymentMethod} (UTR: ${utrNumber || 'Screenshot attached'}). Awaiting Admin Escrow Approval.`
    };
    setProjectChangeHistory(prev => [historyEntry, ...prev]);

    // Asynchronously sync with Supabase
    saveProjectInvestmentToSupabase(newInvestment);
    saveAuditLogToSupabase(historyEntry);

    return newInvestment;
  };

  // Admin Approval: Confirms payment screenshot & allocates capital into project
  const approveBusinessInvestment = (investmentId) => {
    let approvedInv = null;
    setProjectInvestments(prev => prev.map(inv => {
      if (inv.id === investmentId) {
        approvedInv = { ...inv, status: 'CONFIRMED' };
        return approvedInv;
      }
      return inv;
    }));

    if (approvedInv) {
      // Increment Project Capital Raised and Backer Count
      let updatedProjectPayload = null;
      setBusinessProjects(prev => prev.map(p => {
        if (p.id === approvedInv.projectId) {
          updatedProjectPayload = {
            ...p,
            capitalRaised: (Number(p.capitalRaised) || 0) + approvedInv.amount,
            investorsCount: (Number(p.investorsCount) || 0) + 1
          };
          return updatedProjectPayload;
        }
        return p;
      }));

      // Record System Ledger Transaction
      const systemTxn = {
        id: approvedInv.id,
        timestamp: new Date().toISOString(),
        type: 'PROJECT_INVESTMENT',
        description: `Verified & Approved investment in ${approvedInv.projectName} by ${approvedInv.investorName} (${approvedInv.paymentMethod})`,
        amount: approvedInv.amount,
        status: 'COMPLETED',
        category: 'PROJECT_DEAL'
      };
      setTransactions(prev => [systemTxn, ...prev]);

      // Audit History Log
      const historyEntry = {
        id: `hist-app-${Date.now()}`,
        projectId: approvedInv.projectId,
        timestamp: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
        user: user?.name || "Administrator",
        action: 'Investment Approved & Allocated',
        note: `Approved ₹${approvedInv.amount.toLocaleString('en-IN')} from ${approvedInv.investorName}. Escrow receipt confirmed and certificate issued.`
      };
      setProjectChangeHistory(prev => [historyEntry, ...prev]);

      // Supabase Persistence
      updateInvestmentStatusInSupabase(investmentId, 'CONFIRMED');
      if (updatedProjectPayload) {
        syncBusinessProjectToSupabase(updatedProjectPayload);
      }
      saveAuditLogToSupabase(historyEntry);

      triggerConfetti();
    }
  };

  // Admin Rejection
  const rejectBusinessInvestment = (investmentId, reason = "Payment verification could not be validated") => {
    setProjectInvestments(prev => prev.map(inv => {
      if (inv.id === investmentId) {
        return { ...inv, status: 'REJECTED', rejectionReason: reason };
      }
      return inv;
    }));

    const historyEntry = {
      id: `hist-rej-${Date.now()}`,
      timestamp: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
      user: user?.name || "Administrator",
      action: 'Investment Rejected',
      note: `Investment ${investmentId} rejected: ${reason}`
    };
    setProjectChangeHistory(prev => [historyEntry, ...prev]);

    updateInvestmentStatusInSupabase(investmentId, 'REJECTED', reason);
    saveAuditLogToSupabase(historyEntry);
  };

  return (
    <AppContext.Provider value={{
      activeTab,
      setActiveTab,
      currentRole,
      setCurrentRole,
      currency,
      setCurrency,
      formatMoney,
      formatValuation,
      isAdminLoggedIn,
      setIsAdminLoggedIn,
      adminLogin,
      adminLogout,
      user,
      setUser,
      walletBalance,
      depositWallet,
      fundCampaign,
      setFundCampaign,
      updateFundCampaign,
      contributions,
      setContributions,
      recordContribution,
      clearContributions,
      businessProjects,
      setBusinessProjects,
      projectChangeHistory,
      updateBusinessProject,
      addBusinessProject,
      investInBusinessProject,
      updateProjectMilestone,
      addProjectMilestone,
      deleteProjectMilestone,
      addProjectLiveUpdate,
      approveBusinessInvestment,
      rejectBusinessInvestment,
      startups,
      setStartups,
      projectDeals,
      setProjectDeals,
      projectInvestments,
      fundProjectDeal,
      advanceProjectMilestone,
      holdings,
      transactions,
      ledgerEntries,
      pendingApplications,
      submitBusinessListing,
      approveApplication,
      rejectApplication,
      cart,
      addToCart,
      updateCartShares,
      removeFromCart,
      clearCart,
      executeBuyShares,
      executeSellShares,
      platformFeeRate,
      setPlatformFeeRate,
      selectedStartup,
      setSelectedStartup,
      selectedProject,
      setSelectedProject,
      isCartOpen,
      setIsCartOpen,
      isCertificateModalOpen,
      setIsCertificateModalOpen,
      selectedCertificate,
      setSelectedCertificate,
      isKYCModalOpen,
      setIsKYCModalOpen,
      isWalletModalOpen,
      setIsWalletModalOpen,
      triggerConfetti,
      supabase,
      supabaseUser,
      isAuthLoading,
      loginWithGoogle,
      logoutUser,
      ADMIN_EMAIL,
      isSuperAdmin: () => isSuperAdmin(supabaseUser || user)
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
