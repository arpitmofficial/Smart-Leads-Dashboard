import React from 'react';
import { Eye, Pencil, Trash2 } from 'lucide-react';
import { Lead } from '../../types';
import Badge from '../common/Badge';

interface LeadTableProps {
  leads: Lead[];
  onView: (lead: Lead) => void;
  onEdit: (lead: Lead) => void;
  onDelete: (lead: Lead) => void;
  isLoading?: boolean;
}

const SkeletonRow: React.FC = () => (
  <tr className="border-b border-surface-100 dark:border-surface-800">
    {[...Array(6)].map((_, i) => (
      <td key={i} className="px-4 py-3.5">
        <div className="h-4 skeleton rounded-md w-3/4" />
      </td>
    ))}
  </tr>
);

const LeadTable: React.FC<LeadTableProps> = ({ leads, onView, onEdit, onDelete, isLoading }) => {
  if (isLoading) {
    return (
      <div className="overflow-x-auto rounded-xl border border-surface-200 dark:border-surface-700">
        <table className="w-full">
          <thead>
            <tr className="bg-surface-50 dark:bg-surface-800/50">
              {['Name', 'Email', 'Status', 'Source', 'Created', 'Actions'].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-surface-500 dark:text-surface-400 uppercase tracking-wider">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[...Array(5)].map((_, i) => <SkeletonRow key={i} />)}
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-surface-200 dark:border-surface-700">
      <table className="w-full" id="leads-table">
        <thead>
          <tr className="bg-surface-50 dark:bg-surface-800/50">
            <th className="px-4 py-3 text-left text-xs font-semibold text-surface-500 dark:text-surface-400 uppercase tracking-wider">
              Name
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-surface-500 dark:text-surface-400 uppercase tracking-wider">
              Email
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-surface-500 dark:text-surface-400 uppercase tracking-wider">
              Status
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-surface-500 dark:text-surface-400 uppercase tracking-wider">
              Source
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-surface-500 dark:text-surface-400 uppercase tracking-wider">
              Created
            </th>
            <th className="px-4 py-3 text-right text-xs font-semibold text-surface-500 dark:text-surface-400 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-surface-100 dark:divide-surface-800">
          {leads.map((lead, index) => (
            <tr
              key={lead._id}
              className="bg-white dark:bg-surface-900 hover:bg-surface-50 dark:hover:bg-surface-800/50 transition-colors animate-fade-in"
              style={{ animationDelay: `${index * 30}ms` }}
            >
              <td className="px-4 py-3.5">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-400 to-accent-400 flex items-center justify-center flex-shrink-0">
                    <span className="text-xs font-bold text-white">
                      {lead.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className="text-sm font-medium text-surface-900 dark:text-surface-100 truncate max-w-[150px]">
                    {lead.name}
                  </span>
                </div>
              </td>
              <td className="px-4 py-3.5">
                <span className="text-sm text-surface-600 dark:text-surface-400 truncate max-w-[180px] block">
                  {lead.email}
                </span>
              </td>
              <td className="px-4 py-3.5">
                <Badge variant="status" value={lead.status} />
              </td>
              <td className="px-4 py-3.5">
                <Badge variant="source" value={lead.source} />
              </td>
              <td className="px-4 py-3.5">
                <span className="text-sm text-surface-500 dark:text-surface-400">
                  {new Date(lead.createdAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </span>
              </td>
              <td className="px-4 py-3.5">
                <div className="flex items-center justify-end gap-1">
                  <button
                    onClick={() => onView(lead)}
                    className="p-2 rounded-lg text-surface-400 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-500/10 transition-colors"
                    aria-label={`View ${lead.name}`}
                    title="View details"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onEdit(lead)}
                    className="p-2 rounded-lg text-surface-400 hover:text-warning-600 dark:hover:text-warning-400 hover:bg-warning-50 dark:hover:bg-warning-500/10 transition-colors"
                    aria-label={`Edit ${lead.name}`}
                    title="Edit lead"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDelete(lead)}
                    className="p-2 rounded-lg text-surface-400 hover:text-danger-600 dark:hover:text-danger-400 hover:bg-danger-50 dark:hover:bg-danger-500/10 transition-colors"
                    aria-label={`Delete ${lead.name}`}
                    title="Delete lead"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LeadTable;
