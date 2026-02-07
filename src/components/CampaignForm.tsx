import * as React from 'react';
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { api } from '../lib/api';
import { Campaign, CampaignStatus, Platform } from '../lib/types';
import { ArrowLeft, Save } from 'lucide-react';

export function CampaignForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;

  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    status: 'draft' as CampaignStatus,
    platform: 'facebook' as Platform,
    budget: '',
    startDate: '',
    endDate: '',
    description: '',
    targetAudience: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isEdit) {
      loadCampaign();
    }
  }, [id]);

  const loadCampaign = async () => {
    if (!id) return;
    
    try {
      setLoading(true);
      setError(null);
      const campaign = await api.getCampaign(id);
      
      if (!campaign) {
        setError('Campaign not found');
        return;
      }

      setFormData({
        name: campaign.name,
        status: campaign.status,
        platform: campaign.platform,
        budget: campaign.budget.toString(),
        startDate: campaign.startDate,
        endDate: campaign.endDate,
        description: campaign.description,
        targetAudience: campaign.targetAudience
      });
    } catch (err) {
      setError('Failed to load campaign');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Campaign name is required';
    }

    if (!formData.budget || parseFloat(formData.budget) <= 0) {
      newErrors.budget = 'Budget must be greater than 0';
    }

    if (!formData.startDate) {
      newErrors.startDate = 'Start date is required';
    }

    if (!formData.endDate) {
      newErrors.endDate = 'End date is required';
    }

    if (formData.startDate && formData.endDate && formData.startDate > formData.endDate) {
      newErrors.endDate = 'End date must be after start date';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (!formData.targetAudience.trim()) {
      newErrors.targetAudience = 'Target audience is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      setSaving(true);
      setError(null);

      const campaignData = {
        name: formData.name,
        status: formData.status,
        platform: formData.platform,
        budget: parseFloat(formData.budget),
        startDate: formData.startDate,
        endDate: formData.endDate,
        description: formData.description,
        targetAudience: formData.targetAudience
      };

      if (isEdit && id) {
        await api.updateCampaign(id, campaignData);
      } else {
        await api.createCampaign(campaignData);
      }

      // Dispatch event to update dashboard
      window.dispatchEvent(new Event('campaignsUpdated'));
      
      // Navigate back to campaigns list
      navigate('/campaigns');
    } catch (err) {
      setError(isEdit ? 'Failed to update campaign' : 'Failed to create campaign');
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen" role="status" aria-live="polite">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--color-primary)]" aria-hidden="true"></div>
        <span className="sr-only">Loading campaign</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--surface-01)] p-4 sm:p-6 lg:p-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button onClick={() => navigate('/campaigns')} className="btn-primary btn-sm">
            <ArrowLeft className="h-4 w-4" />
            Back to Campaigns
          </button>
          <h1 className="mb-2 heading-gradient">{isEdit ? 'Edit Campaign' : 'Create New Campaign'}</h1>
          <p className="text-[var(--color-muted-gray)]">
            {isEdit
              ? 'Update campaign details for Social Booster Media visibility strategy.'
              : 'Launch a new visibility campaign built for search and AI discovery.'}
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400" role="alert">
            {error}
          </div>
        )}

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          aria-busy={saving}
          className="card-animate bg-[var(--surface-02)] rounded-xl shadow-xl p-4 sm:p-6 border border-[var(--surface-overlay-light)]"
        >
          <div className="space-y-6">
            {/* Campaign Name */}
            <div>
              <label htmlFor="name" className="block text-sm text-white mb-2 font-medium">
                Campaign Name *
              </label>
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                required
                aria-invalid={!!errors.name}
                aria-describedby={errors.name ? 'name-error' : undefined}
                className={`w-full px-4 py-3 bg-[var(--surface-01)] border rounded-lg focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent text-white placeholder-[var(--color-muted-gray)] ${
                  errors.name ? 'border-red-500' : 'border-[var(--surface-overlay-light)]'
                }`}
                placeholder="e.g., Summer Sale 2026"
              />
              {errors.name && (
                <p id="name-error" className="mt-2 text-sm text-red-400" role="alert">
                  {errors.name}
                </p>
              )}
            </div>

            {/* Status and Platform */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="status" className="block text-sm text-white mb-2 font-medium">
                  Status *
                </label>
                <select
                  id="status"
                  value={formData.status}
                  onChange={(e) => handleChange('status', e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-[var(--surface-01)] border border-[var(--surface-overlay-light)] rounded-lg focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent text-white"
                >
                  <option value="draft">Draft</option>
                  <option value="active">Active</option>
                  <option value="paused">Paused</option>
                  <option value="completed">Completed</option>
                </select>
              </div>

              <div>
                <label htmlFor="platform" className="block text-sm text-white mb-2 font-medium">
                  Platform *
                </label>
                <select
                  id="platform"
                  value={formData.platform}
                  onChange={(e) => handleChange('platform', e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-[var(--surface-01)] border border-[var(--surface-overlay-light)] rounded-lg focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent text-white"
                >
                  <option value="facebook">Facebook</option>
                  <option value="google">Google</option>
                  <option value="instagram">Instagram</option>
                  <option value="linkedin">LinkedIn</option>
                  <option value="twitter">Twitter</option>
                </select>
              </div>
            </div>

            {/* Budget */}
            <div>
              <label htmlFor="budget" className="block text-sm text-white mb-2 font-medium">
                Budget ($) *
              </label>
              <input
                type="number"
                id="budget"
                value={formData.budget}
                onChange={(e) => handleChange('budget', e.target.value)}
                min="0"
                step="0.01"
                required
                aria-invalid={!!errors.budget}
                aria-describedby={errors.budget ? 'budget-error' : undefined}
                className={`w-full px-4 py-3 bg-[var(--surface-01)] border rounded-lg focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent text-white placeholder-[var(--color-muted-gray)] ${
                  errors.budget ? 'border-red-500' : 'border-[var(--surface-overlay-light)]'
                }`}
                placeholder="5000"
              />
              {errors.budget && (
                <p id="budget-error" className="mt-2 text-sm text-red-400" role="alert">
                  {errors.budget}
                </p>
              )}
            </div>

            {/* Date Range */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="startDate" className="block text-sm text-white mb-2 font-medium">
                  Start Date *
                </label>
                <input
                  type="date"
                  id="startDate"
                  value={formData.startDate}
                  onChange={(e) => handleChange('startDate', e.target.value)}
                  required
                  aria-invalid={!!errors.startDate}
                  aria-describedby={errors.startDate ? 'startDate-error' : undefined}
                  className={`w-full px-4 py-3 bg-[var(--surface-01)] border rounded-lg focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent text-white ${
                    errors.startDate ? 'border-red-500' : 'border-[var(--surface-overlay-light)]'
                  }`}
                />
                {errors.startDate && (
                  <p id="startDate-error" className="mt-2 text-sm text-red-400" role="alert">
                    {errors.startDate}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="endDate" className="block text-sm text-white mb-2 font-medium">
                  End Date *
                </label>
                <input
                  type="date"
                  id="endDate"
                  value={formData.endDate}
                  onChange={(e) => handleChange('endDate', e.target.value)}
                  required
                  aria-invalid={!!errors.endDate}
                  aria-describedby={errors.endDate ? 'endDate-error' : undefined}
                  className={`w-full px-4 py-3 bg-[var(--surface-01)] border rounded-lg focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent text-white ${
                    errors.endDate ? 'border-red-500' : 'border-[var(--surface-overlay-light)]'
                  }`}
                />
                {errors.endDate && (
                  <p id="endDate-error" className="mt-2 text-sm text-red-400" role="alert">
                    {errors.endDate}
                  </p>
                )}
              </div>
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm text-white mb-2 font-medium">
                Description *
              </label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                rows={4}
                required
                aria-invalid={!!errors.description}
                aria-describedby={errors.description ? 'description-error' : undefined}
                className={`w-full px-4 py-3 bg-[var(--surface-01)] border rounded-lg focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent text-white placeholder-[var(--color-muted-gray)] ${
                  errors.description ? 'border-red-500' : 'border-[var(--surface-overlay-light)]'
                }`}
                placeholder="Describe the campaign objectives and key messaging..."
              />
              {errors.description && (
                <p id="description-error" className="mt-2 text-sm text-red-400" role="alert">
                  {errors.description}
                </p>
              )}
            </div>

            {/* Target Audience */}
            <div>
              <label htmlFor="targetAudience" className="block text-sm text-white mb-2 font-medium">
                Target Audience *
              </label>
              <input
                type="text"
                id="targetAudience"
                value={formData.targetAudience}
                onChange={(e) => handleChange('targetAudience', e.target.value)}
                required
                aria-invalid={!!errors.targetAudience}
                aria-describedby={errors.targetAudience ? 'targetAudience-error' : undefined}
                className={`w-full px-4 py-3 bg-[var(--surface-01)] border rounded-lg focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent text-white placeholder-[var(--color-muted-gray)] ${
                  errors.targetAudience ? 'border-red-500' : 'border-[var(--surface-overlay-light)]'
                }`}
                placeholder="e.g., Ages 25-45, Fashion enthusiasts"
              />
              {errors.targetAudience && (
                <p id="targetAudience-error" className="mt-2 text-sm text-red-400" role="alert">
                  {errors.targetAudience}
                </p>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-end">
            <button
              type="button"
              onClick={() => navigate('/campaigns')}
              className="btn-primary btn-sm w-full sm:w-auto justify-center"
              disabled={saving}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              aria-busy={saving}
              className="btn-primary w-full sm:w-auto justify-center btn-sm"
            >
              {saving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" aria-hidden="true"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  {isEdit ? 'Update Campaign' : 'Create Campaign'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
