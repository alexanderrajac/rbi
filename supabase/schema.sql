-- =========================================================================
-- ROYAL BANK OF INVESTMENT (RBI) - SUPABASE DATABASE SCHEMA
-- Designated Sovereign Admin: rajacofficial369@gmail.com
-- =========================================================================

-- 1. Business Projects Table
CREATE TABLE IF NOT EXISTS public.business_projects (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'Active',
    description TEXT,
    type TEXT DEFAULT 'SERVICE_ORDER',
    capital_requested NUMERIC NOT NULL DEFAULT 0,
    capital_raised NUMERIC NOT NULL DEFAULT 0,
    min_investment NUMERIC NOT NULL DEFAULT 500,
    investors_count INTEGER NOT NULL DEFAULT 0,
    expected_term_yield TEXT,
    payout_timeline TEXT,
    expense_breakdown JSONB DEFAULT '[]'::jsonb,
    timeline JSONB DEFAULT '[]'::jsonb,
    live_updates JSONB DEFAULT '[]'::jsonb,
    actuals JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Project Investments Table (Investor Orders / Payment Submissions)
CREATE TABLE IF NOT EXISTS public.project_investments (
    id TEXT PRIMARY KEY,
    project_id TEXT REFERENCES public.business_projects(id) ON DELETE CASCADE,
    project_name TEXT NOT NULL,
    category TEXT,
    investor_name TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    amount NUMERIC NOT NULL,
    payment_method TEXT DEFAULT 'UPI',
    utr_number TEXT,
    screenshot_url TEXT,
    date TEXT,
    timestamp BIGINT,
    expected_yield TEXT,
    payout_timeline TEXT,
    note TEXT,
    status TEXT NOT NULL DEFAULT 'PENDING_APPROVAL', -- 'PENDING_APPROVAL' | 'CONFIRMED' | 'REJECTED'
    rejection_reason TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Fund Contributions Table
CREATE TABLE IF NOT EXISTS public.fund_contributions (
    id TEXT PRIMARY KEY,
    contributor_name TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    amount NUMERIC NOT NULL,
    payment_method TEXT DEFAULT 'UPI',
    date TEXT,
    timestamp BIGINT,
    note TEXT,
    status TEXT NOT NULL DEFAULT 'COMPLETED',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Project History / Audit Trail
CREATE TABLE IF NOT EXISTS public.project_history (
    id TEXT PRIMARY KEY,
    project_id TEXT,
    timestamp TEXT,
    user_name TEXT,
    action TEXT NOT NULL,
    note TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =========================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =========================================================================

ALTER TABLE public.business_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_investments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fund_contributions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_history ENABLE ROW LEVEL SECURITY;

-- Business Projects: Public can read, ONLY rajacofficial369@gmail.com can modify
DROP POLICY IF EXISTS "Public can view business projects" ON public.business_projects;
CREATE POLICY "Public can view business projects"
    ON public.business_projects FOR SELECT
    USING (true);

DROP POLICY IF EXISTS "Only admin can modify business projects" ON public.business_projects;
CREATE POLICY "Only admin can modify business projects"
    ON public.business_projects FOR ALL
    USING (auth.jwt() ->> 'email' = 'rajacofficial369@gmail.com')
    WITH CHECK (auth.jwt() ->> 'email' = 'rajacofficial369@gmail.com');

-- Project Investments: Anyone can submit payments, public can view approved, admin can manage all
DROP POLICY IF EXISTS "Public can view investments" ON public.project_investments;
CREATE POLICY "Public can view investments"
    ON public.project_investments FOR SELECT
    USING (true);

DROP POLICY IF EXISTS "Anyone can submit investment payments" ON public.project_investments;
CREATE POLICY "Anyone can submit investment payments"
    ON public.project_investments FOR INSERT
    WITH CHECK (true);

DROP POLICY IF EXISTS "Only admin can update or delete investments" ON public.project_investments;
CREATE POLICY "Only admin can update or delete investments"
    ON public.project_investments FOR UPDATE
    USING (auth.jwt() ->> 'email' = 'rajacofficial369@gmail.com')
    WITH CHECK (auth.jwt() ->> 'email' = 'rajacofficial369@gmail.com');

-- Fund Contributions: Public can view, anyone can contribute
DROP POLICY IF EXISTS "Public can view contributions" ON public.fund_contributions;
CREATE POLICY "Public can view contributions"
    ON public.fund_contributions FOR SELECT
    USING (true);

DROP POLICY IF EXISTS "Anyone can submit contributions" ON public.fund_contributions;
CREATE POLICY "Anyone can submit contributions"
    ON public.fund_contributions FOR INSERT
    WITH CHECK (true);

-- Project History: Public can view audit trail
DROP POLICY IF EXISTS "Public can view project history" ON public.project_history;
CREATE POLICY "Public can view project history"
    ON public.project_history FOR SELECT
    USING (true);

DROP POLICY IF EXISTS "Anyone can insert project history" ON public.project_history;
CREATE POLICY "Anyone can insert project history"
    ON public.project_history FOR INSERT
    WITH CHECK (true);

-- =========================================================================
-- SEED INITIAL 4 BUSINESS VENTURES (Strict Zero Capital Baseline)
-- =========================================================================

INSERT INTO public.business_projects (id, name, category, status, description, type, capital_requested, capital_raised, min_investment, expected_term_yield, payout_timeline)
VALUES
('proj-unavukadai', 'UnavuKadai', 'Food Delivery & Cloud Kitchen', 'Active', 'Launch marketing campaign and hyper-local food delivery order acquisition across Vadamadurai / Thudiyalur cluster.', 'SERVICE_ORDER', 4000, 0, 500, '14.2% Net Term Yield', 'Oct 22, 2026 (6-Day Sprint)'),
('proj-carpenterbullet', 'CarpenterBullet', 'Commission-Based Marketplace', 'Active', 'Digital lead generation and carpenter job routing marketplace connecting homeowners with master carpentry guilds.', 'COMMISSION_MARKETPLACE', 10000, 0, 1000, '15.0% Commission Pool Yield', 'Nov 25, 2026 (40-Day Sprint)'),
('proj-wooden-laptop-case', 'Wooden Laptop Case', 'Product Manufacturing & Sales', 'Planning', 'Precision CNC milled seasoned timber luxury laptop sleeves with magnetic velvet latch fittings.', 'PRODUCT_MANUFACTURING', 99500, 0, 2500, '18.5% Net Term Yield', 'Dec 15, 2026 (Batch Fulfillment)'),
('proj-bamboo-cup', 'Wooden Cup', 'Artisan Wooden Product Manufacturing', 'Testing', 'Handcrafted artisan natural wooden drinking cups and tumblers turned from seasoned timber with food-safe plant wax sealant for eco-conscious retail.', 'PRODUCT_MANUFACTURING', 46000, 0, 500, '16.0% Net Term Yield', 'Dec 05, 2026 (Batch Distribution)')
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    category = EXCLUDED.category,
    status = EXCLUDED.status,
    description = EXCLUDED.description,
    type = EXCLUDED.type,
    capital_requested = EXCLUDED.capital_requested,
    min_investment = EXCLUDED.min_investment,
    expected_term_yield = EXCLUDED.expected_term_yield,
    payout_timeline = EXCLUDED.payout_timeline,
    updated_at = NOW();
