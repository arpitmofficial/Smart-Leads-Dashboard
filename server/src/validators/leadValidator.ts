import { z } from 'zod';
import { LeadStatus, LeadSource } from '../interfaces';

export const createLeadSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name cannot exceed 100 characters')
    .trim(),
  email: z
    .string()
    .email('Please provide a valid email')
    .trim()
    .toLowerCase(),
  status: z
    .nativeEnum(LeadStatus)
    .optional()
    .default(LeadStatus.NEW),
  source: z
    .nativeEnum(LeadSource, {
      errorMap: () => ({ message: 'Source must be Website, Instagram, or Referral' }),
    }),
});

export const updateLeadSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name cannot exceed 100 characters')
    .trim()
    .optional(),
  email: z
    .string()
    .email('Please provide a valid email')
    .trim()
    .toLowerCase()
    .optional(),
  status: z
    .nativeEnum(LeadStatus)
    .optional(),
  source: z
    .nativeEnum(LeadSource)
    .optional(),
});
