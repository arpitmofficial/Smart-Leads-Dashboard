import React from 'react';
import { X, Mail, User, Clock, Tag, Globe, UserCheck } from 'lucide-react';
import { Lead } from '../../types';
import Badge from '../common/Badge';

interface LeadDetailProps {
  lead: Lead;
  onClose: () => void;
}

const LeadDetail: React.FC<LeadDetailProps> = ({ lead, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-lg bg-white dark:bg-surface-900 rounded-2xl shadow-2xl animate-scale-in overflow-hidden">
        {/* Gradient header */}
        <div className="relative h-28 bg-gradient-to-r from-primary-500 via-primary-600 to-accent-500">
          <button
            onClick={onClose}
            className="absolute top-3 right-3 p-1.5 rounded-lg bg-white/20 text-white hover:bg-white/30 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="absolute -bottom-8 left-6">
            <div className="w-16 h-16 rounded-2xl bg-white dark:bg-surface-800 border-4 border-white dark:border-surface-900 flex items-center justify-center shadow-lg">
              <span className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                {lead.name.charAt(0).toUpperCase()}
              </span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="pt-12 px-6 pb-6">
          <h2 className="text-xl font-bold text-surface-900 dark:text-white">{lead.name}</h2>
          <p className="text-sm text-surface-500 dark:text-surface-400 mt-0.5">{lead.email}</p>

          <div className="flex items-center gap-2 mt-3">
            <Badge variant="status" value={lead.status} />
            <Badge variant="source" value={lead.source} />
          </div>

          <div className="mt-6 space-y-4">
            <DetailRow icon={<Mail className="w-4 h-4" />} label="Email" value={lead.email} />
            <DetailRow icon={<User className="w-4 h-4" />} label="Name" value={lead.name} />
            <DetailRow icon={<Tag className="w-4 h-4" />} label="Status" value={lead.status} />
            <DetailRow icon={<Globe className="w-4 h-4" />} label="Source" value={lead.source} />
            <DetailRow
              icon={<UserCheck className="w-4 h-4" />}
              label="Created By"
              value={typeof lead.createdBy === 'object' && lead.createdBy !== null ? lead.createdBy.name : 'N/A'}
            />
            <DetailRow
              icon={<Clock className="w-4 h-4" />}
              label="Created At"
              value={new Date(lead.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            />
            <DetailRow
              icon={<Clock className="w-4 h-4" />}
              label="Last Updated"
              value={new Date(lead.updatedAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

interface DetailRowProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}

const DetailRow: React.FC<DetailRowProps> = ({ icon, label, value }) => (
  <div className="flex items-start gap-3">
    <div className="w-8 h-8 rounded-lg bg-surface-100 dark:bg-surface-800 flex items-center justify-center flex-shrink-0 text-surface-500 dark:text-surface-400">
      {icon}
    </div>
    <div>
      <p className="text-xs text-surface-500 dark:text-surface-400 font-medium">{label}</p>
      <p className="text-sm text-surface-900 dark:text-surface-100 font-medium mt-0.5">{value}</p>
    </div>
  </div>
);

export default LeadDetail;
