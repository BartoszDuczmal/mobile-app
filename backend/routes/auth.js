import express from 'express';
import check from '../controllers/auth/check.js';
import login from '../controllers/auth/login.js';
import logout from '../controllers/auth/logout.js';
import recovery from '../controllers/auth/recovery.js';
import register from '../controllers/auth/register.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/recovery', recovery)
router.post('/logout', logout)
router.get('/check', check)

export default router;