import React from 'react';
import { LeadStatus, LeadSource } from '../../types';

interface BadgeProps {
  variant: 'status' | 'source';
  value: LeadStatus | LeadSource;
}

const statusStyles: Record<LeadStatus, string> = {
  [LeadStatus.NEW]: 'bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-400',
  [LeadStatus.CONTACTED]: 'bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400',
  [LeadStatus.QUALIFIED]: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400',
  [LeadStatus.LOST]: 'bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-400',
};

const sourceStyles: Record<LeadSource, string> = {
  [LeadSource.WEBSITE]: 'bg-sky-100 text-sky-700 dark:bg-sky-500/15 dark:text-sky-400',
  [LeadSource.INSTAGRAM]: 'bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-400',
  [LeadSource.REFERRAL]: 'bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400',
};

const Badge: React.FC<BadgeProps> = ({ variant, value }) => {
  const styles = variant === 'status'
    ? statusStyles[value as LeadStatus]
    : sourceStyles[value as LeadSource];

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-wide ${styles} transition-colors`}
    >
      {variant === 'status' && (
        <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5 opacity-70" />
      )}
      {value}
    </span>
  );
};

export default Badge;
