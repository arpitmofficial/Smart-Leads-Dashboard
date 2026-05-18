import { z } from 'zod';
import { UserRole } from '../interfaces';

export const registerSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name cannot exceed 50 characters')
    .trim(),
  email: z
    .string()
    .email('Please provide a valid email')
    .trim()
    .toLowerCase(),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters')
    .max(128, 'Password cannot exceed 128 characters'),
  role: z
    .nativeEnum(UserRole)
    .optional()
    .default(UserRole.SALES),
});

export const loginSchema = z.object({
  email: z
    .string()
    .email('Please provide a valid email')
    .trim()
    .toLowerCase(),
  password: z
    .string()
    .min(1, 'Password is required'),
});
