import { Campaign, CampaignInsights, DashboardMetrics } from './types';

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const STORAGE_KEY = 'campaigns_data';

// Initialize with sample campaigns
const getInitialCampaigns = (): Campaign[] => [
  {
    id: '1',
    name: 'Summer Sale 2026',
    status: 'active',
    platform: 'facebook',
    budget: 5000,
    startDate: '2026-02-01',
    endDate: '2026-03-31',
    description: 'Promote summer collection with 30% discount',
    targetAudience: 'Ages 25-45, Fashion enthusiasts',
    createdAt: '2026-01-15T10:00:00Z',
    updatedAt: '2026-02-01T08:30:00Z'
  },
  {
    id: '2',
    name: 'Brand Awareness Q1',
    status: 'active',
    platform: 'google',
    budget: 8000,
    startDate: '2026-01-01',
    endDate: '2026-03-31',
    description: 'Increase brand visibility in target markets',
    targetAudience: 'Business professionals, B2B',
    createdAt: '2025-12-20T14:00:00Z',
    updatedAt: '2026-01-05T09:15:00Z'
  },
  {
    id: '3',
    name: 'Product Launch - EcoBottle',
    status: 'paused',
    platform: 'instagram',
    budget: 3500,
    startDate: '2026-01-15',
    endDate: '2026-02-28',
    description: 'Launch campaign for new sustainable water bottle',
    targetAudience: 'Eco-conscious millennials',
    createdAt: '2026-01-10T11:00:00Z',
    updatedAt: '2026-02-05T16:20:00Z'
  },
  {
    id: '4',
    name: 'Holiday Retargeting',
    status: 'completed',
    platform: 'facebook',
    budget: 2500,
    startDate: '2025-12-01',
    endDate: '2025-12-31',
    description: 'Retarget website visitors during holiday season',
    targetAudience: 'Previous site visitors',
    createdAt: '2025-11-25T09:00:00Z',
    updatedAt: '2026-01-02T10:00:00Z'
  },
  {
    id: '5',
    name: 'LinkedIn Lead Gen',
    status: 'draft',
    platform: 'linkedin',
    budget: 6000,
    startDate: '2026-03-01',
    endDate: '2026-05-31',
    description: 'B2B lead generation campaign',
    targetAudience: 'C-level executives, Decision makers',
    createdAt: '2026-02-01T13:00:00Z',
    updatedAt: '2026-02-03T15:00:00Z'
  },
  {
    id: '6',
    name: 'Twitter Engagement',
    status: 'active',
    platform: 'twitter',
    budget: 1500,
    startDate: '2026-02-01',
    endDate: '2026-02-28',
    description: 'Boost social media engagement and followers',
    targetAudience: 'Tech-savvy users, Early adopters',
    createdAt: '2026-01-28T10:00:00Z',
    updatedAt: '2026-02-01T12:00:00Z'
  }
];

// Get campaigns from localStorage or initialize
const getCampaigns = (): Campaign[] => {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    return JSON.parse(stored);
  }
  const initial = getInitialCampaigns();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
  return initial;
};

// Save campaigns to localStorage
const saveCampaigns = (campaigns: Campaign[]) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(campaigns));
};

// Mock API functions
export const api = {
  // Get all campaigns
  getCampaigns: async (): Promise<Campaign[]> => {
    await delay(300);
    return getCampaigns();
  },

  // Get campaign by ID
  getCampaign: async (id: string): Promise<Campaign | null> => {
    await delay(200);
    const campaigns = getCampaigns();
    return campaigns.find(c => c.id === id) || null;
  },

  // Create campaign
  createCampaign: async (data: Omit<Campaign, 'id' | 'createdAt' | 'updatedAt'>): Promise<Campaign> => {
    await delay(400);
    const campaigns = getCampaigns();
    const newCampaign: Campaign = {
      ...data,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    campaigns.push(newCampaign);
    saveCampaigns(campaigns);
    return newCampaign;
  },

  // Update campaign
  updateCampaign: async (id: string, data: Partial<Campaign>): Promise<Campaign> => {
    await delay(400);
    const campaigns = getCampaigns();
    const index = campaigns.findIndex(c => c.id === id);
    if (index === -1) throw new Error('Campaign not found');
    
    campaigns[index] = {
      ...campaigns[index],
      ...data,
      id: campaigns[index].id, // Preserve ID
      createdAt: campaigns[index].createdAt, // Preserve creation date
      updatedAt: new Date().toISOString()
    };
    saveCampaigns(campaigns);
    return campaigns[index];
  },

  // Delete campaign
  deleteCampaign: async (id: string): Promise<void> => {
    await delay(300);
    const campaigns = getCampaigns();
    const filtered = campaigns.filter(c => c.id !== id);
    saveCampaigns(filtered);
  },

  // Get campaign insights (simulated third-party API)
  getCampaignInsights: async (id: string): Promise<CampaignInsights> => {
    await delay(800); // Simulate slower third-party API
    
    // Generate mock insights based on campaign ID
    const seed = parseInt(id) || 1;
    return {
      impressions: Math.floor(10000 + seed * 5432),
      clicks: Math.floor(500 + seed * 123),
      conversions: Math.floor(50 + seed * 12),
      ctr: parseFloat((2.5 + Math.random() * 2).toFixed(2)),
      cpc: parseFloat((0.5 + Math.random() * 1.5).toFixed(2)),
      roi: parseFloat((150 + Math.random() * 100).toFixed(2)),
      engagement: {
        likes: Math.floor(200 + seed * 45),
        shares: Math.floor(50 + seed * 12),
        comments: Math.floor(30 + seed * 8)
      }
    };
  },

  // Get dashboard metrics
  getDashboardMetrics: async (): Promise<DashboardMetrics> => {
    await delay(300);
    const campaigns = getCampaigns();
    
    const campaignsByStatus: Record<string, number> = {
      active: 0,
      paused: 0,
      completed: 0,
      draft: 0
    };
    
    const budgetByPlatform: Record<string, number> = {
      facebook: 0,
      google: 0,
      instagram: 0,
      linkedin: 0,
      twitter: 0
    };
    
    let totalActiveBudget = 0;
    
    campaigns.forEach(campaign => {
      campaignsByStatus[campaign.status] = (campaignsByStatus[campaign.status] || 0) + 1;
      budgetByPlatform[campaign.platform] = (budgetByPlatform[campaign.platform] || 0) + campaign.budget;
      
      if (campaign.status === 'active') {
        totalActiveBudget += campaign.budget;
      }
    });
    
    return {
      campaignsByStatus: campaignsByStatus as any,
      budgetByPlatform: budgetByPlatform as any,
      totalActiveBudget
    };
  }
};
