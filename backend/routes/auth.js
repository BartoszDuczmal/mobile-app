import express from 'express';
import login from '../controllers/auth/login.js';
import recovery from '../controllers/auth/recovery.js';
import register from '../controllers/auth/register.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/recovery', recovery)

export default router;