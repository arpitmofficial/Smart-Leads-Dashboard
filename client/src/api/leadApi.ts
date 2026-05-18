import api from './axios';
import {
  ApiResponse,
  Lead,
  LeadStats,
  CreateLeadData,
  UpdateLeadData,
  LeadFilters,
} from '../types';

export const leadApi = {
  getLeads: async (filters: LeadFilters): Promise<ApiResponse<Lead[]>> => {
    const params = new URLSearchParams();
    params.append('page', filters.page.toString());
    params.append('limit', filters.limit.toString());
    if (filters.status) params.append('status', filters.status);
    if (filters.source) params.append('source', filters.source);
    if (filters.search) params.append('search', filters.search);
    if (filters.sortBy) params.append('sortBy', filters.sortBy);

    const response = await api.get<ApiResponse<Lead[]>>(`/leads?${params.toString()}`);
    return response.data;
  },

  getLeadById: async (id: string): Promise<ApiResponse<Lead>> => {
    const response = await api.get<ApiResponse<Lead>>(`/leads/${id}`);
    return response.data;
  },

  createLead: async (data: CreateLeadData): Promise<ApiResponse<Lead>> => {
    const response = await api.post<ApiResponse<Lead>>('/leads', data);
    return response.data;
  },

  updateLead: async (id: string, data: UpdateLeadData): Promise<ApiResponse<Lead>> => {
    const response = await api.put<ApiResponse<Lead>>(`/leads/${id}`, data);
    return response.data;
  },

  deleteLead: async (id: string): Promise<ApiResponse<null>> => {
    const response = await api.delete<ApiResponse<null>>(`/leads/${id}`);
    return response.data;
  },

  getStats: async (): Promise<ApiResponse<LeadStats>> => {
    const response = await api.get<ApiResponse<LeadStats>>('/leads/stats/overview');
    return response.data;
  },

  exportCSV: async (filters: Partial<LeadFilters>): Promise<Blob> => {
    const params = new URLSearchParams();
    if (filters.status) params.append('status', filters.status);
    if (filters.source) params.append('source', filters.source);
    if (filters.search) params.append('search', filters.search);

    const response = await api.get(`/leads/export/csv?${params.toString()}`, {
      responseType: 'blob',
    });
    return response.data;
  },
};
