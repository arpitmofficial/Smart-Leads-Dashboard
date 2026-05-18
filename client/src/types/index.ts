// ============== User Types ==============

export enum UserRole {
  ADMIN = 'admin',
  SALES = 'sales',
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export interface AuthResponse {
  user: User;
  token: string;
}

// ============== Lead Types ==============

export enum LeadStatus {
  NEW = 'New',
  CONTACTED = 'Contacted',
  QUALIFIED = 'Qualified',
  LOST = 'Lost',
}

export enum LeadSource {
  WEBSITE = 'Website',
  INSTAGRAM = 'Instagram',
  REFERRAL = 'Referral',
}

export interface Lead {
  _id: string;
  name: string;
  email: string;
  status: LeadStatus;
  source: LeadSource;
  assignedTo?: { _id: string; name: string; email: string };
  createdBy: { _id: string; name: string; email: string };
  createdAt: string;
  updatedAt: string;
}

export interface CreateLeadData {
  name: string;
  email: string;
  status?: LeadStatus;
  source: LeadSource;
}

export interface UpdateLeadData {
  name?: string;
  email?: string;
  status?: LeadStatus;
  source?: LeadSource;
}

// ============== API Types ==============

export interface PaginationMeta {
  currentPage: number;
  totalPages: number;
  totalRecords: number;
  limit: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  pagination?: PaginationMeta;
  errors?: Array<{ field: string; message: string }>;
}

// ============== Query Types ==============

export interface LeadFilters {
  page: number;
  limit: number;
  status?: LeadStatus | '';
  source?: LeadSource | '';
  search?: string;
  sortBy?: 'latest' | 'oldest';
}

// ============== Stats Types ==============

export interface LeadStats {
  total: number;
  byStatus: {
    new: number;
    contacted: number;
    qualified: number;
    lost: number;
  };
  bySource: {
    website: number;
    instagram: number;
    referral: number;
  };
  recentLeads: Lead[];
}

// ============== Register Types ==============

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  role?: UserRole;
}

export interface LoginData {
  email: string;
  password: string;
}
