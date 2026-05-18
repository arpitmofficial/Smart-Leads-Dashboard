import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, UserCheck, UserX, UserPlus, TrendingUp, Globe, Camera, Share2 } from 'lucide-react';
import { leadApi } from '../api/leadApi';
import { LeadStats } from '../types';
import { useAuth } from '../context/AuthContext';
import Header from '../components/layout/Header';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorState from '../components/common/ErrorState';
import Badge from '../components/common/Badge';
import { LeadStatus, LeadSource } from '../types';

const DashboardPage: React.FC = () => {
  const [stats, setStats] = useState<LeadStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  const fetchStats = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await leadApi.getStats();
      if (response.success && response.data) {
        setStats(response.data);
      }
    } catch {
      setError('Failed to load dashboard data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (isLoading) return <LoadingSpinner message="Loading dashboard..." />;
  if (error) return <ErrorState message={error} onRetry={fetchStats} />;
  if (!stats) return null;

  const statCards = [
    {
      label: 'Total Leads',
      value: stats.total,
      icon: Users,
      gradient: 'from-primary-500 to-primary-600',
      shadow: 'shadow-primary-500/20',
    },
    {
      label: 'New Leads',
      value: stats.byStatus.new,
      icon: UserPlus,
      gradient: 'from-blue-500 to-blue-600',
      shadow: 'shadow-blue-500/20',
    },
    {
      label: 'Qualified',
      value: stats.byStatus.qualified,
      icon: UserCheck,
      gradient: 'from-emerald-500 to-emerald-600',
      shadow: 'shadow-emerald-500/20',
    },
    {
      label: 'Lost',
      value: stats.byStatus.lost,
      icon: UserX,
      gradient: 'from-red-500 to-red-600',
      shadow: 'shadow-red-500/20',
    },
  ];

  const sourceCards = [
    { label: 'Website', value: stats.bySource.website, icon: Globe, color: 'text-sky-500', bg: 'bg-sky-50 dark:bg-sky-500/10' },
    { label: 'Instagram', value: stats.bySource.instagram, icon: Camera, color: 'text-rose-500', bg: 'bg-rose-50 dark:bg-rose-500/10' },
    { label: 'Referral', value: stats.bySource.referral, icon: Share2, color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-500/10' },
  ];

  const conversionRate = stats.total > 0
    ? Math.round((stats.byStatus.qualified / stats.total) * 100)
    : 0;
  const engagementRate = stats.total > 0
    ? Math.round(((stats.byStatus.contacted + stats.byStatus.qualified) / stats.total) * 100)
    : 0;
  const lossRate = stats.total > 0
    ? Math.round((stats.byStatus.lost / stats.total) * 100)
    : 0;

  const insightCards = [
    { label: 'Conversion Rate', value: conversionRate, tone: 'bg-emerald-500' },
    { label: 'Engagement Rate', value: engagementRate, tone: 'bg-blue-500' },
    { label: 'Loss Rate', value: lossRate, tone: 'bg-amber-500' },
  ];

  return (
    <div className="animate-fade-in">
      <Header
        title={`Welcome back, ${user?.name?.split(' ')[0] || 'User'} 👋`}
        subtitle="Here's what's happening with your leads today."
      />

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map((card, index) => (
          <div
            key={card.label}
            className={`relative overflow-hidden bg-white dark:bg-surface-900 rounded-2xl border border-surface-200 dark:border-surface-700 p-5 card-hover animate-fade-in`}
            style={{ animationDelay: `${index * 80}ms` }}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-surface-500 dark:text-surface-400">
                  {card.label}
                </p>
                <p className="text-3xl font-bold text-surface-900 dark:text-white mt-1">
                  {card.value}
                </p>
              </div>
              <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${card.gradient} flex items-center justify-center shadow-lg ${card.shadow}`}>
                <card.icon className="w-5 h-5 text-white" />
              </div>
            </div>
            <div className="flex items-center gap-1 mt-3">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
              <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
                {stats.total > 0 ? Math.round((card.value / stats.total) * 100) : 0}%
              </span>
              <span className="text-xs text-surface-400">of total</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Source Distribution */}
        <div className="bg-white dark:bg-surface-900 rounded-2xl border border-surface-200 dark:border-surface-700 p-6 animate-fade-in" style={{ animationDelay: '320ms' }}>
          <h3 className="text-lg font-semibold text-surface-900 dark:text-white mb-4">
            Lead Sources
          </h3>
          <div className="space-y-4">
            {sourceCards.map((src) => (
              <div key={src.label} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl ${src.bg} flex items-center justify-center`}>
                    <src.icon className={`w-5 h-5 ${src.color}`} />
                  </div>
                  <span className="text-sm font-medium text-surface-700 dark:text-surface-300">{src.label}</span>
                </div>
                <div className="flex items-center gap-3">
                    <div className="w-24 h-2 rounded-full bg-surface-100 dark:bg-surface-800 overflow-hidden">
                    <div
                      className={`h-full rounded-full bg-gradient-to-r ${
                        src.label === 'Website' ? 'from-sky-400 to-sky-500' :
                        src.label === 'Instagram' ? 'from-rose-400 to-rose-500' :
                        'from-amber-400 to-amber-500'
                      } transition-all duration-700`}
                      style={{ width: stats.total > 0 ? `${(src.value / stats.total) * 100}%` : '0%' }}
                    />
                  </div>
                  <span className="text-sm font-bold text-surface-900 dark:text-surface-100 w-8 text-right">
                    {src.value}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Status overview */}
        <div className="bg-white dark:bg-surface-900 rounded-2xl border border-surface-200 dark:border-surface-700 p-6 animate-fade-in" style={{ animationDelay: '400ms' }}>
          <h3 className="text-lg font-semibold text-surface-900 dark:text-white mb-4">
            Status Overview
          </h3>
          <div className="space-y-3">
            {[
              { status: LeadStatus.NEW, count: stats.byStatus.new, color: 'bg-blue-500' },
              { status: LeadStatus.CONTACTED, count: stats.byStatus.contacted, color: 'bg-amber-500' },
              { status: LeadStatus.QUALIFIED, count: stats.byStatus.qualified, color: 'bg-emerald-500' },
              { status: LeadStatus.LOST, count: stats.byStatus.lost, color: 'bg-red-500' },
            ].map((item) => (
              <div key={item.status} className="flex items-center justify-between p-3 rounded-xl bg-surface-50 dark:bg-surface-800/50">
                <div className="flex items-center gap-3">
                  <div className={`w-2.5 h-2.5 rounded-full ${item.color}`} />
                  <span className="text-sm font-medium text-surface-700 dark:text-surface-300">{item.status}</span>
                </div>
                <span className="text-sm font-bold text-surface-900 dark:text-surface-100">{item.count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Leads */}
        <div className="bg-white dark:bg-surface-900 rounded-2xl border border-surface-200 dark:border-surface-700 p-6 animate-fade-in" style={{ animationDelay: '480ms' }}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-surface-900 dark:text-white">
              Recent Leads
            </h3>
            <button
              onClick={() => navigate('/leads')}
              className="text-xs font-semibold text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors"
            >
              View all →
            </button>
          </div>

          {stats.recentLeads.length === 0 ? (
            <p className="text-sm text-surface-400 text-center py-8">No leads yet</p>
          ) : (
            <div className="space-y-3">
              {stats.recentLeads.map((lead) => (
                <div
                  key={lead._id}
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-surface-50 dark:hover:bg-surface-800/50 transition-colors cursor-pointer"
                  onClick={() => navigate('/leads')}
                >
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary-400 to-accent-400 flex items-center justify-center flex-shrink-0">
                    <span className="text-xs font-bold text-white">
                      {lead.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-surface-900 dark:text-surface-100 truncate">
                      {lead.name}
                    </p>
                    <p className="text-xs text-surface-400 truncate">{lead.email}</p>
                  </div>
                  <Badge variant="status" value={lead.status} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Smart insights */}
      <div className="mt-6 bg-white dark:bg-surface-900 rounded-2xl border border-surface-200 dark:border-surface-700 p-6 animate-fade-in" style={{ animationDelay: '560ms' }}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-surface-900 dark:text-white">
              Smart Insights
            </h3>
            <p className="text-sm text-surface-500 dark:text-surface-400 mt-0.5">
              Snapshot of lead momentum and conversion health.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {insightCards.map((insight) => (
            <div
              key={insight.label}
              className="p-4 rounded-2xl bg-surface-50 dark:bg-surface-800/50 border border-surface-200/60 dark:border-surface-700/60"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-surface-600 dark:text-surface-400">
                  {insight.label}
                </p>
                <span className="text-lg font-bold text-surface-900 dark:text-white">
                  {insight.value}%
                </span>
              </div>
              <div className="mt-3 h-2 rounded-full bg-surface-200 dark:bg-surface-700 overflow-hidden">
                <div
                  className={`h-full ${insight.tone} transition-all duration-700`}
                  style={{ width: `${insight.value}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
