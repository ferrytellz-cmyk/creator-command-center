// src/lib/constants.ts

export const CATEGORIES = ['Notion Template', 'Canva Template', 'Bundle', 'Other'] as const;
export const STATUSES = ['Idea', 'In Progress', 'Ready', 'Live', 'Archived'] as const;
export const LISTING_STATUSES = ['Draft', 'Published', 'Unpublished', 'Deleted'] as const;
export const LAUNCH_STATUSES = ['Planning', 'Active', 'Complete', 'Paused'] as const;
export const PERIODS = ['Daily', 'Weekly', 'Monthly'] as const;
export const PLATFORMS = ['Instagram', 'Pinterest', 'TikTok', 'Email List', 'Twitter/X', 'YouTube', 'Facebook'] as const;
export const TAGS = [
  'planner', 'productivity', 'finance', 'social media', 'content',
  'business', 'canva', 'notion', 'bundle', 'instagram', 'branding', 'marketing'
] as const;

export const STATUS_COLORS: Record<string, string> = {
  'Idea': '#94a3b8',
  'In Progress': '#f59e0b',
  'Ready': '#3b82f6',
  'Live': '#10b981',
  'Archived': '#6b7280',
  'Draft': '#f59e0b',
  'Published': '#10b981',
  'Unpublished': '#ef4444',
  'Deleted': '#6b7280',
  'Planning': '#a78bfa',
  'Active': '#10b981',
  'Complete': '#6b7280',
  'Paused': '#f59e0b',
};

export const STORAGE_KEY = 'gumroad-hub-v1';

export const TABS = [
  { id: 'products' as const,  icon: '📦', label: 'Product Vault' },
  { id: 'listings' as const,  icon: '🛒', label: 'Gumroad Listings' },
  { id: 'revenue'  as const,  icon: '💰', label: 'Revenue Tracker' },
  { id: 'launches' as const,  icon: '🚀', label: 'Launch Planner' },
];
