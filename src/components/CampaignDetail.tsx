import * as React from 'react';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { api } from '../lib/api';
import { Campaign, CampaignInsights } from '../lib/types';
import { ArrowLeft, Pencil, TrendingUp, MousePointer, DollarSign, Eye, ThumbsUp, Share2, MessageSquare, Sparkles, Zap } from 'lucide-react';

const STATUS_COLORS = {
  active: 'bg-[var(--color-accent-teal)]/10 text-[var(--color-accent-teal)] border border-[var(--color-accent-teal)]/30',
  paused: 'bg-[var(--color-accent-gold)]/10 text-[var(--color-accent-gold)] border border-[var(--color-accent-gold)]/30',
  completed: 'bg-[var(--color-primary)]/10 text-[var(--color-primary)] border border-[var(--color-primary)]/30',
  draft: 'bg-[var(--surface-overlay-light)] text-[var(--color-muted-gray)] border border-[var(--surface-overlay-light)]'
};

const PLATFORM_COLORS = {
  facebook: 'bg-blue-500/10 text-blue-400 border border-blue-500/30',
  google: 'bg-red-500/10 text-red-400 border border-red-500/30',
  instagram: 'bg-pink-500/10 text-pink-400 border border-pink-500/30',
  linkedin: 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/30',
  twitter: 'bg-sky-500/10 text-sky-400 border border-sky-500/30'
};

export function CampaignDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [insights, setInsights] = useState<CampaignInsights | null>(null);
  const [loading, setLoading] = useState(true);
  const [insightsLoading, setInsightsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [insightsError, setInsightsError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      loadCampaign();
    }
  }, [id]);

  const loadCampaign = async () => {
    if (!id) return;
    
    try {
      setLoading(true);
      setError(null);
      const data = await api.getCampaign(id);
      
      if (!data) {
        setError('Campaign not found');
        return;
      }
      
      setCampaign(data);
    } catch (err) {
      setError('Failed to load campaign');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchInsights = async () => {
    if (!id) return;
    
    try {
      setInsightsLoading(true);
      setInsightsError(null);
      const data = await api.getCampaignInsights(id);
      setInsights(data);
    } catch (err) {
      setInsightsError('Failed to fetch insights. Please try again.');
      console.error(err);
    } finally {
      setInsightsLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen" role="status" aria-live="polite">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--color-primary)]" aria-hidden="true"></div>
        <span className="sr-only">Loading campaign details</span>
      </div>
    );
  }

  if (error || !campaign) {
    return (
      <div className="min-h-screen bg-[var(--surface-01)] p-4 sm:p-6 lg:p-8">
        <div className="max-w-5xl mx-auto">
          <button onClick={() => navigate('/campaigns')} className="btn-primary btn-sm">
            <ArrowLeft className="h-4 w-4" />
            Back to Campaigns
          </button>
          <div className="card-animate bg-[var(--surface-02)] rounded-xl shadow-xl p-6 sm:p-8 text-center border border-[var(--surface-overlay-light)]" role="alert">
            <p className="text-red-400">{error || 'Campaign not found'}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--surface-01)] p-4 sm:p-6 lg:p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button onClick={() => navigate('/campaigns')} className="btn-primary btn-sm">
            <ArrowLeft className="h-4 w-4" />
            Back to Campaigns
          </button>
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <h1 className="mb-3 heading-gradient">{campaign.name}</h1>
              <div className="flex flex-wrap items-center gap-2">
                <span className={`inline-flex px-3 py-1.5 text-sm rounded-full font-medium ${STATUS_COLORS[campaign.status]}`}>
                  {campaign.status}
                </span>
                <span className={`inline-flex px-3 py-1.5 text-sm rounded-full font-medium ${PLATFORM_COLORS[campaign.platform]}`}>
                  {campaign.platform}
                </span>
              </div>
            </div>
            <button onClick={() => navigate(`/campaigns/${campaign.id}/edit`)} className="btn-primary w-full sm:w-auto justify-center">
              <Pencil className="h-4 w-4" />
              Edit Campaign
            </button>
          </div>
        </div>

        {/* Campaign Details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="card-animate bg-[var(--surface-02)] rounded-xl shadow-xl p-4 sm:p-6 border border-[var(--surface-overlay-light)] hover:border-[var(--color-accent-teal)] transition-all">
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-[var(--color-accent-teal)]/10 p-2.5 rounded-lg">
                <DollarSign className="h-5 w-5 text-[var(--color-accent-teal)]" />
              </div>
              <div>
                <p className="text-sm text-[var(--color-muted-gray)] font-medium">Budget</p>
                <p className="text-xl text-white font-bold">${campaign.budget.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="card-animate bg-[var(--surface-02)] rounded-xl shadow-xl p-4 sm:p-6 border border-[var(--surface-overlay-light)]">
            <p className="text-sm text-[var(--color-muted-gray)] mb-2 font-medium">Start Date</p>
            <p className="text-lg text-white">{new Date(campaign.startDate).toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}</p>
          </div>

          <div className="card-animate bg-[var(--surface-02)] rounded-xl shadow-xl p-4 sm:p-6 border border-[var(--surface-overlay-light)]">
            <p className="text-sm text-[var(--color-muted-gray)] mb-2 font-medium">End Date</p>
            <p className="text-lg text-white">{new Date(campaign.endDate).toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}</p>
          </div>
        </div>

        {/* Campaign Information */}
        <div className="card-animate bg-[var(--surface-02)] rounded-xl shadow-xl p-4 sm:p-6 mb-6 border border-[var(--surface-overlay-light)]">
          <h2 className="mb-4 heading-gradient">Campaign Information</h2>
          
          <div className="space-y-4">
            <div>
              <p className="text-sm text-[var(--color-muted-gray)] mb-1 font-medium">Description</p>
              <p className="text-[var(--color-muted-gray)]">{campaign.description}</p>
            </div>

            <div>
              <p className="text-sm text-[var(--color-muted-gray)] mb-1 font-medium">Target Audience</p>
              <p className="text-[var(--color-muted-gray)]">{campaign.targetAudience}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-[var(--surface-overlay-light)]">
              <div>
                <p className="text-sm text-[var(--color-muted-gray)] mb-1 font-medium">Created</p>
                <p className="text-[var(--color-muted-gray)]">{new Date(campaign.createdAt).toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm text-[var(--color-muted-gray)] mb-1 font-medium">Last Updated</p>
                <p className="text-[var(--color-muted-gray)]">{new Date(campaign.updatedAt).toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Insights Section */}
        <div className="card-animate bg-[var(--surface-02)] rounded-xl shadow-xl p-4 sm:p-6 border border-[var(--surface-overlay-light)]">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
            <div>
              <h2 className="mb-2 heading-gradient">Campaign Insights</h2>
              <p className="text-sm text-[var(--color-muted-gray)]">
                Real-time performance metrics aligned to search visibility and AI citation coverage.
              </p>
            </div>
            <button
              onClick={fetchInsights}
              disabled={insightsLoading}
              aria-busy={insightsLoading}
              className="btn-primary w-full sm:w-auto justify-center"
            >
              {insightsLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" aria-hidden="true"></div>
                  Loading...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  Fetch Insights
                </>
              )}
            </button>
          </div>

          {insightsError && (
            <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 mb-4" role="alert">
              {insightsError}
            </div>
          )}

          {insights ? (
            <div>
              {/* Key Metrics */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                <div className="card-animate p-4 bg-[var(--surface-01)] rounded-lg border border-[var(--surface-overlay-light)]">
                  <div className="flex items-center gap-2 mb-2">
                    <Eye className="h-4 w-4 text-[var(--color-primary)]" />
                    <p className="text-sm text-[var(--color-muted-gray)]">Impressions</p>
                  </div>
                  <p className="text-2xl text-white font-bold">{insights.impressions.toLocaleString()}</p>
                </div>

                <div className="card-animate p-4 bg-[var(--surface-01)] rounded-lg border border-[var(--surface-overlay-light)]">
                  <div className="flex items-center gap-2 mb-2">
                    <MousePointer className="h-4 w-4 text-[var(--color-accent-teal)]" />
                    <p className="text-sm text-[var(--color-muted-gray)]">Clicks</p>
                  </div>
                  <p className="text-2xl text-white font-bold">{insights.clicks.toLocaleString()}</p>
                </div>

                <div className="card-animate p-4 bg-[var(--surface-01)] rounded-lg border border-[var(--surface-overlay-light)]">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="h-4 w-4 text-[var(--color-accent-gold)]" />
                    <p className="text-sm text-[var(--color-muted-gray)]">Conversions</p>
                  </div>
                  <p className="text-2xl text-white font-bold">{insights.conversions.toLocaleString()}</p>
                </div>

                <div className="card-animate p-4 bg-[var(--surface-01)] rounded-lg border border-[var(--surface-overlay-light)]">
                  <div className="flex items-center gap-2 mb-2">
                    <Zap className="h-4 w-4 text-[var(--color-accent-orange)]" />
                    <p className="text-sm text-[var(--color-muted-gray)]">CTR</p>
                  </div>
                  <p className="text-2xl text-white font-bold">{insights.ctr}%</p>
                </div>

                <div className="card-animate p-4 bg-[var(--surface-01)] rounded-lg border border-[var(--surface-overlay-light)]">
                  <div className="flex items-center gap-2 mb-2">
                    <DollarSign className="h-4 w-4 text-[var(--color-primary-light)]" />
                    <p className="text-sm text-[var(--color-muted-gray)]">CPC</p>
                  </div>
                  <p className="text-2xl text-white font-bold">${insights.cpc}</p>
                </div>

                <div className="card-animate p-4 bg-[var(--surface-01)] rounded-lg border border-[var(--surface-overlay-light)]">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="h-4 w-4 text-[var(--color-accent-teal)]" />
                    <p className="text-sm text-[var(--color-muted-gray)]">ROI</p>
                  </div>
                  <p className="text-2xl text-white font-bold">{insights.roi}%</p>
                </div>
              </div>

              {/* Engagement Metrics */}
              <div className="border-t border-[var(--surface-overlay-light)] pt-6">
                <h3 className="mb-4 heading-gradient">Engagement</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="card-animate flex items-center gap-3 p-4 bg-[var(--surface-01)] rounded-lg border border-[var(--surface-overlay-light)]">
                    <ThumbsUp className="h-5 w-5 text-[var(--color-primary)]" />
                    <div>
                      <p className="text-sm text-[var(--color-muted-gray)]">Likes</p>
                      <p className="text-xl text-white font-bold">{insights.engagement.likes.toLocaleString()}</p>
                    </div>
                  </div>

                  <div className="card-animate flex items-center gap-3 p-4 bg-[var(--surface-01)] rounded-lg border border-[var(--surface-overlay-light)]">
                    <Share2 className="h-5 w-5 text-[var(--color-accent-teal)]" />
                    <div>
                      <p className="text-sm text-[var(--color-muted-gray)]">Shares</p>
                      <p className="text-xl text-white font-bold">{insights.engagement.shares.toLocaleString()}</p>
                    </div>
                  </div>

                  <div className="card-animate flex items-center gap-3 p-4 bg-[var(--surface-01)] rounded-lg border border-[var(--surface-overlay-light)]">
                    <MessageSquare className="h-5 w-5 text-[var(--color-accent-gold)]" />
                    <div>
                      <p className="text-sm text-[var(--color-muted-gray)]">Comments</p>
                      <p className="text-xl text-white font-bold">{insights.engagement.comments.toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-[var(--color-muted-gray)]">
              <Sparkles className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="text-[var(--color-muted-gray)]">Click "Fetch Insights" to load campaign performance data</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
