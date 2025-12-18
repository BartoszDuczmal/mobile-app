import express from 'express';
import register from '../controllers/auth/register.js';

const router = express.Router();

router.post('/block', register);


export default router;