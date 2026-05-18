import React, { useState, useEffect, useCallback } from 'react';
import { Plus, Download, Loader2, AlertTriangle } from 'lucide-react';
import { leadApi } from '../api/leadApi';
import { Lead, LeadFilters, PaginationMeta, CreateLeadData, UpdateLeadData } from '../types';
import { useDebounce } from '../hooks/useDebounce';
import Header from '../components/layout/Header';
import LeadTable from '../components/leads/LeadTable';
import LeadFiltersComponent from '../components/leads/LeadFilters';
import LeadForm from '../components/leads/LeadForm';
import LeadDetail from '../components/leads/LeadDetail';
import Pagination from '../components/common/Pagination';
import Modal from '../components/common/Modal';
import EmptyState from '../components/common/EmptyState';
import ErrorState from '../components/common/ErrorState';
import toast from 'react-hot-toast';

const LeadsPage: React.FC = () => {
  // Data state
  const [leads, setLeads] = useState<Lead[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter state
  const [filters, setFilters] = useState<LeadFilters>({
    page: 1,
    limit: 10,
    status: '',
    source: '',
    search: '',
    sortBy: 'latest',
  });
  const [searchValue, setSearchValue] = useState('');
  const debouncedSearch = useDebounce(searchValue, 400);

  // Modal state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [viewingLead, setViewingLead] = useState<Lead | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  // Sync debounced search with filters
  useEffect(() => {
    setFilters((prev) => ({ ...prev, search: debouncedSearch, page: 1 }));
  }, [debouncedSearch]);

  // Fetch leads
  const fetchLeads = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await leadApi.getLeads(filters);
      if (response.success) {
        setLeads(response.data || []);
        setPagination(response.pagination || null);
      }
    } catch {
      setError('Failed to load leads');
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  // Filter handlers
  const handleFilterChange = (newFilters: Partial<LeadFilters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const clearFilters = () => {
    setFilters((prev) => ({
      ...prev,
      page: 1,
      status: '',
      source: '',
      search: '',
      sortBy: 'latest',
    }));
    setSearchValue('');
  };

  const handlePageChange = (page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  };

  // CRUD handlers
  const handleCreate = async (data: CreateLeadData | UpdateLeadData) => {
    setIsSubmitting(true);
    try {
      await leadApi.createLead(data as CreateLeadData);
      toast.success('Lead created successfully!');
      setShowCreateModal(false);
      fetchLeads();
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err.response?.data?.message || 'Failed to create lead');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdate = async (data: CreateLeadData | UpdateLeadData) => {
    if (!selectedLead) return;
    setIsSubmitting(true);
    const previousLead = leads.find((lead) => lead._id === selectedLead._id);
    setLeads((prev) =>
      prev.map((lead) =>
        lead._id === selectedLead._id ? { ...lead, ...data } : lead
      )
    );
    try {
      const response = await leadApi.updateLead(selectedLead._id, data as UpdateLeadData);
      if (response.success && response.data) {
        setLeads((prev) =>
          prev.map((lead) =>
            lead._id === selectedLead._id ? response.data! : lead
          )
        );
      }
      toast.success('Lead updated successfully!');
      setShowEditModal(false);
      setSelectedLead(null);
    } catch (error: unknown) {
      if (previousLead) {
        setLeads((prev) =>
          prev.map((lead) =>
            lead._id === previousLead._id ? previousLead : lead
          )
        );
      }
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err.response?.data?.message || 'Failed to update lead');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedLead) return;
    setIsSubmitting(true);
    try {
      await leadApi.deleteLead(selectedLead._id);
      toast.success('Lead deleted successfully!');
      setShowDeleteModal(false);
      setSelectedLead(null);
      fetchLeads();
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err.response?.data?.message || 'Failed to delete lead');
    } finally {
      setIsSubmitting(false);
    }
  };

  // CSV Export
  const handleExportCSV = async () => {
    setIsExporting(true);
    try {
      const blob = await leadApi.exportCSV({
        status: filters.status || undefined,
        source: filters.source || undefined,
        search: filters.search || undefined,
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `leads-${new Date().toISOString().slice(0, 10)}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      toast.success('CSV exported successfully!');
    } catch {
      toast.error('Failed to export CSV');
    } finally {
      setIsExporting(false);
    }
  };

  // Action handlers
  const openEdit = (lead: Lead) => {
    setSelectedLead(lead);
    setShowEditModal(true);
  };

  const openDelete = (lead: Lead) => {
    setSelectedLead(lead);
    setShowDeleteModal(true);
  };

  return (
    <div className="animate-fade-in">
      <Header
        title="Leads"
        subtitle={`Manage your leads${pagination ? ` (${pagination.totalRecords} total)` : ''}`}
        actions={
          <div className="flex items-center gap-2">
            <button
              onClick={handleExportCSV}
              disabled={isExporting || leads.length === 0}
              className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-surface-700 dark:text-surface-300 bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-700 rounded-xl hover:bg-surface-50 dark:hover:bg-surface-700 transition-colors disabled:opacity-50"
              id="export-csv-btn"
            >
              {isExporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
              Export CSV
            </button>
            <button
              onClick={() => setShowCreateModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-primary-600 hover:bg-primary-700 rounded-xl shadow-md shadow-primary-600/25 transition-all"
              id="create-lead-btn"
            >
              <Plus className="w-4 h-4" />
              Add Lead
            </button>
          </div>
        }
      />

      {/* Filters */}
      <div className="bg-white dark:bg-surface-900 rounded-2xl border border-surface-200 dark:border-surface-700 p-4 mb-6">
        <LeadFiltersComponent
          filters={filters}
          onFilterChange={handleFilterChange}
          searchValue={searchValue}
          onSearchChange={setSearchValue}
        />
      </div>

      {/* Content */}
        {error ? (
        <ErrorState message={error} onRetry={fetchLeads} />
      ) : !isLoading && leads.length === 0 ? (
        <EmptyState
          title="No leads found"
            message={
              filters.search || filters.status || filters.source ? (
                <div className="space-y-3">
                  <p>Try adjusting your filters or search query.</p>
                  <div className="flex flex-wrap items-center justify-center gap-2">
                    {filters.status && (
                      <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-surface-100 dark:bg-surface-800 text-surface-600 dark:text-surface-300">
                        {filters.status}
                      </span>
                    )}
                    {filters.source && (
                      <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-surface-100 dark:bg-surface-800 text-surface-600 dark:text-surface-300">
                        {filters.source}
                      </span>
                    )}
                    {filters.search && (
                      <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-surface-100 dark:bg-surface-800 text-surface-600 dark:text-surface-300">
                        "{filters.search}"
                      </span>
                    )}
                  </div>
                </div>
              ) : (
                'Get started by adding your first lead.'
              )
            }
          action={
              filters.search || filters.status || filters.source ? (
                <button
                  onClick={clearFilters}
                  className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-primary-600 hover:bg-primary-700 rounded-xl shadow-md shadow-primary-600/25 transition-all"
                >
                  Clear Filters
                </button>
              ) : (
              <button
                onClick={() => setShowCreateModal(true)}
                className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-primary-600 hover:bg-primary-700 rounded-xl shadow-md shadow-primary-600/25 transition-all"
              >
                <Plus className="w-4 h-4" />
                Add First Lead
              </button>
              )
          }
        />
      ) : (
        <>
          <LeadTable
            leads={leads}
            onView={(lead) => setViewingLead(lead)}
            onEdit={openEdit}
            onDelete={openDelete}
            isLoading={isLoading}
            highlight={filters.search}
          />
          {pagination && (
            <Pagination pagination={pagination} onPageChange={handlePageChange} />
          )}
        </>
      )}

      {/* View Lead Detail */}
      {viewingLead && (
        <LeadDetail lead={viewingLead} onClose={() => setViewingLead(null)} />
      )}

      {/* Create Lead Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Add New Lead"
      >
        <LeadForm
          onSubmit={handleCreate}
          onCancel={() => setShowCreateModal(false)}
          isLoading={isSubmitting}
        />
      </Modal>

      {/* Edit Lead Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => { setShowEditModal(false); setSelectedLead(null); }}
        title="Edit Lead"
      >
        <LeadForm
          lead={selectedLead}
          onSubmit={handleUpdate}
          onCancel={() => { setShowEditModal(false); setSelectedLead(null); }}
          isLoading={isSubmitting}
        />
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => { setShowDeleteModal(false); setSelectedLead(null); }}
        title="Delete Lead"
        size="sm"
      >
        <div className="text-center py-2">
          <div className="w-14 h-14 rounded-2xl bg-danger-50 dark:bg-danger-500/10 flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-7 h-7 text-danger-500" />
          </div>
          <p className="text-sm text-surface-600 dark:text-surface-400 mb-1">
            Are you sure you want to delete
          </p>
          <p className="text-sm font-semibold text-surface-900 dark:text-surface-100 mb-6">
            "{selectedLead?.name}"?
          </p>
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={() => { setShowDeleteModal(false); setSelectedLead(null); }}
              className="px-4 py-2.5 text-sm font-medium text-surface-600 dark:text-surface-400 bg-surface-100 dark:bg-surface-800 hover:bg-surface-200 dark:hover:bg-surface-700 rounded-xl transition-colors"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-danger-600 hover:bg-danger-700 rounded-xl transition-colors disabled:opacity-60"
            >
              {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
              Delete
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default LeadsPage;
