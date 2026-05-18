import { Router } from 'express';
import {
  getLeads,
  getLeadById,
  createLead,
  updateLead,
  deleteLead,
  exportLeadsCSV,
  getLeadStats,
} from '../controllers/leadController';
import { authenticate } from '../middleware/auth';
import { authorize } from '../middleware/rbac';
import { validate } from '../middleware/validate';
import { createLeadSchema, updateLeadSchema } from '../validators/leadValidator';
import { UserRole } from '../interfaces';

const router = Router();

// All routes require authentication
router.use(authenticate);

// GET /api/leads/export/csv - Export leads as CSV (must be before /:id)
router.get('/export/csv', exportLeadsCSV);

// GET /api/leads/stats/overview - Dashboard stats (must be before /:id)
router.get('/stats/overview', getLeadStats);

// GET /api/leads - List leads with filtering, search, sort, pagination
router.get('/', getLeads);

// GET /api/leads/:id - Get single lead
router.get('/:id', getLeadById);

// POST /api/leads - Create a new lead
router.post('/', validate(createLeadSchema), createLead);

// PUT /api/leads/:id - Update a lead
router.put('/:id', validate(updateLeadSchema), updateLead);

// DELETE /api/leads/:id - Delete a lead (admin can delete any, sales own only)
router.delete('/:id', deleteLead);

export default router;
