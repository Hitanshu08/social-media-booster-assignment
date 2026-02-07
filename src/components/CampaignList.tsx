import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../lib/api';
import { Campaign } from '../lib/types';
import { Plus, Eye, Pencil, Trash2 } from 'lucide-react';
import { brandAssets } from '../lib/brandAssets';
import { BrandImage } from './BrandImage';

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

export function CampaignList() {
  const navigate = useNavigate();
  const [campaigns, setCampaigns] = React.useState([] as Campaign[]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null as string | null);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState('all');
  const [platformFilter, setPlatformFilter] = React.useState('all');
  const [deleteLoading, setDeleteLoading] = React.useState(null as string | null);

  const loadCampaigns = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.getCampaigns();
      setCampaigns(data);
    } catch (err) {
      setError('Failed to load campaigns');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    loadCampaigns();
  }, []);

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) return;

    try {
      setDeleteLoading(id);
      await api.deleteCampaign(id);
      // Update UI immediately
      setCampaigns(prev => prev.filter(c => c.id !== id));
      // Dispatch event to update dashboard
      window.dispatchEvent(new Event('campaignsUpdated'));
    } catch (err) {
      alert('Failed to delete campaign');
      console.error(err);
    } finally {
      setDeleteLoading(null);
    }
  };

  const filteredCampaigns = campaigns.filter((campaign) => {
    const matchesSearch =
      campaign.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      campaign.platform.toLowerCase().includes(searchTerm.toLowerCase()) ||
      campaign.status.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || campaign.status === statusFilter;
    const matchesPlatform = platformFilter === 'all' || campaign.platform === platformFilter;

    return matchesSearch && matchesStatus && matchesPlatform;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen" role="status" aria-live="polite">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--color-primary)]" aria-hidden="true"></div>
        <span className="sr-only">Loading campaigns</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--surface-01)] p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="mb-2 heading-gradient">Visibility Campaigns</h1>
            <p className="text-[var(--color-muted-gray)]">
              Track the work that earns page-one rankings and AI citations for Social Booster Media.
            </p>
          </div>
          <button onClick={() => navigate('/campaigns/new')} className="btn-primary w-full sm:w-auto justify-center flex-shrink-0">
            <Plus className="h-5 w-5" />
            Create Campaign
          </button>
        </div>

        {/* Filters */}
        <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:justify-between">
          <div className="relative max-w-full sm:max-w-md w-full">
            <label htmlFor="campaign-search" className="sr-only">
              Search campaigns
            </label>
            <BrandImage
              src={brandAssets.searchIcon.src}
              fallbackSrc={brandAssets.searchIcon.fallbackSrc}
              alt=""
              aria-hidden="true"
              className="absolute left-3 top-1/2 h-6 w-6 -translate-y-1/2"
            />
            <input
              id="campaign-search"
              type="text"
              placeholder="Search campaigns..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-[var(--surface-02)] border border-[var(--surface-overlay-light)] rounded-lg focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent text-white placeholder-[var(--color-muted-gray)]"
            />
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
            <div className="w-full sm:w-48">
              <label htmlFor="status-filter" className="sr-only">
                Filter by status
              </label>
              <select
                id="status-filter"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-4 py-3 bg-[var(--surface-02)] border border-[var(--surface-overlay-light)] rounded-lg focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent text-white"
              >
                <option value="all">All Statuses</option>
                <option value="active">Active</option>
                <option value="paused">Paused</option>
                <option value="completed">Completed</option>
                <option value="draft">Draft</option>
              </select>
            </div>
            <div className="w-full sm:w-48">
              <label htmlFor="platform-filter" className="sr-only">
                Filter by platform
              </label>
              <select
                id="platform-filter"
                value={platformFilter}
                onChange={(e) => setPlatformFilter(e.target.value)}
                className="w-full px-4 py-3 bg-[var(--surface-02)] border border-[var(--surface-overlay-light)] rounded-lg focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent text-white"
              >
                <option value="all">All Platforms</option>
                <option value="facebook">Facebook</option>
                <option value="google">Google</option>
                <option value="instagram">Instagram</option>
                <option value="linkedin">LinkedIn</option>
                <option value="twitter">Twitter</option>
              </select>
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400" role="alert">
            {error}
          </div>
        )}

        {/* Mobile Campaign Cards */}
        <div className="md:hidden space-y-4">
          {filteredCampaigns.length === 0 ? (
            <div className="card-animate bg-[var(--surface-02)] rounded-xl shadow-xl p-6 text-center border border-[var(--surface-overlay-light)]">
              <BrandImage
                src={brandAssets.emptyStateIcon.src}
                fallbackSrc={brandAssets.emptyStateIcon.fallbackSrc}
                alt=""
                aria-hidden="true"
                className="h-16 w-16 mx-auto mb-4"
              />
              {searchTerm
                ? 'No campaigns found matching your search'
                : 'No visibility campaigns yet. Create your first one!'}
            </div>
          ) : (
            filteredCampaigns.map((campaign) => (
              <div
                key={campaign.id}
                className="card-animate bg-[var(--surface-02)] rounded-xl shadow-xl p-4 border border-[var(--surface-overlay-light)]"
              >
                <div>
                  <div className="text-white font-medium">{campaign.name}</div>
                  <div className="text-sm text-[var(--color-muted-gray)] mt-1">
                    {campaign.description.substring(0, 80)}...
                  </div>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  <span className={`inline-flex px-3 py-1 text-xs rounded-full font-medium ${STATUS_COLORS[campaign.status]}`}>
                    {campaign.status}
                  </span>
                  <span className={`inline-flex px-3 py-1 text-xs rounded-full font-medium ${PLATFORM_COLORS[campaign.platform]}`}>
                    {campaign.platform}
                  </span>
                </div>
                <div className="mt-4 space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-[var(--color-muted-gray)]">Budget</span>
                    <span className="text-white font-medium">${campaign.budget.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[var(--color-muted-gray)]">Duration</span>
                    <span className="text-white">
                      {new Date(campaign.startDate).toLocaleDateString()} - {new Date(campaign.endDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-end gap-2">
                  <button
                    onClick={() => navigate(`/campaigns/${campaign.id}`)}
                    aria-label={`View details for ${campaign.name}`}
                    className="btn-primary btn-icon"
                    title="View details"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => navigate(`/campaigns/${campaign.id}/edit`)}
                    aria-label={`Edit ${campaign.name}`}
                    className="btn-primary btn-icon"
                    title="Edit"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(campaign.id, campaign.name)}
                    disabled={deleteLoading === campaign.id}
                    aria-label={deleteLoading === campaign.id ? `Deleting ${campaign.name}` : `Delete ${campaign.name}`}
                    aria-busy={deleteLoading === campaign.id}
                    className="btn-primary btn-icon"
                    title="Delete"
                  >
                    {deleteLoading === campaign.id ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-400" aria-hidden="true"></div>
                        <span className="sr-only">Deleting</span>
                      </>
                    ) : (
                      <Trash2 className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Campaigns Table */}
        <div className="hidden md:block card-animate bg-[var(--surface-02)] rounded-xl shadow-xl overflow-hidden border border-[var(--surface-overlay-light)]">
          <div className="overflow-x-auto">
            <table className="w-full">
              <caption className="sr-only">Campaign list</caption>
              <thead className="bg-[var(--surface-overlay-more-dark)] border-b border-[var(--surface-overlay-light)]">
                <tr>
                  <th scope="col" className="px-6 py-4 text-left text-xs text-[var(--color-muted-gray)] uppercase tracking-wider font-semibold">
                    Campaign Name
                  </th>
                  <th scope="col" className="px-6 py-4 text-left text-xs text-[var(--color-muted-gray)] uppercase tracking-wider font-semibold">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-4 text-left text-xs text-[var(--color-muted-gray)] uppercase tracking-wider font-semibold">
                    Platform
                  </th>
                  <th scope="col" className="px-6 py-4 text-left text-xs text-[var(--color-muted-gray)] uppercase tracking-wider font-semibold">
                    Budget
                  </th>
                  <th scope="col" className="px-6 py-4 text-left text-xs text-[var(--color-muted-gray)] uppercase tracking-wider font-semibold">
                    Duration
                  </th>
                  <th scope="col" className="px-6 py-4 text-right text-xs text-[var(--color-muted-gray)] uppercase tracking-wider font-semibold">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--surface-overlay-light)]">
                {filteredCampaigns.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-[var(--color-muted-gray)]">
                      <BrandImage
                        src={brandAssets.emptyStateIcon.src}
                        fallbackSrc={brandAssets.emptyStateIcon.fallbackSrc}
                        alt=""
                        aria-hidden="true"
                        className="h-16 w-16 mx-auto mb-4"
                      />
                      {searchTerm
                        ? 'No campaigns found matching your search'
                        : 'No visibility campaigns yet. Create your first one!'}
                    </td>
                  </tr>
                ) : (
                  filteredCampaigns.map((campaign) => (
                    <tr key={campaign.id} className="hover:bg-[var(--surface-overlay-more-dark)] transition-colors">
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-white font-medium">{campaign.name}</div>
                          <div className="text-sm text-[var(--color-muted-gray)] mt-1">{campaign.description.substring(0, 60)}...</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-3 py-1 text-xs rounded-full font-medium ${STATUS_COLORS[campaign.status]}`}>
                          {campaign.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-3 py-1 text-xs rounded-full font-medium ${PLATFORM_COLORS[campaign.platform]}`}>
                          {campaign.platform}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-white font-medium">
                        ${campaign.budget.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-sm text-[var(--color-muted-gray)]">
                        {new Date(campaign.startDate).toLocaleDateString()} - {new Date(campaign.endDate).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => navigate(`/campaigns/${campaign.id}`)}
                            aria-label={`View details for ${campaign.name}`}
                            className="btn-primary btn-icon"
                            title="View details"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => navigate(`/campaigns/${campaign.id}/edit`)}
                            aria-label={`Edit ${campaign.name}`}
                            className="btn-primary btn-icon"
                            title="Edit"
                          >
                            <Pencil className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(campaign.id, campaign.name)}
                            disabled={deleteLoading === campaign.id}
                            aria-label={deleteLoading === campaign.id ? `Deleting ${campaign.name}` : `Delete ${campaign.name}`}
                            aria-busy={deleteLoading === campaign.id}
                            className="btn-primary btn-icon"
                            title="Delete"
                          >
                            {deleteLoading === campaign.id ? (
                              <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-400" aria-hidden="true"></div>
                                <span className="sr-only">Deleting</span>
                              </>
                            ) : (
                              <Trash2 className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Stats Footer */}
        {filteredCampaigns.length > 0 && (
          <div className="mt-4 text-xs sm:text-sm text-[var(--color-muted-gray)]">
            Showing <span className="text-white font-medium">{filteredCampaigns.length}</span> of <span className="text-white font-medium">{campaigns.length}</span> campaigns
          </div>
        )}
      </div>
    </div>
  );
}
