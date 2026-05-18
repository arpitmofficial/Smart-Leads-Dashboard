import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { register, login, getMe } from '../controllers/authController';
import { authenticate } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { registerSchema, loginSchema } from '../validators/authValidator';

const router = Router();

const loginLimiter = rateLimit({
	windowMs: 10 * 60 * 1000,
	max: 10,
	standardHeaders: true,
	legacyHeaders: false,
});

// POST /api/auth/register
router.post('/register', validate(registerSchema), register);

// POST /api/auth/login
router.post('/login', loginLimiter, validate(loginSchema), login);

// GET /api/auth/me
router.get('/me', authenticate, getMe);

export default router;
