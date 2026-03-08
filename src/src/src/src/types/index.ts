// src/types/index.ts

export type ProductStatus = 'Idea' | 'In Progress' | 'Ready' | 'Live' | 'Archived';
export type ProductCategory = 'Notion Template' | 'Canva Template' | 'Bundle' | 'Other';
export type ListingStatus = 'Draft' | 'Published' | 'Unpublished' | 'Deleted';
export type LaunchStatus = 'Planning' | 'Active' | 'Complete' | 'Paused';
export type Period = 'Daily' | 'Weekly' | 'Monthly';

export interface Product {
  id: string;
  name: string;
  category: ProductCategory | '';
  status: ProductStatus;
  price: string;
  description: string;
  targetAudience: string;
  fileLocation: string;
  tags: string[];
  notes: string;
  dateCreated: string;
  createdAt: number;
  updatedAt: number;
}

export interface Listing {
  id: string;
  name: string;
  productId: string;
  gumroadUrl: string;
  status: ListingStatus;
  price: string;
  thumbnailReady: boolean;
  seoTitle: string;
  seoDescription: string;
  datePublished: string;
  totalSales: string;
  lastUpdated: string;
  notes: string;
  createdAt: number;
  updatedAt: number;
}

export interface RevenueEntry {
  id: string;
  name: string;
  productId: string;
  date: string;
  unitsSold: string;
  revenue: string;
  platformFee: string;
  period: Period;
  notes: string;
  createdAt: number;
  updatedAt: number;
}

export interface Launch {
  id: string;
  name: string;
  productId: string;
  launchDate: string;
  endDate: string;
  status: LaunchStatus;
  platforms: string[];
  teaserDone: boolean;
  launchPostDone: boolean;
  followUpDone: boolean;
  goalUnits: string;
  actualUnits: string;
  promoCode: string;
  contentNotes: string;
  notes: string;
  createdAt: number;
  updatedAt: number;
}

export interface AppData {
  products: Product[];
  listings: Listing[];
  revenue: RevenueEntry[];
  launches: Launch[];
}

export type TabId = 'products' | 'listings' | 'revenue' | 'launches';
