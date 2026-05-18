import React, { useState, useEffect } from 'react';
import { LeadStatus, LeadSource, CreateLeadData, UpdateLeadData, Lead } from '../../types';
import { Loader2 } from 'lucide-react';

interface LeadFormProps {
  lead?: Lead | null;
  onSubmit: (data: CreateLeadData | UpdateLeadData) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

interface FormErrors {
  name?: string;
  email?: string;
  source?: string;
}

const LeadForm: React.FC<LeadFormProps> = ({ lead, onSubmit, onCancel, isLoading = false }) => {
  const [name, setName] = useState(lead?.name || '');
  const [email, setEmail] = useState(lead?.email || '');
  const [status, setStatus] = useState<LeadStatus>(lead?.status || LeadStatus.NEW);
  const [source, setSource] = useState<LeadSource | ''>(lead?.source || '');
  const [errors, setErrors] = useState<FormErrors>({});

  const isEditing = !!lead;

  useEffect(() => {
    if (lead) {
      setName(lead.name);
      setEmail(lead.email);
      setStatus(lead.status);
      setSource(lead.source);
    }
  }, [lead]);

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (!name.trim() || name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!email.trim() || !emailRegex.test(email)) {
      newErrors.email = 'Please provide a valid email address';
    }

    if (!isEditing && !source) {
      newErrors.source = 'Please select a lead source';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const data = isEditing
      ? { name: name.trim(), email: email.trim(), status, source: source as LeadSource }
      : { name: name.trim(), email: email.trim(), status, source: source as LeadSource };

    await onSubmit(data);
  };

  const inputBase =
    'w-full px-4 py-2.5 rounded-xl text-sm bg-white dark:bg-surface-800 border text-surface-900 dark:text-surface-100 placeholder-surface-400 dark:placeholder-surface-500 focus:outline-none focus:ring-2 focus:ring-primary-500/30 transition-all';
  const inputError = 'border-danger-500 focus:border-danger-500';
  const inputNormal = 'border-surface-200 dark:border-surface-700 focus:border-primary-500';

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Name */}
      <div>
        <label htmlFor="lead-name" className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1.5">
          Name <span className="text-danger-500">*</span>
        </label>
        <input
          id="lead-name"
          type="text"
          autoComplete="off"
          value={name}
          onChange={(e) => { setName(e.target.value); setErrors({ ...errors, name: undefined }); }}
          placeholder="Enter lead name"
          className={`${inputBase} ${errors.name ? inputError : inputNormal}`}
        />
        {errors.name && <p className="text-xs text-danger-500 mt-1">{errors.name}</p>}
      </div>

      {/* Email */}
      <div>
        <label htmlFor="lead-email" className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1.5">
          Email <span className="text-danger-500">*</span>
        </label>
        <input
          id="lead-email"
          type="email"
          autoComplete="off"
          value={email}
          onChange={(e) => { setEmail(e.target.value); setErrors({ ...errors, email: undefined }); }}
          placeholder="Enter email address"
          className={`${inputBase} ${errors.email ? inputError : inputNormal}`}
        />
        {errors.email && <p className="text-xs text-danger-500 mt-1">{errors.email}</p>}
      </div>

      {/* Status */}
      <div>
        <label htmlFor="lead-status" className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1.5">
          Status
        </label>
        <select
          id="lead-status"
          autoComplete="off"
          value={status}
          onChange={(e) => setStatus(e.target.value as LeadStatus)}
          className={`${inputBase} ${inputNormal} cursor-pointer`}
        >
          {Object.values(LeadStatus).map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      {/* Source */}
      <div>
        <label htmlFor="lead-source" className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1.5">
          Source <span className="text-danger-500">*</span>
        </label>
        <select
          id="lead-source"
          autoComplete="off"
          value={source}
          onChange={(e) => { setSource(e.target.value as LeadSource); setErrors({ ...errors, source: undefined }); }}
          className={`${inputBase} ${errors.source ? inputError : inputNormal} cursor-pointer`}
        >
          <option value="">Select source</option>
          {Object.values(LeadSource).map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
        {errors.source && <p className="text-xs text-danger-500 mt-1">{errors.source}</p>}
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2.5 text-sm font-medium text-surface-600 dark:text-surface-400 bg-surface-100 dark:bg-surface-800 hover:bg-surface-200 dark:hover:bg-surface-700 rounded-xl transition-colors"
          disabled={isLoading}
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-primary-600 hover:bg-primary-700 rounded-xl shadow-md shadow-primary-600/25 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
          {isEditing ? 'Update Lead' : 'Create Lead'}
        </button>
      </div>
    </form>
  );
};

export default LeadForm;
