import express from 'express';
import rateLimit from 'express-rate-limit';
import check from '../controllers/auth/check.js';
import login from '../controllers/auth/login.js';
import logout from '../controllers/auth/logout.js';
import recovery from '../controllers/auth/recovery.js';
import register from '../controllers/auth/register.js';
import resetPass from '../controllers/auth/resetPass.js';

const router = express.Router();

const authLimiter = rateLimit({
    windowMs: 5 * 60 * 1000,
    limit: 5, 
    message: { error: 'common.toManyAttempts5' },
    standardHeaders: true,
    legacyHeaders: false,
});
const recoveryLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 5,
    message: { error: 'common.toManyAttempts15' },
    standardHeaders: true,
    legacyHeaders: false,
});

router.post('/register', authLimiter, register);
router.post('/login', authLimiter, login);
router.post('/recovery', recoveryLimiter, recovery)
router.post('/logout', logout)
router.post('/resetPass', recoveryLimiter, resetPass)
router.get('/check', check)

export default router;