// Institutional Financial Database & Calculation Engine for Business Projects
// 1. UnavuKadai Jasai (Food Delivery Marketing Launch)
// 2. CarpenterBullet (Marketplace Lead Generation & Commission)
// 3. Wooden Laptop Case (Product Manufacturing & Sales)
// 4. Bamboo Cup (Eco-Friendly Manufacturing & Sales)

export const INITIAL_BUSINESS_PROJECTS = [
  {
    id: "proj-unavukadai",
    name: "UnavuKadai Jasai",
    category: "Food Delivery & Cloud Kitchen",
    status: "Active", // Planning | Testing | Active | Completed
    description: "Launch marketing campaign and hyper-local food delivery order acquisition across Vadamadurai / Thudiyalur cluster.",
    campaignStartDate: "2026-10-15",
    campaignEndDate: "2026-10-21",
    campaignDurationDays: 6,
    dailyAdBudget: 200,
    type: "SERVICE_ORDER", // 'SERVICE_ORDER' | 'COMMISSION_MARKETPLACE' | 'PRODUCT_MANUFACTURING'
    
    // Complete Itemized Budget Allocation (All Costs, Not Just Ads)
    expenseBreakdown: [
      { item: "Meta Local Ads (₹200/day × 6 days)", amount: 1200, category: "Advertising & Acquisition", verified: true, progress: "Running" },
      { item: "Doorstep Posters & Print Collateral", amount: 1000, category: "Local Print Marketing", verified: true, progress: "Distributed" },
      { item: "Storefront & Counter Banner Setup", amount: 500, category: "Signage & Branding", verified: true, progress: "Installed" },
      { item: "Domain, QR Order Rail & Cloud Setup", amount: 1100, category: "Tech & Ordering Setup", verified: true, progress: "Live" },
      { item: "Contingency & Order Reservation Buffer", amount: 200, category: "Operating Reserve", verified: true, progress: "Held in Vault" }
    ],
    statedTotalBudget: 4000,
    capitalRequested: 4000,
    capitalRaised: 0,
    minInvestment: 500,
    investorsCount: 0,
    expectedTermYield: "14.2% Net Term Yield",
    payoutTimeline: "Oct 22, 2026 (6-Day Sprint)",
    upiId: "8248651695-3@ybl",

    // Targets & Unit Economics
    dailyOrderTarget: 10,
    totalOrderTarget: 60,
    avgSellingPricePerUnit: 250, // Average basket size per order (₹)
    directCostPerUnit: 140, // Food preparation & packaging cost per order (₹)
    deliveryCostPerUnit: 40, // Local delivery rider payout per order (₹)
    statedPerOrderMarginFee: 60, // Gross operating margin per delivery: ₹250 - ₹140 - ₹40 = ₹70 (₹60 base target)

    // Actual Data Tracking to Date
    actuals: {
      amountSpentToDate: 1900,
      verifiedExpenses: 1900,
      ordersReceived: 28,
      prepaidOrdersCount: 22,
      prepaidAmountCollected: 5500,
      codOrdersCount: 6,
      codAmountCollected: 1500,
      actualRefunds: 250,
      actualDeliveryCostPaid: 1120,
      verifiedDirectCosts: 3920
    },

    // Detailed Project Execution Timeline & Time Sprints (Investor Visibility)
    timeline: [
      {
        id: "uk-m1",
        stepNumber: 1,
        stepTotal: 5,
        phase: "Phase 1: Setup & Digital Assets",
        sprintDuration: "48 Hours (Days 1–2)",
        sprintTag: "48h Sprint",
        sprintHours: 48,
        period: "Oct 10 - Oct 12, 2026",
        status: "COMPLETED",
        deliverables: "Domain purchased, WhatsApp catalog live, QR stickers printed.",
        allocatedBudget: 1600,
        spent: 1600
      },
      {
        id: "uk-m2",
        stepNumber: 2,
        stepTotal: 5,
        phase: "Phase 2: Collateral & Cluster Signage",
        sprintDuration: "48 Hours (Days 3–4)",
        sprintTag: "48h Sprint",
        sprintHours: 48,
        period: "Oct 13 - Oct 14, 2026",
        status: "COMPLETED",
        deliverables: "Banners erected at Thudiyalur checkpost, 500 posters distributed.",
        allocatedBudget: 500,
        spent: 300
      },
      {
        id: "uk-m3",
        stepNumber: 3,
        stepTotal: 5,
        phase: "Phase 3: Hyper-Local Meta Ad Push",
        sprintDuration: "144 Hours / 6 Days (Days 5–10)",
        sprintTag: "144h Sprint",
        sprintHours: 144,
        period: "Oct 15 - Oct 20, 2026",
        status: "IN_PROGRESS",
        deliverables: "Daily ₹200 ad targeting radius within 4km of kitchen. Target 10 orders/day.",
        allocatedBudget: 1200,
        spent: 400
      },
      {
        id: "uk-m4",
        stepNumber: 4,
        stepTotal: 5,
        phase: "Phase 4: Order Dispatch & Delivery",
        sprintDuration: "144 Hours / 6 Days (Days 5–11)",
        sprintTag: "144h Sprint",
        sprintHours: 144,
        period: "Oct 15 - Oct 21, 2026",
        status: "IN_PROGRESS",
        deliverables: "Onboarding delivery fleet, tracking prepaid vs COD orders, zero delivery lag.",
        allocatedBudget: 500,
        spent: 200
      },
      {
        id: "uk-m5",
        stepNumber: 5,
        stepTotal: 5,
        phase: "Phase 5: Financial Reconciliation & Payout",
        sprintDuration: "24 Hours (Day 12)",
        sprintTag: "24h Settlement",
        sprintHours: 24,
        period: "Oct 22, 2026",
        status: "UPCOMING",
        deliverables: "Final ledger reconciliation of 60 orders, vendor settlement, investor reporting.",
        allocatedBudget: 200,
        spent: 0
      }
    ],

    // Live Operational Activity Feed ("What We Are Doing Right Now")
    liveUpdates: [
      { date: "Oct 13, 2026", time: "11:30 AM", note: "Meta Ad Creative #2 deployed with focus on South Indian lunch combos. Reached 1,420 locals.", author: "Alexander (Campaign Lead)" },
      { date: "Oct 12, 2026", time: "04:15 PM", note: "Posters posted across residential apartment clusters in Vadamadurai. 28 initial trial orders recorded.", author: "Logistics Team" },
      { date: "Oct 11, 2026", time: "02:00 PM", note: "Kitchen food preparation line and eco-friendly foil packaging boxes stocked for 60-order run.", author: "Operations Lead" }
    ],

    risksAndAssumptions: [
      "Weather and delivery rider availability in Thudiyalur cluster can impact fulfillment times.",
      "Stated ₹60 fee metric (6 × ₹60 = ₹360) is verified as the planned base platform net capture per order batch.",
      "Listed expenses total ₹4,000, leaving no unfunded cash drain during the 6-day sprint."
    ]
  },

  {
    id: "proj-carpenterbullet",
    name: "CarpenterBullet",
    category: "Commission-Based Marketplace",
    status: "Active",
    description: "Digital lead generation and carpenter job routing marketplace connecting homeowners with master carpentry guilds.",
    campaignStartDate: "2026-10-10",
    campaignEndDate: "2026-11-19",
    campaignDurationDays: 40,
    dailyAdBudget: 250,
    type: "COMMISSION_MARKETPLACE",

    // Complete Itemized Budget Allocation (All Costs, Not Just Ads)
    expenseBreakdown: [
      { item: "Meta & Google Lead Generation Ads (₹250/day × 40)", amount: 10000, category: "Advertising & Lead Acquisition", verified: true, progress: "Active" },
      { item: "Dedicated Tele-verification Desk & Calling Tools", amount: 1500, category: "Operations & CRM", verified: true, progress: "Staffed" },
      { item: "Escrow Ring-Fencing & Payment Gateway Fees", amount: 500, category: "Banking & Processing", verified: true, progress: "Configured" },
      { item: "Carpenter Guild Vetting & Background Checks", amount: 1000, category: "Guild Onboarding", verified: true, progress: "Ongoing" }
    ],
    statedTotalBudget: 13000,
    capitalRequested: 10000,
    capitalRaised: 0,
    minInvestment: 1000,
    investorsCount: 0,
    expectedTermYield: "15.0% Commission Pool Yield",
    payoutTimeline: "Nov 25, 2026 (40-Day Sprint)",
    upiId: "8248651695-3@ybl",

    // Target Metrics
    targetLeadsPerDayMin: 15,
    targetLeadsPerDayMax: 20,
    targetCompletedSalesPerDay: 5,
    campaignSalesTarget: 200,
    commissionPerCompletedSale: 100, // Platform earns ₹100 per completed sale, not full job value
    projectedCommissionRevenue: 20000, // 200 × ₹100
    statedRemainingAfterAds: 10000, // ₹20,000 - ₹10,000 ads

    // Actual Data Tracking
    actuals: {
      amountSpentToDate: 3250, // 13 days of ads
      verifiedExpenses: 3250,
      leadsGenerated: 214,
      completedPaidSales: 58,
      commissionActuallyCollected: 5800,
      otherOperatingExpenses: 650
    },

    // Detailed Project Execution Timeline & Time Sprints (Investor Visibility)
    timeline: [
      {
        id: "cb-m1",
        stepNumber: 1,
        stepTotal: 5,
        phase: "Phase 1: Guild Onboarding & Vetting",
        sprintDuration: "168 Hours / 7 Days (Sprint W1)",
        sprintTag: "168h Sprint",
        sprintHours: 168,
        period: "Oct 01 - Oct 08, 2026",
        status: "COMPLETED",
        deliverables: "18 master carpenter guilds vetted, rate card agreed, escrow terms signed.",
        allocatedBudget: 1000,
        spent: 1000
      },
      {
        id: "cb-m2",
        stepNumber: 2,
        stepTotal: 5,
        phase: "Phase 2: CRM & Tele-calling Pipeline",
        sprintDuration: "48 Hours (Sprint W1)",
        sprintTag: "48h Sprint",
        sprintHours: 48,
        period: "Oct 08 - Oct 10, 2026",
        status: "COMPLETED",
        deliverables: "Exotel IVR routing, WhatsApp quotation bot, and escrow link generator setup.",
        allocatedBudget: 1500,
        spent: 1500
      },
      {
        id: "cb-m3",
        stepNumber: 3,
        stepTotal: 5,
        phase: "Phase 3: Meta & Search Lead Campaign",
        sprintDuration: "960 Hours / 40 Days (Sprint W2–W7)",
        sprintTag: "960h Campaign",
        sprintHours: 960,
        period: "Oct 10 - Nov 19, 2026 (40 Days)",
        status: "IN_PROGRESS",
        deliverables: "Running ₹250/day ads. Generated 214 homeowner leads in first 13 days.",
        allocatedBudget: 10000,
        spent: 3250
      },
      {
        id: "cb-m4",
        stepNumber: 4,
        stepTotal: 5,
        phase: "Phase 4: Site Visits & Job Conversion",
        sprintDuration: "888 Hours / 37 Days (Sprint W2–W8)",
        sprintTag: "888h Conversion",
        sprintHours: 888,
        period: "Oct 15 - Nov 22, 2026",
        status: "IN_PROGRESS",
        deliverables: "Carpenters executing home visits, converting into 5 paid jobs/day.",
        allocatedBudget: 500,
        spent: 150
      },
      {
        id: "cb-m5",
        stepNumber: 5,
        stepTotal: 5,
        phase: "Phase 5: Escrow Payouts & Yield Distribution",
        sprintDuration: "72 Hours (Sprint W8)",
        sprintTag: "72h Settlement",
        sprintHours: 72,
        period: "Nov 25, 2026",
        status: "UPCOMING",
        deliverables: "Reconcile all 200 completed jobs, collect ₹20,000 commission, settle investor capital.",
        allocatedBudget: 500,
        spent: 0
      }
    ],

    // Live Operational Activity Feed ("What We Are Doing Right Now")
    liveUpdates: [
      { date: "Oct 13, 2026", time: "01:20 PM", note: "58 completed carpentry jobs verified. ₹5,800 direct commission deposited into platform escrow account.", author: "Alexander (Platform Lead)" },
      { date: "Oct 12, 2026", time: "10:45 AM", note: "Ad spend pacing at ₹250/day delivering ₹15.20 cost-per-lead, beating the ₹16.60 target model.", author: "Growth Marketing Desk" },
      { date: "Oct 10, 2026", time: "09:00 AM", note: "Launched Google Local Services Ads targeting luxury modular woodcraft inquiries in Chennai.", author: "Campaign Desk" }
    ],

    risksAndAssumptions: [
      "Leads are NOT sales. Only paid and completed jobs generate commission revenue.",
      "Full transaction value of furniture contracts (e.g. ₹25,000) is NOT platform revenue; platform only earns ₹100 lead fee.",
      "₹10,000 remaining after advertising is gross margin before CRM, caller salaries, payment fees, and lead leakage."
    ]
  },

  {
    id: "proj-wooden-laptop-case",
    name: "Wooden Laptop Case",
    category: "Product Manufacturing & Sales",
    status: "Planning",
    description: "Precision CNC milled seasoned timber luxury laptop sleeves with magnetic velvet latch fittings.",
    campaignStartDate: "2026-11-01",
    campaignEndDate: "2026-11-30",
    campaignDurationDays: 30,
    dailyAdBudget: 200,
    type: "PRODUCT_MANUFACTURING",

    // Complete Itemized Budget Allocation (All Costs, Not Just Ads)
    expenseBreakdown: [
      { item: "Seasoned Teak Timber & Walnut Lumber", amount: 37500, category: "Raw Materials (150 units)", verified: true, progress: "Vendor Quotation Approved" },
      { item: "Master CNC Milling & Finishing Labour", amount: 30000, category: "Direct Workshop Labour", verified: true, progress: "Artisan Schedule Blocked" },
      { item: "Magnetic Latches, Velvet Lining & Hardware", amount: 12000, category: "Hardware & Fittings", verified: true, progress: "Procurement In Progress" },
      { item: "Custom Rigid Box Packaging & Delivery Logistics", amount: 10500, category: "Packaging & Courier", verified: true, progress: "Sample Approved" },
      { item: "High-Resolution Product Shoot & Meta/Insta Ads", amount: 6000, category: "Advertising & Content", verified: true, progress: "Planning Launch" },
      { item: "Custom Tooling, Carbide Bits & Setup Jig", amount: 3500, category: "Tooling & Setup", verified: true, progress: "Jig Fabricated" }
    ],
    statedTotalBudget: 99500, // Total cost for 150 units batch
    capitalRequested: 99500,
    capitalRaised: 0,
    minInvestment: 2500,
    investorsCount: 0,
    expectedTermYield: "18.5% Net Term Yield",
    payoutTimeline: "Dec 15, 2026 (Batch Fulfillment)",
    upiId: "8248651695-3@ybl",

    // Unit Economics
    proposedSellingPrice: 1200,
    costBreakdownPerUnit: {
      rawWoodAndPaint: 250,
      cncMillingAndLabour: 200,
      fittingsAndVelvet: 80,
      packagingAndDelivery: 70
    },
    totalDirectCostPerUnit: 600, // Listed direct manufacturing & delivery cost per unit
    statedProfitTargetPerUnit: 500, // Stated profit before advertising (₹1,200 − ₹600 = ₹600 gross margin)
    
    // Production & Sales Targets
    testSalesTargetMin: 5,
    testSalesTargetMax: 10,
    productionTarget: 150, // Scenario: 150 units
    salesTarget: 150,

    // Actual Data Tracking
    actuals: {
      amountSpentToDate: 1200,
      verifiedExpenses: 1200,
      unitsProduced: 25,
      unitsSold: 18,
      revenueCollected: 21600,
      actualProductionCostPaid: 10800,
      otherOperatingExpenses: 400
    },

    // Detailed Project Execution Timeline & Time Sprints (Investor Visibility)
    timeline: [
      {
        id: "wlc-m1",
        stepNumber: 1,
        stepTotal: 5,
        phase: "Phase 1: Timber Seasoning & Moisture Testing",
        sprintDuration: "192 Hours / 8 Days (Prep Sprint)",
        sprintTag: "192h Prep",
        sprintHours: 192,
        period: "Oct 20 - Oct 28, 2026",
        status: "COMPLETED",
        deliverables: "Kiln-dried teak boards inspected for <10% moisture content to prevent heat warping.",
        allocatedBudget: 3500,
        spent: 3500
      },
      {
        id: "wlc-m2",
        stepNumber: 2,
        stepTotal: 5,
        phase: "Phase 2: CNC Tooling, Jigs & Prototype Batch",
        sprintDuration: "168 Hours / 7 Days (Pilot Sprint)",
        sprintTag: "168h Pilot",
        sprintHours: 168,
        period: "Oct 29 - Nov 05, 2026",
        status: "IN_PROGRESS",
        deliverables: "25 prototype sleeves milled. MacBook Pro 14 & 16 fitment tolerances verified.",
        allocatedBudget: 15000,
        spent: 8500
      },
      {
        id: "wlc-m3",
        stepNumber: 3,
        stepTotal: 5,
        phase: "Phase 3: Full Batch Production (150 Units)",
        sprintDuration: "336 Hours / 14 Days (Manufacturing Sprint)",
        sprintTag: "336h Production",
        sprintHours: 336,
        period: "Nov 06 - Nov 20, 2026",
        status: "UPCOMING",
        deliverables: "Assembly line sanding, natural wax polishing, velvet inner lining installation.",
        allocatedBudget: 65000,
        spent: 0
      },
      {
        id: "wlc-m4",
        stepNumber: 4,
        stepTotal: 5,
        phase: "Phase 4: D2C E-Commerce & Meta Ad Campaign",
        sprintDuration: "720 Hours / 30 Days (Sales Sprint)",
        sprintTag: "720h Sales",
        sprintHours: 720,
        period: "Nov 10 - Dec 10, 2026 (30 Days)",
        status: "UPCOMING",
        deliverables: "Run ₹200 daily ads across Instagram D2C luxury segments. Target 5-10 orders/day.",
        allocatedBudget: 6000,
        spent: 0
      },
      {
        id: "wlc-m5",
        stepNumber: 5,
        stepTotal: 5,
        phase: "Phase 5: Customer Shipping & Return Payout",
        sprintDuration: "480 Hours / 20 Days (Fulfillment Sprint)",
        sprintTag: "480h Delivery",
        sprintHours: 480,
        period: "Nov 25 - Dec 15, 2026",
        status: "UPCOMING",
        deliverables: "Shipment through BlueDart express. Settle raw material vendors and investor yield.",
        allocatedBudget: 10000,
        spent: 0
      }
    ],

    // Live Operational Activity Feed ("What We Are Doing Right Now")
    liveUpdates: [
      { date: "Oct 13, 2026", time: "10:00 AM", note: "CNC toolpaths optimized on 3-axis router, reducing milling cycle from 42 mins to 27 mins per sleeve.", author: "Alexander (Workshop Lead)" },
      { date: "Oct 11, 2026", time: "03:45 PM", note: "First 25 pilot pieces inspected: velvet latch alignment passed 100% test. Ready for batch procurement.", author: "Quality Inspection Desk" }
    ],

    risksAndAssumptions: [
      "Stated profit target of ₹500 requires ₹100 unallocated cost buffer (₹1,200 − ₹600 = ₹600 gross margin before ads).",
      "Scenario with 150 units: Gross Revenue = ₹1,80,000, Production Cost = ₹90,000, Ads = ₹6,000, Remaining = ₹84,000 before taxes, unlisted freight, and customer returns.",
      "Moisture variation in timber requires seasoning testing to prevent warping under laptop heat."
    ]
  },

  {
    id: "proj-bamboo-cup",
    name: "Bamboo Cup",
    category: "Eco-Friendly Product Manufacturing",
    status: "Testing",
    description: "Sustainably harvested organic bamboo drinking cups with food-safe natural oil sealant for eco-conscious retail.",
    campaignStartDate: "2026-10-20",
    campaignEndDate: "2026-11-20",
    campaignDurationDays: 30,
    dailyAdBudget: 200,
    type: "PRODUCT_MANUFACTURING",

    // Complete Itemized Budget Allocation (All Costs, Not Just Ads)
    expenseBreakdown: [
      { item: "Organic Bamboo Stalks Sourcing (100–150 units)", amount: 7500, category: "Raw Materials (₹50/cup)", verified: true, progress: "Stored in Dry Room" },
      { item: "Artisan Wood-Lathe Turning & Labour", amount: 15000, category: "Craft Labour (₹100/cup)", verified: true, progress: "Artisans Contracted" },
      { item: "Food-Grade Plant Wax & Sandpaper Finishing", amount: 6000, category: "Finishing & Sealant (₹40/cup)", verified: true, progress: "Testing Certified" },
      { item: "Plastic-Free Kraft Packaging & Courier Surcharges", amount: 9000, category: "Packaging & Delivery (₹60/cup)", verified: true, progress: "Boxes Printed" },
      { item: "Social Media D2C Video Ads (₹200/day × 30 days)", amount: 6000, category: "Advertising & Acquisition", verified: true, progress: "Creative Ready" },
      { item: "Food Safety Lab Testing & Compliance Certificate", amount: 2500, category: "Compliance & Safety", verified: true, progress: "Certificate Issued" }
    ],
    statedTotalBudget: 46000,
    capitalRequested: 46000,
    capitalRaised: 0,
    minInvestment: 1000,
    investorsCount: 0,
    expectedTermYield: "16.0% Net Term Yield",
    payoutTimeline: "Dec 05, 2026 (Batch Distribution)",
    upiId: "8248651695-3@ybl",

    // Unit Economics
    proposedSellingPrice: 499,
    costBreakdownPerUnit: {
      bambooMaterial: 50,
      craftLabour: 100,
      sandpaperAndFinishing: 40, // Verified supplier quote
      packagingAndCourier: 60,
      paymentGatewayFees: 15
    },
    totalDirectCostPerUnit: 265, // Sum of unit costs (50+100+40+60+15)
    statedProfitEstimatePerUnit: 199, // Stated profit requiring verification
    statedTotalProfitTarget: 20000,

    // Scenario Analysis Options
    productionScenario: 100, // toggleable between 100 and 150
    productionTarget: 100,
    salesTarget: 100,

    // Actual Data Tracking
    actuals: {
      amountSpentToDate: 800,
      verifiedExpenses: 800,
      unitsProduced: 60,
      unitsSold: 42,
      revenueCollected: 20958,
      actualProductionCostPaid: 11130,
      otherOperatingExpenses: 520
    },

    // Detailed Project Execution Timeline & Time Sprints (Investor Visibility)
    timeline: [
      {
        id: "bc-m1",
        stepNumber: 1,
        stepTotal: 5,
        phase: "Phase 1: Sustainable Stalk Harvesting & Curing",
        sprintDuration: "216 Hours / 9 Days (Harvest Sprint)",
        sprintTag: "216h Harvest",
        sprintHours: 216,
        period: "Oct 05 - Oct 14, 2026",
        status: "COMPLETED",
        deliverables: "Organic thick-walled bamboo culms harvested, cured against fungal moisture.",
        allocatedBudget: 7500,
        spent: 5000
      },
      {
        id: "bc-m2",
        stepNumber: 2,
        stepTotal: 5,
        phase: "Phase 2: Food-Grade Certification & Wax Prep",
        sprintDuration: "120 Hours / 5 Days (Compliance Sprint)",
        sprintTag: "120h Testing",
        sprintHours: 120,
        period: "Oct 15 - Oct 20, 2026",
        status: "COMPLETED",
        deliverables: "Certified non-toxic plant oil sealant verified by laboratory test report.",
        allocatedBudget: 2500,
        spent: 2500
      },
      {
        id: "bc-m3",
        stepNumber: 3,
        stepTotal: 5,
        phase: "Phase 3: Artisan Lathe Turning (Batch Production)",
        sprintDuration: "360 Hours / 15 Days (Craft Sprint)",
        sprintTag: "360h Production",
        sprintHours: 360,
        period: "Oct 21 - Nov 05, 2026",
        status: "IN_PROGRESS",
        deliverables: "60 cups turned, 42 polished. Remaining 40-90 cups in active production queue.",
        allocatedBudget: 15000,
        spent: 6000
      },
      {
        id: "bc-m4",
        stepNumber: 4,
        stepTotal: 5,
        phase: "Phase 4: Eco-Packaging & Social Media Ad Campaign",
        sprintDuration: "720 Hours / 30 Days (Marketing Sprint)",
        sprintTag: "720h Campaign",
        sprintHours: 720,
        period: "Oct 25 - Nov 24, 2026 (30 Days)",
        status: "IN_PROGRESS",
        deliverables: "₹200/day ads running on Instagram targeting zero-waste eco communities.",
        allocatedBudget: 6000,
        spent: 800
      },
      {
        id: "bc-m5",
        stepNumber: 5,
        stepTotal: 5,
        phase: "Phase 5: Retail Deliveries & Investor Payout",
        sprintDuration: "240 Hours / 10 Days (Distribution & Payout Sprint)",
        sprintTag: "240h Settlement",
        sprintHours: 240,
        period: "Nov 25 - Dec 05, 2026",
        status: "UPCOMING",
        deliverables: "Fulfill all 100–150 customer orders, collect ₹49,900 to ₹74,850, settle investor accounts.",
        allocatedBudget: 9000,
        spent: 0
      }
    ],

    // Live Operational Activity Feed ("What We Are Doing Right Now")
    liveUpdates: [
      { date: "Oct 13, 2026", time: "09:15 AM", note: "42 bamboo cups packed in plastic-free recycled corrugated sleeves with jute tags.", author: "Alexander (Craft Manager)" },
      { date: "Oct 11, 2026", time: "04:30 PM", note: "Food contact safety certificate received from SGS partner lab. 100% organic certification confirmed.", author: "Compliance Desk" }
    ],

    risksAndAssumptions: [
      "Unit economics: ₹499 − ₹50 (material) − ₹100 (labour) = ₹349 remaining before finishing, packing, shipping, and advertising.",
      "Stated ₹199 profit per cup requires all remaining costs to be kept strictly under ₹150 per cup.",
      "Scenario 100 units: Revenue = ₹49,900, Stated Profit = ₹19,900.",
      "Scenario 150 units: Revenue = ₹74,850, Stated Profit = ₹29,850.",
      "Must verify if ₹199 estimate includes or excludes ₹6,000 advertising spend before declaring final investor returns."
    ]
  }
];

// Helper: Calculate Comprehensive Financials with Complete Audit Trail
export const calculateProjectFinancials = (project, customScenarioUnits = null) => {
  const duration = Number(project.campaignDurationDays) || 0;
  const dailyAd = Number(project.dailyAdBudget) || 0;
  const totalAdSpend = dailyAd * duration;

  let projectedRevenue = 0;
  let directCosts = 0;
  let projectedGrossProfit = 0;
  let projectedNetProfit = 0;
  let remainingAfterAds = 0;

  // Total All Non-Ad Operating & Setup Expenses from itemized breakdown
  const nonAdExpenses = (project.expenseBreakdown || [])
    .filter(e => !e.category.toLowerCase().includes('ad') && !e.item.toLowerCase().includes('ad'))
    .reduce((sum, e) => sum + (Number(e.amount) || 0), 0);

  if (project.type === 'COMMISSION_MARKETPLACE') {
    // Marketplace Commission Model (CarpenterBullet)
    const salesCount = customScenarioUnits !== null ? customScenarioUnits : (Number(project.campaignSalesTarget) || 0);
    const commPerSale = Number(project.commissionPerCompletedSale) || 0;
    
    // Revenue is strictly the commission earned!
    projectedRevenue = salesCount * commPerSale;
    directCosts = 0; // Marketplace has no inventory or manufacturing cost
    projectedGrossProfit = projectedRevenue;
    remainingAfterAds = projectedRevenue - totalAdSpend;

    projectedNetProfit = remainingAfterAds - (Number(project.expenseBreakdown?.find(e => e.category.includes('Operations'))?.amount) || 0);

  } else if (project.type === 'SERVICE_ORDER') {
    // Service / Cloud Kitchen Model (UnavuKadai Jasai)
    const orders = customScenarioUnits !== null ? customScenarioUnits : (Number(project.totalOrderTarget) || 0);
    const avgBasket = Number(project.avgSellingPricePerUnit) || 250;
    const directUnitCost = (Number(project.directCostPerUnit) || 0) + (Number(project.deliveryCostPerUnit) || 0);

    projectedRevenue = orders * avgBasket;
    directCosts = orders * directUnitCost;
    projectedGrossProfit = projectedRevenue - directCosts;
    remainingAfterAds = projectedGrossProfit - totalAdSpend;

    const setupExpenses = (project.expenseBreakdown || [])
      .filter(e => !e.category.toLowerCase().includes('ad'))
      .reduce((sum, e) => sum + (Number(e.amount) || 0), 0);

    projectedNetProfit = projectedGrossProfit - totalAdSpend - setupExpenses;

  } else {
    // Product Manufacturing Model (Wooden Case, Bamboo Cup)
    const units = customScenarioUnits !== null ? customScenarioUnits : (Number(project.productionTarget) || 0);
    const sellingPrice = Number(project.proposedSellingPrice) || 0;
    const unitCost = Number(project.totalDirectCostPerUnit) || 0;

    projectedRevenue = units * sellingPrice;
    directCosts = units * unitCost;
    projectedGrossProfit = projectedRevenue - directCosts;
    remainingAfterAds = projectedGrossProfit - totalAdSpend;

    const toolingAndCompliance = (project.expenseBreakdown || [])
      .filter(e => e.category.includes('Tooling') || e.category.includes('Compliance'))
      .reduce((sum, e) => sum + (Number(e.amount) || 0), 0);

    projectedNetProfit = projectedGrossProfit - totalAdSpend - toolingAndCompliance;
  }

  // Actuals Performance Metrics
  const actuals = project.actuals || {};
  const actualRevenue = Number(actuals.revenueCollected || actuals.commissionActuallyCollected || actuals.prepaidAmountCollected || 0);
  const actualSpent = Number(actuals.amountSpentToDate || 0);
  const actualVerifiedExpenses = Number(actuals.verifiedExpenses || actuals.verifiedDirectCosts || 0);
  const actualOperatingProfit = actualRevenue - actualSpent;
  const capitalRequested = Number(project.capitalRequested || project.statedTotalBudget || 0);
  const remainingCapitalToDeploy = Math.max(capitalRequested - actualSpent, 0);

  // Milestone Progress
  const totalMilestones = (project.timeline || []).length;
  const completedMilestones = (project.timeline || []).filter(m => m.status === 'COMPLETED').length;
  const timelineProgressPercent = totalMilestones > 0 ? Math.round((completedMilestones / totalMilestones) * 100) : 0;

  const capitalRaised = Number(project.capitalRaised || 0);
  const fundingPercent = Math.min(Math.round((capitalRaised / (capitalRequested || 1)) * 100), 100);
  const remainingFundingNeeded = Math.max(capitalRequested - capitalRaised, 0);

  return {
    totalAdSpend,
    nonAdExpenses,
    totalAllCosts: totalAdSpend + directCosts + nonAdExpenses,
    projectedRevenue,
    directCosts,
    projectedGrossProfit,
    remainingAfterAds,
    projectedNetProfit,
    actualRevenue,
    actualSpent,
    actualVerifiedExpenses,
    actualOperatingProfit,
    capitalRequested,
    capitalRaised,
    fundingPercent,
    remainingFundingNeeded,
    investorsCount: Number(project.investorsCount || 0),
    minInvestment: Number(project.minInvestment || 500),
    expectedTermYield: project.expectedTermYield || "14.5% Net Term Yield",
    payoutTimeline: project.payoutTimeline || "Sprint Completion",
    remainingCapitalToDeploy,
    timelineProgressPercent,
    completedMilestones,
    totalMilestones,
    isCommissionModel: project.type === 'COMMISSION_MARKETPLACE'
  };
};

// AI Natural Language Financial Assumption Parser
export const parseNaturalLanguagePlan = (text) => {
  if (!text || typeof text !== 'string') {
    return { error: "Please provide natural language text to analyze." };
  }

  const raw = text.trim();

  // 1. Daily Ads
  const dailyAdsMatch = raw.match(/(?:₹|rs\.?|inr)?\s*(\d+(?:,\d+)*(?:\.\d+)?)\s*(?:daily\s+ads?|per\s+day\s+(?:for\s+ads?|ad\s+spend|meta\s+ads?)|daily\s+budget|a\s+day)/i) ||
                        raw.match(/run\s+(?:₹|rs\.?|inr)?\s*(\d+(?:,\d+)*)\s+daily/i);
  const dailyAds = dailyAdsMatch ? parseFloat(dailyAdsMatch[1].replace(/,/g, '')) : null;

  // 2. Campaign Duration (Days)
  const daysMatch = raw.match(/(\d+)\s*(?:days?|day\s+campaign|day\s+period)/i);
  const days = daysMatch ? parseInt(daysMatch[1], 10) : null;

  // 3. Leads Target per day or total
  const leadsPerDayMatch = raw.match(/(\d+)\s*(?:to\s*(\d+))?\s*(?:leads?\s*(?:per\s*day|a\s*day|\/day))/i) ||
                           raw.match(/generate\s*(\d+)\s*leads/i);
  const leadsMin = leadsPerDayMatch ? parseInt(leadsPerDayMatch[1], 10) : null;
  const leadsMax = (leadsPerDayMatch && leadsPerDayMatch[2]) ? parseInt(leadsPerDayMatch[2], 10) : leadsMin;

  // 4. Sales Target per day or total
  const salesDailyMatch = raw.match(/(?:convert\s*)?(\d+)\s*(?:leads?\s*into\s*)?(?:paid\s+)?sales?\s*(?:per\s*day|a\s*day|\/day)/i);
  const salesDaily = salesDailyMatch ? parseInt(salesDailyMatch[1], 10) : null;

  const totalSalesMatch = raw.match(/(?:target|total|campaign)?\s*(\d+)\s*(?:completed\s+)?(?:paid\s+)?sales/i) ||
                          raw.match(/(\d+)\s*(?:orders?|pieces?|units?|cups?)\s*(?:target|sold|total)/i);
  const totalSales = totalSalesMatch ? parseInt(totalSalesMatch[1], 10) : (salesDaily && days ? salesDaily * days : null);

  // 5. Commission per completed sale
  const commMatch = raw.match(/(?:₹|rs\.?|inr)?\s*(\d+(?:,\d+)*)\s*commission\s*(?:per\s*(?:completed\s*)?sale)?/i) ||
                    raw.match(/earn\s*(?:₹|rs\.?|inr)?\s*(\d+(?:,\d+)*)\s*commission/i);
  const commission = commMatch ? parseFloat(commMatch[1].replace(/,/g, '')) : null;

  // 6. Selling Price per unit
  const priceMatch = raw.match(/(?:selling\s+price|price\s+per\s+piece|price\s+per\s+cup|price\s+per\s+unit|for\s*₹)\s*(?:₹|rs\.?|inr)?\s*(\d+(?:,\d+)*)/i);
  const sellingPrice = priceMatch ? parseFloat(priceMatch[1].replace(/,/g, '')) : null;

  // 7. Cost per unit
  const costMatch = raw.match(/(?:cost\s+per\s+(?:piece|unit|cup)|making\s+cost|direct\s+cost)\s*(?:of|is|:)?\s*(?:₹|rs\.?|inr)?\s*(\d+(?:,\d+)*)/i);
  const unitCost = costMatch ? parseFloat(costMatch[1].replace(/,/g, '')) : null;

  // Calculated / Extracted values
  const totalAdBudget = (dailyAds && days) ? dailyAds * days : null;
  let projectedRevenue = null;
  let remainingAfterAds = null;
  let modelType = "PRODUCT_MANUFACTURING";

  if (commission !== null && totalSales !== null) {
    modelType = "COMMISSION_MARKETPLACE";
    projectedRevenue = totalSales * commission;
    if (totalAdBudget !== null) {
      remainingAfterAds = projectedRevenue - totalAdBudget;
    }
  } else if (sellingPrice !== null && totalSales !== null) {
    projectedRevenue = totalSales * sellingPrice;
    if (totalAdBudget !== null && unitCost !== null) {
      remainingAfterAds = projectedRevenue - (totalSales * unitCost) - totalAdBudget;
    }
  }

  const missingInfo = [];
  const contradictions = [];
  const clarificationQuestions = [];

  if (!dailyAds) missingInfo.push("Daily advertising budget is not specified.");
  if (!days) missingInfo.push("Campaign duration in days is not specified.");
  if (!totalSales && !salesDaily) missingInfo.push("Sales target or daily conversion target is missing.");

  if (commission && modelType === "COMMISSION_MARKETPLACE") {
    if (leadsMin && salesDaily && salesDaily > leadsMin) {
      contradictions.push(`Target sales (${salesDaily}/day) cannot exceed target leads (${leadsMin}/day).`);
    }
  }

  if (modelType === "COMMISSION_MARKETPLACE" && remainingAfterAds !== null) {
    clarificationQuestions.push(
      `Projected commission revenue is ₹${projectedRevenue.toLocaleString('en-IN')}, and amount remaining after advertising is ₹${remainingAfterAds.toLocaleString('en-IN')}. Note: This is gross margin before operating expenses.`
    );
  }

  return {
    originalInput: raw,
    extractedValues: {
      modelType,
      dailyAdBudget: dailyAds,
      campaignDurationDays: days,
      totalAdBudget,
      leadsPerDay: leadsMin ? `${leadsMin}${leadsMax && leadsMax !== leadsMin ? '–' + leadsMax : ''}` : null,
      salesTargetPerDay: salesDaily,
      totalSalesTarget: totalSales,
      commissionPerSale: commission,
      sellingPrice,
      unitCost,
      projectedRevenue,
      remainingAfterAds
    },
    missingInfo,
    contradictions,
    clarificationQuestions,
    isEstimateOnly: true,
    confidenceScore: (!missingInfo.length && !contradictions.length) ? 'High' : 'Needs Review'
  };
};
