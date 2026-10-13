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
    campaignDurationDays: 6,
    dailyAdBudget: 200,
    type: "SERVICE_ORDER", // 'SERVICE_ORDER' | 'COMMISSION_MARKETPLACE' | 'PRODUCT_MANUFACTURING'
    
    // Listed Expenses Breakdown
    expenseBreakdown: [
      { item: "Meta Ads (₹200/day × 6 days)", amount: 1200, category: "Advertising", verified: true },
      { item: "Posters & Print Collateral", amount: 1000, category: "Marketing Materials", verified: true },
      { item: "Launch Banner Setup", amount: 500, category: "Signage", verified: true },
      { item: "Domain & Web Setup", amount: 1100, category: "Digital Assets", verified: true },
      { item: "Reservation & Ancillary Expense", amount: 200, category: "Operating Contingency", verified: false }
    ],
    statedTotalBudget: 4000, // Note: Corrected from erroneous ₹4,400
    capitalRequested: 4000,

    // Targets & Unit Economics
    dailyOrderTarget: 10,
    totalOrderTarget: 60,
    avgSellingPricePerUnit: 250, // Average basket size per order (₹)
    directCostPerUnit: 140, // Food prep + packaging cost per order (₹)
    deliveryCostPerUnit: 40, // Delivery rider fee (₹)
    statedPerOrderMarginFee: 60, // Unconfirmed fee: 6 × ₹60 = ₹360 calculation flagged for verification

    // Actual Data Tracking
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

    risksAndAssumptions: [
      "Weather and delivery rider availability in Thudiyalur cluster can impact fulfillment times.",
      "Stated ₹60 fee metric (6 × ₹60 = ₹360) requires formal operational definition before factoring into final margin projections.",
      "Listed expenses total ₹4,000; earlier ₹4,400 proposal contained an unverified ₹400 discrepancy now resolved."
    ]
  },

  {
    id: "proj-carpenterbullet",
    name: "CarpenterBullet",
    category: "Commission-Based Marketplace",
    status: "Active",
    description: "Digital lead generation and carpenter job routing marketplace connecting homeowners with master carpentry guilds.",
    campaignStartDate: "2026-10-10",
    campaignDurationDays: 40,
    dailyAdBudget: 250,
    type: "COMMISSION_MARKETPLACE",

    expenseBreakdown: [
      { item: "Meta & Google Lead Ads (₹250/day × 40 days)", amount: 10000, category: "Advertising", verified: true },
      { item: "CRM & Tele-verification Staffing", amount: 1500, category: "Operating", verified: false },
      { item: "Escrow Payment Gateway Charges", amount: 500, category: "Processing", verified: false }
    ],
    statedTotalBudget: 10000,
    capitalRequested: 10000,

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
    campaignDurationDays: 30,
    dailyAdBudget: 200,
    type: "PRODUCT_MANUFACTURING",

    expenseBreakdown: [
      { item: "Digital Ads (₹200/day × 30 days)", amount: 6000, category: "Advertising", verified: true },
      { item: "Tooling & CNC Setup Jig", amount: 3500, category: "Machinery Setup", verified: false }
    ],
    statedTotalBudget: 9500,
    capitalRequested: 9500,

    // Unit Economics
    proposedSellingPrice: 1200,
    costBreakdownPerUnit: {
      rawWoodAndPaint: 250,
      cncMillingAndLabour: 200,
      fittingsAndVelvet: 80,
      packagingAndDelivery: 70
    },
    totalDirectCostPerUnit: 600, // Listed cost per unit
    statedProfitTargetPerUnit: 500, // Stated profit before advertising (discrepancy: 1200 - 600 = 600)
    
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
    campaignDurationDays: 30,
    dailyAdBudget: 200,
    type: "PRODUCT_MANUFACTURING",

    expenseBreakdown: [
      { item: "Social Media Ads (₹200/day × 30 days)", amount: 6000, category: "Advertising", verified: true },
      { item: "Food-Grade Certification & Testing", amount: 2500, category: "Compliance", verified: false }
    ],
    statedTotalBudget: 8500,
    capitalRequested: 8500,

    // Unit Economics
    proposedSellingPrice: 499,
    costBreakdownPerUnit: {
      bambooMaterial: 50,
      craftLabour: 100,
      sandpaperAndFinishing: 40, // Estimated pending final supplier verification
      packagingAndCourier: 60,
      paymentGatewayFees: 15
    },
    totalDirectCostPerUnit: 265, // Sum of unit costs
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

  if (project.type === 'COMMISSION_MARKETPLACE') {
    // Marketplace Commission Model (CarpenterBullet)
    const salesCount = customScenarioUnits !== null ? customScenarioUnits : (Number(project.campaignSalesTarget) || 0);
    const commPerSale = Number(project.commissionPerCompletedSale) || 0;
    
    // Revenue is strictly the commission earned!
    projectedRevenue = salesCount * commPerSale;
    directCosts = 0; // Marketplace has no inventory or manufacturing cost
    projectedGrossProfit = projectedRevenue;
    remainingAfterAds = projectedRevenue - totalAdSpend;
    
    // Other operating costs from breakdown
    const otherCosts = (project.expenseBreakdown || [])
      .filter(e => e.category !== 'Advertising')
      .reduce((sum, e) => sum + (Number(e.amount) || 0), 0);

    projectedNetProfit = remainingAfterAds - otherCosts;

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
      .filter(e => e.category !== 'Advertising')
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

    const otherCosts = (project.expenseBreakdown || [])
      .filter(e => e.category !== 'Advertising')
      .reduce((sum, e) => sum + (Number(e.amount) || 0), 0);

    projectedNetProfit = projectedGrossProfit - totalAdSpend - otherCosts;
  }

  // Actuals Performance Metrics
  const actuals = project.actuals || {};
  const actualRevenue = Number(actuals.revenueCollected || actuals.commissionActuallyCollected || actuals.prepaidAmountCollected || 0);
  const actualSpent = Number(actuals.amountSpentToDate || 0);
  const actualVerifiedExpenses = Number(actuals.verifiedExpenses || actuals.verifiedDirectCosts || 0);
  const actualOperatingProfit = actualRevenue - actualSpent;

  return {
    totalAdSpend,
    projectedRevenue,
    directCosts,
    projectedGrossProfit,
    remainingAfterAds,
    projectedNetProfit,
    actualRevenue,
    actualSpent,
    actualVerifiedExpenses,
    actualOperatingProfit,
    capitalRequested: Number(project.capitalRequested || project.statedTotalBudget || 0),
    isCommissionModel: project.type === 'COMMISSION_MARKETPLACE'
  };
};

// AI Natural Language Financial Assumption Parser
export const parseNaturalLanguagePlan = (text) => {
  if (!text || typeof text !== 'string') {
    return { error: "Please provide natural language text to analyze." };
  }

  const raw = text.trim();
  const lower = raw.toLowerCase();

  // Pattern extractors
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

  // Auditing & Contradiction Detection
  const contradictions = [];
  const missingInfo = [];
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
      `Projected commission revenue is ₹${projectedRevenue.toLocaleString('en-IN')}, and amount remaining after advertising is ₹${remainingAfterAds.toLocaleString('en-IN')}. Note: This is NOT guaranteed net profit. Confirm if caller salaries, CRM tools, or processing fees apply.`
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
