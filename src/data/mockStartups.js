// Production Database for Royal Bank of Investment (RBI) / Royal Capital Infrastructure
// Contains real-world structured SME Order Financing and Audited SME Private Equity Shares

export const SETTLED_PAYOUT_HISTORY = [
  {
    id: "SETTLE-881",
    businessName: "CarpenterBullet Architectural Woodcraft",
    ticker: "CB-WOOD",
    category: "Furniture & Construction",
    title: "15-Villa Teakwood Doors Batch #1",
    customerContractValue: 350000,
    capitalDeployed: 150000,
    tenureDays: 45,
    actualYieldDelivered: "14.2% Net Term Yield",
    settlementDate: "2026-09-22",
    totalPayoutDistributed: 171300,
    investorsCount: 18,
    status: "SETTLED_100_PERCENT",
    escrowBank: "ICICI Escrow Ring-Fence A/C #9914"
  },
  {
    id: "SETTLE-880",
    businessName: "UnavuKadai Quick Kitchens",
    ticker: "UKADAI",
    category: "Food & Cloud Kitchen",
    title: "TCS Siruseri Corporate Catering Supply",
    customerContractValue: 280000,
    capitalDeployed: 120000,
    tenureDays: 28,
    actualYieldDelivered: "13.0% Net Term Yield",
    settlementDate: "2026-09-14",
    totalPayoutDistributed: 135600,
    investorsCount: 14,
    status: "SETTLED_100_PERCENT",
    escrowBank: "HDFC Depository Escrow A/C #3108"
  },
  {
    id: "SETTLE-879",
    businessName: "Bharat Precision Forgings & Alloys",
    ticker: "BP-FORGE",
    category: "Manufacturing & Aerospace",
    title: "Defense Subcontractor Flange Lot #19",
    customerContractValue: 620000,
    capitalDeployed: 280000,
    tenureDays: 55,
    actualYieldDelivered: "15.4% Net Term Yield",
    settlementDate: "2026-08-30",
    totalPayoutDistributed: 323120,
    investorsCount: 22,
    status: "SETTLED_100_PERCENT",
    escrowBank: "Axis Commercial Escrow A/C #4481"
  }
];

export const LIVE_INVESTOR_ACTIVITY = [
  { investor: "Dr. Raman K.", action: "allocated", amount: 25000, target: "CarpenterBullet Teak Order", time: "2 mins ago", badge: "Verified HNI" },
  { investor: "Priya Menon", action: "purchased 45 shares of", amount: 2025, target: "CarpenterBullet Equity", time: "5 mins ago", badge: "Angel Member" },
  { investor: "Vikramaditya P.", action: "allocated", amount: 50000, target: "Bharat Precision Aerospace", time: "8 mins ago", badge: "Syndicate Lead" },
  { investor: "Ananya Sharma", action: "allocated", amount: 5000, target: "GreenSprout Agro Cold-Chain", time: "12 mins ago", badge: "Retail Investor" },
  { investor: "UnavuKadai Quick Kitchens", action: "distributed yield to 64 investors", amount: 142000, target: "Quarterly Platform Payout", time: "24 mins ago", badge: "Company Dividend" },
  { investor: "Siddharth Rao", action: "purchased 100 shares of", amount: 2500, target: "GreenSprout Logistics", time: "31 mins ago", badge: "Verified Investor" }
];

export const INITIAL_PROJECT_DEALS = [
  {
    id: "proj-cb-001",
    dealType: "PROJECT_FINANCING",
    businessName: "CarpenterBullet Architectural Woodcraft",
    ticker: "CB-WOOD",
    category: "Furniture & Construction",
    logo: "🪵",
    title: "20-Door Luxury Teak Furniture & Interior Order",
    tagline: "Spot raw material (seasoned teak & brass hardware) working capital for a confirmed residential villa contract in Anna Nagar",
    customerContractValue: 450000, // ₹4,50,000 customer contract
    capitalRequired: 200000,       // ₹2,00,000 needed
    businessContribution: 100000,  // ₹1,00,000 carpenter's own money
    capitalRaised: 165000,         // ₹1,65,000 funded so far (82%)
    durationDays: 45,
    minContribution: 2500,
    expectedSurplus: 150000,       // Estimated gross surplus
    indicativeYield: "14.5% Contractual Term Yield",
    safetyScore: "98/100",
    escrowPartner: "ICICI Bank Partner Escrow",
    riskScorecard: {
      customerConcentration: "Medium (Single Villa Client with Advance Escrow)",
      documentation: "Verified (Stamp Paper PO & Invoice #7721)",
      businessHistory: "5 Years Operating, 140+ Projects",
      cashFlowVisibility: "High (Escrow Customer Advance ₹1,00,000 in Vault)",
      defaultHistory: "Zero Defaults on RBI Platform",
      promoterSkinInGame: "₹1,00,000 (33% of project cost)"
    },
    costBreakdown: [
      { item: "Seasoned Burma Teak & Hardwood", cost: 125000, vendor: "Malabar Timber Mart", verified: true },
      { item: "Specialized Master Carpenter Guild Labour", cost: 50000, vendor: "In-house Guild Team", verified: true },
      { item: "Heavy-Duty Brass Hardware & Hinges", cost: 15000, vendor: "Hettich Authorised Dist.", verified: true },
      { item: "Transport & On-Site Installation", cost: 10000, vendor: "Direct Logistics Partner", verified: true }
    ],
    milestones: [
      { id: "M1", title: "Customer PO & Advance Escrow", status: "COMPLETED", date: "2026-09-28", proof: "PO-VERIFIED-VILLA99.pdf" },
      { id: "M2", title: "Raw Timber Procurement & Invoicing", status: "COMPLETED", date: "2026-10-01", proof: "INV-TIMBER-7721.pdf" },
      { id: "M3", title: "Joinery & 50% Production Assembly", status: "IN_PROGRESS", date: "2026-10-15", proof: "Workshop Video Inspection" },
      { id: "M4", title: "Finishing, Polishing & Quality Audit", status: "PENDING", date: "2026-10-28", proof: "QC Certificate" },
      { id: "M5", title: "Site Delivery & Customer Sign-Off", status: "PENDING", date: "2026-11-05", proof: "Customer Delivery Slip" },
      { id: "M6", title: "Final Settlement & Yield Distribution", status: "PENDING", date: "2026-11-12", proof: "RBI Escrow Payout" }
    ],
    customerInfo: {
      clientType: "Private Residential Architect",
      location: "Anna Nagar, Chennai",
      advancePaid: 100000,
      balanceDueOnDelivery: 350000
    },
    rbiAuditStatus: "RBI_ORDER_VERIFIED",
    verifiedOrderUrl: "DOC-CB-PO-450K.pdf"
  },
  {
    id: "proj-uk-002",
    dealType: "PROJECT_FINANCING",
    businessName: "UnavuKadai Quick Kitchens",
    ticker: "UKADAI",
    category: "Food & Cloud Kitchen",
    logo: "🍱",
    title: "Tech Park Mega Corporate Catering & Event Supply",
    tagline: "Raw provisions & bulk biodegradable packaging capital for confirmed 1,200-person tech symposium dinner",
    customerContractValue: 380000,
    capitalRequired: 150000,
    businessContribution: 80000,
    capitalRaised: 150000, // 100% funded!
    durationDays: 25,
    minContribution: 2000,
    expectedSurplus: 110000,
    indicativeYield: "12.8% Term Yield",
    safetyScore: "99/100",
    escrowPartner: "HDFC Bank Partner Escrow",
    riskScorecard: {
      customerConcentration: "Low (Multi-sponsor Global IT Corp)",
      documentation: "Verified Corporate PO Attached",
      businessHistory: "3 Years, 4 Kitchen Hubs",
      cashFlowVisibility: "High (50% Client Advance Paid in Escrow)",
      defaultHistory: "Clean Record (Zero Past Delinquencies)",
      promoterSkinInGame: "₹80,000 (35% Skin in Game)"
    },
    costBreakdown: [
      { item: "Organic Rice, Spices & Groceries", cost: 85000, vendor: "Direct Agro Wholesale", verified: true },
      { item: "Eco-Friendly Biodegradable Packaging", cost: 25000, vendor: "GreenPack Ltd", verified: true },
      { item: "Temporary Culinary & Serving Staff", cost: 30000, vendor: "Chef Guild Collective", verified: true },
      { item: "Cold Chain Transport Vans", cost: 10000, vendor: "CityLogistics", verified: true }
    ],
    milestones: [
      { id: "M1", title: "Corporate Agreement & Menu Freeze", status: "COMPLETED", date: "2026-10-01", proof: "CONTRACT-CORP-380K.pdf" },
      { id: "M2", title: "Raw Material Bulk Purchase", status: "COMPLETED", date: "2026-10-03", proof: "PROVISION-INV-990.pdf" },
      { id: "M3", title: "Catering Execution & Service", status: "IN_PROGRESS", date: "2026-10-18", proof: "Event Service Log" },
      { id: "M4", title: "Client Invoice Clearance", status: "PENDING", date: "2026-10-24", proof: "Bank Wire Advice" },
      { id: "M5", title: "Settlement & Capital Repayment", status: "PENDING", date: "2026-10-26", proof: "RBI Ledger Disbursal" }
    ],
    customerInfo: {
      clientType: "Global IT Services Corporation",
      location: "OMR IT Corridor, Chennai",
      advancePaid: 190000,
      balanceDueOnDelivery: 190000
    },
    rbiAuditStatus: "RBI_ORDER_VERIFIED",
    verifiedOrderUrl: "DOC-UK-PO-380K.pdf"
  },
  {
    id: "proj-bpc-003",
    dealType: "PROJECT_FINANCING",
    businessName: "Bharat Precision Forgings & Alloys",
    ticker: "BP-FORGE",
    category: "Manufacturing & Aerospace",
    logo: "⚙️",
    title: "Titanium Aircraft Valve Machining Batch #44",
    tagline: "Specialty titanium alloy billets procurement against defense subcontractor delivery order",
    customerContractValue: 850000,
    capitalRequired: 380000,
    businessContribution: 180000,
    capitalRaised: 285000, // 75% funded
    durationDays: 60,
    minContribution: 5000,
    expectedSurplus: 220000,
    indicativeYield: "15.8% Term Yield",
    safetyScore: "97/100",
    escrowPartner: "Axis Bank Partner Escrow",
    riskScorecard: {
      customerConcentration: "Low (Tier-1 Aerospace Contractor)",
      documentation: "High (Govt Subcontract PO & LC)",
      businessHistory: "8 Years Operating, ISO 9001 Certified",
      cashFlowVisibility: "Very High (Letter of Credit Backed)",
      defaultHistory: "Zero Defaults on Record",
      promoterSkinInGame: "₹1,80,000 (32%)"
    },
    costBreakdown: [
      { item: "Grade 5 Titanium Billets (180kg)", cost: 260000, vendor: "Midhani Alloys Ltd", verified: true },
      { item: "CNC 5-Axis Tooling Inserts", cost: 45000, vendor: "Sandvik Coromant", verified: true },
      { item: "Heat Treatment & Metallurgical Lab Audit", cost: 35000, vendor: "NABL Certified Lab", verified: true },
      { item: "Secure Logistics & Packaging", cost: 15000, vendor: "Secutech Freight", verified: true }
    ],
    milestones: [
      { id: "M1", title: "PO & Material Specification Audit", status: "COMPLETED", date: "2026-09-25", proof: "AERO-SPEC-PO.pdf" },
      { id: "M2", title: "Titanium Billets Receipt & Lab Test", status: "IN_PROGRESS", date: "2026-10-10", proof: "NABL-LAB-TEST.pdf" },
      { id: "M3", title: "CNC Machining & Tolerance Inspection", status: "PENDING", date: "2026-10-30", proof: "CMM Coordinate Report" },
      { id: "M4", title: "Final Delivery & CMM Certification", status: "PENDING", date: "2026-11-15", proof: "Acceptance Memo" },
      { id: "M5", title: "LC Maturity & Capital Settlement", status: "PENDING", date: "2026-11-25", proof: "Bank LC Realisation" }
    ],
    customerInfo: {
      clientType: "Defense Aerospace Component Tier 1",
      location: "Peenya Industrial Area, Bangalore",
      advancePaid: 250000,
      balanceDueOnDelivery: 600000
    },
    rbiAuditStatus: "RBI_ORDER_VERIFIED",
    verifiedOrderUrl: "DOC-BP-PO-850K.pdf"
  },
  {
    id: "proj-gs-004",
    dealType: "PROJECT_FINANCING",
    businessName: "GreenSprout Organic Agro Logistics",
    ticker: "GSPROUT",
    category: "AgriTech & Cold Chain",
    logo: "🌱",
    title: "Solar-Powered Hydroponic Cold Storage Batch",
    tagline: "Spot capital for refrigerated solar storage dispatch fulfilling hypermarket chain delivery contract",
    customerContractValue: 240000,
    capitalRequired: 90000,
    businessContribution: 40000,
    capitalRaised: 55000, // 61% funded
    durationDays: 30,
    minContribution: 1000,
    expectedSurplus: 75000,
    indicativeYield: "13.5% Term Yield",
    safetyScore: "96/100",
    escrowPartner: "Kotak Mahindra Escrow",
    riskScorecard: {
      customerConcentration: "Low (Supermarket Retail Chain)",
      documentation: "Verified Weekly Standing PO",
      businessHistory: "4 Years, Organic Certification",
      cashFlowVisibility: "High (Weekly Revolving Settlements)",
      defaultHistory: "Zero Defaults",
      promoterSkinInGame: "₹40,000 (31%)"
    },
    costBreakdown: [
      { item: "Refrigerated Solar Container Hire", cost: 45000, vendor: "CoolTech Agro", verified: true },
      { item: "Biodegradable Clamshell Trays", cost: 20000, vendor: "EcoPlast Ltd", verified: true },
      { item: "Quality Grading & Sorting Staff", cost: 15000, vendor: "AgriGuild", verified: true },
      { item: "Highway Fast-Tag Logistics", cost: 10000, vendor: "SwiftRoute", verified: true }
    ],
    milestones: [
      { id: "M1", title: "Supermarket Delivery PO Audit", status: "COMPLETED", date: "2026-10-02", proof: "SUPERMARKET-PO-240K.pdf" },
      { id: "M2", title: "Harvest Dispatch & Reefer Packing", status: "IN_PROGRESS", date: "2026-10-12", proof: "Warehouse Loading Stamp" },
      { id: "M3", title: "Store Reception & Weighment Check", status: "PENDING", date: "2026-10-22", proof: "Goods Receipt Note" },
      { id: "M4", title: "Automated Bank Escrow Settlement", status: "PENDING", date: "2026-11-01", proof: "RBI Escrow Payout" }
    ],
    customerInfo: {
      clientType: "Omnichannel Supermarket Chain",
      location: "Kochi & Coimbatore Distribution Hubs",
      advancePaid: 80000,
      balanceDueOnDelivery: 160000
    },
    rbiAuditStatus: "RBI_ORDER_VERIFIED",
    verifiedOrderUrl: "DOC-GS-PO-240K.pdf"
  }
];

export const INITIAL_STARTUPS = [
  {
    id: "rbi-001",
    dealType: "EQUITY_SHARES",
    name: "CarpenterBullet Architectural Woodcraft & Guild",
    ticker: "CB-WOOD",
    sector: "Furniture & Construction",
    stage: "Established SME Growth",
    badge: "Master Woodcraft Guild",
    tagline: "Commercial architectural woodwork, modular cabinetry, and custom teak interiors with verified order books",
    logo: "🪵",
    valuation: 18500000, // ₹1.85 Cr
    sharePrice: 45.00,
    totalShares: 411111,
    availableShares: 55555,
    sharesSold: 43333,
    targetRaise: 2500000,
    raisedAmount: 1950000,
    minInvestment: 45,
    dueDiligenceScore: 96,
    riskGrade: "Low-Medium",
    change24h: "+5.4%",
    isTrending: true,
    historicalValuation: [
      { period: "2023 Q3", val: 6.2 },
      { period: "2024 Q1", val: 9.8 },
      { period: "2024 Q4", val: 14.0 },
      { period: "Current Audited", val: 18.5 },
      { period: "2026 H2 Target", val: 26.0 }
    ],
    financials: {
      arr: "₹4.2 Cr",
      mrr: "₹35 Lakhs",
      growthYoY: "+140%",
      ebitdaMargin: "+22%",
      burnRate: "Cashflow Positive",
      runway: "Profitable",
      patents: 2
    },
    valuationAudit: {
      dcfValuation: "₹1.79 Cr",
      revenueMultiple: "1.8x Sales Multiple",
      ebitdaMultiple: "4.8x EBITDA Multiple",
      moatRating: "Tier 1 - Master Artisan Guild & Verified Client POs",
      confidenceScore: "96.4%",
      summary: "Profitable operating cash flows with audited annual revenue of ₹4.2 Cr and zero outstanding institutional defaults."
    },
    pitch: "CarpenterBullet operates precision woodworking workshops delivering high-spec teak and rosewood interiors for luxury villas, hospitality chains, and commercial offices.",
    founder: "Alexander Rajasingh & Master Guild Team",
    rbiApproved: true
  },
  {
    id: "rbi-002",
    dealType: "EQUITY_SHARES",
    name: "UnavuKadai Quick Kitchens & Institutional Catering",
    ticker: "UKADAI",
    sector: "Food & Cloud Kitchen",
    stage: "Series A Expansion",
    badge: "Tech Park Food Hub",
    tagline: "Centralized cloud kitchens supplying 8,000+ daily corporate meals across Chennai IT corridors with 28% EBITDA",
    logo: "🍱",
    valuation: 32000000, // ₹3.2 Cr
    sharePrice: 80.00,
    totalShares: 400000,
    availableShares: 40000,
    sharesSold: 36000,
    targetRaise: 3200000,
    raisedAmount: 2880000,
    minInvestment: 80,
    dueDiligenceScore: 95,
    riskGrade: "Low",
    change24h: "+4.2%",
    isTrending: false,
    historicalValuation: [
      { period: "2023 Q1", val: 11.5 },
      { period: "2023 Q4", val: 18.0 },
      { period: "2024 Q3", val: 25.0 },
      { period: "Current Audited", val: 32.0 },
      { period: "2026 H2 Target", val: 45.0 }
    ],
    financials: {
      arr: "₹6.2 Cr",
      mrr: "₹52 Lakhs",
      growthYoY: "+115%",
      ebitdaMargin: "+26%",
      burnRate: "Cashflow Positive",
      runway: "Profitable",
      patents: 3
    },
    valuationAudit: {
      dcfValuation: "₹3.14 Cr",
      revenueMultiple: "2.2x Sales Multiple",
      ebitdaMultiple: "5.2x EBITDA Multiple",
      moatRating: "Tier 1 - Multi-Year Corporate Standing POs",
      confidenceScore: "95.8%",
      summary: "High customer retention (68% repeat institutional bookings) with long-term catering concessions at major tech parks."
    },
    pitch: "UnavuKadai transforms commercial food supply through centralized commissary prep and localized smart dispatch kitchens, delivering hygienic regional meals at scale.",
    founder: "Senthil Kumaran & Priya Swaminathan",
    rbiApproved: true
  },
  {
    id: "rbi-003",
    dealType: "EQUITY_SHARES",
    name: "Bharat Precision Forgings & Alloys",
    ticker: "BP-FORGE",
    sector: "Manufacturing & Aerospace",
    stage: "Industrial SME Scale",
    badge: "ISO 9001 Certified",
    tagline: "5-axis CNC machining, titanium forging, and defense tier-1 subcontract manufacturing with export clearances",
    logo: "⚙️",
    valuation: 28000000, // ₹2.8 Cr
    sharePrice: 50.00,
    totalShares: 560000,
    availableShares: 60000,
    sharesSold: 54000,
    targetRaise: 3000000,
    raisedAmount: 2700000,
    minInvestment: 50,
    dueDiligenceScore: 97,
    riskGrade: "Low",
    change24h: "+5.1%",
    isTrending: true,
    historicalValuation: [
      { period: "2023 Q2", val: 10.0 },
      { period: "2023 Q4", val: 16.5 },
      { period: "2024 Q3", val: 22.0 },
      { period: "Current Audited", val: 28.0 },
      { period: "2026 H2 Target", val: 38.0 }
    ],
    financials: {
      arr: "₹7.8 Cr",
      mrr: "₹65 Lakhs",
      growthYoY: "+135%",
      ebitdaMargin: "+24%",
      burnRate: "Cashflow Positive",
      runway: "Profitable",
      patents: 6
    },
    valuationAudit: {
      dcfValuation: "₹2.75 Cr",
      revenueMultiple: "3.2x Sales Multiple",
      ebitdaMultiple: "7.0x EBITDA Multiple",
      moatRating: "Tier 1 - Defense Subcontract Accreditations",
      confidenceScore: "97.2%",
      summary: "State-of-the-art Peenya CNC facility backed by verified Letters of Credit and zero delinquent supplier payments."
    },
    pitch: "Bharat Precision delivers aerospace-grade titanium components and precision turbine flanges directly to certified defense and power engineering contractors.",
    founder: "R. Sundararajan (Ex-HAL Senior Engineer)",
    rbiApproved: true
  },
  {
    id: "rbi-004",
    dealType: "EQUITY_SHARES",
    name: "GreenSprout Agro Cold-Chain & Distribution",
    ticker: "GSPROUT",
    sector: "AgriTech & Cold Chain",
    stage: "Commercial Growth",
    badge: "Direct Farm Logistics",
    tagline: "Solar cold hubs and farm-to-supermarket temperature-controlled supply chains minimizing post-harvest spoilage",
    logo: "🌱",
    valuation: 6500000, // ₹65 Lakhs
    sharePrice: 25.00,
    totalShares: 260000,
    availableShares: 45000,
    sharesSold: 28000,
    targetRaise: 750000,
    raisedAmount: 520000,
    minInvestment: 25,
    dueDiligenceScore: 92,
    riskGrade: "Low-Medium",
    change24h: "+6.8%",
    isTrending: true,
    historicalValuation: [
      { period: "2023 Q4", val: 2.1 },
      { period: "2024 Q2", val: 4.0 },
      { period: "Current Audited", val: 6.5 },
      { period: "2026 H2 Target", val: 12.0 }
    ],
    financials: {
      arr: "₹2.4 Cr",
      mrr: "₹20 Lakhs",
      growthYoY: "+160%",
      ebitdaMargin: "+19%",
      burnRate: "Cashflow Positive",
      runway: "Profitable",
      patents: 2
    },
    valuationAudit: {
      dcfValuation: "₹6.2 Lakhs",
      revenueMultiple: "2.1x Sales Multiple",
      ebitdaMultiple: "5.0x EBITDA Multiple",
      moatRating: "Tier 2 - Regional Agro Distribution Network",
      confidenceScore: "93.4%",
      summary: "Direct weekly recurring contracts with top supermarket retail chains across Kerala and Tamil Nadu."
    },
    pitch: "GreenSprout operates decentralized solar cold storage units at farm gates, delivering fresh organic produce to urban markets with over 98% freshness preservation.",
    founder: "Karthik Subramanian & Dr. Anjali Nair",
    rbiApproved: true
  }
];

export const INITIAL_PROJECT_INVESTMENTS = [
  {
    projectId: "proj-cb-001",
    dealType: "PROJECT_FINANCING",
    businessName: "CarpenterBullet Architectural Woodcraft",
    ticker: "CB-WOOD",
    projectName: "20-Door Luxury Teak Furniture & Interior Order",
    investedAmount: 25000,
    contractualReturnRate: "14.5%",
    expectedMaturityAmount: 28625,
    tenureDays: 45,
    daysRemaining: 28,
    status: "ACTIVE_PRODUCTION",
    currentMilestone: "Joinery & 50% Production Assembly",
    certificateId: "RBI-PROJ-CB-8819",
    lastMilestoneUpdate: "Malabar Timber Mart delivery verified & timber stacked in workshop."
  }
];

export const INITIAL_TRANSACTIONS = [
  {
    id: "TX-98421",
    timestamp: "2026-10-04 18:24",
    type: "BUY",
    category: "EQUITY_SHARES",
    companyName: "CarpenterBullet Architectural Woodcraft",
    ticker: "CB-WOOD",
    shares: 25,
    pricePerShare: 45.00,
    totalAmount: 1125.00,
    fee: 16.88,
    status: "Completed",
    certificateId: "RBI-CERT-77319"
  },
  {
    id: "TX-98415",
    timestamp: "2026-10-04 11:15",
    type: "FUND_PROJECT",
    category: "PROJECT_FINANCING",
    companyName: "CarpenterBullet (CB-2026-001)",
    ticker: "CB-WOOD",
    shares: 1,
    pricePerShare: 25000.00,
    totalAmount: 25000.00,
    fee: 250.00,
    status: "Completed",
    certificateId: "RBI-PROJ-CB-8819"
  },
  {
    id: "TX-98402",
    timestamp: "2026-10-03 14:10",
    type: "BUY",
    category: "EQUITY_SHARES",
    companyName: "UnavuKadai Quick Kitchens",
    ticker: "UKADAI",
    shares: 20,
    pricePerShare: 80.00,
    totalAmount: 1600.00,
    fee: 24.00,
    status: "Completed",
    certificateId: "RBI-CERT-66104"
  }
];

export const INITIAL_HOLDINGS = [
  {
    companyId: "rbi-001",
    companyName: "CarpenterBullet Architectural Woodcraft",
    ticker: "CB-WOOD",
    shares: 40,
    avgBuyPrice: 41.50,
    currentPrice: 45.00,
    investedAmount: 1660.00,
    currentValue: 1800.00,
    pnlAmount: 140.00,
    pnlPercentage: 8.43,
    certificateId: "RBI-CERT-77319"
  },
  {
    companyId: "rbi-002",
    companyName: "UnavuKadai Quick Kitchens",
    ticker: "UKADAI",
    shares: 25,
    avgBuyPrice: 75.00,
    currentPrice: 80.00,
    investedAmount: 1875.00,
    currentValue: 2000.00,
    pnlAmount: 125.00,
    pnlPercentage: 6.67,
    certificateId: "RBI-CERT-66104"
  }
];

export const INITIAL_PENDING_APPLICATIONS = [
  {
    id: "APP-5501",
    type: "PROJECT_FUNDING",
    name: "CarpenterBullet Workshop Batch #2",
    ticker: "CB-W2",
    founder: "Alexander Rajasingh (Carpenter Guild)",
    sector: "Furniture & Interior Architecture",
    stage: "Order Working Capital",
    claimedValuation: 600000,
    targetRaise: 250000,
    annualRevenue: 4200000,
    growthRate: 140,
    ebitda: 22,
    status: "Pending Review",
    submittedAt: "2026-10-04",
    description: "Purchase order funding for 40 solid mahogany office executive desks for a co-working space chain.",
    useOfFunds: "Mahogany wood ₹1,60,000, Hardware ₹35,000, Labour ₹40,000, Transit ₹15,000"
  },
  {
    id: "APP-5502",
    type: "EQUITY_SHARES",
    name: "Apex Cargo & Fleet Solutions",
    ticker: "APEX-LOG",
    founder: "Vigneshwaran K.",
    sector: "Logistics & Transport",
    stage: "Commercial SME",
    claimedValuation: 8500000,
    targetRaise: 1200000,
    annualRevenue: 3800000,
    growthRate: 125,
    ebitda: 21,
    status: "Pending Review",
    submittedAt: "2026-10-02",
    description: "Fleet expansion and working capital for 15 dedicated temperature-controlled delivery vehicles."
  }
];

export const INITIAL_LEDGER_ENTRIES = [
  {
    entryNo: "LEDG-00109",
    timestamp: "2026-10-04 18:24:02",
    debitAccount: "CAPITAL_PROVIDER_VAULT (Alexander Rajasingh)",
    creditAccount: "RBI_SETTLEMENT_ESCROW_A/C",
    amount: 1125.00,
    reference: "TX-98421 / CB-WOOD-25-SHARES",
    status: "RECONCILED"
  },
  {
    entryNo: "LEDG-00108",
    timestamp: "2026-10-04 18:24:02",
    debitAccount: "CAPITAL_PROVIDER_VAULT",
    creditAccount: "RBI_PLATFORM_FEE_REVENUE_A/C",
    amount: 16.88,
    reference: "FEE-1.5% / TX-98421",
    status: "RECONCILED"
  },
  {
    entryNo: "LEDG-00107",
    timestamp: "2026-10-04 11:15:33",
    debitAccount: "INVESTOR_ALLOCATION_VAULT",
    creditAccount: "CARPENTERBULLET_PROJECT_ESCROW (CB-2026-001)",
    amount: 25000.00,
    reference: "TX-98415 / CB-TEAK-ORDER-TRANCHE",
    status: "RECONCILED"
  },
  {
    entryNo: "LEDG-00106",
    timestamp: "2026-10-04 11:15:33",
    debitAccount: "INVESTOR_ALLOCATION_VAULT",
    creditAccount: "RBI_TECH_FEE_REVENUE",
    amount: 250.00,
    reference: "ORIGINATION-FEE-1% / TX-98415",
    status: "RECONCILED"
  }
];
