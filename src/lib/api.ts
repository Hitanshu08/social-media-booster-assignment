import { Campaign, CampaignInsights, DashboardMetrics } from './types';

const DEFAULT_API_BASE_URL = 'http://127.0.0.1:3000/api';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || DEFAULT_API_BASE_URL;

const buildUrl = (path: string) => {
  const base = API_BASE_URL.replace(/\/+$/, '');
  const normalizedPath = path.replace(/^\/+/, '');
  return `${base}/${normalizedPath}`;
};

const getErrorMessage = async (response: Response) => {
  const contentType = response.headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    try {
      const data = await response.json();
      if (typeof data?.message === 'string') return data.message;
      if (typeof data?.error === 'string') return data.error;
    } catch {
      // Ignore JSON parsing errors and fall back to text.
    }
  }

  try {
    const text = await response.text();
    if (text) return text;
  } catch {
    // Ignore text parsing errors and fall back to status message.
  }

  return `Request failed with status ${response.status}`;
};

const request = async <T>(path: string, options: RequestInit = {}): Promise<T> => {
  const response = await fetch(buildUrl(path), options);

  if (!response.ok) {
    throw new Error(await getErrorMessage(response));
  }

  if (response.status === 204) {
    return undefined as T;
  }

  const contentType = response.headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    return (await response.json()) as T;
  }

  return (await response.text()) as T;
};

export const api = {
  getCampaigns: async (): Promise<Campaign[]> => {
    return request<Campaign[]>('campaigns');
  },

  getCampaign: async (id: string): Promise<Campaign | null> => {
    const response = await fetch(buildUrl(`campaigns/${id}`));
    if (response.status === 404) {
      return null;
    }
    if (!response.ok) {
      throw new Error(await getErrorMessage(response));
    }
    return (await response.json()) as Campaign;
  },

  createCampaign: async (data: Omit<Campaign, 'id' | 'createdAt' | 'updatedAt'>): Promise<Campaign> => {
    return request<Campaign>('campaigns', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
  },

  updateCampaign: async (id: string, data: Partial<Campaign>): Promise<Campaign> => {
    return request<Campaign>(`campaigns/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
  },

  deleteCampaign: async (id: string): Promise<void> => {
    await request<void>(`campaigns/${id}`, { method: 'DELETE' });
  },

  getCampaignInsights: async (id: string): Promise<CampaignInsights> => {
    return request<CampaignInsights>(`campaigns/${id}/insights`);
  },

  getDashboardMetrics: async (): Promise<DashboardMetrics> => {
    return request<DashboardMetrics>('dashboard/metrics');
  }
};
