export type CampaignStatus = 'active' | 'paused' | 'completed' | 'draft';
export type Platform = 'facebook' | 'google' | 'instagram' | 'linkedin' | 'twitter';

export interface Campaign {
  id: string;
  name: string;
  status: CampaignStatus;
  platform: Platform;
  budget: number;
  startDate: string;
  endDate: string;
  description: string;
  targetAudience: string;
  createdAt: string;
  updatedAt: string;
}

export interface CampaignInsights {
  impressions: number;
  clicks: number;
  conversions: number;
  ctr: number;
  cpc: number;
  roi: number;
  engagement: {
    likes: number;
    shares: number;
    comments: number;
  };
}

export interface DashboardMetrics {
  campaignsByStatus: Record<CampaignStatus, number>;
  budgetByPlatform: Record<Platform, number>;
  totalActiveBudget: number;
}
