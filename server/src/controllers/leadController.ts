import { Response, NextFunction } from 'express';
import { Parser } from '@json2csv/plainjs';
import { AuthRequest, LeadQueryParams, LeadStatus, LeadSource, UserRole } from '../interfaces';
import { Lead } from '../models/Lead';
import { ApiError } from '../utils/ApiError';
import { ApiResponse } from '../utils/ApiResponse';
import { FilterQuery } from 'mongoose';
import { ILeadDocument } from '../interfaces';

// Build filter query from request parameters
const buildFilterQuery = (
  query: LeadQueryParams,
  userId: string,
  userRole: UserRole
): FilterQuery<ILeadDocument> => {
  const filter: FilterQuery<ILeadDocument> = {};

  // Role-based filtering: Sales users only see their own leads
  if (userRole === UserRole.SALES) {
    filter.createdBy = userId;
  }

  // Status filter
  if (query.status && Object.values(LeadStatus).includes(query.status)) {
    filter.status = query.status;
  }

  // Source filter
  if (query.source && Object.values(LeadSource).includes(query.source)) {
    filter.source = query.source;
  }

  // Search by name or email (case-insensitive regex)
  if (query.search && query.search.trim()) {
    const searchRegex = new RegExp(query.search.trim(), 'i');
    filter.$or = [
      { name: searchRegex },
      { email: searchRegex },
    ];
  }

  return filter;
};

// GET /api/leads - Get all leads with filtering, search, sort, pagination
export const getLeads = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      throw ApiError.unauthorized();
    }

    const query = req.query as unknown as LeadQueryParams;
    const page = Math.max(1, parseInt(query.page || '1', 10));
    const limit = Math.min(100, Math.max(1, parseInt(query.limit || '10', 10)));
    const skip = (page - 1) * limit;

    // Build filter
    const filter = buildFilterQuery(query, req.user.id, req.user.role);

    // Sort order
    const sortOrder = query.sortBy === 'oldest' ? 1 : -1;

    // Execute queries in parallel for performance
    const [leads, totalRecords] = await Promise.all([
      Lead.find(filter)
        .populate('createdBy', 'name email')
        .populate('assignedTo', 'name email')
        .sort({ createdAt: sortOrder })
        .skip(skip)
        .limit(limit)
        .lean(),
      Lead.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(totalRecords / limit);

    ApiResponse.success(
      res,
      leads,
      'Leads fetched successfully',
      200,
      {
        currentPage: page,
        totalPages,
        totalRecords,
        limit,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      }
    );
  } catch (error) {
    next(error);
  }
};

// GET /api/leads/:id - Get single lead
export const getLeadById = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      throw ApiError.unauthorized();
    }

    const lead = await Lead.findById(req.params.id)
      .populate('createdBy', 'name email')
      .populate('assignedTo', 'name email');

    if (!lead) {
      throw ApiError.notFound('Lead not found');
    }

    // Sales users can only view their own leads
    if (
      req.user.role === UserRole.SALES &&
      lead.createdBy._id.toString() !== req.user.id
    ) {
      throw ApiError.forbidden('You can only view your own leads');
    }

    ApiResponse.success(res, lead, 'Lead fetched successfully');
  } catch (error) {
    next(error);
  }
};

// POST /api/leads - Create a new lead
export const createLead = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      throw ApiError.unauthorized();
    }

    const { name, email, status, source } = req.body;

    const lead = await Lead.create({
      name,
      email,
      status: status || LeadStatus.NEW,
      source,
      createdBy: req.user.id,
    });

    const populatedLead = await Lead.findById(lead._id)
      .populate('createdBy', 'name email');

    ApiResponse.created(res, populatedLead, 'Lead created successfully');
  } catch (error) {
    next(error);
  }
};

// PUT /api/leads/:id - Update a lead
export const updateLead = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      throw ApiError.unauthorized();
    }

    const lead = await Lead.findById(req.params.id);

    if (!lead) {
      throw ApiError.notFound('Lead not found');
    }

    // Sales users can only update their own leads
    if (
      req.user.role === UserRole.SALES &&
      lead.createdBy.toString() !== req.user.id
    ) {
      throw ApiError.forbidden('You can only update your own leads');
    }

    const updatedLead = await Lead.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    )
      .populate('createdBy', 'name email')
      .populate('assignedTo', 'name email');

    ApiResponse.success(res, updatedLead, 'Lead updated successfully');
  } catch (error) {
    next(error);
  }
};

// DELETE /api/leads/:id - Delete a lead
export const deleteLead = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      throw ApiError.unauthorized();
    }

    const lead = await Lead.findById(req.params.id);

    if (!lead) {
      throw ApiError.notFound('Lead not found');
    }

    // Only admins can delete leads, or sales users can delete their own
    if (
      req.user.role === UserRole.SALES &&
      lead.createdBy.toString() !== req.user.id
    ) {
      throw ApiError.forbidden('You can only delete your own leads');
    }

    await Lead.findByIdAndDelete(req.params.id);

    ApiResponse.success(res, null, 'Lead deleted successfully');
  } catch (error) {
    next(error);
  }
};

// GET /api/leads/export/csv - Export leads as CSV
export const exportLeadsCSV = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      throw ApiError.unauthorized();
    }

    const query = req.query as unknown as LeadQueryParams;
    const filter = buildFilterQuery(query, req.user.id, req.user.role);

    const leads = await Lead.find(filter)
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 })
      .lean();

    const csvData = leads.map((lead) => ({
      Name: lead.name,
      Email: lead.email,
      Status: lead.status,
      Source: lead.source,
      'Created By': (lead.createdBy as unknown as { name: string })?.name || 'N/A',
      'Created At': new Date(lead.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
    }));

    const parser = new Parser({
      fields: ['Name', 'Email', 'Status', 'Source', 'Created By', 'Created At'],
    });
    const csv = parser.parse(csvData);

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=leads-${Date.now()}.csv`);
    res.status(200).send(csv);
  } catch (error) {
    next(error);
  }
};

// GET /api/leads/stats/overview - Get lead stats for dashboard
export const getLeadStats = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      throw ApiError.unauthorized();
    }

    const baseFilter: FilterQuery<ILeadDocument> = {};
    if (req.user.role === UserRole.SALES) {
      baseFilter.createdBy = req.user.id;
    }

    const [total, statusStats, sourceStats, recentLeads] = await Promise.all([
      Lead.countDocuments(baseFilter),
      Lead.aggregate([
        { $match: baseFilter },
        { $group: { _id: '$status', count: { $sum: 1 } } },
      ]),
      Lead.aggregate([
        { $match: baseFilter },
        { $group: { _id: '$source', count: { $sum: 1 } } },
      ]),
      Lead.find(baseFilter)
        .populate('createdBy', 'name email')
        .sort({ createdAt: -1 })
        .limit(5)
        .lean(),
    ]);

    const statusMap: Record<string, number> = {};
    statusStats.forEach((s) => {
      statusMap[s._id] = s.count;
    });

    const sourceMap: Record<string, number> = {};
    sourceStats.forEach((s) => {
      sourceMap[s._id] = s.count;
    });

    ApiResponse.success(res, {
      total,
      byStatus: {
        new: statusMap['New'] || 0,
        contacted: statusMap['Contacted'] || 0,
        qualified: statusMap['Qualified'] || 0,
        lost: statusMap['Lost'] || 0,
      },
      bySource: {
        website: sourceMap['Website'] || 0,
        instagram: sourceMap['Instagram'] || 0,
        referral: sourceMap['Referral'] || 0,
      },
      recentLeads,
    }, 'Lead statistics fetched successfully');
  } catch (error) {
    next(error);
  }
};
