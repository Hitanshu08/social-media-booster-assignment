import * as React from 'react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Rectangle, Sector } from 'recharts';
import { api } from '../lib/api';
import { DashboardMetrics } from '../lib/types';
import { TrendingUp, DollarSign, Activity } from 'lucide-react';
import { brandAssets } from '../lib/brandAssets';
import { BrandImage } from './BrandImage';

const STATUS_COLORS = {
  active: '#4bffc0',
  paused: '#ffcc6d',
  completed: '#7e6ff0',
  draft: '#898999'
};

const PLATFORM_COLORS = {
  facebook: '#1877f2',
  google: '#ea4335',
  instagram: '#e4405f',
  linkedin: '#0077b5',
  twitter: '#1da1f2'
};

export function Dashboard() {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeStatusIndex, setActiveStatusIndex] = useState<number | null>(null);

  const loadMetrics = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.getDashboardMetrics();
      setMetrics(data);
    } catch (err) {
      setError('Failed to load dashboard metrics');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMetrics();
    
    // Refresh metrics when data changes (using storage event)
    const handleStorageChange = () => {
      loadMetrics();
    };
    
    window.addEventListener('storage', handleStorageChange);
    // Also listen for custom event
    window.addEventListener('campaignsUpdated', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('campaignsUpdated', handleStorageChange);
    };
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen" role="status" aria-live="polite">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--color-primary)]" aria-hidden="true"></div>
        <span className="sr-only">Loading dashboard</span>
      </div>
    );
  }

  if (error || !metrics) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-500">{error || 'No data available'}</div>
      </div>
    );
  }

  // Prepare data for charts
  const statusData = Object.entries(metrics.campaignsByStatus).map(([status, count]) => ({
    name: status.charAt(0).toUpperCase() + status.slice(1),
    value: count,
    count: count
  }));

  const platformData = Object.entries(metrics.budgetByPlatform)
    .filter(([_, budget]) => budget > 0)
    .map(([platform, budget]) => ({
      name: platform.charAt(0).toUpperCase() + platform.slice(1),
      budget: budget,
      platform: platform
    }));

  return (
    <div className="min-h-screen bg-[var(--surface-01)] p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="heading-gradient">Campaign Performance Dashboard</h1>
          <p className="text-[var(--color-muted-gray)] max-w-3xl mt-3">
            We help you earn page-one visibility, share online conversations, and get cited by leading AI models when buyers search your category.
          </p>
          <div className="mt-4 mb-4 flex flex-wrap gap-2">
            <span className="px-3 py-1 text-xs uppercase tracking-wider rounded-full border border-[var(--surface-overlay-light)] text-[var(--color-muted-gray)]">
              Community-first visibility
            </span>
            <span className="px-3 py-1 text-xs uppercase tracking-wider rounded-full border border-[var(--surface-overlay-light)] text-[var(--color-muted-gray)]">
              Control the narrative
            </span>
            <span className="px-3 py-1 text-xs uppercase tracking-wider rounded-full border border-[var(--surface-overlay-light)] text-[var(--color-muted-gray)]">
              Earn page-one rankings
            </span>
          </div>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <a
              href="https://socialboostermedia.com/"
              target="_blank"
              rel="noreferrer"
              aria-label="Get a Free Visibility Strategy Call (opens in a new tab)"
              className="btn-primary w-full sm:w-auto text-center"
            >
              Get a Free Visibility Strategy Call
            </a>
            <Link to="/campaigns" className="btn-primary w-full sm:w-auto text-center">
              View Campaigns
            </Link>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="card-animate bg-[var(--surface-02)] rounded-xl shadow-xl p-4 sm:p-6 border border-[var(--surface-overlay-light)] hover:border-[var(--color-accent-teal)] transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[var(--color-muted-gray)] text-sm font-medium mb-2">Total Active Budget</p>
                <p className="text-3xl font-bold text-white">${metrics.totalActiveBudget.toLocaleString()}</p>
                <p className="text-[var(--color-accent-teal)] text-xs mt-2 font-medium">Across all platforms</p>
              </div>
              <div className="bg-[var(--color-accent-teal)]/10 p-3 rounded-lg">
                <DollarSign className="h-8 w-8 text-[var(--color-accent-teal)]" />
              </div>
            </div>
          </div>

          <div className="card-animate bg-[var(--surface-02)] rounded-xl shadow-xl p-4 sm:p-6 border border-[var(--surface-overlay-light)] hover:border-[var(--color-primary)] transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[var(--color-muted-gray)] text-sm font-medium mb-2">Active Campaigns</p>
                <p className="text-3xl font-bold text-white">{metrics.campaignsByStatus.active || 0}</p>
                <p className="text-[var(--color-primary-light)] text-xs mt-2 font-medium">Currently running</p>
              </div>
              <div className="bg-[var(--color-primary)]/10 p-3 rounded-lg">
                <Activity className="h-8 w-8 text-[var(--color-primary)]" />
              </div>
            </div>
          </div>

          <div className="card-animate bg-[var(--surface-02)] rounded-xl shadow-xl p-4 sm:p-6 border border-[var(--surface-overlay-light)] hover:border-[var(--color-accent-gold)] transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[var(--color-muted-gray)] text-sm font-medium mb-2">Total Campaigns</p>
                <p className="text-3xl font-bold text-white">{Object.values(metrics.campaignsByStatus).reduce((a, b) => a + b, 0)}</p>
                <p className="text-[var(--color-accent-gold)] text-xs mt-2 font-medium">All time</p>
              </div>
              <div className="bg-[var(--color-accent-gold)]/10 p-3 rounded-lg">
                <TrendingUp className="h-8 w-8 text-[var(--color-accent-gold)]" />
              </div>
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Campaign Status Chart */}
          <div className="card-animate bg-[var(--surface-02)] rounded-xl shadow-xl p-4 sm:p-6 border border-[var(--surface-overlay-light)]">
            <h3 className="mb-6 heading-gradient">Campaigns by Status</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  activeIndex={activeStatusIndex ?? undefined}
                  activeShape={(props) => {
                    const {
                      cx,
                      cy,
                      innerRadius,
                      outerRadius,
                      startAngle,
                      endAngle,
                      fill,
                    } = props;
                    return (
                      <g>
                        <Sector
                          cx={cx}
                          cy={cy}
                          innerRadius={innerRadius}
                          outerRadius={outerRadius}
                          startAngle={startAngle}
                          endAngle={endAngle}
                          fill={fill}
                        />
                        <Sector
                          cx={cx}
                          cy={cy}
                          innerRadius={(outerRadius ?? 0) + 3}
                          outerRadius={(outerRadius ?? 0) + 8}
                          startAngle={startAngle}
                          endAngle={endAngle}
                          fill="rgba(255, 255, 255, 0.2)"
                        />
                      </g>
                    );
                  }}
                  onMouseEnter={(_, index) => setActiveStatusIndex(index)}
                  onMouseLeave={() => setActiveStatusIndex(null)}
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={STATUS_COLORS[entry.name.toLowerCase() as keyof typeof STATUS_COLORS]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--surface-02)',
                    border: '1px solid var(--surface-overlay-light)',
                    borderRadius: '8px',
                    color: 'var(--color-white)'
                  }}
                  labelStyle={{ color: 'var(--color-white)' }}
                  itemStyle={{ color: 'var(--color-white)' }}
                />
                <Legend 
                  wrapperStyle={{
                    color: 'var(--color-muted-gray)'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Budget by Platform Chart */}
          <div className="card-animate bg-[var(--surface-02)] rounded-xl shadow-xl p-4 sm:p-6 border border-[var(--surface-overlay-light)]">
            <h3 className="mb-6 heading-gradient">Budget Distribution by Platform</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={platformData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--surface-overlay-light)" />
                <XAxis 
                  dataKey="name" 
                  stroke="var(--color-muted-gray)"
                  style={{ fontSize: '12px' }}
                />
                <YAxis 
                  stroke="var(--color-muted-gray)"
                  style={{ fontSize: '12px' }}
                />
                <Tooltip
                  formatter={(value) => `$${value.toLocaleString()}`}
                  contentStyle={{
                    backgroundColor: 'var(--surface-02)',
                    border: '1px solid var(--surface-overlay-light)',
                    borderRadius: '8px',
                    color: 'var(--color-white)'
                  }}
                  labelStyle={{ color: 'var(--color-white)' }}
                  itemStyle={{ color: 'var(--color-white)' }}
                  cursor={{
                    fill: 'var(--token-98dc27e7-7ab5-4e52-a7a3-0fd5027d7a93)',
                    opacity: 0.6,
                  }}
                />
                <Legend 
                  wrapperStyle={{
                    color: 'var(--color-muted-gray)'
                  }}
                />
                <Bar
                  dataKey="budget"
                  name="Budget ($)"
                  radius={[8, 8, 0, 0]}
                  activeBar={<Rectangle stroke="rgba(255, 255, 255, 0.6)" strokeWidth={2} />}
                >
                  {platformData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={PLATFORM_COLORS[entry.platform as keyof typeof PLATFORM_COLORS]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
