import { supabase } from './supabase';
import { INITIAL_BUSINESS_PROJECTS } from '../data/businessProjectsData';
import { INITIAL_PROJECT_INVESTMENTS } from '../data/mockStartups';

export const ADMIN_EMAIL = 'rajacofficial369@gmail.com';

/**
 * Checks whether the given user or email is the designated sovereign administrator.
 */
export const isSuperAdmin = (userOrEmail) => {
  if (!userOrEmail) return false;
  const email = typeof userOrEmail === 'string' 
    ? userOrEmail 
    : userOrEmail?.email;
  return email?.toLowerCase().trim() === ADMIN_EMAIL.toLowerCase();
};

/**
 * Fetch business projects from Supabase with graceful fallback to local data.
 */
export const fetchBusinessProjects = async () => {
  try {
    const { data, error } = await supabase
      .from('business_projects')
      .select('*')
      .order('created_at', { ascending: true });

    if (error) {
      console.warn('Supabase projects fetch warning (falling back to cache):', error.message);
      return null;
    }

    // Always guarantee all 4 ventures from INITIAL_BUSINESS_PROJECTS exist!
    const mergedProjects = INITIAL_BUSINESS_PROJECTS.map(initial => {
      if (!data || data.length === 0) return initial;
      const item = data.find(p => p.id === initial.id);
      if (!item) return initial;

      // Ensure clean name (if Supabase has old Bamboo Cup, use initial name Wooden Cup)
      const cleanName = (item.name === 'Bamboo Cup' || !item.name) ? initial.name : item.name;

      return {
        ...initial,
        ...item,
        name: cleanName,
        category: item.category || initial.category,
        capitalRequested: item.capital_requested !== undefined ? Number(item.capital_requested) : (item.capitalRequested !== undefined ? Number(item.capitalRequested) : initial.capitalRequested),
        capitalRaised: item.capital_raised !== undefined ? Number(item.capital_raised) : (item.capitalRaised !== undefined ? Number(item.capitalRaised) : (initial.capitalRaised || 0)),
        minInvestment: item.min_investment !== undefined ? Number(item.min_investment) : (item.minInvestment !== undefined ? Number(item.minInvestment) : initial.minInvestment),
        investorsCount: item.investors_count !== undefined ? Number(item.investors_count) : (item.investorsCount !== undefined ? Number(item.investorsCount) : (initial.investorsCount || 0)),
        expectedTermYield: item.expected_term_yield || item.expectedTermYield || initial.expectedTermYield,
        payoutTimeline: item.payout_timeline || item.payoutTimeline || initial.payoutTimeline,
        expenseBreakdown: (item.expense_breakdown && Array.isArray(item.expense_breakdown) && item.expense_breakdown.length > 0) 
          ? item.expense_breakdown 
          : (initial.expenseBreakdown || []),
        timeline: (item.timeline && Array.isArray(item.timeline) && item.timeline.length > 0) 
          ? item.timeline 
          : (initial.timeline || []),
        liveUpdates: (item.live_updates && Array.isArray(item.live_updates) && item.live_updates.length > 0) 
          ? item.live_updates 
          : (initial.liveUpdates || []),
        actuals: item.actuals || initial.actuals || {}
      };
    });

    // Also include any user-created custom projects from Supabase
    const customProjects = (data || []).filter(item => !INITIAL_BUSINESS_PROJECTS.some(init => init.id === item.id));
    return [...mergedProjects, ...customProjects];
  } catch (err) {
    console.warn('Supabase network notice:', err?.message || err);
  }
  return INITIAL_BUSINESS_PROJECTS;
};

/**
 * Upsert or update a business project in Supabase.
 */
export const syncBusinessProjectToSupabase = async (project) => {
  if (!project?.id) return;
  try {
    const payload = {
      id: project.id,
      name: project.name,
      category: project.category,
      status: project.status,
      description: project.description,
      type: project.type,
      capital_requested: project.capitalRequested,
      capital_raised: project.capitalRaised,
      min_investment: project.minInvestment,
      investors_count: project.investorsCount,
      expected_term_yield: project.expectedTermYield,
      payout_timeline: project.payoutTimeline,
      expense_breakdown: project.expenseBreakdown || [],
      timeline: project.timeline || [],
      live_updates: project.liveUpdates || [],
      actuals: project.actuals || {},
      updated_at: new Date().toISOString()
    };

    const { error } = await supabase
      .from('business_projects')
      .upsert(payload, { onConflict: 'id' });

    if (error) {
      console.warn('Supabase sync project error:', error.message);
    }
  } catch (err) {
    console.warn('Failed to sync project to Supabase:', err);
  }
};

/**
 * Fetch project investments from Supabase.
 */
export const fetchProjectInvestments = async () => {
  try {
    const { data, error } = await supabase
      .from('project_investments')
      .select('*')
      .order('timestamp', { ascending: false });

    if (error) {
      console.warn('Supabase investments fetch warning:', error.message);
      return null;
    }

    if (data && data.length > 0) {
      return data.map(item => ({
        id: item.id,
        projectId: item.project_id || item.projectId,
        projectName: item.project_name || item.projectName,
        category: item.category,
        investorName: item.investor_name || item.investorName,
        email: item.email,
        phone: item.phone,
        amount: Number(item.amount),
        paymentMethod: item.payment_method || item.paymentMethod,
        utrNumber: item.utr_number || item.utrNumber,
        screenshotUrl: item.screenshot_url || item.screenshotUrl,
        date: item.date,
        timestamp: item.timestamp || Date.now(),
        expectedYield: item.expected_yield || item.expectedYield,
        payoutTimeline: item.payout_timeline || item.payoutTimeline,
        note: item.note,
        status: item.status,
        rejectionReason: item.rejection_reason || item.rejectionReason
      }));
    }
  } catch (err) {
    console.warn('Supabase network notice:', err?.message || err);
  }
  return null;
};

/**
 * Save new investment / backer payment submission to Supabase.
 */
export const saveProjectInvestmentToSupabase = async (inv) => {
  if (!inv?.id) return;
  try {
    const payload = {
      id: inv.id,
      project_id: inv.projectId,
      project_name: inv.projectName,
      category: inv.category,
      investor_name: inv.investorName,
      email: inv.email,
      phone: inv.phone,
      amount: inv.amount,
      payment_method: inv.paymentMethod,
      utr_number: inv.utrNumber,
      screenshot_url: inv.screenshotUrl,
      date: inv.date,
      timestamp: inv.timestamp,
      expected_yield: inv.expectedYield,
      payout_timeline: inv.payoutTimeline,
      note: inv.note,
      status: inv.status || 'PENDING_APPROVAL',
      created_at: new Date().toISOString()
    };

    const { error } = await supabase
      .from('project_investments')
      .upsert(payload, { onConflict: 'id' });

    if (error) {
      console.warn('Supabase investment save notice:', error.message);
    }
  } catch (err) {
    console.warn('Failed to save investment to Supabase:', err);
  }
};

/**
 * Update investment status (CONFIRMED / REJECTED) in Supabase.
 */
export const updateInvestmentStatusInSupabase = async (invId, status, rejectionReason = '') => {
  try {
    const payload = {
      status,
      rejection_reason: rejectionReason,
      updated_at: new Date().toISOString()
    };

    const { error } = await supabase
      .from('project_investments')
      .update(payload)
      .eq('id', invId);

    if (error) {
      console.warn('Supabase update investment status notice:', error.message);
    }
  } catch (err) {
    console.warn('Failed to update investment status in Supabase:', err);
  }
};

/**
 * Save audit log entry to Supabase.
 */
export const saveAuditLogToSupabase = async (entry) => {
  if (!entry?.id) return;
  try {
    const payload = {
      id: entry.id,
      project_id: entry.projectId,
      timestamp: entry.timestamp,
      user_name: entry.user,
      action: entry.action,
      note: entry.note,
      created_at: new Date().toISOString()
    };

    const { error } = await supabase
      .from('project_history')
      .upsert(payload, { onConflict: 'id' });

    if (error) {
      console.warn('Supabase audit log notice:', error.message);
    }
  } catch (err) {
    console.warn('Failed to log audit history to Supabase:', err);
  }
};
